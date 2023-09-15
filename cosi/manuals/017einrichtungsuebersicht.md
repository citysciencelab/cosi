### Einrichtungsübersicht
   > Um zur Einrichtungsübersicht zu gelangen, muss zunächst ein beliebiger Stadtteil oder Bezirk ausgewählt werden. Als nächtes unter dem Bereich Themen die gewünschten Themen oder Fachdaten auswählen (z.B. Bildung und Wissenschaft). Im Dashboard unter Einrichtungsübersicht können Sie dann mit der Analyse Ihrer Einrichtung beginnen.
   
![Abbildung 1: Einrichtungsübersicht](/cosi/manuals/017a_einrichtungsuebersicht.PNG)
*Abb. a: Einrichtungsübersicht.*

1. **Detailansicht ein-/ausklappen**
   > Über den Pfeil können *alle* Attribute einer Einrichtung aufgeklappt werden. Die einzelnen Zeilen der Detailansicht können für den weiteren Export ausgewählt werden.
2. **Einrichtung auswählen**
   > Einrichtungen für den Export auswählen. Ausgewählte Einrichtungen werden in der Karte visuell hervorgehoben.
   *Wenn Sie die Einrichtung ausgewählt haben und unter **12** einen Fachdatensatz zur Auswertung ausgewählt haben, werden diese ebenfalls auf der Karte angezeigt. (s. Abbildung 2)*
   ![Abbildung 2: Fachdaten zur Auswertung auf der Karte](/cosi/manuals/017b_einrichtungsuebersicht.PNG)
*Abb. b: Weitere Fachdaten auf der Karte.*
3. **Einrichtung fokussieren**
   > Durch einen Klick auf das Symbol der Einrichtung zoomt die Karte zu den gewählten Einrichtungen. Die Einrichtungen werden dann in der Karte visuell hervorgehoben.
4. **Einrichtung ein-/ausblenden**
   > Einrichtungen können in der Karte ein- und ausgeschaltet werden indem auf das "Augen"-Symbol neben dem Richtungssymbol geklickt wird. Ausgeschaltete Einrichtungen werden auch bei allen anderen CoSI-Funktionen nicht berücksichtigt.
5. **Einrichtungsattribute**
   > - Einrichtungsname, Adresse, Layer, Typ und Thema werden dem Datensatz direkt entnommen
   > - Die Gebietszuweisung wird dynamisch für die aktuelle Verwaltungsebene generiert
   > - Symbole zeigen an, wenn eine Einrichtung simuliert oder modifiziert wurde.
6. **Einträge sortieren**
   > Alle Spalten können durch mehrmaliges Klicken auf die Kopfzeile neben dem Namen (z.B. Einrichtung) auf- und absteigend sortiert werden (alphabetisch oder nach Wert). Dabei kann für max. 2 Spalten erfolgen (z.B. 1. nach Typ und 2. nach numerischem Wert).
7. **Numerische Attribute**
   > Alle Attribute einer Einrichtung, die Zahlwerte abbilden (welche auch für die [Versorgungsanalyse](/cosi/manuals/006versorgungsanalyse.md) verwendet werden können werden in einer eigenen Spalte dargestellt. Die Farbe des Balkens richtet sich dabei nach dem Dezil des Wertes in der Liste aller Einrichtungen. Die Länge des Balkens ist proportional zum Höchstwert.
8. **Durchschnittliche Anbindung (in m)**
   > Die Anbindungsspalte zeigt die durchschnittliche Laufdistanz (in m) zu den jeweils nächstgelegenen Einrichtungen der ausgewählten Typen. Durch einen Klick auf den Wert kann die entsprechende Aufschlüsselung geöffnet werden (s. 12.).
9.  **Such- und Filterfunktionen**
      > Hier können Sie die Liste nach Themen filtern oder im Freitext die Einrichtungen durchsuchen.
10. **Einrichtungsdiagramme erstellen**
      > Erzeugt für alle verfügbaren Datenspalten ein Balkendiagramm, in dem die Werte der jeweiligen Einrichtungen und ihre Verteilung über die ausgewählten Gebiete.
      - **10.1 Layer zusammenziehen**
         > Wenn Sie diese Checkbox aktivieren, werden bei "Einrichtungsdiagramme erstellen"  Einrichtungen unterschiedlichen Typs zusammengezogen, wenn sie identische Attribute haben. *Beispiel: Wenn Sie Supermärkte und Drogerien ausgewählt haben, teilen sich beide das Attribut "Verkaufsfläche in m² und werden dementsprechend im Graphen zusammen dargestellt".*
      - **10.2 Graphenvisualisierung als PNG oder Zip**
         > Die Graphenvisualisierung kann als PNG oder Zip heruntergeladen werden. Die entsprechenden Buttons befinden sich unterhalb der Graphenvisualisierung.
11. **Tabelle exportieren**
      > Die ausgewählten Einträge als XLSX für Excel exportieren. Über das Auswahlfeld *Detailansicht exportieren* können alle bzw. in der Detailansicht ausgewählte Attribute eines Einrichtungstyps exportiert werden. Ist keine Auswahl getroffen, werden alle Einrichtungen exportiert.
12. **Standortbewertung: Themenauswahl**
      > Erlaubt die Auswahl beliebiger weiterer Fachdatenthemen für eine Standortbewertung. Bei Fachdaten, welche Punkte oder Flächen in der Karte repräsentieren (i.d.R. Einrichtungen) wird der Ort des Typs gefunden, welcher jeder Einrichtung in der Tabelle am nächsten ist und die Laufdistanz in Metern angegeben. Bei der Auswahl mehrerer Themen wird ein gewichteter Mittelwert gebildet (s. 8./13.). Andere Themen, z.B. Lärmkarte, Luftqualität, etc. für die Bewertung befinden sich im Aufbau.
13. **Standortbewertung: Gewichtung**
      > Erlaubt die Gewichtung der Themen für die Standortbewertung. Ein Thema mit Wert 0,5 wird somit nur halb so stark in den Mittelwert einbezogen, wie eines mit dem Wert 1.
14. **Standortvisualisierung für alle ausgewählten**
      > Erstellt ein Balkendiagramm mit der Aufschlüsselung für alle ausgewählten Einrichtungen. Wenn Sie mehr als zwei Fachdatensätze für die Auswertung (s. 12) ausgewählt haben, dann wird ein Radardiagramm generiert. Wenn Sie keine Einrichtungen ausgewählt haben, werden *alle* verfügbaren Einrichtungen in das Diagramm mit einbezogen.
15. **Histogramm**
      > Erzeugt ein Histogramm, dass die Verteilung der ausgewählten Einrichtungen abbildet.
