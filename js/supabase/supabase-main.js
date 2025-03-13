// Supabase konfigurasjon
const SUPABASE_URL = 'https://agjxwktmzcfvepdmiaeq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnanh3a3RtemNmdmVwZG1pYWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjEwMDMsImV4cCI6MjA1NzQzNzAwM30.WB69HGvHJXzpYN56Z9lrOcLcwau7hQOLmZkEz8BI61M';

// Initialiser Supabase klienten
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Funksjon for å hente alle brukerprofiler
async function fetchAllProfiles() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        
        if (error) throw error;
        
        return data;
    } catch (error) {
        console.error('Feil ved henting av brukerprofiler:', error.message);
        return [];
    }
}

// Funksjon for å konvertere Supabase-profiler til student-format
function convertProfilesToStudents(profiles) {
    return profiles.map(profile => ({
        name: profile.username,
        Intelligens: profile.skills?.Intelligens || 0,
        Teknologi: profile.skills?.Teknologi || 0,
        Stamina: profile.skills?.Stamina || 0,
        Karisma: profile.skills?.Karisma || 0,
        Kreativitet: profile.skills?.Kreativitet || 0,
        Flaks: profile.skills?.Flaks || 0,
        exp: profile.exp || 10000,
        credits: profile.credits || 100,
        achievements: profile.achievements || [],
        inventory: profile.inventory || [],
        id: profile.id // Behold Supabase ID for fremtidig referanse
    }));
}

// Funksjon for å abonnere på endringer i profiles-tabellen
function subscribeToProfileChanges() {
    return supabase
        .channel('public:profiles')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'profiles'
        }, (payload) => {
            console.log('Profil endret:', payload);
            // Last inn alle profiler på nytt når det skjer en endring
            loadProfilesAndUpdateTable();
        })
        .subscribe();
}

// Funksjon for å laste inn profiler og oppdatere tabellen
async function loadProfilesAndUpdateTable() {
    const profiles = await fetchAllProfiles();
    if (profiles && profiles.length > 0) {
        // Konverter profiler til student-format
        students = convertProfilesToStudents(profiles);
        // Oppdater tabellen
        updateTable();
    }
}

// Initialiser når siden lastes
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Laster inn profiler fra Supabase...');
        
        // Last inn profiler og oppdater tabellen
        await loadProfilesAndUpdateTable();
        
        // Abonner på endringer i profiles-tabellen
        subscribeToProfileChanges();
        
        console.log('Profiler lastet inn fra Supabase');
    } catch (error) {
        console.error('Feil ved initialisering av Supabase:', error);
    }
}); 