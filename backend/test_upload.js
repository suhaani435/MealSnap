const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function testUpload() {
    try {
        const form = new FormData();
        const filePath = path.join(__dirname, 'uploads', 'Health2.jpg');

        if (!fs.existsSync(filePath)) {
            console.error('Test file not found:', filePath);
            return;
        }

        form.append('image', fs.createReadStream(filePath));

        console.log('Sending request to http://localhost:5000/api/analyze...');

        const response = await axios.post('http://localhost:5000/api/analyze', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Error Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testUpload();
