// Bruk den felles Supabase-klienten
// Ikke deklarer en ny konstant, bruk den eksisterende instansen
// const supabase = window.supabaseHelper.getSupabase();
const dashboardSupabase = window.supabaseHelper.getSupabase();

// Globale variabler
let currentUser = null;
let userProfile = null;
let skillsData = {};
let inventoryItems = [];
let userAchievements = [];
let quests = [];

// DOM-elementer
let usernameElement;
let usernameDisplayElement;
let logoutButton;
let navItems;
let tabContents;
let playerLevelElement;
let playerExpElement;
let playerCreditsElement;
let notificationContainer;

// Gjør userProfile tilgjengelig globalt
window.userProfile = userProfile;

// Funksjon for å initialisere DOM-elementer
function initDOMElements() {
    usernameElement = document.getElementById('username');
    usernameDisplayElement = document.getElementById('username-display');
    logoutButton = document.getElementById('logout-button');
    navItems = document.querySelectorAll('.nav-item');
    tabContents = document.querySelectorAll('.tab-content');
    playerLevelElement = document.getElementById('player-level');
    playerExpElement = document.getElementById('player-exp');
    playerCreditsElement = document.getElementById('player-credits');
    notificationContainer = document.getElementById('notification-container');
}

// Funksjon for å initialisere dashbordet
async function initDashboard() {
    initDOMElements();
    
    try {
        // Sjekk om databaseService er tilgjengelig
        if (!window.databaseService || !window.databaseService.user) {
            console.error('Database-tjenesten er ikke tilgjengelig');
            showNotification('Feil ved initialisering: Database-tjenesten er ikke tilgjengelig. Last siden på nytt.', 'error');
            return Promise.reject(new Error('Database-tjenesten er ikke tilgjengelig'));
        }
        
        // Sjekk om brukeren er logget inn
        const { data: { session } } = await dashboardSupabase.auth.getSession();
        
        if (!session) {
            // Redirect til login-siden hvis brukeren ikke er logget inn
            window.location.href = '../index.html';
            return Promise.reject(new Error('Bruker er ikke logget inn'));
        }
        
        // Hent gjeldende bruker
        currentUser = await window.databaseService.user.getCurrentUser();
        
        if (!currentUser) {
            console.error('Kunne ikke hente gjeldende bruker');
            window.location.href = '../index.html';
            return Promise.reject(new Error('Kunne ikke hente gjeldende bruker'));
        }
        
        // Hent brukerprofil
        userProfile = await window.databaseService.user.getUserProfile(currentUser.id);
        
        if (!userProfile) {
            console.error('Kunne ikke hente brukerprofil');
            showNotification('Feil ved henting av brukerprofil. Prøv igjen senere.', 'error');
            return Promise.reject(new Error('Kunne ikke hente brukerprofil'));
        }
        
        // Gjør userProfile tilgjengelig globalt
        window.userProfile = userProfile;
        
        // Oppdater brukergrensesnitt
        updateUserInterface();
        
        // Abonner på profiloppdateringer
        subscribeToProfileUpdates();
        
        // Legg til event listeners
        setupEventListeners();
        
        console.log('Dashboard initialisert for bruker:', userProfile.username);
        
        // Returner en løst Promise for å indikere at initialiseringen er fullført
        return Promise.resolve();
    } catch (error) {
        console.error('Feil ved initialisering av dashboard:', error);
        showNotification('Feil ved initialisering av dashboard. Prøv igjen senere.', 'error');
        return Promise.reject(error);
    }
}

// Funksjon for å oppdatere brukergrensesnitt
function updateUserInterface() {
    if (!userProfile) return;
    
    // Oppdater brukernavn
    if (usernameElement) {
        usernameElement.textContent = userProfile.username;
        usernameElement.style.display = 'inline';
    }
    
    if (usernameDisplayElement) {
        usernameDisplayElement.textContent = userProfile.username;
    }
    
    // Oppdater nivå, EXP og kreditter
    const level = calculateLevel(userProfile.skills);
    
    if (playerLevelElement) {
        playerLevelElement.textContent = level;
    }
    
    if (playerExpElement) {
        playerExpElement.textContent = userProfile.exp || 0;
    }
    
    if (playerCreditsElement) {
        playerCreditsElement.textContent = userProfile.credits || 0;
    }
}

// Funksjon for å abonnere på profiloppdateringer
function subscribeToProfileUpdates() {
    if (!currentUser) return;
    
    // Abonner på endringer i brukerprofilen
    window.databaseService.user.subscribeToProfileChanges(currentUser.id, (updatedProfile) => {
        console.log('Brukerprofil oppdatert:', updatedProfile);
        
        // Oppdater lokal brukerprofil
        userProfile = updatedProfile;
        window.userProfile = userProfile;
        
        // Oppdater brukergrensesnitt
        updateUserInterface();
        
        // Last inn data for aktiv fane
        const activeTab = document.querySelector('.nav-item.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('data-tab');
            loadTabData(tabName);
        }
    });
}

