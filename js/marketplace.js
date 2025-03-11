// Bruktmarked System
let marketplaceItems = [];

// Last inn bruktmarked-data når siden lastes
document.addEventListener('DOMContentLoaded', function() {
    loadMarketplaceData();
    
    // Legg til event listener for lukkeknappen
    const closeButton = document.querySelector('#marketplaceModal .close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeMarketplaceModal);
    }
});

// Funksjon for å lagre bruktmarked-data
function saveMarketplaceData() {
    localStorage.setItem('marketplaceItems', JSON.stringify(marketplaceItems));
}

// Funksjon for å laste bruktmarked-data
function loadMarketplaceData() {
    const savedItems = localStorage.getItem('marketplaceItems');
    if (savedItems) {
        marketplaceItems = JSON.parse(savedItems);
    }
}

// Funksjon for å legge til en gjenstand i bruktmarkedet
function addItemToMarketplace(studentIndex, itemId, price) {
    const student = students[studentIndex];
    const item = items.find(i => i.id === itemId);
    
    if (!item) {
        alert('Gjenstanden ble ikke funnet!');
        return false;
    }
    
    // Sjekk om studenten eier gjenstanden
    if (!student.items || !student.items.includes(itemId)) {
        alert('Du eier ikke denne gjenstanden!');
        return false;
    }
    
    // Fjern gjenstanden fra studentens ryggsekk
    student.items = student.items.filter(id => id !== itemId);
    
    // Legg til i bruktmarkedet
    marketplaceItems.push({
        id: Date.now(), // Unik ID for markedsplass-oppføringen
        itemId: itemId,
        sellerIndex: studentIndex,
        price: price,
        timestamp: Date.now()
    });
    
    // Lagre endringer
    saveData();
    saveMarketplaceData();
    
    return true;
}

