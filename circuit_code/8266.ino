#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>


const char* ssid = "502A_vtv";
const char* password = "123456789";

#define RST_PIN    16  
#define SS_PIN     15  
#define RELAY_PIN   4  

MFRC522 rfid(SS_PIN, RST_PIN);
ESP8266WebServer server(80);
byte validUID[4] = {0x4A, 0xAF, 0xC8, 0x01};

// ========== HTTP HANDLE ==========
void handleRelay() {
  String body = server.arg("plain");

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, body);
  if (error) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  String relayName = doc["name"] | "";
  String relayStatus = doc["status"] | "OFF";

  Serial.printf("Relay Name: %s | Status: %s\n", relayName.c_str(), relayStatus.c_str());

  bool state = (relayStatus == "ON");
  if (relayName == "fan") {
    digitalWrite(RELAY_PIN, state ? HIGH : LOW);
    Serial.println(state ? "Bật quạt (HTTP)" : "Tắt quạt (HTTP)");
  }


  StaticJsonDocument<128> res;
  res["name"] = relayName;
  res["status"] = state ? "ON" : "OFF";
  String response;
  serializeJson(res, response);
  server.send(200, "application/json", response);
}


void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);


  WiFi.begin(ssid, password);
  Serial.print("Đang kết nối Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("IP ESP8266: ");
  Serial.println(WiFi.localIP());

  SPI.begin();
  rfid.PCD_Init();

  server.on("/relay", HTTP_POST, handleRelay);
  server.begin();

  Serial.println("Sẵn sàng. Đưa thẻ lại gần...");
}

void loop() {
  server.handleClient();

  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  Serial.print("UID: ");
  bool isValid = true;
  for (byte i = 0; i < rfid.uid.size; i++) {
    byte readByte = rfid.uid.uidByte[i];
    Serial.print(readByte < 0x10 ? "0" : "");
    Serial.print(readByte, HEX);
    Serial.print(" ");
    if (i < 4 && readByte != validUID[i]) isValid = false;
  }
  Serial.println();

  if (isValid) {
    Serial.println(" Thẻ hợp lệ → Bật quạt");
    digitalWrite(RELAY_PIN, HIGH);
    delay(5000);
    digitalWrite(RELAY_PIN, LOW);
    Serial.println(" Quạt dừng");
  } else {
    Serial.println("Thẻ không hợp lệ");
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
