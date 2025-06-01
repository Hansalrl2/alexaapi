import * as cheerio from "cheerio"

async function search(query) {
  return new Promise((resolve, reject) => {
    fetch("https://api.komiku.id/?post_type=manga&s=" + encodeURIComponent(query), {
      "headers": {
        "accept": "*/*",
        "accept-language": "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Referrer-Policy": "no-referrer-when-downgrade"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      const $ = cheerio.load(res);

      const data = [];

      $('.bge').each((index, element) => {
        const item = {};
        // Judul 2
        item.title = $(element).find('.judul2').text().trim();
        // Update
        item.update = $(element).find('p').text().split('.')[0].trim();
        // Akhir Chapter
        item.chapter = $(element).find('.new1:last-of-type a span:last-of-type').text().trim();
        // Image
        item.imgUrl = $(element).find('img').attr('src');
        // Link path
        item.mangaUrl = "https://komiku.id" + $(element).find('.bgei a').attr('href');
        data.push(item);
      });
      if (!data[0]) {
        resolve({ status: false, message: "Judul manga tidak ditemukan" })
      }
      resolve({ status: true, data: data })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

async function details(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "__ddg9_=114.10.16.98; __ddg1_=mG3pBBMwdY9UrtwAFpUZ; __ddg8_=yB349eSoJt0qIITY; __ddg10_=1730786840",
        "Referrer-Policy": "no-referrer-when-downgrade"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      const $ = cheerio.load(res);
      const image = $('img[itemprop="image"]').attr('src');
      const title = $('h1 span[itemprop="name"]').text().trim();
      const description = $('.desc').text().trim();
      const indonesia = $('.inftable tr:nth-child(2) td:last-child').text().trim();
      const jenis = $('.inftable tr:nth-child(3) td:last-child b').text().trim();
      const konsep = $('.inftable tr:nth-child(4) td:last-child').text().trim();
      const author = $('.inftable tr:nth-child(5) td:last-child').text().trim();
      const status = $('.inftable tr:nth-child(6) td:last-child').text().trim();
      const umurPembaca = $('.inftable tr:nth-child(7) td:last-child').text().trim();
      const genres = $('.genre span').map((i, el) => $(el).text().trim()).get();
      const chapterData = [];
      $('#Daftar_Chapter tbody tr').each((index, element) => {
        const title = $(element).find('.judulseries a').text().trim();
        const tanggal = $(element).find('.tanggalseries').text().trim();
        const link = $(element).find('.judulseries a').attr('href');
        const pembaca = $(element).find('.pembaca i').text().trim();
        if (index > 0) {
          chapterData.push({
            title,
            tanggal,
            link,
            pembaca
          });
        }
      });
      let data = {
        title,
        image,
        description,
        indonesia,
        jenis,
        konsep,
        author,
        status,
        umurPembaca,
        genres,
        chapterData
      }

      resolve({ status: true, data: data })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

async function download(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "__ddg1_=mG3pBBMwdY9UrtwAFpUZ; __ddg9_=114.10.16.98; _ga=GA1.1.24504727.1730788489; __ddg8_=ud4bblslUAoNgBga; __ddg10_=1730788697; _ga_ZEY1BX76ZS=GS1.1.1730788489.1.1.1730789222.0.0.0",
        "Referer": "https://komiku.id/manga/renge-to-naruto/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      let $ = cheerio.load(res)
      const title = $('title').text().trim();
      const releaseDateElement = $('tbody[data-test="informasi"] tr:nth-child(2) td:nth-child(2)');
      const releaseDate = releaseDateElement.text().trim();
      const images = []
      $('img[itemprop="image"]').each((index, element) => {
        const onerrorAttribute = $(element).attr('onerror');
        if (onerrorAttribute) {
          const imageUrl = onerrorAttribute.split("this.src='")[1].split("';")[0];
          images.push(imageUrl);
        }
      });

      let data = {
        title,
        releaseDate,
        images, // Array of image URLs
      }
      resolve({ status: true, data: data })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

export default {
  search,
  details,
  download
}