import * as cheerio from "cheerio"

async function character(name) {
  return new Promise((resolve, reject) => {
    fetch("https://otakotaku.com/character/search?q=" + name + "&q_filter=character", {
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
        "cookie": "log_pencarian=%5B%22151869%22%5D; PHPSESSID=qak9fkve390d4q09oqe4fnaul4; lang=id; tknoo=47f4d113d6dcf47b94fa754af28306ab; ci_session=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%22d1424f329a8ce2292263199c1a2e843e%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A14%3A%22108.162.227.71%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A111%3A%22Mozilla%2F5.0+%28Linux%3B+Android+10%3B+K%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F124.0.0.0+Mobile+Safari%2F537.36%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1730774081%3Bs%3A9%3A%22user_data%22%3Bs%3A0%3A%22%22%3B%7Da2535b7c2a71a5593d4bdc571fbdcce7",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      const $ = cheerio.load(res);
      const characterData = [];
      $('.char-list').each((i, char) => {
        const name = $(char).find('.char-name a').text().trim();
        const link = $(char).find('.char-name a').attr('href');
        const japanese = $(char).find('.char-jp-name').text().trim();
        const image = $(char).find('.char-img a img').attr('src');
        const voiceActor = $(char).find('.char-nickname a').map((i, a) => $(a).text().trim()).get().join(', ');
        const anime = $(char).find('.col-md-7 small a').map((i, a) => $(a).text().trim()).get().join(', ');
        characterData.push({
          name,
          link,
          japanese,
          image,
          voiceActor,
          anime,
        });
      });

      if (!characterData[0]) {
        resolve({ status: false, message: "Karakter tidak ditemukan" })
      }
      resolve({ status: true, data: characterData })
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
        "cookie": "character_view=%5B%2227497%22%5D; log_pencarian=%5B%22151869%22%5D; PHPSESSID=qak9fkve390d4q09oqe4fnaul4; lang=id; tknoo=47f4d113d6dcf47b94fa754af28306ab; ci_session=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%2248f3aa8162fc8d995caceefa5cd510fe%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A14%3A%22108.162.227.71%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A111%3A%22Mozilla%2F5.0+%28Linux%3B+Android+10%3B+K%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F124.0.0.0+Mobile+Safari%2F537.36%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1730777913%3Bs%3A9%3A%22user_data%22%3Bs%3A0%3A%22%22%3B%7D518d71f482ddc9e36570ff3c41ab9ea6",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    }).then(async (response) => {
      let res = await response.text()
      const $ = cheerio.load(res);
      const characterData = {
        name: $('.col-md-12 h3').text().trim(),
        jepang: $('td:contains("Jepang") + td').text().trim(),
        alias: $('td:contains("Alias") + td').text().trim(),
        tanggalLahir: $('td:contains("Tanggal Lahir") + td').text().trim(),
        jenisKelamin: $('td:contains("Jenis Kelamin") + td').text().trim(),
        tinggiBadan: $('td:contains("Tinggi Badan") + td').text().trim(),
        beratBadan: $('td:contains("Berat Badan") + td').text().trim(),
        golonganDarah: $('td:contains("Gol. Darah") + td').text().trim(),
        karakteristik: $('.karakteristik_value a').map((i, el) => $(el).text().trim()).get(),
        deskripsi: $('#des_char p').text().trim(),
        pengisiSuara: [],
        anime: [],
      };

      // Scrape pengisi suara
      $('.anime-char-list').each((i, el) => {
        const nama = $(el).find('.anime-detail .anime-title a').text().trim();
        const bahasa = $(el).find('.anime-detail small').text().trim();
        if (nama && bahasa.startsWith('Bahasa:')) { // Check if "bahasa" starts with "Bahasa:"
          characterData.pengisiSuara.push({ nama, bahasa: bahasa.replace('Bahasa: ', '') });
        }
      });

      // Scrape anime
      $('.anime-char-list').each((i, el) => {
        const animeTitle = $(el).find('.anime-detail .anime-title a').text().trim();
        const animeUrl = $(el).find('.anime-detail .anime-title a').attr('href');
        const animeType = $(el).find('.char-jenis-karakter small').text().trim();
        const animeStatus = $(el).find('.char-status-tayang small').text().trim();

        if (animeTitle && animeUrl && animeType && animeStatus) {
          characterData.anime.push({
            title: animeTitle,
            url: animeUrl,
            type: animeType,
            status: animeStatus,
          });
        }
      });

      resolve({ status: true, data: characterData })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

async function quotes(query) {
  return new Promise((resolve, reject) => {
    if (!query) {
      const page = Math.floor(Math.random() * 192)
      fetch("https://otakotaku.com/quote/feed/" + page, {
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
          "cookie": "log_pencarian=2; PHPSESSID=qak9fkve390d4q09oqe4fnaul4; lang=id; tknoo=47f4d113d6dcf47b94fa754af28306ab; ci_session=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%22eb2bb18ce01694b601702b3be9a0e088%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A14%3A%22108.162.227.71%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A111%3A%22Mozilla%2F5.0+%28Linux%3B+Android+10%3B+K%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F124.0.0.0+Mobile+Safari%2F537.36%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1730775994%3Bs%3A9%3A%22user_data%22%3Bs%3A0%3A%22%22%3B%7D3380bf2b485bd291489f8ee5fc5def1f",
          "Referer": "https://otakotaku.com/quote/feed",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      })
        .then(async (response) => {
          let res = await response.text()
          const $ = cheerio.load(res)
          const hasil = []
          $('div.kotodama-list').each(function (l, h) {
            hasil.push({
              link: $(h).find('a').attr('href'),
              gambar: $(h).find('img').attr('data-src'),
              karakter: $(h).find('div.char-name').text().trim(),
              anime: $(h).find('div.anime-title').text().trim(),
              episode: $(h).find('div.meta').text(),
              up_at: $(h).find('small.meta').text(),
              quotes: $(h).find('div.quote').text().trim()
            })
          })
          if (!hasil[0]) {
            resolve({ status: false, message: "Karakter tidak ditemukan " })
          }
          resolve({ status: true, data: hasil })
        }).catch((err) => {
          resolve({ status: false, message: err })
        })

    } else {
      fetch("https://otakotaku.com/quote/search?q=" + query + "&q_filter=quote", {
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
          "cookie": "log_pencarian=%5B%22151869%22%5D; PHPSESSID=qak9fkve390d4q09oqe4fnaul4; lang=id; tknoo=47f4d113d6dcf47b94fa754af28306ab; ci_session=a%3A5%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%229fcec4214c1b740979fd27884aa488d2%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A14%3A%22108.162.227.71%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A111%3A%22Mozilla%2F5.0+%28Linux%3B+Android+10%3B+K%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F124.0.0.0+Mobile+Safari%2F537.36%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1730775466%3Bs%3A9%3A%22user_data%22%3Bs%3A0%3A%22%22%3B%7D0ca6112eb15947b6200529ec457035aa",
          "Referer": "https://otakotaku.com/quote/feed",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      }).then(async (response) => {
        let res = await response.text()
        const $ = cheerio.load(res)
        const hasil = []
        $('div.kotodama-list').each(function (l, h) {
          hasil.push({
            link: $(h).find('a').attr('href'),
            gambar: $(h).find('img').attr('data-src'),
            karakter: $(h).find('div.char-name').text().trim(),
            anime: $(h).find('div.anime-title').text().trim(),
            episode: $(h).find('div.meta').text(),
            up_at: $(h).find('small.meta').text(),
            quotes: $(h).find('div.quote').text().trim()
          })
        })
        if (!hasil[0]) {
          resolve({ status: false, message: "Karakter tidak ditemukan " })
        }
        resolve({ status: true, data: hasil })
      }).catch((err) => {
        resolve({ status: false, message: err })
      })
    }
  })
}

export default {
  character,
  details,
  quotes
}