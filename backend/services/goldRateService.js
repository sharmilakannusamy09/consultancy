import axios from 'axios';
import cron from 'node-cron';
import GoldRate from '../models/GoldRate.js';

// Base URL: https://api.metalpriceapi.com/v1/latest?api_key=212d6860fe5daa4f3dfded4aa0ea5e54&base=USD&currencies=INR
export const fetchGoldRate = async () => {
    try {
        const apiKey = process.env.GOLDAPI_KEY;
        // Example for testing - we will fetch XAU (Gold) in INR
        const url = `https://www.goldapi.io/api/XAU/INR`;

        const response = await axios.get(url, {
            headers: {
                'x-access-token': apiKey
            }
        });

        if (response.data && response.data.price) {
            // response.data.price contains price for 1 Troy Ounce of 24k gold in INR
            const pricePerOunceInr = response.data.price;

            // 1 Troy Ounce = 31.1034768 grams
            const pricePerGram24k = pricePerOunceInr / 31.1034768;

            // Calculate 22k (approx 22/24 of 24k rate)
            const pricePerGram22k = pricePerGram24k * (22 / 24);

            // Get today's date stripped of time for uniqueness
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Update or create rate in DB
            // Only update if not manually overridden
            const existingRate = await GoldRate.findOne({ date: today });

            if (existingRate && existingRate.isManualOverride) {
                console.log('Skipping API update because rate is manually overridden today.');
                return;
            }

            await GoldRate.findOneAndUpdate(
                { date: today },
                {
                    date: today,
                    rate24k: pricePerGram24k,
                    rate22k: pricePerGram22k
                },
                { upsert: true, new: true }
            );

            console.log('Successfully fetched and updated Gold Rate from MetalPrice API');
        } else {
            console.error('Failed to fetch gold rate from API', response.data);
            throw new Error('API request unsuccessful');
        }
    } catch (error) {
        console.error('Error fetching gold rate (using fallback):', error.message);

        // Fallback to static dummy rates if API fails to ensure the website functions
        const fallbackRate24k = 7500; // 7500 INR/gram (Approx)
        const fallbackRate22k = fallbackRate24k * (22 / 24);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingRate = await GoldRate.findOne({ date: today });
        if (existingRate && existingRate.isManualOverride) {
            return;
        }

        await GoldRate.findOneAndUpdate(
            { date: today },
            {
                date: today,
                rate24k: fallbackRate24k,
                rate22k: fallbackRate22k
            },
            { upsert: true, new: true }
        );
        console.log('Successfully updated Gold Rate using Fallback values');
    }
};

// Schedule it to run every day at midnight (Server Time)
export const scheduleGoldRateFetch = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running scheduled gold rate fetch...');
        await fetchGoldRate();
    });
};
