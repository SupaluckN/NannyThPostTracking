const line = require('@line/bot-sdk');
const express = require("express");
const axios = require("axios").default;

const thaiPost = require("./thaipost")
const msgTemplate = require("./msgTemplate")
const lineHelper = require("./lineHelper");

const config = {
    channelAccessToken: "+j00KgpqOUMce7Tps04APHUFJ/z6CPN2eAoJQ2b0BziwSlA/LpBZdnMFAdus8PveRiMES4phpXJKfgmjB0UDpGFD315R2F4auqMGldrXtvnn6Bu/Qqn1lcmzKHXa6kH7LP9CEN5YBW775zENarSd4AdB04t89/1O/w1cDnyilFU=",
    channelSecret: "3eb7c4e36ad12ef35aed368028bbba9b",
};

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

async function handleEvent(event) {
  
    // Destruct ตัว replyToken / message (ข้อความจากผู้ใช้) เเละ type (ประเภทของข้อความ) จาก event
  
    const { replyToken, message, type } = event;
  
  // ทำการตรวจสอบเงื่อนไขว่าข้อความที่ผู้ใช้ส่งเข้ามาเป็ยข้อความประเภท text
  
    if (type === "message" && message.type === "text") {
      
        // ดึงเอาข้อความ / หมายเลขติดตามพัสดุที่ผู้ใช้ส่งเข้ามาจาก message.text
      
        const barcode = message.text
        
        // ส่ง request เพื่อข้อสถานะปัจจุบันของพัสดุจาก Thai Post API
        
        const trackResult = await thaiPost.getItems(barcode)
        const items = trackResult["response"]["items"][barcode]
        let payload = null
        
        // ถ้าหมายเลขการติดตามผิด / ไม่พบสถานะการติดตาม ให้ตอบกลับผู้ใช้ว่าไม่พบหมายเลขพัสดุ
        
        if (items.length <= 0) {
            payload = msgTemplate.trackNotFound();
        } else { // ถ้าไม่ ให้ส่งสถานะพัสดุล่าสุดไปหาผู้ใช้
            let body = []
            items.forEach((row) => {
                body.push(msgTemplate.trackBody(row))
            })
            payload = msgTemplate.trackHeader(barcode, body);
        }
        
        // ตอบกลับข้อควาไปหาผู้ใช้โดยใช้ replyToken เเละส่งไปเป็น Flex Message
      
        await lineHelper.reply(replyToken, payload);
        console.log(payload)
    }
}

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Server are now started on port : " + port);
})