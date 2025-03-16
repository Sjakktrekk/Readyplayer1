// Globale variabler for inventory-fanen
let inventoryItemsContainer;
let inventoryItemModal;
let closeModalButton;
let itemDetailsContainer;

// Funksjon for å initialisere inventory-fanen
function initInventoryTab() {
    // Hent DOM-elementer
    inventoryItemsContainer = document.getElementById('inventory-items');
    inventoryItemModal = document.getElementById('item-modal');
    closeModalButton = document.querySelector('.close-modal');
    
    // Legg til event listeners
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            inventoryItemModal.style.display = 'none';
        });
    }
    
    // Lukk modal når brukeren klikker utenfor modalen
    window.addEventListener('click', (event) => {
        if (event.target === inventoryItemModal) {
            inventoryItemModal.style.display = 'none';
        }
    });
    
    // Test-knapp for inventory (kan fjernes i produksjon)
    const testInventoryButton = document.getElementById('test-inventory-button');
    if (testInventoryButton) {
        testInventoryButton.addEventListener('click', () => {
            addRandomItemToInventory();
        });
    }
}

// Funksjon for å laste inn inventory-elementer
function loadInventoryItems() {
    if (!window.userProfile) {
        console.error('Brukerprofil ikke tilgjengelig');
        return;
    }
    
    updateInventoryTab();
}

// Funksjon for å oppdatere inventory-fanen
function updateInventoryTab() {
    if (!window.userProfile) {
        console.error('Brukerprofil ikke tilgjengelig');
        return;
    }
    
    const inventory = window.userProfile.inventory || [];
    
    if (!inventoryItemsContainer) {
        console.error('Inventory container ikke funnet');
        return;
    }
    
    // Tøm container
    inventoryItemsContainer.innerHTML = '';
    
    if (inventory.length === 0) {
        inventoryItemsContainer.innerHTML = '<div class="empty-message">Inventaret ditt er tomt.</div>';
        return;
    }
    
    // Hent alle tilgjengelige gjenstander
    fetchAllItems().then(allItems => {
        // Vis gjenstander i inventory
        inventory.forEach(inventoryItem => {
            const item = allItems.find(i => i.id === inventoryItem.id);
            if (item) {
                const itemElement = createInventoryItemElement(item, inventoryItem.quantity);
                inventoryItemsContainer.appendChild(itemElement);
            }
        });
    });
}

// Funksjon for å hente alle gjenstander
async function fetchAllItems() {
    if (!window.dashboardBase || !window.dashboardBase.supabase) {
        console.error('dashboardBase eller supabase ikke tilgjengelig');
        return [];
    }
    
    const { supabase, showNotification } = window.dashboardBase;
    
    const { data, error } = await supabase
        .from('items')
        .select('*');
    
    if (error) {
        console.error('Feil ved henting av gjenstander:', error);
        showNotification('Feil ved henting av gjenstander. Prøv igjen senere.', 'error');
        return [];
    }
    
    return data || [];
}

// Funksjon for å opprette et inventory-element
function createInventoryItemElement(item, quantity = 1) {
    const itemCard = document.createElement('div');
    itemCard.className = `item-card ${item.rarity}`;
    itemCard.setAttribute('data-item-id', item.id);
    itemCard.setAttribute('data-rarity', item.rarity);
    
    // Bestem ikonet basert på gjenstandstypen
    let iconClass = 'fas fa-question';
    switch (item.type) {
        case 'boost':
            iconClass = 'fas fa-bolt';
            break;
        case 'equipment':
            iconClass = 'fas fa-shield-alt';
            break;
        case 'consumable':
            iconClass = 'fas fa-flask';
            break;
        case 'special':
            iconClass = 'fas fa-star';
            break;
    }
    
    itemCard.innerHTML = `
        <div class="item-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="item-name">${item.name}</div>
        <div class="item-rarity">${capitalizeFirstLetter(item.rarity)}</div>
        <div class="item-quantity">x${quantity}</div>
    `;
    
    // Legg til event listener for å vise detaljer
    itemCard.addEventListener('click', () => {
        showItemDetails(item, quantity);
    });
    
    return itemCard;
}

