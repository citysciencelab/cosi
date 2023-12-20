import {Fill, Stroke, Style} from "ol/style.js";
import {asArray} from "ol/color";
import {getModelByAttributes} from "../../utils/radioBridge.js";
import Feature from "ol/Feature";

const defaultStyleValues = {
    fill: {
        color: [255, 255, 255, 0]
    },
    stroke: {
        color: [51, 153, 204, 1],
        width: 3
    }
};

/**
 * Calls the style function of a layer with the passed feature to return its style object.
 * @param {ol/StyleFunction} styleFunction - A layer style function. Should return a style or an array of them.
 * @param {ol/Feature} feature - A feature object.
 * @returns {ol/Style|undefined} The feature style object or undefined if there is no style.
 */
export function getFeatureStyle (styleFunction, feature) {
    if (typeof styleFunction !== "function") {
        console.error("getFeatureStyle: First parameter 'styleFunction' must be a function, but got " + typeof styleFunction);
        return undefined;
    }

    if (!(feature instanceof Feature)) {
        console.error("getFeatureStyle: Second parameter 'feature' must be an instance of ol feature, but got " + feature);
        return undefined;
    }

    const styles = styleFunction(feature);

    if (styles) {
        return Array.isArray(styles) ? styles[0] : styles;
    }

    return undefined;
}

/**
 * Looks over passed parameters in the given order to get the right fill color,
 * sets the opacity and returns a fill style with the found fill color.
 * @param {ol/Style|undefined} style - The style from which the fill color is checked first.
 * @param {Object|undefined} styleValues - The values that are checked second for the fill color.
 * @param {Number[]} defaultColor - The color that is taken when no other is found.
 * @param {Number} opacity - The opacity for the fill color.
 * @returns {ol/style/Fill|null} The fill style.
 */
export function getSelectedFillStyle (style, styleValues, defaultColor, opacity) {
    if (!Array.isArray(defaultColor)) {
        console.error("getSelectedFillStyle: Third parameter defaultColor must be an array of objects, but got " + typeof defaultColor);
        return null;
    }
    if (typeof opacity !== "number") {
        console.error("getSelectedFillStyle: Fourth parameter opacity must be a number, but got " + typeof opacity);
        return null;
    }
    const fillColor = asArray(style?.getFill()?.getColor() || styleValues?.fill?.color || defaultColor);

    return new Fill({
        color: [fillColor[0], fillColor[1], fillColor[2], opacity]
    });
}

/**
 * Looks over passed parameters in the given order to get the right stroke style.
 * @param {ol/Style|undefined} style - The style that is checked first if it has a stroke style.
 * @param {Object|undefined} styleValues - The values that are checked second for the stroke style.
 * @param {Number[]} defaultStrokeColor - The default color for the stroke style.
 * @param {Number} defaultStrokeWidth - The default width for the stroke style.
 * @returns {ol/style/Stroke} The stroke style.
 */
export function getSelectedStrokeStyle (style, styleValues, defaultStrokeColor = [51, 153, 204, 1], defaultStrokeWidth = 3) {
    if (style?.getStroke()) {
        return style.getStroke();
    }

    return new Stroke({
        color: styleValues?.stroke?.color || defaultStrokeColor,
        width: styleValues?.stroke?.width || defaultStrokeWidth
    });
}

/**
 * Styles the features of the selected layer with transparent overlay for better readability
 * @param {Object[]} districtLevels - the districtlevels object from the district selector module
 * @param {String|undefined} selectedLevelId - The id of the selected district level.
 * @param {Object} [activeStyleValues={fill: {color: [255, 255, 255, 0]}, stroke: {color: "#3399CC", width: 3}}] - the default values in case no styles can be obtained
 * @param {Number} [opacity=0.6] - the opacity of the overlay
 * @returns {void}
 */
export function styleSelectedDistrictLevels (districtLevels, selectedLevelId, activeStyleValues = defaultStyleValues, opacity = 0.6) {
    if (!Array.isArray(districtLevels)) {
        console.error("styleSelectedDistrictLevels: District levels must be an array of objects");
        return;
    }

    districtLevels.forEach(level => {
        const features = level.layer.getSource().getFeatures();

        if (level.layerId === selectedLevelId && features.length > 0) {
            const layerStyleFunction = level.layer.getStyleFunction(),
                baseStyle = getFeatureStyle(layerStyleFunction, features[0]),
                selectedStyle = new Style({
                    fill: getSelectedFillStyle(baseStyle, activeStyleValues, defaultStyleValues.fill.color, opacity),
                    stroke: getSelectedStrokeStyle(baseStyle, activeStyleValues)
                });

            level.layer.getSource().getFeatures().forEach(feature => {
                feature.setStyle();
            });
            level.layer.setStyle(() => selectedStyle);
        }
        else {
            const model = getModelByAttributes({id: level.layerId});

            if (model) {
                model.styling();
            }
        }
    });
}
