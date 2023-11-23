"use client"

import React, { useState } from 'react'

function SearchBar() {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [searchresult, setSearchResult] = useState([]);

    // const isValidAmazonProductURL = (url) => {
    //     try {
    //         const parsedURL = new URL(url);
    //         const hostname = parsedURL.hostname;

    //         if (hostname.includes('amazon.com') || hostname.includes('amazon.in') || hostname.endsWith('amazon')) {
    //             return true;
    //         }
    //     } catch (error) {
    //         return false;
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // const isValidLink = isValidAmazonProductURL(searchPrompt);
        // if (!isValidLink) return alert('Ivalid link');

        // try {
        //     setIsLoading(true);


        // } catch (error) {
        //     console.log(error)
        // } finally {
        //     setIsLoading(false);
        // }

        const res = await fetch("/searchprod", {
            method: "POST",
            body: JSON.stringify({ searchPrompt }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        const { products } = await res.json();

        console.log(products);
        setSearchResult(products);
        setSearchPrompt("");
        setIsLoading(false);

    }
    return (
        <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>

            <input
                type='text'
                placeholder='Enter product link'
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                className='searchbar-input' />

            <button type='submit' className='searchbar-btn'
                disabled={searchPrompt === ''}
            >
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </form>
    )
}

export default SearchBar