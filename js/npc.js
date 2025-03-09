// NPC-system
const npcs = [
    {
        id: 'wade_watts',
        name: 'Wade Watts',
        description: 'Parzival - OASIS\' mest berømte gamer og egg hunter',
        icon: '🎮',
        image: 'images/npcs/wade_watts.webp.webp',
        quests: [
            {
                id: 'egg_hunt_1',
                title: 'Egg Hunter Training',
                description: 'Fullfør en matematikkoppgave, en engelskoppgave, en norskoppgave og en tegneoppgave',
                reward: 5000,
                type: 'challenge',
                progress: 0,
                required: 4
            },
            {
                id: 'hacking_skill_1',
                title: 'Hacking Mastery',
                description: 'Løs to Micro:bit oppgaver og en matematikkoppgave',
                reward: 6000,
                type: 'hacking',
                progress: 0,
                required: 5
            }
        ]
    },
    {
        id: 'art3mis',
        name: 'Art3mis',
        description: 'Den mystiske og dyktige egg hunteren',
        icon: '🎯',
        image: 'images/npcs/art3mis.webp.webp',
        quests: [
            {
                id: 'reading_assistant_1',
                title: 'Reading assistant',
                description: 'Les 30 minutter sammenhengende i en bok valgt av en lærer',
                reward: 6000,
                type: 'reading',
                progress: 0,
                required: 4
            },
            {
                id: 'dragetegneren_1',
                title: 'Dragetegneren',
                description: 'Les 10 minuuter i en selvvalgt bok. Underveis velger du ut minimum 5 ord som kunne vært brukt til å beksrive en drage. Tegn dragen, og gjør den ordentlig både med tanke på farger og detaljer.',
                reward: 7000,
                type: 'dragetegneren',
                progress: 0,
                required: 3
            }
        ]
    },
    {
        id: 'aech',
        name: 'Aech',
        description: 'Den dyktige mekanikeren og raceren',
        icon: '🏎️',
        image: 'images/npcs/aech.webp.webp',
        quests: [
            {
                id: 'fortelling_1',
                title: 'Fortellingen',
                description: 'Skriv en fortelling om en utfordring din avatar møter i OASIS. I fortellingen skal både avatarens styrker og svakheter komme til syne. Avataren din skal til slutt bruke itemset sitt som hjelp til å løse utfordringen.' ,
                reward: 10000,
                type: 'fortelling',
                progress: 0,
                required: 3
            },
            {
                id: 'building_1',
                title: 'Building Master',
                description: 'Bygg en ruin i Minecraft basert på en tegneinstruksjon. Skriv en norsk fortelling om hva som skjedde med byen. Oversett et avsnitt til engelsk.',
                reward: 8000,
                type: 'building',
                progress: 0,
                required: 4
            }
        ]
    },
    {
        id: 'shoto',
        name: 'Shoto',
        description: 'Den mystiske ninja-mesteren',
        icon: '⚔️',
        image: 'images/npcs/shoto.webp.webp',
        quests: [
            {
                id: 'ninja_1',
                title: 'Ninja Training',
                description: 'Fullfør 50 push-ups, 80 situps og 50 hoppesquats. Trenger ikke gjøre alt på en gang En lærer må registrere underveis.',
                reward: 7000,
                type: 'ninja',
                progress: 0,
                required: 5
            },
            {
                id: 'combat_1',
                title: 'Combat Master',
                description: 'Finn info om samuraiene i Japan. Lag en kort powerpoint presentasjon om det u lærte. Lag til slutt et samuraitempel i Minecraft ',
                reward: 11000,
                type: 'combat',
                progress: 0,
                required: 4
            }
        ]
    },
    {
        id: 'i_r0k',
        name: 'I-R0k',
        description: 'Den fryktede PvP-mesteren og rivalen',
        icon: '⚔️',
        image: 'images/npcs/irok.webp.webp',
        quests: [
            {
                id: 'fysak_hacker_1',
                title: 'Fysak hackeren',
                description: 'Programmer en Micro:bit til å gi tilfeldige oppgaver (f.eks. "Gjør 10 pushups" eller "20 froskehopp"). Gjør øvelsen som Micro:bit velger. Gjenta tre ganger.',
                reward: 10000,
                type: 'fysak',
                progress: 0,
                required: 5
            },
            {
                id: 'combat_skill_1',
                title: 'Combat Excellence',
                description: 'Programmer to Micro:bit til å spille stein-saks-papir. Dueller mot 10 medelever, og fortsett helt til du har vunnet flere dueller enn du har tapt.',
                reward: 10000,
                type: 'combat',
                progress: 0,
                required: 4
            }
        ]
    },
    {
        id: 'ogden_morrow',
        name: 'Ogden Morrow',
        description: 'OASIS\' medgrunnlegger og legendarisk programmerer',
        icon: '💻',
        image: 'images/npcs/ogden_morrow.webp.webp',
        quests: [
            {
                id: 'architect_1',
                title: 'The Architects challenge',
                description: 'Skriv en detaljert tekst om hvordan ditt hus i Oasis ser ut. Tegn et hus basert på svaret. Bygg huset i Minecraft eller med Lego.',
                reward: 12000,
                type: 'architect',
                progress: 0,
                required: 4
            },
            {
                id: 'dikteren_1',
                title: 'Dikteren',
                description: 'Få utlevert et dikt av læreren din. Lær deg diktet utenatt, og si det til en lærer. Gjenta til du får det til helt korrekt.',
                reward: 6000,
                type: 'dikteren',
                progress: 0,
                required: 3
            }
        ]
    }
];

