from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import Response
import time
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware #evitar problemas de CORS
from typing import List
import requests
#--------------------------------(se remplazara una vez se vincule la bd)
import json # para guardar los datos localmente 
import os
command_timestamps = {}
webhook_clients = set()

app = FastAPI()

pending_commands = {}

device_ips = {
    "esp_door_01": None  # Inicialmente desconocida
}

origin = [ 
    "https://sb1-jrlgmdcl-1.vercel.app" 
]
# aplicando la configuracion de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# credenciales necesarias para manipular face++
API_KEY = "yi4Dn_MR-Xx-xNaMCRli9XOIgWl8KnZP"
API_SECRET = "tyxWMjsNMPKpycsFuu-BkJU-aJj-9ja7"
FACE_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect" # endpoint de face ++ para dectar un rostro 
FACE_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare" # endpoint de face ++ para comparar un rostro


# Mandar datos a Django
def enviar_a_django(data: dict):
    try:
        response = requests.post("https://backend-senasec-usyv.onrender.com/usuarios/", json=data)
        if response.status_code == 201:
            print("Datos guardados correctamente en Django.")
        else:
            print("Error al guardar en Django:", response.status_code, response.text)
    except Exception as e:
        print("Error de conexión con Django:", e)


# Guardar usuario en JSON temporal
def save_users(data: dict):
    path = "usuarios_face.json"
    
    if os.path.exists(path):
        with open(path, "r") as f:
            usuarios = json.load(f)
    else:
        usuarios = {}

    email = data["email"]
    usuarios[email] = {
        "username": data["username"],
        "email": email,
        "rol": data["rol"],
        "telefono": data["telefono"],
        "password": data["password"],  # ⚠️ actualmente no hasheada
        "face_token": data["face_token"]
    }

    with open(path, "w") as f:
        json.dump(usuarios, f, indent=4)


# Obtener face_token por password desde JSON
def get_face_token_by_password(password: str) -> str:
    path = "usuarios_face.json"
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        usuarios = json.load(f)
    for usuario in usuarios.values():
        if usuario["password"] == password:
            return usuario["face_token"]
    return None


# Obtener face_token desde Django por password
def get_face_token_from_django_by_password(password: str) -> str:
    url = f"https://backend-senasec-usyv.onrender.com/api/get-face-token-by-password/?password={password}"    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get("face_token")  # Evita KeyError
    return None
@app.websocket("/ws/door")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    webhook_clients.add(websocket)
    try:
        while True:
            # Mantener conexión abierta
            await websocket.receive_text()
    except WebSocketDisconnect:
        webhook_clients.remove(websocket)

# Función para notificar a todos los clientes WebSocket
async def notify_door_activation(command: str):
    disconnected_clients = set()
    for client in webhook_clients:
        try:
            await client.send_text(command)
        except:
            disconnected_clients.add(client)
    
    # Limpiar clientes desconectados
    for client in disconnected_clients:
            webhook_clients.remove(client)
