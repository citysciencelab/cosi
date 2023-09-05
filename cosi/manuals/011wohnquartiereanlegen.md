
## Wohnungsbauquartiere anlegen 

Durch das Erstellen eines Wohnbauquartiers können Sie Wohnungsbauszenarien durchspielen. Die erstellten Wohnungsbauquartiere stehen Ihnen für weitere Analysefunktionen zur Verfügung. Die Szenarien können exportiert und gespeichert werden.

Sobald Sie über "Simulation" "Wohnungsquartiere anlegen" auswählen, öffnet sich ein Fenster, in dessen oberem Bereich Sie den Szenario Manager finden (s. Abbidlung 009a "Szenario Manager").

![Abbildung a: Wohnungsbauquartiere anlegen](/cosi/manuals/011a_wohnquartiere.PNG)

*Abb. a: Wohnungsbauquartiere anlegen*

![Abbildung b: Wohnungsbauquartiere anlegen](/cosi/manuals/011b_wohnquartiere.PNG)  

*Abb. b: Wohnungsbauquartiere anlegen*

1. **Geometrie**
   > Mithilfe des Stiftes kann ein Polygon in der Karte gezeichnet werden. 
2. **Rückgängig**
   > Entfernt die zuvor gezeichnete Linie.
3. **Polygon in der Karte wählen**
   > Ist der Button orange markiert, kann auch ein Polygon aus der Karte angewählt und übernommen werden.
4. **Löschen**
   > Löscht das erstellte Polygon.
5. **Zurücksetzen**
   > Entleert die Eingabemaske, um weitere Wohnungsbauquartiere zu erstellen.
6. **Bearbeiten**
   > Ermöglicht die Anpassung der regionalstatistischen Datensätze.
7. **Anlegen**
   > Bestätigt die Angaben und erstellt das simulierte Wohnungsbauquartier.

#### **Die Parameter in den Feldern passen sich der gezeichneten Fläche an:**

- **Grundfläche**
   > Zeigt die Fläche des gezeichneten Polygons an. 
- **Bewohnerzahl insgesamt**
   > Zeigt die gesamte Einwohnerzahl entsprechend dem gewählten Polygon.
   > Wenn verändert, passen sich **Wohneinheiten**, **Bevölkerungsdichte**, **BGF** und **GFZ** an.
   > Berechnet sich dabei allgemein (je nach bewegtem Regler) als:
   > *Wohneinheiten x Durchschnittliche Haushaltsgröße*
- **Wohneinheiten**
   > Schieberegler lässt sich auf die gewünschte Anzahl an Wohneinheiten regeln. 
   > Wenn verändert, passen sich **Bewohner**, **Bevölkerungsdichte**, **BGF** und **GFZ** an.
   > Berechnet sich dabei allgemein (je nach bewegtem Regler) als:
   > *Bewohner / Durchschnittliche Haushaltsgröße*
- **Bruttogeschossfläche (BGF)**
   > Regelt die verfügbare Bruttogeschossfläche. 
   > Wenn verändert, passen sich **GFZ**, **Bewohner**, **Bevölkerungsdichte** und **Wohneinheiten** an.
   > Berechnet sich dabei allgemein (je nach bewegtem Regler) als:
   > *Grundfläche x GFZ*
- **Durchschnittliche Haushaltsgröße**
   > Regelt die geplante Anzahl der Personen pro Wohneinheit.
   > Wenn verändert, passen sich **BGF**, **Bevölkerungsdichte** und **Wohneinheiten** an.
   > Berechnet sich dabei allgemein (je nach bewegtem Regler) als:
   > *fester Wert*
- **Geschossflächenzahl (GFZ)**
   > Reguliert die Anzahl an Flächen auf der gezeichneten Grundfläche.
   > Wenn verändert, passen sich **BGF**, **Bewohner**, **Bevölkerungsdichte** und **Wohneinheiten** an.
   > Berechnet sich dabei allgemein (je nach bewegtem Regler) als:
   > *BGF / Grundfläche*
- **Bevölkerungsdichte**
   > Wird aus dem Referenzgebiet übernommen, kann jedoch durch Anpassung anderer Parameter variieren. 
   > Wenn verändert, passen sich **Bewohner**, **Wohneinheiten**, **BGF** und **GFZ** an. 
   > Berechnet sich dabei allgemein (je nach bewegtem Regler) als:
   > *Bewohner / Fläche*
- **Wohnfläche pro Person**
   > Reguliert die bereitgestellte Wohnfläche pro Kopf.
   > Wenn verändert, passen sich **BGF**, **Bewohner**, **Bevölkerungsdichte** und **Wohneinheiten** an. 
   > Berechnet sich dabei allgemein (je nach bewegtem Regler) als:
   > *fester Wert*
- **Verhältnis Wohnfläche/BGF**
   > Gibt an von wieviel Prozent Wohnfläche anteilig an der Gesamtfläche ausgegangen wird. *Standardeinstellung: 0.8 bzw. 80%*

#### Schrittweises Vorgehen
Zur besseren Verständlichkeit des Werkzeugs wird im Folgenden einmal Schritt für Schritt erläutert, wie man erfolgreich selbst ein neues Wohnungsquartier anlegt.

1. **Schritt 1:** Geben Sie einen Namen für das erstellte Wohnbauquartier ein 
2. **Schritt 2:** Zeichnen Sie mit dem Zeichenstiftwerkzeug den Wohnblock an der gewünschten Fläche ein oder wählen Sie ein Polygon auf dem Kartenlayer aus. 
3. **Schritt 3:** Parameter für das erstellte Quartier können per Schieberegler angepasst werden.
4. **Schritt 4:** Wählen Sie ein Referenzgebiet für die Simulation der Zusammensetzung des Gebiets aus. 
5. **Schritt 5:** Klicken Sie auf "Anlegen". Das Neue Wohnbauquartier erscheint nun als hervorgehobenes Polygon mit Angaben zur Fläche und Einwohnerzahl auf der Karte.  
