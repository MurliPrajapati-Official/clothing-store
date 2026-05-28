const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://visklrevckijbgrblbya.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc2tscmV2Y2tpamJncmJsYnlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk3MzI0MSwiZXhwIjoyMDkzNTQ5MjQxfQ.gzCF-xh2ctdmG1-xY4uDVehZwOUplqFFec6L12r9D8o'
);

async function run() {
  console.log("Checking if raw SQL RPC exists...");
  
  // Try common names for SQL execution RPCs
  const rpcs = ['exec_sql', 'run_sql', 'execute_sql', 'sql'];
  for (const rpc of rpcs) {
    try {
      const { data, error } = await supabase.rpc(rpc, { 
        query: 'SELECT 1',
        sql: 'SELECT 1' 
      });
      if (!error) {
        console.log(`Success with RPC '${rpc}'! Result:`, data);
        return;
      } else {
        console.log(`RPC '${rpc}' failed:`, error.message);
      }
    } catch (err) {
      console.log(`RPC '${rpc}' threw exception:`, err.message);
    }
  }
}

run();
