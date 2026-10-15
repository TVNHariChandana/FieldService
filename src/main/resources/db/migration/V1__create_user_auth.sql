CREATE TABLE IF NOT EXISTS user_auth (
                           id BIGINT NOT NULL AUTO_INCREMENT,
                           username VARCHAR(255) NOT NULL,
                           email VARCHAR(255) NOT NULL,
                           phone VARCHAR(255),
                           password VARCHAR(255) NOT NULL,
                           role VARCHAR(50) NOT NULL,
                           reset_token VARCHAR(255),
                           reset_token_expiry DATETIME,

                           PRIMARY KEY (id),
                           UNIQUE (username),
                           UNIQUE (email)
);