import axios from "axios";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
import crypto from "crypto";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";

class GhibliProcessor {
    constructor() {
        this.baseUrl = "https://han-123-easycontrol-ghibli.hf.space/";
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handleStream(
        fileData,
        metadata,
        height,
        width,
        isProxy = false,
        retries = 1
    ) {
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
                    height,
                    width,
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
                                        height,
                                        width,
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
                                        height,
                                        width,
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

    async process(buffer, height, width) {
        try {
            const form = new FormData();
            // const metadata = await sharp(buffer).metadata();
            const type = await fileTypeFromBuffer(buffer);
            const filename = `${crypto.randomUUID()}.${type.ext}`;
            form.append("files", buffer, {
                filename,
                contentType: type.mime
            });

            const { data: filePath } = await axios.post(
                `${this.baseUrl}gradio_api/upload?upload_id=vs37pitvynj`,
                form.getBuffer(),
                { headers: form.getHeaders() }
            );

            return await this.handleStream(filePath, type, height, width);
        } catch (error) {
            console.error("Upload failed:", error);
            return { status: false, message: error.message };
        }
    }
}

async function ghibli(buffer, ratio) {
    let height, width;
    if (ratio === "1:1") {
        height = 704;
        width = 704;
    } else if (ratio === "9:16") {
        height = 704;
        width = 448;
    } else if (ratio === "16:9") {
        height = 448;
        width = 704;
    } else {
        height = 704;
        width = 704;
    }
    const gh = new GhibliProcessor();
    return await gh.process(Buffer.from(buffer, "base64"), height, width);
}

class Taoanhdep {
    constructor() {
        this.baseUrl = "https://taoanhdep.com";
    }

    #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async #handleStream(fileData, base_url, isProxy = false, retries = 1) {
        try {
            const withGradio = base_url.includes("ghibli") ? "gradio_api/" : "";
            const urlProxy = isProxy
                ? `${this.baseUrl}/public/proxy-ai/join-v2.php?apiu=${base_url}`
                : `${base_url}${withGradio}queue/join?__theme=system`;

            const { data: eventId } = await axios.post(urlProxy, fileData, {
                headers: {
                    Origin: this.baseUrl,
                    "Content-Type": "application/json",
                    "User-Agent":
                        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36"
                }
            });

            if (!eventId.event_id)
                return { status: false, message: "No event ID received" };

            const response = await fetch(
                `${base_url}${withGradio}queue/data?session_hash=${fileData.session_hash}`
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
                    const cleaned = msg.replace(/^data:\s*/, "");
                    if (!cleaned) continue;

                    let parsed;
                    try {
                        parsed = JSON.parse(cleaned);
                    } catch (_) {
                        console.warn("Invalid JSON chunk:", cleaned);
                        continue;
                    }

                    if (parsed.msg === "process_completed") {
                        const error = parsed.output?.error;
                        const data = parsed.output?.data?.[0];
                        // @ts-ignore
                        const result =
                            typeof data === "string"
                                ? data?.url
                                : Array.isArray(data)
                                ? data?.[1]?.url
                                : null;

                        if (error) {
                            if (error.includes("GPU") && retries > 0) {
                                console.log(
                                    "GPU error, retrying with proxy..."
                                );
                                await this.#delay(1000);
                                return await this.#handleStream(
                                    fileData,
                                    base_url,
                                    true,
                                    retries - 1
                                );
                            }
                            return { status: false, message: error };
                        }

                        if (!result && retries > 0) {
                            console.log("No result, retrying...");
                            await this.#delay(3000);
                            return await this.#handleStream(
                                fileData,
                                base_url,
                                true,
                                retries - 1
                            );
                        }

                        if (!result)
                            return {
                                status: false,
                                message: "No result received"
                            };
                        return { status: true, result };
                    }
                }
            }

