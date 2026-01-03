---
title: "Ist es sicher, Fotos online zu konvertieren? Worauf du achten solltest"
description: "Die meisten Online-Konverter laden deine Dateien auf ihre Server hoch. Hier erfährst du, wie du erkennst, welche sicher sind und warum clientseitige Tools besser für die Privatsphäre sind."
date: "2025-12-13"
slug: "is-online-converter-safe"
tags: ["privatsphäre", "sicherheit", "online-tools"]
---

Ich bin ehrlich—das ist die Frage, die mich dazu gebracht hat, CovertConvert überhaupt zu bauen.

Ich musste ein paar Fotos konvertieren. Schnelle Suche gemacht, erstes Ergebnis angeklickt, angefangen meine Dateien hochzuladen und dann innegehalten. Warte. Wohin gehen die? Auf irgendeinen Server, von dem ich noch nie gehört habe? Wer betreibt das? Was passiert danach mit meinen Fotos?

Je mehr ich darüber nachdachte, desto unwohler fühlte ich mich.

## Wie die meisten Konverter wirklich funktionieren

Wenn du einen typischen Online-Konverter benutzt, passiert Folgendes:

1. Du wählst deine Datei aus
2. Sie wird auf ihren Server hochgeladen (irgendwo)
3. Ihr Server macht die Konvertierung
4. Du lädst das Ergebnis herunter
5. Deine Datei sitzt auf ihrem Server... auf unbestimmte Zeit?

Dieser letzte Teil ist das Problem. Die meisten Seiten machen nicht klar, was danach mit deinen Dateien passiert. Manche sagen, sie löschen sie "innerhalb von 24 Stunden". Manche sagen gar nichts. Und selbst die, die behaupten, sofort zu löschen—glaubst du ihnen einfach?

## Warum das wichtig ist

Für zufällige Bilder vielleicht nicht. Aber denk darüber nach, was auf deinem Handy ist:

- Familienfotos
- Screenshots mit persönlichen Infos
- Dokumente, die du fotografiert hast
- Quittungen, Ausweise, wer weiß was noch

Diese Dateien reisen durchs Internet zu einem Server, den du nicht kontrollierst, werden auf Hardware gespeichert, die du nicht überprüfen kannst, zugänglich für Leute, die du nie getroffen hast. Selbst mit guten Absichten—Server werden gehackt. Datenbanken leaken. Unternehmen werden übernommen und plötzlich sind deine "gelöschten" Dateien jemand anderes Asset.

Ich versuche hier nicht, paranoid zu sein. Aber wenn es eine Alternative gibt, die keines dieser Risiken erfordert, warum es riskieren?

## Worauf du achten solltest

Wenn du einen Online-Konverter benutzen willst, würde ich Folgendes prüfen:

**Haben sie eine Datenschutzrichtlinie?** Lies sie. Schau, was sie über Datenspeicherung und Dritte sagen. Wenn es überhaupt keine Datenschutzrichtlinie gibt, schließ den Tab.

**Funktioniert es ohne Upload?** Manche Konverter verarbeiten Dateien lokal in deinem Browser mit JavaScript. Deine Datei geht nirgendwohin. Das ist der Goldstandard für Privatsphäre.

**Wie du es überprüfst:** Öffne die Entwicklertools deines Browsers (F12 oder Rechtsklick → Untersuchen), geh zum Netzwerk-Tab und beobachte, was passiert, wenn du eine Datei konvertierst. Wenn du siehst, dass deine Datei auf einen entfernten Server hochgeladen wird, weißt du Bescheid. Wenn die Netzwerkaktivität im Wesentlichen null ist, passiert die Konvertierung lokal.

**Verlangen sie ein Konto?** Wenn ein Konverter deine E-Mail braucht, nur um ein Bild zu konvertieren, frag dich warum. Sie bauen ein Profil über dich auf. Ein Tool, das deine Privatsphäre respektiert, muss nicht wissen, wer du bist.

## Der clientseitige Unterschied

Wenn ein Konverter "clientseitig" läuft, bedeutet das, dass alles in deinem Browser passiert. Die Website schickt dir den Konvertierungscode (JavaScript, WebAssembly), und dieser Code verarbeitet deine Datei direkt auf deinem eigenen Computer.

Der Server sieht deine Datei nie. Kann deine Datei nicht sehen. Es ist technisch unmöglich, weil die Datei dein Gerät nie verlässt.

Das ist keine theoretische Unterscheidung. Es ist der Unterschied zwischen "vertrau uns, wir löschen deine Dateien" und "wir können buchstäblich nicht auf deine Dateien zugreifen".

## Warum ich diese Seite gebaut habe

Ich war frustriert von den existierenden Optionen. Entweder haben sie Dateien auf Server hochgeladen (verdächtig), oder sie hatten so viele Werbungen, dass sie sich wie eine Falle anfühlten, oder sie wollten, dass ich irgendeine App herunterlade, der ich nicht vertraute.

Also habe ich einen Konverter gebaut, der komplett im Browser läuft. Keine Uploads. Keine Konten. Kein Tracking, was du konvertierst. Ich kann deine Dateien nicht sehen, weil mein Server sie nie empfängt. Glaub mir nicht einfach—öffne den Netzwerk-Tab und überprüfe es selbst.

Das ist der Standard, den diese Tools meiner Meinung nach erfüllen sollten. Wenn ein Konverter dich bittet, Dateien hochzuladen, obwohl er es technisch nicht muss, ist das ein Warnsignal.

## Schnelle Checkliste

Bevor du irgendeinen Konverter benutzt:

- Prüfe, ob es eine Datenschutzrichtlinie gibt
- Achte auf Aussagen über lokale/clientseitige Verarbeitung
- Überprüfe mit dem Netzwerk-Tab des Browsers
- Vermeide alles, was ein Konto für grundlegende Funktionen verlangt
- Vertrau deinem Bauchgefühl—wenn es sich verdächtig anfühlt, ist es das wahrscheinlich

Deine Fotos sind privat. Du solltest sie nicht auf den Server eines Fremden hochladen müssen, nur um das Dateiformat zu ändern.