// Funksjon for å åpne NPC-panelet
function openNPCPanel() {
    const modal = document.getElementById('npcModal');
    
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
    
    // Oppdater student dropdown
    updateNPCStudentDropdown();
    
    // Vis modal
    modal.style.display = 'block';
    
    // Legg til show-klassen for å aktivere animasjonen
    setTimeout(() => {
        modal.classList.add('show');
        modal.style.opacity = '1';
        modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Legg til klikk-hendelse for å lukke modal ved klikk på backdrop
    backdrop.addEventListener('click', function() {
        closeNPCPanel();
    });
    
    // Vis alle NPCer
    displayNPCs();
}

// Funksjon for å lukke NPC-panelet
function closeNPCPanel() {
    const modal = document.getElementById('npcModal');
    if (modal) {
        // Legg til en fade-out animasjon
        modal.classList.remove('show');
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            // Tilbakestill stilen for neste gang modalen åpnes
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
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

// Funksjon for å oppdatere student dropdown i NPC-panelet
function updateNPCStudentDropdown() {
    const select = document.getElementById('npcStudentSelect');
    select.innerHTML = '<option value="">Velg elev...</option>';
    
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = student.name;
        select.appendChild(option);
    });
    
    // Legg til change event listener
    select.addEventListener('change', function() {
        const studentIndex = parseInt(this.value);
        if (studentIndex >= 0) {
            displayNPCs(studentIndex);
        }
    });
}

// Funksjon for å vise NPCer
function displayNPCs(studentIndex = null) {
    const container = document.getElementById('npcContainer');
    container.innerHTML = '';
    
    npcs.forEach(npc => {
        const npcElement = createNPCElement(npc, studentIndex);
        container.appendChild(npcElement);
    });
}

// Funksjon for å lage et NPC-element
function createNPCElement(npc, studentIndex) {
    const npcElement = document.createElement('div');
    npcElement.className = 'npc-card';
    
    // Stil for NPC-kortet
    npcElement.style.cssText = `
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.9));
        border: 2px solid #3498db;
        box-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        gap: 20px;
    `;
    
    // Legg til hover-effekter
    npcElement.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.8)';
    });
    
    npcElement.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.5)';
    });
    
    // Legg til klikk-hendelse for å vise oppdrag
    npcElement.addEventListener('click', function() {
        displayQuests(npc, studentIndex);
    });
    
    // Opprett innhold
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
        display: flex;
        align-items: center;
        width: 100%;
    `;
    
    // Legg til bilde
    const imageDiv = document.createElement('div');
    imageDiv.style.cssText = `
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #3498db;
        box-shadow: 0 0 15px rgba(52, 152, 219, 0.3);
        flex-shrink: 0;
    `;
    
    const image = document.createElement('img');
    image.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    `;
    
    // Legg til feilsøking for bildevisningen
    image.onerror = function() {
        console.error('Kunne ikke laste bilde:', npc.image);
        // Fallback til emoji hvis bilde ikke lastes
        const fallbackDiv = document.createElement('div');
        fallbackDiv.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            background: rgba(52, 152, 219, 0.1);
            border-radius: 50%;
        `;
        fallbackDiv.textContent = npc.icon;
        imageDiv.innerHTML = '';
        imageDiv.appendChild(fallbackDiv);
    };
    
    image.src = npc.image;
    image.alt = npc.name;
    imageDiv.appendChild(image);
    contentDiv.appendChild(imageDiv);
    
    // Legg til informasjon
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = `
        flex-grow: 1;
    `;
    
    // Legg til navn
    const nameDiv = document.createElement('div');
    nameDiv.style.cssText = `
        color: #3498db;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
    `;
    nameDiv.textContent = npc.name;
    infoDiv.appendChild(nameDiv);
    
    // Legg til beskrivelse
    const descDiv = document.createElement('div');
    descDiv.style.cssText = `
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
        line-height: 1.4;
        flex: 1;
        box-sizing: border-box;
    `;
    descDiv.textContent = npc.description;
    infoDiv.appendChild(descDiv);
    
    contentDiv.appendChild(infoDiv);
    npcElement.appendChild(contentDiv);
    
    return npcElement;
}

// Funksjon for å vise oppdrag
function displayQuests(npc, studentIndex) {
    const container = document.getElementById('questContainer');
    container.innerHTML = '';
    
    // Legg til tittel
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = `
        color: #3498db;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
        text-align: center;
    `;
    titleDiv.textContent = `${npc.name}s oppdrag`;
    container.appendChild(titleDiv);
    
    // Vis oppdrag
    npc.quests.forEach(quest => {
        const questElement = createQuestElement(quest, studentIndex);
        container.appendChild(questElement);
    });
    
    // Legg til advarsel hvis ingen elev er valgt
    if (studentIndex === null) {
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            background: rgba(231, 76, 60, 0.2);
            border: 1px solid #e74c3c;
            color: #e74c3c;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
            text-align: center;
            font-size: 14px;
        `;
        warningDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Velg en elev for å kunne fullføre oppdrag og motta belønninger!';
        container.appendChild(warningDiv);
    }
}