// Funksjon for å vise detaljer om en gjenstand
function showItemDetails(item, quantity = 1) {
    if (!inventoryItemModal) {
        console.error('Item modal ikke funnet');
        return;
    }
    
    // Oppdater modal med gjenstandsdetaljer
    const itemDetailTitle = inventoryItemModal.querySelector('.item-detail-title h3');
    const itemDetailRarity = inventoryItemModal.querySelector('.item-detail-rarity');
    const itemDetailDescription = inventoryItemModal.querySelector('.item-detail-description');
    const itemDetailType = inventoryItemModal.querySelector('.item-detail-type');
    const itemDetailPrice = inventoryItemModal.querySelector('.item-detail-price');
    const itemDetailEffect = inventoryItemModal.querySelector('.item-detail-effect');
    const itemDetailIcon = inventoryItemModal.querySelector('.item-detail-icon i');
    const buyButton = inventoryItemModal.querySelector('#detail-buy-button');
    
    if (itemDetailTitle) itemDetailTitle.textContent = item.name;
    if (itemDetailRarity) itemDetailRarity.textContent = capitalizeFirstLetter(item.rarity);
    if (itemDetailDescription) itemDetailDescription.textContent = item.description;
    if (itemDetailType) itemDetailType.textContent = getItemTypeText(item.type);
    if (itemDetailPrice) itemDetailPrice.innerHTML = `${item.price} <i class="fas fa-coins"></i>`;
    if (itemDetailEffect) itemDetailEffect.textContent = item.effect || 'Ingen effekt';
    
    // Oppdater ikonet basert på gjenstandstypen
    if (itemDetailIcon) {
        let iconClass = 'fas fa-question';
        switch (item.type) {
            case 'boost':
                iconClass = 'fas fa-bolt';
                break;
            case 'equipment':
                iconClass = 'fas fa-shield-alt';
                break;
            case 'consumable':
                iconClass = 'fas fa-flask';
                break;
            case 'special':
                iconClass = 'fas fa-star';
                break;
        }
        itemDetailIcon.className = iconClass;
    }
    
    // Skjul kjøp-knappen i inventory-visningen
    if (buyButton) {
        buyButton.style.display = 'none';
    }
    
    // Legg til bruk-knapp hvis gjenstanden kan brukes
    const actionContainer = inventoryItemModal.querySelector('.item-actions') || document.createElement('div');
    actionContainer.className = 'item-actions';
    actionContainer.innerHTML = '';
    
    if (item.usable) {
        const useButton = document.createElement('button');
        useButton.className = 'use-button';
        useButton.innerHTML = '<i class="fas fa-hand-pointer"></i> Bruk';
        useButton.addEventListener('click', () => {
            useItem(item);
        });
        actionContainer.appendChild(useButton);
    }
    
    // Legg til selg-knapp
    const sellButton = document.createElement('button');
    sellButton.className = 'sell-button';
    sellButton.innerHTML = `<i class="fas fa-coins"></i> Selg (${Math.floor(item.price * 0.7)})`;
    sellButton.addEventListener('click', () => {
        sellItem(item);
    });
    actionContainer.appendChild(sellButton);
    
    // Legg til action-container hvis den ikke allerede finnes
    if (!inventoryItemModal.querySelector('.item-actions')) {
        inventoryItemModal.querySelector('.item-details').appendChild(actionContainer);
    }
    
    // Vis modal
    inventoryItemModal.style.display = 'block';
}

// Funksjon for å bruke en gjenstand
async function useItem(item) {
    if (!window.dashboardBase || !window.dashboardBase.userProfile) {
        console.error('dashboardBase eller userProfile ikke tilgjengelig');
        return;
    }
    
    const { userProfile, supabase, showNotification } = window.dashboardBase;
    
    // Finn gjenstanden i inventory
    const inventory = userProfile.inventory || [];
    const inventoryItem = inventory.find(i => i.id === item.id);
    
    if (!inventoryItem || inventoryItem.quantity <= 0) {
        showNotification('Du har ikke denne gjenstanden i inventaret ditt.', 'error');
        return;
    }
    
    // Implementer effekten av gjenstanden
    let effectApplied = false;
    let effectMessage = '';
    
    switch (item.effect_type) {
        case 'exp_boost':
            const expBoost = item.effect_value || 100;
            const newExp = userProfile.exp + expBoost;
            await window.dashboardBase.updateExp(userProfile.id, newExp);
            effectApplied = true;
            effectMessage = `Du fikk ${expBoost} EXP!`;
            break;
        case 'credit_boost':
            const creditBoost = item.effect_value || 50;
            const newCredits = userProfile.credits + creditBoost;
            await window.dashboardBase.updateCredits(userProfile.id, newCredits);
            effectApplied = true;
            effectMessage = `Du fikk ${creditBoost} kreditter!`;
            break;
        case 'skill_boost':
            if (item.effect_skill && userProfile.skills && userProfile.skills[item.effect_skill] !== undefined) {
                const skillBoost = item.effect_value || 1;
                const newSkillValue = Math.min(30, userProfile.skills[item.effect_skill] + skillBoost);
                
                const { data, error } = await supabase
                    .from('profiles')
                    .update({
                        skills: { ...userProfile.skills, [item.effect_skill]: newSkillValue }
                    })
                    .eq('id', userProfile.id);
                
                if (!error) {
                    effectApplied = true;
                    effectMessage = `${item.effect_skill} økt med ${skillBoost} nivå!`;
                }
            }
            break;
        default:
            effectMessage = 'Denne gjenstanden har ingen effekt ennå.';
            break;
    }
    
    if (effectApplied) {
        // Reduser antallet av gjenstanden i inventory
        const updatedInventory = inventory.map(i => {
            if (i.id === item.id) {
                return { ...i, quantity: i.quantity - 1 };
            }
            return i;
        }).filter(i => i.quantity > 0);
        
        // Oppdater inventory i databasen
        const { data, error } = await supabase
            .from('profiles')
            .update({ inventory: updatedInventory })
            .eq('id', userProfile.id);
        
        if (error) {
            console.error('Feil ved oppdatering av inventory:', error);
            showNotification('Feil ved bruk av gjenstand. Prøv igjen senere.', 'error');
            return;
        }
        
        // Vis bekreftelse
        showNotification(effectMessage, 'success');
        
        // Lukk modal
        if (inventoryItemModal) {
            inventoryItemModal.style.display = 'none';
        }
    } else {
        showNotification(effectMessage, 'info');
    }
}

