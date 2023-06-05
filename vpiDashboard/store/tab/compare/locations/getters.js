import getCompareData from "../../../../utils/getCompareData";

const getters = {
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} dwellTimeLocationA dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeLocationA: ({dwellTimeLocationA}) => {
        return getCompareData.getCompareData(dwellTimeLocationA, "Dwell Time Location A", "#FD763B", "Verweildauer");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} dwellTimeLocationB dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeLocationB: ({dwellTimeLocationB}) => {
        return getCompareData.getCompareData(dwellTimeLocationB, "Dwell Time Location B", "#0335FC", "Verweildauer");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} ageGroupsLocationA ageGroupsLocationA state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsLocationA: ({ageGroupsLocationA}) => {
        return getCompareData.getCompareData(ageGroupsLocationA, "Age Group Location A", "#FD763B", "Altersgruppen");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} ageGroupsLocationB ageGroupsLocationB state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsLocationB: ({ageGroupsLocationB}) => {
        return getCompareData.getCompareData(ageGroupsLocationB, "Age Group Location B", "#0335FC", "Altersgruppen");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} visitorTypesLocationA visitorTypesLocationA state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesLocationA: ({visitorTypesLocationA}) => {
        return getCompareData.getCompareData(visitorTypesLocationA, "Visitor Types Location A", "#FD763B", "Besuchergruppen");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} visitorTypesLocationB visitorTypesLocationB state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesLocationB: ({visitorTypesLocationB}) => {
        return getCompareData.getCompareData(visitorTypesLocationB, "Visitor Types Location B", "#0335FC", "Besuchergruppen");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} individualVisitorsLocationA individualVisitorsLocationA state
     * @return {Object} data Object for bar chart
     */
    getIndividualVisitorsLocationA: ({individualVisitorsLocationA}) => {
        return getCompareData.getCompareData(individualVisitorsLocationA, "Visitor Types Location A", "#FD763B", "Individuelle Besucher");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} individualVisitorsLocationB individualVisitorsLocationB state
     * @return {Object} data Object for bar chart
     */
    getIndividualVisitorsLocationB: ({individualVisitorsLocationB}) => {
        return getCompareData.getCompareData(individualVisitorsLocationB, "Visitor Types Location B", "#0335FC", "Individuelle Besucher");
    }
};

export default getters;