// Funksjon for å lage et oppdrag-element
function createQuestElement(quest, studentIndex) {
    const questElement = document.createElement('div');
    questElement.className = 'quest-card';
    
    // Stil for oppdragskortet
    questElement.style.cssText = `
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #3498db;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        transition: all 0.3s ease;
        width: 100%;
        box-sizing: border-box;
    `;
    
    // Legg til hover-effekt
    questElement.addEventListener('mouseover', function() {
        this.style.transform = 'translateX(5px)';
        this.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.3)';
    });
    
    questElement.addEventListener('mouseout', function() {
        this.style.transform = 'translateX(0)';
        this.style.boxShadow = 'none';
    });
    
    // Opprett container for all tekst
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
    `;
    
    // Opprett header-container for tittel og belønning
    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
    `;
    
    // Legg til tittel
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = `
        color: #3498db;
        font-size: 16px;
        font-weight: bold;
        flex: 1;
    `;
    titleDiv.textContent = quest.title;
    headerContainer.appendChild(titleDiv);
    
    textContainer.appendChild(headerContainer);
    
    // Opprett container for beskrivelse og belønning
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        width: 100%;
        box-sizing: border-box;
    `;
    
    // Legg til beskrivelse
    const descDiv = document.createElement('div');
    descDiv.style.cssText = `
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
        line-height: 1.4;
        flex: 1;
        box-sizing: border-box;
    `;
    descDiv.textContent = quest.description;
    contentContainer.appendChild(descDiv);
    
    // Opprett belønningsboks
    const rewardBox = document.createElement('div');
    rewardBox.style.cssText = `
        background: linear-gradient(135deg, rgba(241, 196, 15, 0.1), rgba(241, 196, 15, 0.05));
        border: 1px solid #f1c40f;
        border-radius: 6px;
        padding: 10px 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: fit-content;
        flex-shrink: 0;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    `;
    
    // Sjekk om oppdraget er fullført
    const isCompleted = studentIndex !== null && isQuestCompleted(studentIndex, quest.id);

    if (isCompleted) {
        // Endre stil for fullført oppdrag
        rewardBox.style.cssText = `
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(46, 204, 113, 0.05));
            border: 1px solid #2ecc71;
            border-radius: 6px;
            padding: 10px 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: fit-content;
            flex-shrink: 0;
            cursor: not-allowed;
            position: relative;
            opacity: 0.8;
        `;
        
        // Legg til fullført-banner
        const completedBanner = document.createElement('div');
        completedBanner.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: #2ecc71;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            transform: rotate(15deg);
            box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
            z-index: 1;
        `;
        completedBanner.innerHTML = '<i class="fas fa-check-circle"></i> Fullført';
        rewardBox.appendChild(completedBanner);
        
        // Deaktiver hover-effekter og klikk
        rewardBox.style.pointerEvents = 'none';
    } else {
        // Legg til hover-effekt for ikke-fullførte oppdrag
        rewardBox.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 15px rgba(241, 196, 15, 0.3)';
        });
        
        rewardBox.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Legg til klikk-hendelse
        rewardBox.addEventListener('click', function() {
            if (studentIndex !== null) {
                completeQuest(studentIndex, quest);
            }
        });
    }
    
    // XP belønning
    const xpReward = document.createElement('div');
    xpReward.style.cssText = `
        color: ${isCompleted ? '#2ecc71' : '#f1c40f'};
        font-size: 20px;
        font-weight: bold;
        text-shadow: 0 0 10px ${isCompleted ? 'rgba(46, 204, 113, 0.5)' : 'rgba(241, 196, 15, 0.5)'};
    `;
    xpReward.textContent = `${quest.reward} XP`;
    rewardBox.appendChild(xpReward);
    
    // Item belønning
    const itemReward = document.createElement('div');
    itemReward.style.cssText = `
        font-size: 12px;
        color: ${isCompleted ? '#2ecc71' : '#2ecc71'};
        display: flex;
        align-items: center;
        gap: 4px;
    `;
    itemReward.innerHTML = isCompleted ? 
        '<i class="fas fa-check-circle"></i> Belønning mottatt' : 
        '<i class="fas fa-gift"></i> +1 verdifull gjenstand';
    rewardBox.appendChild(itemReward);
    
    contentContainer.appendChild(rewardBox);
    textContainer.appendChild(contentContainer);
    
    questElement.appendChild(textContainer);
    return questElement;
}