// Funksjon for å laste inn data for de ulike fanene
function loadTabData(specificTab = null) {
    // Sjekk om userProfile er tilgjengelig
    if (!userProfile) {
        console.log('userProfile er ikke tilgjengelig ennå, venter med å laste inn fanedata');
        return;
    }
    
    // Last inn data for alle faner eller en spesifikk fane
    if (!specificTab || specificTab === 'skills') {
        if (typeof loadSkillsData === 'function') loadSkillsData();
    }
    
    if (!specificTab || specificTab === 'inventory') {
        if (typeof loadInventoryItems === 'function') loadInventoryItems();
    }
    
    if (!specificTab || specificTab === 'shop') {
        if (typeof loadShopItems === 'function') loadShopItems();
    }
    
    if (!specificTab || specificTab === 'quests') {
        if (typeof loadQuests === 'function') loadQuests();
    }
    
    if (!specificTab || specificTab === 'achievements') {
        if (typeof loadAchievements === 'function') loadAchievements();
    }
    
    if (!specificTab || specificTab === 'stats') {
        if (typeof updateStatsTab === 'function') updateStatsTab();
    }
    
    if (!specificTab || specificTab === 'chat') {
        if (typeof initChat === 'function') initChat();
    }
}

// Funksjon for å sette opp event listeners
function setupEventListeners() {
    // Logg ut-knapp
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                await dashboardSupabase.auth.signOut();
                window.location.href = '../index.html';
            } catch (error) {
                console.error('Feil ved utlogging:', error);
                showNotification('Feil ved utlogging. Prøv igjen senere.', 'error');
            }
        });
    }
    
    // Navigasjon mellom faner
    if (navItems && tabContents) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.getAttribute('data-tab');
                
                // Fjern active-klassen fra alle faner
                navItems.forEach(navItem => navItem.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Legg til active-klassen på den valgte fanen
                item.classList.add('active');
                const selectedTab = document.getElementById(`${tabName}-tab`);
                if (selectedTab) {
                    selectedTab.classList.add('active');
                    
                    // Last inn data for den valgte fanen
                    loadTabData(tabName);
                }
            });
        });
    }
    
    // Test-knapp for inventar
    const testInventoryButton = document.getElementById('test-inventory-button');
    if (testInventoryButton) {
        testInventoryButton.addEventListener('click', () => {
            // Legg til en tilfeldig gjenstand i inventaret
            addRandomItemToInventory();
        });
    }
}

// Funksjon for å legge til en tilfeldig gjenstand i inventaret (for testing)
async function addRandomItemToInventory() {
    try {
        // Hent alle gjenstander
        const { success, data, error } = await window.databaseService.item.getAllItems();
        
        if (!success || !data || data.length === 0) {
            throw new Error(error || 'Ingen gjenstander funnet');
        }
        
        // Velg en tilfeldig gjenstand
        const randomItem = data[Math.floor(Math.random() * data.length)];
        
        // Legg til gjenstanden i inventaret
        const inventory = userProfile.inventory || [];
        
        // Opprett en ny gjenstandsinstans
        const newItem = {
            id: randomItem.id,
            name: randomItem.name,
            description: randomItem.description,
            type: randomItem.type,
            rarity: randomItem.rarity,
            effect: randomItem.effect,
            effect_type: randomItem.effect_type,
            effect_value: randomItem.effect_value,
            effect_skill: randomItem.effect_skill,
            usable: randomItem.usable,
            acquired_at: new Date().toISOString()
        };
        
        inventory.push(newItem);
        
        // Oppdater inventaret i databasen
        const { success: updateSuccess, error: updateError } = await window.databaseService.user.updateInventory(userProfile.id, inventory);
        
        if (!updateSuccess) {
            throw new Error(updateError || 'Feil ved oppdatering av inventar');
        }
        
        // Oppdater lokal brukerprofil
        userProfile.inventory = inventory;
        window.userProfile = userProfile;
        
        // Vis bekreftelse
        showNotification(`La til ${randomItem.name} i inventaret!`, 'success');
        
        // Last inn inventar-fanen på nytt
        if (typeof loadInventoryItems === 'function') {
            loadInventoryItems();
        }
    } catch (error) {
        console.error('Feil ved testing av inventar:', error);
        showNotification(error.message || 'Feil ved testing av inventar', 'error');
    }
}

// Funksjon for å beregne nivå basert på ferdigheter
function calculateLevel(skills) {
    if (!skills) return 1;
    
    // Beregn summen av alle ferdigheter
    const skillSum = Object.values(skills).reduce((sum, value) => sum + value, 0);
    
    // Beregn nivå basert på summen (kan justeres etter behov)
    return Math.floor(skillSum / 3) + 1;
}

// Funksjon for å vise notifikasjoner
function showNotification(message, type = 'info') {
    if (!notificationContainer) return;
    
    // Opprett notifikasjonselement
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Bestem ikon basert på type
    let icon = 'fas fa-info-circle';
    if (type === 'success') {
        icon = 'fas fa-check-circle';
    } else if (type === 'warning') {
        icon = 'fas fa-exclamation-triangle';
    } else if (type === 'error') {
        icon = 'fas fa-times-circle';
    }
    
    // Sett innhold
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Legg til i container
    notificationContainer.appendChild(notification);
    
    // Legg til event listener for å lukke notifikasjonen
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Fjern notifikasjonen automatisk etter 5 sekunder
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Eksporter funksjoner og variabler
window.dashboardBase = {
    supabase: dashboardSupabase,
    currentUser,
    userProfile,
    showNotification,
    calculateLevel,
    updateUserInterface
}; 