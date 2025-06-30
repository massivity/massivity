-- Migration : ajout de la colonne refresh_token à la table clients
ALTER TABLE clients ADD COLUMN IF NOT EXISTS refresh_token TEXT;
