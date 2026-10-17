# Application d’apprentissage du Guidar

## Ouvrir l’application

Ouvre `guidar-final.html` dans un navigateur. L’application fonctionne hors ligne et ne nécessite ni installation, ni serveur, ni compte.

**Garde ensemble** `guidar-final.html`, le dossier `css` et le dossier `js` : la page charge ces fichiers par des chemins relatifs.

## Où modifier le programme

- `guidar-final.html` : structure de la page et ordre de chargement des fichiers.
- `css/style.css` : apparence, mise en page et adaptation aux écrans.
- `js/data.js` : leçons, entrées Guidar et traductions françaises.
- `js/state.js` : progression, préférences et sauvegarde locale.
- `js/player.js` : affichage des entrées, navigation entre les mots et lecture automatique.
- `js/audio.js` : enregistrements et synthèse vocale.
- `js/menu.js` : menu, bibliothèque, recherche, filtres et accessibilité.
- `js/keyboard.js` : clavier de caractères spéciaux et copie.
- `js/interactions.js` : notifications, gestes tactiles et raccourcis clavier.
- `js/init.js` : démarrage de l’application.

## Modifier une entrée ou ajouter du contenu

Les entrées des leçons se trouvent dans `js/data.js`. Une entrée comporte généralement :

```js
{
  "g": "mot ou expression en Guidar",
  "f": "traduction française",
  "p": "aide de prononciation facultative",
  "pProvisoire": true
}
```

`p` et `pProvisoire` sont facultatifs. N’ajoute une prononciation que si elle est documentée ou validée. Les leçons marquées `aValider` affichent un rappel invitant à faire vérifier leur transcription.

Pour éviter de désynchroniser les enregistrements existants, ne réordonne pas les entrées des leçons 1 à 7 sans vérifier aussi les fichiers audio correspondants. Après une modification, ouvre la page dans le navigateur et vérifie le menu, la recherche et la leçon concernée.

## Fonctionnement hors ligne

Les scripts sont chargés dans un ordre explicite par `guidar-final.html`. Ils utilisent des balises `<script>` classiques afin de rester compatibles avec l’ouverture directe d’un fichier local. Ne les remplace pas par des modules JavaScript `type="module"` sans mettre également en place un serveur local.
