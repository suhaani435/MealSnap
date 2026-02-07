require('dotenv').config();
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
            model: "gemini-2.0-flash", // Using a stable 2.0 model as requested/implied by the move to new SDK
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

        // The response structure in the new SDK is slightly different
        // response.text() is a helper, but sometimes you access response.candidates[0].content.parts[0].text
        const text = response.text; // In the new SDK, .text might be a getter or property on the response object directly if helper exists, or we check docs. 
        // Based on user snippet: console.log(response.text); -> It seems to be a property.

        console.log('Gemini Response:', text);

        // Clean up response if it contains markdown code blocks
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
