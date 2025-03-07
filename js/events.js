console.log('events.js lastet');

const events = [
    {
        title: "Klumsete programmerer",
        description: "En av Oasis programmerere har sølt en kopp kaffe i tastaturet. Tastaturet knitrer og gnister og programmereren tørker panisk av tastaturet. Mens han tørker kaffe trykker han inn helt tilfeldige bokstavkombinasjoner, og i forbindelse med det opprettet han en portal i Oasis ved et uhell.\n\nDenne portalen suger deg ut av rommet med challenges og inn på klasserommet til 6a. Du må skrive en detaljert forklaring på hvordan du kommer deg fra klasserommet og tilbake til hovedrommet til 7.trinn før du kan fortsette. Ingen XP før du har levert oppskriften.",
        image: "programmerer.jpg",
        choices: [
            { text: "Gå gjennom portalen", effect: () => addRandomExp(50) },
            { text: "Ignorer den", effect: () => addRandomExp(10) }
        ]
    },
    {
        title: "Server overload",
        description: "Oasis har nå vært operativt lenge, og har fått flere og flere brukere. Mange av brukerne viser seg å jobbe veldig hardt for å øke nivået på avatarene sine. Faktisk har brukerne jobbet så hardt at VR-utstyret har fanget opp negative hjernebølger. Dette har ført til at Oasis nå går veldig sakte og lagger voldsomt.\n\nSå lenge Oasis lagger får du kun halv XP på alle oppgaver. For å heve stemningen i Oasis må du levere en vits til Odd Henry eller Morten som legger det inn i kildekoden. Etter den første vitsen får du tilbake full XP for oppgaver. I tillegg får du 100 XP pr vits du leverer frem til kl. 10.00",
        image: "serveroverload.jpg",
        choices: [
            { text: "Debug problemet", effect: () => addRandomExp(30) },
            { text: "Start på nytt", effect: () => addRandomExp(15) }
        ]
    },
    {
        title: "Strømregningen",
        description: "Fullstendig krise! Operatørene av Oasis har glemt å betale strømregningene sine og strømleverandøren stenger av strømmen til flere av serverne til Oasis. Dette gjør at alle oppgavene inne i Oasis sakte, men sikkert blir mer og mer gjennomsiktige før de forsvinner helt. Operatørene skylder på hverandre og anklager hverandre for å ha glemt å betale regningen.\n\nFrem til operatørene får betalt regningen og strømmen blir slått på igjen er det kun mulig å få halv XP gjennom å lese i selvvalgt bok, da lysforholdene svekker lesehastigheten din. Strømmen blir borte resten av dagen.",
        image: "strømregning.jpg",
        choices: [
            { text: "Hjelp med prosjektet", effect: () => addRandomExp(40) },
            { text: "Fokuser på eget arbeid", effect: () => addRandomExp(20) }
        ]
    },
    {
        title: "Tapt verden",
        description: "Oasis har mange verdener, men en av dem er forsvunnet! For å gjenopprette denne verdenen må hjelpe programmererne med å skrive en beskrivelse av denne verdenen. Arkivmesteren har heldigvis klart å finne et gammelt bilde i arkivet av hvordan deler av verdenen så ut, men du må gjenskape beskrivelsen ved hjelp av en skriftlig tekst.\n\nDu må være detaljert og nøyaktig, slik at verdenen kan bygges opp slik den var. Når beskrivelsen er levert, får du 2000 XP og en tilfeldig item i gave av Departementet for uforutsette hendelser.",
        image: "taptverden.jpg",
        choices: [
            { text: "Delta aktivt", effect: () => addRandomExp(60) },
            { text: "Observere", effect: () => addRandomExp(25) }
        ]
    },
    {
        title: "Lesehack!",
        description: "En gammel skjult fil har blitt oppdaget i koden til Oasis. En av James Hallidays hemmelige lesehacks! Denne koden øker kraften til alle som dykker ned i bøkenes verden. I dag er en sjelden dag hvor denne koden aktiveres!\n\nDet betyr at all XP du tjener gjennom lesing blir doblet hele økten. For å aktivere lesehacket må du finne en bok, lese i minst 10 minutter og skrive en kort oppsummering eller refleksjon om det du har lest. Når dette er levert, får du umiddelbart dobbel XP for lesing i selvvalgt bok resten av økten!",
        image: "lesehack.jpg",
        choices: [
            { text: "Plugge inn USB-en", effect: () => addRandomExp(45) },
            { text: "Ikke ta sjansen", effect: () => addRandomExp(15) }
        ]
    }
];

// Global variabel for gjeldende hendelse
let currentEvent = null;

// Gjør funksjonene tilgjengelige globalt
window.triggerRandomEvent = function() {
    console.log('triggerRandomEvent kalt');
    try {
        // Hvis det ikke finnes en gjeldende hendelse, generer en ny
        if (!currentEvent) {
            currentEvent = events[Math.floor(Math.random() * events.length)];
            console.log('Ny hendelse generert:', currentEvent.title);
        }
        showEventModal(currentEvent);
    } catch (error) {
        console.error('Feil ved trigging av hendelse:', error);
        alert('Det oppstod en feil ved trigging av hendelsen. Vennligst prøv igjen.');
    }
};

