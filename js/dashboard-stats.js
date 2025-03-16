// Globale variabler for statistikk-fanen
let statLevelElement;
let statExpElement;
let statQuestsElement;
let statAchievementsElement;
let statItemsElement;
let statCreditsSpentElement;
let skillGraphElements;

// Funksjon for å initialisere statistikk-fanen
function initStatsTab() {
    // Hent DOM-elementer
    statLevelElement = document.getElementById('stat-level');
    statExpElement = document.getElementById('stat-exp');
    statQuestsElement = document.getElementById('stat-quests');
    statAchievementsElement = document.getElementById('stat-achievements');
    statItemsElement = document.getElementById('stat-items');
    statCreditsSpentElement = document.getElementById('stat-credits-spent');
    
    // Hent ferdighetsgrafelementer
    skillGraphElements = {
        intelligens: document.getElementById('graph-intelligens'),
        teknologi: document.getElementById('graph-teknologi'),
        stamina: document.getElementById('graph-stamina'),
        karisma: document.getElementById('graph-karisma'),
        kreativitet: document.getElementById('graph-kreativitet'),
        flaks: document.getElementById('graph-flaks')
    };
    
    // Animer statistikk-kort
    animateStatCards();
}

// Funksjon for å oppdatere statistikk-fanen
function updateStatsTab() {
    if (!window.userProfile) {
        console.error('Brukerprofil ikke tilgjengelig');
        return;
    }
    
    const userProfile = window.userProfile;
    
    // Oppdater statistikk
    if (statLevelElement) {
        statLevelElement.textContent = window.dashboardBase.calculateLevel(userProfile.skills);
    }
    
    if (statExpElement) {
        statExpElement.textContent = userProfile.exp || 0;
    }
    
    if (statQuestsElement) {
        const completedQuests = (userProfile.quests || []).filter(quest => quest.status === 'completed').length;
        statQuestsElement.textContent = completedQuests;
    }
    
    if (statAchievementsElement) {
        const achievements = userProfile.achievements || [];
        statAchievementsElement.textContent = achievements.length;
    }
    
    if (statItemsElement) {
        const inventory = userProfile.inventory || [];
        const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
        statItemsElement.textContent = totalItems;
    }
    
    if (statCreditsSpentElement) {
        statCreditsSpentElement.textContent = userProfile.credits_spent || 0;
    }
    
    // Oppdater ferdighetsgraf
    updateSkillsGraph(userProfile);
}

// Funksjon for å oppdatere ferdighetsgraf
function updateSkillsGraph(user) {
    if (!user || !user.skills) return;
    
    const skills = user.skills;
    
    // Oppdater grafverdier
    for (const [skill, element] of Object.entries(skillGraphElements)) {
        if (element) {
            const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
            const value = skills[capitalizedSkill] || 0;
            element.textContent = value;
            
            // Oppdater posisjon basert på verdi
            const parent = element.closest('.stats-graph-skill');
            if (parent) {
                updateSkillPosition(parent, value);
            }
        }
    }
}

// Funksjon for å oppdatere posisjonen til en ferdighet i grafen
function updateSkillPosition(element, value) {
    if (!element) return;
    
    // Beregn posisjon basert på verdi (0-30)
    const maxValue = 30;
    const minDistance = 20; // Minimum avstand fra sentrum
    const maxDistance = 100; // Maksimum avstand fra sentrum
    
    // Beregn avstand fra sentrum
    const distance = minDistance + ((value / maxValue) * (maxDistance - minDistance));
    
    // Hent gjeldende transformasjon
    const currentTransform = window.getComputedStyle(element).getPropertyValue('transform');
    
    // Hvis det ikke er en transformasjon, bruk standard
    if (currentTransform === 'none') return;
    
    // Hent gjeldende rotasjon
    const matrix = new DOMMatrix(currentTransform);
    const angle = Math.atan2(matrix.b, matrix.a);
    
    // Beregn ny posisjon
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    // Oppdater posisjon
    element.style.transform = `translate(${x}px, ${y}px)`;
    
    // Oppdater farge basert på verdi
    updateSkillColor(element, value);
}

// Funksjon for å oppdatere fargen til en ferdighet i grafen
function updateSkillColor(element, value) {
    if (!element) return;
    
    // Beregn farge basert på verdi (0-30)
    const maxValue = 30;
    const intensity = Math.min(1, value / maxValue);
    
    // Hent ferdighetsnavn
    const skillName = element.getAttribute('data-skill');
    
    // Hent fargekode for ferdigheten
    const color = getSkillColor(skillName, intensity);
    
    // Oppdater farge
    element.style.backgroundColor = color;
    
    // Oppdater tekstfarge basert på intensitet
    element.style.color = intensity > 0.5 ? '#000' : '#fff';
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

// Funksjon for å animere statistikk-kort
function animateStatCards() {
    const statCards = document.querySelectorAll('.stats-card');
    
    statCards.forEach((card, index) => {
        // Legg til animasjon med forsinkelse
        setTimeout(() => {
            card.classList.add('animate-in');
        }, index * 100);
    });
}

// Initialiser statistikk-fanen når dokumentet er lastet
document.addEventListener('DOMContentLoaded', initStatsTab); 