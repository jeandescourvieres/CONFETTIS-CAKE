# Script de génération de la migration 060 — Premium templates
# Lit les fichiers de données et génère le SQL INSERT

$outputFile = "C:\Users\HYDROFOLLIES\confettis-cake\supabase\migrations\060_premium_templates.sql"

function Make-Title($content) {
    $t = $content.Trim()
    if ($t.Length -gt 60) { $t = $t.Substring(0, 57) + "..." }
    return $t
}

# Utilise le dollar-quoting PostgreSQL $dq$...$dq$ pour éviter l'échappement des apostrophes
$dq = '$$'
function Sql-Row($occasion, $ton, $longueur, $title, $content) {
    $t = Make-Title $title
    return "('$occasion','$ton','$longueur',$script:dq$t$script:dq,$script:dq$content$script:dq,true)"
}

# Mapping nom → slug occasion
$occasionMap = @{
    "Départ à la retraite" = "retirement"
    "Anniversaire" = "birthday"
    "Bonne Fête" = "nameday"
    "Mariage" = "wedding"
    "Fiançailles" = "engagement"
    "Naissance" = "birth"
    "Baptême" = "baptism"
    "Communion" = "communion"
    "Diplôme" = "graduation"
    "Promotion" = "promotion"
    "Remerciements" = "thanks"
    "Nouvel An" = "newyear"
    "Noël" = "christmas"
    "Pâques" = "easter"
    "Saint-Valentin" = "valentines"
    "Fête des Mères" = "mothersday"
    "Fête des Pères" = "fathersday"
    "Halloween" = "halloween"
}

$sql = @"
-- Migration 060 : Remplacement de TOUS les templates par les versions premium
-- Efface les templates système existants et les remplace par les textes premium

DELETE FROM message_templates WHERE is_system = true AND support_type IS NULL
  AND occasion IN ('birthday','nameday','wedding','engagement','birth','baptism',
    'communion','graduation','promotion','thanks','newyear','christmas','easter',
    'valentines','mothersday','fathersday','halloween','retirement');

DELETE FROM message_templates WHERE is_system = true AND occasion = 'support';

"@

# Fonction pour parser un bloc de données texte
# et retourner les lignes INSERT SQL
function Parse-Block($text, $defaultOccasion) {
    $lines = $text -split "`n" | ForEach-Object { $_.TrimEnd() }
    $results = @()

    $currentOccasion = $defaultOccasion
    $currentLongueur = ""
    $currentTon = ""
    $collectingMessages = $false
    $messageBuffer = @()

    $longueurMap = @{
        "Courts" = "court"
        "Moyens" = "moyen"
        "Longs" = "long"
    }

    foreach ($line in $lines) {
        # Détecter un changement d'occasion
        foreach ($key in $occasionMap.Keys) {
            if ($line.Trim() -match "^[0-9]*\.?\s*$key\s*$" -or $line.Trim() -eq $key) {
                if ($messageBuffer.Count -gt 0 -and $currentOccasion -and $currentLongueur -and $currentTon) {
                    foreach ($msg in $messageBuffer) {
                        $results += Sql-Row $currentOccasion $currentTon $currentLongueur $msg $msg
                    }
                    $messageBuffer = @()
                }
                $currentOccasion = $occasionMap[$key]
                $collectingMessages = $false
                break
            }
        }

        # Détecter la longueur
        foreach ($key in $longueurMap.Keys) {
            if ($line -match "^$key \(") {
                if ($messageBuffer.Count -gt 0 -and $currentLongueur -and $currentTon) {
                    foreach ($msg in $messageBuffer) {
                        $results += Sql-Row $currentOccasion $currentTon $currentLongueur $msg $msg
                    }
                    $messageBuffer = @()
                }
                $currentLongueur = $longueurMap[$key]
                $collectingMessages = $false
                $currentTon = ""
                break
            }
        }

        # Détecter le ton
        if ($line -match "^Tu \(informel\)") {
            if ($messageBuffer.Count -gt 0 -and $currentTon -and $currentLongueur) {
                foreach ($msg in $messageBuffer) {
                    $results += Sql-Row $currentOccasion $currentTon $currentLongueur $msg $msg
                }
                $messageBuffer = @()
            }
            $currentTon = "tu"
            $collectingMessages = $true
            continue
        }
        if ($line -match "^Vous \(formel\)") {
            if ($messageBuffer.Count -gt 0 -and $currentTon -and $currentLongueur) {
                foreach ($msg in $messageBuffer) {
                    $results += Sql-Row $currentOccasion $currentTon $currentLongueur $msg $msg
                }
                $messageBuffer = @()
            }
            $currentTon = "vous"
            $collectingMessages = $true
            continue
        }

        # Collecter les messages (lignes non vides, pas de header)
        if ($collectingMessages -and $line.Trim() -ne "" -and
            $line -notmatch "^\d+\." -and
            $line -notmatch "^Courts\b" -and
            $line -notmatch "^Moyens\b" -and
            $line -notmatch "^Longs\b" -and
            $line -notmatch "^Tu \(" -and
            $line -notmatch "^Vous \(") {
            $messageBuffer += $line.Trim()
        }
    }

    # Flush final buffer
    if ($messageBuffer.Count -gt 0 -and $currentOccasion -and $currentLongueur -and $currentTon) {
        foreach ($msg in $messageBuffer) {
            $results += Sql-Row $currentOccasion $currentTon $currentLongueur $msg $msg
        }
    }

    return $results
}

