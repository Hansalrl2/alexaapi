import express from "express";
const download = express.Router();
import config from "./config/config.js";
import api from "./api/index.js";
import { handleError, checkStatus, isUrl, checkUrl } from "./utils/helper.js";

download.get("/mfd", async (req, res) => {
    const { url } = req.query;
    try {
        const response = await api.mediafire.download(url);
        config.request += 1;
        checkStatus(res, response);
    } catch (error) {
        handleError(res, error);
    }
});

export { download };
