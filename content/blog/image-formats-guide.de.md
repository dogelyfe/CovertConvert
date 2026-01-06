---
title: "Bildformate erklärt: Der vollständige Leitfaden"
description: "HEIC, AVIF, WebP, PNG, JPG, TIFF, GIF, BMP—was ist der Unterschied? Ein praktischer Leitfaden zu jedem Bildformat, dem du tatsächlich begegnen wirst."
date: "2025-12-13"
slug: "image-formats-guide"
tags: ["bildformate", "heic", "jpg", "png", "webp", "avif", "tiff", "gif", "bmp", "ratgeber"]
---

Du hast ein Foto, das sich nicht öffnen lässt. Oder nicht hochladen lässt. Oder viel zu viel Speicherplatz braucht. Und irgendwo in der Fehlermeldung steht eine Dateiendung, die du noch nie gesehen hast.

Das ist der Leitfaden, den ich mir gewünscht hätte, als ich CovertConvert gebaut habe. Kein Geschwafel, keine Geschichtsstunden über Formate, die in den 80ern erfunden wurden—nur was jedes Format tatsächlich macht, wann du es nutzen solltest und wie du zwischen ihnen konvertierst.

## Die Schnellreferenz

Hier ist der Spickzettel. Speicher ihn als Lesezeichen.

| Format | Am besten für | Unterstützt Transparenz | Verlustbehaftet oder verlustfrei |
|--------|---------------|------------------------|----------------------------------|
| **JPG** | Fotos, Teilen | Nein | Verlustbehaftet |
| **PNG** | Screenshots, Grafiken | Ja | Verlustfrei |
| **HEIC** | iPhone-Fotos | Ja | Beides |
| **WebP** | Web-Bilder | Ja | Beides |
| **AVIF** | Next-Gen Web | Ja | Beides |
| **GIF** | Einfache Animationen | Ja (1-Bit) | Verlustfrei |
| **TIFF** | Druck, Archivierung | Ja | Beides |
| **BMP** | Legacy Windows | Nein | Unkomprimiert |

Jetzt lass uns erklären, was das alles bedeutet.

## JPG (JPEG)

Das Format, das jeder kennt. Wenn du jemals ein Foto gespeichert hast, hast du wahrscheinlich JPG benutzt.

**Was es ist:** Ein verlustbehaftetes Format, das für Fotografien entwickelt wurde. "Verlustbehaftet" bedeutet, dass einige Daten weggeworfen werden, um Dateien kleiner zu machen. Du kannst den Unterschied normalerweise nicht sehen.

**Gut für:**
- Fotos per E-Mail oder Messenger teilen
- Auf Social Media hochladen
- Alles, wo Dateigröße wichtiger ist als perfekte Qualität

**Nicht gut für:**
- Screenshots mit Text (wird unscharf)
- Grafiken mit scharfen Kanten
- Alles, was du mehrfach bearbeiten wirst (Qualität verschlechtert sich bei jedem Speichern)

**Der Haken:** Keine Transparenz-Unterstützung. Transparente Bereiche werden weiß oder schwarz.

→ [Zu JPG konvertieren](/png-to-jpg/)

## PNG

Das andere Format, das jeder kennt. Mach einen Screenshot auf irgendeinem Computer und du bekommst wahrscheinlich ein PNG.

**Was es ist:** Ein verlustfreies Format, das jeden Pixel exakt erhält. Dateien sind größer als JPG, aber es gibt keinen Qualitätsverlust.

**Gut für:**
- Screenshots
- Logos und Grafiken
- Alles mit Text
- Bilder mit Transparenz

**Nicht gut für:**
- Große Fotos (Dateien werden riesig)
- Situationen, wo Dateigröße kritisch ist

**Der Kompromiss:** Qualität vs. Dateigröße. PNG behält alles, aber du bezahlst dafür in Megabytes.

