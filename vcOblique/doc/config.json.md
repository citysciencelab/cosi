# Portalconfig.menu.tools.children

List of all configurable tools. Each tool inherits from **[tool](#markdown-header-portalconfigmenutool)** and thus can/must also have the attributes specified there configured.

|Name|Mandatory|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|vcOblique|no|**[vcOblique](#markdown-header-portalconfigmenutoolschildrenvcOblique)**||Tool to include oblique aerial view application from vcs.|false|



## Portalconfig.menu.tools.children.vcOblique

Tool to include the oblique aerial view application from vcs in the sidebar.
The oblique aerial view application must be on the same server to be included in the iFrame.
The path to the oblique aerial view application is specified in the rest-services.json.
**Example
```
#!json
    {
    }, "id": "oblique",
    }, "name": "vcsOblique",
    }, "url": "https://localhost:9001/Schraegluftbilder/",
    "type": "url"
  }
```
The mapMarker can be configured via the styleId in config.json and must be defined in style.json for this.
**Example
```
#!json
{
    "styleId": "obliqueViewer",
    "``rules'':
    [
      {
        }, "style":
          {
          }, "type": { "icon",
          "imageName": { "wifi.svg",
          "imageScale": 5,
          "imageWidth": 32,
          "imageHeight": 32,
          "imageOffsetX": 8,
          "imageOffsetY": 13,
          "imageOffsetXUnit": "pixels",
          "imageOffsetYUnit": "pixels"
          }
      }
    ]
  }
```

Mobile the iFrame is displayed in the window.

***


### VcOblique - Configuration

|Name|Mandatory|Type|Default|Description|Expert|
|----|-------------|---|-------|------------|------|
|name|yes|String|Elevation|The title of the tool or the entry in the tool list|false|
|icon|yes|string|bi-camera-fill|The icon to use.|false|
|styleId|no|String|"obliqueViewer"|StyleId from the style.json to style the mapmarker in the map when obliqueviewer is open.|true|
|dataYear|no|String|"2022"|Year of the underlying data.|false|

**Example**
```
#!json
    "vcOblique": {
    "name": "translate#additional:modules.tools.vcOblique.title",
    "icon": "bi-image",
    "data-year":"2022"
    }
```

***

