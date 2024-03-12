// import {
//     expect
// } from "chai";
// import sinon from "sinon";

// import {
//     registerProjections
// } from "../components/util.js";
// import {Worker} from "../../../utils/isochronesWorker";
// import service, {setWorker, setWorkerFactory} from "../../../store/actionsAccessibilityAnalysis.js";
// // import features from "./featuresPoint.json";
// import featuresRegion from "./featuresRegion.json";
// import GeoJSON from "ol/format/GeoJSON";
// import {initializeLayerList} from "../../../../utils/initializeLayerList";
// import {getAllFeaturesByLayerId} from "../../../../utils/features/getAllFeaturesByLayerId";
// import * as Proj from "ol/proj.js";

// /**
//  * Mock the ORS url
//  * @returns {String} the URL
//  */
// function baseUrl () {
//     return "https://csl-lig.hcu-hamburg.de/ors/v2/";
// }

// const rootGetters = {
//     "Maps/projectionCode": "EPSG:25832"
// };

// before(() => {
//     registerProjections();
//     setWorkerFactory(() => new Worker());
// });

// describe("createIsochrones", () => {
//     it.skip("createIsochrones point", async () => {
//         const commitStub = sinon.stub(),
//             ret = await service.store.actions.getIsochrones({getters: {baseUrl}, commit: commitStub, rootGetters},
//                 {
//                     coordinates: [[10.155828082155567, 53.60323024735499]],
//                     transportType: "driving-car",
//                     scaleUnit: "time",
//                     distance: 10
//                 });

//         sinon.assert.callCount(commitStub, 3);
//         expect(ret.length).to.equal(3);
//         expect(service.store.state.progress).to.equal(0);
//     });

//     it.skip("should cancel first call", async () => {
//         // eslint-disable-next-line require-jsdoc
//         async function act () {
//             return service.store.actions.getIsochrones({getters: {baseUrl}, commit: sinon.stub(), rootGetters},
//                 {
//                     coordinates: [[10.155828082155567, 53.60323024735499]],
//                     transportType: "driving-car",
//                     scaleUnit: "time",
//                     distance: 10
//                 });
//         }

//         let error;

//         act().catch(err => {
//             error = err;
//         });
//         await act();

//         expect(error).to.be.eql({
//             "request_canceled": true,
//             "type": "createIsochrones"
//         });
//     });

//     it.skip("createIsochrones several points", async () => {

//         const commitStub = sinon.stub(),
//             ret = await service.store.actions.getIsochrones({getters: {baseUrl}, commit: commitStub, rootGetters},
//                 {
//                     coordinates: [[10.044398219793916, 53.58614195023027],
//                         [10.00047212535128, 53.59431305465069],
//                         [10.009020188268527, 53.54967920652423],
//                         [10.042859099930093, 53.57695084241739]],
//                     transportType: "driving-car",
//                     scaleUnit: "time",
//                     distance: 10
//                 });

//         expect(new GeoJSON().writeFeatures(ret)).to.be.equal(JSON.stringify(featuresRegion));
//     });

//     it.skip("should fetch and use filter poly", async () => {
//         setWorker(undefined);

//         const ret = await service.store.actions.getIsochrones({
//                 getters: {
//                     batchSize: 2, // with this batch size the hole request would fail without the filter poly
//                     filterUrl: "https://geodienste.hamburg.de/HH_WFS_Verwaltungsgrenzen",
//                     filterFeatureType: "landesgrenze",
//                     baseUrl
//                 },
//                 commit: sinon.stub(),
//                 rootGetters
//             },
//             {
//                 coordinates: [
//                     [9.744273174491198, 53.86052854494209], // outside HH
//                     [10.044398219793916, 53.58614195023027]
//                 ],
//                 transportType: "driving-car",
//                 scaleUnit: "time",
//                 distance: 10
//             }),

//             filterPoly = await service.store.actions.getFilterPoly();

//         expect(filterPoly.type).to.be.equal("Feature");
//         expect(ret.length).to.equal(3);
//     });

//     it.skip("should use filter poly", async () => {
//         setWorker(undefined);

//         const ret = await service.store.actions.getIsochrones({
//                 getters: {
//                     batchSize: 2, // with this batch size the hole request would fail without the filter poly
//                     filterPoly: [
//                         [548365.316, 5916918.107],
//                         [588010.382, 5916918.107],
//                         [588010.382, 5955161.675],
//                         [548365.316, 5955161.675],
//                         [548365.316, 5916918.107]
//                     ], // bbox of HH
//                     baseUrl
//                 },
//                 commit: sinon.stub(),
//                 rootGetters
//             },
//             {
//                 coordinates: [
//                     [9.744273174491198, 53.86052854494209], // outside HH
//                     [10.044398219793916, 53.58614195023027]
//                 ],
//                 transportType: "driving-car",
//                 scaleUnit: "time",
//                 distance: 10
//             }),

//             filterPoly = await service.store.actions.getFilterPoly();

//         expect(filterPoly.type).to.be.equal("Feature");
//         expect(ret.length).to.equal(3);
//     });

//     it.skip("createIsochrones point error", async () => {
//         const commitStub = sinon.stub(),
//             ret = await service.store.actions.getIsochrones({getters: {baseUrl}, commit: commitStub, rootGetters},
//                 {
//                     coordinates: [[9.744273174491198, "b"]],
//                     transportType: "driving-car",
//                     scaleUnit: "time",
//                     distance: 10
//                 });

//         expect(ret.length).to.equal(0);
//     });
//     it.skip("should not fail if one point is outside hamburg", async () => {
//         const commitStub = sinon.stub(),
//             ret = await service.store.actions.getIsochrones({getters: {batchSize: 1, baseUrl}, commit: commitStub, rootGetters},
//                 {
//                     coordinates:
//                         [
//                             [9.744273174491198, 53.86052854494209], // outside HH
//                             [10.044398219793916, 53.58614195023027],
//                             [10.00047212535128, 53.59431305465069],
//                             [10.009020188268527, 53.54967920652423],
//                             [10.042859099930093, 53.57695084241739]
//                         ],
//                     transportType: "driving-car",
//                     scaleUnit: "time",
//                     distance: 10
//                 });

//         expect(ret.length).to.equal(3);
//     });
//     it.skip("should return empty list if all points outside hamburg", async () => {
//         const commitStub = sinon.stub(),
//             ret = await service.store.actions.getIsochrones({getters: {batchSize: 1, baseUrl}, commit: commitStub, rootGetters},
//                 {
//                     coordinates:
//                         [
//                             [9.744273174491198, 53.86052854494209], // outside HH
//                             [9.744273174491198, 53.86052854494209] // outside HH
//                         ],
//                     transportType: "driving-car",
//                     scaleUnit: "time",
//                     distance: 10
//                 });

//         expect(ret).to.be.eql([]);
//     });
//     it.skip("should create isochrones for alle schulen hamburg", async function () {
//         this.timeout(205000);

//         await initializeLayerList();

//         const commitStub = sinon.stub(),
//             allFeatures = await getAllFeaturesByLayerId("1732"),
//             coords = allFeatures.map(f => Proj.transform(f.getGeometry().flatCoordinates.slice(0, 2), "EPSG:25832", "EPSG:4326")),

//             ret = await service.store.actions.getIsochrones({getters: {batchSize: 10, baseUrl}, commit: commitStub, rootGetters},
//                 {
//                     coordinates: coords,
//                     transportType: "driving-car",
//                     scaleUnit: "time",
//                     distance: 10
//                 });

//         expect(ret.length).to.equal(3);
//     });
// });
