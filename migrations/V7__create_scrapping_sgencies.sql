-- V2__create_scraping_agencies.sql

CREATE TABLE scraping_agencies (
                                   id SERIAL PRIMARY KEY,
                                   concurrent VARCHAR(50) NOT NULL,        -- "Avis", "Europcar", "RAC", "Sixt", etc.
                                   ville VARCHAR(100) NOT NULL,
                                   agence VARCHAR(255) NOT NULL,
                                   active BOOLEAN NOT NULL DEFAULT TRUE,
                                   meta JSONB,
                                   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index utile pour le filtre par concurrent
CREATE INDEX idx_scraping_agencies_concurrent ON scraping_agencies(concurrent);
