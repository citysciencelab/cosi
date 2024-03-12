import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import FloorComponent from "../../../components/FloorComponent.vue";
import Boris from "../../../store/indexBoris";
import {expect} from "chai";
import sinon from "sinon";


const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("ADDONS: addons/boris/components/FloorComponent.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        boris: {
                            "name": "common:menu.tools.boris",
                            "icon": "bi-vinyl",
                            "active": true,
                            "renderToWindow": false
                        }
                    }
                }
            }
        }
    };
    let store, propsData, wrapper;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        Boris
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });

        propsData = {
            title: "title",
            feature: {
            },
            label: "subtitle",
            landuse: "MFH Mehrfamilienhäuser"
        };
        wrapper = shallowMount(FloorComponent, {
            store,
            propsData: propsData,
            localVue
        });
    });
    afterEach(function () {
        sinon.restore();
        if (wrapper) {
            wrapper.destroy();
        }
    });

    describe("Boris floor component template", () => {

        it("renders floor compponent", () => {
            expect(wrapper.find(".floor-component").exists()).to.be.true;
        });
        it("renders 'schichtwerte'", () => {
            wrapper = shallowMount(FloorComponent, {
                store,
                propsData: {...propsData, feature: {schichtwerte: {
                    schichtwert: "blaa"
                }}}
            });

            expect(wrapper.find(".floorvalue-part-I").exists()).to.be.true;
        });
        it("does not render 'schichtwerte'", () => {
            const feature = {key1: "euro"};

            wrapper = shallowMount(FloorComponent, {
                store,
                propsData: {...propsData, feature: feature
                }
            });
            expect(wrapper.find(".floorvalue-part-II").exists()).to.be.true;
        });
    });
});
