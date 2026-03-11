// ===============================
// CraftConnect Main Script
// ===============================

// ---------- AUTH GUARD ----------
// script.js runs only on protected pages (index, marketplace, cart, etc.)
// Redirect to login if user is not signed in
(function authGuard() {
    try {
        var u = localStorage.getItem("cc_user");
        if (!u) {
            var path = window.location.pathname.toLowerCase();
            var loginUrl = (path.indexOf("/pages/") !== -1) ? "login.html" : "pages/login.html";
            window.location.replace(loginUrl);
        }
    } catch (e) {}
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
    updateUserProfileUI();
    initUserProfileDropdown();


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


// ---------- USER PROFILE (when logged in) ----------

function getLoggedInUser() {
    try {
        var u = localStorage.getItem("cc_user");
        return u ? JSON.parse(u) : null;
    } catch (e) { return null; }
}

function updateUserProfileUI() {
    var user = getLoggedInUser();
    var authLinks = document.getElementById("authLinks");
    var userProfileWrap = document.getElementById("userProfileWrap");
    var userDisplayName = document.getElementById("userDisplayName");
    var userProfileName = document.getElementById("userProfileName");
    var userProfileEmail = document.getElementById("userProfileEmail");

    if (!authLinks || !userProfileWrap) return;

    if (user && (user.name || user.email)) {
        authLinks.style.display = "none";
        userProfileWrap.style.display = "block";
        if (userDisplayName) userDisplayName.textContent = user.name || user.email || "User";
        if (userProfileName) userProfileName.textContent = user.name || "—";
        if (userProfileEmail) userProfileEmail.textContent = user.email || "—";
    } else {
        authLinks.style.display = "";
        userProfileWrap.style.display = "none";
    }
}

function initUserProfileDropdown() {
    var trigger = document.getElementById("userProfileTrigger");
    var wrap = document.getElementById("userProfileWrap");
    var logoutBtn = document.getElementById("logoutBtn");

    if (trigger && wrap) {
        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            wrap.classList.toggle("open");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            try { localStorage.removeItem("cc_user"); } catch (e) {}
            wrap && wrap.classList.remove("open");
            var base = window.location.pathname.indexOf("/pages/") !== -1 ? "../index.html" : "index.html";
            window.location.href = base;
        });
    }

    document.addEventListener("click", function () {
        if (wrap) wrap.classList.remove("open");
    });
    var menu = wrap ? wrap.querySelector(".user-profile-menu") : null;
    if (menu) {
        menu.addEventListener("click", function (e) { e.stopPropagation(); });
    }
}

// ---------- LOGOUT ----------

function logout() {
    try { localStorage.removeItem("cc_user"); } catch (e) {}
    window.location.href = "marketplace.html";
}