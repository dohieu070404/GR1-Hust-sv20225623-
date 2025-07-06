#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define DHTTYPE DHT11
#define timeSeconds 2

const char* ssid = "502A_vtv";
const char* password = "123456789";

StaticJsonDocument<250> jsonDocument;
char buffer[250];

WebServer server(80);

// LED pins
const uint8_t LEDRedPin = 2;
const uint8_t LEDGreenPin = 4;
const uint8_t LEDBluePin = 5;

// Motion sensor
const uint8_t MotionLed = 15;
const uint8_t MotionSensor = 12;

// DHT sensor
const uint8_t DHTPin = 17;
DHT dht(DHTPin, DHTTYPE);
float Temperature, Humidity;

// LED state
bool LEDRed = LOW, LEDGreen = LOW, LEDBlue = LOW;
String LEDMode = "NORMAL", LEDName = "", LEDStatus = "OFF";

// Motion state
unsigned long now = 0, lastTrigger = 0;
bool startTimer = false, motion = false;
String motionStatus = "";

void IRAM_ATTR detectsMovement() {
  Serial.println("Interrupt triggered!");
  digitalWrite(MotionLed, HIGH);
  startTimer = true;
  lastTrigger = millis();
  motion = true; 
}
unsigned long previousMillisRed = 0;
unsigned long previousMillisGreen = 0;
unsigned long previousMillisBlue = 0;

bool stateRed = false;
bool stateGreen = false;
bool stateBlue = false;

const unsigned long blinkInterval = 500; 

void setup() {
  Serial.begin(115200);

  ledPinsInit();
  dhtPinsInit();
  motionPinsInit();
  initWiFi();
  routeSetup();

  // Tạo task riêng cho motion
  xTaskCreatePinnedToCore(runMotion, "runMotion",  2048, NULL, 1, NULL, 0);
}

void loop() {
  now = millis();
  server.handleClient();
  runLeds();
}

// ======= TASKS =======
// void runMotion(void* pvParameters) {
//   while (true) {
//     if (motionStatus  == "ON") {
//       if (digitalRead(MotionSensor) == HIGH && !motion) {
//         Serial.println("MOTION DETECTED!!!");
//         motion = true;
//         Serial.printf("[MOTION] Detected at %lu ms\n", millis());
//       }

//       if (startTimer && (millis() - lastTrigger > (timeSeconds * 1000))) {
//         Serial.println("Motion stopped...");
//         digitalWrite(MotionLed, LOW);
//         startTimer = false;
//         motion = false;
//         Serial.printf("[MOTION] Cleared at %lu ms\n", millis());
//       }
//     } else {
//       digitalWrite(MotionLed, LOW);
//       startTimer = false;
//       motion = false;
//     }

//     // Giải phóng CPU, tránh Watchdog reset
//     vTaskDelay(10 / portTICK_PERIOD_MS);
//   }
// }
void runMotion(void* pvParameters) {
  const unsigned long CHECK_INTERVAL = 50;  // quét mỗi 50ms (20 lần/giây)
  while (true) {
    if (motionStatus == "ON") {
      int motionDetected = digitalRead(MotionSensor);
      if (motionDetected == HIGH) {
        if (!motion) {
          Serial.println("bật đèn  ");
          Serial.printf("Phát hiện chuyển động lúc %lu ms\n", millis());
          motion = true;
        }
        lastTrigger = millis();
        digitalWrite(MotionLed, HIGH);  // bật đèn khi có chuyển động
      }

      // Nếu sau timeSeconds không thấy chuyển động thì tắt
      if (motion && (millis() - lastTrigger > timeSeconds * 1000)) {
        Serial.println("Không thấy chuyển động  ...");
        Serial.printf("ngưng chuyển động lúc  %lu ms\n", millis());
        digitalWrite(MotionLed, LOW);
        motion = false;
      }
    } else {
      digitalWrite(MotionLed, LOW);
      motion = false;
    }

    vTaskDelay(CHECK_INTERVAL / portTICK_PERIOD_MS);
  }
}


// ======= LOGIC =======
// Các biến toàn cục để kiểm soát trạng thái nhấp nháy
unsigned long previousMillis = 0;
bool blinkState = false;

