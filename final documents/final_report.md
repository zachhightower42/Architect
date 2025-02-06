# Project Title: Architect

**Student Name:** Zachary Hightower
**Student Email :** zphighto@go.olemiss.edu
**Sponsor:** Jeff Lucas
**Sponsor Email:** jhlucas1@olemiss.edu


---


## **Project Abstract**
Architect is a web-based tool designed to help authors, game masters, and world-builders visualize and develop their narratives by helping them create interactive maps. Architect allows users to create maps that can represent anything from a single town to an entire world. Its primary users are authors, video game developers, and tabletop enthusiasts, who require a way to visually organize and build out their ideas.

The motivation behind Architect stems from a passion for fantasy maps in books and RPGs. The project goal is to provide a tool that assists in organizing complex narratives in a way that is easy to follow. Architect allows its users to visually connect locations, add detailed entries, and customize the appearance of their worlds. Architect aims to streamline the creative process by providing an intuitive interface that caters to visual organization of a user's world.

---

## **Project Report**

The project's baseline goals have been realized. Though there are stretch goals I would have enjoyed implementing in the project, time and other responsibilities made that difficult enough I would have had to sacrifice in other areas of my academic career to meet those further goals. Originally, there were more quality of life features and more work intensive requirements that I set for myself. I wanted to implement some form of communication between users, themes for users to choose from, text styling options, and user profiles. My sponsor, Jeff Lucas, cautioned me to cut back a little on the project's goals so that they would be more manageable in the given time. I deeply appreciate that, because balancing the development of Architect with my other responsibilities in this final semester has been hectic. 

The development of the project was, for the most part, smooth. The project went well with regard to early establishment of a workable prototype in HTML, CSS, and Javascript that used session storage methods. That gave me a good launchpad into integrating the backend and database once I reached that stage of the product development.  Though it did run into significant issues regarding overall time, as mentioned prior. If I were able to redo the project from the beginning I would focus more heavily on getting the groundwork done and learning database architecture as early as possible so that the design of the project could be better realized without having to go through as many different iterations of PHP. Learning how to integrate a database into the project was the largest hurdle to overcome, and I entered into that part of the development with a level of confidence that did not match my overall skill. Though, thankfully, I was able to work hard and produce a functional product which can be built on in the future. 

I checked in with my sponsor Jeff Lucas regarding the project's status as our schedules permitted. This was not as often as I would have liked, as both of us were busy for a significant portion of the semester, and the times that we were free often did not align. However, as I was taking a class that my sponsor taught, I made sure to briefly meet with him following it to keep him up to date on the status of the project. I also made sure to deliver documents to him promptly in order to get his invaluable feedback. 

After going through the work of creating Architect, I have a greater appreciation for how difficult it is to fully develop a project and all the work that goes into one. I've especially come to understand how difficult it can be trying to communicate technical information effectively and fully explain things with proper documentation. I realize that all of the additional work in documenting processes and providing frequent updates to sponsors and stakeholders is important. If I'm part of a development team being paid by these individuals, they deserve to know what their money is actually getting them. I also come away from this project knowing more about how to integrate a database and what tools are available to me when taking the steps to create something. After working on this project and managing to realize the minimum viable product, I feel that it would not be so difficult for me to do again, especially with a full team to help manage my weak points and spread the work out. 

Further development of Architect would focus on adding more customization options and support for user interaction. The system needs more styles and themes so that a user can further customize the map so that they can more fully realize the full breadth of their ideas. Going along with that theme, user ability to upload their own custom icons is necessary. Though, in giving users these privileges, more work will be necessary in moderating what they are able to do with the service. Especially if users are given the ability to share their designs with each other and communicate on something like a basic message board or SMS service. Any development of Architect from this point on will entail necessary secondary features to be developed with it so that the service remains reasonably secure and well moderated.


---



*No changes were made to the following Design Specification Document*
## **Design Specification** 

### Project Title: Architect

