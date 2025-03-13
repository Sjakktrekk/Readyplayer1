// Dashboard Status
// Denne filen håndterer "Status"-fanen i dashbordet og kobler den til bossfights og dagens oppdrag

// Globale variabler
let statusBosses = [];
let statusDailyQuests = [];
let statusTabInitialized = false;

// Funksjon for å initialisere status-fanen
function initStatusTab() {
    console.log('Initialiserer Status-fanen...');
    
    // Last inn bossfights og dagens oppdrag
    loadBossFights();
    loadDailyQuests();
    
    // Oppdater status-fanen
    updateStatusTab();
    
    // Marker at status-fanen er initialisert
    statusTabInitialized = true;
    
    // Legg til hover-effekter og animasjoner
    addVisualEffects();
}

// Funksjon for å laste inn bossfights
function loadBossFights() {
    console.log('Laster inn bossfights...');
    
    // Prøv å hente bossfights fra localStorage (lagret av bossfights.js)
    const savedBosses = localStorage.getItem('bosses');
    if (savedBosses) {
        statusBosses = JSON.parse(savedBosses);
        console.log('Bossfights lastet fra localStorage:', statusBosses);
        
        // Legg til ikonklasser hvis de mangler
        statusBosses.forEach(boss => {
            if (!boss.icon) {
                // Sett standard ikoner basert på boss-ID
                switch(boss.id) {
                    case 1: boss.icon = "fas fa-server"; break;
                    case 2: boss.icon = "fas fa-bug"; break;
                    case 3: boss.icon = "fas fa-bolt"; break;
                    default: boss.icon = "fas fa-dragon";
                }
            }
            
            // Legg til navn hvis det mangler
            if (!boss.name) {
                switch(boss.id) {
                    case 1: boss.name = "Server Overload"; break;
                    case 2: boss.name = "Debug Demon"; break;
                    case 3: boss.name = "Strømregning"; break;
                    default: boss.name = `Boss #${boss.id}`;
                }
            }
            
            // Legg til beskrivelse hvis det mangler
            if (!boss.description) {
                switch(boss.id) {
                    case 1: boss.description = "Bekjemp servermonsteret som truer med å overbelaste OASIS."; break;
                    case 2: boss.description = "Finn og eliminer den skjulte feilen i systemet."; break;
                    case 3: boss.description = "Bekjemp den enorme strømregningen som truer med å slukke OASIS."; break;
                    default: boss.description = "En mystisk boss venter på å bli bekjempet.";
                }
            }
        });
    } else {
        // Hvis ingen bossfights er lagret, bruk standardverdier
        statusBosses = [
            {
                id: 1,
                name: "Server Overload",
                description: "Bekjemp servermonsteret som truer med å overbelaste OASIS.",
                unlocked: false,
                progress: 30,
                icon: "fas fa-server"
            },
            {
                id: 2,
                name: "Debug Demon",
                description: "Finn og eliminer den skjulte feilen i systemet.",
                unlocked: false,
                progress: 0,
                icon: "fas fa-bug"
            },
            {
                id: 3,
                name: "Strømregning",
                description: "Bekjemp den enorme strømregningen som truer med å slukke OASIS.",
                unlocked: false,
                progress: 0,
                icon: "fas fa-bolt"
            }
        ];
        console.log('Ingen bossfights funnet i localStorage, bruker standardverdier');
    }
}

