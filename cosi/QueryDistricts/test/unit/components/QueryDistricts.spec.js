import Vuex from "vuex";
import
{
    config,
    mount,
    createLocalVue
} from "@vue/test-utils";
import QueryDistricts from "../../../components/QueryDistricts.vue";
import LayerFilter from "../../../components/LayerFilter.vue";
import compareFeatures from "../../../components/compareFeatures.js";
import QueryDistrictsStore from "../../../store/index";
import
{
    expect
} from "chai";
import sinon from "sinon";
import Vuetify from "vuetify";
import Vue from "vue";
import features_bibs from "./features_bibs.json";
import features_bev from "./features_bev.json";
import features_ha from "./features_ha.json";
import features_ha_with_geo from "./features_ha_with_geo.json";
import GeoJSON from "ol/format/GeoJSON";

Vue.use(Vuetify);

const localVue = createLocalVue();

localVue.use(Vuex);

global.requestAnimationFrame = (fn) => fn();

config.mocks.$t = key => key;

describe("addons/cosi/QueryDistricts/", () => {
    // eslint-disable-next-line no-unused-vars
    let store, sandbox, vuetify, selectedFeaturesStub, keyOfAttrNameStub, keyOfAttrNameStatsStub,
        getLayerListStub, zoomToStub, layerFeaturesStub, mappingStub, wrapper,
        addSingleAlertStub, cleanupStub, addFeatureStub, activeVectorLayerListStub;

    const bev_features = new GeoJSON().readFeatures(features_bev),
        ha_features = new GeoJSON().readFeatures(features_ha),
        geo_features = new GeoJSON().readFeatures(features_ha_with_geo),
        bib_features = new GeoJSON().readFeatures(features_bibs),
        districtsMock = [
            {
                adminFeature: geo_features[0],
                statFeatures: [],
                originalStatFeatures: [],
                isSelected: true,
                getId: () => "Rahlstedt",
                getName: () => "Rahlstedt",
                getLabel: () => "Rahlstedt"
            },
            {
                adminFeature: geo_features[1],
                statFeatures: [],
                originalStatFeatures: [],
                isSelected: true,
                getId: () => "Farmsen-Berne",
                getName: () => "Farmsen-Berne",
                getLabel: () => "Farmsen-Berne"
            },
            {
                adminFeature: geo_features[2],
                statFeatures: [],
                originalStatFeatures: [],
                isSelected: true,
                getId: () => "Horn",
                getName: () => "Horn",
                getLabel: () => "Horn"
            }
        ],
        factory = {
            getMount: () => {
                return mount(QueryDistricts, {
                    store,
                    localVue,
                    vuetify
                });
            }
        };


    // eslint-disable-next-line require-jsdoc
    function getAllFeatures (id) {
        if (id === "19041") {
            return ha_features;
        }
        if (id === "19034") {
            return bev_features;
        }
        if (id === "19042") {
            return geo_features;
        }
        if (id === "bib_layer") {
            return bib_features;
        }
        return null;
    }

    beforeEach(() => {
        vuetify = new Vuetify();
        sandbox = sinon.createSandbox();
        selectedFeaturesStub = sandbox.stub();
        keyOfAttrNameStub = sandbox.stub();
        keyOfAttrNameStatsStub = sandbox.stub();
        getLayerListStub = sandbox.stub();
        zoomToStub = sandbox.stub();
        layerFeaturesStub = sandbox.stub();
        mappingStub = sandbox.stub();
        addSingleAlertStub = sandbox.stub();
        cleanupStub = sandbox.stub();
        addFeatureStub = sandbox.stub();
        activeVectorLayerListStub = sandbox.stub();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        QueryDistricts: QueryDistrictsStore,
                        DistrictSelector: {
                            namespaced: true,
                            getters: {
                                selectedFeatures: selectedFeaturesStub,
                                keyOfAttrName: keyOfAttrNameStub,
                                keyOfAttrNameStats: keyOfAttrNameStatsStub,
                                layer: () => ({
                                    getSource: () => ({
                                        getFeatures: layerFeaturesStub
                                    })
                                }),
                                selectedDistrictLevel: () => ({
                                    districts: districtsMock,
                                    stats: {
                                        layers: [{
                                            id: "19034",
                                            featureType: "de.hh.up:v_hh_statistik_bev_insgesamt",
                                            url: "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile"
                                        }],
                                        baseUrl: ["https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile"]
                                    }
                                }),
                                mapping: mappingStub
                            },
                            mutations: {
                                setSelectedDistrictsCollection: sandbox.stub()
                            },
                            actions: {
                                setDistrictsByName: sandbox.stub()
                            }
                        },
                        FeaturesList: {
                            namespaced: true,
                            getters: {
                                isFeatureDisabled: () => () => false,
                                layerMapById: () => () => ({
                                    addressField: [
                                        "adresse"
                                    ],
                                    categoryField: null,
                                    id: "Ã–ffentliche Bibliotheken",
                                    keyOfAttrName: "bezeichnung",
                                    layerId: "bib_layer",
                                    numericalValues: [{
                                        id: "ente",
                                        name: "Entenart"
                                    }]
                                }),
                                activeVectorLayerList: activeVectorLayerListStub
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    actions: {
                        zoomToExtent: zoomToStub,
                        addNewLayerIfNotExists: () => {
                            return Promise.resolve({
                                setVisible: sandbox.stub(),
                                addEventListener: sandbox.stub(),
                                getSource: () => ({
                                    clear: sandbox.stub(),
                                    addFeature: addFeatureStub,
                                    addFeatures: sandbox.stub()
                                })
                            });
                        }
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: addSingleAlertStub,
                        cleanup: cleanupStub
                    }
                },
                Language: {
                    namespaced: true,
                    getters: {
                        currentLocale: () => "de-DE"
                    }
                }
            },
            getters: {
                uiStyle: () => true,
                mobile: () => sinon.stub()
            }
        });
        store.commit("Tools/QueryDistricts/setActive", false);
    });

    afterEach(function () {
        sandbox.restore();
        if (wrapper) {
            wrapper.destroy();
        }
    });

    // eslint-disable-next-line require-jsdoc, no-shadow
    async function setActive (active) {
        store.commit("Tools/QueryDistricts/setActive", active);
        await wrapper.vm.$nextTick();
    }

    // eslint-disable-next-line require-jsdoc, no-shadow
    function setupDefaultStubs () {
        getLayerListStub.returns([{
            id: "19034",
            url: "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile",
            featureType: "de.hh.up:v_hh_statistik_bev_insgesamt"
        },
        {
            id: "19042",
            url: "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile",
            featureType: "de.hh.up:v_hh_statistik_bev_insgesamt"
        }]);
        mappingStub.returns([{
            value: "BevÃ¶lkerung insgesamt",
            category: "bev_insgesamt",
            group: "BevÃ¶lkerung",
            valueType: "relative",
            statgebiet: "15563",
            stadtteil: "19034",
            bezirk: "18970"
        }]);
        keyOfAttrNameStub.returns("stadtteil_name");
        keyOfAttrNameStatsStub.returns("stadtteil");

        selectedFeaturesStub.returns([{
            style_: null,
            getProperties: () => ({
                key: "name",
                "stadtteil_name": "Test"
            })
        }]);
        layerFeaturesStub.returns([{
            getProperties: () => ({
                "stadtteil_name": "Horn"
            }),
            getGeometry: sandbox.stub().returns({
                getExtent: sandbox.stub()
            }),
            clone: sandbox.stub().returns({
                setStyle: sandbox.stub()
            })
        }]);
        // layerByIdStub.returns({
        //     olLayer: {
        //         getSource: () => ({
        //             getFeatures: () => [
        //                 {
        //                     getProperties: () => ({
        //                         "ente": "Donald"
        //                     })
        //                 }
        //             ]
        //         })
        //     }
        // });

        sandbox.stub(Radio, "request").callsFake((a1, a2) => {
            if (a1 === "ModelList" && a2 === "getModelByAttributes") {
                return {
                    id: "bib_layer"
                };
            }
            return null;
        });

        sandbox.stub(QueryDistricts.methods, "getLayerList").returns([{
            id: "19034",
            url: "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile",
            featureType: "de.hh.up:v_hh_statistik_bev_insgesamt"
        },
        {
            id: "19042",
            url: "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile",
            featureType: "de.hh.up:v_hh_statistik_bev_insgesamt"
        }
        ]);

        sandbox.stub(QueryDistricts.methods, "getAllFeatures").callsFake(getAllFeatures);
    }

    it("renders inactive", async () => {

        wrapper = factory.getMount();

        expect(wrapper.find("#queryDistricts").exists()).to.be.false;
    });
    it("renders active", async () => {
        // arrange
        setupDefaultStubs();

        wrapper = factory.getMount();

        // act
        await setActive(true);

        // assert
        expect(wrapper.find("#queryDistricts").exists()).to.be.true;
        expect(wrapper.find("#queryDistricts").html()).to.not.be.empty;
        expect(wrapper.vm.selectedFeatures).to.not.empty;
        expect(wrapper.vm.selectedLayer).to.be.null;
        expect(wrapper.vm.districtNames).to.deep.equal(["Test"]);
        expect(wrapper.vm.layerOptions).to.deep.equal([
            {"header": "BevÃ¶lkerung"},
            {"id": "bev_insgesamt", "name": "BevÃ¶lkerung insgesamt", "group": "BevÃ¶lkerung", "valueType": "relative",
                "category": "bev_insgesamt", "featureType": "de.hh.up:v_hh_statistik_bev_insgesamt",
                "url": "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile",
                "ltf": undefined
            }]
        );
    });
    it("no selectedFeatures", async () => {
        // arrange
        setupDefaultStubs();
        selectedFeaturesStub.returns([]);

        wrapper = factory.getMount();

        // act
        await setActive(true);

        // assert
        expect(wrapper.vm.districtNames).to.deep.equal(["Horn"]);
    });
    it.skip("select district no selected features", async () => {
        // arrange
        setupDefaultStubs();
        wrapper = factory.getMount();
        selectedFeaturesStub.returns(null);

        // act
        await setActive(true);

        // assert
        expect(wrapper.vm.districtNames).to.deep.equal(["Horn"]);
        expect(wrapper.find("#reference-district").exists()).to.be.false;
        sinon.assert.callCount(addFeatureStub, 0);

        // act
        await wrapper.setData({
            selectedDistrict: "Horn",
            selectedLayer: {id: "19034", name: "BevÃ¶lkerung insgesamt", "valueType": "relative"}
        });
        await wrapper.find("#add-filter").trigger("click");
        await wrapper.vm.$nextTick();
        await wrapper.setData({
            layerFilterModels: wrapper.vm.dataSets[0].inputs.layerFilterModels
        });
        await wrapper.vm.$nextTick();
        // assert
        sinon.assert.callCount(addFeatureStub, 1);
        expect(await wrapper.find("#reference-district-button").text()).to.equal("Horn");

        // act
        await wrapper.find("#reference-district-button").trigger("click");
        await wrapper.vm.$nextTick();

        // assert
        sinon.assert.callCount(zoomToStub, 1);

    });
    it("select district with selected features", async () => {
        // arrange
        setupDefaultStubs();
        selectedFeaturesStub.returns([
            {
                getProperties: () => ({
                    "stadtteil_name": "test1"
                })
            },
            {
                getProperties: () => ({
                    "stadtteil_name": "test2"
                })
            }
        ]);
        wrapper = factory.getMount();

        // act
        await setActive(true);

        // assert
        expect(wrapper.vm.districtNames).to.deep.equal(["test1", "test2"]);
    });
    it.skip("add selected layer", async () => {
        // arrange
        setupDefaultStubs();
        wrapper = factory.getMount();

        await setActive(true);

        // act
        await wrapper.setData({
            selectedLayer: {id: "19034", name: "Bevölkerung insgesamt", "valueType": "relative"}
        });
        await wrapper.find("#add-filter").trigger("click");
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.selectedLayer).to.be.null;
        // expect(wrapper.vm.layerOptions).to.deep.equal([]);
        expect(wrapper.vm.layerFilterModels).to.deep.equal(
            [
                {
                    "layerId": "19034",
                    "currentLayerId": "19034",
                    "name": "Bevölkerung insgesamt",
                    "field": "jahr_2019", "max": 92087, "min": 506, "invalidFeatures": ["Kleiner Grasbrook", "Steinwerder", "Waltershof", "Finkenwerder", "Neuland", "Gut Moor", "Moorburg", "Altenwerder"], "value": 0, "high": 0, "low": 0,
                    "valueType": "relative",
                    "fieldValues": ["jahr_2019", "jahr_2018", "jahr_2017", "jahr_2016", "jahr_2015", "jahr_2014", "jahr_2013", "jahr_2012"],
                    "error": undefined,
                    "facilityLayerName": undefined,
                    "quotientLayers": [],
                    "properties": null
                }
            ]);
        expect(wrapper.vm.resultNames).to.deep.equal([]);

        // act: update filter
        await wrapper.setData({
            layerFilterModels: [{"layerId": "19034", "name": "name", "field": "jahr_2019", "max": 92087, "min": 506, "value": 38373, high: 1000, low: 1000}]
        });
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.resultNames).to.deep.equal(["Hamm", "Horn"]);
        expect(wrapper.vm.results).to.deep.equal([{"0": 38331, "name": "Hamm"}, {"0": 38373, "name": "Horn"}]);
        expect(wrapper.vm.resultTableHeaders).to.deep.equal([{"align": "start", "text": "Name", "value": "name"}, {"text": "name", "value": "0", "align": "center"}]);

        expect(await wrapper.find("#result-table").exists()).to.be.true;

        // act: click result name
        // await wrapper.find("#result-Horn").trigger("click");
        await wrapper.vm.zoomToDistrict({"name": "Horn"});
        await wrapper.vm.$nextTick();

        // assert
        sinon.assert.callCount(zoomToStub, 1);

        // act: set selected districts
        await wrapper.find("#set-selected-district").trigger("click");
        await wrapper.vm.$nextTick();
        // TODO

        // act
        await wrapper.findComponent(LayerFilter).vm.$emit("close", {layerId: "19034"});
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.layerFilterModels).to.deep.equal([]);
        expect(wrapper.find("#compare-results").exists()).to.be.false;
        expect(wrapper.vm.layerOptions).to.deep.equal([
            {"header": "BevÃ¶lkerung"},
            {"id": "bev_insgesamt", "name": "BevÃ¶lkerung insgesamt", "group": "BevÃ¶lkerung", "valueType": "relative",
                "category": "bev_insgesamt", "featureType": "de.hh.up:v_hh_statistik_bev_insgesamt",
                "url": "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile",
                "ltf": undefined
            }]
        );
    });
    it.skip("compareFeatures one filter", async () => {
        // arrange
        const value = [
                {"layerId": "19041", low: 100, high: 200, "field": "jahr_2019", "value": 0, "max": 3538, "min": 54, "invalidFeatures": []}
            ],
            self = {
                propertiesMap: {"19041": getAllFeatures("19041").map(f => f.getProperties())},
                selectorField: "verwaltungseinheit",
                keyOfAttrNameStats: "stadtteil",
                ...compareFeatures
            },
            // act
            ret = await self.setComparableFeatures(value);

        // assert
        expect(ret.resultNames).to.deep.equal(["Borgfelde", "Cranz", "Dulsberg", "Eilbek", "Hamburg-Altstadt", "Hoheluft-Ost", "Hoheluft-West", "Hohenfelde", "Langenbek", "St.Georg", "Sternschanze"]
        );
    });
    it.skip("compareFeatures two filters", async () => {
        // arrange
        const self = {
                propertiesMap: {
                    "19041": getAllFeatures("19041").map(f => f.getProperties()),
                    "19034": getAllFeatures("19034").map(f => f.getProperties())
                },
                selectorField: "verwaltungseinheit",
                keyOfAttrNameStats: "stadtteil",
                ...compareFeatures
            },
            layer1 = {"layerId": "19041", low: 100, high: 200, "field": "jahr_2019", "value": 0, "max": 3538, "min": 54, "invalidFeatures": []},
            layer2 = {"layerId": "19034", low: 1000, high: 1000, "field": "jahr_2019", "value": 0, "max": 92087, "min": 506, "invalidFeatures": []},
            // act
            ret1 = await self.setComparableFeatures([layer1]),
            ret2 = await self.setComparableFeatures([layer2]),
            ret = await self.setComparableFeatures([layer1, layer2]);

        // assert
        expect(ret1.resultNames).to.deep.equal(["Borgfelde", "Cranz", "Dulsberg", "Eilbek", "Hamburg-Altstadt", "Hoheluft-Ost", "Hoheluft-West", "Hohenfelde", "Langenbek", "St.Georg", "Sternschanze"]);
        expect(ret2.resultNames).to.deep.equal(["Cranz", "Francop", "Reitbrook", "Spadenland", "Tatenberg"]);
        expect(ret.resultNames).to.deep.equal(
            ["Cranz"]
        );
        expect(ret.table).to.deep.equal([{"0": 133.28764, "1": 804, "name": "Cranz"}]);
    });
    it.skip("add fachdaten layer", async () => {
        // arrange
        setupDefaultStubs();
        wrapper = factory.getMount();

        await setActive(true);

        // act
        await wrapper.setData({
            selectedLayer: {
                id: "bib_layer", name: "Ã–ffentliche Bibliotheken", valueType: "absolute", group: "Fachdaten", facilityLayerName: "Ã–ffentliche Bibliotheken"
            }
        });

        await wrapper.find("#add-filter").trigger("click");
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const expModel = {
                "layerId": "bib_layer",
                "currentLayerId": "bib_layer",
                "name": "Ã–ffentliche Bibliotheken",
                "field": "jahr_2021", "max": 1, "min": 0, "invalidFeatures": [], "value": 0, high: 0, low: 0,
                "valueType": "absolute",
                "fieldValues": ["jahr_2021", "jahr_2020", "jahr_2019", "jahr_2018", "jahr_2017", "jahr_2016", "jahr_2015", "jahr_2014", "jahr_2013", "jahr_2012"],
                "error": undefined,
                "facilityLayerName": "Ã–ffentliche Bibliotheken",
                "quotientLayers": [],
                "properties": [{
                    "id": "ente",
                    "name": "Entenart"
                }]
            },
            expModelRahlstedt = {
                ...expModel,
                "value": 1, high: 1, low: 1
            },
            expModelHorn = {
                ...expModel,
                "value": 0, high: 1, low: 1
            };

        expect(wrapper.vm.layerFilterModels[0].layerId).to.deep.equal(expModel.layerId);
        expect(wrapper.vm.layerFilterModels[0].currentLayerId).to.deep.equal(expModel.currentLayerId);
        expect(wrapper.vm.layerFilterModels[0].name).to.deep.equal(expModel.name);
        expect(wrapper.vm.layerFilterModels[0].valueType).to.deep.equal(expModel.valueType);
        expect(wrapper.vm.layerFilterModels[0].error).to.deep.equal(expModel.error);
        expect(wrapper.vm.layerFilterModels[0].facilityLayerName).to.deep.equal(expModel.facilityLayerName);
        expect(wrapper.vm.layerFilterModels[0].quotientLayers).to.deep.equal(expModel.quotientLayers);
        expect(wrapper.vm.layerFilterModels[0].properties).to.deep.equal(expModel.properties);
        expect(wrapper.vm.resultNames).to.deep.equal(["Horn"]);

        // act: update filter
        await wrapper.setData({
            layerFilterModels: [{...expModel, high: 1, low: 1}]
        });
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.resultNames).to.deep.equal(["Farmsen-Berne", "Horn", "Rahlstedt"]);

        // act: select district
        await wrapper.setData({
            selectedDistrict: "Rahlstedt"
        });
        await wrapper.vm.$nextTick();

        // assert

        expect(wrapper.vm.layerFilterModels).to.deep.equal([expModelRahlstedt]);

        // act: select invalid district
        await wrapper.setData({
            selectedDistrict: "Horn"
        });
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.layerFilterModels).to.deep.equal([expModelHorn]);
    });
    it("facilityNames", async () => {
        // arrange
        setupDefaultStubs();
        wrapper = factory.getMount();

        // act
        await wrapper.setData({
            facilityNames: [{
                name: "Ã–ffentliche Bibliotheken",
                id: "bib_layer"
            }]
        });
        await setActive(true);


        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.allLayerOptions).to.deep.equal([
            {
                "facilityLayerName": "Ã–ffentliche Bibliotheken",
                "group": "additional:modules.tools.cosi.queryDistricts.funcData",
                "id": "bib_layer",
                "name": "Ã–ffentliche Bibliotheken",
                "valueType": "absolute"
            },
            {"id": "bev_insgesamt", "name": "BevÃ¶lkerung insgesamt", "group": "BevÃ¶lkerung", "valueType": "relative",
                "category": "bev_insgesamt", "featureType": "de.hh.up:v_hh_statistik_bev_insgesamt",
                "url": "https://geodienste.hamburg.de/HH_WFS_Regionalstatistische_Daten_Stadtteile",
                "ltf": undefined
            }
        ]);
    });

    it.skip("quotient layer", async () => {
        // arrange
        setupDefaultStubs();
        wrapper = factory.getMount();

        await setActive(true);

        await wrapper.setData({
            selectedLayer: {id: "19041", name: "Layer", "valueType": "relative"}
        });
        await wrapper.find("#add-filter").trigger("click");
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.layerFilterModels[0].quotientLayers)
            .to.deep.equal([]);

        // act
        await wrapper.vm.updateFilter({layerId: "19041", quotientLayer: "19034"});
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.layerFilterModels).to.deep.equal([
            {
                "layerId": "19041",
                "currentLayerId": "19041/19034",
                "name": "Layer", "field": "jahr_2019", "value": 0, "valueType": "relative", "high": 0, "low": 0,
                "fieldValues": ["jahr_2019", "jahr_2018", "jahr_2017", "jahr_2016", "jahr_2015", "jahr_2014", "jahr_2013", "jahr_2012"],
                "min": 0.00535555414960923, "max": 1.3710088339920947, "invalidFeatures": ["Kleiner Grasbrook", "Steinwerder", "Waltershof", "Finkenwerder", "Neuland", "Gut Moor", "Moorburg", "Altenwerder"],
                "properties": null,
                "quotientLayers": [], "quotientLayer": "19034",
                "error": undefined,
                "facilityLayerName": undefined
            }
        ]);
        // act
        await wrapper.setData({
            layerFilterModels: [{...wrapper.vm.layerFilterModels[0], high: 1}]
        });
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.resultNames.length).to.be.equal(93);

        // act
        await wrapper.vm.updateFilter({layerId: "19041", field: "jahr_2018"});
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.layerFilterModels[0].max).to.be.equal(3538.6724);
        expect(wrapper.vm.layerFilterModels[0].min).to.be.equal(54.84489);

        // act
        await wrapper.setData({
            selectedDistrict: "Rahlstedt"
        });
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.layerFilterModels[0].value).to.be.equal(2656.598);

        // act
        await wrapper.vm.updateFilter({layerId: "19041", quotientLayer: null});
        await wrapper.vm.$nextTick();

        // assert
        expect(wrapper.vm.resultNames.length).to.be.equal(1);
        expect(wrapper.vm.layerFilterModels[0].max).to.be.equal(3538.6724);
        expect(wrapper.vm.layerFilterModels[0].min).to.be.equal(54.84489);
        expect(wrapper.vm.layerFilterModels[0].value).to.be.equal(2656.598);
    });
});
