// Globale variabler for butikk-fanen
let shopItemsContainer;
let shopRecommendedContainer;
let shopSearchInput;
let shopCategories;
let shopItemModal;

// Funksjon for å initialisere butikk-fanen
function initShopTab() {
    // Hent DOM-elementer
    shopItemsContainer = document.getElementById('shop-items');
    shopRecommendedContainer = document.getElementById('shop-recommended');
    shopSearchInput = document.getElementById('shop-search-input');
    shopCategories = document.querySelectorAll('.shop-category');
    shopItemModal = document.getElementById('item-modal');
    
    // Legg til event listeners for kategorier
    shopCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryName = category.getAttribute('data-category');
            
            // Fjern active-klassen fra alle kategorier
            shopCategories.forEach(cat => cat.classList.remove('active'));
            
            // Legg til active-klassen på den valgte kategorien
            category.classList.add('active');
            
            // Filtrer butikkvarer basert på kategori
            filterShopItems(categoryName);
        });
    });
}

// Funksjon for å laste inn butikkvarer
async function loadShopItems() {
    try {
        // Bruk databaseService for å hente alle gjenstander
        const { success, data, error } = await window.databaseService.item.getAllItems();
        
        if (!success) {
            throw new Error(error || 'Feil ved henting av butikkvarer');
        }
        
        // Lagre gjenstander globalt
        window.shopItems = data;
        
        // Oppsett av kategorier og søk
        setupShopCategories(data);
        setupShopSearch(data);
        
        // Vis anbefalte gjenstander
        const recommendedItems = data.filter(item => item.featured || item.popular || item.new);
        displayRecommendedItems(recommendedItems, shopRecommendedContainer);
        
        // Vis alle gjenstander
        displayShopItems(data, shopItemsContainer);
    } catch (error) {
        console.error('Feil ved lasting av butikkvarer:', error);
        if (shopItemsContainer) {
            shopItemsContainer.innerHTML = `
                <div class="shop-empty">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Kunne ikke laste butikkvarer. Vennligst prøv igjen senere.</p>
                    <button onclick="loadShopItems()" class="retry-button">Prøv igjen</button>
                </div>
            `;
        }
    }
}

