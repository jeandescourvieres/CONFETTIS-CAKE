-- Migration 069 : Correction bug migration 060
-- Les templates baptême ont été insérés avec occasion='birth' au lieu de 'baptism'
-- + quelques lignes poubelles (textes d'instruction) à supprimer

-- Supprimer les lignes poubelles insérées par erreur dans 'birth'
DELETE FROM message_templates
WHERE is_system = true
  AND occasion = 'birth'
  AND content IN (
    'Voici les messages pour l''occasion "Baptême", toujours avec :',
    '10 courts, 10 moyens, 10 longs',
    '"Tu" et "vous"',
    'Tons variés (solennel, joyeux, tendre, spirituel, etc.)',
    '100 % unisexes',
    'Baptême'
  );

-- Corriger l'occasion des templates baptême (content contient "baptême")
UPDATE message_templates
SET occasion = 'baptism'
WHERE is_system = true
  AND occasion = 'birth'
  AND content ILIKE '%baptême%';
