import tabVisitorTypesState from "./tab/visitor-types/state";
import tabCompareDatesState from "./tab/compare/dates/state";
import tabCompareLocationsState from "./tab/compare/locations/state";
import tabAgeGroupsState from "./tab/age-groups/state";
import tabDwellTimeState from "./tab/dwell-time/state";

const state = {
    id: "vpiDashboard",
    active: false,
    name: "translate#additional:modules.tools.vpiDashboard.title",
    icon: "bi-graph-up",
    renderToWindow: false,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false,
    chartData: "overview",
    allDataClicked: true,
    sumVisitorsPerMonth: [],
    averageVisitorsPerDay: [],
    activitiesPerYear: "",
    allLocationsGeoJson: undefined,
    allLocationsArray: [],
    barChartDailyData: [],
    lineChartDailyData: [],
    barChartMonthlyData: [],
    lineChartMonthlyData: [],
    barChartData: {},
    lineChartData: {},
    showLoader: false,
    selectedLocationId: "",
    activityData: {},
    ...tabVisitorTypesState,
    ...tabCompareDatesState,
    ...tabCompareLocationsState,
    ...tabAgeGroupsState,
    ...tabDwellTimeState
};

export default state;
