from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import random, smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, lock this down
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Temp in-memory storage
verification_store = {}

# Email credentials
SENDER_EMAIL = "zajudem.senasec@gmail.com"
SENDER_PASSWORD = "atmmyoasfgnzucjv"  # Use Gmail App Passwords


class EmailRequest(BaseModel):
    email: EmailStr


class VerifyRequest(BaseModel):
    email: EmailStr
    code: str


@app.post("/send-code")
def send_code(request: EmailRequest):
    code = str(random.randint(100000, 999999))
    verification_store[request.email] = {
        "code": code,
        "expires": datetime.utcnow() + timedelta(minutes=10),
    }

    # Send email
    try:
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = request.email
        msg["Subject"] = "Tu código de verificación - SENASEC"

        body = f"Tu código de verificación es: {code}. Expira en 10 minutos."
        msg.attach(MIMEText(body, "plain"))

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, request.email, msg.as_string())

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar email: {e}")

    return {"message": "Código enviado"}


@app.post("/verify-code")
def verify_code(request: VerifyRequest):
    print("Incoming verify:", request.email, request.code)  # DEBUG
    record = verification_store.get(request.email)
    print("Stored record:", record)  # DEBUG
    if not record:
        raise HTTPException(status_code=400, detail="No se encontró un código para este correo")

    if datetime.utcnow() > record["expires"]:
        raise HTTPException(status_code=400, detail="El código ha expirado")

    if request.code != record["code"]:
        raise HTTPException(status_code=400, detail="Código inválido")

    # On success, delete the code
    del verification_store[request.email]
    return {"message": "Código verificado con éxito"}
