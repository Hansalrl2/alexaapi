async function search(search, type) {
    let attempt = 0;
    while (attempt < 5) {
        try {
            const response = await fetch(
                `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Frs%3Dtyped%26q%3D${search}&data=%7B%22options%22%3A%7B%22appliedProductFilters%22%3A%22---%22%2C%22auto_correction_disabled%22%3Afalse%2C%22query%22%3A%22${search}%22%2C%22scope%22%3A%22pins%22%2C%22top_pin_id%22%3A%22%22%2C%22page_size%22%3A%22200%22%7D%2C%22context%22%3A%7B%7D%7D&_=1724845530509`,
                {
                    headers: {
                        accept: "application/json, text/javascript, */*, q=0.01",
                        "accept-language":
                            "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
                        "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
                        "sec-ch-ua-full-version-list":
                            '"Not-A.Brand";v="99.0.0.0", "Chromium";v="124.0.6327.4"',
                        "sec-ch-ua-mobile": "?1",
                        "sec-ch-ua-model": '"Infinix X676C"',
                        "sec-ch-ua-platform": '"Android"',
                        "sec-ch-ua-platform-version": '"12.0.0"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-app-version": "28a0427",
                        "x-pinterest-appstate": "active",
                        "x-pinterest-pws-handler": "www/search.js",
                        "x-pinterest-source-url": `/search/pins/?rs=typed&q=${search}`,
                        "x-requested-with": "XMLHttpRequest",
                        cookie: 'ar_debug=1; csrftoken=6d67c474b53469b59a30e81b30d9accb; _auth=1; _pinterest_sess=TWc9PSZiKzZnRERWWVBqMnpqM2Y3UGtldVczc0ZOcHpnbk5VK2dVOERNUlFMdjUxa3dGbWU3WFhWMGNkQk9STGJqSHBkY1hSZ2ZpR3dINzNzTm5qdVN2bUtxMUZIcGd6Z2VrdTAyU2QzSXM4TWJONjVDQnQwT21iVGcwMUwzaVpNZ0FkV2srYlE4K2tRQjJaRi9HMVZZeFVuaVlGa3R1b1hZYWltLy82bHdIbHRPL2IwZzNkcm5DeHU0VDFkYmlvOXgyK3JIbWI3ZVVBbTZVdHY3MkZxWnpZUDhOL1FYcmI2VDFFcU42RTkzU051eWhraGF3R0JrOGN5b3lnKzY2WDEvSGp2U01xRkJEaklzOHBEckVGZXNxeTFxeGkwM0xmSnRaOGlEMWFqWHlGS0Y5SHQ5UGRJVWpGWisvQ3RvTysvSlRKQXhrT0hKdzlrL1ppNGlEU3BETEpBaWxiQVZ3N0RycGdFUDl4cU81SzBXMC8xTm91K2VlZlVvSENPb0hrWTFuQkFDN3QzQWREMVlGdy96SXZRYnJ1UFJnRmNBZEFHYWxOSmNLUmJiOUJpYkRwVFdCWjBhTThJRTJveDJiQlRoNjFURnp2WmdJeGRsQkJnaEMzTm9hbnVLOHhXQVd2cXF1SEV1dHFhMVkrWUdjUEJ5SS9kWU5BSFB3Y0crM0pqQ3grZlFhRjVmTGdlRm9oZkdNNmtGYm5TR25RcVN5Ym1kMUF1T2J4VGFUa3dDQTNPRDMzYXYxNzhYV1R1b2IwK3gyTThBb3FxaC9rN3hYM3lQb1N2NVNjWDZWRkNxcUcweWpPVEhmNGFiemlQZ1lKdFh1SFluZDczc3Q3TFRxZC8vcktaMDhZRjdwRzhVK3daL0tkaXc0MGV5SXl3cmNLdHpJQmVxeW9vbER0NFpwRHJTenJzenNCOUVVaG8zQ1ovVmVnRWFHcTBMdVJObTlxcXB6MDByZC94eW1kS3FiVzhwTXM1ZWdINEp0K2gzMXpvWHhRMFlHRFVJK3oxYzEya3dNM3dwV1lrMjZJcVpXRVVQbE44NE1qQnozbHVGRE1QNnhSRytRNnZkMEcyNEdKTnlLaEZTanJGMzFYYkJKVEN6WU5jTCt5WlQ2Q2trdlFyaTQxRENZNE5jZElNMmJFTmVmOWFPNGJrOFVGU2lkaWhNTGp1cm0zWGlSRVlrYit6ck1za0wvRWdVMWpLRXE4TlJQN2swbDhXTE95bG5iOFprd3U5eEJYMlZwSHVzbWtOVWdaVTd1aXZqY3lGcVlPS1dWdEhtRFBzQzY4NlhXQk8vamthblhoQUtwWmc2dno1Y3pKYUE0SjRtUmo4SXFvRkJzTnlJa3JDSHhoL0NOdXdrNjNiNjZ5ZTJwVFFUc25UZVdFOG02di9xM09mTzNLOEVqL1VHQVkwZlgyaWp5TW9NdmU5aFY1SjRHVHBST094NmdTMlNZMVlwUU5ObGxJWE9YNzlweVF3Mmp0bzJhN3I0R1dESWw2eVhRb2pqa0tiU2RPVUlId01iQ0pWWmFsZWR0enpCcXNPbnh0QkVkYmFkNzZKOHoxV2gwMkJYTmx1czJTNUFucDJnY0NCWXdrSXhnNXV2M3hnUFo5MFp1Uk15TWMrR0hlQ0NYTlhOSHFzT2ZrZW5mckxuL2tMRTFKRDd5VmowbUlNeUh4NW5aV1pxOGpteUJuN3cra2pZTThaaWREV0ZrME5OL3hWVlo0WVZFVFFTUS80NW9vQmpPNTJnMXpXKytyOHFHOW4rNHMwTnBLb1EvbS9yQkN4dzhpaDBHakEmd0Q1M0QwSmUyL29WdDJEaEEzKzlNWllmTUxNPQ==; __Secure-s_a=anFydWM0Vkh0TjZYNEx2NWhpdy9YUDkvUDN3MkhDTnpjM0x0aWowZUxzL2RJa3V2QU0xQUU5TmtwYTlIWUpINVpSb0hLTldxWmgvN1VXcjdtbVVIRzdBNktsRlJzYW53TE1kSE92MS90YnhIRVJsSkdDOUZjZDNNM2loTTVQamZWOGZ3QWRWMFh2RkZTY1VYSTdOTndnbmxzUUFUOUNsSEpXZ0tJQ1d6by9IQmlHczJsQ0xJdStYQ1lEOXF4TUYvUldQbU51QkZYUVpiZ2tJTCt1MXFNdlJiS2k4OVdqUmNtak0wZi8wVUVueDMwS0xIZUEveW1JeU53RjdqS2NsSnorZ2FOMWszREZwcmQ1L3BXSEMxZHpaaWxqT3V6NllWcmJ3K1pFYVo5azU0cmhpT2tsQ1BsRTdoNUQrcEpvTTl3aXdnY3JKWjNPSEU2SFpDQXpTS0s5SEVUV3hVSndKdk9NYjdsbTFzNXZKUWtsbEtIV05uWnZaM2kwNk92d0k5N1g5Tkg0alJldzA1QzYxU2xVcjJIU1BZYm1FMzJwMG5QWEhnR0xmdmNmWkw5U1ZSbjNZZ0p6eko0d1ZkRm10M1pnZTFPRDBKQzdXbkVDNEJPNlp1UmhsTno1dFNyTm14b0w4OXpjOExhYWdwcDFsNU5LSGlGc1RwZFZXWEpFd0JpZDRVUXUwdVNRTDFmUjJmYWR4Zjc3RzZPQUF4ays0WXJubDZRb1pHeFEyYVVCK1lFcVNibFNuSmlKMGJ3cTZWdjdZcUlWSnBzbmRXM29xZVhrczRZZmo0S3ZqcUptVmovbkxESktnTzhpQ3hkQzhsL0pHZ095L1VLNkQzVG5OSUZJdi9QeU52blJSN25xZFFtV29LVGpNOTZMUmJidHJCUEZRMk1wOEJNZGRDMDc2NXROaXZsa3kvTkxHbVhIb1J4R0xzT2IzQm1DOGdnU0hqWEhUazdIZnJJeUROWGpDTmdaR3pUb2dkUkVFSnIwd1U0cit2aVJPNGNQekphODRWdmZKeHNxQk91a1VEekpiM1MxR3FLNVd1ek5vcGEvU0NnSWVVRnd2dXBlYlo2bjFYK2JqK2JpZExsQ1BSVWVGSm9BNldMSUMzY2dVdnRmRHhpSWlmcEpMWGFXRWhWcDhrU3dyb1VLdlkxZ1pIZWNEaDJiaWNSUGFhUS81S21nS3NVejZ5QU10TTVOWVMzRnVNVlQ2UmZXOC9PZHY1dHpuREhycWpTbjBPQWNtY1JuSm93Y0Y5aHNYTTJuM3k5RGNxTVF6aDVrUE1nVGdCc3Bad0FFQ0wzZUhYQlEyMVpWempOYmtaWE9ZempYWT0mMzBzeEQ1TnpZcG9VbHM2enBSemJDeFNnUjBRPQ==; _b="AX+ZFp5+skhILI4Q+XhNaewhilt2xI9Rxd3jFZQSmtdP86gu8IVATInSOqrJnCX36MI="; _routing_id="a97d480d-987a-4acf-904c-7d085b9e6838"; sessionFunnelEventLogged=1',
                        Referer: "https://id.pinterest.com/",
                        "Referrer-Policy": "origin"
                    },
                    body: null,
                    method: "GET"
                }
            );
            const jsonData = await response.json();
            const results = jsonData.resource_response.data.results;
            const imageUrls = results
                .map(result => ({
                    status: true,
                    created_at: result.created_at,
                    title: result.title.trim() || result.board.name,
                    description:
                        result.description.trim() ||
                        result.auto_alt_text ||
                        result.board.name,
                    link_url: `https://www.pinterest.com/pin/${result.id}`,
                    url: result.images?.orig?.url
                }))
                .filter(Boolean);
            const videoUrls = results
                .map(result => {
                    const videoUrl =
                        result.story_pin_data?.pages_preview?.[0]?.blocks?.[0]
                            ?.video?.video_list?.V_EXP7;
                    if (!videoUrl) return null;
                    return {
                        status: true,
                        created_at: result.created_at,
                        title: result.title.trim() || result.board.name,
                        description:
                            result.description.trim() ||
                            result.auto_alt_text ||
                            result.board.name,
                        link_url: `https://www.pinterest.com/pin/${result.id}`,
                        url: videoUrl.url
                    };
                })
                .filter(Boolean);
            let result = /vid(i|e)os?/.test(type)
                ? videoUrls
                : /(images?|photos?)/.test(type)
                ? imageUrls
                : [...imageUrls.slice(0, 20), ...videoUrls];
            return result[Math.floor(Math.random() * result.length)];
        } catch (error) {
            attempt++;
            console.error(`Error fetching image: ${error}`);
            if (attempt === 5) {
                return {
                    status: false,
                    message: error
                };
            }
        }
    }
}

