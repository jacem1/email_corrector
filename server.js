const express = require('express');
const bodyParser = require('body-parser');
const correctEmailWithAI = require('./functions/correctEmail'); // Import the function

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Route for the email correction function
app.post('/correctEmail', async (req, res) => {
    const { text } = req.body;
    try {
        const correctedText = await correctEmailWithAI(text);
        res.json({ correctedText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

console.log('API_KEY is set:', !!process.env.API_KEY);
