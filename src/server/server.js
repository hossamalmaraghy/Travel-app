const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

const port = 8082;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/api', async (req, res) => {
  const { city, date } = req.body;
  const geonamesUsername = process.env.GEONAMES_USERNAME;
  const weatherbitApiKey = process.env.WEATHERBIT_API_KEY;
  const pixabayApiKey = process.env.PIXABAY_API_KEY;

  try {
    // Geonames API call
    const geonamesUrl = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${geonamesUsername}`;
    const geonamesResponse = await fetch(geonamesUrl);
    if (!geonamesResponse.ok) throw new Error('Failed to fetch Geonames data');
    
    const geonamesData = await geonamesResponse.json();
    if (!geonamesData.geonames || geonamesData.geonames.length === 0) {
      return res.status(404).send({ error: 'Location not found' });
    }

    const { lat, lng, countryName } = geonamesData.geonames[0];

    // Weatherbit API call
    const weatherbitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherbitApiKey}`;
    const weatherbitResponse = await fetch(weatherbitUrl);
    if (!weatherbitResponse.ok) throw new Error('Failed to fetch Weatherbit data');
    
    const weatherbitData = await weatherbitResponse.json();
    const weather = weatherbitData.data.find(entry => entry.datetime === date);
    if (!weather) {
      return res.status(404).send({ error: 'Weather data not available for the selected date' });
    }

    // Pixabay API call
    const pixabayUrl = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(city)}&image_type=photo`;
    const pixabayResponse = await fetch(pixabayUrl);
    if (!pixabayResponse.ok) throw new Error('Failed to fetch Pixabay data');
    
    const pixabayData = await pixabayResponse.json();
    const image = pixabayData.hits[0]?.webformatURL || 'default_image_url';

    // Send combined data to client
    res.send({
      city,
      country: countryName,
      weather,
      image,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ error: 'An error occurred while fetching data. Please try again later.' });
  }
});
