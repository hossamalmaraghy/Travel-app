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
    const geonamesData = await geonamesResponse.json();
    console.log('Geonames Data:', geonamesData); // Debug log

    if (!geonamesData.geonames || geonamesData.geonames.length === 0) {
      return res.status(404).send({ error: 'Location not found' });
    }

    const { lat, lng, countryName } = geonamesData.geonames[0];

    // Weatherbit API call
    const weatherbitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${weatherbitApiKey}`;
    const weatherbitResponse = await fetch(weatherbitUrl);
    const weatherbitData = await weatherbitResponse.json();
    console.log('Weatherbit Data:', weatherbitData); // Debug log

    if (!weatherbitData.data || weatherbitData.data.length === 0) {
      return res.status(404).send({ error: 'Weather data not found' });
    }

    const weather = weatherbitData.data.find(entry => entry.datetime === date);

    // Check if weather for the specified date was found
    if (!weather) {
      console.log(`Weather data for the date ${date} not found.`);
      return res.status(404).send({ error: 'Weather data not available for the selected date' });
    }

    // Pixabay API call
    const pixabayUrl = `https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(city)}&image_type=photo`;
    const pixabayResponse = await fetch(pixabayUrl);
    const pixabayData = await pixabayResponse.json();
    console.log('Pixabay Data:', pixabayData); // Debug log

    const image = pixabayData.hits[0]?.webformatURL || 'default_image_url';

    // Send combined data to client
    res.send({
      city,
      country: countryName,
      weather,
      image,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'An error occurred' });
  }
});
