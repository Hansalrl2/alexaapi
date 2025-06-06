import fetch from "node-fetch";
import formData from "form-data";
import { JSDOM } from "jsdom";

async function webp2mp4(buffer) {
    try {
        let form = new formData();
        let source = Buffer.from(buffer, "base64");
        form.append("new-image", source, "image.webp");
        let res = await fetch("https://ezgif.com/webp-to-mp4", {
            method: "POST",
            body: form
        });
        let html = await res.text();
        let { document } = new JSDOM(html).window;
        let form2 = new formData();
        let obj = {};
        for (let input of document.querySelectorAll("form input[name]")) {
            obj[input.name] = input.value;
            form2.append(input.name, input.value);
        }
        let res2 = await fetch("https://ezgif.com/webp-to-mp4/" + obj.file, {
            method: "POST",
            body: form2
        });
        let html2 = await res2.text();
        let { document: document2 } = new JSDOM(html2).window;
        return {
            status: true,
            data: new URL(
                document2.querySelector(
                    "div#output > p.outfile > video > source"
                ).src,
                res2.url
            ).toString()
        };
    } catch (e) {
        return { status: false, message: e };
    }
}

async function webp2png(buffer) {
    try {
        let form = new formData();
        let source = Buffer.from(buffer, "base64");
        form.append("new-image", source, "image.webp");
        let res = await fetch("https://ezgif.com/webp-to-png", {
            method: "POST",
            body: form
        });
        let html = await res.text();
        let { document } = new JSDOM(html).window;
        let form2 = new formData();
        let obj = {};
        for (let input of document.querySelectorAll("form input[name]")) {
            obj[input.name] = input.value;
            form2.append(input.name, input.value);
        }
        let res2 = await fetch("https://ezgif.com/webp-to-png/" + obj.file, {
            method: "POST",
            body: form2
        });
        let html2 = await res2.text();
        let { document: document2 } = new JSDOM(html2).window;
        return {
            status: true,
            data: new URL(
                document2.querySelector("div#output > p.outfile > img").src,
                res2.url
            ).toString()
        };
    } catch (e) {
        return { status: false, message: e };
    }
}

export default {
    webp2png,
    webp2mp4
};
