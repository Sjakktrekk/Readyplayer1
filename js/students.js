// Initialize students data
let students = JSON.parse(localStorage.getItem('students')) || [{
    name: "Ny student",
    Intelligens: 0,
    Teknologi: 0,
    Stamina: 0,
    Karisma: 0,
    Kreativitet: 0,
    Flaks: 0,
    exp: 10000,
    credits: 100,
    achievements: []
}];

// Funksjon for å endre skill-verdi
function changeSkill(index, skill, amount) {
    // First check if we can make the change
    if (amount > 0) {
        if (students[index].exp < 1000) {
            console.log('Not enough EXP');
            return;
        }
        if (students[index][skill] >= MAX_SKILL_LEVEL) {
            console.log('Already at max level');
            return;
        }
    } else if (students[index][skill] <= 0) {
        console.log('Already at min level');
        return;
    }
    
    const oldValue = students[index][skill];
    const oldLevel = calculateLevel(students[index]);
    
    // Update skill value within bounds
    const newValue = Math.min(Math.max(0, oldValue + amount), MAX_SKILL_LEVEL);
    
    // Only proceed if the value actually changed
    if (newValue !== oldValue) {
        // Update the skill first
        students[index][skill] = newValue;
        
        // Then handle EXP changes
        if (amount > 0) {
            students[index].exp -= 1000;
        } else {
            students[index].exp += 1000;
        }
        
        // Update the display
        updateTable();
        
        // Show animations and effects after the update
        if (amount > 0) {
            const cell = document.querySelector(`tr:nth-child(${index + 1}) td[data-skill="${skill}"]`);
            if (cell) {
                showLevelUpAnimation(cell, skill);
                playLevelUpSound();
            }
            // Check for new achievements
            checkAchievements(students[index], index, cell);
        } else {
            // Check if any achievements should be removed
            checkAchievementRequirements(students[index], skill);
        }
        
        // Show level up animation if total level increased
        const newLevel = calculateLevel(students[index]);
        if (newLevel > oldLevel) {
            const levelDisplay = document.querySelector(`tr:nth-child(${index + 1}) .level-display`);
            if (levelDisplay) {
                levelDisplay.classList.add('glow');
                setTimeout(() => levelDisplay.classList.remove('glow'), 1000);
            }
        }
        
        saveData();
    }
}

