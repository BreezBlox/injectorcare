/**
 * Google Places API integration for InjectorCare service locator
 * This file enhances search.js with live search functionality
 * Updated to use recommended Place API instead of deprecated PlacesService
 */

// Initialize Google Places API
function initPlacesAPI() {
    console.log('[gpa.js] initPlacesAPI called.');
    
    // Initialize geocoder for converting locations to coordinates
    window.geocoder = new google.maps.Geocoder();
    
    // Check if we should restore search results (coming back from detail page)
    const params = new URLSearchParams(window.location.search);
    const shouldRestore = params.get('restore') === 'true';
    console.log(`[gpa.js] Checking restore conditions. shouldRestore=${shouldRestore}`);
    
    // If coming back from detail page and we have stored results
    const resultsString = localStorage.getItem('lastSearchResults');
    const location = localStorage.getItem('lastSearchLocation');
    console.log(`[gpa.js] Found in localStorage - Location: ${location}, Results stored: ${resultsString ? 'Yes' : 'No'}`);

    if (shouldRestore && resultsString && location) {
        console.log(`[gpa.js] Restore conditions met for location: ${location}`);
        console.log(`[gpa.js] Raw results string from localStorage: ${resultsString.substring(0, 100)}...`); // Log snippet
        try {
            const results = JSON.parse(resultsString);
            console.log(`[gpa.js] Attempting to parse results string.`);

            if (results && results.length > 0) {
                console.log(`[gpa.js] Parsed ${results.length} results successfully.`);
                // Update the search box with the location
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = location;
                    console.log(`[gpa.js] Updated search box value to: ${location}`);
                }
                
                // Display the stored results
                console.log('[gpa.js] Calling displayBusinessResults with restored data.');
                displayBusinessResults(results);
                console.log('[gpa.js] displayBusinessResults completed for restored data.');
                
                // Clear URL parameter to avoid confusion on refresh
                try {
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                    console.log('[gpa.js] Cleared restore parameter from URL.');
                } catch(urlError) {
                     console.error('[gpa.js] Error clearing URL parameter:', urlError);
                }
            } else {
                console.warn('[gpa.js] Parsed results are empty or invalid during restore.');
            }
        } catch (e) {
            console.error('[gpa.js] Error parsing results during restore:', e);
        }
    } else {
         console.log(`[gpa.js] Restore conditions NOT met. shouldRestore=${shouldRestore}, hasResults=${resultsString ? 'Yes' : 'No'}, hasLocation=${location ? 'Yes' : 'No'}`);
         // Fallback logic (if any) can go here if needed
    }
    
    // Add event listener to detect back button navigation and restore previous search results
    window.addEventListener('pageshow', function(event) {
        console.log('[gpa.js] Page loaded from back-forward cache - attempting to restore search results');
        const lastSearchResults = localStorage.getItem('lastSearchResults');
        const lastSearchLocation = localStorage.getItem('lastSearchLocation');
        
        if (event.persisted) {
            if (lastSearchResults) {
                try {
                    const businesses = JSON.parse(lastSearchResults);
                    if (businesses && businesses.length > 0) {
                        // Update page title and breadcrumbs with the last search location
                        if (lastSearchLocation) {
                            document.getElementById('page-title').textContent = `Fuel Injector Services in ${lastSearchLocation}`;
                            document.getElementById('location-breadcrumb').textContent = lastSearchLocation;
                            document.getElementById('location-breadcrumb').style.display = 'inline';
                            
                            // Update search input
                            const searchInput = document.getElementById('search-input');
                            if (searchInput) {
                                searchInput.value = lastSearchLocation;
                            }
                        }
                        
                        // Display the businesses
                        displayBusinessResults(businesses);
                        console.log(`[gpa.js] Restored ${businesses.length} results on pageshow event`);
                    }
                } catch (e) {
                    console.warn('[gpa.js] Error restoring previous search results on pageshow', e);
                }
            }
        }
    });
}

