Đây là project thuộc về bộ môn GR1 2024.2
Sinh viên thực hiện: Đỗ Trung Hiếu 20225623
``````````````````````````````````````````````````````````````````````````````````````````````````````````````````
Kit và các ngoại vi sử dụng : 
- ESP32 devkit v1 : Kit chính để xử lý 
- ESP8266 : Kit để giao tiếp với Relay và đọc dữ liệu Rfid 
- Sensor DHT11 : Lấy dữ liệu nhiệt độ và độ ẩm từ môi trường (sai số 2% - 4%)
- Sensor PIR HC-SR501 : Phát hiện chuyển động trong khu vực 
- Module RFID RC552 : Lấy và xác nhận dữ liệu các thẻ (hiện đang gán cho bật tắt relay cho từng thẻ) . Datasheet đi kèm : https://www.handsontec.com/dataspecs/RC522.pdf.
Các công cụ sử dụng trong dự án : 
- Arduino IDE 2.3.6
- Visual studio code 
``````````````````````````````````````````````````````````````````````````````````````````````````````````````````
Cách cài đặt cho các thành phần của hệ thống : 
1. Clone project về hệ thống rồi copy các thành phần tương ứng .
2. Cài đặt và cách để sử dụng project : 
2.1 Setup trên  Arduino IDE 2.3.6 :
- Tạo sketch mới trong Adruino ide, Copy nội dung file code esp32.ino, esp8266 vào sketch và sau đó tải các thư viện tương ứng
- Đổi tên và mật khẩu wifi tương ứng để có thể sử dụng với server
- Chọn Các Board và com port để nạp code cho esp32 và esp8266 

2.1 : Setup hệ thông web :
- Mở thư mục "tessst111" trong visualcode 
- Cài đặt Node.js sử sụng câu lệnh " NPM i " cho từng mục "backendd" và "Fontend"
- Cài đặt database : Tạo project trên MOogoseDB, Set up connection security, Choose a connection method, thay URL trong tệp DB.js trong thư mục DB ở "Backend/database/db.js"
- Đổi Ip esp32 vs esp8266 ở "backend\routes\routes.js" (ip lấy ở phần serial khi chạy trên Adruino ide"
- chạy Backend dùng câu lệnh "Npm start"
- Chạy Fronend dùng câu lệnh "npm run dev"


``````````````````````````````````````````````````````````````````````````````````````````````````````````````````
``````````````````````````````````````````````````````````````````````````````````````````````````````````````````



ENGLISH

Project Summary - GR1 2024.2
Student: Đỗ Trung Hiếu
Student ID: 20225623
Hardware and Peripherals Used:
``````````````````````````````````````````````````````````````````````````````````````````````````````````````````
ESP32 DevKit v1: Main microcontroller used for processing and communication with sensors.
ESP8266: Handles communication with the relay module and reads data from RFID tags.
DHT11 Sensor: Captures temperature and humidity from the environment (accuracy ±2%–4%).
PIR Motion Sensor (HC-SR501): Detects motion within a certain range.
RFID Module (RC522): Reads and validates RFID tags. Each tag is currently assigned to control relay switching (ON/OFF).
→ Datasheet: RC522 Datasheet PDF
Development Tools Used:
Arduino IDE v2.3.6
Visual Studio Code
``````````````````````````````````````````````````````````````````````````````````````````````````````````````````

System Installation Instructions:
1. Clone the project and copy the corresponding components into your system.
2. Setup Instructions:
2.1. Setup on Arduino IDE v2.3.6:
Create a new sketch in Arduino IDE.
Copy the contents from esp32.ino and esp8266.ino into their respective sketches.
Install the necessary libraries (as listed in the code or README).
Change the Wi-Fi SSID and password in the code to match your local network.
Select the appropriate board type (ESP32 or ESP8266) and COM port for uploading the firmware.
2.2. Setup the Web System:
Open the "tessst111" project folder in Visual Studio Code.
Make sure Node.js is installed. Run npm i in both backendd and Fontend directories to install dependencies.
Set up MongoDB:
Create a new project on MongoDB Atlas.
Configure connection security, select connection method.
Update the MongoDB URL in Backend/database/db.js.
Configure IP addresses:
Replace the IP addresses of ESP32 and ESP8266 in backend/routes/routes.js.
These IPs can be found in the Serial Monitor when uploading code via Arduino IDE.
Start the backend:
Run npm start inside the backendd directory.
Start the frontend:
Run npm run dev inside the Fontend directory.
``````````````````````````````````````````````````````````````````````````````````````````````````````````````````