// Funksjon for å generere ny hendelse
window.generateNewEvent = function() {
    currentEvent = events[Math.floor(Math.random() * events.length)];
    console.log('Ny hendelse generert:', currentEvent.title);
    showEventModal(currentEvent);
};

window.showEventModal = function(event) {
    console.log('showEventModal kalt med event:', event.title);
    try {
        // Fjern eksisterende modaler hvis det finnes noen
        const existingModals = document.querySelectorAll('.event-modal');
        existingModals.forEach(modal => modal.remove());

        // Opprett modal
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.85);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        `;

        // Opprett innhold
        const content = document.createElement('div');
        content.style.cssText = `
            background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(0, 0, 20, 0.98));
            border: 2px solid #00ffff;
            color: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 800px;
            width: 90%;
            position: relative;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3),
                       0 0 15px rgba(0, 255, 255, 0.2) inset;
            animation: modalAppear 0.5s ease-out;
            overflow: hidden;
        `;

        // Legg til holografisk effekt overlay
        const hologramOverlay = document.createElement('div');
        hologramOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                repeating-linear-gradient(90deg, rgba(0, 255, 255, 0.03) 0px, rgba(0, 255, 255, 0.03) 1px, transparent 1px, transparent 10px),
                repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.03) 0px, rgba(0, 255, 255, 0.03) 1px, transparent 1px, transparent 10px);
            pointer-events: none;
            z-index: 1;
        `;
        content.appendChild(hologramOverlay);

        // Legg til glødende kant effekt
        const glowingBorder = document.createElement('div');
        glowingBorder.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 17px;
            background: linear-gradient(45deg, #00ffff, transparent, #ff00ff, transparent, #00ffff);
            background-size: 400% 400%;
            z-index: -1;
            animation: glowingBorder 8s linear infinite;
            opacity: 0.6;
        `;
        content.appendChild(glowingBorder);

        // Legg til innhold
        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = `
            position: relative;
            z-index: 2;
        `;
        contentWrapper.innerHTML = `
            <h2 style="
                color: #00ffff;
                margin-bottom: 25px;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: 2px;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                font-family: 'Courier New', monospace;
                border-bottom: 2px solid #00ffff;
                padding-bottom: 10px;
            ">${event.title}</h2>
            <div style="
                margin-bottom: 25px;
                position: relative;
                overflow: hidden;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                border: 2px solid #00ffff;
            ">
                <img src="${event.image}" 
                     alt="${event.title}" 
                     style="
                        width: 100%;
                        max-height: 300px;
                        object-fit: cover;
                        display: block;
                        transition: transform 0.3s ease;
                     "
                     onmouseover="this.style.transform='scale(1.05)'"
                     onmouseout="this.style.transform='scale(1)'"
                >
            </div>
            <p style="
                margin-bottom: 20px;
                font-size: 18px;
                line-height: 1.6;
                color: #e0e0e0;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                font-family: 'Courier New', monospace;
            ">${event.description.replace(/\n/g, '<br>')}</p>
            <div style="
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
            ">
                <button onclick="generateNewEvent()" style="
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9));
                    border: 2px solid #00ffff;
                    color: #00ffff;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
                    transition: all 0.3s ease;
                    font-size: 16px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 15px rgba(0, 255, 255, 0.4)';"
                   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 0 10px rgba(0, 255, 255, 0.2)';">
                    <i class="fas fa-dice" style="margin-right: 8px;"></i> Ny hendelse
                </button>
            </div>
        `;
        content.appendChild(contentWrapper);

        // Legg til lukkeknapp
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: 2px solid #00ffff;
            color: #00ffff;
            font-size: 24px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            text-shadow: 0 0 5px #00ffff;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            z-index: 3;
        `;
        closeButton.onmouseover = () => {
            closeButton.style.transform = 'scale(1.1)';
            closeButton.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
        };
        closeButton.onmouseout = () => {
            closeButton.style.transform = 'scale(1)';
            closeButton.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
        };
        closeButton.onclick = () => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        };
        content.appendChild(closeButton);

        // Sett sammen modalen
        modal.appendChild(content);
        document.body.appendChild(modal);
        console.log('Modal lagt til i DOM');
    } catch (error) {
        console.error('Feil ved visning av modal:', error);
        alert('Det oppstod en feil ved visning av hendelsen. Vennligst prøv igjen.');
    }
};

window.addRandomExp = function(amount) {
    console.log('addRandomExp kalt med amount:', amount);
    try {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
        `;
        notification.innerHTML = `Du fikk ${amount} erfaringspoeng!`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        console.log('Notifikasjon lagt til');
    } catch (error) {
        console.error('Feil ved tilordning av erfaringspoeng:', error);
        alert('Det oppstod en feil ved tilordning av erfaringspoeng. Vennligst prøv igjen.');
    }
};

// Oppdater animasjonene
const style = document.createElement('style');
style.textContent = `
    @keyframes modalAppear {
        from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes glowingBorder {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes shineEffect {
        0% { left: -100%; }
        20% { left: 100%; }
        100% { left: 100%; }
    }
`;
document.head.appendChild(style); 