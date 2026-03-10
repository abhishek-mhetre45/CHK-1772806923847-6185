// Mobile menu and interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                console.log('Searching for:', searchTerm);
                // Add your search logic here
                alert(`Searching for: ${searchTerm}`);
            }
        });
    }
    
    // Category dropdown change
    const categorySelect = document.querySelector('.category-dropdown select');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            console.log('Selected category:', this.value);
            // Add your category filter logic here
        });
    }
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-categories a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Image hover effects (optional)
    const imageItems = document.querySelectorAll('.image-item');
    imageItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
    
    console.log('ShopLocal - Hero section loaded');

    function logout() {
    window.location.href = 'marketplace.html';
}
});