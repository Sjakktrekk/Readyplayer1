// Importer Supabase-funksjonalitet
// Ingen imports nødvendig, vi bruker supabase-klienten direkte

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
const usernameElement = document.getElementById('username');
const logoutButton = document.getElementById('logout-button');
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const playerLevelElement = document.getElementById('player-level');
const playerExpElement = document.getElementById('player-exp');
const playerCreditsElement = document.getElementById('player-credits');
const skillLevelElements = document.querySelectorAll('.skill-level');
const skillButtons = document.querySelectorAll('.skill-button');
const inventoryItemsContainer = document.getElementById('inventory-items');
const shopItemsContainer = document.getElementById('shop-items');
const achievementsListContainer = document.getElementById('achievements-list');
const activeQuestsContainer = document.querySelector('#active-quests .quests-list');
const availableQuestsContainer = document.querySelector('#available-quests .quests-list');
const notificationContainer = document.getElementById('notification-container');
const itemModal = document.getElementById('item-modal');
const closeModalButton = document.querySelector('.close-modal');
const itemDetailsContainer = document.querySelector('.item-details');

// Statistikk-elementer
const statLevelElement = document.getElementById('stat-level');
const statExpElement = document.getElementById('stat-exp');
const statQuestsElement = document.getElementById('stat-quests');
const statAchievementsElement = document.getElementById('stat-achievements');
const statItemsElement = document.getElementById('stat-items');
const statCreditsSpentElement = document.getElementById('stat-credits-spent');