// Enhance search functionality by replacing static data with live API calls
function enhanceSearchFunctionality() {
    // Get form elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input'); 
    const useLocationButton = document.getElementById('use-location');
    
    // Override the existing search form submit event
    if (searchForm) {
        // Add our enhanced event listener directly to the original form
        searchForm.addEventListener('submit', function(e) {
            console.log('[gpa.js] Enhanced searchForm SUBMIT listener triggered. Event Target:', e.target);
            e.preventDefault();
            e.stopImmediatePropagation(); 
            const searchTerm = document.getElementById('search-input').value; 
            
            // Show loading indicator
            const businessGrid = document.getElementById('business-grid');
            businessGrid.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Searching for services near you...</div>';
            
            console.log(`[gpa.js] Enhanced search submitted for: "${searchTerm}"`);
            if (searchTerm) {
                // Update page title and breadcrumbs
                document.getElementById('page-title').textContent = `Fuel Injector Services in ${searchTerm}`;
                document.getElementById('location-breadcrumb').textContent = searchTerm;
                document.getElementById('location-breadcrumb').style.display = 'inline';
                
                // Search for businesses using Google Places API
                searchForBusinesses(searchTerm);
            } else {
                // If search is empty, show a message
                businessGrid.innerHTML = 
                    '<p class="no-results">Please enter a location to find fuel injector services.</p>';
                document.getElementById('page-title').textContent = 'Find Fuel Injector Cleaning Services Near You';
                document.getElementById('location-breadcrumb').style.display = 'none';
            }
        });
    } else {
        console.warn('[gpa.js] Search form (#search-form) not found.');
    }
    
    // Enhance "Use current location" button
    if (useLocationButton) {
        // Add enhanced event listener directly to the original button
        useLocationButton.addEventListener('click', function() {
            console.log('[gpa.js] Enhanced Use Location button CLICK listener triggered.');
            if (navigator.geolocation) {
                // Show loading indicator
                const currentSearchInput = document.getElementById('search-input'); 
                currentSearchInput.value = 'Locating you...';
                currentSearchInput.disabled = true;
                
                navigator.geolocation.getCurrentPosition(function(position) {
                    // Get user's coordinates
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Use reverse geocoding to get human-readable address
                    window.geocoder.geocode({ 'location': userLocation }, function(results, status) {
                        currentSearchInput.disabled = false; 
                        
                        if (status === google.maps.GeocoderStatus.OK && results[0]) {
                            // Get city and state from address components
                            let city = '';
                            let state = '';
                            
                            for (let i = 0; i < results[0].address_components.length; i++) {
                                const component = results[0].address_components[i];
                                
                                if (component.types.includes('locality')) {
                                    city = component.long_name;
                                }
                                
                                if (component.types.includes('administrative_area_level_1')) {
                                    state = component.short_name;
                                }
                            }
                            
                            const locationString = city && state ? `${city}, ${state}` : results[0].formatted_address;
                            currentSearchInput.value = locationString;
                            
                            // Trigger search
                            document.getElementById('search-form').dispatchEvent(new Event('submit'));
                        } else {
                            // Error handling
                            currentSearchInput.value = '';
                            alert('Unable to determine your location. Please enter a location manually.');
                            console.error('Geocoder error:', status);
                        }
                    });
                }, function(error) {
                    // Handle geolocation error
                    const currentSearchInput = document.getElementById('search-input'); 
                    currentSearchInput.disabled = false;
                    currentSearchInput.value = '';
                    console.error('Geolocation error:', error);
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            alert('Location access was denied. Please enter your location manually or allow location access in your browser settings.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert('Location information is unavailable. Please enter your location manually.');
                            break;
                        case error.TIMEOUT:
                            alert('The request to get your location timed out. Please enter your location manually.');
                            break;
                        default:
                            alert('An unknown error occurred while trying to get your location. Please enter your location manually.');
                    }
                }, {
                    // Geolocation options
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            } else {
                alert('Geolocation is not supported by your browser. Please enter your location manually.');
            }
        });
    } else {
         console.warn('[gpa.js] Use location button (#use-location) not found.');
    }
    
    // Enhance filter dropdowns to work with API results
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            filterApiResults();
        });
    });
}

