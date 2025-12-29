
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    process.env[match[1].trim()] = match[2].trim();
                }
            });
        }
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkReport() {
    const userId = '8ae5604c-4905-4af2-b228-6f137c4b3221'; // Ferri Krisdiantoro

    console.log(`Checking report for user: ${userId}`);

    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching report:', error);
    } else {
        console.log('Report data:', data);
        console.log('Count:', data.length);
    }
}

checkReport();
