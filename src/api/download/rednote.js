async function download(url) {
    return new Promise((resolve, reject) => {
        fetch("https://api.rednotevideodownload.com/rednote/resolve/", {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
                "content-type": "application/json",
                "sec-ch-ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                Referer: "https://rednotevideodownload.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: JSON.stringify({ inputInfo: url }),
            method: "POST"
        })
            .then(async response => {
                let data = await response.json();
                resolve({
                    status: true,
                    url: data.videoInfo[0].url,
                    title: data.title
                });
            })
            .catch(e => {
                reject({ status: false, message: e });
            });
    });
}

export default {
  download 
}
