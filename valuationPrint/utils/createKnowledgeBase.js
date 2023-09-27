import {collectFeatures} from "./collectFeatures.js";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import nextFeatureByDistance from "./precompiler.nextFeatureByDistance.js";
import allFeaturesByDuration from "./precompiler.allFeaturesByDuration.js";
import {nextGroupedFeaturesByDistance} from "./precompiler.nextGroupedFeaturesByDistance.js";
import sumNumbers from "./precompiler.sumNumbers.js";

/**
 * Creates the knowledge base by the services config.
 * @param {Object} parcelData - The parcel.
 * @param {Number[]} parcelData.center - The center of the parcel extent.
 * @param {ol/extent} parcelData.extent - The extent of the parcel.
 * @param {ol/Feature} parcel.feature - The ol feature of the parcel.
 * @param {ol/geom/Polygon} parcelData.geometry - The geometry of the parcel.
 * @param {Object} services - The services config for the valuation.
 * @param {String} mapProjection - The EPSG-Code of the current map projection.
 * @param {Function} onstart - A function that is called when the knowledge base creation starts.
 * @param {Function} onfinish - A function that is called when the knowledge base is created.
 * @param {Function} onUserError - Error function.
 * @param {Function} onDevError - Error function.
 * @param {Object} [knowledgeBase={}] - The knowledge base.
 * @param {Number} [idx=0] - The index.
 * @returns {void}
 */
export function createKnowledgeBase (parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase = {}, idx = 0) {
    const prefix = Object.keys(services)[idx],
        config = services[prefix];

    if (typeof config === "undefined") {
        onfinish(knowledgeBase);
        return;
    }

    if (typeof onstart === "function" && typeof config?.onstart === "string") {
        onstart(config?.onstart);
    }

    collectFeatures(parcelData, config, mapProjection, rawLayerList.getLayerWhere({id: config.layerId}), features => {
        if (features.length === 0) {
            if (config?.precompiler?.type === "assignAttributes") {
                knowledgeBase[prefix] = undefined;
            }
            else {
                config.propertyName.forEach(attributeKey => {
                    knowledgeBase[prefix + "." + attributeKey] = undefined;
                });
            }
            createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
        }
        else if (config?.precompiler?.type === "allFeaturesByDuration") {
            allFeaturesByDuration(
                parcelData.center,
                features,
                config.precompiler.durationKey,
                config.precompiler.distanceKey,
                config.precompiler.speedProfile,
                config.propertyName,
                onstart,
                attributes => {
                    Object.entries(attributes).forEach(([attributeKey, attributeValue]) => {
                        knowledgeBase[prefix + "." + attributeKey] = attributeValue;
                    });
                    createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
                }, error => {
                    onDevError(error);
                    onUserError(config.onerror);
                    addKnowledgeBaseError(knowledgeBase, error, prefix, Array.isArray(config.propertyName) ? config.propertyName.concat(config.precompiler.key) : [config.precompiler.key]);
                    createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
                }
            );
        }
        else if (config?.precompiler?.type === "nextGroupedFeaturesByDistance") {
            nextGroupedFeaturesByDistance(parcelData.center, features, config.precompiler.key, config.precompiler.propertyName, config.precompiler.delimitor, config.propertyName, attributes => {
                Object.entries(attributes).forEach(([attributeKey, attributeValue]) => {
                    knowledgeBase[prefix + "." + attributeKey] = attributeValue;
                });
                createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
            }, error => {
                onDevError(error);
                onUserError(config.onerror);
                addKnowledgeBaseError(knowledgeBase, error, prefix, Array.isArray(config.propertyName) ? config.propertyName.concat(config.precompiler.key) : [config.precompiler.key]);
                createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
            });
        }
        else if (config?.precompiler?.type === "nextFeatureByDistance") {
            nextFeatureByDistance(parcelData.center, features, config.precompiler.key, config.propertyName, attributes => {
                Object.entries(attributes).forEach(([attributeKey, attributeValue]) => {
                    knowledgeBase[prefix + "." + attributeKey] = attributeValue;
                });
                createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
            }, error => {
                onDevError(error);
                onUserError(config.onerror);
                addKnowledgeBaseError(knowledgeBase, error, prefix, Array.isArray(config.propertyName) ? config.propertyName.concat(config.precompiler.key) : [config.precompiler.key]);
                createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
            });
        }
        else if (config?.precompiler?.type === "sumNumbers") {
            sumNumbers(features, config.precompiler.key, config.precompiler.sumProperty, config.propertyName, attributes => {
                Object.entries(attributes).forEach(([attributeKey, attributeValue]) => {
                    knowledgeBase[prefix + "." + attributeKey] = attributeValue;
                });
                createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
            }, error=> {
                onDevError(error);
                onUserError(config.onerror);
                addKnowledgeBaseError(knowledgeBase, error, prefix, Array.isArray(config.propertyName) ? config.propertyName.concat(config.precompiler.key) : [config.precompiler.key]);
                createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
            });
        }
        else if (config?.precompiler?.type === "assignAttributes") {
            const attributes = [],
                configProperties = {};

            config.propertyName.forEach(prop => {
                configProperties[prop] = undefined;
            });
            features.forEach(feature => {
                attributes.push(Object.assign(configProperties, feature.getProperties(), config.precompiler.attributes));
            });
            knowledgeBase[prefix] = attributes;
            createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
        }
        else {
            const attributes = createAttributesByFeatures(features, config.propertyName);

            Object.entries(attributes).forEach(([attributeKey, attributeValue]) => {
                knowledgeBase[prefix + "." + attributeKey] = attributeValue;
            });
            createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
        }
    }, error => {
        onDevError(error);
        onUserError(config?.onerror);
        addKnowledgeBaseError(knowledgeBase, error, prefix, config?.propertyName);
        createKnowledgeBase(parcelData, services, mapProjection, onstart, onfinish, onUserError, onDevError, knowledgeBase, idx + 1);
    });
}

/**
 * Adds an error to the knowledge base.
 * @param {Object} knowledgeBase={} - The knowledge base.
 * @param {Error} error - The error object.
 * @param {String} prefix - The prefix to use as part of the key.
 * @param {String[]} propertyName - The attribute names to add the error to.
 * @returns {void}
 */
export function addKnowledgeBaseError (knowledgeBase, error, prefix, propertyName) {
    if (Array.isArray(propertyName)) {
        propertyName.forEach(attrName => {
            if (typeof attrName !== "string") {
                return;
            }
            knowledgeBase[prefix + "." + attrName] = error;
        });
    }
}

/**
 * Creates an attribute object by the passed propertyNames and gets the value from the feature(s).
 * @param {ol/Feature[]} features - The features.
 * @param {String[]} propertyNames - The names of the required attributes of the feature.
 * @returns {Object} The attribute object.
 */
export function createAttributesByFeatures (features, propertyNames) {
    const attributes = {};

    features.forEach(feature => {
        propertyNames.forEach(name => {
            if (!Array.isArray(attributes[name])) {
                attributes[name] = [];
            }
            attributes[name].push(feature.get(name));
        });
    });
    return attributes;
}
