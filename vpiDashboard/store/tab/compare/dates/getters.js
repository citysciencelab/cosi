import getCompareData from "../../../../utils/getCompareData";
const getters = {
    /**
     * Generates the data array for the bar chart for lcoation a and data a
     * @param {Object} activitiesDateA activitiesDateA state
     * @return {Object} data Object for bar chart
     */
    getActivitiesDateA: ({activitiesDateA}) => {
        return getCompareData.getCompareData(activitiesDateA, "#FD763B", "activities");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} activitiesDateB activitiesDateB state
     * @return {Object} data Object for bar chart
     */
    getActivitiesDateB: ({activitiesDateB}) => {
        return getCompareData.getCompareData(activitiesDateB, "#0335FC", "activities");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} dwellTimeDateA dwellTimeDateA state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeDateA: ({dwellTimeDateA}) => {
        return getCompareData.getCompareData(dwellTimeDateA, "#FD763B", "dwellTime");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} dwellTimeDateB dwellTimeDateB state
     * @return {Object} data Object for bar chart
     */
    getDwellTimeDateB: ({dwellTimeDateB}) => {
        return getCompareData.getCompareData(dwellTimeDateB, "#0335FC", "dwellTime");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} ageGroupsDateA ageGroupsDateA state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsDateA: ({ageGroupsDateA}) => {
        return getCompareData.getCompareData(ageGroupsDateA, "#FD763B", "ageGroup");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} ageGroupsDateB ageGroupsDateB state
     * @return {Object} data Object for bar chart
     */
    getAgeGroupsDateB: ({ageGroupsDateB}) => {
        return getCompareData.getCompareData(ageGroupsDateB, "#0335FC", "ageGroup");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date a
     * @param {Object} visitorTypesDateA visitorTypesDateA state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesDateA: ({visitorTypesDateA}) => {
        return getCompareData.getCompareData(visitorTypesDateA, "#FD763B", "visitorTypes");
    },
    /**
     * Generates the data array for the bar chart for lcoation a and date b
     * @param {Object} visitorTypesDateB visitorTypesDateB state
     * @return {Object} data Object for bar chart
     */
    getVisitorTypesDateB: ({visitorTypesDateB}) => {
        return getCompareData.getCompareData(visitorTypesDateB, "#0335FC", "visitorTypes");
    }
};

export default getters;
