// Bruk den felles Supabase-klienten
const supabase = window.supabaseHelper.getSupabase();

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

    // Legg til event listeners for navigasjonselementer
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Fjern active class fra alle tabs og nav items
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-content').forEach(tabContent => {
                tabContent.classList.remove('active');
            });
            
            // Legg til active class på valgt tab og nav item
            this.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Spesiell håndtering for butikkfanen
            const dashboardMain = document.querySelector('.dashboard-main');
            if (tabName === 'shop') {
                dashboardMain.classList.add('shop-tab-active');
                // Sett inline styles direkte
                dashboardMain.style.background = 'transparent';
                dashboardMain.style.border = 'none';
                dashboardMain.style.boxShadow = 'none';
                dashboardMain.style.padding = '0';
            } else {
                dashboardMain.classList.remove('shop-tab-active');
                // Fjern inline styles
                dashboardMain.style.background = '';
                dashboardMain.style.border = '';
                dashboardMain.style.boxShadow = '';
                dashboardMain.style.padding = '';
            }
            
            // Oppdater statistikk hvis statistikk-fanen er valgt
            if (tabName === 'stats') {
                updateStatsTab();
            }
            
            // Last inn oppdrag hvis oppdragsfanen er valgt
            if (tabName === 'quests') {
                loadQuests();
            }
        });
    });
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
        
        // Last inn items.js for å få tilgang til alle gjenstandsdetaljer
        await loadItemsDefinitions();
        
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
        
        // Legg til event listeners for plussknappen
        const increaseButton = card.querySelector('.increase');
        
        // Oppdater styling på knappen
        if (increaseButton) {
            increaseButton.style.backgroundColor = skillColor;
            increaseButton.style.borderColor = skillColor;
        }
        
        increaseButton.addEventListener('click', () => {
            increaseSkill(skillName);
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
        
        // Legg til event listener for plussknappen
        const increaseButton = card.querySelector('.increase');
        
        // Oppdater styling på knappen
        if (increaseButton) {
            increaseButton.style.backgroundColor = skillColor;
            increaseButton.style.borderColor = skillColor;
        }
        
        increaseButton.addEventListener('click', () => {
            increaseSkill(skillName);
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
    
    const npcsContainer = document.getElementById('npcs-container');
    if (!npcsContainer) {
        console.error('Kunne ikke finne npcs-container');
        return;
    }
    
    // Vis laster-melding
    npcsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Laster inn NPCer og oppdrag...</p>
        </div>
    `;
    
    // Hent NPCer fra npc.js
    fetch('../js/npc.js')
        .then(response => response.text())
        .then(npcScript => {
            // Bruk regex for å hente ut npcs-arrayen
            const match = npcScript.match(/const\s+npcs\s*=\s*(\[[\s\S]*?\]);/);
            if (match && match[1]) {
                try {
                    // Parse npcs-arrayen
                    const npcsArray = eval(match[1]);
                    console.log('NPCer lastet:', npcsArray.length, 'NPCer');
                    
                    // Hvis ingen NPCer er tilgjengelige, vis melding
                    if (!npcsArray || npcsArray.length === 0) {
                        npcsContainer.innerHTML = `
                            <div class="empty-quests">
                                <i class="fas fa-user-slash"></i>
                                <p>Ingen NPCer er tilgjengelige for øyeblikket.</p>
                            </div>
                        `;
                        return;
                    }
                    
                    // Tøm container
                    npcsContainer.innerHTML = '';
                    
                    // Legg til event listeners for filtrering
                    setupQuestFilters(npcsArray);
                    
                    // Vis alle NPCer og deres oppdrag
                    displayNPCs(npcsArray, npcsContainer);
                    
                    // Abonner på sanntidsoppdateringer for oppdrag
                    subscribeToQuestUpdates();
                    
                } catch (error) {
                    console.error('Feil ved parsing av NPCer:', error);
                    npcsContainer.innerHTML = `
                        <div class="empty-quests">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Feil ved lasting av NPCer.</p>
                        </div>
                    `;
                }
            } else {
                console.error('Kunne ikke finne npcs-array i npc.js');
                npcsContainer.innerHTML = `
                    <div class="empty-quests">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Feil ved lasting av NPCer.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Feil ved lasting av npc.js:', error);
            npcsContainer.innerHTML = `
                <div class="empty-quests">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Feil ved lasting av NPCer.</p>
                </div>
            `;
        });
}

// Funksjon for å sette opp oppdragsfiltre
function setupQuestFilters(npcsArray) {
    console.log('Setter opp oppdragsfiltre');
    
    // Finn alle filterknappene
    const filterButtons = document.querySelectorAll('.quests-filter .filter-button');
    const npcsContainer = document.getElementById('npcs-container');
    
    // Legg til klikk-hendelse for hver filterknapp
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Filter klikket:', button.getAttribute('data-filter'));
            
            // Fjern active-klassen fra alle knapper
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Legg til active-klassen på den klikkede knappen
            button.classList.add('active');
            
            // Filtrer NPCer basert på valgt filter
            const filter = button.getAttribute('data-filter');
            displayNPCs(npcsArray, npcsContainer, filter);
        });
    });
}

