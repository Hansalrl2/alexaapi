import * as cheerio from "cheerio";
import axios from "axios";
import fetch from "node-fetch";
async function gitagram(query) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                `https://www.gitagram.com/?s=${encodeURIComponent(
                    query
                ).replace(/%20/g, "+")}`
            )
            .then(async search => {
                const $ = await cheerio.load(search.data);
                const $url = $("table.table > tbody > tr")
                    .eq(0)
                    .find("td")
                    .eq(0)
                    .find("a")
                    .eq(0);
                const url = $url.attr("href");
                const song = await axios.get(url);
                const $song = await cheerio.load(song.data);
                const $hcontent = $song("div.hcontent");
                const artist = $hcontent
                    .find("div > a > span.subtitle")
                    .text()
                    .trim();
                const artistUrl = $hcontent.find("div > a").attr("href");
                const title = $hcontent.find("h1.title").text().trim();
                const chord = $song("div.content > pre").text().trim();
                const result = {
                    status: true,
                    url: url,
                    artist,
                    artistUrl,
                    title,
                    chord
                };
                resolve(result);
            })
            .catch(err => {
                resolve({ status: false, message: err });
            });
    });
}

async function genius(query) {
    return new Promise((resolve, reject) => {
        fetch("https://genius.com/api/search/multi?q=" + query, {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language":
                    "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
                "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie: "_genius_ab_test_cohort=9; genius_ana_integration_rollout_cohort=35.32280272807042; _scor_uid=dbbac8eefffb49a19eeb560bc887417e; _ga_BJ6QSCFYD0=GS1.1.1743640024.1.0.1743640024.60.0.0; _ga=GA1.1.297854104.1743640024; _ga_JRDWPGGXWW=GS1.1.1743640029.1.0.1743640029.0.0.0; _awl=2.1743640030.5-85d4da19bf6d066808b31e623674abed-6763652d617369612d6561737431-1; genius_first_impression=1743640036376; mp_77967c52dc38186cc1aadebdd19e2a82_mixpanel=%7B%22distinct_id%22%3A%20%22%24device%3A195f90bb1ed7041-002fef44be8a9d-b457452-65400-195f90bb1ee7042%22%2C%22%24device_id%22%3A%20%22195f90bb1ed7041-002fef44be8a9d-b457452-65400-195f90bb1ee7042%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22AMP%22%3A%20false%2C%22genius_platform%22%3A%20%22web%22%2C%22user_agent%22%3A%20%22Mozilla%2F5.0%20(Linux%3B%20Android%2010%3B%20K)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F132.0.0.0%20Mobile%20Safari%2F537.36%22%2C%22assembly_uid%22%3A%20%22292aae81-8364-454d-8817-8ef68557db68%22%2C%22ana_sdk_version%22%3A%20%225.20.0%22%7D; flash=%7B%7D; _csrf_token=Hk7buJ8XlKiSWuk6SCv0ssXCFADbMP77mdhE1IQZv64%3D; _rapgenius_session=BAh7BzoPc2Vzc2lvbl9pZEkiJWI4ZDgxODdhNzY3NjBlMDkzNjc4OGJlMmM5YmVhYjFkBjoGRUY6EF9jc3JmX3Rva2VuSSIxSGs3YnVKOFhsS2lTV3VrNlNDdjBzc1hDRkFEYk1QNzdtZGhFMUlRWnY2ND0GOwZG--f3d15e09f0f3f3136f89d0f0f3ee43647d2442b4",
                Referer: "https://genius.com/search/embed",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: null,
            method: "GET"
        })
            .then(async response => {
                const res = await response.json();
                const result = res.response.sections
                    .filter(
                        section =>
                            section.type === "song" || section.type === "lyric"
                    )
                    .flatMap(section => section.hits)
                    .map(v => {
                        return {
                            title: v.result.full_title,
                            url: v.result.path,
                            thumb: v.result.song_art_image_url
                        };
                    });
                if (!result[0]) {
                    resolve({
                        status: false,
                        message: "Lirik lagu tidak ditemukan"
                    });
                }
                resolve({ status: true, data: result });
            })
            .catch(err => {
                resolve({ status: false, message: err });
            });
    });
}

async function geniusLyric(url) {
    return new Promise((resolve, reject) => {
        fetch("https://genius.com" + url, {
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language":
                    "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
                "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                cookie: "_genius_ab_test_cohort=9; genius_ana_integration_rollout_cohort=35.32280272807042; _scor_uid=dbbac8eefffb49a19eeb560bc887417e; _ga=GA1.1.297854104.1743640024; _ab_tests_identifier=5dee2d5c-1aca-4a3c-84bb-d93d59adad85; genius_outbrain_rollout_percentage=98; mp_77967c52dc38186cc1aadebdd19e2a82_mixpanel=%7B%22distinct_id%22%3A%20%22%24device%3A195f90bb1ed7041-002fef44be8a9d-b457452-65400-195f90bb1ee7042%22%2C%22%24device_id%22%3A%20%22195f90bb1ed7041-002fef44be8a9d-b457452-65400-195f90bb1ee7042%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22AMP%22%3A%20false%2C%22genius_platform%22%3A%20%22web%22%2C%22user_agent%22%3A%20%22Mozilla%2F5.0%20(Linux%3B%20Android%2010%3B%20K)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F132.0.0.0%20Mobile%20Safari%2F537.36%22%2C%22assembly_uid%22%3A%20%22292aae81-8364-454d-8817-8ef68557db68%22%2C%22ana_sdk_version%22%3A%20%225.20.0%22%7D; _csrf_token=3fUYfb3U2plQAmDxsWMQro43GpeTrEB7FWrGU0V8m3c%3D; _rapgenius_session=BAh7BzoPc2Vzc2lvbl9pZEkiJWI4OWJkZWZhYTg1NzNhODQ3OTI4YzNiMzJhMTRlMmEwBjoGRUY6EF9jc3JmX3Rva2VuSSIxM2ZVWWZiM1UycGxRQW1EeHNXTVFybzQzR3BlVHJFQjdGV3JHVTBWOG0zYz0GOwZG--4724588a65ab5e6b6cdcf6dccf306767d2f9fede; genius_first_impression=1743774895911; _awl=2.1743774921.5-85d4da19bf6d066808b31e623674abed-6763652d617369612d6561737431-1; _ga_BJ6QSCFYD0=GS1.1.1743774896.3.1.1743774922.34.0.0; _ga_JRDWPGGXWW=GS1.1.1743774898.3.1.1743774922.0.0.0",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: null,
            method: "GET"
        })
            .then(async response => {
                const html = await response.text();
                const $ = cheerio.load(html);
                let lyrics = "";
                $('div[data-lyrics-container="true"]').each((i, elem) => {
                    // Ambil semua teks dari elemen ini, tetapi hapus teks dari elemen yang memiliki data-exclude-from-selection
                    $(elem)
                        .find('[data-exclude-from-selection="true"]')
                        .remove(); // Hapus elemen yang dikecualikan

                    // Ambil teks dari elemen yang tersisa
                    if ($(elem).text().length) {
                        const snippet = $(elem)
                            .html()
                            .replace(/<br>/g, "\n")
                            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
                        lyrics +=
                            $("<textarea/>").html(snippet).text().trim() +
                            "\n\n";
                    }
                });
                if (lyrics === "") {
                    resolve({ status: false, message: "Gagal mengambil data" });
                }
                resolve({ status: true, data: lyrics });
            })
            .catch(err => {
                resolve({ status: false, message: err });
            });
    });
}

export default {
    gitagram,
    genius,
    geniusLyric
};
