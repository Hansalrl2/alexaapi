async function image(prompt, model) {
  return new Promise((resolve, reject) => {
    fetch("https://api.xet.one/v1/images/generations", {
      "headers": {
        "authorization": "Bearer XET-xAUTWGvDhP4SJpUlEKMiS86wKiPLUxiYaiyWOSa2",
        "content-type": "application/json",
      },
      "body": JSON.stringify({ "model": model, "prompt": prompt, size: "576x1024" }),
      "method": "POST"
    }).then(async (data) => {
      let res = await data.json()
      resolve({ status: true, data: res.data[0].url })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

async function text(prompt, message = [], model) {
  return new Promise((resolve, reject) => {
    fetch("https://api.xet.one/v1/chat/completions", {
      "headers": {
        "authorization": "Bearer XET-xAUTWGvDhP4SJpUlEKMiS86wKiPLUxiYaiyWOSa2",
        "content-type": "application/json",
      },
      "body": JSON.stringify({ model: model, messages: [...message, { role: "user", content: prompt }] }),
      "method": "POST"
    }).then(async (response) => {
      let data = await response.json()
      resolve({ status: true, message: data.choices[0].message.content })
    }).catch((err) => {
      resolve({ status: false, message: err })
    })
  })
}

export default {
  image,
  text,
}