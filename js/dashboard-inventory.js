// Globale variabler for inventory-fanen
let inventoryItemsContainer;
let inventoryItemModal;
let closeModalButton;
let itemDetailsContainer;

// Funksjon for å initialisere inventory-fanen
function initInventoryTab() {
    console.log('Initialiserer inventory-fanen...');
    
    // Hent DOM-elementer
    inventoryItemsContainer = document.getElementById('inventory-items');
    inventoryItemModal = document.getElementById('item-modal');
    closeModalButton = document.querySelector('.close-modal');
    
    console.log('Inventory DOM-elementer:', {
        inventoryItemsContainer: !!inventoryItemsContainer,
        inventoryItemModal: !!inventoryItemModal,
        closeModalButton: !!closeModalButton
    });
    
    // Legg til event listeners
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            console.log('Lukker modal via close-knapp');
            inventoryItemModal.style.display = 'none';
        });
    } else {
        console.warn('Fant ikke close-modal knappen');
    }
    
    // Lukk modal når brukeren klikker utenfor modalen
    window.addEventListener('click', (event) => {
        if (event.target === inventoryItemModal) {
            console.log('Lukker modal via klikk utenfor');
            inventoryItemModal.style.display = 'none';
        }
    });
    
    // Legg til event listeners for filtrering
    const filterButtons = document.querySelectorAll('.inventory-filter');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Fjern active-klassen fra alle knapper
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Legg til active-klassen på den klikkede knappen
                button.classList.add('active');
                
                // Filtrer gjenstander
                const filter = button.getAttribute('data-filter');
                filterInventoryItems(filter);
            });
        });
    }
    
    // Legg til event listener for søk
    const searchInput = document.querySelector('.inventory-search input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            searchInventoryItems(searchTerm);
        });
    }
    
    // Test-knapp for inventory (kan fjernes i produksjon)
    const testInventoryButton = document.getElementById('test-inventory-button');
    if (testInventoryButton) {
        testInventoryButton.addEventListener('click', () => {
            testModal();
        });
    }
    
    // Last inn inventory-elementer
    console.log('Laster inn inventory-elementer...');
    loadInventoryItems();
    
    console.log('Inventory-fanen initialisert');
}

