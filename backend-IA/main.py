from fastapi import FastAPI, File, UploadFile, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware #evitar problemas de CORS
from typing import List
import requests
#--------------------------------(se remplazara una vez se vincule la bd)
import json # para guardar los datos localmente 
import os

app = FastAPI()

# aplicando la configuracion de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# credenciales necesarias para manipular face++
API_KEY = "yi4Dn_MR-Xx-xNaMCRli9XOIgWl8KnZP"
API_SECRET = "tyxWMjsNMPKpycsFuu-BkJU-aJj-9ja7"
FACE_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect" # endpoint de face ++ para dectar un rostro 
FACE_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare" # endpoint de face ++ para comparar un rostro


# mandar los datos a django
def enviar_a_django(data: dict):
    try:
        response = requests.post("http://django:8001/users/usuarios/", json=data)
        if response.status_code == 201:
            print("Datos guardados correctamente en Django.")
        else:
            print("Error al guardar en Django:", response.status_code, response.text)
    except Exception as e:
        print("Error de conexión con Django:", e)

# funcion para guardar los usuarios en un archivo .JSON(se usara temporalmente)
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
        "password": data["password"],  # actualmente no hasheada 
        "face_token": data["face_token"]
    }

    with open(path, "w") as f:
        json.dump(usuarios, f, indent=4)

# Obtener token guardado por email
def get_face_token_by_email(email: str) -> str:
    path = "usuarios_face.json"
    if not os.path.exists(path):
        return None
    with open(path, "r") as f:
        usuarios = json.load(f)
    usuario = usuarios.get(email)
    return usuario["face_token"] if usuario else None

# Almacenamiento temporal de face_token por usuario
# ser_tokens = {}

# endpoint que registra a el usuario
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
    best_confidence = 0

    for image in images:

        contents = await image.read()
        print(f"Foto recibida: {image.filename}, tamaño: {len(contents)} bytes")
        image.file.seek(0)  # Volver al inicio para que Face++ lea el contenido
        
        files = {"image_file": (image.filename, image.file, image.content_type)}
        data = {"api_key": API_KEY, "api_secret": API_SECRET}
        response = requests.post(FACE_DETECT_URL, files=files, data=data)
        result = response.json()

        if result.get("faces"):
            face_token = result["faces"][0]["face_token"]
            # En esta etapa podrías usar más lógica para decidir "el mejor" rostro
            best_token = face_token
            break  # por ahora nos quedamos con el primero válido

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
        return {"message": "Registro facial exitoso", "face_token": best_token}
    else:
        return {"error": "No se detectó ningún rostro válido"}

def get_face_token_from_django(email: str) -> str:
    """ Hace GET al backend de Django para obtener el face_token """
    url = f"http://django:8001/api/get-face-token/?email={email}" 
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()["face_token"]
    return None


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
                f"http://django:8001/users/update-face-token/",
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


# endpoint que hace la comparacion e inicia sesion si(80%)
@app.post("/login-face/")
async def login_face(email: str = Form(...), image: UploadFile = File(...)):
    # Primero obtiene el face_token de Django
    stored_token = get_face_token_from_django(email)
    if not stored_token:
        raise HTTPException(404, "Usuario no encontrado o sin face_token.")

    # Después continúa con Face++
    contents = await image.read()
    files = {"image_file": (image.filename, contents, image.content_type)}
    data = {"api_key": API_KEY, "api_secret": API_SECRET}

    detect_resp = requests.post(FACE_DETECT_URL, files=files, data=data)
    detect_data = detect_resp.json()

    if not detect_data.get("faces"):
        raise HTTPException(400, "No se detectó ningún rostro en la imagen.")

    login_face_token = detect_data["faces"][0]["face_token"]

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
        return {"message": "Inicio de sesión facial exitoso", "confidence": confidence}
    else:
        return {"error": "Rostro no coincide", "confidence": confidence}