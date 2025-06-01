import axios from "axios";
import * as cheerio from "cheerio";

async function search(query) {
    return new Promise((resolve, reject) => {
        fetch(
            `https://api-mobi.soundcloud.com/search/tracks?q=${query}&client_id=KKzJxmw11tYpCs6T24P4uUYhqmjalG6M&stage=`,
            {
                headers: {
                    accept: "application/json, text/javascript, */*; q=0.1",
                    "accept-language":
                        "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
                    authorization: "OAuth 2-296178-961142563-BPWJ9KA9JxDnDV",
                    "content-type": "application/json",
                    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": '"Android"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    Referer: "https://m.soundcloud.com/",
                    "Referrer-Policy": "origin"
                },
                body: null,
                method: "GET"
            }
        )
            .then(async response => {
                let data = await response.json();
                let result = data.collection.map(item => ({
                    title: item.title,
                    permalink_url: item.permalink_url
                }));
                resolve({ status: true, data: result });
            })
            .catch(err => {
                resolve({ status: false, message: err });
            });
    });
}

async function download(url) {
    return new Promise((resolve, reject) => {
        fetch("https://scdler.com/wp-json/aio-dl/video-data/", {
            headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie: "pll_language=en; cf_clearance=rhywXfr7YWRkClY66RHFsIVffo1gaJmb5jp3EiyhOIA-1733743515-1.2.1.1-GCHl_PMLKIzbCo35Z.z10AhH7VU3QwJTq6MUbwm3MMLV1ViYQfjoTxj1iuBtSy3a77hbt66LwlZl.GCp_PicsOj4uXPcS83y3Mcl.uX7c4IaAO2F1KvHEb6tbv.6aRif5RdZMZ7NTR6oAKCg.obXKKg1OIovRUcYoHNE2zG9GfUIJkM1rCTFV8h1ZROrBV9XURITHorBj8qK0RqISVKA4VudvT_npENtsOOTZGVmSbKEBNiUr3QEGOGZnMRNnISAbgXRY6Q6aQapve8eGpygyoqM5JKsKhD2ADMxmQR_wWKd_DsrZWv1nd688LmO1GGZkefgsjswdEzxcqZXp5BvIZypRy4H1WDHFN8hoftpnq8x0QFSWeg2aocbg5wUNxkX",
                Referer: "https://scdler.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: `url=${encodeURIComponent(url)}&token=`,
            method: "POST"
        })
            .then(async response => {
                let data = await response.json();
                let result = {
                    status: true,
                    size: data.medias[0].formattedSize,
                    url: data.medias[0].url
                };
                resolve(result);
            })
            .catch(err => {
                resolve({ status: false, message: err });
            });
    });
}

export default {
    search,
    download
};