// Funksjon for å vise NPCer og deres oppdrag
function displayNPCs(npcsArray, container, filter = 'all') {
    // Tøm container
    container.innerHTML = '';
    
    // Hent brukerens oppdragsstatus
    const questStatus = getUserQuestStatus();
    
    // Vis hver NPC
    npcsArray.forEach(npc => {
        // Filtrer oppdrag basert på valgt filter
        let filteredQuests = npc.quests;
        
        if (filter !== 'all') {
            filteredQuests = npc.quests.filter(quest => {
                const status = getQuestStatus(quest, questStatus);
                return status === filter;
            });
        }
        
        // Hvis NPC ikke har noen oppdrag etter filtrering, ikke vis NPC
        if (filteredQuests.length === 0) {
                                return;
                            }
        
        // Opprett NPC-kort
        const npcElement = createNPCElement(npc, filteredQuests, questStatus);
        container.appendChild(npcElement);
    });
    
    // Hvis ingen NPCer er synlige etter filtrering, vis melding
    if (container.children.length === 0) {
        container.innerHTML = `
            <div class="empty-quests">
                <i class="fas fa-filter"></i>
                <p>Ingen oppdrag funnet med valgt filter.</p>
            </div>
        `;
    }
}

// Funksjon for å opprette et NPC-element
function createNPCElement(npc, quests, questStatus) {
    const npcElement = document.createElement('div');
    npcElement.className = 'npc-card';
    npcElement.setAttribute('data-npc-id', npc.id);
    
    // Opprett NPC-header
    const npcHeader = document.createElement('div');
    npcHeader.className = 'npc-header';
    
    // Legg til NPC-ikon
    const npcIcon = document.createElement('div');
    npcIcon.className = 'npc-icon';
    npcIcon.textContent = npc.icon || '👤';
    npcHeader.appendChild(npcIcon);
    
    // Legg til NPC-info
    const npcInfo = document.createElement('div');
    npcInfo.className = 'npc-info';
    
    const npcName = document.createElement('div');
    npcName.className = 'npc-name';
    npcName.textContent = npc.name;
    npcInfo.appendChild(npcName);
    
    const npcDescription = document.createElement('div');
    npcDescription.className = 'npc-description';
    npcDescription.textContent = npc.description;
    npcInfo.appendChild(npcDescription);
    
    npcHeader.appendChild(npcInfo);
    npcElement.appendChild(npcHeader);
    
    // Opprett NPC-oppdrag
    const npcQuests = document.createElement('div');
    npcQuests.className = 'npc-quests';
    
    // Vis hvert oppdrag
    quests.forEach(quest => {
        const questElement = createQuestElement(quest, npc, questStatus);
        npcQuests.appendChild(questElement);
    });
    
    npcElement.appendChild(npcQuests);
    
    return npcElement;
}

