---
title: "Les formats d'image expliqués : Le guide complet"
description: "HEIC, AVIF, WebP, PNG, JPG, TIFF, GIF, BMP — quelle est la différence ? Un guide pratique de tous les formats d'image que vous rencontrerez vraiment."
date: "2025-12-13"
slug: "image-formats-guide"
tags: ["formats d'image", "heic", "jpg", "png", "webp", "avif", "tiff", "gif", "bmp", "guide"]
---

Vous avez une photo qui ne s'ouvre pas. Ou qui ne se télécharge pas. Ou qui prend beaucoup trop de place. Et quelque part dans le message d'erreur, il y a une extension de fichier que vous n'avez jamais vue.

Voici le guide que j'aurais aimé avoir quand j'ai commencé à créer CovertConvert. Pas de blabla, pas de leçons d'histoire sur les formats inventés dans les années 80 — juste ce que fait chaque format, quand l'utiliser et comment convertir entre eux.

## La référence rapide

Voici l'aide-mémoire. Mettez-le en favoris.

| Format | Idéal pour | Supporte la transparence | Avec ou sans perte |
|--------|------------|--------------------------|-------------------|
| **JPG** | Photos, partage | Non | Avec perte |
| **PNG** | Captures d'écran, graphiques | Oui | Sans perte |
| **HEIC** | Photos iPhone | Oui | Les deux |
| **WebP** | Images web | Oui | Les deux |
| **AVIF** | Web nouvelle génération | Oui | Les deux |
| **GIF** | Animations simples | Oui (1 bit) | Sans perte |
| **TIFF** | Impression, archivage | Oui | Les deux |
| **BMP** | Windows ancien | Non | Non compressé |

Maintenant, expliquons vraiment ce que tout ça signifie.

## JPG (JPEG)

Le format que tout le monde connaît. Si vous avez déjà enregistré une photo, vous avez probablement utilisé le JPG.

**Ce que c'est :** Un format avec perte conçu pour les photographies. "Avec perte" signifie qu'il supprime certaines données pour réduire la taille des fichiers. Généralement, on ne voit pas la différence.

**Bon pour :**
- Partager des photos par email ou messagerie
- Télécharger sur les réseaux sociaux
- Tout ce où la taille du fichier compte plus que la qualité parfaite

**Pas bon pour :**
- Les captures d'écran avec du texte (devient flou)
- Les graphiques avec des bords nets
- Tout ce que vous allez éditer plusieurs fois (la qualité se dégrade à chaque enregistrement)

**Le hic :** Pas de support de la transparence. Les zones transparentes deviennent blanches ou noires.

→ [Convertir en JPG](/png-to-jpg/)

## PNG

L'autre format que tout le monde connaît. Faites une capture d'écran sur n'importe quel ordinateur et vous obtiendrez probablement un PNG.

**Ce que c'est :** Un format sans perte qui préserve chaque pixel exactement. Les fichiers sont plus gros qu'en JPG, mais il n'y a pas de perte de qualité.

**Bon pour :**
- Les captures d'écran
- Les logos et graphiques
- Tout ce qui contient du texte
- Les images avec transparence

**Pas bon pour :**
- Les grandes photos (les fichiers deviennent énormes)
- Les situations où la taille du fichier est critique

**Le compromis :** Qualité vs taille de fichier. Le PNG garde tout, mais vous payez en mégaoctets.

→ [Convertir de PNG vers JPG](/png-to-jpg/) | [En savoir plus : PNG vs JPG](/blog/png-vs-jpg/)

## HEIC

Le format qui m'a fait créer ce site.

**Ce que c'est :** Le format photo d'Apple, utilisé par les iPhones depuis 2017. Les fichiers font environ la moitié de la taille du JPG avec la même qualité (ou meilleure).

**Bon pour :**
- Ce n'est... pas vraiment votre choix. Votre iPhone l'utilise tout simplement.

**Le problème :**
- Windows ne l'ouvre pas nativement
- La moitié des sites le refusent pour les téléchargements
- Vos parents ne peuvent définitivement pas l'ouvrir

