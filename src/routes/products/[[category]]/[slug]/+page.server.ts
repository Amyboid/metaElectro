import { error } from '@sveltejs/kit';
import { fetchProductsFiltered } from '$lib/data/products';
import { bannerData } from '$lib/data/products';

export async function load({ params, fetch, url }) {
    const productTypeOrCategory = params.slug;

    let filterType: 'category' | 'productType';
    let filterValue: string;


    if (params.category) {
        filterType = 'category';
        filterValue = productTypeOrCategory;
    } else {
        filterType = 'productType';
        filterValue = productTypeOrCategory;
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '9');

    let responseData;
    try { 
        responseData = await fetchProductsFiltered(fetch, filterType, filterValue, page, limit);
    } catch (err) {
        console.error('Failed to load filtered products:', err);
        throw error(500, `Could not load products for ${filterType} ${filterValue}`);
    }

    const items = responseData.products;  
    const currentLimit = responseData.limit;
    const totalProducts = responseData.totalProducts;
    const totalPages = responseData.totalPages;

 
    const banner = bannerData.find((item) => item.Type === productTypeOrCategory);
 
    if (items.length === 0 && !banner) {
        throw error(404, 'No products or banner found for this category/product type.');
    }

    return {
        items,
        banner,
        productType: productTypeOrCategory,
        limit: currentLimit,
        totalProducts,
        totalPages,
        filterType,
        filterValue
    };
}