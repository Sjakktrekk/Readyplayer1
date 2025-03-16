# Implementering av Supabase-løsning

Dette dokumentet beskriver hvordan du implementerer løsningen for å fikse Supabase-problemer i OASIS-prosjektet.

## Endringer som er gjort

1. **Opprettet en felles Supabase-klient** i `js/supabase/supabase-client.js` som kan brukes på tvers av alle filer.
2. **Opprettet en sentral database-tjeneste** i `js/services/database-service.js` som håndterer alle databaseoperasjoner.
3. **Oppdatert JavaScript-filer** for å bruke den felles Supabase-klienten og database-tjenesten.
4. **Opprettet SQL-skript** for manglende tabeller:
   - `create_items_table.sql`
   - `create_quests_table.sql`
   - `create_npcs_table.sql`
   - `create_chat_messages_table.sql`
   - `create_achievements_table.sql`

## Implementeringssteg

### 1. Logg inn på Supabase

1. Gå til [Supabase](https://supabase.com/) og logg inn med dine legitimasjoner.
2. Velg OASIS-prosjektet fra dashbordet.

### 2. Kjør SQL-skript

1. Gå til "SQL Editor" i Supabase-dashbordet.
2. Kjør følgende SQL-skript i denne rekkefølgen:
   - `create_items_table.sql`
   - `create_quests_table.sql`
   - `create_npcs_table.sql`
   - `create_chat_messages_table.sql`
   - `create_achievements_table.sql`

### 3. Oppdater JavaScript-filer

1. **Kopier den felles Supabase-klienten**:
   - Kopier innholdet i `js/supabase/supabase-client.js` til ditt prosjekt.

2. **Kopier database-tjenesten**:
   - Kopier innholdet i `js/services/database-service.js` til ditt prosjekt.

3. **Oppdater HTML-filer**:
   - Legg til følgende skript-tagger i alle HTML-filer som bruker Supabase:
   ```html
   <!-- Importer Supabase JavaScript bibliotek -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   
   <!-- Importer vår felles Supabase-klient -->
   <script src="../js/supabase/supabase-client.js"></script>
   
   <!-- Importer vår database-tjeneste -->
   <script src="../js/services/database-service.js"></script>
   ```

4. **Oppdater JavaScript-filer**:
   - Erstatt alle direkte Supabase-kall med kall til `databaseService`.
   - For eksempel, i stedet for:
   ```javascript
   const { data, error } = await supabase.from('items').select('*');
   ```
   Bruk:
   ```javascript
   const { success, data, error } = await window.databaseService.item.getAllItems();
   ```

### 4. Test applikasjonen

1. Åpne applikasjonen i nettleseren.
2. Test alle funksjonaliteter som bruker Supabase:
   - Innlogging/registrering
   - Henting av brukerprofil
   - Visning av gjenstander i butikken
   - Visning av prestasjoner
   - Visning av oppdrag
   - Chat-funksjonalitet

## Bruk av database-tjenesten

Database-tjenesten (`databaseService`) er delt inn i flere undertjenester:

### Brukertjeneste (`databaseService.user`)

- `getCurrentUser()` - Henter gjeldende innlogget bruker
- `getUserProfile(userId)` - Henter brukerprofil basert på bruker-ID
- `updateUserProfile(userId, profileData)` - Oppdaterer brukerprofil
- `updateSkill(userId, skillName, skillValue)` - Oppdaterer en ferdighet
- `updateExp(userId, expValue)` - Oppdaterer erfaringspoeng
- `updateCredits(userId, creditsValue)` - Oppdaterer kreditter
- `updateAchievements(userId, achievements)` - Oppdaterer prestasjoner
- `updateInventory(userId, inventory)` - Oppdaterer inventar
- `getAllProfiles()` - Henter alle brukerprofiler
- `subscribeToProfileChanges(userId, callback)` - Abonnerer på profiloppdateringer

### Gjenstandstjeneste (`databaseService.item`)

- `getAllItems()` - Henter alle gjenstander
- `getItemById(itemId)` - Henter gjenstand basert på ID
- `getItemsByType(type)` - Henter gjenstander basert på type
- `getItemsByRarity(rarity)` - Henter gjenstander basert på sjeldenhetsgrad
- `searchItems(searchTerm)` - Søker etter gjenstander

### Oppdragstjeneste (`databaseService.quest`)

- `getAllQuests()` - Henter alle oppdrag
- `getQuestById(questId)` - Henter oppdrag basert på ID
- `getQuestsByDifficulty(difficulty)` - Henter oppdrag basert på vanskelighetsgrad
- `getQuestsByNpc(npcId)` - Henter oppdrag basert på NPC

### NPC-tjeneste (`databaseService.npc`)

- `getAllNpcs()` - Henter alle NPCer
- `getNpcById(npcId)` - Henter NPC basert på ID
- `getNpcsByRole(role)` - Henter NPCer basert på rolle

### Prestasjonstjeneste (`databaseService.achievement`)

- `getAllAchievements()` - Henter alle prestasjoner
- `getAchievementById(achievementId)` - Henter prestasjon basert på ID
- `getAchievementsBySkill(skill)` - Henter prestasjoner basert på ferdighet
- `getAchievementsByType(type)` - Henter prestasjoner basert på type
- `getAchievementsByRarity(rarity)` - Henter prestasjoner basert på sjeldenhetsgrad

### Chattjeneste (`databaseService.chat`)

- `getAllMessages()` - Henter alle meldinger
- `sendMessage(userId, username, message)` - Sender en melding
- `subscribeToMessages(callback)` - Abonnerer på nye meldinger

## Feilsøking

Hvis du opplever problemer med implementeringen, sjekk følgende:

1. **Sjekk konsollmeldinger** i nettleseren for feilmeldinger.
2. **Verifiser at tabellene er opprettet** i Supabase-dashbordet.
3. **Sjekk at JavaScript-filene er oppdatert** til å bruke `databaseService`.
4. **Sjekk at skriptene lastes i riktig rekkefølge**:
   - Først Supabase-biblioteket
   - Deretter den felles Supabase-klienten
   - Deretter database-tjenesten
   - Til slutt dine egne JavaScript-filer

## Kontakt

Hvis du har spørsmål eller problemer med implementeringen, kontakt oss på [support@oasis.no](mailto:support@oasis.no). 