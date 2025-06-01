import express from "express";
const download = express.Router();
import api from "../api/index.js";
import config from "../config/config.js";
import { handleError, checkStatus, isUrl, checkUrl } from "../utils/helper.js";
import Api from "../api/download.js";

download.get("/apkdl", async (req, res) => {
    const { url } = req.query;
    try {
        const down = new Api(url);
        const response = await down.aptoide();
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/douyin", async (req, res) => {
    const { url } = req.query;
    try {
        const down = new Api(url);
        const response = await down.douyin();
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/fb", async (req, res) => {
    const { url } = req.query;
    try {
        const down = new Api(url);
        const response = await down.facebook();
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/gdrive", async (req, res) => {
    const { url } = req.query;
    try {
      const down = new Api()
        const response = await down.gdrive(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/ig", async (req, res) => {
    let { url, index } = req.query;
    try {
        const response = await api.ig.download(url, (index = 3));
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/komikuDownload", async (req, res) => {
    let { query } = req.query;
    try {
        const response = await api.komiku.download(query);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/mediafire", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.mediafire.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/pinterestdl", async (req, res) => {
    const { url } = req.query;
    try {
        let link = checkUrl(res, url, "pin.it");
        if (!link)
            return res
                .status(400)
                .json({ status: false, error: "Invalid url." });
        const response = await api.pin.download(link);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/savevid", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.savevid.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/snapsave", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.snapsave.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/snaptik", async (req, res) => {
    const { url } = req.query;
    try {
        let link = checkUrl(res, url, "tiktok");
        if (!link)
            return res
                .status(400)
                .json({ status: false, error: "Invalid Url." });
        const response = await api.tik.snaptik(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/soundclouddl", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.soundcloud.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/spotifydl", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.spotify.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/tikwm", async (req, res) => {
    const { url } = req.query;
    try {
        let link = checkUrl(res, url, "tiktok");
        if (!link)
            return res
                .status(400)
                .json({ status: false, error: "Invalid Url." });
        const response = await api.tik.tikwm(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/westDownload", async (req, res) => {
    let { url } = req.query;
    try {
        const response = await api.manga.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/xdown", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.x.down(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/ytmp3", async (req, res) => {
    const { url } = req.query;
    try {
        let link = checkUrl(res, url, "youtu");
        if (!link)
            return res
                .status(400)
                .json({ status: false, error: "Invalid URL." });
        const response = await api.youtube.audio(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

download.get("/ytmp4", async (req, res) => {
    const { url } = req.query;
    try {
        let link = checkUrl(res, url, "youtu");
        if (!link)
            return res
                .status(400)
                .json({ status: false, error: "Invalid URL." });
        const response = await api.youtube.video(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

export { download };