// Funksjon for å opprette et oppdragselement
function createQuestElement(quest, npc, questStatus) {
    console.log("Oppretter quest-element for:", quest.title, "med belønninger:", quest.reward, quest.credits, quest.item);
    
    const questElement = document.createElement('div');
    questElement.className = 'quest-item';
    questElement.setAttribute('data-quest-id', quest.id);
    
    // Bestem oppdragsstatus
    const status = getQuestStatus(quest, questStatus);
    
    // Legg til oppdragstittel
    const questTitle = document.createElement('div');
    questTitle.className = 'quest-title';
    questTitle.innerHTML = `
        <span>${quest.title}</span>
        <span class="quest-status ${status}">${getStatusText(status)}</span>
    `;
    questElement.appendChild(questTitle);
    
    // Legg til oppdragsbeskrivelse
    const questDescription = document.createElement('div');
    questDescription.className = 'quest-description';
    questDescription.textContent = quest.description;
    questElement.appendChild(questDescription);
    
    // Legg til fremgangslinje hvis oppdraget er aktivt
    if (status === 'active') {
        const questProgress = document.createElement('div');
        questProgress.className = 'quest-progress';
        
        const progressText = document.createElement('div');
        progressText.textContent = `Fremgang: ${quest.progress || 0}/${quest.required}`;
        questProgress.appendChild(progressText);
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        const progressPercent = ((quest.progress || 0) / quest.required) * 100;
        progressFill.style.width = `${progressPercent}%`;
        
        progressBar.appendChild(progressFill);
        questProgress.appendChild(progressBar);
        
        questElement.appendChild(questProgress);
    }
    
    // Helt ny implementasjon av belønningsseksjonen
    const rewardsDiv = document.createElement('div');
    rewardsDiv.style.display = 'flex';
    rewardsDiv.style.flexWrap = 'wrap';
    rewardsDiv.style.gap = '10px';
    rewardsDiv.style.marginBottom = '15px';
    rewardsDiv.style.position = 'relative';
    rewardsDiv.style.zIndex = '5';
    
    // XP-belønning
    if (quest.reward) {
        const xpReward = document.createElement('div');
        xpReward.style.display = 'flex';
        xpReward.style.alignItems = 'center';
        xpReward.style.padding = '3px 8px';
        xpReward.style.borderRadius = '5px';
        xpReward.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        xpReward.style.color = '#2ecc71';
        xpReward.style.fontSize = '0.85rem';
        xpReward.innerHTML = `<i class="fas fa-bolt" style="margin-right: 5px;"></i> ${quest.reward} XP`;
        rewardsDiv.appendChild(xpReward);
    }
    
    // Kreditt-belønning
    if (quest.credits) {
        const creditReward = document.createElement('div');
        creditReward.style.display = 'flex';
        creditReward.style.alignItems = 'center';
        creditReward.style.padding = '3px 8px';
        creditReward.style.borderRadius = '5px';
        creditReward.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        creditReward.style.color = '#f1c40f';
        creditReward.style.fontSize = '0.85rem';
        creditReward.innerHTML = `<i class="fas fa-coins" style="margin-right: 5px;"></i> ${quest.credits} kreditter`;
        rewardsDiv.appendChild(creditReward);
    }
    
    // Gjenstandsbelønning
    if (quest.item) {
        const itemReward = document.createElement('div');
        itemReward.style.display = 'flex';
        itemReward.style.alignItems = 'center';
        itemReward.style.padding = '3px 8px';
        itemReward.style.borderRadius = '5px';
        itemReward.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        itemReward.style.color = '#9b59b6';
        itemReward.style.fontSize = '0.85rem';
        itemReward.innerHTML = `<i class="fas fa-cube" style="margin-right: 5px;"></i> ${quest.item}`;
        rewardsDiv.appendChild(itemReward);
    }
    
    questElement.appendChild(rewardsDiv);
    
    // Legg til handlingsknapp
    const questActions = document.createElement('div');
    questActions.className = 'quest-actions';
    questActions.style.display = 'flex';
    questActions.style.justifyContent = 'flex-end';
    
    const questAction = document.createElement('button');
    questAction.className = 'quest-action';
    
    if (status === 'available') {
        questAction.textContent = 'Start oppdrag';
        questAction.addEventListener('click', () => {
            startQuest(npc.id, quest.id);
        });
    } else if (status === 'active') {
        questAction.textContent = 'Vis detaljer';
        questAction.addEventListener('click', () => {
            showQuestDetails(npc, quest);
        });
    } else if (status === 'completed') {
        questAction.textContent = 'Fullført';
        questAction.disabled = true;
    }
    
    questActions.appendChild(questAction);
    questElement.appendChild(questActions);
    
    return questElement;
}

