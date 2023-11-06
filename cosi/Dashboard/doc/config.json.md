**DashboardManager**

Statistische Datenübersicht.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|name|nein|String|Dashboard|Name des Werkzeuges im Menu.|
|icon|nein|String|bi-speedometer|CSS Klasse des Glyphicons, das vor dem Toolnamen im Menu angezeigt wird.|
|columnHeader|nein|Object|{}|Label von Spalten in Tabelle und exportirter Excel Datei.|
|prefixExportFilename|nein|String|Cosi|Der Prefix der für den Export der Excel Tabelle benutzt wird.|
|exportGrouped|nein|Boolean|false|Wenn der Parameter auf `true` gesetzt ist, wird beim Export für jede Gruppe im Dashboard ein Excel-Sheet erstellt und die Gruppe verschwindet beim Export aus den Spalten.|

**Beispiel**
```
"dashboard": {
    "name": "Dashboard",
    "icon": "bi-table",
    "columnHeader": {
        "orientationValue": "Orientierungswert"
    }
    "prefixExportFilename": "Cosi",
    "exportGrouped": true
}
```
