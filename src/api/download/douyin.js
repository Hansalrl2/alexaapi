import fetch from "node-fetch"
import * as cheerio from "cheerio"

async function download(url) {
    try {
        const response = await fetch("https://savetik.co/api/ajaxSearch", {
            headers: {
                accept: "*/*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie: "_ga_4ZEZMTBFLJ=GS1.1.1743746280.1.0.1743746280.0.0.0; _ga=GA1.1.668734570.1743746281",
                Referer: "https://savetik.co/id1",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: `q=${encodeURIComponent(url)}&lang=id&cftoken=`,
            method: "POST"
        });

        // Mengambil data JSON dari response
        const html = await response.json();
        const $ = cheerio.load(html.data);
        
        let results = {
            status: true,
            music: "",
            video: "",
            image: []
        };

        // Mengambil URL audio
        results.music = $("a#ConvertToVideo").data("audiourl") || "";

        // Mengambil URL gambar
        const photos = [];
        $("div.photo-list ul.download-box li div.download-items__thumb img").each((index, element) => {
            const imageUrl = $(element).attr("src");
            if (imageUrl) {
                photos.push(imageUrl);
            }
        });

        // Mengambil link download audio
        $(".tik-button-dl.button.dl-success").each((index, element) => {
            const link = $(element).attr("href");
            const text = $(element).text().trim();

            // Memastikan link adalah link download audio
            if (link && text.includes("Unduh MP3")) {
                results.music = link;
            }
        });

        // Mengambil link video
        const videoUrls = [];
        $("a.tik-button-dl").each((index, element) => {
            videoUrls.push($(element).attr("href"));
        });

        // Menyimpan gambar ke dalam results
        if (photos.length > 0) {
            photos.forEach(imageUrl => {
                results.image.push({
                    type: "Photo",
                    url: imageUrl
                });
            });
        }

        // Menyimpan video jika ada lebih dari satu
        if (videoUrls.length > 1) {
            results.video = videoUrls[1];
        }
        return results;
    } catch (error) {
        console.error("Error:", error);
        return { status: false, message: error.message };
    }
}

export default {
  download 
}