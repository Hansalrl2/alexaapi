import express from "express";
const router = express.Router();
import config from "./config/config.js";
import api from "./api/index.js";
import { handleError, checkStatus, isUrl, checkUrl } from "./utils/helper.js";

router.get("/rednote", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.rn.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/soundcloud", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.soundcloud.search(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/spotify", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.spotify.search(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/game", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.game.search(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/chord", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.music.gitagram(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.get("/lirik", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.music.genius(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.get("/lirikget", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.music.geniusLyric(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/otakuchar", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.otaku.character(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.get("/otakudetails", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.otaku.details(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.get("/otakuquotes", async (req, res) => {
    let { query } = req.query;
    try {
        const response = await api.otaku.quotes(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/komikuSearch", async (req, res) => {
    let { query } = req.query;
    try {
        const response = await api.komiku.search(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.get("/komikuDetails", async (req, res) => {
    let { query } = req.query;
    try {
        const response = await api.komiku.details(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/westSearch", async (req, res) => {
    let { query } = req.query;
    try {
        const response = await api.manga.search(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.get("/westDetails", async (req, res) => {
    let { query } = req.query;
    try {
        const response = await api.manga.details(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/apks", async (req, res) => {
    const { query } = req.query;
    try {
        const response = await api.apk.search(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/qc", async (req, res) => {
    const { text, name, profile, color } = req.body;
    try {
        const response = await api.qc.quotechat(text, name, profile, color);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/topdf", async (req, res) => {
    const { images, size } = req.body;
    try {
        const response = await api.to.toPDF(images, size);
        config.request += 1;
        //res.set("Content-Type", "application/octet-stream");
        //res.send(response);
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/webp", async (req, res) => {
    const { buffer, type = "webp2png" } = req.body;
    try {
        const response = await api.webp[type](buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/vyro", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.upscale.vyro(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/upload", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.up.upload(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/removebg", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.pixnova.removebg(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/whatmusic", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.whatmusic.search(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
// Artificial intelligence

router.post("/removewm", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.pixnova.removewm(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/toanime", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.pixnova.toanime(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/ghibli", async (req, res) => {
    const { buffer, ratio } = req.body;
    try {
        const response = await api.ai.ghibli(buffer, ratio);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/expand", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.ai.expand(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/beauty", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.ai.beauty(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/gtav", async (req, res) => {
    const { buffer } = req.body;
    try {
        const response = await api.ai.gtav(buffer);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/gemini", async (req, res) => {
    const { prompt, buffer, ids } = req.body;
    try {
        const response = await api.gemini.ask(prompt, buffer, ids);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/genai", async (req, res) => {
    const { prompt, buffer, mimeType, instruksi } = req.body;
    try {
        const response = await api.google.ai(
            prompt,
            buffer,
            mimeType,
            instruksi
        );
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/gpt", async (req, res) => {
    const {
        prompt,
        history = [],
        model = "gpt-3",
        markdown = false
    } = req.body;
    try {
        const response = await api.nexra.chatgpt(
            prompt,
            history,
            model,
            markdown
        );
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/gptweb", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await api.nexra.gptweb(prompt);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/gpt4o", async (req, res) => {
    const { prompt, history = [] } = req.body;
    try {
        const response = await api.nexra.gpt4o(prompt, history);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/blackbox", async (req, res) => {
    const { prompt, history = [] } = req.body;
    try {
        const response = await api.nexra.blackbox(prompt, history);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/bing", async (req, res) => {
    const { prompt, history = [] } = req.body;
    try {
        const response = await api.nexra.bing(prompt, history);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
router.post("/bingimg", async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await api.bing.bingimg(prompt);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
/*
router.post("/gemini", async (req, res) => {
    const { prompt, history = [] } = req.body;
    try {
        const response = await api.nexra.gemini(prompt, history);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});
*/
router.post("/xetImage", async (req, res) => {
    const { prompt, model } = req.body;
    try {
        const response = await api.xet.image(prompt, model);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.post("/xetText", async (req, res) => {
    const { prompt, history = [], model } = req.body;
    try {
        const response = await api.xet.text(prompt, history, model);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

// Downloader

router.get("/pinterest", async (req, res) => {
    const { query } = req.query;
    try {
        if (!query)
            return res
                .status(400)
                .json({ status: false, error: "Invalid Query." });
        const response = await api.pin.search(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

router.get("/tikwms", async (req, res) => {
    const { query } = req.query;
    try {
        if (!query)
            return res
                .status(400)
                .json({ status: false, error: "Invalid Query." });
        const response = await api.tik.tikwms(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

// Tools
router.get("/transcript", async (req, res) => {
    const { url } = req.query;
    try {
        let link = checkUrl(res, url, "youtu");
        if (!link)
            return res
                .status(400)
                .json({ status: false, error: "Invalid URL." });
        const response = await api.youtube.transcript(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

export { router };
