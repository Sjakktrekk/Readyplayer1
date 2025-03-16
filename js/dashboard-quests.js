// Globale variabler for oppdrag-fanen
let npcsContainer;
let questFilters;
let activeQuestsContainer;
let availableQuestsContainer;

// Funksjon for å initialisere oppdrag-fanen
function initQuestsTab() {
    // Hent DOM-elementer
    npcsContainer = document.getElementById('npcs-container');
    questFilters = document.querySelectorAll('.filter-button');
    
    // Legg til event listeners for filtre
    questFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.getAttribute('data-filter');
            
            // Fjern active-klassen fra alle filtre
            questFilters.forEach(f => f.classList.remove('active'));
            
            // Legg til active-klassen på det valgte filteret
            filter.classList.add('active');
            
            // Filtrer oppdrag basert på filter
            filterQuests(filterType);
        });
    });
}

// Funksjon for å laste inn oppdrag
function loadQuests() {
    // Vent til dashboardBase er tilgjengelig
    if (!window.dashboardBase || !window.dashboardBase.supabase) {
        console.log('Venter på at dashboardBase skal bli tilgjengelig...');
        setTimeout(loadQuests, 100); // Prøv igjen om 100ms
        return;
    }
    
    const { supabase, showNotification } = window.dashboardBase;
    
    // Hent alle NPCer og oppdrag fra databasen
    Promise.all([
        window.databaseService.npc.getAllNpcs(),
        window.databaseService.quest.getAllQuests(),
        getUserQuestStatus()
    ]).then(([npcsResult, questsResult, questStatus]) => {
        const npcs = npcsResult.success ? npcsResult.data : [];
        const quests = questsResult.success ? questsResult.data : [];
        
        if (!npcsResult.success) {
            console.error('Feil ved henting av NPCer:', npcsResult.error);
            showNotification('Feil ved henting av NPCer. Prøv igjen senere.', 'error');
            return;
        }
        
        if (!questsResult.success) {
            console.error('Feil ved henting av oppdrag:', questsResult.error);
            showNotification('Feil ved henting av oppdrag. Prøv igjen senere.', 'error');
            return;
        }
        
        // Vis NPCer og oppdrag
        if (npcsContainer) {
            npcsContainer.innerHTML = ''; // Tøm container
            
            // Hent aktivt filter
            const activeFilter = document.querySelector('.filter-button.active');
            const filterType = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            
            // Vis NPCer og oppdrag
            displayNPCs(npcs, quests, questStatus, npcsContainer, filterType);
            
            // Sett opp filtre
            setupQuestFilters(npcs, quests, questStatus);
        }
        
        // Abonner på oppdateringer
        subscribeToQuestUpdates();
        
        // Sjekk prestasjoner
        checkQuestAchievements(questStatus);
    }).catch(error => {
        console.error('Feil ved lasting av oppdrag:', error);
        if (window.dashboardBase && window.dashboardBase.showNotification) {
            window.dashboardBase.showNotification('Feil ved lasting av oppdrag. Prøv igjen senere.', 'error');
        }
    });
}

// Funksjon for å sette opp filtre for oppdrag
function setupQuestFilters(npcs, quests, questStatus) {
    // Legg til event listeners for filtre
    questFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterType = filter.getAttribute('data-filter');
            
            // Fjern active-klassen fra alle filtre
            questFilters.forEach(f => f.classList.remove('active'));
            
            // Legg til active-klassen på det valgte filteret
            filter.classList.add('active');
            
            // Filtrer NPCer og oppdrag basert på filter
            displayNPCs(npcs, quests, questStatus, npcsContainer, filterType);
        });
    });
}

// Funksjon for å filtrere oppdrag
function filterQuests(filterType) {
    if (!window.quests) return;
    
    const npcsContainer = document.getElementById('npcs-container');
    if (!npcsContainer) return;
    
    // Hent alle NPCer og oppdrag på nytt
    Promise.all([
        window.dashboardBase.supabase.from('npcs').select('*'),
        window.dashboardBase.supabase.from('quests').select('*'),
        getUserQuestStatus()
    ]).then(([npcsResult, questsResult, questStatus]) => {
        const { data: npcs, error: npcsError } = npcsResult;
        const { data: quests, error: questsError } = questsResult;
        
        if (npcsError || questsError || !npcs || !quests) return;
        
        // Vis NPCer og oppdrag med filter
        displayNPCs(npcs, quests, questStatus, npcsContainer, filterType);
    });
}

