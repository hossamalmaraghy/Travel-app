# Weather Web App

This project enables users to plan trips by providing real-time weather information and images for their chosen destinations. With a simple and user-friendly interface, users can enter a destination and travel date to receive weather data, a countdown to the trip, and an image of the location.

## Project Overview

This project demonstrates how to build a weather-focused web application using a combination of frontend and backend technologies. The backend handles requests to various weather and image APIs, while the frontend offers an interactive interface for entering trip details and displaying the resulting information.

### Features

- **Real-time Weather Information**: Provides current or forecasted weather based on the trip date.
- **Countdown Timer**: Shows the number of days remaining until the trip.
- **Location Image**: Displays an image of the destination to enhance the travel planning experience.
- **Offline Capability**: Includes a service worker to enable offline functionality, allowing the app to work without an internet connection.

## How to Run the App

### Prerequisites

1. **Node.js**
2. **NPM**
3. **API Keys** for:
   - [GeoNames](https://www.geonames.org/export/web-services.html) - Used to get location coordinates based on city names.
   - [Weatherbit](https://www.weatherbit.io/api) - Provides weather data for destinations.
   - [Pixabay](https://pixabay.com/api/docs/) - Fetches destination images.
