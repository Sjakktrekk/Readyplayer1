// Dashboard Achievements
// Denne filen håndterer prestasjoner i dashbordet og kobler dem til achievements på hovedsiden

// Importerer achievements-array fra achievements.js
// Merk: achievements-array må være tilgjengelig globalt

// Globale variabler
let achievementsContainer;
let showOnlyUnlocked = false;
let toggleButton;

// Funksjon for å laste inn prestasjoner
async function loadAchievements() {
    console.log('Laster inn prestasjoner...');
    
    // Hent DOM-elementer
    achievementsContainer = document.getElementById('achievements-container');
    
    if (!achievementsContainer) {
        console.error('Fant ikke achievements-container');
        return;
    }
    
    try {
        // Hent alle prestasjoner
        const { success, data: allAchievements, error } = await window.databaseService.achievement.getAllAchievements();
        
        if (!success || !allAchievements) {
            throw new Error(error || 'Kunne ikke hente prestasjoner');
        }
        
        console.log('Hentet prestasjoner:', allAchievements);
        
        // Opprett toggle-knapp hvis den ikke finnes
        createToggleButton();
        
        // Vis prestasjoner
        displayAchievements(allAchievements);
    } catch (error) {
        console.error('Feil ved lasting av prestasjoner:', error);
        window.dashboardBase.showNotification('Feil ved lasting av prestasjoner. Prøv igjen senere.', 'error');
        
        // Vis feilmelding i container
        if (achievementsContainer) {
            achievementsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Kunne ikke laste inn prestasjoner. Prøv igjen senere.</p>
                </div>
            `;
        }
    }
}

// Funksjon for å opprette toggle-knapp
function createToggleButton() {
    // Sjekk om knappen allerede finnes
    const existingButton = document.getElementById('toggle-achievements-button');
    if (existingButton) {
        toggleButton = existingButton;
        return;
    }
    
    // Opprett knapp
    toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-achievements-button';
    toggleButton.className = 'toggle-button';
    toggleButton.innerHTML = `
        <i class="fas fa-filter"></i>
        <span>Vis kun låst opp</span>
    `;
    
    // Legg til event listener
    toggleButton.addEventListener('click', () => {
        showOnlyUnlocked = !showOnlyUnlocked;
        toggleButton.querySelector('span').textContent = showOnlyUnlocked ? 'Vis alle' : 'Vis kun låst opp';
        
        // Last inn prestasjoner på nytt
        loadAchievements();
    });
    
    // Legg til knappen i DOM
    const achievementsTab = document.getElementById('achievements-tab');
    if (achievementsTab) {
        const tabHeader = achievementsTab.querySelector('.tab-header');
        if (tabHeader) {
            tabHeader.appendChild(toggleButton);
        }
    }
}

// Funksjon for å vise prestasjoner
function displayAchievements(achievements) {
    if (!achievementsContainer || !achievements) return;
    
    // Tøm container
    achievementsContainer.innerHTML = '';
    
    // Hent brukerens låste opp prestasjoner
    const unlockedAchievements = window.userProfile?.achievements || [];
    
    // Filtrer prestasjoner basert på toggle-status
    let filteredAchievements = achievements;
    if (showOnlyUnlocked) {
        filteredAchievements = achievements.filter(achievement => 
            unlockedAchievements.includes(achievement.id)
        );
    }
    
    // Sjekk om det er noen prestasjoner å vise
    if (filteredAchievements.length === 0) {
        achievementsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <p>${showOnlyUnlocked ? 'Du har ikke låst opp noen prestasjoner ennå.' : 'Ingen prestasjoner funnet.'}</p>
            </div>
        `;
        return;
    }
    
    // Grupper prestasjoner etter ferdighet
    const achievementsBySkill = {};
    
    filteredAchievements.forEach(achievement => {
        const skill = achievement.skill || 'general';
        
        if (!achievementsBySkill[skill]) {
            achievementsBySkill[skill] = [];
        }
        
        achievementsBySkill[skill].push(achievement);
    });
    
    // Opprett seksjoner for hver ferdighet
    for (const [skill, skillAchievements] of Object.entries(achievementsBySkill)) {
        // Opprett seksjon
        const section = document.createElement('div');
        section.className = 'achievements-section';
        
        // Opprett overskrift
        const header = document.createElement('h3');
        header.className = 'section-header';
        header.textContent = capitalizeFirstLetter(skill);
        section.appendChild(header);
        
        // Opprett container for prestasjoner
        const achievementsGrid = document.createElement('div');
        achievementsGrid.className = 'achievements-grid';
        
        // Legg til prestasjoner
        skillAchievements.forEach(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const achievementElement = createAchievementElement(achievement, isUnlocked);
            achievementsGrid.appendChild(achievementElement);
        });
        
        // Legg til grid i seksjon
        section.appendChild(achievementsGrid);
        
        // Legg til seksjon i container
        achievementsContainer.appendChild(section);
    }
}

