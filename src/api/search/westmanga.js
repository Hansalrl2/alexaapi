import * as cheerio from "cheerio"

async function search(query) {
  return new Promise((resolve, reject) => {
    fetch("https://westmanga.fun/?s=" + encodeURIComponent(query), {
      "headers": {
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "upgrade-insecure-requests": "1",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      const $ = cheerio.load(res);
      const result = [];

      $('.bs .bsx').each((i, el) => {
        const title = $(el).find('.tt').text().trim();
        const chapter = $(el).find('.epxs').text().trim();
        const mangaUrl = $(el).find('a').attr('href');
        let imgUrl = $(el).find('img').attr('src');
        imgUrl = imgUrl.replace(/-\d+x\d+\.(jpg|jpeg|png)$/, '.jpg');

        result.push({ title, chapter, mangaUrl, imgUrl });
      });
      if (!result[0]) {
        resolve({ status: false, message: "Judul manga tidak ditemukan" })
      }
      resolve({ status: true, data: result })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

async function details(url) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      "headers": {
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "upgrade-insecure-requests": "1",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      const $ = cheerio.load(res);
      const details = {
        title: $('.entry-title').text().trim(),
        alternateTitle: $('.seriestualt').text().trim(),
        image: $('.thumb img').attr('src'),
        description: $('.entry-content.entry-content-single p').text().trim(),
        genres: [],
        status: $('.seriestucont .seriestucontr .infotable tbody tr:nth-child(1) td:nth-child(2)').text().trim(),
        author: $('.seriestucont .seriestucontr .infotable tbody tr:nth-child(3) td:nth-child(2)').text().trim(),
        postedBy: $('.seriestucont .seriestucontr .infotable tbody tr:nth-child(4) td .author i').text().trim(),
        postedOn: $('.seriestucont .seriestucontr .infotable tbody tr:nth-child(5) td time').text().trim(),
        updatedOn: $('.seriestucont .seriestucontr .infotable tbody tr:nth-child(6) td time').text().trim(),
        rating: $('.rating .num').text().trim(),
      };

      $('.seriestugenre a').each((i, el) => {
        details.genres.push($(el).text().trim());
      });
      const chapters = [];
      $('#chapterlist ul li').each((i, el) => {
        const number = $(el).data('num');
        const link = $(el).find('.eph-num a').attr('href');
        const date = $(el).find('.chapterdate').text().trim();
        const title = $(el).find('.chapternum').text().trim();

        chapters.push({
          number,
          title,
          link,
          date,
        });
      })
      resolve({ status: true, data: details, chapter: chapters })
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
        "upgrade-insecure-requests": "1",
        "cookie": "popundr1=1; dsq__=mc9iociggojc",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      const $ = cheerio.load(res);
      const imgUrls = [];

      $('script').each((i, el) => {
        const scriptContent = $(el).html();
        const imgRegex = /"images":\["(.*?)"\]/;
        const match = scriptContent.match(imgRegex);
        if (match && match[1]) {
          imgUrls.push(...match[1].split('","'));
        }
      });
      if (!imgUrls[0]) {
        resolve({ status: false, message: "Gagal mengambil data" })
      }
      resolve({ status: true, data: imgUrls })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

export default {
  search,
  details,
  download
};