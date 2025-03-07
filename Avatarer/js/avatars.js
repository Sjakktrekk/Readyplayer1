/**
 * Ready Player One - Avatar System
 * Denne filen håndterer funksjonaliteten for avatar-galleriet i OASIS
 */

// Avatardata - kan utvides med flere egenskaper og avatarer
const avatarData = [
    {
        name: "Newbie",
        description: "Startavatar for nye spillere. Perfekt for de som nettopp har begynt sin reise i OASIS.",
        stats: {
            strength: 2,
            speed: 3,
            intelligence: 3
        },
        abilities: ["Grunnleggende bevegelse", "Enkel interaksjon", "Begrenset inventar"],
        image: "../newbie.jpeg"
    },
    {
        name: "Explorer",
        description: "Spesialisert for utforskning og oppdagelse. Perfekt for spillere som elsker å finne skjulte hemmeligheter.",
        stats: {
            strength: 3,
            speed: 5,
            intelligence: 4
        },
        abilities: ["Forbedret syn", "Utvidet utholdenhet", "Skjult objektdeteksjon"],
        image: "../explorer.jpeg"
    },
    {
        name: "Master",
        description: "En balansert avatar med høye verdier i alle egenskaper. Perfekt for erfarne spillere.",
        stats: {
            strength: 5,
            speed: 5,
            intelligence: 5
        },
        abilities: ["Avansert bevegelse", "Utvidet inventar", "Forbedret interaksjon"],
        image: "../master.jpeg"
    },
    {
        name: "Champion",
        description: "Spesialisert for kamp og konkurranser. Perfekt for spillere som elsker PvP-utfordringer.",
        stats: {
            strength: 7,
            speed: 6,
            intelligence: 3
        },
        abilities: ["Forbedret angrep", "Økt forsvar", "Kampbonus"],
        image: "../champion.jpeg"
    },
    {
        name: "Legend",
        description: "En sjelden og kraftfull avatar. Kun tilgjengelig for spillere som har fullført alle hovedoppdrag.",
        stats: {
            strength: 8,
            speed: 8,
            intelligence: 8
        },
        abilities: ["Legendarisk styrke", "Teleportering", "Tidskontroll"],
        image: "../legend.jpeg"
    }
];

// Globale variabler
let students = [];
let selectedStudentIndex = null;
let studentAvatars = JSON.parse(localStorage.getItem('studentAvatars')) || {};

// Funksjon for å legge til testdata hvis ingen elever finnes
function addTestStudentsIfEmpty() {
    if (students.length === 0) {
        console.log('Ingen studenter funnet, legger til testdata...');
        students = [
            { name: "Alina", Intelligens: 5, Teknologi: 3, Stamina: 4, Karisma: 6, Kreativitet: 7, Flaks: 2, exp: 5000 },
            { name: "Niels", Intelligens: 7, Teknologi: 8, Stamina: 3, Karisma: 4, Kreativitet: 5, Flaks: 3, exp: 6000 },
            { name: "Kira", Intelligens: 6, Teknologi: 5, Stamina: 7, Karisma: 8, Kreativitet: 4, Flaks: 5, exp: 7000 },
            { name: "Tine", Intelligens: 4, Teknologi: 6, Stamina: 5, Karisma: 3, Kreativitet: 8, Flaks: 4, exp: 5500 },
            { name: "Emilia", Intelligens: 8, Teknologi: 4, Stamina: 6, Karisma: 7, Kreativitet: 3, Flaks: 6, exp: 8000 }
        ];
        localStorage.setItem('students', JSON.stringify(students));
        console.log('Testdata lagt til og lagret i localStorage');
    }
}

// Funksjon for å beregne nivå basert på ferdigheter
function calculateLevel(student) {
    const totalSkills = student.Intelligens + student.Teknologi + student.Stamina + 
                        student.Karisma + student.Kreativitet + student.Flaks;
    return Math.floor(totalSkills / 3) + 1;
}

// Funksjon for å hente avatartype for en student
function getStudentAvatarType(studentName) {
    return studentAvatars[studentName] || "Newbie";
}

// Funksjon for å sette avatartype for en student
function setStudentAvatarType(studentName, avatarType) {
    studentAvatars[studentName] = avatarType;
    localStorage.setItem('studentAvatars', JSON.stringify(studentAvatars));
}

// Funksjon for å fylle elevlisten
function populateStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    
    if (students.length === 0) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="student-info">
                <div class="student-name">Ingen elever funnet</div>
                <div class="student-level">Legg til elever på hovedsiden</div>
            </div>
        `;
        studentList.appendChild(listItem);
        return;
    }
    
    students.forEach((student, index) => {
        const level = calculateLevel(student);
        const avatarType = getStudentAvatarType(student.name);
        
        const listItem = document.createElement('li');
        listItem.dataset.index = index;
        listItem.innerHTML = `
            <div class="student-avatar-icon">
                <i class="fas fa-user"></i>
            </div>
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-level">Nivå ${level} · ${avatarType}</div>
            </div>
        `;
        
        listItem.addEventListener('click', () => selectStudent(index));
        studentList.appendChild(listItem);
    });
}

// Funksjon for å velge en student
function selectStudent(index) {
    selectedStudentIndex = index;
    
    // Oppdater aktiv klasse i listen
    document.querySelectorAll('#studentList li').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`#studentList li[data-index="${index}"]`).classList.add('active');
    
    // Vis avatardetaljer
    displayStudentAvatar(index);
}

