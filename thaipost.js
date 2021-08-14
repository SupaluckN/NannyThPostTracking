// 1. import NPM Package

const axios = require("axios").default;

// 2. Thai Post API Token

const token = "   AzMnLVVYB.QpXgSnOcA7T;KpM*QkRnVwYyErQAFjCrMvW&ICPnQQI;V%EaZaL+VnGdUSV:ZlKUF#WhW_DqIJR%TFEwL#XJI6WhGV";

class ThaiPost {
  
    // ฟังชั่นสำหรับ ขอ auth token (ใช่ครับเราต้องขออีก) เราต้องขอ auth token ทุกครั้งเพื่อใช้ในการยิง request โดยใช้ API Token ครับ
  
    async getToken() {
        let result = null;
        await axios({
            url: "https://trackapi.thailandpost.co.th/post/api/v1/authenticate/token",
            method: "POST",
            headers: {
                "Authorization": "Token " + token
            }
        }).then((response) => {
            result = response.data
        }).catch((error) => console.error(error));
        return result;
    }
  
    // ฟังชั่นสำหรับ ยิง request เพื่อขอสถานะปัจจุบันของพัสดุ
  
    async getItems(barcode) {
        let result = null;
        const authToken = await this.getToken();
        console.log(authToken)
        const params = {
            status: "all",
            language: "TH",
            barcode: [barcode]
        }
        await axios({
            url: "https://trackapi.thailandpost.co.th/post/api/v1/track",
            method: "POST",
            headers: {
                "Authorization": "Token " + authToken.token
            },
            data: params
        }).then((response) => {
            result = response.data
        }).catch((error) => console.error(error));
        return result
    }
}

// 3. export เพื่อให้เราสามารถเรียนใช้ฟังชั่นในคลาส ThaiPost ได้จากไฟล์อื่นครับ

module.exports = new ThaiPost();