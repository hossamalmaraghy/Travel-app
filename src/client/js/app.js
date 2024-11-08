document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('travel-form');
  
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const city = document.getElementById('city').value.trim();
        const date = document.getElementById('date').value;
  
        if (!city || !date) {
          alert('Please enter both city and date.');
          return;
        }
  
        try {
          const response = await fetch('http://localhost:8082/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city, date }),
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          updateUI(data);
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to fetch data. Please try again.');
        }
      });
    } else {
      console.error("Form element with id 'travel-form' not found.");
    }
    
    function updateUI(data) {
      const { city, country, weather, image } = data;
  
      document.getElementById('result-city').textContent = `${city}, ${country}`;
  
      if (weather) {
        document.getElementById('result-date').textContent = `Date: ${weather.datetime}`;
        document.getElementById('result-temp').textContent = `Temperature: ${weather.temp}°C`;
        document.getElementById('result-description').textContent = `Weather: ${weather.weather.description}`;
      } else {
        document.getElementById('result-date').textContent = 'Date: N/A';
        document.getElementById('result-temp').textContent = 'Temperature: N/A';
        document.getElementById('result-description').textContent = 'Weather: N/A';
      }
  
      document.getElementById('result-image').src = image;
      document.getElementById('results').classList.remove('hidden');
    }
  });
  