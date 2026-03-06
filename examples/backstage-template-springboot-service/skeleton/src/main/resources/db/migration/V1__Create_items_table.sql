-- V1__Create_items_table.sql
-- Initial schema for items table

CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for common queries
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_items_active ON items(active);

-- Add some initial data
INSERT INTO items (name, description, active) VALUES 
    ('Sample Item 1', 'This is a sample item for demonstration', TRUE),
    ('Sample Item 2', 'Another sample item', TRUE),
    ('Inactive Item', 'This item is inactive', FALSE);
