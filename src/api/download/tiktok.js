import axios from "axios";
import * as cheerio from "cheerio";

function decode(args) {
  let [h, u, n, t, e, r] = args;
  
  function decode(d, e, f) {
    const g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
    let h = g.slice(0, e);
    let i = g.slice(0, f);
    
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
    
    while (h[i] !== n[e]) {
      s += h[i];
      i++;
    }
    for (let j = 0; j < n.length; j++)
      s = s.replace(new RegExp(n[j], "g"), j.toString());
    
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

// Updated headers with fresh user agent and reduced tracking
const getHeaders = () => ({
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9,id;q=0.8",
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
});

async function snaptik(url) {
  try {
    // Get initial page and token
    const headers = getHeaders();
    const response = await axios.get('https://snaptik.app/', { headers });
    const $ = cheerio.load(response.data);
    const token = $('input[name="token"]').attr('value');
    
    if (!token) {
      throw new Error('Token not found');
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('url', url);
    formData.append('token', token);

    // Submit URL for processing
    const processResponse = await axios.post('https://snaptik.app/abc2.php', formData, {
      headers: {
        ...headers,
        'content-type': 'multipart/form-data',
        'referer': 'https://snaptik.app/',
        'origin': 'https://snaptik.app'
      }
    });

    // Decrypt response
    const html = decrypt(processResponse.data);
    const $$ = cheerio.load(html);
    
    const result = {
      status: true,
      video: '',
      slide: []
    };

    // Extract video download link
    const renderButton = $$('.button.btn-render');
    const token2 = renderButton.data('token');
    
    if (token2) {
      try {
        const renderResponse = await axios.get(`https://snaptik.app/render.php?token=${token2}`, { headers });
        const task = renderResponse.data;
        
        if (task.task_url) {
          const downloadResponse = await axios.get(task.task_url, { headers });
          const videoData = downloadResponse.data;
          
          if (videoData.download_url) {
            result.video = videoData.download_url;
          }
        }
      } catch (renderError) {
        console.log('Video render error:', renderError.message);
      }
    }

    // Extract slide images
    $$('.photo a.button.w100').each((index, element) => {
      const photoLink = $$(element).attr('href');
      if (photoLink) {
        result.slide.push({
          type: 'photo',
          link: photoLink,
          description: `Photo ${index + 1}`
        });
      }
    });

    return result;
  } catch (error) {
    console.error('Snaptik error:', error.message);
    return { 
      status: false, 
      message: `Snaptik error: ${error.message}` 
    };
  }
}

async function tikwms(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://tikwm.com/'
      },
      data: {
        keywords: query,
        count: 10,
        cursor: 0,
        HD: 1
      }
    });

    if (response.data && response.data.data && response.data.data.videos) {
      return { 
        status: true, 
        data: response.data.data.videos 
      };
    } else {
      throw new Error('No videos found');
    }
  } catch (error) {
    console.error('Tikwms error:', error.message);
    return { 
      status: false, 
      message: `Failed to search videos: ${error.message}` 
    };
  }
}

async function tikwm(url) {
  try {
    const host = "https://www.tikwm.com";
    
    const response = await axios.post(`${host}/api/`, null, {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "referer": "https://www.tikwm.com/",
        "origin": "https://www.tikwm.com"
      },
      params: { 
        url: url, 
        count: 12, 
        cursor: 0, 
        web: 1, 
        hd: 1 
      }
    });

    if (response.data && response.data.data) {
      const data = response.data.data;
      return {
        status: true,
        title: data.title || '',
        author: data.author ? data.author.nickname : '',
        duration: data.duration || 0,
        wm: data.wmplay ? `${host}${data.wmplay}` : '',
        music: data.music ? `${host}${data.music}` : '',
        video: data.play ? `${host}${data.play}` : '',
        image: data.images || false,
        hdplay: data.hdplay ? `${host}${data.hdplay}` : ''
      };
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Tikwm error:', error.message);
    return { 
      status: false, 
      message: `Failed to get download metadata: ${error.message}` 
    };
  }
}

// Alternative TikTok downloader using different approach
async function tiktokdl(url) {
  try {
    const cleanUrl = url.replace(/[?&].*$/, ''); // Remove query parameters
    
    const response = await axios.post('https://ssstik.io/abc', 
      `id=${encodeURIComponent(cleanUrl)}&locale=en&tt=RHJqY0hI`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://ssstik.io/',
          'Origin': 'https://ssstik.io'
        }
      }
    );

    const $ = cheerio.load(response.data);
    const result = {
      status: true,
      video: '',
      audio: '',
      title: '',
      thumbnail: ''
    };

    // Extract video URL
    const videoElement = $('a[href*="download"]').first();
    if (videoElement.length) {
      result.video = videoElement.attr('href');
    }

    // Extract title
    const titleElement = $('.result-title');
    if (titleElement.length) {
      result.title = titleElement.text().trim();
    }

    // Extract thumbnail
    const thumbnailElement = $('img.result-thumbnail');
    if (thumbnailElement.length) {
      result.thumbnail = thumbnailElement.attr('src');
    }

    return result;
  } catch (error) {
    console.error('TikTokDL error:', error.message);
    return { 
      status: false, 
      message: `TikTokDL error: ${error.message}` 
    };
  }
}

export default {
  snaptik,
  tikwms,
  tikwm,
  tiktokdl
};