**Student Name:** Zachary Hightower
**Student Email :** zphighto@go.olemiss.edu
**Sponsor:** Jeff Lucas
**Sponsor Email:** jhlucas1@olemiss.edu


### **Project Overview**

Architect is a web-based tool designed to help authors, game masters, and world-builders visualize and develop their narratives through interactive maps. Inspired by the maps found in fantasy novels and tabletop role-playing games, Architect allows users to create maps of any scale that can represent anything from a single town to an entire world. The primary users are authors, video game developers, and tabletop enthusiasts, who require a visual and organized way to structure their ideas and worlds.

The motivation behind Architect stems from a passion for fantasy maps and a desire to provide a tool that assists in organizing complex narratives and worlds. Architect allows its users to visually connect locations, add detailed entries, and customize the appearance of their worlds. Architect aims to streamline the creative process by providing an intuitive interface that caters to visualization and documentation of a user's world.

### User Requirements

The minimum viable product (MVP) for the Architect project is a web application that enables users to create a map of interconnected locations. Users can organize these locations and customize their appearance. Users may also add entries to locations. Entries are small documents that allow a user to jot down details of that particular location. Locations and entries will also allow for user organization. 

Architect is designed to cater to one particular user, its builders. Builders, the primary users, include authors, tabletop enthusiasts, and video game developers, who will use the application to visualize and structure their ideas.

Administrators will oversee the system but will not truly be users. Their primary role will be database moderation.

- **Builder User Stories:**
  - As a builder, I want to create a map to visually organize and structure my ideas.
  - As a builder, I want to input entries to keep track of details about my world.
  - As a builder, I want to format entries so that they are pleasant to read.
  - As a builder, I want to organize my locations and entries into groups so they are easily identifiable.
  - As a builder, I want to customize the appearance of locations so that my world looks unique and inspiring.
  - As a builder, I want to export my map as an image or PDF so that I can share it with others.

### Design Choices

When considering the development of the Architect project, several technology options and frameworks can be utilized to achieve the MVP. Below are potential design choices, along with their advantages and disadvantages:
### **Frontend**
#### HTML, CSS, and JavaScript
- **Advantages**: Well-suited for web applications and widely supported across different platforms. Extensive documentation and community support. Familiarity from university classes and personal projects. Numerous libraries and tools available to expedite development.
- **Disadvantages**:  Limited experience with integrating databases. Potential performance bottlenecks with large datasets or high user traffic. Security challenges inherent to web applications.
#### Ruby on Rails
- **Advantages**: Convention over configuration approach, which speeds up development. Strong community support and a wealth of libraries (gems) for added functionality. Built-in security features and easy integration with databases.
- **Disadvantages**: Steeper learning curve for those unfamiliar with Ruby. May be overkill for smaller projects or simple applications. Not familiar to project developer. 
#### React
- **Advantages**:  Component-based architecture, promoting reusability and maintainability. Large ecosystem with a variety of libraries and tools. Strong community support and frequent updates.
- **Disadvantages**: Requires a build process, which can add complexity. Learning curve for those new to JavaScript frameworks. Not familiar to project developer. 
### **Backend**
#### PHP
- **Advantages**: Widely used for server-side scripting with extensive documentation and community support. Easy integration with various databases, including MySQL. Familiarity from coursework and previous projects.
- **Disadvantages**: Can lead to less organized code if not structured properly. Performance issues with very high traffic applications.
#### Node.js
- **Advantages**: Non-blocking, event-driven architecture suitable for I/O-heavy operations. Large ecosystem with npm, providing numerous libraries and tools. Strong community support and frequent updates.
- **Disadvantages**: Callback-heavy code can become difficult to manage.  Less efficient for CPU-intensive operations.
### **Database**
#### MySQL
- **Advantages**: Structured data management, strong support for complex queries, and extensive documentation. More familiar to developer.
- **Disadvantages**: Less flexible for unstructured data and scaling challenges with large datasets.
#### Firebase
- **Advantages**: Flexibility with unstructured data, better scalability, and JSON-like document storage.
- **Disadvantages**: Consistency issues, limited support for complex queries, and less robust documentation. Less familiar to developer.
#### MongoDB
- **Advantages**: Highly flexible schema design, excellent for handling large volumes of unstructured data, and strong community support.
- **Disadvantages**: May require more complex query handling and less efficient for complex transactions compared to relational databases. Less familiar to developer.

