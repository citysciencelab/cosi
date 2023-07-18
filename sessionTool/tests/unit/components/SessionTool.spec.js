import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import SessionTool from "../../../components/SessionTool.vue";
import SessionToolModule from "../../../store/indexSessionTool";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/sessionTool/components/sessionTool.vue", () => {
    let wrapper, store, addSingleAlertStub;

    beforeEach(() => {
        addSingleAlertStub = sinon.stub();
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        SessionTool: SessionToolModule
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: addSingleAlertStub
                    }
                }
            }
        });
        wrapper = shallowMount(SessionTool, {store, localVue});
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    describe("Render DOM", () => {
        it("should render correctly", () => {
            expect(wrapper.find("div").classes("session-tool")).to.be.true;
        });
        it("should render the download button", () => {
            expect(wrapper.find("#fileUpload").exists()).to.be.true;
        });
        it("should render the upload button", () => {
            expect(wrapper.find("#fileDownload").exists()).to.be.true;
        });
    });
    describe("User Interaction", () => {
        it("should trigger download if button is clicked", () => {
            const stubDownloadFile = sinon.stub(SessionTool.methods, "downloadFile");

            wrapper = shallowMount(SessionTool, {store, localVue});
            wrapper.find("#fileDownload").trigger("click");
            expect(stubDownloadFile.called).to.be.true;
            sinon.restore();
        });
        it("should trigger upload if button is clicked", () => {
            const stubTriggerUpload = sinon.stub(SessionTool.methods, "triggerUpload");

            wrapper = shallowMount(SessionTool, {store, localVue});
            wrapper.find("#fileUpload").trigger("click");
            expect(stubTriggerUpload.called).to.be.true;
            sinon.restore();
        });
    });
    describe("Methods", () => {
        describe("downloadFile", () => {
            it("should not call createFile function if given param is not an array", () => {
                const stubCreateFile = sinon.stub(SessionTool.methods, "createFile");

                wrapper = shallowMount(SessionTool, {store, localVue});
                wrapper.vm.downloadFile(undefined);
                expect(stubCreateFile.called).to.be.false;
                wrapper.vm.downloadFile({});
                expect(stubCreateFile.called).to.be.false;
                wrapper.vm.downloadFile(null);
                expect(stubCreateFile.called).to.be.false;
                wrapper.vm.downloadFile(1234);
                expect(stubCreateFile.called).to.be.false;
                wrapper.vm.downloadFile("string");
                expect(stubCreateFile.called).to.be.false;
                wrapper.vm.downloadFile(true);
                expect(stubCreateFile.called).to.be.false;
                wrapper.vm.downloadFile(false);
                expect(stubCreateFile.called).to.be.false;
                sinon.restore();
            });
            it("should call createFile function if given param is an array", () => {
                const stubCreateFile = sinon.stub(SessionTool.methods, "createFile");

                wrapper = shallowMount(SessionTool, {store, localVue});
                wrapper.vm.downloadFile([]);
                expect(stubCreateFile.called).to.be.true;
                sinon.restore();
            });
            it("should call createFile function if given param is an array with object but has no getter function", () => {
                const stubCreateFile = sinon.stub(SessionTool.methods, "createFile");

                wrapper = shallowMount(SessionTool, {store, localVue});
                wrapper.vm.downloadFile([{}]);
                expect(stubCreateFile.called).to.be.true;
                sinon.restore();
            });
            it("should call createFile function with expected blob if given param is an array and object has a getter function", () => {
                const stubCreateFile = sinon.stub(SessionTool.methods, "createFile"),
                    observer = [
                        {
                            key: "boo",
                            getter: () => "foo"
                        }
                    ],
                    expectedBlob = new Blob([JSON.stringify({
                        state: {
                            "boo": "foo"
                        }
                    })], {type: "application/json;"});

                wrapper = shallowMount(SessionTool, {store, localVue});
                wrapper.vm.downloadFile(observer);
                expect(stubCreateFile.calledWithExactly(expectedBlob, "session.masterportal"));
                sinon.restore();
            });
        });
        describe("onFileLoad", () => {
            it("should not close the tool if given param is not an object with a property state", () => {
                const stubClose = sinon.stub(SessionTool.methods, "close");

                wrapper = shallowMount(SessionTool, {store, localVue});
                wrapper.vm.onFileLoad({});
                expect(stubClose.called).to.be.false;
                wrapper.vm.onFileLoad([]);
                expect(stubClose.called).to.be.false;
                sinon.restore();
            });
            it("should throw an error if the given param is not an parsable object or array", () => {
                wrapper = shallowMount(SessionTool, {store: store, localVue});
                wrapper.vm.onFileLoad(undefined);
                expect(addSingleAlertStub.called).to.be.true;
                sinon.restore();
            });
            it("should call the close function if given param is a parsable json string which also has a state property", () => {
                const stubClose = sinon.stub(SessionTool.methods, "close");

                wrapper = shallowMount(SessionTool, {store, localVue});
                wrapper.vm.onFileLoad(JSON.stringify({state: {}}));
                expect(stubClose.called).to.be.true;
                sinon.restore();
            });
        });
    });
});
