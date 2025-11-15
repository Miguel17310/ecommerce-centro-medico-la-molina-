// JavaScript para interactividad del ecommerce

// Función para obtener el carrito desde localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Función para guardar el carrito en localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.textContent = `🛒 ${totalItems}`;
    }
}

// Función para agregar productos al carrito
function addToCart(productId, productName, price, stockElement, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(price.replace('S/. ', '')),
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartCount();

    // Actualizar stock en la UI
    const currentStock = parseInt(stockElement.textContent);
    if (currentStock >= quantity) {
        stockElement.textContent = currentStock - quantity;
        const productCard = stockElement.closest('.product-card');
        const button = productCard.querySelector('.btn-secondary');
        const quantityInput = productCard.querySelector('.qty-input');
        if (quantityInput) {
            quantityInput.value = 1; // Reset quantity selector
        }
        if (currentStock - quantity === 0) {
            button.disabled = true;
            button.textContent = 'Agotado';
        }
    }

    alert(`${quantity} unidad(es) de "${productName}" agregado(s) al carrito`);
}

// Función para cambiar la cantidad
function changeQuantity(button, delta) {
    const input = button.parentElement.querySelector('.qty-input');
    const currentValue = parseInt(input.value);
    const maxValue = parseInt(input.max);
    const newValue = Math.max(1, Math.min(maxValue, currentValue + delta));
    input.value = newValue;
}

// Event listeners para botones de agregar al carrito
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.btn-secondary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = productCard.querySelector('p').textContent;
            const stockSpan = productCard.querySelector('.stock span');
            const quantityInput = productCard.querySelector('.qty-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            addToCart(productId, productName, productPrice, stockSpan, quantity);
        });
    });

    // Inicializar contador del carrito
    updateCartCount();

    // Deshabilitar botones si stock es 0
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const stock = parseInt(card.getAttribute('data-stock'));
        const button = card.querySelector('.btn-secondary');
        const stockSpan = card.querySelector('.stock span');
        const quantityInput = card.querySelector('.qty-input');
        if (stockSpan) {
            stockSpan.textContent = stock;
        }
        if (quantityInput) {
            quantityInput.max = stock;
        }
        if (stock === 0) {
            button.disabled = true;
            button.textContent = 'Agotado';
        }
    });
});

// Función de búsqueda básica
function searchProducts() {
    const searchInput = document.querySelector('.search-cart input');
    const searchTerm = searchInput.value.toLowerCase();

    // Aquí iría la lógica de búsqueda real
    alert(`Buscando: ${searchTerm}`);
}

// Función para renderizar el carrito
function renderCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotalElement.textContent = 'Total: S/. 0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${getProductImage(item.id)}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Precio: S/. ${item.price.toFixed(2)}</p>
                <p>Cantidad: ${item.quantity}</p>
            </div>
            <div class="item-total">
                <p>S/. ${itemTotal.toFixed(2)}</p>
                <button class="btn-secondary remove-item" data-product-id="${item.id}">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = `Total: S/. ${total.toFixed(2)}`;

    // Agregar event listeners para eliminar items
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}

// Función para obtener la imagen del producto (simulada)
function getProductImage(productId) {
    const imageMap = {
        'paracetamol': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763164184/4c55df20-f90a-11ef-b5c1-27f306935cb2.png_vl5pj9.jpg?_s=public-apps',
        'ibuprofeno': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763164480/ibuprofeno-teva-400-mg-20-capsulas-blandas_czgyrv.jpg?_s=public-apps',
        'aspirina': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763164582/PACK_20COLOMBIA-ASA100_201_lt4a7d.jpg?_s=public-apps',
        'amoxicilina': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
        'vitamina-c': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763164802/Sanavita-vitamina-C-masticabile_z1mauy.jpg?_s=public-apps',
        'multivitaminico': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763165122/8_womodo.jpg?_s=public-apps',
        'omega-3': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763165256/2c94e3db-4aac-495f-b46f-02d73014199a_grande_czxatp.jpg?_s=public-apps',
        'calcio-vitamina-d': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763165334/116411943518238_eye9sv.jpg?_s=public-apps',
        'crema-cerave': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763165829/71I7KfK31tL._AC_UF1000_1000_QL80__yyzalt.jpg?_s=public-apps',
        'protector-solar': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763165954/63c074ce5e144b38b0336a0f629001b6-screen_otigxy.jpg?_s=public-apps',
        'shampoo-anticaspa': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763166361/71SPPWCdGlL._AC_UF350_350_QL80__rkivuw.jpg?_s=public-apps',
        'jabon-antibacterial': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763167850/5p92hqe4__47559.1614003774_x6uaf2.jpg?_s=public-apps',
        'desodorante': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763167975/71WoHUZH6KL._AC_UL600_SR600_600__wsf57y.jpg?_s=public-apps',
        'pasta-dental': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763168046/Colgate-Triple-Acci-n-Crema-Dental-Paquete-de-3-Tubos-de-6-oz_8bca8673-8790-4651-8d10-b93c9540aef7.2262bffef75e0c50fec121586821d05b_pbkqfq.jpg?_s=public-apps',
        'enjuague-bucal': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763168135/control_sarro_rp23zx.jpg?_s=public-apps',
        'toallas-higienicas': 'https://res.cloudinary.com/dseuz64lm/image/upload/fl_preserve_transparency/v1763168197/7702027041662_1_Toallas-Higienicas-Nosotras-Natural-Invisible-Con-Alas-X-10Und_fcq2m1.jpg?_s=public-apps'
    };
    return imageMap[productId] || 'https://via.placeholder.com/100';
}

// Función para eliminar un item del carrito
function removeFromCart(productId) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    const item = cart[itemIndex];
    const quantityToRestore = item.quantity;
    cart.splice(itemIndex, 1);
    saveCart(cart);

    // Restaurar stock en productos.html si estamos en esa página
    if (window.location.pathname.includes('productos.html')) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            const stockSpan = productCard.querySelector('.stock span');
            const button = productCard.querySelector('.btn-secondary');
            const currentStock = parseInt(stockSpan.textContent);
            stockSpan.textContent = currentStock + quantityToRestore;
            if (currentStock + quantityToRestore > 0) {
                button.disabled = false;
                button.textContent = 'Agregar al Carrito';
            }
        }
    }

    renderCart();
    updateCartCount();
}

// Función para vaciar el carrito
function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
    }
}

// Event listener para el botón de búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-cart button');

    searchButton.addEventListener('click', searchProducts);

    // Renderizar carrito si estamos en la página del carrito
    if (document.getElementById('cart-items')) {
        renderCart();
    }

    // Event listener para el botón de vaciar carrito
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }
});
