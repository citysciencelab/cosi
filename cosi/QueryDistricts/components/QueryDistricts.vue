<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import AnalysisPagination from "../../components/AnalysisPagination.vue";
import getters from "../store/gettersQueryDistricts";
import mutations from "../store/mutationsQueryDistricts";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import compareFeatures from "./compareFeatures.js";
import LayerFilter from "./LayerFilter.vue";
import {Fill, Stroke, Style} from "ol/style.js";
import {getAllFeaturesByLayerId as _getAllFeatures} from "../../utils/features/getAllFeaturesByLayerId";
import exportXlsx from "../../utils/exportXlsx";
import * as Extent from "ol/extent";
import {
    polygon as turfPolygon,
    multiPolygon as turfMultiPolygon,
    point as turfPoint
} from "@turf/helpers";
import {default as turfBooleanPointInPolygon} from "@turf/boolean-point-in-polygon";
import ToolInfo from "../../components/ToolInfo.vue";
import {getFeaturePOST} from "../../../../src/api/wfs/getFeature.js";
import {WFS} from "ol/format.js";
import getAvailableYears from "../../utils/getAvailableYears";
import {groupBy, getModelByAttributes} from "../../utils/radioBridge.js";

export default {
    name: "QueryDistricts",
    components: {
        Tool,
        ToolInfo,
        LayerFilter,
        AnalysisPagination
    },
    data () {
        return {
            selectedDistrict: null,
            allLayerOptions: [],
            layerOptions: [],
            selectedLayer: null,
            districtNames: [],
            layerFilterModels: [],
            selectorField: "verwaltungseinheit",
            resultNames: null,
            results: null,
            refDistrict: null,
            facilityNames: [],
            resultTableHeaders: []
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/QueryDistricts", Object.keys(getters)),
        ...mapGetters("Tools/DistrictSelector", [
            "keyOfAttrName",
            "selectedFeatures",
            "layer",
            "keyOfAttrNameStats",
            "selectedDistrictLevel",
            "mapping"
        ]),
        ...mapGetters("Tools/FeaturesList", ["isFeatureDisabled", "layerMapById", "activeVectorLayerList"]),
        ...mapGetters("Maps", ["projectionCode"])
    },
    watch: {
        async layerFilterModels (newValue) {
            this.dataSets[this.activeSet].inputs.layerFilterModels = newValue;
            await this.computeResults();
            this.dataSets[this.activeSet].inputs.resultTableHeaders = this.resultTableHeaders;
            this.dataSets[this.activeSet].results = this.results;
        },

        async selectedDistrict (newValue) {
            const newModels = [];

            for (const m of this.layerFilterModels) {
                const newModel = {...m};

                newModels.push(newModel);
                this.setLayerFilterModelValue(newModel);
            }
            this.layerFilterModels = newModels;
            this.dataSets[this.activeSet].inputs.selectedDistrict = newValue;
        },

        facilityNames () {
            if (this.active) {
                this.setLayerOptions();
            }
        },

        active (value) {
            if (value) {
                this.initializeDistrictNames();
                this.setLayerOptions();
            }
        },

        /**
         * Listens to the layers change on the map to refresh the list
         * @listens #change:FeaturesList/activeVectorLayerList
         * @returns {void}
         */
        activeVectorLayerList () {
            this.$nextTick().then(() => {
                this.setFacilityNames();
            });
        },
        activeSet (newValue) {
            if (!this.dataSets[newValue]) {
                return;
            }

            this.layerFilterModels = this.dataSets[newValue].inputs.layerFilterModels;
            this.selectedDistrict = this.dataSets[newValue].inputs.selectedDistrict;
            this.resultTableHeaders = this.dataSets[newValue].inputs.resultTableHeaders;
            this.selectedLayer = this.dataSets[newValue].inputs.selectedLayer;
            const newModels = [];

            for (const m of this.layerFilterModels) {
                const newModel = {...m};

                newModels.push(newModel);
                this.setLayerFilterModelValue(newModel);
            }
            this.layerFilterModels = newModels;
            this.updateAvailableLayerOptions();
        },
        dataSets (newValue) {
            if (newValue.length === 0) {
                this.addSet();
            }
        }
    },

    created () {
        this.$on("close", this.close);
    },

    async mounted () {
        this.applyTranslationKey(this.name);
        this.mapLayer = await this.addNewLayerIfNotExists({layerName: "query-districts"});
    },
    methods: {
        ...mapMutations("Tools/QueryDistricts", Object.keys(mutations)),
        ...mapMutations("Tools/DistrictSelector", ["setSelectedDistrictsCollection"]),
        ...mapActions("Tools/DistrictSelector", ["setDistrictsByName"]),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),
        ...mapActions("Maps", ["zoomToExtent", "addNewLayerIfNotExists"]),
        ...compareFeatures,

        initializeDistrictNames: function () {
            const selector = this.keyOfAttrName;

            if (this.selectedFeatures?.length) {
                this.districtNames = this.selectedFeatures.map(
                    (feature) => feature.getProperties()[selector]
                ).sort();
            }
            else {
                this.districtNames = this.layer
                    .getSource()
                    .getFeatures()
                    .map((district) => district.getProperties()[selector])
                    .sort();
            }

            this.districtNames = [...new Set(this.districtNames)];
        },

        getLayerList: function () {
            return rawLayerList.getLayerList();
        },

        getAllFeatures: async function (id) {
            const features = await _getAllFeatures(id);

            return features.length > 0
                ? features
                : getModelByAttributes({id})?.get("features")
                || [];
        },

        setLayerOptions: function () {
            this.allLayerOptions = [];

            // facility data first
            for (const facilityLayer of this.facilityNames) {
                this.allLayerOptions.push({
                    name: facilityLayer.name,
                    id: facilityLayer.id,
                    group: this.$t("additional:modules.tools.cosi.queryDistricts.funcData"),
                    valueType: "absolute",
                    facilityLayerName: facilityLayer.name
                });
            }

            // statistical data second
            for (const m of this.mapping) {
                const layer = this.selectedDistrictLevel.stats.layers.find(l=>l.id && l.id === m[this.keyOfAttrNameStats]);

                if (layer) {
                    this.allLayerOptions.push({
                        name: m.value,
                        id: m.category,
                        group: m.group,
                        valueType: m.valueType,
                        ltf: m.ltf,
                        category: m.category,
                        url: layer.url,
                        featureType: layer.featureType
                    });
                }
            }

            this.updateAvailableLayerOptions();
        },

        updateAvailableLayerOptions () {
            const layerOptions = this.allLayerOptions.filter(
                    layer => this.layerFilterModels.find(model => model.layerId === layer.id) === undefined
                ),
                groups = layerOptions.reduce((acc, el)=> ({...acc, [el.group]: [...acc[el.group] || [], el]}), {});

            let ret = [];

            for (const g in groups) {
                ret.push({header: g});
                ret = ret.concat(groups[g]);
            }

            this.layerOptions = ret;
        },

        addLayerFilter: async function () {
            this.layerOptions = this.layerOptions.filter(layer => layer.id !== this.selectedLayer.id);
            this.layerFilterModels.push(await this.createLayerFilterModel(this.selectedLayer));
            this.selectedLayer = null;
            this.updateAvailableLayerOptions();
        },

        getFieldValues: function (properties, prefix) {
            const ret = [];

            for (const entry of properties) {
                for (const prop in entry) {
                    if (prop.startsWith(prefix)) {
                        ret.push(prop);
                    }
                }
            }

            return ret.length > 0 ? [... new Set(ret)].sort().reverse() : [prefix + "alle"];
        },

        countFacilitiesPerFeature (facilityFeatures, features, property = undefined) {
            const fmap = Object.fromEntries(features.map(feat => [feat.getId(), 0]));

            for (const ffeature of facilityFeatures) {
                for (const feature of features) {
                    let polygon,
                        val;

                    if (feature.getGeometry().getType() === "MultiPolygon") {
                        // expect multipolygon, try polygon if exception
                        polygon = turfMultiPolygon(feature.getGeometry().getCoordinates());
                    }
                    else if (feature.getGeometry().getType() === "Polygon") {
                        polygon = turfPolygon(feature.getGeometry().getCoordinates());
                    }

                    if (
                        polygon &&
                        turfBooleanPointInPolygon(turfPoint(this.getCoordinate(ffeature)), polygon)
                    ) {
                        val = property ? parseFloat(ffeature.get(property)) : 1;
                        val = !isNaN(val) ? val : 1;
                        fmap[feature.getId()] = fmap[feature.getId()] + val;

                        break;
                    }
                }
            }

            return fmap;
        },

        loadFeatures: async function (layer) {
            if (this.propertiesMap[layer.id] && layer.property === undefined) {
                return;
            }

            if (layer.facilityLayerName) {
                const features = await this.getAllFeatures(layer.id),
                    adminFeatures = this.cloneDistrictFeatures(this.selectedDistrictLevel.districts),
                    fmap = this.countFacilitiesPerFeature(features, adminFeatures, layer.property);

                this.propertiesMap[layer.id] = adminFeatures.map(feature => {
                    /**
                     * @todo Dirty, since facilities might have timelines in the future themselves! Overhaul in "countFacilitiesPerFeature" method
                     */
                    const ret = feature.getProperties();

                    for (let i = 2012; i < new Date().getFullYear(); i++) {
                        ret["jahr_" + i] = fmap[feature.getId()];
                    }

                    return {
                        ...ret,
                        feature,
                        id: ret[this.keyOfAttrNameStats],
                        [this.selectorField]: this.keyOfAttrNameStats,
                        isFacility: true
                    };
                });
            }
            else {
                const wfsReader = new WFS();

                let features = await getFeaturePOST(layer.url, {
                        featureTypes: [layer.featureType],
                        srsName: this.projectionCode,
                        propertyNames: [layer.category, this.keyOfAttrNameStats, "jahr"]
                    }),
                    groupedFeatures = {};

                features = wfsReader.readFeatures(features);
                // group features by district
                groupedFeatures = groupBy(features, (feature) => {
                    return feature.get([this.keyOfAttrNameStats]);
                });

                this.propertiesMap[layer.id] = features.map(feature => {
                    const ret = feature.getProperties();

                    groupedFeatures[feature.get([this.keyOfAttrNameStats])].forEach(feat => {
                        ret["jahr_" + feat.get("jahr")] = feat.get([layer.category]);
                    });

                    ret.feature = feature;
                    ret[this.selectorField] = this.keyOfAttrNameStats;
                    ret.kategorie = layer.category;
                    ret.id = ret[this.keyOfAttrNameStats];
                    return ret;
                });
            }
        },

        cloneDistrictFeatures (districts) {
            return districts.map(district => {
                const feature = district.adminFeature.clone();

                feature.setId(feature.get(this.keyOfAttrName));
                feature.set(this.keyOfAttrNameStats, feature.getId());

                return feature;
            });
        },

        createLayerFilterModel: async function (layer) {
            await this.loadFeatures(layer);

            const valueType = layer.valueType,
                features = this.propertiesMap[layer.id],
                fieldValues = this.getFieldValues(features, "jahr_"),
                field = fieldValues[0],
                model = {layerId: layer.id, currentLayerId: layer.id, name: layer.name, field, valueType, high: 0, low: 0, fieldValues, facilityLayerName: layer.facilityLayerName,
                    ...this.getMinMaxForField(layer.id, field),
                    quotientLayers: this.allLayerOptions.filter(l=>l.id !== layer.id && l.valueType !== "relative").map(l=>({id: l.id, name: l.name})),
                    properties: await this.getFacilityProperties(layer)
                };

            this.setLayerFilterModelValue(model);
            return model;
        },

        async setLayerFilterModelValue (model) {
            const features = this.propertiesMap[model.currentLayerId];

            if (this.selectedDistrict) {
                const selector = this.keyOfAttrNameStats,
                    feature = features.find(f => f[selector] === this.selectedDistrictLevel.districtNamesMap[this.selectedDistrict] || this.selectedDistrict);

                if (feature) {
                    const value = Number(Number(parseFloat(feature[model.field])).toFixed(3));

                    if (!isFinite(value)) {
                        model.error = this.$t("additional:modules.tools.cosi.queryDistricts.selectedDistrictNotAvailable");
                        model.value = NaN;
                    }
                    else {
                        model.value = value;
                        model.error = undefined;
                    }
                }
            }
            else {
                model.value = 0;
                model.error = undefined;
            }
        },

        getMinMaxForField (layerId, field) {
            const invalidValues = [],
                features = this.propertiesMap[layerId],
                values = features.reduce((res, f) => {
                    const v = parseFloat(f[field]);

                    if (isNaN(v)) {
                        if (f[this.keyOfAttrNameStats]) {
                            invalidValues.push(f[this.keyOfAttrNameStats]);
                        }
                        else {
                            invalidValues.push(f.feature.get([this.keyOfAttrNameStats]));
                        }
                        return res;
                    }
                    return [...res, v];
                }, []),
                max = Math.max(...values),
                min = Math.min(...values),
                invalidFeatures = [...new Set(invalidValues)];

            return {min, max, invalidFeatures};
        },

        async computeResults () {
            if (this.layerFilterModels.length) {
                const result = await this.setComparableFeatures(this.layerFilterModels);

                this.resultNames = result.resultNames;
                this.results = result.table;
                this.resultTableHeaders = [{text: "Name", align: "start", value: "name"}];
                for (let i = 0; i < this.layerFilterModels.length; i++) {
                    this.resultTableHeaders.push({text: this.layerFilterModels[i].name, value: i.toString(), align: "center"});
                }
                this.showDistrictFeatures(result.features);
            }
            else {
                this.resultNames = null;
                this.results = null;
                this.showSelectedDistrict();
            }
        },

        zoomToDistrict: function (row) {
            const selectedDistrictLayer = this.layer,
                attributeSelector = this.keyOfAttrName,
                districtFeatures = selectedDistrictLayer.getSource().getFeatures();


            for (const feature of districtFeatures) {
                if (feature.getProperties()[attributeSelector] === row.name) {
                    const extent = feature.getGeometry().getExtent();

                    this.zoomToExtent({extent: extent, options: {padding: [20, 20, 20, 20]}});
                    return;
                }
            }
        },

        changeDistrictSelection: function () {
            const refDistrictName = this.refDistrict?.get(this.keyOfAttrName);

            this.setDistrictsByName({
                districtNames: refDistrictName ? [...this.resultNames, refDistrictName] : this.resultNames
            });
        },

        resetDistrictSelection: function () {
            this.layerFilterModels = [];
            this.updateAvailableLayerOptions();
            this.selectedDistrict = null;
        },

        async updateFilter (value) {
            const filters = [...this.layerFilterModels];

            for (let i = 0; i < filters.length; i++) {
                if (filters[i].layerId === value.layerId) {
                    filters[i] = {...filters[i], ...value};

                    if (value.field || value.quotientLayer === null || value.quotientLayer || value.property || value.property === null) {
                        let currentLayerId = filters[i].layerId;

                        if (value.property !== undefined) {
                            await this.loadFeatures({id: value.layerId, property: value.property, facilityLayerName: filters[i].facilityLayerName});
                        }
                        if (value.quotientLayer) {
                            await this.computeQuotientLayer(filters[i]);
                            currentLayerId = `${filters[i].layerId}/${filters[i].quotientLayer}`;
                        }

                        filters[i] = {
                            ...filters[i],
                            currentLayerId,
                            ...this.getMinMaxForField(currentLayerId, filters[i].field)
                        };

                        this.setLayerFilterModelValue(filters[i]);
                    }
                    break;
                }
            }
            this.layerFilterModels = filters;
        },

        async computeQuotientLayer (value) {
            await this.loadFeatures(this.allLayerOptions.find(layer => layer.id === value.quotientLayer));

            const lprops = this.propertiesMap[value.layerId],
                qprops = this.propertiesMap[value.quotientLayer],
                qid = `${value.layerId}/${value.quotientLayer}`,
                fieldValues = getAvailableYears(qprops).map(val => "jahr_" + val);

            this.propertiesMap[qid] = lprops.map(entry => {
                const props = qprops.find(p=>p.id === entry.id),
                    ret = {...props},
                    /**
                     * @todo Dirty, since facilities might have timelines in the future themselves! Overhaul in "countFacilitiesPerFeature" method
                     */
                    facilityVal = entry.isFacility ? entry.jahr_2012 : undefined;

                for (const p in props) {
                    if (p.startsWith("jahr_")) {
                        ret[p] = (facilityVal || entry[p]) / props[p];
                    }
                }
                ret.feature = entry.feature;
                return ret;
            });

            // update available years
            value.fieldValues = fieldValues;
        },

        closeFilter (value) {
            this.layerFilterModels = this.layerFilterModels.filter(elem => elem.layerId !== value.layerId);
            this.updateAvailableLayerOptions();
        },

        close () {
            this.setActive(false);

            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getModelByAttributes({
                id: this.$store.state.Tools.QueryDistricts.id
            });

            if (model) {
                model.set("isActive", false);
            }
        },

        createDistrictStyle () {
            return new Style({
                fill: new Fill({
                    color: [8, 119, 95, 0.3]
                }),
                stroke: new Stroke({
                    color: [8, 119, 95, 0.3],
                    width: 3
                })
            });
        },

        showSelectedDistrict: function () {
            this.mapLayer.getSource().clear();

            if (this.selectedDistrict) {
                this.refDistrict = this.layer.getSource().getFeatures()
                    .find(feature => feature.getProperties()[this.keyOfAttrName] === this.selectedDistrict);

                const featureClone = this.refDistrict.clone();

                featureClone.setStyle(this.createDistrictStyle());

                this.mapLayer.getSource().addFeature(featureClone);
            }
        },

        showDistrictFeatures (districtFeatures) {
            this.mapLayer.getSource().clear();

            const cloneCollection = districtFeatures.map((feature) => {
                const featureClone = feature.clone();

                featureClone.setStyle(this.createDistrictStyle());
                return featureClone;
            });

            if (this.refDistrict) {
                const refDistrictClone = this.refDistrict.clone();

                refDistrictClone.setStyle(this.createDistrictStyle());
                cloneCollection.push(refDistrictClone);
            }
            this.mapLayer.getSource().addFeatures(cloneCollection);
        },

        setFacilityNames () {
            this.facilityNames = this.activeVectorLayerList.map((layer) => ({
                name: layer.get("name").trim(),
                id: layer.get("id")
            }));
        },

        async getFacilityFeatures (name) {
            const selectedLayerModel = getModelByAttributes({
                name: name
            });

            return selectedLayerModel ? this.getAllFeatures(selectedLayerModel.id) : [];
        },

        async getFacilityProperties (layer) {
            if (layer.facilityLayerName) {
                const layerMap = this.layerMapById(layer.id);

                return layerMap?.numericalValues || null;
            }
            return null;
        },

        getCoordinate: function (feature) {
            const geometry = feature.getGeometry();

            if (geometry) {
                if (geometry.getType() === "Point") {
                    return geometry.getCoordinates().splice(0, 2);
                }
                return Extent.getCenter(geometry?.getExtent());
            }

            return [0, 0];
        },

        exportTable: function (index) {
            const
                date = new Date().toLocaleDateString("de-DE", {year: "numeric", month: "numeric", day: "numeric"}),
                filename = `${this.$t("additional:modules.tools.cosi.queryDistricts.exportFilename")}_${date}`,
                data = [
                    this.dataSets[index].inputs.resultTableHeaders.map(header => header.text),
                    ...this.dataSets[index].results.map(row => {
                        const _row = Object.values(row);

                        return [_row[_row.length - 1], ..._row.slice(0, _row.length - 1)];
                    })
                ],
                headers = ["Referenzgebiet", "Filter-Nr.", "Name", "Attribut", "Quotient", "Feld", "Min.", "Max.", "Ref.-Wert", "- Toleranz", "+ Toleranz"],
                filters = this.dataSets[index].inputs.layerFilterModels.map((filter, i) => [
                    this.dataSets[index].inputs.selectedDistrict,
                    i + 1,
                    filter.name,
                    filter.property || "-",
                    filter.quotientLayer || "-",
                    filter.field,
                    filter.min,
                    filter.max,
                    filter.value,
                    filter.low,
                    filter.high

                ]);

            exportXlsx([headers, [], ...filters, ...data], filename, {exclude: this.excludedPropsForExport}, "aoa_to_sheet");
        },
        // pagination functions
        downloadAll () {
            this.dataSets.forEach((set, index) => {
                this.exportTable(index);
            });
        },
        removeSet (index) {
            if (this.activeSet === this.dataSets.length - 1) {
                this.setActiveSet(this.activeSet - 1);
            }

            this.dataSets.splice(index, 1);
        },
        removeAll () {
            this.setDataSets([]);

            const newModels = [];

            for (const m of this.layerFilterModels) {
                const newModel = {...m};

                newModels.push(newModel);
                this.setLayerFilterModelValue(newModel);
            }
            this.layerFilterModels = newModels;
            this.updateAvailableLayerOptions();
        }
    }
};
</script>