            return { status: false, message: "Stream ended without result" };
        } catch (error) {
            console.error("[handleStream error]", error);
            return { status: false, message: error.message || "Unknown error" };
        }
    }

    async ghibli(buffer, height, width) {
        try {
            const base_url = "https://han-123-easycontrol-ghibli.hf.space/";
            const form = new FormData();
            const type = await fileTypeFromBuffer(buffer);
            const filename = `${crypto.randomUUID()}.${type.ext}`;
            form.append("files", buffer, {
                filename,
                contentType: type.mime
            });

            const { data: filePath } = await axios.post(
                `${base_url}gradio_api/upload?upload_id=vs37pitvynj`,
                form.getBuffer(),
                { headers: form.getHeaders() }
            );
            const sessionHash = Math.random().toString(36).substring(2);
            const postData = {
                data: [
                    "Ghibli Studio style, Charming hand-drawn anime-style illustration",
                    {
                        path: filePath[0],
                        url: `${base_url}${filePath[0]}`,
                        size: 0,
                        mime_type: type.mime,
                        meta: { _type: "gradio.FileData" }
                    },
                    height,
                    width,
                    Math.floor(Math.random() * 10000000),
                    "Ghibli"
                ],
                event_data: null,
                fn_index: 1,
                trigger_id: 15,
                session_hash: sessionHash
            };

            return await this.#handleStream(postData, base_url);
        } catch (error) {
            console.error("Upload failed:", error);
            return { status: false, message: error.message };
        }
    }

    async expand(buffer) {
        try {
            const base_url =
                "https://han-123-diffusers-image-outpaint.hf.space/";
            const form = new FormData();
            const type = await fileTypeFromBuffer(buffer);
            const filename = `${crypto.randomUUID()}.${type.ext}`;
            form.append("files", buffer, {
                filename,
                contentType: type.mime
            });

            const { data: filePath } = await axios.post(
                `${base_url}upload`,
                form.getBuffer(),
                { headers: form.getHeaders() }
            );
            const sessionHash = Math.random().toString(36).substring(2);
            const postData = {
                data: [
                    {
                        path: filePath[0],
                        url: `${base_url}${filePath[0]}`,
                        orig_name: filename,
                        size: 0,
                        mime_type: type.mime,
                        meta: { _type: "gradio.FileData" }
                    },
                    1024,
                    1024,
                    42,
                    8,
                    "Custom",
                    512,
                    null,
                    "Middle"
                ],
                event_data: null,
                fn_index: 7,
                trigger_id: 11,
                session_hash: sessionHash
            };

            return await this.#handleStream(postData, base_url);
        } catch (error) {
            console.error("Upload failed:", error);
            return { status: false, message: error.message };
        }
    }

    async removebg(buffer) {
        try {
            const base_url = "https://not-lain-background-removal.hf.space/";
            const form = new FormData();
            const type = await fileTypeFromBuffer(buffer);
            const filename = `${crypto.randomUUID()}.${type.ext}`;
            form.append("files", buffer, {
                filename,
                contentType: type.mime
            });

            const { data: filePath } = await axios.post(
                `${base_url}upload`,
                form.getBuffer(),
                { headers: form.getHeaders() }
            );
            const sessionHash = Math.random().toString(36).substring(2);
            const postData = {
                data: [
                    {
                        path: filePath[0],
                        url: `${base_url}${filePath[0]}`,
                        orig_name: filename,
                        size: null,
                        mime_type: type.mime,
                        meta: { _type: "gradio.FileData" }
                    }
                ],
                event_data: null,
                fn_index: 0,
                trigger_id: 13,
                session_hash: sessionHash
            };

            return await this.#handleStream(postData, base_url);
        } catch (error) {
            console.error("Upload failed:", error);
            return { status: false, message: error.message };
        }
    }

    async beauty(buffer) {
        try {
            const form = new FormData();
            const type = await fileTypeFromBuffer(buffer);
            const filename = `${crypto.randomUUID()}.${type.ext}`;
            form.append("file", buffer, { filename });
            const { data } = await axios.post(
                `${this.baseUrl}/public/lam-dep.php`,
                form.getBuffer(),
                { headers: form.getHeaders() }
            );
            return { status: true, result: data.trim() };
        } catch (error) {
            console.error(error);
            return { status: false, message: "error fetching data" };
        }
    }

    async #gtavProgress(id) {
        try {
            const status = await fetch(
                `${this.baseUrl}/public/check-gtav.php?id=${id}`
            ).then(response => response.json());
            return status;
        } catch (error) {
            console.error(error);
            return { status: false, message: "error get progress" };
        }
    }

    async gtav(buffer, result = {}) {
        try {
            let retries = 0;
            const form = new FormData();
            const type = await fileTypeFromBuffer(buffer);
            const filename = `${crypto.randomUUID()}.${type.ext}`;
            form.append("file", buffer, { filename });
            const { data } = await axios.post(
                `${this.baseUrl}/public/anime-gtav.php`,
                form.getBuffer(),
                {
                    headers: {
                        Origin: this.baseUrl,
                        Accept: "*/*",
                        "Content-Type": "application/json",
                        "Accept-Encoding": "gzip, deflate, br, zstd",
                        "Accept-Language":
                            "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                        "x-requested-with": "XMLHttpRequest",
                        "sec-fetch-fite": "same-origin",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-dest": "empty",
                        "sec-ch-ua":
                            '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                        "User-Agent":
                            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
                        ...form.getHeaders()
                    }
                }
            );
            while (result.status !== "OK") {
                retries++;
                result = await this.#gtavProgress(data.requestId);
                await this.#delay(1000);
                console.log(`retries ${retries}`);
            }
            return { status: true, result: result.result_url };
        } catch (error) {
            console.error(error);
            return { status: false, message: "error fetching data" };
        }
    }
}

let tao = new Taoanhdep();

class RemoveBackground {
    constructor() {
        this.apiUrl =
            "https://s5ash41h3g.execute-api.ap-south-1.amazonaws.com/default/api/v1/rmbg/predict";
        this.headers = {
            accept: "application/json",
            "accept-language": "id-ID,id;q=0.9",
            "content-type": "application/json",
            origin: "https://clyrbg.com",
            priority: "u=1, i",
            referer: "https://clyrbg.com/",
            "sec-ch-ua":
                '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": '"Android"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
        };
    }
    async removeBg(buffer) {
        try {
            let { ext, mime } = await fileTypeFromBuffer(buffer);
            const imageBase64 = buffer.toString("base64");
            const payload = {
                file_extension: ext,
                image_bytes: imageBase64,
                hd: true
            };
            const apiResponse = await axios.post(this.apiUrl, payload, {
                headers: this.headers
            });
            return {
                status: true,
                result: apiResponse.data.url
            };
        } catch (error) {
            return {
                status: false,
                message: error
            };
        }
    }
}

const rem = new RemoveBackground();

async function expand(buffer) {
    return await tao.expand(Buffer.from(buffer, "base64"));
}
async function beauty(buffer) {
    return await tao.beauty(Buffer.from(buffer, "base64"));
}
async function removebg(buffer) {
    return await rem.removeBg(Buffer.from(buffer, "base64"));
}
async function gtav(buffer) {
    return await tao.gtav(Buffer.from(buffer, "base64"));
}

export default {
    ghibli,
    expand,
    beauty,
    gtav,
    removebg
};
