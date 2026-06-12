-- Remplit la table `produits` avec le catalogue initial de biscuits
-- (ceux qui etaient codes en dur avant le passage a Supabase).
-- A coller dans l'editeur SQL de Supabase, une seule fois.

insert into produits (name, description, category, price, image, badge, available, allergens) values
('Palets pur beurre', 'La recette originale depuis 1954, pur beurre de qualité', 'Classiques', 4.50, 'https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111', 'Bestseller', true, '["gluten", "lait", "œufs"]'),
('Sablés pur beurre', 'Fondants en bouche, fabriqués avec du beurre sélectionné', 'Classiques', 5.00, 'https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111', null, true, '["gluten", "lait"]'),
('Lunettes pur beurre', 'Sablés en forme de lunettes, garnis de confiture', 'Classiques', 5.90, 'https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111', 'Favori', true, '["gluten", "lait", "œufs"]'),
('Financiers pur beurre', 'Moelleux aux amandes, beurre noisette, recette du Champion du Monde', 'Moelleux', 5.50, 'https://biscuiterie-louvat.com/cdn/shop/files/DSC_1060-2_300x.jpg?v=1747385392', null, true, '["gluten", "lait", "fruits à coque"]'),
('Tuiles aux amandes', 'Fines et croquantes, amandes effilées dorées au four', 'Croquants', 5.00, null, null, true, '["gluten", "lait", "fruits à coque"]'),
('Rochers Noix de Coco', 'Cœur fondant, noix de coco, blanc d''œuf', 'Meringues', 3.90, 'https://biscuiterie-louvat.com/cdn/shop/files/Rocher_noix_de_coco_300x.jpg?v=1747385576', null, true, '["gluten", "œufs"]'),
('Meringues striées', 'Légères et croustillantes, fondantes au cœur', 'Meringues', 3.80, null, null, true, '["œufs"]'),
('Meringues gouttes', 'Petites meringues en forme de goutte, à grignoter sans fin', 'Meringues', 4.00, null, null, true, '["œufs"]'),
('Macarons tendres aux amandes', 'Recette 1954, cœur moelleux à l''amande, enrobage croquant', 'Macarons', 5.90, null, null, true, '["gluten", "fruits à coque", "œufs"]'),
('Macarons meringués coco 1954', 'La recette coco de la maison, inchangée depuis 1954', 'Macarons', 3.90, null, null, true, '["œufs"]'),
('Palets pur beurre aux raisins', 'Les palets classiques agrémentés de raisins dorés', 'Classiques', 5.00, null, null, false, '["gluten", "lait", "œufs"]'),
('L''Indécent — anti-gaspi', 'Biscuit anti-gaspi : irrégulier, délicieux, engagé', 'Éco-responsable', 6.00, 'https://biscuiterie-louvat.com/cdn/shop/products/DSC_2888_300x.jpg?v=1759738828', 'Nouveau', true, '["gluten", "lait"]');
