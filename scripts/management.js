/**
 * Management Script (management.js)
 * 
 * This script handles user authentication and world management functionality including:
 * - User sign out and account deletion
 * - World creation, loading, deletion, and opening
 * - Session management and user verification
 * - Form submission handling for world creation
 */

// Global variable for storing user ID
let userId;

// Handles user sign out by redirecting to login page
function signOut() {
  window.location.href = "login_page.html";
}

// Loads and displays all worlds belonging to the current user
function loadWorlds() {
  const worldsContainer = document.getElementById("worlds-container");
  worldsContainer.innerHTML = "";

  // Fetch worlds from the server and create display cards
  fetch('database/world_handler.php?action=get_worlds')
    .then(response => response.json())
    .then(worlds => {
      worlds.forEach((world) => {
        const worldCard = document.createElement("div");
        worldCard.classList.add("world-card");
        worldCard.setAttribute("data-world-id", world.world_id);
        worldCard.innerHTML = `
          <h3>${world.world_name}</h3>
          <p>${world.description}</p>
          <button class="delete-world-button" onclick="deleteWorld(${world.world_id})">Delete</button>
          <button class="open-world-button" onclick="openWorld(${world.world_id})">Open World</button>
        `;
        worldsContainer.appendChild(worldCard);
      });
    })
    .catch(error => {
      console.error('Error fetching worlds:', error);
    });
}

// Event listener for world creation form submission
document.getElementById("create-world-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const worldName = document.getElementById("world-name").value;
  const worldDescription = document.getElementById("world-description").value;

  // Send new world data to the server
  fetch('database/world_handler.php?action=create_world', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      world_name: worldName,
      description: worldDescription,
      user_id: userId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      loadWorlds();
      document.getElementById("world-name").value = "";
      document.getElementById("world-description").value = "";
    } else {
      console.error('Error creating world:', data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

// Handles world deletion with confirmation
function deleteWorld(id) {
  if (confirm("Are you sure you want to delete this world? This action cannot be undone.")) {
    fetch(`database/world_handler.php?action=delete_world`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ world_id: id })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loadWorlds();
      } else {
        console.error('Error deleting world:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

// Opens selected world in a new page
function openWorld(id) {
  window.location.href = `world.html?id=${id}`;
}

// Initialize page by fetching user session and loading worlds
window.onload = function() {
  fetch('database/get_session.php')
    .then(response => response.json())
    .then(data => {
      userId = data.user_id;
      loadWorlds();
    })
    .catch(error => {
      console.error('Error fetching user session:', error);
      window.location.href = 'login_page.html';
    });
};

// Handles user account deletion with confirmation
function deleteAccount() {
  if (confirm("Are you sure you want to delete your account and everything you've made?")) {
    fetch('database/login_handler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `action=Delete User`
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = "login_page.html";
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}