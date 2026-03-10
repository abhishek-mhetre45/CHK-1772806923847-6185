// ===============================
// CraftConnect Main Script
// ===============================

// ---------- SIMPLE LANDING REDIRECT ----------

// Very lightweight "landing page" behavior:
// when a user first opens the home page (index.html),
// send them to the dedicated login page instead.
(function redirectHomeToLoginOnce() {
    try {
        const path = window.location.pathname.toLowerCase();
        const isHome =
            path.endsWith("/index.html") ||
            path.endsWith("/frontend/") ||
            path.endsWith("/frontend");

        const hasSeenLogin = localStorage.getItem("cc_seenLogin") === "true";

        if (isHome && !hasSeenLogin) {
            localStorage.setItem("cc_seenLogin", "true");
            window.location.href = "pages/login.html";
        }
    } catch (e) {
        // Fail silently if localStorage is not available
    }
})();

// ---------- CART FUNCTIONS ----------

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {

    let cart = getCart();

    let count = cart.reduce((total, item) => {
        return total + (item.quantity || 1);
    }, 0);

    const cartCountElement = document.getElementById("cartCount");

    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}


// ---------- ADD TO CART ----------

// Global add to cart function
window.addToCart = function(product) {

    console.log("Adding product:", product);

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
            artisan: product.artisan || "Local Artisan",
            quantity: product.quantity || 1
        });

    }

    saveCart(cart);

    updateCartCount();

    alert(product.name + " added to cart!");
};


// ---------- PRODUCT DETAIL PAGE ----------

// Increase quantity
function incrementQuantity() {

    const qty = document.getElementById("quantity");

    if (qty) {
        qty.value = parseInt(qty.value) + 1;
    }
}

// Decrease quantity
function decrementQuantity() {

    const qty = document.getElementById("quantity");

    if (qty && qty.value > 1) {
        qty.value = parseInt(qty.value) - 1;
    }
}


// Add to cart from product detail page
function addToCartFromDetail() {

    const qtyInput = document.getElementById("quantity");

    let quantity = 1;

    if (qtyInput) {
        quantity = parseInt(qtyInput.value);
    }

    // ⚠ Change these values dynamically if needed
    const product = {
        id: 1,
        name: "Handmade Clay Pot",
        price: 450,
        image: "../images/pot.jpg",
        artisan: "Ramesh Pottery",
        quantity: quantity
    };

    addToCart(product);
}


// ---------- PAGE INTERACTIONS ----------

document.addEventListener("DOMContentLoaded", function() {

    console.log("CraftConnect loaded");

    updateCartCount();


    // Search functionality
    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");

    if (searchButton && searchInput) {

        searchButton.addEventListener("click", function() {

            const searchTerm = searchInput.value.trim();

            if (searchTerm) {

                console.log("Searching for:", searchTerm);

                alert("Searching for: " + searchTerm);

            }

        });

    }


    // Category dropdown
    const categorySelect = document.querySelector(".category-dropdown select");

    if (categorySelect) {

        categorySelect.addEventListener("change", function() {

            console.log("Selected category:", this.value);

        });

    }


    // Navigation active state
    const navLinks = document.querySelectorAll(".nav-categories a");

    navLinks.forEach(link => {

        link.addEventListener("click", function() {

            navLinks.forEach(l => l.classList.remove("active"));

            this.classList.add("active");

        });

    });


    // Image hover effect
    const imageItems = document.querySelectorAll(".image-item");

    imageItems.forEach(item => {

        item.addEventListener("mouseenter", function() {
            this.style.zIndex = "10";
        });

        item.addEventListener("mouseleave", function() {
            this.style.zIndex = "1";
        });

    });

});


// ---------- LOGOUT ----------

function logout() {
    window.location.href = "marketplace.html";
}