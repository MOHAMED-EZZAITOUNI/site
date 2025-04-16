// Product Data
const products = [
    {
        id: 1,
        name: "Intel Core i9-13900K",
        category: "cpu",
        price: 589.99,
        image: "images/cpu-intel-i9.jpg",
        description: "24 cores (8P+16E) / 32 threads, Up to 5.8 GHz, 36MB Cache"
    },
    {
        id: 2,
        name: "AMD Ryzen 9 7950X",
        category: "cpu",
        price: 699.99,
        image: "images/cpu-amd-ryzen.jpg",
        description: "16 cores / 32 threads, Up to 5.7 GHz, 80MB Cache"
    },
    {
        id: 3,
        name: "NVIDIA RTX 4090",
        category: "gpu",
        price: 1599.99,
        image: "images/gpu-rtx-4090.jpg",
        description: "24GB GDDR6X, 16384 CUDA Cores, 2.52 GHz Boost Clock"
    },
    {
        id: 4,
        name: "AMD Radeon RX 7900 XTX",
        category: "gpu",
        price: 999.99,
        image: "images/gpu-rx-7900.jpg",
        description: "24GB GDDR6, 6144 Stream Processors, 2.5 GHz Game Clock"
    },
    {
        id: 5,
        name: "Corsair Vengeance RGB 32GB",
        category: "ram",
        price: 129.99,
        image: "images/ram-corsair.jpg",
        description: "DDR5 5600MHz, CL36, 2x16GB, RGB Lighting"
    },
    {
        id: 6,
        name: "G.Skill Trident Z5 64GB",
        category: "ram",
        price: 249.99,
        image: "images/ram-gskill.jpg",
        description: "DDR5 6000MHz, CL30, 2x32GB, RGB Lighting"
    },
    {
        id: 7,
        name: "Samsung 980 Pro 2TB",
        category: "storage",
        price: 159.99,
        image: "images/ssd-samsung.jpg",
        description: "PCIe 4.0 NVMe, Read 7000 MB/s, Write 5100 MB/s"
    },
    {
        id: 8,
        name: "WD Black SN850X 1TB",
        category: "storage",
        price: 99.99,
        image: "images/ssd-wd.jpg",
        description: "PCIe 4.0 NVMe, Read 7300 MB/s, Write 6300 MB/s"
    },
    {
        id: 9,
        name: "ASUS ROG Maximus Z790",
        category: "motherboard",
        price: 499.99,
        image: "images/mobo-asus.jpg",
        description: "Intel Z790, LGA 1700, DDR5, WiFi 6E, RGB Lighting"
    },
    {
        id: 10,
        name: "MSI MPG B650 Carbon",
        category: "motherboard",
        price: 299.99,
        image: "images/mobo-msi.jpg",
        description: "AMD B650, AM5, DDR5, WiFi 6E, 2.5G LAN"
    },
    {
        id: 11,
        name: "Noctua NH-D15",
        category: "cooling",
        price: 109.99,
        image: "images/cooler-noctua.jpg",
        description: "Dual-Tower CPU Cooler, 2x NF-A15 PWM Fans"
    },
    {
        id: 12,
        name: "Corsair iCUE H150i Elite",
        category: "cooling",
        price: 199.99,
        image: "images/cooler-corsair.jpg",
        description: "360mm Liquid CPU Cooler, RGB Lighting, LCD Display"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        renderCartItems();
    }
}

function calculateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 19.99) : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Render featured products on homepage
    if (document.querySelector('#featured-products')) {
        renderFeaturedProducts();
    }
    
    // Render all products on products page
    if (document.querySelector('#all-products')) {
        renderAllProducts();
        setupFilters();
    }
    
    // Render cart items on cart page
    if (document.querySelector('#cart-items')) {
        renderCartItems();
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Your message has been sent! We will contact you soon.');
            contactForm.reset();
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty');
            } else {
                showNotification('Checkout functionality would be implemented here');
            }
        });
    }
});

// Render functions
function renderFeaturedProducts() {
    const featuredContainer = document.querySelector('#featured-products');
    const featuredProducts = products.slice(0, 4); // Get first 4 products as featured
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function renderAllProducts() {
    const productsContainer = document.querySelector('#all-products');
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    
    let filteredProducts = products;
    if (categoryFilter && categoryFilter !== 'all') {
        filteredProducts = products.filter(product => product.category === categoryFilter);
        document.getElementById('category-filter').value = categoryFilter;
    }
    
    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('#cart-items');
    const cartSummary = document.querySelector('#cart-summary');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
            <div class="cart-item-quantity">
                <button class="decrement" data-id="${item.id}">-</button>
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="increment" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
    
    // Update cart summary
    const totals = calculateCartTotal();
    document.getElementById('subtotal').textContent = `$${totals.subtotal}`;
    document.getElementById('shipping').textContent = `$${totals.shipping}`;
    document.getElementById('tax').textContent = `$${totals.tax}`;
    document.getElementById('total').textContent = `$${totals.total}`;
    
    // Add event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    document.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateCartItemQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateCartItemQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.cart-item-quantity input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const quantity = parseInt(this.value) || 1;
            updateCartItemQuantity(productId, quantity);
        });
    });
}

function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    
    categoryFilter.addEventListener('change', function() {
        const category = this.value;
        window.location.href = `products.html${category === 'all' ? '' : `?category=${category}`}`;
    });
    
    sortBy.addEventListener('change', function() {
        const sortValue = this.value;
        const productsContainer = document.querySelector('#all-products');
        let sortedProducts = [...products];
        
        // Apply category filter if active
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('category');
        if (categoryFilter && categoryFilter !== 'all') {
            sortedProducts = sortedProducts.filter(product => product.category === categoryFilter);
        }
        
        // Apply sorting
        switch(sortValue) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sorting (by ID)
                sortedProducts.sort((a, b) => a.id - b.id);
        }
        
        // Re-render products
        productsContainer.innerHTML = sortedProducts.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Re-add event listeners to add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    });
}