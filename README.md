# WfE — Maquettes web

Maquettes HTML/CSS destinées à l'intégrateur WordPress. Chaque page reproduit exactement la charte visuelle du site existant (fonts, couleurs, layout) et peut être visualisée dans un navigateur puis copiée section par section.

## Démarrer

```bash
node serve.mjs
# → http://localhost:3333
```

Ouvre ensuite `http://localhost:3333` dans ton navigateur. Le hub liste toutes les maquettes disponibles. (Port configurable via `PORT=4000 node serve.mjs`.)

## Structure

```
/
├── index.html              Hub — liste et aperçu de toutes les maquettes
├── pages/                  Une maquette par fichier HTML
│   └── la-distillerie.html
├── shared/
│   ├── tokens.css          Variables CSS du design system (couleurs, fonts, spacing)
│   ├── chrome.css          Layout commun (sidebar fixe + contenu qui scrolle)
│   ├── dev-mode.css        Styles du mode intégrateur
│   └── dev-mode.js         Boutons copier / télécharger
├── assets/
│   ├── images/             Images des maquettes
│   └── videos/             Vidéos des maquettes
└── serve.mjs               Serveur local statique (aucune dépendance)
```

## Pour l'intégrateur

Active le **mode intégrateur** : clique sur le bouton `DEV` en bas à droite, ou `Ctrl/Cmd + D`.

Ce mode révèle :

- Un bandeau en haut de page avec **⧉ Tokens CSS** (copie toutes les variables du design system)
- Sur chaque section (`[data-block]`) : un bouton **⧉ HTML** qui copie le HTML de la section
- Sur chaque image/vidéo : **⬇** (télécharge le fichier original) et **⧉ src** (copie le chemin)

### Workflow recommandé

1. Colle `shared/tokens.css` dans le thème WordPress une seule fois.
2. Pour chaque section à intégrer, utilise `⧉ HTML` puis adapte la structure au système de blocs Gutenberg ou WPBakery.
3. Télécharge les images via `⬇` et dépose-les dans la médiathèque WordPress.

## Design tokens

| Rôle | Valeur |
|------|--------|
| Fond sidebar / sections sombres | `#101E30` |
| Fond contenu (crème) | `#F7EBE8` |
| Accent (coral) | `#BC4927` |
| Typo titres | `Fjalla One` |
| Typo courante | `Oswald` |

Extraits du site live `wfedistillery.com/la-distillerie`.