// Funksjon for å oppdatere oppdragsfremgang
function updateQuestProgress(studentIndex, questType, amount = 1) {
    const student = students[studentIndex];
    
    // Gå gjennom alle NPCer og deres oppdrag
    npcs.forEach(npc => {
        npc.quests.forEach(quest => {
            if (quest.type === questType) {
                quest.progress += amount;
                
                // Sjekk om oppdraget er fullført
                if (quest.progress >= quest.required) {
                    // Gi belønning
                    student.exp += quest.reward;
                    
                    // Tilbakestill oppdraget
                    quest.progress = 0;
                    
                    // Vis bekreftelsesmelding
                    showQuestCompletedAnimation(quest);
                }
            }
        });
    });
    
    // Lagre endringene
    saveData();
    
    // Oppdater visningen
    updateTable();
    displayNPCs(studentIndex);
}

// Funksjon for å sjekke om et oppdrag er fullført
function isQuestCompleted(studentIndex, questId) {
    const student = students[studentIndex];
    if (!student.completedQuests) {
        student.completedQuests = [];
    }
    return student.completedQuests.includes(questId);
}

// Funksjon for å legge til en gjenstand i ryggsekken
function addItemToBackpack(studentIndex, itemId) {
    const student = students[studentIndex];
    if (!student.items) {
        student.items = [];
    }
    student.items.push(itemId);
    saveData();
    updateItemsDisplay(studentIndex);
}