@app.post("/login-face/")
async def login_face(password: str = Form(...), image: UploadFile = File(...)):
    print("🎯 ===========================================")
    print("🎯 LOGIN-FACE - INICIANDO RECONOCIMIENTO")
    print("🎯 ===========================================")
    
    try:
        # 1. Obtener face_token desde Django
        stored_token = get_face_token_from_django_by_password(password)
        print(f"📋 Face token almacenado: {stored_token}")

        if not stored_token:
            raise HTTPException(status_code=404, detail="Usuario no encontrado o sin face_token.")

        # 2. Leer y procesar imagen
        contents = await image.read()
        await image.seek(0)
        
        files = {"image_file": (image.filename, contents, image.content_type)}
        data = {"api_key": API_KEY, "api_secret": API_SECRET}

        # 3. Detectar rostro en imagen actual
        print("🔍 Detectando rostro en imagen de login...")
        detect_resp = requests.post(FACE_DETECT_URL, files=files, data=data)
        detect_data = detect_resp.json()
        print(f"📊 Respuesta detección: {detect_data}")

        if not detect_data.get("faces"):
            raise HTTPException(status_code=400, detail="No se detectó ningún rostro en la imagen.")

        login_face_token = detect_data["faces"][0]["face_token"]
        print(f"🎭 Face token de login: {login_face_token}")

        # 4. Comparar rostros
        print("🔎 Comparando rostros...")
        compare_data = {
            "api_key": API_KEY,
            "api_secret": API_SECRET,
            "face_token1": stored_token,
            "face_token2": login_face_token
        }
        compare_resp = requests.post(FACE_COMPARE_URL, data=compare_data)
        compare_result = compare_resp.json()
        print(f"📈 Resultado comparación COMPLETO: {compare_result}")

        confidence = compare_result.get("confidence", 0)
        thresholds = compare_result.get("thresholds", {})
        
        print(f"🎯 CONFIANZA: {confidence}")
        print(f"📏 UMBRALES: {thresholds}")

        if confidence > 50:
            pending_commands["esp_door_01"] = "success"
            command_timestamps["esp_door_01"] = time.time()  # 🔥 Guardar timestamp
            pending_commands["esp_door_01"] = "success"
            
            # 🔥 NUEVO: Notificar via WebSocket
            await notify_door_activation("success")
            
            return {
                "message": "Inicio de sesión facial exitoso",
                "confidence": confidence,
                "face_token": stored_token
            }
        else:
            pending_commands["esp_door_01"] = "failed"
            
            # 🔥 NUEVO: Notificar via WebSocket
            await notify_door_activation("failed")
            
            raise HTTPException(
                status_code=401,
                detail={"error": "Rostro no coincide", "confidence": confidence}
            )

            
    except Exception as e:
        print(f"💥 ERROR: {str(e)}")
        raise

# Endpoint alternativo para activación directa
@app.post("/activate-door")
async def activate_door(command: str = "success"):
    """Activar puerta directamente (para webhooks)"""
    pending_commands["esp_door_01"] = command
    
    # También notificar via WebSocket
    await notify_door_activation(command)
    
    return {
        "message": f"Comando {command} enviado a la puerta",
        "pending_commands": pending_commands
    }

@app.post("/test-multipart")
async def test_multipart(password: str = Form(...), image: UploadFile = File(...)):
    """Endpoint simple para probar multipart"""
    return {
        "status": "multipart funciona",
        "password_received": password,
        "image_received": image.filename
    }
    
# Agregar esto ANTES de tus otros endpoints
@app.get("/debug-endpoints")
async def debug_endpoints():
    """Verificar qué endpoints están realmente registrados"""
    routes = []
    for route in app.routes:
        routes.append({
            "path": getattr(route, "path", "N/A"),
            "methods": getattr(route, "methods", "N/A"),
            "name": getattr(route, "name", "N/A")
        })
    return {"routes": routes}

@app.post("/test-login-face")
async def test_login_face():
    """Endpoint simple para testear"""
    return {"message": "test-login-face funciona"}

# Registro facial con email 
@app.post("/register-face/")
async def register_face(
    username: str = Form(...),
    documento: str = Form(...),
    email: str = Form(...),
    rol: str = Form(...),
    telefono: str = Form(...),
    password: str = Form(...),
    images: List[UploadFile] = File(...)
):
    face_tokens = []

    for i, image in enumerate(images):
        contents = await image.read()
        print(f"📸 Procesando imagen {i+1}: {image.filename}")
        image.file.seek(0)  
        
        files = {"image_file": (image.filename, image.file, image.content_type)}
        data = {"api_key": API_KEY, "api_secret": API_SECRET}
        response = requests.post(FACE_DETECT_URL, files=files, data=data)
        result = response.json()

        if result.get("faces"):
            face_token = result["faces"][0]["face_token"]
            face_tokens.append(face_token)
            print(f"✅ Face token {i+1}: {face_token}")

    if face_tokens:
        best_token = face_tokens[0]
        print(f"🎯 Usando face token principal: {best_token}")
        print(f"📊 Total de rostros detectados: {len(face_tokens)}")
        
        data_usuario = {
            "username": username,
            "documento": documento,
            "email": email,
            "rol": rol,
            "telefono": telefono,
            "password": password,
            "face_token": best_token
        }
        enviar_a_django(data_usuario)
        save_users(data_usuario)
        return {
            "message": "Registro facial exitoso", 
            "face_token": best_token,
            "total_faces_detected": len(face_tokens)
        }
    else:
        return {"error": "No se detectó ningún rostro válido en ninguna imagen"}

