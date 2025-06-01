import fetch from "node-fetch";

async function search(query) {
    try {
        let res = await fetch(
            `https://raw.githubusercontent.com/mrfzvx12/random-scraper/main/game/${query}.json`,
            { method: "GET" }
        );
        let json = await res.json();
        return {
            status: true,
            json
        };
    } catch (e) {
        return {
            status: false,
            message: e
        };
    }
}
export default { search };
