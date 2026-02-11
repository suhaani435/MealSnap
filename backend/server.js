const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize Google GenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_GEMINI_API_KEY' });

app.post('/api/analyze', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
    }

    try {
        // Read the file buffer
        const imagePath = req.file.path;
        const imageData = fs.readFileSync(imagePath);
        const imageBase64 = imageData.toString('base64');

        // Clean up the uploaded file
        fs.unlinkSync(imagePath);

        const prompt = `Analyze this food image and provide nutritional information. 
    Return ONLY a valid JSON object with the following structure:
    {
      "foods": [
        {
          "name": "Food Item Name",
          "grams": estimated_weight_in_grams,
          "protein": protein_in_grams,
          "carbs": carbs_in_grams,
          "fats": fats_in_grams,
          "calories": calories
        }
      ],
      "total": {
        "protein": total_protein,
        "carbs": total_carbs,
        "fats": total_fats,
        "calories": total_calories
      }
    }
    Do not include markdown formatting or explanations. Just the JSON.`;

        // Use the new SDK's generateContent method
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: req.file.mimetype,
                                data: imageBase64
                            }
                        }
                    ]
                }
            ]
        });

        const validResponse = response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0];
        const text = validResponse ? validResponse.text : "";

        console.log('Gemini Response:', text);

        // Robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        const jsonStr = jsonMatch[0];
        const data = JSON.parse(jsonStr);

        res.json(data);

    } catch (error) {
        console.error('Error analyzing image:', error);
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response, null, 2));
        }
        res.status(500).json({
            error: 'Failed to analyze image',
            details: error.message,
            stack: error.stack
        });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
