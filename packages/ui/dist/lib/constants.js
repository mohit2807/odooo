"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BREAKPOINTS = exports.ANIMATION_DURATION = exports.ALLOWED_IMAGE_TYPES = exports.MAX_IMAGE_SIZE = exports.MAX_IMAGES_PER_PRODUCT = exports.PAGINATION_LIMIT = exports.PRICE_RANGES = exports.SORT_OPTIONS = exports.CATEGORIES = void 0;
exports.CATEGORIES = [
    'Electronics',
    'Fashion & Apparel',
    'Home & Living',
    'Books & Media',
    'Sports & Outdoors',
    'Toys & Games',
    'Automotive',
    'Collectibles',
    'Other'
];
exports.SORT_OPTIONS = [
    { value: 'created_at_desc', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
];
exports.PRICE_RANGES = [
    { min: 0, max: 1000, label: 'Under ₹1,000' },
    { min: 1000, max: 5000, label: '₹1,000 - ₹5,000' },
    { min: 5000, max: 10000, label: '₹5,000 - ₹10,000' },
    { min: 10000, max: 50000, label: '₹10,000 - ₹50,000' },
    { min: 50000, max: Infinity, label: 'Above ₹50,000' },
];
exports.PAGINATION_LIMIT = 24;
exports.MAX_IMAGES_PER_PRODUCT = 5;
exports.MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
exports.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
exports.ANIMATION_DURATION = {
    fast: 150,
    normal: 300,
    slow: 500,
};
exports.BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};
