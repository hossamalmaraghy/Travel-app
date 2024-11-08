export async function handleSubmit(event) {
  event.preventDefault();

  const city = document.getElementById('city').value;
  const date = document.getElementById('date').value;
  const errorMessageElement = document.getElementById('error-message');
  errorMessageElement.textContent = ''; // Clear previous error message

  try {
    // Make the API call to your server
    const response = await fetch('http://localhost:8082/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, date }),
    });

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    displayResults(data); // Call display function with API data
  } catch (error) {
    console.error('Error:', error.message);
    errorMessageElement.textContent = 'Error: Could not fetch data. Please try again later.';
  }
}

function displayResults(data) {
  // Display the data on the page
  document.getElementById('result-city').textContent = data.city;
  document.getElementById('result-date').textContent = data.weather.datetime;
  document.getElementById('result-temp').textContent = `Temperature: ${data.weather.temp}°C`;
  document.getElementById('result-description').textContent = data.weather.weather.description;
  document.getElementById('result-image').src = data.image || 'default_image_url';

  // Show results section
  document.getElementById('results').classList.remove('hidden');
}
