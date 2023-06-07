<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import AnalysisPagination from "../../components/AnalysisPagination.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCalculateRatio";
import mutations from "../store/mutationsCalculateRatio";
import utils from "../../utils";
import exportXlsx from "../../utils/exportXlsx";
import DataTable from "./DataTable.vue";
import {exportAsGeoJson} from "../utils/exportResults";
import mapping from "../../assets/mapping.json";
import ToolInfo from "../../components/ToolInfo.vue";
import {getCenter} from "ol/extent";
import {getLayerSource} from "../../utils/layer/getLayerSource";
import {getModelByAttributes} from "../../utils/radioBridge.js";

export default {
    name: "CalculateRatio",
    components: {
        Tool,
        ToolInfo,
        DataTable,
        AnalysisPagination
    },
    data () {
        return {
            // All available features
            featuresStatistics: [],
            // List with names of selected Layers
            layerIdList: [],
            // List of all available "facilites" (theme layers)
            facilityList: [],
            // Sorted an grouped list of availabke features
            featuresList: [],
            // Holds all statistical data from selectedFeatures (DistrictSelector)
            selectedStatFeatures: [],
            // List with summable features like "age 10-15" etc
            subFeaturesList: [],
            // All available years in data
            availableYears: [],
            // Year the user selected manually
            selectedYear: "",
            // Properties of facility type (like Schülerzahl in schools) for Field A
            facilityPropertyList_A: [],
            // Properties of facility type (like Schülerzahl in schools) for Field B
            facilityPropertyList_B: [],
            // Var that controls if user calculates with statistical data (feature) oder facility for Field A
            ASwitch: true,
            // Var that controls if user calculates with statistical data (feature) oder facility for Field B
            BSwitch: true,
            // Var that controls if user chose summable statistical data set for Field A
            aSumUpSwitchA: false,
            // Var that controls if user chose summable statistical data set for Field B
            aSumUpSwitchB: false,
            // Selected value for Field A (it's an object because it can carry more information like values or properties, depending on the data set)
            selectedFieldA: {id: ""},
            // Selected value for Field B (it's an object because it can carry more information like values or properties, depending on the data set)
            selectedFieldB: {id: ""},
            // Selected property for Field A (facility only)
            paramFieldA: {name: "", id: ""},
            // Selected property for Field B (facility only)
            paramFieldB: {name: "", id: ""},
            // "Faktor F" has been entered by the user for Field A
            fActive_A: false,
            // "Faktor F" has been entered by the user for Field B
            fActive_B: false,
            // "Faktor F" for Field A
            faktorf_A: 1,
            // "Faktor F" for Field B
            faktorf_B: 1,
            // Modifier "berechnen pro" for Field A
            perCalc_A: 1,
            // Modifier "berechnen pro" for Field B
            perCalc_B: 1,
            // Helper Array to use selected values beyond function scope
            featureVals: [],
            // Object that helps calculating the data in prepareCoverage function
            calcHelper: {},
            // Clone of the results array for helping updating the displayed table live
            resultsClone: [],
            // Selected column to render in CCM
            columnSelector: {name: "Verhältnis", key: "relation"}
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/CalculateRatio", Object.keys(getters)),
        ...mapGetters("Tools/DistrictSelector", ["selectedDistrictLevel", "selectedFeatures", "label", "keyOfAttrName", "keyOfAttrNameStats", "loadend"]),
        ...mapGetters("Tools/FeaturesList", {facilitiesMapping: "mapping", groupActiveLayer: "groupActiveLayer", isFeatureActive: "isFeatureActive"}),
        ...mapGetters("Maps", ["getVisibleLayerList"]),
        ...mapGetters("Tools/ColorCodeMap", ["visualizationState"]),
        availableColumns () {
            const options = [
                {name: "Verhältnis", key: "relation"},
                {name: "Bedarfsdeckung (%)", key: "coverage"}
            ];

            if (this.fActive_A || this.fActive_B) {
                const capacity = {
                        name: "Kapazität",
                        key: "capacity"
                    },
                    need = {
                        name: "Bedarf",
                        key: "need"
                    };

                options.push(capacity, need);
            }

            return options;
        }
    },
    watch: {
        aSumUpSwitchA (value) {
            if (value) {
                this.selectedFieldA.id = [this.selectedFieldA.id];
            }
        },
        aSumUpSwitchB (value) {
            if (value) {
                this.selectedFieldB.id = [this.selectedFieldB.id];
            }
        },
        getVisibleLayerList () {
            this.layerIdList = this.getVisibleLayerList.map(x => x.getProperties().name);
            this.updateFacilities();
        },
        loadend (newValue) {
            const selectedDistricts = this.selectedDistrictLevel.districts.filter(district => district.isSelected === true);

            this.selectedStatFeatures = selectedDistricts.map(district => district.statFeatures).flat();
            if (newValue && this.selectedFeatures.length > 0) {
                this.updateFeaturesList();
            }
        },
        results (newResults) {
            if (newResults.length > 0) {
                this.resultsClone = [...newResults];
            }
        },
        resultsClone (newClone) {
            newClone.forEach((result, index) => {
                if (result.scope === "Gesamt" || result.scope === "Durchschnitt") {
                    newClone.splice(index, 1);
                }
            });
        },
        visualizationState (newState) {
            if (!newState) {
                this.$store.commit("Tools/CalculateRatio/setDataToColorCodeMap", false);
            }
        },
        facilitiesMapping () {
            this.updateFacilities();
        },
        filters () {
            this.prepareCoverage();
        },
        async activeSet (newValue) {
            if (!this.dataSets[newValue]) {
                return;
            }

            for (const key in this.dataSets[newValue].inputs) {
                this[key] = JSON.parse(JSON.stringify(this.dataSets[newValue].inputs[key]));
            }

            await this.$nextTick();
            this.selectedFieldA.id = Array.isArray(this.selectedFieldA.id) ? this.selectedFieldA.id.flat() : this.selectedFieldA.id;
            this.selectedFieldB.id = Array.isArray(this.selectedFieldB.id) ? this.selectedFieldB.id.flat() : this.selectedFieldB.id;

            this.setResults(this.dataSets[newValue].results);
            this.setResultHeaders(this.dataSets[newValue].resultHeaders);
            const data = this.getDataForColorCodeMap();

            this.setColorCodeMapDataset(data);
        },
        dataSets (newValue) {
            if (newValue.length === 0) {
                this.setResults([]);
            }
        },

        /**
         * Updates the ColorCodeMap if visualized.
         * @returns {void}
         */
        columnSelector () {
            if (this.dataToColorCodeMap) {
                const data = this.getDataForColorCodeMap();

                this.setColorCodeMapDataset(data);
            }
        },

        /**
         * Updates the ColorCodeMap if visualized.
         * @returns {void}
         */
        selectedYear () {
            if (this.dataToColorCodeMap) {
                const data = this.getDataForColorCodeMap();

                this.setColorCodeMapDataset(data);
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    mounted () {
        this.applyTranslationKey(this.name);

        if (this.facilityList.length === 0) {
            this.ASwitch = false;
            this.BSwitch = false;
        }
    },
    methods: {
        ...mapMutations("Tools/CalculateRatio", Object.keys(mutations)),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),
        ...mapActions("Tools/ChartGenerator", ["channelGraphData"]),
        ...mapMutations("Tools/ChartGenerator", ["setNewDataset"]),
        /**
         * @description Updates theme layer selection and sorting/ grouping it for display in multiselect.
         * @todo triggers too often!!! refactor
         * @returns {void}
         */
        updateFacilities () {
            this.facilityList = this.facilitiesMapping.reduce((list, group) => {
                const lengthCheck = group.layer.filter(layer => this.layerIdList.includes(layer.id));

                if (lengthCheck.length > 0) {
                    return [
                        ...list,
                        {
                            group: group.group,
                            layer: lengthCheck
                        }
                    ];
                }

                return list;
            }, []);

            if (this.facilityList.length !== 0) {
                this.ASwitch = true;
            }
        },
        /**
         * @description Updates featuresList and sorting/ grouping it for display in multiselect.
         * @returns {void}
         */
        updateFeaturesList () {
            this.featuresList = [];
            this.subFeaturesList = [];

            mapping.forEach(attr => {
                if (attr[this.keyOfAttrNameStats] && attr.valueType === "absolute") {
                    const findGrp = this.featuresList.find(el => el.header === attr.group);

                    if (findGrp) {
                        this.featuresList.push({value: attr.value, text: attr.value});
                    }
                    else {
                        this.featuresList.push({header: attr.group});
                        this.featuresList.push({value: attr.value, text: attr.value});
                    }

                    if (attr.summable) {
                        if (this.subFeaturesList.length === 0) {
                            this.subFeaturesList.push({header: "Aufsummierbar"});
                            this.subFeaturesList.push({value: attr.value, text: attr.value});
                        }
                        else {
                            this.subFeaturesList.push({value: attr.value, text: attr.value});
                        }

                    }
                }
            });

            if (this.featuresList.length !== 0) {
                this.BSwitch = false;
            }
        },
        /**
         * @description Changes dropdown display between statistical data (features) and them layers (facilities).
         * @param {String} letter String that determines which field is to be modified (A or B for FieldA or FieldB).
         * @returns {void}
         */
        switchVal (letter) {
            if (this[letter + "Switch"]) {
                if (this.featuresList.length === 0) {
                    this.showAlert(this.$t("additional:modules.tools.cosi.calculateRatio.noFeaturesWarning"));
                }
                else {
                    this[letter + "Switch"] = !this[letter + "Switch"];
                    this["selectedField" + letter] = {id: ""};
                    this["paramField" + letter] = "";
                    this["sumUpSwitch" + letter] = false;
                }
            }
            else if (this.facilityList.length === 0) {
                this.showAlert(this.$t("additional:modules.tools.cosi.calculateRatio.noFacilitiesWarning"));
            }
            else {
                this[letter + "Switch"] = !this[letter + "Switch"];
                this["selectedField" + letter] = {id: ""};
                this["sumUpSwitch" + letter] = false;
            }
        },
        showAlert (content, category = "Warnung", cssClass = "warning") {
            this.addSingleAlert({
                category: category,
                content: content,
                displayClass: cssClass
            });
        },
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            // TODO replace trigger when Menu is migrated
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getModelByAttributes({id: this.id});

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * @description Checks if the user selected a summable statistical data set (feature).
         * @param {String} letter String that determines which field is to be modified (A or B for FieldA or FieldB).
         * @returns {void} Function returns nothing.
         */
        checkSumUp (letter) {
            if (!this[letter + "Switch"]) {
                const checkSumUp = mapping.find(x => x.value === this["selectedField" + letter].id);

                if (!this["aSumUpSwitch" + letter]) {
                    if (checkSumUp.summable) {
                        this["aSumUpSwitch" + letter] = true;
                    }
                }
                else if (this["selectedField" + letter].id === "" || this["selectedField" + letter].id.length === 0) {
                    this["aSumUpSwitch" + letter] = false;
                }
            }
        },
        /**
         * @description Gets Data for the selected theme layer (facility)
         * @param {String} letter String that determines for which field the data should be loaded (A or B for FieldA or FieldB).
         * @returns {void}
         */
        getFacilityData (letter) {
            if (this[letter + "Switch"]) {
                this["facilityPropertyList_" + letter] = [{
                    name: "Anzahl",
                    id: "count"
                }];
                this["selectedField" + letter].numericalValues.forEach(value => {
                    const data = {
                        name: value.name,
                        id: value.id
                    };

                    this["facilityPropertyList_" + letter].push(data);
                });

                this["paramField" + letter] = this["facilityPropertyList_" + letter][0];
            }
        },
        /**
         * @description Clears all values from Field A and Field B
         * @returns {void}
         */
        clearAllValues () {
            this.selectedFieldA = {id: ""};
            this.selectedFieldB = {id: ""};
            this.paramFieldA = {name: "", id: ""};
            this.paramFieldB = {name: "", id: ""};
            this.fActive_A = false;
            this.fActive_B = false;
            this.faktorf_A = 1;
            this.faktorf_B = 1;
            this.aSumUpSwitchA = false;
            this.aSumUpSwitchB = false;
            this.setResults([]);
            this.setDataSets([]);
            this.setDataToColorCodeMap(false);
        },
        /**
         * @description Switches all parameters between FieldA and FieldB.
         * @returns {void}
         */
        switchSelection () {
            const h_selectedFieldA = this.selectedFieldA,
                h_selectedFieldB = this.selectedFieldB,
                h_paramFieldA = this.paramFieldA,
                h_paramFieldB = this.paramFieldB,
                h_fActive_A = this.fActive_A,
                h_fActive_B = this.fActive_B,
                h_faktorf_A = this.faktorf_A,
                h_faktorf_B = this.faktorf_B,
                h_ASwitch = this.ASwitch,
                h_BSwitch = this.BSwitch,
                h_perCalc_A = this.perCalc_A,
                h_perCalc_B = this.perCalc_B,
                h_facilityPropertyList_A = this.facilityPropertyList_A,
                h_facilityPropertyList_B = this.facilityPropertyList_B;

            this.ASwitch = h_BSwitch;
            this.BSwitch = h_ASwitch;
            this.selectedFieldA = h_selectedFieldB;
            this.selectedFieldB = h_selectedFieldA;
            this.paramFieldA = h_paramFieldB;
            this.paramFieldB = h_paramFieldA;
            this.fActive_A = h_fActive_B;
            this.fActive_B = h_fActive_A;
            this.faktorf_A = h_faktorf_B;
            this.faktorf_B = h_faktorf_A;
            this.perCalc_A = h_perCalc_B;
            this.perCalc_B = h_perCalc_A;
            this.facilityPropertyList_A = h_facilityPropertyList_B;
            this.facilityPropertyList_B = h_facilityPropertyList_A;

            if (this.results.length > 0) {
                this.prepareCoverage();
            }
        },
        /**
         * @description Fires when user hits calulcate button. Prepares data sets for calculation. Triggers coverageFunction twice.
         * @returns {void}
         */
        prepareCoverage () {
            this.setResults([]);
            const
                allData = [],
                calculationSet = {
                    inputs: {},
                    resultHeaders: {},
                    results: {}
                },
                dataArray_A = this.coverageFunction("A"),
                dataArray_B = this.coverageFunction("B");
            let
                resultHeader_A = this.selectedFieldA.id,
                resultHeader_B = this.selectedFieldB.id;

            if (Array.isArray(this.selectedFieldA.id)) {
                resultHeader_A = this.selectedFieldA.id.length > 1 ?
                    this.$t("additional:modules.tools.cosi.calculateRatio.addedSelection") :
                    this.selectedFieldA.id[0];
            }
            if (Array.isArray(this.selectedFieldB.id)) {
                resultHeader_B = this.selectedFieldB.id.length > 1 ?
                    this.$t("additional:modules.tools.cosi.calculateRatio.addedSelection") :
                    this.selectedFieldB.id[0];
            }

            dataArray_A.forEach((obj_A) => {
                const obj_B = dataArray_B.find(obj => obj.name === obj_A.name),
                    combined = {...obj_A, ...obj_B};

                allData.push(combined);
            });

            this.setResults(utils.calculateRatio(allData, this.selectedYear));
            this.setResultHeaders({
                typeA: resultHeader_A,
                typeB: resultHeader_B,
                fActive: this.fActive_A || this.fActive_B,
                faktorF: `${this.faktorf_B} / ${this.faktorf_A}`
            });

            calculationSet.results = this.results;
            calculationSet.resultHeaders = this.resultHeaders;
            calculationSet.inputs = {
                selectedFieldA: JSON.parse(JSON.stringify(this.selectedFieldA)),
                selectedFieldB: JSON.parse(JSON.stringify(this.selectedFieldB)),
                paramFieldA: JSON.parse(JSON.stringify(this.paramFieldA)),
                paramFieldB: JSON.parse(JSON.stringify(this.paramFieldB)),
                fActive_A: JSON.parse(JSON.stringify(this.fActive_A)),
                fActive_B: JSON.parse(JSON.stringify(this.fActive_B)),
                faktorf_A: JSON.parse(JSON.stringify(this.faktorf_A)),
                faktorf_B: JSON.parse(JSON.stringify(this.faktorf_B)),
                ASwitch: JSON.parse(JSON.stringify(this.ASwitch)),
                BSwitch: JSON.parse(JSON.stringify(this.BSwitch)),
                perCalc_A: JSON.parse(JSON.stringify(this.perCalc_A)),
                perCalc_B: JSON.parse(JSON.stringify(this.perCalc_B)),
                aSumUpSwitchA: JSON.parse(JSON.stringify(this.aSumUpSwitchA)),
                aSumUpSwitchB: JSON.parse(JSON.stringify(this.aSumUpSwitchB)),
                facilityPropertyList_A: JSON.parse(JSON.stringify(this.facilityPropertyList_A)),
                facilityPropertyList_B: JSON.parse(JSON.stringify(this.facilityPropertyList_B))
            };

            this.dataSets.push(calculationSet);
            this.setActiveSet(this.dataSets.length - 1);
        },
        /**
         * @description Fires when user hits calulcate button. Prepares data sets for calculation.
         * @param {String} letter "A" or "B" for selectedFieldA or selectedFieldB.
         * @returns {Array} dataArray -> Array containing all collected data for all selected districts.
         */
        coverageFunction (letter) {
            const dataArray = [];

            this.selectedFeatures.forEach(district => {
                const name = district.getProperties()[this.keyOfAttrName],
                    geometry = district.getGeometry();

                this.calcHelper = {};
                this.calcHelper.name = name;
                this.calcHelper["faktorf_" + letter] = this["faktorf_" + letter];
                this.calcHelper["perCalc_" + letter] = this["perCalc_" + letter];

                if (this[letter + "Switch"]) {
                    const findLayer = this.getVisibleLayerList.find(layer => layer.get("name") === this["selectedField" + letter].id),
                        layerFeatures = getLayerSource(findLayer).getFeatures();

                    this.calcHelper["type_" + letter] = "facility";
                    this.featureVals = [];
                    layerFeatures.forEach(feature => {
                        if (this.isFeatureActive(feature)) {
                            const layerGeometry = getCenter(feature.getGeometry().getExtent());

                            if (geometry.intersectsCoordinate(layerGeometry)) {
                                if (this["paramField" + letter].name !== "Anzahl") {
                                    if (
                                        typeof feature.getProperties()[this["paramField" + letter].id] !== "number" ||
                                        typeof feature.getProperties()[this["paramField" + letter].id] !== "string"
                                    ) {
                                        const
                                            value = feature.getProperties()[this["paramField" + letter].id],
                                            valueTransformed = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;

                                        this.featureVals.push(valueTransformed);
                                    }
                                    else {
                                        this.featureVals.push("");
                                    }
                                }
                                else {
                                    this.featureVals.push(0);
                                }
                            }
                        }
                    });

                    // eslint-disable-next-line
                    const checkForLackingData = utils.compensateLackingData(this.featureVals);

                    if (checkForLackingData === "error") {
                        this.showAlert("Warnung für das Gebiet: " + district + this.$t("additional:modules.tools.cosi.calculateRatio.noData"));
                        return;
                    }

                    this.calcHelper["param" + letter + "_count"] = this.featureVals.length;
                    this.calcHelper["param" + letter + "_val"] = checkForLackingData.data.reduce((total, val) => total + parseFloat(val), 0);
                    this.calcHelper["incompleteDatasets_" + letter] = checkForLackingData.incompleteDatasets;
                    this.calcHelper["datasets_" + letter] = checkForLackingData.totalDatasets;
                    if (this["paramField" + letter].name === "Anzahl") {
                        this.calcHelper["param" + letter + "_calc"] = this.calcHelper["param" + letter + "_count"];
                    }
                    else {
                        this.calcHelper["param" + letter + "_calc"] = this.calcHelper["param" + letter + "_val"];
                    }
                }
                else {
                    this.featureVals = [];
                    this.calcHelper["type_" + letter] = "feature";
                    if (Array.isArray(this["selectedField" + letter].id)) {
                        this["selectedField" + letter].id.forEach(id => {
                            const featureData = this.getFeatureData(name, id);

                            this.featureVals.push(featureData);
                        });
                        const sumUpYearValues = {};

                        this.featureVals = [].concat(...this.featureVals);
                        this.featureVals.forEach(year => {
                            if (sumUpYearValues[year.jahr]) {
                                sumUpYearValues[year.jahr] += year.wert;
                            }
                            else {
                                sumUpYearValues[year.jahr] = year.wert;
                            }
                        });
                        this.availableYears = Object.keys(sumUpYearValues).sort().reverse();
                        this.selectedYear = this.availableYears[0];
                        this.featureVals = sumUpYearValues;
                    }
                    else {
                        const featureData = this.getFeatureData(name, this["selectedField" + letter].id),
                            yearValues = {};

                        featureData.forEach(year => {
                            yearValues[year.jahr] = year.wert;
                        });

                        this.availableYears = Object.keys(yearValues).sort().reverse();
                        this.selectedYear = this.availableYears[0];
                        this.featureVals = yearValues;
                    }

                    this.calcHelper["param" + letter + "_val"] = this.featureVals;
                    this.calcHelper["param" + letter + "_calc"] = this.calcHelper["param" + letter + "_val"];
                    this.calcHelper["incompleteDatasets_" + letter] = 0;
                }

                dataArray.push(this.calcHelper);
            });

            return dataArray;
        },
        /**
         * @description Gets Data for the selected statistical data (features)
         * @param {String} districtName name of the district.
         * @param {String} featureName name of the statistical data set (feature).
         * @returns {void}
         */
        getFeatureData (districtName, featureName) {
            const featureDataList = [];

            this.selectedStatFeatures.forEach(feature => {
                if (utils.unifyString(feature.getProperties()[this.keyOfAttrNameStats]) === utils.unifyString(districtName) && utils.unifyString(feature.get("kategorie")) === utils.unifyString(featureName)) {
                    Object.entries(feature.getProperties()).forEach(([key, val]) => {
                        if (key.includes(this.yearSelector)) {
                            const obj = {
                                jahr: key.substring(key.indexOf("_") + 1),
                                wert: parseFloat(val)
                            };

                            featureDataList.push(obj);
                        }
                    });
                }
            });
            return featureDataList;
        },
        /**
         * @description Recalculate the data set dynamically when one parameter changes.
         * @returns {void}
         */
        recalcData () {
            const dataArray = [];

            this.setResults([]);
            this.resultsClone.forEach(result => {
                dataArray.push(result.data);
            });

            this.setResults(utils.calculateRatio(dataArray, this.selectedYear));
            this.dataSets[this.activeSet].results = this.results;
        },
        /**
         * @description Transforming results data for excel export
         * @param {Integer} index Index of the set to be prepared for download in the dataSets Array.
         * @returns {Void} Function returns nothing.
         */
        resultData (index) {
            const json = [];

            this.dataSets[index].results.forEach(result => {
                const resultObj = {};

                resultObj[this.dataSets[index].inputs.selectedFieldA.id] = result.paramA_val;
                resultObj[this.dataSets[index].inputs.selectedFieldB.id] = result.paramB_val;
                resultObj[this.dataSets[index].inputs.selectedFieldA.id + " / " + this.dataSets[index].inputs.selectedFieldB.id] = result.relation;
                resultObj.Kapazitaet = result.capacity;
                resultObj.Bedarf = result.need;
                resultObj.Bedarfsdeckung = result.coverage;
                json.push(resultObj);
            });

            return json;
        },
        exportAsXlsx (index) {
            exportXlsx(this.resultData(index), this.selectedYear + "_versorgungsanalyse.xls", {exclude: this.excludedPropsForExport});
        },
        /**
         * @description Push data that is to be visualized on the map to ColorCodeMap Component.
         * @returns {void}
         */
        loadToColorCodeMap () {
            const switchVar = this.dataToColorCodeMap;

            if (!switchVar) {
                const data = this.getDataForColorCodeMap();

                this.setColorCodeMapDataset(data);
                this.setDataToColorCodeMap(!switchVar);
            }
            else {

                this.setDataToColorCodeMap(!switchVar);
            }
        },

        /**
         * Gets the data for ColorCodeMap.
         * @returns {Object[]} The prepared data for the ColorCodeMap.
         */
        getDataForColorCodeMap () {
            const prepareData = [];

            this.dataSets[this.activeSet].results.forEach(result => {
                if (result.scope !== "Gesamt" || result.scope !== "Durschnitt") {
                    const data = {
                        name: result.scope,
                        data: Math.round(1000 * result[this.columnSelector.key]) / 1000
                    };

                    prepareData.push(data);
                }
            });

            return prepareData;
        },

        /**
         * @description Passes data to the Chart Generator Tool.
         * @returns {Void} Function returns nothing.
         */
        loadToChartGenerator () {
            const graphObj = {
                    id: "calcratio-" + this.selectedFeatures.map(district => {
                        return district.id_;
                    }).join("-") + "-" + this.selectedFieldA.id + "-" + this.paramFieldA.name + "-" + this.selectedFieldB.id + "-" + this.paramFieldB.name,
                    name: "Versorgungsanalyse - Visualisierung " + this.columnSelector.name + " (" + this.$t("additional:modules.tools.cosi.calculateRatio.title") + ")",
                    type: ["LineChart", "BarChart"],
                    color: "rainbow",
                    source: this.$t("additional:modules.tools.cosi.calculateRatio.title"),
                    scaleLabels: [this.columnSelector.name, "Jahre"],
                    data: {
                        labels: [...this.availableYears],
                        datasets: []
                    }
                },

                dataArray = [];

            this.dataSets[this.activeSet].results.forEach(result => {
                if (result) {
                    dataArray.push(result.data);
                }
            });

            this.availableYears.forEach(year => {
                const dataPerYear = utils.calculateRatio(dataArray, year)
                    .filter(dataset => dataset.scope);

                dataPerYear.forEach(dataset => {
                    const checkExisting = graphObj.data.datasets.find(set => set.label === dataset.scope);

                    if (checkExisting) {
                        checkExisting.data.push(dataset[this.columnSelector.key]);
                    }
                    else {
                        const obj = {
                            label: dataset.scope,
                            data: [dataset[this.columnSelector.key]]
                        };

                        graphObj.data.datasets.push(obj);
                    }
                });
            });

            graphObj.data.labels.reverse();
            graphObj.data.datasets.forEach(dataset => {
                dataset.data.reverse();
            });

            this.channelGraphData(graphObj);
        },

        /**
         * @description Deletes a set from the Tool Window.
         * @param {Integer} index Index of the set to be deleted in the dataSets Array.
         * @returns {Void} Function returns nothing.
         */
        removeSet (index) {
            if (this.activeSet === this.dataSets.length - 1) {
                this.setActiveSet(this.activeSet - 1);
            }

            this.dataSets.splice(index, 1);
        },
        /**
         * @description Downloads xls and geojson of each dataset.
         * @returns {Void} Function returns nothing.
         */
        downloadAll () {
            this.dataSets.forEach((set, i) => {
                this.exportAsXlsx(i);
                this.exportAsGeoJson(i);
            });
        },

        // the export function from utils
        exportAsGeoJson
    }
};
</script>

<template lang="html">
    <Tool
        :title="$t('additional:modules.tools.cosi.calculateRatio.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <v-app>
                <div
                    v-if="active"
                    id="calculateratio"
                    :class="{ expanded: results.length > 0 }"
                >
                    <div class="addon_wrapper">
                        <ToolInfo
                            :url="readmeUrl"
                            :locale="currentLocale"
                            :summary="$t('additional:modules.tools.cosi.calculateRatio.description')"
                        />
                        <div
                            v-if="featuresList.length === 0 && facilityList.length === 0"
                            class="warning_wrapper section"
                        >
                            <p class="warning">
                                <span>{{ $t("additional:modules.tools.cosi.calculateRatio.warningNoData") }}</span>
                            </p>
                        </div>
                        <div
                            v-else
                            class="select_wrapper section first"
                            :class="{ grouped: selectedFieldA.id }"
                        >
                            <div
                                class="button switch"
                                :title="$t('additional:modules.tools.cosi.calculateRatio.switchFieldType')"
                            >
                                <button
                                    id="switchA"
                                    @click="switchVal('A')"
                                >
                                    <template v-if="ASwitch">
                                        <span>{{ $t("additional:modules.tools.cosi.calculateRatio.dataA") }}</span>
                                    </template>
                                    <template v-else>
                                        <span>{{ $t("additional:modules.tools.cosi.calculateRatio.dataB") }}</span>
                                    </template>
                                </button>
                            </div>
                            <template v-if="ASwitch">
                                <v-select
                                    v-if="groupActiveLayer.length > 0"
                                    id="groupActiveLayerSelect"
                                    v-model="selectedFieldA"
                                    class="facility_selection selection"
                                    :items="groupActiveLayer"
                                    dense
                                    outlined
                                    :placeholder="$t('additional:modules.tools.cosi.calculateRatio.placeholderA')"
                                    @input="getFacilityData('A')"
                                />
                            </template>
                            <template v-else>
                                <v-autocomplete
                                    v-if="featuresList.length"
                                    id="feature_selector_A"
                                    v-model="selectedFieldA.id"
                                    class="feature_selection selection"
                                    :items="aSumUpSwitchA ? subFeaturesList : featuresList"
                                    dense
                                    outlined
                                    :multiple="aSumUpSwitchA ? true : false"
                                    :small-chips="aSumUpSwitchA ? true : false"
                                    :deletable-chips="aSumUpSwitchA ? true : false"
                                    :placeholder="$t('additional:modules.tools.cosi.calculateRatio.placeholderA')"
                                    :menu-props="{ closeOnContentClick: true }"
                                    @input="checkSumUp('A')"
                                />
                            </template>

                            <div
                                v-if="selectedFieldA.id.length > 0"
                                class="subsection"
                            >
                                <template v-if="ASwitch">
                                    <div class="sub_wrapper">
                                        <div
                                            class="faktor_f"
                                        >
                                            <div
                                                class="btn"
                                                :title="$t('additional:modules.tools.cosi.calculateRatio.addFactorTooltip')"
                                                :class="{ reduced: fActive_A }"
                                            >
                                                <button @click="fActive_A = !fActive_A">
                                                    <v-icon
                                                        v-if="fActive_A"
                                                    >
                                                        mdi-close
                                                    </v-icon>
                                                    <span v-else>{{ $t('additional:modules.tools.cosi.calculateRatio.addFactor') }}</span>
                                                </button>
                                            </div>
                                            <div
                                                v-if="fActive_A"
                                                class="input"
                                            >
                                                <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
                                                <input
                                                    v-model.number="faktorf_A"
                                                    type="number"
                                                >
                                            </div>
                                        </div>
                                        <v-select
                                            v-if="facilityList.length"
                                            v-model="paramFieldA"
                                            class="feature_selection selection"
                                            :items="facilityPropertyList_A"
                                            item-text="name"
                                            item-value="name"
                                            dense
                                            outlined
                                            return-object
                                            :disabled="facilityPropertyList_A.length < 2"
                                        />
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="sub_wrapper">
                                        <div class="custom_wrapper">
                                            <p>{{ $t("additional:modules.tools.cosi.calculateRatio.calcPer") }} </p>
                                            <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
                                            <input
                                                v-model.number="perCalc_A"
                                                type="number"
                                            >
                                            <p><strong> {{ $t("additional:modules.tools.cosi.calculateRatio.ofData") }}</strong></p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div
                            v-if="selectedFieldA.id.length > 0"
                            class="select_wrapper section second"
                            :class="{ grouped: selectedFieldB.id }"
                        >
                            <div
                                class="button switch"
                                :title="$t('additional:modules.tools.cosi.calculateRatio.switchFieldType')"
                            >
                                <button
                                    id="switchB"
                                    @click="switchVal('B')"
                                >
                                    <template v-if="BSwitch">
                                        <span>{{ $t("additional:modules.tools.cosi.calculateRatio.dataA") }}</span>
                                    </template>
                                    <template v-else>
                                        <!-- eslint-disable-next-line -->
                                        <span>{{ $t("additional:modules.tools.cosi.calculateRatio.dataB") }}</span>
                                    </template>
                                </button>
                            </div>
                            <template v-if="BSwitch">
                                <v-select
                                    v-if="groupActiveLayer.length > 0"
                                    v-model="selectedFieldB"
                                    class="facility_selection selection"
                                    :items="groupActiveLayer"
                                    dense
                                    outlined
                                    :placeholder="$t('additional:modules.tools.cosi.calculateRatio.placeholderB')"
                                    @input="getFacilityData('B')"
                                />
                            </template>
                            <template v-else>
                                <v-autocomplete
                                    v-if="featuresList.length"
                                    id="feature_selector_B"
                                    v-model="selectedFieldB.id"
                                    class="feature_selection selection"
                                    :items="aSumUpSwitchB ? subFeaturesList : featuresList"
                                    dense
                                    outlined
                                    :multiple="aSumUpSwitchB ? true : false"
                                    :small-chips="aSumUpSwitchB ? true : false"
                                    :deletable-chips="aSumUpSwitchB ? true : false"
                                    :placeholder="$t('additional:modules.tools.cosi.calculateRatio.placeholderB')"
                                    :menu-props="{ closeOnContentClick: true }"
                                    @input="checkSumUp('B')"
                                />
                            </template>
                            <div
                                v-if="selectedFieldB.id.length > 0"
                                class="subsection"
                            >
                                <template v-if="BSwitch">
                                    <div class="sub_wrapper">
                                        <div
                                            class="faktor_f"
                                        >
                                            <div
                                                class="btn"
                                                :class="{ reduced: fActive_B }"
                                            >
                                                <button
                                                    :title="$t('additional:modules.tools.cosi.calculateRatio.addFactorTooltip')"
                                                    @click="fActive_B = !fActive_B"
                                                >
                                                    <v-icon
                                                        v-if="fActive_B"
                                                    >
                                                        mdi-close
                                                    </v-icon>
                                                    <span v-else>{{ $t('additional:modules.tools.cosi.calculateRatio.addFactor') }}</span>
                                                </button>
                                            </div>
                                            <div
                                                v-if="fActive_B"
                                                class="input"
                                            >
                                                <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
                                                <input
                                                    v-model.number="faktorf_B"
                                                    type="number"
                                                >
                                            </div>
                                        </div>
                                        <v-select
                                            v-if="facilityList.length"
                                            v-model="paramFieldB"
                                            class="feature_selection selection"
                                            :items="facilityPropertyList_B"
                                            item-text="name"
                                            item-value="name"
                                            dense
                                            outlined
                                            return-object
                                            :disabled="facilityPropertyList_B.length < 2"
                                        />
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="sub_wrapper">
                                        <div class="custom_wrapper">
                                            <p>{{ $t("additional:modules.tools.cosi.calculateRatio.calcPer") }} </p>
                                            <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
                                            <input
                                                v-model.number="perCalc_B"
                                                type="number"
                                            >
                                            <p><strong> {{ $t("additional:modules.tools.cosi.calculateRatio.ofData") }}</strong></p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div
                            v-if="selectedFieldA.id.length > 0 && selectedFieldB.id.length > 0"
                            class="select_wrapper section third"
                        >
                            <div class="btn_grp finalization">
                                <button
                                    class="switch"
                                    :title="$t('additional:modules.tools.cosi.calculateRatio.swapFields')"
                                    @click="switchSelection"
                                >
                                    <v-icon>
                                        mdi-swap-horizontal
                                    </v-icon>
                                </button>
                                <button
                                    class="cancel"
                                    :title="$t('additional:modules.tools.cosi.calculateRatio.resetTooltip')"
                                    @click="clearAllValues"
                                >
                                    <v-icon
                                        left
                                    >
                                        mdi-close-circle
                                    </v-icon>
                                    {{ $t('additional:modules.tools.cosi.calculateRatio.reset') }}
                                </button>
                                <button
                                    class="confirm"
                                    :title="$t('additional:modules.tools.cosi.calculateRatio.calculateTooltip')"
                                    @click="prepareCoverage"
                                >
                                    <v-icon
                                        left
                                    >
                                        mdi-check-circle
                                    </v-icon>
                                    {{ $t('additional:modules.tools.cosi.calculateRatio.calculate') }}
                                </button>
                            </div>
                        </div>
                        <AnalysisPagination
                            v-if="dataSets.length > 0"
                            :sets="dataSets"
                            :active-set="activeSet"
                            :downloads="['XLS', 'GEOJSON']"
                            :titles="{
                                downloads: [$t('additional:modules.tools.cosi.calculateRatio.downloadXlsxTooltip'), $t('additional:modules.tools.cosi.calculateRatio.downloadGeoJsonTooltip')],
                                downloadAll: $t('additional:modules.tools.cosi.calculateRatio.paginationDownloadAll'),
                                remove: $t('additional:modules.tools.cosi.calculateRatio.paginationRemove'),
                                removeAll: $t('additional:modules.tools.cosi.calculateRatio.paginationRemoveAll')
                            }"
                            @setActiveSet="(n) => setActiveSet(n)"

                            @removeSingle="(n) => removeSet(n)"
                            @removeAll="clearAllValues"
                            @downloadXLS="(n) => exportAsXlsx(n)"
                            @downloadGEOJSON="(n) => exportAsGeoJson(n)"
                            @downloadAll="downloadAll"
                        />
                        <div
                            v-if="results.length > 0"
                            class="data_table"
                        >
                            <div class="head_wrapper">
                                <button
                                    class="cg"
                                    :title="$t('additional:modules.tools.cosi.calculateRatio.visualizeChart')"
                                    @click="loadToChartGenerator()"
                                >
                                    <v-icon>
                                        mdi-poll
                                    </v-icon>
                                </button>
                                <button
                                    class="ccm"
                                    :class="{ highlight: !dataToColorCodeMap}"
                                    :title="$t('additional:modules.tools.cosi.calculateRatio.visualizeMap')"
                                    @click="loadToColorCodeMap()"
                                >
                                    <v-icon
                                        v-if="!dataToColorCodeMap"
                                    >
                                        mdi-eye
                                    </v-icon>
                                    <v-icon
                                        v-else
                                    >
                                        mdi-eye-off
                                    </v-icon>
                                </button>
                                <v-select
                                    v-model="columnSelector"
                                    dense
                                    outlined
                                    class="column_selection selection"
                                    :items="availableColumns"
                                    item-text="name"
                                    item-value="key"
                                    return-object
                                />
                                <div
                                    v-if="!ASwitch || !BSwitch"
                                    class="year_selector"
                                >
                                    <v-select
                                        v-model="selectedYear"
                                        class="year_selection selection"
                                        :items="availableYears"
                                        :disabled="ASwitch && BSwitch"
                                        dense
                                        outlined
                                        @input="recalcData()"
                                    />
                                </div>
                            </div>
                            <DataTable
                                v-for="(set, i) in dataSets"
                                :key="i"
                                :dataset="set.results"
                                :type-a="set.resultHeaders.typeA"
                                :type-b="set.resultHeaders.typeB"
                                :f-active="set.resultHeaders.fActive"
                                :faktor-f="set.resultHeaders.faktorF"
                                :class="{ active: activeSet === i }"
                            />
                        </div>
                    </div>
                </div>
            </v-app>
        </template>
    </tool>
</template>


<style lang="scss" scoped>
    @import "../../utils/variables.scss";

    #calculateratio {
        background:rgba(255,255,255,0.95);
        width:400px;

        .info_button {
            display:block;
            width:30px;
            height:30px;
            background:#eee;
            margin:0px 0px 0px auto;
        }

        .section {

            &.third {
                    border:1px solid #ddd;
                }
        }

        .select_wrapper {
            display:flex;
            flex-flow:row wrap;
            justify-content:flex-start;
            align-content:flex-start;

            .button {
                flex-basis:30%;
                background:linear-gradient(180deg, #eee, #ddd);
                border-radius:5px;
                margin: 0px 5px 5px 0px;

                button {
                    background: transparent;
                    border:none;
                    color:#222;
                    font-size:90%;
                }

                &:hover {
                    background:#ccc;
                    cursor:pointer;
                }
            }
            .selection {
                flex: 1 1 66%;
                margin:0px;
            }

            .subsection {
                width:100%;
                margin:5px auto;

                .sub_wrapper {
                    width:100%;
                    display:flex;
                    flex-flow:row wrap;
                    justify-content: flex-start;

                    .faktor_f {
                        display:flex;
                        flex-flow:row nowrap;
                        justify-content: flex-start;
                        flex-basis:30%;
                        margin-right:5px;

                        .btn {
                            flex-basis:100%;
                            margin:0;
                            padding:0;
                            height:40px;

                            button {
                                width:100%;
                                height:40px;
                                font-size:70%;
                                font-weight:700;
                                border:1px solid #ccc;
                                border-radius:5px;
                            }

                            &.reduced {
                                flex-basis:40px;
                            }
                        }

                        .input {
                            position:relative;
                            flex-basis:calc(100% - 40px);
                            flex-grow: 1;
                            flex-shrink: 1;
                            margin:1px 0px 0px -2px;

                            input {
                                width:100%;
                                height:40px;
                                text-align:center;
                                font-weight:900;
                                border:1px solid #ccc;
                            }
                        }
                    }

                    .custom_wrapper {
                        display:flex;
                        flex-flow:row wrap;
                        justify-content:center;
                        width:100%;
                        margin:0;

                        input {
                            flex-basis: 33%;
                            text-align:center;
                            height:40px;
                            font-weight:700;
                            margin:0px 5px;
                            border:1px solid #ccc;
                        }

                        p {
                            flex: 1 1 25%;
                            line-height: 40px;
                            margin: 0px;
                            font-size: 80%;
                            text-align: center;
                        }
                    }
                }
            }
        }


        &.expanded {
            width:780px;

            .info_button {
                position:absolute;
                top:10px;
                right:25px;
            }

            .addon_wrapper {
                display:flex;
                flex-flow: row wrap;
                justify-content:flex-start;

                .section {
                    flex:1 0 45%;
                    margin:5px 0px;
                }

                .analysis-pagination {
                    width: 100%;
                    padding:5px;
                    box-sizing:border-box;
                    border:1px solid #ccc;
                    background:#fafafa;
                }

                .data_table {
                    flex-basis:100%;
                    height:auto;
                    margin:5px 0px;

                    .head_wrapper {
                        display:flex;
                        flex-flow:row wrap;
                        justify-content:flex-end;

                        .xl_btn {
                            height:40px;
                            line-height:40px;
                            width:auto;
                            opacity:0.75;
                            background: $green;
                            color:white;
                            padding: 0px 10px;
                            margin:5px 0px;
                            font-size: 12px;x

                            span {
                                margin-right:10px;
                            }

                            &:hover {
                                opacity:1;
                            }
                        }

                        button.ccm, button.cg {
                            height:40px;
                            width:40px;
                            margin:5px 3px;
                            background:#eee;
                            border:1px solid #eee;

                            &:hover {
                                border:1px solid #aaa;
                            }

                            &.highlight {
                                color:white;
                                border:1px solid $brightblue;
                                background: $brightblue;
                            }
                        }

                        .column_selection {
                            flex:0 0 160px;
                            margin:5px 3px
                        }

                        .year_selector {
                            width: 160px;
                            margin: 5px 0px;
                        }
                    }

                    .forged_table {
                        overflow:hidden;
                    }

                    .calc_ratio_results {
                        display:none;

                        &.active {
                            display:block;
                        }
                    }
                }
            }
        }
    }
</style>
