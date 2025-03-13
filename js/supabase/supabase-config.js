// Supabase konfigurasjon
const SUPABASE_URL = 'https://agjxwktmzcfvepdmiaeq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnanh3a3RtemNmdmVwZG1pYWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjEwMDMsImV4cCI6MjA1NzQzNzAwM30.WB69HGvHJXzpYN56Z9lrOcLcwau7hQOLmZkEz8BI61M';

// Initialiser Supabase klienten
// Bruk det globale Supabase-objektet som blir lastet inn fra CDN
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Funksjon for å sjekke om brukeren er logget inn
async function isLoggedIn() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return !!user;
}

// Funksjon for å logge inn
async function loginUser(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Feil ved innlogging:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å registrere ny bruker
async function registerUser(email, password, username) {
    try {
        // Registrer brukeren med Supabase Auth - uten e-postbekreftelse
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                // Deaktiverer e-postbekreftelse
                data: {
                    username: username
                }
            }
        });
        
        if (authError) throw authError;
        
        // Opprett brukerdata i profiles-tabellen
        if (authData.user) {
            const { error: profileError } = await supabaseClient
                .from('profiles')
                .insert([
                    { 
                        id: authData.user.id, 
                        username: username,
                        skills: {
                            Intelligens: 0,
                            Teknologi: 0,
                            Stamina: 0,
                            Karisma: 0,
                            Kreativitet: 0,
                            Flaks: 0
                        },
                        exp: 10000,
                        credits: 100,
                        achievements: [],
                        inventory: []
                    }
                ]);
            
            if (profileError) throw profileError;
        }
        
        return { success: true, data: authData };
    } catch (error) {
        console.error('Feil ved registrering:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å logge ut
async function logoutUser() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Feil ved utlogging:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å hente brukerdata
async function getUserProfile() {
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (!user) throw new Error('Ikke logget inn');
        
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Feil ved henting av brukerprofil:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å oppdatere brukerdata
async function updateUserProfile(profileData) {
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (!user) throw new Error('Ikke logget inn');
        
        const { data, error } = await supabaseClient
            .from('profiles')
            .update(profileData)
            .eq('id', user.id);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Feil ved oppdatering av brukerprofil:', error.message);
        return { success: false, error: error.message };
    }
}

// Eksporter funksjonene
export {
    supabaseClient as supabase,
    isLoggedIn,
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}; 