**AreaSelector**

Mit Hilfe dieses Werkzeuges können Sie ein Polygon auf der Karte zeichnen. Darin werden die ausgewählten Fachdaten angezeigt. Einrichtungen oder andere Fachdatenmarker, die außerhalb dieses Polygons liegen, werden ausgeblendet.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|name|nein|String|Manuelle Flächenauswahl für Fachdaten|Name des Werkzeuges im Menu.|
|icon|nein|String|bi-bounding-box-circles|CSS Klasse des Glyphicons, das vor dem Toolnamen im Menu angezeigt wird.|


**Beispiel**
```
"accessibilityAnalysis": {
    "name": "Manuelle Flächenauswahl für Fachdaten",
    icon: "bi-bounding-box-circles"
},
```
