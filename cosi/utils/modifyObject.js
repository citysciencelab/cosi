/**
 * replaces the values of an object with the values provided.
 * @param {object} obj - the original object
 * @param {object} valuesMap - values mapping object
 * @param {Boolean} [replaceBoolean=false] - replace boolean values with strings
 * @param {Boolean} [formatNumbers=false] - format numbers to locale string
 * @param {Boolean} [locale='de-DE'] - the current locale
 * @returns {object} the renamed object
 */
export function replaceValues (obj, valuesMap = {}, replaceBoolean = false, formatNumbers = false, locale = "de-DE") {
    const _obj = {...obj};
    let key;

    for (key in _obj) {
        if (replaceBoolean && typeof _obj[key] === "boolean") {
            _obj[key] = _obj[key].toString();
        }
        if (valuesMap[_obj[key]]) {
            _obj[key] = valuesMap[_obj[key]];
            continue;
        }
        if (formatNumbers && typeof _obj[key] === "number") {
            _obj[key] = _obj[key].toLocaleString(locale);
        }
    }

    return _obj;
}
