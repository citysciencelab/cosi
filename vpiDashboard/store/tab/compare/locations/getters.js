import getCompareData from "../../../../utils/getCompareData";

const getters = {
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} dwellTimeLocationA dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeLocationA: ({dwellTimeLocationA}) => (chartType) => {
        return getCompareData.getCompareData(dwellTimeLocationA, "#FD763B", "dwellTime", chartType);
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} dwellTimeLocationB dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeLocationB: ({dwellTimeLocationB}) => (chartType) => {
        return getCompareData.getCompareData(dwellTimeLocationB, "#0335FC", "dwellTime", chartType);
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} ageGroupsLocationA ageGroupsLocationA state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsLocationA: ({ageGroupsLocationA}) => (chartType) => {
        return getCompareData.getCompareData(ageGroupsLocationA, "#FD763B", "ageGroup", chartType);
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} ageGroupsLocationB ageGroupsLocationB state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsLocationB: ({ageGroupsLocationB}) => (chartType) => {
        return getCompareData.getCompareData(ageGroupsLocationB, "#0335FC", "ageGroup", chartType);
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} visitorTypesLocationA visitorTypesLocationA state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesLocationA: ({visitorTypesLocationA}) => (chartType) => {
        return getCompareData.getCompareData(visitorTypesLocationA, "#FD763B", "visitorTypes", chartType);
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} visitorTypesLocationB visitorTypesLocationB state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesLocationB: ({visitorTypesLocationB}) => (chartType) => {
        return getCompareData.getCompareData(visitorTypesLocationB, "#0335FC", "visitorTypes", chartType);
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} activitiesLocationA activitiesLocationA state
     * @return {Object} data Object for bar chart
     */
    getActivitiesLocationA: ({activitiesLocationA}) => (chartType) => {
        return getCompareData.getCompareData(activitiesLocationA, "#FD763B", "activities", chartType);
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} activitiesLocationB activitiesLocationB state
     * @return {Object} data Object for bar chart
     */
    getActivitiesLocationB: ({activitiesLocationB}) => (chartType) => {
        return getCompareData.getCompareData(activitiesLocationB, "#0335FC", "activities", chartType);
    }
};

export default getters;
