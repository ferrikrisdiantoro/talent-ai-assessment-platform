
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyDIOT7wOsC5R0_r83IcDUcptrkgH-6bK3w';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('Fetching available models...');
        // Note: The Node SDK might not expose listModels directly easily on the main class in all versions, 
        // but typically it's under the model manager or we can just try to generate with a known fallback 
        // to see if "gemini-pro" works.
        // Actually, let's just try to generate content with 'gemini-1.5-flash-001' and 'gemini-pro' to see which one succeeds.

        // Test gemini-1.5-flash
        console.log('\nTesting gemini-1.5-flash...');
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent('Hello');
            console.log('✅ gemini-1.5-flash SUCCESS');
        } catch (e) {
            console.log('❌ gemini-1.5-flash FAILED:', e.message);
        }

        // Test gemini-1.5-flash-001
        console.log('\nTesting gemini-1.5-flash-001...');
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
            const result = await model.generateContent('Hello');
            console.log('✅ gemini-1.5-flash-001 SUCCESS');
        } catch (e) {
            console.log('❌ gemini-1.5-flash-001 FAILED:', e.message);
        }

        // Test gemini-pro
        console.log('\nTesting gemini-pro...');
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent('Hello');
            console.log('✅ gemini-pro SUCCESS');
        } catch (e) {
            console.log('❌ gemini-pro FAILED:', e.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

listModels();
