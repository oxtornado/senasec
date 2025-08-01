from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import requests
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "yi4Dn_MR-Xx-xNaMCRli9XOIgWl8KnZP"
API_SECRET = "tyxWMjsNMPKpycsFuu-BkJU-aJj-9ja7"
FACE_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect"
FACE_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare"

# Optional logger
logging.basicConfig(level=logging.INFO)

@app.post("/compare-face/")
async def compare_face(
    registered_token: str = Form(...),
    temporal_token: str = Form(...)
):
    if not registered_token or not temporal_token:
        return {"match": False, "detail": "Missing tokens"}

    payload = {
        "api_key": API_KEY,
        "api_secret": API_SECRET,
        "face_token1": registered_token,
        "face_token2": temporal_token
    }

    try:
        response = requests.post(FACE_COMPARE_URL, data=payload)
        result = response.json()
    except Exception as e:
        logging.error("Error al comparar rostros: %s", str(e))
        return {"match": False, "detail": "Face++ error", "error": str(e)}

    if response.status_code != 200 or "confidence" not in result:
        return {
            "match": False,
            "detail": "Face++ comparison failed",
            "error": result
        }

    confidence = result["confidence"]
    threshold = result.get("thresholds", {}).get("1e-3", 80.0)  # fallback si no viene

    return {
        "match": confidence >= threshold,
        "confidence": confidence,
        "threshold": threshold,
        "detail": "Match successful" if confidence >= threshold else "Match failed"
    }


@app.post("/register-face/")
async def register_face(images: List[UploadFile] = File(...)):
    best_token = None

    for image in images:
        try:
            contents = await image.read()
            logging.info(f"Foto recibida: {image.filename}, tamaño: {len(contents)} bytes")
            image.file.seek(0)

            files = {"image_file": (image.filename, image.file, image.content_type)}
            data = {"api_key": API_KEY, "api_secret": API_SECRET}
            response = requests.post(FACE_DETECT_URL, files=files, data=data)
            result = response.json()

            if result.get("faces"):
                best_token = result["faces"][0]["face_token"]
                break  # Tomamos el primer rostro válido
        except Exception as e:
            logging.error("Error procesando imagen: %s", str(e))

    if best_token:
        return {"face_token": best_token}
    else:
        return {"error": "No se detectó ningún rostro válido"}
