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