// Funksjon for å vise NPCer og oppdrag
function displayNPCs(npcs, quests, questStatus, container, filter = 'all') {
    if (!npcs || !quests || !container) return;
    
    container.innerHTML = '';
    
    // Filtrer NPCer basert på filter
    let filteredNPCs = npcs;
    
    // Hvis filteret er 'active' eller 'completed', vis bare NPCer med aktive eller fullførte oppdrag
    if (filter === 'active' || filter === 'completed' || filter === 'available') {
        filteredNPCs = npcs.filter(npc => {
            const npcQuests = quests.filter(quest => quest.npc_id === npc.id);
            
            return npcQuests.some(quest => {
                const status = getQuestStatus(quest, questStatus);
                
                if (filter === 'active') return status === 'active';
                if (filter === 'completed') return status === 'completed';
                if (filter === 'available') return status === 'available';
                
                return true;
            });
        });
    }
    
    if (filteredNPCs.length === 0) {
        container.innerHTML = '<div class="empty-quests"><i class="fas fa-scroll"></i><p>Ingen NPCer med oppdrag funnet.</p></div>';
        return;
    }
    
    // Vis NPCer
    filteredNPCs.forEach(npc => {
        const npcQuests = quests.filter(quest => quest.npc_id === npc.id);
        
        // Filtrer oppdrag basert på filter
        let filteredQuests = npcQuests;
        
        if (filter === 'active') {
            filteredQuests = npcQuests.filter(quest => getQuestStatus(quest, questStatus) === 'active');
        } else if (filter === 'completed') {
            filteredQuests = npcQuests.filter(quest => getQuestStatus(quest, questStatus) === 'completed');
        } else if (filter === 'available') {
            filteredQuests = npcQuests.filter(quest => getQuestStatus(quest, questStatus) === 'available');
        }
        
        // Vis bare NPCer med oppdrag etter filtrering
        if (filteredQuests.length > 0) {
            const npcElement = createNPCElement(npc, filteredQuests, questStatus);
            container.appendChild(npcElement);
        }
    });
}

// Funksjon for å opprette et NPC-element
function createNPCElement(npc, quests, questStatus) {
    const npcCard = document.createElement('div');
    npcCard.className = 'npc-card';
    npcCard.setAttribute('data-npc-id', npc.id);
    
    npcCard.innerHTML = `
        <div class="npc-header">
            <div class="npc-icon">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="npc-info">
                <div class="npc-name">${npc.name}</div>
                <div class="npc-description">${npc.description}</div>
            </div>
        </div>
        <div class="npc-quests"></div>
    `;
    
    // Legg til oppdrag
    const questsContainer = npcCard.querySelector('.npc-quests');
    
    quests.forEach(quest => {
        const questElement = createQuestElement(quest, npc, questStatus);
        questsContainer.appendChild(questElement);
    });
    
    return npcCard;
}

// Funksjon for å opprette et oppdrag-element
function createQuestElement(quest, npc, questStatus) {
    const questItem = document.createElement('div');
    questItem.className = 'quest-item';
    questItem.setAttribute('data-quest-id', quest.id);
    
    const status = getQuestStatus(quest, questStatus);
    
    // Bestem ikonet basert på oppdragstypen
    let iconClass = 'fas fa-scroll';
    switch (quest.type) {
        case 'main':
            iconClass = 'fas fa-star';
            break;
        case 'side':
            iconClass = 'fas fa-map-signs';
            break;
        case 'daily':
            iconClass = 'fas fa-calendar-day';
            break;
        case 'challenge':
            iconClass = 'fas fa-trophy';
            break;
    }
    
    // Opprett HTML for belønninger
    let rewardsHTML = '';
    
    if (quest.rewards) {
        rewardsHTML = '<div class="quest-rewards">';
        
        if (quest.rewards.exp) {
            rewardsHTML += `<div class="reward-item reward-xp"><i class="fas fa-bolt"></i> ${quest.rewards.exp} EXP</div>`;
        }
        
        if (quest.rewards.credits) {
            rewardsHTML += `<div class="reward-item reward-credits"><i class="fas fa-coins"></i> ${quest.rewards.credits} Kreditter</div>`;
        }
        
        if (quest.rewards.items && quest.rewards.items.length > 0) {
            rewardsHTML += `<div class="reward-item reward-item-bonus"><i class="fas fa-cube"></i> ${quest.rewards.items.length} Gjenstand(er)</div>`;
        }
        
        rewardsHTML += '</div>';
    }
    
    // Opprett HTML for fremgang
    let progressHTML = '';
    
    if (status === 'active' && quest.progress_type) {
        const progress = questStatus.find(q => q.id === quest.id)?.progress || 0;
        const target = quest.progress_target || 1;
        const percentage = Math.min(100, Math.floor((progress / target) * 100));
        
        progressHTML = `
            <div class="quest-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-text">${progress}/${target} (${percentage}%)</div>
            </div>
        `;
    }
    
    // Opprett HTML for handlingsknapper
    let actionHTML = '';
    
    if (status === 'available') {
        actionHTML = `<button class="quest-action start-quest">Start Oppdrag</button>`;
    } else if (status === 'active' && quest.progress_type === 'manual') {
        actionHTML = `<button class="quest-action complete-quest">Fullfør Oppdrag</button>`;
    } else if (status === 'completed') {
        actionHTML = `<div class="quest-action completed">Fullført</div>`;
    }
    
    questItem.innerHTML = `
        <div class="quest-title">
            <i class="${iconClass}"></i>
            ${quest.title}
        </div>
        <div class="quest-status ${status}">${getStatusText(status)}</div>
        <div class="quest-description">${quest.description}</div>
        ${progressHTML}
        ${rewardsHTML}
        <div class="quest-actions">
            ${actionHTML}
        </div>
    `;
    
    // Legg til event listeners for handlingsknapper
    const startButton = questItem.querySelector('.start-quest');
    if (startButton) {
        startButton.addEventListener('click', () => {
            startQuest(npc.id, quest.id);
        });
    }
    
    const completeButton = questItem.querySelector('.complete-quest');
    if (completeButton) {
        completeButton.addEventListener('click', () => {
            completeQuest(npc.id, quest.id);
        });
    }
    
    // Legg til event listener for å vise detaljer
    questItem.addEventListener('click', (event) => {
        // Ikke vis detaljer hvis brukeren klikket på en knapp
        if (event.target.classList.contains('quest-action') || 
            event.target.classList.contains('start-quest') || 
            event.target.classList.contains('complete-quest')) {
            event.stopPropagation();
            return;
        }
        
        showQuestDetails(npc, quest, status, questStatus);
    });
    
    return questItem;
}

