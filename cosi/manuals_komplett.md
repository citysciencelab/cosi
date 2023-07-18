# CoSI - Funktionshandbuch
----

Hier finden sie Beschreibungen zu allen CoSI nach Funktionen (alphabetisch).


### Manuelle Flächenauswahl für Fachdaten
Mit Hilfe dieses Werkzeuges können Sie ein Polygon auf der Karte zeichnen, innerhalb dessen Fachdaten angezeigt werden. Einrichtungen oder andere Fachdatenmarker, die außerhalb dieses Polygons liegen, werden ausgeblendet. 
> Um die Manuelle Flächenauswahl nutzen zu können, wählen Sie hier zunächst *Analyse* und infolge dessen *Manuelle Flächenauswahl*.

![Abbildung 4: Manuelle Flächenauswahl](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/manuelle%20flaechenauswahl.png?raw=true)

*Abbildung 4: Manuelle Flächenauswahl*

1. **Polygon zeichnen**
   > Klicken Sie auf diesesn Button, um ein neues Polygon auf der Karte zu zeichnen.
2. **Eingabe löschen**
   > Löschte die bestehende Flächenauswahl und zeigt alle Fachdaten wieder an.
3. **Einwohnerabfrage**
   > Für die aktuelle Flächenauswahl eine [Einwohnerabfrage](./einwohnerabfrage.md) durchführen.  
4. **Ergebnisdarstellung auf der Karte**
## Auswahlmanager

...### DIPAS
Mit dem DIPAS Werkzeug können alle Beiträge aus laufenden DIPAS Verfahren in der Karte visualisiert, nach verschiedenen Kriterien dargestellt und für alle CoSI-Werkzeuge verfügbar gemacht werden. D.h. alle Beiträge können in der [Einrichtungsübersicht](./einrichtungsuebersicht.md) angezeigt, für [Versorgungsanalyse](./versorgungsanalyse.md), [Erreichbarkeitsanalyse](./erreichbarkeitsanalyse.md) und [Vergleichbare Gebiete Ermitteln](./vergleichbaregebieteermitteln.md) verwendet und mit dem [Filter](./filter.md) gefiltert werden. Über "Analyse" erreichen Sie "Dipas".


