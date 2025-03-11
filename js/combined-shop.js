// Kombinert Shop og Marketplace Modal
document.addEventListener('DOMContentLoaded', function() {
    // Legg til event listeners for tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
    
    // Legg til event listener for lukkeknappen
    const closeButton = document.querySelector('#combinedShopModal .close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeCombinedShopModal);
    }
    
    // Legg til event listener for escape-tasten
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('combinedShopModal');
            if (modal && modal.style.display === 'block') {
                closeCombinedShopModal();
            }
        }
    });
});

// Funksjon for å aktivere en tab
function activateTab(tabId) {
    // Fjern active-klassen fra alle tabs og tab-content
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Legg til active-klassen på valgt tab og tab-content
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}TabContent`).classList.add('active');
    
    // Oppdater innholdet basert på valgt tab
    if (tabId === 'shop') {
        displayShopItems();
    } else if (tabId === 'marketplace') {
        displayMarketplaceItems();
    }
}

// Funksjon for å åpne den kombinerte modalen
function openCombinedShopModal(initialTab = 'shop') {
    const modal = document.getElementById('combinedShopModal');
    
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
    updateCombinedStudentDropdown();
    
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
        closeCombinedShopModal();
    });
    
    // Aktiver den valgte fanen
    activateTab(initialTab);
}

// Funksjon for å lukke den kombinerte modalen
function closeCombinedShopModal() {
    const modal = document.getElementById('combinedShopModal');
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
function updateCombinedStudentDropdown() {
    const select = document.getElementById('combinedStudentSelect');
    const creditsDisplay = document.getElementById('combinedStudentExpDisplay');
    
    // Tøm eksisterende valg
    select.innerHTML = '<option value="">Velg elev...</option>';
    
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
        this.style.boxShadow = '0 0 15px rgba(241, 196, 15, 0.3)';
    });
    
    select.addEventListener('mouseout', function() {
        this.style.background = 'rgba(0, 0, 0, 0.7)';
        this.style.boxShadow = 'none';
    });
}

// Overstyr de originale åpne-funksjonene for å bruke den kombinerte modalen
function openShopModal() {
    openCombinedShopModal('shop');
}

function openMarketplaceModal() {
    openCombinedShopModal('marketplace');
}

// Overstyr de originale lukke-funksjonene for å bruke den kombinerte modalen
function closeShopModal() {
    closeCombinedShopModal();
}

function closeMarketplaceModal() {
    closeCombinedShopModal();
}

// Modifisert funksjon for å kjøpe gjenstander fra butikken
function buyShopItem(studentIndex, item) {
    // Bruk den eksisterende funksjonen, men hent studentIndex fra den kombinerte dropdown
    if (studentIndex === undefined || studentIndex === null) {
        const select = document.getElementById('combinedStudentSelect');
        studentIndex = parseInt(select.value);
        
        if (isNaN(studentIndex) || studentIndex < 0) {
            alert('Vennligst velg en elev først!');
            return;
        }
    }
    
    // Resten av den originale funksjonen...
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
    
    // Trekk kreditter fra studenten
    student.credits = (student.credits || 0) - item.price;
    
    // Legg til gjenstanden i ryggsekken
    student.items.push(item.id);
    
    // Vis bekreftelsesmelding
    try {
        showItemAcquiredAnimation(item);
    } catch (error) {
        console.error("Kunne ikke vise animasjon:", error);
        alert(`${student.name} kjøpte ${item.name} for ${item.price} kreditter!`);
    }
    
    // Lagre endringer
    saveData();
    
    // Oppdater kreditt-visning
    document.getElementById('combinedStudentExpDisplay').textContent = `Tilgjengelige kreditter: ${student.credits || 0}`;
    
    // Oppdater studenttabellen
    updateTable();
}

// Modifisert funksjon for å kjøpe gjenstander fra bruktmarkedet
function buyMarketplaceItem(marketplaceItemId) {
    // Hent studentIndex fra den kombinerte dropdown
    const select = document.getElementById('combinedStudentSelect');
    const studentIndex = parseInt(select.value);
    
    if (isNaN(studentIndex) || studentIndex < 0) {
        alert('Vennligst velg en kjøper først!');
        return;
    }
    
    // Resten av den originale funksjonen...
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
    document.getElementById('combinedStudentExpDisplay').textContent = `Tilgjengelige kreditter: ${buyer.credits || 0}`;
    
    // Vis bekreftelsesmelding
    alert(`${buyer.name} kjøpte ${item.name} for ${marketplaceItem.price} kreditter!`);
} 