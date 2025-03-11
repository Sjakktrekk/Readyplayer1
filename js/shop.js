// Definisjon av spesielle butikk-items
const shopItems = [
    {
        id: 'math_calculator',
        name: 'Mattemagi-kalkulator',
        description: '20 % mer XP på matteoppgaver!',
        icon: '🧮',
        price: 5000,
        effect: 'math_xp_boost'
    },
    {
        id: 'stairway_heaven',
        name: 'Stairway to heaven',
        description: 'Åpner muligheten for trappeløp. 250 XP fra bunn til topp!',
        icon: '🪜',
        price: 3000,
        effect: 'stair_climb'
    },
    {
        id: 'double_or_nothing',
        name: 'Kvitt eller dobbelt',
        description: 'Når du leverer en norsk/matte/engelsk oppgave kan du ta en sjanse. Kast en terning. 1-3 gir INGEN XP, 4-6 gir dobbel XP',
        icon: '🎲',
        price: 3000,
        effect: 'double_xp_chance'
    },
    {
        id: 'try_your_luck',
        name: 'Prøv lykken',
        description: 'Du får en tilfeldig gjenstand fra butikkens lager',
        icon: '🎁',
        price: 3000,
        effect: 'random_item'
    },
    {
        id: 'rebirth',
        name: 'Rebirth',
        description: 'Du får fordele nivåpoengene dine på nytt',
        icon: '🔄',
        price: 10000,
        effect: 'respec_points'
    },
    {
        id: 'audiobook',
        name: 'Lydbok',
        description: 'Egenvalgt lesing kan gjøres med lydbok og headset!',
        icon: '🎧',
        price: 3000,
        effect: 'audiobook_reading'
    },
    {
        id: 'headset',
        name: 'Headset',
        description: 'Du kan høre på musikk mens du jobber med oppgaver',
        icon: '🎧',
        price: 3000,
        effect: 'music_while_working'
    },
    {
        id: 'mortens_favoritter',
        name: 'Mortens favoritter',
        description: 'Morten velger en bok du skal lese. +50% XP når du leser denne boka',
        icon: '📚',
        price: 3000,
        effect: 'mortens_book_boost'
    },
    {
        id: 'odd_book',
        name: 'The Odd book',
        description: 'Odd-Henry velger en bok du skal lese. +50% XP når du leser denne boka',
        icon: '📖',
        price: 3000,
        effect: 'odd_book_boost'
    }
];

// Funksjon for å åpne shop-modalen
function openShopModal() {
    const modal = document.getElementById('shopModal');
    
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
    updateStudentDropdown();
    
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
        closeShopModal();
    });
    
    // Vis alle items
    displayShopItems();
}