// Funksjon for å filtrere inventory-elementer
function filterInventoryItems(filter) {
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        if (filter === 'all') {
            item.style.display = 'flex';
        } else {
            const itemType = item.getAttribute('data-type');
            if (itemType === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// Funksjon for å søke i inventory-elementer
function searchInventoryItems(searchTerm) {
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        const itemName = item.querySelector('.item-name').textContent.toLowerCase();
        const itemRarity = item.querySelector('.item-rarity').textContent.toLowerCase();
        
        if (itemName.includes(searchTerm) || itemRarity.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
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
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = '<i class="fas fa-box-open"></i>Inventaret ditt er tomt.';
        inventoryItemsContainer.appendChild(emptyMessage);
        return;
    }
    
    console.log('Viser inventory i dashboard:', inventory);
    
    // Hent alle tilgjengelige gjenstander
    fetchAllItems().then(allItems => {
        console.log('Hentet alle gjenstander fra Supabase:', allItems);
        
        // Vis gjenstander i inventory
        inventory.forEach(inventoryItem => {
            // Sjekk om inventoryItem er et objekt med id-felt
            const itemId = typeof inventoryItem === 'object' ? inventoryItem.id : inventoryItem;
            const quantity = typeof inventoryItem === 'object' ? (inventoryItem.quantity || 1) : 1;
            
            console.log(`Leter etter gjenstand med ID: ${itemId}, quantity: ${quantity}`);
            
            // Finn gjenstanden i allItems
            const item = allItems.find(i => i.id === itemId || i.id === parseInt(itemId));
            
            if (item) {
                console.log('Fant gjenstand:', item.name);
                const itemElement = createInventoryItemElement(item, quantity);
                inventoryItemsContainer.appendChild(itemElement);
            } else {
                console.warn(`Kunne ikke finne gjenstand med ID: ${itemId} i databasen`);
                
                // Opprett en enkel gjenstand basert på ID
                const simpleItem = {
                    id: itemId,
                    name: `Gjenstand ${itemId}`,
                    description: 'Beskrivelse ikke tilgjengelig',
                    type: 'unknown',
                    rarity: 'common'
                };
                
                const itemElement = createInventoryItemElement(simpleItem, quantity);
                inventoryItemsContainer.appendChild(itemElement);
            }
        });
    }).catch(error => {
        console.error('Feil ved henting av gjenstander:', error);
        inventoryItemsContainer.innerHTML = '<div class="empty-message">Feil ved lasting av inventar. Prøv igjen senere.</div>';
    });
}

// Funksjon for å hente alle gjenstander
async function fetchAllItems() {
    let allItems = [];
    
    // Først prøver vi å hente gjenstander fra items.js (som brukes i index.html)
    if (typeof window.items !== 'undefined' && Array.isArray(window.items)) {
        console.log('Bruker gjenstander fra items.js:', window.items.length, 'gjenstander funnet');
        allItems = [...window.items];
    }
    
    // Prøv å hente gjenstander fra shop.js
    if (typeof window.shopItems !== 'undefined' && Array.isArray(window.shopItems)) {
        console.log('Bruker gjenstander fra shop.js:', window.shopItems.length, 'gjenstander funnet');
        // Kombiner med items-arrayen, men unngå duplikater basert på id
        const shopItemsToAdd = window.shopItems.filter(shopItem => 
            !allItems.some(item => item.id === shopItem.id)
        );
        allItems = [...allItems, ...shopItemsToAdd];
    } else {
        // Hvis shopItems ikke er tilgjengelig, prøv å laste inn shop.js
        try {
            // Hent shop.js-filen
            const response = await fetch('../js/shop.js');
            if (response.ok) {
                const shopScript = await response.text();
                
                // Bruk regex for å hente ut shopItems-arrayen
                const match = shopScript.match(/const\s+shopItems\s*=\s*(\[[\s\S]*?\]);/);
                if (match && match[1]) {
                    // Parse shopItems-arrayen
                    const shopItemsArray = eval(match[1]);
                    console.log('Lastet inn shop.js med', shopItemsArray.length, 'gjenstander');
                    
                    // Kombiner med items-arrayen, men unngå duplikater basert på id
                    const shopItemsToAdd = shopItemsArray.filter(shopItem => 
                        !allItems.some(item => item.id === shopItem.id)
                    );
                    allItems = [...allItems, ...shopItemsToAdd];
                    
                    // Lagre globalt for senere bruk
                    window.shopItems = shopItemsArray;
                }
            }
        } catch (error) {
            console.warn('Kunne ikke laste shop.js:', error);
        }
    }
    
    // Hvis items.js ikke er tilgjengelig, prøver vi å laste den inn
    if (allItems.length === 0) {
        try {
            // Hent items.js-filen
            const response = await fetch('../js/items.js');
            if (response.ok) {
                const itemsScript = await response.text();
                
                // Bruk regex for å hente ut items-arrayen
                const match = itemsScript.match(/const\s+items\s*=\s*(\[[\s\S]*?\]);/);
                if (match && match[1]) {
                    // Parse items-arrayen
                    const itemsArray = eval(match[1]);
                    console.log('Lastet inn items.js med', itemsArray.length, 'gjenstander');
                    allItems = [...itemsArray];
                    
                    // Lagre globalt for senere bruk
                    window.items = itemsArray;
                }
            }
        } catch (error) {
            console.warn('Kunne ikke laste items.js:', error);
        }
    }
    
    // Hvis vi fortsatt ikke har gjenstander, prøv å hente fra Supabase
    if (allItems.length === 0 && window.dashboardBase && window.dashboardBase.supabase) {
        console.log('Henter gjenstander fra Supabase...');
        const { supabase, showNotification } = window.dashboardBase;
        
        const { data, error } = await supabase
            .from('items')
            .select('*');
        
        if (error) {
            console.error('Feil ved henting av gjenstander fra Supabase:', error);
            showNotification('Feil ved henting av gjenstander. Prøv igjen senere.', 'error');
            return [];
        }
        
        // Berik dataene med standardverdier for manglende felter
        allItems = (data || []).map(item => ({
            ...item,
            icon: item.icon || '📦',
            description: item.description || 'Ingen beskrivelse tilgjengelig',
            rarity: item.rarity || 'common',
            type: item.type || 'unknown'
        }));
        
        console.log('Hentet', allItems.length, 'gjenstander fra Supabase');
    }
    
    console.log('Totalt antall gjenstander funnet:', allItems.length);
    return allItems;
}

// Funksjon for å opprette et inventory-element
function createInventoryItemElement(item, quantity = 1) {
    console.log('Oppretter element for gjenstand:', item);
    
    const itemCard = document.createElement('div');
    itemCard.className = `item-card ${item.rarity || 'common'}`;
    itemCard.setAttribute('data-item-id', item.id);
    itemCard.setAttribute('data-rarity', item.rarity || 'common');
    itemCard.setAttribute('data-type', item.category || item.type || 'unknown');
    
    // Sikre at alle nødvendige felter finnes
    const itemName = item.name || `Gjenstand ${item.id}`;
    const itemRarity = item.rarity || 'common';
    const itemIcon = item.icon || '📦';
    const itemType = item.category || item.type || 'unknown';
    
    // Bestem ikonet basert på om det er et emoji eller om vi skal bruke Font Awesome
    let iconContent = '';
    if (itemIcon.length <= 2 || /\p{Emoji}/u.test(itemIcon)) {
        // Det er et emoji eller kort tegn, bruk det direkte
        iconContent = itemIcon;
    } else {
        // Ellers, bruk Font Awesome-ikon basert på type
        let iconClass = 'fas fa-question';
        switch (itemType) {
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
        iconContent = `<i class="${iconClass}"></i>`;
    }
    
    itemCard.innerHTML = `
        <div class="item-icon">
            ${iconContent}
        </div>
        <div class="item-name">${itemName}</div>
        <div class="item-rarity">${capitalizeFirstLetter(itemRarity)}</div>
        <div class="item-quantity">x${quantity}</div>
    `;
    
    // Legg til direkte onclick-handler i stedet for addEventListener
    itemCard.onclick = function() {
        console.log('Klikket på gjenstand:', item);
        
        // Hent modal-elementet direkte
        const modal = document.getElementById('item-modal');
        if (!modal) {
            console.error('Kunne ikke finne item-modal element');
            return;
        }
        
        // Oppdater modal-innhold
        const modalName = modal.querySelector('.item-detail-name');
        const modalDesc = modal.querySelector('.item-detail-description');
        const modalRarity = modal.querySelector('.item-detail-rarity');
        const modalType = modal.querySelector('.item-detail-type');
        const modalQuantity = modal.querySelector('.item-detail-quantity');
        const modalIcon = modal.querySelector('.item-detail-icon');
        const modalActions = modal.querySelector('.item-actions');
        
        console.log('Modal elementer:', {
            modalName: !!modalName,
            modalDesc: !!modalDesc,
            modalRarity: !!modalRarity,
            modalType: !!modalType,
            modalQuantity: !!modalQuantity,
            modalIcon: !!modalIcon,
            modalActions: !!modalActions
        });
        
        if (modalName) modalName.textContent = itemName;
        if (modalDesc) modalDesc.textContent = item.description || 'Ingen beskrivelse tilgjengelig';
        if (modalRarity) modalRarity.textContent = capitalizeFirstLetter(itemRarity);
        if (modalType) modalType.textContent = getItemTypeText(itemType);
        if (modalQuantity) modalQuantity.textContent = `x${quantity}`;
        
        if (modalIcon) {
            if (itemIcon.length <= 2 || /\p{Emoji}/u.test(itemIcon)) {
                modalIcon.innerHTML = itemIcon;
            } else {
                let iconClass = 'fas fa-question';
                switch (itemType) {
                    case 'boost': iconClass = 'fas fa-bolt'; break;
                    case 'equipment': iconClass = 'fas fa-shield-alt'; break;
                    case 'consumable': iconClass = 'fas fa-flask'; break;
                    case 'special': iconClass = 'fas fa-star'; break;
                }
                modalIcon.innerHTML = `<i class="${iconClass}"></i>`;
            }
        }
        
        // Legg til knapper
        if (modalActions) {
            modalActions.innerHTML = '';
            
            // Sjekk om gjenstanden kan brukes
            const isUsable = item.usable || 
                            item.effect === 'exp_boost' || 
                            item.effect === 'credit_boost' || 
                            item.effect === 'skill_boost' ||
                            item.effect === 'math_xp_boost' ||
                            item.effect === 'stair_climb' ||
                            item.effect === 'double_xp_chance' ||
                            item.effect === 'random_item' ||
                            item.effect === 'respec_points';
            
            if (isUsable) {
                const useButton = document.createElement('button');
                useButton.className = 'use-button';
                useButton.innerHTML = '<i class="fas fa-hand-pointer"></i> Bruk';
                useButton.onclick = function() {
                    useItem(item);
                    modal.style.display = 'none';
                };
                modalActions.appendChild(useButton);
            }
            
            const sellButton = document.createElement('button');
            sellButton.className = 'sell-button';
            sellButton.innerHTML = `<i class="fas fa-coins"></i> Selg (${Math.floor((item.price || 100) * 0.7)})`;
            sellButton.onclick = function() {
                sellItem(item);
                modal.style.display = 'none';
            };
            modalActions.appendChild(sellButton);
        }
        
        // Vis modal
        console.log('Viser modal direkte...');
        modal.style.display = 'flex';
        console.log('Modal display style etter setting:', modal.style.display);
        
        // Legg til event listener for å lukke modalen
        const closeButton = modal.querySelector('.close-modal');
        if (closeButton) {
            closeButton.onclick = function() {
                console.log('Lukker modal via close-knapp');
                modal.style.display = 'none';
            };
        }
        
        // Lukk modal når brukeren klikker utenfor modalen
        window.onclick = function(event) {
            if (event.target === modal) {
                console.log('Lukker modal via klikk utenfor');
                modal.style.display = 'none';
            }
        };
    };
    
    return itemCard;
}

// Funksjon for å sikre at modalen er initialisert
function ensureModalInitialized() {
    if (!inventoryItemModal) {
        console.log('Modal ikke initialisert, prøver å hente den på nytt...');
        inventoryItemModal = document.getElementById('item-modal');
        
        if (inventoryItemModal) {
            console.log('Modal funnet og initialisert');
            
            // Sjekk om close-knappen er initialisert
            if (!closeModalButton) {
                closeModalButton = inventoryItemModal.querySelector('.close-modal');
                
                if (closeModalButton) {
                    console.log('Close-knapp funnet og initialisert');
                    closeModalButton.addEventListener('click', () => {
                        console.log('Lukker modal via close-knapp');
                        inventoryItemModal.style.display = 'none';
                    });
                } else {
                    console.warn('Kunne ikke finne close-modal knappen');
                }
            }
            
            // Legg til event listener for å lukke modalen ved klikk utenfor
            window.addEventListener('click', (event) => {
                if (event.target === inventoryItemModal) {
                    console.log('Lukker modal via klikk utenfor');
                    inventoryItemModal.style.display = 'none';
                }
            });
            
            return true;
        } else {
            console.error('Kunne ikke finne modal-elementet');
            return false;
        }
    }
    
    return true;
}

// Vis detaljer for en gjenstand
function showItemDetails(item) {
    console.log('Viser detaljer for gjenstand:', item);
    
    // Hent modal-elementet
    const modal = document.getElementById('item-modal');
    if (!modal) {
        console.error('Kunne ikke finne item-modal element');
        return;
    }
    
    // Oppdater modal-innhold
    const modalName = modal.querySelector('.item-detail-name');
    const modalDesc = modal.querySelector('.item-detail-description');
    const modalRarity = modal.querySelector('.item-detail-rarity');
    const modalType = modal.querySelector('.item-detail-type');
    const modalQuantity = modal.querySelector('.item-detail-quantity');
    const modalIcon = modal.querySelector('.item-detail-icon');
    const modalActions = modal.querySelector('.item-actions');
    
    console.log('Modal elementer:', {
        modalName: !!modalName,
        modalDesc: !!modalDesc,
        modalRarity: !!modalRarity,
        modalType: !!modalType,
        modalQuantity: !!modalQuantity,
        modalIcon: !!modalIcon,
        modalActions: !!modalActions
    });
    
    if (!modalName || !modalDesc || !modalRarity || !modalType || !modalQuantity || !modalIcon || !modalActions) {
        console.error('Manglende modal-elementer');
        return;
    }
    
    // Oppdater innhold
    modalName.textContent = item.name;
    modalDesc.textContent = item.description;
    modalRarity.textContent = capitalizeFirstLetter(item.rarity || 'common');
    modalType.textContent = capitalizeFirstLetter(item.type || 'item');
    modalQuantity.textContent = `x${item.quantity || 1}`;
    
    // Oppdater ikon basert på gjenstandstype
    if (item.icon) {
        modalIcon.innerHTML = item.icon;
    } else if (item.type === 'weapon') {
        modalIcon.innerHTML = '⚔️';
    } else if (item.type === 'armor') {
        modalIcon.innerHTML = '🛡️';
    } else if (item.type === 'potion') {
        modalIcon.innerHTML = '🧪';
    } else if (item.type === 'food') {
        modalIcon.innerHTML = '🍗';
    } else if (item.type === 'book') {
        modalIcon.innerHTML = '📚';
    } else if (item.type === 'key') {
        modalIcon.innerHTML = '🔑';
    } else {
        modalIcon.innerHTML = '📦';
    }
    
    // Legg til knapper
    modalActions.innerHTML = '';
    
    // Legg til bruk-knapp hvis gjenstanden kan brukes
    if (item.usable) {
        const useButton = document.createElement('button');
        useButton.className = 'use-button';
        useButton.innerHTML = '<i class="fas fa-hand-pointer"></i> Bruk';
        useButton.onclick = function() {
            console.log('Bruker gjenstand:', item.id);
            useItem(item.id);
            modal.style.display = 'none';
        };
        modalActions.appendChild(useButton);
    }
    
    // Legg til selg-knapp
    const sellButton = document.createElement('button');
    sellButton.className = 'sell-button';
    sellButton.innerHTML = '<i class="fas fa-coins"></i> Selg';
    sellButton.onclick = function() {
        console.log('Selger gjenstand:', item.id);
        sellItem(item.id);
        modal.style.display = 'none';
    };
    modalActions.appendChild(sellButton);
    
    // Vis modal
    console.log('Viser modal...');
    modal.style.display = 'flex';
    console.log('Modal display style etter setting:', modal.style.display);
    
    // Legg til event listener for å lukke modalen
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
        closeButton.onclick = function() {
            console.log('Lukker modal via close-knapp');
            modal.style.display = 'none';
        };
    }
    
    // Lukk modal når brukeren klikker utenfor modalen
    window.onclick = function(event) {
        if (event.target === modal) {
            console.log('Lukker modal via klikk utenfor');
            modal.style.display = 'none';
        }
    };
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
    const inventoryItem = inventory.find(i => {
        if (typeof i === 'object') {
            return i.id === item.id;
        } else {
            return i === item.id;
        }
    });
    
    if (!inventoryItem) {
        showNotification('Du har ikke denne gjenstanden i inventaret ditt.', 'error');
        return;
    }
    
    const quantity = typeof inventoryItem === 'object' ? inventoryItem.quantity || 1 : 1;
    if (quantity <= 0) {
        showNotification('Du har ikke denne gjenstanden i inventaret ditt.', 'error');
        return;
    }
    
    // Sjekk gjenstandens effekt
    let effectApplied = false;
    let effectMessage = 'Ingen effekt';
    
    // Sikre at alle nødvendige felter finnes
    const effectType = item.effect_type || 'none';
    const effect = item.effect || 'none';
    
    // Håndter ulike effekttyper
    switch (effectType) {
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
            // Håndter spesielle effekter fra shop.js
            switch (effect) {
                case 'math_xp_boost':
                    effectApplied = true;
                    effectMessage = 'Du får nå 20% mer XP på matteoppgaver!';
                    // Legg til en spesiell status i brukerens profil
                    await supabase
                        .from('profiles')
                        .update({
                            active_effects: [...(userProfile.active_effects || []), {
                                id: 'math_xp_boost',
                                name: 'Mattemagi',
                                description: '20% mer XP på matteoppgaver',
                                duration: 'permanent'
                            }]
                        })
                        .eq('id', userProfile.id);
                    break;
                case 'stair_climb':
                    effectApplied = true;
                    effectMessage = 'Du har nå tilgang til trappeløp! Finn nærmeste trapp for å få 250 XP!';
                    // Legg til en spesiell status i brukerens profil
                    await supabase
                        .from('profiles')
                        .update({
                            active_effects: [...(userProfile.active_effects || []), {
                                id: 'stair_climb',
                                name: 'Trappeløper',
                                description: 'Tilgang til trappeløp for XP',
                                duration: 'permanent'
                            }]
                        })
                        .eq('id', userProfile.id);
                    break;
                case 'double_xp_chance':
                    effectApplied = true;
                    effectMessage = 'Du kan nå ta sjansen på dobbel XP når du leverer oppgaver!';
                    // Legg til en spesiell status i brukerens profil
                    await supabase
                        .from('profiles')
                        .update({
                            active_effects: [...(userProfile.active_effects || []), {
                                id: 'double_xp_chance',
                                name: 'Kvitt eller dobbelt',
                                description: 'Sjanse for dobbel XP på oppgaver',
                                duration: 'permanent'
                            }]
                        })
                        .eq('id', userProfile.id);
                    break;
                case 'random_item':
                    // Hent alle gjenstander
                    const allItems = await fetchAllItems();
                    if (allItems.length > 0) {
                        // Velg en tilfeldig gjenstand (unngå spesialgjenstander)
                        const regularItems = allItems.filter(i => i.category !== 'special' && i.type !== 'special');
                        if (regularItems.length > 0) {
                            const randomItem = regularItems[Math.floor(Math.random() * regularItems.length)];
                            // Legg til gjenstanden i inventory
                            await addItemToInventory(randomItem.id);
                            effectApplied = true;
                            effectMessage = `Du fikk en tilfeldig gjenstand: ${randomItem.name}!`;
                        }
                    }
                    break;
                case 'respec_points':
                    effectApplied = true;
                    effectMessage = 'Du kan nå fordele nivåpoengene dine på nytt!';
                    // Nullstill ferdigheter men behold totalt nivå
                    const totalPoints = Object.values(userProfile.skills || {}).reduce((sum, val) => sum + val, 0);
                    await supabase
                        .from('profiles')
                        .update({
                            skills: {
                                Intelligens: 0,
                                Teknologi: 0,
                                Stamina: 0,
                                Karisma: 0,
                                Kreativitet: 0,
                                Flaks: 0
                            },
                            available_skill_points: totalPoints
                        })
                        .eq('id', userProfile.id);
                    break;
                default:
                    effectMessage = item.effect || 'Denne gjenstanden har ingen effekt ennå.';
                    break;
            }
            break;
    }
    
    if (effectApplied) {
        // Reduser antallet av gjenstanden i inventory
        const updatedInventory = inventory.map(i => {
            if (typeof i === 'object' && i.id === item.id) {
                return { ...i, quantity: i.quantity - 1 };
            } else if (i === item.id) {
                // Hvis det er en enkel ID, konverter til objekt med quantity
                return { id: item.id, quantity: 0 }; // Sett til 0 for å fjerne
            }
            return i;
        }).filter(i => typeof i === 'object' ? i.quantity > 0 : i !== item.id);
        
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
        
        // Oppdater brukergrensesnittet
        updateInventoryTab();
    } else {
        showNotification(effectMessage, 'info');
    }
}

// Hjelpefunksjon for å legge til en gjenstand i inventory
async function addItemToInventory(itemId, quantity = 1) {
    if (!window.dashboardBase || !window.dashboardBase.userProfile) {
        console.error('dashboardBase eller userProfile ikke tilgjengelig');
        return false;
    }
    
    const { userProfile, supabase, showNotification } = window.dashboardBase;
    
    // Legg til gjenstanden i inventory
    const inventory = userProfile.inventory || [];
    const existingItem = inventory.find(item => {
        if (typeof item === 'object') {
            return item.id === itemId;
        } else {
            return item === itemId;
        }
    });
    
    let updatedInventory;
    
    if (existingItem) {
        // Øk antallet hvis gjenstanden allerede finnes
        updatedInventory = inventory.map(item => {
            if (typeof item === 'object' && item.id === itemId) {
                return { ...item, quantity: (item.quantity || 1) + quantity };
            } else if (item === itemId) {
                // Konverter fra enkel ID til objekt med quantity
                return { id: itemId, quantity: 1 + quantity };
            }
            return item;
        });
    } else {
        // Legg til ny gjenstand
        updatedInventory = [...inventory, { id: itemId, quantity }];
    }
    
    // Oppdater inventory i databasen
    const { data, error } = await supabase
        .from('profiles')
        .update({ inventory: updatedInventory })
        .eq('id', userProfile.id);
    
    if (error) {
        console.error('Feil ved oppdatering av inventory:', error);
        showNotification('Feil ved tillegg av gjenstand. Prøv igjen senere.', 'error');
        return false;
    }
    
    return true;
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
    const inventoryItem = inventory.find(i => {
        if (typeof i === 'object') {
            return i.id === item.id;
        } else {
            return i === item.id;
        }
    });
    
    if (!inventoryItem) {
        showNotification('Du har ikke denne gjenstanden i inventaret ditt.', 'error');
        return;
    }
    
    const quantity = typeof inventoryItem === 'object' ? inventoryItem.quantity || 1 : 1;
    if (quantity <= 0) {
        showNotification('Du har ikke denne gjenstanden i inventaret ditt.', 'error');
        return;
    }
    
    // Beregn salgsprisen (70% av kjøpsprisen)
    const sellPrice = Math.floor((item.price || 100) * 0.7);
    
    // Oppdater kreditter
    const newCredits = userProfile.credits + sellPrice;
    
    // Reduser antallet av gjenstanden i inventory
    const updatedInventory = inventory.map(i => {
        if (typeof i === 'object' && i.id === item.id) {
            return { ...i, quantity: i.quantity - 1 };
        } else if (i === item.id) {
            // Hvis det er en enkel ID, konverter til objekt med quantity
            return { id: item.id, quantity: 0 }; // Sett til 0 for å fjerne
        }
        return i;
    }).filter(i => typeof i === 'object' ? i.quantity > 0 : i !== item.id);
    
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
    const itemName = item.name || `Gjenstand ${item.id}`;
    showNotification(`Du solgte ${itemName} for ${sellPrice} kreditter!`, 'success');
    
    // Lukk modal
    if (inventoryItemModal) {
        inventoryItemModal.style.display = 'none';
    }
    
    // Oppdater brukergrensesnittet
    updateInventoryTab();
}

// Funksjon for å teste modalen direkte
function testModal() {
    console.log('Tester modal direkte...');
    
    // Hent modal-elementet
    const modal = document.getElementById('item-modal');
    if (!modal) {
        console.error('Kunne ikke finne item-modal element');
        return;
    }
    
    // Oppdater modal-innhold
    const modalName = modal.querySelector('.item-detail-name');
    const modalDesc = modal.querySelector('.item-detail-description');
    const modalRarity = modal.querySelector('.item-detail-rarity');
    const modalType = modal.querySelector('.item-detail-type');
    const modalQuantity = modal.querySelector('.item-detail-quantity');
    const modalIcon = modal.querySelector('.item-detail-icon');
    const modalActions = modal.querySelector('.item-actions');
    
    console.log('Modal elementer:', {
        modalName: !!modalName,
        modalDesc: !!modalDesc,
        modalRarity: !!modalRarity,
        modalType: !!modalType,
        modalQuantity: !!modalQuantity,
        modalIcon: !!modalIcon,
        modalActions: !!modalActions
    });
    
    if (modalName) modalName.textContent = 'Test Gjenstand';
    if (modalDesc) modalDesc.textContent = 'Dette er en test-gjenstand for å sjekke at modalen fungerer.';
    if (modalRarity) modalRarity.textContent = 'Legendarisk';
    if (modalType) modalType.textContent = 'Test';
    if (modalQuantity) modalQuantity.textContent = 'x99';
    
    if (modalIcon) {
        modalIcon.innerHTML = '🧪';
    }
    
    // Legg til knapper
    if (modalActions) {
        modalActions.innerHTML = '';
        
        const testButton = document.createElement('button');
        testButton.className = 'use-button';
        testButton.innerHTML = '<i class="fas fa-check"></i> Test Knapp';
        testButton.onclick = function() {
            console.log('Test-knapp klikket');
            modal.style.display = 'none';
        };
        modalActions.appendChild(testButton);
    }
    
    // Vis modal
    console.log('Viser test-modal...');
    modal.style.display = 'flex';
    console.log('Modal display style etter setting:', modal.style.display);
    
    // Legg til event listener for å lukke modalen
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
        closeButton.onclick = function() {
            console.log('Lukker modal via close-knapp');
            modal.style.display = 'none';
        };
    }
    
    // Lukk modal når brukeren klikker utenfor modalen
    window.onclick = function(event) {
        if (event.target === modal) {
            console.log('Lukker modal via klikk utenfor');
            modal.style.display = 'none';
        }
    };
}

// Hjelpefunksjon for å gjøre første bokstav stor
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

// Initialiser inventory-fanen når dokumentet er lastet
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event utløst');
    initInventoryTab();
    
    // Legg til en knapp for å teste modalen direkte
    const testModalButton = document.createElement('button');
    testModalButton.textContent = 'Test Modal';
    testModalButton.style.position = 'fixed';
    testModalButton.style.bottom = '70px';
    testModalButton.style.right = '20px';
    testModalButton.style.zIndex = '999';
    testModalButton.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    testModalButton.style.border = 'none';
    testModalButton.style.color = 'white';
    testModalButton.style.padding = '10px 15px';
    testModalButton.style.cursor = 'pointer';
    testModalButton.style.borderRadius = '5px';
    testModalButton.style.fontFamily = "'Courier New', monospace";
    testModalButton.style.fontSize = '14px';
    testModalButton.onclick = testModal;
    
    document.body.appendChild(testModalButton);
}); 