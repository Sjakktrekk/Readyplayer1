// Globale variabler
const MAX_SKILL_LEVEL = 30;
let isLocked = false;

// Initialiser når siden lastes
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOMContentLoaded starter...');
        
        // Oppdater tabellen først
        updateTable();
        
        // Legg til boksene etter at tabellen er oppdatert
        setTimeout(function() {
            addDailyQuestsInline();
        }, 100);
        
        // Legg til hover-effekt på overskriften
        const heading = document.querySelector('h1');
        if (heading) {
            heading.addEventListener('mouseover', function() {
                this.style.textShadow = '0 0 15px rgba(52, 152, 219, 0.8)';
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            });
            
            heading.addEventListener('mouseout', function() {
                this.style.textShadow = 'none';
                this.style.transform = 'scale(1)';
            });
        }
        
        // Legg til event listener for å vise tooltips for skills med bonuser
        document.addEventListener('mouseover', function(e) {
            if (e.target.classList.contains('skill-value') && e.target.classList.contains('has-bonus')) {
                const title = e.target.getAttribute('title');
                if (title) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'skill-tooltip';
                    tooltip.textContent = title;
                    tooltip.style.position = 'absolute';
                    tooltip.style.left = (e.pageX + 10) + 'px';
                    tooltip.style.top = (e.pageY + 10) + 'px';
                    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '5px 10px';
                    tooltip.style.borderRadius = '5px';
                    tooltip.style.zIndex = '1000';
                    tooltip.style.pointerEvents = 'none';
                    document.body.appendChild(tooltip);
                    
                    e.target.addEventListener('mouseout', function() {
                        if (document.body.contains(tooltip)) {
                            document.body.removeChild(tooltip);
                        }
                    }, { once: true });
                }
            }
        });
        
        // Oppdater utseendet på slettebeskyttelsesknappen ved oppstart
        const deleteProtectionButton = document.getElementById('deleteProtectionButton');
        if (deleteProtectionButton) {
            const icon = deleteProtectionButton.querySelector('i') || document.createElement('i');
            icon.className = 'fas fa-lock';
            deleteProtectionButton.style.background = 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)';
            deleteProtectionButton.style.color = 'white';
            deleteProtectionButton.style.borderColor = '#c0392b';
            deleteProtectionButton.innerHTML = '';
            deleteProtectionButton.appendChild(icon);
            deleteProtectionButton.appendChild(document.createTextNode(' Sletting låst'));
        }
        
        // Legg til sorteringsfunksjonalitet
        let sortByLevelDesc = true;
        const sortLevelBtn = document.getElementById('sortLevelBtn');
        if (sortLevelBtn) {
            sortLevelBtn.addEventListener('click', function() {
                const sortedStudents = [...students].sort((a, b) => {
                    const levelA = calculateLevel(a);
                    const levelB = calculateLevel(b);
                    return sortByLevelDesc ? levelB - levelA : levelA - levelB;
                });
                
                sortByLevelDesc = !sortByLevelDesc;
                this.innerHTML = `<i class="fas fa-sort-${sortByLevelDesc ? 'down' : 'up'}"></i>`;
                
                students = sortedStudents;
                updateTable();
            });
        }
        
        // Spor musposisjon på skill-knapp-klikk
        document.addEventListener('click', function(e) {
            if (e.target.matches('.small-button')) {
                window.lastClickX = e.clientX;
                window.lastClickY = e.clientY;
            }
        });
        
        console.log('DOMContentLoaded fullført');
    } catch (error) {
        console.error('Feil i DOMContentLoaded:', error);
    }
});

// Funksjon for å vise OASIS velkomstmodal
function showOasisModal() {
    const modal = document.getElementById('oasisWelcomeModal');
    if (modal) {
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
        
        // Vis modal
        modal.style.display = 'block';
        
        // Legg til show-klassen for å aktivere animasjonen
        setTimeout(() => {
            modal.classList.add('show');
            
            // Sikre at modalen er synlig (på grunn av inline-stiler)
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
            
            // Legg til animasjon for modal-content
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'translateY(0)';
            }
        }, 10);
        
        // Lukk modal ved klikk utenfor
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeOasisModal();
            }
        });
        
        // Legg til klikk-hendelse for å lukke modal ved klikk på backdrop
        backdrop.addEventListener('click', function() {
            closeOasisModal();
        });
    }
}

// Funksjon for å lukke OASIS velkomstmodal
function closeOasisModal() {
    const modal = document.getElementById('oasisWelcomeModal');
    if (modal) {
        // Fjern show-klassen for å aktivere fade-out animasjonen
        modal.classList.remove('show');
        modal.style.opacity = '0';
        modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        
        // Animer modal-content
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
        }
        
        // Fjern backdrop med fade-out effekt
        const backdrop = document.getElementById('modal-backdrop');
        if (backdrop) {
            backdrop.classList.remove('show');
            setTimeout(() => {
                backdrop.remove();
            }, 300);
        }
        
        // Skjul modal etter animasjon
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Tilbakestill stilen for neste gang modalen åpnes
            modal.style.opacity = '1';
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
    }
}

// Funksjon for å lagre data
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Funksjon for å oppdatere tabellen
function updateTable() {
    const tableBody = document.getElementById('skillsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = generateTableRow(index);
        tableBody.appendChild(row);
    });
    saveData();
    
    // Oppdater boss-status hvis funksjonen finnes
    if (typeof updateBossStatus === 'function') {
        updateBossStatus();
    }
}

// Funksjon for å generere tabellrad
function generateTableRow(index) {
    const student = students[index];
    const level = calculateLevel(student);
    return `
         <td class="player-cell">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                  <a href="#" class="player-name" 
                      onclick="openAchievementsModal(${index}); return false;"
                      onmouseenter="createTooltip(event, ${index})"
                      onmouseleave="removeTooltip()">${student.name}</a>
                  <button class="small-button delete-student-button" 
                      style="background: rgba(231, 76, 60, 0.2); border-color: rgba(231, 76, 60, 0.4); color: #e74c3c; margin-right: 10px; display: ${isDeleteProtected ? 'none' : 'block'};"
                      onclick="removeStudent(${index})" 
                      title="Fjern student">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </div>
             <div class="level-display">
                 <span class="level-label">Nivå</span>
                 <span class="level-number">${level}</span>
             </div>
          </td>
        ${generateSkillCell(index, 'Intelligens')}
        ${generateSkillCell(index, 'Teknologi')}
        ${generateSkillCell(index, 'Stamina')}
        ${generateSkillCell(index, 'Karisma')}
        ${generateSkillCell(index, 'Kreativitet')}
        ${generateSkillCell(index, 'Flaks')}
        ${generateExpCell(index)}
    `;
}

// Funksjon for å hente skill-verdi med bonuser fra equipment
function getSkillWithBonus(student, skill) {
    const baseValue = student[skill] || 0;
    const bonus = student.equipmentBonuses && student.equipmentBonuses[skill] ? student.equipmentBonuses[skill] : 0;
    
    // Returner baseValue + bonus, men aldri mindre enn bonus (hvis bonus er positiv)
    return Math.max(baseValue + bonus, bonus > 0 ? bonus : 0);
}

