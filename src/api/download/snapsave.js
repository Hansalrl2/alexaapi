import { decrypt } from "../../utils/descryp.js";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

async function download(url) {
    return new Promise((resolve, reject) => {
        fetch("https://snapsave.app/action.php?lang=en", {
            headers: {
                accept: "*/*",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
                "content-type":
                    "multipart/form-data; boundary=----WebKitFormBoundarySB8D0Ais6M9CclGo",
                "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                cookie: "PHPSESSID=2knvkqcotnq0s7cvuv5l71p13d; _ga=GA1.1.1801929496.1743654214; _ga_WNPZGVDWE9=GS1.1.1743657837.2.0.1743657849.48.0.0",
                Referer: "https://snapsave.app/facebook-reels-download",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: `------WebKitFormBoundarySB8D0Ais6M9CclGo\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\n${url}\r\n------WebKitFormBoundarySB8D0Ais6M9CclGo--\r\n`,
            method: "POST"
        })
            .then(async data => {
                let $ = cheerio.load(decrypt(await data.text()));
                const res = [];

                // Mengambil setiap elemen download-items
                $(".download-items").each((index, element) => {
                    const url = $(element)
                        .find(".download-items__btn a")
                        .attr("href");
                    const type = $(element)
                        .find(".format-icon i")
                        .hasClass("icon-dlvideo")
                        ? "video"
                        : "image";

                    res.push({ url, type });
                });
                const results = { status: true, data: res };
                resolve(results);
            })
            .catch(e => {
                let results = {
                    status: false,
                    message: e
                };
                resolve(results);
            });
    });
}

export default {
    download
};
