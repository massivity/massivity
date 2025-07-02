-- V4__add_role_to_utilisateurs.sql
ALTER TABLE clients ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
