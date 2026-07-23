const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Variabel untuk menyimpan data RDP terakhir
let currentRdpData = {
    status: "Offline",
    ip: "Menunggu data...",
    username: "-",
    password: "-",
    cpu: "-",
    ram: "-",
    startTime: null
};

// 1. Endpoint untuk MENERIMA data dari GitHub Actions (POST)
app.post('/api/update-rdp', (req, res) => {
    const data = req.body;
    
    // Validasi sederhana
    if (data.ip && data.password) {
        currentRdpData = data;
        console.log("✅ Data RDP terbaru berhasil diterima:", currentRdpData.ip);
        res.status(200).json({ message: "Data berhasil disimpan!" });
    } else {
        res.status(400).json({ message: "Data tidak lengkap." });
    }
});

// 2. Endpoint untuk MENGIRIM data ke Web Frontend kamu (GET)
app.get('/api/get-rdp', (req, res) => {
    res.status(200).json(currentRdpData);
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server RDP Dashboard berjalan di port ${PORT}`);
});
