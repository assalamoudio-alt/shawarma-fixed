-- Table utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table produits
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table commandes
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table détails commandes
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Insertion des produits de base
INSERT INTO products (name, description, price, category, image_url) VALUES
('Shawarma Poulet', 'Poulet mariné, sauce blanche, légumes frais, pain toasté', 7.99, 'classique', '🍗'),
('Shawarma Boeuf', 'Boeuf épicé, sauce samouraï, frites, salade', 8.99, 'classique', '🥩'),
('Shawarma Mixte', 'Mi-poulet mi-boeuf, sauce cocktail, double portion', 11.99, 'spécial', '🍖'),
('Shawarma Végétarien', 'Falafels, légumes grillés, sauce tahini', 7.99, 'végétarien', '🥙'),
('Shawarma Fromage', 'Poulet, cheddar fondu, sauce fromagère', 9.99, 'spécial', '🧀'),
('Assiette Shawarma', 'Assiette complète avec frites, salade et sauces', 12.99, 'assiette', '🍽️'),
('Falafel Wrap', 'Falafels maison, salade, tomates, sauce blanche', 6.99, 'végétarien', '🧆'),
('Shawarma Spécial', 'Double viande, œuf, fromage, frites dans le sandwich', 13.99, 'spécial', '⭐')
ON CONFLICT DO NOTHING;
