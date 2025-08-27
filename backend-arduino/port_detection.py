import serial.tools.list_ports
import platform
import sys

def find_arduino_ports():
    """Find all available serial ports that might be Arduino"""
    print("🔍 Searching for Arduino ports...")
    print(f"OS: {platform.system()}")
    print("-" * 50)
    
    ports = serial.tools.list_ports.comports()
    arduino_ports = []
    
    if not ports:
        print("❌ No serial ports found!")
        return []
    
    print("📡 Available serial ports:")
    for i, port in enumerate(ports):
        print(f"{i+1}. Port: {port.device}")
        print(f"   Description: {port.description}")
        print(f"   Hardware ID: {port.hwid}")
        
        # Check if it looks like Arduino
        is_arduino = any(keyword in str(port.description).lower() or 
                        keyword in str(port.hwid).lower() 
                        for keyword in ['arduino', 'ch340', 'cp210', 'ftdi', 'usb serial'])
        
        if is_arduino:
            arduino_ports.append(port.device)
            print(f"   ✅ Likely Arduino port!")
        else:
            print(f"   ❓ Unknown device")
        print()
    
    return arduino_ports

def test_arduino_connection(port):
    """Test connection to Arduino on specific port"""
    try:
        print(f"🔌 Testing connection to {port}...")
        arduino = serial.Serial(port, 9600, timeout=2)
        
        # Wait for Arduino to initialize
        import time
        time.sleep(2)
        
        # Try to send a test command
        arduino.write(b"STATUS\n")
        time.sleep(0.5)
        
        # Try to read response
        response = arduino.readline().decode().strip()
        arduino.close()
        
        if response:
            print(f"✅ Arduino responded: {response}")
            return True
        else:
            print(f"⚠️  Connected but no response from Arduino")
            return True  # Still might be Arduino, just not responding
            
    except serial.SerialException as e:
        print(f"❌ Connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🤖 SENASEC Arduino Port Finder")
    print("=" * 50)
    
    # Find potential Arduino ports
    arduino_ports = find_arduino_ports()
    
    if not arduino_ports:
        print("\n❌ No Arduino-like ports found!")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Arduino is connected via USB")
        print("2. Check if Arduino drivers are installed")
        print("3. Try a different USB cable")
        print("4. Check Device Manager (Windows) or dmesg (Linux)")
        return
    
    print(f"\n🎯 Found {len(arduino_ports)} potential Arduino port(s):")
    for port in arduino_ports:
        print(f"   📍 {port}")
    
    print("\n🧪 Testing connections...")
    working_ports = []
    
    for port in arduino_ports:
        if test_arduino_connection(port):
            working_ports.append(port)
    
    print("\n" + "=" * 50)
    if working_ports:
        print(f"✅ Working Arduino port(s): {working_ports}")
        print(f"\n🔧 Update your door_control_api.py:")
        print(f'ARDUINO_PORT = "{working_ports[0]}"')
    else:
        print("❌ No working Arduino connections found!")
        print("\n🔧 Try these steps:")
        print("1. Upload the Arduino code first")
        print("2. Open Arduino IDE Serial Monitor to test")
        print("3. Make sure baud rate is 9600")
        print("4. Check Arduino is not being used by another program")

if __name__ == "__main__":
    main()
