/**
 * Database Service
 * 
 * Dette er et sentralt grensesnitt for alle databaseoperasjoner i OASIS-applikasjonen.
 * Bruker den felles Supabase-klienten og eksponerer metoder for å hente, oppdatere og slette data.
 */

// Bruk den felles Supabase-klienten
const supabase = window.supabaseHelper.getSupabase();

/**
 * Bruker-relaterte databaseoperasjoner
 */
const userService = {
    /**
     * Henter gjeldende bruker fra Supabase Auth
     */
    getCurrentUser: async function() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('Feil ved henting av gjeldende bruker:', error);
                return null;
            }
            
            return user;
        } catch (error) {
            console.error('Feil ved henting av gjeldende bruker:', error);
            return null;
        }
    },
    
    /**
     * Henter brukerprofil basert på bruker-ID
     */
    getUserProfile: async function(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) {
                console.error('Feil ved henting av brukerprofil:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Feil ved henting av brukerprofil:', error);
            return null;
        }
    },
    
    /**
     * Oppdaterer brukerprofil
     */
    updateUserProfile: async function(userId, profileData) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', userId);
            
            if (error) {
                console.error('Feil ved oppdatering av brukerprofil:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved oppdatering av brukerprofil:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Oppdaterer en spesifikk ferdighet for en bruker
     */
    updateSkill: async function(userId, skillName, skillValue) {
        try {
            // Først henter vi gjeldende profil
            const profile = await this.getUserProfile(userId);
            
            if (!profile) {
                return { success: false, error: 'Kunne ikke hente brukerprofil' };
            }
            
            // Oppdaterer skills-objektet
            const skills = profile.skills || {};
            skills[skillName] = skillValue;
            
            // Oppdater profil
            const { success, error } = await this.updateUserProfile(userId, { skills });
            
            if (!success) {
                return { success: false, error };
            }
            
            return { success: true };
        } catch (error) {
            console.error('Feil ved oppdatering av ferdighet:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Oppdaterer brukerens erfaringspoeng
     */
    updateExp: async function(userId, expValue) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ exp: expValue })
                .eq('id', userId);
            
            if (error) {
                console.error('Feil ved oppdatering av EXP:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved oppdatering av EXP:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Oppdaterer brukerens kreditter
     */
    updateCredits: async function(userId, creditsValue) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ credits: creditsValue })
                .eq('id', userId);
            
            if (error) {
                console.error('Feil ved oppdatering av kreditter:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved oppdatering av kreditter:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Oppdaterer brukerens prestasjoner
     */
    updateAchievements: async function(userId, achievements) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ achievements })
                .eq('id', userId);
            
            if (error) {
                console.error('Feil ved oppdatering av prestasjoner:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved oppdatering av prestasjoner:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Oppdaterer brukerens inventar
     */
    updateInventory: async function(userId, inventory) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ inventory })
                .eq('id', userId);
            
            if (error) {
                console.error('Feil ved oppdatering av inventar:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved oppdatering av inventar:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter alle brukerprofiler
     */
    getAllProfiles: async function() {
        try {
            console.log('Henter alle brukerprofiler fra Supabase...');
            
            // Sjekk om brukeren er logget inn
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Feil ved henting av gjeldende bruker:', userError);
                console.log('Fortsetter med henting av profiler som anonym bruker');
            } else {
                console.log('Bruker er logget inn som:', user?.email || user?.id);
            }
            
            // Bruk en mer direkte spørring uten filtrering
            const { data, error } = await supabase
                .from('profiles')
                .select('*');
            
            if (error) {
                console.error('Feil ved henting av brukerprofiler:', error);
                
                // Prøv en alternativ metode hvis den første feiler
                console.log('Prøver alternativ metode for å hente profiler...');
                try {
                    // Prøv å hente profiler med en annen spørring
                    const { data: altData, error: altError } = await supabase
                        .from('profiles')
                        .select('id, username, skills, exp, credits, achievements, inventory')
                        .limit(100);
                    
                    if (altError) {
                        console.error('Alternativ metode feilet også:', altError);
                        return { success: false, error: error.message, data: [] };
                    }
                    
                    if (altData && altData.length > 0) {
                        console.log('Alternativ metode hentet', altData.length, 'profiler');
                        return { success: true, data: altData };
                    }
                } catch (altCatchError) {
                    console.error('Feil i alternativ metode:', altCatchError);
                }
                
                return { success: false, error: error.message, data: [] };
            }
            
            if (!data || data.length === 0) {
                console.warn('Ingen brukerprofiler funnet i databasen');
                return { success: true, data: [] };
            }
            
            console.log(`Hentet ${data.length} brukerprofiler fra databasen:`, data.map(p => p.username || p.id));
            
            // Logg alle profiler for feilsøking
            console.log('Alle profiler fra databasen:', JSON.stringify(data));
            
            return { success: true, data: data };
        } catch (error) {
            console.error('Feil ved henting av brukerprofiler:', error);
            return { success: false, error: error.message, data: [] };
        }
    },
    
    /**
     * Henter alle brukerprofiler med en alternativ metode
     */
    getAllProfilesAlternative: async function() {
        try {
            console.log('Henter alle brukerprofiler med alternativ metode...');
            
            // Prøv å hente alle profiler med SQL-funksjonen get_all_profiles
            const { data, error } = await supabase.rpc('get_all_profiles');
            
            if (error) {
                console.error('Feil ved henting av brukerprofiler med alternativ metode:', error);
                
                // Prøv en annen metode
                console.log('Prøver å hente profiler direkte fra tabellen...');
                const { data: directData, error: directError } = await supabase
                    .from('profiles')
                    .select('*')
                    .limit(100);
                    
                if (directError) {
                    console.error('Direkte henting feilet også:', directError);
                    return { success: false, error: error.message, data: [] };
                }
                
                if (directData && directData.length > 0) {
                    console.log('Direkte henting ga', directData.length, 'profiler');
                    return { success: true, data: directData };
                }
                
                return { success: false, error: error.message, data: [] };
            }
            
            if (!data || data.length === 0) {
                console.warn('Ingen brukerprofiler funnet med alternativ metode');
                return { success: true, data: [] };
            }
            
            console.log(`Hentet ${data.length} brukerprofiler med alternativ metode`);
            return { success: true, data: data };
        } catch (error) {
            console.error('Feil ved henting av brukerprofiler med alternativ metode:', error);
            return { success: false, error: error.message, data: [] };
        }
    },
    
    /**
     * Abonnerer på endringer i en brukers profil
     */
    subscribeToProfileChanges: function(userId, callback) {
        return supabase
            .channel('profile-changes')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${userId}`
            }, payload => {
                callback(payload.new);
            })
            .subscribe();
    },
    
    /**
     * Abonnerer på endringer i alle brukerprofiler
     */
    subscribeToAllProfileChanges: function(callback) {
        return supabase
            .channel('all-profiles')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'profiles'
            }, (payload) => {
                callback(payload);
            })
            .subscribe();
    },

    /**
     * Henter alle brukere fra auth-tabellen (krever admin-tilgang)
     */
    getAllUsers: async function() {
        try {
            console.log('Prøver å hente alle brukere fra auth-tabellen...');
            
            // Dette vil sannsynligvis feile med mindre brukeren har admin-tilgang
            const { data, error } = await supabase.auth.admin.listUsers();
            
            if (error) {
                console.error('Feil ved henting av brukere fra auth:', error);
                return { success: false, error: error.message, data: [] };
            }
            
            console.log(`Hentet ${data?.users?.length || 0} brukere fra auth-tabellen`);
            return { success: true, data: data?.users || [] };
        } catch (error) {
            console.error('Feil ved henting av brukere fra auth:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
};

/**
 * Gjenstands-relaterte databaseoperasjoner
 */
const itemService = {
    /**
     * Henter alle gjenstander
     */
    getAllItems: async function() {
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*');
            
            if (error) {
                console.error('Feil ved henting av gjenstander:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av gjenstander:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter en spesifikk gjenstand basert på ID
     */
    getItemById: async function(itemId) {
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('id', itemId)
                .single();
            
            if (error) {
                console.error('Feil ved henting av gjenstand:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av gjenstand:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter gjenstander basert på type
     */
    getItemsByType: async function(type) {
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('type', type);
            
            if (error) {
                console.error('Feil ved henting av gjenstander etter type:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av gjenstander etter type:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter gjenstander basert på sjeldenhet
     */
    getItemsByRarity: async function(rarity) {
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('rarity', rarity);
            
            if (error) {
                console.error('Feil ved henting av gjenstander etter sjeldenhet:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av gjenstander etter sjeldenhet:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Søker etter gjenstander basert på navn eller beskrivelse
     */
    searchItems: async function(searchTerm) {
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
            
            if (error) {
                console.error('Feil ved søk etter gjenstander:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved søk etter gjenstander:', error);
            return { success: false, error: error.message };
        }
    }
};

/**
 * Oppdrag-relaterte databaseoperasjoner
 */
const questService = {
    /**
     * Henter alle oppdrag
     */
    getAllQuests: async function() {
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*');
            
            if (error) {
                console.error('Feil ved henting av oppdrag:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av oppdrag:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter et spesifikt oppdrag basert på ID
     */
    getQuestById: async function(questId) {
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('id', questId)
                .single();
            
            if (error) {
                console.error('Feil ved henting av oppdrag:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av oppdrag:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter oppdrag basert på vanskelighetsgrad
     */
    getQuestsByDifficulty: async function(difficulty) {
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('difficulty', difficulty);
            
            if (error) {
                console.error('Feil ved henting av oppdrag etter vanskelighetsgrad:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av oppdrag etter vanskelighetsgrad:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter oppdrag tilknyttet en spesifikk NPC
     */
    getQuestsByNpc: async function(npcId) {
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('npc_id', npcId);
            
            if (error) {
                console.error('Feil ved henting av oppdrag etter NPC:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av oppdrag etter NPC:', error);
            return { success: false, error: error.message };
        }
    }
};

/**
 * NPC-relaterte databaseoperasjoner
 */
const npcService = {
    /**
     * Henter alle NPCer
     */
    getAllNpcs: async function() {
        try {
            const { data, error } = await supabase
                .from('npcs')
                .select('*');
            
            if (error) {
                console.error('Feil ved henting av NPCer:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av NPCer:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter en spesifikk NPC basert på ID
     */
    getNpcById: async function(npcId) {
        try {
            const { data, error } = await supabase
                .from('npcs')
                .select('*')
                .eq('id', npcId)
                .single();
            
            if (error) {
                console.error('Feil ved henting av NPC:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av NPC:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Henter NPCer basert på rolle
     */
    getNpcsByRole: async function(role) {
        try {
            const { data, error } = await supabase
                .from('npcs')
                .select('*')
                .eq('role', role);
            
            if (error) {
                console.error('Feil ved henting av NPCer etter rolle:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av NPCer etter rolle:', error);
            return { success: false, error: error.message };
        }
    }
};

/**
 * Chat-relaterte databaseoperasjoner
 */
const chatService = {
    /**
     * Henter alle chat-meldinger
     */
    getAllMessages: async function() {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            
            if (error) {
                console.error('Feil ved henting av chat-meldinger:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av chat-meldinger:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Sender en ny chat-melding
     */
    sendMessage: async function(userId, username, message) {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert([
                    {
                        user_id: userId,
                        username: username,
                        message: message,
                        created_at: new Date().toISOString()
                    }
                ]);
            
            if (error) {
                console.error('Feil ved sending av melding:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved sending av melding:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Abonnerer på nye chat-meldinger
     */
    subscribeToMessages: function(callback) {
        return supabase
            .channel('chat-messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages'
            }, payload => {
                callback(payload.new);
            })
            .subscribe();
    }
};

/**
 * Prestasjonstjeneste
 */
const achievementService = {
    /**
     * Hent alle prestasjoner
     */
    getAllAchievements: async function() {
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*');
            
            if (error) {
                console.error('Feil ved henting av prestasjoner:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av prestasjoner:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Hent prestasjon basert på ID
     */
    getAchievementById: async function(achievementId) {
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('id', achievementId)
                .single();
            
            if (error) {
                console.error('Feil ved henting av prestasjon:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av prestasjon:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Hent prestasjoner basert på ferdighet
     */
    getAchievementsBySkill: async function(skill) {
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('skill', skill);
            
            if (error) {
                console.error('Feil ved henting av prestasjoner etter ferdighet:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av prestasjoner etter ferdighet:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Hent prestasjoner basert på type
     */
    getAchievementsByType: async function(type) {
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('type', type);
            
            if (error) {
                console.error('Feil ved henting av prestasjoner etter type:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av prestasjoner etter type:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Hent prestasjoner basert på sjeldenhetsgrad
     */
    getAchievementsByRarity: async function(rarity) {
        try {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .eq('rarity', rarity);
            
            if (error) {
                console.error('Feil ved henting av prestasjoner etter sjeldenhetsgrad:', error);
                return { success: false, error: error.message };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Feil ved henting av prestasjoner etter sjeldenhetsgrad:', error);
            return { success: false, error: error.message };
        }
    }
};

// Eksporter alle tjenester
const databaseService = {
    user: userService,
    item: itemService,
    quest: questService,
    npc: npcService,
    achievement: achievementService,
    chat: chatService
};

// Gjør tjenestene tilgjengelige globalt
window.databaseService = databaseService;

// Logg at databaseService er initialisert
console.log('Database-tjenesten er initialisert'); 