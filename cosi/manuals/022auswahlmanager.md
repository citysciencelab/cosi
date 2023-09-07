## Auswahlverwaltung

### Verwalten und Bearbeiten von ausgewählten Flächen
Mit der Auswahlverwaltung können bereits ausgewählte oder angelegte Flächen (beispielsweise mit der [Gebietsauswahl](./gebietsauswahl.md) oder der [Manuellen Flächenauswahl](./areaselector.md)) wieder per Klick auf der Karte angezeigt werden. Des Weiteren stehen mehrere Funktionen zur Bearbeitung und Veränderung der Flächen zur Verfügung. 
> Um die Auswahlverwaltung nutzen zu können, muss zunächst mindestens eine entsprechende Fläche verfügbar sein. Dann erscheint das Icon für die Auswahlverwaltung links unten im Bildschirm, direkt über der [Kartenvisualisierung](./kartenvisualisierung.md).

![Abbildung 2: Auswahlverwaltung](https://github.com/citysciencelab/cosi/assets/43250699/278717a4-b3b2-4c5b-a340-2e2a8576d727)

*Abbildung 2: Auswahlverwaltung mit mehreren Auswahlen*

1. **Alle Flächen auswählen**
   > Der Bereich "*Alle Auswahlen*" ist verfügbar, sobald Sie mehr als eine Fläche in der Auswahlverwaltung zur Verfügung haben. Mit einem Klick auf den ersten Button erstellen Sie eine neue Auswahl, die *alle* Flächen innerhalb der Auswahlverwaltung beinhaltet.
2. **Alle Flächen verbinden**
   > Mit einem Klick auf diesen Button erstellen Sie eine neue Auswahl, die alle Flächen innerhalb der Auswahlverwaltung beinhaltet und diese zusätzlich mit einem weiteren Polygon verbindet, das jeden Mittelpunkt der verfügbaren Flächen berührt. Diese Funktion ist nicht verfügbar, sobald sich aus den vorhandenen Flächen kein sinnvolles Polygon mehr zeichnen lässt (z.B. durch entsprechende Überschneidungen innerhalb der Flächen).
3. **Alle Flächen löschen**
   > Ein Klick auf diesen Button löscht alle verfügbaren Flächen und setzt die Auswahlverwaltung zurück.  
4. **Zwischenspeicher**
   > Über den Button unter 5.2 fügen Sie eine Fläche dem "*Zwischenspeicher*" hinzu. Sie sehen diesen Abschnitt nur, wenn Flächen im Zwischenspeicher vorhanden sind. Die drei Buttons erfüllen diesselben Funktionen wie die Buttons unter 1., 2. und 3., mit dem Unterschied, dass die Funktionen nur auf die Flächen im Zwischenspeicher angewendet werden, anstatt auf *alle* Flächen.
   
   - 4.1 **Flächen im Zwischenspeicher**
      > Hier sehen Sie die IDs der Flächen, welche aktuell im Zwischenspeicher sind. Mit einem Klick auf eins der Felder, wählen Sie diese Fläche aus und aktivieren Sie auch auf der Karte. Mit einem Klick auf das "*X*" am Ende des Feldes entfernen sie die Fläche aus dem Zwischenspeicher.
5. **Flächen in der Auswahlverwaltung**
   > Hier sind alle Flächen aufgelistet, die in der Auswahlverwaltung enthalten sind. Die Flächen sind gruppiert, abhängig davon, von welchem Werkzeug sie erzeugt wurden. Vorne im Kästchen ist die automatisch generierte, einzigartige ID zu sehen, die das Programm der Fläche gegeben hat. Direkt daneben ist der Name der Fläche zu sehen. In diesem Beispiel zeigt uns der Name der Fläche, dass Sie aus dem [Gebietsauswahlwerkezug](./gebietsauswahl.md) stammt, aus der Stadtteilebene und nur Marienthal und keine weiteren Stadtteile beinhaltet. Die Fläche darunter beinhaltet beispielsweise den Stadtteil Barmbek-Süd sowie acht weitere Stadtteile.
   - 5.1 **Fläche auswählen**
   > Mit diesem Button schalten Sie eine Fläche auf der Karte sichtbar beziehungsweise unsichtbar. Es kann nur eine Fläche zugleich auf der Karte visualisiert sein.
   - 5.2 **Fläche zum Zwischenspeicher hinzufügen**
   > Dieser Button ist nur zu sehen, wenn mindestens zwei Flächen in der Auswahlverwaltung verfügbar sind. Mit einem Klick auf diesen Button fügen Sie diese Fläche zum Zwischenspeicher hinzu, wie unter 4. weiter beschrieben ist.
   - 5.3 **Aktuelle Fachdaten speichern**
   > Wenn Sie Fachdatenlayer aus dem Themenbaum aktiv haben, können Sie mit einem Klick auf diesen Button die jeweiligen Fachdatenlayer (beispielsweise Schulen, Kindergärten und Spielplätze) an der Fläche anheften. Wenn Sie weiter arbeiten und in diesem Zeitraum andere Fachdaten anwählen, dann aber später die Fläche erneut auswählen, werden die angehefteten Fachdatenlayer automatisch wieder aktiv geschaltet.
   - 5.4 **Erweitere Optionen anzeigen**
   > Dieser Button öffnet die erweiterten Optionen für die Fläche. Zum aktuellen Zeitpunkt (Q3:2023) enthalten diese aber nur den "*Puffer*", der weiter unten beschrieben wird.
   - 5.5 **Fläche löschen**
   > Mit einem Klick auf diesen Button löschen Sie die Fläche aus der Auswahlverwaltung.

![Abbildung 3: Erweiterte Optionen der Auswahlverwaltung](https://github.com/citysciencelab/cosi/assets/43250699/bd4e610b-fd4b-44d4-8183-3b729373ac1f)

*Abbildung 3: Erweiterte Optionen der Auswahlverwaltung*
1. **Erweiterte Optionen schließen**
   > Der invertiere Farbcode des Buttons signalisiert, dass die erweiterten Optionen für diese Fläche geöffnet sind. Ein erneuter Klick auf diesen Button schließt die erweiterten Optionen wieder.
2. **Puffereingabe**
   > Geben Sie hier entweder über das Textfeld oder aber über den Slider den gewünschten Pufferwert in Metern ein. Eine Reichweite von -1000 bis 1000m wird akzeptiert.
3. **Puffer ein-/ausschalten**
   > Mit einem Klick auf diesen Button schalten Sie den Puffer ein oder aus. Ist der Puffer ausgeschaltet, wird stattdessen die originale Fläche auf der Karte angezeigt. Beachten Sie, dass eine gepufferte Fläche auf der Karte als gelb angezeigt wird und nicht als rot. Dasselbe gilt für den Ein/-ausblenden Button der Fläche.
4. **Fläche aus Puffer erzeugen**
   > Mit einem Klick auf diesen Button erzeugen Sie eine neue Fläche, die der gepufferten Fläche entspricht. So haben Sie die Möglichkeit alle Funktionen der Auswahlverwaltung auch auf die gepufferte Fläche anzuwenden.
5. **Die gepufferte Fläche auf der Karte**
   > Die gepufferte Fläche wird auf der Karte gelb angezeigt.
