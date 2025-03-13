// Definisjon av items med ikoner, sjeldenhetsgrad og effekter
const items = [
    // RARE ITEMS (sjeldne gjenstander)
    { 
        id: 12, 
        name: "Titansverd", 
        description: "Gir to ekstra muligheter til å vinne en boss-kamp", 
        icon: "⚔️", 
        rarity: "rare"
    },
    { 
        id: 13, 
        name: "Energipotion", 
        description: "Gir dobbel XP på en valgfri oppgave", 
        icon: "🧪", 
        rarity: "rare"
    },
    { 
        id: 14, 
        name: "Magiske sko", 
        description: "Gir dobbel XP i løpeoppgaver", 
        icon: "👟", 
        rarity: "rare"
    },
    { 
        id: 15, 
        name: "Magisk kalkulator", 
        description: "Få ett svar gratis i matteoppgave", 
        icon: "🧮", 
        rarity: "rare"
    },
    { 
        id: 16, 
        name: "Magisk ordbok", 
        description: "Få ett ord gratis i kryssordoppgaver", 
        icon: "📔", 
        rarity: "rare"
    },
    { 
        id: 17, 
        name: "Stjerne", 
        description: "Gir 500 XP når den brukes", 
        icon: "⭐", 
        rarity: "rare"
    },
    
    // EPIC ITEMS (episke gjenstander)
    { 
        id: 18, 
        name: "Gullbarre", 
        description: "Kan brukes til å kjøpe 5 minutter ekstra friminutt eller 500 XP", 
        icon: "🧱", 
        rarity: "epic"
    },
    { 
        id: 19, 
        name: "Tryllestav", 
        description: "Gir 750 XP når den brukes", 
        icon: "🪄", 
        rarity: "epic"
    },
    { 
        id: 20, 
        name: "Gullmynt", 
        description: "Gir 1000 XP når den brukes", 
        icon: "🪙", 
        rarity: "epic"
    },
    { 
        id: 21, 
        name: "Edelstener", 
        description: "Gir 1500 XP når den brukes", 
        icon: "💎", 
        rarity: "epic"
    },
    { 
        id: 22, 
        name: "Stoppeklokke", 
        description: "Stopper tiden i friminutt og gir 10 minutter ekstra", 
        icon: "⏱️", 
        rarity: "epic"
    },
    
    // LEGENDARY ITEMS (legendariske gjenstander)
    { 
        id: 23, 
        name: "Sjelden dragevinge", 
        description: "Når du løser inn denne må Odd Henry eller Morten løse oppgaver for deg i fem minutter", 
        icon: "🐉", 
        rarity: "legendary"
    },
    { 
        id: 24, 
        name: "Magisk krystall", 
        description: "Gir 2000 XP når den brukes", 
        icon: "🔮", 
        rarity: "legendary"
    },
    
    // NYE GJENSTANDER
    { 
        id: 25, 
        name: "Eldgammel bok", 
        description: "Gir +200XP på alle oppgaver du gjør resten av dagen", 
        icon: "📚", 
        rarity: "epic"
    },
    { 
        id: 26, 
        name: "Lykkehatt", 
        description: "Gir deg dobbel XP på neste oppgave", 
        icon: "🎩", 
        rarity: "rare"
    },
    { 
        id: 27, 
        name: "Magisk hammer", 
        description: "Lar deg fullføre en Minecraftoppgave uten å bygge den", 
        icon: "🔨", 
        rarity: "rare"
    },
    { 
        id: 28, 
        name: "Drageøye", 
        description: "Gir 1600 XP når den brukes", 
        icon: "👁️", 
        rarity: "epic"
    },
    { 
        id: 29, 
        name: "Skjebneterning", 
        description: "Hvis du ruller en femmer eller en sekser, får du 2000 XP – hvis ikke taper du 500 XP", 
        icon: "🎲", 
        rarity: "epic"
    },
    { 
        id: 30, 
        name: "Alliansebånd", 
        description: "Lar deg dele XP med en annen spiller i denne økta", 
        icon: "🔗", 
        rarity: "rare"
    },
    { 
        id: 31, 
        name: "Gullfjær", 
        description: "Gir 500 XP - Noen sier den kom fra en gyllen høne. Andre sier den kom fra en drage. Hvem vet?", 
        icon: "🪶", 
        rarity: "rare"
    },
    { 
        id: 32, 
        name: "Tryllestav", 
        description: "Gir 750 XP - Abrakadabra! Poff! Boom! Hæ? Hvor ble du av?", 
        icon: "✨", 
        rarity: "epic"
    },
    { 
        id: 33, 
        name: "Gullmynt", 
        description: "Gir 1000 XP - Helt ærlig, burde vært verdt mer!", 
        icon: "💰", 
        rarity: "epic"
    },
    { 
        id: 34, 
        name: "Sølvdråpe", 
        description: "Gir 1000 XP - Ser ut som en tåre… kanskje av glede?", 
        icon: "💧", 
        rarity: "epic"
    },
    { 
        id: 35, 
        name: "Magisk krystall", 
        description: "Gir 2000 XP - Den snakker til deg… eller kanskje det bare er innbilning?", 
        icon: "💠", 
        rarity: "legendary"
    },
    { 
        id: 36, 
        name: "Tidsrull", 
        description: "Gir 2000 XP - Gir deg XP og en følelse av at du har glemt noe viktig!", 
        icon: "📜", 
        rarity: "legendary"
    },
    { 
        id: 37, 
        name: "Mini-svart hull", 
        description: "Gir 2000 XP - Du kan ikke se det, men det gir deg XP. Ikke mist det!", 
        icon: "⚫", 
        rarity: "legendary"
    },
    
    // NYE EQUIPMENT ITEMS - HODE
    { 
        id: 38, 
        name: "Cyberpunk Hjelm", 
        description: "Øker Intelligens med +2 når utstyrt", 
        icon: "🪖", 
        rarity: "rare",
        slot: "head",
        stats: { Intelligens: 2 }
    },
    { 
        id: 39, 
        name: "Neon Hodetelefoner", 
        description: "Øker Teknologi med +2 når utstyrt", 
        icon: "🎧", 
        rarity: "epic",
        slot: "head",
        stats: { Teknologi: 2 }
    },
    { 
        id: 40, 
        name: "Virtuell Virkelighets Briller", 
        description: "Øker Kreativitet med +3 når utstyrt", 
        icon: "🥽", 
        rarity: "legendary",
        slot: "head",
        stats: { Kreativitet: 3 }
    },
    
    // NYE EQUIPMENT ITEMS - BRYST
    { 
        id: 41, 
        name: "Kevlar Vest", 
        description: "Øker Stamina med +2 når utstyrt", 
        icon: "🦺", 
        rarity: "rare",
        slot: "chest",
        stats: { Stamina: 2 }
    },
    { 
        id: 42, 
        name: "Holografisk Rustning", 
        description: "Øker Teknologi med +2 og Stamina med +1 når utstyrt", 
        icon: "🛡️", 
        rarity: "epic",
        slot: "chest",
        stats: { Teknologi: 2, Stamina: 1 }
    },
    { 
        id: 43, 
        name: "Quantum Brystplate", 
        description: "Øker alle stats med +1 når utstyrt", 
        icon: "⚡", 
        rarity: "legendary",
        slot: "chest",
        stats: { Intelligens: 1, Teknologi: 1, Stamina: 1, Karisma: 1, Kreativitet: 1, Flaks: 1 }
    },
    
    // NYE EQUIPMENT ITEMS - HENDER
    { 
        id: 44, 
        name: "Taktiske Hansker", 
        description: "Øker Stamina med +2 når utstyrt", 
        icon: "🧤", 
        rarity: "rare",
        slot: "hands",
        stats: { Stamina: 2 }
    },
    { 
        id: 45, 
        name: "Hackerhansker", 
        description: "Øker Teknologi med +3 når utstyrt", 
        icon: "🧠", 
        rarity: "epic",
        slot: "hands",
        stats: { Teknologi: 3 }
    },
    { 
        id: 46, 
        name: "Magiske Hansker", 
        description: "Øker Flaks med +3 og Kreativitet med +1 når utstyrt", 
        icon: "✨", 
        rarity: "legendary",
        slot: "hands",
        stats: { Flaks: 3, Kreativitet: 1 }
    },
    
    // NYE EQUIPMENT ITEMS - BEIN
    { 
        id: 47, 
        name: "Taktiske Bukser", 
        description: "Øker Stamina med +2 når utstyrt", 
        icon: "👖", 
        rarity: "rare",
        slot: "legs",
        stats: { Stamina: 2 }
    },
    { 
        id: 48, 
        name: "Neon Leggings", 
        description: "Øker Karisma med +3 når utstyrt", 
        icon: "🦿", 
        rarity: "epic",
        slot: "legs",
        stats: { Karisma: 3 }
    },
    { 
        id: 49, 
        name: "Gravitasjons Bukser", 
        description: "Øker Stamina med +2 og Flaks med +2 når utstyrt", 
        icon: "🌌", 
        rarity: "legendary",
        slot: "legs",
        stats: { Stamina: 2, Flaks: 2 }
    },
    
    // NYE EQUIPMENT ITEMS - FØTTER
    { 
        id: 50, 
        name: "Løpesko", 
        description: "Øker Stamina med +2 når utstyrt", 
        icon: "👟", 
        rarity: "rare",
        slot: "feet",
        stats: { Stamina: 2 }
    },
    { 
        id: 51, 
        name: "Jetboots", 
        description: "Øker Teknologi med +2 og Stamina med +1 når utstyrt", 
        icon: "🚀", 
        rarity: "epic",
        slot: "feet",
        stats: { Teknologi: 2, Stamina: 1 }
    },
    { 
        id: 52, 
        name: "Kvantestøvler", 
        description: "Øker Flaks med +3 og Stamina med +1 når utstyrt", 
        icon: "⚡", 
        rarity: "legendary",
        slot: "feet",
        stats: { Flaks: 3, Stamina: 1 }
    },
    
    // NYE EQUIPMENT ITEMS - TILBEHØR
    { 
        id: 53, 
        name: "Lykkeamulett", 
        description: "Øker Flaks med +2 når utstyrt", 
        icon: "🍀", 
        rarity: "rare",
        slot: "accessory",
        stats: { Flaks: 2 }
    },
    { 
        id: 54, 
        name: "Holografisk Armbånd", 
        description: "Øker Karisma med +2 og Teknologi med +1 når utstyrt", 
        icon: "💫", 
        rarity: "epic",
        slot: "accessory",
        stats: { Karisma: 2, Teknologi: 1 }
    },
    { 
        id: 55, 
        name: "Tidskrystall", 
        description: "Øker Intelligens med +2 og Kreativitet med +2 når utstyrt", 
        icon: "💎", 
        rarity: "legendary",
        slot: "accessory",
        stats: { Intelligens: 2, Kreativitet: 2 }
    }
];

