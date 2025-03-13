// Opprett Supabase-klienten
const SUPABASE_URL = 'https://agjxwktmzcfvepdmiaeq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnanh3a3RtemNmdmVwZG1pYWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NjEwMDMsImV4cCI6MjA1NzQzNzAwM30.WB69HGvHJXzpYN56Z9lrOcLcwau7hQOLmZkEz8BI61M';
// Bruk det globale Supabase-objektet som blir lastet inn fra CDN
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Globale variabler
const MAX_SKILL_LEVEL = 30;
let currentUser = null;
let userProfile = null;
let skillsData = {};
let inventoryItems = [];
let achievements = [];
let quests = [];
let shopItems = [];

// DOM-elementer
let usernameElement;
let logoutButton;
let navItems;
let tabContents;
let playerLevelElement;
let playerExpElement;
let playerCreditsElement;
let skillLevelElements;
let skillButtons;
let inventoryItemsContainer;
let shopItemsContainer;
let achievementsListContainer;
let activeQuestsContainer;
let availableQuestsContainer;
let notificationContainer;
let itemModal;
let closeModalButton;
let itemDetailsContainer;

// Statistikk-elementer
let statLevelElement;
let statExpElement;
let statQuestsElement;
let statAchievementsElement;
let statItemsElement;
let statCreditsSpentElement;

// Gjør userProfile tilgjengelig globalt
window.userProfile = userProfile;

// Funksjon for å initialisere DOM-elementer
function initDOMElements() {
    usernameElement = document.getElementById('username');
    logoutButton = document.getElementById('logout-button');
    navItems = document.querySelectorAll('.nav-item');
    tabContents = document.querySelectorAll('.tab-content');
    playerLevelElement = document.getElementById('player-level');
    playerExpElement = document.getElementById('player-exp');
    playerCreditsElement = document.getElementById('player-credits');
    skillLevelElements = document.querySelectorAll('.skill-level');
    skillButtons = document.querySelectorAll('.skill-button');
    inventoryItemsContainer = document.getElementById('inventory-items');
    shopItemsContainer = document.getElementById('shop-items');
    achievementsListContainer = document.getElementById('achievements-list');
    activeQuestsContainer = document.querySelector('#active-quests .quests-list');
    availableQuestsContainer = document.querySelector('#available-quests .quests-list');
    notificationContainer = document.getElementById('notification-container');
    itemModal = document.getElementById('item-modal');
    closeModalButton = document.querySelector('.close-modal');
    itemDetailsContainer = document.querySelector('.item-details');
    
    // Statistikk-elementer
    statLevelElement = document.getElementById('stat-level');
    statExpElement = document.getElementById('stat-exp');
    statQuestsElement = document.getElementById('stat-quests');
    statAchievementsElement = document.getElementById('stat-achievements');
    statItemsElement = document.getElementById('stat-items');
    statCreditsSpentElement = document.getElementById('stat-credits-spent');
}

// Funksjon for å initialisere dashbordet
async function initDashboard() {
    console.log('Initialiserer dashboard...');
    
    try {
        // Sjekk om brukeren er logget inn
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('Ingen bruker er logget inn');
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Bruker logget inn:', user.email);
        currentUser = user;
        
        // Hent brukerprofil fra Supabase
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (error) {
            console.error('Feil ved henting av brukerprofil:', error);
            showNotification('Feil ved henting av brukerprofil', 'error');
            return;
        }
        
        console.log('Brukerprofil hentet:', profile);
        
        // Initialiser userProfile med data fra Supabase
        userProfile = {
            id: profile.id,
            username: profile.username || 'Bruker',
            skills: profile.skills || {
                Intelligens: 0,
                Teknologi: 0,
                Stamina: 0,
                Karisma: 0,
                Kreativitet: 0,
                Flaks: 0
            },
            inventory: profile.inventory || [],
            achievements: profile.achievements || [],
            exp: profile.exp || 0,
            credits: profile.credits || 0
        };
        
        // Oppdater global userProfile
        window.userProfile = userProfile;
        
        // Logg inventaret
        console.log('Bruker har', userProfile.inventory.length, 'gjenstander i inventaret');
        if (userProfile.inventory.length > 0) {
            console.log('Første gjenstand:', JSON.stringify(userProfile.inventory[0]));
        }
        
        // Oppdater brukergrensesnittet med brukerdata
        updateUserInterface();
        
        // Abonner på sanntidsoppdateringer for brukerprofilen
        const channel = supabase
            .channel('profile-changes')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
            }, (payload) => {
                console.log('Profil oppdatert:', payload);
                
                // Oppdater userProfile med nye data
                const newData = payload.new;
                userProfile = {
                    ...userProfile,
                    username: newData.username,
                    skills: newData.skills,
                    inventory: newData.inventory,
                    achievements: newData.achievements,
                    exp: newData.exp,
                    credits: newData.credits
                };
                
                // Oppdater global userProfile
                window.userProfile = userProfile;
                
                // Oppdater brukergrensesnittet
                updateUserInterface();
                
                // Last inn inventaret på nytt
                loadInventoryItems();
                
                // Last inn prestasjoner på nytt
                loadAchievements();
                
                // Oppdater statistikk-fanen
                updateStatsTab();
                
                showNotification('Profil oppdatert', 'success');
            })
            .subscribe();
        
        // Last inn data
        loadSkillsData();
        loadInventoryItems();
        loadAchievements();
        loadQuests();
        loadShopItems();
        
        // Oppdater statistikk
        updateStatistics();
        
        // Oppdater statistikk-fanen
        updateStatsTab();
        
        console.log('Dashboard initialisert');
    } catch (error) {
        console.error('Feil ved initialisering av dashboard:', error);
        showNotification('Feil ved initialisering av dashboard', 'error');
    }
}

