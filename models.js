// This file acts as a library to fetch our AI model data from a stable, public source (a GitHub Gist).
// It keeps our main application clean and separates the logic from the large model data.

const modelCache = {}; // Cache to store models after the first download

/**
 * Fetches the Base64 model data for a given league code from a public Gist.
 * @param {string} leagueCode - The code for the league (e.g., 'E0').
 * @returns {Promise<Uint8Array>} A promise that resolves with the model data as a byte array.
 */
async function getModelData(leagueCode) {
    // If we have already downloaded this model, return it from the cache
    if (modelCache[leagueCode]) {
        console.log(`Returning cached model for ${leagueCode}`);
        return modelCache[leagueCode];
    }

    const gistUrl = `https://gist.githubusercontent.com/gimel-apps/021ae619f96b26b38c3539097f485122/raw/model_${leagueCode}.txt`;

    try {
        const response = await fetch(gistUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch model from Gist. Status: ${response.status}`);
        }
        const base64String = await response.text();
        
        // Decode the Base64 string into a binary byte array (Uint8Array)
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Store the successfully downloaded and decoded model in our cache
        modelCache[leagueCode] = bytes;
        
        return bytes;

    } catch (e) {
        console.error(`Fatal error fetching or decoding model for ${leagueCode}:`, e);
        // Re-throw the error so the main application logic can catch it and display a message
        throw e;
    }
}
