// Business detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get business ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const businessId = urlParams.get('id') || 1; // Default to first business if no ID
    
    // Load business data from data.js
    const businessData = window.businesses || [];
    
    // Find the selected business
    const business = businessData.find(b => b.id == businessId) || businessData[0];
    
    // Update page title
    document.title = `${business.name} - Fuel Injector Cleaning | InjectorCare`;
    
    // Update business details
    document.getElementById('business-name').textContent = business.name;
    document.getElementById('business-address').textContent = business.address;
    document.getElementById('business-description').textContent = business.description;
    document.getElementById('business-phone').textContent = business.phone;
    document.getElementById('business-website').href = business.website;
    document.getElementById('main-image').src = business.image;
    document.getElementById('main-image').alt = business.name;
    
    // Update rating stars
    const ratingContainer = document.getElementById('rating');
    ratingContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'rating-icon';
        star.textContent = i <= business.rating ? '★' : '☆';
        ratingContainer.appendChild(star);
    }
    
    // Update services list
    const servicesList = document.getElementById('services-list');
    servicesList.innerHTML = '';
    business.services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.textContent = service;
        servicesList.appendChild(serviceItem);
    });
    
    // Update breadcrumb
    document.getElementById('location-breadcrumb').textContent = business.location.split(',')[0];
    document.getElementById('business-breadcrumb').textContent = business.name;
    
    // Set up similar businesses (would normally be based on location/services)
    const similarBusinesses = businessData.filter(b => b.id != business.id).slice(0, 3);
    const similarContainer = document.getElementById('similar-businesses');
    similarContainer.innerHTML = '';
    
    similarBusinesses.forEach(similar => {
        const card = document.createElement('div');
        card.className = 'similar-card';
        card.innerHTML = `
            <img src="${similar.image}" alt="${similar.name}" class="similar-image">
            <div class="similar-info">
                <div class="similar-name">${similar.name}</div>
                <div class="similar-location">${similar.location}</div>
            </div>
        `;
        card.addEventListener('click', function() {
            window.location.href = `business-detail.html?id=${similar.id}`;
        });
        similarContainer.appendChild(card);
    });
    
    // Set up image thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            document.getElementById('main-image').src = this.src;
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Set up action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span:last-child').textContent;
            console.log(`Action clicked: ${action}`);
            
            // In a real app, these would perform actual actions
            switch(action) {
                case 'Share':
                    alert(`Share ${business.name} with others`);
                    break;
                case 'Save':
                    alert(`${business.name} saved to your favorites`);
                    break;
                case 'Call':
                    alert(`Calling ${business.phone}`);
                    break;
                case 'Directions':
                    alert(`Getting directions to ${business.address}`);
                    break;
            }
        });
    });
    
    // Set up review button
    document.querySelector('.review-button').addEventListener('click', function() {
        alert(`Leave a review for ${business.name}`);
    });
    
    // Set up photo button
    document.querySelector('.add-photo-button').addEventListener('click', function() {
        alert(`Add a photo of ${business.name}`);
    });
    
    // Set up question button
    document.querySelector('.ask-button').addEventListener('click', function() {
        alert(`Ask a question about ${business.name}`);
    });
});