### Design Selected

For the development of the Architect project, I am working with HTML, CSS, JavaScript, PHP, and MySQL as the primary technologies. These choices are based on my familiarity and experience with these tools, most of which I have used in previous projects.

#### Technologies Chosen

- **HTML, CSS, and JavaScript**: These are the foundational technologies for web development. I have previously used them to create small web projects, including a site for creating custom TTRPG sheets for a homebrew system and displaying my writing. My experience with these technologies will allow me to efficiently develop the front-end of the application and ensure a smooth user experience.

- **PHP and MySQL**: My choice of PHP and MySQL is influenced by the coursework I have completed this year, which has provided me with a solid understanding of these technologies. PHP will be used for server-side scripting, while MySQL will serve as the relational database to store user data and map information. The structured nature of MySQL aligns well with the project's requirements for organizing and linking data, such as user-created maps and entries.

**ERD**
![[Pasted image 20241105190050 1.png]]

#### Software Structure

The software system will be structured using a Model-View-Controller (MVC) architecture. This will help separate the application's logic, user interface, and data management, making the system more modular and easier to maintain. The major components of the system will include:

- **Model**: This component will handle data management and business logic. It will interact with the MySQL database to perform CRUD (Create, Read, Update, Delete) operations on user data and map information.

- **View**: The view will be responsible for rendering the user interface using HTML, CSS, and JavaScript. It will provide users with interactive elements to create and manage maps and entries.

- **Controller**: The controller will act as an intermediary between the model and the view. It will process user inputs, update the model, and refresh the view as necessary.

#### Database Design

The database will be designed using MySQL, with tables to store user information, maps, locations, and entries. The relational structure will allow for efficient querying and data retrieval, ensuring that users can quickly access and manage their content.

#### External Applications Libraries and Frameworks

- **Jest**: Used for unit testing JavaScript components, providing a simple and efficient framework for writing and running tests.
- **Selenium**: Used for end-to-end testing, simulating user interactions with the application to ensure all components work together properly.

#### User Interfaces/Interactions

The Architect application is designed to provide an intuitive and interactive user experience for builders. The user interface is structured to allow easy navigation and efficient interaction.

### Use Case Diagram
#### Actors

**Builder**

- **Description**: The primary user of the Architect application. Builders are individuals such as authors, tabletop enthusiasts, and video game developers who use the application to visualize and structure their ideas by creating interactive maps.
    
- **Responsibilities**:
    
    - Create and manage maps.
    - Add and edit locations on maps.
    - Input and format entries for locations.
    - Organize locations and entries into groups.
    - Customize the appearance of maps, locations, and entries.
    - Export maps as images or PDFs for sharing.

#### Use Cases

**1. Create World**

- **Description**: Allows builders to create new maps to visually organize and structure their ideas.
    
- **Flow of Events**:
    
    1. Builder enters name and a short description to given sections on world management page. 
    ![[Pasted image 20241108192530.png]]
    3. Builder clicks create world button. 
    4. System generates a new world with a unique id and displays it on the screen.

**2. Add Locations**

- **Description**: Enables builders to add new locations to their maps, representing various places within their narratives or worlds.
    
- **Flow of Events**:
    
    1. Builder opens an existing world.
    2. On the map interface, the builder selects the "Add Location" tool.
    ![[Pasted image 20241108192821.png]]
    4. Builder clicks desired spot on the map to place a new location marker.
    5. System prompts for location details (e.g., name, type, description).
    ![[Pasted image 20241108192958.png]]
    7. Builder inputs the location information.
    8. System saves and displays new location on the map.
	![[Pasted image 20241108193032.png]]