// Funksjon for å laste inn dagens oppdrag
function loadDailyQuests() {
    console.log('Laster inn dagens oppdrag...');
    
    // Prøv å hente dagens oppdrag fra localStorage (lagret av quests.js)
    const savedQuests = localStorage.getItem('dailyQuests');
    if (savedQuests) {
        statusDailyQuests = JSON.parse(savedQuests);
        console.log('Dagens oppdrag lastet fra localStorage:', statusDailyQuests);
        
        // Legg til ikoner og fremgang hvis de mangler
        statusDailyQuests.forEach((quest, index) => {
            // Legg til ikon basert på ferdighet
            if (!quest.icon) {
                quest.icon = getFontAwesomeIconForSkill(quest.skill);
            }
            
            // Legg til fremgang hvis det mangler (simulert fremgang)
            if (quest.progress === undefined) {
                // Første oppdraget er 30% fullført, andre er 100% fullført (for demo)
                quest.progress = index === 0 ? 30 : 100;
                quest.status = index === 0 ? 'active' : 'completed';
            }
        });
    } else {
        // Hvis ingen oppdrag er lagret, bruk standardverdier
        statusDailyQuests = [
            {
                id: 1,
                title: "Kode Utfordring",
                description: "Løs dagens kodeutfordring for å få ekstra EXP.",
                skill: "Teknologi",
                xpReward: 5000,
                progress: 30,
                status: "active",
                icon: "fas fa-code"
            },
            {
                id: 2,
                title: "Lesehack",
                description: "Les dokumentasjonen for å få bedre forståelse av OASIS.",
                skill: "Intelligens",
                xpReward: 3000,
                progress: 100,
                status: "completed",
                icon: "fas fa-book"
            }
        ];
        console.log('Ingen oppdrag funnet i localStorage, bruker standardverdier');
    }
}

// Funksjon for å oppdatere status-fanen
function updateStatusTab() {
    console.log('Oppdaterer Status-fanen...');
    
    // Oppdater bossfights
    updateBossFightsStatus();
    
    // Oppdater dagens oppdrag
    updateDailyQuestsStatus();
    
    // Oppdater verdensstatus (statisk informasjon)
    updateWorldStatus();
    
    // Sjekk om progressbarene trenger å animeres
    if (window.needsProgressAnimation) {
        setTimeout(() => {
            animateProgressBars();
            window.needsProgressAnimation = false;
        }, 500);
    }
}