// Gjør items-arrayen tilgjengelig globalt
window.items = items;

// Funksjon for å åpne itembag-modalen
function openItemBagModal(studentIndex) {
    const student = students[studentIndex];
    const modal = document.getElementById('itemBagModal');
    
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
    
    // Sett data-student-index attributt på modalen
    modal.setAttribute('data-student-index', studentIndex);
    
    // Oppdater tittel med studentens navn
    const titleElement = modal.querySelector('h2');
    if (titleElement) {
        titleElement.innerHTML = `
            <i class="fas fa-cube" style="margin-right: 15px; font-size: 24px;"></i>
            OASIS INVENTORY: ${student.name}
            <i class="fas fa-cube" style="margin-left: 15px; font-size: 24px;"></i>
        `;
    }
    
    // Skjul achievements-modal hvis den er åpen
    const achievementsModal = document.getElementById('achievementsModal');
    if (achievementsModal) {
        achievementsModal.classList.remove('show');
        setTimeout(() => {
            achievementsModal.style.display = 'none';
        }, 300);
    }
    
    // Vis den nye cyberpunk-stilen for ryggsekk-modalen
    const itemCount = student.items ? student.items.length : 0;
    const maxSlots = 20;
    
    // Beregn power level basert på gjenstandene (beholdes for rarity boost)
    let powerLevel = 0;
    let rarityBoost = 0;
    
    if (student.items && student.items.length > 0) {
        student.items.forEach(itemId => {
            const item = items.find(i => i.id === itemId);
            if (item) {
                // Legg til power basert på sjeldenhetsgrad (for rarity boost)
                if (item.rarity === 'rare') powerLevel += 5;
                else if (item.rarity === 'epic') powerLevel += 10;
                else if (item.rarity === 'legendary') powerLevel += 25;
                
                // Øk rarity boost
                if (item.rarity === 'rare') rarityBoost += 2;
                else if (item.rarity === 'epic') rarityBoost += 5;
                else if (item.rarity === 'legendary') rarityBoost += 10;
            }
        });
    }
    
    // Vis modal
    modal.style.display = 'block';
    
    // Legg til show-klassen for å aktivere animasjonen
    setTimeout(() => {
        modal.classList.add('show');
        
        // Sikre at modalen er synlig (på grunn av inline-stiler)
        modal.style.opacity = '1';
        modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Legg til klikk-hendelse for å lukke modal ved klikk på backdrop
    backdrop.addEventListener('click', function() {
        closeItemBagModal();
    });
    
    // Oppdater statistikk
    setTimeout(() => {
        const itemSlotsElement = document.getElementById('itemSlots');
        const rarityBoostElement = document.getElementById('rarityBoost');
        const powerLevelElement = document.getElementById('powerLevel');
        
        if (itemSlotsElement) itemSlotsElement.textContent = `${itemCount}/${maxSlots}`;
        if (rarityBoostElement) rarityBoostElement.textContent = `+${rarityBoost}%`;
        if (powerLevelElement) powerLevelElement.textContent = student.exp.toLocaleString();
        
        // Oppdater visningen av gjenstander
        updateItemsDisplay(studentIndex);
    }, 100);
    
    // Oppdater equipment slots
    updateEquipmentDisplay(studentIndex);
}

// Funksjon for å lukke itembag-modalen
function closeItemBagModal() {
    const modal = document.getElementById('itemBagModal');
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
    
    // Lukk achievement-modalen hvis den finnes
    const achievementsModal = document.getElementById('achievementsModal');
    if (achievementsModal) {
        achievementsModal.classList.remove('show');
        setTimeout(() => {
            achievementsModal.remove();
        }, 300);
    }
}

// Oppdatert funksjon for å vise gjenstander
function updateItemsDisplay(studentIndex) {
    console.log('updateItemsDisplay kalt med studentIndex:', studentIndex);
    
    // Sjekk om studentIndex er gyldig
    if (studentIndex === null || studentIndex === undefined || !students[studentIndex]) {
        console.error('Ugyldig studentIndex:', studentIndex);
        return;
    }
    
    try {
        const student = students[studentIndex];
        const itemsContainer = document.getElementById('itemsContainer');
        if (!itemsContainer) {
            console.error('itemsContainer ikke funnet i DOM');
            return;
        }
        
        // Tøm containeren
        itemsContainer.innerHTML = '';
        
        // Sjekk om studenten har gjenstander
        if (!student.items || student.items.length === 0) {
            console.log('Studenten har ingen gjenstander');
            itemsContainer.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px 20px;
                    color: rgba(255, 255, 255, 0.5);
                    font-style: italic;
                    font-family: 'Courier New', monospace;
                    border: 1px dashed rgba(255, 255, 255, 0.3);
                    border-radius: 8px;
                    background: rgba(0, 0, 0, 0.3);
                ">
                    <i class="fas fa-backpack" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                    RYGGSEKKEN ER TOM<br>
                    <span style="font-size: 14px; opacity: 0.7; margin-top: 10px; display: block;">Kjøp gjenstander i Oasis-butikken eller få tilfeldige gjenstander ved level up!</span>
                </div>
            `;
            return;
        }
        
        console.log('Studenten har', student.items.length, 'gjenstander');
        
        // Vis hver gjenstand
        student.items.forEach(itemId => {
            try {
                // Prøv først å finne gjenstanden i vanlige items
                let item = window.items.find(i => i.id === itemId);
                
                // Hvis ikke funnet, prøv å finne i shopItems
                if (!item && typeof shopItems !== 'undefined' && shopItems) {
                    item = shopItems.find(i => i.id === itemId);
                }
                
                // Hvis fortsatt ikke funnet, opprett en enkel gjenstand basert på ID
                if (!item) {
                    console.warn('Kunne ikke finne gjenstand med ID:', itemId, 'oppretter enkel gjenstand');
                    item = {
                        id: itemId,
                        name: `Gjenstand ${itemId}`,
                        description: 'Beskrivelse ikke tilgjengelig',
                        icon: '📦',
                        rarity: 'common',
                        type: 'Ukjent'
                    };
                }
                
                console.log('Viser gjenstand:', item.name, '(ID:', item.id, ')');
                // Bestem farge basert på sjeldenhetsgrad
                let rarityColor, rarityGlow, rarityName;
                
                // Hvis det er en butikk-gjenstand, bruk gullfarge
                if (typeof shopItems !== 'undefined' && shopItems && shopItems.some(i => i.id === item.id)) {
                    rarityColor = '#f1c40f';
                    rarityGlow = 'rgba(241, 196, 15, 0.5)';
                    rarityName = 'BUTIKK';
                } else {
                    switch(item.rarity) {
                        case 'rare':
                            rarityColor = '#3498db';
                            rarityGlow = 'rgba(52, 152, 219, 0.5)';
                            rarityName = 'SJELDEN';
                            break;
                        case 'epic':
                            rarityColor = '#9b59b6';
                            rarityGlow = 'rgba(155, 89, 182, 0.5)';
                            rarityName = 'EPISK';
                            break;
                        case 'legendary':
                            rarityColor = '#f1c40f';
                            rarityGlow = 'rgba(241, 196, 15, 0.5)';
                            rarityName = 'LEGENDARISK';
                            break;
                        default:
                            rarityColor = '#ffffff';
                            rarityGlow = 'rgba(255, 255, 255, 0.5)';
                            rarityName = 'UKJENT';
                    }
                }
                
                // Opprett gjenstandskortet med cyberpunk-stil
                const itemElement = document.createElement('div');
                itemElement.className = 'item-card';
                itemElement.setAttribute('data-rarity', item.rarity);
                itemElement.setAttribute('data-item-id', item.id);
                
                // Legg til spesielle effekter for legendariske gjenstander
                const legendaryEffect = item.rarity === 'legendary' ? 
                    `animation: pulse-glow 2s infinite alternate;
                     background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.9));` : '';
                
                itemElement.style.cssText = `
                    position: relative;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(10, 10, 20, 0.8));
                    border: 2px solid ${rarityColor};
                    border-radius: 8px;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    transition: all 0.3s ease;
                    min-height: 180px;
                    box-shadow: 0 0 10px ${rarityGlow};
                    overflow: hidden;
                    ${legendaryEffect}
                `;
                
                // Legg til holografisk overlay for cyberpunk-følelse
                const holographicOverlay = document.createElement('div');
                holographicOverlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        repeating-linear-gradient(90deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 0px, 
                        rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 1px, transparent 1px, transparent 10px),
                        repeating-linear-gradient(0deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 0px, 
                        rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.03) 1px, transparent 1px, transparent 10px);
                    pointer-events: none;
                    z-index: 1;
                `;
                itemElement.appendChild(holographicOverlay);
                
                // Legg til innhold
                const contentDiv = document.createElement('div');
                contentDiv.style.cssText = `
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                `;
                
                // Legg til sjeldenhetsmerke
                const rarityBadge = document.createElement('div');
                rarityBadge.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: ${rarityColor};
                    color: #000;
                    font-size: 10px;
                    padding: 3px 6px;
                    border-radius: 3px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 0 5px ${rarityGlow};
                `;
                rarityBadge.textContent = rarityName;
                contentDiv.appendChild(rarityBadge);
                
                // Legg til slot-merke hvis gjenstanden kan equippes
                if (item.slot) {
                    const slotNames = {
                        head: 'Hode',
                        chest: 'Bryst',
                        hands: 'Hender',
                        legs: 'Bein',
                        feet: 'Føtter',
                        accessory: 'Tilbehør'
                    };
                    
                    const slotBadge = document.createElement('div');
                    slotBadge.style.cssText = `
                        position: absolute;
                        top: -5px;
                        left: -5px;
                        background: rgba(0, 255, 255, 0.7);
                        color: #000;
                        font-size: 10px;
                        padding: 3px 6px;
                        border-radius: 3px;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
                    `;
                    slotBadge.textContent = slotNames[item.slot];
                    contentDiv.appendChild(slotBadge);
                }
                
                // Legg til ikon
                const iconDiv = document.createElement('div');
                iconDiv.style.cssText = `
                    font-size: 48px;
                    margin: 10px 0;
                    text-shadow: 0 0 10px ${rarityGlow};
                `;
                iconDiv.textContent = item.icon;
                contentDiv.appendChild(iconDiv);
                
                // Legg til navn
                const nameDiv = document.createElement('div');
                nameDiv.style.cssText = `
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: ${rarityColor};
                    text-shadow: 0 0 5px ${rarityGlow};
                `;
                nameDiv.textContent = item.name;
                contentDiv.appendChild(nameDiv);
                
                // Legg til beskrivelse
                const descDiv = document.createElement('div');
                descDiv.style.cssText = `
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 10px;
                    flex-grow: 1;
                `;
                descDiv.textContent = item.description;
                contentDiv.appendChild(descDiv);
                
                // Legg til knapper
                const buttonsDiv = document.createElement('div');
                buttonsDiv.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-top: auto;
                `;
                
                // Bruk-knapp
                const useButton = document.createElement('button');
                useButton.style.cssText = `
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid ${rarityColor};
                    color: ${rarityColor};
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    transition: all 0.3s ease;
                    flex: 1;
                    margin-right: 5px;
                    text-shadow: 0 0 5px ${rarityGlow};
                `;
                useButton.textContent = item.slot ? 'UTSTYR' : 'BRUK';
                useButton.onmouseover = function() {
                    this.style.background = `rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2)`;
                    this.style.transform = 'scale(1.05)';
                };
                useButton.onmouseout = function() {
                    this.style.background = 'rgba(0, 0, 0, 0.5)';
                    this.style.transform = 'scale(1)';
                };
                
                // Legg til klikk-hendelse for bruk-knappen
                useButton.onclick = function(event) {
                    event.stopPropagation(); // Hindre at item-kortet også reagerer på klikket
                    
                    if (item.slot) {
                        // Hvis gjenstanden kan equippes, prøv å equipe den
                        equipItem(studentIndex, item.id, item.slot);
                    } else {
                        // Ellers, bruk den vanlige removeItemFromBackpack-funksjonen
                        removeItemFromBackpack(studentIndex, item.id);
                    }
                };
                
                buttonsDiv.appendChild(useButton);
                
                // Selg-knapp
                const sellButton = document.createElement('button');
                sellButton.style.cssText = `
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid #e74c3c;
                    color: #e74c3c;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    transition: all 0.3s ease;
                    flex: 1;
                    margin-left: 5px;
                    text-shadow: 0 0 5px rgba(231, 76, 60, 0.5);
                `;
                sellButton.textContent = 'SELG';
                sellButton.onmouseover = function() {
                    this.style.background = 'rgba(231, 76, 60, 0.2)';
                    this.style.transform = 'scale(1.05)';
                };
                sellButton.onmouseout = function() {
                    this.style.background = 'rgba(0, 0, 0, 0.5)';
                    this.style.transform = 'scale(1)';
                };
                
                // Legg til klikk-hendelse for selg-knappen
                sellButton.onclick = function(event) {
                    event.stopPropagation(); // Hindre at item-kortet også reagerer på klikket
                    showSellItemDialog(studentIndex, item.id, item);
                };
                
                buttonsDiv.appendChild(sellButton);
                contentDiv.appendChild(buttonsDiv);
                
                itemElement.appendChild(contentDiv);
                
                // Legg til hover-effekt
                itemElement.onmouseover = function() {
                    this.style.transform = 'translateY(-5px) scale(1.03)';
                    this.style.boxShadow = `0 10px 20px ${rarityGlow}`;
                    this.style.zIndex = '10';
                };
                
                itemElement.onmouseout = function() {
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = `0 0 10px ${rarityGlow}`;
                    this.style.zIndex = '1';
                };
                
                itemsContainer.appendChild(itemElement);
            } catch (error) {
                console.error('Feil ved visning av gjenstand med ID', itemId, ':', error);
            }
        });
    } catch (error) {
        console.error('Feil ved oppdatering av gjenstander:', error);
    }
}