# Parse les 3 blocs de la session précédente
$blockA = [System.IO.File]::ReadAllText("C:\Users\HYDROFOLLIES\confettis-cake\tmp_a.txt", [System.Text.Encoding]::UTF8)
$blockB = [System.IO.File]::ReadAllText("C:\Users\HYDROFOLLIES\confettis-cake\tmp_23025.txt", [System.Text.Encoding]::UTF8)
$blockC = [System.IO.File]::ReadAllText("C:\Users\HYDROFOLLIES\confettis-cake\tmp_23036.txt", [System.Text.Encoding]::UTF8)

$allInserts = @()

# Bloc A: retraite + anniversaire
$rowsA = Parse-Block $blockA "retirement"
$allInserts += $rowsA
Write-Host "Bloc A: $($rowsA.Count) rows"

# Bloc B: bonne fête + mariage
$rowsB = Parse-Block $blockB "nameday"
$allInserts += $rowsB
Write-Host "Bloc B: $($rowsB.Count) rows"

# Bloc C: fiançailles + naissance + baptême
$rowsC = Parse-Block $blockC "engagement"
$allInserts += $rowsC
Write-Host "Bloc C: $($rowsC.Count) rows"

Write-Host "Total blocs A+B+C: $($allInserts.Count) rows"

# Générer le SQL pour les blocs précédents
if ($allInserts.Count -gt 0) {
    $sql += "`n-- ═══════════════════════════════════════════════════════════`n"
    $sql += "-- RETRAITE, ANNIVERSAIRE, BONNE FÊTE, MARIAGE, FIANÇAILLES, NAISSANCE, BAPTÊME`n"
    $sql += "-- ═══════════════════════════════════════════════════════════`n"
    $sql += "INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES`n"
    $sql += ($allInserts -join ",`n") + ";`n"
}

# Parse communion + autres occasions de la session actuelle
$blockCommunion = [System.IO.File]::ReadAllText("C:\Users\HYDROFOLLIES\confettis-cake\tmp_communion.txt", [System.Text.Encoding]::UTF8)
$rowsCommunion = Parse-Block $blockCommunion "communion"
Write-Host "Communion: $($rowsCommunion.Count) rows"

$allCurrentInserts = @()
$allCurrentInserts += $rowsCommunion