// Funksjon for å oppdatere brukergrensesnittet med brukerdata
function updateUserInterface() {
    if (!userProfile) return;
    
    // Oppdater brukernavn
    usernameElement.textContent = userProfile.username;
    
    // Oppdater brukernavn i header
    const usernameDisplayElement = document.getElementById('username-display');
    if (usernameDisplayElement) {
        usernameDisplayElement.textContent = userProfile.username.toUpperCase();
    }
    
    // Oppdater nivå, EXP og kreditter
    const level = calculateLevel(userProfile.skills);
    playerLevelElement.textContent = level;
    playerExpElement.textContent = userProfile.exp.toLocaleString();
    playerCreditsElement.textContent = userProfile.credits.toLocaleString();
    
    // Oppdater ferdigheter
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const skillName = card.dataset.skill;
        const skillLevel = userProfile.skills[skillName] || 0;
        const levelElement = card.querySelector('.skill-level');
        levelElement.textContent = skillLevel;
        
        // Sett farge på ferdighetskortet basert på ferdighetstypen
        const skillColor = getSkillColor(skillName);
        const skillColorRgba = getSkillColor(skillName, 0.3);
        
        // Oppdater styling på kortet
        card.style.borderColor = skillColor;
        card.style.boxShadow = `0 0 10px ${skillColorRgba}`;
        
        // Oppdater styling på tittel
        const titleElement = card.querySelector('.skill-name');
        if (titleElement) {
            titleElement.style.color = skillColor;
            titleElement.style.textShadow = `0 0 5px ${skillColorRgba}`;
        }
        
        // Oppdater styling på ikon
        const iconElement = card.querySelector('.skill-icon');
        if (iconElement) {
            iconElement.style.color = skillColor;
            iconElement.style.textShadow = `0 0 10px ${skillColorRgba}`;
        }
        
        // Oppdater styling på nivå
        if (levelElement) {
            levelElement.style.color = skillColor;
            levelElement.style.textShadow = `0 0 5px ${skillColorRgba}`;
        }
        
        // Legg til event listeners for knappene
        const increaseButton = card.querySelector('.increase');
        const decreaseButton = card.querySelector('.decrease');
        
        // Oppdater styling på knappene
        if (increaseButton) {
            increaseButton.style.backgroundColor = skillColor;
            increaseButton.style.borderColor = skillColor;
        }
        
        if (decreaseButton) {
            decreaseButton.style.borderColor = skillColor;
        }
        
        increaseButton.addEventListener('click', () => {
            increaseSkill(skillName);
        });
        
        decreaseButton.addEventListener('click', () => {
            decreaseSkill(skillName);
        });
    });
}

// Funksjon for å beregne nivå basert på ferdigheter
function calculateLevel(skills) {
    if (!skills) return 0;
    
    let totalSkillPoints = 0;
    for (const skill in skills) {
        totalSkillPoints += skills[skill];
    }
    
    return totalSkillPoints;
}

// Hjelpefunksjon for å hente farge for en ferdighet
function getSkillColor(skill, alpha = 1) {
    switch (skill) {
        case 'Intelligens':
            return alpha < 1 ? `rgba(0, 191, 255, ${alpha})` : '#00bfff';
        case 'Teknologi':
            return alpha < 1 ? `rgba(46, 204, 113, ${alpha})` : '#2ecc71';
        case 'Stamina':
            return alpha < 1 ? `rgba(255, 64, 64, ${alpha})` : '#ff4040';
        case 'Karisma':
            return alpha < 1 ? `rgba(255, 215, 0, ${alpha})` : '#ffd700';
        case 'Kreativitet':
            return alpha < 1 ? `rgba(255, 20, 147, ${alpha})` : '#ff1493';
        case 'Flaks':
            return alpha < 1 ? `rgba(0, 255, 255, ${alpha})` : '#00ffff';
        default:
            return alpha < 1 ? `rgba(255, 255, 255, ${alpha})` : '#ffffff';
    }
}

// Funksjon for å laste inn ferdighetsdata
function loadSkillsData() {
    console.log('Laster inn ferdighetsdata...');
    if (!userProfile || !userProfile.skills) return;
    
    skillsData = userProfile.skills;
    
    // Oppdater UI for ferdigheter
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const skillName = card.dataset.skill;
        const skillLevel = skillsData[skillName] || 0;
        const levelElement = card.querySelector('.skill-level');
        levelElement.textContent = skillLevel;
        
        // Sett farge på ferdighetskortet basert på ferdighetstypen
        const skillColor = getSkillColor(skillName);
        const skillColorRgba = getSkillColor(skillName, 0.3);
        
        // Oppdater styling på kortet
        card.style.borderColor = skillColor;
        card.style.boxShadow = `0 0 10px ${skillColorRgba}`;
        
        // Oppdater styling på tittel
        const titleElement = card.querySelector('.skill-name');
        if (titleElement) {
            titleElement.style.color = skillColor;
            titleElement.style.textShadow = `0 0 5px ${skillColorRgba}`;
        }
        
        // Oppdater styling på ikon
        const iconElement = card.querySelector('.skill-icon');
        if (iconElement) {
            iconElement.style.color = skillColor;
            iconElement.style.textShadow = `0 0 10px ${skillColorRgba}`;
        }
        
        // Oppdater styling på nivå
        if (levelElement) {
            levelElement.style.color = skillColor;
            levelElement.style.textShadow = `0 0 5px ${skillColorRgba}`;
        }
        
        // Legg til event listeners for knappene
        const increaseButton = card.querySelector('.increase');
        const decreaseButton = card.querySelector('.decrease');
        
        // Oppdater styling på knappene
        if (increaseButton) {
            increaseButton.style.backgroundColor = skillColor;
            increaseButton.style.borderColor = skillColor;
        }
        
        if (decreaseButton) {
            decreaseButton.style.borderColor = skillColor;
        }
        
        increaseButton.addEventListener('click', () => {
            increaseSkill(skillName);
        });
        
        decreaseButton.addEventListener('click', () => {
            decreaseSkill(skillName);
        });
    });
}

// Funksjon for å øke en ferdighet
let skillButtonsLocked = false; // Variabel for å forhindre raske gjentatte klikk

async function increaseSkill(skillName) {
    console.log(`Forsøker å øke ferdighet: ${skillName}`);
    
    // Sjekk om knappene er låst (forhindrer raske gjentatte klikk)
    if (skillButtonsLocked) {
        console.log('Knapper er låst, ignorerer klikk');
        return;
    }
    
    if (!userProfile || userProfile.exp < 1000) {
        showNotification('Ikke nok EXP for å øke ferdigheten', 'warning');
        return;
    }
    
    if (skillsData[skillName] >= MAX_SKILL_LEVEL) {
        showNotification('Ferdigheten er allerede på maksimalt nivå', 'warning');
        return;
    }
    
    try {
        // Lås knappene for å forhindre raske gjentatte klikk
        skillButtonsLocked = true;
        
        // Oppdater lokalt først for raskere UI-respons
        skillsData[skillName] = (skillsData[skillName] || 0) + 1;
        userProfile.exp -= 1000;
        
        // Oppdater UI
        updateUserInterface();
        
        // Oppdater i databasen
        await updateSkill(currentUser.id, skillName, skillsData[skillName]);
        await updateExp(currentUser.id, userProfile.exp);
        
        showNotification(`${skillName} økt til nivå ${skillsData[skillName]}!`, 'success');
        
        // Sjekk for nye prestasjoner
        checkAchievements(skillName);
        
    } catch (error) {
        console.error('Feil ved økning av ferdighet:', error.message);
        showNotification('Feil ved oppdatering av ferdighet', 'error');
        
        // Tilbakestill lokale endringer ved feil
        skillsData[skillName] -= 1;
        userProfile.exp += 1000;
        updateUserInterface();
    } finally {
        // Lås opp knappene etter en kort forsinkelse
        setTimeout(() => {
            skillButtonsLocked = false;
        }, 500); // 500 ms forsinkelse
    }
}

