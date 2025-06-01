import axios from "axios";

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

async function quotechat(text, name, profile, color) {
    let select;
    let terserah = pickRandom(["#005d4b", "#1f2c34", "#FFFFFF", "#9CB9D7"]);
    if (!color) {
        select = terserah;
    } else {
        let data = {
            green: "#005d4b",
            black: "#1f2c34",
            white: "#FFFFFF",
            blue: "#9CB9D7"
        };
        select = data[color];
    }
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://qc.botcahx.eu.org/generate",
                {
                    type: "quote",
                    format: "png",
                    backgroundColor: select ? select : terserah,
                    width: 700,
                    height: 580,
                    scale: 2,
                    messages: [
                        {
                            entities: [],
                            avatar: true,
                            from: {
                                id: 1,
                                name: name,
                                photo: {
                                    url: profile
                                }
                            },
                            text: text,
                            replyMessage: {}
                        }
                    ]
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(async quoteResponse => {
                const data = Buffer.from(
                    quoteResponse.data.result.image,
                    "base64"
                );
                resolve({ status: true, data: data.toString("base64") });
            })
            .catch(e => {
                resolve({ status: false, message: e });
            });
    });
}

export default {
    quotechat
};