// Funksjon for å selge en gjenstand
async function sellItem(item) {
    if (!window.dashboardBase || !window.dashboardBase.userProfile) {
        console.error('dashboardBase eller userProfile ikke tilgjengelig');
        return;
    }
    
    const { userProfile, supabase, showNotification } = window.dashboardBase;
    
    // Finn gjenstanden i inventory
    const inventory = userProfile.inventory || [];
    const inventoryItem = inventory.find(i => i.id === item.id);
    
    if (!inventoryItem || inventoryItem.quantity <= 0) {
        showNotification('Du har ikke denne gjenstanden i inventaret ditt.', 'error');
        return;
    }
    
    // Beregn salgsprisen (70% av kjøpsprisen)
    const sellPrice = Math.floor(item.price * 0.7);
    
    // Oppdater kreditter
    const newCredits = userProfile.credits + sellPrice;
    
    // Reduser antallet av gjenstanden i inventory
    const updatedInventory = inventory.map(i => {
        if (i.id === item.id) {
            return { ...i, quantity: i.quantity - 1 };
        }
        return i;
    }).filter(i => i.quantity > 0);
    
    // Oppdater inventory og kreditter i databasen
    const { data, error } = await supabase
        .from('profiles')
        .update({
            inventory: updatedInventory,
            credits: newCredits
        })
        .eq('id', userProfile.id);
    
    if (error) {
        console.error('Feil ved salg av gjenstand:', error);
        showNotification('Feil ved salg av gjenstand. Prøv igjen senere.', 'error');
        return;
    }
    
    // Vis bekreftelse
    showNotification(`Du solgte ${item.name} for ${sellPrice} kreditter!`, 'success');
    
    // Lukk modal
    if (inventoryItemModal) {
        inventoryItemModal.style.display = 'none';
    }
}

// Funksjon for å legge til en tilfeldig gjenstand i inventory (for testing)
async function addRandomItemToInventory() {
    if (!window.dashboardBase || !window.dashboardBase.userProfile) {
        console.error('dashboardBase eller userProfile ikke tilgjengelig');
        return;
    }
    
    const { userProfile, supabase, showNotification } = window.dashboardBase;
    
    // Hent alle gjenstander
    const allItems = await fetchAllItems();
    
    if (allItems.length === 0) {
        showNotification('Ingen gjenstander tilgjengelig.', 'error');
        return;
    }
    
    // Velg en tilfeldig gjenstand
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    
    // Legg til gjenstanden i inventory
    const inventory = userProfile.inventory || [];
    const existingItem = inventory.find(item => item.id === randomItem.id);
    
    let updatedInventory;
    
    if (existingItem) {
        // Øk antallet hvis gjenstanden allerede finnes
        updatedInventory = inventory.map(item => {
            if (item.id === randomItem.id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
    } else {
        // Legg til ny gjenstand
        updatedInventory = [...inventory, { id: randomItem.id, quantity: 1 }];
    }
    
    // Oppdater inventory i databasen
    const { data, error } = await supabase
        .from('profiles')
        .update({ inventory: updatedInventory })
        .eq('id', userProfile.id);
    
    if (error) {
        console.error('Feil ved oppdatering av inventory:', error);
        showNotification('Feil ved tillegg av gjenstand. Prøv igjen senere.', 'error');
        return;
    }
    
    // Vis bekreftelse
    showNotification(`Du fikk ${randomItem.name}!`, 'success');
}

// Hjelpefunksjon for å få tekst for gjenstandstype
function getItemTypeText(type) {
    const typeMap = {
        'boost': 'Boost',
        'equipment': 'Utstyr',
        'consumable': 'Forbruksvare',
        'special': 'Spesial'
    };
    
    return typeMap[type] || 'Ukjent';
}

// Hjelpefunksjon for å gjøre første bokstav stor
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialiser inventory-fanen når dokumentet er lastet
document.addEventListener('DOMContentLoaded', initInventoryTab); 