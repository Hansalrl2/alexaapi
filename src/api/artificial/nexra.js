import axios from "axios";

// async function chatgpt(prompt, messages, model, markdown) {
//   return new Promise((resolve, reject) => {
//     axios.post('https://nexra.aryahcr.cc/api/chat/gpt', { messages, prompt, model, markdown }, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(async (result) => {
//         let id = result.data.id;
//         let response = null;
//         let data = true;
//         while (data) {
//           response = await axios.get('https://nexra.aryahcr.cc/api/chat/task/' + encodeURIComponent(id));
//           response = response.data;
//           switch (response.status) {
//             case "pending":
//               data = true;
//               break;
//             case "error":
//               resolve({ status: false, message: "Internal server error" });
//               break;
//             case "completed":
//               messages.push({
//                 role: "user",
//                 content: prompt
//               });
//               resolve({ status: true, message: response.gpt });
//               break;
//             case "not_found":
//               resolve({ status: false, message: "Internal server error" });
//               break;
//           }
//         }
//       })
//       .catch(error => {
//         resolve({ status: false, message: error })
//       });
//   });
// }


async function chatgpt(prompt, messages) {
    try {
        let data = await fetch("https://chateverywhere.app/api/chat/", {
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            },
            body: JSON.stringify({
                model: {
                    id: "gpt-4",
                    name: "GPT-4",
                    maxLength: 32000, // Sesuaikan token limit jika diperlukan
                    tokenLimit: 8000, // Sesuaikan token limit untuk model GPT-4
                    completionTokenLimit: 5000, // Sesuaikan jika diperlukan
                    deploymentName: "gpt-4"
                },
                messages: [
                    ...messages,
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                prompt,
                temperature: 0.5
            }),
            method: "POST"
        });

        let result = {
            status: true,
            message: await data.text()
        };
        return result;
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}

// async function chatgpt(prompt, messages) {
//     try {
//         const randomNumber = Math.floor(Math.random() * 10) + 1;
//         const url = `https://srv.apis${randomNumber}.workers.dev/chat`;
//         const response = await fetch(url, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "User-Agent":
//                     "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
//                 Referer: "https://google.com/"
//             },
//             body: JSON.stringify({
//                 model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
//                 messages: [
//                     ...messages.slice(0, 30),
//                     {
//                         role: "user",
//                         content: prompt
//                     }
//                 ]
//             }),
//             method: "POST"
//         });
//         let data = await response.text();
//         return {
//             status: true,
//             message: data.split('response":')[1].split(`,"tool`)[0]
//         };
//     } catch (error) {
//         console.error("Error:", error);
//         return {
//             status: false,
//             message: error
//         };
//     }
// }

async function gptweb(prompt) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://nexra.aryahcr.cc/api/chat/gptweb",
                {
                    prompt: prompt,
                    markdown: false
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(async result => {
                let id = result.data.id;
                let response = null;
                let data = true;
                while (data) {
                    response = await axios.get(
                        "https://nexra.aryahcr.cc/api/chat/task/" +
                            encodeURIComponent(id)
                    );
                    response = response.data;
                    switch (response.status) {
                        case "pending":
                            data = true;
                            break;
                        case "error":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                        case "completed":
                            resolve({ status: true, message: response.gpt });
                            break;
                        case "not_found":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                    }
                }
            })
            .catch(error => {
                console.error("Error:", error);
                resolve({ status: false, message: "Internal server error" });
            });
    });
}

async function gpt4o(prompt, messages) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://nexra.aryahcr.cc/api/chat/complements",
                {
                    messages: [...messages, { role: "user", content: prompt }],
                    stream: false,
                    markdown: false,
                    model: "chatgpt"
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(async result => {
                let id = result.data.id;
                let response = null;
                let data = true;
                while (data) {
                    response = await axios.get(
                        "https://nexra.aryahcr.cc/api/chat/task/" +
                            encodeURIComponent(id)
                    );
                    response = response.data;
                    switch (response.status) {
                        case "pending":
                            data = true;
                            break;
                        case "error":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                        case "completed":
                            messages.push({
                                role: "user",
                                content: prompt
                            });
                            resolve({
                                status: true,
                                message: response.message
                            });
                            break;
                        case "not_found":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                    }
                }
            })
            .catch(error => {
                resolve({ status: false, message: "Internal server error" });
            });
    });
}

async function blackbox(prompt, messages) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://nexra.aryahcr.cc/api/chat/complements",
                {
                    messages: [...messages, { role: "user", content: prompt }],
                    websearch: true,
                    stream: false,
                    markdown: false,
                    model: "blackbox"
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(async result => {
                let id = result.data.id;
                let response = null;
                let data = true;
                while (data) {
                    response = await axios.get(
                        "https://nexra.aryahcr.cc/api/chat/task/" +
                            encodeURIComponent(id)
                    );
                    response = response.data;
                    switch (response.status) {
                        case "pending":
                            data = true;
                            break;
                        case "error":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                        case "completed":
                            messages.push({
                                role: "user",
                                content: prompt
                            });
                            resolve({
                                status: true,
                                message: response.message,
                                search: response.search ? response.search : []
                            });
                            break;
                        case "not_found":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                    }
                }
            })
            .catch(error => {
                console.error("Error:", error);
                resolve({ status: false, message: "Internal server error" });
            });
    });
}

async function bing(prompt, messages) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://nexra.aryahcr.cc/api/chat/complements",
                {
                    messages: [...messages, { role: "user", content: prompt }],
                    conversation_style: "Balanced",
                    markdown: false,
                    stream: false,
                    model: "Bing"
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(async result => {
                let id = result.data.id;
                let response = null;
                let data = true;
                while (data) {
                    response = await axios.get(
                        "https://nexra.aryahcr.cc/api/chat/task/" +
                            encodeURIComponent(id)
                    );
                    response = response.data;
                    switch (response.status) {
                        case "pending":
                            data = true;
                            break;
                        case "error":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                        case "completed":
                            messages.push({
                                role: "user",
                                content: prompt
                            });
                            resolve({
                                status: true,
                                message: response.message
                            });
                            break;
                        case "not_found":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                    }
                }
            })
            .catch(error => {
                console.error("Error:", error);
                resolve({ status: false, message: "Internal server error" });
            });
    });
}

async function gemini(prompt, messages) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                "https://nexra.aryahcr.cc/api/chat/complements",
                {
                    messages: [...messages, { role: "user", content: prompt }],
                    markdown: false,
                    stream: false,
                    model: "gemini-pro"
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(async result => {
                let id = result.data.id;
                let response = null;
                let data = true;
                while (data) {
                    response = await axios.get(
                        "https://nexra.aryahcr.cc/api/chat/task/" +
                            encodeURIComponent(id)
                    );
                    response = response.data;
                    switch (response.status) {
                        case "pending":
                            data = true;
                            break;
                        case "error":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                        case "completed":
                            messages.push({
                                role: "user",
                                content: prompt
                            });
                            resolve({
                                status: true,
                                message: response.message
                            });
                            break;
                        case "not_found":
                            resolve({
                                status: false,
                                message: "Internal server error"
                            });
                            break;
                    }
                }
            })
            .catch(error => {
                console.error("Error:", error);
                resolve({ status: false, message: "Internal server error" });
            });
    });
}

export default {
    chatgpt,
    gptweb,
    gpt4o,
    blackbox,
    bing,
    gemini
};
