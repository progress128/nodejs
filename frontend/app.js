const API_URL = 'http://localhost:3000/api/recipes';

const recipeForm = document.getElementById('recipe-form');
const recipeTableBody = document.getElementById('recipe-table-body');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const recipeIdInput = document.getElementById('recipe-id');

// 1. Fetch and display all recipes on page load
async function fetchRecipes() {
    try {
        const response = await fetch(API_URL);
        const recipes = await response.json();
        
        recipeTableBody.innerHTML = '';
        if (recipes.length === 0) {
            recipeTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No recipes found.</td></tr>`;
            return;
        }

        recipes.forEach(recipe => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recipe.id}</td>
                <td><strong>${recipe.title}</strong></td>
                <td>${recipe.category || '-'}</td>
                <td>${recipe.cooking_time || '-'}</td>
                <td>${recipe.difficulty || '-'}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editRecipe(${recipe.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteRecipe(${recipe.id})">Delete</button>
                </td>
            `;
            recipeTableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error fetching recipes:', err);
    }
}

// 2. Handle Form Submit (Create or Update)
recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = recipeIdInput.value;
    const recipeData = {
        title: document.getElementById('title').value,
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value,
        cooking_time: document.getElementById('cooking_time').value,
        category: document.getElementById('category').value,
        difficulty: document.getElementById('difficulty').value
    };

    try {
        if (id) {
            // Update existing recipe (PUT)
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData)
            });
        } else {
            // Create new recipe (POST)
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipeData)
            });
        }
        
        resetForm();
        fetchRecipes();
    } catch (err) {
        console.error('Error saving recipe:', err);
    }
});

// 3. Load recipe data into form for editing
async function editRecipe(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const recipe = await response.json();

        recipeIdInput.value = recipe.id;
        document.getElementById('title').value = recipe.title;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('cooking_time').value = recipe.cooking_time || '';
        document.getElementById('category').value = recipe.category || '';
        document.getElementById('difficulty').value = recipe.difficulty || 'Easy';

        formTitle.innerText = 'Edit Recipe';
        submitBtn.innerText = 'Update Recipe';
        cancelBtn.style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        console.error('Error loading recipe for edit:', err);
    }
}

// 4. Delete a recipe
async function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchRecipes();
        } catch (err) {
            console.error('Error deleting recipe:', err);
        }
    }
}

// 5. Reset Form State
function resetForm() {
    recipeForm.reset();
    recipeIdInput.value = '';
    formTitle.innerText = 'Add New Recipe';
    submitBtn.innerText = 'Save Recipe';
    cancelBtn.style.display = 'none';
}

// Load recipes when page opens
fetchRecipes();