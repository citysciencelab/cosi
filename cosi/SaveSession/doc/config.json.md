**SaveSession**

Mit dem Dienst Sitzung speichern/laden können aktuelle diverse Informationen der aktuellen Arbeitssitzung abgespeichert werden um diese zu einem späteren Zeitpunkt wieder öffnen und weiterbearbeiten zu können. Dies umfasst:

* Die ausgewählte Verwaltungsebene und ausgewählte Gebiete
* Aktive Fachdatenthemen
* Mit den Simulationswerkzeugen erstellte Szenarien
* Ergebnisse und Konfigurationen der Werkzeuge Erreichbarkeitsanalyse und Versorgungsanalyse

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|name|nein|String|Sitzung speichern|Name des Werkzeuges im Menu.|
|icon|nein|String|bi-save|CSS Klasse des Glyphicons, das vor dem Toolnamen im Menu angezeigt wird.|

**Beispiel**
```
"SaveSession": {
  "name": "Sitzung speichern",
  "icon": "bi-save"
}
```
