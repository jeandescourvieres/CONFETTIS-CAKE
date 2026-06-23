#!/usr/bin/env node
/**
 * Audit i18n : vérifie que chaque clé t('...') utilisée dans le code existe
 * dans les 6 fichiers de locale actifs, et que ces 6 locales sont en parité.
 *
 * Usage : node scripts/check-i18n-keys.js
 * Code de sortie 1 si un problème est détecté (utilisable en CI).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'src/i18n/locales');
const LANGS = ['fr', 'en', 'de', 'es', 'it', 'pt']; // ar.ts existe mais n'est plus chargé (abandonné)
const SCAN_DIRS = ['app', 'src'];
const SCAN_EXTENSIONS = ['.tsx', '.ts'];
const EXCLUDE_DIR_NAMES = new Set(['node_modules', '.expo', 'dist', 'i18n']);

// ── Parseur récursif de l'objet de traductions (gère objets multi-ligne et inline) ──
function parseObjectKeys(text, prefix, result) {
  let i = 0;
  const n = text.length;
  while (i < n) {
    while (i < n && /[\s,]/.test(text[i])) i++;
    if (i >= n || text[i] === '}') break;
    if (text.startsWith('//', i)) {
      const eol = text.indexOf('\n', i);
      i = eol === -1 ? n : eol + 1;
      continue;
    }
    const keyMatch = /^(?:'([^']+)'|"([^"]+)"|([a-zA-Z0-9_]+))\s*:/.exec(text.slice(i));
    if (!keyMatch) { i++; continue; }
    const key = keyMatch[1] ?? keyMatch[2] ?? keyMatch[3];
    i += keyMatch[0].length;
    while (i < n && /\s/.test(text[i])) i++;

    if (text[i] === '{') {
      let depth = 1, j = i + 1;
      while (j < n && depth > 0) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
      }
      const path_ = [...prefix, key];
      result.add(path_.join('.'));
      parseObjectKeys(text.slice(i + 1, j - 1), path_, result);
      i = j;
    } else {
      result.add([...prefix, key].join('.'));
      i = skipValue(text, i);
    }
  }
  return result;
}

function skipValue(text, i) {
  const n = text.length;
  if (text[i] === "'" || text[i] === '"' || text[i] === '`') {
    const quote = text[i];
    i++;
    while (i < n) {
      if (text[i] === '\\') { i += 2; continue; }
      if (text[i] === quote) { i++; break; }
      i++;
    }
  } else {
    while (i < n && text[i] !== ',' && text[i] !== '}') i++;
  }
  while (i < n && /\s/.test(text[i])) i++;
  if (text[i] === ',') i++;
  return i;
}

function loadLocaleKeySets() {
  const sets = {};
  for (const lang of LANGS) {
    const content = fs.readFileSync(path.join(LOCALES_DIR, `${lang}.ts`), 'utf8');
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    sets[lang] = parseObjectKeys(content.slice(start + 1, end), [], new Set());
  }
  return sets;
}

// ── Scan du code source pour les appels t('...') et t(`...${dyn}`) ──────────
function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (SCAN_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) files.push(full);
  }
  return files;
}

const STATIC_KEY_RE = /\bt\(\s*['"]([a-zA-Z0-9_.]+)['"]/g;
const DYNAMIC_KEY_RE = /\bt\(\s*`([a-zA-Z0-9_.]*)\$\{/g;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const staticKeys = new Set();
  const dynamicPrefixes = new Set();
  let m;
  while ((m = STATIC_KEY_RE.exec(content))) staticKeys.add(m[1]);
  while ((m = DYNAMIC_KEY_RE.exec(content))) {
    const prefix = m[1].replace(/\.$/, '');
    if (prefix) dynamicPrefixes.add(prefix);
  }
  return { staticKeys, dynamicPrefixes };
}

function keyExists(keySets, lang, key) {
  const set = keySets[lang];
  return set.has(key) || set.has(`${key}_one`) || set.has(`${key}_other`);
}

// Les clés dynamiques peuvent interpoler en plein milieu d'un segment
// (ex: `landing.feature${i + 1}Title` → pas un chemin imbriqué `landing.feature.*`).
// On vérifie donc qu'au moins une clé connue commence par le préfixe statique,
// plutôt que d'exiger que ce préfixe soit lui-même un noeud d'objet.
function prefixHasMatch(keySets, lang, prefix) {
  for (const k of keySets[lang]) {
    if (k.startsWith(prefix)) return true;
  }
  return false;
}

function main() {
  const keySets = loadLocaleKeySets();
  let hasIssue = false;

  console.log('=== Parité des clés entre langues (référence : fr) ===');
  const frKeys = keySets.fr;
  for (const lang of LANGS) {
    if (lang === 'fr') continue;
    const missing = [...frKeys].filter((k) => !keySets[lang].has(k));
    const extra = [...keySets[lang]].filter((k) => !frKeys.has(k));
    if (missing.length || extra.length) {
      hasIssue = true;
      console.log(`  [${lang}] manquantes: ${missing.length}, en trop: ${extra.length}`);
      if (missing.length) console.log('    manquantes :', missing.slice(0, 30).join(', '));
      if (extra.length) console.log('    en trop    :', extra.slice(0, 30).join(', '));
    }
  }
  if (!hasIssue) console.log('  OK — les 6 langues ont exactement les mêmes clés.');

  const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d), []));
  const missingByFile = {};
  let totalStatic = 0, totalDynamic = 0;

  for (const file of files) {
    const { staticKeys, dynamicPrefixes } = scanFile(file);
    totalStatic += staticKeys.size;
    totalDynamic += dynamicPrefixes.size;
    const rel = path.relative(ROOT, file);
    const issues = [];

    for (const key of staticKeys) {
      const missingLangs = LANGS.filter((lang) => !keyExists(keySets, lang, key));
      if (missingLangs.length) issues.push({ key, missingLangs, type: 'static' });
    }
    for (const prefix of dynamicPrefixes) {
      const missingLangs = LANGS.filter((lang) => !prefixHasMatch(keySets, lang, prefix));
      if (missingLangs.length) issues.push({ key: `${prefix}*`, missingLangs, type: 'dynamic-prefix' });
    }
    if (issues.length) missingByFile[rel] = issues;
  }

  console.log(`\n=== Scan de ${files.length} fichiers (${totalStatic} clés statiques, ${totalDynamic} préfixes dynamiques uniques au total) ===`);

  const fileCount = Object.keys(missingByFile).length;
  if (!fileCount) {
    console.log('  OK — aucune clé manquante détectée dans le code.');
  } else {
    hasIssue = true;
    console.log(`  ${fileCount} fichier(s) avec des clés manquantes :\n`);
    for (const [file, issues] of Object.entries(missingByFile)) {
      console.log(`  ${file}`);
      for (const { key, missingLangs, type } of issues) {
        const tag = type === 'dynamic-prefix' ? ' (préfixe dynamique)' : '';
        console.log(`    - ${key}${tag} — manquant pour : ${missingLangs.join(', ')}`);
      }
    }
  }

  process.exitCode = hasIssue ? 1 : 0;
}

main();
