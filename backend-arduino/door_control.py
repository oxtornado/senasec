from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import serial
import time
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SENASEC Door Control API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class DoorControlRequest(BaseModel):
    result: bool
    user_id: int = None
    username: str = None
    auth_method: str = None
    error: str = None
    timestamp: str = None

class DoorControlResponse(BaseModel):
    success: bool
    message: str
    door_action: str
    led_status: str
    timestamp: str

# Arduino connection settings
ARDUINO_PORT = "/dev/ttyUSB0"  # Change this to your Arduino port (e.g., "/dev/ttyUSB0" on Linux)
BAUD_RATE = 9600
TIMEOUT = 2

def get_arduino_connection():
    """Get Arduino serial connection"""
    try:
        arduino = serial.Serial(ARDUINO_PORT, BAUD_RATE, timeout=TIMEOUT)
        time.sleep(2)  # Wait for Arduino to initialize
        return arduino
    except serial.SerialException as e:
        logger.error(f"Failed to connect to Arduino: {e}")
        return None

def send_to_arduino(command: str):
    """Send command to Arduino"""
    arduino = get_arduino_connection()
    if not arduino:
        raise HTTPException(status_code=500, detail="Could not connect to Arduino")
    
    try:
        # Send command
        arduino.write(command.encode())
        time.sleep(0.5)
        
        # Read response
        response = arduino.readline().decode().strip()
        arduino.close()
        
        logger.info(f"Sent to Arduino: {command}, Response: {response}")
        return response
    except Exception as e:
        arduino.close()
        logger.error(f"Arduino communication error: {e}")
        raise HTTPException(status_code=500, detail=f"Arduino communication failed: {str(e)}")

@app.post("/door/control/", response_model=DoorControlResponse)
async def control_door(request: DoorControlRequest):
    """
    Control door based on authentication result
    - result: True = Open door + Green LED
    - result: False = Keep door closed + Red LED  
    """
    try:
        current_time = datetime.now().isoformat()
        
        if request.result:
            # SUCCESS: Open door and turn on green LED
            command = "OPEN\n"
            door_action = "opened"
            led_status = "green_on"
            message = f"Access granted for {request.username or 'unknown user'}"
            
            logger.info(f"🚪✅ Door opened for user: {request.username} (ID: {request.user_id})")
        else:
            # FAILURE: Keep door closed and turn on red LED
            command = "DENY\n"
            door_action = "remained_closed"
            led_status = "red_on"
            message = f"Access denied for {request.username or 'unknown user'}"
            
            if request.error:
                message += f" - Reason: {request.error}"
            
            logger.info(f"🚪❌ Access denied for user: {request.username} (ID: {request.user_id}) - {request.error}")
        2
        # Send command to Arduino
        arduino_response = send_to_arduino(command)
        
        # Log access attempt
        access_log = {
            "timestamp": current_time,
            "user_id": request.user_id,
            "username": request.username,
            "auth_method": request.auth_method,
            "result": request.result,
            "door_action": door_action,
            "led_status": led_status,
            "arduino_response": arduino_response,
            "error": request.error
        }
        
        # In a real app, save this to database
        logger.info(f"Access log: {json.dumps(access_log, indent=2)}")
        
        return DoorControlResponse(
            success=True,
            message=message,
            door_action=door_action,
            led_status=led_status,
            timestamp=current_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Door control error: {e}")
        raise HTTPException(status_code=500, detail=f"Door control failed: {str(e)}")

@app.get("/door/status/")
async def get_door_status():
    """Get current door status from Arduino"""
    try:
        response = send_to_arduino("STATUS\n")
        return {"status": response, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not get door status: {str(e)}")

@app.post("/door/reset/")
async def reset_door():
    """Reset door system (close door, turn off all LEDs)"""
    try:
        response = send_to_arduino("RESET\n")
        logger.info("🔄 Door system reset")
        return {
            "success": True,
            "message": "Door system reset successfully",
            "arduino_response": response,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("🚪 Starting SENASEC Door Control API...")
    print(f"📡 Arduino port: {ARDUINO_PORT}")
    uvicorn.run(app, host="0.0.0.0", port=8002)