// Funksjon for å sette opp kategorier
function setupShopCategories(items) {
    // Finn unike kategorier
    const categories = [...new Set(items.map(item => item.type))];
    
    // Legg til event listeners for kategorier
    shopCategories.forEach(category => {
        const categoryName = category.getAttribute('data-category');
        
        // Sjekk om kategorien finnes i dataene
        if (categoryName === 'all' || categories.includes(categoryName)) {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
}

// Funksjon for å sette opp søk
function setupShopSearch(items) {
    if (!shopSearchInput) return;
    
    shopSearchInput.addEventListener('input', debounce(async function() {
        const searchTerm = shopSearchInput.value.trim().toLowerCase();
        
        if (searchTerm.length === 0) {
            // Vis alle gjenstander hvis søkefeltet er tomt
            displayShopItems(items, shopItemsContainer);
            return;
        }
        
        try {
            // Bruk databaseService for å søke etter gjenstander
            const { success, data, error } = await window.databaseService.item.searchItems(searchTerm);
            
            if (!success) {
                throw new Error(error || 'Feil ved søk etter gjenstander');
            }
            
            // Vis søkeresultater
            displayShopItems(data, shopItemsContainer);
        } catch (error) {
            console.error('Feil ved søk etter gjenstander:', error);
            shopItemsContainer.innerHTML = `
                <div class="shop-empty">
                    <i class="fas fa-search"></i>
                    <p>Ingen gjenstander funnet for "${searchTerm}"</p>
                </div>
            `;
        }
    }, 300));
}

// Hjelpefunksjon for å begrense antall søk (debounce)
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Funksjon for å filtrere butikkvarer basert på kategori
function filterShopItems(category) {
    const items = window.shopItems || [];
    
    if (category === 'all') {
        // Vis alle gjenstander
        displayShopItems(items, shopItemsContainer);
    } else {
        // Filtrer gjenstander basert på kategori
        const filteredItems = items.filter(item => item.type === category);
        displayShopItems(filteredItems, shopItemsContainer);
    }
}

// Funksjon for å vise anbefalte gjenstander
function displayRecommendedItems(items, container) {
    if (!container) return;
    
    // Begrens til 4 anbefalte gjenstander
    const recommendedItems = items.slice(0, 4);
    
    if (recommendedItems.length === 0) {
        container.innerHTML = `
            <div class="shop-empty">
                <p>Ingen anbefalte gjenstander for øyeblikket.</p>
            </div>
        `;
        return;
    }
    
    // Opprett HTML for anbefalte gjenstander
    const itemsHTML = recommendedItems.map(item => createShopItemElement(item)).join('');
    container.innerHTML = itemsHTML;
    
    // Legg til event listeners for gjenstander
    recommendedItems.forEach((item, index) => {
        const element = container.children[index];
        if (element) {
            element.addEventListener('click', () => showItemDetails(item));
        }
    });
}

// Funksjon for å vise butikkvarer
function displayShopItems(items, container) {
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="shop-empty">
                <i class="fas fa-store-slash"></i>
                <p>Ingen gjenstander funnet.</p>
            </div>
        `;
        return;
    }
    
    // Opprett HTML for butikkvarer
    const itemsHTML = items.map(item => createShopItemElement(item)).join('');
    container.innerHTML = itemsHTML;
    
    // Legg til event listeners for gjenstander
    items.forEach((item, index) => {
        const element = container.children[index];
        if (element) {
            element.addEventListener('click', () => showItemDetails(item));
        }
    });
}

// Funksjon for å opprette HTML for en butikkvare
function createShopItemElement(item) {
    // Bestem ikon basert på gjenstandstype
    let iconClass = 'fas fa-cube';
    
    if (item.type === 'boost') {
        iconClass = 'fas fa-bolt';
    } else if (item.type === 'equipment') {
        iconClass = 'fas fa-shield-alt';
    } else if (item.type === 'consumable') {
        iconClass = 'fas fa-flask';
    } else if (item.type === 'special') {
        iconClass = 'fas fa-star';
    }
    
    // Bestem farge basert på sjeldenhet
    let rarityColor = '#aaa';
    let rarityClass = '';
    
    if (item.rarity === 'uncommon') {
        rarityColor = '#1eff00';
        rarityClass = 'uncommon';
    } else if (item.rarity === 'rare') {
        rarityColor = '#0070dd';
        rarityClass = 'rare';
    } else if (item.rarity === 'epic') {
        rarityColor = '#a335ee';
        rarityClass = 'epic';
    } else if (item.rarity === 'legendary') {
        rarityColor = '#ff8000';
        rarityClass = 'legendary';
    }
    
    // Opprett HTML for gjenstanden
    return `
        <div class="shop-item ${rarityClass}" data-id="${item.id}">
            <div class="shop-item-icon" style="color: ${rarityColor}">
                <i class="${iconClass}"></i>
            </div>
            <div class="shop-item-info">
                <div class="shop-item-name" style="color: ${rarityColor}">${item.name}</div>
                <div class="shop-item-type">${getItemTypeText(item.type)}</div>
                <div class="shop-item-description">${item.description}</div>
                <div class="shop-item-price">${item.price} <i class="fas fa-coins"></i></div>
            </div>
            ${item.new ? '<div class="shop-item-badge new">NY!</div>' : ''}
            ${item.sale ? '<div class="shop-item-badge sale">SALG!</div>' : ''}
        </div>
    `;
}

// Funksjon for å vise detaljer om en gjenstand
function showItemDetails(item) {
    if (!shopItemModal) return;
    
    // Hent elementer fra modalen
    const closeModal = shopItemModal.querySelector('.close-modal');
    const itemIcon = shopItemModal.querySelector('.item-detail-icon i');
    const itemName = shopItemModal.querySelector('.item-detail-title h3');
    const itemRarity = shopItemModal.querySelector('.item-detail-rarity');
    const itemDescription = shopItemModal.querySelector('.item-detail-description');
    const itemType = shopItemModal.querySelector('.item-detail-type');
    const itemPrice = shopItemModal.querySelector('.item-detail-price');
    const itemEffect = shopItemModal.querySelector('.item-detail-effect');
    const buyButton = shopItemModal.querySelector('#detail-buy-button');
    const itemPriceButton = shopItemModal.querySelector('.item-detail-price-button');
    
    // Bestem ikon basert på gjenstandstype
    let iconClass = 'fas fa-cube';
    
    if (item.type === 'boost') {
        iconClass = 'fas fa-bolt';
    } else if (item.type === 'equipment') {
        iconClass = 'fas fa-shield-alt';
    } else if (item.type === 'consumable') {
        iconClass = 'fas fa-flask';
    } else if (item.type === 'special') {
        iconClass = 'fas fa-star';
    }
    
    // Bestem farge og tekst basert på sjeldenhet
    let rarityColor = '#aaa';
    let rarityText = 'Vanlig';
    
    if (item.rarity === 'uncommon') {
        rarityColor = '#1eff00';
        rarityText = 'Uvanlig';
    } else if (item.rarity === 'rare') {
        rarityColor = '#0070dd';
        rarityText = 'Sjelden';
    } else if (item.rarity === 'epic') {
        rarityColor = '#a335ee';
        rarityText = 'Episk';
    } else if (item.rarity === 'legendary') {
        rarityColor = '#ff8000';
        rarityText = 'Legendarisk';
    }
    
    // Oppdater modal med gjenstandsinformasjon
    itemIcon.className = iconClass;
    itemIcon.style.color = rarityColor;
    itemName.textContent = item.name;
    itemName.style.color = rarityColor;
    itemRarity.textContent = rarityText;
    itemRarity.style.color = rarityColor;
    itemDescription.textContent = item.description;
    itemType.textContent = getItemTypeText(item.type);
    itemPrice.innerHTML = `${item.price} <i class="fas fa-coins"></i>`;
    itemEffect.textContent = item.effect || 'Ingen effekt';
    itemPriceButton.textContent = item.price;
    
    // Legg til event listener for kjøp-knappen
    buyButton.onclick = () => buyShopItem(item);
    
    // Vis modalen
    shopItemModal.style.display = 'block';
    
    // Legg til event listener for å lukke modalen
    closeModal.onclick = () => {
        shopItemModal.style.display = 'none';
    };
    
    // Lukk modalen når brukeren klikker utenfor
    window.onclick = (event) => {
        if (event.target === shopItemModal) {
            shopItemModal.style.display = 'none';
        }
    };
}

// Funksjon for å kjøpe en gjenstand
async function buyShopItem(item) {
    try {
        // Sjekk om brukeren er logget inn
        if (!userProfile || !userProfile.id) {
            throw new Error('Du må være logget inn for å kjøpe gjenstander');
        }
        
        // Sjekk om brukeren har nok kreditter
        if (userProfile.credits < item.price) {
            throw new Error('Du har ikke nok kreditter til å kjøpe denne gjenstanden');
        }
        
        // Oppdater brukerens kreditter
        const newCredits = userProfile.credits - item.price;
        const { success: creditSuccess, error: creditError } = await window.databaseService.user.updateCredits(userProfile.id, newCredits);
        
        if (!creditSuccess) {
            throw new Error(creditError || 'Feil ved oppdatering av kreditter');
        }
        
        // Oppdater brukerens inventar
        const inventory = userProfile.inventory || [];
        
        // Legg til gjenstanden i inventaret
        const newItem = {
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            rarity: item.rarity,
            effect: item.effect,
            effect_type: item.effect_type,
            effect_value: item.effect_value,
            effect_skill: item.effect_skill,
            usable: item.usable,
            acquired_at: new Date().toISOString()
        };
        
        inventory.push(newItem);
        
        const { success: inventorySuccess, error: inventoryError } = await window.databaseService.user.updateInventory(userProfile.id, inventory);
        
        if (!inventorySuccess) {
            throw new Error(inventoryError || 'Feil ved oppdatering av inventar');
        }
        
        // Oppdater brukerens kreditter brukt (for statistikk)
        await updateCreditsSpent(item.price);
        
        // Oppdater brukerprofilobjektet lokalt
        userProfile.credits = newCredits;
        userProfile.inventory = inventory;
        
        // Oppdater UI
        if (playerCreditsElement) {
            playerCreditsElement.textContent = newCredits;
        }
        
        // Vis bekreftelse
        showNotification(`Du har kjøpt ${item.name} for ${item.price} kreditter!`, 'success');
        
        // Lukk modalen
        if (shopItemModal) {
            shopItemModal.style.display = 'none';
        }
        
        // Oppdater inventar-fanen hvis den er tilgjengelig
        if (typeof loadInventoryItems === 'function') {
            loadInventoryItems();
        }
    } catch (error) {
        console.error('Feil ved kjøp av gjenstand:', error);
        showNotification(error.message || 'Feil ved kjøp av gjenstand', 'error');
    }
}

// Funksjon for å oppdatere kreditter brukt (for statistikk)
async function updateCreditsSpent(amount) {
    try {
        // Hent gjeldende statistikk
        const stats = userProfile.stats || {};
        
        // Oppdater kreditter brukt
        stats.credits_spent = (stats.credits_spent || 0) + amount;
        
        // Lagre oppdatert statistikk
        await window.databaseService.user.updateUserProfile(userProfile.id, { stats });
        
        // Oppdater lokalt objekt
        userProfile.stats = stats;
    } catch (error) {
        console.error('Feil ved oppdatering av statistikk:', error);
    }
}

// Hjelpefunksjon for å få tekst for gjenstandstype
function getItemTypeText(type) {
    switch (type) {
        case 'boost':
            return 'Boost';
        case 'equipment':
            return 'Utstyr';
        case 'consumable':
            return 'Forbruksvare';
        case 'special':
            return 'Spesial';
        default:
            return 'Ukjent';
    }
}

// Hjelpefunksjon for å gjøre første bokstav stor
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Eksporter funksjoner
window.initShopTab = initShopTab;
window.loadShopItems = loadShopItems; 