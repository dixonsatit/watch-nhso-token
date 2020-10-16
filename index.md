

Watch nhso token เป็น application ที่เอาไว้ตรวจสอบการเปลี่ยนแปลง token ของสปสช. เพื่อใช้ในการตรวจสอบสิทธิ์ต่างๆ กรณีที่นำ token ไปใช้ที่อื่นๆ เช่น ตู้ kiosk  ถ้ามีการเปลี่ยนแปลงก็จะ publish ข้อมูล token ออกไป ปลายทางที่อยากได้ข้อมูลก็แค่ subscribe topic ที่ตั้งไว้ก็จะได้ข้อมูล token ใหม่ทุกครั้งที่มีการเปลี่ยนแปลง


### การติดตั้ง

สามารถดาวน์โหลดและติดตั้งใช้งานได้ทันที ทั้ง MAC, WINDOWS (win8 ขึ้นไป) 
[Download](https://github.com/dixonsatit/watch-nhso-token/releases/tag/v1.0.0)

### การตั้งค่า
ตั้งค่า mqtt server ที่ต้องการเชื่อมต่อ แล้วไปที่ tab watch token กด start
![](https://user-images.githubusercontent.com/1027274/96217101-208f8400-0fac-11eb-980f-9eba03b9f4f5.png)
![](https://user-images.githubusercontent.com/1027274/96217111-238a7480-0fac-11eb-8dc0-c5473cfdbee4.png)

### การ subscribe เพื่อใช้ข้อมูล

การ subscribe สามารถทำได้ทุกๆ ภาษาที่มี lib MQTT Client ก็สามารถใช้ได้ ในที่นี้จะยกตัวอย่างเพียง JavaScript 


```
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
var topicName = 'xxx';
 
client.on('connect', function () {
  client.subscribe(topicName, functio(err) { })
})
 
client.on('message', function (topic, message) {
    if(topic === topicName){
         console.log(message.toString())
    }
 
  client.end()
})
```