**Que faire :** Gardez vos photos en HEIC (c'est vraiment mieux), et [convertissez en JPG](/heic-to-jpg/) quand vous devez partager avec le monde non-Apple.

→ [Convertir HEIC en JPG](/heic-to-jpg/) | [Convertir HEIC en PNG](/heic-to-png/) | [En savoir plus : Qu'est-ce que le HEIC ?](/blog/what-is-heic/)

## WebP

La réponse de Google à "Le JPG est vieux, on peut faire mieux ?"

**Ce que c'est :** Un format moderne qui peut faire de la compression avec perte (comme JPG) et sans perte (comme PNG), avec des tailles de fichier plus petites que les deux. Supporte aussi la transparence et l'animation.

**Bon pour :**
- Les sites web (la plupart des navigateurs modernes le supportent)
- Remplacer à la fois JPG et PNG dans de nombreuses situations

**Le problème :** Vous avez probablement trouvé cette page parce que vous avez téléchargé une image d'un site web et maintenant vous ne pouvez pas l'ouvrir. Le WebP est super pour le web, mais les logiciels plus anciens ne le supportent pas.

→ [Convertir WebP en JPG](/webp-to-jpg/) | [Convertir WebP en PNG](/webp-to-png/) | [En savoir plus : Qu'est-ce que WebP ?](/blog/what-is-webp/)

## AVIF

Le petit nouveau. Encore plus récent que WebP.

**Ce que c'est :** Basé sur le codec vidéo AV1, l'AVIF offre les meilleurs taux de compression actuellement disponibles. On parle de 50% plus petit que le JPG à qualité égale.

**Bon pour :**
- Le développement web de pointe
- Les situations où chaque kilooctet compte

**Le problème :** C'est encore tellement nouveau (2019) que le support est inégal. Même certaines applications modernes ne peuvent pas ouvrir les fichiers AVIF.

→ [Convertir AVIF en JPG](/avif-to-jpg/) | [Convertir AVIF en PNG](/avif-to-png/) | [En savoir plus : Qu'est-ce que l'AVIF ?](/blog/what-is-avif/)

## TIFF

Le format que les photographes professionnels adorent et que tout le monde redoute de recevoir.

**Ce que c'est :** Un format flexible et de haute qualité couramment utilisé en photographie, impression et archivage. Peut stocker d'énormes quantités de données d'image.

**Bon pour :**
- Les workflows de photographie professionnelle
- La production d'impression
- Le stockage d'archives

**Le problème :** Les fichiers sont ÉNORMES. Genre, "pourquoi cette photo fait 50 Mo" énorme. Aussi, la plupart des services web ne les acceptent pas.

**Que faire :** Si quelqu'un vous envoie un TIFF, [convertissez-le en JPG](/tiff-to-jpg/) avant d'essayer de faire quoi que ce soit avec. Vous vous remercierez.

→ [Convertir TIFF en JPG](/tiff-to-jpg/) | [Convertir TIFF en PNG](/tiff-to-png/) | [En savoir plus : Qu'est-ce que le TIFF ?](/blog/what-is-tiff/)

## GIF

Oui, comme les animations. Mais aussi un vrai format d'image de 1987 qui refuse de mourir.

**Ce que c'est :** Un format limité à 256 couleurs qui supporte l'animation simple et la transparence basique.

**Bon pour :**
- Les animations simples (évidemment)
- Les graphiques très simples avec peu de couleurs

**Pas bon pour :**
- Les photos (256 couleurs ne suffisent pas)
- Tout ce qui a des dégradés
- Les usages modernes (WebP fait tout ce que fait le GIF, mais en mieux)

**Le hic :** Convertir en JPG ou PNG perd l'animation — vous n'obtenez que la première image.

→ [Convertir GIF en JPG](/gif-to-jpg/) | [Convertir GIF en PNG](/gif-to-png/) | [En savoir plus](/blog/convert-gif-to-jpg/)

## BMP

Une relique de l'ère Windows 3.1 qui continue d'apparaître.

**Ce que c'est :** Le format d'image original de Windows. Stocke des données de pixels brutes, non compressées.

**Bon pour :**
- Honnêtement ? Plus grand-chose.

**Pourquoi ça existe encore :** Logiciels anciens, vieux scanners avec paramètres par défaut, opérations de presse-papiers sur Windows. Vous croiserez occasionnellement des fichiers BMP en vous demandant d'où ils viennent.

**La solution :** [Convertir en JPG](/bmp-to-jpg/) et le fichier sera 10 à 50 fois plus petit sans perte de qualité visible.

→ [Convertir BMP en JPG](/bmp-to-jpg/) | [Convertir BMP en PNG](/bmp-to-png/) | [En savoir plus](/blog/bmp-to-jpg/)

## Comment choisir le bon format

**Pour les photos que vous partagez :** JPG. Compatibilité universelle, qualité suffisante pour la plupart des usages.

**Pour les captures d'écran ou graphiques :** PNG. Le texte reste net, la transparence fonctionne.

**Pour le développement web :** WebP si les navigateurs de votre audience le supportent, avec des alternatives JPG/PNG.

**Pour l'archivage :** TIFF ou PNG pour le sans perte, ou le format original s'il est déjà en HEIC/AVIF.

**Pour tout le reste :** Convertissez vers ce que la chose que vous essayez d'utiliser accepte vraiment.

## La question de la confidentialité

Petite note puisque vous êtes probablement ici pour convertir quelque chose : la plupart des convertisseurs en ligne envoient vos fichiers sur leurs serveurs. Ça signifie qu'une entreprise a maintenant une copie de votre photo.

J'ai créé CovertConvert spécifiquement pour éviter ça. Tout fonctionne dans votre navigateur — vos fichiers ne quittent jamais votre appareil. Vous pouvez le vérifier en regardant l'onglet Réseau dans les outils de développement de votre navigateur pendant la conversion.

[Essayez-le](/) si vous avez des fichiers à convertir.

## Encore des questions ?

Si vous avez affaire à un format spécifique et que ce guide n'a pas couvert votre situation, consultez le blog :

- [La conversion d'images en ligne est-elle sûre ?](/blog/is-online-converter-safe/)
- [Convertir les photos iPhone en JPG](/blog/convert-iphone-photos-to-jpg/)
- [Pourquoi ma photo iPhone ne s'ouvre pas sur Windows ?](/blog/iphone-photo-wont-open-windows/)
- [Convertir des photos sans les envoyer](/blog/convert-photos-without-uploading/)

Ou [utilisez simplement le convertisseur](/) et laissez-le déterminer ce qu'est votre fichier.
