-- V1__create_scraping_tables.sql

-- Table : scraping_runs
CREATE TABLE scraping_runs (
                               id SERIAL PRIMARY KEY,
                               concurrent VARCHAR(50) NOT NULL,                -- "Avis", "Hertz", etc.
                               type_vehicule VARCHAR(10) NOT NULL,             -- "VP", "VU"
                               date_depart DATE NOT NULL,
                               date_retour DATE NOT NULL,
                               date_run TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               statut VARCHAR(20) NOT NULL DEFAULT 'pending',  -- "pending", "success", "error", "paused"
                               error_message TEXT,
                               xlsx_path VARCHAR(255),
                               user_launched INTEGER REFERENCES clients(id) ON DELETE SET NULL, -- FK sur users table, adapte si besoin
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table : scraping_results
CREATE TABLE scraping_results (
                                  id SERIAL PRIMARY KEY,
                                  run_id INTEGER NOT NULL REFERENCES scraping_runs(id) ON DELETE CASCADE,
                                  agence VARCHAR(255) NOT NULL,
                                  modele VARCHAR(100),
                                  prix NUMERIC(12,2),
                                  devise VARCHAR(10),
                                  kilometrage VARCHAR(50),
                                  options JSONB,
                                  geo_lat DOUBLE PRECISION,
                                  geo_lng DOUBLE PRECISION,
                                  details JSONB,
                                  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table : scraping_status
CREATE TABLE scraping_status (
                                 concurrent VARCHAR(50) PRIMARY KEY,
                                 is_paused BOOLEAN NOT NULL DEFAULT FALSE,
                                 last_run TIMESTAMP,
                                 last_status VARCHAR(20) DEFAULT 'pending', -- "success", "error", "pending"
                                 next_run TIMESTAMP,
                                 error_message TEXT,
                                 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer les historiques par concurrent/date
CREATE INDEX idx_scraping_runs_concurrent_date ON scraping_runs(concurrent, date_run DESC);
CREATE INDEX idx_scraping_results_run_id ON scraping_results(run_id);