// Funksjon for å få status for et oppdrag
function getQuestStatus(quest, questStatus) {
    if (!questStatus) return 'available';
    
    const status = questStatus.find(q => q.id === quest.id);
    
    if (!status) return 'available';
    
    return status.status;
}

// Funksjon for å få tekst for status
function getStatusText(status) {
    const statusMap = {
        'available': 'Tilgjengelig',
        'active': 'Aktiv',
        'completed': 'Fullført'
    };
    
    return statusMap[status] || 'Ukjent';
}

// Funksjon for å hente brukerens oppdragsstatus
async function getUserQuestStatus() {
    // Vent til dashboardBase og userProfile er tilgjengelig
    if (!window.dashboardBase || !window.userProfile) {
        console.log('Venter på at userProfile skal bli tilgjengelig...');
        
        // Returner en tom array hvis vi ikke har userProfile ennå
        // Dette er trygt fordi vi vil laste oppdragene på nytt når userProfile blir tilgjengelig
        return [];
    }
    
    // Bruk window.userProfile direkte siden det er gjort globalt tilgjengelig
    return window.userProfile.quests || [];
}

// Funksjon for å starte et oppdrag
async function startQuest(npcId, questId) {
    if (!window.dashboardBase || !window.dashboardBase.userProfile) {
        console.error('dashboardBase eller userProfile ikke tilgjengelig');
        return;
    }
    
    const { userProfile, supabase, showNotification } = window.dashboardBase;
    
    // Hent oppdrag
    const { data: quest, error: questError } = await supabase
        .from('quests')
        .select('*')
        .eq('id', questId)
        .single();
    
    if (questError || !quest) {
        console.error('Feil ved henting av oppdrag:', questError);
        showNotification('Feil ved henting av oppdrag. Prøv igjen senere.', 'error');
        return;
    }
    
    // Legg til oppdrag i brukerens aktive oppdrag
    const quests = userProfile.quests || [];
    
    // Sjekk om oppdraget allerede er aktivt eller fullført
    const existingQuest = quests.find(q => q.id === questId);
    if (existingQuest) {
        showNotification('Dette oppdraget er allerede aktivt eller fullført.', 'info');
        return;
    }
    
    // Legg til oppdraget
    const updatedQuests = [
        ...quests,
        {
            id: questId,
            status: 'active',
            progress: 0,
            started_at: new Date().toISOString()
        }
    ];
    
    // Oppdater i databasen
    const { data, error } = await supabase
        .from('profiles')
        .update({ quests: updatedQuests })
        .eq('id', userProfile.id);
    
    if (error) {
        console.error('Feil ved start av oppdrag:', error);
        showNotification('Feil ved start av oppdrag. Prøv igjen senere.', 'error');
        return;
    }
    
    // Vis bekreftelse
    showNotification(`Du har startet oppdraget "${quest.title}"!`, 'success');
    
    // Oppdater visningen
    filterQuests('active');
}

