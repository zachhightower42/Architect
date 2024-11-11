-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-11-11 02:25:32.561

-- foreign keys
ALTER TABLE entry
    DROP FOREIGN KEY entry_location;

ALTER TABLE location
    DROP FOREIGN KEY location_world;

ALTER TABLE world
    DROP FOREIGN KEY world_user;

-- tables
DROP TABLE entry;

DROP TABLE location;

DROP TABLE user;

DROP TABLE world;

-- End of file.

