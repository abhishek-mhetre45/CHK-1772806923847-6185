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

// Global cart functionality

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count on all pages
function updateCartCount(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((total,item)=> total + item.quantity,0);
    document.getElementById("cartCount").textContent = count;
}

updateCartCount();

// Add to cart function (make it global)
window.addToCart = function(product) {
    console.log('Adding to cart:', product); // For debugging
    
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + (product.quantity || 1);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            artisan: product.artisan || '',
            quantity: product.quantity || 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    
    // Show success message
    alert(`${product.name} added to cart!`);
    
    return false; // Prevent any default behavior
};

// Initialize on every page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart script initialized');
    updateCartCount();
});

});