export declare const CATEGORIES: readonly ["Electronics", "Fashion & Apparel", "Home & Living", "Books & Media", "Sports & Outdoors", "Toys & Games", "Automotive", "Collectibles", "Other"];
export declare const SORT_OPTIONS: readonly [{
    readonly value: "created_at_desc";
    readonly label: "Newest First";
}, {
    readonly value: "price_asc";
    readonly label: "Price: Low to High";
}, {
    readonly value: "price_desc";
    readonly label: "Price: High to Low";
}];
export declare const PRICE_RANGES: readonly [{
    readonly min: 0;
    readonly max: 1000;
    readonly label: "Under ₹1,000";
}, {
    readonly min: 1000;
    readonly max: 5000;
    readonly label: "₹1,000 - ₹5,000";
}, {
    readonly min: 5000;
    readonly max: 10000;
    readonly label: "₹5,000 - ₹10,000";
}, {
    readonly min: 10000;
    readonly max: 50000;
    readonly label: "₹10,000 - ₹50,000";
}, {
    readonly min: 50000;
    readonly max: number;
    readonly label: "Above ₹50,000";
}];
export declare const PAGINATION_LIMIT = 24;
export declare const MAX_IMAGES_PER_PRODUCT = 5;
export declare const MAX_IMAGE_SIZE: number;
export declare const ALLOWED_IMAGE_TYPES: string[];
export declare const ANIMATION_DURATION: {
    readonly fast: 150;
    readonly normal: 300;
    readonly slow: 500;
};
export declare const BREAKPOINTS: {
    readonly sm: "640px";
    readonly md: "768px";
    readonly lg: "1024px";
    readonly xl: "1280px";
    readonly '2xl': "1536px";
};