// Funksjon for å fullføre et oppdrag
async function completeQuest(npcId, questId) {
    if (!window.dashboardBase || !window.dashboardBase.userProfile) {
        console.error('dashboardBase eller userProfile ikke tilgjengelig');
        return;
    }
    
    const { userProfile, supabase, showNotification } = window.dashboardBase;
    
    // Hent oppdrag
    const { data: quest, error: questError } = await supabase
        .from('quests')
        .select('*')
        .eq('id', questId)
        .single();
    
    if (questError || !quest) {
        console.error('Feil ved henting av oppdrag:', questError);
        showNotification('Feil ved henting av oppdrag. Prøv igjen senere.', 'error');
        return;
    }
    
    // Finn oppdraget i brukerens aktive oppdrag
    const quests = userProfile.quests || [];
    const questIndex = quests.findIndex(q => q.id === questId && q.status === 'active');
    
    if (questIndex === -1) {
        showNotification('Dette oppdraget er ikke aktivt.', 'error');
        return;
    }
    
    // Oppdater oppdraget til fullført
    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
        ...updatedQuests[questIndex],
        status: 'completed',
        progress: quest.progress_target || 1,
        completed_at: new Date().toISOString()
    };
    
    // Gi belønninger
    let expReward = 0;
    let creditsReward = 0;
    let itemRewards = [];
    
    if (quest.rewards) {
        if (quest.rewards.exp) {
            expReward = quest.rewards.exp;
        }
        
        if (quest.rewards.credits) {
            creditsReward = quest.rewards.credits;
        }
        
        if (quest.rewards.items && quest.rewards.items.length > 0) {
            itemRewards = quest.rewards.items;
        }
    }
    
    // Oppdater brukerens profil med belønninger
    const newExp = userProfile.exp + expReward;
    const newCredits = userProfile.credits + creditsReward;
    
    // Legg til gjenstander i inventory
    let updatedInventory = userProfile.inventory || [];
    
    for (const itemId of itemRewards) {
        const existingItem = updatedInventory.find(item => item.id === itemId);
        
        if (existingItem) {
            // Øk antallet hvis gjenstanden allerede finnes
            updatedInventory = updatedInventory.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
        } else {
            // Legg til ny gjenstand
            updatedInventory.push({ id: itemId, quantity: 1 });
        }
    }
    
    // Oppdater i databasen
    const { data, error } = await supabase
        .from('profiles')
        .update({
            quests: updatedQuests,
            exp: newExp,
            credits: newCredits,
            inventory: updatedInventory
        })
        .eq('id', userProfile.id);
    
    if (error) {
        console.error('Feil ved fullføring av oppdrag:', error);
        showNotification('Feil ved fullføring av oppdrag. Prøv igjen senere.', 'error');
        return;
    }
    
    // Vis bekreftelse
    let rewardMessage = `Du har fullført oppdraget "${quest.title}"!`;
    
    if (expReward > 0) {
        rewardMessage += ` Du fikk ${expReward} EXP.`;
    }
    
    if (creditsReward > 0) {
        rewardMessage += ` Du fikk ${creditsReward} kreditter.`;
    }
    
    if (itemRewards.length > 0) {
        rewardMessage += ` Du fikk ${itemRewards.length} gjenstand(er).`;
    }
    
    showNotification(rewardMessage, 'success');
    
    // Oppdater visningen
    filterQuests('completed');
    
    // Sjekk for prestasjoner
    checkQuestAchievements(updatedQuests);
}

// Funksjon for å vise detaljer om et oppdrag
function showQuestDetails(npc, quest, status, questStatus) {
    // Implementer visning av oppdragsdetaljer i en modal eller lignende
    console.log('Vis detaljer for oppdrag:', quest.title);
}

// Funksjon for å abonnere på oppdateringer for oppdrag
function subscribeToQuestUpdates() {
    if (!window.dashboardBase || !window.dashboardBase.supabase || !window.dashboardBase.currentUser) {
        console.error('dashboardBase, supabase eller currentUser ikke tilgjengelig');
        return;
    }
    
    const { supabase, currentUser } = window.dashboardBase;
    
    // Abonner på oppdateringer for brukerprofilen
    const questSubscription = supabase
        .channel('quest-changes')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${currentUser.id}`
        }, payload => {
            // Oppdater oppdrag-fanen
            filterQuests(document.querySelector('.filter-button.active')?.getAttribute('data-filter') || 'all');
        })
        .subscribe();
}

// Funksjon for å sjekke prestasjoner relatert til oppdrag
function checkQuestAchievements(quests) {
    if (typeof checkAchievements !== 'function') return;
    
    // Tell antall fullførte oppdrag
    const completedQuests = quests.filter(quest => quest.status === 'completed').length;
    
    // Sjekk prestasjoner basert på antall fullførte oppdrag
    checkAchievements('quests', completedQuests);
}

// Initialiser oppdrag-fanen når dokumentet er lastet
document.addEventListener('DOMContentLoaded', initQuestsTab); 