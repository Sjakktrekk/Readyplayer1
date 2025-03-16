// Chat-funksjonalitet for OASIS
document.addEventListener('DOMContentLoaded', () => {
    console.log('Chat.js lastet');
    
    // Bruk den felles Supabase-klienten
    const chatSupabase = window.supabaseHelper.getSupabase();
    console.log('Chat bruker felles Supabase-klient');
    
    // Globale variabler for feilsøking
    window.chatDebug = {
        sendTestMessage: null,
        checkElements: function() {
            const chatMessages = document.getElementById('chat-messages');
            const chatInput = document.getElementById('chat-input');
            const sendButton = document.getElementById('chat-send-button');
            
            console.log('Chat DOM-elementer status:', {
                chatMessages: chatMessages ? 'Funnet' : 'Ikke funnet',
                chatInput: chatInput ? 'Funnet' : 'Ikke funnet',
                sendButton: sendButton ? 'Funnet' : 'Ikke funnet'
            });
            
            if (sendButton) {
                console.log('Send-knapp egenskaper:', {
                    id: sendButton.id,
                    className: sendButton.className,
                    onclick: !!sendButton.onclick,
                    parentNode: sendButton.parentNode ? sendButton.parentNode.tagName : 'Ingen'
                });
                
                // Test klikk på knappen
                console.log('Simulerer klikk på send-knappen...');
                sendButton.click();
            }
            
            return { chatMessages, chatInput, sendButton };
        },
        
        // Direkte funksjon for å sende en testmelding
        directSendMessage: async function(testMessage) {
            if (!testMessage) {
                testMessage = 'Test melding fra direkte feilsøkingsfunksjon - ' + new Date().toISOString();
            }
            
            try {
                console.log('Sender testmelding direkte...');
                
                // Hent brukernavn
                let username = 'TestBruker';
                try {
                    const { data: { user } } = await chatSupabase.auth.getUser();
                    if (user) {
                        const { data: profile } = await chatSupabase
                            .from('profiles')
                            .select('username')
                            .eq('id', user.id)
                            .single();
                        
                        if (profile) {
                            username = profile.username;
                        }
                    }
                } catch (e) {
                    console.error('Kunne ikke hente brukernavn:', e);
                }
                
                // Send meldingen
                const { data, error } = await chatSupabase
                    .from('chat_messages')
                    .insert([
                        { username, message: testMessage }
                    ]);
                
                if (error) {
                    console.error('Feil ved sending av direkte testmelding:', error.message);
                    alert('Feil ved sending av testmelding: ' + error.message);
                    return false;
                }
                
                console.log('Direkte testmelding sendt:', data);
                alert('Testmelding sendt!');
                return true;
            } catch (error) {
                console.error('Feil ved sending av direkte testmelding:', error);
                alert('Feil ved sending av testmelding: ' + (error.message || 'Ukjent feil'));
                return false;
            }
        }
    };
    
    // Vent på at Supabase-klienten er klar
    setTimeout(() => {
        initChat();
    }, 1000);
    
    // Initialiser chat-funksjonaliteten
    async function initChat() {
        // DOM-elementer
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('chat-send-button');
        const chatNotification = document.getElementById('chat-notification');
        
        // Variabel for å holde styr på om chat-fanen er aktiv
        let isChatTabActive = document.querySelector('.nav-item[data-tab="chat"]').classList.contains('active');
        
        // Funksjon for å sjekke om chat-fanen er aktiv
        function updateChatTabStatus() {
            isChatTabActive = document.querySelector('.nav-item[data-tab="chat"]').classList.contains('active');
            if (isChatTabActive) {
                // Skjul varselsmerket når chat-fanen er aktiv
                chatNotification.style.display = 'none';
            }
        }
        
        // Legg til event listener for fanebytte
        document.querySelectorAll('.nav-item').forEach(tab => {
            tab.addEventListener('click', updateChatTabStatus);
        });
        
        // Sjekk om DOM-elementene ble funnet
        console.log('Chat DOM-elementer funnet:', {
            chatMessages: !!chatMessages,
            chatInput: !!chatInput,
            sendButton: !!sendButton,
            chatNotification: !!chatNotification
        });
        
        if (!chatMessages || !chatInput || !sendButton) {
            console.error('Kunne ikke finne alle nødvendige DOM-elementer for chat');
            return;
        }
        
        // Brukerdata
        let username = '';
        
        // Hent brukerdata
        try {
            console.log('Prøver å hente brukerdata...');
            
            const { data: { user } } = await chatSupabase.auth.getUser();
            console.log('Auth respons:', user);
            
            if (!user) {
                console.error('Ingen bruker er logget inn');
                return;
            }
            
            // Hent brukerprofil fra Supabase
            const { data: profile, error } = await chatSupabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();
            
            if (error) {
                console.error('Feil ved henting av brukerprofil:', error.message);
                return;
            }
            
            username = profile.username;
            console.log('Chat initialisert for bruker:', username);
            
            // Test Supabase-tilkoblingen og chat_messages-tabellen (uten å sende testmelding)
            try {
                console.log('Tester tilgang til chat_messages-tabellen...');
                const { data, error } = await chatSupabase
                    .from('chat_messages')
                    .select('count')
                    .limit(1);
                
                if (error) {
                    console.error('Feil ved testing av chat_messages-tabellen:', error.message);
                } else {
                    console.log('Tilgang til chat_messages-tabellen OK:', data);
                    // Ingen testmelding sendes her lenger
                }
            } catch (testError) {
                console.error('Feil ved testing av Supabase-tilkobling:', testError);
            }
            
            // Nå som vi har brukerdata, kan vi laste inn meldinger og sette opp event listeners
            setupChat();
            
        } catch (error) {
            console.error('Feil ved henting av brukerdata:', error);
            console.error('Stack trace:', error.stack);
            return;
        }
        
        // Sett opp chat-funksjonalitet etter at brukerdata er hentet
        function setupChat() {
            // Funksjon for å laste inn meldinger
            async function loadMessages() {
                try {
                    const { data, error } = await chatSupabase
                        .from('chat_messages')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(50);
                    
                    if (error) {
                        console.error('Feil ved henting av chat-meldinger:', error.message);
                        return;
                    }
                    
                    // Tøm meldingsbeholderen
                    chatMessages.innerHTML = '';
                    
                    // Vis meldingene i omvendt rekkefølge (nyeste først)
                    data.reverse().forEach(message => {
                        addMessageToUI(message);
                    });
                    
                    // Scroll til bunnen
                    scrollToBottom();
                } catch (error) {
                    console.error('Feil ved lasting av meldinger:', error.message);
                }
            }
            
            // Funksjon for å legge til en melding i UI
            function addMessageToUI(message) {
                const messageElement = document.createElement('div');
                const isOwnMessage = message.username === username;
                
                messageElement.className = `chat-message ${isOwnMessage ? 'own-message' : 'other-message'}`;
                
                // Formater tidspunkt
                const messageDate = new Date(message.created_at);
                const formattedTime = messageDate.toLocaleTimeString('nb-NO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                // Sett inn meldingsinnhold
                messageElement.innerHTML = `
                    ${!isOwnMessage ? `<div class="message-username">${message.username}</div>` : ''}
                    <div class="message-content">${escapeHTML(message.message)}</div>
                    <div class="message-time">${formattedTime}</div>
                `;
                
                // Legg til i chat-beholderen
                chatMessages.appendChild(messageElement);
            }
            
            // Funksjon for å sende en melding
            async function sendMessage() {
                console.log('Send-knapp trykket');
                const messageText = chatInput.value.trim();
                
                console.log('Melding som skal sendes:', messageText);
                
                if (!messageText) {
                    console.log('Ingen melding å sende (tom input)');
                    return;
                }
                
                try {
                    console.log('Prøver å sende melding til Supabase...');
                    
                    // Legg til meldingen i databasen
                    const { data, error } = await chatSupabase
                        .from('chat_messages')
                        .insert([
                            { username, message: messageText }
                        ]);
                    
                    if (error) {
                        console.error('Feil ved sending av melding:', error.message);
                        alert('Feil ved sending av melding: ' + error.message);
                        return;
                    }
                    
                    console.log('Melding sendt til Supabase:', data);
                    
                    // Tøm input-feltet
                    chatInput.value = '';
                    
                    // Fokuser på input-feltet igjen
                    chatInput.focus();
                } catch (error) {
                    console.error('Feil ved sending av melding:', error);
                    console.error('Stack trace:', error.stack);
                    alert('Feil ved sending av melding: ' + error.message);
                }
            }
            
            // Gjør sendMessage tilgjengelig for feilsøking
            window.chatDebug.sendTestMessage = async function(testMessage) {
                if (!testMessage) {
                    testMessage = 'Test melding fra feilsøkingsfunksjon - ' + new Date().toISOString();
                }
                
                try {
                    console.log('Sender testmelding:', testMessage);
                    
                    const { data, error } = await chatSupabase
                        .from('chat_messages')
                        .insert([
                            { username, message: testMessage }
                        ]);
                    
                    if (error) {
                        console.error('Feil ved sending av testmelding:', error.message);
                        return false;
                    }
                    
                    console.log('Testmelding sendt:', data);
                    return true;
                } catch (error) {
                    console.error('Feil ved sending av testmelding:', error);
                    return false;
                }
            };
            
            // Funksjon for å scrolle til bunnen av chat
            function scrollToBottom() {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Event listeners
            console.log('Legger til event listeners for chat');
            
            // Fjern eventuelle eksisterende event listeners
            sendButton.removeEventListener('click', sendMessage);
            
            // Legg til event listener med direkte funksjonskall
            sendButton.onclick = function() {
                console.log('Send-knapp klikket via onclick-property');
                sendMessage();
            };
            
            chatInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    console.log('Enter-tast trykket i input-felt');
                    sendMessage();
                }
            });
            
            // Abonner på nye meldinger med Supabase Realtime
            const subscription = chatSupabase
                .channel('public:chat_messages')
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'chat_messages' 
                }, (payload) => {
                    // Legg til den nye meldingen i UI
                    addMessageToUI(payload.new);
                    
                    // Vis varselsmerket hvis chat-fanen ikke er aktiv og meldingen ikke er fra brukeren selv
                    if (!isChatTabActive && payload.new.username !== username) {
                        chatNotification.style.display = 'inline-block';
                    }
                    
                    // Scroll til bunnen hvis vi er nær bunnen
                    const isNearBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < 100;
                    if (isNearBottom) {
                        scrollToBottom();
                    }
                })
                .subscribe();
            
            // Last inn meldinger ved oppstart
            loadMessages();
        }
        
        // Funksjon for å escape HTML for å unngå XSS
        function escapeHTML(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }
}); 