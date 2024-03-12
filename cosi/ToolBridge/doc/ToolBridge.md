**ToolBridge**

## What toolBridge does

ToolBridge lets you retrieve the current settings of other addons, and later call those addons with the settings to receive some results. It functions as a single point of access to get results from different addons in a standardised way. 


## Usage


### retreive settings

To retrieve settings from different Addons, you need to import the `currentSettings` getter from `ToolBridge`:
```js
// import getter
mapGetters("Tools/ToolBridge", ["currentSettings"])
```

Then you can call the getter like this:
```js
// call getter
my_retreived_addon_settings = currentSettings("SomeAddonName");
// for example:
my_retreived_addon_settings = currentSettings("AccessibilityAnalyis");
```

### Run tool and retrieve results
```js
this.$store.dispatch("Tools/ToolBridge/runTool", {
                toolName: toolName,
                settings: settings,
                outputCallback: outputCallback
            });
```
- `toolName`: the name of the tool/addon you want to run as a character string
- `settings`: the settings you want to use for the tool, as retrieved from `currentSettings` (see above)
- `outputCallback`: a function defining what toolBridge should do with the other tool/addon's result once they are returned.

`this.$store.dispatch(...)` does not return the result. Instead, toolBridge calls whatever function you pass into `outputCallback` on the output.

So for example, this will log the outout to the console once the results are in:

```js
this.$store.dispatch("Tools/ToolBridge/runTool", {
                toolName: "AccessibilityAnalysis",
                settings: settings,
                outputCallback: console.log
            });

```

Or to send the results to a specific store variable:
```js
this.$store.dispatch("Tools/ToolBridge/runTool", {
                toolName: "AccessibilityAnalysis",
                settings: settings,
                outputCallback: (output) => { this.$store.commit("Tools/SomeToolName/someVariable", output) }
            });

```


## Making new addons compatible with toolBridge


To make a new addon accessible through the toolBridge, you need to add the following to that addon:
1. add `toolBridgeIn` and `toolBridgeOut` to your addon's store state.
    1. `toolBridgeOut` hands settings for your tool to other tools via a getter. 
    2. `toolBridgeIn` receives settings from other tools; a watcher on this variable should run your analysis with the received settings and hand back the results to the toolBridge.
2. You should also add the name of your tool as a string to to `supportedTools` array in the toolBridge store (`Tools/ToolBridge/supportedTools`)

*A) add `toolBridgeIn` and `toolBridgeOut` to your addon's store STATE*

```js
const state = {
    // ...
    // ...
    toolBridgeIn: {}, 
    toolBridgeOut: {},
};
```


*B) Add a GETTER for ToolBridgeOut*
This is required to make this addon compatible with the toolBridge addon (see toolBridge documentation).
The definition here must match the input expected by the watcher on the `toolBridgeIn` variable
```js
const getters = {
    toolBridgeOut: (state) => {
        return {
            // your tools current settings
        };
    }
};
```

*C) Add a WATCHER for toolBridgeIn*
The watcher should:
1. update the interface based on the settings received from toolBridge
2. run your addons analysis with these settings
3. hand the results back to toolBridge, in the form of: {request: ..., type: ..., result: ...}

```js
watch: {
    //... ,
    toolBridgeIn (newRequest) {
        
    // first update your settings based on newRequest.settings
    // then run the analysis
    // then return the results like this
    this.$store.commit("Tools/ToolBridge/setReceivedResults", // this is where toolBridge expects requested results to arrive
                    {
                        result: YOUR_ANALYIS_RESULTS,
                        type: "geoJSON", // whats the format of your result
                        request: newRequest // the request as received
                        success:true
                    }
                );
            };

        return null; // we care about the side effects only.

    }
}
```


## Boilerplate code with comments and documentation

*A) add `toolBridgeIn` and `toolBridgeOut` to your addon's store STATE*

```js
// you need to add two variables to the store state:
/*
* @property {object} toolBridgeIn: {settings: {}, type: "", outputCallback: ()=>{}} accepts settings from toolBridge (must have a *watcher*)
* @property {object} toolBridgeOut: {}  pass current settings to toolBridge (must have a *getter*)
*/
const state = {
    // ...
    // ...
    // these two variables are required to make this addon compatible with the toolBridge addon (for details see toolBridge documentation)
    toolBridgeIn: {settings: {}, type: "", outputCallback: null}, // accepts settings from toolBridge - must have a *watcher*
    toolBridgeOut: {},// pass current settings to toolBridge - must have a *getter*
};
```


*B) Add a GETTER for ToolBridgeOut*

```js
const getters = {
    // ...
    // ...
    // ...
    // this is required to make this addon compatible with the toolBridge addon (see toolBridge documentation).
    // the definition here must match the input expected by the watcher on the `toolBridgeIn` variable
    toolBridgeOut: (state) => {
        return {
            // something that matches what the toolBridgeIn watcher expects in 'settings'.
            // for example
            someVariable: state.someVariable
        };
    }
};
```

*C) Add a WATCHER for toolBridgeIn*

```js
watch: {
    toolBridgeIn (newRequest) {
        /**
        * 1. update the interface based on the settings received from toolBridge
        * @param {Object} request the toolBridge request {id:..., settings:{...}}
        * @returns {Object} (run for side effects only, passes along the request)
        */
        const updateInterface = (request) => {
                // for example
                // this.someVariable = request.settings.someVariable
            },
            /**
            * 2. run the specific analysis of this addon
            * @returns {Object} the value of the function that runs the analysis. Depending on the addon, the function that triggers the analysis to run may or may not return the results; if not, we ignore this functions output, and pick the results from the state instead.
            */
            runTool = () => {
                // for example:
                // return this.runAnalysis();
            },
            /**
            * 3. hand the results back to toolBridge, in the form of: {request: ..., type: ..., result: ...}
            * @param {Object} request a toolbridge request in the form {settings:{...}, outputCallback:()=>()}
            * @returns {Object} null (runs for side effects only)
            */
            returnResults = () => {
                return this.$store.commit("Tools/ToolBridge/setReceivedResults", // this is where toolBridge expects requested results to arrive
                    {
                        result: this.analysisResults, // change to where results are stored
                        type: "geoJSON", // see toolBridge docs for supported output types
                        request: newRequest // we need to give back the original request as well, leave this as is.
                        success: true // true if analysis successful
                    }
                );
            };

        // Now this runs the three steps, making sure they happen synchronously (so we don't try to return results before analysis is finished)
        updateInterface(newRequest);
        runTool().then(returnResults);
        return null; // we care about the side effects only.

    }
}
```