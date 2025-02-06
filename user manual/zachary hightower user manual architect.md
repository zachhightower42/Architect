
# Architect User Manual

## Table of Contents
- Dependencies ~ 1-2
- Installation ~ 1-2
- Builder Guide ~ 2-12
- Administration and Maintenance ~ 12-13

## Dependencies

### Operating Environment
- Web browser (Chrome, Firefox, Safari, or Edge recommended)
- Internet connection
- Screen resolution of 1024x768 or higher recommended

### Technical Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server
- Modern web browser with JavaScript enabled

### Database Structure

Architect is meant to be used with MySQL. The provided database create and drop files are written for a MySQL database and are in the repository in the database directory.


### Current Hosting
The application is currently hosted on the University's Turing server.

## Installation

1. Clone the repository from GitHub
   https://github.com/zachhightower42/Architect
2. Install required dependencies:
   - PHP 7.4+
   - MySQL 5.7+
3. Configure the selected web server to point to the project directory
4. Import the database files from the GitHub repository
5. Update configuration files in `connec_scrip.php` with your database credentials
6. Use the `architect_create.sql`  file to create the database 

## Usage Guide

### User Types
Architect serves one type of user:

**Builders** - Authors, game devs, and TTRPG players who create and manage maps and entries.

### Builder Guide

#### 1. Login and Signup
1. Navigate to the main login page
   ![[Pasted image 20241130154336.png]]
2. For existing users:
   - Enter your username and password
   - Click "Login" to access your account
3. For new users:
   - Click "Sign Up" button
     ![[Pasted image 20241130154815.png]]
   - Fill in required information and click submit
   - Login with your new credentials

#### 2. Creating a New World
1. Navigate to the world management page
![[Pasted image 20241130122921.png]]
2. Enter the world name and description
   ![[Pasted image 20241130123026.png]]
3. Click "Create World" button
   ![[world example.png]]
   

#### 3. Adding Locations
1. Open your created world
   ![[Pasted image 20241130123257.png]]
2. Select the "Create a Location" tool
   ![[create location tool.png]]
3. Click on the map where you want to place the location
4. Fill in location details in the prompt
   ![[create location dialog box.png]]
5. Add the location
   ![[add location click show.png]]
   ![[meadowbrook create location example.png]]

#### 4. Connecting Locations

1. Select the "Connect Locations" tool
   ![[connect locations 1.png]]
2. Click on two separate locations to connect them
   ![[connect locations two.png]]

#### 5. Editing a Location

1. Select the "Edit Location" tool
2. Click and drag the icon to move the location around the map
3. Click on the name of the location to open a dialog box for changing it
#### 6. Managing Entries
1. Click the "Enter Location" tool
2. Select the location you want to enter
3. Use the editor that opens up to view or modify your entries for that location
   ![[location entry 1.png]]

#### 7. Customizing Location Appearance
1. Select the "Customize" tool
2. Click on a location's icon
   ![[customize location 1.png]]
   ![[customize location 2.png]]
3. Select one of the available icons
![[customize location 3.png]]

#### 8. Deleting Locations
1. Select the "Delete Location" tool
2. Click on the Icon of the location you want to delete.
   ![[delete location 1.png]]
![[delete location 2.png]]
#### 9. Exporting Maps
1. Click the "Export" button in the navbar
2. Download your exported file

#### 10. Deleting a World
1. Navigate to the world management screen
2. Find the world you want to delete
3. Click the delete world button

#### 11. Deleting an Account
1. Find the delete account option in the navigation bar of the world management screen
2. Click the button, and then confirm that you wish to delete your account

## Administration and Maintenance

### Routine Maintenance
1. Regular database backup
2. System updates and security patches

### Moving to a New Host
To migrate the application to a new host:
1. Export the MySQL database
2. Transfer all application files
3. Configure the new web server
5. Test all functionality on the new host
6. Delete all data from original webhost
### Enhancements and Extensions

- **Advanced Customization**: Introduce more customization options for locations and maps, such as custom icons, themes, and styles, to provide a unique visual experience.
    
- **Expanded Export Options**: Offer additional export formats (e.g., SVG, JSON) and integration with publishing tools to facilitate sharing and printing.
    
- **User Community Features**: Implement features that allow builders to share their worlds with others, comment, and collaborate.
    
- **Performance Optimization**: Optimize the application to handle larger maps and datasets efficiently, ensuring smooth performance as builders expand their worlds.
    
- **Localization and Accessibility**: Provide support for multiple languages and ensure the application is accessible to users with disabilities by adhering to accessibility standards.
### Troubleshooting
Common issues and their solutions:
- Map not loading: Clear browser cache and refresh
- Unable to save: Check database connection
- Export failing: Verify file permissions
- Login issues: Reset browser cookies

For technical support or questions, contact the system administrator at the following email address:

**Zachary Hightower** - zphighto@go.olemiss.edu
