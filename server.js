const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Module untuk baca/tulis file
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Nama file tempat kita akan menyimpan datanya
const DATA_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Fungsi untuk membaca data dari file database.json
function getRdpData() {
    try {
        // Cek apakah file database.json sudah ada
        if (fs.existsSync(DATA_FILE)) {
            const rawData = fs.readFileSync(DATA_FILE);
            return JSON.parse(rawData);
        }
    } catch (error) {
        console.error("Gagal membaca file database:", error);
    }
    
    // Kalau file belum ada (server baru pertama kali nyala), kembalikan data default ini
    return {
        status: "Offline",
        ip: "Menunggu data...",
        username: "-",
        password: "-",
        cpu: "-",
        ram: "-",
        startTime: null
    };
}

// 1. Endpoint untuk MENERIMA data dari GitHub Actions (POST)
app.post('/api/update-rdp', (req, res) => {
    const data = req.body;
    
    if (data.ip && data.password) {
        try {
            // Tulis dan simpan datanya ke dalam file database.json
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            console.log("✅ Data RDP terbaru berhasil disimpan ke database.json");
            res.status(200).json({ message: "Data berhasil disimpan ke file!" });
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            res.status(500).json({ message: "Gagal menyimpan data ke file." });
        }
    } else {
        res.status(400).json({ message: "Data tidak lengkap." });
    }
});

// 2. Endpoint untuk MENGIRIM data ke Web Frontend kamu (GET)
app.get('/api/get-rdp', (req, res) => {
    // Selalu baca data paling baru langsung dari file database.json
    const currentData = getRdpData();
    res.status(200).json(currentData);
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server RDP Dashboard berjalan di port ${PORT}`);
});