// Funksjon for å oppdatere en brukers ferdigheter
async function updateSkill(userId, skill, value) {
    console.log(`Oppdaterer ferdighet ${skill} til ${value} for bruker ${userId}`);
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
        
        console.log(`Ferdighet ${skill} oppdatert til ${value}`);
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av ferdighet:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å oppdatere en brukers erfaringspoeng
async function updateExp(userId, expValue) {
    console.log(`Oppdaterer EXP til ${expValue} for bruker ${userId}`);
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ exp: expValue })
            .eq('id', userId);
        
        if (error) throw error;
        
        console.log(`EXP oppdatert til ${expValue}`);
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av erfaringspoeng:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å redusere en ferdighet
async function decreaseSkill(skillName) {
    console.log(`Forsøker å redusere ferdighet: ${skillName}`);
    
    // Sjekk om knappene er låst (forhindrer raske gjentatte klikk)
    if (skillButtonsLocked) {
        console.log('Knapper er låst, ignorerer klikk');
        return;
    }
    
    if (!userProfile || !skillsData[skillName] || skillsData[skillName] <= 0) {
        showNotification('Ferdigheten er allerede på minimumsnivå', 'warning');
        return;
    }
    
    try {
        // Lås knappene for å forhindre raske gjentatte klikk
        skillButtonsLocked = true;
        
        // Oppdater lokalt først for raskere UI-respons
        skillsData[skillName] -= 1;
        userProfile.exp += 1000;
        
        // Oppdater UI
        updateUserInterface();
        
        // Oppdater i databasen
        await updateSkill(currentUser.id, skillName, skillsData[skillName]);
        await updateExp(currentUser.id, userProfile.exp);
        
        showNotification(`${skillName} redusert til nivå ${skillsData[skillName]}`, 'success');
        
        // Sjekk om noen prestasjoner skal fjernes
        checkAchievements(skillName);
        
    } catch (error) {
        console.error('Feil ved reduksjon av ferdighet:', error.message);
        showNotification('Feil ved oppdatering av ferdighet', 'error');
        
        // Tilbakestill lokale endringer ved feil
        skillsData[skillName] += 1;
        userProfile.exp -= 1000;
        updateUserInterface();
    } finally {
        // Lås opp knappene etter en kort forsinkelse
        setTimeout(() => {
            skillButtonsLocked = false;
        }, 500); // 500 ms forsinkelse
    }
}

// Funksjon for å laste inn prestasjoner
function loadAchievements() {
    console.log('Laster inn prestasjoner...');
    
    // Sjekk om loadDashboardAchievements-funksjonen er tilgjengelig
    if (typeof loadDashboardAchievements === 'function') {
        // Send userProfile til loadDashboardAchievements
        if (userProfile) {
            loadDashboardAchievements(userProfile);
        } else {
            console.error('userProfile er ikke tilgjengelig i loadAchievements');
            const achievementsContainer = document.getElementById('achievements-list');
            if (achievementsContainer) {
                achievementsContainer.innerHTML = '<div class="empty-message">Venter på brukerdata...</div>';
                
                // Prøv igjen om 1 sekund når userProfile kanskje er tilgjengelig
                setTimeout(() => {
                    if (userProfile) {
                        loadDashboardAchievements(userProfile);
                    } else {
                        achievementsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste brukerdata. Vennligst oppdater siden.</div>';
                    }
                }, 1000);
            }
        }
    } else {
        console.error('loadDashboardAchievements-funksjonen er ikke tilgjengelig');
        const achievementsContainer = document.getElementById('achievements-list');
        if (achievementsContainer) {
            achievementsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste prestasjoner. Vennligst prøv igjen senere.</div>';
        }
    }
}

// Funksjon for å laste inn oppdrag
function loadQuests() {
    console.log('Laster inn oppdrag...');
    // Dette ville normalt laste inn oppdrag fra en database
    // og vise dem i quests-fanen
}