// Funksjon for å generere skill-celle
function generateSkillCell(index, skill) {
    const student = students[index];
    const baseValue = student[skill];
    const totalValue = getSkillWithBonus(student, skill);
    const hasBonus = baseValue !== totalValue;
    const progress = (totalValue / MAX_SKILL_LEVEL) * 100;
    
    return `
        <td class="skill-cell" data-skill="${skill}">
            <div class="skill-content">
                <div class="button-container">
                    <button class="small-button" onclick="changeSkill(${index}, '${skill}', -1)">-</button>
                    <span class="skill-value ${hasBonus ? 'has-bonus' : ''}" title="${hasBonus ? `Base: ${baseValue}, Bonus: ${totalValue - baseValue}` : ''}">
                        ${totalValue}${hasBonus ? '*' : ''}
                    </span>
                    <button class="small-button" onclick="changeSkill(${index}, '${skill}', 1)">+</button>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        </td>
    `;
}

// Funksjon for å generere exp-celle
function generateExpCell(index) {
    return `
        <td class="exp-cell">
            <div class="button-container" style="display: flex; align-items: center; gap: 2px;">
                <button class="small-button" onclick="changeExp(${index}, -1000)" style="min-width: 30px;">-</button>
                <span class="exp-value" style="min-width: 60px; text-align: center;">${students[index].exp}</span>
                <button class="small-button" onclick="changeExp(${index}, 1000)" title="Legg til 1000 EXP" style="min-width: 40px; font-size: 0.9em;">+<small>1K</small></button>
                <button class="small-button" onclick="openCustomExpDialog(${index})" title="Legg til egendefinert EXP" style="min-width: 40px; font-size: 0.9em;"><i class="fas fa-edit"></i></button>
            </div>
        </td>
    `;
}

// Funksjon for å beregne nivå
function calculateLevel(student) {
    const skills = ['Intelligens', 'Teknologi', 'Stamina', 'Karisma', 'Kreativitet', 'Flaks'];
    return skills.reduce((sum, skill) => sum + getSkillWithBonus(student, skill), 0);
}

// Funksjon for å endre exp
function changeExp(index, amount) {
    students[index].exp = Math.max(0, students[index].exp + amount);
    updateTable();
}

// Funksjon for å nullstille all exp
function resetAllExp() {
    students.forEach((student, index) => {
        student.exp = 10000;
    });
    saveData();
    updateTable();
}

// Funksjon for å låse/låse opp grensesnittet
function toggleLock() {
    isLocked = !isLocked;
    const button = document.getElementById('lockButton');
    const icon = button.querySelector('i');
    
    if (isLocked) {
        button.style.background = 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)';
        button.style.borderColor = '#e74c3c';
        button.style.color = 'white';
        icon.className = 'fas fa-lock';
        button.textContent = ' Locked';
        button.insertBefore(icon, button.firstChild);
        button.onmouseover = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 15px rgba(231, 76, 60, 0.4)';
        };
        button.onmouseout = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.2)';
        };
        
        // Vis en bekreftelsesmelding
        showStylizedAlert('Tabellen er nå låst. Ingen endringer kan gjøres.', 'info');
    } else {
        button.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))';
        button.style.borderColor = '#2ecc71';
        button.style.color = '#2ecc71';
        icon.className = 'fas fa-unlock';
        button.textContent = ' Unlock';
        button.insertBefore(icon, button.firstChild);
        button.onmouseover = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.4)';
        };
        button.onmouseout = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.2)';
        };
        
        // Vis en bekreftelsesmelding
        showStylizedAlert('Tabellen er nå låst opp. Endringer kan gjøres.', 'success');
    }

    // Deaktiver/aktiver alle knapper i tabellen
    const buttons = document.querySelectorAll('.small-button, .exp-header button');
    buttons.forEach(button => {
        button.disabled = isLocked;
        button.style.opacity = isLocked ? '0.5' : '';
        button.style.cursor = isLocked ? 'not-allowed' : '';
    });
}

// Funksjon for å eksportere data
function exportData() {
    // Hent data direkte fra students-arrayen
    const data = JSON.stringify(students);
    
    // Opprett en blob med dataene
    const blob = new Blob([data], { type: 'application/json' });
    
    // Opprett en URL for blob-en
    const url = URL.createObjectURL(blob);
    
    // Opprett en midlertidig lenke for nedlasting
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_' + new Date().toISOString().slice(0, 10) + '.json';
    
    // Legg til lenken i DOM-en, klikk på den, og fjern den
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Frigjør URL-en
    URL.revokeObjectURL(url);
}

