/**
 * set additional attributes based on geometry
 * @param {module:ol/Feature} feature -the feature
 * @param {{area: {key: string, factorToSqm: number}[], lineString: {key: string, factorToM: number}[]}} geomAttributes -the area related attributes to set
 * @returns {void}
 */
export default function setGeomAttributes (feature, geomAttributes) {
    const geometry = feature.getGeometry(),
        type = geometry?.getType();

    if (type === "Polygon" || type === "MultiPolygon") {
        const area = Math.round((geometry.getArea() + Number.EPSILON) * 100) / 100;

        for (const attr of geomAttributes.area) {
            feature.set(attr.key, area * attr.factorToSqm);
        }
    }
    else if (type === "LineString" || type === "MultiLineString") {
        let length;

        if (type === "LineString") {
            length = Math.round((geometry.getLength() + Number.EPSILON) * 100) / 100;
        }
        else if (type === "MultiLineString") {
            length = geometry.getLineStrings()
                .reduce((len, lineString) => len + Math.round((lineString.getLength() + Number.EPSILON) * 100) / 100, 0);
        }

        for (const attr of geomAttributes.lineString) {
            feature.set(attr.key, length * attr.factorToM);
        }
    }
}