<template lang="html">
    <Tool
        :title="$t('additional:modules.tools.cosi.queryDistricts.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <ToolInfo
                :url="readmeUrl"
                :locale="currentLocale"
            />
            <v-app>
                <div
                    v-if="active"
                    id="queryDistricts"
                    class="compare-districts"
                >
                    <div class="d-flex">
                        <div class="mb-5 overline">
                            {{ $t('additional:modules.tools.cosi.queryDistricts.subTitle') }}
                        </div>
                    </div>
                    <v-autocomplete
                        id="layerfilter-selector-container"
                        v-model="selectedLayer"
                        :label="$t('additional:modules.tools.cosi.queryDistricts.layerDropdownLabel')"
                        :title="$t('additional:modules.tools.cosi.queryDistricts.layerDropdownLabeltooltip')"
                        item-text="name"
                        item-value="id"
                        :items="layerOptions"
                        :clearable="false"
                        outlined
                        dense
                        return-object
                        class="qd-select"
                    />
                    <v-autocomplete
                        id="district-selector-container"
                        v-model="selectedDistrict"
                        :label="$t('additional:modules.tools.cosi.queryDistricts.districtDropdownLabel')"
                        :items="districtNames"
                        :clearable="true"
                        outlined
                        dense
                        class="qd-select"
                    />
                    <v-btn
                        id="add-filter"
                        dense
                        small
                        tile
                        color="grey lighten-1"
                        class="mr-2"
                        :disabled="selectedLayer===null"
                        @click="addLayerFilter()"
                    >
                        <span>
                            {{ $t('additional:modules.tools.cosi.queryDistricts.add') }}
                        </span>
                    </v-btn>
                    <v-btn
                        id="reset-district"
                        dense
                        small
                        tile
                        color="grey lighten-1"
                        :disabled="layerFilterModels.length === 0"
                        @click="resetDistrictSelection()"
                    >
                        {{ $t('additional:modules.tools.cosi.queryDistricts.resetSelection') }}
                    </v-btn>
                    <v-divider />
                    <AnalysisPagination
                        v-if="dataSets.length > 0 || layerFilterModels.length > 0"
                        :sets="dataSets"
                        :active-set="activeSet"
                        :add-function="true"
                        :downloads="['XLS']"
                        :download-condition="layerFilterModels.length ? true : false"
                        :remove-condition="dataSets.length > 1 ? true : false"
                        :titles="{
                            add: [$t('additional:modules.tools.cosi.queryDistricts.paginationAdd')],
                            downloads: [$t('additional:modules.tools.cosi.queryDistricts.exportTable')],
                            downloadAll: $t('additional:modules.tools.cosi.queryDistricts.paginationDownloadAll'),
                            remove: $t('additional:modules.tools.cosi.queryDistricts.paginationRemove'),
                            removeAll: $t('additional:modules.tools.cosi.queryDistricts.paginationRemoveAll')
                        }"
                        @setActiveSet="(n) => setActiveSet(n)"
                        @removeSingle="(n) => removeSet(n)"
                        @addSet="addSet"
                        @removeAll="removeAll"
                        @downloadXLS="(n) => exportTable(n)"
                        @downloadAll="downloadAll"
                    />
                    <v-divider v-if="layerFilterModels.length > 0" />
                    <div
                        v-for="(set, i) in dataSets"
                        id="results"
                        :key="i"
                        class="result"
                        :class="[activeSet === i ? 'active' : '', 'result_' + i]"
                    >
                        <div
                            v-if="layerFilterModels.length > 0"
                            class="d-flex overline"
                        >
                            <div
                                class="mb-5"
                            >
                                {{ $t('additional:modules.tools.cosi.queryDistricts.setParams') }}
                            </div>
                            <div
                                v-if="selectedDistrict"
                                id="reference-district"
                                class="ml-auto"
                            >
                                <span>
                                    {{ $t('additional:modules.tools.cosi.queryDistricts.referenceDistrict') }}:
                                </span>
                                <span
                                    id="reference-district-button"
                                    class="name-tag district-name"
                                    @click="zoomToDistrict({'name': selectedDistrict})"
                                    @keyUp="() => null"
                                >{{ selectedDistrict }}</span>
                            </div>
                        </div>
                        <LayerFilter
                            v-for="filter in layerFilterModels"
                            id="layer-filter"
                            :key="filter.layerId"
                            :locale="currentLocale"
                            v-bind="filter"
                            class="layer-filter"
                            @update="updateFilter"
                            @close="closeFilter"
                        />
                        <v-divider v-if="resultNames" />
                        <div
                            v-if="resultNames"
                            id="compare-results"
                        >
                            <div class="d-flex overline">
                                <div
                                    v-if="layerFilterModels.length > 0"
                                    class="mb-5"
                                >
                                    {{ $t('additional:modules.tools.cosi.queryDistricts.comparableResults') }}
                                </div>
                                <div
                                    v-if="selectedDistrict"
                                    id="reference-district"
                                    class="ml-auto"
                                >
                                    <span>
                                        {{ $t('additional:modules.tools.cosi.queryDistricts.referenceDistrict') }}:
                                    </span>
                                    <span
                                        id="reference-district-button"
                                        class="name-tag district-name"
                                        @click="zoomToDistrict({'name': selectedDistrict})"
                                        @keyUp="() => null"
                                    >{{ selectedDistrict }}</span>
                                </div>
                            </div>
                            <v-data-table
                                v-if="resultNames.length > 0"
                                id="result-table"
                                dense
                                :headers="resultTableHeaders"
                                :items="results"
                                item-key="name"
                                class="elevation-1"
                                :footer-props="{
                                    'items-per-page-text': $t('additional:modules.tools.cosi.queryDistricts.rowsPerPage'),
                                    'items-per-page-all-text': $t('additional:modules.tools.cosi.queryDistricts.rowsPerPageAll'),
                                }"
                                @click:row="zoomToDistrict"
                            >
                                <template
                                    v-for="col in resultTableHeaders.filter(e => e.value !== 'name')"
                                    #[`item.${col.value}`]="{ item, header }"
                                >
                                    {{ parseFloat(item[header.value]).toLocaleString(currentLocale) }}
                                </template>
                            </v-data-table>
                            <v-divider />
                            <v-btn
                                v-if="resultNames && resultNames.length"
                                id="set-selected-district"
                                dense
                                small
                                tile
                                color="grey lighten-1"
                                class="mr-2"
                                @click="changeDistrictSelection()"
                            >
                                {{ $t('additional:modules.tools.cosi.queryDistricts.resultAsSelection') }}
                            </v-btn>
                            <v-btn
                                v-if="resultNames && resultNames.length"
                                dense
                                small
                                tile
                                color="grey lighten-1"
                                :title="$t('additional:modules.tools.cosi.queryDistricts.exportTable')"
                                @click="exportTable()"
                            >
                                {{ $t('additional:modules.tools.cosi.queryDistricts.exportTable') }}
                            </v-btn>
                        </div>
                    </div>
                </div>
            </v-app>
        </template>
    </Tool>
