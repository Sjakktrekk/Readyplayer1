// Daily Quests System
const questPool = [
    {
        id: 1,
        title: "Fjellklatreren",
        description: "Ta bilde av deg selv på toppen av Kvernberget",
        skill: "Stamina",
        xpReward: 5000,
        icon: "🧠"
    },
    {
        id: 2,
        title: "Høytleseren",
        description: "Send et tydopptak hvor du leser høyt fra din favorittbok i minimum 5 minutter.",
        skill: "Karisma",
        xpReward: 5000,
        icon: "💻"
    },
    {
        id: 3,
        title: "I am Shakespeare",
        description: "Skriv et dikt med enderim på minst 8 linjer med tittelen -Trump er en dritt-",
        skill: "Kreativitet",
        xpReward: 5000,
        icon: "⏱️"
    },
    {
        id: 4,
        title: "Maurmaurmaur",
        description: "Lag en PowerPoint-presentasjon med tittelen -Hvis jeg var en maur-",
        skill: "Teknologi",
        xpReward: 5000,
        icon: "🤝"
    },
    {
        id: 5,
        title: "Forfatterspiren",
        description: "Skriv en fortelling med tittelen -Dagen da alt gikk i dass-",
        skill: "Kreativitet",
        xpReward: 5000,
        icon: "💡"
    }
];

// Funksjon for å generere dagens oppdrag
function generateDailyQuests() {
    // Sjekk om vi allerede har generert oppdrag i dag
    const today = new Date().toDateString();
    const lastQuestDate = localStorage.getItem('lastQuestDate');
    
    if (lastQuestDate === today && localStorage.getItem('dailyQuests')) {
        return JSON.parse(localStorage.getItem('dailyQuests'));
    }
    
    // Velg 1 tilfeldig oppdrag fra poolen (endret fra 3 til 1)
    const availableQuests = [...questPool];
    const dailyQuests = [];
    
    // Velg bare ett oppdrag
    const randomIndex = Math.floor(Math.random() * availableQuests.length);
    const selectedQuest = availableQuests[randomIndex];
    dailyQuests.push(selectedQuest);
    
    // Lagre dagens oppdrag og dato
    localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
    localStorage.setItem('lastQuestDate', today);
    
    return dailyQuests;
}

