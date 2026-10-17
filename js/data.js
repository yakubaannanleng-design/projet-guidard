// ══════════════════════════════════════════════════
// DONNÉES — TES LEÇONS (mots préservés exactement)
// ══════════════════════════════════════════════════
const LECONS = [
  {
    "titre": "LEÇON 1 — SALUTATIONS",
    "icone": "👋",
    "mots": [
      {
        "f": "Note: ə=eu / ɗ=d / ɓ=b / ŋ=ng / ɔ=o / ɛ=è / u=ou / y=y"
      },
      {
        "g": "əyak madabən: əsɗa gəm Ərban zƏ ɗƏfa",
        "f": "Leçon 1: saluer et se présenter",
        "p": "euyak madabeun: eusda geum eurban zeu deufa",      
      },
      {
        "g": "soko nokum ɗəzo əyagan ma Kaɗa ɗə MADI OUMAROU YAKUB",
        "p": "soko nokoum deuzo euyagan ma kanda de madi oumarou yakoub",
        "f": "Bienvenue dans l'apprentissage du Guidar présenté par MADI OUMAROU YAKUB"
      },
      {
        "g": "əsɗoko",
        "p": "eusdoko",
        "f": "Salut à toi"
      },
      {
        "g": "mbar addang ɗi",
        "p": "mbar adandi",
        "f": "Comment avez-vous passé la nuit ?"
      },
      {
        "g": "mbar kəsɓəɗi",
        "p": "mbar kes bedi",
        "f": "Bonsoir"
      },
      {
        "g": "əsɗokum",
        "p": "eusdokoum",
        "f": "Salut à vous"
      },
      {
        "g": "zam sa/ zam ɓasa/ zam zam mƏnan ɓasa",
        "f": "Comment ça va ? / j'espère que nous allons bien ?",
        "p": "zam sa / zam basa / zam zam eununan basa"
      },
      {
        "g": "mbar kəsɓəɗi",
        "p": "mbar kes bedi",
        "f": "Comment s'est passé ta journée ?"
      },
      {
        "g": "əsɗoko",
        "p": "eusdoko",
        "f": "Salut à toi"
      },
      {
        "g": "mbar addang ɗi",
        "p": "mbar-adandi",
        "f": "Comment avez-vous passé la nuit ?"
      },
      {
        "g": "zami ɓa",
        "f": "Ça ne va pas",
        "p": "zami ba"
      },
      {
        "g": "mi dəgəɗ di?",
        "f": "Qu'est-ce qui ne va pas ?",
        "p": "mi deugeud di"
      },
      {
        "g": "mbar Əya nok di?",
        "f": "Comment tu t'appelles ?",
        "p": "mbar eunya nok di"
      },
      {
        "g": "Əya naw na",
        "f": "Mon nom est / Je m'appelle",
        "p": "eunya naw na"
      },
      {
        "g": "mbar əzva nok di?",
        "f": "Quel âge as-tu ?",
        "p": "mbar euzva nok di"
      },
      {
        "g": "əzva naw na",
        "f": "Mon âge est de...",
        "p": "euzva naw na"
      },
      {
        "g": "addəv gəla na əyak awan kənan di",
        "f": "Tu fais quelle classe ?",
        "p": "adeuv geula na euyak awan keunan di"
      },
      {
        "g": "Kəti na əyaka",
        "f": "École",
        "p": "keuti na euyaka"
      },
      {
        "g": "əya",
        "f": "Le nom",
        "p": "euya"
      },
      {
        "g": "əya na afəw na",
        "f": "Le nom de mon père est...",
        "p": "euya na afeuou na"
      },
      {
        "g": "əya nat maw na",
        "f": "Le nom de ma mère est...",
        "p": "euya nat maw na"
      },
      {
        "g": "ma əlfa naw na",
        "f": "Mon clan est...",
        "p": "ma eulfa naw na"
      },
      {
        "g": "walang gəla net migiliw a kaɗa na",
        "f": "Le village de mes parents est...",
        "p": "walang geula net migiliw a kada na"
      }
    ]
  },
  {
    "titre": "LEÇON 2 — CHIFFRES",
    "icone": "🔢",
    "mots": [
      {
        "f": "Note: ə=eu / ɗ=d / ɓ=b / ŋ=ng / ɔ=o / ɛ=è / u=ou / y=y"
      },
      {
        "g": "əngɗa də ma kaɗa",
        "f": "Comptage / Nombres en Guidar",
        "p": "eungda de ma kada"
      },
      {
        "g": "0.(tayɓa)",
        "f": "Zéro",
        "p": "tayba"
      },
      {
        "g": "1.(taka)",
        "f": "Un / Une",
        "p": "taka"
      },
      {
        "g": "2.(sula)",
        "f": "Deux",
        "p": "soula"
      },
      {
        "g": "3.(hoku)",
        "f": "Trois",
        "p": "hokou"
      },
      {
        "g": "4.(poɗo)",
        "f": "Quatre",
        "p": "podo"
      },
      {
        "g": "5.(sle)",
        "f": "Cinq",
        "p": "slé"
      },
      {
        "g": "6.(sləre)",
        "f": "Six",
        "p": "sleurè"
      },
      {
        "g": "7.(buhul)",
        "f": "Sept",
        "p": "bouhoule"
      },
      {
        "g": "8.(dədopoɗo)",
        "f": "Huit",
        "p": "deudopodo"
      },
      {
        "g": "9.(vaytak)",
        "f": "Neuf",
        "p": "vaytak"
      },
      {
        "g": "10.(kəlaw)",
        "f": "Dix",
        "p": "keulaw"
      },
      {
        "g": "11.(kəlaw kəyən taka)",
        "f": "Onze",
        "p": "keulaw keuyeun taka"
      },
      {
        "g": "12.(kəlaw kəyən sula)",
        "f": "Douze",
        "p": "keulaw keuyeun soula"
      },
      {
        "g": "13.(kəlaw kəyən hoku)",
        "f": "Treize",
        "p": "keulaw keuyeun hokou"
      },
      {
        "g": "14.(kəlaw kəyən poɗo)",
        "f": "Quatorze",
        "p": "keulaw keuyeun podo"
      },
      {
        "g": "15.(kəlaw kəyən sle)",
        "f": "Quinze",
        "p": "keulaw keuyeun slé"
      },
      {
        "g": "16.(kəlaw kəyən sləre)",
        "f": "Seize",
        "p": "keulaw keuyeun sleurè"
      },
      {
        "g": "17.(kəlaw kəyən buhul)",
        "f": "Dix-sept",
        "p": "keulaw keuyeun bouhoule"
      },
      {
        "g": "18.(kəlaw kəyən dədopoɗo)",
        "f": "Dix-huit",
        "p": "keulaw keuyeun deudopodo"
      },
      {
        "g": "19.(kəlaw kəyən vaytak)",
        "f": "Dix-neuf",
        "p": "keulaw keuyeun vaytak"
      },
      {
        "g": "20.(kaklaw sula)",
        "f": "Vingt",
        "p": "kaklaw soula"
      },
      {
        "g": "21.(kaklaw sula kəyən taka)",
        "f": "Vingt et un",
        "p": "kaklaw soula keuyeun taka"
      },
      {
        "g": "22.(kaklaw sula kəyən sula)",
        "f": "vingt-deux",
        "p": "kaklaw soula keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "23.(kaklaw sula kəyən hoku)",
        "f": "vingt-trois",
        "p": "kaklaw soula keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "24.(kaklaw sula kəyən poɗo)",
        "f": "vingt-quatre",
        "p": "kaklaw soula keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "25.(kaklaw sula kəyən sle)",
        "f": "vingt-cinq",
        "p": "kaklaw soula keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "26.(kaklaw sula kəyən sləre)",
        "f": "vingt-six",
        "p": "kaklaw soula keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "27.(kaklaw sula kəyən buhul)",
        "f": "vingt-sept",
        "p": "kaklaw soula keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "28.(kaklaw sula kəyən dədopoɗo)",
        "f": "vingt-huit",
        "p": "kaklaw soula keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "29.(kaklaw sula kəyən vaytak)",
        "f": "vingt-neuf",
        "p": "kaklaw soula keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "30.(kaklaw hoku)",
        "f": "Trente",
        "p": "kaklaw hokou"
      },
      {
        "g": "31.(kaklaw hoku kəyən taka)",
        "f": "trente et un",
        "p": "kaklaw hokou keuyeun taka",
        "pProvisoire": true
      },
      {
        "g": "32.(kaklaw hoku kəyən sula)",
        "f": "trente-deux",
        "p": "kaklaw hokou keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "33.(kaklaw hoku kəyən hoku)",
        "f": "trente-trois",
        "p": "kaklaw hokou keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "34.(kaklaw hoku kəyən poɗo)",
        "f": "trente-quatre",
        "p": "kaklaw hokou keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "35.(kaklaw hoku kəyən sle)",
        "f": "trente-cinq",
        "p": "kaklaw hokou keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "36.(kaklaw hoku kəyən sləre)",
        "f": "trente-six",
        "p": "kaklaw hokou keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "37.(kaklaw hoku kəyən buhul)",
        "f": "trente-sept",
        "p": "kaklaw hokou keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "38.(kaklaw hoku kəyən dədopoɗo)",
        "f": "trente-huit",
        "p": "kaklaw hokou keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "39.(kaklaw hoku kəyən vaytak)",
        "f": "trente-neuf",
        "p": "kaklaw hokou keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "40.(kaklaw poɗo)",
        "f": "Quarante",
        "p": "kaklaw podo"
      },
      {
        "g": "41.(kaklaw poɗo kəyən taka)",
        "f": "quarante et un",
        "p": "kaklaw podo keuyeun taka",
        "pProvisoire": true
      },
      {
        "g": "42.(kaklaw poɗo kəyən sula)",
        "f": "quarante-deux",
        "p": "kaklaw podo keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "43.(kaklaw poɗo kəyən hoku)",
        "f": "quarante-trois",
        "p": "kaklaw podo keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "44.(kaklaw poɗo kəyən poɗo)",
        "f": "quarante-quatre",
        "p": "kaklaw podo keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "45.(kaklaw poɗo kəyən sle)",
        "f": "quarante-cinq",
        "p": "kaklaw podo keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "46.(kaklaw poɗo kəyən sləre)",
        "f": "quarante-six",
        "p": "kaklaw podo keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "47.(kaklaw poɗo kəyən buhul)",
        "f": "quarante-sept",
        "p": "kaklaw podo keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "48.(kaklaw poɗo kəyən dədopoɗo)",
        "f": "quarante-huit",
        "p": "kaklaw podo keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "49.(kaklaw poɗo kəyən vaytak)",
        "f": "quarante-neuf",
        "p": "kaklaw podo keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "50.(kaklaw sle)",
        "f": "Cinquante",
        "p": "kaklaw slé"
      },
      {
        "g": "51.(kaklaw sle kəyən taka)",
        "f": "cinquante et un",
        "p": "kaklaw sle keuyeun taka",
        "pProvisoire": true
      },
      {
        "g": "52.(kaklaw sle kəyən sula)",
        "f": "cinquante-deux",
        "p": "kaklaw sle keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "53.(kaklaw sle kəyən hoku)",
        "f": "cinquante-trois",
        "p": "kaklaw sle keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "54.(kaklaw sle kəyən poɗo)",
        "f": "cinquante-quatre",
        "p": "kaklaw sle keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "55.(kaklaw sle kəyən sle)",
        "f": "cinquante-cinq",
        "p": "kaklaw sle keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "56.(kaklaw sle kəyən sləre)",
        "f": "cinquante-six",
        "p": "kaklaw sle keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "57.(kaklaw sle kəyən buhul)",
        "f": "cinquante-sept",
        "p": "kaklaw sle keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "58.(kaklaw sle kəyən dədopoɗo)",
        "f": "cinquante-huit",
        "p": "kaklaw sle keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "59.(kaklaw sle kəyən vaytak)",
        "f": "cinquante-neuf",
        "p": "kaklaw sle keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "60.(kaklaw sləre)",
        "f": "Soixante",
        "p": "kaklaw sleurè"
      },
      {
        "g": "61.(kaklaw sləre kəyən taka)",
        "f": "soixante et un",
        "p": "kaklaw sleure keuyeun taka",
        "pProvisoire": true
      },
      {
        "g": "62.(kaklaw sləre kəyən sula)",
        "f": "soixante-deux",
        "p": "kaklaw sleure keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "63.(kaklaw sləre kəyən hoku)",
        "f": "soixante-trois",
        "p": "kaklaw sleure keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "64.(kaklaw sləre kəyən poɗo)",
        "f": "soixante-quatre",
        "p": "kaklaw sleure keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "65.(kaklaw sləre kəyən sle)",
        "f": "soixante-cinq",
        "p": "kaklaw sleure keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "66.(kaklaw sləre kəyən sləre)",
        "f": "soixante-six",
        "p": "kaklaw sleure keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "67.(kaklaw sləre kəyən buhul)",
        "f": "soixante-sept",
        "p": "kaklaw sleure keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "68.(kaklaw sləre kəyən dədopoɗo)",
        "f": "soixante-huit",
        "p": "kaklaw sleure keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "69.(kaklaw sləre kəyən vaytak)",
        "f": "soixante-neuf",
        "p": "kaklaw sleure keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "70.(kaklaw buhul)",
        "f": "Soixante-dix",
        "p": "kaklaw bouhoule"
      },
      {
        "g": "71.(kaklaw buhul kəyən taka)",
        "f": "soixante et onze",
        "p": "kaklaw bouhoul keuyeun taka",
        "pProvisoire": true
      },
      {
        "g": "72.(kaklaw buhul kəyən sula)",
        "f": "soixante-douze",
        "p": "kaklaw bouhoul keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "73.(kaklaw buhul kəyən hoku)",
        "f": "soixante-treize",
        "p": "kaklaw bouhoul keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "74.(kaklaw buhul kəyən poɗo)",
        "f": "soixante-quatorze",
        "p": "kaklaw bouhoul keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "75.(kaklaw buhul kəyən sle)",
        "f": "soixante-quinze",
        "p": "kaklaw bouhoul keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "76.(kaklaw buhul kəyən sləre)",
        "f": "soixante-seize",
        "p": "kaklaw bouhoul keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "77.(kaklaw buhul kəyən buhul)",
        "f": "soixante-dix-sept",
        "p": "kaklaw bouhoul keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "78.(kaklaw buhul kəyən dədopoɗo)",
        "f": "soixante-dix-huit",
        "p": "kaklaw bouhoul keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "79.(kaklaw buhul kəyən vaytak)",
        "f": "soixante-dix-neuf",
        "p": "kaklaw bouhoul keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "80.(kaklaw dədopoɗo)",
        "f": "Quatre-vingts",
        "p": "kaklaw deudopodo"
      },
      {
        "g": "81.(kaklaw dədopoɗo kəyən taka)",
        "f": "quatre-vingt-un",
        "p": "kaklaw deudopodo keuyeun taka",
        "pProvisoire": true
      },
      {
        "g": "82.(kaklaw dədopoɗo kəyən sula)",
        "f": "quatre-vingt-deux",
        "p": "kaklaw deudopodo keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "83.(kaklaw dədopoɗo kəyən hoku)",
        "f": "quatre-vingt-trois",
        "p": "kaklaw deudopodo keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "84.(kaklaw dədopoɗo kəyən poɗo)",
        "f": "quatre-vingt-quatre",
        "p": "kaklaw deudopodo keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "85.(kaklaw dədopoɗo kəyən sle)",
        "f": "quatre-vingt-cinq",
        "p": "kaklaw deudopodo keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "86.(kaklaw dədopoɗo kəyən sləre)",
        "f": "quatre-vingt-six",
        "p": "kaklaw deudopodo keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "87.(kaklaw dədopoɗo kəyən buhul)",
        "f": "quatre-vingt-sept",
        "p": "kaklaw deudopodo keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "88.(kaklaw dədopoɗo kəyən dədopoɗo)",
        "f": "quatre-vingt-huit",
        "p": "kaklaw deudopodo keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "89.(kaklaw dədopoɗo kəyən vaytak)",
        "f": "quatre-vingt-neuf",
        "p": "kaklaw deudopodo keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "90.(kaklaw vaytak)",
        "f": "Quatre-vingt-dix",
        "p": "kaklaw vaytak"
      },
      {
        "g": "91.(kaklaw vaytak kəyən taka)",
        "f": "quatre-vingt-onze",
        "p": "kaklaw vaytak keuyeun taka",
        "pProvisoire": true
      },
      {
        "g": "92.(kaklaw vaytak kəyən sula)",
        "f": "quatre-vingt-douze",
        "p": "kaklaw vaytak keuyeun soula",
        "pProvisoire": true
      },
      {
        "g": "93.(kaklaw vaytak kəyən hoku)",
        "f": "quatre-vingt-treize",
        "p": "kaklaw vaytak keuyeun hokou",
        "pProvisoire": true
      },
      {
        "g": "94.(kaklaw vaytak kəyən poɗo)",
        "f": "quatre-vingt-quatorze",
        "p": "kaklaw vaytak keuyeun podo",
        "pProvisoire": true
      },
      {
        "g": "95.(kaklaw vaytak kəyən sle)",
        "f": "quatre-vingt-quinze",
        "p": "kaklaw vaytak keuyeun sle",
        "pProvisoire": true
      },
      {
        "g": "96.(kaklaw vaytak kəyən sləre)",
        "f": "quatre-vingt-seize",
        "p": "kaklaw vaytak keuyeun sleure",
        "pProvisoire": true
      },
      {
        "g": "97.(kaklaw vaytak kəyən buhul)",
        "f": "quatre-vingt-dix-sept",
        "p": "kaklaw vaytak keuyeun bouhoul",
        "pProvisoire": true
      },
      {
        "g": "98.(kaklaw vaytak kəyən dədopoɗo)",
        "f": "quatre-vingt-dix-huit",
        "p": "kaklaw vaytak keuyeun deudopodo",
        "pProvisoire": true
      },
      {
        "g": "99.(kaklaw vaytak kəyən vaytak)",
        "f": "quatre-vingt-dix-neuf",
        "p": "kaklaw vaytak keuyeun vaytak",
        "pProvisoire": true
      },
      {
        "g": "100.(səkat)",
        "f": "Cent",
        "p": "sekat"
      },
      {
        "g": "200.(səkat sula)",
        "f": "Deux cents",
        "p": "sekat soula"
      },
      {
        "g": "500.(səkat sle)",
        "f": "Cinq cents",
        "p": "sekat slé"
      },
      {
        "g": "...ha",
        "f": "...jusqu'à",
        "p": "ha",
        "pProvisoire": true
      },
      {
        "g": "1000.(gabal)",
        "f": "Mille",
        "p": "gabal"
      }
    ]
  },
  {
    "titre": "LEÇON 3 — FAMILLE",
    "icone": "👨‍👩‍👧",
    "mots": [
      {
        "g": "ma əlfa",
        "f": "La famille",
        "p": "ma eulfa"
      },
      {
        "g": "afen gƏla",
        "f": "Père de la maison",
        "p": "afen geula"
      },
      {
        "g": "ma gƏla",
        "f": "Mère de la maison",
        "p": "ma geula"
      },
      {
        "g": "gƏla",
        "f": "Maison",
        "p": "geula"
      },
      {
        "g": "Əbba",
        "f": "Papa / Père",
        "p": "eubba"
      },
      {
        "g": "Əmma",
        "f": "Maman / Mère",
        "p": "eumma"
      },
      {
        "g": "madjyawa",
        "f": "Mon oncle paternel",
        "p": "madjiawa"
      },
      {
        "g": "gƏmsƏwa",
        "f": "Mon oncle maternel",
        "p": "geumseua"
      },
      {
        "g": "mamdaya",
        "f": "Ma tante paternelle",
        "p": "mamdaya"
      },
      {
        "g": "mamsawa",
        "f": "Ma tante maternelle",
        "p": "mamsawa"
      },
      {
        "g": "dəwa",
        "f": "Grand-père",
        "p": "deuwa"
      },
      {
        "g": "ədde/ dədde",
        "f": "Grand-mère",
        "p": "eudde / deudde"
      },
      {
        "g": "məlməwa",
        "f": "Mon frère",
        "p": "meulmeua"
      },
      {
        "g": "məlməwtə",
        "f": "Elle est ma sœur",
        "p": "meulmeouteu"
      },
      {
        "g": "milmigigwa",
        "f": "Mes frères",
        "p": "milmigigwa"
      }
    ]
  },
  {
    "titre": "LEÇON 4 — CERTAINES PARTIES DU CORPS HUMAIN",
    "icone": "🧍",
    "mots": [
      {
        "g": "ɗəfa",
        "f": "Humain",
        "p": "deufa"
      },
      {
        "g": "kəy ɗəfa",
        "f": "La tête humaine",
        "p": "keuy deufa"
      },
      {
        "g": "muhur kəy ɗəfa",
        "f": "Cheveux humains",
        "p": "mouhoure keuy deufa"
      },
      {
        "g": "mibiss ɗəfa",
        "f": "Le front humain",
        "p": "mibiss deufa"
      },
      {
        "g": "hara ɗəfa",
        "f": "Les yeux",
        "p": "hara deufa"
      },
      {
        "g": "əngkən ɗəfa",
        "f": "Le nez",
        "p": "eungkeun deufa"
      },
      {
        "g": "sləma ɗəfa",
        "f": "Oreille(s)",
        "p": "sleurma deufa"
      },
      {
        "g": "ma ɗəfa",
        "f": "La bouche",
        "p": "ma deufa"
      },
      {
        "g": "tapaslay ɗəfa",
        "f": "La joue",
        "p": "tapaslay deufa"
      },
      {
        "g": "modom ɗəfa",
        "f": "Le menton",
        "p": "modom deufa"
      },
      {
        "g": "makra ɗəfa",
        "f": "La poitrine humaine",
        "p": "makra deufa"
      },
      {
        "g": "kəy va ɗəfa",
        "f": "Épaule humaine",
        "p": "keuy va deufa"
      },
      {
        "g": "persleke ɗəfa",
        "f": "Les aisselles humaines",
        "p": "perslekè deufa"
      },
      {
        "g": "bide ɗəfa",
        "f": "Le(s) sein(s)",
        "p": "bidé deufa"
      },
      {
        "g": "mangalaw va ɗəfa",
        "f": "Le bras",
        "p": "mangalaw va deufa"
      },
      {
        "g": "sosoŋglong va ɗəfa",
        "f": "avant-bras",
        "p": "sosongglong va deufa",
        "pProvisoire": true
      },
      {
        "g": "gədəf ɗəfa",
        "f": "le ventre",
        "p": "geudeuf deufa",
        "pProvisoire": true
      },
      {
        "g": "marba ɗəfa",
        "f": "Le nombril",
        "p": "marba deufa"
      },
      {
        "g": "kəy buh ɗəfa",
        "f": "Pubis",
        "p": "keuy bouh deufa"
      },
      {
        "g": "gəmən ɗəfa",
        "f": "le pénis",
        "p": "geumeun deufa",
        "pProvisoire": true
      },
      {
        "g": "kərka/ kəryət ɗakə",
        "f": "le vagin de la femme",
        "p": "keurka keuryeut dakeu",
        "pProvisoire": true
      },
      {
        "g": "mamba gəɗəv ɗəfa",
        "f": "Le bas-ventre",
        "p": "mamba geudeuv deufa"
      },
      {
        "g": "kirtin va ɗəfa",
        "f": "Les doigts",
        "p": "kirtin va deufa"
      },
      {
        "g": "va ɗəfa",
        "f": "La main humaine",
        "p": "va deufa"
      },
      {
        "g": "tapaslak va ɗəfa",
        "f": "Paume de main",
        "p": "tapaslayk va deufa"
      },
      {
        "g": "metetile ɗəfa",
        "f": "La cuisse",
        "p": "metetilè deufa"
      },
      {
        "g": "gəba ɗəfa",
        "f": "Le dos",
        "p": "geuba deufa"
      },
      {
        "g": "gəba zə ɗəfa",
        "f": "la pau",
        "p": "geuba zeu deufa",
        "pProvisoire": true
      },
      {
        "g": "tapaslay ɗəfa",
        "f": "lajoue",
        "p": "tapaslay deufa",
        "pProvisoire": true
      },
      {
        "f": "quelques parties arrières du corps humain"
      },
      {
        "g": "zenzer gəba ɗəfa",
        "f": "La colonne vertébrale",
        "p": "zenzer geuba deufa"
      },
      {
        "g": "modoŋgbol ɗəfa",
        "f": "La nuque",
        "p": "modongbol deufa"
      },
      {
        "g": "gabba ɗəfa",
        "f": "Les fesses",
        "p": "gabba deufa"
      },
      {
        "g": "priŋgiɗ va ɗəfa",
        "f": "Les ongles des doigts",
        "p": "pringuid va deufa"
      },
      {
        "g": "slurum ɗəfa",
        "f": "sillon interfessier",
        "p": "slouroum deufa",
        "pProvisoire": true
      },
      {
        "g": "walaŋg təl ɗəfa",
        "f": "entre tes jambes",
        "p": "walangg teul deufa",
        "pProvisoire": true
      },
      {
        "g": "wandalaŋg təl ɗəfa",
        "f": "Le mollet",
        "p": "wandalang teul deufa"
      },
      {
        "g": "hara təl ɗəfa",
        "f": "La cheville",
        "p": "hara teul deufa"
      },
      {
        "g": "motokpo-tokpo təl ɗəfa",
        "f": "Le talon",
        "p": "motokpo tokpo teul deufa"
      },
      {
        "g": "gədəf təl ɗəfa",
        "f": "Plante de pied",
        "p": "geudeuv teul deufa"
      },
      {
        "g": "duŋgbul va ɗəfa",
        "f": "Le coude",
        "p": "doungboul va deufa"
      },
      {
        "g": "koffor ɗəfa",
        "f": "La hanche",
        "p": "koffor deufa"
      },
      {
        "g": "gəba va təl ɗəfa",
        "f": "le dos de la main",
        "p": "geuba va teul deufa",
        "pProvisoire": true
      },
      {
        "g": "kirtin təl ɗəfa",
        "f": "Les orteils",
        "p": "kirtin teul deufa"
      }
    ]
  },
  {
    "titre": "LEÇON 5 — LE TEMPS",
    "icone": "💬",
    "mots": [
      {
        "f": "Note: ə=eu / ɗ=d / ɓ=b / ŋ=ng / ɔ=o / ɛ=è / u=ou / y=y"
      },
      {
        "g": "Minti",
        "f": "Minute",
        "p": "minti",
        "pProvisoire": true
      },
      {
        "g": "Təbəs",
        "f": "L'heure",
        "p": "teubeus",
        "pProvisoire": true
      },
      {
        "g": "Əvong / uvong / pay",
        "f": "Jour / journée",
        "p": "euvong / ouvong / pay",
        "pProvisoire": true
      },
      {
        "g": "Kapaya",
        "f": "La journée",
        "p": "kapaya",
        "pProvisoire": true
      },
      {
        "g": "Bapummo",
        "f": "Petit matin, de 1 h à 5 h 59",
        "p": "bapoummo",
        "pProvisoire": true
      },
      {
        "g": "Dəmpummo pum",
        "f": "Très tôt le matin, entre 6 h et 7 h 59",
        "p": "deumpoummo poum",
        "pProvisoire": true
      },
      {
        "g": "Payndǫhǫ",
        "f": "Période entre 8 h et 11 h 59, quand les lézards se réchauffent au soleil du matin",
        "p": "payndohou",
        "pProvisoire": true
      },
      {
        "g": "Tatang paya",
        "f": "Midi, entre 12 h et 12 h 59",
        "p": "tatang paya",
        "pProvisoire": true
      },
      {
        "g": "Pay vərokk",
        "f": "Après-midi, entre 13 h et 14 h 59",
        "p": "pay veurokk",
        "pProvisoire": true
      },
      {
        "g": "Pay moskoyo",
        "f": "Soir, entre 15 h et 17 h 59",
        "p": "pay moskoyo",
        "pProvisoire": true
      },
      {
        "g": "Dəfɗa",
        "f": "La nuit, de 18 h à 23 h 59",
        "p": "deufda",
        "pProvisoire": true
      },
      {
        "g": "Tatang dəfɗa an ɓabo tətəŋg sini",
        "f": "Minuit, entre 0 h et 0 h 59",
        "p": "tatang deufda an babo teuteung sini",
        "pProvisoire": true
      },
      {
        "g": "Dəpanka",
        "f": "Aujourd'hui",
        "p": "deupanka",
        "pProvisoire": true
      },
      {
        "g": "Na dəfɗanga",
        "f": "Hier",
        "p": "na deufdanga",
        "pProvisoire": true
      },
      {
        "g": "Na sungo / Na be nəfɗanga",
        "f": "Avant-hier",
        "p": "na soungo / na be nefdanga",
        "pProvisoire": true
      },
      {
        "g": "Na be na sungo",
        "f": "Avant-avant-hier",
        "p": "na be na soungo",
        "pProvisoire": true
      },
      {
        "g": "Mazayən",
        "f": "Prochain / prochaine / prochainement",
        "p": "mazayeun",
        "pProvisoire": true
      },
      {
        "g": "əvong buhul",
        "f": "Une semaine",
        "p": "euvong bouhoul",
        "pProvisoire": true
      },
      {
        "g": "Təla",
        "f": "Mois / lune",
        "p": "teula",
        "pProvisoire": true
      },
      {
        "g": "Təla dətongu",
        "f": "Le mois passé",
        "p": "teula deutongou",
        "pProvisoire": true
      },
      {
        "g": "Təla dədazan",
        "f": "Le mois qui vient / le mois prochain",
        "p": "teula deudazan",
        "pProvisoire": true
      },
      {
        "g": "Əzva",
        "f": "L'année",
        "p": "euzva",
        "pProvisoire": true
      },
      {
        "g": "Əzva səkat",
        "f": "Un siècle",
        "p": "euzva seukat",
        "pProvisoire": true
      },
      {
        "g": "Əzva dupu",
        "f": "Un millénaire",
        "p": "euzva doupou",
        "pProvisoire": true
      }
    ]
  },
  {
    "titre": "LEÇON 6 — LES JOURS DE LA SEMAINE",
    "icone": "📖",
    "mots": [
      {
        "g": "Əya net əvong ɗe buhul də ma Kada",
        "f": "Les sept jours de la semaine",
        "p": "euya net euvong de bouhoul de ma kada",
        "pProvisoire": true
      },
      {
        "g": "Pay na Zigi / Altine",
        "f": "Lundi",
        "p": "pay na zigi / altine",
        "pProvisoire": true
      },
      {
        "g": "Pay na Gardama / Salassa",
        "f": "Mardi",
        "p": "pay na gardama / salassa",
        "pProvisoire": true
      },
      {
        "g": "Pay na Mampar / Alarba",
        "f": "Mercredi",
        "p": "pay na mampar / alarba",
        "pProvisoire": true
      },
      {
        "g": "Pay na Malway / Alamissa",
        "f": "Jeudi",
        "p": "pay na malway / alamissa",
        "pProvisoire": true
      },
      {
        "g": "Pay na Gədar / Maunde / Djoumbare",
        "f": "Vendredi",
        "p": "pay na geudar / maunde / djoumbare",
        "pProvisoire": true
      },
      {
        "g": "Pay na Zlam / Assewe",
        "f": "Samedi",
        "p": "pay na zlam / assewe",
        "pProvisoire": true
      },
      {
        "g": "Pay na Budva / Alat",
        "f": "Dimanche",
        "p": "pay na budva / alat",
        "pProvisoire": true
      },
      {
        "f": "Note: les noms des jours après les barres obliques sont des emprunts du fulfuldé, mais sont couramment utilisés dans le parler quotidien des Guidars."
      }
    ]
  },
  {
    "titre": "LEÇON 7 — LES 12 MOIS DE L'ANNÉE",
    "icone": "📖",
    "mots": [
      {
        "g": "Təla də də ma kada",
        "f": "Les 12 mois de l'année en Guidar",
        "p": "teula de de ma kada",
        "pProvisoire": true
      },
      {
        "g": "Təla na Kogong",
        "f": "Janvier",
        "p": "teula na kogong",
        "pProvisoire": true
      },
      {
        "g": "Təla na Zigi",
        "f": "Février",
        "p": "teula na zigi",
        "pProvisoire": true
      },
      {
        "g": "Təla na Sulom",
        "f": "Mars",
        "p": "teula na sulom",
        "pProvisoire": true
      },
      {
        "g": "Təla na Gədar",
        "f": "Avril",
        "p": "teula na geudar",
        "pProvisoire": true
      },
      {
        "g": "Təla na Heri",
        "f": "Mai",
        "p": "teula na heri",
        "pProvisoire": true
      },
      {
        "g": "Təla na mpeske",
        "f": "Juin",
        "p": "teula na mpeske",
        "pProvisoire": true
      },
      {
        "g": "Təla na Yomu/Bu um",
        "f": "Juillet",
        "p": "teula na yomou / bou oum",
        "pProvisoire": true
      },
      {
        "g": "Təla na Mogdok arə pəluw ɓa",
        "f": "Août",
        "p": "teula na mogdok areu peulouw ba",
        "pProvisoire": true
      },
      {
        "g": "Təla na Hawi",
        "f": "Septembre",
        "p": "teula na hawi",
        "pProvisoire": true
      },
      {
        "g": "Təla na banga/derdew",
        "f": "Octobre",
        "p": "teula na banga / derdew",
        "pProvisoire": true
      },
      {
        "g": "Təla na Kurki dəva / na mbana",
        "f": "Novembre",
        "p": "teula na kourki deva / na mbana",
        "pProvisoire": true
      },
      {
        "g": "Təla na Dɔva",
        "f": "Décembre",
        "p": "teula na dova",
        "pProvisoire": true
      }
    ]
  },
  {
    "titre": "LEÇON 8 — CIVILITÉS ET EXPRESSIONS",
    "icone": "📖",
    "aValider": true,
    "mots": [
      {
        "g": "Mbar addang di ?",
        "f": "Comment avez-vous passé la nuit ?"
      },
      {
        "g": "Əbba",
        "f": "Papa (terme d’adresse)"
      },
      {
        "g": "Əmma",
        "f": "Maman (terme d’adresse)"
      },
      {
        "g": "Madjyawa",
        "f": "Mon oncle paternel"
      },
      {
        "g": "Gəmswa",
        "f": "Mon oncle maternel"
      },
      {
        "g": "Mamdya",
        "f": "Ma tante paternelle"
      },
      {
        "g": "Mamsawa",
        "f": "Ma tante maternelle"
      },
      {
        "g": "Dəwa",
        "f": "Grand-père (maternel ou paternel), beau-père, ou homme de l’âge d’un grand-père"
      },
      {
        "g": "Dədde / ədde",
        "f": "Grand-mère (maternelle ou paternelle), belle-mère, ou femme de l’âge d’une grand-mère"
      },
      {
        "g": "Məlməwa",
        "f": "Mon frère (terme employé pour un garçon comme pour une fille)"
      },
      {
        "g": "Baynawa",
        "f": "Mon ami(e)"
      },
      {
        "g": "Galawa",
        "f": "Mon égal / ma camarade de classe"
      },
      {
        "g": "Wako / Wanko / Wang gorku",
        "f": "Fille / jeune fille"
      },
      {
        "g": "Wana / Wəyona",
        "f": "Garçon / jeune garçon"
      },
      {
        "g": "Zami / Djami",
        "f": "Quand tout va bien"
      },
      {
        "g": "Zami ba",
        "f": "Quand il y a un problème"
      },
      {
        "g": "Mosbatsəm zamo",
        "f": "Passons une bonne journée / Bonne journée"
      },
      {
        "g": "Sey / si moskoyo",
        "f": "Le soir seulement. Pour souhaiter de se revoir le soir, on répond « Yo » (d’accord)."
      },
      {
        "g": "Mangəlva dəpsuk sa'a / Mangəlva dəpsuk draha",
        "f": "Bonne chance / Que Dieu t’accorde la chance d’obtenir ce qui est bien"
      },
      {
        "g": "Mbar məsbat di ?",
        "f": "Comment avez-vous passé la journée ? La réponse est la même que pour les salutations précédentes."
      },
      {
        "g": "Məvong səm zamə",
        "f": "Dormons bien / Bonne nuit"
      }
    ]
  },
  {
    "titre": "LEÇON 9 — VERBES ET CONJUGAISON",
    "icone": "📖",
    "aValider": true,
    "mots": [
      {
        "g": "Əzzo / əzza",
        "f": "Venir"
      },
      {
        "g": "Ade",
        "f": "Viens. « Yo » ou « Ya’aw » signifie « d’accord » ; « Yo an tat əzzawa » : d’accord j’arrive ; « Nəde na ba » : je ne viens pas."
      },
      {
        "g": "Məde",
        "f": "Venez. « Yo / Ya’aw mənam tat əzzamə » : d’accord nous arrivons ; « Aw’wo məde na ba » : nous ne venons pas."
      },
      {
        "g": "Əpsa",
        "f": "Donner ou cuire à la braise, selon le contexte"
      },
      {
        "g": "Əpsa səlwa",
        "f": "Cuire de la viande à la braise"
      },
      {
        "g": "Əpsa zoga sɔn dəfa",
        "f": "Donner quelque chose à quelqu’un"
      },
      {
        "g": "Əzla",
        "f": "Brûler / faire preuve de chicheté"
      },
      {
        "g": "Avayə ou apsdwa",
        "f": "Donne-moi. « Yo naha » : d’accord, prends ; « Aw’wo nəpsuk na ba » : je ne te donne pas."
      },
      {
        "g": "Məvayə ou məpsdwa",
        "f": "Donnez-moi. Réponses identiques à « Avayə »."
      },
      {
        "g": "Məpsiti",
        "f": "Donnez-leur. « Yo a məpsiti » : d’accord, nous leur donnerons."
      },
      {
        "g": "Addo / odda / dombata",
        "f": "Partir / aller"
      },
      {
        "g": "Tola a mbat ka",
        "f": "Le mois est déjà fini ou passé"
      },
      {
        "g": "Əmbata a ma wuza",
        "f": "Partir au travail"
      },
      {
        "g": "Ndoko",
        "f": "Vas-y. « Ndok a lokol » : va à l’école ; « Ndok à lumo » ou « a təkdəy ma terere » : va au marché ; « Ndok a misson » : va à l’église."
      },
      {
        "g": "Məddonga",
        "f": "Allez-y / partez"
      },
      {
        "g": "Məndam / ndamda",
        "f": "Allons-y / partons"
      },
      {
        "g": "Əmbadə",
        "f": "Puiser"
      },
      {
        "g": "Ə'əgəmə",
        "f": "Prendre"
      },
      {
        "g": "Ə'əgəm waya",
        "f": "Prends la nourriture. La forme de l’impératif est expliquée dans la source."
      },
      {
        "g": "Məgəmə",
        "f": "Prenez / prenez-le"
      },
      {
        "g": "Okolo",
        "f": "Ouvrir. « Intat əkolən » : j’ouvre ; « Akolo » : ouvre ; « Məkolo » : ouvrez ; « Məkolosəmə » : ouvrons."
      },
      {
        "g": "Əmpand",
        "f": "Fermer"
      },
      {
        "g": "Ərma",
        "f": "S’embraser / prendre feu / chauffer / attraper / arrêter"
      },
      {
        "g": "Əkekedehe",
        "f": "Éclairer"
      },
      {
        "g": "Ətafa",
        "f": "Recevoir / croire / accepter"
      },
      {
        "g": "Əngla",
        "f": "Solliciter / demander / aimer"
      },
      {
        "g": "Əpara",
        "f": "Vomir"
      },
      {
        "g": "Əpele",
        "f": "Parler"
      },
      {
        "g": "Əprəma",
        "f": "Entendre / comprendre / obéir"
      },
      {
        "g": "Ətipe",
        "f": "Coller / serrer / devenir aveugle ou boucher"
      },
      {
        "g": "Əsuko",
        "f": "Boucher / assourdir"
      },
      {
        "g": "Əvəla",
        "f": "Vendre / faire un don charitable"
      },
      {
        "g": "Əttapa",
        "f": "Se tromper / confondre"
      },
      {
        "g": "Əddere",
        "f": "Reculer / régresser"
      },
      {
        "g": "Əbongo",
        "f": "Refuser"
      },
      {
        "g": "Əplana",
        "f": "Laisser / lâcher"
      },
      {
        "g": "Əbehe",
        "f": "Se courber"
      },
      {
        "g": "Əwəla",
        "f": "Regarder"
      },
      {
        "g": "Əmta",
        "f": "Mourir / expirer"
      },
      {
        "g": "Əssine",
        "f": "Rêver"
      },
      {
        "g": "Əbbaha",
        "f": "Aider. « Abbasəna » : aide-le ; « Abbasəta » : aide-la."
      },
      {
        "g": "Əkkəh",
        "f": "Frotter / brosser / ramper"
      },
      {
        "g": "Əkkporo",
        "f": "Racler avec un râteau, les doigts ou un balai"
      },
      {
        "g": "Əslaya",
        "f": "Se laver / se doucher"
      },
      {
        "g": "Əppaya",
        "f": "Nettoyer / s’oindre / masser / caresser"
      },
      {
        "g": "Əvere",
        "f": "Écrire / dessiner / implanter"
      },
      {
        "g": "Əyaka",
        "f": "Apprendre / se former"
      },
      {
        "g": "Əngaa",
        "f": "Lire / compter"
      },
      {
        "g": "Əmoho",
        "f": "Arracher / déposer"
      },
      {
        "g": "Əhəla",
        "f": "Voler"
      },
      {
        "g": "Əfada",
        "f": "Balayer / raser les cheveux ou les poils / rembourser / payer"
      },
      {
        "g": "Əda",
        "f": "Préparer la nourriture, le vin ou des beignets ; plaire"
      },
      {
        "g": "Əslebeɗe",
        "f": "Décortiquer"
      },
      {
        "g": "Əvenge",
        "f": "S’envoler"
      },
      {
        "g": "Əslaha",
        "f": "Sauter"
      },
      {
        "g": "Əngkoro",
        "f": "Nager / conduire"
      },
      {
        "g": "Əbuh ma",
        "f": "Prier / supplier / se lamenter"
      },
      {
        "g": "Əpenge",
        "f": "Monter / grimper / s’élever"
      },
      {
        "g": "Əngzla mebelme",
        "f": "Critiquer / désavouer / discuter"
      },
      {
        "g": "Intat dǝzǝma — Istǝt dǝzǝma — Tay/Tat dǝzǝma",
        "f": "Au présent : je mange — tu manges — il/elle mange."
      },
      {
        "g": "Mənam tat dǝzǝma — Mənokum tat dǝzǝma — Tang dǝzǝmangə",
        "f": "Au présent : nous mangeons — vous mangez — ils/elles mangent."
      },
      {
        "g": "Nə dǝzǝmka — Kə dǝzǝmka — A/Tə dǝzǝmka",
        "f": "Au passé : j’ai mangé — tu as mangé — il/elle a mangé."
      },
      {
        "g": "Mə dǝzǝmka — Kə dǝzǝmanka — A dǝzǝmanka",
        "f": "Au passé : nous avons mangé — vous avez mangé — ils/elles ont mangé."
      },
      {
        "g": "WA nə dǝzǝmǝ — Wa kə dǝzǝmǝ — Wa dǝzǝmǝ / Wa tə dǝzǝmǝ",
        "f": "Au futur : je vais manger — tu vas manger — il/elle va manger."
      },
      {
        "g": "Wa mə dǝzǝmǝ — Wa kə dǝzǝmangə — Wa dǝzǝmangə",
        "f": "Au futur : nous allons manger — vous allez manger — ils/elles vont manger."
      },
      {
        "g": "Guɣu'u — Tele tele — Kaf kaf",
        "f": "Rapidement / doucement / léger ou moins épais"
      }
    ]
  },
  {
    "titre": "LEÇON 10 — VOCABULAIRE ET CULTURE",
    "icone": "📖",
    "aValider": true,
    "mots": [
      {
        "g": "Gəla",
        "f": "La maison / traces d’un animal ou d’un objet"
      },
      {
        "g": "Əndeyne / əndayna",
        "f": "Poids de terre"
      },
      {
        "g": "Haya",
        "f": "Le mil"
      },
      {
        "g": "Hina",
        "f": "Haricot (Nyébè)"
      },
      {
        "g": "Gəpa",
        "f": "La farine"
      },
      {
        "g": "Gərma",
        "f": "Cailloux / pierre / montagne"
      },
      {
        "g": "Gadmanɣa / Gapmaya",
        "f": "Le coton"
      },
      {
        "g": "Milbe",
        "f": "Pierre plutonique"
      },
      {
        "g": "Həmbala",
        "f": "L’arachide"
      },
      {
        "g": "Əlava",
        "f": "Barrière en paille"
      },
      {
        "g": "Tibi",
        "f": "Canari d’eau"
      },
      {
        "g": "Boyəna",
        "f": "Toiture en paille"
      },
      {
        "g": "Masərga",
        "f": "Marmite en pot"
      },
      {
        "g": "Mam’mbara",
        "f": "Barrière en branches d’arbres épineux / balise"
      },
      {
        "g": "Hawə",
        "f": "La chèvre"
      },
      {
        "g": "Pəbveing",
        "f": "Sorte de piège utilisant la pierre et le bois"
      },
      {
        "g": "Time",
        "f": "Le mouton"
      },
      {
        "g": "Bolu / bolu",
        "f": "Le lion"
      },
      {
        "g": "Wasliya",
        "f": "Le bœuf"
      },
      {
        "g": "Balgam",
        "f": "La panthère"
      },
      {
        "g": "Kora",
        "f": "Le chien"
      },
      {
        "g": "Dirzlinge",
        "f": "Une hyène"
      },
      {
        "g": "Movo’o",
        "f": "Un chat"
      },
      {
        "g": "Movoku",
        "f": "Une chatte"
      },
      {
        "g": "Kakkam",
        "f": "La souris"
      },
      {
        "g": "Gəmnda",
        "f": "La poule ou le coq"
      },
      {
        "g": "Manduwang",
        "f": "Le rat"
      },
      {
        "g": "Lukut",
        "f": "L’habit"
      },
      {
        "g": "Bente",
        "f": "Culotte / pantalon / cache-sexe"
      },
      {
        "g": "Sərla",
        "f": "Pantalon"
      },
      {
        "g": "Hingzere",
        "f": "L’écureuil"
      },
      {
        "g": "Bənga",
        "f": "L’oiseau"
      },
      {
        "g": "Karmgbaha",
        "f": "La tortue"
      },
      {
        "g": "Koro",
        "f": "L’âne"
      },
      {
        "g": "Kilfi",
        "f": "Le poisson"
      },
      {
        "g": "Vedem",
        "f": "Le porc"
      },
      {
        "g": "Horzlozlong",
        "f": "L’escargot / flûte fabriquée avec une coquille d’escargot"
      },
      {
        "g": "Məffəki / Kənarka",
        "f": "Le canard"
      },
      {
        "g": "Madda",
        "f": "Ver de terre"
      },
      {
        "g": "Mepteke",
        "f": "Couscous"
      },
      {
        "g": "Ambalənya mbalənya",
        "f": "La moule"
      },
      {
        "g": "Tebi",
        "f": "La sauce / les légumes / les feuilles"
      },
      {
        "g": "Motopolopolo",
        "f": "Le papillon"
      },
      {
        "g": "Kiste",
        "f": "Les herbes"
      },
      {
        "g": "Kevile",
        "f": "Une herbe"
      },
      {
        "g": "Heydeing",
        "f": "Le criquet"
      },
      {
        "g": "Wulanga",
        "f": "L’arbre / morceau de bois / bois"
      },
      {
        "g": "Katafay",
        "f": "La crèche ou la mangeoire"
      },
      {
        "g": "Seseme",
        "f": "Bois de chauffage"
      },
      {
        "g": "Biya",
        "f": "Le vin léger"
      },
      {
        "g": "Hoyogoyong / Hay-tətəng",
        "f": "Le maïs"
      },
      {
        "g": "Potopoto / Mbazla mudoto",
        "f": "Vin lourd traditionnel"
      },
      {
        "g": "Mələnya",
        "f": "Le sésame"
      },
      {
        "g": "Sanga",
        "f": "Le mortier"
      },
      {
        "g": "Kirin memedəngə",
        "f": "Les petits enfants"
      },
      {
        "g": "Dəy gugurdə",
        "f": "Les grandes personnes"
      },
      {
        "g": "Mezzedi",
        "f": "Les vieilles personnes"
      },
      {
        "g": "Mazza",
        "f": "Vieil homme"
      },
      {
        "g": "Mazzakə",
        "f": "Vieille femme"
      },
      {
        "g": "Dəfaka sayən",
        "f": "Homme actif à fleur de l’âge"
      },
      {
        "g": "Wang gorku",
        "f": "Jeune fille"
      },
      {
        "g": "Wəyən gawla",
        "f": "Jeune garçon"
      },
      {
        "g": "Wangkə",
        "f": "Fille"
      },
      {
        "g": "Wəyəna",
        "f": "Garçon"
      },
      {
        "g": "Matang karang karang",
        "f": "Mante religieuse"
      },
      {
        "g": "Mekekwekle",
        "f": "Caméléon"
      },
      {
        "g": "Doho",
        "f": "Serpent"
      },
      {
        "g": "Ongornoko",
        "f": "Crapaud"
      },
      {
        "g": "Ngberzlek",
        "f": "Grenouille"
      },
      {
        "g": "Məlpa",
        "f": "La rivière"
      },
      {
        "g": "Pehe",
        "f": "La mer / l’océan"
      },
      {
        "g": "Dising",
        "f": "Le ciel / l’au-delà / le paradis"
      },
      {
        "g": "Daya",
        "f": "Le plus grand / le suprême / supérieur"
      },
      {
        "g": "Mangəlva",
        "f": "Dieu / l’Éternel"
      },
      {
        "g": "Madadaway",
        "f": "Discussion / discorde / concurrence"
      },
      {
        "g": "Mgbangbrang / kabram",
        "f": "Le lit / la couchette"
      },
      {
        "g": "Hongtong",
        "f": "Oreiller"
      },
      {
        "g": "Gokko",
        "f": "Coussin"
      },
      {
        "g": "Godo",
        "f": "Manteau / pagne en cuir"
      },
      {
        "g": "Gordu / Sloho",
        "f": "Le couteau"
      },
      {
        "g": "Slogoy",
        "f": "Faucille"
      },
      {
        "g": "Tulhə",
        "f": "La lance"
      },
      {
        "g": "Gulom",
        "f": "Un carquois"
      },
      {
        "g": "Ondorvoko",
        "f": "Les aubergines"
      },
      {
        "g": "Godongoy",
        "f": "Corossol sauvage"
      },
      {
        "g": "Həmba",
        "f": "Tamarin"
      },
      {
        "g": "Brəiya",
        "f": "Singe"
      },
      {
        "g": "Gbogi",
        "f": "Gorille / chimpanzé"
      },
      {
        "g": "Məkudungulo",
        "f": "Le pigeon"
      },
      {
        "g": "Gəba",
        "f": "Peau / porte-bébé / dos"
      },
      {
        "g": "Hensek",
        "f": "Chaussure"
      },
      {
        "g": "Kulpupu / Pete pete",
        "f": "Chapeau / chechia / bonnet"
      },
      {
        "g": "Tapa",
        "f": "Tabac / valeur d’argent"
      },
      {
        "g": "Goro",
        "f": "La cola"
      },
      {
        "g": "Kulbu",
        "f": "Natron"
      },
      {
        "g": "Bətəwa",
        "f": "Sel gemme"
      },
      {
        "g": "Man’nda",
        "f": "Le sel"
      },
      {
        "g": "Zana",
        "f": "Pagne"
      },
      {
        "g": "Elenge-lenge",
        "f": "Lunettes"
      },
      {
        "g": "Sengfil",
        "f": "Téléphone"
      },
      {
        "g": "Garmafu",
        "f": "Radiodiffusion"
      },
      {
        "g": "Mawta",
        "f": "Voiture"
      },
      {
        "g": "Terere",
        "f": "Marché"
      },
      {
        "g": "Oguru-guru / sita",
        "f": "Piment"
      },
      {
        "g": "Zəler",
        "f": "Lampe torche / lampe tempête"
      },
      {
        "g": "Həlawa / hiliwe",
        "f": "Calebasse"
      },
      {
        "g": "Mədoya",
        "f": "La louche en calebasse"
      },
      {
        "g": "Kotiyo",
        "f": "Filtre à sel gemme"
      },
      {
        "g": "Kosloporo / kosloproko",
        "f": "Écorces"
      },
      {
        "g": "Əffinyo",
        "f": "La fleur"
      },
      {
        "g": "Əwa na zega",
        "f": "Fruit / enfants de…"
      },
      {
        "g": "Gəpa na dama",
        "f": "Le ciment"
      },
      {
        "g": "Mənya",
        "f": "Remèdes / médicaments"
      },
      {
        "g": "Mələnya",
        "f": "Roi / chef traditionnel / chef"
      },
      {
        "g": "Məsdəlva",
        "f": "Gardien de la tradition et exorciste"
      },
      {
        "g": "Məwal heliki / Məwal pidə",
        "f": "Voyant"
      },
      {
        "g": "Həwlək",
        "f": "Varan moniteur à eau"
      },
      {
        "g": "Torsok",
        "f": "Varan de Komodo / dragon de Komodo"
      },
      {
        "g": "Beckne",
        "f": "Éléphant"
      },
      {
        "g": "Mogdok",
        "f": "Vautour / charognard"
      },
      {
        "g": "Messeke serwedd",
        "f": "La girafe"
      },
      {
        "g": "Angkar",
        "f": "Le héron gris"
      },
      {
        "g": "Mahə",
        "f": "Grenier"
      },
      {
        "g": "Gəlo",
        "f": "Foyer"
      },
      {
        "g": "Bəwəna",
        "f": "La pluie / pierre à écraser"
      },
      {
        "g": "Slay bəwəna",
        "f": "Le nuage"
      },
      {
        "g": "Kolay / Koloy",
        "f": "Période de carence de pluie en saison pluvieuse"
      },
      {
        "g": "Ngərzla",
        "f": "Étoile"
      },
      {
        "g": "Tabak",
        "f": "Bandoulière tissée à la main"
      },
      {
        "g": "Mətəma",
        "f": "Pierre ronde taillée pour écraser sur une pierre à écraser"
      },
      {
        "g": "Titinge",
        "f": "La jarre"
      },
      {
        "g": "Mohə",
        "f": "La corne"
      },
      {
        "g": "Meingbew",
        "f": "Baobab"
      },
      {
        "g": "Hoyongko",
        "f": "Sable"
      },
      {
        "g": "Dəlva / Dəlvafung",
        "f": "La boue / la terre / le sol"
      },
      {
        "g": "Məzahə",
        "f": "Arc-en-ciel"
      },
      {
        "g": "Monohə",
        "f": "Sorte de cocotier"
      },
      {
        "g": "Tuiya",
        "f": "Rite de culte traditionnel / sacrifice"
      },
      {
        "g": "Ma heingzing",
        "f": "Tradition / interdits / rite"
      },
      {
        "g": "Molhoiyo",
        "f": "Allogène"
      },
      {
        "g": "Burviya",
        "f": "Femme libre / femme en congé dans son foyer"
      },
      {
        "g": "Malaka",
        "f": "Étranger"
      },
      {
        "g": "Ki mədskiya",
        "f": "Lieu de déguérpissement / ancien lieu habité"
      },
      {
        "g": "A marba guduk",
        "f": "Au lieu de mes origines / berceau de mes ancêtres"
      },
      {
        "g": "Movogot",
        "f": "Réserve pour pâturage / jachère"
      },
      {
        "g": "Guliyo",
        "f": "Champ"
      },
      {
        "g": "Kəpta",
        "f": "Terre aride / sol durci"
      },
      {
        "g": "Mariya riya",
        "f": "Lianes épineuses"
      }
    ]
  },
  {
    "titre": "LEÇON 11 — DIALOGUE ENTRE DEUX ENFANTS",
    "icone": "📖",
    "aValider": true,
    "mots": [
      {
        "g": "Tongou : Ədsoko wana",
        "f": "Salut garçon."
      },
      {
        "g": "Daway : Yiwa soko wakd. Mbar kəna di ?",
        "f": "D’accord, merci jeune fille. Comment tu vas ?"
      },
      {
        "g": "Tongou : Zami. Mbar kənan tam di ?",
        "f": "Ça va. Et toi, comment vas-tu aussi ?"
      },
      {
        "g": "Tongou : Zami bana mbrayin tay ba.",
        "f": "Ça va, sinon rien de mal."
      },
      {
        "g": "Daway : As mogoni.",
        "f": "C’est bien."
      },
      {
        "g": "Tongou : Naw iya naw na Tongou əyɗ. Əzva naw vaytak əyɗ. Nok mbari iya nok di ?",
        "f": "Moi, mon nom est Tongou. J’ai 9 ans. Et toi ?"
      },
      {
        "g": "Daway : Yo mogoni. Iya naw na Daway əyɗ. Əzva naw bo klaw.",
        "f": "D’accord, c’est bien. Mon nom est Daway. J’ai 10 ans."
      },
      {
        "g": "Tongou : Naw wətən Tizi na Slabay nənand. Nok wətən nawa kənan di ?",
        "f": "Je suis l’enfant de Tizi de Slabay. Et toi, qui est ton père ?"
      },
      {
        "g": "Daway : Naw bo wətən Toumba Madomdoko ənanə.",
        "f": "Moi, je suis l’enfant de Toumba Madomdoko."
      },
      {
        "g": "Tongou : Mahəlfa naw bo Məkərba əyɗ. Məy həlfa nok tam di ?",
        "f": "Mon clan est Meukarba. Quel est ton clan ?"
      },
      {
        "g": "Daway : Mahəlfa naw Bəzar na maliya.",
        "f": "Mon clan est Bizar na Meuliya."
      },
      {
        "g": "Tongou : Iya nat maw bo Dambəkɗ na Zourmba. Mbari iya nat mok tam di ?",
        "f": "Le nom de ma mère est Dambekdeu de Zourmba. Et le nom de ta mère ?"
      },
      {
        "g": "Daway : Maddəkə na Tourmba Arfaw əy iya nat mawa.",
        "f": "Maddekeu de Tourmba Arfaw est le nom de ma mère."
      },
      {
        "g": "Tongou : Naw bərni naw an ənda əsaw na Yaounde əy, walangla Etoudi. Dze n dze əffet na lokol a Gədar. Ya ?",
        "f": "Ma ville de résidence est Yaoundé, quartier Etoudi. Je suis venu en vacances à Guider. Et toi ?"
      },
      {
        "g": "Daway : Ah ! mogoni. Naw ang a Gədar yan nənand sit mijilwa. Walangla nam ba Sanguéré.",
        "f": "Ah, c’est bien. Moi, je réside à Guider avec mes parents. Mon quartier est Sanguéré."
      },
      {
        "g": "Tongou : Klass miy kə dada a lokol di ?",
        "f": "Tu fais quelle classe à l’école ?"
      },
      {
        "g": "Daway : Nə passiyək concur na əbat a 6e may nɗrahək diplom CEP nawa.",
        "f": "J’ai passé le concours d’entrée en 6e et j’ai obtenu mon diplôme CEP (Certificat d’Études primaires)."
      },
      {
        "g": "Tongou : Waoo ! Zuga suko. Magəlva dǫba suk kəldən abe abe. Naw a glok a CM2 ədaddawa.",
        "f": "Waouh, félicitations ! Que Dieu t’aide à aller de l’avant. Moi, je vais à ta place au CM2 (Cours moyen 2)."
      },
      {
        "g": "Daway : Soko dida də kaman Magəlva viwa. Kata Magəlva dəbasuk tam.",
        "f": "Merci beaucoup d’avoir prié Dieu pour moi. Qu’il t’aide également."
      },
      {
        "g": "Tongou : Yuwa soko zu neki daw səmut dəpanka si mazayn əmpa.",
        "f": "D’accord, merci de t’avoir connu dans cet échange. À la prochaine fois."
      },
      {
        "g": "Daway : Zu neki eh dalma dəduko. Si yaska. Məzi səm zamə.",
        "f": "Je suis content aussi de t’avoir rencontré. On fait comme ça, comme tu le souhaites."
      }
    ]
  }
];
