-- Opprett chat_messages-tabellen
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Legg til noen eksempelmeldinger
INSERT INTO public.chat_messages (username, message, created_at)
VALUES
    ('System', 'Velkommen til OASIS Chat!', now() - interval '1 hour'),
    ('System', 'Her kan du kommunisere med andre brukere i sanntid.', now() - interval '59 minutes'),
    ('System', 'Vær hyggelig og respektfull mot andre brukere.', now() - interval '58 minutes');

-- Gi tilgang til authenticated brukere
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for å lese meldinger (alle autentiserte brukere)
CREATE POLICY "Authenticated users can read chat messages" ON public.chat_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy for å skrive meldinger (alle autentiserte brukere)
CREATE POLICY "Authenticated users can insert chat messages" ON public.chat_messages
    FOR INSERT
    TO authenticated
    WITH CHECK (true); 