// Funksjon for å importere data
function importData() {
    // Opprett et filvelger-element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    // Håndter filvalg
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Les filen
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Prøv å parse JSON-dataene
                const data = e.target.result;
                const parsedData = JSON.parse(data); // Sjekk om dataene er gyldig JSON
                
                // Sjekk om dataene er i riktig format (en array)
                if (!Array.isArray(parsedData)) {
                    throw new Error('Importerte data er ikke i riktig format. Forventet en array av studenter.');
                }
                
                // Bekreft med brukeren
                if (confirm('Er du sikker på at du vil erstatte alle eksisterende data med de importerte dataene? Dette vil overskrive alle nåværende elever.')) {
                    // Oppdater students-arrayen
                    students = parsedData;
                    
                    // Lagre til localStorage
                    saveData();
                    
                    // Oppdater tabellen
                    updateTable();
                    
                    alert('Data importert og lastet inn!');
                }
            } catch (error) {
                alert('Feil ved import av data: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    
    // Klikk på filvelgeren
    input.click();
}

// Funksjon for å legge til forhåndsdefinerte studenter
function addPredefinedStudents() {
    // Åpne den stiliserte dialogboksen i stedet for standard prompt
    openAddPlayersModal();
}

// Funksjon for å åpne dialogboksen for å legge til spillere
function openAddPlayersModal() {
    const modal = document.getElementById('addPlayersModal');
    
    // Fjern eksisterende backdrop hvis den finnes
    let backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    
    // Opprett ny backdrop
    backdrop = document.createElement('div');
    backdrop.id = 'modal-backdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    backdrop.style.zIndex = '1000';
    backdrop.style.opacity = '0';
    backdrop.style.transition = 'opacity 0.3s ease';
    document.body.appendChild(backdrop);
    
    // Vis backdrop med en liten forsinkelse for å aktivere overgangseffekten
    setTimeout(() => {
        backdrop.style.opacity = '1';
    }, 10);
    
    // Vis modal
    modal.style.display = 'block';
    
    // Tøm input-feltet
    document.getElementById('playerNamesInput').value = '';
    
    // Legg til klikk-hendelse for å lukke modal ved klikk på backdrop
    backdrop.addEventListener('click', function() {
        closeAddPlayersModal();
    });
}

// Funksjon for å lukke dialogboksen
function closeAddPlayersModal() {
    const modal = document.getElementById('addPlayersModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Fjern backdrop med fade-out effekt
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.style.opacity = '0';
        setTimeout(() => {
            backdrop.remove();
        }, 300);
    }
}

// Funksjon for å legge til flere spillere samtidig
function addMultiplePlayers() {
    // Fjern sjekken for pinVerifiedForAddingPlayers siden vi nå håndterer dette på en annen måte
    
    const namesInput = document.getElementById('playerNamesInput').value.trim();
    
    if (!namesInput) {
        // Vis en feilmelding i samme stil som resten av siden
        showStylizedAlert('Vennligst skriv inn minst ett navn', 'error');
        return;
    }
    
    // Del opp input basert på komma eller linjeskift
    const namesArray = namesInput.split(/[,\n]+/).map(name => name.trim()).filter(name => name);
    
    if (namesArray.length === 0) {
        showStylizedAlert('Ingen gyldige navn funnet', 'error');
        return;
    }
    
    let addedCount = 0;
    let duplicateNames = [];
    
    // Legg til hver spiller
    namesArray.forEach(playerName => {
        if (playerName) {
            // Sjekk om spilleren allerede eksisterer
            const exists = students.some(s => s.name === playerName);
            
            if (!exists) {
                // Opprett en ny spiller med standardverdier
                const newPlayer = {
                    name: playerName,
                    Intelligens: 0,
                    Teknologi: 0,
                    Stamina: 0,
                    Karisma: 0,
                    Kreativitet: 0,
                    Flaks: 0,
                    exp: 0
                };
                
                // Legg til den nye spilleren i students-arrayen
                students.push(newPlayer);
                addedCount++;
            } else {
                duplicateNames.push(playerName);
            }
        }
    });
    
    // Lagre data og oppdater tabellen
    saveData();
    updateTable();
    
    // Lukk dialogboksen
    closeAddPlayersModal();
    
    // Vis en bekreftelsesmelding
    if (addedCount > 0) {
        let message = `${addedCount} ${addedCount === 1 ? 'spiller' : 'spillere'} ble lagt til!`;
        if (duplicateNames.length > 0) {
            message += `\n\nMerk: Følgende navn eksisterer allerede og ble ikke lagt til:\n${duplicateNames.join(', ')}`;
        }
        showStylizedAlert(message, 'success');
    } else if (duplicateNames.length > 0) {
        showStylizedAlert(`Ingen nye spillere ble lagt til. Alle navn eksisterer allerede:\n${duplicateNames.join(', ')}`, 'warning');
    }
}

// Funksjon for å vise stiliserte varsler
function showStylizedAlert(message, type = 'info') {
    // Opprett alert-container hvis den ikke finnes
    let alertContainer = document.getElementById('stylized-alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'stylized-alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.left = '50%';
        alertContainer.style.transform = 'translateX(-50%)';
        alertContainer.style.zIndex = '2000';
        alertContainer.style.display = 'flex';
        alertContainer.style.flexDirection = 'column';
        alertContainer.style.alignItems = 'center';
        alertContainer.style.gap = '10px';
        document.body.appendChild(alertContainer);
    }
    
    // Bestem farge basert på type
    let color, icon;
    switch (type) {
        case 'success':
            color = '#27ae60';
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            color = '#e74c3c';
            icon = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            color = '#f39c12';
            icon = 'fas fa-exclamation-triangle';
            break;
        default:
            color = '#3498db';
            icon = 'fas fa-info-circle';
    }
    
    // Opprett alert-element
    const alert = document.createElement('div');
    alert.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.95))';
    alert.style.border = `2px solid ${color}`;
    alert.style.boxShadow = `0 0 15px ${color}40`;
    alert.style.borderRadius = '10px';
    alert.style.padding = '15px 20px';
    alert.style.color = '#fff';
    alert.style.fontFamily = "'Courier New', monospace";
    alert.style.maxWidth = '400px';
    alert.style.width = '100%';
    alert.style.position = 'relative';
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-20px)';
    alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Formater meldingen med linjeskift
    const formattedMessage = message.replace(/\n/g, '<br>');
    
    // Sett HTML-innhold
    alert.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 15px;">
            <i class="${icon}" style="color: ${color}; font-size: 24px; margin-top: 2px;"></i>
            <div>
                <div style="margin-bottom: 5px; color: ${color}; font-weight: bold; font-size: 18px;">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div style="line-height: 1.4;">${formattedMessage}</div>
            </div>
        </div>
        <button style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            font-size: 16px;
            cursor: pointer;
            transition: color 0.3s ease;
        " onmouseover="this.style.color='rgba(255, 255, 255, 0.8)';" 
          onmouseout="this.style.color='rgba(255, 255, 255, 0.5)';">×</button>
    `;
    
    // Legg til alert i container
    alertContainer.appendChild(alert);
    
    // Animer inn
    setTimeout(() => {
        alert.style.opacity = '1';
        alert.style.transform = 'translateY(0)';
    }, 10);
    
    // Legg til klikk-hendelse for å lukke alert
    alert.querySelector('button').addEventListener('click', function() {
        closeStylizedAlert(alert);
    });
    
    // Lukk automatisk etter 5 sekunder
    setTimeout(() => {
        closeStylizedAlert(alert);
    }, 5000);
}

// Funksjon for å lukke stilisert alert
function closeStylizedAlert(alert) {
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        alert.remove();
    }, 300);
}

// PIN-kode beskyttelse - stilisert versjon
const PIN_CODE = "1234"; // Standard PIN-kode

// Lagre de originale funksjonene
const originalFunctions = {
    toggleLock: toggleLock,
    toggleDeleteProtection: toggleDeleteProtection,
    exportData: exportData,
    importData: importData,
    addPredefinedStudents: addPredefinedStudents,
    removeAllPlayers: removeAllPlayers
};

// Variabel for å holde styr på om PIN-koden er verifisert for å legge til spillere
let pinVerifiedForAddingPlayers = false;

// Funksjon for å vise stilisert PIN-dialog og utføre handling
function showPinDialog(actionName) {
    // Opprett dialog-container hvis den ikke finnes
    let pinDialogContainer = document.getElementById('stylized-pin-dialog');
    if (!pinDialogContainer) {
        pinDialogContainer = document.createElement('div');
        pinDialogContainer.id = 'stylized-pin-dialog';
        pinDialogContainer.style.position = 'fixed';
        pinDialogContainer.style.top = '0';
        pinDialogContainer.style.left = '0';
        pinDialogContainer.style.width = '100%';
        pinDialogContainer.style.height = '100%';
        pinDialogContainer.style.display = 'flex';
        pinDialogContainer.style.alignItems = 'center';
        pinDialogContainer.style.justifyContent = 'center';
        pinDialogContainer.style.zIndex = '2000';
        document.body.appendChild(pinDialogContainer);
    } else {
        // Tøm container hvis den allerede finnes
        pinDialogContainer.innerHTML = '';
    }
    
    // Opprett backdrop
    const backdrop = document.createElement('div');
    backdrop.style.position = 'absolute';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    backdrop.style.zIndex = '1';
    backdrop.style.animation = 'fadeIn 0.3s forwards';
    pinDialogContainer.appendChild(backdrop);
    
    // Opprett dialog-boks
    const dialog = document.createElement('div');
    dialog.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.95))';
    dialog.style.border = '2px solid #3498db';
    dialog.style.boxShadow = '0 0 30px rgba(52, 152, 219, 0.3), 0 0 15px rgba(52, 152, 219, 0.2) inset';
    dialog.style.borderRadius = '15px';
    dialog.style.padding = '30px';
    dialog.style.maxWidth = '400px';
    dialog.style.width = '90%';
    dialog.style.position = 'relative';
    dialog.style.zIndex = '2';
    dialog.style.animation = 'scaleIn 0.3s forwards';
    dialog.style.fontFamily = "'Courier New', monospace";
    pinDialogContainer.appendChild(dialog);
    
    // Opprett holografisk effekt overlay
    const holographicEffect = document.createElement('div');
    holographicEffect.style.position = 'absolute';
    holographicEffect.style.top = '0';
    holographicEffect.style.left = '0';
    holographicEffect.style.right = '0';
    holographicEffect.style.bottom = '0';
    holographicEffect.style.background = 'repeating-linear-gradient(90deg, rgba(52, 152, 219, 0.03) 0px, rgba(52, 152, 219, 0.03) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(0deg, rgba(52, 152, 219, 0.03) 0px, rgba(52, 152, 219, 0.03) 1px, transparent 1px, transparent 10px)';
    holographicEffect.style.pointerEvents = 'none';
    holographicEffect.style.zIndex = '1';
    holographicEffect.style.borderRadius = '13px';
    dialog.appendChild(holographicEffect);
    
    // Opprett glødende kant effekt
    const glowingBorder = document.createElement('div');
    glowingBorder.style.position = 'absolute';
    glowingBorder.style.top = '-2px';
    glowingBorder.style.left = '-2px';
    glowingBorder.style.right = '-2px';
    glowingBorder.style.bottom = '-2px';
    glowingBorder.style.borderRadius = '17px';
    glowingBorder.style.background = 'linear-gradient(45deg, #3498db, transparent, #2980b9, transparent, #3498db)';
    glowingBorder.style.backgroundSize = '400% 400%';
    glowingBorder.style.animation = 'glowingBorder 8s linear infinite';
    glowingBorder.style.opacity = '0.6';
    glowingBorder.style.zIndex = '-1';
    dialog.appendChild(glowingBorder);
    
    // Opprett tittel
    const title = document.createElement('h2');
    title.style.color = '#3498db';
    title.style.fontSize = '28px';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '3px';
    title.style.marginBottom = '25px';
    title.style.textAlign = 'center';
    title.style.textShadow = '0 0 10px rgba(52, 152, 219, 0.7)';
    title.style.fontFamily = "'Courier New', monospace";
    title.style.borderBottom = '2px solid #3498db';
    title.style.paddingBottom = '10px';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.justifyContent = 'center';
    title.innerHTML = '<i class="fas fa-shield-alt" style="margin-right: 15px; font-size: 24px;"></i> SIKKERHETSKONTROLL <i class="fas fa-shield-alt" style="margin-left: 15px; font-size: 24px;"></i>';
    dialog.appendChild(title);
    
    // Opprett beskrivelse
    const description = document.createElement('p');
    description.style.color = 'rgba(255, 255, 255, 0.8)';
    description.style.textAlign = 'center';
    description.style.marginBottom = '20px';
    description.style.fontFamily = "'Courier New', monospace";
    description.textContent = 'Skriv inn PIN-koden for å fortsette med denne handlingen.';
    dialog.appendChild(description);
    
    // Opprett input-container
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.justifyContent = 'center';
    inputContainer.style.gap = '10px';
    inputContainer.style.marginBottom = '20px';
    dialog.appendChild(inputContainer);
    
    // Opprett PIN-input
    const pinInput = document.createElement('input');
    pinInput.type = 'password';
    pinInput.maxLength = '4';
    pinInput.style.width = '200px';
    pinInput.style.background = 'rgba(0, 0, 0, 0.5)';
    pinInput.style.border = '2px solid #3498db';
    pinInput.style.borderRadius = '10px';
    pinInput.style.color = '#fff';
    pinInput.style.padding = '15px';
    pinInput.style.fontFamily = "'Courier New', monospace";
    pinInput.style.fontSize = '24px';
    pinInput.style.textAlign = 'center';
    pinInput.style.letterSpacing = '10px';
    pinInput.style.outline = 'none';
    pinInput.style.transition = 'all 0.3s ease';
    pinInput.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.2) inset';
    pinInput.placeholder = '****';
    pinInput.addEventListener('mouseover', function() {
        this.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.4) inset';
    });
    pinInput.addEventListener('mouseout', function() {
        this.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.2) inset';
    });
    pinInput.addEventListener('keypress', function(e) {
        // Tillat kun tall
        if (e.charCode < 48 || e.charCode > 57) {
            e.preventDefault();
            return false;
        }
        // Utfør handling ved Enter
        if (e.key === 'Enter') {
            verifyPinAndExecute();
        }
    });
    inputContainer.appendChild(pinInput);
    
    // Opprett feilmelding
    const errorMessage = document.createElement('div');
    errorMessage.id = 'pin-error-message';
    errorMessage.style.color = '#e74c3c';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.marginBottom = '20px';
    errorMessage.style.fontFamily = "'Courier New', monospace";
    errorMessage.style.display = 'none';
    errorMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Feil PIN-kode. Prøv igjen.';
    dialog.appendChild(errorMessage);
    
    // Opprett knapp-container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '15px';
    dialog.appendChild(buttonContainer);
    
    // Opprett bekreft-knapp
    const confirmButton = document.createElement('button');
    confirmButton.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))';
    confirmButton.style.border = '2px solid #3498db';
    confirmButton.style.color = '#3498db';
    confirmButton.style.padding = '12px 25px';
    confirmButton.style.borderRadius = '8px';
    confirmButton.style.fontFamily = "'Courier New', monospace";
    confirmButton.style.textShadow = '0 0 5px rgba(52, 152, 219, 0.5)';
    confirmButton.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.2)';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.transition = 'all 0.3s ease';
    confirmButton.style.fontSize = '16px';
    confirmButton.style.textTransform = 'uppercase';
    confirmButton.style.letterSpacing = '1px';
    confirmButton.style.position = 'relative';
    confirmButton.style.overflow = 'hidden';
    confirmButton.innerHTML = '<i class="fas fa-check" style="margin-right: 8px;"></i> Bekreft';
    confirmButton.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.4)';
    });
    confirmButton.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.2)';
    });
    confirmButton.addEventListener('click', verifyPinAndExecute);
    buttonContainer.appendChild(confirmButton);
    
    // Opprett avbryt-knapp
    const cancelButton = document.createElement('button');
    cancelButton.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))';
    cancelButton.style.border = '2px solid #e74c3c';
    cancelButton.style.color = '#e74c3c';
    cancelButton.style.padding = '12px 25px';
    cancelButton.style.borderRadius = '8px';
    cancelButton.style.fontFamily = "'Courier New', monospace";
    cancelButton.style.textShadow = '0 0 5px rgba(231, 76, 60, 0.5)';
    cancelButton.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.2)';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.transition = 'all 0.3s ease';
    cancelButton.style.fontSize = '16px';
    cancelButton.style.textTransform = 'uppercase';
    cancelButton.style.letterSpacing = '1px';
    cancelButton.innerHTML = '<i class="fas fa-times" style="margin-right: 8px;"></i> Avbryt';
    cancelButton.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 15px rgba(231, 76, 60, 0.4)';
    });
    cancelButton.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.2)';
    });
    cancelButton.addEventListener('click', function() {
        closePinDialog();
    });
    buttonContainer.appendChild(cancelButton);
    
    // Opprett informasjonspanel
    const infoPanel = document.createElement('div');
    infoPanel.style.marginTop = '20px';
    infoPanel.style.padding = '10px';
    infoPanel.style.background = 'rgba(0, 0, 0, 0.5)';
    infoPanel.style.border = '1px solid rgba(52, 152, 219, 0.3)';
    infoPanel.style.borderRadius = '8px';
    infoPanel.style.fontSize = '14px';
    infoPanel.style.color = 'rgba(255, 255, 255, 0.7)';
    infoPanel.style.textAlign = 'center';
    infoPanel.innerHTML = '<i class="fas fa-info-circle" style="color: #3498db; margin-right: 5px;"></i> Denne handlingen krever administratortilgang.';
    dialog.appendChild(infoPanel);
    
    // Legg til CSS for animasjoner hvis det ikke allerede finnes
    if (!document.getElementById('pin-dialog-styles')) {
        const style = document.createElement('style');
        style.id = 'pin-dialog-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes glowingBorder {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Sett fokus på input-feltet
    setTimeout(() => {
        pinInput.focus();
    }, 100);
    
    // Funksjon for å verifisere PIN og utføre handling
    function verifyPinAndExecute() {
        const enteredPin = pinInput.value;
        
        if (enteredPin === PIN_CODE) {
            // PIN-koden er riktig
            closePinDialog();
            
            // Utfør handlingen basert på navnet
            switch (actionName) {
                case "toggleLock":
                    originalFunctions.toggleLock();
                    break;
                case "toggleDeleteProtection":
                    originalFunctions.toggleDeleteProtection();
                    break;
                case "exportData":
                    originalFunctions.exportData();
                    break;
                case "importData":
                    originalFunctions.importData();
                    break;
                case "addPredefinedStudents":
                    originalFunctions.addPredefinedStudents();
                    break;
                case "removeAllPlayers":
                    originalFunctions.removeAllPlayers();
                    break;
                default:
                    console.error("Ukjent handling:", actionName);
            }
        } else {
            // PIN-koden er feil
            const errorElement = document.getElementById('pin-error-message');
            errorElement.style.display = 'block';
            pinInput.value = '';
            pinInput.focus();
            
            // Animer feilmelding
            errorElement.style.animation = 'none';
            setTimeout(() => {
                errorElement.style.animation = 'shake 0.5s';
            }, 10);
        }
    }
    
    // Funksjon for å lukke PIN-dialogen
    function closePinDialog() {
        const container = document.getElementById('stylized-pin-dialog');
        if (container) {
            // Animer ut
            const dialog = container.querySelector('div:nth-child(2)');
            const backdrop = container.querySelector('div:first-child');
            
            if (dialog) {
                dialog.style.animation = 'scaleIn 0.3s reverse forwards';
            }
            
            if (backdrop) {
                backdrop.style.animation = 'fadeIn 0.3s reverse forwards';
            }
            
            // Fjern etter animasjon
            setTimeout(() => {
                container.remove();
            }, 300);
        }
    }
}

// Erstatt de originale funksjonene med PIN-beskyttede versjoner
document.addEventListener('DOMContentLoaded', function() {
    // Erstatt onclick-handlerne for knappene
    const lockButton = document.getElementById('lockButton');
    if (lockButton) {
        lockButton.onclick = function() {
            showPinDialog("toggleLock");
            return false; // Forhindre standard handling
        };
    }
    
    const deleteProtectionButton = document.getElementById('deleteProtectionButton');
    if (deleteProtectionButton) {
        deleteProtectionButton.onclick = function() {
            showPinDialog("toggleDeleteProtection");
            return false; // Forhindre standard handling
        };
    }
    
    // Finn og erstatt andre knapper basert på tekst
    document.querySelectorAll('button').forEach(button => {
        const buttonText = button.innerText || button.textContent;
        
        if (buttonText.includes('Eksporter data')) {
            button.onclick = function() {
                showPinDialog("exportData");
                return false; // Forhindre standard handling
            };
        } else if (buttonText.includes('Importer data')) {
            button.onclick = function() {
                showPinDialog("importData");
                return false; // Forhindre standard handling
            };
        } else if (buttonText.includes('Legg til spillere')) {
            // Sjekk om knappen er inne i addPlayersModal
            const isInAddPlayersModal = button.closest('#addPlayersModal') !== null;
            
            if (isInAddPlayersModal) {
                // Hvis knappen er inne i addPlayersModal, ikke vis PIN-dialogen
                button.onclick = function() {
                    addMultiplePlayers();
                    return false; // Forhindre standard handling
                };
            } else {
                // Hvis knappen er i hovedgrensesnittet, kall addPredefinedStudents direkte uten PIN-kode
                button.onclick = function() {
                    addPredefinedStudents();
                    return false; // Forhindre standard handling
                };
            }
        } else if (buttonText.includes('Fjern alle spillere')) {
            button.onclick = function() {
                showPinDialog("removeAllPlayers");
                return false; // Forhindre standard handling
            };
        }
    });
});

// Funksjon for å opprette tooltip
function createTooltip(event, index) {
    // Fjern eksisterende tooltip
    const existingTooltip = document.querySelector('.player-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    const student = students[index];
    const totalLevel = calculateLevel(student);
    const achievementsCount = student.achievements ? student.achievements.length : 0;
    const totalAchievements = achievements.length;
    
    // Beregn høyeste ferdighet
    const skills = ['Intelligens', 'Teknologi', 'Stamina', 'Karisma', 'Kreativitet', 'Flaks'];
    const highestSkill = skills.reduce((a, b) => student[a] > student[b] ? a : b);

    // Opprett tooltip-element
    const tooltip = document.createElement('div');
    tooltip.className = 'player-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-title">${student.name}'s Stats</div>
        <div class="tooltip-stat">
            <span>Total Level:</span>
            <span>${totalLevel}</span>
        </div>
        <div class="tooltip-stat">
            <span>Høyeste Ferdighet:</span>
            <span>${highestSkill} (${student[highestSkill]})</span>
        </div>
        <div class="tooltip-stat">
            <span>Prestasjoner:</span>
            <span>${achievementsCount}/${totalAchievements}</span>
        </div>
        <div class="tooltip-stat">
            <span>Tilgjengelig EXP:</span>
            <span>${student.exp}</span>
        </div>
    `;

    // Posisjonering av tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = `${rect.right + 10}px`;
    tooltip.style.top = `${rect.top - 10}px`;

    // Legg til i dokumentet
    document.body.appendChild(tooltip);
    
    // Vis tooltip
    requestAnimationFrame(() => tooltip.classList.add('show'));
}