// Utility function to generate star rating HTML
function generateStarRating(rating) {
    const maxStars = 5;
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }

    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    // Handle case of 0 rating or invalid input explicitly if needed
    if (rating <= 0 || isNaN(rating)) {
        starsHTML = ''; // Or return 5 empty stars, based on desired display
        for (let i = 0; i < maxStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }


    return starsHTML;
}

// Search for businesses using Google Places API (using async/await and new Place API)
async function searchForBusinesses(location) {
    console.log(`[gpa.js] Searching for businesses in: ${location}`);
    window.currentLocation = location; // Store the search location
    
    // Define the fields required from the Place API
    // See: https://developers.google.com/maps/documentation/javascript/reference/places
    const requiredFields = [
        'id', // Corresponds to place_id
        'displayName', // Corresponds to name
        'formattedAddress', // Corresponds to formatted_address / vicinity
        'location', // Corresponds to geometry.location (lat/lng)
        'rating', // Corresponds to rating
        'userRatingCount', // Corresponds to user_ratings_total
        'photos', // Corresponds to photos
        'businessStatus' // e.g., 'OPERATIONAL'
        // Add 'regularOpeningHours' if needed for display on search page
    ];

    try {
        // First, geocode the location string to coordinates using await
        const geocodeResponse = await window.geocoder.geocode({ 'address': location });
        
        if (!geocodeResponse || !geocodeResponse.results || geocodeResponse.results.length === 0) {
            throw new Error('Geocoding failed or returned no results.');
        }
        
        const coords = geocodeResponse.results[0].geometry.location;
        console.log(`[gpa.js] Geocoded location to: ${coords.lat()}, ${coords.lng()}`);
        
        // Define search terms, starting specific and becoming broader
        const searchTerms = [
            'fuel injector cleaning service',
            'fuel injector repair',
            'auto repair shop fuel injection',
            'automotive service',
            'auto repair'
        ];
        
        let combinedResults = new Map(); // Use a Map to store unique results by place ID
        let searchSuccessful = false;

        // --- Use NEW Place.searchByText --- 
        for (const term of searchTerms) {
            console.log(`[gpa.js] Executing text search for: ${term} in ${location}`);
            const request = {
                textQuery: `${term} near ${location}`, // Use 'near' for better location relevance
                locationBias: coords, 
                fields: requiredFields,
                language: 'en-US',
                region: 'US',
            };

            try {
                const response = await google.maps.places.Place.searchByText(request);
                console.log(`[gpa.js] Text search status for '${term}': OK, results: ${response.places.length}`);
                
                if (response.places && response.places.length > 0) {
                    // Add unique results to the map
                    response.places.forEach(place => {
                        if (place.id && !combinedResults.has(place.id)) {
                            combinedResults.set(place.id, place);
                        }
                    });
                    searchSuccessful = true;
                    // Optional: Break after first successful search term finds enough results?
                    // if (combinedResults.size >= 10) break; 
                }
            } catch (error) {
                // Log error but continue trying other terms
                console.error(`[gpa.js] Error during Place.searchByText for '${term}':`, error);
            }
        }

        // --- Fallback: Use NEW Place.searchNearby if text searches yielded few results ---
        if (!searchSuccessful || combinedResults.size < 5) {
            console.log('[gpa.js] Text searches yielded few/no results. Attempting nearby search for generic types.');
            
            // Use type names relevant to car repair
            const includedTypes = ['car_repair', 'auto_repair_shop']; 
            
            const nearbyRequest = {
                locationRestriction: {
                   center: coords,
                   radius: 50000 // 50km radius
                },
                includedTypes: includedTypes, 
                // Cannot use rankPreference: 'DISTANCE' with includedTypes/keyword
                // Results are implicitly biased by proximity to the center.
                fields: requiredFields,
                language: 'en-US',
                region: 'US'
           };
           
           try {
                const response = await google.maps.places.Place.searchNearby(nearbyRequest);
                console.log(`[gpa.js] Nearby search status: OK, results: ${response.places.length}`);
                if (response.places && response.places.length > 0) {
                    response.places.forEach(place => {
                         if (place.id && !combinedResults.has(place.id)) {
                            combinedResults.set(place.id, place);
                        }
                    });
                }
           } catch (error) {
                console.error('[gpa.js] Error during Place.searchNearby:', error);
                // Proceed even if nearby search fails, might have results from text search
           }
        }

        // Convert Map values back to an array and handle results
        const finalResults = Array.from(combinedResults.values());
        window.currentSearchResults = finalResults; // Update global store
        handleSearchResults(finalResults, 'OK', null, location, coords); // Pass 'OK' status

    } catch (error) {
        // Handle Geocoding errors or other major issues in the async flow
        console.error('[gpa.js] Main search process failed:', error);
        const businessGrid = document.getElementById('business-grid');
        let errorMsg = 'An error occurred during the search. Please try again.';
        if (error.message.includes('Geocoding failed')) {
            errorMsg = 'Could not understand the location you entered. Please try again with a valid city, state, or zip code.';
        }
        businessGrid.innerHTML = `<p class="no-results error">${errorMsg}</p>`;
        window.currentSearchResults = []; // Clear results on error
        // Optionally call handleSearchResults with an error status if needed elsewhere
        // handleSearchResults([], 'GEOCODING_ERROR', null, location, null);
    }
}

