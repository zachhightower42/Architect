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

  fetch('database/world_handler.php?action=get_worlds')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success && Array.isArray(data.worlds)) {
        if (data.worlds.length === 0) {
          // Display welcome message for new users
          const welcomeMessage = document.createElement("div");
          welcomeMessage.classList.add("welcome-message");
          welcomeMessage.innerHTML = `
            <h2>Welcome to Architect!</h2>
            <p>Get started by creating your first world using the form above.</p>
            <p>Each world can contain multiple locations and entries to help organize your ideas.</p>
          `;
          worldsContainer.appendChild(welcomeMessage);
        } else {
          data.worlds.forEach((world) => {
            const worldCard = document.createElement("div");
            worldCard.classList.add("world-card");
            worldCard.setAttribute("data-world-id", world.world_id);
            worldCard.innerHTML = `
              <h3>${world.world_name}</h3>
              <p>${world.world_desc}</p>
              <button class="delete-world-button" onclick="deleteWorld(${world.world_id})">Delete</button>
              <button class="open-world-button" onclick="openWorld(${world.world_id})">Open World</button>
            `;
            worldsContainer.appendChild(worldCard);
          });
        }
      }
    })
    .catch(error => {
      console.error('Error fetching worlds:', error);
    });
    // Place this code within your existing loadWorlds() function
    document.getElementById("create-world-form").addEventListener('submit', function(e) {
        e.preventDefault();
        
        const worldName = document.getElementById("world-name").value;
        const worldDesc = document.getElementById("world-description").value;
        
        const formData = new FormData();
        formData.append('world_name', worldName);
        formData.append('description', worldDesc);

        fetch('database/world_handler.php?action=create_world', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadWorlds();
                this.reset();
            } else {
                alert(data.message || 'Failed to create world');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create world. Please try again.');
        });
    });
};// Handles world deletion with confirmation
function deleteWorld(id) {
    if (confirm("Are you sure you want to delete this world? This action cannot be undone.")) {
        const formData = new FormData();
        formData.append('world_id', id);
        
        fetch('database/world_handler.php?action=delete_world', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
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
  window.location.href = `map_view.html?id=${id}`;
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
    fetch('database/world_handler.php?action=delete_account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId // Using the global userId variable
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = "login_page.html";
      } else {
        alert('Failed to delete account: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while deleting the account');
    });
  }
}