// Funksjon for å laste inn butikkvarer
function loadShopItems() {
    console.log('Laster inn butikkvarer...');
    
    // Tøm container
    shopItemsContainer.innerHTML = '';
    
    // Hent butikkvarer fra shop.js
    fetch('../js/shop.js')
        .then(response => response.text())
        .then(shopScript => {
            // Bruk regex for å hente ut shopItems-arrayen
            const match = shopScript.match(/const\s+shopItems\s*=\s*(\[[\s\S]*?\]);/);
            if (match && match[1]) {
                try {
                    // Parse shopItems-arrayen
                    const shopItemsArray = eval(match[1]);
                    console.log('Butikkvarer lastet:', shopItemsArray.length, 'varer');
                    
                    // Hvis ingen varer er tilgjengelige, vis melding
                    if (!shopItemsArray || shopItemsArray.length === 0) {
                        const emptyMessage = document.createElement('div');
                        emptyMessage.className = 'empty-message';
                        emptyMessage.innerHTML = `
                            <div class="cyber-box" style="
                                background: rgba(0, 0, 0, 0.7);
                                border: 1px solid #ff5722;
                                padding: 20px;
                                text-align: center;
                                color: #ff5722;
                                border-radius: 5px;
                                box-shadow: 0 0 10px rgba(255, 87, 34, 0.3);
                                margin: 20px auto;
                                max-width: 400px;">
                                <i class="fas fa-store-slash" style="font-size: 48px; margin-bottom: 15px;"></i>
                                <h3>BUTIKKEN ER TOM</h3>
                                <p>Ingen varer er tilgjengelige for øyeblikket.</p>
                            </div>
                        `;
                        shopItemsContainer.appendChild(emptyMessage);
                        return;
                    }
                    
                    // Vis de første 12 varene (eller alle hvis færre enn 12)
                    const itemsToShow = shopItemsArray.slice(0, 12);
                    
                    // Vis hver vare i butikken
                    itemsToShow.forEach(item => {
                        // Bestem farge basert på sjeldenhet
                        let rarityColor, rarityName, rarityClass;
                        switch (item.rarity) {
                            case 'legendary':
                                rarityColor = '#ff9900';
                                rarityName = 'LEGENDARISK';
                                rarityClass = 'legendary';
                                break;
                            case 'epic':
                                rarityColor = '#a335ee';
                                rarityName = 'EPISK';
                                rarityClass = 'epic';
                                break;
                            case 'rare':
                                rarityColor = '#0070dd';
                                rarityName = 'SJELDEN';
                                rarityClass = 'rare';
                                break;
                            case 'uncommon':
                                rarityColor = '#1eff00';
                                rarityName = 'UVANLIG';
                                rarityClass = 'uncommon';
                                break;
                            default:
                                rarityColor = '#9d9d9d';
                                rarityName = 'VANLIG';
                                rarityClass = 'common';
                        }
                        
                        // Opprett varekort
                        const itemCard = document.createElement('div');
                        itemCard.className = `item-card ${rarityClass}`;
                        itemCard.innerHTML = `
                            <div class="item-icon">${item.icon || '📦'}</div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">${item.price} kreditter</div>
                            <div class="item-rarity" style="color: ${rarityColor};">${rarityName}</div>
                            <button class="buy-button">Kjøp</button>
                        `;
                        
                        // Legg til hover-effekt
                        itemCard.addEventListener('mouseover', () => {
                            itemCard.style.transform = 'translateY(-5px)';
                            itemCard.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.3), 0 0 10px ${rarityColor}`;
                        });
                        
                        itemCard.addEventListener('mouseout', () => {
                            itemCard.style.transform = 'translateY(0)';
                            itemCard.style.boxShadow = `0 5px 15px rgba(0, 0, 0, 0.2), 0 0 5px ${rarityColor}`;
                        });
                        
                        // Legg til klikk-hendelse for å vise detaljer
                        itemCard.addEventListener('click', (event) => {
                            // Ikke vis detaljer hvis kjøp-knappen ble klikket
                            if (event.target.classList.contains('buy-button')) {
                                return;
                            }
                            showItemDetails(item);
                        });
                        
                        // Legg til klikk-hendelse for kjøp-knappen
                        const buyButton = itemCard.querySelector('.buy-button');
                        buyButton.addEventListener('click', () => {
                            buyItem(item);
                        });
                        
                        // Legg til i container
                        shopItemsContainer.appendChild(itemCard);
                    });
                    
                } catch (error) {
                    console.error('Feil ved parsing av butikkvarer:', error);
                    shopItemsContainer.innerHTML = '<div class="empty-message">Feil ved lasting av butikkvarer.</div>';
                }
            } else {
                console.error('Kunne ikke finne shopItems-array i shop.js');
                shopItemsContainer.innerHTML = '<div class="empty-message">Feil ved lasting av butikkvarer.</div>';
            }
        })
        .catch(error => {
            console.error('Feil ved lasting av shop.js:', error);
            shopItemsContainer.innerHTML = '<div class="empty-message">Feil ved lasting av butikkvarer.</div>';
        });
}

// Funksjon for å vise detaljer om en gjenstand
function showItemDetails(item) {
    console.log('Viser detaljer for gjenstand:', item);
    
    // Bestem farge basert på sjeldenhet
    let rarityColor, rarityGlow, rarityName;
    switch (item.rarity) {
        case 'legendary':
            rarityColor = '#f1c40f';
            rarityGlow = 'rgba(241, 196, 15, 0.5)';
            rarityName = 'LEGENDARISK';
            break;
        case 'epic':
            rarityColor = '#9b59b6';
            rarityGlow = 'rgba(155, 89, 182, 0.5)';
            rarityName = 'EPISK';
            break;
        case 'rare':
            rarityColor = '#3498db';
            rarityGlow = 'rgba(52, 152, 219, 0.5)';
            rarityName = 'SJELDEN';
            break;
        case 'uncommon':
            rarityColor = '#1eff00';
            rarityGlow = 'rgba(30, 255, 0, 0.5)';
            rarityName = 'UVANLIG';
            break;
        default:
            rarityColor = '#ffffff';
            rarityGlow = 'rgba(255, 255, 255, 0.5)';
            rarityName = 'VANLIG';
    }
    
    // Opprett HTML for statistikk
    let statsHTML = '';
    if (item.stats) {
        statsHTML = '<div class="item-stats" style="margin-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 15px;">';
        for (const stat in item.stats) {
            const statValue = item.stats[stat];
            const valueColor = statValue > 0 ? '#1eff00' : '#ff4040';
            const sign = statValue > 0 ? '+' : '';
            
            statsHTML += `
                <div class="stat-row" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: rgba(255, 255, 255, 0.8);">${stat}:</span> 
                    <span style="color: ${valueColor};">${sign}${statValue}</span>
                </div>`;
        }
        statsHTML += '</div>';
    }
    
    // Opprett HTML for slot-informasjon
    let slotHTML = '';
    if (item.slot) {
        const slotNames = {
            head: 'Hode',
            chest: 'Bryst',
            hands: 'Hender',
            legs: 'Bein',
            feet: 'Føtter',
            accessory: 'Tilbehør'
        };
        
        slotHTML = `
            <div class="item-slot" style="
                margin-top: 10px;
                padding: 5px 10px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 4px;
                display: inline-block;
                color: rgba(0, 255, 255, 0.8);
                font-size: 12px;
                text-transform: uppercase;
            ">
                Slot: ${slotNames[item.slot] || item.slot}
            </div>
        `;
    }
    
    // Sett innhold i modal med cyberpunk-stil
    itemDetailsContainer.innerHTML = `
        <div class="item-detail-header" style="
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${rarityColor};
            box-shadow: 0 5px 10px -5px ${rarityGlow};
        ">
            <div class="item-detail-icon" style="
                font-size: 64px;
                margin-right: 20px;
                text-shadow: 0 0 15px ${rarityGlow};
                background: rgba(0, 0, 0, 0.3);
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                border: 2px solid ${rarityColor};
            ">${item.icon || '📦'}</div>
            <div class="item-detail-title">
                <h3 style="
                    color: ${rarityColor};
                    margin: 0 0 5px 0;
                    font-size: 24px;
                    text-shadow: 0 0 10px ${rarityGlow};
                    letter-spacing: 1px;
                ">${item.name}</h3>
                <div class="item-detail-rarity" style="
                    color: ${rarityColor};
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">${rarityName}</div>
            </div>
        </div>
        <div class="item-detail-description" style="
            margin-bottom: 15px;
            color: rgba(255, 255, 255, 0.8);
            font-style: italic;
            line-height: 1.5;
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 5px;
            border-left: 3px solid ${rarityColor};
        ">${item.description || 'Ingen beskrivelse tilgjengelig.'}</div>
        ${statsHTML}
        <div class="item-detail-type" style="
            margin-top: 15px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
        ">Type: ${item.type || 'Ukjent'}</div>
        ${slotHTML}
    `;
    
    // Legg til holografisk effekt på modal
    itemModal.style.background = `
        linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(20, 20, 30, 0.95)),
        repeating-linear-gradient(45deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.05) 0px, 
        rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.05) 1px, transparent 1px, transparent 10px)
    `;
    itemModal.style.borderColor = rarityColor;
    itemModal.style.boxShadow = `0 0 20px ${rarityGlow}, inset 0 0 10px ${rarityGlow}`;
    
    // Vis modal
    itemModal.style.display = 'block';
}

// Funksjon for å kjøpe en gjenstand
async function buyItem(item) {
    console.log('Forsøker å kjøpe gjenstand:', item);
    
    if (!userProfile) {
        showNotification('Du må være logget inn for å kjøpe gjenstander', 'error');
        return;
    }
    
    // Sjekk om brukeren har nok kreditter
    if (userProfile.credits < item.price) {
        showNotification('Ikke nok kreditter til å kjøpe denne gjenstanden', 'error');
        return;
    }
    
    try {
        // Oppdater lokalt først for raskere UI-respons
        userProfile.credits -= item.price;
        
        // Initialiser inventory hvis det ikke finnes
        if (!userProfile.inventory) {
            userProfile.inventory = [];
        }
        
        // Opprett en ny gjenstand med unikt ID
        const newItem = {
            id: Date.now(),
            name: item.name,
            description: item.description,
            icon: item.icon,
            image: item.image,
            rarity: item.rarity,
            type: item.type,
            slot: item.slot,
            stats: item.stats
        };
        
        // Legg til i inventar
        userProfile.inventory.push(newItem);
        
        console.log('Gjenstand lagt til i inventar:', newItem);
        console.log('Oppdatert inventar:', userProfile.inventory);
        
        // Oppdater UI
        updateUserInterface();
        loadInventoryItems();
        
        // Oppdater i databasen
        const { error: creditsError } = await supabase
            .from('profiles')
            .update({ credits: userProfile.credits })
            .eq('id', currentUser.id);
            
        if (creditsError) throw creditsError;
        
        const { error: inventoryError } = await supabase
            .from('profiles')
            .update({ inventory: userProfile.inventory })
            .eq('id', currentUser.id);
            
        if (inventoryError) throw inventoryError;
        
        showNotification(`Du har kjøpt ${item.name}!`, 'success');
        
    } catch (error) {
        console.error('Feil ved kjøp av gjenstand:', error);
        showNotification('Feil ved kjøp av gjenstand', 'error');
        
        // Tilbakestill lokale endringer ved feil
        userProfile.credits += item.price;
        userProfile.inventory.pop();
        updateUserInterface();
        loadInventoryItems();
    }
}

// Funksjon for å legge til en testgjenstand i inventaret (for testing)
async function addTestItem() {
    console.log('Legger til testgjenstand...');
    
    if (!userProfile) {
        showNotification('Ingen brukerprofil funnet', 'error');
        return;
    }
    
    // Initialiser inventory hvis det ikke finnes
    if (!userProfile.inventory) {
        console.log('Initialiserer tom inventory-array');
        userProfile.inventory = [];
    }
    
    // Opprett en testgjenstand
    const testItem = {
        id: Date.now(),
        name: 'Testgjenstand',
        description: 'En gjenstand for testing',
        icon: '🧪',
        rarity: 'epic',
        type: 'Test',
        slot: null,
        stats: {
            'Styrke': 5,
            'Intelligens': 3
        }
    };
    
    // Legg til i inventar
    userProfile.inventory.push(testItem);
    
    console.log('Testgjenstand lagt til i inventar:', testItem);
    console.log('Oppdatert inventar:', userProfile.inventory);
    
    try {
        // Oppdater i databasen
        const { error } = await supabase
            .from('profiles')
            .update({ inventory: userProfile.inventory })
            .eq('id', currentUser.id);
            
        if (error) throw error;
        
        // Oppdater UI
        loadInventoryItems();
        showNotification('Testgjenstand lagt til i inventaret', 'success');
        
    } catch (error) {
        console.error('Feil ved lagring av testgjenstand:', error);
        showNotification('Feil ved lagring av testgjenstand', 'error');
        
        // Fjern gjenstanden fra lokalt inventar ved feil
        userProfile.inventory.pop();
    }
}

// Funksjon for å oppdatere statistikk
function updateStatistics() {
    console.log('Oppdaterer statistikk...');
    if (!userProfile) return;
    
    const level = calculateLevel(userProfile.skills);
    statLevelElement.textContent = level;
    statExpElement.textContent = userProfile.exp.toLocaleString();
    statQuestsElement.textContent = '0'; // Dette ville normalt være antall fullførte oppdrag
    statAchievementsElement.textContent = userProfile.achievements ? userProfile.achievements.length : '0';
    statItemsElement.textContent = userProfile.inventory ? userProfile.inventory.length : '0';
    statCreditsSpentElement.textContent = '0'; // Dette ville normalt være totalt antall kreditter brukt
}

// Funksjon for å vise notifikasjoner
function showNotification(message, type = 'info') {
    console.log(`Viser notifikasjon: ${message} (${type})`);
    // Opprett notifikasjonselement
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Bestem ikon basert på type
    let icon;
    switch(type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            icon = 'fas fa-info-circle';
    }
    
    // Sett innhold
    notification.innerHTML = `
        <div class="notification-icon"><i class="${icon}"></i></div>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Legg til i container
    notificationContainer.appendChild(notification);
    
    // Legg til event listener for lukkeknappen
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Fjern notifikasjon automatisk etter 5 sekunder
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Funksjon for å sjekke achievements
function checkAchievements(skillName) {
    console.log('Sjekker prestasjoner for ferdighet:', skillName);
    
    if (!userProfile || !achievements || !Array.isArray(achievements)) {
        console.error('Kan ikke sjekke prestasjoner: userProfile eller achievements mangler');
        return;
    }
    
    // Konverter userProfile til formatet som achievements.check forventer
    const user = {
        ...userProfile,
        Intelligens: userProfile.skills.Intelligens || 0,
        Teknologi: userProfile.skills.Teknologi || 0,
        Stamina: userProfile.skills.Stamina || 0,
        Karisma: userProfile.skills.Karisma || 0,
        Kreativitet: userProfile.skills.Kreativitet || 0,
        Flaks: userProfile.skills.Flaks || 0
    };
    
    // Filtrer achievements basert på ferdighet
    const skillAchievements = achievements.filter(a => a.skill === skillName);
    
    // Sjekk hver prestasjon
    skillAchievements.forEach(achievement => {
        const hasAchievement = userProfile.achievements?.includes(achievement.name);
        const meetsRequirement = achievement.check(user);
        
        if (!hasAchievement && meetsRequirement) {
            console.log('Ny prestasjon låst opp:', achievement.name);
            
            // Legg til prestasjon i brukerens liste
            if (!userProfile.achievements) {
                userProfile.achievements = [];
            }
            userProfile.achievements.push(achievement.name);
            
            // Oppdater i databasen
            updateAchievements(currentUser.id, userProfile.achievements)
                .then(() => {
                    console.log('Prestasjoner oppdatert i databasen');
                })
                .catch(error => {
                    console.error('Feil ved oppdatering av prestasjoner:', error);
                });
            
            // Vis popup og spill lyd
            showAchievementPopup(achievement);
            
            // Oppdater statistikk
            updateStatistics();
        }
    });
}

// Funksjon for å oppdatere brukerens prestasjoner i databasen
async function updateAchievements(userId, achievements) {
    console.log(`Oppdaterer prestasjoner for bruker ${userId}`);
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ achievements: achievements })
            .eq('id', userId);
        
        if (error) throw error;
        
        console.log('Prestasjoner oppdatert');
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av prestasjoner:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å vise achievement-popup
function showAchievementPopup(achievement) {
    console.log('Viser achievement popup for:', achievement.name);
    
    // Fjern eksisterende popup
    const existingPopup = document.querySelector('.achievement-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Opprett popup
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.setAttribute('data-skill', achievement.skill);
    
    // Bestem farge basert på ferdighet
    const skillColor = getSkillColor(achievement.skill);
    const skillColorRgba = getSkillColor(achievement.skill, 0.5);
    
    popup.innerHTML = `
        <div style="background: rgba(0, 0, 0, 0.8); padding: 30px; border-radius: 20px; border: 3px solid ${skillColor}; box-shadow: 0 0 30px ${skillColorRgba}">
            <div style="font-size: 64px; margin-bottom: 20px; color: ${skillColor}; text-shadow: 0 0 15px ${skillColorRgba}; text-align: center;">
                <i class="${getAchievementIcon(achievement.name)}"></i>
            </div>
            <p style="font-size: 36px; margin-bottom: 20px; color: ${skillColor}; text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8); font-weight: bold; text-align: center;">Belønning låst opp</p>
            <p style="font-size: 32px; margin: 15px 0; color: ${skillColor}; text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8); font-weight: bold; text-align: center;">${achievement.name}</p>
            <p style="font-size: 24px; margin-bottom: 20px; color: ${skillColor}; text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8); text-align: center;">${achievement.description}</p>
            <p style="font-size: 28px; color: ${skillColor}; text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8); padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 10px; margin-top: 10px; text-align: center;">${achievement.reward || 'Ingen belønning spesifisert'}</p>
        </div>
    `;
    
    // Legg til CSS for animasjon hvis det ikke allerede finnes
    if (!document.getElementById('achievement-popup-style')) {
        const style = document.createElement('style');
        style.id = 'achievement-popup-style';
        style.textContent = `
            .achievement-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.5);
                z-index: 9999;
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .achievement-popup.show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Legg til i dokumentet
    document.body.appendChild(popup);

    // Trigger animasjon
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });

    // Spill achievement-lyd
    playAchievementSound();

    // Fjern etter forsinkelse
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 600);
    }, 5000);
}

// Funksjon for å spille achievement-lyd
function playAchievementSound() {
    // Sjekk om lydelement finnes, hvis ikke, opprett det
    let sound = document.getElementById('achievementSound');
    if (!sound) {
        sound = document.createElement('audio');
        sound.id = 'achievementSound';
        sound.src = '../sounds/achievement.mp3';
        sound.preload = 'auto';
        document.body.appendChild(sound);
    }
    
    sound.currentTime = 0;
    sound.volume = 0.3;
    sound.play().catch(e => console.log('Sound play prevented:', e));
}

// Hjelpefunksjon for å få ikon basert på achievement-navn
function getAchievementIcon(achievementName) {
    const name = achievementName.toLowerCase();
    if (name.includes('newbie')) {
        return 'fas fa-star';
    } else if (name.includes('explorer')) {
        return 'fas fa-compass';
    } else if (name.includes('master')) {
        return 'fas fa-crown';
    } else if (name.includes('legend')) {
        return 'fas fa-trophy';
    } else if (name.includes('champion')) {
        return 'fas fa-medal';
    } else {
        return 'fas fa-award';
    }
}

// Funksjon for å laste inn inventar
function loadInventoryItems() {
    console.log('Laster inn inventar...');
    
    // Sjekk om brukerprofil og inventar finnes
    if (!userProfile) {
        console.warn('Ingen brukerprofil funnet ved lasting av inventar');
        return;
    }
    
    // Sjekk at inventory er et array
    if (!Array.isArray(userProfile.inventory)) {
        console.warn('Inventory er ikke et array, initialiserer tom array');
        userProfile.inventory = [];
    }
    
    // Logg inventaret
    console.log('Bruker har', userProfile.inventory.length, 'gjenstander i inventaret');
    if (userProfile.inventory.length > 0) {
        console.log('Første gjenstand:', JSON.stringify(userProfile.inventory[0]));
    }
    
    // Tøm container
    inventoryItemsContainer.innerHTML = '';
    
    // Hvis inventaret er tomt, vis melding
    if (userProfile.inventory.length === 0) {
        console.log('Inventaret er tomt');
        inventoryItemsContainer.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px 20px;
                color: rgba(255, 255, 255, 0.5);
                font-style: italic;
                font-family: 'Courier New', monospace;
                border: 1px dashed rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                background: rgba(0, 0, 0, 0.3);
            ">
                <i class="fas fa-backpack" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                RYGGSEKKEN ER TOM<br>
                <span style="font-size: 14px; opacity: 0.7; margin-top: 10px; display: block;">Kjøp gjenstander i Oasis-butikken eller få tilfeldige gjenstander ved level up!</span>
            </div>
        `;
        return;
    }
    
    console.log(`Viser ${userProfile.inventory.length} gjenstander i inventaret`);
    
    // Vis hver gjenstand i inventaret
    userProfile.inventory.forEach(item => {
        console.log('Behandler gjenstand:', item);
        
        // Sjekk at gjenstanden har nødvendige felter
        if (!item || !item.name) {
            console.warn('Ugyldig gjenstand funnet:', item);
            return;
        }
        
        // Bestem farge basert på sjeldenhet
        let rarityColor, rarityGlow, rarityName;
        switch (item.rarity) {
            case 'legendary':
                rarityColor = '#f1c40f';
                rarityGlow = 'rgba(241, 196, 15, 0.5)';
                rarityName = 'LEGENDARISK';
                break;
            case 'epic':
                rarityColor = '#9b59b6';
                rarityGlow = 'rgba(155, 89, 182, 0.5)';
                rarityName = 'EPISK';
                break;
            case 'rare':
                rarityColor = '#3498db';
                rarityGlow = 'rgba(52, 152, 219, 0.5)';
                rarityName = 'SJELDEN';
                break;
            case 'uncommon':
                rarityColor = '#1eff00';
                rarityGlow = 'rgba(30, 255, 0, 0.5)';
                rarityName = 'UVANLIG';
                break;
            default:
                rarityColor = '#ffffff';
                rarityGlow = 'rgba(255, 255, 255, 0.5)';
                rarityName = 'VANLIG';
        }
        
        // Opprett gjenstandskort med cyberpunk-stil
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.setAttribute('data-rarity', item.rarity || 'common');
        itemElement.setAttribute('data-item-id', item.id);
        
        // Legg til spesielle effekter for legendariske gjenstander
        const legendaryEffect = item.rarity === 'legendary' ? 
            `animation: pulse-glow 2s infinite alternate;
             background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.9));` : '';
        
        itemElement.style.cssText = `
            position: relative;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(10, 10, 20, 0.8));
            border: 2px solid ${rarityColor};
            border-radius: 8px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: all 0.3s ease;
            min-height: 180px;
            box-shadow: 0 0 10px ${rarityGlow};
            overflow: hidden;
            ${legendaryEffect}
        `;
        
        // Legg til holografisk overlay for cyberpunk-følelse
        const holographicOverlay = document.createElement('div');
        holographicOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                repeating-linear-gradient(90deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 0px, 
                rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 1px, transparent 1px, transparent 10px),
                repeating-linear-gradient(0deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 0px, 
                rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 1px, transparent 1px, transparent 10px);
            pointer-events: none;
            z-index: 1;
        `;
        itemElement.appendChild(holographicOverlay);
        
        // Legg til innhold
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        `;
        
        // Legg til sjeldenhetsmerke
        const rarityBadge = document.createElement('div');
        rarityBadge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background: ${rarityColor};
            color: #000;
            font-size: 10px;
            padding: 3px 6px;
            border-radius: 3px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 0 5px ${rarityGlow};
        `;
        rarityBadge.textContent = rarityName;
        contentDiv.appendChild(rarityBadge);
        
        // Legg til slot-merke hvis gjenstanden kan equippes
        if (item.slot) {
            const slotNames = {
                head: 'Hode',
                chest: 'Bryst',
                hands: 'Hender',
                legs: 'Bein',
                feet: 'Føtter',
                accessory: 'Tilbehør'
            };
            
            const slotBadge = document.createElement('div');
            slotBadge.style.cssText = `
                position: absolute;
                top: -5px;
                left: -5px;
                background: rgba(0, 255, 255, 0.7);
                color: #000;
                font-size: 10px;
                padding: 3px 6px;
                border-radius: 3px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
            `;
            slotBadge.textContent = slotNames[item.slot];
            contentDiv.appendChild(slotBadge);
        }
        
        // Legg til ikon
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = `
            font-size: 48px;
            margin: 10px 0;
            text-shadow: 0 0 10px ${rarityGlow};
        `;
        iconDiv.textContent = item.icon || '📦';
        contentDiv.appendChild(iconDiv);
        
        // Legg til navn
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
            color: ${rarityColor};
            text-shadow: 0 0 5px ${rarityGlow};
        `;
        nameDiv.textContent = item.name;
        contentDiv.appendChild(nameDiv);
        
        // Legg til beskrivelse
        const descDiv = document.createElement('div');
        descDiv.style.cssText = `
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 10px;
            flex-grow: 1;
        `;
        descDiv.textContent = item.description || item.type || 'Gjenstand';
        contentDiv.appendChild(descDiv);
        
        // Legg til hover-effekt
        itemElement.addEventListener('mouseover', () => {
            itemElement.style.transform = 'translateY(-5px) scale(1.03)';
            itemElement.style.boxShadow = `0 10px 20px ${rarityGlow}`;
            itemElement.style.zIndex = '10';
        });
        
        itemElement.addEventListener('mouseout', () => {
            itemElement.style.transform = 'translateY(0) scale(1)';
            itemElement.style.boxShadow = `0 0 10px ${rarityGlow}`;
            itemElement.style.zIndex = '1';
        });
        
        // Legg til klikk-hendelse for å vise detaljer
        itemElement.addEventListener('click', () => {
            showItemDetails(item);
        });
        
        // Legg til innholdet i kortet
        itemElement.appendChild(contentDiv);
        
        // Legg til i container
        inventoryItemsContainer.appendChild(itemElement);
    });
}

// Funksjon for å oppdatere statistikk-fanen
function updateStatsTab() {
    console.log('Oppdaterer statistikk-fanen...');
    // Hent statistikk fra brukerens profil
    if (!userProfile) {
        console.error('userProfile er ikke definert');
        return;
    }

    console.log('userProfile:', userProfile);

    // Oppdater statistikk-verdier
    document.getElementById('stat-level').textContent = calculateLevel(userProfile.skills) || 1;
    document.getElementById('stat-exp').textContent = userProfile.exp || 0;
    document.getElementById('stat-quests').textContent = userProfile.completedQuests || 0;
    document.getElementById('stat-achievements').textContent = userProfile.achievements?.length || 0;
    document.getElementById('stat-items').textContent = userProfile.inventory?.length || 0;
    document.getElementById('stat-credits-spent').textContent = userProfile.creditsSpent || 0;

    // Oppdater ferdighetsgrafen
    updateSkillsGraph(userProfile);

    // Legg til animasjonseffekter
    animateStatCards();
}

// Funksjon for å oppdatere ferdighetsgrafen
function updateSkillsGraph(user) {
    // Oppdater ferdighetsverdier i grafen
    document.getElementById('graph-intelligens').textContent = user.skills?.Intelligens || 0;
    document.getElementById('graph-teknologi').textContent = user.skills?.Teknologi || 0;
    document.getElementById('graph-stamina').textContent = user.skills?.Stamina || 0;
    document.getElementById('graph-karisma').textContent = user.skills?.Karisma || 0;
    document.getElementById('graph-kreativitet').textContent = user.skills?.Kreativitet || 0;
    document.getElementById('graph-flaks').textContent = user.skills?.Flaks || 0;

    // Beregn posisjoner basert på ferdighetsverdier
    const maxSkill = 10; // Maksimal ferdighetsverdi
    const baseRadius = 80; // Basisradius for grafen

    const skills = [
        { name: 'Intelligens', value: user.skills?.Intelligens || 0 },
        { name: 'Teknologi', value: user.skills?.Teknologi || 0 },
        { name: 'Stamina', value: user.skills?.Stamina || 0 },
        { name: 'Karisma', value: user.skills?.Karisma || 0 },
        { name: 'Kreativitet', value: user.skills?.Kreativitet || 0 },
        { name: 'Flaks', value: user.skills?.Flaks || 0 }
    ];

    // Oppdater posisjoner for ferdighetssirklene
    skills.forEach(skill => {
        const element = document.querySelector(`.stats-graph-skill[data-skill="${skill.name}"]`);
        if (!element) return;

        // Beregn radius basert på ferdighetsnivå
        const radius = baseRadius * (0.4 + (skill.value / maxSkill) * 0.6);
        
        // Oppdater størrelse basert på ferdighetsnivå
        const size = 40 + (skill.value / maxSkill) * 20;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;

        // Oppdater posisjon basert på ferdighetsnivå og opprinnelig posisjon
        const currentPosition = window.getComputedStyle(element);
        const currentTop = parseFloat(currentPosition.top);
        const currentLeft = parseFloat(currentPosition.left);
        
        // Behold opprinnelig posisjon, men juster basert på ferdighetsnivå
        if (skill.name === 'Intelligens') {
            element.style.top = `${radius * 0.2}px`;
        } else if (skill.name === 'Teknologi') {
            element.style.right = `${radius * 0.2}px`;
        } else if (skill.name === 'Stamina') {
            element.style.bottom = `${radius * 0.6}px`;
            element.style.right = `${radius * 0.2}px`;
        } else if (skill.name === 'Karisma') {
            element.style.bottom = `${radius * 0.2}px`;
        } else if (skill.name === 'Kreativitet') {
            element.style.bottom = `${radius * 0.6}px`;
            element.style.left = `${radius * 0.2}px`;
        } else if (skill.name === 'Flaks') {
            element.style.left = `${radius * 0.2}px`;
        }
    });
}

// Funksjon for å animere statistikk-kortene
function animateStatCards() {
    const statCards = document.querySelectorAll('.stats-card');
    
    statCards.forEach((card, index) => {
        // Legg til forsinkelse for hver kort
        setTimeout(() => {
            card.classList.add('animate-in');
            
            // Animer progresjonsbaren
            const bar = card.querySelector('.stats-card-bar-fill');
            if (bar) {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        }, index * 150);
    });
}

// Legg til lytter for tab-endringer for å oppdatere statistikk
document.querySelectorAll('.nav-item').forEach(tab => {
    tab.addEventListener('click', function() {
        if (this.getAttribute('data-tab') === 'stats') {
            updateStatsTab();
        }
    });
});

// Oppdater statistikk når siden lastes
document.addEventListener('DOMContentLoaded', function() {
    // Sjekk om brukeren er på statistikk-fanen
    const activeTab = document.querySelector('.nav-item.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'stats') {
        updateStatsTab();
    }
});

// Initialiser når DOM er lastet
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM lastet, initialiserer dashboard...');
    
    // Skaler ned dashbordet til 80% av opprinnelig størrelse
    const dashboardStyle = document.createElement('style');
    dashboardStyle.textContent = `
        .dashboard-container {
            transform: scale(0.8);
            transform-origin: top center;
            width: 125%;
            margin-left: -12.5%;
        }
        .nav-item, .tab-content, .skill-card, .item-card, .achievement-card, .quest-card {
            font-size: 0.9em;
        }
        .notification {
            transform: scale(0.8);
        }
    `;
    document.head.appendChild(dashboardStyle);
    
    // Last inn achievements fra achievements.js
    fetch('../js/achievements.js')
        .then(response => response.text())
        .then(achievementsScript => {
            // Bruk regex for å hente ut achievements-arrayen
            const match = achievementsScript.match(/const\s+achievements\s*=\s*(\[[\s\S]*?\]);/);
            if (match && match[1]) {
                try {
                    // Parse achievements-arrayen
                    achievements = eval(match[1]);
                    console.log('Prestasjoner lastet:', achievements.length, 'prestasjoner');
                } catch (error) {
                    console.error('Feil ved parsing av prestasjoner:', error);
                }
            } else {
                console.error('Kunne ikke finne achievements-array i achievements.js');
            }
        })
        .catch(error => {
            console.error('Feil ved lasting av achievements.js:', error);
        });
    
    // Initialiser DOM-elementer
    initDOMElements();
    
    // Initialiser dashbordet
    initDashboard();
    
    // Legg til hover-effekt for hovedsideknappen
    const mainPageButton = document.querySelector('.user-info a.cyber-button');
    if (mainPageButton) {
        mainPageButton.addEventListener('mouseover', function() {
            this.style.background = 'linear-gradient(135deg, #2980b9, #1a5276)';
            this.style.transform = 'translateY(-2px)';
        });
        
        mainPageButton.addEventListener('mouseout', function() {
            this.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
            this.style.transform = 'translateY(0)';
        });
    }
    
    // Håndter fanenavigasjon
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Fjern aktiv klasse fra alle faner
            navItems.forEach(navItem => navItem.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Legg til aktiv klasse på valgt fane
            item.classList.add('active');
            const tabId = `${item.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Håndter utlogging
    logoutButton.addEventListener('click', async () => {
        try {
            console.log('Logger ut...');
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Feil ved utlogging:', error.message);
            showNotification('Feil ved utlogging', 'error');
        }
    });
    
    // Håndter lukking av modal
    closeModalButton.addEventListener('click', () => {
        itemModal.style.display = 'none';
    });
    
    // Lukk modal når man klikker utenfor innholdet
    itemModal.addEventListener('click', (event) => {
        if (event.target === itemModal) {
            itemModal.style.display = 'none';
        }
    });
    
    // Legg til event listener for testknappen
    const testButton = document.getElementById('test-inventory-button');
    if (testButton) {
        testButton.addEventListener('click', () => {
            console.log('Testknapp klikket');
            addTestItem();
        });
    }
}); 