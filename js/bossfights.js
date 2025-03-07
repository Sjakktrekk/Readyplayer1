// Boss Fights System
const bosses = [
    {
        id: 1,
        name: "Kunnskapens vokter",
        description: "En mektig vokter som tester elevenes kollektive intelligens og kunnskap.",
        icon: "👹", // Dette kan erstattes med en faktisk bildefil
        requirement: {
            type: "level",
            skill: "any", // Hvilken som helst ferdighet
            level: 15,
            description: "Alle elever må nå nivå 15 i minst én ferdighet"
        },
        reward: {
            xp: 10000,
            description: "+10 000 XP til alle elever"
        },
        unlocked: false,
        rewarded: false
    },
    {
        id: 2,
        name: "The Overlord",
        description: "Den ultimate utfordringen som tester elevenes evne til å mestre alle ferdigheter på høyt nivå.",
        icon: "🧙", // Dette kan erstattes med en faktisk bildefil
        requirement: {
            type: "level",
            skill: "any", // Hvilken som helst ferdighet
            level: 30,
            description: "Alle elever må nå nivå 30 i minst én ferdighet"
        },
        reward: {
            xp: 50000,
            description: "Ukjent"
        },
        unlocked: false,
        rewarded: false
    }
];

// Funksjon for å sjekke om boss-kravene er oppfylt
function checkBossRequirements() {
    // Hent alle studenter
    const allStudents = students || [];
    if (allStudents.length === 0) return;

    // Lagre rewarded-status før oppdatering
    const rewardedStatus = bosses.map(boss => ({
        id: boss.id,
        rewarded: boss.rewarded || false
    }));

    bosses.forEach(boss => {
        let progress = 0;
        let totalStudents = allStudents.length;
        let studentsMetRequirement = 0;

        // Sjekk krav basert på type
        if (boss.requirement.type === "level") {
            // Sjekk om alle studenter har nådd det spesifiserte nivået i minst én ferdighet
            allStudents.forEach(student => {
                // Sjekk om studenten har nådd nivået i minst én ferdighet
                const skills = ["Intelligens", "Teknologi", "Stamina", "Karisma", "Kreativitet", "Flaks"];
                const hasReachedLevel = skills.some(skill => {
                    // Hent ferdighetsverdien direkte med riktig casing (stor forbokstav)
                    const skillValue = student[skill] || 0;
                    
                    // Logg for debugging av individuelle ferdigheter
                    if (boss.id === 1) { // Bare logg for første boss for å unngå for mye output
                        console.log(`Student ${student.name}, ${skill}: ${skillValue}, Krav: ${boss.requirement.level}`);
                    }
                    
                    return skillValue >= boss.requirement.level;
                });

                if (hasReachedLevel) {
                    studentsMetRequirement++;
                }
            });

            // Beregn fremgang (prosent av studenter som har oppfylt kravet)
            progress = (studentsMetRequirement / totalStudents) * 100;
            
            // Sjekk om alle studenter har oppfylt kravet
            boss.unlocked = studentsMetRequirement === totalStudents;
        }

        // Lagre fremgangen
        boss.progress = progress;
        
        // Logg for debugging
        console.log(`Boss ${boss.name}: ${studentsMetRequirement}/${totalStudents} studenter oppfyller kravet (${progress.toFixed(1)}%)`);
    });

    // Gjenopprett rewarded-status
    rewardedStatus.forEach(savedStatus => {
        const boss = bosses.find(b => b.id === savedStatus.id);
        if (boss) {
            boss.rewarded = savedStatus.rewarded;
        }
    });

    // Oppdater UI
    updateBossUI();

    // Lagre boss-status i localStorage
    saveBossStatus();
}

// Funksjon for å lagre boss-status i localStorage
function saveBossStatus() {
    localStorage.setItem('bosses', JSON.stringify(bosses));
    
    // Lagre rewarded-status separat
    const rewardedStatus = bosses.map(boss => ({
        id: boss.id,
        rewarded: boss.rewarded || false
    }));
    localStorage.setItem('bosses_rewarded', JSON.stringify(rewardedStatus));
}

