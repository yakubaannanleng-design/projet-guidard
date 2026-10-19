# Application d’apprentissage du Guidar

## Ouvrir l’application

Ouvre `guidar-final.html` dans un navigateur. L’application fonctionne hors ligne et ne nécessite ni installation, ni serveur, ni compte.

**Garde ensemble** `guidar-final.html`, le dossier `css` et le dossier `js` : la page charge ces fichiers par des chemins relatifs.

L’écran d’accueil GuidarApp met en avant une citation originale sur la transmission de la langue maternelle, de la culture et des coutumes. Il présente aussi l’application et propose une recherche en Guidar ou en français, des leçons, des traductions, l’écoute et des quiz. Chaque bouton de la barre du bas affiche sa section dans l’application, sans ouvrir de nouvelle fenêtre. Le menu à trois points rassemble aussi le clavier spécial, l’alphabet, la lecture automatique et les paramètres. Dans une leçon, les boutons fléchés permettent de parcourir les entrées sans geste tactile ; le balayage et les flèches du clavier restent disponibles.

Le **Lecteur Guidar** s’affiche dans l’application et permet de choisir une leçon, de parcourir ses entrées et de les écouter. La **Bibliothèque numérique** permet de filtrer les entrées par leçon, de rechercher en Guidar ou en français et d’écouter chaque mot avec son bouton haut-parleur. L’application cherche d’abord l’enregistrement Guidar ; s’il est absent, elle lit seulement la traduction française et l’indique clairement. Une aide vocale de synthèse est disponible dans les paramètres, mais elle reste désactivée par défaut : une voix française ne prononce pas le Guidar.

Pour les caractères que le clavier ne peut pas écrire (ə, ɗ, ɓ, ŋ, ɔ), le clavier Guidar insère le caractère dans le champ de recherche actif s’il y en a un, sinon il le copie. La recherche ignore les accents.

L’espace **Quiz**, accessible depuis la barre du bas ou le menu, classe les parcours par leçon et propose aussi une catégorie couvrant toutes les leçons. Chaque partie propose jusqu’à dix questions à choix multiples tirées des mots et traductions présents dans la catégorie. Le score est calculé à la fin de la partie. Comme le lexique attend une validation spécialisée, un rappel est affiché dans le quiz ; ses choix ne remplacent pas une validation linguistique.

Dans **Paramètres et accessibilité**, le thème clair ou sombre, la taille réglable du texte (85 à 120 %), le contraste, l’affichage des aides provisoires et la vitesse de lecture sont mémorisés sur l’appareil. Le bouton « Rétablir les réglages par défaut » permet d’annuler les personnalisations.

## Où modifier le programme

- `guidar-final.html` : structure de la page et ordre de chargement des fichiers.
- `css/style.css` : apparence, mise en page et adaptation aux écrans.
- `js/data.js` : leçons, entrées Guidar et traductions françaises.
- `js/audio-manifest.js` : correspondance entre les entrées et les enregistrements disponibles. Fichier généré, ne pas le modifier à la main.
- `js/state.js` : progression, préférences et sauvegarde locale.
- `js/player.js` : affichage des entrées, navigation entre les mots et lecture automatique.
- `js/audio.js` : enregistrements et synthèse vocale.
- `js/menu.js` : menu, bibliothèque, recherche, filtres et accessibilité.
- `js/keyboard.js` : clavier de caractères spéciaux, insertion et copie.
- `js/interactions.js` : notifications, gestes tactiles et raccourcis clavier.
- `js/init.js` : démarrage de l’application.
- `scripts/Audio-Tracking.cjs` : suit les enregistrements, produit le manifeste et la liste de travail.
- `scripts/Check-App.cjs` : contrôle complet de l’application.
- `scripts/Export-LinguisticReview.cjs` : prépare la relecture du spécialiste.
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

Après une modification, relance `node .\scripts\Audio-Tracking.cjs` puis `node .\scripts\Check-App.cjs` : le premier met à jour le manifeste, le second signale les enregistrements devenus caducs. Ouvre ensuite la page dans le navigateur et vérifie le menu, la recherche et la leçon concernée.

Le numéro d’un enregistrement correspond à la position de l’entrée parmi celles qui portent une graphie. Ajouter une note (une entrée sans `g`) ne change pas la numérotation ; ajouter, retirer ou déplacer une entrée à graphie, si, décalent les enregistrements suivants. L’empreinte de l’entrée le signale automatiquement, mais autant éviter le décalage : en cas de doute, fais-le signaler avant d’enregistrer.

## Enregistrer les voix Guidar

L’application n’invente plus les noms de fichiers : `js/audio-manifest.js` fait foi. Il est produit par le script de suivi, qui compare `js/data.js` aux dossiers `audio_lecon1` … `audio_lecon11`.

### 1. Consulter ce qu’il reste à faire

Ouvre PowerShell à la racine du projet et lance :

```powershell
node .\scripts\Audio-Tracking.cjs
```

Le script affiche la progression par leçon, puis met à jour deux fichiers :

- `docs/enregistrements-a-realiser.csv` : la liste de travail. Une ligne par enregistrement manquant, avec la graphie Guidar, la traduction française, l’aide de prononciation et le nom exact du fichier à créer.
- `docs/enregistrements-etat.csv` : l’état complet, pour le suivi et la relecture.

Le fichier audio d’une entrée se nomme `lecon<L>_<position>.mp3`, où `<L>` est le numéro de la leçon et `<position>` le numéro de l’entrée parmi celles qui portent une graphie, sur trois chiffres (`lecon5_001.mp3`, `lecon10_042.mp3`). Le script crée les dossiers manquants.

### 2. Enregistrer

Ouvre la liste `docs/enregistrements-a-realiser.csv` dans Excel ou LibreOffice, enregistre chaque entrée en suivant la graphie Guidar, et place le fichier dans le dossier de la leçon avec le nom indiqué.

### 3. Mettre à jour l’application

Relance `node .\scripts\Audio-Tracking.cjs` après chaque série d’enregistrements : le manifeste est régénéré et l’application les utilise immédiatement, sans rien recompiler.

### 4. Contrôler

```powershell
node .\scripts\Check-App.cjs
```

Le contrôle vérifie que le manifeste correspond bien aux données et aux fichiers présents, que la recherche fonctionne et que rien n’est décalé. Il sort avec le code 1 en cas d’anomalie.

### Repère de sécurité

Chaque enregistrement est lié à l’entrée qu’il décrit par une empreinte. Si le texte d’une entrée est modifié ou déplacé, l’enregistrement correspondant n’est plus joué : l’application indique « enregistrement à revérifier » et le script demande de le refaire. L’application ne peut donc pas diffuser une voix qui ne correspond plus au mot affiché.

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
