import {expect} from "chai";
import getters from "../store/gettersVpiDashboard";
import stateVpiDashboard from "../store/stateVpiDashboard";

const {
    active,
    id,
    name,
    icon,
    renderToWindow,
    resizableWindow,
    isVisibleInMenu,
    deactivateGFI
} = getters;

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ ADDON: VPI Dashboard"
 */
describe("addons/vpiDashboard/test/ ADDON: VPI Dashboard", () => {
    describe("Vpi Dashboard getters", () => {
        it("returns the active state from state", () => {
            expect(active(stateVpiDashboard)).to.be.false;
        });
        it("returns the id from state", () => {
            expect(id(stateVpiDashboard)).to.equals("vpiDashboard");
        });
    });
    describe("testing default values", () => {
        it("returns the name default value from state", () => {
            expect(name(stateVpiDashboard)).to.be.equals("translate#additional:modules.tools.vpiDashboard.title");
        });
        it("returns the icon default value from state", () => {
            expect(icon(stateVpiDashboard)).to.equals("bi-graph-up");
        });
        it("returns the renderToWindow default value from state", () => {
            expect(renderToWindow(stateVpiDashboard)).to.be.true;
        });
        it("returns the resizableWindow default value from state", () => {
            expect(resizableWindow(stateVpiDashboard)).to.be.true;
        });
        it("returns the isVisibleInMenu default value from state", () => {
            expect(isVisibleInMenu(stateVpiDashboard)).to.be.true;
        });
        it("returns the deactivateGFI default value from state", () => {
            expect(deactivateGFI(stateVpiDashboard)).to.be.false;
        });
    });
});
