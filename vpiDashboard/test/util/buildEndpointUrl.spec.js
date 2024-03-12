import {expect} from "chai";
import {buildEndpointUrl} from "../../utils/buildEndpointUrl";

/**
 * Run only these tests via command:
 * npm run test:vue:watch -- --grep="addons/vpiDashboard/test/ Build Endpoint URL"
 */
describe("addons/vpiDashboard/test/ Build Endpoint URL", () => {
    it("should build correct endpoint URL for given base url and query parameters.", () => {
        const
            url = "/test-endpoint-1/",
            query = {
                "test_string": "1-2-3",
                "test_id": 654,
                "test_group_by[date]": null,
                "test_aggregate[Sum]": "test_visitors",
                "test_bool_false": false,
                "test_bool_true": true
            },
            endpointUrl = buildEndpointUrl(url, query),
            endpointUrlExpectedOutput = encodeURI("/test-endpoint-1/?test_string=1-2-3&test_id=654&test_group_by[date]=&test_aggregate[Sum]=test_visitors&test_bool_false=false&test_bool_true=true");

        expect(endpointUrl).to.equal(endpointUrlExpectedOutput);
    });
    it("should build correct endpoint URL for given base url and missing query parameters.", () => {
        const
            url = "/test-endpoint-2/",
            query = {},
            endpointUrl = buildEndpointUrl(url, query),
            endpointUrlExpectedOutput = encodeURI("/test-endpoint-2/");

        expect(endpointUrl).to.equal(endpointUrlExpectedOutput);
    });
});
