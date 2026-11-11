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

## Charte « néon »

| Rôle | Valeur |
|---|---|
| Fonds | `#050505` noir profond · sections `#0E0E0E` · cartes `#161616` |
| Texte | `#F5F5F5` · paragraphes `#D0D0D0` · secondaire `#A0A0A0` |
| Accent | `#FAFAFA` blanc néon avec halo blanc (boutons, prix, détails), en référence aux LED hexagonales du plafond · texte des boutons en noir |
| Motif | hexagones (luminaires du salon) |
| Typos | Bebas Neue (titres) · Manrope (texte) – Google Fonts, `display=swap` |

Toute la charte est dans les variables `:root` de `css/style.css` (couleurs + `--glow-*`).

## Réservation Planity

### Module intégré (marque blanche)
La section `#reserver` contient un emplacement pour le module de réservation Planity.
1. Dans l'espace pro Planity : **Mon site internet** → copier le code d'intégration.
2. Dans `js/main.js`, objet `PLANITY_WIDGET` : coller la **clé** (`key`) et vérifier que les URL de `scripts`
   correspondent à celles du code Planity (celles du code Planity font foi).
3. Le module se charge en différé quand la section approche de l'écran ; tous les boutons « Réserver » du site
   mènent alors à `#reserver`.
4. Sans clé, si les scripts échouent ou si rien ne s'affiche en 12 s : un bloc de repli « Choisir mon créneau »
   ouvre la page Planity dans un nouvel onglet. Le site reste donc toujours fonctionnel.

### Pourquoi pas une iframe ?
Planity refuse l'affichage de sa page publique dans une iframe tierce (`X-Frame-Options` / CSP `frame-ancestors`).

## Remplacer / ajouter des photos

1. Déposer les photos HD dans `_sources/photos/` (mêmes noms : `salon-cheminee`, `salon-hexagones`, `facade`).
2. `python3 tools/optimize-images.py`
3. Photos d'équipe : voir le commentaire dans la section `#equipe` de `index.html`.

## À compléter avant la mise en ligne

- [ ] **Clé du module Planity** : `js/main.js` → `PLANITY_WIDGET.key` (+ vérifier les URL des scripts)
- [ ] **Téléphone** : `index.html` (section Infos + footer, chercher `[À COMPLÉTER]`) et ajouter `"telephone"` dans le JSON-LD
- [ ] **Instagram / Facebook** : liens `href="#"` du footer + ajouter `"sameAs": [...]` dans le JSON-LD
- [ ] **Vrais avis** : remplacer les 4 blocs `[AVIS À REMPLACER]` par des avis Planity réels (prénom + initiale, avec accord)
- [ ] **Mentions légales** : forme juridique, SIRET, RCS, TVA, gérant, e-mail, hébergeur (`mentions-legales.html`)
- [ ] **Nom de domaine** : remplacer `https://www.733barbershop.fr/` (canonical, Open Graph, JSON-LD, robots.txt, sitemap.xml)
- [ ] **Photos HD** du salon (les sources actuelles font 707 px de large) et **photos de l'équipe**
- [ ] Vérifier la position du repère sur la carte Google Maps
