-- Opprett npcs-tabellen
CREATE TABLE IF NOT EXISTS public.npcs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    location TEXT,
    dialogue JSONB,
    quests UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Legg til noen eksempel-NPCer
INSERT INTO public.npcs (name, role, description, location)
VALUES
    ('Professor Byte', 'Lærer', 'En kunnskapsrik professor som spesialiserer seg på programmering og datavitenskap.', 'Hovedbygget'),
    ('Tekno-Trine', 'Tekniker', 'En dyktig tekniker som kan hjelpe deg med tekniske problemer.', 'Teknologilaben'),
    ('Kaptein Kode', 'Mentor', 'En erfaren programmerer som veileder nye studenter i kodeverden.', 'Kodehallen'),
    ('Hackerman', 'Hacker', 'En mystisk figur som utfordrer studenter med vanskelige kodeproblemer.', 'Krypteringskammeret'),
    ('AI-Anna', 'Kunstig Intelligens', 'En avansert AI som hjelper studenter med maskinlæring og AI-konsepter.', 'AI-laboratoriet');

-- Gi tilgang til authenticated brukere
ALTER TABLE public.npcs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read npcs" ON public.npcs
    FOR SELECT
    TO authenticated
    USING (true); 