// Funksjon for å fjerne tooltip
function removeTooltip() {
    const tooltip = document.querySelector('.player-tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 200);
    }
}

// Funksjon for å spille achievement-lyd
function playAchievementSound() {
    const sound = document.getElementById('achievementSound');
    sound.currentTime = 0;
    sound.volume = 0.3;
    sound.play().catch(e => console.log('Sound play prevented:', e));
}

// Funksjon for å spille level-up-lyd
function playLevelUpSound() {
    const sound = document.getElementById('levelUpSound');
    sound.currentTime = 0;
    sound.volume = 0.3;
    sound.play().catch(e => console.log('Sound play prevented:', e));
}

// Funksjon for å spille lyd når en gjenstand blir funnet ved level-up
function playItemFoundSound() {
    const sound = document.getElementById('itemFoundSound');
    sound.currentTime = 0;
    sound.volume = 0.35;
    sound.play().catch(e => console.log('Sound play prevented:', e));
}

// Funksjon for å endre ferdighet
function changeSkill(index, skill, amount) {
    const student = students[index];
    const baseValue = student[skill];
    const totalValue = getSkillWithBonus(student, skill);
    
    // Først sjekk om vi kan gjøre endringen
    if (amount > 0) {
        if (student.exp < 1000) {
            console.log('Ikke nok EXP');
            return;
        }
        if (baseValue >= MAX_SKILL_LEVEL) {
            console.log('Allerede på maksimalt nivå');
            return;
        }
    } else if (baseValue <= 0) {
        console.log('Allerede på minimalt nivå');
        return;
    }
    
    const oldBaseValue = baseValue;
    const oldTotalValue = totalValue;
    const oldLevel = calculateLevel(student);
    
    // Oppdater ferdighetsverdien innenfor grensene
    const newBaseValue = Math.min(Math.max(0, oldBaseValue + amount), MAX_SKILL_LEVEL);
    
    // Fortsett bare hvis verdien faktisk endret seg
    if (newBaseValue !== oldBaseValue) {
        // Oppdater ferdigheten først
        student[skill] = newBaseValue;
        
        // Deretter håndter EXP-endringer
        if (amount > 0) {
            student.exp -= 1000;
        } else {
            student.exp += 1000;
        }
        
        // Oppdater visningen
        updateTable();
        
        // Vis animasjoner og effekter etter oppdateringen
        if (amount > 0) {
            const cell = document.querySelector(`tr:nth-child(${index + 1}) td[data-skill="${skill}"]`);
            if (cell) {
                showLevelUpAnimation(cell, skill);
                playLevelUpSound();
            }
            // Sjekk for nye prestasjoner
            checkAchievements(student, index, cell);
        } else {
            // Sjekk om noen prestasjoner bør fjernes
            checkAchievementRequirements(student, skill);
        }
        
        // Vis level up-animasjon hvis totalt nivå økte
        const newLevel = calculateLevel(student);
        if (newLevel > oldLevel) {
            const levelDisplay = document.querySelector(`tr:nth-child(${index + 1}) .level-display`);
            if (levelDisplay) {
                levelDisplay.classList.add('glow');
                setTimeout(() => levelDisplay.classList.remove('glow'), 1000);
            }
            
            // Sjekk om eleven får en tilfeldig gjenstand ved level up
            checkRandomItemOnLevelUp(index);
        }
        
        saveData();
    }
}

