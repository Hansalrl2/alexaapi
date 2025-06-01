import * as cheerio from "cheerio";
import axios from "axios";
import FormData from "form-data";
import { decrypt } from "../../utils/descryp.js";

const download = async instagramUrl => {
    try {
        const formDataUserVerify = new FormData();
        formDataUserVerify.append("url", instagramUrl);

        const userVerifyResponse = await axios.post(
            "https://savevid.net/api/userverify",
            formDataUserVerify,
            {
                headers: formDataUserVerify.getHeaders()
            }
        );

        const token = userVerifyResponse.data.token;

        const formDataAjaxSearch = new FormData();
        formDataAjaxSearch.append("q", instagramUrl);
        formDataAjaxSearch.append("t", "media");
        formDataAjaxSearch.append("lang", "id");
        formDataAjaxSearch.append("v", "v2");
        formDataAjaxSearch.append("cftoken", token);

        const ajaxSearchResponse = await axios.post(
            "https://v3.savevid.net/api/ajaxSearch",
            formDataAjaxSearch,
            {
                headers: {
                    ...formDataAjaxSearch.getHeaders(),
                    authority: "v3.savevid.net",
                    accept: "*/*",
                    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    origin: "https://savevid.net",
                    referer: "https://savevid.net/",
                    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": '"Android"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "user-agent":
                        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
                }
            }
        );

        return extractData(ajaxSearchResponse.data.data);
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};

const extractData = html => {
    let $;
    if (html.includes("function")) {
        $ = cheerio.load(
            decrypt(html, {
                decodeSplitString: "decodeURIComponent(r)}(",
                endSplitString: "))",
                decodedSplitString:
                    'getElementById("download-result").innerHTML = "',
                decodedEndSplitString:
                    '"; document.getElementById("inputData").remove(); '
            })
        );
    } else {
        $ = cheerio.load(html);
    }
    const results = [];

    $("ul.download-box li").each((index, element) => {
        const url = $(element).find(".download-items__btn a").attr("href");
        results.push({
            url: url
        });
    });

    return { status: true, data: results };
};

export default {
    download
}; 
 