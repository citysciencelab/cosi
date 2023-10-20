#### Portalconfig.menu.tool.statisticDashboard

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|name|yes|String|"translate#common:menu.tools.statisticDashboard"|The Name of the Tool.|false|
|icon|no|String|"bi-speedometer"|The icon of the Tool|false|
|colorScheme|yes|**[colorScheme](#markdown-header-portalconfigmenutoolstatisticDashboardcolorScheme)**|""|Defines the colours of the features in statisticdashboard.|false|
|active|no|Boolean|false|If `true`, the tool is open after initializing the portal.|false|
|data|yes|**[data](#markdown-header-portalconfigmenutoolstatisticDashboarddata)**|""|data for statistic dashboard.|false|

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

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|referenceRegion|yes|Float[]|[]|The RGBA color of the Reference region.|false|
|comparisonMap|yes|Float[]|[]|The list of the RGBA colors of the comparison map.|false|
|differenceMap|yes|Float[]|[]|The list of the RGBA colors of the difference map.|false|
|lineCharts|yes|Float[]|[]|The list of the RGBA colors of the linecharts.|false|

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

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|----|-----------|------|
|layerId|yes|String|""|The id of the Layer.|false|
|geometryAttribute|yes|String|""|Type of the geometry attribute.|false|
|chartDirectionValue|no|String|""|Specifies the number above which the bars in the chart will be switched from vertical to horizontal.|false|
|timeStepsFilter|yes|**[timeStepsFilter](#markdown-header-portalconfigmenutoolstatisticDashboarddatatimeStepsFilter)**|""|An object consisting of keys and values where the key contains the number of time groupings and the value contains the description for the grouping.|false|
|mappingFilter|yes|**[mappingFilter](#markdown-header-portalconfigmenutoolstatisticDashboarddatamappingFilter)**|""|This object contains attributes used to filter the map by its values.|false|

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
|key:value|ja|String|""|Key: The key is the number of the last "key" entry for dropdown options. Value: The description for the grouping.|false|
|all:value|ja|String|""|Key: The keyword for selecting all entries for dropdown options. Value: The description for the grouping.|false|

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

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|timeAttribute|yes|**[timeAttribute](#markdown-header-portalconfigmenutoolstatisticDashboardmappingFiltertimeAttribute)**|""|The attribute for the time filter.|false|
|regionNameAttribute|yes|**[regionNameAttribute](#markdown-header-portalconfigmenutoolstatisticDashboardmappingFilterregionNameAttribute)**|""|The attribute for the name of the region.|false|
|statisticsAttributes|yes|**[statisticsAttributes](#markdown-header-portalconfigmenutoolstatisticDashboardmappingFilterstatisticsAttributes)**|""|Attributes used to filter the map by its values.|false|

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

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|attrName|yes|String|""|The attribute for the time filters.|false|
|name|no|String|""|The name of the attribute.|false|
|inputFormat|no|String|""|Input Format|false|
|outputFormat|no|String|""|Output Format|false|

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

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|attrName|yes|String|""|The attribute of the region.|false|
|name|no|String|""|The name of the region attribute.|false|

**Example**
```json
{
    "attrName": "statistisches_gebiet",
    "name": "Statistisches Gebiet"
}
```

***

#### Portalconfig.menu.tool.statisticDashboard.data.mappingFilter.statisticsAttributes

|Name|Required|Type|Default|Description|Expert|
|----|--------|----|-------|-----------|------|
|key|yes|String|""|The key of the Statistic attributes.|false|
|name|yes|String|""|The name of the statisticsAttributes.|false|
|Category|yes|String|""|The category of the statisticsAttributes. If the category is set, it will be grouped under this category in the category selection.|false|

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
