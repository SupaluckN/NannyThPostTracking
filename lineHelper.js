// 1. ทำการ import ตัว npm package ที่เราพึ่งติดตั้งมาก่อน

const axios = require("axios").default;

// 2. วางในส่วนของ LINE Channel Access Token เเละ Channel Secret

const channelAccessToken = "+j00KgpqOUMce7Tps04APHUFJ/z6CPN2eAoJQ2b0BziwSlA/LpBZdnMFAdus8PveRiMES4phpXJKfgmjB0UDpGFD315R2F4auqMGldrXtvnn6Bu/Qqn1lcmzKHXa6kH7LP9CEN5YBW775zENarSd4AdB04t89/1O/w1cDnyilFU=",
const channelSecret = "3eb7c4e36ad12ef35aed368028bbba9b",

class lineHelper {
  
    // ฟังชั่น สำหรับตอบกลับผู้ใช้ โดยจะรับตัว replyToken เเละ payload มาครับ
  
    async reply(replyToken, payload) {
        const params = {
            replyToken: replyToken,
            messages: [payload]
        }
        await axios({
            url: "https://api.line.me/v2/bot/message/reply",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + channelAccessToken
            },
            data: params
        }).catch((error) => console.error(error))
    }
}

// 3. export เพื่อให้เราสามารถเรียนใช้ฟังชั่นในคลาส lineHelper ได้จากไฟล์อื่นครับ

module.exports = new lineHelper();