// Funksjon for å fullføre et oppdrag
function completeQuest(studentIndex, quest) {
    const student = students[studentIndex];
    
    // Sjekk om oppdraget allerede er fullført
    if (isQuestCompleted(studentIndex, quest.id)) {
        showQuestCompletedAnimation(quest, true); // true indikerer at oppdraget allerede er fullført
        return;
    }
    
    // Gi belønning
    student.exp += quest.reward;
    
    // Velg en tilfeldig gjenstand fra de tre beste kategoriene
    const highRarityItems = items.filter(item => 
        item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary'
    );
    const randomItem = highRarityItems[Math.floor(Math.random() * highRarityItems.length)];
    addItemToBackpack(studentIndex, randomItem.id);
    
    // Marker oppdraget som fullført
    if (!student.completedQuests) {
        student.completedQuests = [];
    }
    student.completedQuests.push(quest.id);
    
    // Lagre endringene
    saveData();
    
    // Oppdater visningen
    updateTable();
    displayNPCs(studentIndex);
    
    // Oppdater ryggsekken hvis den er åpen
    const itemBagModal = document.getElementById('itemBagModal');
    if (itemBagModal && itemBagModal.getAttribute('data-student-index') === studentIndex.toString()) {
        updateItemsDisplay(studentIndex);
    }
    
    // Vis popup-melding
    showQuestRewardPopup(quest, randomItem);
}

