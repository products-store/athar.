// دالة تتبع بدء إتمام الشراء
function trackInitiateCheckout(cart) {
    if (typeof ttq !== 'undefined') {
        const contents = cart.map(item => ({
            content_id: item.id,
            content_name: item.name,
            content_type: 'product',
            quantity: item.quantity,
            price: item.price
        }));
        const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        ttq.track('InitiateCheckout', {
            contents: contents,
            value: totalValue,
            currency: 'DZD'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const subtotalPriceElement = document.querySelector('.subtotal-price');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartCountElement = document.querySelector('.cart-count'); // Reference to the global cart count

    // --- Load Cart from localStorage ---
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // --- Functions ---

    // Function to save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('qudwahCart', JSON.stringify(cart));
        updateCartCount(); // Update cart count in header after saving
    };

    // Function to update cart count in header
    const updateCartCount = () => {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCountElement.textContent = totalItems;
    };

    // Function to calculate and display total prices
    const updateCartTotals = () => {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        subtotalPriceElement.textContent = `${subtotal.toLocaleString('ar-DZ')} د.ج`;
        totalPriceElement.textContent = `${subtotal.toLocaleString('ar-DZ')} د.ج`; // Total is same as subtotal here for now
        checkoutBtn.disabled = cart.length === 0; // Disable checkout if cart is empty
    };

    // --- Function to render cart items ---
    const renderCartItems = () => {
        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.disabled = false; // Enable checkout button
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.dataset.id = item.id; // Store unique ID for identification

                cartItemDiv.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>اللون: ${item.color}</p>
                        <p>المقاس: ${item.size}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <span class="cart-item-price">${(item.price * item.quantity).toLocaleString('ar-DZ')} د.ج</span>
                    <button class="remove-item-btn" data-id="${item.id}">&#10006;</button> `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        updateCartTotals(); // Update totals after rendering items
    };

    // --- Event Listeners ---

    // Event Listeners for quantity change and item removal (using event delegation)
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const itemId = target.dataset.id;
        let itemToUpdate = cart.find(item => item.id === itemId);

        if (!itemToUpdate) return; // Exit if item not found

        if (target.classList.contains('quantity-btn')) {
            if (target.classList.contains('minus')) {
                if (itemToUpdate.quantity > 1) {
                    itemToUpdate.quantity--;
                }
            } else if (target.classList.contains('plus')) {
                itemToUpdate.quantity++;
            }
            saveCart(); // Save changes to localStorage
            renderCartItems(); // Re-render to update quantity display and total price
        } else if (target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.id !== itemId); // Remove item from cart array
            saveCart(); // Save updated cart
            renderCartItems(); // Re-render to reflect removal
        }
    });

    // Event listener for manual quantity input change
    cartItemsContainer.addEventListener('change', (event) => {
        const target = event.target;
        if (target.classList.contains('quantity-input')) {
            const itemId = target.dataset.id;
            let itemToUpdate = cart.find(item => item.id === itemId);
            if (itemToUpdate) {
                let newQuantity = parseInt(target.value);
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1; // Default to 1 if invalid input
                }
                itemToUpdate.quantity = newQuantity;
                saveCart(); // Save changes to localStorage
                renderCartItems(); // Re-render to update quantity display and total price
            }
        }
    });

// --- Link Checkout Button to info page ---
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {

        // --- ✅ الإضافة هنا ---
        trackInitiateCheckout(cart); // إطلاق حدث بدء إتمام الشراء
        // --- نهاية الإضافة ---

        window.location.href = 'info.html'; // Navigate to the info page (will be created next)
    } else {
        alert('سلة التسوق فارغة! الرجاء إضافة منتجات قبل إتمام الشراء.');
    }
});

    // --- Initial Render and Setup when the page loads ---
    renderCartItems();       // This is crucial: Call renderCartItems to display initial cart content
    updateCartCount();       // Update cart count in header on page load
    updateCartTotals();      // Update totals on page load
});