// Funksjon for å åpne daily quests modal
function openDailyQuestsModal() {
    // Generer eller hent dagens oppdrag
    const dailyQuests = generateDailyQuests();
    
    // Opprett modal
    const modalHtml = `
        <div id="dailyQuestsModal" class="modal">
            <h2 class="daily-quests-title">Dagens Oppdrag <span class="cyber-font">// DAILY QUESTS</span></h2>
            <button class="close-button" onclick="closeDailyQuestsModal()">X</button>
            
            <div class="quest-container">
                ${dailyQuests.map(quest => `
                    <div class="quest-card">
                        <div class="quest-icon">${quest.icon}</div>
                        <div class="quest-info">
                            <div class="quest-title">${quest.title}</div>
                            <div class="quest-description">${quest.description}</div>
                            <div class="quest-skill" data-skill="${quest.skill}">${quest.skill}</div>
                        </div>
                        <div class="quest-reward">
                            +${quest.xpReward} XP
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="quest-timer">
                Nye oppdrag om: <span id="questTimer">00:00:00</span>
            </div>
        </div>
    `;
    
    // Fjern eksisterende modal hvis den finnes
    const existingModal = document.getElementById('dailyQuestsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Legg til ny modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Vis modalen
    document.getElementById('dailyQuestsModal').style.display = 'block';
    
    // Start nedtellingstimer
    updateQuestTimer();
}

// Funksjon for å lukke daily quests modal
function closeDailyQuestsModal() {
    const modal = document.getElementById('dailyQuestsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Funksjon for å oppdatere nedtellingstimeren
function updateQuestTimer() {
    const timerElement = document.getElementById('questTimer');
    if (!timerElement) return;
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeRemaining = tomorrow - now;
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    setTimeout(updateQuestTimer, 1000);
}

// Funksjon for å generere nye oppdrag
function generateNewQuests() {
    // Velg 1 tilfeldig oppdrag fra poolen (endret fra 3 til 1)
    const availableQuests = [...questPool];
    const dailyQuests = [];
    
    // Velg bare ett oppdrag
    const randomIndex = Math.floor(Math.random() * availableQuests.length);
    const selectedQuest = availableQuests[randomIndex];
    
    // Sikre at ikonet er med
    if (!selectedQuest.icon) {
        // Sett et standard ikon basert på ferdighet
        switch(selectedQuest.skill) {
            case "Intelligens": selectedQuest.icon = "🧠"; break;
            case "Teknologi": selectedQuest.icon = "💻"; break;
            case "Stamina": selectedQuest.icon = "⏱️"; break;
            case "Karisma": selectedQuest.icon = "🤝"; break;
            case "Kreativitet": selectedQuest.icon = "💡"; break;
            case "Flaks": selectedQuest.icon = "🍀"; break;
            default: selectedQuest.icon = "❓";
        }
    }
    
    dailyQuests.push(selectedQuest);
    
    // Lagre dagens oppdrag
    localStorage.setItem('dailyQuests', JSON.stringify(dailyQuests));
    
    return dailyQuests;
}

// Funksjon for å hente gjeldende oppdrag
function getCurrentQuests() {
    const savedQuests = localStorage.getItem('dailyQuests');
    if (savedQuests) {
        return JSON.parse(savedQuests);
    } else {
        // Hvis ingen oppdrag er lagret, generer nye
        return generateNewQuests();
    }
}

// Funksjon for å oppdatere oppdragene
function refreshQuests() {
    const newQuests = generateNewQuests();
    
    // Oppdater visningen
    const questContainer = document.querySelector('.quest-container');
    if (questContainer) {
        questContainer.innerHTML = newQuests.map(quest => `
            <div class="quest-card">
                <div class="quest-icon">${quest.icon || '❓'}</div>
                <div class="quest-info">
                    <div class="quest-title">${quest.title}</div>
                    <div class="quest-description">${quest.description}</div>
                    <div class="quest-skill" data-skill="${quest.skill}">${quest.skill}</div>
                </div>
                <div class="quest-reward">
                    +${quest.xpReward} XP
                </div>
            </div>
        `).join('');
    }
    
    // Vis en liten animasjon for å indikere oppdatering
    const refreshBtn = document.querySelector('.refresh-quests-btn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-check"></i> Oppdatert!';
        refreshBtn.style.backgroundColor = 'rgba(46, 204, 113, 0.4)';
        
        setTimeout(() => {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Nye oppdrag';
            refreshBtn.style.backgroundColor = '';
        }, 1500);
    }
}

// Funksjon for å legge til daily quests i hovedgrensesnittet
function addDailyQuestsInline() {
    try {
        console.log('addDailyQuestsInline starter...');
        
        const container = document.querySelector('.container');
        if (!container) {
            console.error('Container ikke funnet');
            return;
        }
        
        // Fjern eksisterende oppdragsboks hvis den finnes
        const existingQuestBox = document.getElementById('inlineQuestBox');
        if (existingQuestBox) {
            existingQuestBox.remove();
        }
        
        // Fjern eksisterende egg-boks hvis den finnes
        const existingEggBox = document.getElementById('eggBox');
        if (existingEggBox) {
            existingEggBox.remove();
        }
        
        // Fjern eksisterende boss-boks hvis den finnes
        const existingBossBox = document.getElementById('bossBox');
        if (existingBossBox) {
            existingBossBox.remove();
        }
        
        // Fjern eksisterende container hvis den finnes
        const existingBoxesContainer = document.getElementById('boxesContainer');
        if (existingBoxesContainer) {
            existingBoxesContainer.remove();
        }
        
        // Opprett container for alle boksene med fast høyde
        const boxesContainer = document.createElement('div');
        boxesContainer.id = 'boxesContainer';
        boxesContainer.style.cssText = `
            display: table; /* Bruk table i stedet for flex */
            width: 100%;
            max-width: 100%;
            margin: 15px auto;
            border-spacing: 10px 0; /* Redusert mellomrom mellom boksene */
            height: 170px;
            table-layout: fixed; /* Sikrer at alle celler har samme bredde */
        `;
        
        // Hent dagens oppdrag
        const dailyQuests = getCurrentQuests();
        const quest = dailyQuests[0]; // Vi viser bare ett oppdrag
        
        // Sett farge basert på ferdighet
        let skillColor = '#ffffff';
        if (quest.skill === 'Intelligens') skillColor = '#00bfff';
        else if (quest.skill === 'Teknologi') skillColor = '#2ecc71';
        else if (quest.skill === 'Stamina') skillColor = '#ff4040';
        else if (quest.skill === 'Karisma') skillColor = '#ffd700';
        else if (quest.skill === 'Kreativitet') skillColor = '#ff1493';
        else if (quest.skill === 'Flaks') skillColor = '#00ffff';
        
        // Opprett oppdragsboksen
        const questBox = document.createElement('div');
        questBox.id = 'inlineQuestBox';
        questBox.style.cssText = `
            display: table-cell;
            background: linear-gradient(
                180deg,
                rgba(16, 24, 48, 0.95) 0%,
                rgba(24, 36, 72, 0.95) 100%
            );
            color: lime;
            border: 2px solid lime;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
            position: relative;
            overflow: hidden;
            vertical-align: top;
            width: 33%;
            height: 170px;
            box-sizing: border-box;
        `;
        
        // Legg til innhold
        questBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);">
                    Dagens Oppdrag
                </h3>
                <button id="refreshQuestBtn" style="
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid lime;
                    color: lime;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.3s ease;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;">
                    <i class="fas fa-sync-alt"></i> Nytt oppdrag
                </button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px; padding: 10px; margin-bottom: 0; background: rgba(0, 0, 0, 0.3); border-radius: 5px; height: calc(100% - 50px);">
                <div style="font-size: 36px; min-width: 50px; text-align: center;">${quest.icon || '❓'}</div>
                <div style="flex-grow: 1;">
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px; color: ${skillColor};">${quest.title}</div>
                    <div style="font-size: 16px; margin-bottom: 5px;">${quest.description}</div>
                </div>
                <div style="min-width: 80px; text-align: center; font-size: 18px; font-weight: bold; color: #ff80ff; text-shadow: 0 0 5px rgba(255, 128, 255, 0.3);">
                    +${quest.xpReward} XP
                </div>
            </div>
        `;
        
        // Opprett egg-boksen
        const eggBox = document.createElement('div');
        eggBox.id = 'eggBox';
        eggBox.style.cssText = `
            display: table-cell;
            background: linear-gradient(
                180deg,
                rgba(16, 24, 48, 0.95) 0%,
                rgba(24, 36, 72, 0.95) 100%
            );
            color: lime;
            border: 2px solid lime;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
            position: relative;
            overflow: hidden;
            vertical-align: top;
            width: 33%;
            height: 170px;
            box-sizing: border-box;
        `;
        
        // Legg til overskrift
        const eggTitle = document.createElement('h3');
        eggTitle.style.cssText = `
            margin: 0 0 10px 0;
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        `;

        // Legg til hovedtittel og XP-indikator
        eggTitle.innerHTML = `
            <span>Easter Eggs</span>
            <span style="
                font-size: 14px;
                color: #ff80ff;
                background: rgba(0, 0, 0, 0.3);
                padding: 3px 8px;
                border-radius: 4px;
                text-shadow: 0 0 5px rgba(255, 128, 255, 0.5);
            ">±5 000 XP til alle spillere per egg</span>
        `;
        eggBox.appendChild(eggTitle);
        
        // Opprett container for eggene
        const eggsContainer = document.createElement('div');
        eggsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 10px;
            margin-bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            height: calc(100% - 50px); /* Juster høyden basert på tittelens høyde */
            align-items: center;
        `;
        
        // Legg til 6 egg
        for (let i = 1; i <= 6; i++) {
            const eggContainer = document.createElement('div');
            eggContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                flex: 1;
                min-width: 0;
                position: relative;
                height: 100%;
            `;
            
            // Opprett egg-bilde
            const eggImg = document.createElement('img');
            eggImg.src = `egg${i}.png`;
            eggImg.alt = `Egg ${i}`;
            eggImg.dataset.name = `Egg ${i}`;
            eggImg.dataset.hint = `Dette er et hint for egg ${i}`;
            eggImg.dataset.id = `egg-${i}`; // Unik ID for localStorage
            
            // Sjekk om egget er låst opp fra localStorage
            const isUnlocked = localStorage.getItem(`egg-${i}-unlocked`) === "true";
            eggImg.dataset.unlocked = isUnlocked ? "true" : "false";
            
            eggImg.style.cssText = `
                width: 83px;
                height: 83px;
                object-fit: contain;
                cursor: pointer;
                transition: all 0.3s ease;
                filter: ${isUnlocked ? "none" : "grayscale(100%) brightness(50%)"};
                margin: 0 auto;
            `;
            
            // Legg til låseikon over egget
            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'lock-overlay';
            lockOverlay.innerHTML = isUnlocked ? '<i class="fas fa-lock-open"></i>' : '<i class="fas fa-lock"></i>';
            lockOverlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 28px;
                color: rgba(255, 255, 255, 0.8);
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
                pointer-events: none;
                transition: all 0.3s ease;
                z-index: 5;
                opacity: ${isUnlocked ? "0" : "1"};
            `;
            eggContainer.appendChild(lockOverlay);
            
            // Legg til klikk-funksjonalitet for å låse opp/låse
            eggImg.addEventListener('click', function() {
                const currentlyUnlocked = this.dataset.unlocked === "true";
                
                if (currentlyUnlocked) {
                    // Lås egget
                    this.dataset.unlocked = "false";
                    this.style.filter = "grayscale(100%) brightness(50%)";
                    lockOverlay.innerHTML = '<i class="fas fa-lock"></i>';
                    lockOverlay.style.opacity = "1";
                    lockOverlay.style.transform = "translate(-50%, -50%)";
                    
                    // Lagre status i localStorage
                    localStorage.setItem(this.dataset.id + "-unlocked", "false");
                    
                    // Trekk fra 10 000 XP fra alle spillere
                    students.forEach(student => {
                        student.exp = Math.max(0, student.exp - 5000);  
                    });
                    
                    // Lagre data og oppdater tabellen
                    saveData();
                    updateTable();
                    
                    // Vis custom popup i stedet for alert
                    showEggPopup(false, this.dataset.id.split('-')[1]);
                    
                    // Gjenopprett boss-boksen etter egg-klikk
                    ensureBossBoxExists();
                } else {
                    // Lås opp egget
                    this.dataset.unlocked = "true";
                    this.style.filter = "none";
                    lockOverlay.innerHTML = '<i class="fas fa-lock-open"></i>';
                    
                    // Animer opplåsing
                    lockOverlay.style.opacity = "0.8";
                    lockOverlay.style.transform = "translate(-50%, -50%) scale(1.5)";
                    
                    // Fade ut låseikon etter en kort stund
                    setTimeout(() => {
                        lockOverlay.style.opacity = "0";
                    }, 800);
                    
                    // Lagre status i localStorage
                    localStorage.setItem(this.dataset.id + "-unlocked", "true");
                    
                    // Gi 10 000 XP til alle spillere
                    students.forEach(student => {
                        student.exp += 5000;
                    });
                    
                    // Lagre data og oppdater tabellen
                    saveData();
                    updateTable();
                    
                    // Vis custom popup i stedet for alert
                    showEggPopup(true, this.dataset.id.split('-')[1]);
                    
                    // Gjenopprett boss-boksen etter egg-klikk
                    ensureBossBoxExists();
                }
            });
            
            eggContainer.appendChild(eggImg);
            eggsContainer.appendChild(eggContainer);
        }
        
        eggBox.appendChild(eggsContainer);
        
        // Legg til boksene i container
        boxesContainer.appendChild(questBox);
        boxesContainer.appendChild(eggBox);
        
        // Legg til container i hovedcontaineren (før tabellen)
        const table = container.querySelector('table');
        if (table) {
            container.insertBefore(boxesContainer, table);
        } else {
            container.appendChild(boxesContainer);
        }
        
        console.log('Bokscontainer lagt til i DOM');
        
        // Kall addBossBox-funksjonen for å legge til den interaktive boss-boksen
        if (typeof addBossBox === 'function') {
            console.log('Kaller addBossBox...');
            // Vent litt før vi kaller addBossBox for å sikre at DOM er oppdatert
            setTimeout(() => {
                addBossBox();
                console.log('addBossBox kalt med forsinkelse');
            }, 500); // Økt forsinkelse fra 100ms til 500ms
        } else {
            console.error('addBossBox-funksjonen er ikke tilgjengelig');
        }
        
        // Legg til event listener for oppdateringsknappen
        const refreshQuestBtn = document.getElementById('refreshQuestBtn');
        if (refreshQuestBtn) {
            refreshQuestBtn.addEventListener('click', function() {
                // Lagre referanse til eksisterende container
                const existingContainer = document.getElementById('boxesContainer');
                
                // Generer nytt oppdrag
                const newQuests = generateNewQuests();
                
                // Oppdater bare innholdet i oppdragsboksen i stedet for å tegne alt på nytt
                const questBox = document.getElementById('inlineQuestBox');
                if (questBox) {
                    // Sett farge basert på ferdighet
                    let skillColor = '#ffffff';
                    const quest = newQuests[0];
                    if (quest.skill === 'Intelligens') skillColor = '#00bfff';
                    else if (quest.skill === 'Teknologi') skillColor = '#2ecc71';
                    else if (quest.skill === 'Stamina') skillColor = '#ff4040';
                    else if (quest.skill === 'Karisma') skillColor = '#ffd700';
                    else if (quest.skill === 'Kreativitet') skillColor = '#ff1493';
                    else if (quest.skill === 'Flaks') skillColor = '#00ffff';
                    
                    // Oppdater bare innholdet
                    questBox.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <h3 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);">
                                Dagens Oppdrag
                            </h3>
                            <button id="refreshQuestBtn" style="
                                background: rgba(0, 0, 0, 0.3);
                                border: 1px solid lime;
                                color: lime;
                                padding: 5px 10px;
                                border-radius: 5px;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                                transition: all 0.3s ease;
                                font-family: 'Courier New', monospace;
                                font-size: 14px;">
                                <i class="fas fa-sync-alt"></i> Nytt oppdrag
                            </button>
                        </div>
                        
                        <div style="display: flex; align-items: center; gap: 15px; padding: 10px; margin-bottom: 0; background: rgba(0, 0, 0, 0.3); border-radius: 5px; height: calc(100% - 50px);">
                            <div style="font-size: 36px; min-width: 50px; text-align: center;">${quest.icon || '❓'}</div>
                            <div style="flex-grow: 1;">
                                <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px; color: ${skillColor};">${quest.title}</div>
                                <div style="font-size: 16px; margin-bottom: 5px;">${quest.description}</div>
                            </div>
                            <div style="min-width: 80px; text-align: center; font-size: 18px; font-weight: bold; color: #ff80ff; text-shadow: 0 0 5px rgba(255, 128, 255, 0.3);">
                                +${quest.xpReward} XP
                            </div>
                        </div>
                    `;
                    
                    // Legg til event listener for oppdateringsknappen igjen
                    document.getElementById('refreshQuestBtn').addEventListener('click', arguments.callee);
                    
                    // Vis en liten animasjon for å indikere oppdatering
                    const btn = document.getElementById('refreshQuestBtn');
                    btn.innerHTML = '<i class="fas fa-check"></i> Oppdatert!';
                    btn.style.backgroundColor = 'rgba(46, 204, 113, 0.4)';
                    
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Nytt oppdrag';
                        btn.style.backgroundColor = '';
                    }, 1500);
                    
                    // Gjenopprett boss-boksen etter oppdatering av oppdrag
                    ensureBossBoxExists();
                } else {
                    // Hvis boksen ikke finnes, tegn alt på nytt
                    addDailyQuestsInline();
                }
            });
        }
    } catch (error) {
        console.error('Feil i addDailyQuestsInline:', error);
    }
}