// Initialiser dashbordet
async function initDashboard() {
    try {
        console.log('Initialiserer dashbord...');
        
        // Sjekk om brukeren er logget inn
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error('Bruker ikke logget inn:', authError?.message);
            // Redirect til login-siden hvis ikke logget inn
            window.location.href = 'login.html';
            return;
        }
        
        console.log('Bruker logget inn:', user.email);
        currentUser = user;
        
        // Hent brukerprofil
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (error) {
            console.error('Feil ved henting av brukerprofil:', error.message);
            showNotification('Feil ved henting av brukerprofil: ' + error.message, 'error');
            return;
        }
        
        if (!data) {
            console.error('Ingen brukerprofil funnet');
            showNotification('Ingen brukerprofil funnet', 'error');
            return;
        }
        
        userProfile = data;
        console.log('Brukerprofil lastet:', userProfile);
        
        // Sjekk og initialiser nødvendige felter i brukerprofilen
        if (!userProfile.skills) userProfile.skills = {};
        if (!userProfile.inventory) {
            console.log('Initialiserer tom inventory-array');
            userProfile.inventory = [];
        } else {
            console.log('Inventar funnet i brukerprofil:', userProfile.inventory.length, 'gjenstander');
            
            // Sjekk at alle gjenstander har nødvendige felter
            if (Array.isArray(userProfile.inventory)) {
                userProfile.inventory = userProfile.inventory.filter(item => {
                    if (!item || !item.name || !item.icon) {
                        console.warn('Ugyldig gjenstand funnet og fjernet:', item);
                        return false;
                    }
                    return true;
                });
                console.log('Etter validering:', userProfile.inventory.length, 'gyldige gjenstander');
            }
        }
        if (!userProfile.achievements) userProfile.achievements = [];
        if (userProfile.exp === undefined) userProfile.exp = 0;
        if (userProfile.credits === undefined) userProfile.credits = 0;
        
        // Oppdater UI med brukerdata
        updateUserInterface();
        
        // Abonner på sanntidsoppdateringer for brukerprofilen
        const subscription = supabase
            .channel(`profile-${user.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
            }, (payload) => {
                console.log('Profil oppdatert:', payload.new);
                userProfile = payload.new;
                
                // Sjekk at inventory er et array
                if (!Array.isArray(userProfile.inventory)) {
                    console.warn('Inventory er ikke et array i oppdatert profil, initialiserer tom array');
                    userProfile.inventory = [];
                }
                
                updateUserInterface();
                loadInventoryItems();
                updateStatistics();
            })
            .subscribe();
        
        console.log('Abonnert på profiloppdateringer');
        
        // Last inn data for de ulike fanene
        loadSkillsData();
        loadInventoryItems();
        loadAchievements();
        loadQuests();
        loadShopItems();
        
        // Oppdater statistikk
        updateStatistics();
        
    } catch (error) {
        console.error('Feil ved initialisering av dashbord:', error.message);
        showNotification('Feil ved lasting av dashbord. Vennligst prøv igjen senere.', 'error');
    }
}

// Funksjon for å oppdatere brukergrensesnittet med brukerdata
function updateUserInterface() {
    if (!userProfile) return;
    
    // Oppdater brukernavn
    usernameElement.textContent = userProfile.username;
    
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
    });
}

// Funksjon for å beregne nivå basert på ferdigheter
function calculateLevel(skills) {
    if (!skills) return 0;
    
    let totalSkillPoints = 0;
    for (const skill in skills) {
        totalSkillPoints += skills[skill];
    }
    
    return Math.floor(totalSkillPoints / 5) + 1;
}

// Funksjon for å håndtere sanntidsoppdateringer av brukerprofil
function handleProfileUpdate(updatedProfile) {
    console.log('Profil oppdatert:', updatedProfile);
    userProfile = updatedProfile;
    updateUserInterface();
    updateStatistics();
    
    // Last inn inventar på nytt når profilen oppdateres
    loadInventoryItems();
}

// Funksjon for å laste inn ferdighetsdata
function loadSkillsData() {
    if (!userProfile || !userProfile.skills) return;
    
    skillsData = userProfile.skills;
    
    // Oppdater UI for ferdigheter
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const skillName = card.dataset.skill;
        const skillLevel = skillsData[skillName] || 0;
        const levelElement = card.querySelector('.skill-level');
        levelElement.textContent = skillLevel;
        
        // Legg til event listeners for knappene
        const increaseButton = card.querySelector('.increase');
        const decreaseButton = card.querySelector('.decrease');
        
        increaseButton.addEventListener('click', () => {
            increaseSkill(skillName);
        });
        
        decreaseButton.addEventListener('click', () => {
            decreaseSkill(skillName);
        });
    });
}

// Funksjon for å øke en ferdighet
async function increaseSkill(skillName) {
    if (!userProfile || userProfile.exp < 1000) {
        showNotification('Ikke nok EXP for å øke ferdigheten', 'warning');
        return;
    }
    
    if (skillsData[skillName] >= MAX_SKILL_LEVEL) {
        showNotification('Ferdigheten er allerede på maksimalt nivå', 'warning');
        return;
    }
    
    try {
        // Oppdater lokalt først for raskere UI-respons
        skillsData[skillName] += 1;
        userProfile.exp -= 1000;
        
        // Oppdater UI
        updateUserInterface();
        
        // Oppdater i databasen
        await updateSkill(currentUser.id, skillName, skillsData[skillName]);
        await updateExp(currentUser.id, userProfile.exp);
        
        showNotification(`${skillName} økt til nivå ${skillsData[skillName]}!`, 'success');
        
        // Sjekk for nye prestasjoner
        checkAchievements();
        
    } catch (error) {
        console.error('Feil ved økning av ferdighet:', error.message);
        showNotification('Feil ved oppdatering av ferdighet', 'error');
        
        // Tilbakestill lokale endringer ved feil
        skillsData[skillName] -= 1;
        userProfile.exp += 1000;
        updateUserInterface();
    }
}

// Funksjon for å redusere en ferdighet
async function decreaseSkill(skillName) {
    if (!userProfile || skillsData[skillName] <= 0) {
        showNotification('Ferdigheten er allerede på minimumsnivå', 'warning');
        return;
    }
    
    try {
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
        checkAchievements();
        
    } catch (error) {
        console.error('Feil ved reduksjon av ferdighet:', error.message);
        showNotification('Feil ved oppdatering av ferdighet', 'error');
        
        // Tilbakestill lokale endringer ved feil
        skillsData[skillName] += 1;
        userProfile.exp -= 1000;
        updateUserInterface();
    }
}

// Funksjon for å laste inn inventar
function loadInventoryItems() {
    console.log('Laster inn inventar...', userProfile);
    
    if (!userProfile) {
        console.log('Ingen brukerprofil funnet');
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
                <i class="fas fa-cube" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                INVENTARET ER TOMT<br>
                <span style="font-size: 14px; opacity: 0.7; margin-top: 10px; display: block;">Kjøp gjenstander i Oasis-butikken eller få tilfeldige gjenstander ved level up!</span>
            </div>
        `;
        return;
    }
    
    // Sjekk om inventory eksisterer i brukerprofilen
    if (!userProfile.inventory) {
        console.log('Ingen inventory funnet i brukerprofilen, initialiserer tom array');
        userProfile.inventory = [];
    }
    
    inventoryItems = userProfile.inventory;
    console.log('Inventar lastet:', inventoryItems);
    
    // Tøm container
    inventoryItemsContainer.innerHTML = '';
    
    if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
        console.log('Tomt inventar eller ikke et array');
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
                <i class="fas fa-cube" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                INVENTARET ER TOMT<br>
                <span style="font-size: 14px; opacity: 0.7; margin-top: 10px; display: block;">Kjøp gjenstander i Oasis-butikken eller få tilfeldige gjenstander ved level up!</span>
            </div>
        `;
        return;
    }
    
    console.log('Legger til', inventoryItems.length, 'gjenstander i inventaret');
    
    // Legg til hvert element i inventaret
    inventoryItems.forEach((item, index) => {
        console.log('Behandler gjenstand:', item);
        
        // Sjekk at gjenstanden har nødvendige felter
        if (!item || !item.name || !item.icon) {
            console.warn('Ugyldig gjenstand funnet:', item);
            return; // Hopp over denne gjenstanden
        }
        
        // Bestem farge basert på sjeldenhetsgrad
        let rarityColor, rarityGlow, rarityName;
        
        switch(item.rarity) {
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
                rarityColor = '#2ecc71';
                rarityGlow = 'rgba(46, 204, 113, 0.5)';
                rarityName = 'UVANLIG';
                break;
            default:
                rarityColor = '#ffffff';
                rarityGlow = 'rgba(255, 255, 255, 0.5)';
                rarityName = 'VANLIG';
        }
        
        // Opprett gjenstandskortet med cyberpunk-stil
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
        iconDiv.textContent = item.icon;
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
        
        // Legg til event listener for å vise detaljer
        itemElement.addEventListener('click', () => {
            showItemDetails(item);
        });
        
        // Legg til innholdet i kortet
        itemElement.appendChild(contentDiv);
        
        // Legg til kortet i containeren
        inventoryItemsContainer.appendChild(itemElement);
    });
    
    console.log('Inventar oppdatert i UI');
}

// Funksjon for å laste inn prestasjoner
function loadAchievements() {
    if (!userProfile || !userProfile.achievements) return;
    
    achievements = userProfile.achievements;
    
    // Tøm container
    achievementsListContainer.innerHTML = '';
    
    if (achievements.length === 0) {
        achievementsListContainer.innerHTML = '<div class="empty-message">Ingen prestasjoner opptjent ennå.</div>';
        return;
    }
    
    // Last inn alle tilgjengelige prestasjoner fra achievements.js
    fetch('../js/achievements.js')
        .then(response => response.text())
        .then(text => {
            // Ekstraher achievements-array fra JavaScript-filen
            const match = text.match(/let\s+achievements\s*=\s*(\[[\s\S]*?\]);/);
            if (match && match[1]) {
                const allAchievements = JSON.parse(match[1].replace(/'/g, '"'));
                
                // Vis alle prestasjoner, marker de som er låst opp
                allAchievements.forEach(achievement => {
                    const isUnlocked = achievements.includes(achievement.name);
                    
                    const achievementCard = document.createElement('div');
                    achievementCard.className = `achievement-card ${isUnlocked ? '' : 'locked'}`;
                    
                    achievementCard.innerHTML = `
                        <div class="achievement-icon"><i class="${achievement.icon || 'fas fa-trophy'}"></i></div>
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                    `;
                    
                    achievementsListContainer.appendChild(achievementCard);
                });
            }
        })
        .catch(error => {
            console.error('Feil ved lasting av prestasjoner:', error);
            achievementsListContainer.innerHTML = '<div class="empty-message">Kunne ikke laste prestasjoner.</div>';
        });
}

// Funksjon for å laste inn oppdrag
function loadQuests() {
    // Last inn alle tilgjengelige oppdrag fra quests.js
    fetch('../js/quests.js')
        .then(response => response.text())
        .then(text => {
            // Ekstraher quests-array fra JavaScript-filen
            const match = text.match(/let\s+quests\s*=\s*(\[[\s\S]*?\]);/);
            if (match && match[1]) {
                const allQuests = JSON.parse(match[1].replace(/'/g, '"'));
                quests = allQuests;
                
                // Tøm containere
                activeQuestsContainer.innerHTML = '';
                availableQuestsContainer.innerHTML = '';
                
                // Filtrer aktive og tilgjengelige oppdrag
                const activeQuests = [];
                const availableQuests = allQuests.slice(0, 5); // Vis bare de første 5 for demo
                
                if (activeQuests.length === 0) {
                    activeQuestsContainer.innerHTML = '<div class="empty-message">Ingen aktive oppdrag.</div>';
                } else {
                    // Vis aktive oppdrag
                    activeQuests.forEach(quest => {
                        const questCard = createQuestCard(quest, true);
                        activeQuestsContainer.appendChild(questCard);
                    });
                }
                
                if (availableQuests.length === 0) {
                    availableQuestsContainer.innerHTML = '<div class="empty-message">Ingen tilgjengelige oppdrag.</div>';
                } else {
                    // Vis tilgjengelige oppdrag
                    availableQuests.forEach(quest => {
                        const questCard = createQuestCard(quest, false);
                        availableQuestsContainer.appendChild(questCard);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Feil ved lasting av oppdrag:', error);
            activeQuestsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste oppdrag.</div>';
            availableQuestsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste oppdrag.</div>';
        });
}

// Funksjon for å opprette et oppdragskort
function createQuestCard(quest, isActive) {
    const questCard = document.createElement('div');
    questCard.className = 'quest-card';
    questCard.dataset.questId = quest.id;
    
    questCard.innerHTML = `
        <div class="quest-title">
            <i class="${quest.icon || 'fas fa-scroll'}"></i>
            ${quest.name}
        </div>
        <div class="quest-description">${quest.description}</div>
        <div class="quest-rewards">
            <div class="quest-reward quest-exp">
                <i class="fas fa-bolt"></i> ${quest.expReward} EXP
            </div>
            <div class="quest-reward quest-credits">
                <i class="fas fa-coins"></i> ${quest.creditReward} Kreditter
            </div>
        </div>
        <button class="cyber-button quest-button">
            ${isActive ? '<i class="fas fa-check"></i> Fullfør' : '<i class="fas fa-plus"></i> Start'}
        </button>
    `;
    
    // Legg til event listener for knappen
    const button = questCard.querySelector('.quest-button');
    button.addEventListener('click', () => {
        if (isActive) {
            completeQuest(quest);
        } else {
            startQuest(quest);
        }
    });
    
    return questCard;
}

// Funksjon for å starte et oppdrag
function startQuest(quest) {
    showNotification(`Startet oppdraget: ${quest.name}`, 'success');
    // Her ville vi normalt oppdatere databasen med det aktive oppdraget
}

// Funksjon for å fullføre et oppdrag
function completeQuest(quest) {
    showNotification(`Fullførte oppdraget: ${quest.name}`, 'success');
    // Her ville vi normalt oppdatere databasen, gi belønninger, osv.
}

// Funksjon for å laste inn butikkvarer
function loadShopItems() {
    console.log('Laster inn butikkvarer...');
    
    // Last inn alle tilgjengelige varer fra shop.js
    fetch('../js/shop.js')
        .then(response => response.text())
        .then(text => {
            // Ekstraher shopItems-array fra JavaScript-filen
            const match = text.match(/let\s+shopItems\s*=\s*(\[[\s\S]*?\]);/);
            if (match && match[1]) {
                try {
                    const allShopItems = JSON.parse(match[1].replace(/'/g, '"'));
                    shopItems = allShopItems;
                    
                    console.log('Butikkvarer lastet:', shopItems);
                    
                    // Tøm container
                    shopItemsContainer.innerHTML = '';
                    
                    if (shopItems.length === 0) {
                        shopItemsContainer.innerHTML = `
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
                                <i class="fas fa-store-slash" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                                BUTIKKEN ER TOM<br>
                                <span style="font-size: 14px; opacity: 0.7; margin-top: 10px; display: block;">Kom tilbake senere for nye varer!</span>
                            </div>
                        `;
                        return;
                    }
                    
                    // Vis de første 12 varene for demo
                    shopItems.slice(0, 12).forEach(item => {
                        // Bestem farge basert på sjeldenhetsgrad
                        let rarityColor, rarityGlow, rarityName;
                        
                        switch(item.rarity) {
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
                                rarityColor = '#2ecc71';
                                rarityGlow = 'rgba(46, 204, 113, 0.5)';
                                rarityName = 'UVANLIG';
                                break;
                            default:
                                rarityColor = '#ffffff';
                                rarityGlow = 'rgba(255, 255, 255, 0.5)';
                                rarityName = 'VANLIG';
                        }
                        
                        // Opprett gjenstandskortet med cyberpunk-stil
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
                        iconDiv.textContent = item.icon;
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
                        
                        // Legg til pris
                        const priceDiv = document.createElement('div');
                        priceDiv.style.cssText = `
                            color: #f1c40f;
                            display: flex;
                            align-items: center;
                            gap: 5px;
                            margin-top: 5px;
                            font-weight: bold;
                        `;
                        priceDiv.innerHTML = `<i class="fas fa-coins"></i> ${item.price}`;
                        contentDiv.appendChild(priceDiv);
                        
                        // Legg til beskrivelse
                        const descDiv = document.createElement('div');
                        descDiv.style.cssText = `
                            font-size: 12px;
                            color: rgba(255, 255, 255, 0.7);
                            margin: 10px 0;
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
                        
                        // Legg til event listener for å vise detaljer
                        itemElement.addEventListener('click', () => {
                            showItemDetails(item, true);
                        });
                        
                        // Legg til innholdet i kortet
                        itemElement.appendChild(contentDiv);
                        
                        // Legg til kortet i containeren
                        shopItemsContainer.appendChild(itemElement);
                    });
                } catch (error) {
                    console.error('Feil ved parsing av butikkvarer:', error);
                    shopItemsContainer.innerHTML = '<div class="empty-message">Feil ved lasting av butikkvarer.</div>';
                }
            } else {
                console.error('Kunne ikke finne shopItems-array i shop.js');
                shopItemsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste butikkvarer.</div>';
            }
        })
        .catch(error => {
            console.error('Feil ved lasting av butikkvarer:', error);
            shopItemsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste butikkvarer.</div>';
        });
}

