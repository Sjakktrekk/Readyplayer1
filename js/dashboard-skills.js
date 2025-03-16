// Globale variabler for ferdigheter-fanen
const MAX_SKILL_LEVEL = 30;
let skillLevelElements;
let skillButtons;

// Funksjon for å initialisere ferdigheter-fanen
function initSkillsTab() {
    // Hent DOM-elementer
    skillLevelElements = document.querySelectorAll('.skill-level');
    skillButtons = document.querySelectorAll('.skill-button.increase');
    
    // Legg til event listeners for ferdighetsknappper
    skillButtons.forEach(button => {
        const skillCard = button.closest('.skill-card');
        const skillName = skillCard.getAttribute('data-skill');
        
        button.addEventListener('click', () => {
            increaseSkill(skillName);
        });
    });
}

// Funksjon for å laste inn ferdighetsdata
function loadSkillsData() {
    if (!window.userProfile || !window.userProfile.skills) {
        console.error('Brukerprofil eller ferdigheter ikke tilgjengelig');
        return;
    }
    
    updateSkillsTab();
}

// Funksjon for å oppdatere ferdigheter-fanen
function updateSkillsTab() {
    if (!window.userProfile || !window.userProfile.skills) {
        console.error('Brukerprofil eller ferdigheter ikke tilgjengelig');
        return;
    }
    
    const skills = window.userProfile.skills;
    
    // Oppdater ferdighetsnivåer i grensesnittet
    skillLevelElements.forEach(element => {
        const skillCard = element.closest('.skill-card');
        const skillName = skillCard.getAttribute('data-skill');
        
        if (skills[skillName] !== undefined) {
            element.textContent = skills[skillName];
            
            // Deaktiver knappen hvis ferdighetsnivået er på maks
            const increaseButton = skillCard.querySelector('.skill-button.increase');
            if (increaseButton) {
                increaseButton.disabled = skills[skillName] >= MAX_SKILL_LEVEL;
            }
        }
    });
}

// Funksjon for å øke en ferdighet
async function increaseSkill(skillName) {
    if (!window.dashboardBase || !window.dashboardBase.userProfile) {
        console.error('dashboardBase eller userProfile ikke tilgjengelig');
        return;
    }
    
    const { userProfile, supabase, showNotification } = window.dashboardBase;
    
    if (!userProfile.skills || userProfile.skills[skillName] === undefined) {
        showNotification('Ferdigheten finnes ikke.', 'error');
        return;
    }
    
    // Sjekk om ferdighetsnivået er på maks
    if (userProfile.skills[skillName] >= MAX_SKILL_LEVEL) {
        showNotification(`${skillName} er allerede på maksimalt nivå.`, 'info');
        return;
    }
    
    // Sjekk om brukeren har nok kreditter
    const cost = calculateSkillCost(userProfile.skills[skillName]);
    if (userProfile.credits < cost) {
        showNotification(`Du har ikke nok kreditter. Du trenger ${cost} kreditter.`, 'warning');
        return;
    }
    
    // Oppdater ferdigheten og kreditter
    const newSkillValue = userProfile.skills[skillName] + 1;
    const newCredits = userProfile.credits - cost;
    
    // Oppdater i databasen
    const { data, error } = await supabase
        .from('profiles')
        .update({
            skills: { ...userProfile.skills, [skillName]: newSkillValue },
            credits: newCredits
        })
        .eq('id', userProfile.id);
    
    if (error) {
        console.error('Feil ved oppdatering av ferdighet:', error);
        showNotification('Feil ved oppdatering av ferdighet. Prøv igjen senere.', 'error');
        return;
    }
    
    // Vis bekreftelse
    showNotification(`${skillName} økt til nivå ${newSkillValue}!`, 'success');
    
    // Sjekk for prestasjoner
    checkSkillAchievements(skillName, newSkillValue);
}

// Funksjon for å beregne kostnaden for å øke en ferdighet
function calculateSkillCost(currentLevel) {
    return (currentLevel + 1) * 10;
}

// Funksjon for å sjekke prestasjoner relatert til ferdigheter
function checkSkillAchievements(skillName, skillLevel) {
    if (typeof checkAchievements === 'function') {
        checkAchievements(skillName, skillLevel);
    }
}

// Funksjon for å få fargekode for en ferdighet
function getSkillColor(skill, alpha = 1) {
    const colorMap = {
        'Intelligens': `rgba(0, 191, 255, ${alpha})`,    // DeepSkyBlue
        'Teknologi': `rgba(128, 0, 128, ${alpha})`,      // Purple
        'Stamina': `rgba(50, 205, 50, ${alpha})`,        // LimeGreen
        'Karisma': `rgba(255, 215, 0, ${alpha})`,        // Gold
        'Kreativitet': `rgba(255, 105, 180, ${alpha})`,  // HotPink
        'Flaks': `rgba(255, 69, 0, ${alpha})`            // OrangeRed
    };
    
    return colorMap[skill] || `rgba(0, 255, 255, ${alpha})`;
}

// Initialiser ferdigheter-fanen når dokumentet er lastet
document.addEventListener('DOMContentLoaded', initSkillsTab); 