// Hjelpefunksjon for å sikre at boss-boksen eksisterer
function ensureBossBoxExists() {
    // Vent litt før vi sjekker om boss-boksen finnes
    setTimeout(() => {
        const bossBox = document.getElementById('bossBox');
        if (!bossBox && typeof addBossBox === 'function') {
            console.log('Gjenoppretter boss-boksen');
            
            // Sjekk om boxesContainer finnes
            const boxesContainer = document.getElementById('boxesContainer');
            if (!boxesContainer) {
                console.error('boxesContainer ikke funnet, kan ikke legge til boss-boks');
                return;
            }
            
            // Lagre referanser til eventuelle åpne popups
            const eggPopup = document.querySelector('.egg-popup');
            const achievementPopup = document.querySelector('.achievement-popup');
            
            // Kall addBossBox for å legge til boss-boksen
            addBossBox();
            
            // Sjekk igjen etter en kort stund for å være sikker
            setTimeout(() => {
                const bossBoxCheck = document.getElementById('bossBox');
                if (!bossBoxCheck) {
                    console.log('Boss-boksen ble ikke lagt til, prøver igjen...');
                    addBossBox();
                }
                
                // Gjenopprett eventuelle popups som kan ha blitt fjernet
                if (eggPopup && !document.querySelector('.egg-popup')) {
                    document.body.appendChild(eggPopup);
                }
                
                if (achievementPopup && !document.querySelector('.achievement-popup')) {
                    document.body.appendChild(achievementPopup);
                }
            }, 1000);
        }
    }, 800);
}