// Funksjon for å vise detaljer om en gjenstand
function showItemDetails(item, isShopItem = false) {
    console.log('Viser detaljer for gjenstand:', item);
    
    // Bestem farge basert på sjeldenhetsgrad
    let rarityColor, rarityGlow, rarityName;
    
    switch(item.rarity) {
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
            rarityColor = '#2ecc71';
            rarityGlow = 'rgba(46, 204, 113, 0.5)';
            rarityName = 'UVANLIG';
            break;
        default:
            rarityColor = '#ffffff';
            rarityGlow = 'rgba(255, 255, 255, 0.5)';
            rarityName = 'VANLIG';
    }
    
    // Opprett HTML for gjenstandsdetaljer
    itemDetailsContainer.innerHTML = `
        <div style="
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid ${rarityColor};
            border-radius: 10px;
            padding: 20px;
            color: #fff;
            box-shadow: 0 0 15px ${rarityGlow};
            position: relative;
            overflow: hidden;
        ">
            <div style="
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
                z-index: 0;
            "></div>
            
            <div style="position: relative; z-index: 1;">
                <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid ${rarityColor};
                ">
                    <div style="
                        font-size: 48px;
                        margin-right: 20px;
                        text-shadow: 0 0 15px ${rarityGlow};
                    ">${item.icon || '<img src="' + (item.image || '../backpack.png') + '" alt="' + item.name + '" style="width: 64px; height: 64px; object-fit: contain;">'}</div>
                    <div>
                        <h3 style="
                            font-size: 24px;
                            margin: 0 0 5px 0;
                            color: ${rarityColor};
                            text-shadow: 0 0 5px ${rarityGlow};
                        ">${item.name}</h3>
                        <div style="
                            display: inline-block;
                            background: ${rarityColor};
                            color: #000;
                            font-size: 12px;
                            padding: 3px 8px;
                            border-radius: 4px;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            box-shadow: 0 0 5px ${rarityGlow};
                        ">${rarityName}</div>
                        
                        ${item.slot ? `
                        <div style="
                            display: inline-block;
                            background: rgba(0, 255, 255, 0.7);
                            color: #000;
                            font-size: 12px;
                            padding: 3px 8px;
                            border-radius: 4px;
                            font-weight: bold;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
                            margin-left: 5px;
                        ">${item.slot.toUpperCase()}</div>
                        ` : ''}
                    </div>
                </div>
                
                <div style="
                    margin-bottom: 20px;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.5;
                    font-size: 16px;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 5px;
                ">${item.description || 'Ingen beskrivelse tilgjengelig.'}</div>
                
                ${item.stats ? `
                <div style="
                    margin-bottom: 20px;
                    padding: 15px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 8px;
                    border: 1px solid rgba(0, 255, 255, 0.3);
                ">
                    <h4 style="
                        margin: 0 0 10px 0;
                        color: #0ff;
                        font-size: 16px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    ">STATISTIKK</h4>
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                        gap: 10px;
                    ">
                        ${Object.entries(item.stats).map(([stat, value]) => `
                            <div style="
                                display: flex;
                                align-items: center;
                                gap: 5px;
                            ">
                                <span style="color: #fff;">${stat}:</span>
                                <span style="color: ${value > 0 ? '#2ecc71' : '#e74c3c'};">${value > 0 ? '+' + value : value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${isShopItem && item.price ? `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    font-size: 18px;
                ">
                    <span>Pris:</span>
                    <span style="
                        color: #f1c40f;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    ">
                        <i class="fas fa-coins"></i> ${item.price} kreditter
                    </span>
                </div>
                
                <button id="buy-item-button" class="cyber-button" style="
                    background: linear-gradient(135deg, #2ecc71, #27ae60);
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                ">
                    <i class="fas fa-shopping-cart"></i> KJØP GJENSTAND
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    // Legg til event listener for kjøp-knappen hvis den finnes
    const buyButton = document.getElementById('buy-item-button');
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            buyItem(item);
            itemModal.style.display = 'none';
        });
    }
    
    // Vis modal
    itemModal.style.display = 'block';
    
    // Legg til event listener for å lukke modal
    closeModalButton.onclick = function() {
        itemModal.style.display = 'none';
    };
    
    // Lukk modal når brukeren klikker utenfor
    window.onclick = function(event) {
        if (event.target === itemModal) {
            itemModal.style.display = 'none';
        }
    };
}

