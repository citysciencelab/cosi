import getCompareData from "../../../../utils/getCompareData";

const getters = {
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} dwellTimeLocationA dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeLocationA: ({dwellTimeLocationA}) => {
        return getCompareData.getCompareData(dwellTimeLocationA, "#FD763B", "dwellTime");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} dwellTimeLocationB dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeLocationB: ({dwellTimeLocationB}) => {
        return getCompareData.getCompareData(dwellTimeLocationB, "#0335FC", "dwellTime");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} ageGroupsLocationA ageGroupsLocationA state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsLocationA: ({ageGroupsLocationA}) => {
        return getCompareData.getCompareData(ageGroupsLocationA, "#FD763B", "ageGroup");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} ageGroupsLocationB ageGroupsLocationB state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsLocationB: ({ageGroupsLocationB}) => {
        return getCompareData.getCompareData(ageGroupsLocationB, "#0335FC", "ageGroup");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} visitorTypesLocationA visitorTypesLocationA state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesLocationA: ({visitorTypesLocationA}) => {
        return getCompareData.getCompareData(visitorTypesLocationA, "#FD763B", "visitorTypes");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} visitorTypesLocationB visitorTypesLocationB state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesLocationB: ({visitorTypesLocationB}) => {
        return getCompareData.getCompareData(visitorTypesLocationB, "#0335FC", "visitorTypes");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} activitiesLocationA activitiesLocationA state
     * @return {Object} data Object for bar chart
     */
    getActivitiesLocationA: ({activitiesLocationA}) => {
        return getCompareData.getCompareData(activitiesLocationA, "#FD763B", "activities");
    },
    /**
     * Generates the data array for the bar chart for location a and date a
     * @param {Object} activitiesLocationB activitiesLocationB state
     * @return {Object} data Object for bar chart
     */
    getActivitiesLocationB: ({activitiesLocationB}) => {
        return getCompareData.getCompareData(activitiesLocationB, "#0335FC", "activities");
    }
};

export default getters;
