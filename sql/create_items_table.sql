-- Opprett items-tabellen
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('boost', 'equipment', 'consumable', 'special')),
    rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    price INTEGER NOT NULL DEFAULT 0,
    effect TEXT,
    effect_type TEXT,
    effect_value INTEGER,
    effect_skill TEXT,
    usable BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    popular BOOLEAN DEFAULT false,
    new BOOLEAN DEFAULT false,
    sale BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Legg til noen eksempelgjenstander
INSERT INTO public.items (name, description, type, rarity, price, effect, effect_type, effect_value, usable)
VALUES
    ('Intelligens Boost', 'Øker Intelligens-ferdigheten din med 1 nivå.', 'boost', 'uncommon', 100, 'Øker Intelligens med 1', 'skill_boost', 1, true),
    ('Teknologi Boost', 'Øker Teknologi-ferdigheten din med 1 nivå.', 'boost', 'uncommon', 100, 'Øker Teknologi med 1', 'skill_boost', 1, true),
    ('Stamina Boost', 'Øker Stamina-ferdigheten din med 1 nivå.', 'boost', 'uncommon', 100, 'Øker Stamina med 1', 'skill_boost', 1, true),
    ('Karisma Boost', 'Øker Karisma-ferdigheten din med 1 nivå.', 'boost', 'uncommon', 100, 'Øker Karisma med 1', 'skill_boost', 1, true),
    ('Kreativitet Boost', 'Øker Kreativitet-ferdigheten din med 1 nivå.', 'boost', 'uncommon', 100, 'Øker Kreativitet med 1', 'skill_boost', 1, true),
    ('Flaks Boost', 'Øker Flaks-ferdigheten din med 1 nivå.', 'boost', 'uncommon', 100, 'Øker Flaks med 1', 'skill_boost', 1, true),
    ('EXP Potion', 'Gir deg 100 EXP umiddelbart.', 'consumable', 'common', 50, 'Gir 100 EXP', 'exp_boost', 100, true),
    ('Kreditt Voucher', 'Gir deg 50 kreditter umiddelbart.', 'consumable', 'common', 25, 'Gir 50 kreditter', 'credit_boost', 50, true),
    ('Koding Tastatur', 'Et mekanisk tastatur som øker kodingshastigheten din.', 'equipment', 'rare', 200, 'Øker Teknologi med 2', 'skill_boost', 2, true),
    ('Hacker Hettegenser', 'En mystisk hettegenser som øker hackingferdighetene dine.', 'equipment', 'rare', 250, 'Øker Intelligens med 2', 'skill_boost', 2, true),
    ('Energidrikk', 'En energidrikk som gir deg et midlertidig boost i stamina.', 'consumable', 'common', 30, 'Gir 50 EXP', 'exp_boost', 50, true),
    ('VR Briller', 'Avanserte VR-briller som forbedrer opplevelsen din i OASIS.', 'equipment', 'epic', 500, 'Øker alle ferdigheter med 1', 'skill_boost', 1, true),
    ('Lykkeamulett', 'En mystisk amulett som øker flaksen din.', 'equipment', 'legendary', 1000, 'Øker Flaks med 5', 'skill_boost', 5, true);

-- Gi tilgang til authenticated brukere
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read items" ON public.items
    FOR SELECT
    TO authenticated
    USING (true); 