// Prestasjonsdata
const achievements = [
    // Intelligens-prestasjoner
    {
        name: "Newbie Intelligens",
        description: "Nå nivå 10 i Intelligens",
        skill: "Intelligens",
        reward: "Du får trekke et tilfeldig item.",
        check: (student) => student.Intelligens >= 10
    },
    {
        name: "Explorer Intelligens",
        description: "Nå nivå 15 i Intelligens",
        skill: "Intelligens",
        reward: "Du får dobbel XP på alle matematikk-oppgaver",
        check: (student) => student.Intelligens >= 15
    },
    {
        name: "Master Intelligens",
        description: "Nå nivå 20 i Intelligens",
        skill: "Intelligens",
        reward: "Du får dobbel XP for egenlesings- oppgaver",
        check: (student) => student.Intelligens >= 20
    },
    {
        name: "Legend Intelligens",
        description: "Nå nivå 25 i Intelligens",
        skill: "Intelligens",
        reward: "Du kan gjøre engelskoppgaver på norsk. ",
        check: (student) => student.Intelligens >= 25
    },
    {
        name: "Champion Intelligens",
        description: "Nå nivå 30 i Intelligens",
        skill: "Intelligens",
        reward: "Du får gjøre leksene på skolen. ",
        check: (student) => student.Intelligens >= 30
    },
    // Teknologi-prestasjoner
    {
        name: "Newbie Teknologi",
        description: "Nå nivå 10 i Teknologi",
        skill: "Teknologi",
        reward: "Du får trekke et tilfeldig item. ",
        check: (student) => student.Teknologi >= 10
    },
    {
        name: "Explorer Teknologi",
        description: "Nå nivå 15 i Teknologi",
        skill: "Teknologi",
        reward: "Du får tilbake pcen, og kan bruke den på stasjoner merket PC. ",
        check: (student) => student.Teknologi >= 15
    },
    {
        name: "Master Teknologi",
        description: "Nå nivå 20 i Teknologi",
        skill: "Teknologi",
        reward: "Du får dobbel XP på alle Micro:bit oppgaver",
        check: (student) => student.Teknologi >= 20
    },
    {
        name: "Legend Teknologi",
        description: "Nå nivå 25 i Teknologi",
        skill: "Teknologi",
        reward: "Du får tilgang til headset. ",
        check: (student) => student.Teknologi >= 25
    },
    {
        name: "Champion Teknologi",
        description: "Nå nivå 30 i Teknologi",
        skill: "Teknologi",
        reward: "Du kan lese på pc i lesestunder.",
        check: (student) => student.Teknologi >= 30
    },
    // Stamina-prestasjoner
    {
        name: "Newbie Stamina",
        description: "Nå nivå 10 i Stamina",
        skill: "Stamina",
        reward: "Då får tilgang til «Push-up for XP».Du får 10 XP per Push-up.",
        check: (student) => student.Stamina >= 10
    },
    {
        name: "Explorer Stamina",
        description: "Nå nivå 15 i Stamina",
        skill: "Stamina",
        reward: "Du får dobbel XP for egenlesings- oppgaver",
        check: (student) => student.Stamina >= 15
    },
    {
        name: "Master Stamina",
        description: "Nå nivå 20 i Stamina",
        skill: "Stamina",
        reward: "Du får trekke et tilfeldig item.",
        check: (student) => student.Stamina >= 20
    },
    {
        name: "Legend Stamina",
        description: "Nå nivå 25 i Stamina",
        skill: "Stamina",
        reward: "Du får 10 minutter lengre friminutt",
        check: (student) => student.Stamina >= 25
    },
    {
        name: "Champion Stamina",
        description: "Nå nivå 30 i Stamina",
        skill: "Stamina",
        reward: "Alle fysiske oppgaver gir dobbel XP.",
        check: (student) => student.Stamina >= 30
    },
    // Karisma-prestasjoner
    {
        name: "Newbie Karisma",
        description: "Nå nivå 10 i Karisma",
        skill: "Karisma",
        reward: "Du får lov til å sitte og tegne når vi har lesestund. ",
        check: (student) => student.Karisma >= 10
    },
    {
        name: "Explorer Karisma",
        description: "Nå nivå 15 i Karisma",
        skill: "Karisma",
        reward: "Du får trekke et tilfeldig item.",
        check: (student) => student.Karisma >= 15
    },
    {
        name: "Master Karisma",
        description: "Nå nivå 20 i Karisma",
        skill: "Karisma",
        reward: "Du får ½ av XPen til en valgfri person under «Level up» i tillegg til egen XP. ",
        check: (student) => student.Karisma >= 20
    },
    {
        name: "Legend Karisma",
        description: "Nå nivå 25 i Karisma",
        skill: "Karisma",
        reward: "Du trenger bare å få halvparten av matteoppgaver riktig for å få full XP",
        check: (student) => student.Karisma >= 25
    },
    {
        name: "Champion Karisma",
        description: "Nå nivå 30 i Karisma",
        skill: "Karisma",
        reward: "Du får lov til å gå hjem 15 minutter før. ",
        check: (student) => student.Karisma >= 30
    },
    // Kreativitet-prestasjoner
    {
        name: "Newbie Kreativitet",
        description: "Nå nivå 10 i Kreativitet",
        skill: "Kreativitet",
        reward: "Du får dobbel XP på alle oppgaver merket «K»",
        check: (student) => student.Kreativitet >= 10
    },
    {
        name: "Explorer Kreativitet",
        description: "Nå nivå 15 i Kreativitet",
        skill: "Kreativitet",
        reward: "Du får lov til å sitte og tegne når vi har lesestund.",
        check: (student) => student.Kreativitet >= 15
    },
    {
        name: "Master Kreativitet",
        description: "Nå nivå 20 i Kreativitet",
        skill: "Kreativitet",
        reward: "Du får trekke et tilfeldig item.",
        check: (student) => student.Kreativitet >= 20
    },
    {
        name: "Legend Kreativitet",
        description: "Nå nivå 25 i Kreativitet",
        skill: "Kreativitet",
        reward: "En gang per økt kan du kopiere et item du har i sekken.",
        check: (student) => student.Kreativitet >= 25
    },
    {
        name: "Champion Kreativitet",
        description: "Nå nivå 30 i Kreativitet",
        skill: "Kreativitet",
        reward: "Du får 1000 XP for hver økt du husker å ta av deg utesko",
        check: (student) => student.Kreativitet >= 30
    },
    // Flaks-prestasjoner
    {
        name: "Newbie Flaks",
        description: "Nå nivå 10 i Flaks",
        skill: "Flaks",
        reward: "Dobbel XP hvis du leverer en oppgave og kaster 6 på 1 forsøk med terning. ",
        check: (student) => student.Flaks >= 10
    },
    {
        name: "Explorer Flaks",
        description: "Nå nivå 15 i Flaks",
        skill: "Flaks",
        reward: "Dobbel XP hvis du leverer en oppgave og kaster 6 på 2 forsøk med terning.",
        check: (student) => student.Flaks >= 15
    },
    {
        name: "Master Flaks",
        description: "Nå nivå 20 i Flaks",
        skill: "Flaks",
        reward: "Dobbel XP hvis du leverer en oppgave og kaster 6 på 3 forsøk med terning.",
        check: (student) => student.Flaks >= 20
    },
    {
        name: "Legend Flaks",
        description: "Nå nivå 25 i Flaks",
        skill: "Flaks",
        reward: "Du får trekke et tilfeldig item.",
        check: (student) => student.Flaks >= 25
    },
    {
        name: "Champion Flaks",
        description: "Nå nivå 30 i Flaks",
        skill: "Flaks",
        reward: "Starte hver økt med å trekke en item. ",
        check: (student) => student.Flaks >= 30
    }
];

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
                <h2 id="achievementsTitle" style="margin: 0; display: inline-block;">
                    <span style="color: #ffffff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);">Achievements - </span><span style="color: #e74c3c; text-shadow: 0 0 5px rgba(231, 76, 60, 0.5);">${student.name}</span>
                </h2>
                <button class="item-bag-button" style="position: absolute; right: 100px; top: -25px; transform: translateY(0); 
                    background: linear-gradient(180deg, rgba(0, 20, 0, 0.8), rgba(0, 40, 0, 0.9)); 
                    border: 2px solid #2ecc71; 
                    color: #2ecc71; 
                    padding: 8px 15px; 
                    border-radius: 8px; 
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 0 5px rgba(46, 204, 113, 0.5);
                    box-shadow: 0 0 10px rgba(46, 204, 113, 0.2);
                    cursor: pointer;
                    transition: all 0.3s ease;" 
                    onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 15px rgba(46, 204, 113, 0.4)';"
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 10px rgba(46, 204, 113, 0.2)';"
                    onclick="openItemBagModal(${studentIndex})">
                    <img src="backpack.png" alt="Backpack" style="width: 48px; height: 48px; margin-right: 8px; filter: drop-shadow(0 0 5px rgba(46, 204, 113, 0.6));">
                    Åpne ryggsekk
                </button>
            </div>
            <button class="close-button" onclick="closeAchievementModal()">X</button>
            
            <div class="skills-row">
                ${skills.map(skill => {
                    const level = student[skill];
                    const maxLevel = 30;
                    const progress = (level / maxLevel) * 100;
                    return `
                        <div class="skill-tab" data-skill="${skill}" onclick="showSkillAchievements('${skill}')">
                            <h3>${skill}</h3>
                            <div class="level">Nivå ${level}</div>
                            <div class="progress-bar" style="width: 100%;">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="achievements-container">
                ${skills.map(skill => `<div class="skill-achievements" data-skill="${skill}"></div>`).join('')}
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Vis modal
    const newModal = document.getElementById('achievementsModal');
    newModal.classList.add('show');
    
    // Legg til klikk-hendelse for å lukke modal ved klikk på backdrop
    backdrop.addEventListener('click', function() {
        closeAchievementModal();
    });
    
    // Vis prestasjoner for første ferdighet som standard
    showSkillAchievements(skills[0]);
}

// Funksjon for å vise skill-achievements
function showSkillAchievements(skill) {
    // Fjern active class fra alle skill tabs
    document.querySelectorAll('.skill-tab').forEach(tab => tab.classList.remove('active'));
    
    // Legg til active class på valgt skill tab
    document.querySelector(`.skill-tab[data-skill="${skill}"]`).classList.add('active');
    
    // Finn container for achievements for denne ferdigheten
    const container = document.querySelector(`.skill-achievements[data-skill="${skill}"]`);
    if (!container) return;
    
    // Skjul alle skill-achievements containere
    document.querySelectorAll('.skill-achievements').forEach(section => {
        section.style.display = 'none';
    });
    
    // Vis valgt container
    container.style.display = 'block';
    
    // Sjekk om containeren allerede har innhold
    if (container.innerHTML.trim() === '') {
        // Hent student-indeks fra modal
        const modal = document.getElementById('achievementsModal');
        const studentIndex = parseInt(modal.getAttribute('data-student-index'));
        const student = students[studentIndex];
        
        // Generer achievements for denne ferdigheten
        const skillAchievements = achievements.filter(a => a.skill === skill);
        
        // Opprett HTML for achievements
        const achievementsHTML = skillAchievements.map(achievement => {
            const isUnlocked = achievement.check(student);
            return `
                <div class="achievement ${isUnlocked ? 'unlocked' : 'locked'}" data-skill="${skill}">
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div class="achievement-icon">
                            <img src="${achievement.name.toLowerCase().includes('newbie') ? 'newbie.jpeg' :
                                      achievement.name.toLowerCase().includes('explorer') ? 'explorer.jpeg' :
                                      achievement.name.toLowerCase().includes('master') ? 'master.jpeg' :
                                      achievement.name.toLowerCase().includes('legend') ? 'legend.jpeg' :
                                      achievement.name.toLowerCase().includes('champion') ? 'champion.jpeg' :
                                      'newbie.jpeg'}" 
                                 alt="Achievement rank">
                        </div>
                        <div class="achievement-info">
                            <h4 style="color: ${skill === 'Intelligens' ? '#00bfff' : 
                                          skill === 'Teknologi' ? '#2ecc71' : 
                                          skill === 'Stamina' ? '#ff4040' : 
                                          skill === 'Karisma' ? '#ffd700' : 
                                          skill === 'Kreativitet' ? '#ff1493' : 
                                          skill === 'Flaks' ? '#00ffff' : '#ffffff'}">${achievement.name}</h4>
                            <p>${achievement.description}</p>
                        </div>
                    </div>
                    <div class="achievement-reward" style="color: ${skill === 'Intelligens' ? '#00bfff' : 
                                                      skill === 'Teknologi' ? '#2ecc71' : 
                                                      skill === 'Stamina' ? '#ff4040' : 
                                                      skill === 'Karisma' ? '#ffd700' : 
                                                      skill === 'Kreativitet' ? '#ff1493' : 
                                                      skill === 'Flaks' ? '#00ffff' : '#ffffff'};
                             text-shadow: 0 0 10px currentColor;">${isUnlocked ? (achievement.reward || 'Ingen belønning spesifisert') : '                   '}</div>
                </div>
            `;
        }).join('');
        
        // Legg til achievements i containeren
        container.innerHTML = achievementsHTML;
    }
}

// Funksjon for å lukke achievement-modal
function closeAchievementModal() {
    const modal = document.getElementById('achievementsModal');
    if (modal) {
        // Legg til en fade-out animasjon
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    // Fjern backdrop med fade-out effekt
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.classList.remove('show');
        setTimeout(() => {
            backdrop.remove();
        }, 300);
    }
}

// Funksjon for å vise achievement-popup
function showAchievementPopup(achievement) {
    // Fjern eksisterende popup
    const existingPopup = document.querySelector('.achievement-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Opprett popup
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.setAttribute('data-skill', achievement.skill);
    
    popup.innerHTML = `
        <div style="background: rgba(0, 0, 0, 0.8); padding: 30px; border-radius: 20px; border: 3px solid ${
            achievement.skill === 'Intelligens' ? '#00bfff' : 
            achievement.skill === 'Teknologi' ? '#2ecc71' : 
            achievement.skill === 'Stamina' ? '#ff4040' : 
            achievement.skill === 'Karisma' ? '#ffd700' : 
            achievement.skill === 'Kreativitet' ? '#ff1493' : 
            achievement.skill === 'Flaks' ? '#00ffff' : '#ffffff'}; box-shadow: 0 0 30px ${
            achievement.skill === 'Intelligens' ? 'rgba(0, 191, 255, 0.5)' : 
            achievement.skill === 'Teknologi' ? 'rgba(46, 204, 113, 0.5)' : 
            achievement.skill === 'Stamina' ? 'rgba(255, 64, 64, 0.5)' : 
            achievement.skill === 'Karisma' ? 'rgba(255, 215, 0, 0.5)' : 
            achievement.skill === 'Kreativitet' ? 'rgba(255, 20, 147, 0.5)' : 
            achievement.skill === 'Flaks' ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.5)'}">
            <img src="${achievement.name.toLowerCase().includes('newbie') ? 'newbie.jpeg' :
                      achievement.name.toLowerCase().includes('explorer') ? 'explorer.jpeg' :
                      achievement.name.toLowerCase().includes('master') ? 'master.jpeg' :
                      achievement.name.toLowerCase().includes('legend') ? 'legend.jpeg' :
                      achievement.name.toLowerCase().includes('champion') ? 'champion.jpeg' :
                      'newbie.jpeg'}" 
                 alt="Achievement rank" style="width: 192px; height: 192px; margin-bottom: 20px; border-radius: 20px; border: 2px solid ${
                 achievement.skill === 'Intelligens' ? '#00bfff' : 
                 achievement.skill === 'Teknologi' ? '#2ecc71' : 
                 achievement.skill === 'Stamina' ? '#ff4040' : 
                 achievement.skill === 'Karisma' ? '#ffd700' : 
                 achievement.skill === 'Kreativitet' ? '#ff1493' : 
                 achievement.skill === 'Flaks' ? '#00ffff' : '#ffffff'}">
            <p style="font-size: 36px; margin-bottom: 20px; color: ${achievement.skill === 'Intelligens' ? '#00bfff' : 
                                               achievement.skill === 'Teknologi' ? '#2ecc71' : 
                                               achievement.skill === 'Stamina' ? '#ff4040' : 
                                               achievement.skill === 'Karisma' ? '#ffd700' : 
                                               achievement.skill === 'Kreativitet' ? '#ff1493' : 
                                               achievement.skill === 'Flaks' ? '#00ffff' : '#ffffff'};
                     text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8); 
                     font-weight: bold;">Belønning låst opp</p>
            <p style="font-size: 32px; margin: 15px 0; color: ${achievement.skill === 'Intelligens' ? '#00bfff' : 
                                                                 achievement.skill === 'Teknologi' ? '#2ecc71' : 
                                                                 achievement.skill === 'Stamina' ? '#ff4040' : 
                                                                 achievement.skill === 'Karisma' ? '#ffd700' : 
                                                                 achievement.skill === 'Kreativitet' ? '#ff1493' : 
                                                                 achievement.skill === 'Flaks' ? '#00ffff' : '#ffffff'};
                     text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8);
                     font-weight: bold;">${achievement.name}</p>
            <p style="font-size: 24px; margin-bottom: 20px; color: ${achievement.skill === 'Intelligens' ? '#00bfff' : 
                                                                    achievement.skill === 'Teknologi' ? '#2ecc71' : 
                                                                    achievement.skill === 'Stamina' ? '#ff4040' : 
                                                                    achievement.skill === 'Karisma' ? '#ffd700' : 
                                                                    achievement.skill === 'Kreativitet' ? '#ff1493' : 
                                                                    achievement.skill === 'Flaks' ? '#00ffff' : '#ffffff'};
                     text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8);">${achievement.description}</p>
            <p style="font-size: 28px; color: ${achievement.skill === 'Intelligens' ? '#00bfff' : 
                                               achievement.skill === 'Teknologi' ? '#2ecc71' : 
                                               achievement.skill === 'Stamina' ? '#ff4040' : 
                                               achievement.skill === 'Karisma' ? '#ffd700' : 
                                               achievement.skill === 'Kreativitet' ? '#ff1493' : 
                                               achievement.skill === 'Flaks' ? '#00ffff' : '#ffffff'};
                     text-shadow: 0 0 10px currentColor, 0 0 20px rgba(0,0,0,0.8);
                     padding: 15px;
                     background: rgba(0, 0, 0, 0.3);
                     border-radius: 10px;
                     margin-top: 10px;">${achievement.reward || 'Ingen belønning spesifisert'}</p>
        </div>
    `;
    
    // Legg til i dokumentet
    document.body.appendChild(popup);

    // Trigger animasjon
    requestAnimationFrame(() => {
        popup.classList.add('show');
    });

    // Spill achievement-lyd
    playAchievementSound();

    // Fjern etter forsinkelse (økt fra 3000ms til 5000ms)
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 600);
    }, 5000);
} 