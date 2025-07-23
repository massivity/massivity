-- Supprime les index (toujours avant les tables)
DROP INDEX IF EXISTS idx_scraping_runs_concurrent_date;
DROP INDEX IF EXISTS idx_scraping_results_run_id;

-- Supprime les tables (ordre important à cause des FKs)
DROP TABLE IF EXISTS scraping_status;
DROP TABLE IF EXISTS scraping_results;
DROP TABLE IF EXISTS scraping_runs;