// Funksjon for å oppdatere student dropdown
function updateMarketplaceStudentSelect() {
    const select = document.getElementById('marketplaceStudentSelect');
    const creditsDisplay = document.getElementById('marketplaceStudentExpDisplay');
    
    // Tøm eksisterende valg
    select.innerHTML = '<option value="">Velg kjøper...</option>';
    
    // Legg til alle studenter
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${student.name} (${student.credits || 0} kreditter)`;
        select.appendChild(option);
    });
    
    // Oppdater kreditt-visning når en student velges
    select.addEventListener('change', function() {
        const studentIndex = parseInt(this.value);
        if (studentIndex >= 0) {
            const student = students[studentIndex];
            creditsDisplay.textContent = `Tilgjengelige kreditter: ${student.credits || 0}`;
            creditsDisplay.style.opacity = '1';
        } else {
            creditsDisplay.textContent = '';
            creditsDisplay.style.opacity = '0';
        }
    });
    
    // Legg til hover-effekter
    select.addEventListener('mouseover', function() {
        this.style.background = 'rgba(0, 0, 0, 0.8)';
        this.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)';
    });
    
    select.addEventListener('mouseout', function() {
        this.style.background = 'rgba(0, 0, 0, 0.7)';
        this.style.boxShadow = 'none';
    });
}

// Funksjon for å åpne bruktmarked-modalen
function openMarketplaceModal() {
    const modal = document.getElementById('marketplaceModal');
    
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
    updateMarketplaceStudentSelect();
    
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
        closeMarketplaceModal();
    });
    
    // Vis alle items
    displayMarketplaceItems();
}

// Funksjon for å lukke bruktmarked-modalen
function closeMarketplaceModal() {
    const modal = document.getElementById('marketplaceModal');
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

// Funksjon for å vise items i bruktmarkedet
function displayMarketplaceItems() {
    const container = document.getElementById('marketplaceItems');
    if (!container) {
        console.error('Fant ikke marketplaceItems container');
        return;
    }
    container.innerHTML = '';
    
    if (marketplaceItems.length === 0) {
        container.innerHTML = `
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
                <i class="fas fa-store" style="font-size: 32px; margin-bottom: 15px; display: block;"></i>
                INGEN GJENSTANDER TILGJENGELIG I BRUKTMARKEDET<br>
                <span style="font-size: 14px; opacity: 0.7; margin-top: 10px; display: block;">Vær den første som legger ut en gjenstand!</span>
            </div>
        `;
        return;
    }
    
    console.log('Viser', marketplaceItems.length, 'gjenstander i bruktmarkedet');
    
    marketplaceItems.forEach(marketplaceItem => {
        const item = items.find(i => i.id === marketplaceItem.itemId);
        const seller = students[marketplaceItem.sellerIndex];
        
        if (item && seller) {
            const itemElement = createMarketplaceItemElement(item, seller, marketplaceItem);
            container.appendChild(itemElement);
        }
    });
}

// Funksjon for å lage et item-element i bruktmarkedet
function createMarketplaceItemElement(item, seller, marketplaceItem) {
    const itemElement = document.createElement('div');
    itemElement.className = 'marketplace-item';
    
    // Bestem farge basert på sjeldenhetsgrad
    let rarityColor, rarityGlow, rarityName;
    
    switch(item.rarity) {
        case 'common':
            rarityColor = '#95a5a6';
            rarityGlow = 'rgba(149, 165, 166, 0.5)';
            rarityName = 'VANLIG';
            break;
        case 'uncommon':
            rarityColor = '#2ecc71';
            rarityGlow = 'rgba(46, 204, 113, 0.5)';
            rarityName = 'UVANLIG';
            break;
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
    
    itemElement.style.cssText = `
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.9));
        border: 2px solid ${rarityColor};
        box-shadow: 0 0 15px ${rarityGlow};
        padding: 15px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        height: 100%;
    `;
    
    // Legg til hover-effekter
    itemElement.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = `0 0 20px ${rarityGlow}`;
    });
    
    itemElement.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = `0 0 15px ${rarityGlow}`;
    });
    
    // Opprett innholdsdiv
    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    `;
    
    // Legg til sjeldenhetsmerke
    const rarityBadge = document.createElement('div');
    rarityBadge.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: ${rarityColor}22;
        color: ${rarityColor};
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border: 1px solid ${rarityColor}44;
    `;
    rarityBadge.textContent = rarityName;
    itemElement.appendChild(rarityBadge);
    
    // Legg til ikon
    const iconDiv = document.createElement('div');
    iconDiv.style.cssText = `
        font-size: 32px;
        color: ${rarityColor};
        margin-bottom: 12px;
        text-shadow: 0 0 10px ${rarityGlow};
    `;
    iconDiv.innerHTML = item.icon || '<i class="fas fa-question-circle"></i>';
    contentDiv.appendChild(iconDiv);
    
    // Legg til navn
    const nameDiv = document.createElement('div');
    nameDiv.style.cssText = `
        color: ${rarityColor};
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 6px;
        text-align: center;
        text-shadow: 0 0 5px ${rarityGlow};
    `;
    nameDiv.textContent = item.name;
    contentDiv.appendChild(nameDiv);
    
    // Legg til pris
    const priceDiv = document.createElement('div');
    priceDiv.className = 'marketplace-item-price';
    priceDiv.innerHTML = `
        <i class="fas fa-coins" style="color: #f1c40f; margin-right: 5px;"></i>
        <span>${marketplaceItem.price} kreditter</span>
    `;
    contentDiv.appendChild(priceDiv);
    
    // Legg til beskrivelse
    const descDiv = document.createElement('div');
    descDiv.style.cssText = `
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        margin-bottom: 10px;
        flex-grow: 1;
        text-align: center;
        line-height: 1.4;
    `;
    descDiv.textContent = item.description;
    contentDiv.appendChild(descDiv);
    
    // Legg til selger-info
    const sellerDiv = document.createElement('div');
    sellerDiv.style.cssText = `
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        margin-top: 6px;
        font-style: italic;
    `;
    sellerDiv.textContent = `Selger: ${seller.name}`;
    contentDiv.appendChild(sellerDiv);
    
    // Legg til kjøp-knapp
    const buyButton = document.createElement('button');
    buyButton.style.cssText = `
        background: linear-gradient(180deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.3), rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.1));
        color: ${rarityColor};
        border: 2px solid ${rarityColor};
        border-radius: 4px;
        padding: 8px 15px;
        font-size: 13px;
        cursor: pointer;
        margin-top: 6px;
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
        this.style.background = `linear-gradient(180deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.5), rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.2))`;
        this.style.color = rarityColor;
        this.style.opacity = '1';
        this.style.boxShadow = `0 0 8px ${rarityGlow}`;
    });
    
    buyButton.addEventListener('mouseout', function() {
        this.style.background = `linear-gradient(180deg, rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.3), rgba(${rarityColor.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16)).join(', ')}, 0.1))`;
        this.style.color = rarityColor;
        this.style.opacity = '0.7';
        this.style.boxShadow = 'none';
    });
    
    // Legg til klikk-hendelse for kjøp-knappen
    buyButton.addEventListener('click', function() {
        buyMarketplaceItem(marketplaceItem.id);
    });
    
    contentDiv.appendChild(buyButton);
    itemElement.appendChild(contentDiv);
    
    return itemElement;
}

