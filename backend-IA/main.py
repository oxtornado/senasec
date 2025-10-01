from fastapi import FastAPI, File, UploadFile, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware #evitar problemas de CORS
from typing import List
import requests
#--------------------------------(se remplazara una vez se vincule la bd)
import json # para guardar los datos localmente 
import os

app = FastAPI()

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
    best_token = None

    for image in images:
        contents = await image.read()
        print(f"Foto recibida: {image.filename}, tamaño: {len(contents)} bytes")
        image.file.seek(0)  
        
        files = {"image_file": (image.filename, image.file, image.content_type)}
        data = {"api_key": API_KEY, "api_secret": API_SECRET}
        response = requests.post(FACE_DETECT_URL, files=files, data=data)
        result = response.json()

        if result.get("faces"):
            face_token = result["faces"][0]["face_token"]
            best_token = face_token
            break  

    if best_token:
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
        return {"message": "Registro facial exitoso", "face_token": best_token}
    else:
        return {"error": "No se detectó ningún rostro válido"}

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


# Login facial con password
@app.post("/login-face/")
async def login_face(password: str = Form(...), image: UploadFile = File(...)):
    # 1. Obtener face_token desde Django
    stored_token = get_face_token_from_django_by_password(password)

    # 2. Si no lo encuentra en Django, intentar en JSON local (backup)
    # if not stored_token:
    #     stored_token = get_face_token_by_password(password)

    # 3. Validar existencia
    if not stored_token:
        raise HTTPException(status_code=404, detail="Usuario no encontrado o sin face_token.")

    # 4. Leer imagen recibida
    contents = await image.read()
    files = {"image_file": (image.filename, contents, image.content_type)}
    data = {"api_key": API_KEY, "api_secret": API_SECRET}

    # 5. Detectar rostro
    detect_resp = requests.post(FACE_DETECT_URL, files=files, data=data)
    detect_data = detect_resp.json()

    if not detect_data.get("faces"):
        raise HTTPException(status_code=400, detail="No se detectó ningún rostro en la imagen.")

    login_face_token = detect_data["faces"][0]["face_token"]

    # 6. Comparar con el token guardado
    compare_data = {
        "api_key": API_KEY,
        "api_secret": API_SECRET,
        "face_token1": stored_token,
        "face_token2": login_face_token
    }
    compare_resp = requests.post(FACE_COMPARE_URL, data=compare_data)
    compare_result = compare_resp.json()

    confidence = compare_result.get("confidence", 0)

    if confidence > 80:
        try:
            door_resp = requests.post("http://10.215.215.201/door/success", timeout=5)
            if door_resp.status_code != 200:
                print("⚠️ Error enviando señal a la puerta:", door_resp.text)
        except Exception as e:
            print("❌ Fallo conectando con la puerta:", e)

        return {
            "message": "Inicio de sesión facial exitoso",
            "confidence": confidence,
            "face_token": stored_token
        }
    else:
        raise HTTPException(
            status_code=401,
            detail={"error": "Rostro no coincide", "confidence": confidence}
        )
