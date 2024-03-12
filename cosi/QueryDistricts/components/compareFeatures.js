import unifyString from "../../utils/unifyString.js";

export default {
    /**
     * calculates comparable features
     * @param {Array} layerFilterList value
     * @returns {Array} comparable features results
     */
    setComparableFeatures: async function (layerFilterList) {
        const allFeatures = layerFilterList.map(layerFilter => {
                const id = layerFilter.quotientLayer ?
                    `${layerFilter.layerId}/${layerFilter.quotientLayer}` : layerFilter.layerId;

                return this.propertiesMap[id]
                    .filter(props => props[layerFilter.field] >= layerFilter.value - layerFilter.low
                    && props[layerFilter.field] <= layerFilter.value + layerFilter.high
                    && props[this.selectorField].indexOf(this.keyOfAttrNameStats) !== -1);
            }),
            intersection = allFeatures.reduce((a, b) => a.filter(
                x => b.find(y => y[this.keyOfAttrNameStats]
                    === x[this.keyOfAttrNameStats])))
                .sort((a, b) => a.id > b.id ? 1 : -1),
            results = intersection.reduce((res, statObj) => {
                if (!res.resultNames.includes(statObj.id)) {
                    const geom = this.selectedDistrictLevel.districts
                        .find(d => unifyString(statObj.id, false).includes(d.getName()))?.adminFeature.getGeometry();

                    statObj.feature.setGeometry(geom);
                    res.table.push({
                        name: statObj.id,
                        ...allFeatures.map((p, i) => parseFloat(p.find(f => f[this.keyOfAttrNameStats] === statObj.id)[layerFilterList[i].field]))
                    });
                    res.features.push(statObj.feature);
                    res.resultNames.push(statObj.id);
                }

                return res;
            }, {
                resultNames: [],
                features: [],
                table: []
            });

        return results;
    }
};
