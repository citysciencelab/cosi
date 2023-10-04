/** Calculates the ratio of a set of features.
* @param {String} id id that is to be turned into a unique abbreviation
* @param {String} oId original id
* @param {Array} selections All selection in store selection Array
* @param {Number} run # of iteration
* @returns {String} unique abbreviation
*/
export default function uniqueAbv (id, oId, selections, run) {
    const abv = id.match(/[A-Z0-9-]/g).join("");

    if (selections.find(sel => sel === abv)) {
        const tryAbv = oId + "-" + run;

        return uniqueAbv(tryAbv, abv, selections, run + 1);
    }

    return abv;
}