@app.post("/update-face/")
async def update_face(
    email: str = Form(...),
    images: List[UploadFile] = File(...)
):
    best_token = None
    best_confidence = 0

    for image in images:
        contents = await image.read()
        print(f"[ACTUALIZAR] Foto recibida: {image.filename}, tamaño: {len(contents)} bytes")
        image.file.seek(0)  # reiniciar el puntero del archivo

        files = {"image_file": (image.filename, image.file, image.content_type)}
        data = {"api_key": API_KEY, "api_secret": API_SECRET}
        response = requests.post(FACE_DETECT_URL, files=files, data=data)
        result = response.json()

        if result.get("faces"):
            face_token = result["faces"][0]["face_token"]
            best_token = face_token
            break

    if best_token:
        # Enviar solo el face_token actualizado a Django
        try:
            response = requests.patch(
                f"https://backend-senasec-usyv.onrender.com/update-face-token/",
                json={"email": email, "face_token": best_token}
            )
            if response.status_code == 200:
                return {"message": "Face token actualizado correctamente", "face_token": best_token}
            else:
                raise HTTPException(status_code=500, detail="Error al actualizar en Django")
        except Exception as e:
            print("Error conectando con Django:", e)
            raise HTTPException(status_code=500, detail="Error de conexión con Django")
    else:
        raise HTTPException(status_code=400, detail="No se detectó ningún rostro válido")


# Nuevo endpoint para recibir IPs del ESP8266
@app.post("/update-ip")
async def update_ip(data: dict):
    device_id = data.get("device_id")
    ip_address = data.get("ip_address")
    
    if device_id and ip_address:
        device_ips[device_id] = ip_address
        print(f"✅ IP actualizada para {device_id}: {ip_address}")
        print(f"📋 Estado actual de IPs: {device_ips}")
        return {"message": "IP actualizada correctamente", "device_id": device_id, "ip": ip_address}
    else:
        raise HTTPException(status_code=400, detail="Datos incompletos")

# Endpoint temporal para testing
@app.post("/test-command")
async def test_command(command: str = "success"):
    pending_commands["esp_door_01"] = command
    print(f"🧪 Comando de prueba establecido: '{command}'")
    return {
        "message": f"Comando '{command}' establecido para el próximo poll",
        "pending_commands": pending_commands
    }

@app.get("/debug-commands")
async def debug_commands():
    return {
        "pending_commands": pending_commands,
        "device_status": "esp_door_01" in device_ips,
        "device_ip": device_ips.get("esp_door_01")
    }

# Endpoint para verificar el estado del dispositivo (útil para debugging)
@app.get("/device-status")
async def get_device_status():
    ip = device_ips.get("esp_door_01")
    has_command = pending_commands.get("esp_door_01") is not None
    return {
        "device_id": "esp_door_01",
        "ip_address": ip,
        "status": "online" if ip else "offline",
        "pending_command": pending_commands.get("esp_door_01"),
        "has_pending_command": has_command
    }
# Función para enviar comando a la puerta
def send_to_door(endpoint):
    ip = device_ips.get("esp_door_01")
    if not ip:
        print("❌ IP del dispositivo desconocida")
        return False
    
    try:
        url = f"http://{ip}/{endpoint}"
        print(f"🔗 Enviando comando a: {url}")
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            print("✅ Comando enviado exitosamente")
            return True
        else:
            print(f"⚠️ Error en respuesta: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error conectando con el dispositivo: {e}")
        return False
    


# Endpoint para que el ESP8266 consulte comandos - VERSIÓN MEJORADA
@app.get("/check-command")
async def check_command():
    command = pending_commands.get("esp_door_01")
    
    print(f"🔍 Check-command consultado. Comando pendiente: {command}")
    
    if command:
        # ✅ NO limpiar inmediatamente - mantener por 10 segundos
        # El comando se limpia solo cuando se confirma la recepción
        return command
    else:
        # No hay comandos pendientes
        print("⏳ No hay comandos pendientes para ESP8266")
        return Response(status_code=204)
        
@app.get("/")
async def root():
    return {
        "message": "SenaSec API Online",
        "endpoints": [
            "/register-face/",
            "/update-face/", 
            "/login-face/",
            "/update-ip",
            "/check-command",
            "/device-status",
            "/test-command",
            "/debug-commands"
        ]
    }