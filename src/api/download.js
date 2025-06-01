import axios from "axios";
import * as cheerio from "cheerio";

class Download {
    constructor(url) {
        this.url = url;
    }

    async aptoide() {
        return new Promise((resolve, reject) => {
            fetch(
                `https://ws75.aptoide.com/api/7/apps/search?query=${this.url}&limit=1`
            )
                .then(async response => {
                    let res = await response.json();
                    resolve({
                        status: true,
                        img: res.datalist.list[0]?.icon,
                        developer: res.datalist.list[0]?.store.name,
                        appname: res.datalist.list[0]?.name,
                        link: res.datalist.list[0]?.file.path
                    });
                })
                .catch(e => {
                    reject({
                        status: false,
                        message: e
                    });
                });
        });
    }

    async douyin() {
        return new Promise((resolve, reject) => {
            fetch("https://savetik.co/api/ajaxSearch", {
                headers: {
                    accept: "*/*",
                    "content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-requested-with": "XMLHttpRequest",
                    cookie: "_ga_4ZEZMTBFLJ=GS1.1.1743746280.1.0.1743746280.0.0.0; _ga=GA1.1.668734570.1743746281",
                    Referer: "https://savetik.co/id1"
                },
                body: `q=${encodeURIComponent(this.url)}&lang=id&cftoken=`,
                method: "POST"
            })
                .then(async response => {
                    const html = await response.json();
                    const $ = cheerio.load(html.data);
                    let results = {
                        status: true,
                        music: "",
                        video: "",
                        image: []
                    };
                    results.music =
                        $("a#ConvertToVideo").data("audiourl") || "";
                    const photos = [];
                    $(
                        "div.photo-list ul.download-box li div.download-items__thumb img"
                    ).each((index, element) => {
                        const imageUrl = $(element).attr("src");
                        if (imageUrl) {
                            photos.push(imageUrl);
                        }
                    });
                    $(".tik-button-dl.button.dl-success").each(
                        (index, element) => {
                            const link = $(element).attr("href");
                            const text = $(element).text().trim();
                            if (link && text.includes("Unduh MP3")) {
                                results.music = link;
                            }
                        }
                    );
                    const videoUrls = [];
                    $("a.tik-button-dl").each((index, element) => {
                        videoUrls.push($(element).attr("href"));
                    });
                    if (photos.length > 0) {
                        photos.forEach(imageUrl => {
                            results.image.push({
                                type: "Photo",
                                url: imageUrl
                            });
                        });
                    }
                    if (videoUrls.length > 1) {
                        results.video = videoUrls[1];
                    }
                    resolve(results);
                })
                .catch(e => {
                    console.error("Error:", e);
                    reject({ status: false, message: e });
                });
        });
    }

    async facebook() {
        return new Promise((resolve, reject) => {
            fetch("https://getvidfb.com/", {
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "content-type": "application/x-www-form-urlencoded",
                    cookie: "cfzs_google-analytics_v4=%7B%22Zblq_pageviewCounter%22%3A%7B%22v%22%3A%221%22%7D%7D; cf_clearance=115EvR4FFanYgtNeq_poyYaFEEpeltaa8fWPbkMUPVc-1743813316-1.2.1.1-EQqF4DcAyOTkRp9Yt0XFxRx0VRdym89mW0IGKsNcMyB7X4uJ5uSR2W4jV1ZxgbjQRhzOON0yDSaHOY6Sp_2DhIFYw1fhmG8z5FImTKORkp808OoHII4O.s_iE_oK.gWcVVtHmMSfDF8OiP_KjctwwXVt4DcJzkxxDwYwDRAfiAWTfkIdGppEliUhJrnyROK1x.AfNUYM.8AfS5kgXxqkxbsdYiWf.w62b3xBN6f1iJ2X35DI39yI0RG6Q2ede1FbGls.Qt1SoY7uMqVMwqAlikB_amBIulrcvQkJ1wAUOLGrHi2NHoocw0QD2YbSXxQkP7ajFz2_yASOTBzIb990qlXXgj.NVBCcibx4O4nG_RY; cfz_google-analytics_v4=%7B%22Zblq_engagementDuration%22%3A%7B%22v%22%3A%220%22%2C%22e%22%3A1775349334147%7D%2C%22Zblq_engagementStart%22%3A%7B%22v%22%3A1743813334472%2C%22e%22%3A1775349335997%7D%2C%22Zblq_counter%22%3A%7B%22v%22%3A%222%22%2C%22e%22%3A1775349334147%7D%2C%22Zblq_ga4sid%22%3A%7B%22v%22%3A%221269361913%22%2C%22e%22%3A1743815134147%7D%2C%22Zblq_session_counter%22%3A%7B%22v%22%3A%221%22%2C%22e%22%3A1775349334147%7D%2C%22Zblq_ga4%22%3A%7B%22v%22%3A%22c77b6ac5-0a7b-4e95-950b-96c667e9543a%22%2C%22e%22%3A1775349334147%7D%2C%22Zblq__z_ga_audiences%22%3A%7B%22v%22%3A%22c77b6ac5-0a7b-4e95-950b-96c667e9543a%22%2C%22e%22%3A1775349315243%7D%2C%22Zblq_let%22%3A%7B%22v%22%3A%221743813334147%22%2C%22e%22%3A1775349334147%7D%7D",
                    Referer: "https://getvidfb.com/id"
                },
                body: `url=${this.url}&lang=id&type=redirect`,
                method: "POST"
            })
                .then(async response => {
                    let html = await response.text();
                    let $ = cheerio.load(html);
                    let downloadLinks = {};
                    $(".abuttons .abutton").each((i, elem) => {
                        const link = $(elem).attr("href");
                        const title = $(elem).find("span").text();
                        if (title.includes("SD")) {
                            downloadLinks.sd = link;
                        } else if (title.includes("HD")) {
                            downloadLinks.hd = link;
                        }
                    });
                    let link = downloadLinks.hd || downloadLinks.sd;
                    if (!link) {
                        resolve({ status: false, message: "Gabisa" });
                    }
                    resolve({
                        status: true,
                        url: link
                    });
                })
                .catch(e => {
                    reject({ status: false, message: e });
                });
        });
    }

    async gdrive() {
        let id = (this.url.match(/\/?id=(.+)/i) || this.url.match(/\/d\/(.*?)\//))?.[1];
        if (!id) throw "ID Not Found";
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `https://drive.google.com/uc?id=${id}&authuser=0&export=download`,
                    {},
                    {
                        headers: {
                            "accept-encoding": "gzip, deflate, br",
                            "content-length": 0,
                            "Content-Type":
                                "application/x-www-form-urlencoded;charset=UTF-8",
                            origin: "https://drive.google.com",
                            "user-agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                            "x-client-data":
                                "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
                            "x-drive-first-party": "DriveWebUi",
                            "x-json-requested": "true"
                        }
                    }
                )
                .then(async res => {
                    let { fileName, sizeBytes, downloadUrl } = JSON.parse(
                        res.data.slice(4)
                    );
                    if (!downloadUrl) throw "Link Download Limit!";
                    let data = await axios.get(downloadUrl, {
                        responseType: "arraybuffer"
                    });
                    if (data.status !== 200) throw data.statusText;
                    resolve({
                        status: true,
                        url: downloadUrl,
                        title: fileName,
                        size: (sizeBytes / 1024 / 1024).toFixed(2),
                        mimetype: data.headers["content-type"]
                    });
                })
                .catch(e => {
                    reject({ status: false, message: e });
                });
        });
    }
}

export default Download;