// Handle search results (receives places array directly from Place class methods)
// Added coords parameter for potential future use (e.g., calculating distance)
function handleSearchResults(results, status, pagination, location, coords) { 
    // Store results in localStorage for potential use on the detail page
    // Note: Results are now Place objects, adapt storage if needed
    if (status === 'OK' && results && results.length > 0) {
        try {
            // Extract only necessary data to avoid exceeding localStorage limits
            // Adapt to new Place object properties
            const resultsToStore = results.map(place => ({
                place_id: place.id, 
                name: place.displayName,
                formatted_address: place.formattedAddress,
                rating: place.rating,
                user_ratings_total: place.userRatingCount, // Direct number or undefined
                // Location requires checking existence and calling functions
                geometry: { location: { lat: place.location?.lat(), lng: place.location?.lng() } }, 
                // Photos require checking existence and calling getURI
                photos: place.photos?.map(p => ({ url: p.getURI() })), // Store URI directly
                business_status: place.businessStatus,
                // opening_hours: place.regularOpeningHours // Store if needed
            }));
            localStorage.setItem('searchResultsData', JSON.stringify(resultsToStore));
            console.log(`[gpa.js] Saved ${resultsToStore.length} results to localStorage`);
        } catch (e) {
            console.error('[gpa.js] Error saving results to localStorage:', e);
            localStorage.removeItem('searchResultsData');
        }
    } else {
        // Clear storage if no results or error
         localStorage.removeItem('searchResultsData');
    }

    // Display business results or 'no results' message
    displayBusinessResults(results, status, location);
}

