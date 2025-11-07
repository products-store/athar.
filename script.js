
    // --- Product Data Definition ---
    const productDetails = {
        name: "قميص رجالي أنيق",
        price: 4500,
        imagePrefix: "images/shirt-",
        colors: {
            'black': {
                name: 'أسود',
                main: 'images/black-1.JPG',
                thumbnails: [
                    'images/black-1.JPG',
                    'images/black-2.JPG',
                    'images/black-3.JPG',
                    'images/black-4.JPG',
                    'images/black-5.JPG'
                ],
                availableSizes: ['52', '54', '56', '58']
            },
            'white': {
                name: 'أبيض',
                main: 'images/white-1.JPG',
                thumbnails: [
                    'images/white-1.JPG',
                    'images/white-2.JPG',
                    'images/white-3.JPG',
                    'images/white-4.JPG'
                ],
                availableSizes: ['52', '54']
            },
            'moussy-gray': {
                name: 'رمادي موشتي',
                main: 'images/moussy-gray-1.JPG',
                thumbnails: [
                    'images/moussy-gray-1.JPG',
                    'images/moussy-gray-2.JPG',
                    'images/moussy-gray-3.JPG',
                    'images/moussy-gray-4.JPG',
                ],
                availableSizes: ['52', '54', '56']
            },
            'night-blue': {
                name: 'أزرق ليلي',
                main: 'images/night-blue-1.JPG',
                thumbnails: [
                    'images/night-blue-1.JPG',
                    'images/night-blue-2.JPG',
                    'images/night-blue-3.JPG',
                    'images/night-blue-4.JPG',
                ],
                availableSizes: ['52', '54', '56', '58']
            },
            'brown': {
                name: 'بني',
                main: 'images/brown-1.JPG',
                thumbnails: [
                    'images/brown-1.JPG',
                    'images/brown-2.JPG',
                    'images/brown-3.JPG',
                    'images/brown-4.JPG',
                ],
                availableSizes: ['52', '54', '56', '58']
            },
            'yellow': {
                name: 'أصفر',
                main: 'images/yellow-1.JPG',
                thumbnails: [
                    'images/yellow-1.JPG',
                    'images/yellow-2.JPG',
                    'images/yellow-3.JPG',
                    'images/yellow-4.JPG'
                ],
                availableSizes: ['52', '54', '56', '58']
            }
        }
    };

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
    const colorButtons = document.querySelectorAll('.color-btn');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const cartCountElement = document.querySelector('.cart-count');

    // --- State Variables ---
    let selectedColor = 'black'; // Default color
    let selectedSize = 'S';     // Default size
    let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];

    // --- Helper Functions ---

    // Scroll smoothly to top
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Update main image and thumbnails
    const updateProductDisplay = (color) => {
        const colorData = productDetails.colors[color];
        if (!colorData) return;

        mainProductImage.src = colorData.main;

        thumbnailImages.forEach((thumb, index) => {
            if (colorData.thumbnails[index]) {
                thumb.src = colorData.thumbnails[index];
                thumb.style.display = 'block';
            } else {
                thumb.style.display = 'none';
            }
            thumb.classList.remove('active');
        });

        if (thumbnailImages.length > 0 && colorData.thumbnails[0]) {
            thumbnailImages[0].classList.add('active');
        }

        colorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === color) btn.classList.add('active');
        });

        sizeButtons.forEach(btn => {
            const size = btn.dataset.size;
            if (colorData.availableSizes.includes(size)) {
                btn.removeAttribute('disabled');
                btn.classList.remove('disabled');
            } else {
                btn.setAttribute('disabled', 'true');
                btn.classList.add('disabled');
                btn.classList.remove('active');
            }
        });

        if (!colorData.availableSizes.includes(selectedSize)) {
            selectedSize = colorData.availableSizes[0] || '52';
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            const defaultSizeBtn = document.querySelector(`.size-btn[data-size="${selectedSize}"]`);
            if (defaultSizeBtn) defaultSizeBtn.classList.add('active');
        }
    };

    const handleColorChangeWithScroll = (color) => {
        selectedColor = color;
        updateProductDisplay(color);
        setTimeout(scrollToTop, 300);
    };

    const updateGlobalCartCount = () => {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = total;
    };

    const saveCartToLocalStorage = () => {
        localStorage.setItem('qudwahCart', JSON.stringify(cart));
    };

    // --- TikTok Pixel Tracking Functions ---
    function trackTikTokEvent(eventName, parameters = {}) {
        if (typeof ttq !== 'undefined') {
            ttq.track(eventName, parameters);
        }
    }

    function trackAddToCart(product) {
        trackTikTokEvent('AddToCart', {
            contents: [{
                content_id: product.id,
                content_name: product.name,
                content_type: 'product',
                quantity: product.quantity,
                price: product.price
            }],
            value: product.price * product.quantity,
            currency: 'DZD'
        });
    }

    function trackPurchase(order) {
        const contents = order.items.map(item => ({
            content_id: item.id,
            content_name: item.name,
            content_type: 'product',
            quantity: item.quantity,
            price: item.price
        }));

        trackTikTokEvent('Purchase', {
            contents: contents,
            value: order.totalAmount,
            currency: 'DZD',
            order_id: order.id
        });
    }

    function trackViewContent(product) {
        trackTikTokEvent('ViewContent', {
            content_id: `${product.color}-${product.size}`,
            content_name: product.name,
            content_type: 'product',
            price: product.price,
            currency: 'DZD'
        });
    }

    // --- Event Listeners ---

    thumbnailImages.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnailImages.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainProductImage.src = thumb.src;
        });
    });

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.dataset.color;
            handleColorChangeWithScroll(color);
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!button.hasAttribute('disabled')) {
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                selectedSize = button.dataset.size;
            }
        });
    });

    minusBtn.addEventListener('click', () => {
        const val = parseInt(quantityInput.value);
        if (val > 1) quantityInput.value = val - 1;
    });

    plusBtn.addEventListener('click', () => {
        const val = parseInt(quantityInput.value);
        quantityInput.value = val + 1;
    });

    quantityInput.addEventListener('change', () => {
        const val = parseInt(quantityInput.value);
        if (isNaN(val) || val < 1) quantityInput.value = 1;
    });

    // --- تعديل حدث "إضافة للسلة" بإضافة تتبع TikTok ---
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const productId = `${selectedColor}-${selectedSize}`;
        const colorName = productDetails.colors[selectedColor].name;

        const existing = cart.findIndex(item => item.id === productId);
        if (existing > -1) {
            cart[existing].quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productDetails.name,
                color: colorName,
                size: selectedSize,
                price: productDetails.price,
                quantity,
                image: productDetails.colors[selectedColor].main
            });
        }

        saveCartToLocalStorage();
        updateGlobalCartCount();

        // تتبع إضافة للسلة في TikTok
        trackAddToCart({
            id: productId,
            name: productDetails.name,
            price: productDetails.price,
            quantity: quantity
        });

        alert(`تم إضافة ${quantity} قطعة من المنتج إلى السلة!`);
    });

    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const productId = `${selectedColor}-${selectedSize}`;
        const colorName = productDetails.colors[selectedColor].name;

        const existing = cart.findIndex(item => item.id === productId);
        if (existing > -1) {
            cart[existing].quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productDetails.name,
                color: colorName,
                size: selectedSize,
                price: productDetails.price,
                quantity,
                image: productDetails.colors[selectedColor].main
            });
        }

        saveCartToLocalStorage();
        updateGlobalCartCount();
        window.location.href = 'cart.html';
    });

    // --- Initialization ---
    updateProductDisplay(selectedColor);
    updateGlobalCartCount();

    // --- تتبع مشاهدة صفحة المنتج ---
    trackViewContent({
        color: selectedColor,
        size: selectedSize,
        name: productDetails.name,
        price: productDetails.price
    });
});
