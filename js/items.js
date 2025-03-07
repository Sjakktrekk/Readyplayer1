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
    }
];

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
    const student = students[studentIndex];
    const itemsContainer = document.getElementById('itemsContainer');
    if (!itemsContainer) return;
    
    // Tøm containeren
    itemsContainer.innerHTML = '';
    
    // Sjekk om studenten har gjenstander
    if (!student.items || student.items.length === 0) {
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
    
    // Vis hver gjenstand
    student.items.forEach(itemId => {
        // Prøv først å finne gjenstanden i vanlige items
        let item = items.find(i => i.id === itemId);
        
        // Hvis ikke funnet, prøv å finne i shopItems
        if (!item) {
            item = shopItems.find(i => i.id === itemId);
        }
        
        if (item) {
            // Bestem farge basert på sjeldenhetsgrad
            let rarityColor, rarityGlow, rarityName;
            
            // Hvis det er en butikk-gjenstand, bruk gullfarge
            if (shopItems.some(i => i.id === item.id)) {
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
            
            // Legg til ikon
            const iconDiv = document.createElement('div');
            iconDiv.className = 'item-icon';
            iconDiv.style.cssText = `
                color: ${rarityColor};
                font-size: 36px;
                margin: 10px 0;
                text-shadow: 0 0 10px ${rarityGlow};
            `;
            iconDiv.textContent = item.icon;
            contentDiv.appendChild(iconDiv);
            
            // Legg til navn
            const nameDiv = document.createElement('div');
            nameDiv.className = 'item-name';
            nameDiv.style.cssText = `
                color: ${rarityColor};
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 8px;
                text-shadow: 0 0 5px ${rarityGlow};
                font-family: 'Courier New', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;
            nameDiv.textContent = item.name;
            contentDiv.appendChild(nameDiv);
            
            // Legg til beskrivelse
            const descDiv = document.createElement('div');
            descDiv.className = 'item-description';
            descDiv.style.cssText = `
                color: rgba(255, 255, 255, 0.7);
                font-size: 13px;
                margin-bottom: 10px;
                flex-grow: 1;
            `;
            descDiv.textContent = item.description;
            contentDiv.appendChild(descDiv);
            
            // Legg til fjern-knapp
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-item-button';
            removeButton.style.cssText = `
                background: rgba(0, 128, 255, 0.2);
                color: #00aaff;
                border: 1px solid #00aaff;
                border-radius: 4px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 5px;
                transition: all 0.3s ease;
                font-family: 'Courier New', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 100%;
                opacity: 0.7;
            `;
            removeButton.innerHTML = '<i class="fas fa-magic" style="margin-right: 5px;"></i> Bruk';
            removeButton.onclick = function(e) {
                e.stopPropagation(); // Hindre at klikket bobler opp
                removeItemFromBackpack(studentIndex, itemId);
            };
            
            // Legg til hover-effekter for fjern-knappen
            removeButton.addEventListener('mouseover', function() {
                this.style.background = 'rgba(0, 128, 255, 0.4)';
                this.style.color = '#33bbff';
                this.style.opacity = '1';
                this.style.boxShadow = '0 0 8px rgba(0, 128, 255, 0.5)';
            });
            
            removeButton.addEventListener('mouseout', function() {
                this.style.background = 'rgba(0, 128, 255, 0.2)';
                this.style.color = '#00aaff';
                this.style.opacity = '0.7';
                this.style.boxShadow = 'none';
            });
            
            // Legg til selg-knapp
            const sellButton = document.createElement('button');
            sellButton.className = 'sell-item-button';
            sellButton.style.cssText = `
                background: rgba(0, 255, 0, 0.2);
                color: #00ff00;
                border: 1px solid #00ff00;
                border-radius: 4px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 5px;
                transition: all 0.3s ease;
                font-family: 'Courier New', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 100%;
                opacity: 0.7;
            `;
            sellButton.innerHTML = '<i class="fas fa-exchange-alt" style="margin-right: 5px;"></i> Selg';
            sellButton.onclick = function(e) {
                e.stopPropagation(); // Hindre at klikket bobler opp
                showSellItemDialog(studentIndex, itemId, item);
            };
            
            // Legg til hover-effekter for selg-knappen
            sellButton.addEventListener('mouseover', function() {
                this.style.background = 'rgba(0, 255, 0, 0.4)';
                this.style.color = '#33ff33';
                this.style.opacity = '1';
                this.style.boxShadow = '0 0 8px rgba(0, 255, 0, 0.5)';
            });
            
            sellButton.addEventListener('mouseout', function() {
                this.style.background = 'rgba(0, 255, 0, 0.2)';
                this.style.color = '#00ff00';
                this.style.opacity = '0.7';
                this.style.boxShadow = 'none';
            });
            
            contentDiv.appendChild(removeButton);
            contentDiv.appendChild(sellButton);
            
            itemElement.appendChild(contentDiv);
            
            // Legg til hover-effekter
            itemElement.onmouseover = function() {
                this.style.transform = 'translateY(-5px) scale(1.03)';
                this.style.boxShadow = `0 5px 15px ${rarityGlow}`;
                this.style.zIndex = '10';
            };
            
            itemElement.onmouseout = function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = `0 0 10px ${rarityGlow}`;
                this.style.zIndex = '1';
            };
            
            itemsContainer.appendChild(itemElement);
        }
    });
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
    // Opprett animasjonselement
    const animationElement = document.createElement('div');
    animationElement.className = 'achievement-popup';
    
    // Bestem tittel basert på om det er en level-up belønning
    const titleText = isLevelUpReward ? 'LEVEL UP BELØNNING' : 'NY GJENSTAND';
    
    // Sett innhold
    animationElement.innerHTML = `
        <div class="icon" style="font-size: 72px;">${item.icon}</div>
        <div class="content">
            <div class="skill-name">${
                item.rarity === 'rare' ? 'SJELDEN' : 
                item.rarity === 'epic' ? 'EPISK' : 
                'LEGENDARISK'
            } ${titleText}</div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        </div>
    `;
    
    // Legg til i DOM
    document.body.appendChild(animationElement);
    
    // Vis animasjon
    setTimeout(() => {
        animationElement.classList.add('show');
    }, 100);
    
    // Spill lyd bare hvis det ikke er en level-up belønning
    // (level-up belønninger spiller allerede en egen lyd i checkRandomItemOnLevelUp-funksjonen)
    if (!isLevelUpReward) {
        playAchievementSound();
    }
    
    // Fjern etter animasjon
    setTimeout(() => {
        animationElement.classList.remove('show');
        setTimeout(() => {
            animationElement.remove();
        }, 600);
    }, 3000);
}

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