// Funksjon for å laste boss-status fra localStorage
function loadBossStatus() {
    const savedBosses = localStorage.getItem('bosses');
    if (savedBosses) {
        const parsedBosses = JSON.parse(savedBosses);
        
        // Oppdater bare unlocked-status og progress, ikke hele objektet
        parsedBosses.forEach((savedBoss, index) => {
            if (index < bosses.length) {
                bosses[index].unlocked = savedBoss.unlocked;
                bosses[index].progress = savedBoss.progress || 0;
            }
        });
    }
    
    // Last inn rewarded-status separat
    const savedRewardedStatus = localStorage.getItem('bosses_rewarded');
    if (savedRewardedStatus) {
        const parsedRewardedStatus = JSON.parse(savedRewardedStatus);
        
        parsedRewardedStatus.forEach(savedStatus => {
            const boss = bosses.find(b => b.id === savedStatus.id);
            if (boss) {
                boss.rewarded = savedStatus.rewarded;
            }
        });
    }
}

// Funksjon for å oppdatere boss UI
function updateBossUI() {
    const bossBox = document.getElementById('bossBox');
    if (!bossBox) return;

    const bossesContainer = bossBox.querySelector('.bosses-container');
    if (!bossesContainer) return;

    // Oppdater hver boss
    bosses.forEach(boss => {
        const bossElement = document.getElementById(`boss-${boss.id}`);
        if (!bossElement) return;

        // Oppdater låsestatus
        const bossIcon = bossElement.querySelector('.boss-icon');
        const bossLock = bossElement.querySelector('.boss-lock');
        const bossName = bossElement.querySelector('.boss-title');
        
        if (boss.unlocked) {
            if (bossIcon) {
                bossIcon.classList.add('unlocked');
                bossIcon.style.filter = 'none';
                bossIcon.style.background = 'radial-gradient(circle, rgba(0,255,0,0.2) 0%, rgba(0,0,0,0.5) 100%)';
                bossIcon.style.border = '2px solid rgba(0, 255, 0, 0.5)';
                if (!bossIcon.style.animation) {
                    bossIcon.style.animation = 'pulse 2s infinite';
                }
            }
            
            if (bossLock) {
                bossLock.innerHTML = '<i class="fas fa-lock-open"></i>';
                bossLock.style.color = 'lime';
                bossLock.style.border = '1px solid lime';
            }
            
            if (bossName) {
                bossName.style.color = 'lime';
            }
        } else {
            if (bossIcon) {
                bossIcon.classList.remove('unlocked');
                bossIcon.style.filter = 'grayscale(100%) brightness(50%)';
                bossIcon.style.background = 'rgba(0, 0, 0, 0.5)';
                bossIcon.style.border = '2px solid rgba(255, 255, 255, 0.2)';
                bossIcon.style.animation = '';
            }
            
            if (bossLock) {
                bossLock.innerHTML = '<i class="fas fa-lock"></i>';
                bossLock.style.color = 'rgba(255, 255, 255, 0.8)';
                bossLock.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            }
            
            if (bossName) {
                bossName.style.color = '#ffffff';
            }
        }

        // Oppdater fremdriftsindikator
        const progressBar = bossElement.querySelector('.boss-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${boss.progress || 0}%`;
            progressBar.style.background = boss.unlocked ? 
                'linear-gradient(90deg, rgba(0,255,0,0.8), rgba(0,255,255,0.8))' : 
                'linear-gradient(90deg, rgba(255,64,64,0.8), rgba(255,128,0,0.8))';
            progressBar.style.boxShadow = `0 0 8px ${boss.unlocked ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 64, 64, 0.5)'}`;
        }
        
        // Oppdater fremdriftstekst
        const progressText = bossElement.querySelector('.boss-progress-text');
        if (progressText) {
            progressText.textContent = boss.unlocked ? 'FULLFØRT' : `${Math.round(boss.progress || 0)}%`;
        }
        
        // Oppdater fremdriftsindikator på boss-ikonet
        const iconProgressBar = bossIcon.querySelector('.boss-progress');
        if (iconProgressBar) {
            iconProgressBar.style.width = `${boss.progress || 0}%`;
        }
    });
}

