// src/routes/+layout.server.ts
import { fetchProductsFiltered } from '$lib/data/products';

export async function load({ fetch, locals }) {
    let essentials = [];
    try {
        essentials = await fetchProductsFiltered(fetch, undefined, undefined, 1, 99999); 
    } catch (e) {
        console.error("Could not fetch all products for fuzzy search:", e); 
    }

    return {
        essentials,
        user: locals.user
    };
}