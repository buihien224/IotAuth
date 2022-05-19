#include <SPI.h>
#include <MFRC522.h>
#include <FirebaseESP32.h>

// Setup FreeRTOS
#if CONFIG_FREERTOS_UNICORE
#define ARDUINO_RUNNING_CORE 0
#else
#define ARDUINO_RUNNING_CORE 1
#endif

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

//Run Firebase
FirebaseData fbdt;
FirebaseJson json;

//Call Sensor task
void sensor( void *pvParameters );

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

  // Conect to Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  //Setup Sensor Task
  mfrc522.PCD_Init();
  xTaskCreatePinnedToCore(
    sensor
    ,  "sensor"
    ,  16384  // Stack size
    ,  NULL
    ,  1  // Priority
    ,  NULL
    ,  ARDUINO_RUNNING_CORE);
}

void loop()
{
  if ( ! mfrc522.PICC_IsNewCardPresent())
    return;
  if ( ! mfrc522.PICC_ReadCardSerial())
    return;
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
  // Halt PICC
  mfrc522.PICC_HaltA();
  // Stop encryption on PCD
  mfrc522.PCD_StopCrypto1();
}



/*--------------------------------------------------*/
/*---------------------- Tasks ---------------------*/
/*--------------------------------------------------*/

void sensor(void *pvParameters)  // This is a task.
{
  int button;
  (void) pvParameters;
  for (;;) // A Task shall never return or exit.
  {
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
    }
    else {
      // turn LED off
      digitalWrite(ledPinFire, LOW);
    }
    
    if (touchValue < threshold) {
      // turn LED on
      digitalWrite(ledPin, HIGH);
    }
    else {
      // turn LED off
      digitalWrite(ledPin, LOW);
    }
    delay(100);
  }
}
