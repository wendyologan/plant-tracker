// Plant collection array to store plant objects
let plants = JSON.parse(localStorage.getItem("plants")) || [];
let graveyardPlants = JSON.parse(localStorage.getItem("graveyardPlants")) || [];

const plantForm = document.getElementById("plant-form");
const plantNameInput = document.getElementById("plant-name");
const plantNicknameInput = document.getElementById("plant-nickname");
const plantImageInput = document.getElementById("plant-image");
const savePlantButton = document.getElementById("save-plant-btn");
const plantList = document.getElementById("plant-list");
const graveyardList = document.getElementById("graveyard-list");
const errorMessage = document.getElementById("error-message");
const imagePreview = document.getElementById("image-preview");

let isEditing = false;
let editIndex = null;

// Function to render graveyard list
function renderGraveyardList() {
  const graveyardList = document.getElementById("graveyard-list");

  if (graveyardList) {
    graveyardList.innerHTML = ""; // Clear previous contents before rendering

    graveyardPlants.forEach((plant, index) => {
      const row = document.createElement("tr");

      const imageCell = document.createElement("td");
      const plantImage = plant.image
        ? `<img src="${plant.image}" alt="Plant Image" class="plant-image" style="width: 60px; height: 60px; object-fit: cover;">`
        : `<span class="placeholder">No Image</span>`;
      imageCell.innerHTML = plantImage;

      const nameCell = document.createElement("td");
      nameCell.textContent = plant.name;

      const nicknameCell = document.createElement("td");
      nicknameCell.textContent = plant.nickname || "N/A";

      row.appendChild(imageCell);
      row.appendChild(nameCell);
      row.appendChild(nicknameCell);

      graveyardList.appendChild(row);
    });
  } else {
    console.error("graveyardList element not found");
  }
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const toggleFormBtn = document.getElementById("toggle-form-btn");
  
  // Check if the form toggle button exists
  if (toggleFormBtn) {
    toggleFormBtn.addEventListener("click", () => {
      plantForm.style.display = plantForm.style.display === "none" ? "block" : "none";
    });
  } else {
    console.warn('Element with id "toggle-form-btn" not found!');
  }

  // Initial render for both the plant list and the graveyard list
  renderPlantList();
  renderGraveyardList();
});

// Image preview logic
document.addEventListener("DOMContentLoaded", () => {
  const plantImageInput = document.getElementById("plant-image");
  const imagePreview = document.getElementById("image-preview");

  if (plantImageInput) {
    plantImageInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const fileReader = new FileReader();

      if (file) {
        fileReader.onload = function(e) {
          imagePreview.style.display = 'block';
          imagePreview.src = e.target.result;
        };
        fileReader.readAsDataURL(file);
      } else {
        imagePreview.style.display = 'none';
        imagePreview.src = '';
      }
    });
  } else {
    console.error('Element with id "plant-image" not found');
  }
});

// Event listener for the save button (only for plant page)
if (savePlantButton) {
  savePlantButton.addEventListener("click", () => {
    const plantName = plantNameInput.value.trim();
    const plantNickname = plantNicknameInput.value.trim();
    const plantImage = plantImageInput.files[0];

    if (!plantName) {
      plantNameInput.classList.add("error");
      errorMessage.style.display = "block";
      return; 
    }

    const savePlant = (base64Image) => {
      const plant = {
        name: plantName,
        nickname: plantNickname,
        image: base64Image || (isEditing ? plants[editIndex].image : null)
      };

      if (isEditing) {
        plants[editIndex] = plant;
        isEditing = false;
        editIndex = null;
        savePlantButton.textContent = "Save Plant";
      } else {
        plants.push(plant);
      }

      saveToLocalStorage();

      plantForm.reset();
      plantNameInput.classList.remove("error");
      errorMessage.style.display = "none";
      plantForm.style.display = "none";

      renderPlantList();
    };

    if (plantImage) {
      const reader = new FileReader();
      reader.onload = function(event) {
        savePlant(event.target.result); 
      };
      reader.readAsDataURL(plantImage);
    } else {
      savePlant(); 
    }
  });
}

// Function to render the plant list
function renderPlantList() {
  plantList.innerHTML = "";

  plants.forEach((plant, index) => {
    const row = document.createElement("tr");

    const imageCell = document.createElement("td");
    const plantImage = plant.image
      ? `<img src="${plant.image}" alt="Plant Image" class="plant-image" style="width: 60px; height: 60px; object-fit: cover;">`
      : `<span class="placeholder">No Image</span>`;
    imageCell.innerHTML = plantImage;

    const nameCell = document.createElement("td");
    nameCell.textContent = plant.name;

    const nicknameCell = document.createElement("td");
    nicknameCell.textContent = plant.nickname || "N/A";

    const actionsCell = document.createElement("td");
    actionsCell.innerHTML = `
      <button class="edit-btn" onclick="editPlant(${index})">
        <img src="edit-icon.png" alt="Edit" style="width: 20px; height: 20px;">
      </button>
      <button class="delete-btn" onclick="deletePlant(${index})">
        <img src="delete-icon.png" alt="Delete" style="width: 20px; height: 20px;">
      </button>
      <button class="graveyard-btn" onclick="moveToGraveyard(${index})">
        <img src="graveyard-icon.png" alt="Graveyard" style="width: 20px; height: 20px;">
      </button>
    `;

    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(nicknameCell);
    row.appendChild(actionsCell);

    plantList.appendChild(row);
  });
}

// Function to save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("plants", JSON.stringify(plants));
  localStorage.setItem("graveyardPlants", JSON.stringify(graveyardPlants));
}

// Initial render for both the plant list and the graveyard list
renderPlantList();
renderGraveyardList();