// Funksjon for å sjekke achievement-krav
function checkAchievementRequirements(student, skill) {
    const skillValue = student[skill];
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

// Funksjon for å sjekke achievements
function checkAchievements(student, index, cell) {
    const skill = cell.closest('td').getAttribute('data-skill');
    if (!skill) return;

    achievements
        .filter(a => a.skill === skill)
        .forEach(achievement => {
            const hasAchievement = student.achievements?.includes(achievement.name);
            const meetsRequirement = achievement.check(student);
            
            if (!hasAchievement && meetsRequirement) {
                // Add achievement to student
                if (!student.achievements) {
                    student.achievements = [];
                }
                student.achievements.push(achievement.name);
                
                // Show popup and play sound
                showAchievementPopup(achievement);
                playAchievementSound();
                
                // Save data
                saveData();
            }
        });
}

// Merk: showLevelUpAnimation-funksjonen er definert i main.js og brukes i changeSkill-funksjonen

// Funksjon for å legge til forhåndsdefinerte studenter
function addPredefinedStudents() {
    // Liste over studenter som skal legges til
    const studentsToAdd = [
        { name: "Alina", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Niels", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Kira", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Tine", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Emilia", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Patrick", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Tilia", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Tais", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Chris", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Hannah Mae", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Ingrid", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Runa", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Michael", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Isak", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Abdi", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Isak L", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Live", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Daniel", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Loke", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Louise", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Thelma", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Sigmund", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Elliot", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Dominik", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Celina", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Johanne", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Hedvig", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 },
        { name: "Elina", Intelligens: 0, Teknologi: 0, Stamina: 0, Karisma: 0, Kreativitet: 0, Flaks: 0, exp: 0, credits: 50 }
    ];
    
    // Legg til hver student i students-arrayen
    studentsToAdd.forEach(studentData => {
        // Sjekk om studenten allerede eksisterer (basert på navn)
        const exists = students.some(s => s.name === studentData.name);
        if (!exists) {
            students.push(studentData);
        }
    });
    
    // Lagre data og oppdater tabellen
    saveData();
    updateTable();
    
    alert(`${studentsToAdd.length} studenter lagt til!`);
}

// Funksjon for å åpne achievements-modal
function openAchievementsModal(studentIndex) {
    let modal = document.getElementById('achievementsModal');
    if (modal) {
        modal.remove();
    }

    const student = students[studentIndex];
    const skills = ['Intelligens', 'Teknologi', 'Stamina', 'Karisma', 'Kreativitet', 'Flaks'];
    
    const modalHtml = `
        <div id="achievementsModal" class="modal" data-student-index="${studentIndex}">
            <div style="position: relative; margin-bottom: 20px; text-align: center;">
                <h2 id="achievementsTitle" style="margin: 0; display: inline-block;">
                    <span style="color: #ffffff; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);">Achievements - </span><span style="color: #e74c3c; text-shadow: 0 0 5px rgba(231, 76, 60, 0.5);">${student.name}</span>
                </h2>
                <button class="item-bag-button" style="position: absolute; right: 100px; top: -25px; transform: translateY(0); 
                    background: linear-gradient(180deg, rgba(0, 20, 0, 0.8), rgba(0, 40, 0, 0.9)); 
                    border: 2px solid #2ecc71; 
                    color: #2ecc71; 
                    padding: 8px 15px; 
                    border-radius: 8px; 
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 0 5px rgba(46, 204, 113, 0.5);
                    box-shadow: 0 0 10px rgba(46, 204, 113, 0.2);
                    cursor: pointer;
                    transition: all 0.3s ease;" 
                    onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 15px rgba(46, 204, 113, 0.4)';"
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 10px rgba(46, 204, 113, 0.2)';"
                    onclick="openItemBagModal(${studentIndex})">
                    <img src="backpack.png" alt="Backpack" style="width: 48px; height: 48px; margin-right: 8px; filter: drop-shadow(0 0 5px rgba(46, 204, 113, 0.6));">
                    Åpne ryggsekk
                </button>
            </div>
            <button class="close-button" onclick="closeAchievementModal()">X</button>
            
            <div class="skills-row">
                ${skills.map(skill => {
                    const level = student[skill];
                    const maxLevel = 30;
                    const progress = (level / maxLevel) * 100;
                    return `
                        <div class="skill-tab" data-skill="${skill}" onclick="showSkillAchievements('${skill}')">
                            <h3>${skill}</h3>
                            <div class="level">Nivå ${level}</div>
                            <div class="progress-bar" style="width: 100%;">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            ${skills.map(skill => `
                <div class="achievements-section" data-skill="${skill}">
                    <div class="achievements-container">
                        ${achievements
                            .filter(a => a.skill === skill)
                            .map(achievement => {
                                const isUnlocked = achievement.check(student);
                                return `
                                    <div class="achievement ${isUnlocked ? 'unlocked' : 'locked'}" data-skill="${skill}">
                                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                                            <div class="achievement-icon">
                                                <img src="${achievement.name.toLowerCase().includes('newbie') ? 'newbie.jpeg' :
                                                          achievement.name.toLowerCase().includes('explorer') ? 'explorer.jpeg' :
                                                          achievement.name.toLowerCase().includes('master') ? 'master.jpeg' :
                                                          achievement.name.toLowerCase().includes('legend') ? 'legend.jpeg' :
                                                          achievement.name.toLowerCase().includes('champion') ? 'champion.jpeg' :
                                                          'newbie.jpeg'}" 
                                                     alt="Achievement rank">
                                            </div>
                                            <div class="achievement-info">
                                                <h4 style="color: ${skill === 'Intelligens' ? '#00bfff' : 
                                                              skill === 'Teknologi' ? '#2ecc71' : 
                                                              skill === 'Stamina' ? '#ff4040' : 
                                                              skill === 'Karisma' ? '#ffd700' : 
                                                              skill === 'Kreativitet' ? '#ff1493' : 
                                                              skill === 'Flaks' ? '#00ffff' : '#ffffff'}">${achievement.name}</h4>
                                                <p>${achievement.description}</p>
                                            </div>
                                        </div>
                                        <div class="achievement-reward" style="color: ${skill === 'Intelligens' ? '#00bfff' : 
                                                                          skill === 'Teknologi' ? '#2ecc71' : 
                                                                          skill === 'Stamina' ? '#ff4040' : 
                                                                          skill === 'Karisma' ? '#ffd700' : 
                                                                          skill === 'Kreativitet' ? '#ff1493' : 
                                                                          skill === 'Flaks' ? '#00ffff' : '#ffffff'};
                                 text-shadow: 0 0 10px currentColor;">${isUnlocked ? (achievement.reward || 'Ingen belønning spesifisert') : '                   '}</div>
                                    </div>
                                `;
                            }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('achievementsModal').style.display = 'block';
    
    // Vis achievements for første skill som standard
    showSkillAchievements(skills[0]);
}

// Funksjon for å vise achievements for en bestemt ferdighet
function showSkillAchievements(skill) {
    // Fjern active class fra alle skill tabs og sections
    document.querySelectorAll('.skill-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.achievements-section').forEach(section => section.classList.remove('active'));
    
    // Legg til active class på valgt skill tab og section
    document.querySelector(`.skill-tab[data-skill="${skill}"]`).classList.add('active');
    document.querySelector(`.achievements-section[data-skill="${skill}"]`).classList.add('active');
} 