// Funksjon for å hente oppdragsstatus
function getQuestStatus(quest, questStatus) {
    if (!questStatus) return 'available';
    
    const questId = quest.id;
    
    if (questStatus.completed && questStatus.completed.includes(questId)) {
        return 'completed';
    } else if (questStatus.active && questStatus.active.includes(questId)) {
        return 'active';
            } else {
        return 'available';
    }
}

// Funksjon for å hente statustekst
function getStatusText(status) {
    switch (status) {
        case 'active': return 'AKTIV';
        case 'completed': return 'FULLFØRT';
        case 'available': return 'TILGJENGELIG';
        default: return '';
    }
}

// Funksjon for å hente brukerens oppdragsstatus
function getUserQuestStatus() {
    if (!userProfile) return null;
    
    return {
        active: userProfile.activeQuests || [],
        completed: userProfile.completedQuests || []
    };
}

// Funksjon for å starte et oppdrag
function startQuest(npcId, questId) {
    console.log(`Starter oppdrag ${questId} fra NPC ${npcId}`);
    
    if (!userProfile || !currentUser) {
        showNotification('Du må være logget inn for å starte oppdrag', 'error');
        return;
    }
    
    // Oppdater lokalt
    if (!userProfile.activeQuests) {
        userProfile.activeQuests = [];
    }
    
    // Sjekk om oppdraget allerede er aktivt
    if (userProfile.activeQuests.includes(questId)) {
        showNotification('Dette oppdraget er allerede aktivt', 'warning');
        return;
    }
    
    // Legg til oppdraget i aktive oppdrag
    userProfile.activeQuests.push(questId);
    
    // Oppdater i databasen
    updateActiveQuests(currentUser.id, userProfile.activeQuests)
        .then(() => {
            showNotification('Oppdrag startet!', 'success');
            
            // Last inn oppdrag på nytt
            loadQuests();
        })
        .catch(error => {
            console.error('Feil ved start av oppdrag:', error);
            showNotification('Feil ved start av oppdrag', 'error');
            
            // Fjern oppdraget fra aktive oppdrag lokalt
            userProfile.activeQuests = userProfile.activeQuests.filter(id => id !== questId);
        });
}

// Funksjon for å oppdatere aktive oppdrag i databasen
async function updateActiveQuests(userId, activeQuests) {
    console.log(`Oppdaterer aktive oppdrag for bruker ${userId}`);
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ activeQuests: activeQuests })
            .eq('id', userId);
        
        if (error) throw error;
        
        console.log('Aktive oppdrag oppdatert');
        return { success: true };
    } catch (error) {
        console.error('Feil ved oppdatering av aktive oppdrag:', error.message);
        return { success: false, error: error.message };
    }
}

// Funksjon for å vise oppdragsdetaljer
function showQuestDetails(npc, quest) {
    console.log(`Viser detaljer for oppdrag ${quest.id} fra NPC ${npc.id}`);
    
    // Dette kan implementeres senere, f.eks. med en modal
    // som viser mer detaljert informasjon om oppdraget
    
    // For nå, bare vis en notifikasjon
    showNotification(`Oppdrag: ${quest.title} - ${quest.description}`, 'info');
}