// Funksjon for å kjøpe/trekke en tilfeldig gjenstand
function buyItem() {
    const modal = document.getElementById('itemBagModal');
    const studentIndex = parseInt(modal.getAttribute('data-student-index'));
    const student = students[studentIndex];
    
    // Bestem sjeldenhetsgrad basert på tilfeldighet
    const rarityRoll = Math.random() * 100;
    let rarity;
    if (rarityRoll < 60) rarity = 'rare';
    else if (rarityRoll < 90) rarity = 'epic';
    else rarity = 'legendary';
    
    // Filtrer items basert på sjeldenhetsgrad
    const possibleItems = items.filter(item => item.rarity === rarity);
    
    // Velg tilfeldig gjenstand fra filtrert liste
    const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
    
    // Legg til i studentens gjenstander
    if (!student.items) {
        student.items = [];
    }
    student.items.push(randomItem.id);
    
    // Lagre data
    saveData();
    
    // Vis melding med animasjon
    showItemAcquiredAnimation(randomItem);
    
    // Oppdater visning
    updateItemsDisplay(studentIndex);
    updateTable();
}

// Funksjon for å vise animasjon når en gjenstand er anskaffet
function showItemAcquiredAnimation(item, isLevelUpReward = false) {
    console.log("Viser popup for item:", item); // Legg til logging
    
    // Opprett backdrop for å mørklegge bakgrunnen
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(backdrop);
    
    // Opprett animasjonselement
    const animationElement = document.createElement('div');
    animationElement.className = 'achievement-popup';
    
    // Bestem tittel basert på om det er en level-up belønning
    const titleText = isLevelUpReward ? 'LEVEL UP BELØNNING' : 'NY GJENSTAND';
    
    // Bestem cyberpunk-farger basert på sjeldenhetsgrad
    let rarityColor, rarityGradient, borderGlow, textGlow;
    switch(item.rarity) {
        case 'rare':
            rarityColor = '#00ffff'; // Cyan
            rarityGradient = 'linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 40, 80, 0.95))';
            borderGlow = '0 0 15px #00ffff, 0 0 30px rgba(0, 255, 255, 0.5)';
            textGlow = '0 0 10px #00ffff, 0 0 20px rgba(0, 255, 255, 0.5)';
            break;
        case 'epic':
            rarityColor = '#ff00ff'; // Magenta
            rarityGradient = 'linear-gradient(135deg, rgba(40, 0, 40, 0.95), rgba(80, 0, 80, 0.95))';
            borderGlow = '0 0 15px #ff00ff, 0 0 30px rgba(255, 0, 255, 0.5)';
            textGlow = '0 0 10px #ff00ff, 0 0 20px rgba(255, 0, 255, 0.5)';
            break;
        case 'legendary':
            rarityColor = '#ffff00'; // Gul
            rarityGradient = 'linear-gradient(135deg, rgba(60, 30, 0, 0.95), rgba(100, 50, 0, 0.95))';
            borderGlow = '0 0 15px #ffff00, 0 0 30px rgba(255, 255, 0, 0.5)';
            textGlow = '0 0 10px #ffff00, 0 0 20px rgba(255, 255, 0, 0.5)';
            break;
        default:
            rarityColor = '#00ff00'; // Grønn
            rarityGradient = 'linear-gradient(135deg, rgba(0, 30, 0, 0.95), rgba(0, 50, 0, 0.95))';
            borderGlow = '0 0 15px #00ff00, 0 0 30px rgba(0, 255, 0, 0.5)';
            textGlow = '0 0 10px #00ff00, 0 0 20px rgba(0, 255, 0, 0.5)';
    }
    
    // Legg til cyberpunk-stil
    animationElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: ${rarityGradient};
        border: 2px solid ${rarityColor};
        box-shadow: ${borderGlow};
        border-radius: 5px;
        padding: 40px;
        pointer-events: auto;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 20px;
        min-width: 400px;
        max-width: 600px;
        min-height: 200px;
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        overflow: hidden;
    `;
    
    // Legg til glitch-effekt
    const glitchOverlay = document.createElement('div');
    glitchOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent 65%, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.1) 70%, transparent 75%);
        background-size: 200% 200%;
        animation: glitch 3s infinite linear;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Legg til CSS for glitch-animasjon
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0% { background-position: 0% 0%; }
            25% { background-position: 100% 100%; }
            50% { background-position: 100% 0%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 0%; }
        }
        
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        
        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
        
        @keyframes achievementPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            5% { transform: translate(-50%, -50%) scale(1.02); }
            10% { transform: translate(-50%, -50%) scale(1); }
            15% { transform: translate(-50%, -50%) scale(1.01); }
            20% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Legg til scanline-effekt
    const scanline = document.createElement('div');
    scanline.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.3);
        animation: scanline 2s linear infinite;
        pointer-events: none;
        z-index: 2;
    `;
    
    // Sett innhold
    animationElement.innerHTML = `
        <div class="icon" style="font-size: 72px; color: ${rarityColor}; text-shadow: ${textGlow}; animation: pulse 2s infinite; position: relative; z-index: 3;">${item.icon}</div>
        <div class="content" style="position: relative; z-index: 3;">
            <div class="skill-name" style="color: ${rarityColor}; text-shadow: ${textGlow}; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; margin-bottom: 10px;">${
                item.rarity === 'rare' ? 'SJELDEN' : 
                item.rarity === 'epic' ? 'EPISK' : 
                'LEGENDARISK'
            } ${titleText}</div>
            <h3 style="color: white; text-shadow: ${textGlow}; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 1px; margin: 10px 0;">${item.name}</h3>
            <p style="color: rgba(255, 255, 255, 0.9); font-family: 'Courier New', monospace; margin: 10px 0; line-height: 1.4;">${item.description}</p>
        </div>
        <button class="close-popup-btn" style="
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid ${rarityColor};
            color: ${rarityColor};
            text-shadow: ${textGlow};
            padding: 8px 20px;
            border-radius: 3px;
            margin-top: 20px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            position: relative;
            z-index: 3;
            box-shadow: 0 0 10px rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.3);
        ">LUKK</button>
    `;
    
    // Legg til glitch og scanline
    animationElement.appendChild(glitchOverlay);
    animationElement.appendChild(scanline);
    
    // Legg til i DOM
    document.body.appendChild(animationElement);
    
    // Vis backdrop
    setTimeout(() => {
        backdrop.style.opacity = '1';
    }, 10);
    
    // Legg til hover-effekt for lukkeknappen
    const closeButton = animationElement.querySelector('.close-popup-btn');
    closeButton.addEventListener('mouseover', function() {
        this.style.background = `rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`;
        this.style.boxShadow = `0 0 15px rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.5)`;
    });
    
    closeButton.addEventListener('mouseout', function() {
        this.style.background = 'rgba(0, 0, 0, 0.5)';
        this.style.boxShadow = `0 0 10px rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.3)`;
    });
    
    // Legg til klikk-hendelse for lukkeknappen
    closeButton.addEventListener('click', () => {
        animationElement.classList.remove('show');
        backdrop.style.opacity = '0';
        setTimeout(() => {
            animationElement.remove();
            backdrop.remove();
            style.remove();
        }, 600);
    });
    
    // Legg til klikk-hendelse for å lukke ved klikk på backdrop
    backdrop.addEventListener('click', () => {
        animationElement.classList.remove('show');
        backdrop.style.opacity = '0';
        setTimeout(() => {
            animationElement.remove();
            backdrop.remove();
            style.remove();
        }, 600);
    });
    
    // Vis animasjon
    setTimeout(() => {
        animationElement.style.opacity = '1';
        animationElement.style.transform = 'translate(-50%, -50%) scale(1)';
        animationElement.classList.add('show');
    }, 100);
    
    // Spill lyd bare hvis det ikke er en level-up belønning
    if (!isLevelUpReward) {
        playAchievementSound();
    }
    
    // Fjern etter animasjon (hvis brukeren ikke har lukket den manuelt)
    setTimeout(() => {
        if (document.body.contains(animationElement)) {
            animationElement.classList.remove('show');
            animationElement.style.opacity = '0';
            animationElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
            if (document.body.contains(backdrop)) {
                backdrop.style.opacity = '0';
            }
            setTimeout(() => {
                if (document.body.contains(animationElement)) {
                    animationElement.remove();
                }
                if (document.body.contains(backdrop)) {
                    backdrop.remove();
                }
                if (document.head.contains(style)) {
                    style.remove();
                }
            }, 600);
        }
    }, 5000);
}

