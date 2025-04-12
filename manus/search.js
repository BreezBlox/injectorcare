// Search functionality for services-near-me.html
document.addEventListener('DOMContentLoaded', function() {
    // Load business data from data.js
    const businessData = window.businesses || [];
    const citiesData = window.cities || [];
    
    // Initialize the page
    displayBusinesses(businessData);
    
    // Set up search functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    // Add search input event listener for suggestions
    searchInput.addEventListener('input', function() {
        const input = this.value.toLowerCase();
        if (input.length > 2) {
            const matches = citiesData.filter(city => 
                city.toLowerCase().includes(input)
            ).slice(0, 5); // Limit to 5 suggestions
            
            // Display suggestions (in a real app, this would be more sophisticated)
            console.log("Suggestions:", matches);
            // Here you would show a dropdown with matches
        }
    });
    
    // Add search form submit event
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm) {
            // Filter businesses by location
            const filteredBusinesses = businessData.filter(business => 
                business.location.toLowerCase().includes(searchTerm)
            );
            
            // Update page title and breadcrumbs
            document.getElementById('page-title').textContent = `Fuel Injector Services in ${searchInput.value}`;
            document.getElementById('location-breadcrumb').textContent = searchInput.value;
            document.getElementById('location-breadcrumb').style.display = 'inline';
            
            // Display filtered businesses
            displayBusinesses(filteredBusinesses);
        } else {
            // If search is empty, show all businesses
            displayBusinesses(businessData);
            document.getElementById('page-title').textContent = 'Find Fuel Injector Cleaning Services Near You';
            document.getElementById('location-breadcrumb').style.display = 'none';
        }
    });
    
    // Add event listener for business cards
    document.addEventListener('click', function(e) {
        // Find closest business card if clicked within one
        const businessCard = e.target.closest('.business-card');
        if (businessCard) {
            const businessId = businessCard.getAttribute('data-id');
            if (businessId) {
                // Navigate to business detail page
                window.location.href = `business-detail.html?id=${businessId}`;
            }
        }
    });
    
    // Add event listener for filter dropdowns
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // In a real app, this would filter the results
            console.log("Filter changed:", this.value);
        });
    });
    
    // Add event listener for "Use current location" button
    document.getElementById('use-location').addEventListener('click', function() {
        // In a real app, this would use the Geolocation API
        alert("In a real application, this would access your current location.");
        // For demo purposes, set a default location
        searchInput.value = "Chicago, IL";
    });
});

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
                <div class="business-name">${business.name}</div>
                <div class="business-location">${business.location}</div>
            </div>
        `;
        
        businessGrid.appendChild(businessCard);
    });
}
