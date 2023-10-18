import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import ObliqueViewerComponent from "../../../components/VcOblique.vue";
import VcOblique from "../../../store/indexVcOblique";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("ADDONS: addons/vcOblique/components/VcOblique.vue", () => {
    const mockConfigJson = {
            Portalconfig: {
                menu: {
                    tools: {
                        children: {
                            vcOblique: {
                                "name": "translate#additional:modules.tools.obliqueViewer.title",
                                "icon": "bi-image",
                                "styleId": "obliqueViewer",
                                "isVisibleInMenu": false
                            }
                        }
                    }
                }
            }
        },
        mockMapMarkerActions = {
            removePointMarker: sinon.stub()
        };
    let store, wrapper, setObliqueViewOrig, initObliqueViewOrig, setRenderToWindowOrig, initResetObliqueViewer, setObliqueViewerURLOrig;

    beforeEach(() => {
        setObliqueViewOrig = VcOblique.actions.setObliqueView;
        VcOblique.actions.setObliqueView = sinon.stub();
        initObliqueViewOrig = VcOblique.actions.initObliqueView;
        VcOblique.actions.initObliqueView = sinon.stub();
        initResetObliqueViewer = VcOblique.actions.resetObliqueViewer;
        VcOblique.actions.resetObliqueViewer = sinon.stub();
        setObliqueViewerURLOrig = VcOblique.actions.setObliqueViewerURL;
        VcOblique.actions.setObliqueViewerURL = sinon.stub();
        setRenderToWindowOrig = VcOblique.mutations.setRenderToWindow;
        VcOblique.mutations.setRenderToWindow = sinon.stub();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        VcOblique
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        clickCoordinate: () => [100, 200],
                        initialCenter: () => [565874, 5934140]
                    },
                    actions: {
                        registerListener: sinon.stub(),
                        unregisterListener: sinon.stub()
                    }
                },
                MapMarker: {
                    namespaced: true,
                    actions: mockMapMarkerActions,
                    mutations: {
                        setPointStyleId: () => sinon.stub()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            },
            getters: {
                mobile: () => false
            }
        });

        store.commit("Tools/VcOblique/setActive", true);
        wrapper = shallowMount(ObliqueViewerComponent, {store, localVue});
    });
    afterEach(function () {
        sinon.restore();
        VcOblique.actions.setObliqueView = setObliqueViewOrig;
        VcOblique.actions.initObliqueView = initObliqueViewOrig;
        VcOblique.actions.resetObliqueViewer = initResetObliqueViewer;
        VcOblique.actions.setObliqueViewerURL = setObliqueViewerURLOrig;
        VcOblique.mutations.setRenderToWindow = setRenderToWindowOrig;
        if (wrapper) {
            wrapper.destroy();
        }
    });
    describe("VcOblique.vue watcher", () => {
        it("test watch on clickCoordinate should call action setObliqueView", async () => {
            expect(wrapper.find("#obliqueIframe").exists()).to.be.true;
            wrapper.vm.$options.watch.clickCoordinate.call(wrapper.vm, [10, 20]);
            expect(VcOblique.actions.setObliqueView.calledOnce).to.be.true;
        });
        it("test watch on active should call action setObliqueView", async () => {
            expect(wrapper.find("#obliqueIframe").exists()).to.be.true;
            await wrapper.vm.$options.watch.active.call(wrapper.vm, true);
            expect(VcOblique.actions.initObliqueView.calledOnce).to.be.true;
            expect(VcOblique.actions.resetObliqueViewer.calledOnce).to.be.false;
        });
        it("test watch on active = false should call action setObliqueView", async () => {
            expect(wrapper.find("#obliqueIframe").exists()).to.be.true;
            wrapper.vm.$options.watch.active.call(wrapper.vm, false);
            expect(VcOblique.actions.resetObliqueViewer.calledOnce).to.be.true;
        });
        it("test watch on isMobile should call mutation setRenderToWindow if isMobile is false", async () => {
            expect(wrapper.find("#obliqueIframe").exists()).to.be.true;
            wrapper.vm.$options.watch.isMobile.call(wrapper.vm, false);
            expect(VcOblique.mutations.setRenderToWindow.calledOnce).to.be.true;
            expect(VcOblique.mutations.setRenderToWindow.args[0][1]).to.be.false;
        });
        it("test watch on isMobile should call mutation setRenderToWindow if isMoblie is true", async () => {
            expect(wrapper.find("#obliqueIframe").exists()).to.be.true;
            wrapper.vm.$options.watch.isMobile.call(wrapper.vm, true);
            expect(VcOblique.mutations.setRenderToWindow.calledOnce).to.be.true;
            expect(VcOblique.mutations.setRenderToWindow.args[0][1]).to.be.true;
        });
    });
    describe("VcOblique.vue methods", () => {
        it("close sets active to false", async () => {
            expect(store.state.Tools.VcOblique.active).to.be.true;
            wrapper.vm.close();
            await wrapper.vm.$nextTick();

            expect(store.state.Tools.VcOblique.active).to.be.false;
            expect(wrapper.find("#obliqueIframe").exists()).to.be.false;
        });
        it("renders the ObliqueViewer", () => {
            expect(wrapper.find("#obliqueIframe").exists()).to.be.true;
        });
    });
});