# Ajouter les autres fichiers si présents
$otherFiles = @(
    @{file="tmp_diplome.txt"; occasion="graduation"},
    @{file="tmp_promotion.txt"; occasion="promotion"},
    @{file="tmp_remerciements.txt"; occasion="thanks"},
    @{file="tmp_newyear.txt"; occasion="newyear"},
    @{file="tmp_christmas.txt"; occasion="christmas"},
    @{file="tmp_easter.txt"; occasion="easter"},
    @{file="tmp_valentines.txt"; occasion="valentines"},
    @{file="tmp_mothersday.txt"; occasion="mothersday"},
    @{file="tmp_fathersday.txt"; occasion="fathersday"}
)
foreach ($item in $otherFiles) {
    $path = "C:\Users\HYDROFOLLIES\confettis-cake\$($item.file)"
    if (Test-Path $path) {
        $blockContent = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        $rows = Parse-Block $blockContent $item.occasion
        Write-Host "$($item.occasion): $($rows.Count) rows"
        $allCurrentInserts += $rows
    }
}

# Halloween : extraire uniquement la partie avant "Je passe à Soutien"
$halloweenAll = [System.IO.File]::ReadAllText("C:\Users\HYDROFOLLIES\confettis-cake\tmp_halloween.txt", [System.Text.Encoding]::UTF8)
$halloweenLines = $halloweenAll -split "`n"
$halloweenOnly = @()
foreach ($l in $halloweenLines) {
    if ($l -like "*Soutien*" -and $l -notlike "*Halloween*") { break }
    $halloweenOnly += $l
}
$rowsHalloween = Parse-Block ($halloweenOnly -join "`n") "halloween"
Write-Host "halloween: $($rowsHalloween.Count) rows"
$allCurrentInserts += $rowsHalloween

if ($allCurrentInserts.Count -gt 0) {
    $sql += "`n-- COMMUNION, DIPLOME, PROMOTION, REMERCIEMENTS, NOUVEL AN, NOEL, PAQUES, SAINT-VALENTIN, FETE DES MERES, FETE DES PERES, HALLOWEEN`n"
    $sql += "INSERT INTO message_templates (occasion, ton, longueur, title, content, is_system) VALUES`n"
    $sql += ($allCurrentInserts -join ",`n") + ";`n"
}

# ═══════════════════════════════════════════════════
# SOUTIEN — parser dédié avec support_type
# ═══════════════════════════════════════════════════
$supportTypeMap = @{
    "Deuil"             = "bereavement"
    "Maladie"           = "illness"
    "Période difficile" = "hardtime"
    "Encouragement"     = "encouragement"
}

function Sql-SoutienRow($ton, $longueur, $supportType, $content) {
    $t = Make-Title $content
    return "('support','$ton','$longueur','$supportType',$script:dq$t$script:dq,$script:dq$content$script:dq,true)"
}

