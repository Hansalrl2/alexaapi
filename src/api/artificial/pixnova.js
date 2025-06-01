import axios from "axios";
import WebSocket from "ws";
class PixnovaAI {
    constructor() {
        this.ws = null;
        this.sessionHash = this.generateHash();
        this.result = null;
        this.baseURL = "https://oss-global.pixnova.ai/";
    }
    async connect(wsUrl) {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(wsUrl, {
                    headers: {
                        Upgrade: "websocket",
                        Origin: "https://pixnova.ai",
                        "Cache-Control": "no-cache",
                        "Accept-Language":
                            "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                        Pragma: "no-cache",
                        Connection: "Upgrade",
                        "Sec-WebSocket-Version": "13",
                        "Sec-WebSocket-Key": "randomkey==",
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
            } catch (error) {
                reject(
                    new Error(
                        "Gagal menghubungkan ke WebSocket: " + error.message
                    )
                );
            }
        });
    }
    async imageToBase64(imageUrl) {
        try {
            const response = await axios.get(imageUrl, {
                responseType: "arraybuffer"
            });
            return `data:image/jpeg;base64,${Buffer.from(
                response.data
            ).toString("base64")}`;
        } catch (error) {
            throw new Error(
                "Gagal mengonversi gambar ke Base64: " + error.message
            );
        }
    }
    async sendPayload(payload) {
        try {
            this.ws.send(JSON.stringify(payload));
        } catch (error) {
            console.error("Error mengirim payload:", error);
        }
    }
    handleMessage(data) {
        try {
            const parsedData = JSON.parse(data);
            console.log("[📩] WS Data:", parsedData);
            if (parsedData.msg === "process_completed" && parsedData.success) {
                this.result = this.baseURL + parsedData.output.result[0];
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
    async anime({ buffer, prompt }) {
        try {
            await this.connect("wss://pixnova.ai/demo-photo2anime/queue/join");
            const payload = {
                data: {
                    source_image: `data:image/jpeg;base64,` + buffer,
                    prompt: prompt
                }
            };
            await this.sendPayload(payload);
            return await this.waitForCompletion();
        } catch (error) {
            console.error("Error dalam img2img:", error);
            throw error;
        }
    }
    async removewm({
        buffer,
        prompt = "recreate this image in ghibli style",
        strength = 0.6,
        model = "meinamix_meinaV11.safetensors",
        lora = ["Studio_Chibli_Style_offset:0.7"],
        width = 1024,
        height = 1024,
        negative_prompt = "(worst quality, low quality:1.4), cropped, lowres",
        cfg = 7,
        request_from = 2,
        ...custom
    }) {
        try {
            await this.connect("wss://pixnova.ai/remove-mark/queue/join");
            const payload = {
                data: {
                    source_image: `data:image/jpeg;base64,` + buffer,
                    prompt: prompt,
                    strength: strength,
                    model: model,
                    lora: lora,
                    width: width,
                    height: height,
                    negative_prompt: negative_prompt,
                    cfg: cfg,
                    request_from: request_from,
                    ...custom
                }
            };
            await this.sendPayload(payload);
            return await this.waitForCompletion();
        } catch (error) {
            console.error("Error dalam img2img:", error);
            throw error;
        }
    }
    async removebg({
        buffer,
        prompt = "recreate this image in ghibli style",
        strength = 0.6,
        model = "meinamix_meinaV11.safetensors",
        lora = ["Studio_Chibli_Style_offset:0.7"],
        width = 1024,
        height = 1024,
        negative_prompt = "(worst quality, low quality:1.4), cropped, lowres",
        cfg = 7,
        request_from = 2,
        ...custom
    }) {
        try {
            await this.connect("wss://pixnova.ai/remove-bg/queue/join");
            const payload = {
                data: {
                    source_image: `data:image/jpeg;base64,` + buffer,
                    prompt: prompt,
                    strength: strength,
                    model: model,
                    lora: lora,
                    width: width,
                    height: height,
                    negative_prompt: negative_prompt,
                    cfg: cfg,
                    request_from: request_from,
                    ...custom
                }
            };
            await this.sendPayload(payload);
            return await this.waitForCompletion();
        } catch (error) {
            console.error("Error dalam img2img:", error);
            throw error;
        }
    }
    generateHash() {
        return Math.random().toString(36).substring(2, 15);
    }
}


async function toanime(buffer) {
    try {
        const pixnova = new PixnovaAI();
        let result = await pixnova.anime({
            buffer: buffer,
            prompt: "change it to anime style but still in original form"
        });
        if (!result) {
            return {
                status: false,
                message: "Gagal generate gambar"
            };
        }
        return {
            status: true,
            data: result
        };
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}


async function removewm(buffer) {
    try {
        const pixnova = new PixnovaAI();
        let result = await pixnova.removewm({
            buffer: buffer,
            prompt: "mastermasterpiece, HD, detailed"
        });
        if (!result) {
            return {
                status: false,
                message: "Gagal generate gambar"
            };
        }
        return {
            status: true,
            data: result
        };
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}
async function removebg(buffer) {
    try {
        const pixnova = new PixnovaAI();
        let result = await pixnova.removebg({
            buffer: buffer,
            prompt: "mastermasterpiece, HD, detailed"
        });
        if (!result) {
            return {
                status: false,
                message: "Gagal generate gambar"
            };
        }
        return {
            status: true,
            result: result
        };
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}

import FormData from "form-data";

let streamURL = (url, ext = "jpg") =>
    axios
        .get(url, {
            responseType: "stream"
        })
        .then(res => ((res.data.path = `tmp.${ext}`), res.data))
        .catch(e => null);

async function processDiffusecraftImage(imageFilePath) {
    function generateSessionHash() {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        return Array(11)
            .fill()
            .map(() =>
                characters.charAt(Math.floor(Math.random() * characters.length))
            )
            .join("");
    }

    const sessionHash = generateSessionHash();

    try {
        const uploadForm = new FormData();
        uploadForm.append("files", imageFilePath, {
            filename: "image.jpg",
            contentType: "image/jpeg"
        });

        const uploadHeaders = {
            ...uploadForm.getHeaders(),
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language":
                "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            Origin: "https://taoanhdep.com",
            "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
            "Sec-Ch-Ua-Mobile": "?1",
            "Sec-Ch-Ua-Platform": '"Android"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        };

        const uploadResponse = await axios.post(
            "https://tuan2308-diffusecraft.hf.space/upload",
            uploadForm,
            { headers: uploadHeaders }
        );
        const uploadedImageUrl = uploadResponse.data[0];

        const optionsHeaders = {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language":
                "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            "Access-Control-Request-Headers": "content-type",
            "Access-Control-Request-Method": "POST",
            Origin: "https://taoanhdep.com",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        };

        await axios({
            method: "OPTIONS",
            url: "https://tuan2308-diffusecraft.hf.space/queue/join?__theme=light",
            headers: optionsHeaders
        });
        const processHeaders = {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language":
                "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            "Content-Type": "application/json",
            Origin: "https://taoanhdep.com",
            "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
            "Sec-Ch-Ua-Mobile": "?1",
            "Sec-Ch-Ua-Platform": '"Android"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        };

        const processPayload = {
            data: [
                "anime",
                "nsfw, strange color, blurred , ugly, tiling, bad hand drawing, poorly drawn feet, poorly drawn face, out of frame, extra limbs, deformity, deformity, body out of frame, blur, bad anatomy, blurred, watermark, grainy, signature, cropped, draft , low detail, low quality, two faces, 2 faces, garbled, ugly, low resolution, tiled, repetitive , grainy, garbled, plastic, distorted , ostentatious, ugly, oversaturated, grainy, low resolution, distorted, blurry, bad anatomy, distortion, poorly drawn face, mutant , mutant, appendage, ugly, poorly drawn hand, missing limb, blurred, floating limb, disjointed limb, hand deformity, blurred, out of focus, long neck, long body, ugly, hideous, drawing bad, garbled, distorted, imperfect, surreal, bad hand, text, error, extra digits, less digits, garbled , worst quality , low quality, normal quality, jpeg artifact, signature, watermark, username, blurry, artist name, multiple hands, extra limb, extra finger, conjoined finger, deformed finger, old, bad eye, imperfect eye, misaligned eye , unnatural face, stiff face, stiff body, disproportionate, unnatural body, lack of body, unclear details, sticky details, low details, details distorted, ugly hands, imperfect hands, (deformed hands and fingers: 1.5), (long body :1.3), (mutated, poorly drawn :1.2) bad hands, fused hands , lost hand, arm disappeared, thighs disappeared, calves disappeared, legs disappeared, ui, lost fingers, (((((realistic, semi-realistic, render, outline)))), already crop, worst quality, low quality, jpeg shaping, ugly, duplicate, garbled, out of frame, extra fingers, mutated hand, poorly drawn hand, bad drawn face, mutated variable, deformed, blurred, dehydrated, bad anatomy, bad proportions, superfluous limbs, cloned face, deformity, gross proportions, deformed limbs, lost hands, lost legs, extra arms, extra legs , sticky fingers, too many fingers , long neck, text, close-up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, sick, cropped amputee, extra fingers, mutated hand, bad hand drawing, bad drawn face, mutant, deformed, blurred, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, deformity, gross proportions, deformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, blurred, deformed face, variable hands shape, deformed fingers, ugly, bad anatomy, extra fingers, extra hands, deformed eyes, logo, text (:1.2) (:1.2) , (:1.2) sketch, (poor quality) best:1.4), (low quality:1.4), (normal quality:1.4), low quality, bad anatomy, bad hand, vaginal vagina, ((monochrome)), ((scale) gray)), drooping eyelids, many eyebrows, (cropped), oversaturated, extra limb, amputee, deformed arms, long neck, long body, imperfection, (bad hands), signature, figure blurred, username, artist name, conjoined fingers, deformed fingers, bad eyes, imperfect eyes, misaligned eyes, unnatural face, unnatural body, error, bad photo, bad photo",
                1,
                28,
                7.5,
                true,
                -1,
                "loras/3DMM_V12.safetensors",
                0.5,
                null,
                0.33,
                null,
                0.33,
                null,
                0.33,
                null,
                0.33,
                "Euler a",
                1024,
                1024,
                "eienmojiki/Anything-XL",
                null,
                "img2img",
                {
                    path: uploadedImageUrl,
                    url: uploadedImageUrl,
                    orig_name: "uploaded_image.jpg",
                    size: 186332,
                    mime_type: "image/jpeg",
                    meta: { _type: "gradio.FileData" }
                },
                "Canny",
                512,
                1024,
                [],
                null,
                null,
                0.59,
                100,
                200,
                0.1,
                0.1,
                1,
                0,
                1,
                false,
                "Compel",
                null,
                1.4,
                100,
                10,
                30,
                0.55,
                "Use same sampler",
                "",
                "",
                false,
                true,
                1,
                true,
                false,
                true,
                true,
                false,
                "./images",
                false,
                false,
                false,
                true,
                1,
                0.55,
                false,
                true,
                false,
                true,
                false,
                "Use same sampler",
                false,
                "",
                "",
                0.35,
                true,
                true,
                false,
                4,
                4,
                32,
                false,
                "",
                "",
                0.35,
                true,
                true,
                false,
                4,
                4,
                32,
                false,
                null,
                null,
                "plus_face",
                "original",
                0.7,
                null,
                null,
                "base",
                "style",
                0.7
            ],
            event_data: null,
            fn_index: 11,
            trigger_id: 14,
            session_hash: sessionHash
        };

        await axios.post(
            "https://tuan2308-diffusecraft.hf.space/queue/join?__theme=light",
            processPayload,
            { headers: processHeaders }
        );
        const streamHeaders = {
            Accept: "text/event-stream",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language":
                "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            "Cache-Control": "no-cache",
            Origin: "https://taoanhdep.com",
            "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
            "Sec-Ch-Ua-Mobile": "?1",
            "Sec-Ch-Ua-Platform": '"Android"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        };

        const streamResponse = await axios.get(
            `https://tuan2308-diffusecraft.hf.space/queue/data?session_hash=${sessionHash}`,
            {
                headers: streamHeaders,
                responseType: "stream"
            }
        );

        return new Promise((resolve, reject) => {
            let data = "";
            let resultInfo = {
                processedImageUrl: null,
                seeds: null
            };

            streamResponse.data.on("data", chunk => {
                data += chunk.toString();
                const lines = chunk.toString().split("\n");
                lines.forEach(line => {
                    if (line.startsWith("data: ")) {
                        try {
                            const jsonData = JSON.parse(line.slice(6));
                            if (jsonData.msg === "process_completed") {
                                resultInfo.processedImageUrl =
                                    jsonData.output.data[0][0].image.url;
                                const seedsMatch =
                                    jsonData.output.data[1].match(
                                        /Seeds: \[(.*?)\]/
                                    );
                                if (seedsMatch) {
                                    resultInfo.seeds = seedsMatch[1]
                                        .split(",")
                                        .map(Number);
                                }
                            }
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                    }
                });

                if (data.includes('"msg":"process_completed"')) {
                    resolve(resultInfo);
                }
            });

            streamResponse.data.on("end", () => {
                resolve(resultInfo);
            });

            streamResponse.data.on("error", error => {
                reject(error);
            });
        });
    } catch (error) {
        throw error;
    }
}
/*

async function toanime(buffer) {
  try {
    const result = await processDiffusecraftImage(
        Buffer.from(buffer, "base64")
    );

    if (!result.processedImageUrl) {
        throw new Error("Unable to process image");
    }
    const processedAttachment = await streamURL(result.processedImageUrl);
    if (!processedAttachment) {
        throw new Error("Unable to load processed image");
    }
    return {
        status: true,
        data: processedAttachment.responseUrl
    };
  } catch (e){
    return {
      status: false,
      message: e
    }
  }
}
*/


export default {
    toanime,
    removewm,
    removebg
};
