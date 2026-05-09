

// const fetch = require('node-fetch'); // fetch is global in Node 18+


const SUPABASE_URL = 'https://mgngrmdwuqsalrkaxhbt.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nbmdybWR3dXFzYWxya2F4aGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA5MDE2NiwiZXhwIjoyMDkzNjY2MTY2fQ.xG0K_tKTkHrsZNuRX3F4-CZrz7Uaw_Ptmzg1esbwVjg';

const tables = [
  'profiles', 'user_streak', 'user_progress', 'user_badges', 'badges', 
  'game_history', 'progress', 'quiz_contexts', 'quiz_questions', 
  'answer_options', 'quiz_results'
];

async function audit() {
  const results = {};
  
  for (const table of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Prefer': 'count=exact'
        }
      });
      
      if (res.status === 200 || res.status === 206) {
        const data = await res.json();
        const count = res.headers.get('content-range')?.split('/')[1] || 0;
        results[table] = {
          exists: true,
          status: res.status,
          count: parseInt(count),
          columns: data.length > 0 ? Object.keys(data[0]) : 'Tabel Ada (Tapi isinya 0 row)'
        };
      } else {
        results[table] = { exists: false, status: res.status };
      }
    } catch (e) {
      results[table] = { error: e.message };
    }
  }
  
  console.log(JSON.stringify(results, null, 2));
}

audit();
