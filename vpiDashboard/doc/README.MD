## How to install
Steps
1. Add the VpiDashboard to your addons in your masterportal config.js file
2. Add the VpiDashboard addon to your addons in your masterportal config.json file
```json
"vpiDashboard":{
            "name": "translate#additional:modules.tools.vpiDashboard.title",
            "icon": "bi-graph-up",
            "renderToWindow": false,
            "active": true
          },
```
3. You need to add the auth token for the whatalocation.io-API to the config.local.js file.
```javascript
export const DevConfig = {
    whatalocationApi: {
        host: "https://api.whatalocation.io",
        basepath: "/api/v2",
        auth_token: "add here your auth token"
    }
};
```
4. Run your masterportal with
```
npm run start
```