// Funksjon for å kjøpe en gjenstand fra bruktmarkedet
function buyMarketplaceItem(marketplaceItemId) {
    const studentIndex = parseInt(document.getElementById('marketplaceStudentSelect').value);
    if (isNaN(studentIndex) || studentIndex < 0) {
        alert('Vennligst velg en kjøper først!');
        return;
    }
    
    const marketplaceItem = marketplaceItems.find(item => item.id === marketplaceItemId);
    if (!marketplaceItem) {
        alert('Gjenstanden ble ikke funnet i bruktmarkedet!');
        return;
    }
    
    const buyer = students[studentIndex];
    const seller = students[marketplaceItem.sellerIndex];
    const item = items.find(i => i.id === marketplaceItem.itemId);
    
    if (!buyer || !seller || !item) {
        alert('Feil ved kjøp: Manglende data!');
        return;
    }
    
    // Sjekk om kjøperen har nok kreditter
    if ((buyer.credits || 0) < marketplaceItem.price) {
        alert(`${buyer.name} har ikke nok kreditter til å kjøpe denne gjenstanden!`);
        return;
    }
    
    // Trekk kreditter fra kjøper
    buyer.credits = (buyer.credits || 0) - marketplaceItem.price;
    
    // Legg til kreditter til selger
    seller.credits = (seller.credits || 0) + marketplaceItem.price;
    
    // Legg til gjenstanden i kjøperens ryggsekk
    if (!buyer.items) {
        buyer.items = [];
    }
    buyer.items.push(marketplaceItem.itemId);
    
    // Fjern gjenstanden fra markedsplassen
    marketplaceItems = marketplaceItems.filter(item => item.id !== marketplaceItemId);
    
    // Lagre endringer
    saveData();
    saveMarketplaceData();
    
    // Oppdater visningen
    displayMarketplaceItems();
    document.getElementById('marketplaceStudentExpDisplay').textContent = `Tilgjengelige kreditter: ${buyer.credits || 0}`;
    
    // Vis bekreftelsesmelding
    alert(`${buyer.name} kjøpte ${item.name} for ${marketplaceItem.price} kreditter!`);
}

// Eksporter funksjoner
window.openMarketplaceModal = openMarketplaceModal;
window.closeMarketplaceModal = closeMarketplaceModal;
window.addItemToMarketplace = addItemToMarketplace;
window.buyMarketplaceItem = buyMarketplaceItem;
window.displayMarketplaceItems = displayMarketplaceItems; 