// Funksjon for å vise avatardetaljer for valgt student
function displayStudentAvatar(index) {
    const student = students[index];
    const avatarType = getStudentAvatarType(student.name);
    const level = calculateLevel(student);
    const avatar = avatarData.find(a => a.name === avatarType) || avatarData[0];
    
    // Skjul "ingen valgt" melding og vis detaljer
    document.getElementById('noStudentSelected').style.display = 'none';
    document.getElementById('avatarDetails').style.display = 'flex';
    
    // Oppdater UI med studentinformasjon
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentLevel').textContent = level;
    document.getElementById('avatarImage').src = avatar.image;
    document.getElementById('avatarType').textContent = avatarType;
    
    // Oppdater ferdighetsbarer
    updateSkillBar('intelligens', student.Intelligens);
    updateSkillBar('teknologi', student.Teknologi);
    updateSkillBar('stamina', student.Stamina);
    updateSkillBar('karisma', student.Karisma);
    updateSkillBar('kreativitet', student.Kreativitet);
    updateSkillBar('flaks', student.Flaks);
}

// Funksjon for å oppdatere ferdighetsbarer
function updateSkillBar(skill, value) {
    const maxSkill = 10; // Maksimal ferdighetsverdi
    const percentage = (value / maxSkill) * 100;
    
    document.getElementById(`${skill}Bar`).style.width = `${percentage}%`;
    document.getElementById(`${skill}Value`).textContent = value;
}

// Funksjon for å åpne avatar-valgmodal
function openAvatarSelectionModal() {
    if (selectedStudentIndex === null) return;
    
    const student = students[selectedStudentIndex];
    const modal = document.getElementById('avatarSelectionModal');
    
    document.getElementById('modalStudentName').textContent = student.name;
    
    // Marker den nåværende valgte avataren
    const currentAvatarType = getStudentAvatarType(student.name);
    document.querySelectorAll('.avatar-card').forEach(card => {
        const avatarType = card.dataset.avatar;
        const selectBtn = card.querySelector('.select-avatar-btn');
        
        if (avatarType === currentAvatarType) {
            card.style.borderColor = '#00ffff';
            card.style.boxShadow = '0 0 25px rgba(0, 255, 255, 0.5)';
            selectBtn.textContent = 'Valgt Avatar';
            selectBtn.style.background = 'linear-gradient(180deg, rgba(0, 255, 255, 0.3), rgba(0, 200, 255, 0.5))';
            selectBtn.style.borderColor = '#00ffff';
            selectBtn.style.color = '#00ffff';
        } else {
            card.style.borderColor = 'lime';
            card.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.2)';
            selectBtn.textContent = 'Velg Avatar';
            selectBtn.style.background = 'linear-gradient(180deg, rgba(0, 255, 0, 0.3), rgba(0, 200, 0, 0.5))';
            selectBtn.style.borderColor = '#00ff00';
            selectBtn.style.color = '#00ff00';
        }
    });
    
    modal.style.display = 'flex';
}

// Funksjon for å lukke avatar-valgmodal
function closeAvatarSelectionModal() {
    document.getElementById('avatarSelectionModal').style.display = 'none';
}

// Funksjon for å velge avatar for en student
function selectAvatarForStudent(avatarType) {
    if (selectedStudentIndex === null) return;
    
    const student = students[selectedStudentIndex];
    setStudentAvatarType(student.name, avatarType);
    
    // Oppdater UI
    displayStudentAvatar(selectedStudentIndex);
    populateStudentList();
    
    // Lukk modal
    closeAvatarSelectionModal();
    
    // Vis bekreftelsesmelding
    showConfirmationMessage(`${student.name} har fått ${avatarType} som sin avatar!`);
}

