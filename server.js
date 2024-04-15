const express = require('express');
const hbs = require('hbs');
const path = require('path');
@@ -18,12 +22,14 @@ app.set('views', path.join(__dirname, 'views'));
// Function to get the base URL based on environment
function getBaseUrl(req) {
    if (process.env.NODE_ENV === 'production') {
        return 'https://turquoise-puffer-gear.cyclic.app/';
    } else {
        return 'http://localhost:3000'; // Use localhost for local development
    }
}

// Define routes

// Route for the home page
app.get('/', (req, res) => {
    res.render('index');
@@ -48,21 +54,64 @@ app.get('/alldata', (req, res) => {
    });
});

// Route for viewing data
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

// Route for fetching holidays
app.get('/country/:countryName/holidays', async (req, res) => {
    const countryName = req.params.countryName;
    const year = req.query.year || new Date().getFullYear(); // Default to current year if no year is provided

    try {
        // Make a request to the holiday API for the specified country and year
        const response = await axios.get(`${getBaseUrl(req)}/country/${countryName}/holidays?year=${year}`);
        const response = await axios.get('https://holidays-by-api-ninjas.p.rapidapi.com/v1/holidays', {
            params: {
                country: countryName,
                year: year
            },
            headers: {
                'X-RapidAPI-Key': 'aab51485ccmsh9882fea0a2b9967p19bfb9jsn66cc732a240f',
                'X-RapidAPI-Host': 'holidays-by-api-ninjas.p.rapidapi.com'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching holidays for', countryName, 'and year', year, ':', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route for population prediction
app.get('/country/:countryName/population', async (req, res) => {
    const countryName = req.params.countryName;
@@ -108,8 +157,11 @@ app.get('/country/:countryName/population', async (req, res) => {
    }
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000; // Default port is 3000 if PORT environment variable is not provided



// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
