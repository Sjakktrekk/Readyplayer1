// Dashboard Achievements
// Denne filen håndterer prestasjoner i dashbordet og kobler dem til achievements på hovedsiden

// Importerer achievements-array fra achievements.js
// Merk: achievements-array må være tilgjengelig globalt

// Globale variabler
let showOnlyUnlocked = true; // Standard: vis bare opplåste prestasjoner

// Funksjon for å laste inn prestasjoner i dashbordet
function loadDashboardAchievements(profile) {
    console.log('Laster inn prestasjoner i dashbordet...');
    
    // Hent container for prestasjoner
    const achievementsContainer = document.getElementById('achievements-list');
    if (!achievementsContainer) {
        console.error('Fant ikke achievements-container');
        return;
    }
    
    // Tøm container
    achievementsContainer.innerHTML = '';
    
    // Sjekk om achievements-array er tilgjengelig
    if (typeof achievements === 'undefined') {
        console.error('achievements-array er ikke tilgjengelig');
        achievementsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste prestasjoner. Vennligst prøv igjen senere.</div>';
        return;
    }
    
    // Bruk den mottatte profilen eller prøv å hente den globalt
    const userProfile = profile || window.userProfile;
    
    // Sjekk om userProfile er tilgjengelig
    if (!userProfile) {
        console.error('userProfile er ikke tilgjengelig');
        achievementsContainer.innerHTML = '<div class="empty-message">Kunne ikke laste brukerdata. Vennligst prøv igjen senere.</div>';
        return;
    }
    
    // Hent gjeldende bruker
    const currentUser = getCurrentUser(userProfile);
    if (!currentUser) {
        console.error('Ingen bruker er logget inn');
        achievementsContainer.innerHTML = '<div class="empty-message">Logg inn for å se dine prestasjoner.</div>';
        return;
    }
    
    // Finn den eksisterende overskriften og legg til toggle-knappen
    const achievementsTab = document.getElementById('achievements-tab');
    if (achievementsTab) {
        const existingHeader = achievementsTab.querySelector('h2');
        if (existingHeader) {
            // Sett position: relative på header-containeren for å posisjonere knappen
            existingHeader.style.position = 'relative';
            
            // Fjern eksisterende toggle-knapp hvis den finnes
            const existingButton = existingHeader.querySelector('.toggle-achievements-button');
            if (existingButton) {
                existingHeader.removeChild(existingButton);
            }
            
            // Legg til toggle-knapp
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-achievements-button';
            toggleButton.innerHTML = `<i class="fas ${showOnlyUnlocked ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
            toggleButton.title = showOnlyUnlocked ? 'Vis alle prestasjoner' : 'Vis bare opplåste';
            toggleButton.style.cssText = `
                background: rgba(0, 0, 0, 0.7);
                border: 1px solid #0ff;
                color: #0ff;
                padding: 3px 6px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 10px;
                vertical-align: middle;
            `;
            
            toggleButton.addEventListener('mouseover', function() {
                this.style.background = 'rgba(0, 255, 255, 0.1)';
                this.style.transform = 'translateY(-1px)';
            });
            
            toggleButton.addEventListener('mouseout', function() {
                this.style.background = 'rgba(0, 0, 0, 0.7)';
                this.style.transform = 'translateY(0)';
            });
            
            toggleButton.addEventListener('click', function() {
                showOnlyUnlocked = !showOnlyUnlocked;
                this.innerHTML = `<i class="fas ${showOnlyUnlocked ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
                this.title = showOnlyUnlocked ? 'Vis alle prestasjoner' : 'Vis bare opplåste';
                loadDashboardAchievements(userProfile);
            });
            
            // Legg til knappen etter teksten i overskriften
            existingHeader.appendChild(toggleButton);
        }
    }
    
    // Grupper achievements etter ferdighet
    const skillGroups = {};
    const skills = ['Intelligens', 'Teknologi', 'Stamina', 'Karisma', 'Kreativitet', 'Flaks'];
    
    skills.forEach(skill => {
        // Filtrer achievements basert på innstillingen
        if (showOnlyUnlocked) {
            // Vis bare opplåste prestasjoner
            skillGroups[skill] = achievements
                .filter(a => a.skill === skill)
                .filter(a => a.check(currentUser));
        } else {
            // Vis alle prestasjoner
            skillGroups[skill] = achievements.filter(a => a.skill === skill);
        }
    });
    
    // Opprett HTML for hver ferdighetsgruppe
    let hasAchievements = false;
    
    skills.forEach(skill => {
        const skillAchievements = skillGroups[skill];
        if (skillAchievements.length === 0) return; // Hopp over ferdigheter uten prestasjoner
        
        hasAchievements = true;
        
        // Opprett container for denne ferdigheten
        const skillContainer = document.createElement('div');
        skillContainer.className = 'achievement-category';
        
        // Legg til overskrift
        const skillHeader = document.createElement('h3');
        skillHeader.textContent = skill;
        skillHeader.style.color = getSkillColor(skill);
        skillHeader.style.textShadow = `0 0 10px ${getSkillColor(skill, 0.5)}`;
        skillContainer.appendChild(skillHeader);
        
        // Legg til achievements for denne ferdigheten
        skillAchievements.forEach(achievement => {
            const isUnlocked = achievement.check(currentUser);
            const achievementElement = createAchievementElement(achievement, isUnlocked, skill);
            skillContainer.appendChild(achievementElement);
        });
        
        // Legg til i hovedcontainer
        achievementsContainer.appendChild(skillContainer);
    });
    
    // Vis melding hvis ingen prestasjoner er funnet
    if (!hasAchievements) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        
        if (showOnlyUnlocked) {
            emptyMessage.textContent = 'Du har ikke låst opp noen prestasjoner ennå. Fortsett å øke ferdighetene dine for å låse opp prestasjoner!';
        } else {
            emptyMessage.textContent = 'Ingen prestasjoner funnet.';
        }
        
        achievementsContainer.appendChild(emptyMessage);
    }
}

