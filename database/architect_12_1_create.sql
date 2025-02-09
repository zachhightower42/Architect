-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-12-02 02:54:33.386

-- tables
-- Table: connection
CREATE TABLE connection (
    connection_id int  NOT NULL AUTO_INCREMENT,
    connection_start_X float  NOT NULL,
    connection_start_Y float  NOT NULL,
    location_id int  NOT NULL,
    connection_end_X float  NOT NULL,
    connection_end_Y float  NOT NULL,
    CONSTRAINT connection_pk PRIMARY KEY (connection_id)
);

-- Table: entry
CREATE TABLE entry (
    entry_id int  NOT NULL AUTO_INCREMENT,
    entry_name varchar(100)  NOT NULL,
    icon_path_entry varchar(100)  NOT NULL,
    location_id int  NOT NULL,
    entry_body varchar(500)  NOT NULL,
    CONSTRAINT entry_pk PRIMARY KEY (entry_id)
);

-- Table: location
CREATE TABLE location (
    location_id int  NOT NULL AUTO_INCREMENT,
    location_name varchar(100)  NOT NULL,
    icon_path_location varchar(100)  NOT NULL,
    world_id int  NOT NULL,
    position_X float  NOT NULL,
    position_Y float  NOT NULL,
    CONSTRAINT location_pk PRIMARY KEY (location_id)
);

-- Table: user
CREATE TABLE user (
    user_name varchar(50)  NOT NULL,
    email varchar(100)  NOT NULL,
    password varchar(255)  NOT NULL,
    user_id int  NOT NULL AUTO_INCREMENT,
    CONSTRAINT user_pk PRIMARY KEY (user_id)
);

-- Table: world
CREATE TABLE world (
    world_id int  NOT NULL AUTO_INCREMENT,
    world_name varchar(100)  NOT NULL,
    user_id int  NOT NULL,
    icon_path_world varchar(100)  NOT NULL,
    world_desc varchar(300)  NOT NULL,
    CONSTRAINT world_pk PRIMARY KEY (world_id)
);

-- foreign keys
-- Reference: connection_location (table: connection)
ALTER TABLE connection ADD CONSTRAINT connection_location FOREIGN KEY connection_location (location_id)
    REFERENCES location (location_id);

-- Reference: entry_location (table: entry)
ALTER TABLE entry ADD CONSTRAINT entry_location FOREIGN KEY entry_location (location_id)
    REFERENCES location (location_id);

-- Reference: location_world (table: location)
ALTER TABLE location ADD CONSTRAINT location_world FOREIGN KEY location_world (world_id)
    REFERENCES world (world_id);

-- Reference: world_user (table: world)
ALTER TABLE world ADD CONSTRAINT world_user FOREIGN KEY world_user (user_id)
    REFERENCES user (user_id);

-- End of file.