function checkAchievementRequirements(student, skill) {
    const skillValue = getSkillWithBonus(student, skill);
    const achievementsToRemove = [];
    const skillAchievements = achievements.filter(a => a.skill === skill);
    
    skillAchievements.forEach(achievement => {
        const hasAchievement = student.achievements?.includes(achievement.name);
        const levelRequired = parseInt(achievement.description.match(/\d+/)[0]);
        
        if (hasAchievement && skillValue < levelRequired) {
            achievementsToRemove.push(achievement);
        }
    });
    
    if (achievementsToRemove.length > 0) {
        achievementsToRemove.forEach(achievement => {
            const index = student.achievements.indexOf(achievement.name);
            if (index > -1) {
                student.achievements.splice(index, 1);
            }
        });
        saveData();
    }
}

function checkAchievements(student, index, cell) {
    const skill = cell.closest('td').getAttribute('data-skill');
    if (!skill) return;

    // Lag en kopi av student-objektet med oppdaterte skill-verdier som inkluderer bonuser
    const studentWithBonuses = {...student};
    
    // Oppdater alle skills med bonuser
    ['Intelligens', 'Teknologi', 'Stamina', 'Karisma', 'Kreativitet', 'Flaks'].forEach(skillName => {
        studentWithBonuses[skillName] = getSkillWithBonus(student, skillName);
    });

    achievements
        .filter(a => a.skill === skill)
        .forEach(achievement => {
            const hasAchievement = student.achievements?.includes(achievement.name);
            // Bruk studentWithBonuses for å sjekke om achievement er oppnådd
            const meetsRequirement = achievement.check(studentWithBonuses);
            
            if (!hasAchievement && meetsRequirement) {
                // Legg til prestasjon til student
                if (!student.achievements) {
                    student.achievements = [];
                }
                student.achievements.push(achievement.name);
                
                // Vis popup og spill lyd
                showAchievementPopup(achievement);
                playAchievementSound();
                
                // Lagre data
                saveData();
            }
        });
}