// Funksjon for å kjøpe en gjenstand
async function buyItem(item) {
    console.log('Forsøker å kjøpe gjenstand:', item);
    
    if (!userProfile || userProfile.credits < item.price) {
        showNotification('Ikke nok kreditter for å kjøpe denne gjenstanden', 'warning');
        return;
    }
    
    try {
        // Oppdater lokalt først for raskere UI-respons
        userProfile.credits -= item.price;
        
        // Legg til i inventar hvis det ikke allerede finnes
        if (!userProfile.inventory) {
            console.log('Initialiserer tom inventory-array');
            userProfile.inventory = [];
        }
        
        // Opprett en ny gjenstand med unik ID
        const newItem = {
            id: Date.now(), // Generer en unik ID
            name: item.name,
            description: item.description,
            icon: item.icon,
            image: item.image,
            rarity: item.rarity || 'common',
            type: item.type || 'Gjenstand',
            slot: item.slot || null,
            stats: item.stats || {}
        };
        
        // Legg til i inventar
        userProfile.inventory.push(newItem);
        
        console.log('Gjenstand lagt til i inventar:', newItem);
        console.log('Oppdatert inventar:', userProfile.inventory);
        
        // Oppdater UI
        updateUserInterface();
        loadInventoryItems();
        
        // Oppdater i databasen
        console.log('Oppdaterer kreditter i Supabase...');
        const { error: creditsError } = await supabase
            .from('profiles')
            .update({ credits: userProfile.credits })
            .eq('id', currentUser.id);
            
        if (creditsError) {
            console.error('Feil ved oppdatering av kreditter:', creditsError);
            throw creditsError;
        }
        
        console.log('Oppdaterer inventar i Supabase...');
        console.log('Inventar som sendes til Supabase:', userProfile.inventory);
        
        const { error: inventoryError } = await supabase
            .from('profiles')
            .update({ inventory: userProfile.inventory })
            .eq('id', currentUser.id);
            
        if (inventoryError) {
            console.error('Feil ved oppdatering av inventar:', inventoryError);
            throw inventoryError;
        }
        
        console.log('Gjenstand kjøpt og lagret i Supabase');
        showNotification(`Kjøpte ${item.name} for ${item.price} kreditter!`, 'success');
        
        // Lukk modal
        itemModal.style.display = 'none';
        
        // Oppdater statistikk
        updateStatistics();
        
    } catch (error) {
        console.error('Feil ved kjøp av gjenstand:', error.message);
        showNotification('Feil ved kjøp av gjenstand', 'error');
        
        // Tilbakestill lokale endringer ved feil
        userProfile.credits += item.price;
        if (userProfile.inventory && userProfile.inventory.length > 0) {
            userProfile.inventory.pop();
        }
        updateUserInterface();
        loadInventoryItems();
    }
}