</template>

<style lang="scss" scoped>
.layer-filter {
    margin-bottom: 10px;
    border: 1px solid rgba(0,0,0,.12);
    padding: 10px;
    background-color: rgba(0,0,0,0.01);
}

.result {
    display:none;

    &.active {
        display:block;
    }
}

#compare-results {
    max-width: 600px;
    word-wrap: break-word
}

.compare-districts {
    min-height: 220px;
    #layerfilter-selector-container {
        .dropdown-menu.open {
            width: 400px;
            height: 200px;
        }
    }

    #district-selector-container {
        .dropdown-menu.open {
            height: 200px;
        }
    }
}

#help {
    padding-top: 7px;
    background-color: white;
    height: 30px;
    border: 1px solid #ccc;
    cursor: pointer;
    text-align: center;
    min-width: 30px;
}

#help:hover {
    background-color: #d3d3d3;
}

#compare-results {
    line-height: 1.6;
}

.name-tag {
    border-radius: 5px;
    background-color: #bdbdbd;
    color: black;
    padding: 0 4px;
    display: inline-block;
}

.name-tag.district-name {
    cursor: pointer;
}

.table {

    th,
    td {
        border-bottom: 1px solid #ddd;
    }

    tr:hover {
        background-color: #f5f5f5;
    }
}
#reference-district {
    color: #646262;
    margin-bottom: 10px;
}
.download-container {
    float: left;
    padding-top: 25px;
     @media (max-width: 600px) {
          padding-top: 35px;
     }
}
</style>
