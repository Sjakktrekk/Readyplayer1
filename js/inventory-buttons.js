// inventory-buttons.js - Legger til knapper for ryggsekk og achievements

console.log('inventory-buttons.js lastet');

// Funksjon for å legge til både achievement- og inventory-knapper i tabellen
function addButtonsToTable() {
    console.log('addButtonsToTable kjører');
    
    // Finn alle rader i tabellen
    const rows = document.querySelectorAll('table.student-table tbody tr');
    console.log('Fant', rows.length, 'rader i tabellen');
    
    // Gå gjennom hver rad
    rows.forEach((row, index) => {
        // Sjekk om raden allerede har knappene
        if (!row.querySelector('.action-buttons-cell')) {
            console.log('Legger til knapper for rad', index);
            
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
            inventoryButton.innerHTML = '<i class="fas fa-briefcase"></i>';
            inventoryButton.title = 'Åpne inventory';
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
            console.log('Knapper lagt til for rad', index);
        }
    });
}

// Legg til knapper i navigasjonsmenyen
function addButtonsToNavigation() {
    console.log('addButtonsToNavigation kjører');
    
    // Finn navigasjonsmenyen (knappene under overskriften)
    const navContainer = document.querySelector('div[style*="display: flex; justify-content: center; margin: 20px 0;"]');
    
    if (!navContainer) {
        console.error('Kunne ikke finne navigasjonsmenyen');
        return;
    }
    
    // Sjekk om knappene allerede er lagt til
    if (document.getElementById('nav-inventory-button')) {
        console.log('Navigasjonsknapper finnes allerede');
        return;
    }
    
    // Opprett en container for de nye knappene
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 15px;
        margin-left: 15px;
    `;
    
    // Opprett ryggsekk-knappen
    const inventoryButton = document.createElement('button');
    inventoryButton.id = 'nav-inventory-button';
    inventoryButton.innerHTML = `
        <i class="fas fa-briefcase" style="font-size: 20px;"></i>
        <span>Inventory</span>
        <div style="
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.3), transparent);
            animation: shineEffect 2s infinite;
            z-index: -1;
        "></div>
    `;
    inventoryButton.style.cssText = `
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)); 
        border: 2px solid #00aaff; 
        color: #00aaff; 
        padding: 15px 30px; 
        border-radius: 8px; 
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 5px rgba(0, 170, 255, 0.5);
        box-shadow: 0 0 15px rgba(0, 170, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        overflow: hidden;
        z-index: 1000;
    `;
    
    // Legg til hover-effekt
    inventoryButton.onmouseover = function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 20px rgba(0, 170, 255, 0.5)';
    };
    
    inventoryButton.onmouseout = function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 15px rgba(0, 170, 255, 0.3)';
    };
    
    // Legg til klikk-hendelse som åpner en modal for å velge elev
    inventoryButton.onclick = function() {
        showStudentSelectorModal('inventory');
    };
    
    // Opprett achievements-knappen
    const achievementsButton = document.createElement('button');
    achievementsButton.id = 'nav-achievements-button';
    achievementsButton.innerHTML = `
        <i class="fas fa-trophy" style="font-size: 20px;"></i>
        <span>Achievements</span>
        <div style="
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 0, 170, 0.3), transparent);
            animation: shineEffect 2s infinite;
            z-index: -1;
        "></div>
    `;
    achievementsButton.style.cssText = `
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)); 
        border: 2px solid #ff00aa; 
        color: #ff00aa; 
        padding: 15px 30px; 
        border-radius: 8px; 
        font-family: 'Courier New', monospace;
        text-shadow: 0 0 5px rgba(255, 0, 170, 0.5);
        box-shadow: 0 0 15px rgba(255, 0, 170, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        overflow: hidden;
        z-index: 1000;
    `;
    
    // Legg til hover-effekt
    achievementsButton.onmouseover = function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 20px rgba(255, 0, 170, 0.5)';
    };
    
    achievementsButton.onmouseout = function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 15px rgba(255, 0, 170, 0.3)';
    };
    
    // Legg til klikk-hendelse som åpner en modal for å velge elev
    achievementsButton.onclick = function() {
        showStudentSelectorModal('achievements');
    };
    
    // Legg til knappene i containeren
    buttonContainer.appendChild(inventoryButton);
    buttonContainer.appendChild(achievementsButton);
    
    // Legg til containeren i navigasjonsmenyen
    navContainer.appendChild(buttonContainer);
    console.log('Navigasjonsknapper lagt til');
}

// Funksjon for å vise en modal for å velge elev
function showStudentSelectorModal(type) {
    console.log('showStudentSelectorModal kjører for type:', type);
    
    // Fjern eksisterende modal hvis den finnes
    let existingModal = document.getElementById('student-selector-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Opprett modal
    const modal = document.createElement('div');
    modal.id = 'student-selector-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    // Opprett modal-innhold
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, rgba(10, 20, 30, 0.95), rgba(5, 10, 15, 0.95));
        border: 2px solid ${type === 'inventory' ? '#00aaff' : '#ff00aa'};
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 30px ${type === 'inventory' ? 'rgba(0, 170, 255, 0.5)' : 'rgba(255, 0, 170, 0.5)'};
        position: relative;
    `;
    
    // Opprett lukkeknapp
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: ${type === 'inventory' ? '#00aaff' : '#ff00aa'};
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    closeButton.onclick = function() {
        modal.remove();
    };
    
    // Opprett tittel
    const title = document.createElement('h2');
    title.textContent = type === 'inventory' ? 'Velg elev for inventory' : 'Velg elev for achievements';
    title.style.cssText = `
        color: ${type === 'inventory' ? '#00aaff' : '#ff00aa'};
        text-align: center;
        margin-bottom: 20px;
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
        letter-spacing: 2px;
    `;
    
    // Opprett liste med elever
    const studentList = document.createElement('div');
    studentList.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
        margin-bottom: 20px;
    `;
    
    // Legg til elever i listen
    students.forEach((student, index) => {
        const studentButton = document.createElement('button');
        studentButton.textContent = student.name;
        studentButton.style.cssText = `
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid ${type === 'inventory' ? 'rgba(0, 170, 255, 0.5)' : 'rgba(255, 0, 170, 0.5)'};
            color: white;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Courier New', monospace;
            text-align: left;
        `;
        
        // Legg til hover-effekt
        studentButton.onmouseover = function() {
            this.style.background = `rgba(${type === 'inventory' ? '0, 170, 255' : '255, 0, 170'}, 0.2)`;
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = `0 5px 15px rgba(${type === 'inventory' ? '0, 170, 255' : '255, 0, 170'}, 0.3)`;
        };
        
        studentButton.onmouseout = function() {
            this.style.background = 'rgba(0, 0, 0, 0.5)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        
        // Legg til klikk-hendelse
        studentButton.onclick = function() {
            if (type === 'inventory') {
                openItemBagModal(index);
            } else {
                openAchievementsModal(index);
            }
            modal.remove();
        };
        
        studentList.appendChild(studentButton);
    });
    
    // Legg til elementer i modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(studentList);
    modal.appendChild(modalContent);
    
    // Legg til modal i DOM
    document.body.appendChild(modal);
    console.log('Student-selector modal vist');
}

// Funksjon for å initialisere UI-elementer
function initInventoryButtons() {
    console.log('initInventoryButtons kjører');
    
    // Legg til knapper i tabellen
    addButtonsToTable();
    
    // Legg til knapper i navigasjonsmenyen
    addButtonsToNavigation();
}

// Overskriver updateTable-funksjonen
function setupUpdateTableOverride() {
    console.log('setupUpdateTableOverride kjører');
    
    if (typeof updateTable === 'function' && !window.originalUpdateTable) {
        console.log('updateTable-funksjonen funnet, overskriver...');
        
        // Lagre den originale funksjonen
        window.originalUpdateTable = updateTable;
        
        // Overskriver funksjonen
        window.updateTable = function() {
            console.log('Ny updateTable kjører');
            
            // Kall den originale funksjonen
            if (typeof window.originalUpdateTable === 'function') {
                // Kall den originale funksjonen direkte, ikke via window.updateTable
                window.originalUpdateTable.call(window);
                
                // Legg til knapper i tabellen
                try {
                    addButtonsToTable();
                    console.log('Knapper lagt til i updateTable');
                } catch (e) {
                    console.error('Feil i updateTable ved å legge til knapper:', e);
                }
            } else {
                console.error('Original updateTable-funksjon ikke funnet!');
            }
        };
        console.log('updateTable-funksjonen overskrevet');
    } else if (window.originalUpdateTable) {
        console.log('updateTable-funksjonen er allerede overskrevet');
    } else {
        console.error('updateTable-funksjonen ikke funnet!');
    }
}

// Legg til en global funksjon for å manuelt legge til knapper
window.manuallyAddButtons = function() {
    console.log('Manuelt legger til knapper...');
    initInventoryButtons();
    console.log('Manuelt lagt til knapper');
};

// Kjør når siden lastes
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded-hendelse utløst');
        setTimeout(function() {
            initInventoryButtons();
            setupUpdateTableOverride();
        }, 1000);
    });
} else {
    // Dokumentet er allerede lastet
    console.log('Dokumentet er allerede lastet');
    setTimeout(function() {
        initInventoryButtons();
        setupUpdateTableOverride();
    }, 1000);
}

// Kjør også når vinduet er fullstendig lastet
window.addEventListener('load', function() {
    console.log('load-hendelse utløst');
    setTimeout(function() {
        initInventoryButtons();
        setupUpdateTableOverride();
    }, 1000);
});

console.log('inventory-buttons.js ferdig lastet'); 