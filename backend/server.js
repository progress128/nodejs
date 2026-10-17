const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getDb, saveDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database, Sample Data, and Start Server Sequentially
async function startServer() {
    try {
        const db = await getDb();
        db.run(`CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            cooking_time TEXT,
            category TEXT,
            difficulty TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`);

        const res = db.exec("SELECT COUNT(*) as count FROM recipes");
        const count = res[0].values[0][0];

        if (count === 0) {
            const sampleRecipes = [
                ['Classic Pancakes', 'Flour, Milk, Eggs, Sugar, Butter', 'Mix ingredients and cook on a hot griddle until golden brown.', '20 mins', 'Breakfast', 'Easy'],
                ['Spaghetti Bolognese', 'Spaghetti, Minced Beef, Tomato Sauce, Garlic, Onion', 'Boil pasta. Cook beef with onions and garlic, add tomato sauce, and simmer.', '40 mins', 'Dinner', 'Medium'],
                ['Chicken Caesar Salad', 'Chicken Breast, Lettuce, Croutons, Caesar Dressing, Parmesan', 'Grill chicken, chop lettuce, toss with croutons, dressing, and cheese.', '15 mins', 'Lunch', 'Easy'],
                ['Vegetable Stir Fry', 'Broccoli, Carrots, Bell Peppers, Soy Sauce, Tofu', 'Chop veggies and tofu, stir-fry in a pan with soy sauce.', '25 mins', 'Dinner', 'Easy'],
                ['Beef Burger', 'Burger Buns, Beef Patty, Cheese, Lettuce, Tomato', 'Grill the patty, assemble with buns, cheese, and vegetables.', '20 mins', 'Fast Food', 'Easy'],
                ['Garlic Butter Shrimp', 'Shrimp, Butter, Garlic, Lemon Juice, Parsley', 'Sauté shrimp in butter and garlic, finish with lemon juice and parsley.', '10 mins', 'Dinner', 'Easy'],
                ['Chocolate Chip Cookies', 'Flour, Butter, Sugar, Chocolate Chips, Vanilla', 'Mix ingredients, shape into cookies, and bake at 180°C for 12 minutes.', '25 mins', 'Dessert', 'Medium'],
                ['Tomato Basil Soup', 'Tomatoes, Basil, Garlic, Onion, Cream', 'Simmer tomatoes, garlic, and onions, blend until smooth, and stir in cream.', '30 mins', 'Soup', 'Easy'],
                ['Lemon Herb Grilled Salmon', 'Salmon Fillet, Lemon, Olive Oil, Rosemary, Thyme', 'Marinate salmon in oil and herbs, then grill until flaky.', '20 mins', 'Dinner', 'Medium'],
                ['Avocado Toast', 'Bread, Avocado, Salt, Pepper, Chili Flakes', 'Toast bread, mash avocado on top, and season with salt, pepper, and chili flakes.', '5 mins', 'Breakfast', 'Easy']
            ];
            
            const stmt = db.prepare("INSERT INTO recipes (title, ingredients, instructions, cooking_time, category, difficulty) VALUES (?, ?, ?, ?, ?, ?)");
            sampleRecipes.forEach(recipe => stmt.run(recipe));
            stmt.free();
            await saveDb();
            console.log('Sample records inserted into database.');
        }
        console.log('Successfully connected to the database!');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Server startup error:', err.message);
    }
}

// 1. GET /api/recipes - List all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec("SELECT * FROM recipes");
        if (!result || result.length === 0) return res.json([]);
        
        const columns = result[0].columns;
        const values = result[0].values;
        const rows = values.map(row => {
            let obj = {};
            columns.forEach((col, idx) => obj[col] = row[idx]);
            return obj;
        });
        res.json(rows);
    } catch (err) {
        console.error('API GET /api/recipes Error:', err.message); // <-- Prints exact error to terminal
        res.status(500).json({ error: err.message });
    }
});

// 2. GET /api/recipes/:id - Get single recipe
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const db = await getDb();
        const stmt = db.prepare("SELECT * FROM recipes WHERE id = ?");
        stmt.bind([req.params.id]);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return res.json(row);
        }
        stmt.free();
        res.status(404).json({ message: 'Recipe not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. POST /api/recipes - Create recipe
app.post('/api/recipes', async (req, res) => {
    try {
        const { title, ingredients, instructions, cooking_time, category, difficulty } = req.body;
        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
        }
        const db = await getDb();
        db.run("INSERT INTO recipes (title, ingredients, instructions, cooking_time, category, difficulty) VALUES (?, ?, ?, ?, ?, ?)", 
            [title, ingredients, instructions, cooking_time, category, difficulty]);
        
        const resId = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
        await saveDb();
        res.status(201).json({ id: resId, title, ingredients, instructions, cooking_time, category, difficulty });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT /api/recipes/:id - Update recipe
app.put('/api/recipes/:id', async (req, res) => {
    try {
        const { title, ingredients, instructions, cooking_time, category, difficulty } = req.body;
        const db = await getDb();
        db.run("UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, cooking_time = ?, category = ?, difficulty = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", 
            [title, ingredients, instructions, cooking_time, category, difficulty, req.params.id]);
        
        await saveDb();
        res.json({ message: 'Recipe updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE /api/recipes/:id - Delete recipe
app.delete('/api/recipes/:id', async (req, res) => {
    try {
        const db = await getDb();
        db.run("DELETE FROM recipes WHERE id = ?", [req.params.id]);
        await saveDb();
        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

startServer();