// Funksjon for å legge til boss-boksen i grensesnittet
function addBossBox() {
    try {
        console.log('addBossBox starter...');
        
        // Last boss-status fra localStorage
        loadBossStatus();
        
        // Initialiser rewarded-status
        initBossRewardedStatus();
        
        // Sjekk boss-krav
        checkBossRequirements();
        
        // Finn container
        const boxesContainer = document.getElementById('boxesContainer');
        if (!boxesContainer) {
            console.error('boxesContainer ikke funnet');
            return;
        }
        
        console.log('boxesContainer funnet:', boxesContainer);
        
        // Fjern eksisterende boss-boks hvis den finnes
        const existingBossBox = document.getElementById('bossBox');
        if (existingBossBox) {
            console.log('Fjerner eksisterende bossBox');
            existingBossBox.remove();
        }
        
        // Fjern eventuelle hengende tooltips
        document.querySelectorAll('.boss-tooltip').forEach(el => el.remove());
        
        // Legg til global event listener for å fjerne tooltips ved klikk
        if (!window.bossTooltipListenerAdded) {
            document.addEventListener('click', function(event) {
                // Sjekk om klikket var på en tooltip, boss-element eller popup
                const clickedOnTooltip = event.target.closest('.boss-tooltip');
                const clickedOnBoss = event.target.closest('.boss-item') || event.target.closest('.boss-icon');
                const clickedOnPopup = event.target.closest('.popup') || 
                                      event.target.closest('.egg-popup') || 
                                      event.target.closest('.level-popup') || 
                                      event.target.closest('.achievement-popup');
                
                // Bare fjern boss-tooltips hvis klikket ikke var på en tooltip, boss-element eller popup
                if (!clickedOnTooltip && !clickedOnBoss && !clickedOnPopup) {
                    document.querySelectorAll('.boss-tooltip').forEach(el => el.remove());
                }
            });
            window.bossTooltipListenerAdded = true;
        }
        
        // Opprett boss-boksen
        const bossBox = document.createElement('div');
        bossBox.id = 'bossBox';
        bossBox.style.cssText = `
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
        const bossTitle = document.createElement('h3');
        bossTitle.style.cssText = `
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
        
        bossTitle.innerHTML = `
            <span>Boss Fights</span>
        `;
        bossBox.appendChild(bossTitle);
        
        // Opprett container for bossene
        const bossesContainer = document.createElement('div');
        bossesContainer.className = 'bosses-container';
        bossesContainer.style.cssText = `
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
            height: calc(100% - 50px);
        `;
        
        // Legg til bosser
        bosses.forEach(boss => {
            const bossElement = document.createElement('div');
            bossElement.className = 'boss-item';
            bossElement.id = `boss-${boss.id}`;
            bossElement.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                width: 45%;
                height: 100%;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            // Hover-effekt
            bossElement.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                bossIcon.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)';
            });
            
            bossElement.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                bossIcon.style.boxShadow = 'none';
            });
            
            // Boss-ikon
            const bossIcon = document.createElement('div');
            bossIcon.className = 'boss-icon';
            bossIcon.textContent = boss.icon;
            bossIcon.style.cssText = `
                font-size: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 70px;
                height: 70px;
                background: ${boss.unlocked ? 'radial-gradient(circle, rgba(0,255,0,0.2) 0%, rgba(0,0,0,0.5) 100%)' : 'rgba(0, 0, 0, 0.5)'};
                border-radius: 50%;
                border: 2px solid ${boss.unlocked ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
                filter: ${boss.unlocked ? 'none' : 'grayscale(100%) brightness(50%)'};
                ${boss.unlocked ? 'animation: pulse 2s infinite;' : ''}
                margin-bottom: 10px;
                position: relative;
                transition: all 0.3s ease;
            `;
            
            // Låseikon
            const bossLock = document.createElement('div');
            bossLock.className = 'boss-lock';
            bossLock.innerHTML = boss.unlocked ? '<i class="fas fa-lock-open"></i>' : '<i class="fas fa-lock"></i>';
            bossLock.style.cssText = `
                position: absolute;
                top: 0;
                right: 0;
                font-size: 16px;
                color: ${boss.unlocked ? 'lime' : 'rgba(255, 255, 255, 0.8)'};
                background: rgba(0, 0, 0, 0.7);
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid ${boss.unlocked ? 'lime' : 'rgba(255, 255, 255, 0.3)'};
            `;
            
            bossIcon.appendChild(bossLock);
            
            // Boss-tittel
            const bossName = document.createElement('div');
            bossName.className = 'boss-title';
            bossName.textContent = boss.name;
            bossName.style.cssText = `
                font-size: 14px;
                font-weight: bold;
                color: ${boss.unlocked ? 'lime' : '#ffffff'};
                text-align: center;
                margin-bottom: 5px;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
            `;
            
            // Legg til tooltip for boss-ikonet
            bossIcon.addEventListener('mouseover', function(event) {
                // Fjern eventuelle eksisterende tooltips først
                document.querySelectorAll('.boss-tooltip').forEach(el => el.remove());
                
                const tooltip = document.createElement('div');
                tooltip.className = 'boss-tooltip';
                tooltip.textContent = boss.name;
                tooltip.style.position = 'absolute';
                tooltip.style.top = (event.clientY + 10) + 'px';
                tooltip.style.left = (event.clientX + 10) + 'px';
                tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '5px';
                tooltip.style.zIndex = '1000';
                tooltip.style.pointerEvents = 'none'; // Gjør at tooltip ikke blokkerer museklikk
                document.body.appendChild(tooltip);
            });
            
            // Fjern tooltip når musen forlater ikonet
            bossIcon.addEventListener('mouseout', function() {
                document.querySelectorAll('.boss-tooltip').forEach(el => el.remove());
            });
            
            // Legg til fremdriftsindikator på boss-ikonet
            const iconProgressBar = document.createElement('div');
            iconProgressBar.className = 'boss-progress';
            iconProgressBar.style.position = 'absolute';
            iconProgressBar.style.bottom = '0';
            iconProgressBar.style.left = '0';
            iconProgressBar.style.height = '5px';
            iconProgressBar.style.backgroundColor = '#4CAF50';
            iconProgressBar.style.width = (boss.progress || 0) + '%';
            iconProgressBar.style.transition = 'width 0.5s ease-in-out';
            iconProgressBar.style.zIndex = '1'; // Sørg for at fremdriftsindikatoren er under andre elementer
            bossIcon.appendChild(iconProgressBar);
            
            // Opprett progressContainer for boss-elementet
            const progressContainer = document.createElement('div');
            progressContainer.className = 'boss-progress-container';
            progressContainer.style.cssText = `
                width: 100%;
                height: 20px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.3);
                margin-top: 5px;
                box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
            `;
            
            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'boss-progress-bar';
            progressBarContainer.style.cssText = `
                height: 100%;
                background: ${boss.unlocked ? 
                    'linear-gradient(90deg, rgba(0,255,0,0.8), rgba(0,255,255,0.8))' : 
                    'linear-gradient(90deg, rgba(255,64,64,0.8), rgba(255,128,0,0.8))'};
                width: ${boss.progress || 0}%;
                transition: width 0.5s ease;
                position: relative;
                box-shadow: 0 0 8px ${boss.unlocked ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 64, 64, 0.5)'};
                z-index: 1;
            `;
            
            const progressTextElement = document.createElement('div');
            progressTextElement.className = 'boss-progress-text';
            progressTextElement.textContent = boss.unlocked ? 'FULLFØRT' : `${Math.round(boss.progress || 0)}%`;
            progressTextElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 13px;
                font-weight: bold;
                text-shadow: 0 0 4px rgba(0, 0, 0, 1);
                white-space: nowrap;
                letter-spacing: 0.5px;
            `;
            
            progressBarContainer.appendChild(progressTextElement);
            progressContainer.appendChild(progressBarContainer);
            
            // Legg til tooltip-funksjonalitet
            bossElement.addEventListener('mouseenter', function(e) {
                // Fjern eventuelle eksisterende tooltips først
                document.querySelectorAll('.boss-tooltip').forEach(el => el.remove());
                
                const tooltip = document.createElement('div');
                tooltip.className = 'boss-tooltip';
                
                tooltip.innerHTML = `
                    <div class="boss-tooltip-title">${boss.name}</div>
                    <div class="boss-tooltip-description">${boss.description}</div>
                    <div style="margin-top: 8px; border-top: 1px solid rgba(0, 255, 0, 0.3); padding-top: 5px;">
                        <div style="font-weight: bold; margin-bottom: 5px;">Krav for å låse opp:</div>
                        <div class="boss-tooltip-requirement">
                            <span>${boss.requirement.description}</span>
                        </div>
                    </div>
                    <div class="boss-tooltip-reward">
                        <div style="font-weight: bold; margin-bottom: 5px;">Belønning:</div>
                        <div>${boss.reward.description}</div>
                    </div>
                    <div style="margin-top: 8px; font-style: italic; font-size: 11px; color: rgba(255, 255, 255, 0.7);">
                        ${boss.unlocked ? 'Klikk for å starte boss-kampen!' : `Fremgang: ${Math.round(boss.progress || 0)}%`}
                    </div>
                `;
                
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0, 0, 0, 0.9);
                    color: lime;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid lime;
                    font-size: 12px;
                    z-index: 1000;
                    pointer-events: none;
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
                    min-width: 200px;
                    text-align: left;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                    top: -120px;
                    left: 50%;
                    transform: translateX(-50%);
                `;
                
                document.body.appendChild(tooltip);
                
                // Posisjonering basert på boss-elementets posisjon
                const rect = this.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width/2) + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                
                // Lagre referanse til tooltip
                this.tooltip = tooltip;
            });
            
            bossElement.addEventListener('mouseleave', function() {
                if (this.tooltip) {
                    this.tooltip.remove();
                    this.tooltip = null;
                }
            });
            
            // Legg til klikk-funksjonalitet for å aktivere boss (hvis opplåst)
            bossElement.addEventListener('click', function() {
                if (boss.unlocked) {
                    // Visuell feedback ved klikk
                    bossIcon.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        bossIcon.style.transform = 'scale(1)';
                    }, 300);
                    
                    // Her kan du legge til kode for å starte boss-kampen
                    // Erstatt alert med en mer elegant løsning
                    const bossModal = document.createElement('div');
                    bossModal.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                    `;
                    
                    const modalContent = document.createElement('div');
                    modalContent.style.cssText = `
                        background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
                        color: lime;
                        border: 2px solid lime;
                        border-radius: 8px;
                        padding: 20px;
                        max-width: 500px;
                        text-align: center;
                        box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
                        animation: modalAppear 0.3s ease;
                    `;
                    
                    // Sjekk om belønning allerede er gitt
                    let rewardMessage = '';
                    if (!boss.rewarded) {
                        // Gi XP til alle elever
                        students.forEach(student => {
                            student.exp += boss.reward.xp;
                        });
                        
                        // Marker at belønning er gitt
                        boss.rewarded = true;
                        
                        // Lagre data og oppdater tabellen
                        saveData();
                        saveBossStatus();
                        updateTable();
                        
                        rewardMessage = `Alle elever har fått ${boss.reward.xp.toLocaleString()} XP!`;
                    } else {
                        rewardMessage = 'Du har allerede fått belønning for denne boss-kampen!';
                    }
                    
                    modalContent.innerHTML = `
                        <div style="font-size: 80px; margin-bottom: 20px;">${boss.icon}</div>
                        <h2 style="margin: 0 0 10px 0; color: #ffffff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);">
                            Boss-kamp mot ${boss.name}!
                        </h2>
                        <p style="margin-bottom: 20px;">${rewardMessage}</p>
                        <button id="closeBossModal" style="
                            background: rgba(0, 0, 0, 0.5);
                            color: lime;
                            border: 1px solid lime;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        ">LUKK</button>
                    `;
                    
                    bossModal.appendChild(modalContent);
                    document.body.appendChild(bossModal);
                    
                    // Legg til lukk-funksjonalitet
                    document.getElementById('closeBossModal').addEventListener('click', function() {
                        bossModal.style.opacity = '0';
                        setTimeout(() => {
                            bossModal.remove();
                        }, 300);
                    });
                } else {
                    // Visuell feedback ved klikk
                    bossIcon.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        bossIcon.style.transform = 'scale(1)';
                    }, 300);
                    
                    // Vis en mer elegant melding enn alert
                    const lockMessage = document.createElement('div');
                    lockMessage.style.cssText = `
                        position: absolute;
                        top: -40px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.8);
                        color: #ff4040;
                        padding: 5px 10px;
                        border-radius: 5px;
                        font-size: 12px;
                        white-space: nowrap;
                        z-index: 100;
                        border: 1px solid #ff4040;
                        animation: fadeInOut 2s forwards;
                    `;
                    lockMessage.textContent = `${boss.requirement.description} for å låse opp`;
                    
                    this.appendChild(lockMessage);
                    
                    setTimeout(() => {
                        lockMessage.remove();
                    }, 2000);
                }
            });
            
            // Legg til elementer i boss-elementet
            bossElement.appendChild(bossIcon);
            bossElement.appendChild(bossName);
            bossElement.appendChild(progressContainer);
            
            // Legg til boss-elementet i containeren
            bossesContainer.appendChild(bossElement);
        });
        
        // Legg til boss-containeren i boss-boksen
        bossBox.appendChild(bossesContainer);
        
        // Legg til boss-boksen i container
        boxesContainer.appendChild(bossBox);
        console.log('bossBox lagt til i boxesContainer');
        
        // Legg til CSS-animasjoner
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, 10px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                80% { opacity: 1; }
                100% { opacity: 0; }
            }
            
            @keyframes modalAppear {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(styleElement);
        
        console.log('addBossBox fullført');
        
    } catch (error) {
        console.error('Feil i addBossBox:', error);
    }
}

// Funksjon for å oppdatere boss-status når studenter endres
function updateBossStatus() {
    console.log("Oppdaterer boss-status...");
    
    // Lagre rewarded-status før oppdatering
    const rewardedStatus = bosses.map(boss => ({
        id: boss.id,
        rewarded: boss.rewarded || false
    }));
    
    // Sjekk boss-krav
    checkBossRequirements();
    
    // Gjenopprett rewarded-status
    rewardedStatus.forEach(savedStatus => {
        const boss = bosses.find(b => b.id === savedStatus.id);
        if (boss) {
            boss.rewarded = savedStatus.rewarded;
        }
    });
    
    // Lagre oppdatert boss-status
    saveBossStatus();
}

// Legg til en funksjon for å manuelt oppdatere boss-status
function forceUpdateBossStatus() {
    console.log("Tvinger oppdatering av boss-status...");
    
    // Logg studentdata for debugging
    console.log("Studentdata før oppdatering:", JSON.stringify(students));
    
    // Last inn studenter på nytt
    if (typeof loadData === 'function') {
        loadData();
        console.log("Studentdata etter loadData():", JSON.stringify(students));
    } else {
        console.warn("loadData-funksjonen er ikke tilgjengelig");
    }
    
    // Last inn boss-status fra localStorage
    loadBossStatus();
    
    // Sjekk boss-krav på nytt
    checkBossRequirements();
    
    // Lagre oppdatert boss-status
    saveBossStatus();
    
    // Oppdater UI
    updateBossUI();
    
    // Fjern og legg til boss-boksen på nytt for å sikre at alt oppdateres
    const existingBossBox = document.getElementById('bossBox');
    if (existingBossBox) {
        existingBossBox.remove();
        console.log("Fjernet eksisterende boss-boks");
    }
    
    // Legg til boss-boksen på nytt
    addBossBox();
    console.log("Boss-boks lagt til på nytt");
    
    return "Boss-status oppdatert!";
}

// Funksjon for å sette ferdighetsnivåer for testing
function setTestSkillLevels(skillName, level) {
    if (!students || students.length === 0) {
        console.error("Ingen studenter funnet");
        return "Ingen studenter funnet";
    }
    
    console.log(`Setter ${skillName} til nivå ${level} for alle studenter...`);
    
    // Sjekk at ferdighetsnavn er gyldig
    const validSkills = ["Intelligens", "Teknologi", "Stamina", "Karisma", "Kreativitet", "Flaks"];
    if (!validSkills.includes(skillName)) {
        console.error(`Ugyldig ferdighetsnavn: ${skillName}`);
        return `Ugyldig ferdighetsnavn: ${skillName}. Gyldige ferdigheter er: ${validSkills.join(", ")}`;
    }
    
    // Oppdater ferdighetsnivå for alle studenter
    students.forEach(student => {
        student[skillName] = level;
    });
    
    // Lagre data
    if (typeof saveData === 'function') {
        saveData();
        console.log("Data lagret");
    } else {
        console.warn("saveData-funksjonen er ikke tilgjengelig");
        localStorage.setItem('students', JSON.stringify(students));
        console.log("Data lagret direkte til localStorage");
    }
    
    // Oppdater boss-status
    forceUpdateBossStatus();
    
    return `${skillName} satt til nivå ${level} for alle studenter`;
}

// Funksjon for å initialisere rewarded-status
function initBossRewardedStatus() {
    console.log("Initialiserer boss rewarded-status...");
    
    // Last inn rewarded-status fra localStorage
    const savedRewardedStatus = localStorage.getItem('bosses_rewarded');
    if (savedRewardedStatus) {
        const parsedRewardedStatus = JSON.parse(savedRewardedStatus);
        
        parsedRewardedStatus.forEach(savedStatus => {
            const boss = bosses.find(b => b.id === savedStatus.id);
            if (boss) {
                boss.rewarded = savedStatus.rewarded;
                console.log(`Boss ${boss.id} (${boss.name}) rewarded status: ${boss.rewarded}`);
            }
        });
    } else {
        console.log("Ingen lagret rewarded-status funnet");
    }
}

// Kall initBossRewardedStatus når scriptet lastes
initBossRewardedStatus();

// Eksporter funksjoner
window.addBossBox = addBossBox;
window.updateBossStatus = updateBossStatus;
window.forceUpdateBossStatus = forceUpdateBossStatus;
window.setTestSkillLevels = setTestSkillLevels;
window.initBossRewardedStatus = initBossRewardedStatus; 