// Funksjon for å vise bekreftelsesmelding
function showConfirmationMessage(message) {
    const confirmationMessage = document.createElement('div');
    confirmationMessage.style.position = 'fixed';
    confirmationMessage.style.top = '20px';
    confirmationMessage.style.left = '50%';
    confirmationMessage.style.transform = 'translateX(-50%)';
    confirmationMessage.style.background = 'rgba(0, 0, 0, 0.8)';
    confirmationMessage.style.color = '#00ff00';
    confirmationMessage.style.padding = '15px 30px';
    confirmationMessage.style.borderRadius = '10px';
    confirmationMessage.style.border = '2px solid #00ff00';
    confirmationMessage.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
    confirmationMessage.style.zIndex = '9999';
    confirmationMessage.style.fontWeight = 'bold';
    confirmationMessage.style.fontSize = '18px';
    confirmationMessage.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i> ${message}`;
    
    document.body.appendChild(confirmationMessage);
    
    // Spill av lyd
    document.getElementById('achievementSound').play();
    
    // Fjern meldingen etter 3 sekunder
    setTimeout(() => {
        confirmationMessage.style.opacity = '0';
        confirmationMessage.style.transition = 'opacity 0.5s ease';
        setTimeout(() => confirmationMessage.remove(), 500);
    }, 3000);
}

// Funksjon for å vise OASIS-velkomstmodal
function showOasisModal() {
    const modal = document.getElementById('oasisWelcomeModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.querySelector('.modal-content').style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// Funksjon for å lukke OASIS-velkomstmodal
function closeOasisModal() {
    const modal = document.getElementById('oasisWelcomeModal');
    const content = modal.querySelector('.modal-content');
    content.style.opacity = '0';
    content.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Funksjon for å filtrere elevlisten
function filterStudentList() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const listItems = document.querySelectorAll('#studentList li');
    
    listItems.forEach(item => {
        const studentName = item.querySelector('.student-name').textContent.toLowerCase();
        if (studentName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Funksjon for å åpne prestasjonsmodal
function openAchievementsModal() {
    if (selectedStudentIndex === null) return;
    
    const student = students[selectedStudentIndex];
    // Her kan du legge til kode for å vise prestasjoner for valgt student
    // Dette kan kobles til eksisterende prestasjonslogikk i prosjektet
}

// Funksjon for å opprette forhåndsdefinerte studenter
function createPredefinedStudents() {
    return [
        { name: "Alina", Intelligens: 5, Teknologi: 3, Stamina: 4, Karisma: 6, Kreativitet: 7, Flaks: 2, exp: 5000 },
        { name: "Niels", Intelligens: 7, Teknologi: 8, Stamina: 3, Karisma: 4, Kreativitet: 5, Flaks: 3, exp: 6000 },
        { name: "Kira", Intelligens: 6, Teknologi: 5, Stamina: 7, Karisma: 8, Kreativitet: 4, Flaks: 5, exp: 7000 },
        { name: "Tine", Intelligens: 4, Teknologi: 6, Stamina: 5, Karisma: 3, Kreativitet: 8, Flaks: 4, exp: 5500 },
        { name: "Emilia", Intelligens: 8, Teknologi: 4, Stamina: 6, Karisma: 7, Kreativitet: 3, Flaks: 6, exp: 8000 },
        { name: "Patrick", Intelligens: 6, Teknologi: 7, Stamina: 5, Karisma: 4, Kreativitet: 6, Flaks: 3, exp: 6500 },
        { name: "Tilia", Intelligens: 5, Teknologi: 4, Stamina: 6, Karisma: 7, Kreativitet: 5, Flaks: 4, exp: 5800 },
        { name: "Tais", Intelligens: 7, Teknologi: 6, Stamina: 4, Karisma: 5, Kreativitet: 7, Flaks: 2, exp: 6200 }
    ];
}

// Initialiser siden
document.addEventListener('DOMContentLoaded', function() {
    console.log('Avatar-siden lastes...');
    
    try {
        // Forsøk å hente studentdata fra localStorage
        const storedStudents = localStorage.getItem('students');
        console.log('Studentdata fra localStorage:', storedStudents);
        
        if (storedStudents) {
            students = JSON.parse(storedStudents);
            console.log('Antall studenter lastet:', students.length);
        } else {
            console.log('Ingen studentdata funnet i localStorage');
        }
        
        // Hvis det fortsatt ikke er noen studenter, legg til testdata
        if (!students || students.length === 0) {
            console.log('Legger til forhåndsdefinerte studenter...');
            students = createPredefinedStudents();
            localStorage.setItem('students', JSON.stringify(students));
            console.log('Forhåndsdefinerte studenter lagt til:', students.length);
        }
        
        // Fyll elevlisten
        populateStudentList();
        
        // Legg til hendelseslyttere
        document.getElementById('studentSearch').addEventListener('input', filterStudentList);
        document.getElementById('changeAvatarBtn').addEventListener('click', openAvatarSelectionModal);
        document.getElementById('viewAchievementsBtn').addEventListener('click', openAchievementsModal);
        
        // Legg til hendelseslyttere for avatar-kort i modal
        document.querySelectorAll('.avatar-card').forEach(card => {
            const avatarType = card.dataset.avatar;
            const selectBtn = card.querySelector('.select-avatar-btn');
            
            selectBtn.addEventListener('click', function() {
                selectAvatarForStudent(avatarType);
            });
        });
        
        console.log('Avatar-siden er ferdig lastet');
    } catch (error) {
        console.error('Feil ved initialisering av avatar-siden:', error);
        
        // Nødløsning: Legg til testdata uansett hvis det oppstår en feil
        console.log('Legger til testdata på grunn av feil...');
        students = createPredefinedStudents();
        localStorage.setItem('students', JSON.stringify(students));
        
        // Prøv å fylle elevlisten igjen
        populateStudentList();
    }
}); 