# OASIS - Optimalisert Database-integrasjon

Dette prosjektet er en optimalisering av OASIS-applikasjonen med fokus på å forbedre database-integrasjonen ved hjelp av Supabase.

## Hovedendringer

1. **Sentralisert Supabase-klient**
   - Opprettet en felles Supabase-klient i `js/supabase/supabase-client.js`
   - Eliminert duplisert kode og potensielle konflikter

2. **Database-tjeneste**
   - Implementert en sentral database-tjeneste i `js/services/database-service.js`
   - Organisert databaseoperasjoner i logiske undertjenester:
     - `userService` - Håndterer brukerrelaterte operasjoner
     - `itemService` - Håndterer gjenstandsrelaterte operasjoner
     - `questService` - Håndterer oppdragsrelaterte operasjoner
     - `npcService` - Håndterer NPC-relaterte operasjoner
     - `achievementService` - Håndterer prestasjonsrelaterte operasjoner
     - `chatService` - Håndterer chat-relaterte operasjoner

3. **Oppdaterte JavaScript-filer**
   - Oppdatert alle JavaScript-filer til å bruke den nye database-tjenesten
   - Forbedret feilhåndtering og logging
   - Standardisert returverdier fra databaseoperasjoner

4. **SQL-skript for tabeller**
   - Opprettet SQL-skript for alle nødvendige tabeller
   - Lagt til indekser for optimalisert ytelse
   - Implementert Row Level Security (RLS) for sikkerhet

5. **Dokumentasjon**
   - Opprettet detaljert implementeringsdokumentasjon i `README-implementering.md`
   - Dokumentert API-er og tjenester

## Fordeler med den nye løsningen

1. **Bedre kodeorganisering**
   - Separasjon av bekymringer (Separation of Concerns)
   - Modulær kode som er lettere å vedlikeholde

2. **Forbedret ytelse**
   - Optimaliserte databasespørringer
   - Indekser for raskere søk

3. **Bedre feilhåndtering**
   - Konsistent feilhåndtering på tvers av applikasjonen
   - Detaljert logging for enklere feilsøking

4. **Enklere utvidelse**
   - Nye funksjoner kan enkelt legges til i de eksisterende tjenestene
   - Standardisert API for databaseoperasjoner

## Implementering

Se `README-implementering.md` for detaljerte instruksjoner om hvordan du implementerer løsningen i ditt prosjekt.

## Teknologier

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (PostgreSQL)
- **Autentisering**: Supabase Auth
- **Sanntidsoppdateringer**: Supabase Realtime

## Kontakt

For spørsmål eller problemer, kontakt oss på [support@oasis.no](mailto:support@oasis.no). 