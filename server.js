const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// כאן נשתמש במשתנה סביבה כדי לא לחשוף את המפתח
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// הגדרת ספרייה סטטית עבור קבצים ציבוריים
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!GOOGLE_API_KEY) {
        return res.status(500).json({ message: 'מפתח API של Google חסר.' });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`,
            {
                contents: [{
                    role: 'user',
                    parts: [{ text: userMessage }]
                }]
            }
        );

        const botResponse = response.data.candidates[0].content.parts[0].text;
        res.json({ message: botResponse });

    } catch (error) {
        console.error('Error calling Google Gemini API:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'אירעה שגיאה בחיבור לשרת הבינה המלאכותית.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
