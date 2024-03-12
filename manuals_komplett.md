# **CoSI** 
## Cockpit Städtische Infrastrukturen
#### GIS + datenbasierte Analyse- und Planungstools in der Hamburger Stadtverwaltung
___
![CoSI Logo](C:\Users\dmz-user\Documents\GitHub\cosi\cosi\manuals\cosi_logo_jf.png)

___

### Nutzerhandbuch

**3. Phase**   
**Version 1.3.0**  

<div style="page-break-after: always;"></div>

___
### Projektmitarbeiter und -mitarbeiterinnen CoSI I bis III
___

- Alexandra Knapke, HafenCity Universität Hamburg
- Antje Widmayer, BA Hamburg-Nord
- Bertram Hillmann, a3rtgm GbR
- Christian Bähnisch, HiTec e.V.
- Daniel Schulz, HafenCity Universität Hamburg
- Dennis Rupnow, HiTec e.V.
- Feng Feng, LGV Hamburg
- Gabriela Gabbert, BA Hamburg-Nord
- Prof. Dr. Gesa Ziemer, HafenCity Universität Hamburg
- Hendrik Landgrebe, BA Hamburg-Nord
- Ingo Bruns, BA Hamburg-Nord
- Jannes Süpke, Senatskanzlei Hamburg, ITD
- Johanna Fischer, HafenCity Universität Hamburg
- Nicola Stradtmann, HafenCity Universität Hamburg
- Nihal Hegde, HafenCity Universität Hamburg
- Ogeigha Koroyin, HiTec e.V. 
- Paul Linnow, HafenCity Universität Hamburg
- Peter Duensing, Senatskanzlei Hamburg, ITD
- Sebastian Duden, LGV Hamburg
- Yuxiang Zhang, HafenCity Universität Hamburg  


### Stand
08/23

### Keywords
GIS, Dashboard, Data Driven Urban Planning, Social Infrastructure, Urban Data Platform, Data Visualization, Planning Support Tools, Demand Driven Decision Making  

<div style="page-break-after: always;"></div>

___
## Zusammenfassung
___

Bei der Planung städtischer und sozialer Infrastruktur sind Entscheidungsprozesse in der öffentlichen Verwaltung häufig durch langwierige Verfahren und eine fragmentierte Datengrundlage charakterisiert. D.h. Bedarfe werden teilweise  spät erkannt, oder die Konkretisierung der Planung verzögert sich durch das aufwendige Beschaffen von strukturierten Informationen.\
Das vorliegende Handbuch beschreibt das *Cockpit Städtische Infrastrukturen* für Hamburg als digitales Analyse- und Planungswerkzeug, welches mithilfe eines leicht zugänglichen User-Interface statistische und georeferenzierte Daten bündelt, visualisiert und integriert, um Planungsbedarfe zu identifizieren und Planungsprozesse zu beschleunigen.  
  
Dazu wurden die durch die *Urban Data Platform* der Stadt Hamburg aufgebauten Datenbankstrukturen und die Funktionalität des Masterportals genutzt, um eine kartenbasierte Webapplikation zu etablieren, welche den Quartiersplanenden der Stadt eine Reihe von Analysefunktionen zur Verfügung stellt, um auf der Verwaltungsebene der statistischen Gebiete soziodemographische Zusammenhänge zu identifizieren, Trends zu erkennen sowie Verhältnisse zwischen dem existierenden Infrastrukturangebot und den relevanten Zielgruppen zu ermitteln. Das Werkzeug soll im Folgenden helfen, Standorte und Potentiale für die Entwicklung von Infrastruktur zu finden. Die Ergebnisse dieser Analysen können direkt aus CoSI heraus visualisiert und als Entscheidungs- und Diskussionsgrundlage verwendet werden. Der Workflow folgt dabei einer dreistufigen Logik von der *Visualisierung* von Daten, über die *Analyse*, also der kontextuellen Verknüpfung von Information, bis zur *Simulation* von Maßnahmen und Ableitung ihrer  Auswirkungen.  
  
Um die technischen und inhaltlichen Anforderungen des Initialisierungs-Projekts aufzustellen, wurden im Vorfeld ab Sommer 2018 eine Reihe von Stakeholder- und Userstory-Workshops mit den Mitgliedern der Hamburger Verwaltung auf verschiedenen Ebenen durchgeführt. 

CoSI wurde dann von Juni 2019 bis September 2023 in den Projekten CoSI I bis III in einem agilen Verfahren, basierend auf der SCRUM-Methode, durch ein interdisziplinäres Team der HCU Hamburg und des LGV Hamburg entwickelt. Nutzerinnen und Nutzer waren dabei von Beginn an über die AG CoSI einbezogen und konnten den jeweils neuesten Entwicklungsstand im Arbeitsalltag evaluieren, so dass aktuelle Anforderungen an Funktionen und Daten fortlaufend in die Planung der Sprints eingegangen sind. Ab Mitte 2020 wurde das Verfahren in den Produktivbetrieb überführt. Seitdem steht allen berechtigt interessierten Mitarbeiterinnen und Mitarbeitern innerhalb der FHH – im Sommer 2023 waren es über 1500 - eine fortlaufend aktualisierte Produktivversion von CoSI zur Verfügung. 

Datenbedarfe aus der AG CoSI und von den Nutzenden der Produktivversion werden fortlaufend erfasst und an den Urban Data Hub des LGV übergeben, Datenverantwortliche lokalisiert und die Datenbestände unter Berücksichtigung potenzieller Datenschutzrichtlinien öffentlich oder FHH-intern über die Urban Data Platform (UDP) zur Verfügung gestellt.
Es werden auch Integrationsmöglichkeiten für das Tool in die tägliche Arbeit von Behörden und Fachämtern eruiert. Die CoSI-Projekte haben diese Informationen gebündelt, in Workshops mit der AG CoSI und Anwendenden vertiefte Funktionskonzepte erarbeitet und diese in den Themenbereichen Visualisierung, Analyse und Simulation integriert. So wurde ein Planungs-, Kollaborations- und Kommunikationstool entwickelt, welches konzeptuell auf viele weitere Themenbereiche angewendet werden kann.

Diese Weiterentwicklung von CoSI und den zu Grunde liegenden Datenbeständen im Urban Data Portal in enger Zusammenarbeit mit den Nutzenden soll auch nach den Projekten CoSI I bis III fortgeführt werden. Dazu ist im Lebenslagenmanagement der BWFGB eine moderne fachliche Leitstelle geplant.
  
<div style="page-break-after: always;"></div>