// Legg til en testfunksjon for å vise popup-en direkte
function testItemPopup() {
    // Opprett et test-item
    const testItem = {
        id: 999,
        name: "Test Cyberpunk Item",
        description: "Dette er en test av den nye cyberpunk-stilen for popup-vinduet!",
        icon: "🔮",
        rarity: "legendary"
    };
    
    // Vis popup-en
    showItemAcquiredAnimation(testItem);
}

// Legg til en global funksjon for å teste popup-en fra konsollen
window.testItemPopup = testItemPopup;

// Funksjon for å fjerne en gjenstand fra ryggsekken
function removeItemFromBackpack(studentIndex, itemId) {
    // Hent studenten
    const student = students[studentIndex];
    
    // Sjekk om studenten har gjenstander
    if (!student.items || student.items.length === 0) {
        return;
    }
    
    // Finn indeksen til gjenstanden i studentens items-array
    const itemIndex = student.items.indexOf(itemId);
    
    // Hvis gjenstanden finnes, vis bekreftelsesdialog
    if (itemIndex !== -1) {
        // Prøv først å finne gjenstanden i vanlige items
        let item = items.find(i => i.id === itemId);
        
        // Hvis ikke funnet, prøv å finne i shopItems
        if (!item) {
            item = shopItems.find(i => i.id === itemId);
        }
        
        // Fjern eksisterende bekreftelsesdialog hvis den finnes
        const existingDialog = document.getElementById('removeItemDialog');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        // Opprett bekreftelsesdialog
        const dialog = document.createElement('div');
        dialog.id = 'removeItemDialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
            color: #00aaff;
            border: 2px solid #00aaff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 128, 255, 0.3);
            z-index: 9999;
            max-width: 400px;
            font-family: 'Courier New', monospace;
        `;
        
        // Legg til tittel
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #00aaff;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;
        title.innerHTML = '<i class="fas fa-magic" style="margin-right: 10px;"></i> Bekreft bruk';
        dialog.appendChild(title);
        
        // Legg til gjenstandsinfo
        const itemInfo = document.createElement('div');
        itemInfo.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px 0;
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 5px;
        `;
        
        // Legg til ikon
        const iconSpan = document.createElement('span');
        iconSpan.style.cssText = `
            font-size: 30px;
            margin-right: 15px;
        `;
        iconSpan.textContent = item ? item.icon : '❓';
        itemInfo.appendChild(iconSpan);
        
        // Legg til navn
        const nameSpan = document.createElement('span');
        nameSpan.style.cssText = `
            font-size: 18px;
            color: #ffffff;
        `;
        nameSpan.textContent = item ? item.name : 'Ukjent gjenstand';
        itemInfo.appendChild(nameSpan);
        
        dialog.appendChild(itemInfo);
        
        // Legg til bekreftelsestekst
        const confirmText = document.createElement('div');
        confirmText.style.cssText = `
            margin: 15px 0;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        `;
        confirmText.textContent = 'Er du sikker på at du vil bruke denne gjenstanden?';
        dialog.appendChild(confirmText);
        
        // Legg til knapper
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        `;
        
        // Avbryt-knapp
        const cancelButton = document.createElement('button');
        cancelButton.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            color: #ffffff;
            border: 1px solid #ffffff;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
        `;
        cancelButton.textContent = 'Avbryt';
        cancelButton.onclick = function() {
            dialog.remove();
        };
        buttonContainer.appendChild(cancelButton);
        
        // Bekreft-knapp
        const confirmButton = document.createElement('button');
        confirmButton.style.cssText = `
            background: rgba(0, 128, 255, 0.3);
            color: #00aaff;
            border: 1px solid #00aaff;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
        `;
        confirmButton.textContent = 'Bruk';
        confirmButton.onclick = function() {
            // Fjern gjenstanden
            student.items.splice(itemIndex, 1);
            
            // Sjekk om gjenstanden gir XP
            if (item && item.description) {
                // Sjekk om beskrivelsen inneholder XP-økning
                const xpMatch = item.description.match(/Gir (\d+) XP/i);
                if (xpMatch && xpMatch[1]) {
                    const xpAmount = parseInt(xpMatch[1]);
                    if (!isNaN(xpAmount)) {
                        // Gi XP til eleven
                        student.exp += xpAmount;
                        
                        // Vis XP-melding
                        showItemUsedMessage(`${item.name} ga deg ${xpAmount} XP!`);
                    } else {
                        showItemUsedMessage(item.name);
                    }
                } else if (item.id === 29) { // Skjebneterning
                    // Spesialhåndtering for skjebneterning
                    const diceRoll = Math.floor(Math.random() * 6) + 1; // 1-6
                    if (diceRoll >= 5) { // 5 eller 6
                        student.exp += 2000;
                        showItemUsedMessage(`${item.name} ga deg 2000 XP! (Terningkast: ${diceRoll})`);
                    } else {
                        student.exp -= 500;
                        showItemUsedMessage(`${item.name} gjorde at du tapte 500 XP! (Terningkast: ${diceRoll})`);
                    }
                } else if (item.id === 18) { // Gullbarre
                    // Spesialhåndtering for gullbarre
                    student.exp += 500;
                    showItemUsedMessage(`${item.name} ga deg 500 XP!`);
                } else {
                    showItemUsedMessage(item.name);
                }
            } else {
                showItemUsedMessage(item ? item.name : 'Gjenstanden');
            }
            
            // Lagre endringene
            saveData();
            
            // Oppdater visningen
            updateItemsDisplay(studentIndex);
            updateTable(); // Oppdater tabellen for å vise ny XP
            
            // Fjern dialogen
            dialog.remove();
        };
        buttonContainer.appendChild(confirmButton);
        
        dialog.appendChild(buttonContainer);
        
        // Legg til dialog i DOM
        document.body.appendChild(dialog);
        
        // Legg til event listener for å lukke ved klikk på Escape-tasten
        const escapeListener = function(event) {
            if (event.key === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', escapeListener);
            }
        };
        document.addEventListener('keydown', escapeListener);
    }
}