![Abbildung 1: DIPAS](https://user-images.githubusercontent.com/43250699/159553679-c957f150-298f-476a-83ea-73ee854f5f61.png)

*Abbildung 1: DIPAS*

1. **Beteiligungsverfahren auswählen**
   > Für jedes Verfahren aus der DIPAS-Datenbank wird automatisch eine Registerkarte angelegt, welche durchs Anklicken aufgeklappt werden kann. Ein aufgeklapptes Verfahren zeigt dessen Beschreibungstext und die Kontrollfelder für die Visualisierung. Jedem Verfahren wid dabei eine zufällige Farbe zugewiesen.
2. **Indikator**
   > Das Icon in dem Indikator zeigt zum einen die Farbe an, in dem der jeweilige Datensatz visualisiert wird. Zum Anderen zeigt es, ob der Datensatz gerade auf der Karte angezeigt wird.
3. **Legende**
   > Die Legende zeigt an, welche Farbe den Eintragstypen in der Visualisierung zugeordnet wird.
4. **Verfahren in der Karte anzeigen**
   > Zeigt das Verfahrensgebiet als Polygon in der Karte in der jeweiligen Farbe des Verfahrens.
   - **4.1 Auf der Karte anzeigen**
      > Die Kartenansicht fokussiert auf das jeweilige Verfahrensgebiet.
5. **Einzelne Beiträge in der Karte anzeigen**
   > Zeigt alle Einzelbeiträge des Verfahrens in der Karte. Das Styling der Beiträge kann unter (s. 5) festgelegt werden.
6. **Heatmap in der Karte anzeigen** 
   > Zeigt eine Heatmap der Beiträge in der Karte. Das Gewicht eines Punktes richtet sich dabei nach der Gesamtzahl der Bewertungen des Beitrags, also der Stärke der Resonanz auf ihn.
7. **Styling der Beiträge wählen**
   * *Die Inhalte können nach verschiedenen Schwerpunkten dargestellt werden:*
   > - nach Projekt: Alle Beiträge werden gleichmäßig in der Projektfarbe dargestellt.
   > - nach Kategorien im Projektfarbraum: Jede Kategorie wird in einer Schattierung der Projektfarbe dargestellt.
   > - nach Kategorien im Regenbogenspektrum: Jeder Kategorie wird eine zufällig Farbe zugewiesen.
   > - nach Bewertung: Die Beiträge werden abhängig von den positiven- und negativen-Bewertungen dargestellt. Die Größe des Punktes richtet sich dabei nach der Gesamtzahl der Reaktionen, die Farbe nach dem Verhältnis von positiven (grün) und negativen (rot) Bewertungen.
8. **Download als GeoJson**
   > Die aktuell aktiven DIPAS Datensätze werden als GeoJson heruntergeladen.
9. **Automatisches Update**
   > Wenn diese Checkbox aktiviert ist, werden die DIPAS Daten ggf. live aktualisiert.
10. **Beiträge in der Karte**
      > Alle Beiträge werden mit Ihrer ID (einer fortlaufenden Nummer) in der Karte dargestellt.
## Einrichtungen anlegen
___
Sobald sie unter "Simulation" "Einrichtungen anlegen" auswählen, öffnet sich ein Fenster, in dessen oberem Bereich Sie den Szenario Manager finden. Bei der Funktion "Wohnungsbauquartiere anlegen" befindet sich der Szenario Manager an derselben Stelle.

#### Szenario Manager
![Abbildung 1: Szenario Manager](https://user-images.githubusercontent.com/43250699/143022435-622e8032-e0da-4b5e-bd0c-9e33aa07de2c.png) 
*Abbildung 1: Szenario Manager*  

1. **Scenario Dropdown**
   > Zeigt bisher erstellte Szenarien an.
2. **Neues Szenario anlegen**
   > Öffnet die Maske zur Erstellung eines weiteren
Szenarios.
3. **Szenario exportieren**
   > Stellt einen Download des Szenarios zur Verfügung
4. **Szenario Löschen**
   > Löscht das ausgewählte Szenario. 
5. **Szenario leeren**
   > Löscht alle Veränderungen im Szenario. 
6. **Thema auswählen**
   > Dropdownmenü erlaubt die Auswahl aus den aktivierten Fachthemen.  
  
 *Sie **müssen** ein Thema aus den geladenen Fachdaten wählen. Sind keine Fachdaten ausgewählt, ist kein Szenario möglich. Wählen Sie mindestens ein Analysethema aus dem Themenbaum.*  

![Abbildung 2: Einrichtungen anlegen](https://user-images.githubusercontent.com/43250699/143023574-324b2275-eea7-4926-bf3d-07c2f21124e1.png)  
*Abbildung 2: Einrichtungen anlegen*  

1. **Einrichtung kopieren**
   > Erlaubt den Upload eines gespeicherten Szenarios. 
2. **Verschieben der Einrichtung**
   > Erlaubt das Bewegen von Einrichtungen durch verschieben auf der Karte
3. **Sichern/ Öffnen** 
   > Ermöglicht geöffnet das Verschieben vorhandener Einrichtungen.
4. **Rückgängig** 
   > Stellt den vorherigen Zustand wieder her.
5. **Geometrie** 
   > Überträgt die Geometrie eines Punktes durch Klick auf der Karte.
6. **Löschen**
   > Entfernt vorhandene Geometrie.
7. **Erforderliche Spalten**
   > Notwendige Bedingung zur Erstellung einer simulierten Einrichtung.
8. **Kapitelbezeichnung**
9. **Name**
10. **Optionale Spalten**
   > Können bei Bedarf ergänzt werden.
11. **Anlegen**
   > Erstellt die simulierte Einrichtung
12. **Zurücksetzen**
   > Setzt das Szenario zurück.

#### Schrittweises Vorgehen
Zur besseren Verständlichkeit des Werkzeugs wird im Folgenden einmal Schritt für Schritt erläutert, wie man erfolgreich selbst eine neue Einrichtung anlegt.

1. #### **Schritt 1:** Neues Szenario erstellen
2. #### **Schritt 2:** Name für Szenario festlegen
3. #### **Schritt 3:** Einrichtung definieren
   1. Kopieren sie eine Einrichtung mit dem Pipetten-Symbol, indem sie zuerst die Pipette anklicken und dann die zu kopierende Einrichtung in der Karte anwählen. Sie können Einrichtungen auch vollständig manuell anlegen, indem Sie die dazu erforderlichen Spalten selbst ausfüllen. 
   2. Positionieren sie die Einrichtung auf der Karte, indem sie zunächst den "Ort wählen" Stift im Feld *Geometrie/ Ort* anklicken und dann einen Punkt auf der Karte anwählen. Alternativ können Sie die geometrischen Werte in das Feld Geometrie/Ort eintragen. 
   3. *Erforderliche Spalten* werden durch das Kopieren einer Einrichtung per Pipette übernommen. Diese Spalten können jedoch manuell ergänzt oder verändert werden. 
   4. *Optionale Spalten* werden automatisch durch das Kopieren einer Einrichtung übertragen können aber auch manuell ergänzt oder ausgefüllt werden .
4. #### **Schritt 4:** Einrichtung anlegen
   > Schließen sie die Erstellung ab, indem Sie den blauen Button "Neue Einrichtung Erstellen" klicken. Die neue Einrichtung erscheint als Icon in der Karte. Neue Einrichtungen werden durch ein farbiges Sternchen gekennzeichnet. 
5. #### **Schritt 5:** Einrichtung bewegen
   1. Zum Verschieben von Einrichtungen klicken sie das Bewegen-Symbol. Nun klicken sie die Einrichtung, die Sie bewegen möchten. Ist diese angeklickt, vergrößert sich das Symbol und zeigt damit an, dass die Einrichtung nun beweglich ist. Ziehen sie die Einrichtung mit gedrückter linker Maustaste an den gewünschten Platz. 
   2. Möchten sie bestehende Einrichtungen aus dem Datensatz auf der Karte verschieben, dann lösen Sie durch einen Klick auf das Schloss die Sperre. Es erscheint eine Warnung:   
   *"Achtung: Sie können jetzt auch echte Einrichtungen verschieben. Ihre Änderungen sind nur temporär und werden nach der Sitzung nicht gespeichert."*  

Alle Analysen, die innerhalb eines Szenarios durchgeführt werden, berücksichtigen die Parameter der simulierten Einrichtungen.
### Einrichtungen bearbeiten

Sie können sowohl selbst angelegte als auch bereits in den Daten vorhandene Einrichtungen bearbeiten, sobald Sie ein aktives Szenario haben. Sollten Sie kein Szenario angelegt haben und Sie klicken eine Einrichtung an, wird folgendes Popup angezeigt:

![Abbildung 1: Bitte erstellen Sie ein Szenario](https://user-images.githubusercontent.com/43250699/159273029-a17ce734-e7ed-4374-9cf4-433d44f26508.JPG)

*Abbildung 1: Bitte erstellen Sie ein Szenario*

Ein Szenario können Sie wie im [Szenario Manager](./einrichtungenanlegen.md) beschrieben anlegen. Sobald Sie ein Szenario erfolgreich erstellt haben, wenn Sie eine Einrichtung anklicken, folgender Popup am unteren Bildschirmrand: 

![Abbildung 2: Einrichtung bearbeiten](https://user-images.githubusercontent.com/43250699/159273504-35b08fa1-2206-4ef4-a850-670f0e03a381.JPG)

*Abbildung 2: Einrichtung bearbeiten*

Wählen Sie hier den Button **BEARBEITEN** an, daraufhin wird sich das folgende Fenster öffnen:

![Abbildung 3: Einrichtung-Bearbeiten-Fenster](https://user-images.githubusercontent.com/43250699/159273975-1e1f2960-1af4-4e49-a03a-5657060b322f.png)

*Abbildung 3: Einrichtung bearbeiten*

1. **Eingaben sperren**
   > Mit Hilfe dieses Buttons sperren Sie die Input-Felder des Fensters, so dass Sie nicht mehr bearbeitet werden können. Die Input-Felder sind standardmäßig gesperrt, so dass Sie diesen Button aktivieren müssen, ehe Sie eine vorhandene Einrichtung bearbeiten können. 
2. **Inputfelder**
   > Die verfügbaren Inputfelder für den Datensatz der ausgewählten Einrichtung. Die Inputfelder weichen je nach Einrichtung ab (Krankenhaus, Sportstätte, Schule etc.).
3. **Änderungen speichern**
   > Speichern Sie die Änderungen, die Sie an der Einrichtung vorgenommen haben.
4. **Zurücksetzen**
   > Setzen Sie alle Felder der Einrichtung auf Ihre ursprünglichen Werte zurück.
5. **Abbrechen**
   > Verwerfen Sie Ihre ungespeicherten Änderungen und schließen dieses Fenster.

**Hinweis:** Wenn auf der Karte Cluster von Einrichtungen angezeigt werden, weil in der aktuellen Zoomstufe nicht alle Einrichtungen dargestellt werden können, öffnet sich bei einem Klick auf das Clustersymbol folgendes Fenster:

![Abbildung 4: Clusterauswahl](https://user-images.githubusercontent.com/43250699/159275102-91f27ff1-4214-4a2e-8bb6-19105e1859b9.png)

*Abbildung 4: Clusterauswahl*

1. **Das angewählte Cluster (3)**
   > Die Darstellung von Einrichtungen wird auf der Karte gebündelt, wenn zu viele Einrichtungen an einem Ort sind, so dass sie in der aktuellen Zoomstufe nicht dargestellt werden können. 
2. **Auswahl**
   > Alle im Cluster gebundenen Einrichtungen werden angezeigt, sobald Sie auf das Cluster klicken. Sie können dann in diesem Fenster eine Einrichtung auswählen, woraufhin sich das Fenster aus *Abbildung 3* öffnet.

### Einrichtungsübersicht
   > Um zur Einrichtungsübersicht zu gelangen, muss zunächst ein beliebiger Stadtteil oder Bezirk ausgewählt werden. Als nächtes unter dem Bereich Themen die gewünschten Themen oder Fachdaten auswählen (z.B. Bildung und Wissenschaft). Im Dashboard unter Einrichtungsübersicht können Sie dann mit der Analyse ihrer Einrichtung beginnen.
   
![Abbildung 1: Einrichtungsübersicht](https://user-images.githubusercontent.com/43250699/159693060-ce1ffbeb-e9f6-4525-8896-13f341138246.png)
*Abbildung 1: Einrichtungsübersicht*

1. **Detailansicht ein-/ausklappen**
   > Über den Pfeil können *alle* Attribute einer Einrichtung aufgeklappt werden. Die einzelnen Zeilen der Detailansicht können für den weiteren Export ausgewählt werden.
2. **Einrichtung auswählen**
   > Einrichtungen für den Export auswählen. Ausgewählte Einrichtungen werden in der Karte visuell hervorgehoben.
   *Wenn Sie die Einrichtung ausgewählt haben und unter **12** einen Fachdatensatz zur Auswertung ausgewählt haben, werden diese ebenfalls auf der Karte angezeigt. (s. Abbildung 2)*
   ![Abbildung 2: Fachdaten zur Auswertung auf der Karte](https://user-images.githubusercontent.com/43250699/159693761-ebea6f7d-49a4-4cca-9f2a-3f6ef71503c8.JPG)
*Abbildung 2: Weitere Fachdaten auf der Karte*
3. **Einrichtung fokussieren**
   > Durch einen Klick auf das Symbol der Einrichtung zoomt die Karte zu der betreffenden Einrichtungen. Die Einrichtung wird in der Karte visuell hervorgehoben.
4. **Einrichtung ein-/ausblenden**
   > Einrichtungen können in der Karte ein- und ausgeschaltet werden. Indem auf das "Augen"-Symbol neben dem Richtungssymbol geklickt wird. Ausgeschaltete Einrichtungen werden bei allen anderen CoSI-Funktionen nicht berücksichtigt.
5. **Einrichtungsattribute**
   > - Einrichtungsname, Adresse, Layer, Typ und Thema werden dem Datensatz direkt entnommen
   > - Die Gebietszuweisung wird dynamisch für die aktuelle Verwaltungsebene generiert
   > - Symbole zeigen an, wenn eine Einrichtung simuliert oder modifiziert wurde.
6. **Einträge sortieren**
   > Alle Spalten können, durch mehrmaliges Klicken auf die Kopfzeile, neben dem Namen (z.B. Einrichtung) auf- und absteigend sortiert werden (alphabetisch oder nach Wert). Dabei kann für max. 2 Spalten erfolgen (z.B. 1. nach Typ und 2. nach numerischem Wert).
7. **Numerische Attribute**
   > Alle Attribute einer Einrichtung, die Zahlwerte abbilden (welche auch für die [Versorgungsanalyse](./versorgungsanalyse.md) verwendet werden können) werden in einer eigenen Spalte dargestellt. Die Farbe des Balkens richtet sich dabei nach dem Dezil des Wertes in der Liste aller Einrichtungen. Die Länge des Balkens ist proportional zum Höchstwert.
8. **Durchschnittliche Anbindung (in m)**
   > Die Anbindungsspalte zeigt die durchschnittliche Laufdistanz (in m) zu den jeweils nächstgelegenen Einrichtungen der ausgewählten Typen. Durch einen Klick auf den Wert kann die entsprechende Aufschlüsselung geöffnet werden (s. 12.).
9.  **Such- und Filterfunktionen**
      > Hier können Sie die Liste nach Themen filtern oder im Freitext die Einrichtungen durchsuchen.
10. **Einrichtungsdiagramme erstellen**
      > Erzeugt für alle verfügbaren Datenspalten ein Balkendiagramm, in dem die Werte der jeweiligen Einrichtungen und ihre Verteilung über die ausgewählten Gebiete.
      - **10.1 Layer zusammenziehen**
         > Wenn Sie diese Checkbox aktivieren, werden bei "Einrichtungsdiagramme erstellen"  Einrichtungen unterschiedlichen Typs zusammengezogen, wenn sie identische Attribute haben. *Beispiel: Wenn Sie Supermärkte und Drogerien ausgewählt haben, teilen sich beide das Attribut "Verkaufsfläche in m² und werden dementsprechend im Graphen zusammen dargestellt".*
      - **10.2 Graphenvisualisierung als PNG oder Zip**
         > Die Graphenvisualisierung kann als PNG oder Zip heruntergeladen werden. Die entsprechenden Button befinden sich unterhalb der Graphenvisualisierung.
11. **Tabelle exportieren**
      > Die ausgewählten Einträge als XLSX für Excel exportieren. Über aus Auswahlfeld *Detailansicht exportieren* können alle bzw. in der Detailansicht ausgewählte Attribute eines Einrichtungstyps exportiert werden. Ist keine Auswahl getroffen, werden alle Einrichtungen exportiert.
12. **Standortbewertung: Themenauswahl**
      > Erlaubt die Auswahl beliebiger weiterer Fachdatenthemen für eine Standortbewertung. Bei Fachdaten, welche Punkte oder Flächen in der Karte repräsentieren (i.d.R. Einrichtungen) wird der Ort des Typs gefunden, welcher jeder Einrichtung in der Tabelle am nächsten ist und die Laufdistanz in Metern angegeben. Bei der Auswahl mehrerer Themen wird ein gewichteter Mittelwert gebildet (s. 8./13.). Andere Themen, z.B. Lärmkarte, Luftqualität, etc.) für die Bewertung befinden sich im Aufbau.
13. **Standortbewertung: Gewichtung**
      > Erlaubt die Gewichtung der Themen für die Standortbewertung. Ein Thema mit Wert 0,5 wird somit nur halb so stark in den Mittelwert einbezogen, wie eines mit dem Wert 1.
14. **Standortvisualisierung für alle ausgewählten**
      > Erstellt ein Balkendiagramm mit der Aufschlüsselung für alle ausgewählten Einrichtungen. Wenn Sie mehr als zwei Fachdatensätze für die Auswertung (s. 12) ausgewählt haben, dann wird ein Radardiagramm generiert. Wenn Sie keine Einrichtungen ausgewählt haben, werden *alle* verfügbaren Einrichtungen in das Diagramm mit einbezogen.
15. **Histogramm**
      > Erzeugt ein Histogramm, dass die Verteilung der ausgewählten Einrichtungen abbildet.
## Einwohnerabfrage
___
Über "Analyse" gelangen Sie zu "Einwohneranzahl abfragen".

Grundsätzlich bietet diese Funktion die Möglichkeit an, durch Aufziehen eines Rechtecks oder Kreises bzw. durch Einzeichnen einer Fläche die adressgenaue Einwohneranzahl zu bestimmen. Dieses Werkzeug stammt ursprünglich aus dem Masterportal und wurde u.a. in dem Modul "Erreichbarkeitsanalyse" integriert.

- Beim direkten Aufruf unter dem Reiter "Analyse" muss das Gebiet, über das man die Abfrage durchführen möchte, händisch festgelegt werden (via Rechteck oder Kreis ziehen bzw. via Zeichnen einer Fläche). 
- Bei der Nutzung innerhalb des Kontexts der Erreichbarkeitsanalyse muss das Gebiet nicht händisch festgelegt werden, sondern es wird als Gebiet das errechnete Einzugsgebiet übernommen.
### Ergebnisverzeichnis
Das Ergebnisverzeichnis unterstützt in einigen Werkzeugen die Verwaltung mehrerer Datensätze, die ihr zugrunde liegenden Funktionen sind aber standardisiert und werden im Folgenden näher erläutert. 
  


![Ergebnisverzeichnis des Werkzeugs "Vergleichbare Gebiete ermitteln"](https://user-images.githubusercontent.com/43250699/157007454-80d78c08-e141-4384-85ea-435a93ca3356.png)

*Abbildung 1: Ergebnisverzeichnis des Werkzeugs "Vergleichbare Gebiete ermitteln"*
  
1. **Direktanwahl eines Datensatzes**
   > Wählen Sie direkt den Datensatz mit dem jeweiligen Index an. Sie können hier auch ablesen, wieviele Datensätze sie aktuell in dem jeweiligen Werkzeug haben.
2. **Vor/ Zurück**
   > Durch Klicken auf einen der Pfeile wird der nächste/ vorherige Datensatz ausgewählt.
3. **Neuen Datensatz hinzufügen** 
   > Je nach Werkzeug wird diese Funktion nicht immer genutzt, sollte der Button aber vorhanden sein, können Sie mit seiner Hilfe einen neuen Datensatz anlegen..
4. **Export**
   > Mit diesem Button können Sie die Ergebnisse des jeweiligen Datensatzes exportieren und speichern. Es können mehrere dieser Buttons existieren, wenn mehrere Formate zum Export angegeben werden.
5. **Alle exportieren**
   > Sie führen die Exportfunktion für alle Datensätze durch. Sollten mehrere Dateitypen angeboten werden, werden alle heruntergeladen. Eventuell müssen Sie in ihrem Browser den Download für mehrere Dateien genehmigen.
6. **Datensatz entfernen**
   > Mit diesem Button löschen Sie einen Datensatz und alle dazugehörigen Ergebnisse.
7. **Alle entfernen**
   > Mit diesem Button entfernen Sie alle Datensätze und setzen das Werkzeug zurück.
### Erreichbarkeitsanalyse
Die "Erreichbarkeitsanalyse" erreichen Sie über den Bereich "Analyse". 
Eine Erreichbarkeitsanalyse kann auf drei Arten durchgeführt werden:  
1. [Ab einem Referenzpunkt](#markdown-header-erreichbarkeit-ab-einem-Referenzpunkt)  
2. [Im Planungsgebiet](#markdown-header-erreichbarkeit-im-gebiet) 
3. [Entlang einer Route](#markdown-header-erreichbarkeit-entlang-einer-route)

Der Modus der Analyse kann im Dropdown Menü ausgewählt werden.

**Wichtige Informationen:**
Dieses Werkzeug wurde realisiert unter Verwendung von OpenRouteService, einem Dienst, der von der *Heidelberg Institute for Geoinformation Technology* entwickelt wird. Der verwendete Dienst wird vom *Bundesamt für Kartografie und Geodäsie (BKG)* bereitgestellt und betrieben.
Die Verwendung ist gedeckt durch die Creative Commons Lizenz CC BY 4.0.
Weitere Informationen finden Sie unter:  
https://heigit.org/de/ortsbasierte-dienste-und-navigation/  
https://openrouteservice.org/services/

Die Vollständige Dokumentation des OpenRouteService inkl. aller Annahmen über Modalitätsprofile und Routenparameter finden Sie unter:
https://giscience.github.io/openrouteservice/documentation/Documentation.html

Die Annahmen über einzelne Straßen und Wege können i.d.R. über die [OpenStreetMap](https://www.openstreetmap.org/#map=14/53.5492/9.9901) direkt ausgelesen oder in dringlichen Fällen beim BKG angefragt werden.

#### Erreichbarkeit ab einem Referenzpunkt
Zeigt ein Gebiet an, welches von einem ausgewählten Punkt auf der Karte innerhalb einer festgelegten Entfernung erreichbar ist. Die Entfernung kann in Zeit oder in Metern angegeben werden. Die Erreichbarkeit wird abhängig vom Verkehrsmittel berechnet. Die Polygone werden automatisch angepasst, wenn das Verkehrsmittel oder andere Parameter geändert werden.  
  
Das Modul kann verwendet werden, ohne vorherige Gebietsauswahl.
  


![Abbildung 1: Erreichbarkeit ab einem Referenzpunkt](https://user-images.githubusercontent.com/43250699/157067677-5f5db4a7-498a-45b2-8c06-6f2ea5ed6cbf.png)

*Abbildung 1: Erreichbarkeit ab einem Referenzpunkt*
  
1. **Auswahl des Modus**
   > Art der Einrichtungsanalyse. Ab einem Referenzpunkt, entlang einer Route oder Erreichbarkeit der gewählten Einrichtungen im Gebiet.
2. **Referenzpunkt setzen**
   > Durch Klicken auf der Karte wird der Punkt gesetzt, von dem aus berechnet wird.
3. **Verkehrsmittel festlegen** 
   > Das Verkehrsmittel wird ausgewählt aus einer Liste. Folgende Verkehrsmittel stehen aktuell zur Verfügung: Auto, Rad, Gehen, Rollstuhl / Kinderwagen.
4. **Maßeinheit der Entfernung festlegen**
   > Festlegen, ob die Entfernung in Minuten oder in Metern angegeben wird
5. **Entfernung**
   > Entfernung in zuvor festgelegter Maßeinheit (Minuten oder Metern) angeben
6. **Berechnen**
   > Berechnet die Erreichbarkeit vom Punkt. Es werden nur noch Fachdaten angezeigt, die innerhalb der Erreichbarkeit liegen. Gilt auch für die Einrichtungsübersicht und alle anderen Werkzeuge.
7. **Ergebnis ausblenden**
   > Die Ergebnisdarstellung auf der Karte wird ausgeblenden. Alle Fachdaten außerhalb der Isochronen werden wieder eingeblendet.
8. **Einwohnerabfrage**
   > (s. Einwohnerabfrage)
9.  **Legende & Isochronen**
   > Eine Legende wird eingeblendet. Sie wird dynamisch für die Anfrage generiert und zeigt drei gleichmäßig verteilte Entfernungswerte. Höchstwert ist der zuvor eingegebene Wert für die Entfernung. Die Isochronen (Polygone) in der Karte sind entsprechend der Legende eingefärbt. Sie zeigen das vom Referenzpunkt aus erreichbare Gebiet abhängig von den zuvor eingegebenen Parametern. Ist "Verkehrsfluss berücksichtigen" ausgewählt, wird das theoretische Maximum bei freier Fahrt als gestrichelte Linie angezeigt.
11. **Ergebnisverzeichnis**
   > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](./pagination.md) verwaltet werden.

*Für **Tageszeit**, **Verkehrsfluss berücksichtigen**, und **Von Flächenaußengrenzen berechnen** siehe im folgenden "Erreichbarkeit im Gebiet"*


#### Erreichbarkeit im Gebiet
Zeigt die Abdeckung und Erreichbarkeit von einer zuvor festgelegten Einrichtungsart (z.B. Kindergärten) in dem festgelegten Einzugsbereich (Planungsgebiet). Der Einzugsbereich ist die Entfernung von der jeweiligen Einrichtung und kann angegeben werden in Zeit oder in Metern. Die Erreichbarkeit ist abhängig von dem festgelegten Verkehrsmittel.

![Abbildung 2: Erreichbarkeit ausgewÃ¤hlter Einrichtungen im Gebiet](https://user-images.githubusercontent.com/43250699/157067851-a2c165c4-894c-4b3f-80a9-4bc626516771.png)

*Abbildung 2: Erreichbarkeit ausgewählter Einrichtungen im Gebiet*

1. **Auswahl des Modus**
   > Art der Einrichtungsanalyse. Ab einem Referenzpunkt, entlang einer Route oder Erreichbarkeit der gewählten Einrichtungen im Gebiet.
2. **Thema auswählen**
   > Damit dieses Modul verwendet werden kann muss mindestens ein Thema aktiv sein.
3. **Verkehrsmittel festlegen**
   > Das Verkehrsmittel wird ausgewählt aus einer Liste. Folgende Verkehrsmittel stehen aktuell zur Verfügung: Auto, Rad, Gehen, Rollstuhl.
4. **Maßeinheit der Entfernung festlegen**
   > Festlegen, ob die Entfernung in Minuten oder in Metern angegeben wird.
5. **Entfernung**
   > Entfernung in zuvor festgelegter Maßeinheit (Minuten oder Metern) angeben.
6. **Tageszeit**
   > Wenn Sie als Verkehrsmittel "Auto" ausgewählt haben, können Sie hier die Tageszeit auswählen, zu der Sie die Erreichbarkeit planen wollen. Die Funktion ist nur verfügbar, wenn "Verkehrsfluss berücksichtigen" aktiv ist. Dieser *Reisezeitindex* beschreibt die Veränderung der Reisezeiten zu verschiedenen Tageszeiten gegenüber einem normierten freien Verkehrsfluss (d.h. ein Reisezeitindex von 1,3 entspricht einer Verlängerung der Reisezeiten bzw. einer Verkürzung der zurückgelegten Strecke um 30%). Die Daten wurden von der Firma INRIX erhoben und beziehen sich, aggregiert für das gesamte Stadtgebiet für die Straßenklassen 2, 3 und 4 (Bundesstraßen, Kreisstraßen, Gemeindestraßen), auf das Jahr 2020. **Der Reisezeitindex bezieht sich ausschließlich auf den Kfz-Verkehr.**
7. **Verkehrsfluss berücksichtigen**
   > Wählen Sie aus, ob Sie den Verkehrsfluss berücksichtigen wollen oder nicht. 
8. **Von Flächenaußengrenzen ermitteln**
   > Wenn Sie einen Datensatz ausgewählt haben, wie bspw. "Grünflächen" oder ähnliches, dann wird die Erreichbarkeitsanalyse von der Außengrenze dieser Fläche durchgeführt.
9. **Berechnen**
10. **Ergebnis ausblenden** 
11. **Legende & Isochronen**
    > Eine Legende wird eingeblendet. Sie wird dynamisch für die Anfrage generiert und zeigt drei gleichmäßig verteilte Entfernungswerte. Höchstwert ist der zuvor eingegebene Wert für die Entfernung. Die Isochronen (Polygone) in der Karte sind entsprechend der Legende eingefärbt. Sie zeigen die vom den Einrichtungen aus erreichbaren Gebiete abhängig von den zuvor eingegebenen Parametern. Ist "Verkehrsfluss berücksichtigen" ausgewählt, wird das theoretische Maximum bei freier Fahrt als gestrichelte Linie angezeigt.
12. **Ergebnisverzeichnis**
   > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](./pagination.md) verwaltet werden.

   ### Erreichbarkeit entlang einer Route
Wenn Sie im Routing-Tool eine Route erstellt haben, können Sie die Erreichbarkeit in einem bestimmten Umkreis um die Route herum berechnen lassen. 
  
Das Modul kann verwendet werden, ohne vorherige Gebietsauswahl.
![Abbildung 3: Erreichbarkeit entlang einer Route](https://user-images.githubusercontent.com/43250699/159470252-067117b3-b8a3-481d-b007-113e7a0477c8.png)

*Abbildung 3: Erreichbarkeit entlang einer Route*
1. **Auswahl des Modus**
   > Art der Einrichtungsanalyse. Ab einem Referenzpunkt, entlang einer Route oder Erreichbarkeit der gewählten Einrichtungen im Gebiet. Beachten Sie, dass die Erreichbarkeit entlang einer Route nur auswählen können, wenn Sie im Vorfeld im Routing-Tool eine Route angelegt haben.
2. **Route auswählen**
   > Die im Routing-Tool aktive Route wird automatisch ausgewählt.
3. **Vorgegebene Felder**
   > Sie können bei der Erreichbarkeitsanalyse anhand einer Route kein Verkehrsmittel auswählen und somit auch nicht, ob die Entfernung in Metern oder Minuten berechnet werden soll. Es wird immer die Entfernung in Metern (Luftlinie) zur Berechnung herangezogen.
4. **Entfernung**
   > Entfernung in Metern angeben.
5. **Berechnen**
6. **Ergebnis ausblenden** 
7. **Legende und Isochronen**
   > Eine Legende wird eingeblendet. Sie wird dynamisch für die Anfrage generiert und zeigt drei gleichmäßig verteilte Entfernungswerte. Höchstwert ist der zuvor eingegebene Wert für die Entfernung. Die Isochronen (Polygone) in der Karte sind entsprechend der Legende eingefärbt. Sie zeigen dasum die Route herum erreichbare Gebiet abhängig von den zuvor eingegebenen Parametern.
8. **Ergebnisverzeichnis**
   > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](./pagination.md) verwaltet werden.
## Filter
___
Die aktiven, ausgewählten Themen können durch Klick auf den Reiter "Filter" nach den Kategorien ihrer Datensätze durchsucht und gefiltert werden. Die Karte zoomt automatisch auf die Filterergebnisse. Es werden nur Ergebnisse in den ausgewählten Gebieten einbezogen. Der Filter ist für alle Fachdatensätze verfügbar, welche sinnvolle filterbare Attribute (wie Fläche, Nutzung, Träger, etc.) aufweisen.  

Um Ihre gewünschten Fachdaten zu filtern, gehen Sie zunächst auf "Analyse" und dann auf "Filter".

![Abbildung 1: Filter](https://user-images.githubusercontent.com/43250699/142924026-a46ada10-7289-4882-9b2e-c41528289930.jpg)

*Abbildung 1: Filter*  

1. **Ein Thema im Filter wählen**
   > Angezeigt werden die ausgewählten Themen. Themen können jederzeit hinzugefügt werden. Dazu Themenbau anklicken und Thema auswählen.
2. **Filteroptionen:**
    - es können mehrere Filteroptionen gewählt werden. Kennzeichnung der Auswahl erfolgt automatisch durch Haken. 
    - Schieberegler (von / bis): es kann z.B. eine gewünschte Flächengröße eingegeben werden.
3. **Ergebnis wird sofort mit Wahl der Filteroption angezeigt:**
    - Ergebnis wird in der Karte durch Symbol oder Flächenfarbe angezeigt. Durch Anklicken des Reiters "Legende” wird diese eingeblendet. Mousehover blendet Infofeld zu Einrichtung / Fläche ein.
    - Im Ergebnisfeld der Suche werden Namen der Gebiete / Einrichtungen angezeigt. Durch Anklicken der Namen wird die Auswahl in der Karte markiert. 
4. **Filter löschen:** 
   > Einzelne Auswahl durch Anklicken des roten "X" oder gesamte Auswahl löschen durch Anklicken des Buttons "Alle löschen”.


## Flächen Stylen

...
## Gebietsauswahl
___
Beim Starten von CoSI wird zunächst ein Bezugsrahmen festgelegt sowie ein Planungsgebiet zusammengestellt und bestätigt.

Wenn Sie Ihren Bezugsrahmen ändern möchten, könnten Sie dies unter "Gebiete auswählen" tun.

![Abbildung 1: Gebietsauswahl](https://user-images.githubusercontent.com/43250699/142933538-fd2e1dbc-8bef-444a-bc7f-66d0066a457e.png)


*Abbildung 1: Das Werkzeug "Gebiet auswählen"*  

1. **Bezugsrahmen wählen**
   > Über ein Dropdown Menü können **"Bezirke"**, **"Stadtteile"** oder **"Statistische Gebiete"** ausgewählt werden – dies legt die Verwaltungseinheit fest, für die die statistischen Daten angezeigt und Auswertungen erstellt werden sollen. Alle Funktionen sind auf den jeweiligen Gebietsebenen verfügbar. Die Zahl der verfügbaren Indikatoren kann jedoch variieren. Der Bezugsrahmen bestimmt auch die zu ladenden übergeordneten Referenzgebiete: Stadtteile für stat. Gebiete, Bezirke für Stadtteile.
2. **Gebiete aus- und abwählen**
    - Die einzelnen Verwaltungseinheiten (statistisches Gebiet oder Stadtteil) anklicken (nochmaliges Klicken deaktiviert die Auswahl wieder), die Grenzen werden blau markiert. 
    - Auf dem Stift rechts neben "Auswahl zurücksetzen" klicken. Es wird ein Zeichentool aktiviert; damit kann der Nutzende ein Rechteck über das Auswahlgebiet ziehen um dieses auszuwählen.
    - Beide vorher beschriebenen Möglichkeiten sind auch miteinander kombinierbar, wobei die Reihenfolge unerheblich ist. Die Nutzenden können also zuerst einzelne Verwaltungseinheiten auswählen und dann das Zeichentool aktivieren, um damit weitere Verwaltungseinheiten dazu zuschalten oder auch andersherum vorgehen.
3. **Puffer festlegen**
   > Es kann ein Pufferradius in Metern festgelegt werden. Für den werden ausgewählte Fachdaten um das Planungsgebiet herum angezeig. Dies berücksichtigt die Tatsache, dass das Einzugsgebiet von einer Einrichtung nicht unbedingt übereinstimmt mit den Gebietsgrenzen der Verwaltungseinheit innerhalb derer sich die Einrichtung befindet. Die Analysefunktionen werden davon nicht beeinflusst.
4. **Auswahl bestätigen**
   > Lädt die Daten für das ausgewählte Planungsgebiet vom Server und legt den Bereich für die anzuzeigenden Fachdaten fest. Auch eine leere Auswahl kann bestätigt werden. Dann werden keine Daten geladen und Fachdaten für den gesamten Stadtbereich angezeigt. (s. unten)
5. **Auswahl zurücksetzen**
   > Setzt das aktuelle Planungsgebiet zurück. Im direkten Anschluss kann ein neues Planungsgebiet zusammengestellt und bestätigt werden.
6. **Auswahlrechteck zeichnen**
   > Ein Startpunkt wird gesetzt und ein Rechteck bis zum Endpunkt über das relevante Gebiet gezogen. Alle Verwaltungseinheiten, die innerhalb des Rechtecks oder an den Linien des Rechtecks liegen, werden in das Planungsgebiet aufgenommen.
7. **Zusätzliche Hilfsebenen ein/- ausblenden**
   > Mithilfe der Checkbox können zusätzliche Layer zur Orientierung ein- und ausgeblendet werden. Der Layer kann ebenfalls über den Themenbaum ein- und ausgeschaltet werden. Zu den Hilfsebenen gehören aktuell die "Sozialräume" und die "RISE Fördergebiete".

Das festgelegte Planungsgebiet kann jederzeit angepasst werden:  

   - Das Gebiet kann *erweitert* werden: sowohl per Klick als auch per Zeichentool.
   - Das Gebiet kann *verkleinert* werden: per Klick können markierte Verwaltungseinheiten wieder abgewählt werden.
   - Das Gebiet kann komplett zurückgesetzt werden: per Klick auf "Auswahl zurücksetzen".

Es muss nicht in jedem Nutzungskontext immer ein Planungsgebiet als erstes festgelegt werden; bestimmte Analysetools wie z.B. die [Erreichbarkeitsanalyse](./erreichbarkeitsanalyse.md) und [Vergleichbare Gebiete](./vergleichbaregebieteermitteln.md) können verwendet werden ohne dass vorher ein Gebiet festgelegt wird.  

Für solche Fälle gelten folgende Hinweise:  

   - Es werden keine Datensätze geladen, d.h. eine Anzeige der regionalstatistischen Daten ist nicht möglich. Auch werden keine regionalstatistischen Daten im Dashboard angezeigt.
   - Beim Zuschalten von Themen aus den Fachdaten könnte der Ladevorgang länger dauern.
   - Möglicherweise funktioniert die [Erreichbarkeitsanalyse](./erreichbarkeitsanalyse.md) für eine sehr große Zahl von Einrichtungen nicht zuverlässig.
## Geodaten Importieren
___
Mit diesem Werkzeug können Sie eigene Datensätze in Form von GeoJSONs hochladen und als Themenlayer einfügen, der anschließnend visualisiert werden kann und dem alle weiteren Analysefunktionen von CoSI zur Verfügung stehen.   

![Abbildung 1: Dateien importieren](https://user-images.githubusercontent.com/43250699/142930620-f556b3bb-a098-4deb-8394-2b5db6963c94.jpg)  
*Abbildung 1: Dateien importieren*   
1. **Info**
   > Über den Button finden Sie zu dieser Anleitung.
2. **Upload per Drag And Drop**
   > Ziehen Sie eine Datei per Drag and Drop in dieses Feld. Sie wird automatisch hochgeladen.
3. **Datei auswählen**
   > Mit einem Klick auf diesen Button öffen Sie den Dateibrowser Ihres Computers und können die hochzuladende Datei dort auswählen.
4. **Projektionssystem auswählen**
   > Geodaten sind in unterschiedlichen *Projektionssystemen* kodiert. Sollten Sie nach dem Upload feststellen, dass Ihre Daten an den falschen Orten visualisiert werden, überprüfen Sie bitte, in welchem Projektionssystem Ihre Datei kodiert ist und geben Sie es bei einem erneuten Upload in diesem Auswahlfeld an.  
  
Sobald Ihre Datei hier hochgeladen wurde, erscheint ein neues Fenster, in welchem Sie bestimmte Funktionen haben, um den Layer aus der Datei zu generieren.  

![Abbildung 2: Geodaten Importieren, Layeroptionen festlegen](https://user-images.githubusercontent.com/43250699/142931326-1effcb55-62a9-4fdb-918f-6d0fb9dccc49.jpg)  
*Abbildung 2: Geodaten Importieren, Layeroptionen festlegen* 

5. **Layername**
   > Hier können Sie den Layer frei benennen. Standardmäßig wird der Name der hochgeladenen Datei verwendet.
6. **[Styling](#markdown-header-styling)**
7. **[Einrichtungsdaten](#markdown-header-einrichtungsdaten)**
8. **[Filterdaten](#markdown-header-filterdaten)**
9. **[Numerische Werte](#markdown-header-numerische-werte)**
10. **Abbrechen/ Layer hinzufügen**
   > Mit einem Klick auf den Button "Abbrechen" brechen Sie den Vorgang ab und schließen das Fenster. Mit einem Klick auf "Layer Hinzufügen" wird der Import abgeschlossen und mit Ihren Einstellungen für die Funktionen in CoSI bereitgestellt.

#### Styling

![Abbildung 3: Geodaten Importieren, Layerstyling](https://user-images.githubusercontent.com/43250699/142931936-7da21540-9ac3-4a4d-85f5-1f78feae6978.jpg)  
*Abbildung 3: Geodaten Importieren, Layerstyling*  

- **6.1** Ein Icon auswählen, mit dem die jeweiligen Punkte visualisiert werden sollen. (Diese Option steht nicht zur Verfügung, wenn es sich bei denen von Ihnen hochgeladenen Geodaten um Polygone handelt).
- **6.2** Mit dieser Checkbox legen Sie fest, ob alle Entitäten des Datensatzes mit derselben Farbe dargestellt werden sollen oder basierend auf einer ihrer Attribute farblich angepasst werden sollen. Aktivieren Sie diese Checkbox, bestimmen Sie das gewünschte Attribut bitte wie in 6.2.1 beschrieben.
   - **6.2.1** Haben Sie die Checkbox "Farbe nach Attributen" aktiviert, erscheint dieses Auswahlfeld, in dem alle Attribute der Einträge Ihres Datensatzes aufgelistet werden. Bestimmen Sie hier bitte das Attribut, anhand dessen die Farben generiert werden sollen.
   - **6.2.2** Sobald Sie in 6.2.1 ein Attribut ausgewählt haben, erscheint diese Checkbox, sofern es sich nicht um ein Attribut mit numerischen Werten handelt. Hier haben Sie die Option, Ihre Daten nicht auf Basis einer ausgewählten Farbe zu visualisieren, sondern gleichmäßig verteilt über ein Regenbogenfarbspektrum. Dies kann zur besseren Unterscheidung einzelner Punkte hilfreich sein. 
- **6.3** Haben Sie weder "Farbe nach Attributen" ausgewählt bzw. bei "Farbe nach Attributen" nicht die Checkbox "Regenbogenfarbspektrum" aktiviert, können Sie hier eine Farbe bestimmen, auf deren Basis die Daten visualisiert werden. Ein Klick auf das farbige Viereck der Textbox öffnet das Farbauswahlfeld.

#### Einrichtungsdaten
![Abbildung 4: Geodaten Importieren, Einrichtungsdaten](https://user-images.githubusercontent.com/43250699/142932334-7476d084-eda1-4a05-a93e-bf159ac55b8f.jpg)  
*Abbildung 4: Geodaten Importieren, Einrichtungsdaten*    

   - **7.1** Hier wählen Sie aus allen Attributen der Einträge Ihrer hochgeladenen Datei das Attribut aus, welches einen eindeutigen, individuellen Namen des Eintrags enthält. Dies ist für bestimmte Funktionen von CoSI relevant. Sollte ein solches Attribut nicht existieren, lassen Sie es bitte einfach frei.
   - **7.2** Hier wählen Sie aus allen Attributen der Einträge Ihrer hochgeladenen Datei ein Attribut aus, was den Typ des jeweiligen Eintrags am besten beschreibt. Handelt es sich bei Ihrem Datensatz beispielsweise um eine Reihe von unterschiedlichen Einrichtungen, könnte hier als Attribut eines gewählt werden, dass Werte wie "Kindergarten", "Krankenhaus" oder "Hotel" enthält.
   - **7.3** Für die korrekte Darstellung in manchen Werkzeugen von CoSI ist eine vollständige Adresse hilfreich. Sofern ein Attribut mit dem Namen "Adress" oder "address" vorhanden ist, wird Ihnen dieser Teil der Funktionen nicht angezeigt. Sollte ein solches Attribut aber nicht existieren, können Sie aus bestimmten im Vorfeld automatisch erkannten Attributen wie "Straße" oder "plz" wählen. Sie können mehrere dieser Felder auswählen und so die Adresse entsprechend zusammenstellen.
   - **7.4** Sollte keines der automatisch erkannten Attribute die korrekten Adressdaten enthalten, können Sie mit dem Button "Aus allen Objekteigenschaften wählen" alle Attribute anzeigen lassen, um daraus die Adresseigenschaften auszuwählen. Sollten in dem Datensatz keine entsprechenden Informationen hinterlegt sein, können Sie dieses Auswahlfeld ignorieren.

#### Filterdaten
![Abbildung 5: Geodaten Importieren, Filterdaten festlegen](https://user-images.githubusercontent.com/43250699/142932614-055ed92b-6967-436b-ace5-8977111ef473.jpg)  
*Abbildung 5: Geodaten Importieren, Filterdaten festlegen*  

   - Unter CoSIs Werkzeugen finden Sie auch das Filterwerkzeug, mit denen Sie alle Datensätze nach bestimmten Kriterien filtern können. Bitte bestimmen Sie hier, welche der Attribute Ihrer Daten für den Filter verfügbar gemacht werden sollen.
   - **8.1** Mit einem Klick auf diesen Button öffnet sich ein Auswahlfeld, mit Hilfe dessen Sie ein Attribut zur weißen Liste des Filters hinzufügen können.

#### Numerische Werte
![Abbildung 6: Geodarten Importieren, Numerische Werte festlegen](https://user-images.githubusercontent.com/43250699/142932809-d77c6760-bff3-4576-b9fa-1bcca88ef816.jpg)  
*Abbildung 6: Geodarten Importieren, Numerische Werte festlegen*  
- Mit Hilfe des Werkzeugs [Versorgungsanalyse](./versorgungsanalyse.md) können Sie unterschiedlichste Zahlwerte gegeneinander verrechnen. In diesem Bereich bestimmen Sie Attribute, die numerische Werte enthalten, die für die Versorgungsanalyse bereitgestellt werden sollen. Dies können alle sinnvoll quantitativ messbaren Werte sein, wie beispielswiese "Budget", "Einwohnerzahl", "Fläche" oder "Besuche pro Woche" etc.  

   - **9.1** Für die bessere Visualisierung in einer späteren Tabelle, können Sie hier dem numerischen Wert einen sinnvollen Namen geben, sollte das Attribut nicht sinnvoll benannt sein. So könnten Sie beispielsweise "budget_21" in "Verfügbare Mittel 2021" umbenennen.
   - **9.2** Hier sehen Sie die ID des Attributs und dahinter in Klammern einen Beispielwert aus dem ersten Eintrag.
   - **9.3** Mit dieser Checkbox fügen Sie das Attribut zu den numerischen Werten hinzu. 
## Graphenvisualisierung
___
Das Graphenvisualisierungswerkzeug erstellt Graphen aus Datensätzen und verwaltet diese. Darüberhinaus ermöglicht es Ihnen den Export dieser Graphen als PNG.

   > Nach dem Sie Ihre gewünschten Gebiete und Fachdaten ausgewählt haben, können Sie unter Analyse - Graphenvisualisierung, Ihre Ergebnisse visuell darstellen lassen. 

![Abbildung 1: Graphenvisualisierung](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/graphenvisualisierung.png?raw=true)  
*Abbildung 1: Graphenvisualisierung*

1. **Diagrammtyp auswählen**
   > Häufig werden gleich unterschiedliche Graphen erstellt. Hier können Sie zwischen den verfügbaren Diagrammen für den ausgewählten Datensatz umschalten.
2. **Graph & Legende**
   > Das augewählte Diagramm. Sie finden hier den Titel des ausgewählten Datensatzes, die Legende und den erzeugten Graphen.
3. **Y-Achse skalieren**
   > Hier wählen Sie aus, ob die Y-Achse des Graphen von 0 an beginnt oder relativ zum kleinsten verfügbaren Wert.  
   *Diese Funktion ist nur beim Liniendiagramm verfügbar.*
4. **Y-Achse stapeln**
    > Die Werte der Datensätze werden aufsummiert und farblich abgetrennt dargestellt.
5. **Ergebnisverzeichnis**
   > Das [Ergebnisverzeichnis](./pagination.md) verwaltet die unterschiedlichen erstellten Graphen und bietet einige standardisierte Funktionen, zu denen Sie [hier](./pagination.md) mehr erfahren können.
## Kartenanalyse regionalstatistischer Daten
___
Grundlage aller CoSI-Analysefunktionen sind neben den Fachdaten-Layern die Datensätze der StaNord-Datenbank, welche für die verschiedenen Verwaltungseinheiten als Zeitreihen vorliegen. Diese können für das ausgewählte Planungsgebiet direkt und dynamisch in der Karte visualisiert werden. Die *Farbskalierung und Legende* werden hierbei *dynamisch* aus der Auswahl generiert. Es wird immer der *aktuellste Datensatz* dargestellt.
Das Werkzeug zur Visualisierung regionalstatistischer Daten ermöglicht die Auswahl von regionalstatistischen Datensätzen, die für die ausgewählten Bezirke verfügbar sind. Es kann nur verwendet werden, wenn bereits Gebiete über das Gebietsauswahlwerkzeug ausgewählt wurden.
Das Werkzeug kann die ausgewählten Datensätze auf der Karte visualisieren und generiert eine dynamische Legende. Des Weiteren können Datensätze für mehrere Jahre ausgewählt und auf Wunsch in hintereinander laufender Folge animiert werden.  


![Abbildung 1: Fenster zur Kartenanalyse statistischer Daten](https://user-images.githubusercontent.com/43250699/159270688-1d5e1b8f-799b-4d31-8b8e-247b0fd45293.png)  

*Abbildung 1: Fenster zur Kartenanalyse statistischer Daten*  

1.	**Werkzeug minimieren/ maximieren**  
   > Über den Button kann das Fenster des Werkzeugs minimiert bzw. wieder maximiert werden.
2.	**Daten auf Karte visualisieren**  
   > Über den Button kann die Kartenvisualisierung der regionalstatistischen Daten ein- und wieder ausgeblendet werden.
3.	**Vor/ Zurück**  
   > Mit den Vor- und Zurückbuttons können die regionalstatistischen Datensätze fließend durchgeschaltet werden.
4.	**Jahresauswahl**  
   > Hier können Sie das Jahr auswählen, für den der regionalstatistische Datensatz visualisiert wird. Standardmäßig ist das aktuellste, verfügbare Jahr ausgewählt.
5.	**Referenzjahr auswählen**  
   > Hier können Sie ein Vergleichsjahr auswählen. Die prozentuale Differenz zum ersten, ausgewählten Jahr wird dann ebenfalls auf der Karte eingeblendet.
6.	**Auswahlfeld für die verfügbaren regionalstatistischen Datensätze**     
   > Erlaubt es, die relevanten regionalstatistischen Datensätze für die ausgewählten Gebiete und den Bezugsmaßstab durchzuschalten und diese mit Farbskala auf der Karte darzustellen. Die Auswahl zeigt immer die neuesten verfügbaren Daten.
7.	**Legende**  
   > Die Legende für die farbliche Visualisierung der Karte. Wenn Sie mit der Maus über einen der Marker hovern, wird der Wert des zugehörigen, ausgewählten Gebiets angezeigt. Rechts und links werden der niedrigste und der höchste Wert noch einmal zusätzlich dargestellt.
8.	**Info**  
   > Über den Button öffnen Sie diese Anleitung.
9.	**Playbutton**  
   > Mit dem Play-Button starten Sie die Animation der Datensätze über alle verfügbaren Jahre. In dem danebenstehenden Feld können Sie einen Wert eintragen, der angibt, wie schnell die einzelnen Animationsschritte durchlaufen werden (in Sekunden).
10. **Daten als Chart visualisieren**  
   > Lädt die verfügbaren regionalstatistischen Daten der ausgewählten Gebiete in das Visualisierungs-Werkzeug und erzeugt dort einen Graphen.
11. **Gebietsnamen ein-/ ausblenden**  
   > Über den Button können Sie die Namen der ausgewählten Gebiete auf der Karte ein- und wieder ausblenden.
12. **Hilfsbutton**  
### Manuelle Flächenauswahl für Fachdaten
Mit Hilfe dieses Werkzeuges können Sie ein Polygon auf der Karte zeichnen, innerhalb dessen Fachdaten angezeigt werden. Einrichtungen oder andere Fachdatenmarker, die außerhalb dieses Polygons liegen, werden ausgeblendet. 
> Um die Manuelle Flächenauswahl nutzen zu können, wählen Sie hier zunächst *Analyse* und infolge dessen *Manuelle Flächenauswahl*.

![Abbildung 4: Manuelle Flächenauswahl](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/manuelle%20flaechenauswahl.png?raw=true)

*Abbildung 4: Manuelle Flächenauswahl*

1. **Polygon zeichnen**
   > Klicken Sie auf diesesn Button, um ein neues Polygon auf der Karte zu zeichnen.
2. **Eingabe löschen**
   > Löschte die bestehende Flächenauswahl und zeigt alle Fachdaten wieder an.
3. **Einwohnerabfrage**
   > Für die aktuelle Flächenauswahl eine [Einwohnerabfrage](./einwohnerabfrage.md) durchführen.  
4. **Ergebnisdarstellung auf der Karte**
### Sitzung Speichern / Laden 
![Abbildung 1: Sitzung Speichern](../utils/assets/screenshots/sitzungspeichern.png)
*Abbildung 1: Sitzung speichern / laden*


Mit dem Dienst **Sitzung speichern/laden** können aktuelle diverse Informationen der aktuellen Arbeitssitzung abgespeichert werden um diese zu einem späteren Zeitpunkt wieder öffnen und weiterbearbeiten zu können. Dies umfasst

- Die ausgewählte Verwaltungsebene und ausgewählte Gebiete
- Aktive Fachdatenthemen 
- Mit den [Simulationswerkzeugen](./einrichtungenanlegen.md) erstellte Szenarien 
- Ergebnisse und Konfigurationen der Werkzeuge [Erreichbarkeitsanalyse](./erreichbarkeitsanalyse.md) und [Versorgungsanalyse](./versorgungsanalyse.md)

und sind unter "Dienste", "Sitzung speichern/laden" zu finden.


1. **Schnell speichern**
   > Aktuelle Sitzung im Browser (z.B. Edge, Firefox) speichern. Diese können beim Start von CoSI über den Button **Letzte Laden** wieder geladen werden. Wenn Browserverlauf oder Cache geleert werden, geht dieser Speicherstand verloren! Es kann immer nur eine Sitzung vorgehalten werden.
2. **Letzte laden**
   > Letzte im Browser gespeicherte Sitzung aus dem Cache laden
3. **Letzte löschen**
   > Letzte Sitzung aus dem Cache löschen
4. **Speichern unter**
   > Eine Sitzung benennen und als Datei auf dem Rechner speichern und über den Button **Datei laden** wieder laden. Diese können jederzeit wieder geladen oder mit anderen CoSI Nutzer:innen geteilt werden. 
   
   *Expertentipp: Die Sitzungen können mit jedem Texteditor geöffnet und als JSON-Datei bearbeitet werden.*
5. **Datei laden**
   > Sitzung aus lokaler Datei öffnen
6. **Automatisches Speichern (10min)**
   > Wenn aktiv wird die aktuelle Sitzung im Modus **Schnell speichern** alle 10min im Hintergrund gespeichert und kann über **Letzte laden** wiederhergestellt werden.
### Statistische Datenübersicht

In der statistischen Datenübersicht können tabellarisch Informationen zu den statistischen Daten der ausgewählten Gebiete ([Statistische Datenübersicht](#markdown-header-statistische-datenübersicht)) angezeigt, ausgewertet und exportiert werden.

  > Um zur statistischen Datenübersicht zu gelangenn, wählen Sie im Dashboard den Punkt "statistische Datenübersicht" aus. 
  
![Abbildung 27: Statistische Datenübersicht](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/statistische%20datenu%CC%88bersciht1.png?raw=true)
*Abbildung 27: Statistische Datenübersichtm 1*

![Abbildung 29: Statistische Datenübersicht](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/statistischedatenu%CC%88bersicht2.png?raw=true)
*Abbildung 29: Statistische Datenübersicht 2*



1. **Gruppen ein-/ausklappen**
   > Thematische Gruppen (vgl. [Regionalstatistische Daten](./kartenvisualisierung.md)) über das **+** ein- und ausklappen.
2. **Aktionen**
   > - s. [Bürger-Menü](#markdown-header-burgermenü)
   > - Visualisierung ein- / ausschalten: Schaltet die Visualisierung des ausgewählten Indikators zum aktuell gewählten Jahr in der Karte ein/aus
   > - Jahre ein- / ausklappen: Klappt die Tabellenzeile auf um alle Jahre der Zeitreihe darzustellen.
3. **Jahr auswählen**
   > Aktuelles Jahr für die Darstellung in Tabelle und Karte auswählen.
4. **Spalte verschieben**
   > Mit den Pfeilen links/rechts die Spalte verschieben. Die Trennstriche grenzen die Verwaltungsebenen voneinander ab
5. **Spalte ein-/ausblenden**
   > Mit dem Auge kann eine Spalte aus- und eingeblendet werden, um die Tabelle übersichtlicher zu gestalten. Ausgeblendete Spalten werden für Exporte und Diagramme nicht berücksichtigt.
6. **Aggregationsspalten**
   > Die letzten zwei Spalten zeigen standardmäßig Durchschnitts- und Gesamtwert für die **ausgewählten Gebiete** (wie in der Karte dargestellt, nur die ausgewählte Verwaltungsebene). Für relative (anteilige) Indikatoren können keine Aggregationen berechnet werden, da der Bezugsrahmen nicht klar ist.
7. **Spalte auswählen**
   > Spalten für Export und Diagramm-Erstellung auswählen. Ist keine Spalte ausgewählt werden alle verwendet.
8. **Zeile auswählen**
   > Zeilen für Export und Diagramm-Erstellung auswählen. Ist keine Spalte ausgewählt werden alle für den Export bzw. nur die aktuelle für die Diagramme verwendet.
9. **Trendpfeil**
   > Der Trendpfeil zeigt das extrapolierte Wachstum für den nächsten Zeitschritt (in % im Tooltip) an. Für die Abschätzung werden die Steigungen der letzten 5 Zeitschritte, gewichtet nach Aktualität, herangezogen. Die Darstellung erhebt **keinen Anspruch** auf Genauigkeit und berücksichtigt keine anderen Werte über die aktuelle Zeitreihe hinaus.
10. **Themenfilter**
      > Über den Filter können beliebige Indikatoren (sortiert nach Gruppen) für die Darstellung und den Export ausgewählt werden. Die Liste kann im Freitext durchsucht werden.
11. **Tabelle exportieren**
      > Die aktuelle Auswahl (Spalten, Zeilen, Jahre) als XLSX für Excel exportieren. Über aus Auswahlfeld *alle Jahre exportieren* kann die gesamte Zeitreihe für die ausgewählten Spalten und Zeilen exportiert werden. Ist keine Spalte oder Zeile ausgewählt werden alle verwendet.
12. **Kartenvisualisierung**
      > Die Darstellung in der Karte entspricht der des Kontrollfeldes [Kartenanalyse regionalstatistischer Daten](./kartenvisualisierung.md).

#### Bürgermenü
![Abbildung 28: Statistische Datenübersicht - Bürgermenü](../utils/assets/screenshots/statdashboard_burgermenu.png)
*Abbildung 28: Statistische Datenübersicht*

1. **Visualisierung ein-/ausschalten**
   > Thematische Gruppen
2. **Zeitreihe in der Karte animieren**
   > *(Funktioniert nur bei aktiver Kartenvisualisierung)*
3. **Gebietsnamen ein-/ausblenden**
   > *(Funktioniert nur bei aktiver Kartenvisualisierung)*
4. **Für Feld A auswählen**
   > Selektiert das Thema als **Feld A** für Berechnungen und Korrelation (siehe 7, 8, 9, 10, 12)
5. **Für Feld B auswählen**
   > Selektiert das Thema als **Feld B** für Berechnungen und Korrelation (siehe 7, 8, 9, 10, 12)
6. **Auswahl aufheben**
   > Setzt die Felder **A** und **B** zurück
7. **Addieren**
   > Addiert die Werte für **A** und **B** für jede Gebietsspalte und fügt das Ergebnis der Tabelle an. Der neue Datensatz kann ebenfalls in der Karte visualisiert und in anderen Werkzeugen verwendet werden.
8. **Subtrahieren**
   > Analog zu **Addieren**, subtrahiert **A** - **B**.
9. **Multiplizieren**
   > Analog zu **Addieren**, multipliziert **A** x **B**.
10. **Dividieren**
      > Analog zu **Addieren**, dividiert **A** / **B**.
11. **Diagramme erzeugen**
      > Erzeugt Diagramme für den ausgewählten Indikator im [Chartgenerator](./chartgenerator.md) (analog zu [Kartenanalyse regionalstatistischer Daten](./kartenvisualisierung.md)). Visualisiert alle ausgewählten Spalten (s. [Statistische Datenübersicht](#markdown-header-statistische-datenübersicht)).
12. **Korrelations- / Streuungsdiagramm**
      > Visualisiert ein Streuungsdiagramm für die Felder **A** (Y-Achse) über **B** (X-Achse) im [Chartgenerator](./chartgenerator.md) und berechnet die Korrelation (Pearson) zwischen den Datensätzen und zeichet eine Regressionsgerade.
## Vergleichbare Gebiete ermitteln
___
Über den Bereich der "Analyse" gelangen Sie zu "Vergleichbare Gebiete ermitteln".

Das Werkzeug erlaubt die Ermittlung aller Gebiete (Stadtteile oder statistische Gebiete), in denen die ausgewählten Parameter vorherrschen, bzw. solcher, die dem gewählten Referenzgebiet in diesen Parametern ähneln.
Wählen sie unter Filter die gewünschten Parameter für den Vergleich, sowie ein Referenzgebiet (optional).  

![Abbildung 1: Vergleichbare Gebiete ermitteln](https://user-images.githubusercontent.com/43250699/157012950-d631691b-0f40-4ab5-85f4-9e6b9c250d7e.png)   
 
*Abbildung 1: Vergleichbare Gebiete ermitteln*  

1. **Statistische Datenfilter**
   > Gewünschte Parameter für den Vergleich auswählen. Es können beliebig viele Parameter hinzugefügt werden. Alle StaNord-Datensätze sind hierfür verfügbar. Anteilige Werte eignen sich jedoch besser für die Vergleichbarkeit. Gegenwärtig können eigene Berechnungen aus dem Dashboard nicht herangezogen werden.
2. **Referenzgebiet**
   > Optional kann eins der ausgewählten Gebiete als Referenzgebiet angegeben werden.
3. **Filter hinzufügen**
   > Die Parametereinstellungen zeigen den aktuellen Datensatz (Jahr Min.- und Max.-Wert aller Hamburger Gebiete, den Referenzwert (frei wählbar oder des Referenzgebiets) sowie die Toleranz nach oben und unten. Das Toleranzintervall ist entweder in absoluten Zahlen oder in Prozent für anteilige Werte angegeben.
4. **Alle Filter zurücksetzen** 
   > Setzen Sie Ihre Eingaben zurück.  
5. **Pagination** 
   > Der "Datensatz hinzufügen" Button aus der [Pagination](./pagination.md).  

![Abbildung 2: Vergleichbare Gebiete ermitteln, Ergebnisse](https://user-images.githubusercontent.com/43250699/157013004-f8b83b5e-92b3-4900-a0c0-60a1518a187f.png)  
*Abbildung 2: Vergleichbare Gebiete ermitteln, Ergebnisse*  

1. **Pagination**
   > Die [Pagination](./pagination.md) verwaltet die unterschiedlichen Datensätze. Sie erscheint, sobald Sie einen zweiten Datensatz erstellt haben.
2. **Parametereinstellungen (Jahr)**
   > Wählen Sie die Grundlage für das entsprechende Jahr aus.  
3. **Parametereinstellungen (Attribute)**
   > Sofern es sich um einen Themenlayer handelt, können Sie hier ggf. Attribute der Einrichtung auswählen, anhand deren Sie nach vergleichbaren Gebieten suchen.  
4. **Parametereinstellungen (Toleranz)**
   > Stellen Sie die Toleranz ein, innerhalb derer weitere vergleichbare Gebiete gefunden werden sollen. Das Toleranzintervall ist entweder in absoluten Zahlen oder in Prozent für anteilige Werte angegeben.  
5. **Ergebnisse**
   > Eine Liste aller Gebiete, auf die die gewählten Kriterien zutreffen, wird im Fenster angezeigt. Ein Klick auf ein Gebiet legt den Kartenausschnitt auf dieses fest.
6. **Als Gebietsauswahl setzen**
   > Über *Ergebnis als Gebietsauswahl* setzen kann die aktuelle Gebietsauswahl für weitere Analysen auf die Ergebnis-Gebiete gesetzt werden.
  
## Dienste/ Versorgungsanalyse
___
Mit diesem Werkzeug kann das Verhältnis zweier Datensätze zueinander berechnet werden. Die Datensätze können entweder regionalstatistische Daten oder Einrichtungsdaten aus dem Menü "Themen/ Fachdaten" sein. Damit die Versorgungsanalyse verwendet werden kann, müssen mindestens zwei Datensätze geladen worden sein. Die "Versorgungsanalyse" finden sie im Bereich "Analyse".


![Abbildung 1: Versorgungsanalyse, Einstellungen](https://user-images.githubusercontent.com/43250699/142926985-dfc8c2f9-c652-49f5-8f92-64a985a64f5e.jpg)

*Abbildung 1: Versorgungsanalyse, Einstellungen*

1. **Info** 
   > Über den Button finden Sie zu dieser Anleitung.
2. **Typ bestimmen**
   > Mit Klick auf den Button wechseln Sie zwischen Themendatensätzen (hier auch "Einrichtungen") und statistischen Regionaldaten.
3. **Thema/ Datensatz auswählen**
   > Wählen Sie das Thema/ den Datensatz aus, den Sie verrechnen möchten.
4. **Faktor F hinzufügen**
   > Bei Einrichtungsdatensätzen können Sie einen *Faktor (F)* angeben, der bestimmt, wie viele Einheiten der ausgewählten Einrichtung für den Referenzdatensatz benötigt werden. Wollen Sie beispielsweise die Anzahl der öffentlichen Schulen gegen die Anzahl der Bevölkerung unter 18 Jahren rechnen und geben einen Faktor von 0,001 an, würde das bedeuten, dass eine Schule pro 1000 Mitglieder der Referenzgruppe benötigt wird. Ist ein *Faktor (F)* angegeben, werden die Spalten "Kapazität" und "Bedarf" in der Berechnungstabelle mit angegeben.
5. **Parameter auswählen** 
   > Manche Einrichtungsdatensätze haben andere Parameter, als nur ihre Anzahl in den ausgewählten Gebieten. So kann man bei öffentlichen Schulen beispielsweise den Datensatz "Schülerzahl" abfragen oder bei Krankenhäusern die Anzahl der stationären Plätze. Nicht jeder Einrichtungsdatensatz bietet zusätzliche Parameter.
7. **Auswahl vertauschen**
   > Mit einem Klick auf diesen Button können Sie Ihre Auswahl von Feld (1) und (2) vertauschen.
8. **Die gesamte Auswahl zurücksetzen**
9. **Berechnen**

![Abbildung 2: Versorgungsanalyse, Ergebnisse](https://user-images.githubusercontent.com/43250699/157009202-4cfeb5ff-e519-4305-ba4f-4ecde4f60bd0.png)

*Abbildung 2: Versorgungsanalyse, Ergebnisse*

1. **Pagination**
   > Die [Pagination](./pagination.md) verwaltet alle von Ihnen erstellen Datensätze und bietet bestimmte standardisierte Funktionen wie Downloads und ähnliches an. Sie finden mehr Informationen dazu [hier](./pagination.md).
2. **Daten als Chart visualisieren**
   > Die Daten werden zum [Chartgenerator](./chartgenerator.md) geladen und dort als Graphen visualisiert.
3. **Auf der Karte visualisieren**  
   > Die Daten werden mit Hilfe der [Kartenvisualisierung](./kartenvisualisierung.md) auf der Karte visualisiert und je nach Wert in unterschiedlichen Farben dargestellt.
4. **Tabellenspalte für erweiterte Funktionen auswählen**
   > Hier können Sie Tabellenspalten auswählen die für die erweiterten Funktionen "Als Chart visualisieren" (3) und "Auf der Karte visualisieren" (4) herangezogen werden soll.
   
5. **Jahr auswählen**
   > Hier können Sie das Jahr auswählen, für das die entsprechenden Daten geladen worden sind.
6. **Ergebnistabelle**  
      - **Gebiet:** Die ausgewählten Gebiete, für die die Ergebnisse berechnet wurden. Hier finden sich auch die Indikatoren für die Zeilen "Gesamt" und "Durchschnitt".
      - **Auswahlfeld (1):**  
         Der Wert für den in Auswahlfeld (1) gewählten Datensatz.
      - **Auswahlfeld (2):**  
         Der Wert für den in Auswahlfeld (2) gewählten Datensatz.
      - **Verhältnis:**  
         Hier wurde der Wert des Auswahlfeldes (1) durch den Wert des Auswahlfeldes (2) geteilt.
      - **Bedarfsdeckung:**  
         Die Versorgungsabdeckung in Prozent, d.h. das Verhältnis zwischen der aus Auswahlfeld (1) ermittelten Kapazität und Auswahlfeld (2) im Gebiet. Wurde kein Faktor F ausgewählt, zeigt die Spalte das direkte Verhältnis beider Felder in Prozent an.
      - **6.1 Pagination der Ergebnistabelle**
      
         Wenn in Ihrer Ergebnistabelle mehr als 10 Ergebnisse angezeigt werden, können Sie hier entsprechend die Daten durchschalten.
### Vorlagen
![Abbildung 1: Vorlagen](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/Vorlagen1.png?raw=true)

*Abbildung 1: Vorlagen*

Über den Dienst **Vorlagen** können Vorlagen zu verschieden Themenkomplexen und Arbeitsfeldern geladen werden. Diese können Fachdatenthemen, aktive Werkzeuge und eine Gebietsauswahl beinhalten. Die verfügbaren Vorlagen und ihr Inhalt werden von den Fachbehörden in Koordination mit dem CoSI-Betriebsteam gepflegt.

   > Zu den Vorlagen gelingen sie die Gebietsauswahl. Wenn das entsprechende Gebiet ausgewählt ist, finden Sie unter Dienste, die Option Vorlagen. Hier können Sie nun alle weiteren Optionen für die Vorlagen auswählen.

1. **Liste aller Vorlagen (zum Aufklappen)**
   > - Bildunsgeinrichtungen in Hamburg
   > - Bildungseinrichtungen in Bergedorf
   > - Erhaltungsmanagement Spielplätze WICHTIG
   > - Sozialraumprofil

2. **Inhaltsübersicht einer Vorlage**
   > - Titel
   > - Stand (Datum)
   > - Beschreibung
   > - Fachdatenthemen
   > - Aktiver Bezugsrahmen (Verwaltungsebene)
   > - Ausgewählte Gebiete
3. **optionale Gebietsauswahl**
   > Wenn kein Bezugrahmen/Gebiete definiert sind, können diese händisch im Vorfeld oder nach dem Laden ausgewählt werden. Die Inhalte werden dann für die aktive Gebietsauswahl geladen.
4. **Vorlage laden**
   > Die ausgewählte Vorlage laden.

![Abbildung 1: Vorlagen](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/Vorlagen2.png?raw=true)
## Wohnungsbauquartiere anlegen 

Durch das Erstellen eines Wohnbauquartiers können sie Wohnungsbauszenarien durchspielen. Die erstellten Wohnungsbauquartiere stehen Ihnen für weitere Analysefunktionen zur Verfügung. Die Szenarien können exportiert und gespeichert werden.

Sobald sie über "Simulation" "Wohnungsquartiere anlegen" auswählen, öffnet sich ein Fenster, in dessen oberem Bereich Sie den Szenario Manager finden (s. Abbidlung "Szenario Manager").

![Abbildung: 2: Wohnungsbauquartiere anlegen](https://github.com/AlexandraKanapki/cosi/blob/COSI-handbuch/cosi/manuals/wohnquatier1.png?raw=true)
![Abbildung: 1: Wohnungsbauquartiere anlegen](https://user-images.githubusercontent.com/43250699/143025884-f86a5897-3757-4b35-9d6d-1e4969d8175d.png)  
*Abbildung 1: Wohnungsbauquartiere anlegen*

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
