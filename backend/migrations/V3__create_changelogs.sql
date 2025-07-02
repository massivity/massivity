CREATE TABLE changelogs (
                            id SERIAL PRIMARY KEY,
                            titre VARCHAR(255) NOT NULL,
                            description TEXT NOT NULL,
                            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
