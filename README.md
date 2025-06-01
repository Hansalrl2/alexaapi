<p align="center">
  <img src="./src/public/img/logo.png" alt="Logo API" width="200"/>
</p>

# REST API Documentation

Selamat datang di dokumentasi REST API kami! API ini menyediakan berbagai fungsi yang dikategorikan ke dalam AI, Downloader, Tools, dan Search. Dokumentasi ini akan memandu Anda dalam menggunakan API kami dengan contoh kode menggunakan `fetch` di JavaScript.

**Table of Contents**

*   [AI (Artificial Intelligence)](#ai-artificial-intelligence)
    *   [ChatGPT](#chatgpt)
    *   [Gemini](#gemini)
    *   [Blackbox](#blackbox)
*   [Downloader](#downloader)
*   [Tools](#tools)
*   [Search](#search)

## Deskripsi

API ini dirancang untuk memberikan solusi cepat dan efisien untuk berbagai kebutuhan Anda.  Kami menyediakan endpoint untuk pemrosesan AI, pengunduhan file, berbagai tools utilitas, dan pencarian data.  Kami berkomitmen untuk menyediakan API yang mudah digunakan dan didokumentasikan dengan baik.

## Kategori API

### AI (Artificial Intelligence) <a name="ai-artificial-intelligence"></a>

Endpoint AI menyediakan berbagai fungsi terkait kecerdasan buatan, termasuk model bahasa besar (LLM) seperti ChatGPT, Gemini, dan Blackbox.

#### ChatGPT <a name="chatgpt"></a>

*   **Deskripsi:** Berinteraksi dengan model bahasa ChatGPT untuk menghasilkan teks, menjawab pertanyaan, dan melakukan percakapan.
*   **Endpoint:** `/ai/chatgpt`
*   **Method:** `POST`
*   **Request Body:**

    ```json
    {
      "prompt": "Pertanyaan atau perintah yang ingin Anda kirim ke ChatGPT.",
      "model": "gpt-3.5-turbo", // Opsional: Tentukan model yang ingin digunakan. Default: gpt-3.5-turbo
      "temperature": 0.7, // Opsional: Mengontrol keacakan output. Nilai antara 0 dan 1. Default: 0.7
      "max_tokens": 150 // Opsional: Batas jumlah token dalam response. Default: 150
    }
    ```

*   **Response:**

    ```json
    {
      "response": "Jawaban atau teks yang dihasilkan oleh ChatGPT.",
      "model": "gpt-3.5-turbo",
      "usage": {
        "prompt_tokens": 20,
        "completion_tokens": 130,
        "total_tokens": 150
      }
    }
    ```

*   **Contoh Penggunaan (fetch):**

    ```javascript
    const prompt = "Jelaskan apa itu Artificial Intelligence.";
    fetch('/ai/chatgpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // Ganti dengan API key Anda
      },
      body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
      console.log("ChatGPT Response:", data.response);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    ```

*   **Contoh Penggunaan (cURL):**

    ```bash
    curl -X POST \
      https://api.example.com/v1/ai/chatgpt \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "prompt": "Jelaskan apa itu Artificial Intelligence."
      }'
    ```

#### Gemini <a name="gemini"></a>

*   **Deskripsi:**  Berinteraksi dengan model bahasa Gemini untuk menghasilkan teks, menerjemahkan bahasa, menulis berbagai jenis konten kreatif, dan menjawab pertanyaan Anda dengan cara yang informatif.
*   **Endpoint:** `/ai/gemini`
*   **Method:** `POST`
*   **Request Body:**

    ```json
    {
      "prompt": "Pertanyaan atau perintah yang ingin Anda kirim ke Gemini.",
      "model": "gemini-pro", // Opsional: Tentukan model yang ingin digunakan. Default: gemini-pro
      "temperature": 0.9, // Opsional: Mengontrol keacakan output. Nilai antara 0 dan 1. Default: 0.9
      "max_output_tokens": 200 // Opsional: Batas jumlah token dalam response. Default: 200
    }
    ```

*   **Response:**

    ```json
    {
      "response": "Jawaban atau teks yang dihasilkan oleh Gemini.",
      "model": "gemini-pro",
      "usage": {
        "prompt_tokens": 25,
        "completion_tokens": 175,
        "total_tokens": 200
      }
    }
    ```

*   **Contoh Penggunaan (fetch):**

    ```javascript
    const prompt = "Buat puisi pendek tentang matahari terbenam.";
    fetch('/ai/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // Ganti dengan API key Anda
      },
      body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Gemini Response:", data.response);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    ```

*   **Contoh Penggunaan (cURL):**

    ```bash
    curl -X POST \
      https://api.example.com/v1/ai/gemini \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "prompt": "Buat puisi pendek tentang matahari terbenam."
      }'
    ```

#### Blackbox <a name="blackbox"></a>

*   **Deskripsi:**  Berinteraksi dengan model bahasa Blackbox untuk menghasilkan kode, menjelaskan kode, dan membantu dalam tugas-tugas pemrograman.
*   **Endpoint:** `/ai/blackbox`
*   **Method:** `POST`
*   **Request Body:**

    ```json
    {
      "prompt": "Pertanyaan atau perintah yang ingin Anda kirim ke Blackbox.",
      "model": "blackbox-code", // Opsional: Tentukan model yang ingin digunakan. Default: blackbox-code
      "temperature": 0.5, // Opsional: Mengontrol keacakan output. Nilai antara 0 dan 1. Default: 0.5
      "max_tokens": 300 // Opsional: Batas jumlah token dalam response. Default: 300
    }
    ```

*   **Response:**

    ```json
    {
      "response": "Jawaban atau kode yang dihasilkan oleh Blackbox.",
      "model": "blackbox-code",
      "usage": {
        "prompt_tokens": 30,
        "completion_tokens": 270,
        "total_tokens": 300
      }
    }
    ```

*   **Contoh Penggunaan (fetch):**

    ```javascript
    const prompt = "Buat fungsi JavaScript untuk menghitung faktorial.";
    fetch('/ai/blackbox', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // Ganti dengan API key Anda
      },
      body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Blackbox Response:", data.response);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    ```

*   **Contoh Penggunaan (cURL):**

    ```bash
    curl -X POST \
      https://api.example.com/v1/ai/blackbox \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer YOUR_API_KEY' \
      -d '{
        "prompt": "Buat fungsi JavaScript untuk menghitung faktorial."
      }'
    ```

### Downloader <a name="downloader"></a>

Endpoint Downloader memungkinkan Anda mengunduh file dari URL yang diberikan.

#### Endpoint: `/downloader/file`

*   **Deskripsi:** Mengunduh file dari URL.
*   **Method:** `POST`
*   **Request Body:**

    ```json
    {
      "url": "URL file yang ingin diunduh."
    }
    ```

*   **Response:**

    *   Berhasil: Mengembalikan file sebagai response.
    *   Gagal: Mengembalikan error message.

*   **Contoh Penggunaan (fetch):**

    ```javascript
    const fileUrl = "https://example.com/image.jpg";
    fetch('/downloader/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: fileUrl })
    })
    .then(response => response.blob()) // Mengambil response sebagai blob
    .then(blob => {
      // Membuat URL untuk blob
      const url = URL.createObjectURL(blob);

      // Membuat link untuk mengunduh file
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded_file.jpg'; // Nama file yang akan diunduh
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Membersihkan URL
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    ```

### Tools <a name="tools"></a>

Endpoint Tools menyediakan berbagai utilitas, seperti konversi format, manipulasi string, dan lainnya.

#### Endpoint: `/tools/uppercase`

*   **Deskripsi:** Mengubah string menjadi huruf besar.
*   **Method:** `POST`
*   **Request Body:**

    ```json
    {
      "text": "String yang ingin diubah."
    }
    ```

*   **Response:**

    ```json
    {
      "uppercase_text": "STRING YANG SUDAH DIUBAH"
    }
    ```

*   **Contoh Penggunaan (fetch):**

    ```javascript
    const text = "teks kecil";
    fetch('/tools/uppercase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
      console.log("Uppercase Text:", data.uppercase_text);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    ```

### Search <a name="search"></a>

Endpoint Search memungkinkan Anda mencari data berdasarkan query yang diberikan.

#### Endpoint: `/search/data`

*   **Deskripsi:** Mencari data berdasarkan query.
*   **Method:** `GET`
*   **Query Parameters:**
    *   `query`: Kata kunci pencarian.

*   **Response:**

    ```json
    [
      {
        "id": 1,
        "title": "Hasil Pencarian 1",
        "description": "Deskripsi hasil pencarian 1."
      },
      {
        "id": 2,
        "title": "Hasil Pencarian 2",
        "description": "Deskripsi hasil pencarian 2."
      }
    ]
    ```

*   **Contoh Penggunaan (fetch):**

    ```javascript
    const query = "kata kunci";
    fetch(`/search/data?query=${query}`)
    .then(response => response.json())
    .then(data => {
      console.log("Search Results:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    ```

## Catatan

*   Pastikan untuk mengganti `/ai/sentiment`, `/downloader/file`, `/tools/uppercase`, dan `/search/data` dengan URL endpoint API yang sebenarnya.
*   Sesuaikan `Content-Type` header sesuai dengan format data yang Anda kirim.
*   Tangani error dengan baik menggunakan blok `catch`.
*   Contoh ini menggunakan `fetch` API yang tersedia di browser modern.  Anda mungkin perlu menggunakan polyfill untuk browser yang lebih lama.

## Kontribusi

Kami menerima kontribusi untuk meningkatkan dokumentasi ini. Jika Anda menemukan kesalahan atau memiliki saran, silakan buat pull request.

## Lisensi

[Lisensi API Anda] (Misalnya: MIT License)
