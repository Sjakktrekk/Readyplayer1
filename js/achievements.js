// Prestasjonsdata
let achievements = [];

// Funksjon for å laste inn prestasjoner fra databasen
async function loadAchievementsFromDatabase() {
    try {
        const { success, data, error } = await window.databaseService.achievement.getAllAchievements();
        
        if (!success || !data) {
            console.error('Feil ved lasting av prestasjoner:', error);
            return false;
        }
        
        achievements = data;
        console.log('Prestasjoner lastet fra databasen:', achievements);
        return true;
    } catch (error) {
        console.error('Feil ved lasting av prestasjoner:', error);
        return false;
    }
}

// Funksjon for å sjekke om en prestasjon er låst opp
function isAchievementUnlocked(achievementId, userProfile) {
    if (!userProfile || !userProfile.achievements) return false;
    return userProfile.achievements.includes(achievementId);
}

// Funksjon for å låse opp en prestasjon
async function unlockAchievement(achievementId, userId) {
    try {
        // Hent brukerprofil
        const userProfile = await window.databaseService.user.getUserProfile(userId);
        
        if (!userProfile) {
            console.error('Kunne ikke hente brukerprofil');
            return false;
        }
        
        // Sjekk om prestasjonen allerede er låst opp
        if (isAchievementUnlocked(achievementId, userProfile)) {
            console.log('Prestasjon allerede låst opp:', achievementId);
            return true;
        }
        
        // Hent prestasjonsinformasjon
        const { success, data: achievement, error } = await window.databaseService.achievement.getAchievementById(achievementId);
        
        if (!success || !achievement) {
            console.error('Kunne ikke hente prestasjonsinformasjon:', error);
            return false;
        }
        
        // Oppdater brukerens prestasjoner
        const updatedAchievements = [...(userProfile.achievements || []), achievementId];
        
        const { success: updateSuccess, error: updateError } = await window.databaseService.user.updateAchievements(userId, updatedAchievements);
        
        if (!updateSuccess) {
            console.error('Feil ved oppdatering av prestasjoner:', updateError);
            return false;
        }
        
        // Gi belønning til brukeren
        if (achievement.reward_type === 'exp') {
            // Oppdater brukerens EXP
            const newExp = (userProfile.exp || 0) + achievement.reward_value;
            await window.databaseService.user.updateExp(userId, newExp);
        } else if (achievement.reward_type === 'credits') {
            // Oppdater brukerens kreditter
            const newCredits = (userProfile.credits || 0) + achievement.reward_value;
            await window.databaseService.user.updateCredits(userId, newCredits);
        }
        
        // Vis popup
        showAchievementPopup(achievement);
        
        console.log('Prestasjon låst opp:', achievementId);
        return true;
    } catch (error) {
        console.error('Feil ved opplåsing av prestasjon:', error);
        return false;
    }
}

// Funksjon for å sjekke alle prestasjoner for en bruker
async function checkAllAchievements(userId) {
    try {
        // Hent brukerprofil
        const userProfile = await window.databaseService.user.getUserProfile(userId);
        
        if (!userProfile) {
            console.error('Kunne ikke hente brukerprofil');
            return false;
        }
        
        // Last inn prestasjoner hvis de ikke er lastet inn
        if (achievements.length === 0) {
            const loaded = await loadAchievementsFromDatabase();
            if (!loaded) return false;
        }
        
        // Sjekk hver prestasjon
        for (const achievement of achievements) {
            // Sjekk om prestasjonen allerede er låst opp
            if (isAchievementUnlocked(achievement.id, userProfile)) {
                continue;
            }
            
            // Sjekk om prestasjonen kan låses opp
            let canUnlock = false;
            
            // Sjekk basert på type prestasjon
            if (achievement.type === 'skill') {
                const skillLevel = userProfile.skills?.[achievement.skill] || 0;
                canUnlock = skillLevel >= achievement.requirement_value;
            } else if (achievement.type === 'collection') {
                // Sjekk om brukeren har samlet nok gjenstander
                const itemCount = userProfile.inventory?.length || 0;
                canUnlock = itemCount >= achievement.requirement_value;
            } else if (achievement.type === 'exploration') {
                // Sjekk om brukeren har fullført nok oppdrag
                const completedQuests = userProfile.completed_quests?.length || 0;
                canUnlock = completedQuests >= achievement.requirement_value;
            }
            
            // Lås opp prestasjonen hvis kriteriene er oppfylt
            if (canUnlock) {
                await unlockAchievement(achievement.id, userId);
            }
        }
        
        return true;
    } catch (error) {
        console.error('Feil ved sjekking av prestasjoner:', error);
        return false;
    }
}