// Funksjon for å opprette et achievement-element
function createAchievementElement(achievement, isUnlocked, skill) {
    const achievementElement = document.createElement('div');
    achievementElement.className = `achievement-item ${isUnlocked ? 'achievement-unlocked' : 'achievement-locked'}`;
    
    // Legg til ekstra styling for opplåste prestasjoner
    if (isUnlocked) {
        achievementElement.style.boxShadow = `0 0 15px ${getSkillColor(skill, 0.3)}`;
        achievementElement.style.borderColor = getSkillColor(skill);
    }
    
    // Opprett ikon
    const iconElement = document.createElement('div');
    iconElement.className = 'achievement-icon';
    
    // Bestem ikon basert på achievement-navn
    let iconClass = 'fas fa-award';
    let iconColor = getSkillColor(skill);
    
    if (achievement.name.toLowerCase().includes('newbie')) {
        iconClass = 'fas fa-star';
    } else if (achievement.name.toLowerCase().includes('explorer')) {
        iconClass = 'fas fa-compass';
    } else if (achievement.name.toLowerCase().includes('master')) {
        iconClass = 'fas fa-crown';
    } else if (achievement.name.toLowerCase().includes('legend')) {
        iconClass = 'fas fa-trophy';
    } else if (achievement.name.toLowerCase().includes('champion')) {
        iconClass = 'fas fa-medal';
    }
    
    // Opprett ikon med Font Awesome
    const icon = document.createElement('i');
    icon.className = iconClass;
    icon.style.fontSize = '40px';
    icon.style.color = iconColor;
    
    // Legg til glødende effekt for opplåste prestasjoner
    if (isUnlocked) {
        icon.style.textShadow = `0 0 15px ${getSkillColor(skill, 0.5)}`;
    }
    
    // Legg til bakgrunn for ikonet
    const iconBackground = document.createElement('div');
    iconBackground.style.cssText = `
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid ${isUnlocked ? getSkillColor(skill) : '#666'};
        box-shadow: ${isUnlocked ? `0 0 10px ${getSkillColor(skill, 0.3)}` : 'none'};
    `;
    
    iconBackground.appendChild(icon);
    iconElement.appendChild(iconBackground);
    
    // Opprett tekstinnhold
    const textElement = document.createElement('div');
    textElement.className = 'achievement-text';
    
    // Opprett tittel
    const titleElement = document.createElement('div');
    titleElement.className = 'achievement-title';
    titleElement.textContent = achievement.name;
    titleElement.style.color = getSkillColor(skill);
    
    // Legg til glødende tekst for opplåste prestasjoner
    if (isUnlocked) {
        titleElement.style.textShadow = `0 0 5px ${getSkillColor(skill, 0.5)}`;
        titleElement.style.fontWeight = 'bold';
    }
    
    textElement.appendChild(titleElement);
    
    // Opprett beskrivelse
    const descElement = document.createElement('div');
    descElement.className = 'achievement-description';
    descElement.textContent = achievement.description;
    textElement.appendChild(descElement);
    
    // Opprett belønning (vises kun hvis låst opp)
    if (isUnlocked) {
        const rewardElement = document.createElement('div');
        rewardElement.className = 'achievement-reward';
        rewardElement.textContent = achievement.reward || 'Ingen belønning spesifisert';
        rewardElement.style.color = getSkillColor(skill);
        rewardElement.style.textShadow = `0 0 5px ${getSkillColor(skill, 0.3)}`;
        textElement.appendChild(rewardElement);
    } else {
        const lockedElement = document.createElement('div');
        lockedElement.className = 'achievement-mystery';
        lockedElement.textContent = 'Lås opp for å se belønning';
        textElement.appendChild(lockedElement);
    }
    
    // Legg til elementer i achievement-element
    achievementElement.appendChild(iconElement);
    achievementElement.appendChild(textElement);
    
    return achievementElement;
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

// Hjelpefunksjon for å hente gjeldende bruker
function getCurrentUser(userProfile) {
    // Sjekk om vi har fått userProfile som parameter
    if (userProfile) {
        console.log('Bruker mottatt profil:', userProfile.username);
        
        // Konverter userProfile til et format som achievements.check-funksjonen forventer
        // achievements.check forventer et objekt med direkte tilgang til ferdighetene
        const user = {
            ...userProfile,
            Intelligens: userProfile.skills.Intelligens || 0,
            Teknologi: userProfile.skills.Teknologi || 0,
            Stamina: userProfile.skills.Stamina || 0,
            Karisma: userProfile.skills.Karisma || 0,
            Kreativitet: userProfile.skills.Kreativitet || 0,
            Flaks: userProfile.skills.Flaks || 0
        };
        
        return user;
    }
    
    console.error('Ingen brukerprofil tilgjengelig');
    return null;
}

// Eksporter funksjoner
window.loadDashboardAchievements = loadDashboardAchievements; 