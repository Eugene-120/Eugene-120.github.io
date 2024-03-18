// app.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Порт для запуска сервера

// Подключаем статические файлы (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут для страницы контактов
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});