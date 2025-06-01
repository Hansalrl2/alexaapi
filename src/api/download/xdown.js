import * as cheerio from "cheerio"
import fetch from "node-fetch"

async function down(url) {
  return new Promise((resolve, reject) => {
    fetch("https://twdown.net/download.php", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "_ga=GA1.2.745666453.1726414014; _gid=GA1.2.1514604630.1726414014; _gat=1; __gads=ID=56af0663e367afae:T=1726414015:RT=1726414015:S=ALNI_MZVxHLiyb45vDY--seTBERbn-WDXQ; __gpi=UID=00000f09ee132064:T=1726414015:RT=1726414015:S=ALNI_MYhs88gmIkImKp3GtZJ95yuXLyJOA; __eoi=ID=f7689beb3513712d:T=1726414015:RT=1726414015:S=AA-AfjZH0JLzMKMmEu8n-lgANcrJ; _ga_216B07P8FE=GS1.2.1726414014.1.0.1726414014.0.0.0",
        "Referer": "https://twdown.net/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "URL=" + url,
      "method": "POST"
    }).then(async (data) => {
      const $ = cheerio.load(await data.text());
      let result = {
        status: true,
        desc: $('div:nth-child(1) > div:nth-child(2) > p').length > 0 ? $('div:nth-child(1) > div:nth-child(2) > p').text().trim() : '',
        thumb: $('div:nth-child(1) > img').length > 0 ? $('div:nth-child(1) > img').attr('src') : '',
        sd: $('tr:nth-child(2) > td:nth-child(4) > a').length > 0 ? $('tr:nth-child(2) > td:nth-child(4) > a').attr('href') : false,
        hd: $('tbody > tr:nth-child(1) > td:nth-child(4) > a').length > 0 ? $('tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href') : false,
        audio: 'https://twdown.net/' + $('tbody > tr:nth-child(4) > td > a').attr('href')
      };
      resolve(result)
    }).catch((e) => {
      resolve({ status: false, message: e })
    })
  })
}

export default {
  down
}