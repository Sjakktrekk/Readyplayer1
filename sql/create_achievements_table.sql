-- Opprett achievements-tabell
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'skill', 'collection', 'exploration', 'social', etc.
    skill TEXT, -- Hvilken ferdighet prestasjonen er knyttet til (kan være null)
    rarity TEXT NOT NULL, -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
    requirement_type TEXT NOT NULL, -- 'skill_level', 'item_count', 'quest_count', etc.
    requirement_value INTEGER NOT NULL, -- Verdien som kreves for å låse opp prestasjonen
    reward_type TEXT NOT NULL, -- 'exp', 'credits', 'item', etc.
    reward_value INTEGER NOT NULL, -- Verdien av belønningen
    reward_item_id UUID, -- ID til gjenstand som belønning (kan være null)
    icon TEXT, -- Ikon for prestasjonen
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opprett indekser for raskere spørringer
CREATE INDEX IF NOT EXISTS achievements_type_idx ON achievements (type);
CREATE INDEX IF NOT EXISTS achievements_skill_idx ON achievements (skill);
CREATE INDEX IF NOT EXISTS achievements_rarity_idx ON achievements (rarity);

-- Legg til eksempeldata
INSERT INTO achievements (name, description, type, skill, rarity, requirement_type, requirement_value, reward_type, reward_value, icon)
VALUES
    -- Intelligens-prestasjoner
    ('Newbie Intelligens', 'Nå nivå 10 i Intelligens', 'skill', 'intelligens', 'common', 'skill_level', 10, 'exp', 100, 'fas fa-brain'),
    ('Explorer Intelligens', 'Nå nivå 15 i Intelligens', 'skill', 'intelligens', 'uncommon', 'skill_level', 15, 'exp', 200, 'fas fa-brain'),
    ('Master Intelligens', 'Nå nivå 20 i Intelligens', 'skill', 'intelligens', 'rare', 'skill_level', 20, 'exp', 300, 'fas fa-brain'),
    ('Legend Intelligens', 'Nå nivå 25 i Intelligens', 'skill', 'intelligens', 'epic', 'skill_level', 25, 'exp', 400, 'fas fa-brain'),
    ('Champion Intelligens', 'Nå nivå 30 i Intelligens', 'skill', 'intelligens', 'legendary', 'skill_level', 30, 'exp', 500, 'fas fa-brain'),
    
    -- Teknologi-prestasjoner
    ('Newbie Teknologi', 'Nå nivå 10 i Teknologi', 'skill', 'teknologi', 'common', 'skill_level', 10, 'exp', 100, 'fas fa-laptop-code'),
    ('Explorer Teknologi', 'Nå nivå 15 i Teknologi', 'skill', 'teknologi', 'uncommon', 'skill_level', 15, 'exp', 200, 'fas fa-laptop-code'),
    ('Master Teknologi', 'Nå nivå 20 i Teknologi', 'skill', 'teknologi', 'rare', 'skill_level', 20, 'exp', 300, 'fas fa-laptop-code'),
    ('Legend Teknologi', 'Nå nivå 25 i Teknologi', 'skill', 'teknologi', 'epic', 'skill_level', 25, 'exp', 400, 'fas fa-laptop-code'),
    ('Champion Teknologi', 'Nå nivå 30 i Teknologi', 'skill', 'teknologi', 'legendary', 'skill_level', 30, 'exp', 500, 'fas fa-laptop-code'),
    
    -- Stamina-prestasjoner
    ('Newbie Stamina', 'Nå nivå 10 i Stamina', 'skill', 'stamina', 'common', 'skill_level', 10, 'exp', 100, 'fas fa-running'),
    ('Explorer Stamina', 'Nå nivå 15 i Stamina', 'skill', 'stamina', 'uncommon', 'skill_level', 15, 'exp', 200, 'fas fa-running'),
    ('Master Stamina', 'Nå nivå 20 i Stamina', 'skill', 'stamina', 'rare', 'skill_level', 20, 'exp', 300, 'fas fa-running'),
    ('Legend Stamina', 'Nå nivå 25 i Stamina', 'skill', 'stamina', 'epic', 'skill_level', 25, 'exp', 400, 'fas fa-running'),
    ('Champion Stamina', 'Nå nivå 30 i Stamina', 'skill', 'stamina', 'legendary', 'skill_level', 30, 'exp', 500, 'fas fa-running'),
    
    -- Karisma-prestasjoner
    ('Newbie Karisma', 'Nå nivå 10 i Karisma', 'skill', 'karisma', 'common', 'skill_level', 10, 'exp', 100, 'fas fa-smile'),
    ('Explorer Karisma', 'Nå nivå 15 i Karisma', 'skill', 'karisma', 'uncommon', 'skill_level', 15, 'exp', 200, 'fas fa-smile'),
    ('Master Karisma', 'Nå nivå 20 i Karisma', 'skill', 'karisma', 'rare', 'skill_level', 20, 'exp', 300, 'fas fa-smile'),
    ('Legend Karisma', 'Nå nivå 25 i Karisma', 'skill', 'karisma', 'epic', 'skill_level', 25, 'exp', 400, 'fas fa-smile'),
    ('Champion Karisma', 'Nå nivå 30 i Karisma', 'skill', 'karisma', 'legendary', 'skill_level', 30, 'exp', 500, 'fas fa-smile'),
    
    -- Kreativitet-prestasjoner
    ('Newbie Kreativitet', 'Nå nivå 10 i Kreativitet', 'skill', 'kreativitet', 'common', 'skill_level', 10, 'exp', 100, 'fas fa-paint-brush'),
    ('Explorer Kreativitet', 'Nå nivå 15 i Kreativitet', 'skill', 'kreativitet', 'uncommon', 'skill_level', 15, 'exp', 200, 'fas fa-paint-brush'),
    ('Master Kreativitet', 'Nå nivå 20 i Kreativitet', 'skill', 'kreativitet', 'rare', 'skill_level', 20, 'exp', 300, 'fas fa-paint-brush'),
    ('Legend Kreativitet', 'Nå nivå 25 i Kreativitet', 'skill', 'kreativitet', 'epic', 'skill_level', 25, 'exp', 400, 'fas fa-paint-brush'),
    ('Champion Kreativitet', 'Nå nivå 30 i Kreativitet', 'skill', 'kreativitet', 'legendary', 'skill_level', 30, 'exp', 500, 'fas fa-paint-brush'),
    
    -- Flaks-prestasjoner
    ('Newbie Flaks', 'Nå nivå 10 i Flaks', 'skill', 'flaks', 'common', 'skill_level', 10, 'exp', 100, 'fas fa-dice'),
    ('Explorer Flaks', 'Nå nivå 15 i Flaks', 'skill', 'flaks', 'uncommon', 'skill_level', 15, 'exp', 200, 'fas fa-dice'),
    ('Master Flaks', 'Nå nivå 20 i Flaks', 'skill', 'flaks', 'rare', 'skill_level', 20, 'exp', 300, 'fas fa-dice'),
    ('Legend Flaks', 'Nå nivå 25 i Flaks', 'skill', 'flaks', 'epic', 'skill_level', 25, 'exp', 400, 'fas fa-dice'),
    ('Champion Flaks', 'Nå nivå 30 i Flaks', 'skill', 'flaks', 'legendary', 'skill_level', 30, 'exp', 500, 'fas fa-dice'),
    
    -- Samler-prestasjoner
    ('Samler Nivå 1', 'Samle 5 gjenstander', 'collection', NULL, 'common', 'item_count', 5, 'credits', 100, 'fas fa-box'),
    ('Samler Nivå 2', 'Samle 10 gjenstander', 'collection', NULL, 'uncommon', 'item_count', 10, 'credits', 200, 'fas fa-box'),
    ('Samler Nivå 3', 'Samle 20 gjenstander', 'collection', NULL, 'rare', 'item_count', 20, 'credits', 300, 'fas fa-box'),
    ('Samler Nivå 4', 'Samle 30 gjenstander', 'collection', NULL, 'epic', 'item_count', 30, 'credits', 400, 'fas fa-box'),
    ('Samler Nivå 5', 'Samle 50 gjenstander', 'collection', NULL, 'legendary', 'item_count', 50, 'credits', 500, 'fas fa-box'),
    
    -- Oppdrag-prestasjoner
    ('Oppdragstaker Nivå 1', 'Fullfør 5 oppdrag', 'exploration', NULL, 'common', 'quest_count', 5, 'credits', 100, 'fas fa-tasks'),
    ('Oppdragstaker Nivå 2', 'Fullfør 10 oppdrag', 'exploration', NULL, 'uncommon', 'quest_count', 10, 'credits', 200, 'fas fa-tasks'),
    ('Oppdragstaker Nivå 3', 'Fullfør 20 oppdrag', 'exploration', NULL, 'rare', 'quest_count', 20, 'credits', 300, 'fas fa-tasks'),
    ('Oppdragstaker Nivå 4', 'Fullfør 30 oppdrag', 'exploration', NULL, 'epic', 'quest_count', 30, 'credits', 400, 'fas fa-tasks'),
    ('Oppdragstaker Nivå 5', 'Fullfør 50 oppdrag', 'exploration', NULL, 'legendary', 'quest_count', 50, 'credits', 500, 'fas fa-tasks');

-- Oppdater RLS-politikk for å tillate lesing av prestasjoner
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alle kan lese prestasjoner" 
    ON achievements FOR SELECT 
    USING (true);

CREATE POLICY "Bare administratorer kan endre prestasjoner" 
    ON achievements FOR ALL 
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE is_admin = true
    )); 