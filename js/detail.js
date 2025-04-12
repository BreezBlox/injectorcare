// Business Detail Page Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('[detail.js] DOM content loaded, initializing business details page');
    
    // Set up back button
    document.getElementById('back-to-search').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'find-services.html';
    });
    
    // Get the business ID from URL
    const params = new URLSearchParams(window.location.search);
    const businessId = params.get('id') || params.get('place_id');
    
    if (!businessId) {
        console.error('[detail.js] No business ID found in URL');
        document.getElementById('business-name').textContent = 'Error: No business ID provided';
        hideLoadingIndicator();
        return;
    }
    
    console.log(`[detail.js] Processing business ID: ${businessId}`);
    
    // Try to get business data from localStorage
    let businessData = null;
    try {
        const storageKeys = [
            'business_' + businessId,  // Try the standard key
            businessId                 // Try just the ID (older format)
        ];
        
        for (const key of storageKeys) {
            const data = localStorage.getItem(key);
            if (data) {
                businessData = JSON.parse(data);
                console.log(`[detail.js] Found cached data for ${businessData.name || 'unnamed business'}`);
                break;
            }
        }
    } catch (e) {
        console.warn('[detail.js] Error reading from localStorage:', e);
    }
    
    // Show basic data immediately if available while we load full details
    if (businessData) {
        showBasicBusinessInfo(businessData);
    }
    
    // Always load full details from Places API for the freshest data
    loadBusinessDetails(businessId);
});

// Show basic business info while waiting for full API data
function showBasicBusinessInfo(business) {
    if (!business) return;
    
    console.log('[detail.js] Showing basic business info while waiting for full details');
    
    try {
        // Business name and location
        if (business.name) {
            document.getElementById('business-name').textContent = business.name;
            document.getElementById('business-breadcrumb').textContent = business.name;
            document.title = `${business.name} - Fuel Injector Cleaning | InjectorCare`;
        }
        
        if (business.formatted_address) {
            document.getElementById('business-location').textContent = business.formatted_address;
            document.getElementById('business-address').textContent = business.formatted_address;
        }
        
        // Phone
        if (business.formatted_phone_number) {
            document.getElementById('business-phone').textContent = business.formatted_phone_number;
        }
        
        // Website
        if (business.website) {
            const websiteEl = document.getElementById('business-website');
            websiteEl.href = business.website;
            websiteEl.textContent = business.website.replace(/^https?:\/\//, '');
        }
        
        // Rating
        if (business.rating) {
            const ratingContainer = document.getElementById('business-rating');
            if (ratingContainer) {
                ratingContainer.textContent = `Rating: ${business.rating.toFixed(1)}/5`;
            }
        }
    } catch (e) {
        console.error('[detail.js] Error displaying basic info:', e);
    }
}

// Load full business details from Places API
function loadBusinessDetails(businessId) {
    console.log('[detail.js] Loading full business details from Places API');
    
    try {
        // Verify Google Maps API is loaded
        if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
            console.error('[detail.js] Google Maps API not available');
            document.getElementById('business-name').textContent = 'Error: Maps API not loaded';
            hideLoadingIndicator();
            return;
        }
        
        // Create a map element for the Places service
        const mapElement = document.createElement('div');
        mapElement.style.display = 'none';
        document.body.appendChild(mapElement);
        
        const map = new google.maps.Map(mapElement, {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 15
        });
        
        const service = new google.maps.places.PlacesService(map);
        
        // Request details from Places API
        const request = {
            placeId: businessId,
            fields: [
                'name', 'formatted_address', 'formatted_phone_number', 
                'rating', 'reviews', 'photos', 'website', 'opening_hours',
                'geometry', 'types', 'url', 'place_id'
            ]
        };
        
        console.log('[detail.js] Requesting place details from API');
        
        service.getDetails(request, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                console.log('[detail.js] Successfully loaded details for:', place.name);
                
                // Save to localStorage for future use
                try {
                    localStorage.setItem('business_' + businessId, JSON.stringify(place));
                } catch (e) {
                    console.warn('[detail.js] Error saving to localStorage:', e);
                }
                
                // Display the full business details
                displayFullBusinessDetails(place);
            } else {
                console.error('[detail.js] Error loading details:', status);
                hideLoadingIndicator();
                
                // Show error message if we don't even have basic data
                if (!document.getElementById('business-name').textContent || 
                    document.getElementById('business-name').textContent === 'Loading business details...') {
                    document.getElementById('business-name').textContent = 'Error loading business details';
                    document.getElementById('business-details').innerHTML = `
                        <div class="error-message">
                            <p>Sorry, we couldn't load details for this business.</p>
                            <a href="find-services.html" class="btn">Return to Search</a>
                        </div>
                    `;
                }
            }
        });
    } catch (e) {
        console.error('[detail.js] Error in loadBusinessDetails:', e);
        hideLoadingIndicator();
    }
}