// Funksjon for å opprette prestasjonselement
function createAchievementElement(achievement, isUnlocked) {
    const element = document.createElement('div');
    element.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;
    element.setAttribute('data-id', achievement.id);
    
    // Bestem ikon basert på type
    let icon = 'fas fa-trophy';
    if (achievement.type === 'skill') {
        icon = 'fas fa-graduation-cap';
    } else if (achievement.type === 'exploration') {
        icon = 'fas fa-map-marked-alt';
    } else if (achievement.type === 'collection') {
        icon = 'fas fa-gem';
    } else if (achievement.type === 'social') {
        icon = 'fas fa-users';
    }
    
    // Bestem farge basert på sjeldenhetsgrad
    let rarityClass = '';
    if (achievement.rarity === 'common') {
        rarityClass = 'common';
    } else if (achievement.rarity === 'uncommon') {
        rarityClass = 'uncommon';
    } else if (achievement.rarity === 'rare') {
        rarityClass = 'rare';
    } else if (achievement.rarity === 'epic') {
        rarityClass = 'epic';
    } else if (achievement.rarity === 'legendary') {
        rarityClass = 'legendary';
    }
    
    // Sett innhold
    element.innerHTML = `
        <div class="achievement-icon ${rarityClass}">
            <i class="${icon}"></i>
        </div>
        <div class="achievement-info">
            <h4 class="achievement-name">${achievement.name}</h4>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-reward">
                <span class="reward-label">Belønning:</span>
                <span class="reward-value">${achievement.reward_type === 'exp' ? `${achievement.reward_value} EXP` : `${achievement.reward_value} kreditter`}</span>
            </div>
        </div>
        <div class="achievement-status">
            <span class="status-indicator ${isUnlocked ? 'unlocked' : 'locked'}">
                <i class="${isUnlocked ? 'fas fa-check-circle' : 'fas fa-lock'}"></i>
                <span>${isUnlocked ? 'Låst opp' : 'Låst'}</span>
            </span>
        </div>
    `;
    
    // Legg til event listener for å vise detaljer
    element.addEventListener('click', () => {
        showAchievementDetails(achievement, isUnlocked);
    });
    
    return element;
}

// Funksjon for å vise prestasjonsdetaljer
function showAchievementDetails(achievement, isUnlocked) {
    // Opprett modal
    const modal = document.createElement('div');
    modal.className = 'modal achievement-modal';
    modal.id = 'achievement-modal';
    
    // Bestem ikon basert på type
    let icon = 'fas fa-trophy';
    if (achievement.type === 'skill') {
        icon = 'fas fa-graduation-cap';
    } else if (achievement.type === 'exploration') {
        icon = 'fas fa-map-marked-alt';
    } else if (achievement.type === 'collection') {
        icon = 'fas fa-gem';
    } else if (achievement.type === 'social') {
        icon = 'fas fa-users';
    }
    
    // Bestem farge basert på sjeldenhetsgrad
    let rarityClass = '';
    let rarityText = 'Vanlig';
    
    if (achievement.rarity === 'common') {
        rarityClass = 'common';
        rarityText = 'Vanlig';
    } else if (achievement.rarity === 'uncommon') {
        rarityClass = 'uncommon';
        rarityText = 'Uvanlig';
    } else if (achievement.rarity === 'rare') {
        rarityClass = 'rare';
        rarityText = 'Sjelden';
    } else if (achievement.rarity === 'epic') {
        rarityClass = 'epic';
        rarityText = 'Episk';
    } else if (achievement.rarity === 'legendary') {
        rarityClass = 'legendary';
        rarityText = 'Legendarisk';
    }
    
    // Sett innhold
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${achievement.name}</h2>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="achievement-details">
                    <div class="achievement-icon-large ${rarityClass}">
                        <i class="${icon}"></i>
                    </div>
                    <div class="achievement-info-detailed">
                        <p class="achievement-description-detailed">${achievement.description}</p>
                        <div class="achievement-metadata">
                            <div class="metadata-item">
                                <span class="metadata-label">Type:</span>
                                <span class="metadata-value">${capitalizeFirstLetter(achievement.type || 'Generell')}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="metadata-label">Sjeldenhetsgrad:</span>
                                <span class="metadata-value ${rarityClass}">${rarityText}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="metadata-label">Ferdighet:</span>
                                <span class="metadata-value">${capitalizeFirstLetter(achievement.skill || 'Generell')}</span>
                            </div>
                            <div class="metadata-item">
                                <span class="metadata-label">Status:</span>
                                <span class="metadata-value status-${isUnlocked ? 'unlocked' : 'locked'}">
                                    <i class="${isUnlocked ? 'fas fa-check-circle' : 'fas fa-lock'}"></i>
                                    ${isUnlocked ? 'Låst opp' : 'Låst'}
                                </span>
                            </div>
                        </div>
                        <div class="achievement-reward-detailed">
                            <h4>Belønning</h4>
                            <div class="reward-item">
                                <i class="${achievement.reward_type === 'exp' ? 'fas fa-star' : 'fas fa-coins'}"></i>
                                <span>${achievement.reward_type === 'exp' ? `${achievement.reward_value} EXP` : `${achievement.reward_value} kreditter`}</span>
                            </div>
                        </div>
                    </div>
                </div>
                ${!isUnlocked ? `
                <div class="achievement-criteria">
                    <h4>Kriterier for å låse opp</h4>
                    <p>${achievement.criteria || 'Fullføre spesifikke oppgaver i OASIS.'}</p>
                </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="close-modal-button">Lukk</button>
            </div>
        </div>
    `;
    
    // Legg til modal i DOM
    document.body.appendChild(modal);
    
    // Legg til event listeners for å lukke modal
    const closeButton = modal.querySelector('.close-button');
    const closeModalButton = modal.querySelector('.close-modal-button');
    
    closeButton.addEventListener('click', () => {
        modal.remove();
    });
    
    closeModalButton.addEventListener('click', () => {
        modal.remove();
    });
    
    // Lukk modal når man klikker utenfor
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// Hjelpefunksjon for å gjøre første bokstav stor
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Eksporter funksjoner
window.achievementsModule = {
    loadAchievements,
    displayAchievements,
    showAchievementDetails
}; 