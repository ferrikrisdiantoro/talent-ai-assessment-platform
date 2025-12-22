
import { GoogleGenerativeAI } from '@google/generative-ai';

// PLEASE DO NOT PUBLISH THIS KEY
const apiKey = 'AIzaSyDIOT7wOsC5R0_r83IcDUcptrkgH-6bK3w';

async function listModels() {
    try {
        console.log('Fetching model list...');
        // We'll use a fetch directly because the SDK's listModels might be tricky to access if not exposed
        // But let's try to infer it or just use fetch

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log('No models found or error:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
