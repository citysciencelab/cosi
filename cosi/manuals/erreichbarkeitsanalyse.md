### Erreichbarkeitsanalyse
Die "Erreichbarkeitsanalyse" erreichen Sie über den Bereich "Analyse". 
Eine Erreichbarkeitsanalyse kann auf drei Arten durchgeführt werden:  
1. [Ab einem Referenzpunkt](#markdown-header-erreichbarkeit-ab-einem-Referenzpunkt)
2. Ab einer ausgewählten Einrichtung
3. [Im Planungsgebiet](#markdown-header-erreichbarkeit-im-gebiet) 
4. [Entlang einer Route](#markdown-header-erreichbarkeit-entlang-einer-route)

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

*Abb.: Erreichbarkeit ab einem Referenzpunkt.*
  
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
   > Die Ergebnisdarstellung auf der Karte wird ausgeblendet. Alle Fachdaten außerhalb der Isochronen werden wieder eingeblendet.
8. **Einwohnerabfrage**
   > (s. Einwohnerabfrage)
9.  **Legende & Isochronen**
   > Eine Legende wird eingeblendet. Sie wird dynamisch für die Anfrage generiert und zeigt drei gleichmäßig verteilte Entfernungswerte. Höchstwert ist der zuvor eingegebene Wert für die Entfernung. Die Isochronen (Polygone) in der Karte sind entsprechend der Legende eingefärbt. Sie zeigen das vom Referenzpunkt aus erreichbare Gebiet abhängig von den zuvor eingegebenen Parametern. Ist "Verkehrsfluss berücksichtigen" ausgewählt, wird das theoretische Maximum bei freier Fahrt als gestrichelte Linie angezeigt.
11. **Ergebnisverzeichnis**
   > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](./ergebnisverzeichnis.md) verwaltet werden.

*Für **Tageszeit**, **Verkehrsfluss berücksichtigen**, und **Von Flächenaußengrenzen berechnen** siehe im folgenden "Erreichbarkeit im Gebiet"*

#### Erreichbarkeit ab einer ausgewählten Einrichtung

Diese Analyse wird genauso hergestellt, wie ab einem Referenzpunkt. Nur wird hier statt einem Referenzpunkt auf der Karte eine Einrichtung auf der Karte angeklickt.

#### Erreichbarkeit im Gebiet
Zeigt die Abdeckung und Erreichbarkeit von einer zuvor festgelegten Einrichtungsart (im Beispiel Krankenhäuser) in dem festgelegten Einzugsbereich (Planungsgebiet). Der Einzugsbereich ist die Entfernung von der jeweiligen Einrichtung und kann in Zeit oder in Metern angegeben werden. Die Erreichbarkeit ist abhängig von dem festgelegten Verkehrsmittel.

![Abbildung 2: Erreichbarkeit ausgewählter Einrichtungen im Gebiet](https://user-images.githubusercontent.com/43250699/157067851-a2c165c4-894c-4b3f-80a9-4bc626516771.png)

*Abb.: Erreichbarkeit ausgewählter Einrichtungen im Gebiet.*

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
   > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](./ergebnisverzeichnis.md) verwaltet werden.

   ### Erreichbarkeit entlang einer Route
Wenn Sie im Routing-Tool eine Route erstellt haben, können Sie die Erreichbarkeit in einem bestimmten Umkreis um die Route herum berechnen lassen.
  
Das Modul kann ohne vorherige Gebietsauswahl verwendet werden.
![Abbildung 3: Erreichbarkeit entlang einer Route](https://user-images.githubusercontent.com/43250699/159470252-067117b3-b8a3-481d-b007-113e7a0477c8.png)

*Abb.: Erreichbarkeit entlang einer Route.*
1. **Auswahl des Modus**
   > Art der Einrichtungsanalyse. Ab einem Referenzpunkt, entlang einer Route oder Erreichbarkeit der gewählten Einrichtungen im Gebiet. Beachten Sie, dass Sie die Erreichbarkeit entlang einer Route nur auswählen können, wenn Sie im Vorfeld im Routing-Tool eine Route angelegt haben.
2. **Route auswählen**
   > Die im Routing-Tool aktive Route wird automatisch ausgewählt.
3. **Vorgegebene Felder**
   > Sie können bei der Erreichbarkeitsanalyse anhand einer Route kein Verkehrsmittel auswählen und somit auch nicht, ob die Entfernung in Metern oder Minuten berechnet werden soll. Es wird immer die Entfernung in Metern (Luftlinie) zur Berechnung herangezogen.
4. **Entfernung**
   > Entfernung in Metern angeben.
5. **Berechnen**
6. **Ergebnis ausblenden** 
7. **Legende und Isochronen**
   > Eine Legende wird eingeblendet. Sie wird dynamisch für die Anfrage generiert und zeigt drei gleichmäßig verteilte Entfernungswerte. Höchstwert ist der zuvor eingegebene Wert für die Entfernung. Die Isochronen (Polygone) in der Karte sind entsprechend der Legende eingefärbt. Sie zeigen das um die Route herum erreichbare Gebiet abhängig von den zuvor eingegebenen Parametern.
8. **Ergebnisverzeichnis**
   > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](./ergebnisverzeichnis.md) verwaltet werden.