// Funksjon for å oppdatere bossfights-status
function updateBossFightsStatus() {
    console.log('Oppdaterer bossfights-status...');
    
    // Finn bossfights-seksjonen
    const bossFightsSection = document.querySelector('#status-tab .status-section:nth-child(1) .status-cards');
    if (!bossFightsSection) {
        console.error('Fant ikke bossfights-seksjonen');
        return;
    }
    
    // Tøm seksjonen
    bossFightsSection.innerHTML = '';
    
    // Legg til bossfights
    statusBosses.forEach(boss => {
        // Bestem status basert på unlocked-flagget
        let statusClass = 'status-locked';
        let statusText = 'Låst';
        
        if (boss.unlocked) {
            statusClass = 'status-completed';
            statusText = 'Fullført';
        } else if (boss.progress > 0) {
            statusClass = 'status-pending';
            statusText = 'Venter';
        }
        
        // Sikre at progress alltid er definert
        const progress = boss.progress !== undefined ? boss.progress : 0;
        
        // Opprett HTML for boss
        const bossHtml = `
            <div class="status-card" data-boss-id="${boss.id}">
                <div class="status-icon"><i class="${boss.icon || 'fas fa-dragon'}"></i></div>
                <div class="status-title">${boss.name}</div>
                <div class="status-info">Status: <span class="${statusClass}">${statusText}</span></div>
                <div class="status-description">${boss.description}</div>
                <div class="status-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${Math.round(progress)}% fullført</div>
                </div>
            </div>
        `;
        
        // Legg til i seksjonen
        bossFightsSection.innerHTML += bossHtml;
    });
    
    // Legg til animasjoner med forsinkelse
    setTimeout(() => {
        const bossCards = bossFightsSection.querySelectorAll('.status-card');
        bossCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, 100);
}

// Funksjon for å oppdatere dagens oppdrag-status
function updateDailyQuestsStatus() {
    console.log('Oppdaterer dagens oppdrag-status...');
    
    // Finn dagens oppdrag-seksjonen
    const dailyQuestsSection = document.querySelector('#status-tab .status-section:nth-child(2) .status-cards');
    if (!dailyQuestsSection) {
        console.error('Fant ikke dagens oppdrag-seksjonen');
        return;
    }
    
    // Tøm seksjonen
    dailyQuestsSection.innerHTML = '';
    
    // Hvis ingen oppdrag er tilgjengelige, vis en melding
    if (!statusDailyQuests || statusDailyQuests.length === 0) {
        dailyQuestsSection.innerHTML = `
            <div class="status-card">
                <div class="status-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="status-title">Ingen oppdrag tilgjengelig</div>
                <div class="status-description">Kom tilbake senere for nye oppdrag.</div>
            </div>
        `;
        return;
    }
    
    // Legg til dagens oppdrag
    statusDailyQuests.forEach(quest => {
        // Bestem status basert på quest-objektet eller bruk standardverdier
        let statusClass = 'status-active';
        let statusText = 'Aktiv';
        let progress = quest.progress || 0;
        
        if (quest.status === 'completed' || progress >= 100) {
            statusClass = 'status-completed';
            statusText = 'Fullført';
            progress = 100;
        }
        
        // Opprett HTML for oppdraget
        const questHtml = `
            <div class="status-card" data-quest-id="${quest.id}">
                <div class="status-icon"><i class="${quest.icon || getFontAwesomeIconForSkill(quest.skill)}"></i></div>
                <div class="status-title">${quest.title}</div>
                <div class="status-info">Status: <span class="${statusClass}">${statusText}</span></div>
                <div class="status-description">${quest.description}</div>
                <div class="status-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${progress}% fullført</div>
                </div>
            </div>
        `;
        
        // Legg til i seksjonen
        dailyQuestsSection.innerHTML += questHtml;
    });
    
    // Legg til animasjoner med forsinkelse
    setTimeout(() => {
        const questCards = dailyQuestsSection.querySelectorAll('.status-card');
        questCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, 300);
}

// Funksjon for å oppdatere verdensstatus
function updateWorldStatus() {
    console.log('Oppdaterer verdensstatus...');
    
    // Finn verdensstatus-seksjonen
    const worldStatusSection = document.querySelector('#status-tab .status-section:nth-child(3) .status-cards');
    if (!worldStatusSection) {
        console.error('Fant ikke verdensstatus-seksjonen');
        return;
    }
    
    // Tøm seksjonen
    worldStatusSection.innerHTML = '';
    
    // Generer et tilfeldig antall spillere online (for demo)
    const playersOnline = Math.floor(Math.random() * 1000) + 1000;
    
    // Generer en tilfeldig tid for neste event (for demo)
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const eventTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Velg et tilfeldig event (for demo)
    const events = ['Hackathon', 'Kodekamp', 'Quiz', 'Turnering', 'Workshop'];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    
    // Legg til verdensstatus
    const worldStatusHtml = `
        <div class="status-card">
            <div class="status-icon"><i class="fas fa-users"></i></div>
            <div class="status-title">Spillere Online</div>
            <div class="status-value">${playersOnline.toLocaleString()}</div>
        </div>
        <div class="status-card">
            <div class="status-icon"><i class="fas fa-server"></i></div>
            <div class="status-title">Serverstatus</div>
            <div class="status-value status-online">Online</div>
        </div>
        <div class="status-card">
            <div class="status-icon"><i class="fas fa-clock"></i></div>
            <div class="status-title">Neste Event</div>
            <div class="status-value">${eventTime} - ${randomEvent}</div>
        </div>
    `;
    
    // Legg til i seksjonen
    worldStatusSection.innerHTML = worldStatusHtml;
    
    // Legg til animasjoner med forsinkelse
    setTimeout(() => {
        const worldCards = worldStatusSection.querySelectorAll('.status-card');
        worldCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, 500);
}

// Funksjon for å legge til visuelle effekter
function addVisualEffects() {
    // Legg til hover-effekter for status-seksjonene
    const statusSections = document.querySelectorAll('#status-tab .status-section');
    statusSections.forEach(section => {
        // Legg til pulserende effekt på overskriftsikonet
        const icon = section.querySelector('h3 i');
        if (icon) {
            icon.classList.add('pulse-icon');
        }
    });
    
    // Legg til klikk-effekt for status-kort
    const statusCards = document.querySelectorAll('#status-tab .status-card');
    statusCards.forEach(card => {
        card.addEventListener('click', () => {
            // Legg til en kort glød-effekt ved klikk
            card.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 300);
        });
    });
    
    // Legg til scanline-effekt
    const statusTab = document.getElementById('status-tab');
    if (statusTab) {
        // Sjekk om scanline-elementet allerede eksisterer
        if (!document.getElementById('status-scanline')) {
            const scanline = document.createElement('div');
            scanline.id = 'status-scanline';
            scanline.style.position = 'absolute';
            scanline.style.top = '0';
            scanline.style.left = '0';
            scanline.style.width = '100%';
            scanline.style.height = '2px';
            scanline.style.background = 'rgba(0, 255, 255, 0.5)';
            scanline.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.8)';
            scanline.style.zIndex = '10';
            scanline.style.pointerEvents = 'none';
            scanline.style.animation = 'scanline 8s linear infinite';
            
            statusTab.style.position = 'relative';
            statusTab.style.overflow = 'hidden';
            statusTab.appendChild(scanline);
        }
    }
    
    // Animer progressbarer
    animateProgressBars();
}

// Funksjon for å animere progressbarer
function animateProgressBars() {
    // Finn alle progressbarer
    const progressBars = document.querySelectorAll('#status-tab .progress-fill');
    
    // Animer hver progressbar
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        
        // Start med 0% bredde
        bar.style.width = '0%';
        
        // Animer til målbredden
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.12, 0.89, 0.32, 1.28)';
            bar.style.width = targetWidth;
        }, 200);
    });
    
    // Legg til pulserende effekt på fullførte progressbarer
    const completedBars = document.querySelectorAll('#status-tab .status-card[data-boss-id] .progress-fill[style*="width: 100%"]');
    completedBars.forEach(bar => {
        bar.style.animation = 'pulse 2s infinite alternate';
    });
}

