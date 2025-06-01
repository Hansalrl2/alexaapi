import fetch from "node-fetch";

const APIs = {
    1: "https://apkcombo.com",
    2: "https://apk-dl.com",
    3: "https://apk.support",
    4: "https://apps.evozi.com/apk-downloader",
    5: "http://ws75.aptoide.com/api/7",
    6: "https://cafebazaar.ir"
};

const Proxy = url =>
    url
        ? `https://translate.google.com/translate?sl=en&tl=fr&hl=en&u=${encodeURIComponent(
              url
          )}&client=webapp`
        : "";

const api = (ID, path = "/", query = {}) => {
    return (
        (ID in APIs ? APIs[ID] : ID) +
        path +
        (Object.keys(query).length
            ? "?" + new URLSearchParams(query).toString()
            : "")
    );
};

const tools = {
    APIs: APIs,
    Proxy: Proxy,
    api: api
};

const aptoide = {
    search: async function (args) {
        try {
            let data = await fetch(
                tools.api(5, "/apps/search", { query: args, limit: 1000 })
            );
            let ress = [];
            let res = await data.json();
            ress = res.datalist.list.map(v => ({
                name: v.name,
                id: v.package
            }));
            return {
                status: true,
                data: ress
            };
        } catch (e) {
            return {
                status: false,
                message: e
            };
        }
    },

    download: async function (id) {
        try {
            let data = await fetch(
                tools.api(5, "/apps/search", { query: id, limit: 1 })
            );
            let res = await data.json();
            return {
                status: true,
                img: res.datalist.list[0]?.icon,
                developer: res.datalist.list[0]?.store.name,
                appname: res.datalist.list[0]?.name,
                link: res.datalist.list[0]?.file.path
            };
        } catch (e) {
            return {
                status: false,
                message: e
            };
        }
    }
};

export default aptoide;
