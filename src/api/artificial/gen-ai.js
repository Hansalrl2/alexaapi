import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold
} from "@google/generative-ai";

const apiKey = [
    "AIzaSyAFLHwX8eCoSUq_vHzC1TpKiMM4cCYJQjM",
    "AIzaSyDepWe3cyObfB_7_Zc_Q4JA-PFuLcZT_t8",
    "AIzaSyClNa8-TcnFPa0Cpy98tQOUitRj7pFvavU",
    "AIzaSyA7MsyVndOXPxD0r_YZ_1ZxPBRyBtcLfAQ",
    "AIzaSyBDAxPdJzPko7rEVTVs0h91ps9XZ2l_u5o"
];

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

async function ai(text, buffer, mimeType, instruksi) {
    const genAI = new GoogleGenerativeAI(pickRandom(apiKey));
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE
            }
        ],
        systemInstruction: instruksi
    });
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain"
    };
    const prompt = text;
    const image = {
        inlineData: {
            data: buffer,
            mimeType: mimeType
        }
    };
    return new Promise((resolve, reject) => {
        model
            .generateContent([prompt, image])
            .then(data => {
                resolve({ status: true, message: data.response.text() });
            })
            .catch(e => {
                throw {
                    status: false,
                    message: e
                };
            });
    });
}

export default {
    ai
};
