-- V7.5importAvisService.js__create_avis_location_table.sql

CREATE TABLE avis_location (
                               id SERIAL PRIMARY KEY,
                               pays VARCHAR(100),
                               region VARCHAR(100),
                               departement VARCHAR(100),
                               code_postal VARCHAR(10),
                               ville VARCHAR(100),
                               agence VARCHAR(150),
                               categorie VARCHAR(100),
                               genre VARCHAR(100),
                               modele VARCHAR(150),
                               kilometrage VARCHAR(50),
                               prix NUMERIC(10,2),
                               periode VARCHAR(50),
                               duree VARCHAR(50),
                               date_location DATE,
                               date_maj TIMESTAMP,
                               ip VARCHAR(45)
);

-- Index pour les recherches par date
CREATE INDEX idx_avis_location_date ON avis_location(date_location);

-- Index pour les comparaisons de prix par modèle
CREATE INDEX idx_avis_location_modele_date ON avis_location(modele, date_location);
