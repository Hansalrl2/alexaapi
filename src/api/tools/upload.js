import formData from "form-data";
import axios from "axios";
import { fileTypeFromBuffer } from "file-type";

async function upload(buffer) {
    let dataFile = Buffer.from(buffer, "base64");
    const { ext, mime } = await fileTypeFromBuffer(dataFile);
    try {
        const form = new formData();
        form.append("fileToUpload", dataFile, {
            filename: `${Date.now()}.${ext}`
        });
        form.append("reqtype", "fileupload");
        const { data } = await axios(`https://catbox.moe/user/api.php`, {
            method: "post",
            data: form,
            headers: form.getHeaders(), // Pastikan untuk mengatur header yang benar
            timeout: 100000 // Set timeout ke 10 detik (10000 ms)
        });

        return { status: true, url: data };
    } catch (err) {
        console.error("Error uploading file:", err.message); // Log pesan kesalahan
        return { status: false, message: String(err) };
    }
}

export default {
    upload
};
