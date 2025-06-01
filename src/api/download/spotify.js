import axios from "axios";
import fetch from "node-fetch";
import nodeID3 from "node-id3";

async function getToken() {
    const clientId = "3a237eb7df7540818b883b107c768924";
    const clientSecret = "7acfcfd1cc9240519a5ac0de74cba65b";

    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            null,
            {
                params: {
                    grant_type: "client_credentials"
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(clientId + ":" + clientSecret).toString(
                            "base64"
                        )
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        throw error;
    }
}

async function search(query) {
    const accessToken = await getToken();
    try {
        const response = await axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: query,
                type: "track"
            },
            headers: {
                Authorization: "Bearer " + accessToken
            }
        });

        return { status: true, data: response.data.tracks.items };
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        return { status: false, message: error };
    }
}

async function download(url) {
    let headers = {
        accept: "application/json, text/plain, */*",
        "accept-language":
            "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
        "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        Referer: "https://spotifydownload.org/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    };
    return new Promise((resolve, reject) => {
        fetch("https://api.fabdl.com/spotify/get?url=" + url, {
            headers: headers,
            body: null,
            method: "GET"
        })
            .then(async response => {
                let data = await response.json();
                let taks = await (
                    await fetch(
                        `https://api.fabdl.com/spotify/mp3-convert-task/${data.result.gid}/${data.result.id}`,
                        {
                            headers: headers,
                            referrer: "https://spotifydownload.org/",
                            referrerPolicy: "strict-origin-when-cross-origin",
                            body: null,
                            method: "GET",
                            mode: "cors",
                            credentials: "omit"
                        }
                    )
                ).json();
                let progress = await (
                    await fetch(
                        `https://api.fabdl.com/spotify/mp3-convert-progress/${taks.result.tid}`,
                        {
                            headers: headers,
                            body: null,
                            method: "GET"
                        }
                    )
                ).json();
                resolve({
                    status: true,
                    link: "https://api.fabdl.com" + progress.result.download_url
                });
            })
            .catch(e => {
                resolve({ status: false, message: e });
            });
    });
}

// async function download(url) {
//     return new Promise((resolve, reject) => {
//         fetch(
//             "https://spotify-downloader9.p.rapidapi.com/downloadSong?songId=" +
//                 url,
//             {
//                 headers: {
//                     accept: "*/*",
//                     "accept-language":
//                         "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt-BR;q=0.6,pt;q=0.5",
//                     "sec-ch-ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
//                     "sec-ch-ua-mobile": "?1",
//                     "sec-ch-ua-platform": '"Android"',
//                     "sec-fetch-dest": "empty",
//                     "sec-fetch-mode": "cors",
//                     "sec-fetch-site": "cross-site",
//                     "x-rapidapi-host": "spotify-downloader9.p.rapidapi.com",
//                     "x-rapidapi-key":
//                         "d16b314dc2mshf01e8966c172794p1639a7jsn26877985c6f7",
//                     Referer: "https://spotify.downloaderize.com/",
//                     "Referrer-Policy": "strict-origin-when-cross-origin"
//                 },
//                 body: null,
//                 method: "GET"
//             }
//         )
//             .then(async response => {
//                 let res = await response.json();
//                 resolve({ status: true, link: res.data.downloadLink });
//             })
//             .catch(err => {
//                 resolve({ status: false, message: err });
//             });
//     });
// }

export default { search, download };
