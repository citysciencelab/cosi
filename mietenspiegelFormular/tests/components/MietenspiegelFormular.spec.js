import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import MietenspiegelFormular from "../../components/MietenspiegelFormular.vue";
import MietenspiegelFormularStore from "../../store/indexMietenspiegelFormular";
import sinon from "sinon";
import Vuex from "vuex";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import wfsRequest from "../../../../src/api/wfs/getFeature";

config.mocks.$t = key => key;

const localVue = createLocalVue();

localVue.use(Vuex);

describe("addons/mietenspiegelFormular/components/MietenspiegelFormular.vue", () => {
    let store;

    const factory = {
        getShallowMount: (values = {}) => {
            return shallowMount(MietenspiegelFormular, {
                store,
                data () {
                    return {
                        ...values
                    };
                },
                computed: {
                    name: () => "Hallo",
                    icon: () => "small",
                    renderToWindow: () => false,
                    resizableWindow: () => false,
                    layerIdMetadata: () => "",
                    layerIdCalculation: () => ""
                },
                localVue
            });
        }
    };

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        MietenspiegelFormular: MietenspiegelFormularStore
                    }
                }
            },
            Alerting: {
                namespaced: true,
                actions: {
                    addSingleAlert: () => sinon.stub()
                }
            },
            Maps: {
                namespaced: true,
                getters: {
                    projection: {
                        getCode: () => sinon.stub()
                    },
                    resolution: 0
                }
            }
        });
        sinon.spy(MietenspiegelFormular.methods, "getCalculationData");
        sinon.spy(MietenspiegelFormular.methods, "modifyMietenspiegelData");
        sinon.spy(MietenspiegelFormular.methods, "getFeatureProperties");
        sinon.spy(MietenspiegelFormular.methods, "getFormKeys");
        sinon.stub(rawLayerList, "getLayerWhere").returns({version: "", url: "", featureType: ""});
        sinon.stub(wfsRequest, "getFeatureGET").returns(`<?xml version='1.0' encoding='UTF-8'?>
        <wfs:FeatureCollection xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs https://geodienste.hamburg.de/HH_WFS_Mietenspiegel?SERVICE=WFS&amp;VERSION=1.1.0&amp;REQUEST=DescribeFeatureType&amp;OUTPUTFORMAT=text%2Fxml%3B+subtype%3Dgml%2F3.1.1&amp;TYPENAME=app:mietenspiegel_metadaten&amp;NAMESPACE=xmlns(app=http%3A%2F%2Fwww.deegree.org%2Fapp)" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml">
          <gml:featureMember>
            <app:mietenspiegel_metadaten xmlns:app="http://www.deegree.org/app" gml:id="APP_MIETENSPIEGEL_METADATEN_0">
              <app:erhebungsstand>2021-04-01</app:erhebungsstand>
              <app:herausgeber>Behörde für Stadtentwicklung und Wohnen - Amt für Wohnen, Stadterneuerung und Bodenordnung</app:herausgeber>
              <app:hinweis>Diese Tabelle lässt sich nur richtig anwenden, wenn die Erläuterungen in der Broschüre "Hamburger Mietenspiegel 2021" genau beachtet werden.</app:hinweis>
              <app:titel>Nettokaltmiete ohne Heizung und ohne Betriebskosten (in EUR/m²)</app:titel>
              <app:merkmaletext>Baualtersklasse/Bezugsfertigkeit|Ausstattung|Wohnlage|Wohnfläche</app:merkmaletext>
            </app:mietenspiegel_metadaten>
          </gml:featureMember>
        </wfs:FeatureCollection>`);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("Component DOM", () => {
        it("should exist", () => {
            const wrapper = factory.getShallowMount();

            expect(wrapper.exists()).to.be.true;
        });

        it("should find Tool component", () => {
            const wrapper = factory.getShallowMount(),
                toolWrapper = wrapper.findComponent({name: "ToolTemplate"});

            expect(toolWrapper.exists()).to.be.true;
        });

        it("should not render if active is false", () => {
            const wrapper = factory.getShallowMount();

            expect(wrapper.find(".mietenspiegel-formular").exists()).to.be.false;
        });

        it("should render if active is true", async () => {
            const wrapper = factory.getShallowMount({});

            wrapper.vm.setActive(true);
            await wrapper.vm.$nextTick();
            expect(wrapper.find(".mietenspiegel-formular").exists()).to.be.true;
        });

        it("should render if active is true", () => {
            const wrapper = factory.getShallowMount({}, true);

            expect(wrapper.find("form").exists()).to.be.true;
        });
        it("should find a select component for Baualtersklasse", () => {
            const wrapper = factory.getShallowMount({}, true);

            expect(wrapper.find(".select-baualtersklasse").exists()).to.be.true;
        });
        it("should find a select component for Wohnfläche", () => {
            const wrapper = factory.getShallowMount({}, true);

            expect(wrapper.find(".select-wohnflaeche").exists()).to.be.true;
        });
        it("should find notes", () => {
            const wrapper = factory.getShallowMount({}, true);

            expect(wrapper.find(".notes").exists()).to.be.true;
        });
        it("should render an error message", async () => {
            const wrapper = factory.getShallowMount({});

            wrapper.vm.errorMessage = "foo";
            await wrapper.vm.$nextTick();
            expect(wrapper.find(".alert-warning").exists()).to.be.true;
        });

        it("should not render an error message", () => {
            const wrapper = factory.getShallowMount({addressInformation: {strasse: "foo"}});

            expect(wrapper.find(".alert-warning").exists()).to.be.false;
        });
    });

    describe("Lifecycle Hooks", () => {
        it("should call 'getCalculationData' in the created hook", async () => {
            const wrapper = factory.getShallowMount();

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            expect(MietenspiegelFormular.methods.getCalculationData.calledOnce).to.be.true;
        });

        it("should call 'getFeatureProperties' in the created hook", async () => {
            await factory.getShallowMount();

            expect(MietenspiegelFormular.methods.getFeatureProperties.calledOnce).to.be.true;
        });

        it("should set 'METADATA' in the created hook", async () => {
            const wrapper = factory.getShallowMount();

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.METADATA).to.have.all.keys("erhebungsstand", "hinweis", "herausgeber", "titel", "merkmaletext");
        });
        it("should call 'getFormKeys' in the created hook", async () => {
            const wrapper = factory.getShallowMount();

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            expect(MietenspiegelFormular.methods.getFormKeys.calledOnce).to.be.true;
        });
        it("should call 'modifyMietenspiegelData' in the created hook", async () => {
            const wrapper = factory.getShallowMount();

            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();
            expect(MietenspiegelFormular.methods.modifyMietenspiegelData.calledOnce).to.be.true;
        });
    });

    describe("Watchers", () => {
        describe("clickCoordinate", () => {
            it("should call 'residentialInformationByCoordinate' after clickCoordinate was changed", async () => {
                const spyResidentialInformationByCoordinate = sinon.stub(MietenspiegelFormular.methods, "residentialInformationByCoordinate"),
                    wrapper = factory.getShallowMount();

                await wrapper.vm.$options.watch.clickCoordinate.call(wrapper.vm);

                expect(spyResidentialInformationByCoordinate.calledOnce).to.be.true;
                spyResidentialInformationByCoordinate.restore();
            });
        });
    });

    describe("Methods", () => {
        describe("close", () => {
            it("should set 'errorMessage' to an empty string", async () => {
                const wrapper = factory.getShallowMount({errorMessage: "error"});

                wrapper.vm.close();
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.errorMessage).to.be.equal("");
            });
            it("should set 'active' to false", async () => {
                const wrapper = factory.getShallowMount({errorMessage: "error"});

                wrapper.vm.close();
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.active).to.be.false;
            });
        });
        describe("getFeaturesByLayerId", () => {
            it("should return false if param is not a string", async () => {
                const wrapper = factory.getShallowMount({});

                expect(await wrapper.vm.getFeaturesByLayerId(undefined)).to.be.false;
                expect(await wrapper.vm.getFeaturesByLayerId(null)).to.be.false;
                expect(await wrapper.vm.getFeaturesByLayerId(true)).to.be.false;
                expect(await wrapper.vm.getFeaturesByLayerId(false)).to.be.false;
                expect(await wrapper.vm.getFeaturesByLayerId(1234)).to.be.false;
                expect(await wrapper.vm.getFeaturesByLayerId([])).to.be.false;
                expect(await wrapper.vm.getFeaturesByLayerId({})).to.be.false;
            });
        });
        describe("getFeatureInfoUrlByLayer", () => {
            it("should return null if first param is not an array", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getFeatureInfoUrlByLayer()).to.be.null;
            });
            it("should return null if first param is an array but has no length", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getFeatureInfoUrlByLayer([])).to.be.null;
            });
            it("should return null if the second param is not a object", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], undefined)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], null)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], [])).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], "string")).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], 1234)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], true)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], false)).to.be.null;
            });
            it("should return null if the last param is not a string", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {}, undefined)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {}, null)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {}, true)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {}, false)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {}, 1234)).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {}, [])).to.be.null;
                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {}, {})).to.be.null;
            });
            it("should return a string", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getFeatureInfoUrlByLayer([0, 0], {
                    getSource: () => {
                        return {
                            getFeatureInfoUrl: () => "foo"
                        };
                    }
                }, "2345")).to.be.equal("foo");
            });
        });
        describe("getResidentialInformation", () => {
            it("should return false if first param is not an string", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getResidentialInformation()).to.be.false;
            });
            it("should return false and call onerror function if first param is not an string", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getResidentialInformation(undefined, undefined, undefined, error => {
                    expect(error).to.be.equal("additional:modules.tools.mietenspiegelFormular.errorMessages.noUrl");
                })).to.be.false;
            });
            it("should call the requestGfi function to fetch the address informations", () => {
                const requestGfiStub = sinon.stub(MietenspiegelFormular.methods, "requestGfi").resolves(["foo"]),
                    wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getResidentialInformation("foo", {})).to.be.true;
                expect(requestGfiStub.calledOnce).to.be.true;
            });
            it("should call the onsuccess function", () => {
                const resultObject = {foo: "foo"},
                    requestGfiStub = sinon.stub(MietenspiegelFormular.methods, "requestGfi").resolves([{
                        getProperties: () => {
                            return resultObject;
                        }
                    }]),
                    wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getResidentialInformation("foo", {}, response => {
                    expect(response).to.deep.equal(resultObject);
                })).to.be.true;
                expect(requestGfiStub.calledOnce).to.be.true;
            });
            it("should call the onerror function if response from requestGFI is not an array", () => {
                const requestGfiStub = sinon.stub(MietenspiegelFormular.methods, "requestGfi").resolves(undefined),
                    wrapper = factory.getShallowMount({});

                expect(wrapper.vm.getResidentialInformation("foo", {}, undefined, error => {
                    expect(error).to.be.equal("additional:modules.tools.mietenspiegelFormular.errorMessages.noDataFound");
                })).to.be.true;
                expect(requestGfiStub.calledOnce).to.be.true;
            });
        });
        describe("residentialInformationByCoordinate", () => {
            it("should return false if second param is not a string", () => {
                const wrapper = factory.getShallowMount({});

                expect(wrapper.vm.residentialInformationByCoordinate(undefined, undefined)).to.be.false;
                expect(wrapper.vm.residentialInformationByCoordinate(undefined, null)).to.be.false;
                expect(wrapper.vm.residentialInformationByCoordinate(undefined, true)).to.be.false;
                expect(wrapper.vm.residentialInformationByCoordinate(undefined, false)).to.be.false;
                expect(wrapper.vm.residentialInformationByCoordinate(undefined, 1234)).to.be.false;
                expect(wrapper.vm.residentialInformationByCoordinate(undefined, [])).to.be.false;
                expect(wrapper.vm.residentialInformationByCoordinate(undefined, {})).to.be.false;
            });
        });
        describe("getFormKeys", () => {
            it("should return false if param is not a string", () => {
                const wrapper = factory.getShallowMount({}, true);

                expect(wrapper.vm.getFormKeys(undefined)).to.be.false;
                expect(wrapper.vm.getFormKeys(null)).to.be.false;
                expect(wrapper.vm.getFormKeys(true)).to.be.false;
                expect(wrapper.vm.getFormKeys(false)).to.be.false;
                expect(wrapper.vm.getFormKeys(1234)).to.be.false;
                expect(wrapper.vm.getFormKeys([])).to.be.false;
                expect(wrapper.vm.getFormKeys({})).to.be.false;
            });
        });
        describe("modifyMietenspiegelData", () => {
            it("should return false if param is not an array", () => {
                const wrapper = factory.getShallowMount({}, true);

                expect(wrapper.vm.modifyMietenspiegelData(undefined)).to.be.false;
                expect(wrapper.vm.modifyMietenspiegelData(null)).to.be.false;
                expect(wrapper.vm.modifyMietenspiegelData(true)).to.be.false;
                expect(wrapper.vm.modifyMietenspiegelData(false)).to.be.false;
                expect(wrapper.vm.modifyMietenspiegelData(1234)).to.be.false;
                expect(wrapper.vm.modifyMietenspiegelData("string")).to.be.false;
                expect(wrapper.vm.modifyMietenspiegelData({})).to.be.false;
            });
        });
        describe("getUniqueValuesByAttributes", () => {
            it("should return false if param is not a string", () => {
                const wrapper = factory.getShallowMount({}, true),
                    calc = [
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.12.1918"
                        },
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.11.1918"
                        },
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.12.1918"
                        },
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.12.1918"
                        }
                    ];

                expect(wrapper.vm.getUniqueValuesByAttributes(undefined, calc)).to.be.false;
                expect(wrapper.vm.getUniqueValuesByAttributes(null, calc)).to.be.false;
                expect(wrapper.vm.getUniqueValuesByAttributes(true, calc)).to.be.false;
                expect(wrapper.vm.getUniqueValuesByAttributes(false, calc)).to.be.false;
                expect(wrapper.vm.getUniqueValuesByAttributes(1234, calc)).to.be.false;
                expect(wrapper.vm.getUniqueValuesByAttributes([], calc)).to.be.false;
                expect(wrapper.vm.getUniqueValuesByAttributes({}, calc)).to.be.false;
            });
            it("should return an array with unique values for attribute", () => {
                const wrapper = factory.getShallowMount({}, true),
                    calc = [
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.12.1918"
                        },
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.11.1918"
                        },
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.12.1918"
                        },
                        {
                            "Baualtersklasse/Bezugsfertigkeit": "bis 31.12.1918"
                        }
                    ],
                    item = "Baualtersklasse/Bezugsfertigkeit",
                    expected = ["bis 31.12.1918", "bis 31.11.1918"];

                expect(wrapper.vm.getUniqueValuesByAttributes(item, calc)).to.deep.equal(expected);
            });
            it("should return an empty array, if calculationData is not an array", () => {
                const wrapper = factory.getShallowMount({}, true),
                    item = "Baualtersklasse/Bezugsfertigkeit",
                    expected = [];

                expect(wrapper.vm.getUniqueValuesByAttributes(item, undefined)).to.deep.equal(expected);
                expect(wrapper.vm.getUniqueValuesByAttributes(item, null)).to.deep.equal(expected);
                expect(wrapper.vm.getUniqueValuesByAttributes(item, true)).to.deep.equal(expected);
                expect(wrapper.vm.getUniqueValuesByAttributes(item, false)).to.deep.equal(expected);
                expect(wrapper.vm.getUniqueValuesByAttributes(item, 1234)).to.deep.equal(expected);
                expect(wrapper.vm.getUniqueValuesByAttributes(item, {})).to.deep.equal(expected);
            });
        });
        describe("convertDateFormat", () => {
            it("should return false if param is not a string", () => {
                const wrapper = factory.getShallowMount({}, true);

                expect(wrapper.vm.convertDateFormat(undefined)).to.be.false;
                expect(wrapper.vm.convertDateFormat(null)).to.be.false;
                expect(wrapper.vm.convertDateFormat(true)).to.be.false;
                expect(wrapper.vm.convertDateFormat(false)).to.be.false;
                expect(wrapper.vm.convertDateFormat(1234)).to.be.false;
                expect(wrapper.vm.convertDateFormat([])).to.be.false;
                expect(wrapper.vm.convertDateFormat({})).to.be.false;
            });
            it("should convert the date format from YYYY-MM-DD to DD.MM.YYYY", () => {
                const wrapper = factory.getShallowMount({}, true),
                    date = "2021-08-11",
                    expected = "11.08.2021";

                expect(wrapper.vm.convertDateFormat(date)).to.deep.equal(expected);
            });
        });
    });
});