function showLevelUpAnimation(cell, skill) {
    if (!cell) return;

    // Få markørposisjon eller cellesentrum hvis ingen markørposisjon
    const rect = cell.getBoundingClientRect();
    const x = window.lastClickX || (rect.left + rect.width / 2);
    const y = window.lastClickY || (rect.top + rect.height / 2);

    // Opprett level up-tekst
    const levelUpText = document.createElement('div');
    levelUpText.className = 'level-up-text';
    levelUpText.textContent = 'Level Up!';
    levelUpText.style.left = `${x}px`;
    levelUpText.style.top = `${y}px`;
    
    document.body.appendChild(levelUpText);

    // Spill level-up lyd
    playLevelUpSound();

    // Fjern etter animasjon (økt til 2000ms for å matche CSS-animasjonen)
    setTimeout(() => levelUpText.remove(), 2000);
}

function closeAchievementModal() {
    const modal = document.getElementById('achievementsModal');
    if (modal) {
        // Legg til en fade-out animasjon
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
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

// Funksjon for å fjerne en student
function removeStudent(nameOrIndex) {
    // Sjekk om vi har en indeks eller et navn
    let index = -1;
    if (typeof nameOrIndex === 'number') {
        index = nameOrIndex;
    } else if (typeof nameOrIndex === 'string') {
        // Finn indeksen til studenten med det gitte navnet
        index = students.findIndex(student => student.name === nameOrIndex);
    }
    
    // Sjekk om vi fant studenten
    if (index === -1 || index >= students.length) {
        alert('Fant ikke studenten');
        return;
    }
    
    // Bekreft med brukeren
    const studentName = students[index].name;
    if (confirm(`Er du sikker på at du vil fjerne ${studentName}?`)) {
        // Fjern studenten
        students.splice(index, 1);
        
        // Hvis det ikke er flere studenter, legg til en tom student
        if (students.length === 0) {
            students.push({
                name: "Ny student",
                Intelligens: 0,
                Teknologi: 0,
                Stamina: 0,
                Karisma: 0,
                Kreativitet: 0,
                Flaks: 0,
                exp: 10000,
                achievements: []
            });
        }
        
        // Lagre data og oppdater tabellen
        saveData();
        updateTable();
        
        alert(`${studentName} er fjernet`);
    }
}

// Variabel for å holde styr på om sletting av elever er låst
let isDeleteProtected = true;

// Funksjon for å åpne dialog for egendefinert EXP
function openCustomExpDialog(index) {
    // Fjern eksisterende dialog hvis den finnes
    const existingDialog = document.getElementById('customExpDialog');
    if (existingDialog) {
        existingDialog.remove();
    }
    
    // Opprett dialog
    const dialog = document.createElement('div');
    dialog.id = 'customExpDialog';
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(3px);
    `;
    
    // Opprett dialog-innhold
    const dialogContent = document.createElement('div');
    dialogContent.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        color: #ffffff;
        border: 2px solid #2ecc71;
        border-radius: 15px;
        padding: 25px;
        width: 350px;
        box-shadow: 0 0 30px rgba(46, 204, 113, 0.3);
        text-align: center;
        font-family: 'Courier New', monospace;
        position: relative;
        animation: fadeIn 0.3s ease;
    `;
    
    // Opprett tittel
    const title = document.createElement('h3');
    title.textContent = 'Legg til EXP';
    title.style.cssText = `
        margin: 0 0 20px 0;
        color: #2ecc71;
        text-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
        font-size: 24px;
        letter-spacing: 1px;
        text-transform: uppercase;
    `;
    
    // Opprett input-felt
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '100';
    input.style.cssText = `
        width: 100%;
        padding: 12px;
        margin-bottom: 20px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #2ecc71;
        border-radius: 8px;
        color: #ffffff;
        font-size: 18px;
        text-align: center;
        box-shadow: 0 0 10px rgba(46, 204, 113, 0.2) inset;
        transition: all 0.3s ease;
    `;
    
    input.onfocus = function() {
        this.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.4) inset';
        this.style.borderColor = '#2ecc71';
    };
    
    input.onblur = function() {
        this.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.2) inset';
    };
    
    // Opprett knapper
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        gap: 15px;
        margin-top: 10px;
    `;
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Avbryt';
    cancelButton.style.cssText = `
        flex: 1;
        padding: 10px;
        background: linear-gradient(180deg, #333333, #222222);
        border: 1px solid #e74c3c;
        border-radius: 8px;
        color: #e74c3c;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 16px;
        text-shadow: 0 0 5px rgba(231, 76, 60, 0.3);
    `;
    cancelButton.onmouseover = function() {
        this.style.background = 'linear-gradient(180deg, #444444, #333333)';
        this.style.boxShadow = '0 0 15px rgba(231, 76, 60, 0.3)';
    };
    cancelButton.onmouseout = function() {
        this.style.background = 'linear-gradient(180deg, #333333, #222222)';
        this.style.boxShadow = 'none';
    };
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Legg til';
    confirmButton.style.cssText = `
        flex: 1;
        padding: 10px;
        background: linear-gradient(180deg, #2ecc71, #27ae60);
        border: 1px solid #2ecc71;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 16px;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    `;
    confirmButton.onmouseover = function() {
        this.style.background = 'linear-gradient(180deg, #3ee681, #2ecc71)';
        this.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.5)';
    };
    confirmButton.onmouseout = function() {
        this.style.background = 'linear-gradient(180deg, #2ecc71, #27ae60)';
        this.style.boxShadow = 'none';
    };
    
    // Legg til hendelseshåndterere
    cancelButton.onclick = function() {
        dialog.style.opacity = '0';
        setTimeout(() => dialog.remove(), 300);
    };
    
    confirmButton.onclick = function() {
        const expValue = parseInt(input.value);
        if (!isNaN(expValue)) {
            changeExp(index, expValue);
            dialog.style.opacity = '0';
            setTimeout(() => dialog.remove(), 300);
        } else {
            input.style.borderColor = '#e74c3c';
            input.style.boxShadow = '0 0 15px rgba(231, 76, 60, 0.4) inset';
            setTimeout(() => {
                input.style.borderColor = '#2ecc71';
                input.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.2) inset';
            }, 1000);
        }
    };
    
    // Legg til elementer i dialog
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    
    dialogContent.appendChild(title);
    dialogContent.appendChild(input);
    dialogContent.appendChild(buttonContainer);
    
    dialog.appendChild(dialogContent);
    
    // Legg til dialog i dokumentet
    document.body.appendChild(dialog);
    
    // Legg til CSS-animasjon
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Fokuser på input-feltet
    input.focus();
    input.select();
    
    // Legg til tastetrykk-håndtering
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            confirmButton.click();
        } else if (e.key === 'Escape') {
            cancelButton.click();
        }
    });
    
    // Lukk dialog ved klikk utenfor
    dialog.addEventListener('click', function(e) {
        if (e.target === dialog) {
            cancelButton.click();
        }
    });
}

