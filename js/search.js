// Search functionality for find-services.html
document.addEventListener('DOMContentLoaded', function() {
    // Load business data from data.js
    const businessData = window.businesses || [];
    const citiesData = window.cities || [];
    
    // Initialize the page
    // displayBusinesses(businessData); // REMOVED - Let google-places-api handle display
    
    // Set up search functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    // Add search input event listener for suggestions
    searchInput.addEventListener('input', function() {
        const input = this.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        
        if (input.length > 2) {
            const matches = citiesData.filter(city => 
                city.toLowerCase().includes(input)
            ).slice(0, 5); // Limit to 5 suggestions
            
            if (matches.length > 0) {
                suggestionsContainer.style.display = 'block';
                matches.forEach(match => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = match;
                    suggestionItem.addEventListener('click', function() {
                        searchInput.value = match;
                        suggestionsContainer.style.display = 'none';
                        // Trigger search with this value
                        const event = new Event('submit');
                        searchForm.dispatchEvent(event);
                    });
                    suggestionsContainer.appendChild(suggestionItem);
                });
            } else {
                suggestionsContainer.style.display = 'none';
            }
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput && e.target !== suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Add search form submit event (Fallback - only if Google Places API isn't loaded)
    // We check if initMap exists, as google-places-api.js relies on it being called
    if (typeof window.initMap === 'undefined') {
        console.log('[search.js] Adding fallback search form submit listener.');
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.toLowerCase();
            
            if (searchTerm) {
                // Filter businesses by location (using static data)
                const filteredBusinesses = businessData.filter(business => 
                    business.location.toLowerCase().includes(searchTerm)
                );
                
                // Update page title and breadcrumbs
                document.getElementById('page-title').textContent = `Fuel Injector Services in ${searchInput.value}`;
                document.getElementById('location-breadcrumb').textContent = searchInput.value;
                document.getElementById('location-breadcrumb').style.display = 'inline';
                
                // Display filtered businesses (using static data)
                // displayBusinesses(filteredBusinesses); // This function is commented out at the end of the file
            } else {
                // If search is empty, show all businesses (using static data)
                // displayBusinesses(businessData);
                document.getElementById('page-title').textContent = 'Find Fuel Injector Cleaning Services Near You';
                document.getElementById('location-breadcrumb').style.display = 'none';
            }
        });
    } else {
        console.log('[search.js] Skipping fallback search form submit listener (Google API expected).');
    }
    
    // Add event listener for business cards (Keep this for potential fallback display)
    document.addEventListener('click', function(e) {
        console.log('[search.js] Document click detected. Target:', e.target);

        const clickedApiCard = e.target.closest('.api-business-card');
        console.log('[search.js] Clicked inside .api-business-card?:', clickedApiCard);

        // FIRST: Check if the click originated within an API-generated card
        if (clickedApiCard) {
            console.log('[search.js] Click inside .api-business-card. Fallback listener ignoring.');
            return; // Let API logic (or default link behavior) handle it.
        }

        console.log('[search.js] Proceeding to fallback logic...');

        // --- Fallback Logic (for cards potentially generated by old code) ---
        // Find the closest business card ancestor
        const businessCard = e.target.closest('.business-card');
        
        // If the click wasn't inside a business card, ignore it
        if (!businessCard) {
            return;
        }

        // If the card has 'data-business-id', it's handled by google-places-api.js
        // Let that script's specific button listener handle the click.
        if (businessCard.hasAttribute('data-business-id')) {
            console.log('[search.js] Clicked inside API card (has data-business-id). Ignoring in fallback listener.');
            return; 
        }

        // Handle clicks on the rest of the card (original behavior for fallback cards)
        const businessId = businessCard.getAttribute('data-id'); // Use data-id for fallback
        if (businessId) {
            console.log(`[search.js] Fallback navigation for data-id: ${businessId}`);
            // Navigate to business detail page (simple version for fallback)
            window.location.href = `business-detail.html?id=${businessId}`;
        }
    });
    
    // Add event listeners for filter dropdowns
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            filterBusinesses();
        });
    });
    
    // Function to filter businesses based on selected filters
    function filterBusinesses() {
        const ratingFilter = document.getElementById('rating-filter').value;
        const distanceFilter = document.getElementById('distance-filter').value;
        const searchTerm = searchInput.value.toLowerCase();
        
        // Start with all businesses or location-filtered businesses
        let filteredBusinesses = businessData;
        if (searchTerm) {
            filteredBusinesses = filteredBusinesses.filter(business => 
                business.location.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply rating filter if selected
        if (ratingFilter && ratingFilter !== 'all') {
            const minRating = parseInt(ratingFilter);
            filteredBusinesses = filteredBusinesses.filter(business => 
                business.rating >= minRating
            );
        }
        
        // In a real app, distance filter would use geolocation
        // For demo, we're just showing the functionality
        
        // Display filtered businesses
        // displayBusinesses(filteredBusinesses);
    }
    
    // Add event listener for "Use current location" button (Fallback - only if Google Places API isn't loaded)
    if (typeof window.initMap === 'undefined') {
        console.log('[search.js] Adding fallback Use Location listener.');
        const useLocationButton = document.getElementById('use-location');
        if (useLocationButton) {
            useLocationButton.addEventListener('click', function() {
                if (navigator.geolocation) {
                    // Show loading indicator
                    searchInput.value = "Locating you...";
                    searchInput.disabled = true;
                    
                    navigator.geolocation.getCurrentPosition(function(position) {
                        // Get coordinates from geolocation API
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        // Check if Google Maps API is available with geocoder
                        if (window.google && window.google.maps && window.google.maps.Geocoder) {
                            const geocoder = new google.maps.Geocoder();
                            geocoder.geocode({ 'location': { lat, lng } }, function(results, status) {
                                searchInput.disabled = false;
                                
                                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                                    // Extract city and state from address components
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
                                    
                                    // Set the location string
                                    searchInput.value = city && state ? `${city}, ${state}` : results[0].formatted_address;
                                } else {
                                    // Fallback to coordinates
                                    searchInput.value = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
                                }
                                
                                // Trigger search
                                const event = new Event('submit');
                                searchForm.dispatchEvent(event);
                            });
                        } else {
                            // Fallback if Google Maps API is not available
                            searchInput.disabled = false;
                            searchInput.value = `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
                            const event = new Event('submit');
                            searchForm.dispatchEvent(event);
                        }
                    }, function(error) {
                        // Handle geolocation errors
                        searchInput.disabled = false;
                        searchInput.value = '';
                        console.error("Error obtaining location", error);
                        alert("Unable to access your location. Please enter a location manually.");
                    }, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    });
                } else {
                    alert("Geolocation is not supported by your browser. Please enter a location manually.");
                }
            });
        }
    } else {
         console.log('[search.js] Skipping fallback Use Location listener (Google API expected).');
    }
});

/* REMOVED - This logic is replaced by google-places-api.js
// Function to display businesses in the grid
function displayBusinesses(businessList) {
    const businessGrid = document.getElementById('business-grid');
    
    // Clear existing businesses
    businessGrid.innerHTML = '';
    
    if (businessList.length === 0) {
        // Display no results message
        businessGrid.innerHTML = '<p class="no-results">No fuel injector services found in this location. Try another search or browse our national service providers.</p>';
        return;
    }
    
    // Add each business to the grid
    businessList.forEach(business => {
        const businessCard = document.createElement('div');
        businessCard.className = 'business-card';
        businessCard.setAttribute('data-id', business.id);
        
        // Create rating stars
        let ratingStars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= business.rating) {
                ratingStars += '<span class="rating-icon">★</span>';
            } else {
                ratingStars += '<span class="rating-icon">☆</span>';
            }
        }
        
        businessCard.innerHTML = `
            <img src="${business.image}" alt="${business.name}" class="business-image">
            <div class="business-info">
                <div class="rating">
                    ${ratingStars}
                </div>
                <h3 class="business-name">${business.name}</h3>
                <div class="business-location">${business.location}</div>
            </div>
        `;
        
        businessGrid.appendChild(businessCard);
    });
}
*/
