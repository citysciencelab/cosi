**AccessibilityAnalysis**

Zeigt ein Gebiet auf der Karte an, welches von einem ausgewählten Punkt, entlang einer Route oder ab einer Einrichtung innerhalb einer festgelegten Entfernung erreichbar ist. Die Entfernung kann in Zeit oder in Metern angegeben werden. Die Erreichbarkeit wird abhängig vom Verkehrsmittel berechnet.

|Name|Verpflichtend|Typ|Default|Beschreibung|
|----|-------------|---|-------|------------|
|name|nein|String|Erreichbarkeitsanalyse|Name des Werkzeuges im Menu.|
|icon|nein|String|bi-geo|CSS Klasse des Glyphicons, das vor dem Toolnamen im Menu angezeigt wird.|
|serviceId|nein|String|bkg_ors|Id für den OpenRoute-Dienstes, der für die Erreichbarkeit verwendet wird.|
|fallbackServiceId|nein|String|csl_ors|Id für den OpenRouteService, der als Fallback für die Erreichbarkeit verwendet wird.|


**Beispiel**
```
"accessibilityAnalysis": {
    "name": "Erreichbarkeitsanalyse",
    "serviceId": "bkg_ors",
    "fallbackServiceId": "csl_ors"
},
```
