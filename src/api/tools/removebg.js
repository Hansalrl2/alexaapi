import { removeBackgroundFromImageBase64 } from "remove.bg";
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

const removeBG = async (input, bg) => {
    let attempts = 0;
    let error = "";
    while (attempts < 10) {
        let apikey = pickRandom([
            "q61faXzzR5zNU6cvcrwtUkRU",
            "S258diZhcuFJooAtHTaPEn4T",
            "5LjfCVAp4vVNYiTjq9mXJWHF",
            "aT7ibfUsGSwFyjaPZ9eoJc61",
            "BY63t7Vx2tS68YZFY6AJ4HHF",
            "5Gdq1sSWSeyZzPMHqz7ENfi8",
            "86h6d6u4AXrst4BVMD9dzdGZ",
            "xp8pSDavAgfE5XScqXo9UKHF",
            "dWbCoCb3TacCP93imNEcPxcL",
            "sLGRxNWGX6ntoWAdwGg6omZ4"
        ]);
        try {
            const response = await removeBackgroundFromImageBase64({
                base64img: input,
                apiKey: apikey,
                size: "auto",
                type: "auto",
                bg_color: bg
            });

            return {
                status: false,
                data: Buffer.from(response.base64img, "base64")
            };
        } catch (error) {
            attempts++;
            error = error;
            console.error(`Error removing background. Attempt ${attempts}`);
            console.error(error);
        }
    }
    return { status: false, message: error };
};

export default {
    removeBG
};