// Funksjon for å abonnere på sanntidsoppdateringer for oppdrag
function subscribeToQuestUpdates() {
    if (!currentUser) return;
    
    // Abonner på sanntidsoppdateringer for brukerprofilen
    const channel = supabase
        .channel('quest-updates')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${currentUser.id}`
        }, (payload) => {
            console.log('Profil oppdatert med nye oppdragsdata:', payload);
            
            // Oppdater userProfile med nye data
            const newData = payload.new;
            
            // Oppdater oppdragsrelaterte felt
            userProfile.activeQuests = newData.activeQuests || [];
            userProfile.completedQuests = newData.completedQuests || [];
            
            // Last inn oppdrag på nytt
            loadQuests();
            
            showNotification('Oppdragsstatus oppdatert', 'success');
        })
        .subscribe();
}

// Funksjon for å laste inn butikkvarer
function loadShopItems() {
    console.log('Laster inn butikkvarer...');
    
    // Tøm containere
    const shopItemsContainer = document.getElementById('shop-items');
    const shopRecommendedContainer = document.getElementById('shop-recommended');
    
    if (!shopItemsContainer || !shopRecommendedContainer) {
        console.error('Kunne ikke finne butikk-containere');
        return;
    }
    
    shopItemsContainer.innerHTML = '';
    shopRecommendedContainer.innerHTML = '';
    
    // Vis laster-melding
    shopItemsContainer.innerHTML = `
        <div class="shop-empty">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Laster butikkvarer...</p>
        </div>
    `;
    
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
                        shopItemsContainer.innerHTML = `
                            <div class="shop-empty">
                                <i class="fas fa-store-slash"></i>
                                <p>Ingen varer er tilgjengelige for øyeblikket.</p>
                            </div>
                        `;
        return;
    }
    
                    // Tøm containere
                    shopItemsContainer.innerHTML = '';
                    shopRecommendedContainer.innerHTML = '';
                    
                    // Legg til event listeners for kategorier
                    setupShopCategories(shopItemsArray);
                    
                    // Legg til event listener for søk
                    setupShopSearch(shopItemsArray);
                    
                    // Vis anbefalte varer (populære og nye)
                    displayRecommendedItems(shopItemsArray, shopRecommendedContainer);
                    
                    // Vis alle varer
                    displayShopItems(shopItemsArray, shopItemsContainer);
                    
                } catch (error) {
                    console.error('Feil ved parsing av butikkvarer:', error);
                    shopItemsContainer.innerHTML = `
                        <div class="shop-empty">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Feil ved lasting av butikkvarer.</p>
                        </div>
                    `;
                }
            } else {
                console.error('Kunne ikke finne shopItems-array i shop.js');
                shopItemsContainer.innerHTML = `
                    <div class="shop-empty">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Feil ved lasting av butikkvarer.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Feil ved lasting av shop.js:', error);
            shopItemsContainer.innerHTML = `
                <div class="shop-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Feil ved lasting av butikkvarer.</p>
                </div>
            `;
        });
}

// Funksjon for å sette opp kategori-filtrering
function setupShopCategories(items) {
    const categories = document.querySelectorAll('.shop-category');
    const shopItemsContainer = document.getElementById('shop-items');
    
    categories.forEach(category => {
        category.addEventListener('click', () => {
            // Fjern active-klassen fra alle kategorier
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Legg til active-klassen på valgt kategori
            category.classList.add('active');
            
            // Filtrer varer basert på valgt kategori
            const selectedCategory = category.getAttribute('data-category');
            
            if (selectedCategory === 'all') {
                displayShopItems(items, shopItemsContainer);
            } else {
                const filteredItems = items.filter(item => item.category === selectedCategory);
                displayShopItems(filteredItems, shopItemsContainer);
            }
        });
    });
}

// Funksjon for å sette opp søkefunksjonalitet
function setupShopSearch(items) {
    const searchInput = document.getElementById('shop-search-input');
    const shopItemsContainer = document.getElementById('shop-items');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Vis alle varer hvis søkefeltet er tomt
            const activeCategory = document.querySelector('.shop-category.active');
            const categoryFilter = activeCategory.getAttribute('data-category');
            
            if (categoryFilter === 'all') {
                displayShopItems(items, shopItemsContainer);
            } else {
                const filteredItems = items.filter(item => item.category === categoryFilter);
                displayShopItems(filteredItems, shopItemsContainer);
            }
        } else {
            // Filtrer varer basert på søkeord
            const filteredItems = items.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
            
            displayShopItems(filteredItems, shopItemsContainer);
        }
    });
}

