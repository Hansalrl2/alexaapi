import axios from "axios";
import crypto from "crypto";

async function transcript(link) {
    return new Promise((resolve, reject) => {
        axios
            .get("https://ytb2mp4.com/api/fetch-transcript", {
                params: {
                    url: link
                },
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
                    Referer: "https://ytb2mp4.com/youtube-transcript"
                }
            })
            .then(data => {
                resolve({ status: true, result: data.data.transcript });
            })
            .catch(err => {
                resolve({ status: false, message: err });
            });
    });
}

async function info(url) {
    return new Promise((resolve, reject) => {
        fetch("https://ytb2mp4.com/api/youtube-video-info", {
            headers: {
                accept: "application/json",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
                "content-type": "application/json",
                "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                cookie: "_ga=GA1.1.1655880250.1740973538; _ga_DT20BZX0CQ=GS1.1.1740973537.1.0.1740973546.0.0.0",
                Referer: "https://ytb2mp4.com/",
                "Referrer-Policy": "origin-when-cross-origin"
            },
            body: `{\"url\":\"${url}\",\"platform\":\"youtube\"}`,
            method: "POST"
        })
            .then(async response => {
                resolve(await response.json());
            })
            .catch(() => {
                resolve({ data: { duration: "00", title: Date.now() } });
            });
    });
}
async function dl(link, format = "480") {
    const apiBase = "https://media.savetube.me/api";
    const apiCDN = "/random-cdn";
    const apiInfo = "/v2/info";
    const apiDownload = "/download";
    if (link.includes("shorts")) {
        format = "720";
    }

    const decryptData = async enc => {
        try {
            const key = Buffer.from("C5D58EF67A7584E4A29F6C35BBC4EB12", "hex");
            const data = Buffer.from(enc, "base64");
            const iv = data.slice(0, 16);
            const content = data.slice(16);

            const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
            let decrypted = decipher.update(content);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return JSON.parse(decrypted.toString());
        } catch (error) {
            return null;
        }
    };

    const request = async (endpoint, data = {}, method = "post") => {
        try {
            const { data: response } = await axios({
                method,
                url: `${endpoint.startsWith("http") ? "" : apiBase}${endpoint}`,
                data: method === "post" ? data : undefined,
                params: method === "get" ? data : undefined,
                headers: {
                    accept: "*/*",
                    "content-type": "application/json",
                    origin: "https://yt.savetube.me",
                    referer: "https://yt.savetube.me/",
                    "user-agent": "Postify/1.0.0"
                }
            });
            return { status: true, data: response };
        } catch (error) {
            return { status: false, error: error.message };
        }
    };

    const youtubeID = link.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
    );
    if (!youtubeID)
        return { status: false, error: "Gagal mengekstrak ID video dari URL." };

    try {
        const cdnRes = await request(apiCDN, {}, "get");
        if (!cdnRes.status) return cdnRes;
        const cdn = cdnRes.data.cdn;

        const infoRes = await request(`https://${cdn}${apiInfo}`, {
            url: `https://www.youtube.com/watch?v=${youtubeID[1]}`
        });
        if (!infoRes.status) return false;

        const decrypted = await decryptData(infoRes.data.data);
        if (!decrypted) return false;

        const downloadRes = await request(`https://${cdn}${apiDownload}`, {
            id: youtubeID[1],
            downloadType: format === "mp3" ? "audio" : "video",
            quality: format === "mp3" ? "128" : format,
            key: decrypted.key
        });
        return downloadRes.data.data.downloadUrl;
    } catch (error) {
        return false;
    }
}

async function audio(url) {
    let data = await info(url);
    try {
        const result = {
            status: true,
            title: data.data.title,
            time: data.data.duration / 60,
            url: await dl(url, "mp3")
        };
        if (!result.url) return { status: false, message: "gagal" };
        return result;
    } catch (error) {
        console.error("Error downloading MP3:", error);
        return { status: false, message: error };
    }
}
async function video(url, quality) {
    let data = await info(url);
    try {
        const result = {
            status: true,
            title: data.data.title,
            time: data.data.duration / 60,
            url: await dl(url)
        };
        if (!result.url) return { status: false, message: "gagal" };
        return result;
    } catch (error) {
        console.error("Error downloading MP4:", error);
        return { status: false, message: error };
    }
}

export default {
    audio,
    video,
    transcript,
    info
};
