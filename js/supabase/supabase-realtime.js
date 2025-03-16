// Bruk den felles Supabase-klienten
const supabase = window.supabaseHelper.getSupabase();

// Funksjon for å abonnere på endringer i en brukers profil
function subscribeToProfileChanges(userId, callback) {
    return supabase
        .channel(`profile-${userId}`)
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`
        }, (payload) => {
            callback(payload.new);
        })
        .subscribe();
}

// Funksjon for å abonnere på endringer i klassedata (for hovedskjermen)
function subscribeToClassChanges(callback) {
    return supabase
        .channel('class-changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'profiles'
        }, (payload) => {
            callback(payload);
        })
        .subscribe();
}

// Funksjon for å oppdatere en brukers ferdigheter
async function updateSkill(userId, skill, value) {
    try {
        // Først henter vi gjeldende profil
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('skills')
            .eq('id', userId)
            .single();
        
        if (fetchError) throw fetchError;
        
        // Oppdaterer skills-objektet
        const updatedSkills = { ...profile.skills };
        updatedSkills[skill] = value;
        
        // Lagrer oppdaterte skills
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ skills: updatedSkills })
            .eq('id', userId);
        
        if (updateError) throw updateError;
        
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av ferdighet:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å oppdatere en brukers erfaringspoeng
async function updateExp(userId, expValue) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ exp: expValue })
            .eq('id', userId);
        
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av erfaringspoeng:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å oppdatere en brukers kreditter
async function updateCredits(userId, creditsValue) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ credits: creditsValue })
            .eq('id', userId);
        
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av kreditter:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å oppdatere en brukers prestasjoner
async function updateAchievements(userId, achievements) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ achievements: achievements })
            .eq('id', userId);
        
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av prestasjoner:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å oppdatere en brukers inventar
async function updateInventory(userId, inventory) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ inventory: inventory })
            .eq('id', userId);
        
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av inventar:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å hente alle brukerprofiler (for hovedskjermen)
async function getAllProfiles() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Feil ved henting av alle profiler:', error.message);
        return { success: false, error: error.message };
    }
}

// Eksporter funksjonene
export {
    subscribeToProfileChanges,
    subscribeToClassChanges,
    updateSkill,
    updateExp,
    updateCredits,
    updateAchievements,
    updateInventory,
    getAllProfiles
}; 