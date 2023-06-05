import getCompareData from "../../../../utils/getCompareData";
const getters = {
    /**
     * Generates the data array for the bar chart for lcoation a and data a
     * @param {Object} individualVisitorsDateA individualVisitorsDateA state
     * @return {Object} data Object for bar chart
     */
    getInvididualVisitorsDateA: ({individualVisitorsDateA}) => {
        return getCompareData.getCompareData(individualVisitorsDateA, "Individual Vistors Date A", "#FD763B", "Individuelle Besucher");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} individualVisitorsDateA individualVisitorsDateA state
     * @return {Object} data Object for bar chart
     */
    getInvididualVisitorsDateB: ({individualVisitorsDateB}) => {
        return getCompareData.getCompareData(individualVisitorsDateB, "Individual Vistors Date B", "#0335FC", "Individuelle Besucher");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} dwellTimeDateA dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeDateA: ({dwellTimeDateA}) => {
        return getCompareData.getCompareData(dwellTimeDateA, "Dwell Time Date A", "#FD763B", "Verweildauer");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} dwellTimeDateB dwellTimeDateB state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeDateB: ({dwellTimeDateB}) => {
        return getCompareData.getCompareData(dwellTimeDateB, "Dwell Time Date B", "#0335FC", "Verweildauer");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} ageGroupsDateA ageGroupsDateA state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsDateA: ({ageGroupsDateA}) => {
        return getCompareData.getCompareData(ageGroupsDateA, "Age Group Date A", "#FD763B", "Altersgruppen");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} ageGroupsDateB ageGroupsDateB state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsDateB: ({ageGroupsDateB}) => {
        return getCompareData.getCompareData(ageGroupsDateB, "Age Group Date B", "#0335FC", "Altersgruppen");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} visitorTypesDateA ageGroupsDateA state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesDateA: ({visitorTypesDateA}) => {
        return getCompareData.getCompareData(visitorTypesDateA, "Visitor Type Date A", "#FD763B", "Besuchergruppen");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} visitorTypesDateA ageGroupsDateA state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesDateB: ({visitorTypesDateB}) => {
        return getCompareData.getCompareData(visitorTypesDateB, "Visitor Type Date B", "#0335FC", "Besuchergruppen");
    }
};

export default getters;
