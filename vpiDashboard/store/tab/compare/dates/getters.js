import getCompareData from "../../../../utils/getCompareData";
const getters = {
    /**
     * Generates the data array for the bar chart for lcoation a and data a
     * @param {Object} activitiesDateA activitiesDateA state
     * @return {Object} data Object for bar chart
     */
    getActivitiesDateA: ({activitiesDateA}) => (chartType) => {
        return getCompareData.getCompareData(activitiesDateA, "#FD763B", "activities", chartType);
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} activitiesDateB activitiesDateB state
     * @return {Object} data Object for bar chart
     */
    getActivitiesDateB: ({activitiesDateB}) => (chartType) => {
        return getCompareData.getCompareData(activitiesDateB, "#0335FC", "activities", chartType);
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} dwellTimeDateA dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeDateA: ({dwellTimeDateA}) => (chartType) => {
        return getCompareData.getCompareData(dwellTimeDateA, "#FD763B", "dwellTime", chartType);
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} dwellTimeDateB dwellTimeDateB state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeDateB: ({dwellTimeDateB}) => (chartType) => {
        return getCompareData.getCompareData(dwellTimeDateB, "#0335FC", "dwellTime", chartType);
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} ageGroupsDateA ageGroupsDateA state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsDateA: ({ageGroupsDateA}) => (chartType) => {
        return getCompareData.getCompareData(ageGroupsDateA, "#FD763B", "ageGroup", chartType);
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} ageGroupsDateB ageGroupsDateB state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsDateB: ({ageGroupsDateB}) => (chartType) => {
        return getCompareData.getCompareData(ageGroupsDateB, "#0335FC", "ageGroup", chartType);
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} visitorTypesDateA visitorTypesDateA state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesDateA: ({visitorTypesDateA}) => (chartType) => {
        return getCompareData.getCompareData(visitorTypesDateA, "#FD763B", "visitorTypes", chartType);
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} visitorTypesDateB visitorTypesDateB state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesDateB: ({visitorTypesDateB}) => (chartType) => {
        return getCompareData.getCompareData(visitorTypesDateB, "#0335FC", "visitorTypes", chartType);
    }
};

export default getters;