// Funksjon for å vise egg-popup
function showEggPopup(unlocked, eggId) {
    // Fjern eksisterende popup hvis den finnes
    const existingPopup = document.querySelector('.egg-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Opprett en div for popupen
    const popup = document.createElement('div');
    popup.className = 'egg-popup popup';
    popup.id = 'eggPopup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
        color: lime;
        border: 2px solid lime;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        z-index: 99999;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 400px;
        pointer-events: auto;
    `;
    
    // Opprett tittel
    const title = document.createElement('div');
    title.className = 'egg-popup-title';
    title.textContent = unlocked ? 'Egg Opplåst!' : 'Egg Låst';
    title.style.cssText = `
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #ffffff;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    `;
    popup.appendChild(title);
    
    // Opprett bilde
    const img = document.createElement('img');
    img.src = `egg${eggId}.png`;
    img.alt = `Egg ${eggId}`;
    img.className = 'egg-popup-image';
    img.style.cssText = `
        width: 120px;
        height: 120px;
        object-fit: contain;
        margin: 10px auto;
        display: block;
        ${!unlocked ? 'filter: grayscale(100%) brightness(50%) drop-shadow(0 0 15px rgba(46, 204, 113, 0.7));' : ''}
    `;
    popup.appendChild(img);
    
    // Opprett melding
    const message = document.createElement('div');
    message.className = 'egg-popup-message';
    if (eggId === '1') {
        message.innerHTML = `
            <div style="font-family: Impact; font-size: 32px; color: #ff0000; text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000; animation: glow 2s ease-in-out infinite;">
                NEVER GIVE UP, NEVER SURRENDER!
            </div>
            <div style="font-size: 18px; margin-top: 10px;">
                Du har låst opp et hemmelig egg!
            </div>
        `;
    } else if (eggId === '2') {
        message.innerHTML = `
            <div style="font-family: Impact; font-size: 32px; color: #00ff00; text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; animation: glowGreen 2s ease-in-out infinite;">
                The Glitch Fixer
            </div>
            <div style="font-size: 18px; margin-top: 10px;">
                Du har låst opp et hemmelig egg!
            </div>
            <div style="font-size: 16px; color: #ffd700; margin-top: 15px;">
                <i class="fas fa-popcorn"></i> Belønning: Popcorn til filmen på fredag!
            </div>
        `;
    } else if (eggId === '3') {
        message.innerHTML = `
            <div style="font-family: Impact; font-size: 32px; color: #00ffff; text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; animation: glowBlue 2s ease-in-out infinite;">
                Uoppfordret rydding av arbeidsområde
            </div>
            <div style="font-size: 18px; margin-top: 10px;">
                Du har låst opp et hemmelig egg!
            </div>
        `;
    } else if (eggId === '4') {
        message.innerHTML = `
            <div style="font-family: Impact; font-size: 32px; color: #00ffff; text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; animation: glowBlue 2s ease-in-out infinite;">
                Utesko inne? NEI!
            </div>
            <div style="font-size: 18px; margin-top: 10px;">
                Du har låst opp et hemmelig egg!
            </div>
        `;
    } else if (eggId === '5') {
        message.innerHTML = `
            <div style="font-family: Impact; font-size: 32px; color: #00ffff; text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; animation: glowBlue 2s ease-in-out infinite;">
                Papir, løft deg
            </div>
            <div style="font-size: 18px; margin-top: 10px;">
                Du har låst opp et hemmelig egg!
            </div>
        `;
    } else {
        message.textContent = unlocked ? 'Du har låst opp et hemmelig egg!' : 'Du har låst et egg igjen';
    }
    message.style.cssText = `
        font-size: 18px;
        margin: 15px 0;
    `;
    popup.appendChild(message);
    
    // Opprett XP-info
    const xpInfo = document.createElement('div');
    xpInfo.className = 'egg-popup-xp';
    xpInfo.textContent = unlocked ? '+5 000 XP til alle spillere' : '-5 000 XP fra alle spillere';
    xpInfo.style.cssText = `
        font-size: 20px;
        font-weight: bold;
        color: #ff80ff;
        margin-bottom: 20px;
        text-shadow: 0 0 5px rgba(255, 128, 255, 0.5);
    `;
    popup.appendChild(xpInfo);
    
    // Opprett lukkeknapp
    const closeButton = document.createElement('button');
    closeButton.className = 'egg-popup-close';
    closeButton.textContent = 'LUKK';
    closeButton.id = 'lukkEggPopup';
    closeButton.style.cssText = `
        background: rgba(0, 0, 0, 0.5);
        color: lime;
        border: 1px solid lime;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        transition: all 0.3s ease;
        display: inline-block;
        margin: 0 auto;
        pointer-events: auto;
        position: relative;
        z-index: 999999;
    `;
    
    // Legg til event listener direkte på knappen
    closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // Stopp event propagation
        popup.classList.remove('show');
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            popup.remove();
        }, 500);
    });
    
    popup.appendChild(closeButton);
    
    // Legg til popup i DOM
    document.body.appendChild(popup);
    
    // Legg til en ekstra event listener direkte på popup-elementet
    popup.addEventListener('click', function(event) {
        if (event.target.classList.contains('egg-popup-close') || event.target.id === 'lukkEggPopup') {
            event.preventDefault();
            event.stopPropagation();
            this.classList.remove('show');
            this.style.opacity = '0';
            this.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (document.body.contains(this)) {
                    this.remove();
                }
            }, 500);
        }
    });
    
    // Vis popup med animasjon
    setTimeout(() => {
        popup.classList.add('show');
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Legg til event listener for å lukke ved klikk på Escape-tasten
    const escapeListener = function(event) {
        if (event.key === 'Escape') {
            popup.classList.remove('show');
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                popup.remove();
                document.removeEventListener('keydown', escapeListener);
            }, 500);
        }
    };
    document.addEventListener('keydown', escapeListener);
    
    // Sikre at boss-boksen fortsatt vises
    setTimeout(() => {
        ensureBossBoxExists();
    }, 600);
}

