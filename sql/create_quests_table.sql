-- Opprett quests-tabellen
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    npc_id UUID,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'epic')),
    exp_reward INTEGER NOT NULL DEFAULT 0,
    credit_reward INTEGER NOT NULL DEFAULT 0,
    item_reward UUID REFERENCES public.items(id),
    skill_requirement TEXT,
    skill_level_required INTEGER,
    prerequisites UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Legg til noen eksempeloppdrag
INSERT INTO public.quests (title, description, difficulty, exp_reward, credit_reward)
VALUES
    ('Velkommen til OASIS', 'Fullfør introduksjonen til OASIS-plattformen.', 'easy', 50, 10),
    ('Første Kodeoppgave', 'Løs din første kodeoppgave i OASIS.', 'easy', 100, 20),
    ('Teknologi-utfordring', 'Demonstrer dine teknologiferdigheter ved å løse denne utfordringen.', 'medium', 200, 30),
    ('Hackathon Deltaker', 'Delta i din første hackathon i OASIS.', 'medium', 300, 50),
    ('Debuggings-mester', 'Finn og fiks alle feilene i koden.', 'hard', 500, 100),
    ('Prosjektleder', 'Led et team gjennom et helt prosjekt.', 'epic', 1000, 200);

-- Gi tilgang til authenticated brukere
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read quests" ON public.quests
    FOR SELECT
    TO authenticated
    USING (true); 