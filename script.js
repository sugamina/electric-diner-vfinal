document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filters_menu li");
    const categories = document.querySelectorAll(".menu-category");

    // Retrieve the last selected filter from localStorage, or default to 'all'
    const activeFilter = localStorage.getItem('activeFilter') || '*';

    // Set the active class based on the stored filter
    filterButtons.forEach(button => {
        if (button.getAttribute('data-filter') === activeFilter) {
            button.classList.add('active');
        }
    });

    // Apply the filter logic
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Toggle active class
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.getAttribute("data-filter");

            // Store the selected filter in localStorage
            localStorage.setItem('activeFilter', filter);

            categories.forEach((category, index) => {
                if (filter === "*") {
                    // Show only the first 6 items when 'all' filter is active
                    category.style.display = (index < 6) ? "block" : "none";
                } else if (filter === "*" || category.classList.contains(filter.replace('.', ''))) {
                    // Show the filtered items without the 6-item limit
                    category.style.display = "block";
                } else {
                    category.style.display = "none";
                }
            });
        });
    });

    // Apply the filter on page load
    categories.forEach((category, index) => {
        if (activeFilter === "*") {
            // Show only the first 6 items if 'all' filter is active
            category.style.display = (index < 6) ? "block" : "none";
        } else if (activeFilter === "*" || category.classList.contains(activeFilter.replace('.', ''))) {
            category.style.display = "block";
        } else {
            category.style.display = "none";
        }
    });
});

        
// JavaScript for handling tab switching and cart functionality
let cart = [];
        
function showCategory(event, category) {
    const buttons = document.querySelectorAll('.tab-btn');
    const items = document.querySelectorAll('.menu-items');
    
    buttons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
    
    items.forEach(item => {
        item.style.display = item.id === category ? 'grid' : 'none';
    });
}

function addToCart(name, price) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateOrderDisplay();
}

function updateOrderItemQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    
    if (item) {
        item.quantity += change;
        
        // Remove item if quantity reaches 0
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.name !== name);
        }
        
        updateOrderDisplay();
    }
}

function updateOrderDisplay() {
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotalElement = document.getElementById('orderTotal');
    
    // Clear existing items
    orderItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
        orderTotalElement.textContent = 'Total: 0,00 €';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-quantity">
                <button class="quantity-btn" onclick="event.stopPropagation(); updateOrderItemQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="event.stopPropagation(); updateOrderItemQuantity('${item.name}', 1)">+</button>
            </div>
            <div class="order-item-price">${itemTotal.toFixed(2)} €</div>
        `;
        
        orderItemsContainer.appendChild(itemElement);
    });
    
    orderTotalElement.textContent = `Total: ${total.toFixed(2)} €`;
}

function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide!');
        return;
    }
    
    let orderSummary = 'Récapitulatif de votre commande:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderSummary += `${item.name} x${item.quantity} - ${itemTotal.toFixed(2)} €\n`;
    });
    
    orderSummary += `\nTotal: ${total.toFixed(2)} €`;
    
    alert(orderSummary);
    
    // Here you would typically send the order to your backend
    console.log('Order submitted:', cart);
    
    // Clear the cart after checkout
    cart = [];
    updateOrderDisplay();
}