-- Initialization script for Docker MySQL container
-- This script runs automatically when the MySQL container starts for the first time

USE moviebooking;

-- This file can be used to run the main schema
SOURCE /docker-entrypoint-initdb.d/schema.sql;