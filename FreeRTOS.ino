#include <SPI.h>
#include <MFRC522.h>
#include <FirebaseESP32.h>


//Set up temprature sensor
#ifdef __cplusplus
extern "C" {
#endif
uint8_t temprature_sens_read();
#ifdef __cplusplus
}
#endif
uint8_t temprature_sens_read();
float temper;

//Setup Firebase
#define FIREBASE_HOST "https://final-iot-d3c05-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "fEhZe5sFIisMKFGbkLGFlOE1RCM11XBFu3pX4DE4"

//Setup wifi
#define WIFI_SSID "hien_ne"
#define WIFI_PASSWORD "123456789"

//Setup RC522
#define SS_PIN    21
#define RST_PIN   22
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance.
MFRC522::MIFARE_Key key;
String card ;



//Setup Hall sensor
const int touchPin = 4;
const int ledPin = 16;
const int ledPinFire = 17;
const int threshold = 20;
int touchValue;
int button;
//Run Firebase
FirebaseData fbdt;
FirebaseJson json;

void setup() {
  Serial.begin(115200);
  // When wifi not connect , code will not run
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED)
    Serial.println("Connecting.... \n");
  Serial.println("Connected !");
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  while (!Serial);
  SPI.begin();
  pinMode (ledPin, OUTPUT);
  pinMode(ledPinFire, OUTPUT);

  // Conect to Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  //Setup Sensor Task
  mfrc522.PCD_Init();


}


void loop(){
    Firebase.getInt(fbdt, "/function/switch");
    int switch1 = fbdt.intData();
    if (switch1 == 1){
        digitalWrite(ledPin, LOW);
    if ( ! mfrc522.PICC_IsNewCardPresent()) {
      return;
    }
    else {
      if ( ! mfrc522.PICC_ReadCardSerial()) {
        return;
      }
      else {
        String content = "";
        for (byte i = 0; i < mfrc522.uid.size; i++)
        {
          content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
          content.concat(String(mfrc522.uid.uidByte[i], HEX));
        }
        content.toUpperCase();
        card = content.substring(1);
        Firebase.setString(fbdt, "/key_temp", card);
        Serial.println("Your Card Is : ");
        Serial.println(card);
        digitalWrite(ledPin, HIGH);
      }
    }
    }
    // read the state of the pushbutton value:
    touchValue = touchRead(touchPin);
    temper = (temprature_sens_read() - 32) / 1.8;
    Firebase.setString(fbdt, "/sensor/humi", touchValue);
    Firebase.setString(fbdt, "/sensor/temp", temper);
    Firebase.getInt(fbdt, "/button/led");
    button = fbdt.intData();
    if (button) {
      // turn LED on
      digitalWrite(ledPinFire, HIGH);
      Serial.println("button");
    }
    else {
      // turn LED off
      digitalWrite(ledPinFire, LOW);
      Serial.println("no button");
    }
    delay(10);


}



/*--------------------------------------------------*/
/*---------------------- Tasks ---------------------*/
/*--------------------------------------------------*/
