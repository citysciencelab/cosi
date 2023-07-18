import Vuex from "vuex";
import {mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import VpiTheme from "../../../components/VpiTheme.vue";

const localVue = createLocalVue();
let store = {};

localVue.use(Vuex);

store = new Vuex.Store({
    namespaces: true,
    modules: {
        VpiTheme,
        Tools: {
            namespaced: true,
            modules: {
                VpiDashboard: {
                    namespaced: true,
                    getters: {
                        active: () => true
                    },
                    mutations: {
                        setSelectedLocationId: sinon.stub()
                    }
                }
            }}
    }
});


describe("VpiTheme", () => {
    it("renders the table rows and columns correctly", () => {
        const feature = {
                getMappedProperties () {
                    return {
                        ID: 1,
                        Name: "Example",
                        Description: "Lorem Ipsum"
                    };
                }
            },
            wrapper = mount(VpiTheme, {
                propsData: {
                    feature
                },
                store,
                localVue
            }),
            rows = wrapper.findAll("tr"),
            column = wrapper.findAll("td");


        expect(wrapper.exists()).to.be.true;

        expect(rows.length).to.equal(Object.keys(feature.getMappedProperties()).length);

        expect(column.length).to.equal(Object.keys(feature.getMappedProperties()).length * 2);
    });
});
