**DIPAS**

Mit dem DIPAS Werkzeug können alle Beiträge aus laufenden DIPAS Verfahren in der Karte visualisiert, nach verschiedenen Kriterien dargestellt und für alle CoSI-Werkzeuge verfügbar gemacht werden

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|name|nein|String|DIPAS|Name des Werkzeuges im Menu.|
|icon|nein|String|bi-people|CSS Klasse des Glyphicons, das vor dem Toolnamen im Menu angezeigt wird.|
|baseUrl|nein|String|https://beteiligung.hamburg/drupal/dipas-pds/projects|Url der Schnittstelle der DIPAS-Verfahren.|

**Beispiel**
```
 "dipas": {
    "name": "DIPAS Beitrag",
    icon: "bi-people",
    baseUrl: "https://beteiligung.hamburg/drupal/dipas-pds/projects"
}
```