// Display business results in the grid
function displayBusinessResults(results, status, location) {
    const businessGrid = document.getElementById('business-grid');
    console.log('[gpa.js] Displaying results. Grid cleared.');
    businessGrid.innerHTML = ''; // Clear previous results or loading indicator

    // Use status directly, as the new methods don't pass a string status like the old service
    // We determine success/failure based on the try/catch blocks in searchForBusinesses
    if (status === 'OK' && results && results.length > 0) {
        results.forEach((place, index) => {
            // Adapt property access based on the new Place object structure
            const placeId = place.id;
            const name = place.displayName;
            const address = place.formattedAddress;
            const rating = place.rating; // Direct number or undefined
            const totalRatings = place.userRatingCount; // Direct number or undefined
            
            // Get photo URL - adapt based on new Photo class structure
            let photoUrl = 'img/placeholder.png'; // Default placeholder
            if (place.photos && place.photos.length > 0) {
                try {
                     // Request specific size for consistency
                     photoUrl = place.photos[0].getURI({ maxWidth: 400, maxHeight: 300 });
                } catch (e) {
                    console.warn(`[gpa.js] Could not get photo URI for ${name}:`, e);
                    // Keep placeholder if URI fails
                }
            }
            
            // Create a card with a unique ID for direct access
            const cardId = `business-card-${index}`;
            const buttonId = `view-details-${index}`;
            const card = document.createElement('div');
            card.id = cardId;
            card.classList.add('api-business-card');
            card.innerHTML = `
                <img src="${photoUrl}" alt="${name || 'Business Location'}" class="business-photo">
                <div class="business-info">
                    <h3>${name || 'Name not available'}</h3>
                    <div class="rating">
                        ${generateStarRating(rating || 0)}
                        <span>${rating ? rating.toFixed(1) : 'N/A'} (${totalRatings || 0} reviews)</span>
                    </div>
                    <p class="address"><i class="fas fa-map-marker-alt"></i> ${address || 'Address not available'}</p>
                </div>
                <div class="business-actions" style="padding: 10px; text-align: center;">
                    <button 
                        id="${buttonId}"
                        type="button" 
                        class="details-button" 
                        data-place-id="${placeId}"
                        style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; cursor: pointer; width: 100%;">
                        View Details for ${name}
                    </button>
                </div>
            `;
            
            businessGrid.appendChild(card);
            
            // Store navigation data for later use
            window.businessNavData = window.businessNavData || {};
            window.businessNavData[buttonId] = {
                placeId: placeId,
                businessName: name
            };
        });
        
        // Delay attaching event handlers to ensure DOM is fully rendered
        setTimeout(function() {
            // Attach handlers to all buttons
            document.querySelectorAll('.details-button').forEach(button => {
                button.addEventListener('click', function(e) {
                    const id = this.id;
                    const data = window.businessNavData[id];
                    
                    if (data) {
                        console.log('[gpa.js] Button clicked via setTimeout handler:', id, data);
                        e.preventDefault(); // Prevent any default action
                        e.stopPropagation(); // Stop event from bubbling up
                        
                        // Directly open in same window using a more forceful approach
                        try {
                            const url = `business-detail.html?id=${data.placeId}`;
                            console.log('[gpa.js] Attempting navigation to:', url);
                            
                            // Try multiple navigation approaches
                            window.open(url, '_self');
                            
                            // As a fallback, create and click a real link
                            const a = document.createElement('a');
                            a.href = url;
                            a.target = '_self';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            
                            return false;
                        } catch(error) {
                            console.error('[gpa.js] Navigation error:', error);
                            alert('Navigation error: ' + error.message);
                        }
                    } else {
                        console.error('[gpa.js] No data found for button:', id);
                    }
                });
                
                // Also add a direct onclick property using the most reliable approach
                button.onclick = function(e) {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    
                    const id = this.id;
                    const data = window.businessNavData[id];
                    
                    if (data) {
                        console.log('[gpa.js] Button clicked via onclick property:', id, data);
                        
                        // Create and click a physical anchor element
                        const url = `business-detail.html?id=${data.placeId}`;
                        const a = document.createElement('a');
                        a.href = url;
                        a.target = '_self';
                        a.style.display = 'none';
                        document.body.appendChild(a);
                        a.click();
                        setTimeout(function() {
                            document.body.removeChild(a);
                        }, 100);
                        
                        return false;
                    }
                };
            });
        }, 500); // Wait 500ms to ensure rendering is complete
    } else {
        // Display appropriate 'no results' message
        let message = '';
        // Status might not be 'ZERO_RESULTS' anymore, rely on results array length
        if (status === 'OK' && (!results || results.length === 0)) {
             message = `No fuel injector services found matching your search near '${location}'. Try a broader search term or different location.`;
        } else {
            // Handle other potential error statuses if passed from catch blocks (though we handle errors before calling this now)
            message = `An error occurred while searching (${status}). Please try again.`;
        }
       
        businessGrid.innerHTML = `<p class="no-results">${message}</p>`;
    }
}

