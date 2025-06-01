import acrcloud from "acrcloud";
const acr = new acrcloud({
    host: "identify-ap-southeast-1.acrcloud.com",
    access_key: "b1cc283b4fb72483ebb6ea9c53512331",
    access_secret: "xyqJGTZRTrUotaraHEjji00WBClx7RpWozywdANq"
});

async function search(buffer) {
    return new Promise((resolve, reject) => {
        acr.identify(Buffer.from(buffer, "base64"))
            .then(acrResult => {
                const result = {};
                result.status = true;
                result.message = acrResult.status.msg;
                result.title = acrResult.metadata.music[0].title;
                result.artists = acrResult.metadata.music[0].artists[0].name;
                result.album = acrResult.metadata.music[0].album.name;
                result.duration = acrResult.metadata.music[0].duration_ms;
                result.release_date = acrResult.metadata.music[0].release_date;
                result.genre_music = acrResult.metadata.music[0].genres
                    ? acrResult.metadata.music[0].genres
                          .map(genre => genre.name)
                          .join(", ")
                    : "-";
                result.score = acrResult.metadata.music[0].score;
                result.sumber = acrResult.metadata.music[0].external_metadata
                    .youtube
                    ? "https://youtu.be/" +
                      acrResult.metadata.music[0].external_metadata.youtube.vid
                    : "Tidak diketahui";

                resolve(result);
            })
            .catch(e => {
                resolve({ status: false, message: e });
            });
    });
}

export default {
    search
};
