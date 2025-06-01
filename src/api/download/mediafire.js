import * as cheerio from 'cheerio'

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
        "sec-fetch-site": "none",
        "upgrade-insecure-requests": "1",
        "cookie": "ukey=56yslt3xprqxohtin5nhvza0va2gddfa; conv_tracking_data-2=%7B%22mf_source%22%3A%22regular_download-55%22%2C%22mf_content%22%3A%22Free%22%2C%22mf_medium%22%3A%22unknown%5C%2FChrome%22%2C%22mf_campaign%22%3A%22ndf45boxzj5p5b8%22%2C%22mf_term%22%3A%220a9bfe1687f89333fd491e4096e1bf91%22%7D; amp_28916b=hI3TrtyTBe7lTe616syPJF...1i533cfa0.1i533cfa5.0.1.1; _ga=GA1.2.281062618.1723459845; ezosuibasgeneris-1=564d0f5e-346c-4a6c-7a68-0ba88c5e7feb; cf_clearance=oXSvIdjXrxDFqeUCO_7J7v1VBvxCpfqssVG8cedopfY-1723459862-1.0.1.1-i1MeU9wslpdmOrL9XFxwsbP4BBeAmKhALbjUb9JIYcjwVJBN_QraT2VhcJUdj_bXknUcAL6Dd9nrvI6f.rK4ZA; _sharedid=4c0a3f3e-4e76-4f7c-887d-7c6c5b165903; _sharedid_cst=zix7LPQsHA%3D%3D; _lr_env_src_ats=false; pbjs-unifiedid=%7B%22TDID%22%3A%229f9fb32e-cd0a-481f-8233-f1855ccdfaac%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222024-07-12T10%3A51%3A12%22%7D; pbjs-unifiedid_cst=zix7LPQsHA%3D%3D; _cc_id=f768150157fa59c92f58ad2f7b3bcdd1; cto_bundle=-3IcuF9oSHRWc2pBN1FCQ0hJalVPTUgzN2xWZ04lMkZTaXNBWXBodTZwJTJCd1A4dFRqY0tzWHRucVpwJTJGUSUyRjMlMkZwZVNTRSUyRmNXd3hkTHhNdDY2RGpGbk9LR254RGl1M2pnSENYZWdXQks5Tll1aVhFekRDZXRqcCUyRlVBWUpsT3clMkZhM1hCMkxxOEFyJTJCM0JZT1JxUFhMVGZmNEglMkJGcXRkUSUzRCUzRA; cto_bidid=ZTh4qV9mVCUyRnR0YnBEdndESXJhTElFWVAlMkY2V3VyVzNKWVdMSFFkaEZrbEJ0MGtNb1hFT0V2SDhkcjJwSjhLaWJ2ZTNVdlY1UVBveUJzMWFBN0dYM3VIYlBUNFNYWGxKUVEwQ1VUNUtIa2pwUE92MFElM0Q; __gads=ID=63797acbd8f69564:T=1723459918:RT=1723459918:S=ALNI_MbmhqXuaSBr8mKpfbV4oqO8FPhvoQ; __gpi=UID=00000ebd990ddaaf:T=1723459918:RT=1723459918:S=ALNI_MZGAr8qqFB7k-CzuFobwzy6SVvPvg; __eoi=ID=f0f11f3dba3781f7:T=1723459918:RT=1723459918:S=AA-AfjZhq1TDzUBjMaCHCkB-fYsp; FCNEC=%5B%5B%22AKsRol9sR151_Mh_coaHgs7th3Yvha8Yy9muuXgfNgHVEyQjakiv3ch9jE8IK--N_RbQl6BCaUVZ4j55wQnH-YotW3rNd3m6D5nW3zifsXHDn2K3PFwfGY6nm-8qNlBLt3iWMM3zYasWNTbwysDcPSfnC3pWPExqCg%3D%3D%22%5D%5D; _ga_K68XP6D85D=GS1.1.1723459845.1.1.1723460204.53.0.0; __cf_bm=sHtWTN.2ob1bz4T_KB4ZFdjP8wCdJ.BeajZiU1OZUak-1725845700-1.0.1.1-UIZb4DRviABnJm06q4dBEX5K4O2huIiuDD3HUBQ3352232MJnalX6L1HVtD1lk58VtTvbrJR31NxJ2QZNE5bcQ"
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET"
    }).then(async (data) => {
      let get = cheerio.load(await data.text())
      let urlFile = get('a#downloadButton').attr('href')
      let sizeFile = get('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('', '')
      let split = urlFile.split('/')
      let title = split[5]
      let mime = title.split('.')[0]
      let result = {
        status: true,
        title: title.replace(/\+/gi, " "),
        size: sizeFile.trim(),
        url: urlFile
      }
      resolve(result)
    }).catch((e) => {
      resolve({ status: false, message: e })
    })
  })
}

export default {
  download 
}