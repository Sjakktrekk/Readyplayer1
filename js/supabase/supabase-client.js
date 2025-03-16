// Felles Supabase-klient for hele applikasjonen
const SUPABASE_URL = 'https://agjxwktmzcfvepdmiaeq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnanh3a3RtemNmdmVwZG1pYWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjEwMDMsImV4cCI6MjA1NzQzNzAwM30.WB69HGvHJXzpYN56Z9lrOcLcwau7hQOLmZkEz8BI61M';

// Opprett én enkelt Supabase-klient
let supabaseClient;

// Initialiser klienten hvis den ikke allerede eksisterer
function initSupabase() {
    if (!supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase-klient initialisert');
    }
    return supabaseClient;
}

// Hent den delte Supabase-klienten
function getSupabase() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

// Eksporter funksjoner og konstanter
window.supabaseHelper = {
    getSupabase,
    initSupabase,
    SUPABASE_URL,
    SUPABASE_KEY
}; 