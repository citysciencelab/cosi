#### Portalconfig.menu.tool.statisticDashboard

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|name|ja|String|"translate#common:menu.tools.statisticDashboard"|Der Name des StatisticDashboard Werkzeug.|false|
|icon|nein|String|"bi-speedometer"|Das Icon des Tools.|false|
|colorScheme|ja|**[colorScheme](#markdown-header-portalconfigmenutoolstatisticDashboardcolorScheme)**|""|Definiert die Farben der Features in statisticdashboard.|false|
|active|nein|Boolean|false|Wenn `true`, wird das Tool nach der Initialisierung des Portals geöffnet.|false|
|data|ja|**[data](#markdown-header-portalconfigmenutoolstatisticDashboarddata)**|""|Daten für das statistic Dashboard Werkzeug.|false|

**Example**
```json
{
    "name": "translate#common:menu.tools.statisticDashboard",
    "icon": "bi-speedometer",
    "colorScheme": {
        "referenceRegion": [155, 155, 155, 0.7],
        "comparisonMap": [[198, 219, 239, 0.9], [158, 202, 225, 0.9], [107, 174, 214, 0.9], [49, 130, 189, 0.9], [8, 81, 156, 0.9]],
        "differenceMap": [[210, 226, 27, 0.9], [122, 209, 81, 0.9], [84, 197, 104, 0.9], [34, 168, 132, 0.9], [35, 136, 142, 0.9]],
        "lineCharts": [[74, 0, 30, 1], [117, 18, 50, 1], [189, 47, 83, 1], [198, 81, 84, 1], [228, 121, 97, 1], [240, 168, 130, 1], [250, 212, 172, 1], [157, 185, 171, 1], [137, 192, 196, 1], [87, 158, 185, 1],
            [57, 122, 168, 1], [28, 87, 150, 1], [22, 55, 113, 1], [16, 25, 77, 1], [118, 199, 190, 1], [62, 168, 166, 1], [32, 130, 136, 1], [0, 73, 75, 1], [224, 110, 133, 1], [204, 65, 90, 1]]
    },
    "active": true,
    "data": {
        "layerId": "28992",
        "geometryAttribute": "geom",
        "chartDirectionValue": 10,
        "timeStepsFilter": {
            "5": "Die letzten 5 Jahre",
            "10": "Die letzten 10 Jahre",
            "all": "Alle Jahre"
        },
        "mappingFilter": {
            "timeAttribute": {
                "attrName": "zeitpunkt",
                "name": "Zeitpunkt",
                "inputFormat": "YYYY-MM-DD",
                "outputFormat": "YYYY"
            },
            "regionNameAttribute": {
                "attrName": "statistisches_gebiet",
                "name": "Statistisches Gebiet"
            },
            "statisticsAttributes": {
                "arbeitnehmer_inland_tausend": {
                    "name": "Arbeitnehmer (Inland) in 1.000",
                    "category": "Beschäftigte"
                },
                "arbeitslose_jahresdurchschnitt": {
                    "name": "Arbeitslose",
                    "category": "Beschäftigte"
                },
                "arbeitslose_15_bis_u25_jahresdurchschnitt": {
                    "name": "Arbeitslose 15 bis unter 25 Jahre",
                    "category": "Beschäftigte"
                },
                "einwohner_ab_65": {
                    "name": "Einwohner 65 Jahre und älter",
                    "category": "Bevölkerung"
                },
                "einwohner_ab_65_prozent_aller_einwohner": {
                    "name": "Einwohner 65 Jahre und älter in % aller Einwohner",
                    "category": "Bevölkerung"
                },
                "einwohner_auslaender": {
                    "name": "Einwohner Ausländer",
                    "category": "Bevölkerung"
                }
            }
        }
    }
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.colorScheme

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|referenceRegion|ja|Float[]|[]|Die RGBA-Farbe der Referenzregions.|false|
|comparisonMap|ja|Float[]|[]|Die Liste mit den RGBA-Farben der Vergleichskarte.|false|
|differenceMap|ja|Float[]|[]|Die Liste mit den RGBA-Farben der Differenzkarte.|false|
|lineCharts|ja|Float[]|[]|Die Liste mit den RGBA-Farben der Liniendiagramme.|false|

**Example**
```json
{
        "referenceRegion": [155, 155, 155, 0.7],
        "comparisonMap": [[198, 219, 239, 0.9], [158, 202, 225, 0.9], [107, 174, 214, 0.9], [49, 130, 189, 0.9], [8, 81, 156, 0.9]],
        "differenceMap": [[210, 226, 27, 0.9], [122, 209, 81, 0.9], [84, 197, 104, 0.9], [34, 168, 132, 0.9], [35, 136, 142, 0.9]],
        "lineCharts": [[74, 0, 30, 1], [117, 18, 50, 1], [189, 47, 83, 1], [198, 81, 84, 1], [228, 121, 97, 1], [240, 168, 130, 1], [250, 212, 172, 1], [157, 185, 171, 1], [137, 192, 196, 1], [87, 158, 185, 1],
            [57, 122, 168, 1], [28, 87, 150, 1], [22, 55, 113, 1], [16, 25, 77, 1], [118, 199, 190, 1], [62, 168, 166, 1], [32, 130, 136, 1], [0, 73, 75, 1], [224, 110, 133, 1], [204, 65, 90, 1]]
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.data

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|------|------------|------|
|layerId|ja|String|""|Die ID des Layers.|false|
|geometryAttribute|ja|String|""|Typ des Geometrieattributs.|false|
|chartDirectionValue|nein|String|""|Gibt die Anzahl an, ab der die Balken im Diagramm von vertikal zu horizontal wechseln.|false|
|timeStepsFilter|yes|**[timeStepsFilter](#markdown-header-portalconfigmenutoolstatisticDashboarddatatimeStepsFilter)**|""|Ein Objekt welches aus Schlüsseln und Werten besteht bei denen der Schlüssel die Anzahl an Zeitgruppierungen und der Wert die Beschreibung für die Gruppierung beinhaltet.|false|
|mappingFilter|ja|**[mappingFilter](#markdown-header-portalconfigmenutoolstatisticDashboarddatamappingFilter)**|""|Dieses Objekt beinhaltet Attribute, die dazu dienen die Filter mit den Werten zu befüllen.|false|

**Example**
```json
{
    "layerId": "28992",
    "geometryAttribute": "geom",
    "chartDirectionValue": 10,
    "timeStepsFilter": {
        "5": "Die letzten 5 Jahre",
        "10": "Die letzten 10 Jahre",
        "all": "Alle Jahre"
    },
    "mappingFilter": {
        "timeAttribute": {
            "attrName": "zeitpunkt",
            "name": "Zeitpunkt",
            "inputFormat": "YYYY-MM-DD",
            "outputFormat": "YYYY"
        },
        "regionNameAttribute": {
            "attrName": "statistisches_gebiet",
            "name": "Statistisches Gebiet"
        },
        "statisticsAttributes": {
            "arbeitnehmer_inland_tausend": {
                "name": "Arbeitnehmer (Inland) in 1.000",
                "category": "Beschäftigte"
            },
            "arbeitslose_jahresdurchschnitt": {
                "name": "Arbeitslose",
                "category": "Beschäftigte"
            },
            "arbeitslose_15_bis_u25_jahresdurchschnitt": {
                "name": "Arbeitslose 15 bis unter 25 Jahre",
                "category": "Beschäftigte"
            },
            "einwohner_ab_65": {
                "name": "Einwohner 65 Jahre und älter",
                "category": "Bevölkerung"
            },
            "einwohner_ab_65_prozent_aller_einwohner": {
                "name": "Einwohner 65 Jahre und älter in % aller Einwohner",
                "category": "Bevölkerung"
            },
            "einwohner_auslaender": {
                "name": "Einwohner Ausländer",
                "category": "Bevölkerung"
            }
        }
    }
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.data.timeStepsFilter

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|key:value|ja|String|""|Key: Der Schlüssel ist die Anzahl des letzten "key"-Eintrags für Dropdown-Optionen. Value: Die Beschreibung für die Gruppierung.|false|
|all:value|ja|String|""|Key: Das Schlüsselwort für die Auswahl aller Einträge für Dropdown-Optionen. Value: Die Beschreibung für die Gruppierung.|false|

**Example**
```json
{
	"5": "Die letzten 5 Jahre",
	"10": "Die letzten 10 Jahre",
	"all": "Alle Jahre"
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.data.mappingFilter

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|timeAttribute|ja|**[timeAttribute](#markdown-header-portalconfigmenutoolstatisticDashboardmappingFiltertimeAttribute)**|""|Dieses Objekt beinhaltet das Attribut für die Zeit-Filter.|false|
|regionNameAttribute|ja|**[regionNameAttribute](#markdown-header-portalconfigmenutoolstatisticDashboardmappingFilterregionNameAttribute)**|""|Dieses Objekt beinhaltet das Attribut für den Namen der Region.|false|
|statisticsAttributes|ja|**[statisticsAttributes](#markdown-header-portalconfigmenutoolstatisticDashboardmappingFilterstatisticsAttributes)**|""|Dieses Objekt beinhaltet attribute, die dazu dienen die Karte nach deren Werten zu filtern.|false|

**Example**
```json
{
	"timeAttribute": {
		"attrName": "zeitpunkt",
		"name": "Zeitpunkt",
		"inputFormat": "YYYY-MM-DD",
		"outputFormat": "YYYY"
	},
	"regionNameAttribute": {
		"attrName": "statistisches_gebiet",
		"name": "Statistisches Gebiet"
	},
	"statisticsAttributes": {
		"arbeitnehmer_inland_tausend": {
			"name": "Arbeitnehmer (Inland) in 1.000",
			"category": "Beschäftigte"
		},
		"arbeitslose_jahresdurchschnitt": {
			"name": "Arbeitslose",
			"category": "Beschäftigte"
		},
		"arbeitslose_15_bis_u25_jahresdurchschnitt": {
			"name": "Arbeitslose 15 bis unter 25 Jahre",
			"category": "Beschäftigte"
		},
		"einwohner_ab_65": {
			"name": "Einwohner 65 Jahre und älter",
			"category": "Bevölkerung"
		},
		"einwohner_ab_65_prozent_aller_einwohner": {
			"name": "Einwohner 65 Jahre und älter in % aller Einwohner",
			"category": "Bevölkerung"
		},
		"einwohner_auslaender": {
			"name": "Einwohner Ausländer",
			"category": "Bevölkerung"
		}
	}
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.data.mappingFilter.timeAttribute

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|attrName|ja|String|""|Das Attribut für die Zeit-Filter.|false|
|name|nein|String|""|Die Bezeichnung des Attributes.|false|
|inputFormat|nein|String|""|Eingabeformat|false|
|outputFormat|nein|String|""|Ausgabeformat|false|

**Example**
```json
{
    "attrName": "zeitpunkt",
    "name": "Zeitpunkt",
    "inputFormat": "YYYY-MM-DD",
    "outputFormat": "YYYY"
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.data.mappingFilter.regionNameAttribute

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|attrName|ja|String|""|Das Attribut für die Region.|false|
|name|no|String|""|Der Name des Region Attributs.|false|

**Example**
```json
{
    "attrName": "statistisches_gebiet",
    "name": "Statistisches Gebiet"
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.data.mappingFilter.statisticsAttributes

|Name|Verpflichtend|Typ|Default|Beschreibung|Expert|
|----|-------------|---|-------|------------|------|
|key|ja|String|""|Der Schlüssel des statistik Attributes.|false|
|name|ja|String|""|Die Bezeichnung des statistik Attributes.|false|
|Category|ja|String|""|Die Kategorie des statistik Attributes. Wenn die Kategorie gesetzt ist, wird es in der Kategorieauswahl unter dieser Kategorie gruppiert.|false|

**Example**
```json
{
    "arbeitnehmer_inland_tausend": {
        "name": "Arbeitnehmer (Inland) in 1.000",
        "category": "Beschäftigte"
    },
    "arbeitslose_jahresdurchschnitt": {
        "name": "Arbeitslose",
        "category": "Beschäftigte"
    },
    "arbeitslose_15_bis_u25_jahresdurchschnitt": {
        "name": "Arbeitslose 15 bis unter 25 Jahre",
        "category": "Beschäftigte"
    }
}
```

***