// Funksjon for å sjekke om eleven får en tilfeldig gjenstand ved level up
function checkRandomItemOnLevelUp(studentIndex) {
    const student = students[studentIndex];
    
    // Basissjanse for å få en gjenstand (2%)
    let chanceToGetItem = 2;
    
    // Øk sjansen basert på flaksnivå (0.25% per nivå)
    if (student.Flaks > 0) {
        chanceToGetItem += student.Flaks * 0.25;
    }
    
    // Maksimal sjanse er 25%
    chanceToGetItem = Math.min(chanceToGetItem, 25);
    
    // Sjekk om eleven får en gjenstand
    const roll = Math.random() * 100;
    if (roll <= chanceToGetItem) {
        // Bestem sjeldenhetsgrad basert på tilfeldighet og flaksnivå
        const rarityRoll = Math.random() * 100;
        let rarity;
        
        // Flaksnivå påvirker også sjansen for bedre gjenstander
        const luckBonus = student.Flaks * 0.2; // 0.2% per flaksnivå
        
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
        
        // Spill lyd for funnet gjenstand
        playItemFoundSound();
        
        // Vis melding med animasjon
        showItemAcquiredAnimation(randomItem, true);
        
        // Vis en spesiell melding om at gjenstanden ble funnet ved level up
        showLevelUpItemMessage(student.name, randomItem);
    }
}