// Funksjon for å lukke shop-modalen
function closeShopModal() {
    const modal = document.getElementById('shopModal');
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

// Funksjon for å oppdatere student dropdown
function updateStudentDropdown() {
    // Sjekk om vi bruker den vanlige eller kombinerte butikken
    const select = document.getElementById('shopStudentSelect') || document.getElementById('combinedStudentSelect');
    const creditsDisplay = document.getElementById('shopStudentExpDisplay') || document.getElementById('combinedStudentExpDisplay');
    
    if (!select) {
        console.warn('Kunne ikke finne studentvelgeren!');
        return;
    }
    
    // Tøm eksisterende valg
    select.innerHTML = '<option value="">Velg elev...</option>';
    
    // Legg til alle studenter
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${student.name} (${student.credits || 0} kreditter)`;
        select.appendChild(option);
    });
    
    // Oppdater kreditt-visning hvis den finnes
    if (creditsDisplay) {
        creditsDisplay.textContent = 'Tilgjengelige kreditter: 0';
        
        // Oppdater kreditt-visning når en student velges
        select.addEventListener('change', function() {
            const studentIndex = parseInt(this.value);
            if (studentIndex >= 0) {
                const student = students[studentIndex];
                creditsDisplay.textContent = `Tilgjengelige kreditter: ${student.credits || 0}`;
                creditsDisplay.style.opacity = '1';
            } else {
                creditsDisplay.textContent = 'Tilgjengelige kreditter: 0';
                creditsDisplay.style.opacity = '0';
            }
        });
    }
}

// Funksjon for å vise items i butikken
function displayShopItems() {
    const container = document.getElementById('shopItemsContainer');
    container.innerHTML = '';
    
    shopItems.forEach(item => {
        const itemElement = createShopItemElement(item);
        container.appendChild(itemElement);
    });
}

// Funksjon for å lage et item-element i butikken
function createShopItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'item-card';
    
    // Legendarisk stil for alle items
    itemElement.style.cssText = `
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.9));
        border: 2px solid #f1c40f;
        box-shadow: 0 0 15px rgba(241, 196, 15, 0.5);
        padding: 15px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        animation: pulse-glow 2s infinite alternate;
    `;
    
    // Legg til hover-effekter
    itemElement.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 0 20px rgba(241, 196, 15, 0.8)';
    });
    
    itemElement.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 0 15px rgba(241, 196, 15, 0.5)';
    });
    
    // Legg til klikk-hendelse for å kjøpe
    itemElement.addEventListener('click', function() {
        let studentIndex;
        const shopSelect = document.getElementById('shopStudentSelect');
        const combinedSelect = document.getElementById('combinedStudentSelect');
        
        if (shopSelect) {
            studentIndex = shopSelect.value;
        } else if (combinedSelect) {
            studentIndex = combinedSelect.value;
        } else {
            alert('Feil: Kunne ikke finne studentvelgeren!');
            return;
        }
        
        if (studentIndex === '') {
            alert('Vennligst velg en elev først!');
            return;
        }
        buyShopItem(parseInt(studentIndex), item);
    });
    
    // Opprett innhold
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    `;
    
    // Legg til ikon
    const iconDiv = document.createElement('div');
    iconDiv.className = 'item-icon';
    iconDiv.style.cssText = `
        font-size: 48px;
        margin-bottom: 10px;
        text-shadow: 0 0 15px #f1c40f;
    `;
    iconDiv.textContent = item.icon;
    contentDiv.appendChild(iconDiv);
    
    // Legg til navn
    const nameDiv = document.createElement('div');
    nameDiv.className = 'item-name';
    nameDiv.style.cssText = `
        color: #f1c40f;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
        text-align: center;
        text-shadow: 0 0 5px rgba(241, 196, 15, 0.5);
    `;
    nameDiv.textContent = item.name;
    contentDiv.appendChild(nameDiv);
    
    // Legg til pris
    const priceDiv = document.createElement('div');
    priceDiv.className = 'shop-item-price';
    priceDiv.innerHTML = `
        <i class="fas fa-coins" style="color: #f1c40f; margin-right: 5px;"></i>
        <span>${item.price} kreditter</span>
    `;
    contentDiv.appendChild(priceDiv);
    
    // Legg til beskrivelse
    const descDiv = document.createElement('div');
    descDiv.className = 'item-description';
    descDiv.style.cssText = `
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        margin-bottom: 10px;
        flex-grow: 1;
        text-align: center;
    `;
    descDiv.textContent = item.description;
    contentDiv.appendChild(descDiv);
    
    // Legg til kjøp-knapp
    const buyButton = document.createElement('button');
    buyButton.style.cssText = `
        background: linear-gradient(180deg, rgba(241, 196, 15, 0.3), rgba(241, 196, 15, 0.1));
        color: #f1c40f;
        border: 2px solid #f1c40f;
        border-radius: 4px;
        padding: 8px 15px;
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
    buyButton.innerHTML = '<i class="fas fa-shopping-cart" style="margin-right: 5px;"></i> Kjøp';
    
    // Legg til hover-effekter for kjøp-knappen
    buyButton.addEventListener('mouseover', function() {
        this.style.background = 'linear-gradient(180deg, rgba(241, 196, 15, 0.5), rgba(241, 196, 15, 0.2))';
        this.style.color = '#f1c40f';
        this.style.opacity = '1';
        this.style.boxShadow = '0 0 8px rgba(241, 196, 15, 0.5)';
    });
    
    buyButton.addEventListener('mouseout', function() {
        this.style.background = 'linear-gradient(180deg, rgba(241, 196, 15, 0.3), rgba(241, 196, 15, 0.1))';
        this.style.color = '#f1c40f';
        this.style.opacity = '0.7';
        this.style.boxShadow = 'none';
    });
    
    contentDiv.appendChild(buyButton);
    itemElement.appendChild(contentDiv);
    
    return itemElement;
}

// Funksjon for å kjøpe en gjenstand
function buyShopItem(studentIndex, item) {
    const student = students[studentIndex];
    
    if ((student.credits || 0) < item.price) {
        alert(`${student.name} har ikke nok kreditter til å kjøpe denne gjenstanden!`);
        return;
    }
    
    // Sjekk om studenten har plass i ryggsekken
    if (!student.items) {
        student.items = [];
    }
    
    if (student.items.length >= 20) {
        alert('Din ryggsekk er full! Du må fjerne noen gjenstander først.');
        return;
    }
    
    // Vis bekreftelsesdialog
    const dialog = document.createElement('div');
    dialog.id = 'buyItemDialog';
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
        color: #f1c40f;
        border: 2px solid #f1c40f;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 0 30px rgba(241, 196, 15, 0.3);
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
        color: #f1c40f;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    title.innerHTML = '<i class="fas fa-shopping-cart" style="margin-right: 10px;"></i> Bekreft kjøp';
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
    
    // Legg til prisinfo
    const priceInfo = document.createElement('div');
    priceInfo.style.cssText = `
        margin: 15px 0;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
    `;
    priceInfo.textContent = `Pris: ${item.price} kreditter`;
    dialog.appendChild(priceInfo);
    
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
        background: rgba(241, 196, 15, 0.3);
        color: #f1c40f;
        border: 1px solid #f1c40f;
        border-radius: 4px;
        padding: 8px 15px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
    `;
    confirmButton.textContent = 'Kjøp';
    confirmButton.onclick = function() {
        // Trekk kreditter fra studenten
        student.credits = (student.credits || 0) - item.price;
        
        // Legg til gjenstanden i ryggsekken
        student.items.push(item.id);
        
        // Vis bekreftelsesmelding
        showItemAcquiredAnimation(item);
        
        // Lagre endringene
        saveData();
        
        // Oppdater visningen
        updateTable();
        updateStudentDropdown();
        document.getElementById('shopStudentExpDisplay').textContent = `Tilgjengelige kreditter: ${student.credits || 0}`;
        
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

// Funksjon for å vise en spesiell animasjon for "Prøv lykken"-itemet
function showLuckyItemAnimation(randomItem) {
    // Bestem bakgrunnsfarge basert på sjeldenhetsgrad
    let rarityColor, rarityGradient;
    switch(randomItem.rarity) {
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
    
    // Opprett container for animasjonen
    const animationContainer = document.createElement('div');
    animationContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        backdrop-filter: blur(3px);
    `;
    
    // Opprett animasjonsinnhold
    const animationContent = document.createElement('div');
    animationContent.style.cssText = `
        text-align: center;
        color: white;
        font-family: 'Courier New', monospace;
        background: ${rarityGradient};
        border: 2px solid ${rarityColor};
        border-radius: 15px;
        box-shadow: 0 0 30px ${rarityColor}80;
        padding: 40px;
        min-width: 400px;
        max-width: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;
    
    // Legg til CSS for animasjoner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); text-shadow: 0 0 40px currentColor; }
            50% { transform: scale(1.2); text-shadow: 0 0 60px currentColor; }
            100% { transform: scale(1); text-shadow: 0 0 40px currentColor; }
        }
        @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Opprett tittel
    const title = document.createElement('h2');
    title.style.cssText = `
        font-size: 28px;
        margin: 0;
        color: ${rarityColor};
        text-shadow: 0 0 10px ${rarityColor};
        text-transform: uppercase;
        letter-spacing: 2px;
    `;
    title.textContent = 'Du prøvde lykken!';
    animationContent.appendChild(title);
    
    // Opprett gjenstandsikon
    const itemIcon = document.createElement('div');
    itemIcon.style.cssText = `
        font-size: 80px;
        margin: 20px 0;
        animation: pulse 2s infinite alternate;
        color: ${rarityColor};
        text-shadow: 0 0 20px ${rarityColor};
    `;
    itemIcon.textContent = randomItem.icon;
    animationContent.appendChild(itemIcon);
    
    // Opprett gjenstandsnavn
    const itemName = document.createElement('h3');
    itemName.style.cssText = `
        font-size: 24px;
        margin: 0;
        color: white;
        text-shadow: 0 0 10px ${rarityColor};
        text-transform: uppercase;
        letter-spacing: 1px;
    `;
    itemName.textContent = randomItem.name;
    animationContent.appendChild(itemName);
    
    // Opprett sjeldenhetsgrad
    const rarityText = document.createElement('div');
    rarityText.style.cssText = `
        font-size: 18px;
        margin: 5px 0 15px;
        color: ${rarityColor};
        text-shadow: 0 0 5px ${rarityColor};
        font-weight: bold;
    `;
    rarityText.textContent = randomItem.rarity === 'rare' ? 'SJELDEN' : 
                            randomItem.rarity === 'epic' ? 'EPISK' : 
                            'LEGENDARISK';
    animationContent.appendChild(rarityText);
    
    // Opprett gjenstandsbeskrivelse
    const itemDesc = document.createElement('p');
    itemDesc.style.cssText = `
        font-size: 16px;
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        line-height: 1.4;
    `;
    itemDesc.textContent = randomItem.description;
    animationContent.appendChild(itemDesc);
    
    // Opprett lukkeknapp
    const closeButton = document.createElement('button');
    closeButton.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid ${rarityColor};
        color: white;
        padding: 8px 20px;
        border-radius: 5px;
        margin-top: 20px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        transition: all 0.3s ease;
    `;
    closeButton.textContent = 'LUKK';
    closeButton.onmouseover = function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.boxShadow = `0 0 15px rgba(255, 255, 255, 0.3)`;
        this.style.transform = 'translateY(-2px)';
    };
    closeButton.onmouseout = function() {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
        this.style.boxShadow = 'none';
        this.style.transform = 'translateY(0)';
    };
    closeButton.onclick = function() {
        animationContainer.remove();
        style.remove();
    };
    animationContent.appendChild(closeButton);
    
    // Legg til innhold i container
    animationContainer.appendChild(animationContent);
    
    // Legg til container i DOM
    document.body.appendChild(animationContainer);
    
    // Spill av lyd
    playItemFoundSound();
    
    // Legg til event listener for å lukke ved klikk på bakgrunn
    animationContainer.addEventListener('click', function(event) {
        if (event.target === animationContainer) {
            animationContainer.remove();
            style.remove();
        }
    });
    
    // Legg til event listener for å lukke ved Escape-tasten
    const escapeListener = function(event) {
        if (event.key === 'Escape') {
            animationContainer.remove();
            style.remove();
            document.removeEventListener('keydown', escapeListener);
        }
    };
    document.addEventListener('keydown', escapeListener);
} 