// Funksjon for å bruke en gjenstand
function useItem(item) {
    showNotification(`Brukte ${item.name}`, 'success');
    // Her ville vi normalt implementere effekten av gjenstanden
    
    // Lukk modal
    itemModal.style.display = 'none';
}

// Funksjon for å sjekke prestasjoner
function checkAchievements() {
    // Dette ville normalt sjekke om brukeren har oppnådd nye prestasjoner
    // basert på deres ferdigheter, fullførte oppdrag, osv.
}

// Funksjon for å oppdatere statistikk
function updateStatistics() {
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
        name: "Testgjenstand",
        description: "En testgjenstand for å sjekke at inventaret fungerer",
        icon: "🧪",
        rarity: "epic",
        type: "Test",
        stats: {
            Intelligens: 2,
            Kreativitet: 1
        }
    };
    
    // Legg til i inventar
    userProfile.inventory.push(testItem);
    
    console.log('Testgjenstand lagt til:', testItem);
    console.log('Oppdatert inventar:', userProfile.inventory);
    
    // Oppdater UI
    updateUserInterface();
    loadInventoryItems();
    
    // Oppdater i databasen
    try {
        console.log('Oppdaterer inventar i Supabase...');
        console.log('Inventar som sendes til Supabase:', userProfile.inventory);
        
        const { error } = await supabase
            .from('profiles')
            .update({ inventory: userProfile.inventory })
            .eq('id', currentUser.id);
        
        if (error) {
            console.error('Feil ved lagring av testgjenstand:', error);
            throw error;
        }
        
        console.log('Testgjenstand lagret i Supabase');
        showNotification('Testgjenstand lagt til i inventaret', 'success');
    } catch (error) {
        console.error('Feil ved lagring av testgjenstand:', error);
        showNotification('Feil ved lagring av testgjenstand', 'error');
        
        // Fjern gjenstanden fra lokalt inventar ved feil
        userProfile.inventory.pop();
        updateUserInterface();
        loadInventoryItems();
    }
}

// Legg til en knapp for å teste inventaret
function addTestButton() {
    console.log('Legger til testknapp...');
    
    // Sjekk om knappen allerede finnes
    if (document.getElementById('test-inventory-button')) {
        return;
    }
    
    // Opprett knappen
    const testButton = document.createElement('button');
    testButton.id = 'test-inventory-button';
    testButton.className = 'cyber-button';
    testButton.innerHTML = '<i class="fas fa-flask"></i> Test Inventar';
    testButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999;
        background: linear-gradient(135deg, #9b59b6, #8e44ad);
        border: none;
        color: white;
        padding: 10px 15px;
        cursor: pointer;
    `;
    
    // Legg til event listener
    testButton.addEventListener('click', () => {
        console.log('Testknapp klikket');
        addTestItem();
    });
    
    // Legg til i DOM
    document.body.appendChild(testButton);
    console.log('Testknapp lagt til');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser dashbordet
    initDashboard();
    
    // Legg til testknapp (kun for utvikling)
    addTestButton();
    
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
            
            if (error) {
                console.error('Feil ved utlogging:', error.message);
                showNotification('Feil ved utlogging: ' + error.message, 'error');
                return;
            }
            
            console.log('Utlogging vellykket');
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
}); 