// Hjelpefunksjon for å få Font Awesome-ikon basert på ferdighet
function getFontAwesomeIconForSkill(skill) {
    switch (skill) {
        case 'Intelligens':
            return 'fas fa-lightbulb';
        case 'Teknologi':
            return 'fas fa-microchip';
        case 'Stamina':
            return 'fas fa-heartbeat';
        case 'Karisma':
            return 'fas fa-comments';
        case 'Kreativitet':
            return 'fas fa-palette';
        case 'Flaks':
            return 'fas fa-dice';
        default:
            return 'fas fa-question';
    }
}

// Funksjon for å oppdatere status-fanen periodisk
function startStatusUpdater() {
    // Oppdater status-fanen hvert minutt
    setInterval(() => {
        if (document.querySelector('.nav-item[data-tab="status"].active')) {
            loadBossFights();
            loadDailyQuests();
            updateStatusTab();
        }
    }, 60000); // 60000 ms = 1 minutt
}

// Initialiser status-fanen når DOM er lastet
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM lastet, initialiserer status-fanen...');
    
    // Initialiser status-fanen
    initStatusTab();
    
    // Start periodisk oppdatering
    startStatusUpdater();
    
    // Legg til event listener for fanenavigasjon
    const statusNavItem = document.querySelector('.nav-item[data-tab="status"]');
    if (statusNavItem) {
        statusNavItem.addEventListener('click', () => {
            // Oppdater status-fanen når brukeren klikker på den
            if (statusTabInitialized) {
                loadBossFights();
                loadDailyQuests();
                updateStatusTab();
                
                // Animer progressbarer med litt forsinkelse for å sikre at DOM er oppdatert
                setTimeout(() => {
                    animateProgressBars();
                }, 300);
            } else {
                initStatusTab();
            }
        });
    }
    
    // Legg til event listeners for alle faner for å animere progressbarer når brukeren kommer tilbake til Status-fanen
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(item => {
        if (item.dataset.tab !== 'status') {
            item.addEventListener('click', () => {
                // Marker at progressbarene må animeres neste gang Status-fanen vises
                window.needsProgressAnimation = true;
            });
        }
    });
}); 