→ [Von PNG zu JPG konvertieren](/png-to-jpg/) | [Mehr erfahren: PNG vs JPG](/blog/png-vs-jpg/)

## HEIC

Das Format, wegen dem ich diese Seite gebaut habe.

**Was es ist:** Apples Fotoformat, das von iPhones seit 2017 verwendet wird. Dateien sind etwa halb so groß wie JPG bei gleicher (oder besserer) Qualität.

**Gut für:**
- Es ist... nicht wirklich deine Wahl. Dein iPhone nutzt es einfach.

**Das Problem:**
- Windows öffnet es nicht nativ
- Die Hälfte der Websites lehnt es für Uploads ab
- Deine Eltern können es definitiv nicht ansehen

**Was tun:** Behalte deine Fotos als HEIC (es ist tatsächlich besser) und [konvertiere zu JPG](/heic-to-jpg/), wenn du mit der Nicht-Apple-Welt teilen musst.

→ [HEIC zu JPG konvertieren](/heic-to-jpg/) | [HEIC zu PNG konvertieren](/heic-to-png/) | [Mehr erfahren: Was ist HEIC?](/blog/what-is-heic/)

## WebP

Googles Antwort auf "JPG ist alt, können wir es besser machen?"

**Was es ist:** Ein modernes Format, das sowohl verlustbehaftete (wie JPG) als auch verlustfreie (wie PNG) Komprimierung kann, mit kleineren Dateigrößen als beide. Unterstützt auch Transparenz und Animation.

**Gut für:**
- Websites (die meisten modernen Browser unterstützen es)
- JPG und PNG in vielen Situationen ersetzen

**Das Problem:** Du hast diese Seite wahrscheinlich gefunden, weil du ein Bild von einer Website heruntergeladen hast und es jetzt nicht öffnen kannst. WebP ist super fürs Web, aber ältere Software unterstützt es nicht.

→ [WebP zu JPG konvertieren](/webp-to-jpg/) | [WebP zu PNG konvertieren](/webp-to-png/) | [Mehr erfahren: Was ist WebP?](/blog/what-is-webp/)

## AVIF

Der Neuling. Noch neuer als WebP.

**Was es ist:** Basierend auf dem AV1-Videocodec bietet AVIF die besten derzeit verfügbaren Komprimierungsraten. Wir reden von 50% kleiner als JPG bei gleicher Qualität.

**Gut für:**
- Cutting-Edge Web-Entwicklung
- Situationen, wo jedes Kilobyte zählt

**Das Problem:** Es ist noch so neu (2019), dass die Unterstützung lückenhaft ist. Selbst einige moderne Apps können AVIF-Dateien nicht öffnen.

→ [AVIF zu JPG konvertieren](/avif-to-jpg/) | [AVIF zu PNG konvertieren](/avif-to-png/) | [Mehr erfahren: Was ist AVIF?](/blog/what-is-avif/)

## TIFF

Das Format, das professionelle Fotografen lieben und alle anderen fürchten zu empfangen.

**Was es ist:** Ein flexibles, hochwertiges Format, das häufig in Fotografie, Druck und Archivierung verwendet wird. Kann riesige Mengen an Bilddaten speichern.

**Gut für:**
- Professionelle Fotografie-Workflows
- Druckproduktion
- Archivierung

**Das Problem:** Dateien sind RIESIG. Wie "warum ist dieses Foto 50MB" riesig. Außerdem akzeptieren die meisten Web-Dienste sie nicht.

**Was tun:** Wenn dir jemand ein TIFF schickt, [konvertiere es zu JPG](/tiff-to-jpg/), bevor du irgendetwas damit machst. Du wirst dir selbst danken.

→ [TIFF zu JPG konvertieren](/tiff-to-jpg/) | [TIFF zu PNG konvertieren](/tiff-to-png/) | [Mehr erfahren: Was ist TIFF?](/blog/what-is-tiff/)

## GIF

