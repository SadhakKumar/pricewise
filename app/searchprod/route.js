import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio"
import { title } from "process";

export async function POST(request) {

    const { searchPrompt: userSearch } = await request.json();

    if (!userSearch) {
        return NextResponse.json("please provide a search prompt");
    }

    let browser

    try {
        browser = await puppeteer.launch({ headless: "new" })
        const page = await browser.newPage();
        await page.goto("https://www.amazon.com");
        await page.type("#twotabsearchtextbox", userSearch);

        await page.keyboard.press("Enter");

        await page.waitForNavigation();
        const html = await page.content();

        const $ = cheerio.load(html);


        const prices = $("span.a-offscreen")
            .map((index, element) => {
                return $(element).text();
            })
            .get();

        const titles = $("span.a-size-base-plus.a-color-base.a-text-normal")
            .map((index, element) => {
                return $(element).text();
            })
            .get();

        const reviews = $("span.a-size-base.s-underline-text")
            .map((index, element) => {
                return $(element).text();
            })
            .get();

        const imageUrls = $("img.s-image")
            .map((index, element) => {
                return $(element).attr("src");
            })
            .get();

        const products = [];


        for (let i = 0; i < titles.length; i++) {
            const item = {
                price: prices[i],
                title: titles[i],
                review: reviews[i],
                imageUrl: imageUrls[i],
            }
            products.push(item);
        }

        return NextResponse.json({ products });

    } catch (error) {
        return NextResponse.json({ error: `An error has occured ${error.message}` });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}