**3. Add Entries**

- **Description**: Allows builders to add detailed textual information to specific locations on the map, enriching the narrative and providing depth.
    
- **Flow of Events**:
    
    1. Builder selects a location on the map.
    2. Builder clicks "Enter Location" from the tool menu and clicks a location
    3. System opens an entry viewer/editor.
    ![[Pasted image 20241108193240.png]]
    5. Builder inputs and formats the entry content.
    ![[Pasted image 20241108193541.png]]
    7. System associates the entry with the selected location.

**4. Customize Appearance**

- **Description**: Permits builders to personalize the visual aspects of their locations, and entries to reflect the unique styles and aesthetics of their worlds.
    
- **Flow of Events**:
    
    1. Builder accesses the tool from the menu.
    2. Builder clicks on a location.
    3. Builder selects from predefined assets or uploads custom images.
    4. System applies selected customizations.
    5. Changes are saved and reflected in real-time.

**5. Organize Locations and Entries**

- **Description**: Enables builders to group locations and entries into categories or hierarchies, improving organization and navigation within complex maps.
    
- **Flow of Events**:
    
    1. Builder selects locations or entries to organize.
    2. Builder creates a new group or selects an existing one.
    3. Builder clicks and drags entries to arrange them or place them into the groups. 

**6. Export Map**

- **Description**: Allows builders to export their maps in various formats for sharing, printing, or integrating into other media.
    
- **Flow of Events**:
    
    1. Builder selects the "Export" option from the map page.
    2. System presents export options (Image, PDF).
    3. Builder selects the desired format and configures settings (resolution, area to export).
    4. System generates the export file.
    5. Builder downloads file to their device.

**7. Login/Register**

- **Description**: Enables users to create an account or log in to access and manage their maps and entries securely.
    
- **Flow of Events**:
    
    - **Register**:
        1. User selects the "Register" option.
        2. System prompts for registration details (username, email, password).
        3. User provides the required information.
        4. System validates and creates a new user account.
    - **Login**:
        1. User selects the "Login" option.
        2. System prompts for login credentials.
        3. User enters their username/email and password.
        4. System authenticates the user and grants access.
### Transition Structure

- **World Creation Workflow**
  - Start at the dashboard → Select "Create World" → Define map parameters → Add locations → Save changes automatically.

- **Entry Addition Workflow**
  - Select location on map → Click "Enter location" → Input entry details → Format entry → Save entry.

### User Interaction Details

- **Builders**: Builders interact with the map through a drag-and-drop interface, allowing them to easily place and organize locations. They can access entry details by clicking on location markers and can customize entries through a text editor.

The user interface is designed to be responsive and accessible. It aims to be clear about how it wants a user to interact with it to let them quickly get things done so they have the best possible experience. 

### Development Environment

- **Hardware**: Development is conducted on a personal laptop and desktop tower, both equipped with sufficient processing power and memory to handle web development tasks and testing.

- **Software**: 
  - **VS Code**: Visual Studio Code is used as the primary code editing tool. It offers a wide range of extensions and features that aid in development.
  - **Operating System**: Linux is chosen for its open-source, stability, and strong support for development.
- **Version Control**:
   - **GitHub**: GitHub is used for version control to manage changes to the codebase. It allows for effective collaboration, tracking of changes, and maintains a history of the project development.

- **Testing Tools**: 
  - **Jest**: I plan to use Jest for unit testing JavaScript components. It promises a simple and efficient framework for writing and running tests.
  - **Selenium**: Selenium is going to be used for end to end testing. It will help simulate user interactions with the application to check that all components work together properly.

This development environment is chosen to support the implementation and testing of the Architect project effectively. The Linux, VS Code, and GitHub allows for an efficient workflow and robust version control, essential for successful project development. The testing tools ensure that the application is reliable and meets the its requirements.