Ja, wie die Animationen. Aber auch ein legitimes Bildformat von 1987, das sich weigert zu sterben.

**Was es ist:** Ein Format, das auf 256 Farben begrenzt ist und einfache Animation und grundlegende Transparenz unterstützt.

**Gut für:**
- Einfache Animationen (offensichtlich)
- Sehr einfache Grafiken mit wenigen Farben

**Nicht gut für:**
- Fotos (256 Farben reichen nicht)
- Alles mit Farbverläufen
- Moderne Anwendungsfälle (WebP macht alles, was GIF kann, aber besser)

**Der Haken:** Die Konvertierung zu JPG oder PNG verliert die Animation—du bekommst nur das erste Frame.

→ [GIF zu JPG konvertieren](/gif-to-jpg/) | [GIF zu PNG konvertieren](/gif-to-png/) | [Mehr erfahren](/blog/convert-gif-to-jpg/)

## BMP

Ein Relikt aus der Windows-3.1-Ära, das irgendwie immer noch auftaucht.

**Was es ist:** Windows' ursprüngliches Bildformat. Speichert rohe, unkomprimierte Pixeldaten.

**Gut für:**
- Ehrlich? Nicht mehr viel.

**Warum es noch existiert:** Legacy-Software, alte Scanner mit Standardeinstellungen, Zwischenablage-Operationen unter Windows. Du wirst gelegentlich BMP-Dateien finden und dich fragen, woher sie kommen.

**Die Lösung:** [Konvertiere zu JPG](/bmp-to-jpg/) und die Datei wird 10-50x kleiner ohne sichtbaren Qualitätsverlust.

→ [BMP zu JPG konvertieren](/bmp-to-jpg/) | [BMP zu PNG konvertieren](/bmp-to-png/) | [Mehr erfahren](/blog/bmp-to-jpg/)

## Wie du das richtige Format wählst

**Für Fotos, die du teilst:** JPG. Universelle Kompatibilität, gute Qualität für die meisten Zwecke.

**Für Screenshots oder Grafiken:** PNG. Text bleibt scharf, Transparenz funktioniert.

**Für Web-Entwicklung:** WebP, wenn die Browser deiner Zielgruppe es unterstützen, mit JPG/PNG als Fallback.

**Für Archivierung:** TIFF oder PNG für verlustfrei, oder das Originalformat, wenn es schon HEIC/AVIF ist.

**Für alles andere:** Konvertiere zu was auch immer das Ding, das du nutzen willst, tatsächlich akzeptiert.

## Das Datenschutz-Thema

Kurze Anmerkung, da du wahrscheinlich hier bist, um etwas zu konvertieren: Die meisten Online-Konverter laden deine Dateien auf ihre Server hoch. Das bedeutet, irgendein Unternehmen hat jetzt eine Kopie deines Fotos.

Ich habe CovertConvert speziell gebaut, um das zu vermeiden. Alles läuft in deinem Browser—deine Dateien verlassen nie dein Gerät. Du kannst das überprüfen, indem du den Netzwerk-Tab in den Entwicklertools deines Browsers beim Konvertieren prüfst.

[Probier es aus](/), wenn du Dateien zu konvertieren hast.

## Immer noch verwirrt?

Wenn du mit einem bestimmten Format zu tun hast und dieser Leitfaden deine Situation nicht abgedeckt hat, schau im Blog:

- [Ist Online-Bildkonvertierung sicher?](/blog/is-online-converter-safe/)
- [iPhone-Fotos zu JPG konvertieren](/blog/convert-iphone-photos-to-jpg/)
- [Warum öffnet sich mein iPhone-Foto nicht unter Windows?](/blog/iphone-photo-wont-open-windows/)
- [Fotos konvertieren ohne sie hochzuladen](/blog/convert-photos-without-uploading/)

Oder [nutze einfach den Konverter](/) und lass ihn herausfinden, was deine Datei ist.
