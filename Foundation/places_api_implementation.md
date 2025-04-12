# Google Places API Implementation Guide

## 1. Setup Google Cloud Platform Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "InjectorCare-Maps")
3. Enable billing for the project (required for Google Maps Platform)
4. Navigate to APIs & Services > Library
5. Search for and enable "Places API"

## 2. Generate API Key

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "API Key"
3. Restrict the key:
   - Set application restrictions to "HTTP referrers"
   - Add your website domain and localhost for testing
   - Restrict the key to Places API only
4. Note down the API key for use in your code

## 3. Code Implementation

### HTML Changes (find-services.html)

Add the Google Maps JavaScript API with the Places library:

```html
<!-- Before closing </body> tag -->
<script 
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initPlacesAPI" 
  async defer
></script>
```

### JavaScript Changes (search.js)

Replace the static search with Google Places API:

```javascript
// Initialize Places API
function initPlacesAPI() {
  // Set up the PlacesService once the API has loaded
  const mapDiv = document.createElement('div');
  const placesService = new google.maps.places.PlacesService(mapDiv);
  
  // Store the service in window for access from other functions
  window.placesService = placesService;
  
  // Set up event listeners that will now use the Places API
  setupEventListeners();
}

// Search for fuel injector services using Places API
function searchForServices(location) {
  // Create search request
  const request = {
    query: `fuel injector cleaning service near ${location}`,
    fields: ['name', 'geometry', 'formatted_address', 'rating', 'photos', 'place_id', 'website']
  };
  
  // Execute the search
  window.placesService.textSearch(request, handleSearchResults);
}

// Handle search results from Places API
function handleSearchResults(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    // Convert API results to our business format
    const businesses = results.map((place, index) => {
      return {
        id: place.place_id,
        name: place.name,
        location: place.formatted_address,
        rating: place.rating || 0,
        image: place.photos && place.photos[0] ? 
          place.photos[0].getUrl({maxWidth: 400, maxHeight: 300}) : 
          'images/placeholder.jpg',
        website: place.website || '#',
        // Default services since Places API doesn't provide specific services
        services: ['Fuel Injector Cleaning', 'Diagnostic Services'],
        description: `${place.name} provides professional fuel injector cleaning services in ${place.formatted_address}.`
      };
    });
    
    // Display the results
    displayBusinesses(businesses);
  } else {
    // Handle errors
    document.getElementById('business-grid').innerHTML = 
      '<p class="no-results">Unable to find fuel injector services in this location. Please try another search.</p>';
    console.error('Places API error:', status);
  }
}
```

### Implement Geolocation

Enhance "Use current location" button functionality:

```javascript
document.getElementById('use-location').addEventListener('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // Get coordinates
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      // Use reverse geocoding to get human-readable address
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(lat, lng);
      
      geocoder.geocode({ 'location': latLng }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            // Set search input value to the user's location
            searchInput.value = results[0].formatted_address;
            
            // Search for services near this location
            const request = {
              location: latLng,
              radius: '10000',
              keyword: 'fuel injector cleaning service'
            };
            
            window.placesService.nearbySearch(request, handleSearchResults);
          }
        }
      });
    }, function(error) {
      console.error("Error obtaining location", error);
      alert("Unable to access your location. Please enter a location manually.");
    });
  } else {
    alert("Geolocation is not supported by your browser. Please enter a location manually.");
  }
});
```

## 4. Testing and Debugging

1. Test with various locations
2. Monitor API usage in Google Cloud Console
3. Implement error handling for all API calls
4. Add caching to reduce API usage

## 5. Cost Considerations

As of 2023, Google Maps Platform pricing:
- Places API: $17 per 1,000 calls for Places Details
- Autocomplete: $2.83 per 1,000 calls
- Basic Places Data: $2.83 per 1,000 calls

Consider implementing:
- Client-side caching to reduce API calls
- Rate limiting to prevent excessive usage
- Usage monitoring and alerts
