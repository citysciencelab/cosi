import Vuex from "vuex";
import {config, mount, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import WholeCityTemplate from "../../../components/WholeCityTheme.vue";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

const localVue = createLocalVue();

config.mocks.$t = key => key;
localVue.use(Vuex);

describe("src/addons/gfiThemes/components/WholeCityTheme.vue", () => {
    let store;
    const mockMutations = {
            setCurrentFeature: () => sinon.stub(),
            setShowMarker: () => SVGTextPositioningElement.stub()
        },

        olFeature = new Feature({
            name: "feature123"
        }),

        wrapper = mount(WholeCityTemplate, {
            propsData: {
                feature: {
                    getTheme: () => {
                        return {
                            "name": "WholeCity",
                            "params": {
                                "linkPrefix": "//geoportal-hamburg/",
                                "linkHrefKey": "hrefKey",
                                "linkTextKey": "textKey"
                            }
                        };
                    },
                    getMappedProperties: () => {
                        return {
                            "key1": "text1",
                            "key2": "text2",
                            "hrefKey": "hrefText1|hrefText2|hrefText3",
                            "textKey": "textText1|textText2|textText3"
                        };
                    },
                    getTitle: () => "Hallo",
                    getMimeType: () => "text/xml",
                    getGfiUrl: () => "",
                    getLayerId: () => sinon.stub(),
                    getOlFeature: () => olFeature
                }
            },
            store: store,
            localVue
        });

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D"
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        Gfi: {
                            namespaced: true,
                            mutations: mockMutations
                        }
                    }
                }
            }
        });
    });

    olFeature.setId("feature1");
    olFeature.setGeometry(new Point([10, 10]));

    describe("Dom", () => {
        it("should have a table", () => {
            expect(wrapper.find("table").exists()).to.be.true;
        });

        it("should have a tbody", () => {
            expect(wrapper.find("tbody").exists()).to.be.true;
        });

        it("should have td with class firstCol", () => {
            expect(wrapper.find("td").classes()).to.includes("firstCol");
        });

        it("should have ul and li", () => {
            expect(wrapper.find("ul").exists()).to.be.true;
            expect(wrapper.find("li").exists()).to.be.true;
            expect(wrapper.findAll("li").at(0).find("span").exists()).to.be.true;
        });
    });

    describe("Interaction", () => {
        const openModalTrigger = sinon.spy(WholeCityTemplate.methods, "openModel"),
            setIframeAttributesTrigger = sinon.spy(WholeCityTemplate.methods, "setIframeAttributes"),
            getLinkTrigger = sinon.spy(WholeCityTemplate.methods, "getLink"),
            interWrapper = shallowMount(WholeCityTemplate, {propsData: {
                feature: {
                    getTheme: () => {
                        return {
                            "name": "WholeCity",
                            "params": {
                                "linkPrefix": "//geoportal-hamburg/",
                                "linkHrefKey": "hrefKey",
                                "linkTextKey": "textKey"
                            }
                        };
                    },
                    getMappedProperties: () => {
                        return {
                            "key1": "text1",
                            "key2": "text2",
                            "hrefKey": "hrefText1|hrefText2|hrefText3",
                            "textKey": "textText1|textText2|textText3"
                        };
                    },
                    getTitle: () => "Hallo",
                    getMimeType: () => "text/xml",
                    getGfiUrl: () => "",
                    getLayerId: () => sinon.stub(),
                    getOlFeature: () => olFeature
                }
            },
            store, localVue});

        it("should call some functions", async () => {
            await interWrapper.findAll("li > span").at(0).trigger("click");
            expect(openModalTrigger.calledOnce).to.be.true;
            expect(setIframeAttributesTrigger.calledOnce).to.be.true;
            expect(getLinkTrigger.calledOnce).to.be.true;
            openModalTrigger.restore();
            setIframeAttributesTrigger.restore();
        });

        it("should show Modal", async () => {
            await interWrapper.findAll("li > span").at(0).trigger("click");
            expect(interWrapper.vm.showModal).to.be.true;
            expect(interWrapper.findComponent({name: "ModalItem"}).exists()).to.be.true;
        });

        it("should set Iframe Attributes", async () => {
            await interWrapper.findAll("li > span").at(0).trigger("click");
            expect(interWrapper.vm.pdfURL).to.be.equal("//geoportal-hamburg/hrefText1");
            expect(interWrapper.vm.pdfTitle).to.be.equal("textText1");
        });
    });

    describe("Methods", () => {
        it("should return false for mappedPropertiesExists", () => {
            expect(wrapper.vm.mappedPropertiesExists(null)).to.be.false;
            expect(wrapper.vm.mappedPropertiesExists(undefined)).to.be.false;
            expect(wrapper.vm.mappedPropertiesExists("")).to.be.false;
            expect(wrapper.vm.mappedPropertiesExists(0)).to.be.false;
            expect(wrapper.vm.mappedPropertiesExists(true)).to.be.false;
            expect(wrapper.vm.mappedPropertiesExists([])).to.be.false;
            expect(wrapper.vm.mappedPropertiesExists({})).to.be.false;
        });

        it("should return true for mappedPropertiesExists", () => {
            const feature = {
                getMappedProperties: () => {
                    return {
                        "key1": "text1",
                        "key2": "text2",
                        "hrefKey": "hrefText",
                        "textKey": "textText"
                    };
                }
            };

            expect(wrapper.vm.mappedPropertiesExists(feature)).to.be.true;
        });

        it("should return false for hasMappedProperties", () => {
            expect(wrapper.vm.hasMappedProperties(null)).to.be.false;
            expect(wrapper.vm.hasMappedProperties(undefined)).to.be.false;
            expect(wrapper.vm.hasMappedProperties("")).to.be.false;
            expect(wrapper.vm.hasMappedProperties(0)).to.be.false;
            expect(wrapper.vm.hasMappedProperties(true)).to.be.false;
            expect(wrapper.vm.hasMappedProperties([])).to.be.false;
            expect(wrapper.vm.hasMappedProperties({})).to.be.false;
        });

        it("should return true for hasMappedProperties", () => {
            const feature = {
                getMappedProperties: () => {
                    return {
                        "key1": "text1"
                    };
                }
            };

            expect(wrapper.vm.hasMappedProperties(feature)).to.be.true;
        });

        it("should return false for hasPipe", () => {
            expect(wrapper.vm.hasPipe(null)).to.be.false;
            expect(wrapper.vm.hasPipe(undefined)).to.be.false;
            expect(wrapper.vm.hasPipe("")).to.be.false;
            expect(wrapper.vm.hasPipe(0)).to.be.false;
            expect(wrapper.vm.hasPipe(true)).to.be.false;
            expect(wrapper.vm.hasPipe([])).to.be.false;
            expect(wrapper.vm.hasPipe({})).to.be.false;
        });

        it("should return true for hasPipe", () => {
            expect(wrapper.vm.hasPipe("text|text2")).to.be.true;
        });

        it("should return empty string for getLink", () => {
            expect(wrapper.vm.getLink("", "", null)).to.be.equal("");
            expect(wrapper.vm.getLink("", "", undefined)).to.be.equal("");
            expect(wrapper.vm.getLink("", "", "")).to.be.equal("");
            expect(wrapper.vm.getLink("", "", true)).to.be.equal("");
            expect(wrapper.vm.getLink("", "", [])).to.be.equal("");
            expect(wrapper.vm.getLink("", "", {})).to.be.equal("");
            expect(wrapper.vm.getLink(null, "", 2)).to.be.equal("");
            expect(wrapper.vm.getLink(undefined, "", 2)).to.be.equal("");
            expect(wrapper.vm.getLink(true, "", 2)).to.be.equal("");
            expect(wrapper.vm.getLink([], "", 2)).to.be.equal("");
            expect(wrapper.vm.getLink({}, "", 2)).to.be.equal("");
            expect(wrapper.vm.getLink(0, "", 2)).to.be.equal("");
            expect(wrapper.vm.getLink("", null, 2)).to.be.equal("");
            expect(wrapper.vm.getLink("", undefined, 2)).to.be.equal("");
            expect(wrapper.vm.getLink("", true, 2)).to.be.equal("");
            expect(wrapper.vm.getLink("", [], 2)).to.be.equal("");
            expect(wrapper.vm.getLink("", {}, 2)).to.be.equal("");
            expect(wrapper.vm.getLink("", 0, 2)).to.be.equal("");
        });

        it("should return the link string for getLink", () => {
            expect(wrapper.vm.getLink("//geoportal-hamburg.de/", "hrefKey", 0)).to.be.equal("//geoportal-hamburg.de/hrefText1");
            expect(wrapper.vm.getLink("//geoportal-hamburg.de/", "hrefKey", 1)).to.be.equal("//geoportal-hamburg.de/hrefText2");
            expect(wrapper.vm.getLink("//geoportal-hamburg.de/", "hrefKey", 2)).to.be.equal("//geoportal-hamburg.de/hrefText3");
        });
    });
});