// Funksjon for å vise bekreftelsesmelding når en gjenstand er brukt
function showItemUsedMessage(message) {
    // Fjern eksisterende melding hvis den finnes
    const existingMessage = document.getElementById('itemUsedMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Opprett melding
    const messageElement = document.createElement('div');
    messageElement.id = 'itemUsedMessage';
    messageElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
        color: #00aaff;
        border: 2px solid #00aaff;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 0 30px rgba(0, 128, 255, 0.3);
        font-family: 'Courier New', monospace;
        z-index: 9999;
        text-align: center;
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    
    // Sjekk om meldingen inneholder XP-informasjon
    let icon = 'magic';
    let color = '#00aaff';
    let glow = 'rgba(0, 128, 255, 0.3)';
    
    if (message.includes('XP')) {
        if (message.includes('tapte')) {
            icon = 'skull';
            color = '#ff4040';
            glow = 'rgba(255, 64, 64, 0.3)';
        } else {
            icon = 'star';
            color = '#ffcc00';
            glow = 'rgba(255, 204, 0, 0.3)';
        }
        
        // Oppdater stilen med ny farge
        messageElement.style.color = color;
        messageElement.style.borderColor = color;
        messageElement.style.boxShadow = `0 0 30px ${glow}`;
    }
    
    // Legg til innhold
    messageElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <i class="fas fa-${icon}" style="font-size: 40px; margin-bottom: 15px; color: ${color};"></i>
            <div style="font-weight: bold; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: ${color};">${message}</div>
        </div>
    `;
    
    // Legg til melding i DOM
    document.body.appendChild(messageElement);
    
    // Vis melding med animasjon
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Fjern melding etter 3 sekunder
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (document.body.contains(messageElement)) {
                messageElement.remove();
            }
        }, 300);
    }, 3000);
}

// Funksjon for å tømme ryggsekken
function clearAllItems() {
    const modal = document.getElementById('itemBagModal');
    const studentIndex = parseInt(modal.getAttribute('data-student-index'));
    const student = students[studentIndex];
    
    // Sjekk om det faktisk er gjenstander å fjerne
    if (!student.items || student.items.length === 0) {
        alert('Ryggsekken er allerede tom!');
        return;
    }
    
    // Bekreft med brukeren
    if (confirm('Er du sikker på at du vil fjerne alle gjenstander fra ryggsekken?')) {
        // Tøm items-arrayen
        student.items = [];
        
        // Lagre data
        saveData();
        
        // Oppdater visning
        updateItemsDisplay(studentIndex);
        alert('Alle gjenstander er fjernet fra ryggsekken.');
    }
}

// Funksjon for å vise egg-popup
function showEggPopup(unlocked, eggId) {
    // Fjern eksisterende popup hvis den finnes
    const existingPopup = document.querySelector('.egg-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Opprett ny popup
    const popup = document.createElement('div');
    popup.className = 'egg-popup';
    
    // Sett innhold basert på om egget er låst opp eller låst
    if (unlocked) {
        popup.innerHTML = `
            <div class="egg-popup-title">Egg Opplåst!</div>
            <img src="egg${eggId}.png" alt="Egg ${eggId}" class="egg-popup-image">
            <div class="egg-popup-message">Du har låst opp et hemmelig egg!</div>
            <div class="egg-popup-xp">+5 000 XP til alle spillere</div>
            <button class="egg-popup-close">LUKK</button>
        `;
    } else {
        popup.innerHTML = `
            <div class="egg-popup-title">Egg Låst</div>
            <img src="egg${eggId}.png" alt="Egg ${eggId}" class="egg-popup-image" style="filter: grayscale(100%) brightness(50%) drop-shadow(0 0 15px rgba(46, 204, 113, 0.7));">
            <div class="egg-popup-message">Du har låst et egg igjen</div>
            <div class="egg-popup-xp">-5 000 XP fra alle spillere</div>
            <button class="egg-popup-close">LUKK</button>
        `;
    }
    
    // Legg til popup i DOM
    document.body.appendChild(popup);
    
    // Vis popup med animasjon
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Legg til event listener for lukkeknappen
    popup.querySelector('.egg-popup-close').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 500);
    });
}

// Legg til funksjon for å vise selg-dialog
function showSellItemDialog(studentIndex, itemId, item) {
    // Fjern eksisterende dialog hvis den finnes
    const existingDialog = document.getElementById('sellItemDialog');
    if (existingDialog) {
        existingDialog.remove();
    }
    
    // Opprett dialog
    const dialog = document.createElement('div');
    dialog.id = 'sellItemDialog';
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
        color: #00ff00;
        border: 2px solid #00ff00;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
        z-index: 9999;
        max-width: 400px;
        font-family: 'Courier New', monospace;
    `;
    
    // Legg til tittel
    const title = document.createElement('div');
    title.style.cssText = `
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #00ff00;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    title.innerHTML = '<i class="fas fa-exchange-alt" style="margin-right: 10px;"></i> Selg gjenstand';
    dialog.appendChild(title);
    
    // Legg til gjenstandsinfo
    const itemInfo = document.createElement('div');
    itemInfo.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 15px 0;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
    `;
    
    // Legg til ikon
    const iconSpan = document.createElement('span');
    iconSpan.style.cssText = `
        font-size: 30px;
        margin-right: 15px;
    `;
    iconSpan.textContent = item.icon;
    itemInfo.appendChild(iconSpan);
    
    // Legg til navn
    const nameSpan = document.createElement('span');
    nameSpan.style.cssText = `
        font-size: 18px;
        color: #ffffff;
    `;
    nameSpan.textContent = item.name;
    itemInfo.appendChild(nameSpan);
    
    dialog.appendChild(itemInfo);
    
    // Legg til prisinput
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.min = '0';
    priceInput.value = '0';
    priceInput.style.cssText = `
        background: rgba(0, 0, 0, 0.7);
        border: 2px solid #00ff00;
        color: #00ff00;
        padding: 10px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        width: 80%;
        max-width: 200px;
        text-align: center;
        margin: 15px 0;
    `;
    dialog.appendChild(priceInput);
    
    // Legg til knapper
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 20px;
    `;
    
    // Avbryt-knapp
    const cancelButton = document.createElement('button');
    cancelButton.style.cssText = `
        background: rgba(0, 0, 0, 0.3);
        color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 4px;
        padding: 8px 15px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
    `;
    cancelButton.textContent = 'Avbryt';
    cancelButton.onclick = function() {
        dialog.remove();
    };
    buttonContainer.appendChild(cancelButton);
    
    // Bekreft-knapp
    const confirmButton = document.createElement('button');
    confirmButton.style.cssText = `
        background: rgba(0, 255, 0, 0.3);
        color: #00ff00;
        border: 1px solid #00ff00;
        border-radius: 4px;
        padding: 8px 15px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
    `;
    confirmButton.textContent = 'Selg';
    confirmButton.onclick = function() {
        const price = parseInt(priceInput.value);
        if (price < 0) {
            alert('Prisen kan ikke være negativ!');
            return;
        }
        
        if (addItemToMarketplace(studentIndex, itemId, price)) {
            // Oppdater visningen
            updateItemsDisplay(studentIndex);
            
            // Vis bekreftelsesmelding
            showItemSoldMessage(item.name);
            
            // Fjern dialogen
            dialog.remove();
        }
    };
    buttonContainer.appendChild(confirmButton);
    
    dialog.appendChild(buttonContainer);
    
    // Legg til dialog i DOM
    document.body.appendChild(dialog);
    
    // Legg til event listener for å lukke ved klikk på Escape-tasten
    const escapeListener = function(event) {
        if (event.key === 'Escape') {
            dialog.remove();
            document.removeEventListener('keydown', escapeListener);
        }
    };
    document.addEventListener('keydown', escapeListener);
}

// Funksjon for å vise bekreftelsesmelding når en gjenstand er solgt
function showItemSoldMessage(itemName) {
    // Fjern eksisterende melding hvis den finnes
    const existingMessage = document.getElementById('itemSoldMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Opprett melding
    const message = document.createElement('div');
    message.id = 'itemSoldMessage';
    message.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
        color: #00ff00;
        border-left: 4px solid #00ff00;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
        font-family: 'Courier New', monospace;
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Legg til innhold
    message.innerHTML = `
        <div style="display: flex; align-items: center;">
            <i class="fas fa-exchange-alt" style="font-size: 20px; margin-right: 15px;"></i>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">${itemName}</div>
                <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7);">er lagt ut i bruktmarkedet</div>
            </div>
        </div>
    `;
    
    // Legg til melding i DOM
    document.body.appendChild(message);
    
    // Vis melding med animasjon
    setTimeout(() => {
        message.style.transform = 'translateX(0)';
    }, 10);
    
    // Fjern melding etter 3 sekunder
    setTimeout(() => {
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.remove();
            }
        }, 300);
    }, 3000);
}

// Funksjon for å equipe en gjenstand i en equipment slot
function equipItem(studentIndex, itemId, slotType) {
    const student = students[studentIndex];
    
    // Sjekk om studenten har equipment-objektet, hvis ikke, opprett det
    if (!student.equipment) {
        student.equipment = {
            head: null,
            chest: null,
            hands: null,
            legs: null,
            feet: null,
            accessory: null
        };
    }
    
    // Finn gjenstanden
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    
    // Sjekk om gjenstanden kan equippes i denne sloten
    if (item.slot !== slotType) {
        showItemUsedMessage(`${item.name} kan ikke utstyres i ${slotType}-sloten!`);
        return false;
    }
    
    // Sjekk om det allerede er en gjenstand i sloten
    const currentEquippedItemId = student.equipment[slotType];
    if (currentEquippedItemId) {
        // Unequip den nåværende gjenstanden først
        unequipItem(studentIndex, slotType);
    }
    
    // Equip den nye gjenstanden
    student.equipment[slotType] = itemId;
    
    // Fjern gjenstanden fra ryggsekken
    const itemIndex = student.items.indexOf(itemId);
    if (itemIndex !== -1) {
        student.items.splice(itemIndex, 1);
    }
    
    // Oppdater studentens stats basert på gjenstandens bonuser
    if (item.stats) {
        for (const [stat, value] of Object.entries(item.stats)) {
            if (!student.equipmentBonuses) {
                student.equipmentBonuses = {};
            }
            if (!student.equipmentBonuses[stat]) {
                student.equipmentBonuses[stat] = 0;
            }
            student.equipmentBonuses[stat] += value;
        }
    }
    
    // Lagre endringene
    saveData();
    
    // Oppdater visningen
    updateItemsDisplay(studentIndex);
    updateEquipmentDisplay(studentIndex);
    
    // Vis melding
    showItemUsedMessage(`${item.name} er nå utstyrt i ${slotType}-sloten!`);
    
    return true;
}

// Funksjon for å unequipe en gjenstand fra en equipment slot
function unequipItem(studentIndex, slotType) {
    const student = students[studentIndex];
    
    // Sjekk om studenten har equipment-objektet
    if (!student.equipment || !student.equipment[slotType]) {
        return false;
    }
    
    // Finn gjenstanden som er utstyrt
    const itemId = student.equipment[slotType];
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    
    // Fjern bonuser fra studentens stats
    if (item.stats) {
        for (const [stat, value] of Object.entries(item.stats)) {
            if (student.equipmentBonuses && student.equipmentBonuses[stat]) {
                student.equipmentBonuses[stat] -= value;
                
                // Fjern stat-bonusen hvis den er 0
                if (student.equipmentBonuses[stat] === 0) {
                    delete student.equipmentBonuses[stat];
                }
            }
        }
        
        // Fjern equipmentBonuses-objektet hvis det er tomt
        if (student.equipmentBonuses && Object.keys(student.equipmentBonuses).length === 0) {
            delete student.equipmentBonuses;
        }
    }
    
    // Fjern gjenstanden fra equipment
    student.equipment[slotType] = null;
    
    // Legg gjenstanden tilbake i ryggsekken
    if (!student.items) {
        student.items = [];
    }
    student.items.push(itemId);
    
    // Lagre endringene
    saveData();
    
    // Oppdater visningen
    updateItemsDisplay(studentIndex);
    updateEquipmentDisplay(studentIndex);
    
    // Vis melding
    showItemUsedMessage(`${item.name} er nå fjernet fra ${slotType}-sloten!`);
    
    return true;
}

// Funksjon for å oppdatere visningen av equipment slots
function updateEquipmentDisplay(studentIndex) {
    const student = students[studentIndex];
    
    // Sjekk om studenten har equipment-objektet
    if (!student.equipment) {
        student.equipment = {
            head: null,
            chest: null,
            hands: null,
            legs: null,
            feet: null,
            accessory: null
        };
    }
    
    // Oppdater hver equipment slot
    const slotTypes = ['head', 'chest', 'hands', 'legs', 'feet', 'accessory'];
    slotTypes.forEach(slotType => {
        const slotElement = document.querySelector(`.equipment-slot[data-slot="${slotType}"]`);
        if (!slotElement) return;
        
        const itemId = student.equipment[slotType];
        if (itemId) {
            // Finn gjenstanden
            const item = items.find(i => i.id === itemId);
            if (item) {
                // Bestem farge basert på sjeldenhetsgrad
                let rarityColor, rarityGlow;
                switch(item.rarity) {
                    case 'rare':
                        rarityColor = '#3498db';
                        rarityGlow = 'rgba(52, 152, 219, 0.5)';
                        break;
                    case 'epic':
                        rarityColor = '#9b59b6';
                        rarityGlow = 'rgba(155, 89, 182, 0.5)';
                        break;
                    case 'legendary':
                        rarityColor = '#f1c40f';
                        rarityGlow = 'rgba(241, 196, 15, 0.5)';
                        break;
                    default:
                        rarityColor = '#ffffff';
                        rarityGlow = 'rgba(255, 255, 255, 0.5)';
                }
                
                // Oppdater slotens utseende
                slotElement.innerHTML = `
                    <div style="font-size: 32px; margin-bottom: 5px;">${item.icon}</div>
                    <div style="font-size: 12px; color: ${rarityColor}; text-shadow: 0 0 5px ${rarityGlow};">${item.name}</div>
                `;
                slotElement.style.border = `2px solid ${rarityColor}`;
                slotElement.style.boxShadow = `0 0 10px ${rarityGlow}`;
                slotElement.style.background = 'rgba(0, 0, 0, 0.5)';
                slotElement.style.position = 'relative';
                
                // Legg til tooltip
                slotElement.onmouseover = function() {
                    // Fjern eksisterende tooltip hvis det finnes
                    const existingTooltip = document.getElementById('equipment-tooltip');
                    if (existingTooltip) {
                        existingTooltip.remove();
                    }
                    
                    // Opprett tooltip
                    const tooltip = document.createElement('div');
                    tooltip.id = 'equipment-tooltip';
                    
                    // Bestem sjeldenhetsgrad-tekst
                    let rarityName;
                    switch(item.rarity) {
                        case 'rare':
                            rarityName = 'SJELDEN';
                            break;
                        case 'epic':
                            rarityName = 'EPISK';
                            break;
                        case 'legendary':
                            rarityName = 'LEGENDARISK';
                            break;
                        default:
                            rarityName = 'UKJENT';
                    }
                    
                    // Generer stats-tekst
                    let statsText = '';
                    if (item.stats) {
                        for (const [stat, value] of Object.entries(item.stats)) {
                            statsText += `<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
                                <span>${stat}:</span>
                                <span style="color: #0f0;">+${value}</span>
                            </div>`;
                        }
                    }
                    
                    // Sett tooltip-innhold
                    tooltip.innerHTML = `
                        <div style="
                            position: absolute;
                            z-index: 1000;
                            width: 250px;
                            background: rgba(0, 0, 0, 0.9);
                            border: 2px solid ${rarityColor};
                            border-radius: 8px;
                            padding: 15px;
                            color: white;
                            font-family: 'Courier New', monospace;
                            box-shadow: 0 0 15px ${rarityGlow};
                            pointer-events: none;
                            left: 100%;
                            top: 0;
                            margin-left: 10px;
                        ">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="font-size: 32px; margin-right: 10px;">${item.icon}</div>
                                <div>
                                    <div style="font-size: 16px; font-weight: bold; color: ${rarityColor}; text-shadow: 0 0 5px ${rarityGlow};">${item.name}</div>
                                    <div style="font-size: 12px; color: ${rarityColor}; margin-top: 2px;">${rarityName}</div>
                                </div>
                            </div>
                            <div style="font-size: 14px; margin-bottom: 15px; color: rgba(255, 255, 255, 0.8);">${item.description}</div>
                            <div style="background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 5px; padding: 10px;">
                                <div style="font-size: 14px; color: #0ff; margin-bottom: 8px; text-align: center;">BONUSER</div>
                                ${statsText}
                            </div>
                            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 10px; text-align: center;">Klikk for å fjerne</div>
                        </div>
                    `;
                    
                    // Legg til tooltip i DOM
                    slotElement.appendChild(tooltip);
                };
                
                slotElement.onmouseout = function() {
                    // Fjern tooltip
                    const tooltip = document.getElementById('equipment-tooltip');
                    if (tooltip) {
                        tooltip.remove();
                    }
                };
                
                // Legg til klikk-hendelse for å unequipe
                slotElement.onclick = function() {
                    unequipItem(studentIndex, slotType);
                };
            }
        } else {
            // Tilbakestill slotens utseende
            const slotIcons = {
                head: '🪖',
                chest: '🛡️',
                hands: '🧤',
                legs: '👖',
                feet: '👟',
                accessory: '💍'
            };
            
            const slotNames = {
                head: 'Hode',
                chest: 'Bryst',
                hands: 'Hender',
                legs: 'Bein',
                feet: 'Føtter',
                accessory: 'Tilbehør'
            };
            
            slotElement.innerHTML = `
                <div style="font-size: 24px; color: rgba(255, 255, 255, 0.3); margin-bottom: 5px;">${slotIcons[slotType]}</div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.5);">${slotNames[slotType]}</div>
            `;
            slotElement.style.border = '1px dashed rgba(0, 255, 255, 0.3)';
            slotElement.style.boxShadow = 'none';
            slotElement.style.background = 'rgba(0, 0, 0, 0.3)';
            
            // Fjern hendelser
            slotElement.onmouseover = null;
            slotElement.onmouseout = null;
            slotElement.onclick = null;
        }
    });
    
    // Oppdater equipment bonuses
    updateEquipmentBonusesDisplay(studentIndex);
}

// Funksjon for å oppdatere visningen av equipment bonuses
function updateEquipmentBonusesDisplay(studentIndex) {
    const student = students[studentIndex];
    
    // Oppdater bonuser i statistikk-panelet
    const statMap = {
        'Intelligens': 'intBonus',
        'Teknologi': 'tekBonus',
        'Stamina': 'staBonus',
        'Karisma': 'karBonus',
        'Kreativitet': 'kreBonus',
        'Flaks': 'flaBonus'
    };
    
    // Opprett standard stats-visning
    const stats = ['Intelligens', 'Teknologi', 'Stamina', 'Karisma', 'Kreativitet', 'Flaks'];
    stats.forEach(stat => {
        const bonus = student.equipmentBonuses && student.equipmentBonuses[stat] ? student.equipmentBonuses[stat] : 0;
        const color = bonus > 0 ? '#0f0' : (bonus < 0 ? '#f00' : '#fff');
        const bonusElement = document.getElementById(statMap[stat]);
        
        if (bonusElement) {
            bonusElement.textContent = `${bonus > 0 ? '+' : ''}${bonus}`;
            bonusElement.style.color = color;
        }
    });
}

// Oppdater updateItemsDisplay-funksjonen for å legge til drag-and-drop funksjonalitet
const originalUpdateItemsDisplay = updateItemsDisplay;
updateItemsDisplay = function(studentIndex) {
    // Kall den originale funksjonen først
    originalUpdateItemsDisplay(studentIndex);
    
    // Legg til drag-and-drop funksjonalitet for gjenstander
    const itemElements = document.querySelectorAll('.item-card');
    itemElements.forEach(itemElement => {
        const itemId = parseInt(itemElement.getAttribute('data-item-id'));
        const item = items.find(i => i.id === itemId);
        
        // Legg til draggable-attributt hvis gjenstanden kan equippes
        if (item && item.slot) {
            itemElement.setAttribute('draggable', 'true');
            
            // Legg til dragstart-hendelse
            itemElement.ondragstart = function(event) {
                event.dataTransfer.setData('text/plain', JSON.stringify({
                    studentIndex: studentIndex,
                    itemId: itemId,
                    slot: item.slot
                }));
            };
        };
    });
    
    // Legg til drop-hendelser for equipment slots
    const slotElements = document.querySelectorAll('.equipment-slot');
    slotElements.forEach(slotElement => {
        const slotType = slotElement.getAttribute('data-slot');
        
        // Legg til dragover-hendelse
        slotElement.ondragover = function(event) {
            event.preventDefault();
            
            // Endre utseende for å indikere at sloten kan ta imot gjenstanden
            slotElement.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.8)';
        };
        
        // Legg til dragleave-hendelse
        slotElement.ondragleave = function(event) {
            // Tilbakestill utseende
            slotElement.style.boxShadow = 'none';
        };
        
        // Legg til drop-hendelse
        slotElement.ondrop = function(event) {
            event.preventDefault();
            
            // Tilbakestill utseende
            slotElement.style.boxShadow = 'none';
            
            // Hent data fra drag-hendelsen
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            
            // Sjekk om gjenstanden kan equippes i denne sloten
            if (data.slot === slotType) {
                equipItem(data.studentIndex, data.itemId, slotType);
            } else {
                showItemUsedMessage(`Denne gjenstanden kan ikke utstyres i ${slotType}-sloten!`);
            }
        };
    });
};

// Oppdater openItemBagModal-funksjonen for å også oppdatere equipment slots
const originalOpenItemBagModal = openItemBagModal;
openItemBagModal = function(studentIndex) {
    // Kall den originale funksjonen først
    originalOpenItemBagModal(studentIndex);
    
    // Oppdater equipment slots
    updateEquipmentDisplay(studentIndex);
}; 

// Funksjon for å legge til både achievement- og inventory-knapper i tabellen
function addButtonsToTable() {
    // Finn alle rader i tabellen
    const rows = document.querySelectorAll('table.student-table tbody tr');
    
    // Gå gjennom hver rad
    rows.forEach((row, index) => {
        // Sjekk om raden allerede har knappene
        if (!row.querySelector('.action-buttons-cell')) {
            // Opprett en ny celle for knappene
            const cell = document.createElement('td');
            cell.className = 'action-buttons-cell';
            cell.style.cssText = `
                padding: 5px;
                text-align: center;
                vertical-align: middle;
                display: flex;
                gap: 8px;
                justify-content: center;
            `;
            
            // Opprett ryggsekk-knappen
            const inventoryButton = document.createElement('button');
            inventoryButton.className = 'inventory-button';
            inventoryButton.innerHTML = '🎒';
            inventoryButton.title = 'Åpne ryggsekk';
            inventoryButton.style.cssText = `
                background: linear-gradient(135deg, #1a2a3a, #0d1520);
                border: 1px solid #00aaff;
                color: #00aaff;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 10px rgba(0, 170, 255, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Legg til hover-effekt for ryggsekk-knappen
            inventoryButton.onmouseover = function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 0 15px rgba(0, 170, 255, 0.5)';
            };
            
            inventoryButton.onmouseout = function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 10px rgba(0, 170, 255, 0.3)';
            };
            
            // Legg til klikk-hendelse for ryggsekk-knappen
            inventoryButton.onclick = function(event) {
                event.stopPropagation(); // Hindre at raden også reagerer på klikket
                openItemBagModal(index);
            };
            
            // Opprett achievement-knappen
            const achievementButton = document.createElement('button');
            achievementButton.className = 'achievement-button';
            achievementButton.innerHTML = '🏆';
            achievementButton.title = 'Åpne achievements';
            achievementButton.style.cssText = `
                background: linear-gradient(135deg, #3a1a2a, #200d15);
                border: 1px solid #ff00aa;
                color: #ff00aa;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                font-size: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 10px rgba(255, 0, 170, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Legg til hover-effekt for achievement-knappen
            achievementButton.onmouseover = function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 0 15px rgba(255, 0, 170, 0.5)';
            };
            
            achievementButton.onmouseout = function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 10px rgba(255, 0, 170, 0.3)';
            };
            
            // Legg til klikk-hendelse for achievement-knappen
            achievementButton.onclick = function(event) {
                event.stopPropagation(); // Hindre at raden også reagerer på klikket
                openAchievementsModal(index);
            };
            
            // Legg til knappene i cellen
            cell.appendChild(inventoryButton);
            cell.appendChild(achievementButton);
            
            // Legg til cellen i raden
            row.appendChild(cell);
        }
    });
}

// Legg til en dropdown-meny for å velge elev
function addStudentSelector() {
    // Sjekk om selector allerede finnes
    if (document.getElementById('student-selector-container')) {
        return;
    }
    
    // Opprett container for selector
    const container = document.createElement('div');
    container.id = 'student-selector-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: linear-gradient(135deg, rgba(10, 20, 30, 0.9), rgba(5, 10, 15, 0.9));
        border: 2px solid #00aaff;
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0 0 20px rgba(0, 170, 255, 0.3);
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    
    // Opprett tittel
    const title = document.createElement('div');
    title.style.cssText = `
        font-size: 14px;
        color: #00aaff;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    title.textContent = 'Velg elev';
    container.appendChild(title);
    
    // Opprett select-element
    const select = document.createElement('select');
    select.id = 'student-selector';
    select.style.cssText = `
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: 1px solid #00aaff;
        border-radius: 5px;
        padding: 8px;
        width: 200px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
    `;
    
    // Legg til options for hver elev
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = student.name;
        select.appendChild(option);
    });
    
    container.appendChild(select);
    
    // Opprett knapper
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        gap: 10px;
    `;
    
    // Ryggsekk-knapp
    const inventoryButton = document.createElement('button');
    inventoryButton.innerHTML = '🎒 Ryggsekk';
    inventoryButton.style.cssText = `
        flex: 1;
        background: linear-gradient(135deg, #1a2a3a, #0d1520);
        border: 1px solid #00aaff;
        color: #00aaff;
        border-radius: 5px;
        padding: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Courier New', monospace;
        font-size: 14px;
    `;
    
    inventoryButton.onmouseover = function() {
        this.style.background = 'linear-gradient(135deg, #2a3a4a, #1a2a3a)';
        this.style.transform = 'translateY(-2px)';
    };
    
    inventoryButton.onmouseout = function() {
        this.style.background = 'linear-gradient(135deg, #1a2a3a, #0d1520)';
        this.style.transform = 'translateY(0)';
    };
    
    inventoryButton.onclick = function() {
        const selectedIndex = parseInt(select.value);
        openItemBagModal(selectedIndex);
    };
    
    buttonsContainer.appendChild(inventoryButton);
    
    // Achievement-knapp
    const achievementButton = document.createElement('button');
    achievementButton.innerHTML = '🏆 Achievements';
    achievementButton.style.cssText = `
        flex: 1;
        background: linear-gradient(135deg, #3a1a2a, #200d15);
        border: 1px solid #ff00aa;
        color: #ff00aa;
        border-radius: 5px;
        padding: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: 'Courier New', monospace;
        font-size: 14px;
    `;
    
    achievementButton.onmouseover = function() {
        this.style.background = 'linear-gradient(135deg, #4a2a3a, #3a1a2a)';
        this.style.transform = 'translateY(-2px)';
    };
    
    achievementButton.onmouseout = function() {
        this.style.background = 'linear-gradient(135deg, #3a1a2a, #200d15)';
        this.style.transform = 'translateY(0)';
    };
    
    achievementButton.onclick = function() {
        const selectedIndex = parseInt(select.value);
        openAchievementsModal(selectedIndex);
    };
    
    buttonsContainer.appendChild(achievementButton);
    container.appendChild(buttonsContainer);
    
    // Legg til container i DOM
    document.body.appendChild(container);
}

// Oppdater updateTable-funksjonen for å legge til knapper
// Sjekk om vi allerede har overskrevet updateTable
if (!window.originalUpdateTable) {
    window.originalUpdateTable = updateTable;
    
    // Overskriver updateTable med vår egen versjon
    window.updateTable = function() {
        // Kall den originale funksjonen først
        window.originalUpdateTable();
        
        // Legg til knapper i tabellen
        addButtonsToTable();
        
        // Oppdater student-selector hvis den finnes
        const selector = document.getElementById('student-selector');
        if (selector) {
            // Tøm selector
            selector.innerHTML = '';
            
            // Legg til options for hver elev
            students.forEach((student, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = student.name;
                selector.appendChild(option);
            });
        }
    };
}

// Kjør når siden lastes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Vent litt for å sikre at tabellen er lastet
        setTimeout(() => {
            addButtonsToTable();
            addStudentSelector();
        }, 1000);
    });
} else {
    // Dokumentet er allerede lastet
    setTimeout(() => {
        addButtonsToTable();
        addStudentSelector();
    }, 1000);
} 