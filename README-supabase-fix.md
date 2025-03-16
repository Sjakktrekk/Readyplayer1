# Supabase Feilretting

Dette dokumentet beskriver hvordan du løser problemene med Supabase-integrasjonen i OASIS-prosjektet.

## Identifiserte problemer

1. **Flere Supabase-klienter**: Det var flere separate Supabase-klienter i ulike filer, noe som førte til advarselen "Multiple GoTrueClient instances detected".
2. **Manglende tabeller**: Tabellene `items`, `quests` og `npcs` eksisterte ikke i Supabase-databasen.

## Løsninger

### 1. Konsolidert Supabase-klient

Vi har opprettet en felles Supabase-klient i filen `js/supabase/supabase-client.js` som brukes i hele applikasjonen. Dette erstatter de separate klientene som tidligere var definert i hver fil.

### 2. Oppdaterte filer

Følgende filer er oppdatert for å bruke den felles Supabase-klienten:
- `pages/dashboard.html` - Inkluderer nå den felles Supabase-klienten
- `js/dashboard-base.js` - Bruker nå den felles Supabase-klienten
- `js/chat.js` - Bruker nå den felles Supabase-klienten

### 3. SQL-skript for manglende tabeller

Vi har opprettet SQL-skript for å opprette de manglende tabellene:
- `sql/create_items_table.sql` - Oppretter `items`-tabellen med eksempeldata
- `sql/create_quests_table.sql` - Oppretter `quests`-tabellen med eksempeldata
- `sql/create_npcs_table.sql` - Oppretter `npcs`-tabellen med eksempeldata

## Instruksjoner for å implementere løsningene

1. **Kjør SQL-skriptene i Supabase**:
   - Logg inn på [Supabase](https://app.supabase.io/)
   - Gå til prosjektet ditt
   - Velg "SQL Editor" fra menyen
   - Kopier og lim inn innholdet fra hvert SQL-skript og kjør dem

2. **Oppdater koden**:
   - Erstatt de eksisterende filene med de oppdaterte versjonene
   - Legg til den nye filen `js/supabase/supabase-client.js`

3. **Test applikasjonen**:
   - Last inn applikasjonen på nytt
   - Sjekk konsollen for feilmeldinger
   - Verifiser at funksjonaliteten for butikk, oppdrag og NPCer fungerer som forventet

## Fremtidige anbefalinger

1. **Bruk ES6-moduler konsekvent**: Vurder å konvertere alle JavaScript-filer til å bruke ES6-moduler for bedre organisering og avhengighetshåndtering.
2. **Implementer en bedre feilhåndtering**: Legg til mer robust feilhåndtering for å håndtere situasjoner der Supabase-tjenester ikke er tilgjengelige.
3. **Dokumenter databaseskjemaet**: Hold en oppdatert dokumentasjon over databaseskjemaet for å unngå fremtidige problemer med manglende tabeller. 