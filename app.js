const express = require('express');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

// Set the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Define routes
app.get('/alldata', (req, res) => {
    // Read the JSON file
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/viewdata', (req, res) => {
    // Read the JSON file
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        try {
            const jsonData = JSON.parse(data);
            const countries = jsonData.country.map(country => {
                let capital = "N/A"; // Default value for capital
                if (country['@capital']) {
                    capital = country['@capital'].split('-').pop(); // Extract city name from @capital
                }
                return {
                    name: country.name,
                    capital,
                    unemployment: country.unemployment,
                    gdpTotal: country.gdp_total // Assuming the total GDP is available in the gdp_total field
                };
            });

            res.render('alldata', { countries });
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
