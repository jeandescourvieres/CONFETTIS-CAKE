-- Ajoute la valeur 'pet' à l'enum relation_type
-- Nécessaire pour enregistrer les animaux de compagnie comme contacts

ALTER TYPE relation_type ADD VALUE IF NOT EXISTS 'pet';
