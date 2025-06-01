import fs from "fs";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

class GhibliProcessor {
    constructor() {
        this.baseUrl = "https://tuan2308-easycontrol-ghibli.hf.space/";
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handleStream(fileData, metadata, isProxy = false, retries = 1) {
        try {
            const sessionHash = Math.random().toString(36).substring(2);
            const postData = {
                data: [
                    "Ghibli Studio style, Charming hand-drawn anime-style illustration",
                    {
                        path: fileData[0],
                        url: `${this.baseUrl}${fileData[0]}`,
                        size: 0,
                        mime_type: metadata.mime,
                        meta: { _type: "gradio.FileData" }
                    },
                    704,
                    448,
                    Math.floor(Math.random() * 10000000),
                    "Ghibli"
                ],
                event_data: null,
                fn_index: 1,
                trigger_id: 15,
                session_hash: sessionHash
            };

            const urlProxy = isProxy
                ? `https://taoanhdep.com/public/proxy-ai/join-v2.php?apiu=${this.baseUrl}`
                : `${this.baseUrl}gradio_api/queue/join?__theme=system`;

            const { data: eventId } = await axios.request({
                url: urlProxy,
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Content-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    "Content-Type": "application/json",
                    Origin: "https://taoanhdep.com",
                    Priority: "u=1, i",
                    cookie: `_ga=GA1.1.${Math.random()
                        .toString()
                        .substr(
                            2
                        )}; __eoi=ID=${uuidv4()}:T=1717863522:RT=${Math.floor(
                        Date.now() / 1e3
                    )}:S=AA-AfjYNKyeeSeFWOceLt_cXZHyy; _ga_WBHK34L0J9=GS1.1.${Math.random()
                        .toString()
                        .substr(2)}`
                },
                data: JSON.stringify(postData)
            });

            if (!eventId.event_id) {
                return { status: false, message: "No event ID received" };
            }

            const response = await fetch(
                `${this.baseUrl}gradio_api/queue/data?session_hash=${sessionHash}`
            );
            if (!response.ok)
                throw new Error(
                    `Failed to fetch stream: ${response.statusText}`
                );

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const messages = chunk.split("\n").filter(Boolean);

                for (const msg of messages) {
                    try {
                        const parsed = JSON.parse(msg.replace(/^data:\s*/, ""));
                        if (parsed.msg === "process_completed") {
                            const error = parsed.output?.error;
                            if (error) {
                                if (error.includes("GPU") && retries > 0) {
                                    console.log(
                                        "GPU error, retrying with proxy..."
                                    );
                                    await this.delay(3000);
                                    return await this.handleStream(
                                        fileData,
                                        metadata,
                                        true,
                                        retries - 1
                                    );
                                } else {
                                    return { status: false, message: error };
                                }
                            } else {
                                const result = parsed.output?.data?.[0]?.url;
                                if (
                                    !error &&
                                    !parsed.output.data &&
                                    !parsed.success &&
                                    retries !== 0
                                ) {
                                    await this.delay(3000);
                                    return await this.handleStream(
                                        fileData,
                                        metadata,
                                        true,
                                        retries - 1
                                    );
                                } else {
                                    if (!result)
                                        return {
                                            status: false,
                                            message: "No result received"
                                        };
                                    return { status: true, result };
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Failed to parse message:", error);
                    }
                }
            }

            return { status: false, message: "Stream ended without result" };
        } catch (error) {
            console.error(error);
            return { status: false, message: error.message };
        }
    }

    async process(buffer) {
        try {
            const form = new FormData();
            const jpeg = await sharp(buffer).jpeg().toBuffer();
            // const metadata = await sharp(buffer).metadata();
            const type = await fileTypeFromBuffer(jpeg);
            const filename = `${crypto.randomUUID()}.${type.ext}`;
            form.append("files", jpeg, {
                filename,
                contentType: type.mime
            });

            const { data: filePath } = await axios.post(
                `${this.baseUrl}gradio_api/upload?upload_id=vs37pitvynj`,
                form.getBuffer(),
                { headers: form.getHeaders() }
            );

            return await this.handleStream(filePath, type);
        } catch (error) {
            console.error("Upload failed:", error);
            return { status: false, message: error.message };
        }
    }
}

const gh = new GhibliProcessor();

async function ghibli(buffer) {
    let { status, result, message } = await gh.process(buffer);
    if (!status)
        return {
            status: false,
            message: message
        };
    return {
        status: true,
        data: result
    };
}

export default {
    ghibli
};
