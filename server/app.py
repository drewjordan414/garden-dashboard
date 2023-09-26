# housekeeping, import 
from flask import Flask, Response, jsonify
import cv2
import board
import busio 
import adafruit_seesaw
import adafruit_sht4x
import adafruit_tsl2591
from flask_cors import CORS
import time 

# Initialize I2C sensors 
i2c = busio.I2C(board.SCL, board.SDA)
ss = adafruit_seesaw.Seesaw(i2c)
sht = adafruit_sht4x.SHT4x(i2c)
tsl = adafruit_tsl2591.TSL2591(i2c)

app = Flask(__name__)
CORS(app)  # Handling CORS for local development

def read_temp():
    """Read the temperature in Fahrenheit from the SHT40."""
    temp = sht.temperature * 1.8 + 32
    return round(temp, 2)

def read_humidity():
    """Read the humidity from the SHT40."""
    humidity =  sht.relative_humidity
    return round(humidity, 2)

def read_soil():
    """Read the soil moisture from the soil sensor."""
    return ss.moisture_read()

def read_light():
    """Read the light sensor value."""
    light = tsl.lux
    return round(light, 2)

@app.route('/api/sensor_data')
def sensor_data():
    """Provide sensor data as a JSON response."""
    data = {
        "temperature": read_temp(),
        "humidity": read_humidity(),
        "soil": read_soil(),
        "light": read_light()
    }
    return jsonify(data)

# def gen():
#     """Generate the video stream."""
#     cap = cv2.VideoCapture(0)
#     # setup the camera and the video feed 
#     cap = cv2.VideoCapture(0)
#     while True:
#         cap.set(cv2.CAP_PROP_FPS, 30)
#         ret, frame = cap.read()
#         if not ret:
#             print("Can't receive frame (stream end?). Exiting ...")
#             break 

    # while True:
    #     # set the frame rate to 30fps 
    #     cap.set(cv2.CAP_PROP_FPS, 30)
    #     ret, frame = cap.read()
    #     if not ret:
    #         print("Can't receive frame (stream end?). Exiting ...")
    #         break
        
    #     # Convert the frame to JPEG and return
    #     ret, jpeg = cv2.imencode('.jpg', frame)
    #     yield (b'--frame\r\n'
    #            b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')
def gen():
    """Generate the video stream."""
    cap = cv2.VideoCapture(0)
    
    # Reduce resolution for faster processing (e.g., set to 640x480)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    while True:
        start_time = time.time()

        ret, frame = cap.read()
        if not ret:
            print("Can't receive frame (stream end?). Exiting ...")
            break

        # Increase JPEG compression for smaller frame size, but be aware this might reduce quality
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]  
        ret, jpeg = cv2.imencode('.jpg', frame, encode_param)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

        # Use a fixed time delay to attempt a more consistent frame rate
        time.sleep(0.0333)

@app.route('/api/video_feed')
def video_feed():
    """Video streaming route."""
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
