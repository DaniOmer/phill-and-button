-- Seed data: Exemples de produits pour démarrer
-- À exécuter après les migrations

INSERT INTO products (name, description, price, is_trending, stock, category) VALUES
(
  'Jacket Velours Kaki',
  'Veste en velours côtelé de couleur kaki. Coupe ajustée, doublure intérieure soyeuse. Parfaite pour les soirées fraîches.',
  45000,
  true,
  15,
  'Vestes'
),
(
  'Chemise Oxford Blanche',
  'Chemise en coton oxford premium. Col boutonné, coupe classique. Un indispensable du vestiaire masculin.',
  25000,
  true,
  30,
  'Chemises'
),
(
  'Pantalon Chino Marine',
  'Pantalon chino en coton stretch. Coupe droite, confort optimal. Disponible en plusieurs tailles.',
  35000,
  false,
  25,
  'Pantalons'
),
(
  'Pull Col Roulé Camel',
  'Pull en laine mérinos col roulé. Doux et chaud, parfait pour l''hiver. Maille fine de qualité.',
  55000,
  true,
  12,
  'Pulls'
),
(
  'Blazer Gris Anthracite',
  'Blazer structuré en laine mélangée. Coupe moderne semi-ajustée. Idéal pour le bureau ou les occasions spéciales.',
  85000,
  true,
  8,
  'Vestes'
),
(
  'Polo Piqué Bordeaux',
  'Polo en piqué de coton 100%. Col et poignets côtelés. Une touche d''élégance décontractée.',
  22000,
  false,
  40,
  'Polos'
),
(
  'Jean Selvedge Brut',
  'Jean en denim selvedge japonais. Coupe slim, non délavé. Se patine avec le temps pour un rendu unique.',
  65000,
  true,
  10,
  'Pantalons'
),
(
  'Cardigan Maille Fine',
  'Cardigan boutonné en coton pima. Maille fine et légère. Parfait pour la mi-saison.',
  48000,
  false,
  18,
  'Pulls'
),
(
  'T-shirt Premium Noir',
  'T-shirt en coton peigné extra-doux. Coupe régulière, col rond renforcé. Le basique parfait.',
  15000,
  false,
  50,
  'T-shirts'
),
(
  'Manteau Laine Cachemire',
  'Manteau long en mélange laine et cachemire. Coupe droite élégante. Le must-have de l''hiver.',
  150000,
  true,
  5,
  'Manteaux'
);

-- Note: Pour créer un admin, exécuter après avoir créé un utilisateur via Supabase Auth:
-- UPDATE profiles SET role = 'admin' WHERE id = 'USER_UUID_HERE';
