import axios from "axios";
import * as cheerio from "cheerio"

function decode(args) {
  let [h, u, n, t, e, r] = args;
  // @ts-ignore
  function decode(d, e, f) {
    const g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
    let h = g.slice(0, e);
    let i = g.slice(0, f);
    // @ts-ignore
    let j = d.split("").reverse().reduce(function (a, b, c) {
      if (h.indexOf(b) !== -1)
        return (a += h.indexOf(b) * Math.pow(e, c));
    }, 0);
    let k = "";
    while (j > 0) {
      k = i[j % f] + k;
      j = (j - (j % f)) / f;
    }
    return k || "0";
  }
  r = "";
  for (let i = 0, len = h.length; i < len; i++) {
    let s = "";
    // @ts-ignore
    while (h[i] !== n[e]) {
      s += h[i];
      i++;
    }
    for (let j = 0; j < n.length; j++)
      s = s.replace(new RegExp(n[j], "g"), j.toString());
    // @ts-ignore
    r += String.fromCharCode(decode(s, e, 10) - t);
  }
  return decodeURIComponent(encodeURIComponent(r));
}
function getEncoded(data) {
  return data
    .split("decodeURIComponent(escape(r))}(")[1]
    .split("))")[0]
    .split(",")
    .map(v => v.replace(/"/g, "").trim());
}
function getDecoded(data) {
  return data
    .split('$("#download").innerHTML = "')[1]
    .split(
      '"; $(".contents")'
    )[0]
    .replace(/\\(\\)?/g, "");
}
function decrypt(data) {
  return getDecoded(
    decode(getEncoded(data))
  );
}

let headers = {
  "accept": "*/*",
  "accept-language": "id-ID,id;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6,en;q=0.5",
  "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryL8hyKetbhEA4FENh",
  "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
  "sec-ch-ua-mobile": "?1",
  "sec-ch-ua-platform": "\"Android\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "cookie": "_pubcid=13bf2f32-13f5-43a7-bac1-4c777708548e; _pubcid_cst=zix7LPQsHA%3D%3D; _cc_id=f768150157fa59c92f58ad2f7b3bcdd1; panoramaId_expiry=1726503215360; panoramaId=f4e54136745c5e41cd18151ef851a9fb927ac37237c20f350001e3da55024e36; panoramaIdType=panoDevice; _au_1d=AU1D-0100-001726416815-DCVS9DFT-2EI8; cto_bundle=7OsltV9HVCUyRk1hZ1ZzcTFGdCUyRnglMkJZWWNtc0hGUm1IdnBodzAwSXFDcmdTMERra3UzV3pmN1BidlEyU3N5UGRNNm5oSnNzOFpLRiUyRlppTiUyQnR1YUtuV2kyeGNZc2Y0aHNCcWNJSUtHb1BacnBIRkt4RVBTakh2dzlDSVQlMkZobW5DaW9CY1VwbUxodFZsSGpkUGJpSU82WHlMMU1pUlElM0QlM0Q; _gid=GA1.2.1806682511.1726416816; current_language=en1; _ga_FVWZ0RM4DH=GS1.1.1726418544.1.1.1726418738.60.0.0; __gads=ID=2c3cbbb2be1e3be9:T=1726416808:RT=1726419175:S=ALNI_MYD5__qzFtQiQ67-Uh0m_Dtkvstiw; __gpi=UID=00000f09f60439c5:T=1726416808:RT=1726419175:S=ALNI_MZkKJSB2E8iBzIdtkZORVr_mHuYjg; __eoi=ID=40ea99f9b08ce5ca:T=1726416808:RT=1726419175:S=AA-AfjY4JQCvUUjczZlHrLk2MAK4; FCNEC=%5B%5B%22AKsRol_Bv8vDloxyUYKn9Fu85izbcUHjIujqs10T4eOLnr1w4Y8YQhJditYkc3cN8z9CzaqOb982PQjVZXugFDHAFwPmHQvynrFuFqsjcczvjNGKslHDjiVghSSgF3TAPxfsfMCZ3-3SOleIt4of09UCfdFTObMBFw%3D%3D%22%5D%5D; __cf_bm=8gmPWj.xeLk1DWn990GTmk6klDohi_t1ira4v9ygzbI-1726484480-1.0.1.1-ifUlts8B2fnxhcf6VsGleq0WOyZNpxJqslTONdUWeiHejCx8b75OJm_ZHwO4fUTZiIJcokUt7UPiBQAZbN0T5Q; __cflb=04dToWzoGizosSfR1wyVGuxNrEyGiW6otW4C1RsdBy; _ga_GHEBL0D5ES=deleted; _ga=GA1.1.1953816053.1726416807; _ga_GHEBL0D5ES=GS1.1.1726484481.1.1.1726484725.0.0.0",
  "Referer": "https://snaptik.app/download-tiktok-slide",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
async function snaptik(url) {
  try {
    let res = await fetch('https://snaptik.app/')
    let $ = cheerio.load(await res.text())
    let token = $('input[name="token"]').attr('value')
    let data = await fetch("https://snaptik.app/abc2.php", {
      "headers": headers,
      "body": "------WebKitFormBoundaryL8hyKetbhEA4FENh\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\n" + url + "\r\n------WebKitFormBoundaryL8hyKetbhEA4FENh\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n" + token + "\r\n------WebKitFormBoundaryL8hyKetbhEA4FENh--\r\n",
      "method": "POST"
    });
    let html = decrypt(await data.text())
    const $$ = cheerio.load(html);
    let result = {
      status: true,
      video: '',
      slide: []
    }
    // Get download link for video
    const renderButton = $$('.button.btn-render');
    let token2 = renderButton.data('token'); // Extract the data-token attribute

    // Get download links for photos
    $$('.photo a.button.w100').each((index, element) => {
      const photoLink = $$(element).attr('href');
      if (photoLink) {
        result.slide.push({
          type: 'photo',
          link: photoLink,
          description: 'Photo'
        });
      }
    });
    let render = await fetch("https://snaptik.app/render.php?token=" + token2, {
      "headers": headers,
      "body": null,
      "method": "GET"
    });
    let task = await render.json()
    let getdl = await fetch(task.task_url, {
      "headers": headers,
      "body": null,
      "method": "GET"
    });
    let getvideo = await getdl.json()
    result.video = getvideo.download_url
    return result
  } catch (e) {
    return { status: false, message: e }
  }
}

async function tikwms(query) {
  return new Promise(async (resolve, reject) => {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux Android 10 K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: {
        keywords: query,
        count: 10,
        cursor: 0,
        HD: 1
      }
    }).then((data) => {
      let result = { status: true, data: data.data.data.videos }
      resolve(result);
    }).catch((e) => {
      let result = { status: false, message: "Gagal mencari video" }
      resolve(result)
    })
  })
}

async function tikwm(url) {
  return new Promise((resolve, reject) => {
    let host = "https://www.tikwm.com";
    axios.post(host + "/api/", {}, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type":
          "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
      },
      params: { url: url, count: 12, cursor: 0, web: 1, hd: 1 }
    }).then((res) => {
      let result = {
        status: true,
        wm: host + res.data.data.wmplay,
        music: host + res.data.data.music,
        video: host + res.data.data.play,
        image: res.data.data.images ? res.data.data.images : false
      };
      resolve(result);
    }).catch((e) => {
      resolve({ status: false, message: "Gagal mendapatkan metadata download" })
    });
  });
};

export default {
  snaptik,
  tikwms,
  tikwm
};