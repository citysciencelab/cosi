import {getLastAvailableYear} from "../../utils/getAvailableYears";
import MappingJson from "../../assets/mapping.json";

/**
 * @todo ONLY PROTOTYPE!!!! refactor
 * @param {String} districtName - the district to process data for
 * @param {String} districtLevel - the districtLevel to operate on
 * @param {module:ol/Feature[]} statsFeatures - the features holding statistical data
 * @param {String} basePopulationProp - the population property for ratio
 * @param {String} timelinePrefix - the key prefix form timestamps
 * @param {String} [groupsList] - the statistical data groups to process
 * @param {String} [mapping] - all statistical category objects (from DistrictSelector, Fallback from static files)
 * @returns {Object} - the base stats for the picked reference district
 */
export default function processStats (districtName, districtLevel, statsFeatures, basePopulationProp, timelinePrefix, groupsList, mapping = MappingJson) {
    const
        stats = statsFeatures.map(feature => feature.getProperties()),
        latestYear = timelinePrefix + getLastAvailableYear(statsFeatures, timelinePrefix),
        populationStats = groupsList?.length > 0 ? mapping.filter(mappingObj => groupsList.includes(mappingObj.group)) : mapping,
        basePopulationFeature = statsFeatures.find(feature => feature.get("kategorie") === basePopulationProp),
        basePopulation = parseFloat(basePopulationFeature.get(latestYear)),
        baseStats = {
            reference: {
                districtName,
                districtLevel
            },
            absolute: [],
            relative: []
        };

    for (const mappingObj of populationStats) {
        const datum = stats.find(d => d.kategorie === mappingObj.value);
        let value;

        if (mappingObj.valueType === "absolute") {
            value = parseFloat(datum[latestYear]) / basePopulation;
        }
        else {
            value = parseFloat(datum[latestYear]);
        }

        baseStats[mappingObj.valueType].push({
            group: datum.group,
            category: datum.kategorie,
            value: value,
            valueType: mappingObj.valueType
        });
    }

    return baseStats;
}
