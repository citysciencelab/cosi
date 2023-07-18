import {expect} from "chai";
import Map from "ol/Map.js";
import sinon from "sinon";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList.js";
import actions from "../../../store/actionsAddLayerRemotely";

describe("ADDONS: addlayerRemotely/store/actionsAddLayerRemotely.js", () => {
    let geojson,
        map,
        request,
        trigger;

    beforeEach(() => {
        geojson = {
            "type": "FeatureCollection",
            "features":
            [
                {
                    "type": "Feature",
                    "geometry":
                        {
                            "type": "Point",
                            "coordinates": [10.023374939929553, 53.5356067536243]
                        },
                    "properties": {"epsg": "WGS84"}
                }
            ],
            "styles": [
                {
                    "styleId": "customStyle",
                    "rules": [
                        {
                            "style": {
                                "circleStrokeColor": [255, 0, 0, 1],
                                "circleFillColor": [255, 0, 0, 0.5]
                            }
                        }
                    ]
                }
            ]
        };

        sinon.stub(styleList, "addToStyleList");

        request = sinon.spy(() => ({
            get: () => true
        }));
        trigger = sinon.spy();

        sinon.stub(Radio, "request").callsFake(request);
        sinon.stub(Radio, "trigger").callsFake(trigger);

        map = new Map({
            id: "ol",
            mode: "2D"
        });

        mapCollection.clear();
        mapCollection.addMap(map, "2D");
    });

    afterEach(sinon.restore);

    describe("addGeoJson", () => {
        it("addGeoJson", () => {
            const state = {},
                name = "LayerName",
                id = "LayerID",
                geoJSON = geojson,
                styleId = "customStyle",
                folderName = "tree",
                gfiAttributes = {"test1": "xyz", "test2": "abc"},
                zoomTo = false,
                layer = {
                    type: "layer",
                    name: "LayerName",
                    id: "LayerID",
                    typ: "GeoJSON",
                    geojson: geojson,
                    transparent: true,
                    gfiAttributes: {"test1": "xyz", "test2": "abc"},
                    layerAttribution: "nicht vorhanden",
                    legendURL: "",
                    isBaseLayer: false,
                    isSelected: true,
                    isVisibleInTree: true,
                    cache: false,
                    datasets: [],
                    urlIsVisible: true,
                    styleId: "customStyle",
                    parentId: "tree",
                    gfiTheme: "default"
                };

            actions.addGeoJson({state}, {name, id, geoJSON, styleId, folderName, gfiAttributes, zoomTo});

            expect(request.calledOnce).to.be.true;
            expect(request.firstCall.args[0]).to.equals("Parser");
            expect(request.firstCall.args[1]).to.equals("getTreeType");
            expect(trigger.calledThrice).to.be.true;
            expect(trigger.firstCall.args[0]).to.equals("Parser");
            expect(trigger.firstCall.args[1]).to.equals("addItem");
            expect(trigger.firstCall.args[2]).to.deep.equals(layer);
            expect(trigger.secondCall.args[0]).to.equals("ModelList");
            expect(trigger.secondCall.args[1]).to.equals("addModelsByAttributes");
            expect(trigger.secondCall.args[2]).to.deep.equals({id: "LayerID"});
            expect(trigger.thirdCall.args[0]).to.equals("ModelList");
            expect(trigger.thirdCall.args[1]).to.equals("renderTree");
        });
    });

    describe("toggleLayerVisibility", () => {
        it("toggleLayerVisibility", () => {
            const layerId = "123456";

            actions.toggleLayerVisibility(null, {layerId});

            expect(request.calledOnce).to.be.true;
            expect(request.firstCall.args[0]).to.equals("ModelList");
            expect(request.firstCall.args[1]).to.equals("getModelByAttributes");
            expect(request.firstCall.args[2]).to.deep.equals({id: layerId});
            expect(trigger.calledOnce).to.be.true;
            expect(trigger.firstCall.args[0]).to.equals("ModelList");
            expect(trigger.firstCall.args[1]).to.equals("setModelAttributesById");
            expect(trigger.firstCall.args[2]).to.equals(layerId);
            expect(trigger.firstCall.args[3]).to.deep.equals({isSelected: false});
        });
    });
});
