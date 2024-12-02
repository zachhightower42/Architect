-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-12-02 02:54:33.386

-- foreign keys
ALTER TABLE connection
    DROP FOREIGN KEY connection_location;

ALTER TABLE entry
    DROP FOREIGN KEY entry_location;

ALTER TABLE location
    DROP FOREIGN KEY location_world;

ALTER TABLE world
    DROP FOREIGN KEY world_user;

-- tables
DROP TABLE connection;

DROP TABLE entry;

DROP TABLE location;

DROP TABLE user;

DROP TABLE world;

-- End of file.

