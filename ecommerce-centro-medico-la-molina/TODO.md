# TODO: Add Stock Availability and Dynamic Cart

## 1. Update productos.html
- [x] Add stock information to each product card (realistic numbers: 10-50 units).
- [x] Display stock below price.
- [x] Add data attributes for product ID and stock.

## 2. Update script.js
- [x] Implement dynamic cart using localStorage.
- [x] Track stock levels and update when adding to cart.
- [x] Disable "Agregar al Carrito" button if stock is 0.
- [x] Update cart icon with item count.

## 3. Update carrito.html
- [x] Make cart display dynamic from localStorage.
- [x] Add functionality to remove items and update totals.
- [x] Ensure stock is restored when items are removed from cart.

## 4. Add Quantity Selector
- [x] Add quantity selector to product cards (for products with stock > 0).
- [x] Update addToCart function to handle quantity.
- [x] Reset quantity selector after adding to cart.
- [x] Update stock display and button states accordingly.

## 5. Update styles.css
- [x] Add styles for quantity selector (.quantity-selector, .qty-btn, .qty-input).

## 6. Update getProductImage function
- [x] Add image mappings for all products.

## 7. Test Functionality
- [x] Verify stock display and button states.
- [x] Test adding/removing from cart with quantities.
- [x] Check cart persistence across page reloads.
- [x] Test quantity selector functionality.
