-- Ajoute la valeur 'child_of' à l'enum relation_type
ALTER TYPE relation_type ADD VALUE IF NOT EXISTS 'child_of';
