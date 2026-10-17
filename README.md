# Application d’apprentissage du Guidar

## Ouvrir l’application

Ouvre `guidar-final.html` dans un navigateur. L’application fonctionne hors ligne et ne nécessite ni installation, ni serveur, ni compte.

**Garde ensemble** `guidar-final.html`, le dossier `css` et le dossier `js` : la page charge ces fichiers par des chemins relatifs.

L’écran d’accueil GuidarApp propose une recherche en Guidar ou en français, un accès direct à la leçon, l’écoute du mot et une navigation par glissement horizontal. La barre du bas donne accès à l’accueil, aux leçons, à l’écoute, aux ressources et à l’espace compte (encore indisponible). Le menu à trois points rassemble le clavier spécial, l’alphabet, la lecture automatique et les paramètres.

Dans **Paramètres et accessibilité**, le thème clair ou sombre, la taille du texte, le contraste, l’affichage des aides provisoires et la vitesse de lecture sont mémorisés sur l’appareil.

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
- `scripts/Initialize-GitHub.ps1` : prépare une fois le dossier pour son dépôt privé GitHub.
- `scripts/Watch-And-Sync.ps1` : sauvegarde les changements sur GitHub après une minute sans modification.
- `.vscode/tasks.json` : lance le surveillant lorsque ce dossier est ouvert dans VS Code.

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

## Préparer la validation par un spécialiste du Guidar

Le projet contient des transcriptions et des aides de prononciation de statuts différents. Ne considère pas une approximation comme une prononciation confirmée. Pour préparer une relecture, ouvre PowerShell à la racine du projet et lance :

```powershell
node .\scripts\Export-LinguisticReview.cjs
```

Le script crée ou actualise trois fichiers CSV dans `docs` :

- `validation-lexique.csv` reprend les entrées Guidar et leurs traductions actuellement intégrées, avec des colonnes pour noter les corrections et validations.
- `validation-alphabet.csv` recense les caractères spéciaux déjà rencontrés dans l’application. Cette liste n’est pas présentée comme un alphabet complet.
- `validation-syllabes.csv` est une grille vierge à remplir avec le spécialiste ; aucune syllabe n’est inventée par le programme.

Les fichiers CSV s’ouvrent dans Excel ou LibreOffice. Après une correction validée, reporte-la dans `js/data.js`, puis relance l’export pour préparer la relecture suivante.

## Fonctionnement hors ligne

Les scripts sont chargés dans un ordre explicite par `guidar-final.html`. Ils utilisent des balises `<script>` classiques afin de rester compatibles avec l’ouverture directe d’un fichier local. Ne les remplace pas par des modules JavaScript `type="module"` sans mettre également en place un serveur local.

## Sauvegarde automatique sur GitHub

Le dépôt distant est privé : seuls les comptes autorisés peuvent consulter ses fichiers. La sauvegarde automatique s’applique quand ce dossier de projet est ouvert comme dossier de travail dans VS Code.

1. Installe Git for Windows si nécessaire et connecte Git à ton compte GitHub quand le navigateur le demande. Les identifiants restent gérés par Git Credential Manager ; ne les écris pas dans les scripts ou dans les fichiers du projet.
2. Dans le terminal PowerShell de VS Code, lance une seule fois :

   ```powershell
   .\scripts\Initialize-GitHub.ps1
   ```

3. Rouvre le dossier du projet dans VS Code et accepte le lancement de la tâche automatique si VS Code le demande.
4. Le terminal « Guidard : synchronisation automatique » s’affiche et indique « AUTOMATIQUE actif », puis confirme si aucun changement n’est en attente. Quand des fichiers sont modifiés et enregistrés, le surveillant crée une version puis l’envoie au dépôt après 60 secondes sans changement. Le transfert des dossiers audio et images peut nécessiter davantage de temps selon la connexion.

Une erreur Git ou réseau est affichée dans son terminal et dans le panneau Problèmes ; les envois échoués sont retentés. La tâche n’efface ni ne télécharge automatiquement les changements distants. Ne modifie pas la version GitHub depuis une autre machine avant d’avoir synchronisé cette copie locale. Ne ferme pas VS Code avant que le message de synchronisation terminée apparaisse.
