# Changes from Status report 5
- Make slides 2 and 3 more readable
	- lines under text, text outlining
- Remove the with mySQL from PHP slide
- Reword "University Turing Servers" and make it "Turing Server"
- Have a short overview of the database
- *Potentially* Remove test and deploy from selected

# Personal notes
- Write a short speech and time it for this portion, keep it 4-5 minutes.
- Write a short outline for what to do during demo portion, 9-10 minutes

# Architect presentation rough draft

Architect is sponsored by Jeffrey Lucas and has been developed by myself, Zachary Hightower

The overall goal of developing Architect is to give writers an easy to use tool for organizing and visualizing their ideas. This is structured as a web application where a user creates a map and customizes it with icons and text. The general idea is shown behind me in the concept art for the project. The right side shows the entries, which will allow the user to make notes and have them associated with a particular location on the map that is shown to the left. 
Our primary users are authors, game developers, and persons who enjoy tabletop roleplaying games. 

The minimum viable product is some form of map creation with customizable locations. An entry system to support taking notes and making sure they stay associated with a particular place. And a PDF export for saving on a local machine or sharing with others. 

Please note in all the evaluation slides, I'm only presenting the benefits for the sake of brevity.

HTML, CSS, and Javascript are the vitally necessary parts of the web development kit for the front end. There are some considerations for modifying it with Ruby on Rails or React, however I am less familiar with their use. 

For Backend communication PHP and Node.js were considered. 

For the Database supporting Architect, we have options for using a relational or non-relational database. Present here are the standouts that I considered using for the project. 

For the final selections. The frontend is kept simple by being just HTML, CSS, and Javascript. PHP is used for the backend communication with the database, as it is the one I'm most familiar with and have been using throughout the semester for other projects. The database type is MySQL, as a relational database seemed the best choice for the strict structure of the project design. Jest and Selenium were used for testing and Architect is deployed on Turing.

The design of the database is straightforward. Users may have many worlds, which may have many locations, which may have many entries. This simple structure and lack of communication between users is designed to protect any sensitive data that may be held in the project and allow for swift development. The int variables should be able to store the amount of a users worlds, locations, entries etc. The varchar variables are used instead of something like text to prevent any attacks against the database that may occur from a user inputting anything truly enormous into the database that would cause issues. 

This is a quick snapshot off the UI design. As you can see we stuck quite close to the original ideas of the project. The only thing here that was not present in the concept art is the tool selector. Otherwise this is a clean representation off the project as it now stands. The icons seen here are the default. 

Now on to the demo
**Demo here**

Are there any questions?



