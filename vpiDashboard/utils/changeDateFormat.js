/**
 * @param {Object} date The date what should be changed
 * @param {Number} year The year of the date
 * @return {string} The new formatted string MM-YYYY
 */
export function changeDateFormat (date) {
    const theDate = new Date(date),
        year = theDate.getFullYear(),
        month = theDate.getMonth() + 1;

    return `${month.toString().padStart(2, "0")}-${year}`;
}
