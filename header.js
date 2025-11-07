document.addEventListener('DOMContentLoaded', () => {
    // كود الهامبرغر منسوخ من script.js
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');

    if (hamburgerMenu && mobileNavOverlay) {
        hamburgerMenu.addEventListener('click', (event) => {
            event.stopPropagation();
            mobileNavOverlay.classList.toggle('active');
        });

        mobileNavOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('active');
            });
        });

        document.addEventListener('click', (event) => {
            if (mobileNavOverlay.classList.contains('active') &&
                !hamburgerMenu.contains(event.target) &&
                !mobileNavOverlay.contains(event.target)) {
                mobileNavOverlay.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                mobileNavOverlay.classList.remove('active');
            }
        });
    }

    // تحديث عداد السلة
    function updateGlobalCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            let cart = JSON.parse(localStorage.getItem('qudwahCart')) || [];
            let totalItems = 0;
            cart.forEach(item => {
                totalItems += item.quantity;
            });
            cartCountElement.textContent = totalItems;
        }
    }

    updateGlobalCartCount();
});