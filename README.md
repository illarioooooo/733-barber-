# 733 Barber Shop – site vitrine

Site one-page du **733 Barber Shop – Coiffeur & Barbier**, 1844 Av. Pierre Auguste Renoir (1er étage, copropriété des Halles), 83500 La Seyne-sur-Mer.
HTML5 + CSS + JavaScript vanilla, sans framework ni build. Site réalisé par Warne Studio.

## Arborescence

```
index.html              page unique (ancres : #prestations #reserver #equipe #galerie #avis #infos)
mentions-legales.html   mentions légales (placeholders)
css/style.css           charte en variables CSS (:root)
js/main.js              menu burger, header, révélations au scroll, horaires du jour, carrousel, lightbox
images/                 photos WebP optimisées (sm = 480 px, lg = taille max) + og-733.jpg
favicon.svg, favicon-32.png, apple-touch-icon.png
robots.txt, sitemap.xml, .htaccess (gzip + cache pour Apache)
_sources/photos/        photos d'origine (non publiées)
tools/optimize-images.py  régénère les WebP depuis _sources/photos (Pillow)
```

## Prévisualiser

```bash
python3 -m http.server 8733
```
puis ouvrir http://localhost:8733

## Charte

| Rôle | Valeur |
|---|---|
| Fond | `#0B0B0B` · sections `#151716` · cartes `#1D201F` (anthracite des murs du salon) |
| Texte | `#F2EFEA` · secondaire `#A3A3A3` |
| Accent unique | `#93C35A` vert végétal (plantes du salon), boutons / prix / détails |
| Motif | hexagones (luminaires LED du plafond) |
| Typos | Bebas Neue (titres) · Manrope (texte) – Google Fonts, `display=swap` |

## Réservation Planity

Planity refuse l'affichage de ses pages dans une iframe tierce (`X-Frame-Options` / CSP `frame-ancestors`) :
tous les boutons « Réserver » (`[data-book]`) ouvrent donc
https://www.planity.com/733-barber-shop-coiffeur-barbier-83500-la-seyne-sur-mer dans un nouvel onglet.
L'URL est centralisée dans `js/main.js` (`PLANITY_URL`) et réécrite au chargement.

## Remplacer / ajouter des photos

1. Déposer les photos HD dans `_sources/photos/` (mêmes noms : `salon-cheminee`, `salon-hexagones`, `facade`).
2. `python3 tools/optimize-images.py`
3. Photos d'équipe : voir le commentaire dans la section `#equipe` de `index.html`.

## À compléter avant la mise en ligne

- [ ] **Téléphone** : `index.html` (section Infos + footer, chercher `[À COMPLÉTER]`) et ajouter `"telephone"` dans le JSON-LD
- [ ] **Instagram / Facebook** : liens `href="#"` du footer + ajouter `"sameAs": [...]` dans le JSON-LD
- [ ] **Vrais avis** : remplacer les 4 blocs `[AVIS À REMPLACER]` par des avis Planity réels (prénom + initiale, avec accord)
- [ ] **Mentions légales** : forme juridique, SIRET, RCS, TVA, gérant, e-mail, hébergeur (`mentions-legales.html`)
- [ ] **Nom de domaine** : remplacer `https://www.733barbershop.fr/` (canonical, Open Graph, JSON-LD, robots.txt, sitemap.xml)
- [ ] **Photos HD** du salon (les sources actuelles font 707 px de large) et **photos de l'équipe**
- [ ] Vérifier la position du repère sur la carte Google Maps
