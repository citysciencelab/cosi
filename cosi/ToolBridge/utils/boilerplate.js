// // boilerplates for making a new tool compatible with toolBridge
// // This is the code that goes into the external component

// // A) STATE
// // you need to add two variables to the store state:
// /*
// * @property {object} toolBridgeIn: {settings: {}, type: "", outputCallback: ()=>{}} accepts settings from toolBridge (must have a *watcher*)
// * @property {object} toolBridgeOut: {}  pass current settings to toolBridge (must have a *getter*)
// */
// const state = {
//     // ...
//     // ...
//     // these two variables are required to make this addon compatible with the toolBridge addon (for details see toolBridge documentation)
//     toolBridgeIn: {settings: {}, type: "", outputCallback: null}, // accepts settings from toolBridge - must have a *watcher*
//     toolBridgeOut: {},// pass current settings to toolBridge - must have a *getter*
// };


// // B) GETTER for ToolBridgeOut

// const getters = {
//     // ...
//     // ...
//     // ...
//     // this is required to make this addon compatible with the toolBridge addon (see toolBridge documentation).
//     // the definition here must match the input expected by the watcher on the `toolBridgeIn` variable
//     toolBridgeOut: (state) => {
//         return {
//             // something that matches what the toolBridgeIn watcher expects in 'settings'.
//             // for example
//             someVariable: state.someVariable
//         };
//     }
// };


// // C) WATCHER for toolBridgeIn

// toolBridgeIn (newRequest) {
//     /**
//      * 1. update the interface based on the settings received from toolBridge
//      * @param {Object} request the toolBridge request {id:..., settings:{...}}
//      * @returns {Object} (run for side effects only, passes along the request)
//      */
//     const updateInterface = (request) => {
//             // for example
//             // this.someVariable = request.settings.someVariable
//         },
//         /**
//         * 2. run the specific analysis of this addon
//         * @returns {Object} the value of the function that runs the analysis. Depending on the addon, the function that triggers the analysis to run may or may not return the results; if not, we ignore this functions output, and pick the results from the state instead.
//         */
//         runTool = () => {
//             // for example:
//             // return this.runAnalysis();
//         },
//         /**
//         * 3. hand the results back to toolBridge, in the form of: {request: ..., type: ..., result: ...}
//         * @param {Object} request a toolbridge request in the form {settings:{...}, outputCallback:()=>()}
//         * @returns {Object} null (runs for side effects only)
//         */
//         returnResults = () => {
//             return this.$store.commit("Tools/ToolBridge/setReceivedResults", // this is where toolBridge expects requested results to arrive
//                 {
//                     result: this.analysisResults, // change to where results are stored
//                     type: "geoJSON", // see toolBridge docs for supported output types
//                     request: newRequest, // we need to give back the original request as well, leave this as is.
//                     success: true
//                 }
//             );
//         };

//     // Now this runs the three steps, making sure they happen synchronously (so we don't try to return results before analysis is finished)
//     updateInterface(newRequest);
//     runTool().then(returnResults);
//     return null; // we care about the side effects only.

// }

