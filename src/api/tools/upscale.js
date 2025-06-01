import axios from "axios";
import FormData from "form-data";
/*
async function vyro(imageData, action) {
    try {
        let actions = ["enhance", "recolor", "dehaze"];
        if (!actions.includes(action)) action = "enhance";
        const url = `https://inferenceengine.vyro.ai/${action}`;
        const formData = new FormData();
        formData.append("model_version", "1");
        formData.append(
            "image",
            Buffer.from(imageData, "base64"),
            "enhance_image_body.jpg"
        );
        const response = await axios.post(url, formData, {
            headers: {
                ...formData.getHeaders(),
                "User-Agent": "okhttp/4.9.3"
            },
            responseType: "arraybuffer"
        });
        return {
            status: true,
            data: response.data.toString('base64')
        };
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}
*/

import WebSocket from "ws";
class PixnovaAI {
    constructor() {
        this.ws = null;
        this.sessionHash = this.generateHash();
        this.result = null;
    }
    async connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket("wss://pixnova.ai/upscale-img/queue/join", {
                headers: {
                    Upgrade: "websocket",
                    Origin: "https://pixnova.ai",
                    "Cache-Control": "no-cache",
                    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    Pragma: "no-cache",
                    Connection: "Upgrade",
                    "Sec-WebSocket-Version": "13",
                    "Sec-WebSocket-Key": "XDz5SyUSj7SCbIgw7tuInw==",
                    "Sec-WebSocket-Extensions":
                        "permessage-deflate; client_max_window_bits",
                    "User-Agent":
                        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
                }
            });
            this.ws.on("open", () => {
                console.log("[✅] WebSocket connected");
                this.ws.send(
                    JSON.stringify({
                        session_hash: this.sessionHash
                    })
                );
                resolve();
            });
            this.ws.on("message", data => this.handleMessage(data));
            this.ws.on("error", err => reject(err));
        });
    }

    async sendPayload(base64Image, customPayload = {}) {
        const defaultPayload = {
            scale: 2,
            request_from: 2
        };
        const finalPayload = {
            data: {
                source_image: base64Image,
                ...defaultPayload,
                ...customPayload
            }
        };
        this.ws.send(JSON.stringify(finalPayload));
    }
    handleMessage(data) {
        try {
            const parsedData = JSON.parse(data);
            console.log("[📩] WS Data:", parsedData);
            if (parsedData.msg === "process_completed" && parsedData.success) {
                this.result = parsedData.output.result[0];
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    }
    async waitForCompletion() {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (this.result) {
                    clearInterval(checkInterval);
                    this.ws.close();
                    resolve(this.result);
                }
            }, 1e3);
        });
    }
    async processImage(imageUrl, payload = {}) {
        await this.connect();
        await this.sendPayload(imageUrl, payload);
        return await this.waitForCompletion();
    }
    generateHash() {
        return Math.random().toString(36).substring(2, 15);
    }
}

async function vyro(buffer) {
    try {
        const pixnova = new PixnovaAI();
        const payload = {
            scale: 2,
            request_from: 2
        };
        const result = await pixnova.processImage(buffer, payload);
        const response = await axios.get(result, {
            responseType: "arraybuffer"
        });
        return {
            status: true,
            data: Buffer.from(response.data).toString("base64")
        };
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}

export default {
    vyro
};