void runLeds() {
  unsigned long currentMillis = millis();

  if (LEDMode == "NORMAL") {
    digitalWrite(LEDRedPin, LEDRed);
    digitalWrite(LEDGreenPin, LEDGreen);
    digitalWrite(LEDBluePin, LEDBlue);
  } 
  else if (LEDMode == "BLINK") {
    if (LEDRed && currentMillis - previousMillisRed >= blinkInterval) {
      previousMillisRed = currentMillis;
      stateRed = !stateRed;
      digitalWrite(LEDRedPin, stateRed);
    }

    if (LEDGreen && currentMillis - previousMillisGreen >= blinkInterval) {
      previousMillisGreen = currentMillis;
      stateGreen = !stateGreen;
      digitalWrite(LEDGreenPin, stateGreen);
    }

    if (LEDBlue && currentMillis - previousMillisBlue >= blinkInterval) {
      previousMillisBlue = currentMillis;
      stateBlue = !stateBlue;
      digitalWrite(LEDBluePin, stateBlue);
    }
  } 
  else {
    digitalWrite(LEDRedPin, LOW);
    digitalWrite(LEDGreenPin, LOW);
    digitalWrite(LEDBluePin, LOW);
  }
}

// ======= INIT =======
void ledPinsInit() {
  pinMode(LEDRedPin, OUTPUT);
  pinMode(LEDGreenPin, OUTPUT);
  pinMode(LEDBluePin, OUTPUT);
}

void motionPinsInit() {
  pinMode(MotionSensor, INPUT_PULLUP);
  pinMode(MotionLed, OUTPUT);
  digitalWrite(MotionLed, LOW);
  // attachInterrupt(digitalPinToInterrupt(MotionSensor), detectsMovement, RISING);
}

void dhtPinsInit() {
  pinMode(DHTPin, INPUT);
  dht.begin();
}

void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(500);
  }
  Serial.println("\nWiFi connected, IP: " + WiFi.localIP().toString());
}

// ======= ROUTES =======
void routeSetup() {
  server.on("/", handleOnConnect);
  server.on("/handleLED", HTTP_POST, handleLED);
  server.on("/handleDHT", handleDHT);
  server.on("/handleMotion", HTTP_POST, handleMotion);
  server.begin();
  Serial.println("HTTP server started");
}

// ======= HANDLERS =======
void handleOnConnect() {
  create_json();
  server.send(200, "application/json", buffer);
}

void handleMotion() {
  String body = server.arg("plain");
  deserializeJson(jsonDocument, body);
  motionStatus = jsonDocument["status"] | "OFF";
  Serial.printf("[HTTP] Motion control: %s\n", motionStatus.c_str()); 
  
  create_json();
  server.send(200, "application/json", buffer);
}

void handleLED() {
  String body = server.arg("plain");
  deserializeJson(jsonDocument, body);
  LEDMode = jsonDocument["mode"] | "NORMAL";
  LEDName = jsonDocument["name"] | "";
  LEDStatus = jsonDocument["status"] | "OFF";

  Serial.printf("LED Mode: %s | Name: %s | Status: %s\n", LEDMode.c_str(), LEDName.c_str(), LEDStatus.c_str());

  bool state = (LEDStatus == "ON");
  if (LEDName == "red") LEDRed = state;
  else if (LEDName == "green") LEDGreen = state;
  else if (LEDName == "blue") LEDBlue = state;
  else if (LEDName == "all") {
    LEDRed = state;
    LEDGreen = state;
    LEDBlue = state;
  }

  create_json();
  server.send(200, "application/json", buffer);
}

void handleDHT() {
  Temperature = dht.readTemperature();
  Humidity = dht.readHumidity();
  Serial.printf("Temperature: %.2f°C | Humidity: %.2f%%\n", Temperature, Humidity);
  create_dht_json();
  server.send(200, "application/json", buffer);
}

// ======= JSON BUILDERS =======
void create_json() {
  jsonDocument.clear();
  jsonDocument["success"] = true;
  serializeJson(jsonDocument, buffer);
}

void create_dht_json() {
  jsonDocument.clear();
  jsonDocument["success"] = true;
  jsonDocument["temperature"] = Temperature;
  jsonDocument["humidity"] = Humidity;
  serializeJson(jsonDocument, buffer);
}
