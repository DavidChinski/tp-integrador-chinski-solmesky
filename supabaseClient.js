process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://umcutcrayjhmfstgqcqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtY3V0Y3JheWpobWZzdGdxY3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTY4ODMsImV4cCI6MjA2NzQ3Mjg4M30.hIbfhb36D1zCULnuewVbB-FYNF8DIjvJmH6arwUl4uA';

exports.supabase = createClient(supabaseUrl, supabaseKey);