-- Script SQL pour la fonctionnalité multi-sièges
-- À exécuter dans Supabase SQL Editor

-- Ajouter la colonne subscription_plan à profiles si elle n'existe pas
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT NULL;

-- Créer la table team_members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Un membre ne peut être dans une équipe qu'une seule fois
  UNIQUE(owner_id, member_id),
  
  -- Un utilisateur ne peut être membre que d'une seule équipe
  UNIQUE(member_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_team_members_owner ON team_members(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_member ON team_members(member_id);

-- RLS (Row Level Security)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: le propriétaire peut tout voir/gérer sur ses membres
CREATE POLICY "Owners can manage their team members" ON team_members
  FOR ALL
  USING (auth.uid() = owner_id);

-- Policy: les membres peuvent voir leur propre appartenance
CREATE POLICY "Members can view their membership" ON team_members
  FOR SELECT
  USING (auth.uid() = member_id);

-- Fonction pour obtenir l'équipe d'un utilisateur (propriétaire ou membre)
CREATE OR REPLACE FUNCTION get_team_owner(user_id UUID)
RETURNS UUID AS $$
DECLARE
  owner_result UUID;
BEGIN
  -- Vérifier si l'utilisateur est propriétaire
  SELECT id INTO owner_result FROM profiles 
  WHERE id = user_id 
  AND subscription_plan IN ('sub_5000', 'sub_10000')
  AND subscription_status = 'active';
  
  IF owner_result IS NOT NULL THEN
    RETURN user_id;
  END IF;
  
  -- Sinon vérifier s'il est membre d'une équipe
  SELECT owner_id INTO owner_result FROM team_members 
  WHERE member_id = user_id;
  
  RETURN owner_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