// Ny funksjon for å vise popup-melding
function showQuestRewardPopup(quest, item) {
    // Bestem bakgrunnsfarge basert på sjeldenhetsgrad
    let rarityColor, rarityGradient;
    switch(item.rarity) {
        case 'rare':
            rarityColor = '#0070dd';
            rarityGradient = 'linear-gradient(135deg, rgba(0, 30, 60, 0.85), rgba(0, 70, 140, 0.9))';
            break;
        case 'epic':
            rarityColor = '#a335ee';
            rarityGradient = 'linear-gradient(135deg, rgba(40, 0, 60, 0.85), rgba(100, 20, 150, 0.9))';
            break;
        case 'legendary':
            rarityColor = '#ff8000';
            rarityGradient = 'linear-gradient(135deg, rgba(60, 30, 0, 0.85), rgba(150, 75, 0, 0.9))';
            break;
    }
    
    // Opprett popup-container
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: ${rarityGradient};
        border: 2px solid ${rarityColor};
        border-radius: 15px;
        padding: 40px;
        color: white;
        text-align: center;
        box-shadow: 0 0 30px ${rarityColor}80;
        z-index: 9999;
        min-width: 400px;
        max-width: 600px;
        font-family: 'Courier New', monospace;
        backdrop-filter: blur(5px);
        animation: popupIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;
    
    // Legg til CSS for animasjoner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popupIn {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes pulse {
            0% { transform: scale(1); text-shadow: 0 0 40px currentColor; }
            50% { transform: scale(1.2); text-shadow: 0 0 60px currentColor; }
            100% { transform: scale(1); text-shadow: 0 0 40px currentColor; }
        }
    `;
    document.head.appendChild(style);
    
    // Opprett innhold
    popup.innerHTML = `
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 20px; color: #3498db; text-shadow: 0 0 10px #3498db;">
            <i class="fas fa-trophy"></i> Oppdrag fullført!
        </div>
        <div style="font-size: 20px; margin-bottom: 15px; color: white; text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);">
            ${quest.title}
        </div>
        <div style="font-size: 28px; color: #f1c40f; margin: 20px 0; text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);">
            +${quest.reward} XP
        </div>
        <div style="font-size: 18px; color: ${rarityColor}; margin: 20px 0; text-shadow: 0 0 5px ${rarityColor};">
            <i class="fas fa-gift"></i> Du fikk:
        </div>
        <div style="font-size: 72px; margin: 10px 0; color: ${rarityColor}; text-shadow: 0 0 20px ${rarityColor}; animation: pulse 2s infinite alternate;">
            ${item.icon}
        </div>
        <div style="font-size: 24px; margin: 10px 0; color: white; text-shadow: 0 0 10px ${rarityColor}; text-transform: uppercase; letter-spacing: 1px;">
            ${item.name}
        </div>
        <div style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin-top: 10px; text-shadow: 0 0 5px rgba(0, 0, 0, 0.5); line-height: 1.4;">
            ${item.description}
        </div>
        <button id="closeQuestPopup" style="
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid ${rarityColor};
            color: white;
            padding: 8px 20px;
            border-radius: 5px;
            margin-top: 20px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        ">
            Lukk
        </button>
    `;
    
    // Legg til popup i DOM
    document.body.appendChild(popup);
    
    // Legg til hover-effekt på lukk-knappen
    const closeButton = popup.querySelector('#closeQuestPopup');
    closeButton.addEventListener('mouseover', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.boxShadow = `0 0 15px rgba(255, 255, 255, 0.3)`;
        this.style.transform = 'translateY(-2px)';
    });
    
    closeButton.addEventListener('mouseout', function() {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        this.style.boxShadow = 'none';
        this.style.transform = 'translateY(0)';
    });
    
    // Legg til klikk-hendelse for lukkeknappen
    closeButton.addEventListener('click', function() {
        popup.style.animation = 'none';
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            popup.remove();
            style.remove();
        }, 300);
    });
    
    // Legg til event listener for å lukke ved klikk på Escape-tasten
    const escapeListener = function(event) {
        if (event.key === 'Escape') {
            popup.style.animation = 'none';
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                popup.remove();
                style.remove();
            }, 300);
            document.removeEventListener('keydown', escapeListener);
        }
    };
    document.addEventListener('keydown', escapeListener);
}

// Modifiser showQuestCompletedAnimation for å håndtere allerede fullførte oppdrag
function showQuestCompletedAnimation(quest, alreadyCompleted = false) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(52, 152, 219, 0.7));
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
        z-index: 9999;
        animation: slideIn 0.5s ease-out;
        min-width: 300px;
    `;
    
    if (alreadyCompleted) {
        notification.innerHTML = `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px; text-align: center; color: #e74c3c;">
                Oppdrag allerede fullført!
            </div>
            <div style="font-size: 16px; margin-bottom: 15px; text-align: center;">
                ${quest.title}
            </div>
            <div style="font-size: 14px; color: #e74c3c; text-align: center; margin-top: 10px;">
                <i class="fas fa-exclamation-circle"></i> Du har allerede fullført dette oppdraget!
            </div>
        `;
    } else {
        notification.innerHTML = `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px; text-align: center;">
                Oppdrag fullført!
            </div>
            <div style="font-size: 16px; margin-bottom: 15px; text-align: center;">
                ${quest.title}
            </div>
            <div style="font-size: 24px; color: #f1c40f; margin: 15px 0; text-align: center; text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);">
                +${quest.reward} XP
            </div>
            <div style="font-size: 14px; color: #2ecc71; text-align: center; margin-top: 10px;">
                <i class="fas fa-gift"></i> Du fikk en verdifull gjenstand!
            </div>
        `;
    }
    
    document.body.appendChild(notification);
    
    // Fjern notifikasjonen etter 4 sekunder
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
} 