
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manual
try {
    const envPath = path.resolve(__dirname, '..', '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envConfig = {};
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envConfig[key.trim()] = value.trim();
        }
    });

    // Set to process.env if not exists
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && envConfig.NEXT_PUBLIC_SUPABASE_URL) {
        process.env.NEXT_PUBLIC_SUPABASE_URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && envConfig.SUPABASE_SERVICE_ROLE_KEY) {
        process.env.SUPABASE_SERVICE_ROLE_KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY;
    }
} catch (e) {
    console.error('Error reading .env file:', e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
    console.log('--- Test 1: Check profiles with invited_by ---');
    const { data: allLinkedProfiles, error: err1 } = await supabase
        .from('profiles')
        .select('id, full_name, role, invited_by')
        .not('invited_by', 'is', null)
        .limit(5);

    if (err1) console.error('Error 1:', err1);
    else console.log('Profiles with invited_by:', allLinkedProfiles);

    if (allLinkedProfiles && allLinkedProfiles.length > 0) {
        // Use the recruiter ID from the first found profile
        const recruiterId = allLinkedProfiles[0].invited_by;
        console.log(`\nUsing Recruiter ID: ${recruiterId} for detailed test`);

        // 2. Replicate the query from page.tsx (WITH JOIN to invitations)
        console.log('\n--- Test 2: Alternative Query (Join Invitations) ---');
        const { data: candidates, error: err2 } = await supabase
            .from('profiles')
            .select('*, invitations(email)')
            .eq('invited_by', recruiterId);

        if (err2) {
            console.error('Error 2 (Query Failed):', err2);
        } else {
            console.log(`Found ${candidates.length} candidates using invitations join`);
            if (candidates.length > 0) {
                console.log('Sample Data (With Invitation):', JSON.stringify(candidates[0], null, 2));
            }
        }

        // 3. Try without the join
        console.log('\n--- Test 3: Query WITHOUT Join ---');
        const { data: candidatesNoJoin, error: err3 } = await supabase
            .from('profiles')
            .select('*')
            .eq('invited_by', recruiterId);

        if (err3) console.error('Error 3:', err3);
        else {
            console.log(`Found ${candidatesNoJoin.length} candidates WITHOUT join`);
            if (candidatesNoJoin.length > 0) {
                console.log('Sample Data (No Join):', JSON.stringify(candidatesNoJoin[0], null, 2));
            }
        }
    } else {
        console.log('No profiles found with invited_by set. Cannot proceed with joined query test.');
    }
}

testQuery();
