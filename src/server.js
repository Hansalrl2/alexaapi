import express from 'express'
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import bodyParser from 'body-parser'
import config from "./config/config.js"
import { router } from "./app.js"
import { download } from "./router/download.js"

app.use(express.json({ limit: '10mb' })); // Ubah sesuai kebutuhan
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.enable('trust proxy');
app.set("json spaces", 2);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
  config.visitor += 1
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/tes', async (req, res) => {
  const userId = req.params.id; // Mengambil parameter dari URL
  const searchTerm = req.query.q; // Mengambil parameter dari query string
  const bodyData = req.body; // Mengambil data dari body
  const userAgent = req.headers['user-agent']; // Mengambil User-Agent dari headers
  res.status(201).json({
    status: true,
    userId,
    searchTerm,
    bodyData,
    userAgent,
    ip: req.ip,
    config,
  });
})
app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/docs-artificial.html'));
});
app.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/docs-download.html'));
});
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/docs-search.html'));
});
app.get('/tools', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/docs-tools.html'));
});
app.get('/chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/chatbot.html'));
});

app.use('/api', router);
app.use('/api', download);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
})
