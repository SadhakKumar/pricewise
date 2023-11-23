"use server"

import { scrapeAmazonProduct } from "../scraper";
export async function scrapeAndStoreProduct(productUrl) {
    if (!productUrl) return;

    try {
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
    } catch (error) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}