// Funksjon for å åpne achievements-modal
function openAchievementsModal(studentIndex) {
    let modal = document.getElementById('achievementsModal');
    if (modal) {
        modal.remove();
    }
    
    // Fjern eksisterende backdrop hvis den finnes
    let backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    
    // Opprett ny backdrop
    backdrop = document.createElement('div');
    backdrop.id = 'modal-backdrop';
    backdrop.className = 'modal-backdrop';
    document.body.appendChild(backdrop);
    
    // Vis backdrop med en liten forsinkelse for å aktivere overgangseffekten
    setTimeout(() => {
        backdrop.classList.add('show');
    }, 10);

    const student = students[studentIndex];
    const skills = ['Intelligens', 'Teknologi', 'Stamina', 'Karisma', 'Kreativitet', 'Flaks'];
    
    const modalHtml = `
        <div id="achievementsModal" class="modal" data-student-index="${studentIndex}">
            <div style="position: relative; margin-bottom: 20px; text-align: center;">
                <h2 style="margin-bottom: 10px;">Prestasjoner for ${student.name}</h2>
                <div class="skill-tabs">
                    ${skills.map(skill => `<button class="skill-tab" onclick="showSkillAchievements('${skill}')">${skill}</button>`).join('')}
            </div>
                <button class="close-button" onclick="closeAchievementModal()">&times;</button>
            </div>
            <div id="achievements-container" class="achievements-container">
                <!-- Prestasjoner vil bli lagt til her -->
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Vis prestasjoner for første ferdighet som standard
    showSkillAchievements(skills[0]);
    
    // Legg til event listener for å lukke modal når man klikker utenfor
    backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
            closeAchievementModal();
        }
    });
    
    // Legg til event listener for å lukke modal med Escape-tasten
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAchievementModal();
        }
    });
    
    // Vis modal med en liten forsinkelse for å aktivere overgangseffekten
    setTimeout(() => {
        const modal = document.getElementById('achievementsModal');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
}

// Funksjon for å vise prestasjoner for en bestemt ferdighet
function showSkillAchievements(skill) {
    const modal = document.getElementById('achievementsModal');
    if (!modal) return;
    
    const studentIndex = modal.getAttribute('data-student-index');
    const student = students[studentIndex];
    
    // Marker aktiv ferdighet
    const skillTabs = document.querySelectorAll('.skill-tab');
    skillTabs.forEach(tab => {
        if (tab.textContent === skill) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Filtrer prestasjoner for den valgte ferdigheten
    const skillAchievements = achievements.filter(achievement => achievement.skill === skill);
    
    // Sorter prestasjoner etter nivåkrav
    skillAchievements.sort((a, b) => {
        const aLevel = a.requirement_value || 0;
        const bLevel = b.requirement_value || 0;
        return aLevel - bLevel;
    });
    
    // Generer HTML for prestasjoner
    let achievementsHtml = '';
    
    if (skillAchievements.length === 0) {
        achievementsHtml = `<p class="no-achievements">Ingen prestasjoner funnet for ${skill}.</p>`;
    } else {
        achievementsHtml = skillAchievements.map(achievement => {
            const isUnlocked = student[skill] >= achievement.requirement_value;
            const statusClass = isUnlocked ? 'unlocked' : 'locked';
            const statusIcon = isUnlocked ? 'fas fa-check-circle' : 'fas fa-lock';
            const statusText = isUnlocked ? 'Låst opp' : 'Låst';
            
            return `
                <div class="achievement ${statusClass}">
                        <div class="achievement-icon">
                        <i class="fas fa-trophy"></i>
                        </div>
                        <div class="achievement-info">
                        <h3>${achievement.name}</h3>
                            <p>${achievement.description}</p>
                        <p class="achievement-reward">Belønning: ${achievement.reward}</p>
                        </div>
                    <div class="achievement-status">
                        <i class="${statusIcon}"></i>
                        <span>${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Oppdater container
    const container = document.getElementById('achievements-container');
    if (container) {
        container.innerHTML = achievementsHtml;
    }
}

// Funksjon for å lukke achievements-modal
function closeAchievementModal() {
    const modal = document.getElementById('achievementsModal');
    const backdrop = document.getElementById('modal-backdrop');
    
    if (modal) {
        modal.classList.remove('show');
    }
    
    if (backdrop) {
        backdrop.classList.remove('show');
    }
    
    // Fjern modal og backdrop etter overgangseffekten
        setTimeout(() => {
        if (modal) {
            modal.remove();
        }
        
        if (backdrop) {
            backdrop.remove();
        }
        }, 300);
    
    // Fjern event listener for Escape-tasten
    document.removeEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAchievementModal();
    }
    });
}

// Funksjon for å vise popup når en prestasjon låses opp
function showAchievementPopup(achievement) {
    // Fjern eksisterende popup hvis den finnes
    const existingPopup = document.getElementById('achievement-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Opprett popup
    const popup = document.createElement('div');
    popup.id = 'achievement-popup';
    popup.className = 'achievement-popup';
    
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
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>Prestasjon låst opp!</h3>
                <button class="close-popup">&times;</button>
            </div>
            <div class="popup-body">
                <div class="achievement-icon ${rarityClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <div class="achievement-reward">
                        <span>Belønning:</span>
                        <span>${achievement.reward_type === 'exp' ? `${achievement.reward_value} EXP` : `${achievement.reward_value} kreditter`}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Legg til popup i DOM
    document.body.appendChild(popup);

    // Vis popup med en liten forsinkelse for å aktivere overgangseffekten
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Legg til event listener for å lukke popup
    const closeButton = popup.querySelector('.close-popup');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        });
    }
    
    // Lukk popup automatisk etter 5 sekunder
    setTimeout(() => {
        if (popup.parentNode) {
        popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        }
    }, 5000);
} 

// Eksporter funksjoner
window.achievementsModule = {
    loadAchievementsFromDatabase,
    isAchievementUnlocked,
    unlockAchievement,
    checkAllAchievements,
    openAchievementsModal,
    showSkillAchievements,
    closeAchievementModal,
    showAchievementPopup
}; 