// Display full business details
function displayFullBusinessDetails(business) {
    console.log('[detail.js] Displaying full business details');
    
    try {
        // Business name and title
        document.getElementById('business-name').textContent = business.name || 'Business Details';
        document.getElementById('business-breadcrumb').textContent = business.name || '';
        document.title = `${business.name} - Fuel Injector Cleaning | InjectorCare`;
        
        // Location/address
        const locationEl = document.getElementById('business-location');
        const addressEl = document.getElementById('business-address');
        if (locationEl) locationEl.textContent = business.formatted_address || '';
        if (addressEl) addressEl.textContent = business.formatted_address || 'Address not available';
        
        // Rating with stars
        const ratingContainer = document.getElementById('business-rating');
        if (ratingContainer && business.rating) {
            let starsHtml = '';
            const rating = business.rating;
            
            // Generate star icons
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    starsHtml += '<i class="fas fa-star"></i>'; // Full star
                } else if (i - 0.5 <= rating) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>'; // Half star
                } else {
                    starsHtml += '<i class="far fa-star"></i>'; // Empty star
                }
            }
            
            ratingContainer.innerHTML = starsHtml + ` <span>(${rating.toFixed(1)})</span>`;
        }
        
        // Business image
        const imageEl = document.getElementById('business-image');
        if (imageEl) {
            if (business.photos && business.photos.length > 0) {
                try {
                    imageEl.src = business.photos[0].getUrl({maxWidth: 800, maxHeight: 600});
                    imageEl.alt = business.name;
                } catch (e) {
                    console.warn('[detail.js] Error loading photo:', e);
                    imageEl.src = 'images/placeholder-business.jpg';
                }
            } else {
                imageEl.src = 'images/placeholder-business.jpg';
            }
        }
        
        // Phone number
        const phoneEl = document.getElementById('business-phone');
        if (phoneEl) phoneEl.textContent = business.formatted_phone_number || 'Phone not available';
        
        // Website
        const websiteEl = document.getElementById('business-website');
        if (websiteEl) {
            if (business.website) {
                websiteEl.href = business.website;
                websiteEl.textContent = business.website.replace(/^https?:\/\//, '');
            } else {
                websiteEl.textContent = 'Website not available';
                websiteEl.removeAttribute('href');
                websiteEl.style.color = '#999';
            }
        }
        
        // Business services/types
        const servicesListEl = document.getElementById('business-services');
        if (servicesListEl) {
            servicesListEl.innerHTML = '';
            
            if (business.types && business.types.length > 0) {
                business.types.forEach(type => {
                    // Format type string for display
                    const formattedType = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-check"></i> ${formattedType}`;
                    servicesListEl.appendChild(li);
                });
            } else {
                // Default service if none available
                const li = document.createElement('li');
                li.innerHTML = '<i class="fas fa-check"></i> Fuel Injector Service';
                servicesListEl.appendChild(li);
            }
        }
        
        // Business hours
        const hoursEl = document.getElementById('business-hours');
        if (hoursEl) {
            hoursEl.innerHTML = '';
            
            if (business.opening_hours && business.opening_hours.weekday_text) {
                business.opening_hours.weekday_text.forEach(day => {
                    const li = document.createElement('li');
                    li.textContent = day;
                    hoursEl.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'Hours not available';
                hoursEl.appendChild(li);
            }
        }
        
        // Initialize map if coordinates are available
        if (business.geometry && business.geometry.location) {
            try {
                initializeMap({
                    lat: business.geometry.location.lat(),
                    lng: business.geometry.location.lng()
                }, business.name);
            } catch (e) {
                console.error('[detail.js] Error initializing map:', e);
            }
        }
        
        // Set up action buttons
        setupActionButtons(business);
        
        // Display reviews
        displayReviews(business);
        
        // Hide loading indicator now that everything is displayed
        hideLoadingIndicator();
    } catch (e) {
        console.error('[detail.js] Error displaying business details:', e);
        hideLoadingIndicator();
    }
}

// Initialize Google Map
function initializeMap(coordinates, businessName) {
    console.log('[detail.js] Initializing map with coordinates:', coordinates);
    
    try {
        const mapContainer = document.getElementById('business-map');
        if (!mapContainer) {
            console.error('[detail.js] Map container not found');
            return;
        }
        
        const map = new google.maps.Map(mapContainer, {
            center: coordinates,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: true
        });
        
        // Add marker for the business
        const marker = new google.maps.Marker({
            position: coordinates,
            map: map,
            title: businessName
        });
        
        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `<div style="max-width: 200px;"><b>${businessName || 'Business Location'}</b></div>`
        });
        
        // Open info window when marker is clicked
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
        
        // Initially open the info window
        infoWindow.open(map, marker);
        
        // Set up expand map link
        const expandMapEl = document.getElementById('expand-map');
        if (expandMapEl) {
            expandMapEl.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName)}`;
            expandMapEl.target = '_blank';
        }
    } catch (e) {
        console.error('[detail.js] Error initializing map:', e);
    }
}

// Display business reviews
function displayReviews(business) {
    try {
        const reviewsContainer = document.getElementById('business-reviews');
        if (!reviewsContainer) return;
        
        reviewsContainer.innerHTML = '';
        
        if (!business.reviews || business.reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews available for this business.</p>';
            return;
        }
        
        // Sort reviews by time (newest first)
        const sortedReviews = business.reviews.sort((a, b) => b.time - a.time);
        
        // Display each review
        sortedReviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            // Generate stars for the rating
            let ratingStars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    ratingStars += '<i class="fas fa-star"></i>';
                } else {
                    ratingStars += '<i class="far fa-star"></i>';
                }
            }
            
            // Format the date
            const reviewDate = new Date(review.time * 1000);
            const formattedDate = reviewDate.toLocaleDateString('en-US', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
            
            // Create review HTML
            reviewItem.innerHTML = `
                <div class="review-header">
                    <div class="review-author">
                        <img src="${review.profile_photo_url || 'images/user-placeholder.jpg'}" alt="${review.author_name}" class="avatar">
                        <div>
                            <h4>${review.author_name}</h4>
                            <div class="review-rating">
                                ${ratingStars}
                            </div>
                            <span class="review-date">${formattedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="review-text">
                    <p>${review.text}</p>
                </div>
            `;
            
            reviewsContainer.appendChild(reviewItem);
        });
    } catch (e) {
        console.error('[detail.js] Error displaying reviews:', e);
    }
}

// Set up action buttons (directions, share, save)
function setupActionButtons(business) {
    try {
        // Get directions button
        const directionsButton = document.getElementById('get-directions');
        if (directionsButton) {
            directionsButton.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.formatted_address || '')}`;
            directionsButton.target = '_blank';
        }
        
        // Share button (using Web Share API if available)
        const shareButton = document.getElementById('share-business');
        if (shareButton) {
            shareButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (navigator.share) {
                    navigator.share({
                        title: business.name,
                        text: `Check out ${business.name} for fuel injector services`,
                        url: window.location.href
                    })
                    .then(() => console.log('[detail.js] Shared successfully'))
                    .catch((error) => console.log('[detail.js] Share error:', error));
                } else {
                    // Fallback - copy URL to clipboard
                    const tempInput = document.createElement('input');
                    document.body.appendChild(tempInput);
                    tempInput.value = window.location.href;
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    
                    alert('Link copied to clipboard');
                }
            });
        }
        
        // Save business button
        const saveButton = document.getElementById('save-business');
        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get saved businesses from localStorage
                const savedBusinesses = JSON.parse(localStorage.getItem('savedBusinesses') || '[]');
                
                // Check if already saved
                const alreadySaved = savedBusinesses.some(saved => saved.id === business.place_id);
                
                if (alreadySaved) {
                    // Remove from saved list
                    const updatedSaved = savedBusinesses.filter(saved => saved.id !== business.place_id);
                    localStorage.setItem('savedBusinesses', JSON.stringify(updatedSaved));
                    saveButton.innerHTML = '<i class="far fa-bookmark"></i> Save';
                    alert('Business removed from your saved list');
                } else {
                    // Add to saved list
                    savedBusinesses.push({
                        id: business.place_id,
                        name: business.name,
                        address: business.formatted_address,
                        rating: business.rating,
                        saved_at: new Date().toISOString()
                    });
                    
                    localStorage.setItem('savedBusinesses', JSON.stringify(savedBusinesses));
                    saveButton.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                    alert('Business saved to your list');
                }
            });
            
            // Set initial state based on saved status
            const savedBusinesses = JSON.parse(localStorage.getItem('savedBusinesses') || '[]');
            const alreadySaved = savedBusinesses.some(saved => saved.id === business.place_id);
            
            if (alreadySaved) {
                saveButton.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            }
        }
    } catch (e) {
        console.error('[detail.js] Error setting up action buttons:', e);
    }
}

// Hide loading indicator
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}