// Funksjon for å vise melding om at en gjenstand ble funnet ved level up
function showLevelUpItemMessage(studentName, item) {
    // Fjern eksisterende melding hvis den finnes
    const existingMessage = document.getElementById('levelUpItemMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
    
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
    
    // Opprett melding
    const message = document.createElement('div');
    message.id = 'levelUpItemMessage';
    message.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(180deg, rgba(16, 24, 48, 0.95) 0%, rgba(24, 36, 72, 0.95) 100%);
        color: ${rarityColor};
        border-left: 4px solid ${rarityColor};
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 0 15px ${rarityGlow};
        font-family: 'Courier New', monospace;
        z-index: 9999;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    `;
    
    // Legg til innhold
    message.innerHTML = `
        <div style="display: flex; align-items: center;">
            <div style="font-size: 36px; margin-right: 15px;">${item.icon}</div>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">${studentName} fant en gjenstand!</div>
                <div style="font-size: 14px; color: ${rarityColor};">${item.name}</div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7); margin-top: 5px;">Funnet ved level up</div>
            </div>
        </div>
    `;
    
    // Legg til melding i DOM
    document.body.appendChild(message);
    
    // Vis melding med animasjon
    setTimeout(() => {
        message.style.transform = 'translateX(0)';
    }, 10);
    
    // Fjern melding etter 5 sekunder
    setTimeout(() => {
        message.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.remove();
            }
        }, 300);
    }, 5000);
}

// Funksjon for å låse/låse opp muligheten til å fjerne elever
function toggleDeleteProtection() {
    isDeleteProtected = !isDeleteProtected;
    const button = document.getElementById('deleteProtectionButton');
    const icon = button.querySelector('i');
    
    if (isDeleteProtected) {
        button.style.background = 'linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)';
        button.style.color = 'white';
        button.style.borderColor = '#c0392b';
        icon.className = 'fas fa-lock';
        button.innerHTML = '';
        button.appendChild(icon);
        button.appendChild(document.createTextNode(' Sletting låst'));
        
        // Vis en bekreftelsesmelding
        showStylizedAlert('Sletting av elever er nå låst. Ingen elever kan slettes.', 'info');
    } else {
        button.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))';
        button.style.color = '#e74c3c';
        button.style.borderColor = '#e74c3c';
        icon.className = 'fas fa-trash-alt';
        button.innerHTML = '';
        button.appendChild(icon);
        button.appendChild(document.createTextNode(' Lås sletting av elever'));
        
        // Vis en bekreftelsesmelding
        showStylizedAlert('Sletting av elever er nå låst opp. Elever kan slettes.', 'warning');
    }
    
    // Vis/skjul sletteknappene for elever
    const deleteButtons = document.querySelectorAll('.delete-student-button');
    deleteButtons.forEach(button => {
        button.style.display = isDeleteProtected ? 'none' : 'block';
    });
    
    // Oppdater tabellen for å vise/skjule sletteknappene
    updateTable();
}

// Funksjon for å fjerne alle spillere
function removeAllPlayers() {
    // Vis en stilisert bekreftelsesdialog før sletting
    showStylizedConfirm(
        "Er du sikker på at du vil fjerne ALLE spillere? Denne handlingen kan ikke angres.",
        function() {
            // Tøm students-arrayen
            students = [];
            
            // Lagre data og oppdater tabellen
            saveData();
            updateTable();
            
            // Vis en bekreftelsesmelding
            showStylizedAlert('Alle spillere er fjernet fra systemet.', 'warning');
        }
    );
}

// Funksjon for å vise en stilisert bekreftelsesdialog
function showStylizedConfirm(message, onConfirm, onCancel) {
    // Opprett dialog-container
    const confirmDialogContainer = document.createElement('div');
    confirmDialogContainer.id = 'stylized-confirm-dialog';
    confirmDialogContainer.style.position = 'fixed';
    confirmDialogContainer.style.top = '0';
    confirmDialogContainer.style.left = '0';
    confirmDialogContainer.style.width = '100%';
    confirmDialogContainer.style.height = '100%';
    confirmDialogContainer.style.display = 'flex';
    confirmDialogContainer.style.alignItems = 'center';
    confirmDialogContainer.style.justifyContent = 'center';
    confirmDialogContainer.style.zIndex = '3000';
    document.body.appendChild(confirmDialogContainer);
    
    // Opprett backdrop
    const backdrop = document.createElement('div');
    backdrop.style.position = 'absolute';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100%';
    backdrop.style.height = '100%';
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    backdrop.style.zIndex = '1';
    backdrop.style.animation = 'fadeIn 0.3s forwards';
    confirmDialogContainer.appendChild(backdrop);
    
    // Opprett dialog-boks
    const dialog = document.createElement('div');
    dialog.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 40, 0.95))';
    dialog.style.border = '2px solid #e74c3c';
    dialog.style.boxShadow = '0 0 30px rgba(231, 76, 60, 0.3), 0 0 15px rgba(231, 76, 60, 0.2) inset';
    dialog.style.borderRadius = '15px';
    dialog.style.padding = '30px';
    dialog.style.maxWidth = '500px';
    dialog.style.width = '90%';
    dialog.style.position = 'relative';
    dialog.style.zIndex = '2';
    dialog.style.animation = 'scaleIn 0.3s forwards';
    dialog.style.fontFamily = "'Courier New', monospace";
    confirmDialogContainer.appendChild(dialog);
    
    // Opprett holografisk effekt overlay
    const holographicEffect = document.createElement('div');
    holographicEffect.style.position = 'absolute';
    holographicEffect.style.top = '0';
    holographicEffect.style.left = '0';
    holographicEffect.style.right = '0';
    holographicEffect.style.bottom = '0';
    holographicEffect.style.background = 'repeating-linear-gradient(90deg, rgba(231, 76, 60, 0.03) 0px, rgba(231, 76, 60, 0.03) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(0deg, rgba(231, 76, 60, 0.03) 0px, rgba(231, 76, 60, 0.03) 1px, transparent 1px, transparent 10px)';
    holographicEffect.style.pointerEvents = 'none';
    holographicEffect.style.zIndex = '1';
    holographicEffect.style.borderRadius = '13px';
    dialog.appendChild(holographicEffect);
    
    // Opprett glødende kant effekt
    const glowingBorder = document.createElement('div');
    glowingBorder.style.position = 'absolute';
    glowingBorder.style.top = '-2px';
    glowingBorder.style.left = '-2px';
    glowingBorder.style.right = '-2px';
    glowingBorder.style.bottom = '-2px';
    glowingBorder.style.borderRadius = '17px';
    glowingBorder.style.background = 'linear-gradient(45deg, #e74c3c, transparent, #c0392b, transparent, #e74c3c)';
    glowingBorder.style.backgroundSize = '400% 400%';
    glowingBorder.style.animation = 'glowingBorder 8s linear infinite';
    glowingBorder.style.opacity = '0.6';
    glowingBorder.style.zIndex = '-1';
    dialog.appendChild(glowingBorder);
    
    // Opprett tittel
    const title = document.createElement('h2');
    title.style.color = '#e74c3c';
    title.style.fontSize = '28px';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '3px';
    title.style.marginBottom = '25px';
    title.style.textAlign = 'center';
    title.style.textShadow = '0 0 10px rgba(231, 76, 60, 0.7)';
    title.style.fontFamily = "'Courier New', monospace";
    title.style.borderBottom = '2px solid #e74c3c';
    title.style.paddingBottom = '10px';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.justifyContent = 'center';
    title.innerHTML = '<i class="fas fa-exclamation-triangle" style="margin-right: 15px; font-size: 24px;"></i> ADVARSEL <i class="fas fa-exclamation-triangle" style="margin-left: 15px; font-size: 24px;"></i>';
    dialog.appendChild(title);
    
    // Opprett beskrivelse
    const description = document.createElement('p');
    description.style.color = 'rgba(255, 255, 255, 0.9)';
    description.style.textAlign = 'center';
    description.style.marginBottom = '30px';
    description.style.fontFamily = "'Courier New', monospace";
    description.style.fontSize = '18px';
    description.style.lineHeight = '1.5';
    description.textContent = message;
    dialog.appendChild(description);
    
    // Opprett knapp-container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '20px';
    dialog.appendChild(buttonContainer);
    
    // Opprett bekreft-knapp
    const confirmButton = document.createElement('button');
    confirmButton.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))';
    confirmButton.style.border = '2px solid #e74c3c';
    confirmButton.style.color = '#e74c3c';
    confirmButton.style.padding = '12px 25px';
    confirmButton.style.borderRadius = '8px';
    confirmButton.style.fontFamily = "'Courier New', monospace";
    confirmButton.style.textShadow = '0 0 5px rgba(231, 76, 60, 0.5)';
    confirmButton.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.2)';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.transition = 'all 0.3s ease';
    confirmButton.style.fontSize = '16px';
    confirmButton.style.textTransform = 'uppercase';
    confirmButton.style.letterSpacing = '1px';
    confirmButton.style.position = 'relative';
    confirmButton.style.overflow = 'hidden';
    confirmButton.innerHTML = '<i class="fas fa-check" style="margin-right: 8px;"></i> Bekreft';
    confirmButton.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 15px rgba(231, 76, 60, 0.4)';
    });
    confirmButton.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 10px rgba(231, 76, 60, 0.2)';
    });
    confirmButton.addEventListener('click', function() {
        closeConfirmDialog();
        if (onConfirm) onConfirm();
    });
    buttonContainer.appendChild(confirmButton);
    
    // Opprett avbryt-knapp
    const cancelButton = document.createElement('button');
    cancelButton.style.background = 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9))';
    cancelButton.style.border = '2px solid #7f8c8d';
    cancelButton.style.color = '#7f8c8d';
    cancelButton.style.padding = '12px 25px';
    cancelButton.style.borderRadius = '8px';
    cancelButton.style.fontFamily = "'Courier New', monospace";
    cancelButton.style.textShadow = '0 0 5px rgba(127, 140, 141, 0.5)';
    cancelButton.style.boxShadow = '0 0 10px rgba(127, 140, 141, 0.2)';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.transition = 'all 0.3s ease';
    cancelButton.style.fontSize = '16px';
    cancelButton.style.textTransform = 'uppercase';
    cancelButton.style.letterSpacing = '1px';
    cancelButton.innerHTML = '<i class="fas fa-times" style="margin-right: 8px;"></i> Avbryt';
    cancelButton.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 15px rgba(127, 140, 141, 0.4)';
    });
    cancelButton.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 0 10px rgba(127, 140, 141, 0.2)';
    });
    cancelButton.addEventListener('click', function() {
        closeConfirmDialog();
        if (onCancel) onCancel();
    });
    buttonContainer.appendChild(cancelButton);
    
    // Funksjon for å lukke bekreftelsesdialogen
    function closeConfirmDialog() {
        const container = document.getElementById('stylized-confirm-dialog');
        if (container) {
            // Animer ut
            const dialog = container.querySelector('div:nth-child(2)');
            const backdrop = container.querySelector('div:first-child');
            
            if (dialog) {
                dialog.style.animation = 'scaleIn 0.3s reverse forwards';
            }
            
            if (backdrop) {
                backdrop.style.animation = 'fadeIn 0.3s reverse forwards';
            }
            
            // Fjern etter animasjon
            setTimeout(() => {
                container.remove();
            }, 300);
        }
    }
    
    // Legg til CSS for animasjoner hvis det ikke allerede finnes
    if (!document.getElementById('confirm-dialog-styles')) {
        const style = document.createElement('style');
        style.id = 'confirm-dialog-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes glowingBorder {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
    }
} 