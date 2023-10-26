**TemplateManager**

Mit diesem Tool können Vorlagen zu verschieden Themenkomplexen und Arbeitsfeldern geladen werden. Diese können Fachdatenthemen, aktive Werkzeuge und eine Gebietsauswahl beinhalten.

|Name|Verpflichtend| Typ|Default|Beschreibung|
|----|-------------|----|-------|------------|
|name|nein|String|Gebiet auswählen|Name des Werkzeuges im Menu.|
|icon|nein|String|bi-image|CSS Klasse des Glyphicons, das vor dem Toolnamen im Menu angezeigt wird.|
|toolToOpen|nein|String| |Das Werkzeug, das nach dem Schließen des DistrictSelector geöffnet wird.|
|useImport|nein|Boolean|false|Bietet die Möglichkeit Vorlagen zu importieren.|
|useTemplatesForMapping|nein|Boolean|false|Dadurch wird das 'Mapping' in CoSI mit den Daten aus den Vorlagen überschrieben.|

**Beispiel**
```
"templateManager": {
  "active": true,
  "name": "Vorlagen",
  "toolToOpen": "Dashboard",
  "useImport": false,
  "useTemplatesForMapping": false
```

***