### Deployment Environment

The deployment environment for the Architect project will be the Turing servers at the University of Mississippi. The web application, which includes HTML, CSS, and JavaScript files, will be deployed on these servers. The database will also be hosted in the individual database section allocated for the project on the Turing servers. This setup provides a stable, accessible environment for the application.

Frontend development initially took place on a local machine to allow for rapid prototyping and testing. Once the core features were stable, development transitioned to the Turing Host to facilitate full deployment and integration with the backend systems.

### Test Plan

#### Unit Testing

- **Objective**: To verify that individual components of the application function correctly in isolation.
- **Components to Test**:
  - Map creation and management functions.
  - Entry input and formatting.
  - User authentication and authorization.
  - Customization options for locations and entries.
- **Tools**: JavaScript testing frameworks (Jest) for automated unit tests.
- **Approach**: Write test cases for each function and method to ensure they produce the expected output for a variety of inputs.

#### Integration Testing

- **Objective**: To ensure that different components of the application work together as expected.
- **Focus Areas**:
  - Interaction between the map and entry systems.
  - Data flow between the frontend and the database.
  - User interface interactions and transitions.
- **Tools**: Testing libraries (Selenium) for end-to-end testing.
- **Approach**: Develop test scenarios that mimic real-world use to verify that integrated components function.

#### System Testing

- **Objective**: Validate the complete product.
- **Scope**:
  - Overall application performance under various conditions.
  - Security testing to ensure data protection and unauthorized access prevention.
  - Usability testing to assess user experience and interface intuitiveness.
- **Tools**: Use automation (Selenium) to test how the system performs under regular use conditions
- **Approach**: Conduct thorough testing sessions with a focus on identifying any system-wide issues or bottlenecks.

#### User Acceptance Testing (UAT)

- **Objective**: To confirm that the application meets the requirements and expectations of the end-users.
- **Participants**: Involve a group of target users, including authors, game developers, and historians.
- **Process**:
  - Provide users with scenarios and tasks to complete using the application.
  - Collect feedback on functionality, ease of use, and overall satisfaction.
- **Outcome**: Use feedback to make final adjustments and improvements before the official release.

### Updated Project Timeline

- **November 4 – November 10, 2024**: Integration of database to project frontend and deployment for first round of user testing. 
- **November 8, 2024:** Due date for Design Specification document.
- **November 11 – November 24, 2024**: Final testing, refinement of features, and ensuring the application meets or exceeds the minimum viable product.
- **December 1, 2024**: Due date for User Manual.
- **December 2 – December 6, 2024**: Final Oral Presentations.
- **December 8, 2024**: Due date for Final Report & Product Delivery.
- **December 9 – December 11, 2024**: Exit Interviews, Exit Survey & Sponsor Evaluation Form due at Interview.

### Bibliography

1. **Websites with Code Examples and Tutorials:**
   - [W3Schools](https://www.w3schools.com) - A comprehensive  programming knowledge resource.
   - [MDN Web Docs](https://developer.mozilla.org) - Provides detailed documentation and examples for web development technologies.
   - [Stack Overflow](https://stackoverflow.com) - Community driven platform for asking and answering programming questions.
   - [Geeks for Geeks](https://www.geeksforgeeks.org/) -  Another site structured in the same ways as W3Schools as a comprehensive programming knowledge resource.  

2. **Courses with Direct Impact:**
   - **CSCI 387:** Course covering PHP and MySQL relational database knowledge, along with how to work with a group and handle project development. (Currently enrolled, but have not completed)
   - **354 Winter Intersession:** Course focused on further developing knowledge of HTML, CSS, and JavaScript for the development of websites and web apps. 

 3. **Reference Material and Code:**  
   - Pulled some small structural pieces from the projects done during winter intersession 354
		*E.g*. Folder structure, compartmentalization style, some CSS rules 


---


## Final Oral Presentation Slides and Other Materials

### Slides
