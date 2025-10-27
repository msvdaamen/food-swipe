-- +goose Up
-- +goose StatementBegin
CREATE TABLE users (
    id uuid DEFAULT uuidv7() PRIMARY KEY,
    authId text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    firstName text NOT NULL,
    lastName text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE users;
-- +goose StatementEnd
