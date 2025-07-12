-- V2__agencies_field_longer.sql
ALTER TABLE scraping_agencies
    ALTER COLUMN ville TYPE VARCHAR(500),
    ALTER COLUMN agence TYPE VARCHAR(500);