function Parse-Soutien($text) {
    $lines = $text -split "`n" | ForEach-Object { $_.TrimEnd() }
    $results = @()
    $curType = ""
    $curLongueur = ""
    $curTon = ""
    $collecting = $false
    $buf = @()

    foreach ($line in $lines) {
        $lt = $line.Trim()

        # Detecter sous-categorie soutien — UNIQUEMENT les lignes "N. Soutien ..."
        # (evite les faux positifs dans les messages qui contiennent "soutien"/"difficile")
        if ($lt -match "^[1-4][.\)] Soutien") {
            if ($buf.Count -gt 0 -and $curType -and $curLongueur -and $curTon) {
                foreach ($m in $buf) { $results += Sql-SoutienRow $curTon $curLongueur $curType $m }
                $buf = @()
            }
            $newType = ""
            if ($lt -like "*Deuil*")       { $newType = "bereavement" }
            elseif ($lt -like "*Maladie*") { $newType = "illness" }
            elseif ($lt -like "*riode*" -or $lt -like "*difficile*") { $newType = "hardtime" }
            elseif ($lt -like "*Encouragement*") { $newType = "encouragement" }
            if ($newType) { $curType = $newType }
            $curLongueur = ""; $curTon = ""; $collecting = $false; continue
        }

        # Longueur
        if ($lt -match "^Courts ") {
            if ($buf.Count -gt 0 -and $curType -and $curLongueur -and $curTon) {
                foreach ($m in $buf) { $results += Sql-SoutienRow $curTon $curLongueur $curType $m }
                $buf = @()
            }
            $curLongueur = "court"; $curTon = ""; $collecting = $false; continue
        }
        if ($lt -match "^Moyens ") {
            if ($buf.Count -gt 0 -and $curType -and $curLongueur -and $curTon) {
                foreach ($m in $buf) { $results += Sql-SoutienRow $curTon $curLongueur $curType $m }
                $buf = @()
            }
            $curLongueur = "moyen"; $curTon = ""; $collecting = $false; continue
        }
        if ($lt -match "^Longs ") {
            if ($buf.Count -gt 0 -and $curType -and $curLongueur -and $curTon) {
                foreach ($m in $buf) { $results += Sql-SoutienRow $curTon $curLongueur $curType $m }
                $buf = @()
            }
            $curLongueur = "long"; $curTon = ""; $collecting = $false; continue
        }

        # Ton
        if ($lt -match "^Tu .informel") {
            if ($buf.Count -gt 0 -and $curType -and $curLongueur -and $curTon) {
                foreach ($m in $buf) { $results += Sql-SoutienRow $curTon $curLongueur $curType $m }
                $buf = @()
            }
            $curTon = "tu"; $collecting = $true; continue
        }
        if ($lt -match "^Vous .formel") {
            if ($buf.Count -gt 0 -and $curType -and $curLongueur -and $curTon) {
                foreach ($m in $buf) { $results += Sql-SoutienRow $curTon $curLongueur $curType $m }
                $buf = @()
            }
            $curTon = "vous"; $collecting = $true; continue
        }

        # Ignorer les lignes d'en-tete
        if ($lt -eq "" -or
            $lt -match "^Voici\b" -or $lt -match "^\d+\." -or
            $lt -eq "Deuil" -or $lt -eq "Maladie" -or $lt -eq "Encouragement" -or
            $lt -eq "Période difficile" -or
            $lt -match "^[0-9]+ courts" -or $lt -match "^[0-9]+ moyens" -or $lt -match "^[0-9]+ longs" -or
            $lt -match "^10 courts" -or $lt -match "^10 moyens" -or $lt -match "^10 longs" -or
            $lt -like "*100 % unisexe*" -or $lt -like "*Tons adapt*" -or $lt -like "*Tu.*et.*vous*") {
            continue
        }

        # Collecter message
        if ($collecting) {
            $buf += $lt
        }
    }
    # Flush final
    if ($buf.Count -gt 0 -and $curType -and $curLongueur -and $curTon) {
        foreach ($m in $buf) { $results += Sql-SoutienRow $curTon $curLongueur $curType $m }
    }
    return $results
}

# Extraire la section soutien depuis tmp_halloween.txt (après "Voici les messages pour l'occasion Soutien")
$soutienLines = @()
$inSoutien = $false
foreach ($l in $halloweenLines) {
    if ($l -match 'Voici les messages pour.*Soutien') { $inSoutien = $true }
    if ($inSoutien) { $soutienLines += $l }
}
$rowsSoutien = Parse-Soutien ($soutienLines -join "`n")
Write-Host "soutien: $($rowsSoutien.Count) rows"

if ($rowsSoutien.Count -gt 0) {
    $sql += "`n-- ═══════════════════════════════════════════════════════════`n"
    $sql += "-- SOUTIEN (bereavement / illness / hardtime / encouragement)`n"
    $sql += "-- ═══════════════════════════════════════════════════════════`n"
    $sql += "INSERT INTO message_templates (occasion, ton, longueur, support_type, title, content, is_system) VALUES`n"
    $sql += ($rowsSoutien -join ",`n") + ";`n"
}

[System.IO.File]::WriteAllText($outputFile, $sql, [System.Text.UTF8Encoding]::new($false))
Write-Host "Written to $outputFile"
Write-Host "Total inserts: $($allInserts.Count + $allCurrentInserts.Count + $rowsSoutien.Count)"