// Handle clicks within the business grid
function businessGridClickHandler(e) {
    console.log('[gpa.js] Grid click detected. Target:', e.target);
    
    // Check if the click was on a details button
    if (e.target.classList.contains('details-button') || e.target.closest('.details-button')) {
        console.log('[gpa.js] Details button clicked!');
        
        // Get the button (could be the target or parent)
        const button = e.target.classList.contains('details-button') ? e.target : e.target.closest('.details-button');
        const placeId = button.getAttribute('data-place-id');
        
        if (placeId) {
            console.log('[gpa.js] Getting details before navigation for place:', placeId);
            
            // Show loading message for better UX
            const businessCard = button.closest('.api-business-card');
            if (businessCard) {
                button.innerHTML = 'Loading details...';
                button.disabled = true;
            }
            
            // Get full place details before navigating
            const request = {
                placeId: placeId,
                fields: [
                    'name', 'formatted_address', 'formatted_phone_number', 
                    'rating', 'reviews', 'photos', 'website', 'opening_hours',
                    'geometry', 'types'
                ]
            };
            
            // Create a PlacesService instance (reuse the map if possible)
            let service;
            if (window.map) {
                service = new google.maps.places.PlacesService(window.map);
            } else {
                // Create a dummy map if needed
                console.log('[gpa.js] Creating dummy map for PlacesService');
                const mapDiv = document.createElement('div');
                mapDiv.style.display = 'none';
                document.body.appendChild(mapDiv);
                const map = new google.maps.Map(mapDiv, {
                    center: { lat: 0, lng: 0 },
                    zoom: 2
                });
                service = new google.maps.places.PlacesService(map);
            }
            
            service.getDetails(request, function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log('[gpa.js] Got place details before navigation:', place.name);
                    
                    // Save to localStorage for the detail page to use
                    try {
                        const storageKey = 'business_' + placeId;
                        localStorage.setItem(storageKey, JSON.stringify(place));
                        console.log(`[gpa.js] Saved place details to localStorage: ${storageKey}`);
                    } catch (e) {
                        console.warn('[gpa.js] Could not save to localStorage:', e);
                    }
                    
                    // Now navigate to the detail page
                    window.location.href = `business-detail.html?id=${placeId}`;
                } else {
                    console.error('[gpa.js] Failed to get place details:', status);
                    // Navigate anyway
                    window.location.href = `business-detail.html?id=${placeId}`;
                    
                    // Restore button state
                    if (businessCard) {
                        button.innerHTML = 'View Details';
                        button.disabled = false;
                    }
                }
            });
        } else {
            console.error('[gpa.js] No place ID found for button');
        }
        
        // Prevent any other handlers from firing
        e.stopPropagation();
    }
}

// Initialize when Google Maps API loads
window.initMap = function() {
    console.log("Google Maps API loaded successfully!");
    // Try-catch to help identify any errors during initialization
    try {
        // Initialize map
        // Ensure the map div exists before initializing
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            window.map = new google.maps.Map(mapDiv, {
                center: { lat: 40.7128, lng: -74.0060 }, // Default to New York
                zoom: 12,
                disableDefaultUI: true // Keep UI clean
            });
            console.log('[gpa.js] Google Map initialized.');
        } else {
             console.warn('[gpa.js] Map div not found for initialization.');
             // Create a dummy map element if needed for PlacesService
             const dummyMapDiv = document.createElement('div');
             dummyMapDiv.style.display = 'none';
             document.body.appendChild(dummyMapDiv);
             window.map = new google.maps.Map(dummyMapDiv, {
                center: { lat: 0, lng: 0 },
                zoom: 2
            });
            console.log('[gpa.js] Created dummy map for PlacesService.');
        }

        // Initialize geocoder and places service
        window.geocoder = new google.maps.Geocoder();
        // window.placesService = new google.maps.places.PlacesService(window.map); // Deprecated
        console.log('[gpa.js] Geocoder initialized.');

    } catch (error) {
        console.error('[gpa.js] Error initializing Google Maps in initMap:', error);
        const grid = document.getElementById('business-grid');
        if(grid) {
             grid.innerHTML = '<p class="error">Failed to initialize mapping services. Please try refreshing the page.</p>';
        }
    }
};

// Ensure the DOM is fully loaded before trying to attach event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('[gpa.js] DOM fully loaded and parsed. Enhancing search functionality...');
    // Initialize the Google Maps API dependent services first if initMap hasn't run
    if (!window.geocoder) {
        console.warn('[gpa.js] DOMContentLoaded fired before initMap completed. Attempting init.');
        // This might happen if Google script loading is very slow or fails.
        // Consider adding robustness here, maybe trying initMap again or showing an error.
        // For now, we assume initMap will have run or will run shortly after.
    }
    enhanceSearchFunctionality(); 
});