// Funksjon for å vise anbefalte varer
function displayRecommendedItems(items, container) {
    // Filtrer ut populære og nye varer
    const recommendedItems = items.filter(item => 
        item.tags && (item.tags.includes('popular') || item.tags.includes('new'))
    );
    
    if (recommendedItems.length === 0) {
        // Skjul anbefalte-seksjonen hvis det ikke er noen anbefalte varer
        const recommendedSection = container.closest('.shop-section');
        if (recommendedSection) {
            recommendedSection.style.display = 'none';
        }
        return;
    }
    
    // Vis anbefalte varer
    recommendedItems.forEach(item => {
        const itemElement = createShopItemElement(item);
        container.appendChild(itemElement);
    });
}

// Funksjon for å vise butikkvarer
function displayShopItems(items, container) {
    // Tøm container
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="shop-empty">
                <i class="fas fa-search"></i>
                <p>Ingen varer funnet.</p>
            </div>
        `;
        return;
    }
    
    // Vis varer
    items.forEach(item => {
        const itemElement = createShopItemElement(item);
        container.appendChild(itemElement);
    });
}

// Funksjon for å opprette et butikkvare-element
function createShopItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'shop-item';
    itemElement.setAttribute('data-item-id', item.id);
    
    // Legg til tag hvis varen er ny eller populær
    if (item.tags && item.tags.length > 0) {
        const tag = item.tags[0]; // Bruk første tag
        const tagElement = document.createElement('div');
        tagElement.className = `shop-item-tag ${tag}`;
        tagElement.textContent = tag === 'new' ? 'NY!' : tag === 'popular' ? 'POPULÆR' : tag.toUpperCase();
        itemElement.appendChild(tagElement);
    }
    
    // Legg til ikon
    const iconElement = document.createElement('div');
    iconElement.className = 'shop-item-icon';
    iconElement.textContent = item.icon;
    itemElement.appendChild(iconElement);
    
    // Legg til navn
    const nameElement = document.createElement('div');
    nameElement.className = 'shop-item-name';
    nameElement.textContent = item.name;
    itemElement.appendChild(nameElement);
    
    // Legg til beskrivelse
    const descElement = document.createElement('div');
    descElement.className = 'shop-item-description';
    descElement.textContent = item.description;
    itemElement.appendChild(descElement);
    
    // Legg til pris
    const priceElement = document.createElement('div');
    priceElement.className = 'shop-item-price';
    priceElement.innerHTML = `<i class="fas fa-coins"></i> ${item.price}`;
    itemElement.appendChild(priceElement);
    
    // Legg til kjøp-knapp
    const buyButton = document.createElement('button');
    buyButton.className = 'shop-item-buy';
    buyButton.textContent = 'KJØP';
    buyButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Hindre at klikk på knappen også trigger klikk på varen
        buyShopItem(item);
    });
    itemElement.appendChild(buyButton);
    
    // Legg til klikk-hendelse for å vise detaljer
    itemElement.addEventListener('click', () => {
        showItemDetails(item);
    });
    
    return itemElement;
}

// Funksjon for å vise detaljer om en vare
function showItemDetails(item) {
    console.log('Viser detaljer for:', item.name);
    
    // Finn modal-elementet
    const modal = document.getElementById('item-modal');
    if (!modal) {
        console.error('Fant ikke modal-elementet');
        return;
    }
    
    // Oppdater modal-innholdet
    const iconElement = modal.querySelector('.item-detail-icon i');
    if (iconElement) {
        iconElement.className = item.icon || 'fas fa-cube';
    }
    
    const titleElement = modal.querySelector('.item-detail-title h3');
    if (titleElement) {
        titleElement.textContent = item.name || 'Ukjent gjenstand';
    }
    
    const rarityElement = modal.querySelector('.item-detail-rarity');
    if (rarityElement) {
        rarityElement.textContent = item.rarity || 'Vanlig';
        
        // Sett farge basert på sjeldenhet
        switch (item.rarity) {
            case 'legendary':
                rarityElement.style.color = '#ff9900';
                break;
            case 'epic':
                rarityElement.style.color = '#a335ee';
                break;
            case 'rare':
                rarityElement.style.color = '#0070dd';
                break;
            case 'uncommon':
                rarityElement.style.color = '#1eff00';
                break;
            default:
                rarityElement.style.color = '#ffffff';
                break;
        }
    }
    
    const descriptionElement = modal.querySelector('.item-detail-description');
    if (descriptionElement) {
        descriptionElement.textContent = item.description || 'Ingen beskrivelse tilgjengelig';
    }
    
    const typeElement = modal.querySelector('.item-detail-type');
    if (typeElement) {
        typeElement.textContent = item.type || 'Ukjent type';
    }
    
    const priceElement = modal.querySelector('.item-detail-price');
    if (priceElement) {
        priceElement.innerHTML = `${item.price || 0} <i class="fas fa-coins"></i>`;
    }
    
    const effectElement = modal.querySelector('.item-detail-effect');
    if (effectElement) {
        effectElement.textContent = item.effect || 'Ingen effekt';
    }
    
    const buyButton = modal.querySelector('#detail-buy-button');
    if (buyButton) {
        // Oppdater pris i kjøp-knappen
        const priceButtonElement = buyButton.querySelector('.item-detail-price-button');
        if (priceButtonElement) {
            priceButtonElement.textContent = item.price || 0;
        }
        
        // Fjern eventuelle eksisterende event listeners
        const newButton = buyButton.cloneNode(true);
        buyButton.parentNode.replaceChild(newButton, buyButton);
        
        // Legg til ny event listener
        newButton.addEventListener('click', () => {
            buyShopItem(item);
            modal.style.display = 'none';
        });
    }
    
    // Vis modalen
    modal.style.display = 'block';
    
    // Legg til event listener for å lukke modalen
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Lukk modalen når brukeren klikker utenfor
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Funksjon for å kjøpe en vare
async function buyShopItem(item) {
    console.log('Kjøper:', item.name);
    
    // Sjekk om brukeren er logget inn
    if (!userProfile || !currentUser) {
        showNotification('Du må være logget inn for å kjøpe gjenstander', 'error');
        return;
    }
    
    // Sjekk om brukeren har nok kreditter
    if (userProfile.credits < item.price) {
        showNotification('Du har ikke nok kreditter til å kjøpe denne gjenstanden', 'error');
        return;
    }
    
    try {
        // Oppdater lokalt først for raskere UI-respons
        userProfile.credits -= item.price;
        
        // Legg til gjenstanden i inventaret hvis den ikke allerede finnes
        if (!userProfile.inventory) {
            userProfile.inventory = [];
        }
        
        // Sjekk om brukeren allerede har gjenstanden
        const existingItem = userProfile.inventory.find(invItem => invItem.id === item.id);
        if (existingItem) {
            // Hvis gjenstanden allerede finnes, øk antallet
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            // Hvis ikke, legg til gjenstanden med antall 1
            userProfile.inventory.push({
                ...item,
                quantity: 1,
                purchasedAt: new Date().toISOString()
            });
        }
        
        // Oppdater UI
        updateUserInterface();
        
        // Oppdater i databasen
        await updateInventory(currentUser.id, userProfile.inventory);
        await updateCredits(currentUser.id, userProfile.credits);
        
        // Vis bekreftelse
        showNotification(`Du har kjøpt ${item.name} for ${item.price} kreditter!`, 'success');
        
        // Oppdater inventaret
        loadInventoryItems();
        
    } catch (error) {
        console.error('Feil ved kjøp av gjenstand:', error.message);
        showNotification('Feil ved kjøp av gjenstand', 'error');
        
        // Tilbakestill lokale endringer ved feil
        userProfile.credits += item.price;
        // Fjern gjenstanden fra inventaret igjen
        if (userProfile.inventory) {
            const existingItem = userProfile.inventory.find(invItem => invItem.id === item.id);
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                userProfile.inventory = userProfile.inventory.filter(invItem => invItem.id !== item.id);
            }
        }
        updateUserInterface();
    }
}

// Funksjon for å oppdatere inventaret i databasen
async function updateInventory(userId, inventory) {
    console.log('Oppdaterer inventar for bruker', userId);
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ inventory: inventory })
            .eq('id', userId);
        
        if (error) throw error;
        
        console.log('Inventar oppdatert');
        return true;
    } catch (error) {
        console.error('Feil ved oppdatering av inventar:', error.message);
        throw error;
    }
}

// Funksjon for å oppdatere kreditter i databasen
async function updateCredits(userId, credits) {
    console.log('Oppdaterer kreditter for bruker', userId);
    
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ credits: credits })
            .eq('id', userId);
        
        if (error) throw error;
        
        console.log('Kreditter oppdatert');
        return true;
    } catch (error) {
        console.error('Feil ved oppdatering av kreditter:', error.message);
        throw error;
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
    
    // Berik inventory-objektene med data fra items.js hvis tilgjengelig
    const enrichedInventory = userProfile.inventory.map(inventoryItem => {
        // Sjekk om vi har items.js-data tilgjengelig
        if (typeof window.items !== 'undefined' && Array.isArray(window.items)) {
            const itemId = typeof inventoryItem === 'object' ? inventoryItem.id : inventoryItem;
            const quantity = typeof inventoryItem === 'object' ? (inventoryItem.quantity || 1) : 1;
            
            // Finn gjenstanden i items.js
            const itemData = window.items.find(item => item.id == itemId);
            
            if (itemData) {
                // Berik inventory-objektet med data fra items.js
                return {
                    ...inventoryItem,
                    name: itemData.name,
                    description: itemData.description,
                    icon: itemData.icon,
                    rarity: itemData.rarity,
                    type: itemData.type || 'unknown'
                };
            }
        }
        
        // Returner originalt objekt hvis vi ikke fant noe i items.js
        return inventoryItem;
    });
    
    // Oppdater userProfile med beriket inventory
    userProfile.inventory = enrichedInventory;
    
    // Vis hver gjenstand i inventaret
    userProfile.inventory.forEach(item => {
        console.log('Behandler gjenstand:', item);
        
        // Sjekk at gjenstanden har nødvendige felter
        if (!item || !item.id) {
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

// Oppdater statistikk når siden lastes
document.addEventListener('DOMContentLoaded', function() {
    // Sjekk om brukeren er på statistikk-fanen
    const activeTab = document.querySelector('.nav-item.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'stats') {
        updateStatsTab();
    }
    
    // Sjekk om brukeren er på butikkfanen og legg til klassen
    if (activeTab && activeTab.getAttribute('data-tab') === 'shop') {
        document.querySelector('.dashboard-main').classList.add('shop-tab-active');
    }
    
    // Sjekk om brukeren er på oppdragsfanen og last inn oppdrag
    if (activeTab && activeTab.getAttribute('data-tab') === 'quests') {
        loadQuests();
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

// Funksjon for å laste inn items.js
async function loadItemsDefinitions() {
    // Sjekk om items allerede er lastet inn
    if (typeof window.items !== 'undefined' && Array.isArray(window.items)) {
        console.log('items.js er allerede lastet inn med', window.items.length, 'gjenstander');
        return;
    }
    
    try {
        console.log('Laster inn items.js...');
        // Hent items.js-filen
        const response = await fetch('../js/items.js');
        if (!response.ok) {
            throw new Error(`Kunne ikke laste items.js: ${response.status} ${response.statusText}`);
        }
        
        const itemsScript = await response.text();
        
        // Bruk regex for å hente ut items-arrayen
        const match = itemsScript.match(/const\s+items\s*=\s*(\[[\s\S]*?\]);/);
        if (!match || !match[1]) {
            throw new Error('Kunne ikke finne items-array i items.js');
        }
        
        // Parse items-arrayen
        window.items = eval(match[1]);
        console.log('items.js lastet inn med', window.items.length, 'gjenstander');
    } catch (error) {
        console.error('Feil ved lasting av items.js:', error);
    }
} 