// Funksjon for å vise achievement-popup
function showQuestAchievementPopup(title, description) {
    // Fjern eksisterende popup hvis den finnes
    const existingPopup = document.querySelector('.quest-achievement-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Opprett ny popup
    const popup = document.createElement('div');
    popup.className = 'quest-achievement-popup popup';
    popup.id = 'questAchievementPopup';
    
    // Sett innhold
    popup.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; padding: 10px;">
            <div style="font-size: 40px; min-width: 50px; text-align: center;">🏆</div>
            <div style="flex-grow: 1;">
                <div style="font-weight: bold; font-size: 18px; margin-bottom: 5px; color: gold;">${title}</div>
                <div style="font-size: 14px; color: white;">${description}</div>
                <div style="font-size: 12px; margin-top: 8px; color: rgba(255, 215, 0, 0.7);">Klikk hvor som helst for å lukke</div>
            </div>
            <button class="achievement-close" style="
                background: none;
                border: none;
                color: gold;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                margin: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            ">×</button>
        </div>
    `;
    
    // Legg til popup i DOM
    document.body.appendChild(popup);
    
    // Vis popup med animasjon
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Legg til event listener for lukkeknappen
    const closeButton = popup.querySelector('.achievement-close');
    if (closeButton) {
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Hindre at klikket bobler opp
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 500);
        });
    }
    
    // Legg til event listener for å lukke ved klikk hvor som helst på popupen
    popup.addEventListener('click', function() {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 500);
    });
    
    // Lukk popup automatisk etter 5 sekunder
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    popup.remove();
                }
            }, 500);
        }
    }, 5000);
}

// Funksjon for å vise level-popup
function showLevelPopup(student, skill, level) {
    // Fjern eksisterende popup hvis den finnes
    const existingPopup = document.querySelector('.level-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Opprett ny popup
    const popup = document.createElement('div');
    popup.className = 'level-popup popup';
    popup.id = 'levelPopup';
    
    // Sett innhold
    popup.innerHTML = `
        <div class="level-popup-title">Nivå ${level} oppnådd!</div>
        <div class="level-popup-student">${student}</div>
        <div class="level-popup-skill">har nådd nivå ${level} i ${skill}</div>
        <div class="level-popup-reward">+${level * 1000} XP</div>
        <button class="level-popup-close">LUKK</button>
    `;
    
    // Legg til popup i DOM
    document.body.appendChild(popup);
    
    // Vis popup med animasjon
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Legg til event listener for lukkeknappen
    const closeButton = popup.querySelector('.level-popup-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 500);
        });
    }
    
    // Lukk popup automatisk etter 5 sekunder
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    popup.remove();
                }
            }, 500);
        }
    }, 5000);
}

// Funksjon for å sikre at popups ikke blir fjernet av andre event listeners
function protectPopups() {
    // Fjern eventuelle eksisterende event listeners som kan påvirke popups
    if (window.popupProtectionAdded) return;
    
    // Legg til en global event listener som stopper event propagation for popups
    document.addEventListener('click', function(event) {
        const clickedOnPopup = event.target.closest('.popup') || 
                              event.target.closest('.egg-popup') || 
                              event.target.closest('.level-popup') || 
                              event.target.closest('.achievement-popup');
        
        // Sjekk om klikket er på lukkeknappen
        const isCloseButton = event.target.classList.contains('egg-popup-close') || 
                             event.target.id === 'lukkEggPopup' ||
                             event.target.classList.contains('level-popup-close') ||
                             event.target.classList.contains('achievement-close');
        
        if (clickedOnPopup && !isCloseButton) {
            // Stopp event propagation for å hindre at andre event listeners fjerner popupen
            event.stopPropagation();
        } else if (isCloseButton) {
            // Hvis det er lukkeknappen, finn nærmeste popup og lukk den
            const popup = event.target.closest('.popup') || 
                         event.target.closest('.egg-popup') || 
                         event.target.closest('.level-popup') || 
                         event.target.closest('.achievement-popup');
            
            if (popup) {
                popup.classList.remove('show');
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    if (document.body.contains(popup)) {
                        popup.remove();
                    }
                }, 500);
            }
        }
    }, true); // Bruk capture-fase for å sikre at denne kjører før andre event listeners
    
    window.popupProtectionAdded = true;
}

// Legg til CSS-stiler for popups
function addPopupStyles() {
    // Sjekk om stilene allerede er lagt til
    if (document.getElementById('popup-styles')) {
        return;
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'popup-styles';
    styleElement.textContent = `
        /* Egg popup stiler */
        .egg-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
            color: lime;
            border: 2px solid lime;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 400px;
            pointer-events: auto !important;
        }
        
        .egg-popup.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .egg-popup-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #ffffff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .egg-popup-image {
            width: 120px;
            height: 120px;
            object-fit: contain;
            margin: 10px auto;
            display: block;
        }
        
        .egg-popup-message {
            font-size: 18px;
            margin: 15px 0;
        }
        
        .egg-popup-xp {
            font-size: 20px;
            font-weight: bold;
            color: #ff80ff;
            margin-bottom: 20px;
            text-shadow: 0 0 5px rgba(255, 128, 255, 0.5);
        }
        
        .egg-popup-close {
            background: rgba(0, 0, 0, 0.5) !important;
            color: lime !important;
            border: 1px solid lime !important;
            padding: 10px 20px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-family: 'Courier New', monospace !important;
            font-size: 16px !important;
            transition: all 0.3s ease !important;
            display: inline-block !important;
            margin: 0 auto !important;
            pointer-events: auto !important;
            position: relative !important;
            z-index: 99999 !important;
            user-select: none !important;
        }
        
        .egg-popup-close:hover {
            background: rgba(0, 255, 0, 0.2) !important;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5) !important;
        }
        
        #lukkEggPopup {
            cursor: pointer !important;
            pointer-events: auto !important;
            z-index: 99999 !important;
        }
        
        /* Quest Achievement popup stiler */
        .quest-achievement-popup {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
            color: gold;
            border: 2px solid gold;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.5s ease;
            max-width: 350px;
            pointer-events: auto !important;
            overflow: hidden;
        }
        
        .quest-achievement-popup.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        /* Level popup stiler */
        .level-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
            color: #00bfff;
            border: 2px solid #00bfff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 191, 255, 0.5);
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 400px;
            pointer-events: auto !important;
        }
        
        .level-popup.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        
        /* Generelle popup-stiler */
        .popup {
            position: fixed;
            z-index: 9999 !important;
            pointer-events: auto !important;
        }
        
        /* Hindre at popups blir påvirket av andre event listeners */
        .popup * {
            pointer-events: auto !important;
        }
        
        .popup button {
            cursor: pointer !important;
            pointer-events: auto !important;
            z-index: 99999 !important;
        }
        
        .level-popup-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #ffffff;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .level-popup-student {
            font-size: 20px;
            font-weight: bold;
            color: #00bfff;
            margin-bottom: 5px;
        }
        
        .level-popup-skill {
            font-size: 18px;
            margin-bottom: 15px;
        }
        
        .level-popup-reward {
            font-size: 20px;
            font-weight: bold;
            color: #ff80ff;
            margin-bottom: 20px;
            text-shadow: 0 0 5px rgba(255, 128, 255, 0.5);
        }
        
        .level-popup-close {
            background: rgba(0, 0, 0, 0.5);
            color: #00bfff;
            border: 1px solid #00bfff;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer !important;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            transition: all 0.3s ease;
            pointer-events: auto !important;
            z-index: 99999 !important;
        }
        
        .level-popup-close:hover {
            background: rgba(0, 191, 255, 0.2);
            box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Kall funksjonen for å legge til stilene og beskytte popups
addPopupStyles();
protectPopups();

// Legg til en ekstra event listener for lukkeknappen
document.addEventListener('DOMContentLoaded', function() {
    // Legg til en global event listener for lukkeknappen
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('egg-popup-close') || event.target.id === 'lukkEggPopup') {
            const popup = event.target.closest('.egg-popup');
            if (popup) {
                event.preventDefault();
                event.stopPropagation();
                popup.classList.remove('show');
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    if (document.body.contains(popup)) {
                        popup.remove();
                    }
                }, 500);
            }
        }
    });
    
    // Legg også til en event listener for lukkeknappen som bruker delegering
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('egg-popup-close') || event.target.id === 'lukkEggPopup') {
            const popup = event.target.closest('.egg-popup');
            if (popup) {
                event.preventDefault();
                event.stopPropagation();
                popup.classList.remove('show');
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => {
                    if (document.body.contains(popup)) {
                        popup.remove();
                    }
                }, 500);
            }
        }
    });
});

// Eksporter funksjonene til det globale scope
window.showEggPopup = showEggPopup;
window.showLevelPopup = showLevelPopup;
window.showQuestAchievementPopup = showQuestAchievementPopup;

// Funksjon for å teste popups
function testPopups() {
    console.log('Tester popups...');
    
    // Test egg-popup
    showEggPopup(true, 1);
    
    // Test level-popup etter 2 sekunder
    setTimeout(() => {
        showLevelPopup('Test Elev', 'Intelligens', 20);
    }, 2000);
    
    // Test achievement-popup etter 4 sekunder
    setTimeout(() => {
        showQuestAchievementPopup('Prestasjon Oppnådd', 'Du har testet alle popups!');
    }, 4000);
    
    return 'Popup-test startet. Sjekk om alle popups vises riktig.';
}

// Eksporter testfunksjonen til det globale scope
window.testPopups = testPopups; 