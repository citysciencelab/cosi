**DashboardManager**

Statistische Datenübersicht.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|name|nein|String|Dashboard|Name des Werkzeuges im Menu.|
|icon|nein|String|bi-speedometer|CSS Klasse des Glyphicons, das vor dem Toolnamen im Menu angezeigt wird.|
|columnHeader|nein|Object|{}|Label von Spalten in Tabelle und exportirter Excel Datei.|

**Beispiel**
```
"dashboard": {
    "name": "Dashboard",
    "icon": "bi-table",
    "columnHeader": {
        "orientationValue": "Orientierungswert"
    }
}
```
