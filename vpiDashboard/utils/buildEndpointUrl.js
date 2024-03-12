import querystring from "querystring";

/**
 * Generates an url. Generates the query string from a parameters object.
 * Uses the node package "query-string". It parses and stringifies URL query strings.
 * @param {String} url Base API endpoint url.
 * @param {Object} queryParameters query string parameters
 * @return {string} Full url to endpoint
 */
export function buildEndpointUrl (url, queryParameters) {
    let endpointUrl = url;

    if (Object.keys(queryParameters).length) {
        endpointUrl += `?${querystring.stringify(queryParameters)}`;
    }

    // In order to debug the generated endpoint URL and query parameters, use this line.
    // console.log("%c" + JSON.stringify([endpointUrl, queryParameters], null, 2), "color:green;font-size:xx-small;"); // dumpDebug

    return endpointUrl;
}