___
## Inhalt
___
- CoSI: Cockpit Städtische Infrakstrukturen
  - [Datenmodell & -Infrastruktur](#-datenmodell-infrastruktur)
  - [Module](#module)
   - [Themen (Layer)](#themen-layer)
   - [Analyse] (#analyse)
      - [Einwohnerabfrage](#einwohnerabfrage)
      - [Erreichbarkeitsanalyse](#erreichbarkeitsanalyse)
         - [Erreichbarkeit ab einem Referenzpunkt](#erreichbarkeit-ab-einem-referenzpunkt)
         - [Erreichbarkeit im Gebiet](#erreichbarkeit-im-gebiet)
         - [Erreichbarkeit entlang einer Route](#erreichbarkeit-entlang-einer-route)
      - [Vergleichbare Gebiete ermitteln](#4vergleichbare-gebiete-ermitteln)
      - [Filter](#filter)
      - [Versorgungsanalyse](#versorgungsanalyse)
      - [DIPAS](#dipas)
      - [Graphenvisualisierung](#graphenvisualisierung)
    - [Simulation] (#simulation)
      - [Einrichtungen anlegen](#einrichtungen-anlegen)
      - [Einrichtungen bearbeiten](#einrichtungen-bearbeiten)
      - [Wohnungsbauquartiere anlegen](#wohnquartiere-anlegen)
    - [Dienste](#dienste)
      - [Geodaten Importieren](#geodaten-importieren)
      - [Sitzung Speichern/Laden](#sitzung-speichernladen)
      - [Vorlagen](#vorlagen)
    - Dashboard
      - [Statistische Datenübersicht](#statistische-datenuebersicht)
      - [Einrichtungsübersicht](#einrichtungsuebersicht)
    - [Gebietsauswahl](#gebietsauswahl)
    - [Kartenanalyse regionalstatistischer Daten](#kartenanalyse-regionalstatistischer-daten)
    - [Ergebnisverzeichnis](#ergebnisverzeichnis)
    - [Manuelle Flächenauswahl](#manuelleflaechenauswahl)
    - [Auswahlmanager](#auswahlmanager)
    - [Flächen stylen](#flaechen-stylen)
    - [Report Tool](#report-tool)

<div style="page-break-after: always;"></div>

___
## Datenmodell & -Infrastruktur
___
  
CoSI ermöglicht ganz ähnlich wie der FHH-Atlas auch die Anzeige verschiedener Fachdaten unterschiedlicher Behörden und Ämter in der Karte, wie z.B. dem digitalen Grünplan (BUKEA) oder den Öffentlichen Schulen (BSB).

![Vgl_FHH_Atlas](/cosi/manuals/001a_Vgl_FHH_Atlas.png)

*Abb.001a: Anzeige von Themen auf der Karte wie im FHH-Atlas.*

Als wesentliche Erweiterung können zudem regionalstatistische Daten des Statistikamts Nord für statistische Gebiete, Stadtteile, Bezirke oder ganz Hamburg angezeigt werden.

![stat_daten-anzeige](/cosi/manuals/001b_stat_daten-anzeige.png)

*Abb.001b: Anzeige statistischer Daten auf der Karte und im Dashboard.*

Die Daten werden aber nicht nur in Karte und Tabelle nebeneinander dargestellt, sondern können mit CoSIs Analysefunktionen analysiert und in Beziehung gesetzt werden, indem z.B. ein sozialräumliches Angebot wie Spielplätze, gemessen als Spielplatzfläche in Quadratmetern, mit dem Bedarf der Bevölkerung, gemessen als Anzahl der Kinder z.B. unter 6 Jahren, in der Versorgungsanalyse ausgewertet werden können.

![bsp-analysefunktionen](/cosi/manuals/001c_bsp-analysefunktionen.png)

*Abb.001c: Analysefunktionen, hier Versorgungsanalyse.*

Darüber hinaus erlaubt CoSI, in die Datensätze “einzugreifen”: sie zu filtern, zu durchsuchen oder für die Darstellung von Planungsszenarien im laufenden Programm zu verändern (s. Simulation).

### Regionalstatistische Daten
Die Daten des StaNord liegen für alle Verwaltungsebenen der FHH (statistische Gebieten, Stadtteile, Bezirke und die Gesamtstadt) vor. Sie umfassen je nach Ebene über 120 Indikatoren, welche sich in folgende Kategorien gliedern:  

   - Bevölkerung
   - Bevölkerung ab x Jahren
   - Bevölkerung unter x Jahren
   - Bevölkerung x bis x Jahren
   - Bevölkerung x bis unter 18 Jahren
   - Bevölkerung x bis über 18 Jahren
   - Bevölkerung Migrationshintergrund
   - Fläche
   - Haushalte
   - Sozialversicherungspflichtige
   - Arbeitslose
   - SGB II Leistungen
   - Grundsicherung im Alter
   - Wohnen
   - Wahlbeteiligung
   - Verkehr
   - Infrastruktur
   - Bevölkerungsbewegung

Diese Datensätze beinhalten Zeitreihen, welche (je nach Datensatz) von ca. 2012 an erfasst sind und jährlich erweitert werden.

*Hinweis: Aus datenschutzrechtlichen Gründen werden bereits vom Datenbereitsteller solche Datensätze herausgefiltert, welche bei sensiblen Daten auf einzelne Individuen zurückverfolgbar wären. Diese Datensätze sind mit "–" oder mit "Keine Daten" ausgewiesen.*

### Fachdaten
CoSI bietet ganz ähnlich wie der FHH-Atlas Fachdatensätze in einem Themenbaum an. Während der FHH-Atlas grundsätzlich alle auf der Urban Data Platform verfügbaren und innerhalb der FHH freigegebenen Datensätze anzeigt, wird für CoSI in Abstimmung mit der Nutzendengruppe AG CoSI eine Auwahl getroffen. Dies dient der Übersicht und ermöglicht den Test und ggf. die Anpassung der Analysefunktionen an die angebotenen Daten.

Die Fachdatensätze, welche derzeit in CoSI eingebunden sind oder noch eingebunden werden können, werden als Geodienste von unterschiedlichsten Dateneignern (dies sind vor allem Behörden und Bezirksämter, aber prinzipiell sind auch Vereine oder Privatunternehmen denkbar.) bereitgestellt und in CoSI, wie im FHH-Atlas, über die URL des jeweiligen Dienstes abgerufen. Viele der Datensätze in ihrer aufbereiteten Form sind aus den Verhandlungs- und Koordinationsprozessen des Urban Data Hub hervorgegangen, über den sich die Behörden und Datenhalter der FHH auf gemeinsame Standards und regelmäßige Veröffentlichungen verständigen.

### Prognosedaten
Die Prognosedaten enthalten die prognostizierte jährliche Bevölkerungsentwicklung in den Stadtteilen Hamburgs nach vier Altersgruppen und Geschlecht bis zum Jahr 2035. Stichtag ist jeweils der 31.12.

Aus Gründen der statistischen Geheimhaltung der zugrunde liegenden Ausgangsdaten werden die vier kleinsten Stadtteile Hamburgs nur in Kombination mit einem größeren angrenzenden Stadtteil ausgewiesen.

Die Einzeldaten sind jeweils auf volle fünf gerundet.
Die Daten werden auf unregelmäßiger Basis vom Statistikamt Nord herausgegeben.

### Analyse
Analysedaten sind all jene (als WFS, s. Geodienste) eingebundenen Datensätze, welche für die Verwendung mit den CoSI-Analyse- (und in Zukunft Simulations-) Werkzeugen konfiguriert wurden. D.h. jedes Objekt (Feature, z.B. Kita oder Grünfläche) ist dabei einzeln hinterlegt und kann mit seiner geografischen Position und Ausdehnung betrachtet werden.

### Darstellung
Darstellungsdaten sind auf Absprache mit den Fachplanerinnen und Fachplanern ausgewählte Datensätze aus dem FHH-Netz, welche durch das zugrundeliegende Geoportal (Masterportal) in der Karte visualisiert und mit einer Legende versehen werden. Per Klick kann der Datensatz für die jeweilige Koordinate aus dem Datensatz abgerufen werden. Im Gegensatz zu den Analysedaten liegen die Darstellungsdaten gegenwärtig nicht als einzelne Objekte, sondern als gekacheltes/gerastertes Bild vor (WMS, s. Geodienste).

### Geodienste
Alle in CoSI und dem FHH-Atlas dargestellten Daten werden von den Bereitstellern als Dienst vorgehalten. Der Dienst liefert über eine URL Datensätze der jeweiligen Datenbank in einem maschinenlesbaren Format. Über zusätzliche Parameter kann die Anfrage (Request) spezifiziert oder (z.B. auf einen geografischen Ausschnitt) eingegrenzt werden. 

### WMS
Ein WMS (Web Map Service) liefert Geodaten / Karten als Rasterbilder (PNG), welche zunächst einmal ohne Hintergrundinformation in der Karte angezeigt werden. Gleichzeitig können die Legende des Datensatzes oder Informationen zu einer bestimmten Koordinate über weitere Requests abgerufen werden.

### WFS
Der WFS (Web Feature Service) liefert im Gegensatz zum WMS keine fertige Kartenansicht, sondern ein rohes Datenobjekt, bei dem der Datensatz jedes geografischen Objekts (Punkt, Linie, Fläche, etc.) inkl. seiner Attribute (z.B. eine Schule mitsamt ihrem Schultyp, ihrer Schülerzahl, Mailadresse und Nachmittagsangebot) einzeln übermittelt. Die Visualisierung (das Styling) der Daten erfolgt dann anhand vorgegebener oder mitgelieferter Konfigurationen innerhalb der Applikation. Dies ist rechenintensiver für den Anwendenden und weniger kontrollierbar von Seiten des Datenbereitstellers, bietet jedoch die Möglichkeit mit den Objekten innerhalb des Portals direkt zu interagieren oder sie zu verändern.  

<div style="page-break-after: always;"></div>

___
## Module
___
### Überblick 
CoSI bietet verschiedene Module (nachfolgend oft auch als "Werkzeuge" oder "Tools" bezeichnet") an, die bestimmte Funktionen zur Erstellung, Verwaltung und Analyse von Daten bereitstellen. Nachfolgend finden Sie die Übersicht über alle im UI zur Verfügung stehenden Funktionen:

![Das CoSI Nutzer-Interface](/cosi/manuals/001d_user_interface.PNG)

*Abb.001d: Das CoSI User-Interface.*

1. **Themenbau/ Layer** (s. Themen)
2. **Analyse**
      1. [Manuelle Flächenauswahl für Fachdaten](/cosi/manuals/021manuelleflaechenauswahl)
      2. [Einwohnerabfrage](/cosi/manuals/002einwohnerabfrage)
      3. [Erreichbarkeitsanalyse](/cosi/manuals/003erreichbarkeitsanalyse)
      4. [Vergleichbare Gebiete ermitteln](/cosi/manuals/004vergleichbaregebieteermitteln)
      5. [Filter](/cosi/manuals/005filter)
      6. Strecke/ Fläche messen
      7. [Versorgungsanalyse](/cosi/manuals/006versorgungsanalyse)
      8. [DIPAS](/cosi/manuals/007dipas)
      9. [Datenvisualisierung](/cosi/manuals/008graphenvisualisierung)

3. **Simulation**
      1. [Einrichtungen anlegen](/cosi/manuals/009einrichtungenanlegen)
      2. [Einrichtungen bearbeiten](/cosi/manuals/010einrichtungenbearbeiten)
      2. [Wohnungsbauquartiere anlegen](/cosi/manuals/011wohnquartiereanlegen)

4. **Dienste**
      1. Zeichnen/ Schreiben
      2. Karte drucken
      3. Mousehover ein-/ ausschalten
      4. [Geodaten Importieren](/cosi/manuals/013geodatenimportieren)
      5. WMS hinzufügen
      6. [Sitzung speichern/laden](/cosi/manuals/014sitzungspeichern)
      7. [Vorlagen](/cosi/manuals/015vorlagen)

5. **Dashboard**
      1. [Statistische Datenübersicht](/cosi/manuals/016statistischedatenuebersicht)
      2. [Einrichtungsübersicht](/cosi/manuals/017einrichtungsuebersicht)
6. **[Gebiete auswählen](/cosi/manuals/018gebietsauswahl)**
7. **Kontaktformular**
8. **Legende** (s. Legende)
9. **Suchleiste**
10. **Werkzeugfenster**
   > Aktive Werkzeuge werden in verschiebbaren Fenstern angezeigt.
11. **Hereinzoomen**
12. **Herauszoomen**
13. **Vollbildansicht aktivieren/ deaktivieren**
14. **Zurück zur Startansicht**
15. **[Kartenanalyse regionalstatistischer Daten](/cosi/manuals/019kartenvisualisierung)**
16. **Tooltip** (sog. Mousehover)
   > Zeigt das Gebiet und andere Elemente wie Tooltipps unter dem Mauszeiger an. Kann unter "Dienste" via "Mousehover ein-/ausschalten" deaktiviert werden.
18. **Ausgewählte Gebiete**
   > Ausgewählte Gebiete werden dargestellt mit einer blauen Umrandung.
19. **Sidebar**
   > Das Dashboard und der Filter werden in einer Sidebar angezeigt. Die Sidebar kann in ihrer Breite angepasst werden. (s. Dashboard)

<div style="page-break-after: always;"></div>

### Themen (Layer)
___
Layer können aus dem Reiter "Themen" jederzeit zugeschaltet oder ausgeschaltet werden. Die Themen sind unter dem Reiter Fachdaten sortiert. Beim Zuschalten sollte mit bedacht werden, dass sich Ladezeiten entsprechend verlängern können. Verzögerungen können vorkommen, wenn zu Beginn kein Planungsgebiet festgelegt wurde. Dann müssen die Daten für das gesamte Hamburger Gebiet geladen werden. 

Der Themenbaum ist gegliedert in Hintergrundkarten, einen Katalog an Fachdaten und die aktuelle Auswahl an Kartenebenen.

![Der Themenbaum](001e_Themenbaum.PNG)

*Abb.001e: Der Themenbaum.*

Öffnen Sie mit dem Plus die Übersicht der Themenkategorie oder minimieren sie die Ansicht wieder mit dem Minus.

1. **Hintergrundkarten**
   > Layer wie "Stadtkarte Hamburg", die als Standard automatisch aktiv sind, können auch deaktiviert werden. Die Hintergrundkarten orientieren sich am FHH Portal. Achtung beim An- und Ausschalten der Karten. Kartenlayer können andere Layer überlagern. Ihre Anzeige ist daher abhängig von der Reihenfolge der Aktivierung. Die Anordnung kann in "Ausgewählten Themen" noch nachträglich verändert und angepasst werden.
2. **Fachdaten**  
	 - **Analyse/Simulation**
      > Die aufbereiteten Layer für CoSI-spezifische Werkzeuge (bereitgestellt als WFS, s. Glossar). Die einzelnen Datenlayer sind in Kategorien eingeteilt, die regelmäßig angepasst bzw. aktualisiert werden.
	 - **Darstellung**
      > Daten zur reinen "Anzeige" in der Karte, v.a. entnommen aus dem FHH Atlas (bereitgestellt als WMS).
3. **Ausgewählte Themen**  
   > Siehe nachfolgende Abbildung.
4. **Hilfsbutton**
   > Ruft diese Anleitung auf.
5. **Kartenhintergrund**
   > Hier können Sie für den Kartenhintergrund grau oder weiß auswählen.
6. **Themenbaum fixieren/ lösen**
   > Diese Funktion fixiert den Themenbaum, so dass er auch bei Interaktionen mit der Karte angezeigt bleibt.
   
   **Ausgewählte Themen**  
      ![Abbildung 3: Ausgewählte Themen](001f_ausgewaehltethemen.PNG)  
      *Abb.001f: Ausgewählte Themen.*  
      - **3.1 Informationen und Legenden**
      - **3.2 Einstellungen**  
         Über das Zahnrad öffnen sich Einstellungen für Transparenz und Ebene verschieben.
      - **3.3 Transparenz**  
         Die Transparenz lässt sich über Plus in Prozent erhöhen und über Minus verringern.
      - **3.4 Ebene nach oben/unten**  
         Über das Pfeilmenü kann die Ebene der Layer verschoben werden.

Die Themen enthalten Informationen, die symbolisch oder durch Flächen auf der Karte dargestellt werden. In der nachfolgenden Abbildung zum Beispiel stellen die grün/blauen Punkte und Icons die vorhandenen Sportstätten im Gebiet dar. Die gelben und grünen Flächen sind aus dem Verzeichnis öffentlicher Grünanlagen. Nummerierte Punkte zeigen die Anzahl der an diesem Ort vorhandenen Einrichtungen an, wenn sich Punkte überschneiden.
Eine Legende zu den aktiven Themen kann durch einen Klick auf den Reiter "Legende" eingeblendet werden. Unabhängig davon können über den Infobutton rechts neben dem Layer weitere Informationen zu dem jeweiligen Thema aufgerufen werden. Es werden folgende Informationen bereitgestellt: Kurzbeschreibung des Themas, Datenstand und Legende. Auch befinden sich hinter dem Info-Button die Links zu Downloadquellen und eine WFS - bzw. WMF -Adresse.
Ein Klick auf ein Objekt auf der Karte öffnet eine Infotafel für die aktuelle Auswahl (Sportstätte, Grünanlage, etc.). Auf der Infotafel werden Informationen über das Objekt angezeigt. Datenschutzrelevante (personenbezogene) Daten werden nicht angezeigt.

![Abbildung 4: Manuelle Flächenauswahl](001g_bspkartenansicht.PNG)

*Abb.001g: Beispiel für Kartenansicht.*

<div style="page-break-after: always;"></div>

___
# **CoSI** 
## Cockpit Städtische Infrastrukturen
#### GIS + datenbasierte Analyse- und Planungstools in der Hamburger Stadtverwaltung
___
![CoSI Logo](../cosi/assets/cosi_logo_jf.png)

___

### Nutzerhandbuch

**3. Phase**   
**Version 1.3.0**  

<div style="page-break-after: always;"></div>

___
### Projektmitarbeiter und -mitarbeiterinnen CoSI I bis III
___

- Alexandra Knapke, HafenCity Universität Hamburg
- Antje Widmayer, BA Hamburg-Nord
- Bertram Hillmann, a3rtgm GbR
- Christian Bähnisch, HiTec e.V.
- Daniel Schulz, HafenCity Universität Hamburg
- Dennis Rupnow, HiTec e.V.
- Feng Feng, LGV Hamburg
- Gabriela Gabbert, BA Hamburg-Nord
- Prof. Dr. Gesa Ziemer, HafenCity Universität Hamburg
- Hendrik Landgrebe, BA Hamburg-Nord
- Ingo Bruns, BA Hamburg-Nord
- Jannes Süpke, Senatskanzlei Hamburg, ITD
- Johanna Fischer, HafenCity Universität Hamburg
- Martin Barner, HafenCity Universität Hamburg
- Nicola Stradtmann, HafenCity Universität Hamburg
- Nihal Hegde, HafenCity Universität Hamburg
- Ogeigha Koroyin, HiTec e.V. 
- Paul Linnow, HafenCity Universität Hamburg
- Peter Duensing, Senatskanzlei Hamburg, ITD
- Sebastian Duden, LGV Hamburg
- Yuxiang Zhang, HafenCity Universität Hamburg  


### Stand
08/23

### Keywords
GIS, Dashboard, Data Driven Urban Planning, Social Infrastructure, Urban Data Platform, Data Visualization, Planning Support Tools, Demand Driven Decision Making  

<div style="page-break-after: always;"></div>

___
## Zusammenfassung
___

Bei der Planung städtischer und sozialer Infrastruktur sind Entscheidungsprozesse in der öffentlichen Verwaltung häufig durch langwierige Verfahren und eine fragmentierte Datengrundlage charakterisiert. D.h. Bedarfe werden teilweise  spät erkannt, oder die Konkretisierung der Planung verzögert sich durch das aufwendige Beschaffen von strukturierten Informationen.\
Das vorliegende Handbuch beschreibt das *Cockpit Städtische Infrastrukturen* für Hamburg als digitales Analyse- und Planungswerkzeug, welches mithilfe eines leicht zugänglichen User-Interface statistische und georeferenzierte Daten bündelt, visualisiert und integriert, um Planungsbedarfe zu identifizieren und Planungsprozesse zu beschleunigen.  
  

Dazu wurden die durch die *Urban Data Platform* der Stadt Hamburg aufgebauten Datenbankstrukturen und die Funktionalität des Masterportals genutzt, um eine kartenbasierte Webapplikation zu etablieren, welche den Quartiersplanenden der Stadt eine Reihe von Analysefunktionen zur Verfügung stellt, um auf der Verwaltungsebene der statistischen Gebiete soziodemographische Zusammenhänge zu identifizieren, Trends zu erkennen sowie Verhältnisse zwischen dem existierenden Infrastrukturangebot und den relevanten Zielgruppen zu ermitteln. Das Werkzeug soll im Folgenden helfen, Standorte und Potentiale für die Entwicklung von Infrastruktur zu finden. Die Ergebnisse dieser Analysen können direkt aus CoSI heraus visualisiert und als Entscheidungs- und Diskussionsgrundlage verwendet werden. Der Workflow folgt dabei einer dreistufigen Logik von der *Visualisierung* von Daten, über die *Analyse*, also der kontextuellen Verknüpfung von Information, bis zur *Simulation* von Maßnahmen und Ableitung ihrer  Auswirkungen.  

  
Um die technischen und inhaltlichen Anforderungen des Initialisierungs-Projekts aufzustellen, wurden im Vorfeld ab Sommer 2018 eine Reihe von Stakeholder- und Userstory-Workshops mit den Mitgliedern der Hamburger Verwaltung auf verschiedenen Ebenen durchgeführt. 

CoSI wurde dann von Juni 2019 bis September 2023 in den Projekten CoSI I bis III in einem agilen Verfahren, basierend auf der SCRUM-Methode, durch ein interdisziplinäres Team der HCU Hamburg und des LGV Hamburg entwickelt. Nutzerinnen und Nutzer waren dabei von Beginn an über die AG CoSI einbezogen und konnten den jeweils neuesten Entwicklungsstand im Arbeitsalltag evaluieren, so dass aktuelle Anforderungen an Funktionen und Daten fortlaufend in die Planung der Sprints eingegangen sind. Ab Mitte 2020 wurde das Verfahren in den Produktivbetrieb überführt. Seitdem steht allen berechtigt interessierten Mitarbeiterinnen und Mitarbeitern innerhalb der FHH – im Sommer 2023 waren es über 1500 - eine fortlaufend aktualisierte Produktivversion von CoSI zur Verfügung. 


Datenbedarfe aus der AG CoSI und von den Nutzenden der Produktivversion werden fortlaufend erfasst und an den Urban Data Hub des LGV übergeben, Datenverantwortliche lokalisiert und die Datenbestände unter Berücksichtigung potenzieller Datenschutzrichtlinien öffentlich oder FHH-intern über die Urban Data Platform (UDP) zur Verfügung gestellt.
Es werden auch Integrationsmöglichkeiten für das Tool in die tägliche Arbeit von Behörden und Fachämtern eruiert. Die CoSI-Projekte haben diese Informationen gebündelt, in Workshops mit der AG CoSI und Anwendenden vertiefte Funktionskonzepte erarbeitet und diese in den Themenbereichen Visualisierung, Analyse und Simulation integriert. So wurde ein Planungs-, Kollaborations- und Kommunikationstool entwickelt, welches konzeptuell auf viele weitere Themenbereiche angewendet werden kann.


Diese Weiterentwicklung von CoSI und den zu Grunde liegenden Datenbeständen im Urban Data Portal in enger Zusammenarbeit mit den Nutzenden soll auch nach den Projekten CoSI I bis III fortgeführt werden. Dazu ist im Lebenslagenmanagement der BWFGB eine moderne fachliche Leitstelle geplant.
  
<div style="page-break-after: always;"></div>

___
## Inhalt
___
- CoSI: Cockpit Städtische Infrakstrukturen
  - [Datenmodell & -Infrastruktur](#markdown-header-datenmodell---infrastruktur)
  - [Module](#markdown-header-module)
   - [Themen (Layer)](#markdown-header-themen-layer)
   - [Analyse](#markdown-header-analyse)
      - [Manuelle Flächenauswahl für Fachdaten](#markdown-header-manuelle-flächenauswahl-für-fachdaten)
      - [Einwohnerabfrage](#markdown-header-einwohnerabfrage)
      - [Erreichbarkeitsanalyse](#markdown-header-erreichbarkeitsanalyse)
         - [Erreichbarkeit ab einem Referenzpunkt](#markdown-header-erreichbarkeit-ab-einem-referenzpunkt)
         - [Erreichbarkeit im Gebiet](#markdown-header-erreichbarkeit-im-gebiet)
         - [Erreichbarkeit entlang einer Route](#markdown-header-erreichbarkeit-entlang-einer-route)
      - [Vergleichbare Gebiete ermitteln](#markdown-header-vergleichbare-gebiete-ermitteln)
      - [Filter](#markdown-header-filter)
      - [Versorgungsanalyse](#markdown-header-versorgungsanalyse)
      - [DIPAS](#markdown-header-dipas)
      - [Graphenvisualisierung](#markdown-header-graphenvisualisierung)
    - [Simulation](#markdown-header-simulation)
      - [Einrichtungen anlegen](#markdown-header-einrichtungen-anlegen)
      - [Einrichtungen bearbeiten](#markdown-header-einrichtungen-bearbeiten)
      - [Wohnungsbauquartiere anlegen](#markdown-header-wohnungsbauquartiere-anlegen)
    - [Dienste](#markdown-header-dienste)
      - [Geodaten Importieren](#markdown-header-geodaten-importieren)
      - [Sitzung Speichern/Laden](#markdown-header-sitzung-speichernladen)
      - [Vorlagen](#markdown-header-vorlagen)
    - [Dashboard](#markdown-header-dashboard)
      - [Statistische Datenübersicht](#markdown-header-statistische-datenübersicht)
         - [Burgermenü](#markdown-header-burgermenü)
      - [Einrichtungsübersicht](#markdown-header-einrichtungsübersicht)
    - [Gebietsauswahl](##markdown-header-gebietsauswahl)
    - [Kartenanalyse regionalstatistischer Daten](#markdown-header-kartenanalyse-regionalstatistischer-daten)
    - [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis)
    - [Routing](#markdown-header-ergebnisverzeichnis)

<div style="page-break-after: always;"></div>

___
## Datenmodell & -Infrastruktur
___
  
CoSI ermöglicht ganz ähnlich wie der FHH-Atlas auch die Anzeige verschiedener Fachdaten unterschiedlicher Behörden und Ämter in der Karte, wie z.B. dem digitalen Grünplan (BUKEA) oder den Öffentlichen Schulen (BSB).

![Vgl_FHH_Atlas](../cosi/manuals/Vgl_FHH_Atlas.png)

*Abb.: Anzeige von Themen auf der Karte wie im FHH-Atlas.*

Als wesentliche Erweiterung können zudem regionalstatistische Daten des Statistikamts Nord für statistische Gebiete, Stadtteile, Bezirke oder ganz Hamburg angezeigt werden.

![stat_daten-anzeige](../cosi/manuals/stat_daten-anzeige.png)

*Abb.: Anzeige statistischer Daten auf der Karte und im Dashboard.*

Die Daten werden aber nicht nur in Karte und Tabelle nebeneinander dargestellt, sondern können mit CoSIs Analysefunktionen analysiert und in Beziehung gesetzt werden, indem z.B. ein sozialräumliches Angebot wie Spielplätze, gemessen als Spielplatzfläche in Quadratmetern, mit dem Bedarf der Bevölkerung, gemessen als Anzahl der Kinder z.B. unter 6 Jahren, in der Versorgungsanalyse ausgewertet werden können.

![bsp-analysefunktionen](../cosi/manuals/bsp-analysefunktionen.png)

*Abb.: Analysefunktionen, hier Versorgungsanalyse.*


Darüber hinaus erlaubt CoSI, in die Datensätze “einzugreifen”: sie zu filtern, zu durchsuchen oder für die Darstellung von Planungsszenarien im laufenden Programm zu verändern (s. Simulation).

### Regionalstatistische Daten
Die Daten des StaNord liegen für alle Verwaltungsebenen der FHH (statistische Gebieten, Stadtteile, Bezirke und die Gesamtstadt) vor. Sie umfassen je nach Ebene über 120 Indikatoren, welche sich in folgende Kategorien gliedern:  

   - Bevölkerung
   - Bevölkerung ab x Jahren
   - Bevölkerung unter x Jahren
   - Bevölkerung x bis x Jahren
   - Bevölkerung x bis unter 18 Jahren
   - Bevölkerung x bis über 18 Jahren
   - Bevölkerung Migrationshintergrund
   - Fläche
   - Haushalte
   - Sozialversicherungspflichtige
   - Arbeitslose
   - SGB II Leistungen
   - Grundsicherung im Alter
   - Wohnen
   - Wahlbeteiligung
   - Verkehr
   - Infrastruktur
   - Bevölkerungsbewegung


Diese Datensätze beinhalten Zeitreihen, welche (je nach Datensatz) von ca. 2012 an erfasst sind und jährlich erweitert werden.

> *Hinweis: Aus datenschutzrechtlichen Gründen werden bereits vom Datenbereitsteller solche Datensätze herausgefiltert, welche bei sensiblen Daten auf einzelne Individuen zurückverfolgbar wären. Diese Datensätze sind mit "–" oder mit "Keine Daten" ausgewiesen.*

### Fachdaten
CoSI bietet ganz ähnlich wie der FHH-Atlas Fachdatensätze in einem Themenbaum an. Während der FHH-Atlas grundsätzlich alle auf der Urban Data Platform verfügbaren und innerhalb der FHH freigegebenen Datensätze anzeigt, wird für CoSI in Abstimmung mit der Nutzendengruppe AG CoSI eine Auwahl getroffen. Dies dient der Übersicht und ermöglicht den Test und ggf. die Anpassung der Analysefunktionen an die angebotenen Daten.


Die Fachdatensätze, welche derzeit in CoSI eingebunden sind oder noch eingebunden werden können, werden als Geodienste von unterschiedlichsten Dateneignern (dies sind vor allem Behörden und Bezirksämter, aber prinzipiell sind auch Vereine oder Privatunternehmen denkbar.) bereitgestellt und in CoSI, wie im FHH-Atlas, über die URL des jeweiligen Dienstes abgerufen. Viele der Datensätze in ihrer aufbereiteten Form sind aus den Verhandlungs- und Koordinationsprozessen des Urban Data Hub hervorgegangen, über den sich die Behörden und Datenhalter der FHH auf gemeinsame Standards und regelmäßige Veröffentlichungen verständigen.


### Prognosedaten
Die Prognosedaten enthalten die prognostizierte jährliche Bevölkerungsentwicklung in den Stadtteilen Hamburgs nach vier Altersgruppen und Geschlecht bis zum Jahr 2035. Stichtag ist jeweils der 31.12.

Aus Gründen der statistischen Geheimhaltung der zugrunde liegenden Ausgangsdaten werden die vier kleinsten Stadtteile Hamburgs nur in Kombination mit einem größeren angrenzenden Stadtteil ausgewiesen.

Die Einzeldaten sind jeweils auf volle fünf gerundet.

Die Daten werden auf unregelmäßiger Basis vom Statistikamt Nord herausgegeben.

### Analyse
Analysedaten sind all jene (als WFS, s. Geodienste) eingebundenen Datensätze, welche für die Verwendung mit den CoSI-Analyse- (und in Zukunft Simulations-) Werkzeugen konfiguriert wurden. D.h. jedes Objekt (Feature, z.B. Kita oder Grünfläche) ist dabei einzeln hinterlegt und kann mit seiner geografischen Position und Ausdehnung betrachtet werden.

### Darstellung
Darstellungsdaten sind auf Absprache mit den Fachplanerinnen und Fachplanern ausgewählte Datensätze aus dem FHH-Netz, welche durch das zugrundeliegende Geoportal (Masterportal) in der Karte visualisiert und mit einer Legende versehen werden. Per Klick kann der Datensatz für die jeweilige Koordinate aus dem Datensatz abgerufen werden. Im Gegensatz zu den Analysedaten liegen die Darstellungsdaten gegenwärtig nicht als einzelne Objekte, sondern als gekacheltes/gerastertes Bild vor (WMS, s. Geodienste).

### Geodienste
Alle in CoSI und dem FHH-Atlas dargestellten Daten werden von den Bereitstellern als Dienst vorgehalten. Der Dienst liefert über eine URL Datensätze der jeweiligen Datenbank in einem maschinenlesbaren Format. Über zusätzliche Parameter kann die Anfrage (Request) spezifiziert oder (z.B. auf einen geografischen Ausschnitt) eingegrenzt werden. 

### WMS
Ein WMS (Web Map Service) liefert Geodaten / Karten als Rasterbilder (PNG), welche zunächst einmal ohne Hintergrundinformation in der Karte angezeigt werden. Gleichzeitig können die Legende des Datensatzes oder Informationen zu einer bestimmten Koordinate über weitere Requests abgerufen werden.

### WFS
Der WFS (Web Feature Service) liefert im Gegensatz zum WMS keine fertige Kartenansicht, sondern ein rohes Datenobjekt, bei dem der Datensatz jedes geografischen Objekts (Punkt, Linie, Fläche, etc.) inkl. seiner Attribute (z.B. eine Schule mitsamt ihrem Schultyp, ihrer Schülerzahl, Mailadresse und Nachmittagsangebot) einzeln übermittelt. Die Visualisierung (das Styling) der Daten erfolgt dann anhand vorgegebener oder mitgelieferter Konfigurationen innerhalb der Applikation. Dies ist rechenintensiver für den Anwendenden und weniger kontrollierbar von Seiten des Datenbereitstellers, bietet jedoch die Möglichkeit mit den Objekten innerhalb des Portals direkt zu interagieren oder sie zu verändern.  

<div style="page-break-after: always;"></div>

___
## Module
___
### Überblick 
CoSI bietet verschiedene Module (nachfolgend oft auch als "Werkzeuge" oder "Tools" bezeichnet") an, die bestimmte Funktionen zur Erstellung, Verwaltung und Analyse von Daten bereitstellen. Nachfolgend finden Sie die Übersicht über alle im UI zur Verfügung stehenden Funktionen:

![Abbildung 1: Das CoSI Nutzer-Interface](https://user-images.githubusercontent.com/43250699/142911085-50a9fe73-0171-47d0-b2f9-527593ae42ed.jpg)

*Abb.: Das CoSI User-Interface.*

1. **Themenbau/ Layer** (s. Themen)
2. **Analyse**
      1. [Manuelle Flächenauswahl für Fachdaten](#markdown-header-manuelle-flächenauswahl-für-fachdaten)
      2. [Einwohnerabfrage](#markdown-header-einwohnerabfrage)
      3. [Erreichbarkeitsanalyse](#markdown-header-erreichbarkeitsanalyse)
      4. [Vergleichbare Gebiete ermitteln](#markdown-header-vergleichbare-gebiete-ermitteln)
      5. [Filter](#markdown-header-filter)
      6. Strecke/ Fläche messen
      7. [Versorgungsanalyse](#markdown-header-versorgungsanalyse)
      8. [DIPAS](#markdown-header-dipas)
      9. [Datenvisualisierung](#markdown-header-datenvisualisierung)

3. **Simulation**
      1. [Einrichtungen anlegen](#markdown-header-einrichtungen-anlegen)
      2. [Einrichtungen bearbeiten](#markdown-header-einrichtungen-bearbeiten)
      2. [Wohnungsbauquartiere anlegen](#markdown-header-wohnungsbauquartiere-anlegen)

4. **Dienste**
      1. Zeichnen/ Schreiben
      2. Karte drucken
      3. Mousehover ein-/ ausschalten
      4. [Geodaten Importieren](#markdown-header-geodaten-importieren)
      5. WMS hinzufügen
      6. [Sitzung speichern/laden](#markdown-header-sitzung-speichern)
      7. [Vorlagen](#markdown-header-vorlagen)

5. **Dashboard**
      1. [Statistische Datenübersicht](#markdown-header-statistische-datenübersicht)
      2. [Einrichtungsübersicht](#markdown-header-einrichtungsübersicht)
6. **[Gebiete auswählen](#markdown-header-gebiete-auswählen)**
7. **Kontaktformular**
8. **Legende** (s. Legende)
9. **Suchleiste**
10. **Werkzeugfenster**
   	> Aktive Werkzeuge werden in verschiebbaren Fenstern angezeigt.
11. **Hereinzoomen**
12. **Herauszoomen**
13. **Vollbildansicht aktivieren/ deaktivieren**
14. **Zurück zur Startansicht**
15. **[Kartenanalyse regionalstatistischer Daten](#markdown-header-kartenanalyse-regionalstatistischer-daten)**
16. **Tooltip** (sog. Mousehover)
   	> Zeigt das Gebiet und andere Elemente wie Tooltipps unter dem Mauszeiger an. Kann unter "Dienste" via "Mousehover ein-/ausschalten" deaktiviert werden.
18. **Ausgewählte Gebiete**
   	> Ausgewählte Gebiete werden dargestellt mit einer blauen Umrandung.
19. **Sidebar**
   	> Das Dashboard und der Filter werden in einer Sidebar angezeigt. Die Sidebar kann in ihrer Breite angepasst werden. (s. Dashboard)

<div style="page-break-after: always;"></div>

### Themen (Layer)
___
Layer können aus dem Reiter "Themen" jederzeit zugeschaltet oder ausgeschaltet werden. Die Themen sind unter dem Reiter Fachdaten sortiert. Beim Zuschalten sollte mit bedacht werden, dass sich Ladezeiten entsprechend verlängern können. Verzögerungen können vorkommen, wenn zu Beginn kein Planungsgebiet festgelegt wurde. Dann müssen die Daten für das gesamte Hamburger Gebiet geladen werden. 

Der Themenbaum ist gegliedert in Hintergrundkarten, einen Katalog an Fachdaten und die aktuelle Auswahl an Kartenebenen.

![Abbildung 2: Der Themenbaum](https://user-images.githubusercontent.com/43250699/159332327-0b3301d1-4ae9-4b1f-9cb1-4fe733d51a54.png)

*Abb.: Der Themenbaum.*

Öffnen Sie mit dem Plus die Übersicht der Themenkategorie oder minimieren sie die Ansicht wieder mit dem Minus.

1. **Hintergrundkarten**
   > Layer wie "Stadtkarte Hamburg", die als Standard automatisch aktiv sind, können auch deaktiviert werden. Die Hintergrundkarten orientieren sich am FHH Portal. Achtung beim An- und Ausschalten der Karten. Kartenlayer können andere Layer überlagern. Ihre Anzeige ist daher abhängig von der Reihenfolge der Aktivierung. Die Anordnung kann in "Ausgewählten Themen" noch nachträglich verändert und angepasst werden.
2. **Fachdaten**  
	 - **Analyse/Simulation**
         > Die aufbereiteten Layer für CoSI-spezifische Werkzeuge (bereitgestellt als WFS, s. Glossar). Die einzelnen Datenlayer sind in Kategorien eingeteilt, die regelmäßig angepasst bzw. aktualisiert werden.
	 - **Darstellung**
      > Daten zur reinen "Anzeige" in der Karte, v.a. entnommen aus dem FHH Atlas (bereitgestellt als WMS).
3. **Ausgewählte Themen**  
   > Siehe nachfolgende Abbildung.
4. **Hilfsbutton**
   > Ruft diese Anleitung auf.
5. **Kartenhintergrund**
   > Hier können Sie für den Kartenhintergrund grau oder weiß auswählen.
6. **Themenbaum fixieren/ lösen**
   > Diese Funktion fixiert den Themenbaum, so dass er auch bei Interaktionen mit der Karte angezeigt bleibt.
   
   **Ausgewählte Themen**  
      ![Abbildung 3: Ausgewählte Themen](https://user-images.githubusercontent.com/43250699/142911886-03547719-aab0-4f80-a3e3-cfdca1267eb7.png)  
      *Abb.: Ausgewählte Themen.*  
      - **3.1 Informationen und Legenden**
      - **3.2 Einstellungen**  
         Über das Zahnrad öffnen sich Einstellungen für Transparenz und Ebene verschieben.
      - **3.3 Transparenz**  
         Die Transparenz lässt sich über Plus in Prozent erhöhen und über Minus verringern.
      - **3.4 Ebene nach oben/unten**  
         Über das Pfeilmenü kann die Ebene der Layer verschoben werden.

Die Themen enthalten Informationen, die symbolisch oder durch Flächen auf der Karte dargestellt werden. In der nachfolgenden Abbildung zum Beispiel stellen die blauen Punkte die vorhandenen Einrichtungen im Gebiet dar. Nummerierte Punkte zeigen die Anzahl der an diesem Ort vorhandenen Einrichtungen an.
Eine Legende zu den aktiven Themen kann durch einen Klick auf den Reiter "Legende" eingeblendet werden. Unabhängig davon können über den Infobutton rechts neben dem Layer weitere Informationen zu dem jeweiligen Thema aufgerufen werden. Es werden folgende Informationen bereitgestellt: Kurzbeschreibung des Themas, Datenstand und Legende. Auch befinden sich hinter dem Info-Button die Links zu Downloadquellen und eine WFS - bzw. WMF -Adresse.
Ein Klick auf ein Objekt auf der Karte öffnet eine Infotafel für die aktuelle Auswahl (Sportstätte, Kita, etc.). Auf der Infotafel werden Informationen über das Objekt angezeigt. Datenschutzrelevante (personenbezogene) Daten werden nicht angezeigt.

![Abbildung 4: Manuelle Flächenauswahl](https://user-images.githubusercontent.com/43250699/159277769-55018485-2d35-438f-8f5e-c215e53c367c.png)

*Abb.: Beispiel für Kartenansicht.*

<div style="page-break-after: always;"></div>

___
## Analyse
#### Werkzeuge des Analysemenüs
___
### Manuelle Flächenauswahl für Fachdaten
Mit Hilfe dieses Werkzeuges können Sie ein Polygon auf der Karte zeichnen, innerhalb dessen Fachdaten angezeigt werden. Einrichtungen oder andere Fachdatenmarker, die außerhalb dieses Polygons liegen, werden ausgeblendet.

![Screenshot_81](https://github.com/nihalh01/cosi/assets/140716054/5c047dc2-d686-4b55-8ab3-fa885cecebb8)

*Abb.: Manuelle Flächenauswahl*

1. **Polygon zeichnen**
   > Klicken Sie auf diesen Button, um ein neues Polygon auf der Karte zu zeichnen.
2. **Eingabe löschen**
   > Löscht die bestehende Flächenauswahl und zeigt alle Fachdaten wieder an.
3. **Einwohnerabfrage**
   > Für die aktuelle Flächenauswahl eine [Einwohnerabfrage](#markdown-header-einwohnerabfrage) durchführen.

<div style="page-break-after: always;"></div>

### Einwohnerabfrage
Grundsätzlich bietet diese Funktion die Möglichkeit an, durch Aufziehen eines Rechtecks oder Kreises bzw. durch Einzeichnen einer Fläche die adressgenaue Einwohneranzahl zu bestimmen. Dieses Werkzeug stammt ursprünglich aus dem Masterportal und wurde u.a. in dem Modul "Erreichbarkeitsanalyse" integriert.

- Beim direkten Aufruf unter dem Reiter "Analyse" muss das Gebiet, über das man die Abfrage durchführen möchte, händisch festgelegt werden (via Rechteck oder Kreis ziehen bzw. via Zeichnen einer Fläche). 
- Bei der Nutzung innerhalb des Kontexts der Erreichbarkeitsanalyse muss das Gebiet nicht händisch festgelegt werden, sondern es wird als Gebiet das errechnete Einzugsgebiet übernommen.

<div style="page-break-after: always;"></div>

### Erreichbarkeitsanalyse
Eine Erreichbarkeitsanalyse kann mit folgenden Modi durchgeführt werden:  
1. [Ab einem Referenzpunkt](#markdown-header-erreichbarkeit-ab-einem-Referenzpunkt)  
2. [Im Planungsgebiet](#markdown-header-erreichbarkeit-im-gebiet)
3. [Entlang einer Route](#markdown-headererreichbarkeit-entlang-einer-route)  

Der Modus der Analyse kann im Dropdown Menü ausgewählt werden.

**Wichtige Informationen:**
> Dieses Werkzeug wurde realisiert unter Verwendung von OpenRouteService, einem Dienst, der von der *Heidelberg Institute for Geoinformation Technology* entwickelt wird. Der verwendete Dienst wird vom *Bundesamt für Kartografie und Geodäsie (BKG)* bereitgestellt und betrieben.Die Verwendung ist gedeckt durch die Creative Commons Lizenz CC BY 4.0. 
Weitere Informationen finden Sie unter:  
https://heigit.org/de/ortsbasierte-dienste-und-navigation/  
https://openrouteservice.org/services/

> Die Vollständige Dokumentation des OpenRouteService inkl. aller Annahmen über Modalitätsprofile und Routenparameter finden Sie unter:
https://giscience.github.io/openrouteservice/documentation/Documentation.html

> Die Annahmen über einzelne Straßen und Wege können i.d.R. über die [OpenStreetMap](https://www.openstreetmap.org/#map=14/53.5492/9.9901) direkt ausgelesen oder in dringlichen Fällen beim BKG angefragt werden.

<div style="page-break-after: always;"></div>

#### Erreichbarkeit ab einem Referenzpunkt
Zeigt ein Gebiet an, welches von einem ausgewählten Punkt auf der Karte innerhalb einer festgelegten Entfernung erreichbar ist. Die Entfernung kann in Zeit oder in Metern angegeben werden. Die Erreichbarkeit wird abhängig vom Verkehrsmittel berechnet.  
  
Das Modul kann verwendet werden, ohne vorherige Gebietsauswahl.
  


![Abbildung 5: Erreichbarkeit ab einem Referenzpunkt](https://user-images.githubusercontent.com/43250699/157067677-5f5db4a7-498a-45b2-8c06-6f2ea5ed6cbf.png)

*Abbildung 5: Erreichbarkeit ab einem Referenzpunkt*
  
1. **Auswahl des Modus**
   > Art der Einrichtungsanalyse. Ab einem Referenzpunkt, entlang einer Route oder Erreichbarkeit der gewählten Einrichtungen im Gebiet.
2. **Referenzpunkt setzen**
   > Durch Klicken auf der Karte wird der Punkt gesetzt, von dem aus berechnet wird.
3. **Verkehrsmittel festlegen** 
   > Das Verkehrsmittel wird ausgewählt aus einer Liste. Folgende Verkehrsmittel stehen aktuell zur Verfügung: Auto, Rad, Gehen, Rollstuhl.
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
    > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis) verwaltet werden.

*Für **Tageszeit**, **Verkehrsfluss berücksichtigen**, und **Von Flächenaußengrenzen berechnen** siehe im folgenden "Erreichbarkeit im Gebiet"*

<div style="page-break-after: always;"></div>

#### Erreichbarkeit im Gebiet
Zeigt die Abdeckung und Erreichbarkeit von einer zuvor festgelegten Einrichtungsart (im Beispiel Krankenhäuser) in dem festgelegten Einzugsbereich (Planungsgebiet). Der Einzugsbereich ist die Entfernung von der jeweiligen Einrichtung und kann angegeben werden in Zeit oder in Metern. Die Erreichbarkeit ist abhängig von dem festgelegten Verkehrsmittel.

![Abbildung 6: Erreichbarkeit ausgewählter Einrichtungen im Gebiet](https://user-images.githubusercontent.com/43250699/157067851-a2c165c4-894c-4b3f-80a9-4bc626516771.png)

*Abbildung 6: Erreichbarkeit ausgewählter Einrichtungen im Gebiet*

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
    > Eine Legende wird eingeblendet. Sie wird dynamisch für die Anfrage generiert und zeigt drei gleichmäßig verteilte Entfernungswerte. Höchstwert ist der zuvor eingegebene Wert für die Entfernung. Die Isochronen (Polygone) in der Karte sind entsprechend der Legende eingefärbt. Sie zeigen die von den Einrichtungen aus erreichbaren Gebiete abhängig von den zuvor eingegebenen Parametern. Ist "Verkehrsfluss berücksichtigen" ausgewählt, wird das theoretische Maximum bei freier Fahrt als gestrichelte Linie angezeigt.
12. **Ergebnisverzeichnis**
    > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis) verwaltet werden.

<div style="page-break-after: always;"></div>

### Erreichbarkeit entlang einer Route
Wenn Sie im Routing-Tool eine Route erstellt haben, können Sie die Erreichbarkeit in einem bestimmten Umkreis um die Route herum berechnen lassen. 
  
Das Modul kann ohne vorherige Gebietsauswahl verwendet werden.

![Abbildung 7: Erreichbarkeit entlang einer Route](https://user-images.githubusercontent.com/43250699/159470252-067117b3-b8a3-481d-b007-113e7a0477c8.png)

*Abbildung 7: Erreichbarkeit entlang einer Route*
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
   > Eine Legende wird eingeblendet. Sie wird dynamisch für die Anfrage generiert und zeigt drei gleichmäßig verteilte Entfernungswerte. Höchstwert ist der zuvor eingegebene Wert für die Entfernung. Die Isochronen (Polygone) in der Karte sind entsprechend der Legende eingefärbt. Sie zeigen dasum die Route herum erreichbare Gebiet abhängig von den zuvor eingegebenen Parametern.
8. **Ergebnisverzeichnis**
   > Sie können mehrere Erreichbarkeitsanalysen erstellen, die über das sog. [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis) verwaltet werden.

<div style="page-break-after: always;"></div>

### Vergleichbare Gebiete ermitteln
Das Werkzeug erlaubt die Ermittlung aller Gebiete (Stadtteile oder statistische Gebiete), in denen die ausgewählten Parameter vorherrschen, bzw. solcher, die dem gewählten Referenzgebiet in diesen Parametern ähneln. Wählen Sie unter Filter die gewünschten Parameter für den Vergleich, sowie ein Referenzgebiet (optional).  

![Abbildung 8: Vergleichbare Gebiete ermitteln](https://user-images.githubusercontent.com/43250699/157012950-d631691b-0f40-4ab5-85f4-9e6b9c250d7e.png)   
 
*Abbildung 8: Vergleichbare Gebiete ermitteln*  

1. **Statistische Datenfilter**
   > Gewünschte Parameter für den Vergleich auswählen. Es können beliebig viele Parameter hinzugefügt werden. Alle StaNord-Datensätze sind hierfür verfügbar. Anteilige Werte eignen sich jedoch besser für die Vergleichbarkeit. Gegenwärtig können eigene Berechnungen aus dem Dashboard nicht herangezogen werden.
2. **Referenzgebiet**
   > Optional kann eins der ausgewählten Gebiete als Referenzgebiet angegeben werden.
3. **Filter hinzufügen**
   > Die Parametereinstellungen zeigen den aktuellen Datensatz (Jahr Min.- und Max.-Wert aller Hamburger Gebiete, den Referenzwert (frei wählbar oder des Referenzgebiets) sowie die Toleranz nach oben und unten. Das Toleranzintervall ist entweder in absoluten Zahlen oder in Prozent für anteilige Werte angegeben.
4. **Alle Filter zurücksetzen** 
   > Setzen Sie Ihre Eingaben zurück.  
5. **Ergebnisverzeichnis** 
   > Der "Datensatz hinzufügen" Button aus der [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis).  

![Abbildung 9: Vergleichbare Gebiete ermitteln, Ergebnisse](https://user-images.githubusercontent.com/43250699/157013004-f8b83b5e-92b3-4900-a0c0-60a1518a187f.png)  
*Abbildung 9: Vergleichbare Gebiete ermitteln, Ergebnisse*  

1. **Ergebnisverzeichnis**
   > Das [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis) verwaltet die unterschiedlichen Datensätze. Sie erscheint, sobald Sie einen zweiten Datensatz erstellt haben.
2. **Parametereinstellungen (Jahr)**
   > Wählen Sie die Grundlage für das entsprechende Jahr aus.  
3. **Parametereinstellungen (Attribute)**
   > Sofern es sich um einen Themenlayer handelt, können Sie hier ggf. Attribute der Einrichtung auswählen, anhand derer Sie nach vergleichbaren Gebieten suchen.  
4. **Parametereinstellungen (Toleranz)**
   > Stellen Sie die Toleranz ein, innerhalb derer weitere vergleichbare Gebiete gefunden werden sollen. Das Toleranzintervall ist entweder in absoluten Zahlen oder in Prozent für anteilige Werte angegeben.  
5. **Ergebnisse**
   > Eine Liste aller Gebiete, auf die die gewählten Kriterien zutreffen, wird im Fenster angezeigt. Ein Klick auf ein Gebiet legt den Kartenausschnitt auf dieses fest.
6. **Als Gebietsauswahl setzen**
   > Über *Ergebnis als Gebietsauswahl* setzen kann die aktuelle Gebietsauswahl für weitere Analysen auf die Ergebnis-Gebiete gesetzt werden.
  
<div style="page-break-after: always;"></div>

### Filter
Die aktiven, ausgewählten Themen können durch Klick auf den Reiter "Filter" nach den Kategorien ihrer Datensätze durchsucht und gefiltert werden. Die Karte zoomt automatisch auf die Filterergebnisse. Es werden nur Ergebnisse in den ausgewählten Gebieten einbezogen. Der Filter ist für alle Fachdatensätze verfügbar, welche sinnvolle filterbare Attribute (wie Fläche, Nutzung, Träger, etc.) aufweisen.  

![Screenshot_91](https://github.com/nihalh01/cosi/assets/140716054/1cdeb603-b12f-45c9-9c99-f59694837a11)


*Abbildung 10: Filter*  

1. **Ein Thema im Filter wählen**
   > Angezeigt werden die ausgewählten Themen. Themen können jederzeit hinzugefügt werden. Dazu Themenbau anklicken und Thema auswählen.
2. **Filteroptionen:**
    - es können mehrere Filteroptionen gewählt werden. Kennzeichnung der Auswahl erfolgt automatisch durch Haken. 
    - Schieberegler (von / bis): es kann z.B. eine gewünschte Schülerzahl eingegeben werden.
3. **Ergebnis wird sofort mit Wahl der Filteroption angezeigt:**
    - Ergebnis wird in der Karte durch Symbol oder Flächenfarbe angezeigt. Durch Anklicken des Reiters "Legende” wird diese eingeblendet. Mousehover blendet Infofeld zu Einrichtung / Fläche ein.
    - Im Ergebnisfeld der Suche werden Namen der Gebiete / Einrichtungen angezeigt. Durch Anklicken der Namen wird die Auswahl in der Karte markiert. 
4. **Filter löschen:** 
   > Einzelne Auswahl durch Anklicken des roten "X" oder gesamte Auswahl löschen durch Anklicken des Buttons "Zurücksetzen”.

<div style="page-break-after: always;"></div>

### Versorgungsanalyse
Mit diesem Werkzeug kann das Verhältnis zweier Datensätze zueinander berechnet werden. Die Datensätze können entweder regionalstatistische Daten oder Einrichtungsdaten aus dem Menü "Themen/ Fachdaten" sein. Damit die Versorgungsanalyse verwendet werden kann, müssen mindestens zwei Datensätze geladen worden sein.


![Abbildung 11: Versorgungsanalyse, Einstellungen](https://user-images.githubusercontent.com/43250699/142926985-dfc8c2f9-c652-49f5-8f92-64a985a64f5e.jpg)

*Abbildung 11: Versorgungsanalyse, Einstellungen*

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
6. **Auswahl vertauschen**
   > Mit einem Klick auf diesen Button können Sie Ihre Auswahl von Feld (1) und (2) vertauschen.
7. **Die gesamte Auswahl zurücksetzen**
8. **Berechnen**

![Abbildung 12: Versorgungsanalyse, Ergebnisse](https://user-images.githubusercontent.com/43250699/157009202-4cfeb5ff-e519-4305-ba4f-4ecde4f60bd0.png)

*Abbildung 12: Versorgungsanalyse, Ergebnisse*

1. **Ergebnisverzeichnis**
   > Die [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis) verwaltet alle von Ihnen erstellen Datensätze und bietet bestimmte standardisierte Funktionen wie Downloads und ähnliches an.
2. **Daten als Chart visualisieren**
   > Die Daten werden zum [Datenvisualisierung](#markdown-header-datenvisualisierung) geladen und dort als Graphen visualisiert.
3. **Auf der Karte visualisieren**  
   > Die Daten werden mit Hilfe der [Kartenvisualisierung](#markdown-header-kartenanalyse-regionalstatistischer-daten) auf der Karte visualisiert und je nach Wert in unterschiedlichen Farben dargestellt.
4. **Tabellenspalte für erweiterte Funktionen auswählen**
   > Hier können Sie Tabellenspalte auswählen die für die erweiterten Funktionen "Als Chart visualisieren" (3) und "Auf der Karte visualisieren" (4) herangezogen werden soll.
   
5. **Jahr auswählen**
   > Hier können Sie das Jahr auswählen, für das die entsprechenden Daten geladen werden.
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
      - **6.1 Ergebnisverzeichnis der Ergebnistabelle**      
         Wenn in Ihrer Ergebnistabelle mehr als 10 Ergebnisse angezeigt werden, können Sie hier entsprechend die Daten durchschalten.

<div style="page-break-after: always;"></div>

### DIPAS
Mit dem DIPAS Werkzeug können alle Beiträge aus laufenden DIPAS Verfahren in der Karte visualisiert, nach verschiedenen Kriterien dargestellt und für alle CoSI-Werkzeuge verfügbar gemacht werden. D.h. alle Beiträge können in der [Einrichtungsübersicht](#markdown-header-einrichtungsübersicht) angezeigt, für [Versorgungsanalyse](#markdown-header-versorgungsanalyse), [Erreichbarkeitsanalyse](#markdown-header-erreichbarkeitsanalyse) und [Vergleichbare Gebiete Ermitteln](#markdown-header-vergleichbare-gebiete-ermitteln) verwendet und mit dem [Filter](#markdown-header-filter) gefiltert werden.

![Abbildung 13: DIPAS](https://user-images.githubusercontent.com/43250699/159553679-c957f150-298f-476a-83ea-73ee854f5f61.png)

*Abbildung 13: DIPAS*

1. **Beteiligungsverfahren auswählen**
   > Für jedes Verfahren aus der DIPAS-Datenbank wird automatisch eine Registerkarte angelegt, welche durchs Anklicken aufgeklappt werden kann. Ein aufgeklapptes Verfahren zeigt dessen Beschreibungstext und die Kontrollfelder für die Visualisierung. Jedem Verfahren wid dabei eine zufällige Farbe zugewiesen.
2. **Indikator**
   > Das Icon in dem Indikator zeigt zum einen die Farbe an, in dem der jeweilige Datensatz visualiert wird. Zum anderen zeigt es, ob der Datensatz gerade auf der Karte angezeigt wird.
3. **Legende**
   > Die Legende zeigt an, welche Farbe den Eintragstypen in der Visualierung zugeordnet wird.
4. **Verfahren in der Karte anzeigen**
   > Zeigt das Verfahrensgebiet als Polygon in der Karte in der jeweiligen Farbe des Verfahrens.
   - **4.1 Auf der Karte anzeigen**
      > Die Kartenansicht fokussiert auf das jeweilige Verfahrensgebiet.
5. **Einzelne Beiträge in der Karte anzeigen**
   > Zeigt alle Einzelbeiträge des Verfahrens in der Karte. Das Styling der Beiträge kann unten (s. 7) festgelegt werden.
6. **Heatmap in der Karte anzeigen** 
   > Zeigt eine Heatmap der Beiträge in der Karte. Das Gewicht eines Punktes richtet sich dabei nach der Gesamtzahl der Bewertungen des Beitrags, also der Stärke der Resonanz auf ihn.
7. **Styling der Beiträge wählen**
   > - nach Projekt: Alle Beiträge werden gleichmäßig in der Projektfarbe dargestellt.
   > - nach Kategorien im Projektfarbraum: Jede Kategorie wird in einer Schattierung der Projektfarbe dargestellt.
   > - nach Kategorien im Regenbogenspektrum: Jeder Kategorie wird eine zufällige Farbe zugewiesen.
   > - nach Bewertung: Die Beiträge werden abhängig von den positiven- und negativen-Bewertungen dargestellt. Die Größe des Punktes richtet sich dabei nach der Gesamtzahl der Reaktionen, die Farbe nach dem Verhältnis von positiven (grün) und negativen (rot) Bewertungen.
8. **Download als GeoJson**
   > Die aktuell aktiven DIPAS Datensätze werden als GeoJson heruntergeladen.
9. **Automatisches Update**
   > Wenn diese Checkbox aktiviert ist, werden die DIPAS Daten ggf. live aktualisiert.
10. **Beiträge in der Karte**
      > Alle Beiträge werden mit ihrer ID (einer fortlaufenden Nummer) in der Karte dargestellt.

<div style="page-break-after: always;"></div>

### Graphenvisualierung
___
Das Graphenvisualisierungswerkzeug erstellt Graphen aus Datensätzen und verwaltet diese. Darüberhinaus ermöglicht es Ihnen den Export dieser Graphen als PNG.

Nach dem Sie Ihre gewünschten Gebiete und Fachdaten ausgewählt haben, können Sie unter Analyse - Graphenvisualisierung, Ihre Ergebnisse visuell darstellen lassen.

> **Hinweis:** Wenn Sie die Graphenvisualisierung direkt aus dem Analyse Menü öffnen, bitte unten in der Kartenvisualisierung auf das Graph Symbol klicken.

![Screenshot_75](https://github.com/nihalh01/cosi/assets/140716054/fff6f46d-22c6-4316-aa9c-c6dccc799e31)

*Abbildung_14.1: Graphenvisualisierung*

	Sie finden dieses Symbol auch im gesamten CoSI wie z.B.
	Dashboard –> Einrichtungsübersicht
	Dashboard –> Statistische Datenübersicht –> wählen Sie hier eine Kategorie & klicken 3 Punkte Menü –> Diagramme

![Abbildung 14: Graphenvisualisierung](https://user-images.githubusercontent.com/43250699/157070471-84b8aca7-44f9-47cb-9de2-2284a43062f4.png)  
*Abbildung_14.2: Graphenvisualisierung aktuell*

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
   > Das [Ergebnisverzeichnis](#markdown-header-ergebnisverzeichnis) verwaltet die unterschiedlichen erstellten Graphen und erlaubt, sie als Bild oder gesamelt als ZIP herunterzuladen.

<div style="page-break-after: always;"></div>

___
## Simulation
#### Werkzeuge des Simulationsmenüs
___

### Einrichtungen anlegen

Sobald sie "Einrichtungen anlegen" auswählen, öffnet sich ein Fenster, in dessen oberem Bereich Sie den Szenario Manager finden. Bei der Funktion "Wohnungsbauquartiere anlegen" befindet sich der Szenario Manager an derselben Stelle.

#### Szenario Manager
![Abbildung 15: Szenario Manager](https://user-images.githubusercontent.com/43250699/143022435-622e8032-e0da-4b5e-bd0c-9e33aa07de2c.png)  

*Abbildung 15: Szenario Manager* 

1. **Szenario Dropdown**
   > Zeigt bisher erstellte Szenarien an.
2. **Neues Szenario anlegen**
   > Öffnet die Maske zur Erstellung eines weiteren Szenarios.
3. **Szenario exportieren**
   > Stellt einen Download des Szenarios zur Verfügung
4. **Szenario Löschen**
   > Löscht das ausgewählte Szenario. 
5. **Szenario leeren**
   > Löscht alle Veränderungen im Szenario. 
6. **Thema auswählen**
   > Dropdownmenü erlaubt die Auswahl aus den aktivierten Fachthemen.  
  
 *Sie **müssen** ein Thema aus den geladenen Fachdaten wählen. Sind keine Fachdaten ausgewählt, ist kein Szenario möglich. Wählen Sie mindestens ein Analysethema aus dem Themenbaum.*  

![Abbildung 16: Einrichtungen anlegen](https://user-images.githubusercontent.com/43250699/143023574-324b2275-eea7-4926-bf3d-07c2f21124e1.png)

*Abbildung 16: Einrichtungen anlegen*  

1. **Einrichtung kopieren**
   > Erlaubt das Kopieren einer vorhandenen Einrichtung 
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
   1. Kopieren sie eine Einrichtung mit dem Pipetten-Symbol, indem Sie zuerst die Pipette anklicken und dann die zu kopierende Einrichtung in der Karte anwählen. Sie können Einrichtungen auch vollständig manuell anlegen, indem Sie die dazu erforderlichen Spalten selbst ausfüllen. 
   2. Positionieren Sie die Einrichtung auf der Karte, indem Sie zunächst den "Ort wählen" Stift im Feld *Geometrie/ Ort* anklicken und dann einen Punkt auf der Karte anwählen. Alternativ können Sie die geometrischen Werte in das Feld Geometrie/Ort eintragen. 
   3. *Erforderliche Spalten* werden durch das Kopieren einer Einrichtung per Pipette übernommen. Diese Spalten können jedoch manuell ergänzt oder verändert werden. 
   4. *Optionale Spalten* werden automatisch durch das Kopieren einer Einrichtung übertragen können aber auch manuell ergänzt oder ausgefüllt werden.
4. #### **Schritt 4:** Einrichtung anlegen
   > Schließen Sie die Erstellung ab, indem Sie den blauen Button "Neue Einrichtung Erstellen" klicken. Die neue Einrichtung erscheint als Icon in der Karte. Neue Einrichtungen werden durch ein farbiges Sternchen gekennzeichnet. 
5. #### **Schritt 5:** Einrichtung bewegen
   1. Zum Verschieben von Einrichtungen klicken Sie das Bewegen-Symbol. Nun klicken Sie die Einrichtung, die Sie bewegen möchten. Ist diese angeklickt, vergrößert sich das Symbol und zeigt damit an, dass die Einrichtung nun beweglich ist. Ziehen Sie die Einrichtung mit gedrückter linker Maustaste an den gewünschten Platz. 
   2. Möchten Sie bestehende Einrichtungen aus dem Datensatz auf der Karte verschieben, dann lösen Sie durch einen Klick auf das Schloss die Sperre. Es erscheint eine Warnung:   
   > *"Achtung: Sie können jetzt auch echte Einrichtungen verschieben. Ihre Änderungen sind nur temporär und werden nach der Sitzung nicht gespeichert."*  

Alle Analysen, die innerhalb eines Szenarios durchgeführt werden, berücksichtigen die Parameter der simulierten Einrichtungen. 

<div style="page-break-after: always;"></div>

### Einrichtungen bearbeiten

Sie können sowohl selbst angelegte als auch bereits in den Daten vorhandene Einrichtungen bearbeiten, sobald Sie ein aktives Szenario haben. Sollten Sie kein Szenario angelegt haben und Sie klicken eine Einrichtung an, wird folgendes Popup angezeigt:

![Abbildung 17: Bitte erstellen Sie ein Szenario](https://user-images.githubusercontent.com/43250699/159273029-a17ce734-e7ed-4374-9cf4-433d44f26508.JPG)

*Abbildung 17: Bitte erstellen Sie ein Szenario*

Ein Szenario können Sie wie im [Szenario Manager](#markdown-header-szenario-manager) beschrieben anlegen. Sobald Sie ein Szenario erfolgreich erstellt haben, erscheint wenn Sie eine Einrichtung anklicken folgendes Popup am unteren Bildschirmrand: 

![Abbildung 18: Einrichtung bearbeiten](https://user-images.githubusercontent.com/43250699/159273504-35b08fa1-2206-4ef4-a850-670f0e03a381.JPG)

*Abbildung 18: Einrichtung bearbeiten*

Wählen Sie hier den Button **BEARBEITEN** an, daraufhin wird sich das folgende Fenster öffnen:

![Abbildung 19: Einrichtung-Bearbeiten-Fenster](https://user-images.githubusercontent.com/43250699/159273975-1e1f2960-1af4-4e49-a03a-5657060b322f.png)

*Abbildung 19: Einrichtung bearbeiten*

1. **Eingaben sperren**
   > Mit Hilfe dieses Buttons sperren Sie die Input-Felder des Fensters, so dass sie nicht mehr bearbeitet werden können. Die Input-Felder sind standardmäßig gesperrt, so dass Sie diesen Button aktivieren müssen, ehe Sie eine vorhandene Einrichtung bearbeiten können. 
2. **Inputfelder**
   > Die verfügbaren Inputfelder für den Datensatz der ausgewählten Einrichtung. Die Inputfelder weichen je nach Einrichtung ab (Krankenhaus, Sportstätte, Schule etc.).
3. **Änderungen speichern**
   > Speichern Sie die Änderungen, die Sie an der Einrichtung vorgenommen haben.
4. **Zurücksetzen**
   > Setzen Sie alle Felder der Einrichtung auf Ihre ursprünglichen Werte zurück.
5. **Abbrechen**
   > Verwerfen Sie Ihre ungespeicherten Änderungen und schließen dieses Fenster.

   > **Hinweis:** Wenn auf der Karte Cluster von Einrichtungen angezeigt werden, weil in der aktuellen Zoomstufe nicht alle Einrichtungen dargestellt werden können, öffnet sich bei einem Klick auf das Clustersymbol folgendes Fenster:

![Abbildung 20: Clusterauswahl](https://user-images.githubusercontent.com/43250699/159275102-91f27ff1-4214-4a2e-8bb6-19105e1859b9.png)

*Abbildung 20: Clusterauswahl*

1. **Das angewählte Cluster (3)**
   > Die Darstellung von Einrichtungen wird auf der Karte gebündelt, wenn zu viele Einrichtungen an einem Ort sind, so dass sie in der aktuellen Zoomstufe nicht dargestellt werden können. 
2. **Auswahl**
   > Alle im Cluster gebundenen Einrichtungen werden angezeigt, sobald Sie auf das Cluster klicken. Sie können dann in diesem Fenster eine Einrichtung auswählen, woraufhin sich das Fenster aus Abbildung 17 öffnet.

<div style="page-break-after: always;"></div>

### Wohnungsbauquartiere anlegen 

Durch das Erstellen eines Wohnbauquartiers können Sie Wohnungsbauszenarien durchspielen. Die erstellten Wohnungsbauquartiere stehen Ihnen für weitere Analysefunktionen zur Verfügung. Die Szenarien können exportiert und gespeichert werden.

Sobald Sie "Wohnungsquartiere anlegen" auswählen, öffnet sich ein Fenster, in dessen oberem Bereich Sie den Szenario Manager finden. (s. [Szenario Manager](#markdown-header-szenario-manager))

![Abbildung: 22: Wohnungsbauquartiere anlegen](https://user-images.githubusercontent.com/43250699/143025884-f86a5897-3757-4b35-9d6d-1e4969d8175d.png)

*Abbildung 21: Wohnungsbauquartiere anlegen*

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
   > Zeigt die Einwohnerzahl entsprechend dem gewählten Referenzgebiet. 
- **Wohneinheiten**
   > Schieberegler lässt sich auf die gewünschte Anzahl an Wohneinheiten regeln. 
- **Bruttogeschossfläche (BGF)**
   > Regelt die verfügbare Bruttogeschossfläche. 
- **Durchschnittliche Haushaltsgröße**
   > Regelt die geplante Anzahl der Personen pro Wohneinheit. 
- **Geschossflächenzahl (GFZ)**
   > Reguliert die Anzahl an Flächen auf der gezeichneten Grundfläche. 
- **Bevölkerungsdichte**
   > Wird aus dem Referenzgebiet übernommen, kann jedoch durch Anpassung anderer Parameter variieren. 
- **Wohnfläche pro Person**
   > Reguliert die bereitgestellte Wohnfläche pro Kopf. 

#### Schrittweises Vorgehen
Zur besseren Verständlichkeit des Werkzeugs wird im Folgenden einmal Schritt für Schritt erläutert, wie man erfolgreich selbst ein neues Wohnungsquartier anlegt.

1. **Schritt 1:** Geben Sie einen Namen für das erstellte Wohnbauquartier ein 
2. **Schritt 2:** Zeichnen Sie mit dem Zeichenstiftwerkzeug den Wohnblock an der gewünschten Fläche ein oder wählen Sie ein Polygon auf dem Kartenlayer aus. 
3. **Schritt 3:** Parameter für das erstellte Quartier können per Schieberegler angepasst werden.
4. **Schritt 4:** Wählen Sie ein Referenzgebiet für die Simulation der Zusammensetzung des Gebiets aus. 
5. **Schritt 5:** Klicken Sie auf "Anlegen". Das Neue Wohnbauquartier erscheint nun als hervorgehobenes Polygon mit Angaben zur Fläche und Einwohnerzahl auf der Karte.  

<div style="page-break-after: always;"></div>

___
## Dienste
### Werkzeuge des Dienstemenüs
___

![Screenshot_96](https://github.com/nihalh01/cosi/assets/140716054/354408a0-b2d4-4464-be52-aebbd803c8d7)

*Abbildung 22 - Dienste*

1. **Zeichnen/ Schreiben**
2. **Karte drucken**
   > Den aktuellen Kartenausschnitt inkl. aktiver Layer drucken.
3. **Mousehover ein-/ ausschalten**
   > Den Tooltip, der am Mauszeiger in der Karte eingeblendet wird (de-)aktivieren
4. **[Geodaten Importieren](#markdown-header-geodaten-importieren)**
5. **Report Template**
6. **WMS hinzufügen**
   > Beliebige andere Kartendienste können aus dem FHH-Atlas oder anderen Quellen über die Webadresse (URL) des Dienstes eingebunden werden. Die URLs entnehmen Sie z.B. dem Metadatenkatalog der FHH oder dem Geoportal unter dem Info-Button im Themenbaum (s. Themenbaum).
7. **[Sitzung speichen / laden](#markdown-header-sitzung-speichern)**
   > Die aktuelle Sitzung mit aktiven Daten, gewählten Gebieten und Filtern speichern. Sitzungen können im Browser gespeichert werden. Diese können beim Programmstart wieder aus dem Verlauf geladen werden.
   Wenn Browserverlauf oder Cache geleert werden, geht dieser Speicherstand verloren! Es kann immer nur eine Sitzung parallel vorgehalten werden.   
   Sitzungen als Datei auf dem Rechner speichern. Diese können jederzeit wieder geladen oder mit anderen CoSI Nutzer:innen geteilt werden.
8. **[Vorlagen](#markdown-header-vorlagen)**
9. **ExportPdf**
10. **Virtueller Nutzer**

   >*Hinweis: Manuell hinzugefügte Kartendienste (WMS) und erstellte Berechnungen bleiben nicht erhalten. Das Speichern aller Arbeitsergebnisse ist Teil des aktuell laufenden Weiterentwicklungsprojekts.*

<div style="page-break-after: always;"></div>

### Geodaten Importieren
Mit diesem Werkzeug können Sie eigene Datensätze in Form von GeoJSON hochladen und als Themenlayer einfügen, der anschließnend visualisiert werden kann und dem alle weiteren Analysefunktionen von CoSI zur Verfügung stehen.   

![Abbildung 23: Dateien importieren](https://user-images.githubusercontent.com/43250699/142930620-f556b3bb-a098-4deb-8394-2b5db6963c94.jpg)  
*Abbildung 23: Dateien importieren*   
1. **Info**
   > Über den Button finden Sie zu dieser Anleitung.
2. **Upload per Drag And Drop**
   > Ziehen Sie eine Datei per Drag and Drop in dieses Feld. Sie wird automatisch hochgeladen.
3. **Datei auswählen**
   > Mit einem Klick auf diesen Button öffnen Sie den Dateibrowser Ihres Computers und können die hochzuladende Datei dort auswählen.
4. **Projektionssystem auswählen**
   > Geodaten sind in unterschiedlichen *Projektionssystemen* kodiert. Sollten Sie nach dem Upload feststellen, dass Ihre Daten an den falschen Orten visualisiert werden, überprüfen Sie bitte, in welchem Projektionssystem Ihre Datei kodiert ist und geben Sie die Kodierung bei einem erneuten Upload in diesem Auswahlfeld an.  
  
Sobald Ihre Datei hier hochgeladen wurde, erscheint ein neues Fenster, in welchem Sie bestimmte Funktionen haben, um den Layer aus der Datei zu generieren.  

![Abbildung 24: Geodaten Importieren, Layeroptionen festlegen](https://user-images.githubusercontent.com/43250699/142931326-1effcb55-62a9-4fdb-918f-6d0fb9dccc49.jpg)  
*Abbildung 24: Geodaten Importieren, Layeroptionen festlegen* 

5. **Layername**
   > Hier können Sie den Layer frei benennen. Standardmäßig wird der Name der hochgeladenen Datei verwendet.
6. **[Styling](#markdown-header-styling)**
7. **[Einrichtungsdaten](#markdown-header-einrichtungsdaten)**
8. **[Filterdaten](#markdown-header-filterdaten)**
9. **[Numerische Werte](#markdown-header-numerische-werte)**
10. **Abbrechen/ Layer hinzufügen**
   > Mit einem Klick auf den Button "Abbrechen" brechen Sie den Vorgang ab und schließen das Fenster. Mit einem Klick auf "Layer Hinzufügen" wird der Import abgeschlossen und mit Ihren Einstellungen für die Funktionen in CoSI bereitgestellt.

#### Styling

![Abbildung 25: Geodaten Importieren, Layerstyling](https://user-images.githubusercontent.com/43250699/142931936-7da21540-9ac3-4a4d-85f5-1f78feae6978.jpg)  
*Abbildung 25: Geodaten Importieren, Layerstyling*  

- **6.1** Ein Icon auswählen, mit dem die jeweiligen Punkte visualisiert werden sollen. (Diese Option steht nicht zur Verfügung, wenn es sich bei den von Ihnen hochgeladenen Geodaten um Polygone handelt).
- **6.2** Mit dieser Checkbox legen Sie fest, ob alle Entitäten des Datensatzes mit derselben Farbe dargestellt werden sollen oder basierend auf einem ihrer Attribute farblich angepasst werden sollen. Aktivieren Sie diese Checkbox, bestimmen Sie das gewünschte Attribut bitte wie in 6.2.1 beschrieben.
   - **6.2.1** Haben Sie die Checkbox "Farbe nach Attributen" aktiviert, erscheint dieses Auswahlfeld, in dem alle Attribute der Einträge Ihres Datensatzes aufgelistet werden. Bestimmen Sie hier bitte das Attribut, anhand dessen die Farben generiert werden sollen.
   - **6.2.2** Sobald Sie in 6.2.1 ein Attribut ausgewählt haben, erscheint diese Checkbox, sofern es sich nicht um ein Attribut mit numerischen Werten handelt. Hier haben Sie die Option, Ihre Daten nicht auf Basis einer ausgewählten Farbe zu visualisieren, sondern gleichmäßig verteilt über ein Regenbogenfarbspektrum. Dies kann zur besseren Unterscheidung einzelner Punkte hilfreich sein. 
- **6.3** Haben Sie weder "Farbe nach Attributen" ausgewählt bzw. bei "Farbe nach Attributen" nicht die Checkbox "Regenbogenfarbspektrum" aktiviert, können Sie hier eine Farbe bestimmen, auf deren Basis die Daten visualisiert werden. Ein Klick auf das farbige Viereck der Textbox öffnet das Farbauswahlfeld.

#### Einrichtungsdaten
![Abbildung 26: Geodaten Importieren, Einrichtungsdaten](https://user-images.githubusercontent.com/43250699/142932334-7476d084-eda1-4a05-a93e-bf159ac55b8f.jpg)  
*Abbildung 26: Geodaten Importieren, Einrichtungsdaten*    

   - **7.1** Hier wählen Sie aus allen Attributen der Einträge Ihrer hochgeladenen Datei das Attribut aus, welches einen eindeutigen, individuellen Namen des Eintrags enthält. Dies ist für bestimmte Funktionen von CoSI relevant. Sollte ein solches Attribut nicht existieren, lassen Sie es bitte einfach frei.
   - **7.2** Hier wählen Sie aus allen Attributen der Einträge Ihrer hochgeladenen Datei ein Attribut aus, was den Typ des jeweiligen Eintrags am besten beschreibt. Handelt es sich bei Ihrem Datensatz beispielsweise um eine Reihe von unterschiedlichen Einrichtungen, könnte hier als Attribut eines gewählt werden, dass Werte wie "Kindergarten", "Krankenhaus" oder "Hotel" enthält.
   - **7.3** Für die korrekte Darstellung in manchen Werkzeugen von CoSI ist eine vollständige Adresse hilfreich. Sofern ein Attribut mit dem Namen "Adress" oder "address" vorhanden ist, wird Ihnen dieser Teil der Funktionen nicht angezeigt. Sollte ein solches Attribut aber nicht existieren, können Sie aus bestimmten im Vorfeld automatisch erkannten Attributen wie "Straße" oder "plz" wählen. Sie können mehrere dieser Felder auswählen und so die Adresse entsprechend zusammenstellen.
   - **7.4** Sollte keines der automatisch erkannten Attribute die korrekten Adressdaten enthalten, können Sie mit dem Button "Aus allen Objekteigenschaften wählen" alle Attribute anzeigen lassen, um daraus die Adresseigenschaften auszuwählen. Sollten in dem Datensatz keine entsprechenden Informationen hinterlegt sein, können Sie dieses Auswahlfeld ignorieren.

#### Filterdaten
![Abbildung 27: Geodaten Importieren, Filterdaten festlegen](https://user-images.githubusercontent.com/43250699/142932614-055ed92b-6967-436b-ace5-8977111ef473.jpg)  
*Abbildung 27: Geodaten Importieren, Filterdaten festlegen*  

   - Unter CoSIs Werkzeugen finden Sie auch das Filterwerkzeug, mit denen Sie alle Datensätze nach bestimmten Kriterien filtern können. Bitte bestimmen Sie hier, welche der Attribute Ihrer Daten für den Filter verfügbar gemacht werden sollen.
   - **8.1** Mit einem Klick auf diesen Button öffnet sich ein Auswahlfeld, mit Hilfe dessen Sie ein Attribut zur weißen Liste des Filters hinzufügen können.

#### Numerische Werte
![Abbildung 28: Geodarten Importieren, Numerische Werte festlegen](https://user-images.githubusercontent.com/43250699/142932809-d77c6760-bff3-4576-b9fa-1bcca88ef816.jpg)  
*Abbildung 28: Geodarten Importieren, Numerische Werte festlegen*  
- Mit Hilfe des Werkzeugs [Versorgungsanalyse](#markdown-header-versorgungsanalyse) können Sie unterschiedlichste Zahlwerte gegeneinander verrechnen. In diesem Bereich bestimmen Sie Attribute, die numerische Werte enthalten, die für die Versorgungsanalyse bereitgestellt werden sollen. Dies können alle sinnvoll quantitativ messbaren Werte sein, wie beispielswiese "Budget", "Einwohnerzahl", "Fläche" oder "Besuche pro Woche" etc.  

   - **9.1** Für die bessere Visualisierung in einer späteren Tabelle, können Sie hier dem numerischen Wert einen sinnvollen Namen geben, sollte das Attribut nicht sinnvoll benannt sein. So könnten Sie beispielsweise "budget_21" in "Verfügbare Mittel 2021" umbenennen.
   - **9.2** Hier sehen Sie die ID des Attributs und dahinter in Klammern einen Beispielwert aus dem ersten Eintrag.
   - **9.3** Mit dieser Checkbox fügen Sie das Attribut zu den numerischen Werten hinzu. 

<div style="page-break-after: always;"></div>

### Sitzung Speichern/Laden 

![Screenshot_102](https://github.com/nihalh01/cosi/assets/140716054/fccee60e-5482-42d9-a703-e5075ec5c28c)

*Abbildung 29: Sitzung speichern / laden*

Mit dem Dienst **Sitzung speichern/laden** können aktuelle diverse Informationen der aktuellen Arbeitssitzung abgespeichert werden um diese zu einem späteren Zeitpunkt wieder öffnen und weiterbearbeiten zu können. Dies umfasst

- Die ausgewählte Verwaltungsebene und ausgewählte Gebiete
- Aktive Fachdatenthemen 
- Mit den [Simulationswerkzeugen](#markdown-header-simulation) erstellte Szenarien
- Ergebnisse und Konfigurationen der Werkzeuge [Erreichbarkeitsanalyse](#markdown-header-erreichbarkeitsanalyse) und [Versorgungsanalyse](#markdown-header-versorgungsanalyse)

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

<div style="page-break-after: always;"></div>

### Vorlagen

![Screenshot_105](https://github.com/nihalh01/cosi/assets/140716054/ab4d95f3-e3e0-49b5-8430-3faebe4b27f6)

*Abbildung 30: Vorlagen*

Über den Dienst **Vorlagen** können Vorlagen zu verschieden Themenkomplexen und Arbeitsfeldern geladen werden. Diese können Fachdatenthemen, aktive Werkzeuge und eine Gebietsauswahl beinhalten. Die verfügbaren Vorlagen und ihr Inhalt werden von den Fachbehörden in Koordination mit dem CoSI-Betriebsteam gepflegt.

1. **Liste aller Vorlagen (zum Aufklappen)**
2. **Inhaltsübersicht einer Vorlage**
   > - Titel
   > - Stand (Datum)
   > - Beschreibung
   > - Fachdatenthemen
   > - Aktiver Bezugsrahmen (Verwaltungsebene)
   > - Ausgewählte Gebiete
3. **optionale Gebietsauswahl**
   > Wenn kein Bezugrahmen/Gebiete definiert sind, können diese händisch im Vorfeld oder nach dem Laden ausgewählt werden. Die Inhalte werden dann für die aktive Gebietsauswahl geladen.
3. **Vorlage laden**
   > Die ausgewählte Vorlage laden.

![Screenshot_109](https://github.com/nihalh01/cosi/assets/140716054/1694d425-5e6a-4e1f-916b-7f41b236d3c8)


<div style="page-break-after: always;"></div>

___
### Dashboard
____

### Statistische Datenübersicht

![Screenshot_130](https://github.com/nihalh01/cosi/assets/140716054/87b02aa9-5aad-4a61-b33c-5ee5054d8faa)

*Abbildung 31: Statistische Datenübersicht 1*

![Screenshot_126](https://github.com/nihalh01/cosi/assets/140716054/c0ce7591-490d-4284-92cb-e33a8c6d85d9)

*Abbildung 31: Statistische Datenübersicht 2*

1. **Gruppen ein-/ausklappen**
   > Thematische Gruppen (vgl. [Regionalstatistische Daten](#markdown-header-regionalstatistische-daten)) über das **+** ein- und ausklappen.
2. **Aktionen**
   > - s. [Burger-Menü](#markdown-header-burgermenü)
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
      > Die Darstellung in der Karte entspricht der des Kontrollfeldes [Kartenanalyse regionalstatistischer Daten](#markdown-header-kartenanalyse-regionalstatistischer-daten).

#### Burgermenü
![Abbildung 32: Statistische Datenübersicht - Burgermenü](https://user-images.githubusercontent.com/43250699/159326829-900bffff-6db2-4055-9219-7be46ffb1dea.png)

*Abbildung 32: Statistische Datenübersicht - Burgermenü*

1. **Visualisierung ein-/ausschalten**
   > Thematische Gruppen
2. **Zeitreihe in der Karte animieren**
   > *(Funktioniert nur bei aktiver Kartenvisualisierung)*
3. **Gebietsnamen ein-/ausblenden**
   > *(Funktioniert nur bei aktiver Kartenvisualisierung)*
4. **Für Feld A auswählen**
   > Selektiert das Thema als **Feld A** für Berechnungen und Korrelation (siehe Burgermenu/ Berechnen)
5. **Für Feld B auswählen**
   > Selektiert das Thema als **Feld B** für Berechnungen und Korrelation (siehe Burgermenu/ Berechnen)
6. **Auswahl aufheben**
   > Setzt die Felder **A** und **B** zurück

![Abbildung 33: Statistische Datenübersicht - Burgermenü](https://user-images.githubusercontent.com/43250699/159326748-5207418c-9e01-4e8d-8727-ea61b42bfd45.png)

*Abbildung 33: Statistische Datenübersicht - Burgermenü*

1. **Grundlegende Mathematische Funktionen**
   > Verrechnet die Werte für **A** und **B** für jede Gebietsspalte und fügt das Ergebnis der Tabelle an. Die durchzuführende Operation wird in Klammern hinter dem Menüpunkt angezeigt, bspw. (A + B).
2. **Ausgewählte Aufsummieren**
   > Addiert die Werte aller ausgewählten Spalten auf. Das Ergebnis der Berechnung finden Sie ganz unten im Dashboard unter "Berechnungen".
3. **Ausgewählte Dividieren**
   > Alle ausgewählten Zeilen werden durch den als **B** gesetzten Wert geteilt. Die Ergebnisse finden Sie ganz unten im Dashboard unter "Berechnungen".

![Abbildung 34: Statistische Datenübersicht - Burgermenü](https://user-images.githubusercontent.com/43250699/159326761-e49c2e5c-b25b-4897-9d9b-681cdaef5c96.png)

*Abbildung 34: Statistische Datenübersicht - Burgermenü*

1. **Diagramme erzeugen**
      > Erzeugt Diagramme für den ausgewählten Indikator in der [Datenvisualisierung](#markdown-header-datenvisualisierung) (analog zu [Kartenanalyse regionalstatistischer Daten](#markdown-header-kartenanalyse-regionalstatistischer-daten)).
2. **Diagramme für ausgewählte Zeilen**
      > Erzeugt Diagramme, die die Werte aller ausgewählten Zeilen abbilden im [Datenvisualisierung](#markdown-header-datenvisualisierung) (analog zu [Kartenanalyse regionalstatistischer Daten](#markdown-header-kartenanalyse-regionalstatistischer-daten)).
3. **Korrelations- / Streuungsdiagramm**
      > Visualisiert ein Streuungsdiagramm für die Felder **A** (Y-Achse) über **B** (X-Achse) im [Datenvisualisierung](#markdown-header-datenvisualisierung) und berechnet die Korrelation (Pearson) zwischen den Datensätzen und zeichet eine Regressionsgerade.


<div style="page-break-after: always;"></div>

### Einrichtungsübersicht
![Abbildung 35: Einrichtungsübersicht](https://user-images.githubusercontent.com/43250699/159693060-ce1ffbeb-e9f6-4525-8896-13f341138246.png)
*Abbildung 35: Einrichtungsübersicht*

1. **Detailansicht ein-/ausklappen**
   > Über den Pfeil können *alle* Attribute einer Einrichtung aufgeklappt werden. Die einzelnen Zeilen der Detailansicht können für den weiteren Export ausgewählt werden.
2. **Einrichtung auswählen**
   > Einrichtungen für den Export auswählen. Ausgewählte Einrichtungen werden in der Karte visuell hervorgehoben.
   *Wenn Sie die Einrichtung ausgewählt haben und unter **12** einen Fachdatensatz zur Auswertung ausgewählt haben, werden diese ebenfalls auf der Karte angezeigt. (s. Abbildung 36)*
   ![Abbildung 36: Fachdaten zur Auswertung auf der Karte](https://user-images.githubusercontent.com/43250699/159693761-ebea6f7d-49a4-4cca-9f2a-3f6ef71503c8.JPG)
*Abbildung 36: Weitere Fachdaten auf der Karte*
3. **Einrichtung fokussieren**
   > Durch einen Klick auf das Symbol zoomt die Karte zu der betreffenden Einrichtung. Die Einrichtung wird in der Karte visuell hervorgehoben.
4. **Einrichtung ein-/ausblenden**
   > Einrichtungen können in der Karte ein- und ausgeschaltet werden. Ausgeschaltete Einrichtungen werden bei allen anderen CoSI-Funktionen nicht berücksichtigt.
5. **Einrichtungsattribute**
   > - Einrichtungsname, Adresse, Layer, Typ und Thema werden dem Datensatz direkt entnommen
   > - Die Gebietszuweisung wird dynamisch für die aktuelle Verwaltungsebene generiert
   > - Symbole zeigen an, wenn eine Einrichtung simuliert oder modifiziert wurde.
6. **Einträge sortieren**
   > Alle Spalten können, durch mehrmaliges Klicken auf die Kopfzeile, auf- und absteigend sortiert werden (alphabetisch oder nach Wert). Dabei kann für max. 2 Spalten erfolgen (z.B. 1. nach Typ und 2. nach numerischem Wert).
7. **Numerische Attribute**
   > Alle Attribute einer Einrichtung, die Zahlwerte abbilden (welche auch für die [Versorgungsanalyse](#markdown-header-versorgungsanalyse) verwendet werden können) werden in einer eigenen Spalte dargestellt. Die Farbe des Balkens richtet sich dabei nach dem Dezil des Wertes in der Liste aller Einrichtungen. Die Länge des Balkens ist proportional zum Höchstwert.
8. **Durchschnittliche Anbindung (in m)**
   > Die Anbindungsspalte zeigt die durchschnittliche Laufdistanz (in m) zu den jeweils nächstgelegenen Einrichtungen der ausgewählten Typen. Durch einen Klick auf den Wert kann die entsprechende Aufschlüsselung geöffnet werden (s. 12.).
9.  **Such- und Filterfunktionen**
      > Hier können Sie die Liste nach Themen filtern oder im Freitext die Einrichtungen durchsuchen.
10. **Einrichtungsdiagramme erstellen**
      > Erzeugt für alle verfügbaren Datenspalten ein Balkendiagramm, in dem die Werte der jeweiligen Einrichtungen und ihre Verteilung über die ausgewählten Gebiete.
      - **10.1 Layer zusammenziehen**
         > Wenn Sie diese Checkbox aktivieren, werden bei "Einrichtungsdiagramme erstellen"  Einrichtungen unterschiedlichen Typs zusammengezogen, wenn sie identische Attribute haben. *Beispiel: Wenn Sie Supermärkte und Drogerien ausgewählt haben, teilen sich beide das Attribut "Verkaufsfläche in m²" und werden dementsprechend im Graphen zusammen dargestellt*
11. **Tabelle exportieren**
      > Die ausgewählten Einträge als XLSX für Excel exportieren. Über aus Auswahlfeld *Detailansicht exportieren* können alle bzw. in der Detailansicht ausgewählte Attribute eines Einrichtungstyps exportiert werden. Ist keine Auswahl getroffen, werden alle Einrichtungen exportiert.
12. **Standortbewertung: Themenauswahl**
      > Erlaubt die Auswahl beliebiger weiterer Fachdatenthemen für eine Standortbewertung. Bei Fachdaten, welche Punkte oder Flächen in der Karte repräsentieren (i.d.R. Einrichtungen) wird der Ort des Typs gefunden, welcher jeder Einrichtung in der Tabelle am nächsten ist und die Laufdistanz in Metern angegeben. Bei der Auswahl mehrerer Themen wird ein gewichteter Mittelwert gebildet (s. 8./13.). Andere Themen, z.B. Lärmkarte, Luftqualität, etc.) für die Bewertung befinden sich im Aufbau.
13. **Standortbewertung: Gewichtung**
      > Erlaubt die Gewichtung der Themen für die Standortbewertung. Ein Thema mit Wert 0,5 wird somit nur halb so stark in den Mittelwert einbezogen, wie eines mit dem Wert 1.
14. **Standortvisualisierung für alle ausgewählten**
      > Erstellt ein Balkendiagramm mit der Aufschlüsselung für alle ausgewählten Einrichtungen. Wenn Sie mehr als zwei Fachdatensätze für die Auswertung (s. 12) ausgewählt haben, dann wird ein Radardiagramm generiert. Wenn Sie keine Einrichtungen ausgewählt haben, werden *alle* verfügbaren Einrichtungen in das Diagramm mit einbezogen.
15. **Histogramm**
      > Erzeugt ein Histogramm, das die Verteilung der ausgewählten Einrichtungen abbildet.

<div style="page-break-after: always;"></div>

### Gebietsauswahl
___
Beim Starten von CoSI wird zunächst ein Bezugsrahmen festgelegt sowie ein Planungsgebiet zusammengestellt und bestätigt.

![Abbildung 37: Gebietsauswahl](https://user-images.githubusercontent.com/43250699/142933538-fd2e1dbc-8bef-444a-bc7f-66d0066a457e.png)

*Abbildung 37: Das Werkzeug "Gebiet auswählen"*  

1. **Bezugsrahmen wählen**
   > Über ein Dropdown Menü können **"Hamburg"**, **"Bezirke"**, **"Stadtteile"** oder **"Statistische Gebiete"** ausgewählt werden – dies legt die Verwaltungseinheit fest, für die die statistischen Daten angezeigt und Auswertungen erstellt werden sollen. Alle Funktionen sind auf den jeweiligen Gebietsebenen verfügbar. Die Zahl der verfügbaren Indikatoren kann jedoch variieren. Der Bezugsrahmen bestimmt auch die zu ladenden übergeordneten Referenzgebiete: Stadtteile für stat. Gebiete, Bezirke für Stadtteile.
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

Es muss nicht in jedem Nutzungskontext immer ein Planungsgebiet als erstes festgelegt werden; bestimmte Analysetools wie z.B. die [Erreichbarkeitsanalyse](#markdown-header-erreichbarkeitsanalyse) und [Vergleichbare Gebiete](#markdown-header-vergleichbare-gebiete) können verwendet werden, ohne dass vorher ein Gebiet festgelegt wird.  

Für solche Fälle gelten folgende Hinweise:  

   - Es werden keine Datensätze geladen, d.h. eine Anzeige der regionalstatistischen Daten ist nicht möglich. Auch werden keine regionalstatistischen Daten im Dashboard angezeigt.
   - Beim Zuschalten von Themen aus den Fachdaten könnte der Ladevorgang länger dauern.
   - Möglicherweise funktioniert die [Erreichbarkeitsanalyse](#markdown-header-erreichbarkeitsanalyse) für eine sehr große Zahl von Einrichtungen nicht zuverlässig.

<div style="page-break-after: always;"></div>

### Kartenanalyse regionalstatistischer Daten
___
Grundlage aller CoSI-Analysefunktionen sind neben den Fachdaten-Layern die Datensätze der StaNord-Datenbank, welche für die verschiedenen Verwaltungseinheiten als Zeitreihen vorliegen (s. [Regionalstatistische Daten](#markdown-header-regionalstatistische-daten)). Diese können für das ausgewählte Planungsgebiet direkt und dynamisch in der Karte visualisiert werden. Die *Farbskalierung und Legende* werden hierbei *dynamisch* aus der Auswahl generiert. Es wird immer der *aktuellste Datensatz* dargestellt.
Das Werkzeug zur Visualisierung regionalstatistischer Daten ermöglicht die Auswahl von regionalstatistischen Datensätzen, die für die ausgewählten Bezirke verfügbar sind. Es kann nur verwendet werden, wenn bereits Gebiete über das Gebietsauswahlwerkzeug ausgewählt wurden.
Das Werkzeug kann die ausgewählten Datensätze auf der Karte visualisieren und generiert eine dynamische Legende. Des Weiteren können Datensätze für mehrere Jahre ausgewählt und auf Wunsch in hintereinander laufender Folge animiert werden.  


![Abbildung 38: Fenster zur Kartenanalyse statistischer Daten](https://user-images.githubusercontent.com/43250699/159270688-1d5e1b8f-799b-4d31-8b8e-247b0fd45293.png)  

*Abbildung 38: Fenster zur Kartenanalyse statistischer Daten*  

1.	**Werkzeug minimieren/ maximieren**  
   > Über den Button kann das Fenster des Werkzeugs minimiert bzw. wieder maximiert werden.
2.	**Daten auf Karte visualisieren**  
   > Über den Button kann die Kartenvisualisierung der regionalstatistischen Daten ein- und wieder ausgeblendet werden.
3.	**Vor/ Zurück**  
   > Mit den Vor- und Zurückbuttons können die regionalstatistischen Datensätze fließend durchgeschaltet werden.
4.	**Jahresauswahl**  
   > Hier können Sie das Jahr auswählen, für den der regionalstatistische Datensatz visualisiert wird. Standardmäßig ist das aktuellste verfügbare Jahr ausgewählt.
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

<div style="page-break-after: always;"></div>

### Ergebnisverzeichnis
Die Ergebnisverzeichnis unterstützt in einigen Werkzeugen die Verwaltung mehrerer Datensätze. Die zugrunde liegenden Funktionen sind aber standardisiert und werden im Folgenden näher erläutert.   


![Abbildung 39: Ergebnisverzeichnis des Werkzeugs "Vergleichbare Gebiete ermitteln"](https://user-images.githubusercontent.com/43250699/157007454-80d78c08-e141-4384-85ea-435a93ca3356.png)

*Abbildung 39: Ergebnisverzeichnis des Werkzeugs "Vergleichbare Gebiete ermitteln"*
  
1. **Direktanwahl eines Datensatzes**
   > Wählen Sie direkt den Datensatz mit dem jeweiligen Index an. Sie können hier auch ablesen, wieviele Datensätze sie aktuell in dem jeweiligen Werkzeug haben.
2. **Vor/ Zurück**
   > Durch Klicken auf einen der Pfeile wird der nächste/ vorherige Datensatz ausgewählt.
3. **Neuen Datensatz hinzufügen** 
   > Je nach Werkzeug wird diese Funktion nicht immer genutzt, sollte der Button aber vorhanden sein, können Sie mit seiner Hilfe einen neuen Datensatz anlegen.
4. **Export**
   > Mit diesem Button können Sie die Ergebnisse des jeweiligen Datensatzes exportieren und speichern. Es können mehrere dieser Buttons existieren, wenn mehrere Formate zum Export angegeben werden.
5. **Alle exportieren**
   > Sie führen die Exportfunktion für alle Datensätze durch. Sollten mehrere Dateitypen angeboten werden, werden alle heruntergeladen. Eventuell müssen Sie in ihrem Browser den Download für mehrere Dateien genehmigen.
6. **Datensatz entfernen**
   > Mit diesem Button löschen Sie einen Datensatz und alle dazugehörigen Ergebnisse.
7. **Alle entfernen**
   > Mit diesem Button entfernen Sie alle Datensätze und setzen das Werkzeug zurück.

### Routing

Mit dem Werkzeug "Routing" kann die kürzeste oder schnellste Route zwischen beliebig vielen Wegpunkten berechnet werden. Zudem ist die Analyse der Erreichbarkeit von einem bestimmten Startpunkt innerhalb einer vorgegebenen Zeit oder Fahrstrecke möglich. Es können hierbei verschiedene Fortbewegungsmittel wie PKW, LKW, Fußgänger, Fahrrad oder Rollstuhl berücksichtigt werden. Durch Klick auf die Tabulatoren (Tab) Routenplanung (1) und Erreichbarkeit (2) kann in die verschiedenen Bereiche gewechselt werden.

![routing_1.png](https://geodienste.hamburg.de/lgv-config/img/routing_1.png)

### Routenplanung

In dem Tab "Routenplanung" können Routen berechnet werden. Zudem ist auch eine massenhafte Berechnung von Routen über eine integrierte Stapelverarbeitung möglich. Zur Routenplanung stehen folgende Eingabemöglichkeiten zur Auswahl:

#### Auswahl Fortbewegungsmittel

![routing_2.png](https://geodienste.hamburg.de/lgv-config/img/routing_2.png)

Es kann zwischen verschiedenen Fortbewegungsmitteln (PKW, LKW etc.) gewählt werden. Das aktive Fortbewegungsmittel ist rot markiert.

#### Hinzufügen von Wegpunkten

Start-, Ziel- und Wegpunkte der Route können über die Eingabe von Orten, Adressen oder Koordinaten in die Suchfelder (1) oder durch Klick in die Karte hinzugefügt werden. Die Erzeugung der Route erfolgt automatisch, sobald mind. zwei Wegpunkte vorhanden sind.

![routing_3.png](https://geodienste.hamburg.de/lgv-config/img/routing_3.png)

Neben der Eingabe von Adressen und Orten (1) ist es auch möglich, direkt geographische Koordinaten (WGS-84) als Wegpunkte in die Suchfelder einzugeben. Hierzu sind die Koordinaten in Dezimalgrad (Länge/Breite) getrennt durch ein Komma und ein Leerzeichen einzugeben. Beispieleingaben:

-   8, 52
-   8.48552, 50.5448
-   8.999, 48.6

#### Sperrflächen

Es besteht die Möglichkeit Sperrflächen (3) zu definieren, welche bei der Routenplanung entsprechend "umfahren" werden. Unter (2) kann der Modus zum Zeichnen und Löschen von Sperrflächen in der Karte aktiviert werden. Der aktivierte Modus wird jeweils rot markiert.

![routing_4.png](https://geodienste.hamburg.de/lgv-config/img/routing_4.png)

#### Routenpräferenz/Verkehrswege vermeiden

Unter (1) kann ausgewählt werden, ob die schnellste oder kürzeste Route berechnet werden soll. Des Weiteren können unter (2) bestimmte Verkehrswege von der Routenberechnung ausgeschlossen werden.

![routing_5.png](https://geodienste.hamburg.de/lgv-config/img/routing_5.png)

#### Wegbeschreibung

Nach der Erzeugung der Route wird eine textuelle Wegbeschreibung (1) (inkl. Entfernung und Fahrzeit) angezeigt. Beim Klick auf einzelne Beschreibungen (2) wird in der Kartenansicht automatisch auf das dazugehörige Routensegment (3) gezoomt.

![routing_6.png](https://geodienste.hamburg.de/lgv-config/img/routing_6.png)

#### Routen - Export

Es ist auch möglich erzeugte Routen für weitere Bearbeitungen (z.B. im GIS oder in Navigationsgeräten) zu exportieren. Hierzu stehen die Formate GEOJSON, KML und GPX zur Verfügung.

![routing_7.png](https://geodienste.hamburg.de/lgv-config/img/routing_7.png)

### Stapelverarbeitung Routing

Unter dem Tab "Routenplanung" ist es auch möglich massenhafte Berechnungen von Fahrzeiten und Distanzen zu Routen durchzuführen. Hierzu muss die Checkbox "Stapelverarbeitung" (1) aktiviert werden. Hiernach kann eine CSV-Datei mit Start- und Endpunkten per Drag and Drop (2) oder über eine Dateiauswahl (3) in die Applikation geladen werden. Die CSV-Datei muss dabei folgende Formatierung und Struktur aufweisen:

![routing_8.png](https://geodienste.hamburg.de/lgv-config/img/routing_8.png)

- CSV-Format / UTF8 Encoding

- Koordinaten der Start- und Endpunkte in WGS84 (EPSG:4326)

- Separierung der Werte durch Semikolon ";" und Dezimaltrenner ist der Punkt "."

- Struktur: ID;lon(Startpunkt);lat(Startpunkt);lon(Endpunkt);lat(Endpunkt)

- Beispiel: 1;8.12;50.67;9.12;51.67

* * * * *

Nach dem erfolgreichen Upload der Datei beginnt automatisch die Berechnung der Fahrzeiten und Distanzen zu den einzelnen Start- und Endpunkten. Hierbei werden die im Tab "Routenplanung" ausgewählten Einstellungen (Fortbewegungsmittel, Verkehrswege vermeiden usw.) verwendet. Der Fortschritt der Verarbeitung kann in der Oberfläche (1) eingesehen werden. Nach der erfolgreichen Verarbeitung wird automatisch eine Ergebnisdatei (CSV-Datei) heruntergeladen. Sollten einzelne Routen nicht berechnet werden können, wird eine Leerzeile (ID;;;;;;;) in der Ergebnisdatei (3) ausgegeben und eine entsprechende Fehlermeldung (2) nach der Stapelverarbeitung ausgegeben.

![routing_9.png](https://geodienste.hamburg.de/lgv-config/img/routing_9.png)

Die Ergebnisdatei (3) enthält dann Angaben zur benötigten Zeit (in Minuten) und Entfernung (in Meter) zur Route zwischen dem Start- und Endpunkt sowie zum gewählten Fortbewegungsmittel (Profil).

### Erreichbarkeit

In dem Tab "Erreichbarkeit" können Analysen zur Erreichbarkeit von einer geographischen Position (Startpunkt) aus innerhalb von vorgegebenen Zeiten oder Entfernungen durchgeführt werden. Als Ergebnis der Berechnung werden dann Erreichbarkeitszonen (Polygone) ausgeben bzw. in der Kartenansicht dargestellt. Zur Erreichbarkeit stehen folgende Eingabemöglichkeiten zur Auswahl:

#### Auswahl Fortbewegungsmittel

![routing_2.png](https://geodienste.hamburg.de/lgv-config/img/routing_2.png)

Es kann zwischen verschiedenen Fortbewegungsmitteln (PKW, LKW etc.) gewählt werden. Das aktive Fortbewegungsmittel ist rot markiert.

#### Hinzufügen des Startpunktes

Startpunkte können über die Eingabe von Orten, Adressen oder Koordinaten in das Suchfeld (1) oder durch Klick in die Karte hinzugefügt werden.

![routing_10.png](https://geodienste.hamburg.de/lgv-config/img/routing_10.png)

Neben der Eingabe von Adressen und Orten (1) ist es auch möglich, direkt geographische Koordinaten (WGS-84) als Wegpunkte in die Suchfelder einzugeben. Hierzu sind die Koordinaten in Dezimalgrad (Länge/Breite) getrennt durch ein Komma und ein Leerzeichen einzugeben. Beispieleingaben:

-   8, 52
-   8.48552, 50.5448
-   8.999, 48.6

#### Optimierung nach/Verkehrswege vermeiden

Unter (1) kann ausgewählt werden, ob die Erreichbarkeit anhand vorgegebener Zeiten (in min) oder Entfernungen (in km) berechnet werden soll. Des Weiteren können unter (2) bestimmte Verkehrswege von der Erreichbarkeitsberechnung ausgeschlossen werden.

![routing_11.png](https://geodienste.hamburg.de/lgv-config/img/routing_11.png)

#### Intervalle und maximale Distanz

Über die Schieberegler Maximale Reisedauer/Entfernung (1) und Intervall (2) kann ausgewählt werden, welche Erreichbarkeiten für den Startpunkt berechnet werden sollen. Die Einstellung Maximale Reisedauer/Entfernung (1) gibt hierbei die maximale Erreichbarkeit an. Über den Schieberregler Intervall (2) kann bestimmt werden, wie viele weitere Erreichbarkeitszonen innerhalb der maximalen Reisedauer/Entfernung bestimmt werden sollen. Z.B. werden bei einer gewählten maximalen Reisedauer von 60 min und einem gewählten Intervall von 15 min vier Erreichbarkeitszonen (15, 30, 45, 60 min) berechnet.

![routing_12.png](https://geodienste.hamburg.de/lgv-config/img/routing_12.png)

#### Berechnung durchführen

Mit Klick auf den Button "Berechnen" (1) wird die Erreichbarkeitsanalyse durchgeführt. Sobald die Berechnung abgeschlossen ist, werden die berechneten Erreichbarkeitszonen (2) in der Kartenansicht dargestellt. Über die Legende (3) in der Oberfläche können weitere Informationen zu den Erreichbarkeitszonen eingesehen werden.

![routing_13.png](https://geodienste.hamburg.de/lgv-config/img/routing_13.png)

#### Export von Erreichbarkeitszonen

Es ist auch möglich die erzeugten Erreichbarkeitszonen für weitere Bearbeitungen (z.B. im GIS) zu exportieren. Hierzu stehen die Formate GEOJSON und KML zur Verfügung.

![routing_7.png](https://geodienste.hamburg.de/lgv-config/img/routing_7.png)

### Stapelverarbeitung Erreichbarkeit

Unter dem Tab "Erreichbarkeit" ist es auch möglich massenhafte Berechnungen von Erreichbarkeiten durchzuführen. Hierzu muss die Checkbox "Stapelverarbeitung" (1) aktiviert werden. Hiernach kann eine CSV-Datei mit Startpunkten per Drag and Drop (2) oder über eine Dateiauswahl (3) in die Applikation geladen werden. Die CSV-Datei muss dabei folgende Formatierung und Struktur aufweisen:

![routing_14.png](https://geodienste.hamburg.de/lgv-config/img/routing_14.png)

- CSV-Format / UTF8 Encoding

- Koordinaten der Startpunkte in WGS84 (EPSG:4326)

- Separierung der Werte durch Semikolon ";" und Dezimaltrenner ist der Punkt "."

- Struktur: ID;lon(Startpunkt);lat(Startpunkt)

- Beispiel: 1;8.12;50.67

* * * * *

Nach dem Upload der Datei beginnt automatisch die Berechnung Erreichbarkeiten zu den einzelnen Startpunkten. Hierfür werden die im Tab "Erreichbarkeit" ausgewählten Einstellungen (Fortbewegungsmittel, Reisedauer, Intervall usw.) verwendet. Der Fortschritt der Verarbeitung kann in der Oberfläche (1) eingesehen werden. Nach der erfolgreichen Verarbeitung wird automatisch eine Ergebnisdatei mit Polygonen zu den Erreichbarkeitszonen im GEOJSON-Format heruntergeladen. Sollten einzelne Erreichbarkeiten nicht berechnet werden können, wird in der GEOJSON-Datei jeweils ein Punktfeature mit den Koordinaten des Startpunktes und der Fehlermeldung erzeugt und eine entsprechende Fehlermeldung (2) wird nach der Stapelverarbeitung ausgegeben.

![routing_15.png](https://geodienste.hamburg.de/lgv-config/img/routing_15.png)

Die erzeugte GEOJSON-Datei enthält dann die berechneten Geometrien (Polygone) der einzelnen Erreichbarkeiten sowie dazugehörige Informationen (wie z.B. ID, Distanz oder Zeit, gewähltes Fortbewegungsmittel, Intervall) als Attribute (2). Die heruntergeladene Datei kann direkt zur weiteren Bearbeitung in GIS-Systeme (z.B. QGIS) (1) eingebunden werden.

![routing_16.png](https://geodienste.hamburg.de/lgv-config/img/routing_16.png)
# Running CoSI locally

## Assumptions
- running iOS.
- (npm installed via homebrew)
- nvm installed
- git installed
- You have a Bitbucket account and access to the following repositories (if you do not have access, currently the developers at LGV can grant you access):
	- https://bitbucket.org/geowerkstatt-hamburg/masterportal
	- https://bitbucket.org/geowerkstatt-hamburg/addons
	- https://bitbucket.org/geowerkstatt-hamburg/portalconfigs
- You have your git authentication set up in your command line using an access token


## Qickstart
Run this in terminal:

```
git clone https://bitbucket.org/geowerkstatt-hamburg/masterportal
cd masterportal
git checkout dev

rm -r addons

git clone https://bitbucket.org/geowerkstatt-hamburg/addons addons
git clone https://bitbucket.org/geowerkstatt-hamburg/portalconfigs

cd addons
git checkout dev
cd ../portal
git checkout dev
cd ..

nvm install 16.16.0
nvm use 16.16.
node -v

npm install

cd addons
npm run postinstall
cd ..

npm start
```
After some compile time, CoSI should run at https://localhost:9001/portal/cosi



Cosi consists of three repositories. They are available on Bitbucket (private repos, owned by the city). There is also a fork on Github (privated repos, owned by the CityScienceLab github organisation). The three repos are: 
1. The `masterportal` (https://bitbucket.org/geowerkstatt-hamburg/masterportal)
2. Two folders of the masterportal are replaced by another repository each. These folders are set to be (git)ignored by the masterportal repository.
	1. the `addons` folder in masterportal is replaced by
		1. https://bitbucket.org/geowerkstatt-hamburg/addons
	2. the `portal` folder in masterportal is replaced by https://bitbucket.org/geowerkstatt-hamburg/portalconfigs
3. on all repositories we work on the branch called `cosi/dev` (not `dev`)

So we clone the masterportal repo first and get on the right branch
Delete folders to be replaced with the other two repos
download relevant repos as these folders
- `geowerkstatt-hamburg/addons` as `addons`
- `geowerkstatt-hamburg/portalconfigs` as `portal`
Switch to the relevant branches
Set up Node and Install. You might need to use a specific node version. On 24.08.22 it's `16.16.0` .
Then install the masterportal node dependencies (in masterportal root folder):

Cosi consists of multiple nested node apps. For each, the dependencies have to be installed. there is a costum script `postinstall` to do this correctly (defined in /addons/package.json) that can be executed when in the addons folder.


# More Developer Documentation (under construction)


## Development Workflow

### Git Branching Model

- in all three repositories, development should happen in feature branches. After a code review, and if all unit tests pass, these changes go direclty into the `dev` branch (which is the branch that is in production).
- adding a new feature:
	- open a ticket on jira (jira.geowerkstatt-hamburg.de). On the ticket, you can create a branch for your feature
	- `git checkout FEATURE_BRANCH_NAME` to switch to that new branch locally
	- `git commit -m "commit message"` to commit your changes to that feature branch
	- `npm run test:cosi` when your code is ready, make sure all unit tests pass with (see TDD section)
	- `git rebase dev` your branch to be ahead of the `dev` branch. [more](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)
	- fix any merge conflicts and run all unit tests again
	- create a pull request on jira, and assign someone to review your code
	- make changes as discussed with the reviewer
	- The person who reviews the code can then accept your pull request to the dev branch.
	- `git merge -ff` when accepting a pull request, make sure to merge with fast forward. That way (together with `rebase`), your changes will appear as a single commit at the time when your feature appears on the dev branch.
	- `git checkout dev` go back to the dev branch
	- `git pull` the changes that happened
	- `git branch -d FEATURE_BRANCH_NAME` delete the feature branch
	- done!




### IDE setup

- This documentation assumes you're using VSCode as your IDE
	- Download VScode
	- install Plugins
		- eslint
		- vue
- To ensure the linter (checks coding rules are fulfilled) works, add the path to your masterportal root folder to the visual studio code `settings.json` file under `eslint.workingDirectories`

 
 ## TDD
- Understanding Tests
	- have a look at "vue test utils"
	- 
- Writing Tests
	- make tests short - test one thing at a time
	- test only internal components (i.e. not functioning of a third party api)
	- test only the smallest components, not end-to-end
	- tests for 
		- dom
		- computed properties
		- user interactions
	- as an example for how tests should look like, see districtselector
- Running tests
		- there is a command set up to run only the cosi tests: `test:cosi 

 

## Developer Rules & Pre-push Hooks

- Lint
- 
- 

## Resources
- code documentation generated in masterportal `npm run buildJsDoc`
- CoSI user documentation: https://github.com/citysciencelab/cosi/tree/master/cosi
- Masterportal Developer Documentation
- Class documentation in cosi/cosi/MODULE-NAME/doc

# Stack
- the open source project "masterportal" is the foundation. It runs on
	- Node
	- Vue
		- vuetifyjs


## Architecture
- Entry point:
	- `npm start` runs `masterportal/js/app.js`. everthing else flows from there.
# CoSI – Cockpit for Social Infrastructure

The [CoSI protoype](https://github.com/citysciencelab/cosi-prototype) was developed in 2019 by the CityScienceLab as a proof of concept.
The prototype has since been adapted to work in the [Urban Data Platform](http://www.urbandataplatform.hamburg/) environment and is now based on the [Masterportal](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src) (Hamburg's Urban Data Platform Web-Gis) code.

CoSI is a web-GIS application currently evolving towards a planning support system for social infrastructure planners.
CoSI offers a variety of analysis and simulation modules
![CoSI modules](https://user-images.githubusercontent.com/36763878/115524695-b2938480-a28e-11eb-9995-4779489f1722.png)
Find the complete manual [here](./README.md) or for each module individually in the [manuals directory](./manuals).

CoSI Promo Video
![CoSI Project Promo](https://www.youtube.com/watch?v=zlztDnZ4FyU)

Video of the protoype
![CoSI Prototype Video](https://drive.google.com/uc?export=view&id=1ABGo_bBoE5uny4XcFliBhZcMwl8oUy8z)
[Clicke here](https://drive.google.com/file/d/id=1ABGo_bBoE5uny4XcFliBhZcMwl8oUy8z/view?usp=sharing) if the video doesn't load.

CoSI Publications :
https://www.researchgate.net/publication/344340813_Cockpit_Social_Infrastructure_-_Developing_a_planning_support_system_in_Hamburg
International Journal of E-Planning Research (IJEPR): currently in review

CoSI is also mentioned in the 'Digital Strategy for Hamburg':
https://www.hamburg.de/contentblob/14924946/e80007b350f1abdc455cfaea7e8cd76c/data/download-digitalstrategie-englisch.pdf


# Documentation - tbc

This file is added to "masterportal" repo to keep the "empty" addons folder. The addons folder is needed by webpack.

In case you need to clone an "addons" repository inside this folder, do the following:

1: Because cloning into a non empty folder is not allowed, DELETE THIS FILE BEFORE CLONING any repository inside this folder.

2: Clone the desired repository

3: Revert the deletion after cloning is finished.
