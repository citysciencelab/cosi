import {
    expect
} from "chai";
import requestIsochrones from "../../../utils/requestIsochrones";
import axios from "axios";

describe("requestIsochrones", () => {
    it.skip("point request within hamburg", async () => {
        const res = await requestIsochrones(
            "driving-car", [
                [10.01454373872902, 53.54889579639215]
            ],
            "time", [600 * 0.33, 600 * 0.67, 600]);

        expect(res).to.have.length(3);
    });
    it.skip("point request within hamburg with abort", async () => {

        const cancelTokenSource = axios.CancelToken.source();

        await requestIsochrones(
            "driving-car", [
                [10.01454373872902, 53.54889579639215]
            ],
            "time", [600 * 0.33, 600 * 0.67, 600], cancelTokenSource);

        cancelTokenSource.cancel();
    });
    it.skip("point request outside hamburg", async () => {
        try {
            await requestIsochrones(
                "driving-car", [
                    [9.744273174491198, 53.86052854494209],
                    [10.044398219793916, 53.58614195023027],
                    [10.00047212535128, 53.59431305465069],
                    [10.009020188268527, 53.54967920652423],
                    [10.042859099930093, 53.57695084241739]
                ],
                "time", [600 * 0.33, 600 * 0.67, 600]);
        }
        catch (e) {
            expect(e.response.data.error.code).to.equal(3099);
        }
    });
    it.skip("point request invalid data", async () => {
        try {
            await requestIsochrones(
                "driving-car", [
                    [9.744273174491198, "b"]
                ],
                "time", [600 * 0.33, 600 * 0.67, 600]);
        }
        catch (e) {
            expect(e.response.data.error.code).to.equal(3002);
        }
    });
});