async function download(url) {
    return new Promise((resolve, reject) => {
        fetch("https://pintodown.com/wp-admin/admin-ajax.php", {
            headers: {
                accept: "*/*",
                "accept-language":
                    "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
                "content-type":
                    "multipart/form-data; boundary=----WebKitFormBoundaryhQ2UQFxJ9dCG2p8B",
                "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                cookie: "_ga=GA1.1.1598067113.1726981302; cf_clearance=0GCyshSeD2siuOh1zDL7RrwOdLUVFWahZTNnvXxI_Ws-1726981568-1.2.1.1-7MPCL_gt1dfZFhG3YU.XJ8dtL.iwG5WOYgiG69gNKn0RKm5KqZfet6UY4mH2X2e7AzPDOR52IQQwT3CCctutOaGQQ1453WpTm2t4Wm7uODIkvlZ1dOCBylnyrmxd2vAVJDlVfV8Qb3pgVyeyB0XXnHD7DJTmsTU3fHCIABEsegM6NvKicAlaDecrNUJJKOc8Nkq.L14p6xi61oprLo9Y84GrEU4SEU52WSmAOZ89FWMZluWMy6q4aGLEjWv.EtGF0ktpm1ohl9OHwhJNprsU4heuCtm0pKapltnNEa.DB5.OIbDuU7lSKMKNkCUCsyJ7LRh4ew569iHi5VyebrNj1RMfm5dPzLxLh5BK09ZF7s7zb48E00ij8K5KO7_rF7Dk8RguFxcOU4gfzpYWQtxwww; _ga_0EP6QTDYXV=GS1.1.1726981301.1.1.1726981567.0.0.0",
                Referer: "https://pintodown.com/id/",
                "Referrer-Policy": "same-origin"
            },
            body:
                '------WebKitFormBoundaryhQ2UQFxJ9dCG2p8B\r\nContent-Disposition: form-data; name="action"\r\n\r\npinterest_action\r\n------WebKitFormBoundaryhQ2UQFxJ9dCG2p8B\r\nContent-Disposition: form-data; name="pinterest"\r\n\r\nis_private_video=&pinterest_video_url=' +
                encodeURIComponent(url) +
                "\r\n------WebKitFormBoundaryhQ2UQFxJ9dCG2p8B--\r\n",
            method: "POST"
        })
            .then(async res => {
                let data;
                let result = { status: false }; // Initialize with false
                let attempts = 0;
                while (attempts < 5 && !result.status) {
                    data = await res.json();
                    if (data.success) {
                        result = {
                            status: true,
                            url: data.data.image || data.data.video || false
                        };
                    }
                    attempts++;
                }
                resolve(result);
            })
            .catch(e => {
                let result = {
                    status: false,
                    message: "Gagal mendapatkan metadata download"
                };
                resolve(result);
            });
    });
}

export default {
    search,
    download
};
