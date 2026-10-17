CREATE DATABASE IF NOT EXISTS recipe_crud;
USE recipe_crud;

CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time VARCHAR(50),
    category VARCHAR(50),
    difficulty VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO recipes (title, ingredients, instructions, cooking_time, category, difficulty) VALUES
('Classic Pancakes', 'Flour, Milk, Eggs, Sugar, Butter', 'Mix ingredients and cook on a hot griddle until golden brown.', '20 mins', 'Breakfast', 'Easy'),
('Spaghetti Bolognese', 'Spaghetti, Minced Beef, Tomato Sauce, Garlic, Onion', 'Boil pasta. Cook beef with onions and garlic, add tomato sauce, and simmer.', '40 mins', 'Dinner', 'Medium'),
('Chicken Caesar Salad', 'Chicken Breast, Lettuce, Croutons, Caesar Dressing, Parmesan', 'Grill chicken, chop lettuce, toss with croutons, dressing, and cheese.', '15 mins', 'Lunch', 'Easy'),
('Vegetable Stir Fry', 'Broccoli, Carrots, Bell Peppers, Soy Sauce, Tofu', 'Chop veggies and tofu, stir-fry in a pan with soy sauce.', '25 mins', 'Dinner', 'Easy'),
('Beef Burger', 'Burger Buns, Beef Patty, Cheese, Lettuce, Tomato', 'Grill the patty, assemble with buns, cheese, and vegetables.', '20 mins', 'Fast Food', 'Easy'),
('Garlic Butter Shrimp', 'Shrimp, Butter, Garlic, Lemon Juice, Parsley', 'Sauté shrimp in butter and garlic, finish with lemon juice and parsley.', '10 mins', 'Dinner', 'Easy'),
('Chocolate Chip Cookies', 'Flour, Butter, Sugar, Chocolate Chips, Vanilla', 'Mix ingredients, shape into cookies, and bake at 180°C for 12 minutes.', '25 mins', 'Dessert', 'Medium'),
('Tomato Basil Soup', 'Tomatoes, Basil, Garlic, Onion, Cream', 'Simmer tomatoes, garlic, and onions, blend until smooth, and stir in cream.', '30 mins', 'Soup', 'Easy'),
('Lemon Herb Grilled Salmon', 'Salmon Fillet, Lemon, Olive Oil, Rosemary, Thyme', 'Marinate salmon in oil and herbs, then grill until flaky.', '20 mins', 'Dinner', 'Medium'),
('Avocado Toast', 'Bread, Avocado, Salt, Pepper, Chili Flakes', 'Toast bread, mash avocado on top, and season with salt, pepper, and chili flakes.', '5 mins', 'Breakfast', 'Easy');