<script>
/* eslint-disable vue/multi-word-component-names */
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersDipas";
import mutations from "../store/mutationsDipas";
import GeoJSON from "ol/format/GeoJSON";
import {Fill, Stroke, Style, Circle, Text} from "ol/style.js";
import {Vector} from "ol/source.js";
import {Heatmap} from "ol/layer.js";
import {Point} from "ol/geom.js";
import {generateColorScale, generateColorScaleByColor} from "../../utils/colorScale";
import {getLayerById} from "../../DistrictSelector/utils/prepareDistrictLevels.js";
import {scaleSequential} from "d3-scale";
import {interpolateRdYlGn} from "d3-scale-chromatic";
import ToolInfo from "../../components/ToolInfo.vue";
import axios from "axios";
import {exportAsGeoJson} from "../utils/exportResults";
import LoaderOverlay from "../../../../src/utils/loaderOverlay.js";
import {getCenterOfMass} from "../../utils/features/getCenterOfMass";
import {getModelByAttributes} from "../../utils/radioBridge.js";

export default {
    name: "Dipas",
    components: {
        Tool,
        ToolInfo
    },
    data () {
        return {
            projectsFeatureCollection: [],
            projectsColors: null,
            projectsActive: {},
            contributions: {},
            selectedStyling: null,
            categoryRainbow: false,
            pollingEnabled: false,
            poll: null,
            isMounted: false,
            scrollPos: "",
            map: undefined
        };
    },
    computed: {
        ...mapGetters("Tools/Dipas", Object.keys(getters)),
        ...mapGetters("Tools/FeaturesList", ["isFeatureActive"]),
        /**
         * @todo refactor: use Map getter "getLayerById" instead of custom method
         */
        ...mapGetters("Maps", {layerById: "getLayerById", projectionCode: "projectionCode"}),
        ...mapGetters("Language", ["currentLocale"]),
        isProjectActive () {
            return (id) => {
                const projectActive = this.projectsActive[id];

                return projectActive.layer || projectActive.contributions || projectActive.heatmap;
            };
        }
    },
    watch: {
        selectedStyling: function () {
            for (const [id, value] of Object.entries(this.contributions)) {
                if (value.features.length > 0) {
                    const model = getModelByAttributes({id: id + "-contributions"});

                    model.get("layerSource").changed();
                }
            }

            this.$root.$emit("updateFeaturesList");
        },
        pollingEnabled (state) {
            if (state) {
                this.poll = this.setPolling();
            }
            else {
                clearInterval(this.poll);
            }
        }
    },
    /**
    * @returns {void}
    */
    created () {
        this.$on("close", this.close);
        this.map = mapCollection.getMap("2D");
    },
    /**
   * fetches the projects and creates their layer with different color styles
   * @returns {void}
   */
    async mounted () {
        this.isMounted = true;
        this.applyTranslationKey(this.name);
        this.initialize();
    },
    methods: {
        ...mapActions("Maps", ["zoomToExtent"]),
        ...mapActions("Tools/Dipas", ["addLayer"]),
        ...mapActions("Tools/FeaturesList", ["addVectorlayerToMapping", "removeVectorLayerFromMapping"]),
        ...mapMutations("Tools/Dipas", Object.keys(mutations)),
        ...mapMutations("Maps", ["addLayerToMap"]),
        ...mapActions("Tools/Draw", ["createCenterPoint"]),
        getLayerById,

        /**
        * Closes this tool window by setting active to false
        * @returns {void}
        */
        close () {
            this.setActive(false);

            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getModelByAttributes({
                id: this.$store.state.Tools.Dipas.id
            });

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * initializes the component with important data
         * @returns {void}
         */
        async initialize () {
            const fetch = await this.fetchProjects();
            let features = [];

            for (let i = fetch.features.length - 1; i >= 0; i--) {
                if (typeof fetch.features[i].geometry.type === "undefined") {
                    fetch.features.splice(i, 1);
                }
            }

            features = new GeoJSON().readFeatures(fetch);

            this.selectedStyling = "category";
            this.projectsFeatureCollection = this.transformFeatures(features);
            this.projectsColors = generateColorScale(undefined, "interpolateTurbo", this.projectsFeatureCollection.length).legend.colors;
            for (let i = 0; i < this.projectsFeatureCollection.length; i++) {
                const feature = this.projectsFeatureCollection[i],
                    id = feature.getProperties().id,
                    layer = {
                        id: id,
                        name: id,
                        project: true,
                        features: [feature],
                        isBaseLayer: true
                    },
                    style = new Style({
                        fill: new Fill({color: this.projectsColors[i].replace("rgb", "rgba").replace(")", ", 0.4)")}),
                        stroke: new Stroke({color: this.projectsColors[i], width: 4})
                    }),
                    len = Object.values(feature.get("standardCategories")).length,
                    colorScale = generateColorScaleByColor(this.projectsColors[i], len),
                    rainbowColorScale = generateColorScale([0, len + 1], "interpolateRainbow").scale,
                    model = await this.addLayer(layer),
                    layerOnMap = this.getLayerById(this.map.getLayers().getArray(), id);

                layerOnMap.setZIndex(0);
                layerOnMap.setStyle(style);
                layerOnMap.setVisible(false);
                model.set("isSelected", false);

                this.$set(this.projectsActive, id, {layer: false, contributions: false, heatmap: false});
                this.$set(this.contributions, id, {index: i, colors: {}, rainbowColors: {}, features: [], loading: false});
                for (const [catIndex, category] of Object.values(feature.get("standardCategories")).entries()) {
                    this.contributions[id].colors[category.name] = colorScale(catIndex);
                    this.contributions[id].rainbowColors[category.name] = rainbowColorScale(catIndex);
                }
            }
        },
        /**
         * fetches all projects as a FeatureCollection
         * @returns {Object} the FeatureCollection of all projects in json format
         */
        async fetchProjects () {
            const url = this.baseUrl,
                ret = await axios(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                        "Content-Type": "application/json"
                    }
                }),
                json = await ret.data;

            if (json.error) {
                throw Error(JSON.stringify(json));
            }
            return json;
        },
        /**
         * fetches the contributions of a given project id
         * @param {String} id the id of a previously fetched project
         * @returns {Object} the FeatureCollection of all contributions for the given project id in json format
         */
        async fetchContributions (id) {
            const url = this.baseUrl + "/" + id + "/contributions",
                ret = await axios(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                        "Content-Type": "application/json"
                    }
                }),
                json = await ret.data;

            if (json.error) {
                throw Error(JSON.stringify(json));
            }

            return json;
        },
        /**
         * takes an array of features and passes them to the transformFeature function
         * @param {Array} features an array of features
         * @returns {Array} an array with the transformed features
         */
        transformFeatures (features) {
            features.forEach(feature => this.transformFeature(feature));
            return features;
        },
        /**
         * takes a feature and transforms it to the desired referenceSystem so it can be displayed on the map
         * @param {Object} feature the feature to be transformed
         * @returns {Object} the transformed feature
         */
        transformFeature (feature) {
            const geometry = feature.getGeometry();
            let referenceSystem = feature.get("referenceSystem");

            referenceSystem = referenceSystem === undefined ? "4326" : referenceSystem;
            if (geometry) {
                geometry.transform("EPSG:" + referenceSystem, this.projectionCode);
            }
            return feature;
        },
        /**
         * fetches the contributions for the given project id and transforms those features
         * @param {String} id the id of the project
         * @returns {Array} the transformed features of all contributions
         */
        async getContributionFeatures (id) {
            const fetch = await this.fetchContributions(id),
                features = new GeoJSON().readFeatures(fetch);

            for (const feature of features) {
                if (!feature.get("dipasLocated")) {
                    const model = getModelByAttributes({id: id}),
                        center = getCenterOfMass(model.get("features")[0], this.projectionCode, this.projectionCode);

                    feature.setGeometry(new Point(center));

                    // TODO: Skip these features for transform so there's no need to transform back and forth?
                    let referenceSystem = feature.get("referenceSystem");

                    referenceSystem = referenceSystem === undefined ? "4326" : referenceSystem;
                    feature.getGeometry().transform(this.projectionCode, "EPSG:" + referenceSystem);
                }
            }
            return this.transformFeatures(features);
        },
        /**
         * changes the visibility of the layer for the given project id
         * @param {String} id the project id
         * @param {Boolean} value wether the project layer shall be visible or not
         * @returns {void}
         */
        async changeProjectVisibility (id, value) {
            const model = getModelByAttributes({id: id});

            model.set("isSelected", value);
        },
        /**
         * @param {Object} id - the project ID
         * @param {Boolean} refresh - if set, contributions will be refreshed in any case
         * @return {Object} the contributions object
         */
        async updateContributionFeatures (id, refresh = false) {
            const projectContributions = this.contributions[id];

            if (refresh || projectContributions.features.length === 0) {
                projectContributions.loading = true;
                const contributions = await this.getContributionFeatures(id);

                for (const feature of contributions) {
                    const geometryType = feature.getGeometry().getType();

                    if (geometryType !== "Point") {
                        const center = this.createCenterPoint({feature});

                        feature.setGeometry(new Point(center));
                    }
                    feature.setProperties({
                        originalGeometryType: geometryType,
                        votingPro: String(feature.get("votingPro")),
                        votingContra: String(feature.get("votingContra")),
                        commentsNumber: String(feature.get("commentsNumber"))
                    });
                    feature.setId(feature.get("id"));
                }
                projectContributions.features = contributions;
                projectContributions.loading = false;
            }

            return projectContributions;
        },
        /**
         * changes the visibility of the contributions layer for the given project id
         * @param {Object} feature the project feature
         * @param {Boolean} value wether the contributions layer shall be visible or not
         * @returns {void}
         */
        async changeContributionVisibility (feature, value) {
            const id = feature.get("id"),
                layer = {
                    id: id + "-contributions",
                    name: feature.get("nameFull") + " Beiträge",
                    features: []
                };

            let model = getModelByAttributes({id: layer.id});

            if (!model) {
                await this.updateContributionFeatures(id);
                layer.features = this.contributions[id].features;
                model = await this.addLayer(layer);

                const
                    layerOnMap = this.getLayerById(this.map.getLayers().getArray(), layer.id),
                    heatmapLayer = this.getLayerById(this.map.getLayers().getArray(), id + "-heatmap");

                layerOnMap.setZIndex(2);
                layerOnMap.setStyle(this.contributionStyles);
                this.addVectorlayerToMapping(model.attributes);

                if (heatmapLayer) {
                    heatmapLayer.setSource(layerOnMap.getSource());
                }
            }

            model.set("isSelected", value);
        },
        contributionStyles (feature, resolution) {
            const styles = [];

            switch (this.selectedStyling) {
                case "project":
                    styles.push(this.getContributionColorByProject(feature, resolution));
                    break;
                case "category":
                    this.categoryRainbow = false;
                    styles.push(this.getContributionColorByCategory(feature, resolution));
                    break;
                case "categoryRainbow":
                    this.categoryRainbow = true;
                    styles.push(this.getContributionColorByCategory(feature, resolution));
                    break;
                case "voting":
                    styles.push(this.getContributionColorByVoting(feature, resolution));
                    break;
                default:
                    styles.push(null);
                    break;
            }
            if (feature.get("originalGeometryType") !== "Point") {
                const secondaryStyle = new Style();

                if (resolution < 1.5) {
                    secondaryStyle.setText(this.getContributionGeometryLabel());
                }
                styles.push(secondaryStyle);
            }
            if (!feature.get("dipasLocated")) {
                const tertiaryStyle = new Style();

                tertiaryStyle.setText(this.getContributionErrorLabel());
                styles.push(tertiaryStyle);
            }
            return styles;
        },
        /**
         * creates a style for the given feature and resolution
         * @param {ol.Feature} feature the feature to style
         * @param {Number} resolution the current map resolution
         * @returns {void}
         */
        getContributionColorByProject (feature, resolution) {
            const id = feature.get("belongToProject"),
                index = this.contributions[id].index,
                color = this.projectsColors[index],
                text = this.getContributionLabel(feature),
                style = new Style({
                    image: new Circle({
                        radius: 5,
                        fill: new Fill({color: color.replace("rgb", "rgba").replace(")", ", 0.4)")}),
                        stroke: new Stroke({color: "#000", width: 1})
                    })
                });

            if (resolution < 1.5) {
                style.setText(text);
            }
            return style;
        },
        /**
         * creates a style for the given feature and resolution
         * @param {ol.Feature} feature the feature to style
         * @param {Number} resolution the current map resolution
         * @returns {void}
         */
        getContributionColorByCategory (feature, resolution) {
            const id = feature.get("belongToProject"),
                category = feature.get("category");
            let colors;

            if (this.categoryRainbow) {
                colors = this.contributions[id].rainbowColors;
            }
            else {
                colors = this.contributions[id].colors;
            }

            // eslint-disable-next-line one-var
            const color = colors[category],
                text = this.getContributionLabel(feature),
                style = new Style({
                    image: new Circle({
                        radius: 5,
                        fill: new Fill({color: color}),
                        stroke: new Stroke({color: "#000", width: 1})
                    })
                });

            if (resolution < 1.5) {
                style.setText(text);
            }
            return style;
        },
        /**
         * creates a style for the given feature and resolution
         * @param {ol.Feature} feature the feature to style
         * @param {Number} resolution the current map resolution
         * @returns {void}
         */
        getContributionColorByVoting (feature, resolution) {
            const colorScale = scaleSequential().interpolator(interpolateRdYlGn),
                properties = feature.getProperties(),
                votingPro = parseInt(properties.votingPro, 10),
                votingContra = parseInt(properties.votingContra, 10),
                weight = (votingPro + 1) / ((votingPro + 1) + (votingContra + 1)),
                color = colorScale(weight),
                text = this.getContributionLabel(feature),
                style = new Style({
                    image: new Circle({
                        // radius: Math.sqrt(votingPro + votingContra) + 5,
                        radius: Math.pow(votingPro + votingContra, 2 / 3) + 3,
                        fill: new Fill({color: color}),
                        stroke: new Stroke({color: "#000", width: 1})
                    })
                });

            if (resolution < 1.5) {
                style.setText(text);
            }
            return style;
        },
        /**
         * changes the visibility of the heatmap layer for the given project id
         * @param {String} id the project id
         * @param {Boolean} value wether the heatmap layer shall be visible or not
         * @returns {void}
         */
        async changeHeatmapVisibility (id, value) {
            const
                layerId = id + "-heatmap",
                contributionsModel = getModelByAttributes({id: id + "-contributions"}),
                isFeatureActive = this.isFeatureActive;
            let
                layer = this.getLayerById(this.map.getLayers().getArray(), layerId);

            if (!layer) {
                const vector = new Vector();
                let maxVotes = 0;

                if (!this.contributions[id].features) {
                    LoaderOverlay.show();
                    this.contributions[id].features = await this.getContributionFeatures(id);
                    LoaderOverlay.hide();
                }
                for (const feature of this.contributions[id].features) {
                    vector.addFeature(feature);
                }

                maxVotes = Math.max(...this.contributions[id].features.map(
                    f => parseInt(f.get("votingPro"), 10) + parseInt(f.get("votingPro"), 10))
                );
                layer = new Heatmap({
                    source: vector,
                    radius: 40,
                    blur: 20,
                    id: layerId,
                    weight: function (feature) {
                        if (!isFeatureActive(feature)) {
                            return 0;
                        }
                        const votingPro = parseInt(feature.get("votingPro"), 10),
                            votingContra = parseInt(feature.get("votingContra"), 10),
                            weight = (votingPro + votingContra) / maxVotes;

                        return weight;
                    }
                });
                layer.setZIndex(1);
                this.map.addLayer(layer);
            }
            if (contributionsModel && layer.getSource() !== contributionsModel.get("layerSource")) {
                layer.setSource(contributionsModel.get("layerSource"));
            }

            layer.setVisible(value);
        },

        getContributionLabel (feature) {
            return new Text({
                font: "16px Calibri,sans-serif",
                fill: new Fill({
                    color: [255, 255, 255]
                }),
                stroke: new Stroke({
                    color: [0, 0, 0],
                    width: 2
                }),
                text: feature.get("id"),
                textAlign: "left",
                offsetY: -8,
                offsetX: 8
            });
        },

        getContributionGeometryLabel () {
            return new Text({
                font: "16px Calibri,sans-serif",
                fill: new Fill({
                    color: [255, 0, 0]
                }),
                stroke: new Stroke({
                    color: [0, 0, 0],
                    width: 2
                }),
                text: "*",
                textAlign: "left",
                offsetY: -8,
                offsetX: -8
            });
        },

        getContributionErrorLabel () {
            return new Text({
                font: "16px Calibri,sans-serif",
                fill: new Fill({
                    color: [255, 0, 0]
                }),
                stroke: new Stroke({
                    color: [0, 0, 0],
                    width: 2
                }),
                text: "?",
                textAlign: "left",
                offsetY: -12,
                offsetX: -2.5
            });
        },

        handleColor (id, category) {
            let color;

            if (["project", "voting"].includes(this.selectedStyling)) {
                const index = this.contributions[id].index;

                color = this.projectsColors[index];
            }
            else {
                let colors = this.contributions[id].colors;

                if (this.categoryRainbow) {
                    colors = this.contributions[id].rainbowColors;
                }
                color = colors[category] ? colors[category] : "rgb(0,0,0)";
            }
            return color;
        },

        zoomToProject (feature) {
            const extent = feature.getGeometry().getExtent();

            this.zoomToExtent({extent: extent, options: {padding: [20, 20, 20, 20]}});
        },

        getDateString (feature) {
            const startDate = new Date(feature.get("dateStart")).toLocaleDateString(this.currentLocale),
                endDate = new Date(feature.get("dateEnd")).toLocaleDateString(this.currentLocale);

            return startDate + " - " + endDate;
        },
        exportDipas () {
            const layers = [],
                layersOnMap = [];

            for (const project in this.projectsActive) {
                if (this.projectsActive[project].layer) {
                    layers.push(project);
                }
                if (this.projectsActive[project].contributions) {
                    layers.push(project + "-contributions");
                }
                if (this.projectsActive[project].heatmap) {
                    layers.push(project + "-heatmap");
                }
            }
            for (const layerId of layers) {
                layersOnMap.push(this.getLayerById(this.map.getLayers().getArray(), layerId));
            }
            exportAsGeoJson(layersOnMap);
        },
        /**
         * Sets an automatic polling for new contributions
         * pollingInterval length from store in ms
         * @returns {Number} the interval ID
         */
        setPolling () {
            return setInterval(() => {
                for (const id in this.contributions) {
                    const model = getModelByAttributes({id: id + "-contributions"});

                    this.updateContributionFeatures(id, true);
                    if (model) {
                        const source = model.get("layerSource");

                        model.set("features", this.contributions[id].features);
                        source.clear();
                        source.addFeatures(this.contributions[id].features);
                    }
                }
            }, this.pollingInterval);
        },

        async scrollPosition (id) {
            await this.$nextTick();
            const target = this.$refs.pdesc.find(el => el.id === id);

            if (!target) {
                return;
            }

            if (target.scrollHeight === target.offsetHeight) {
                this.scrollPos = "";
                return;
            }

            if (target.scrollTop === 0) {
                this.scrollPos = "bottom";
                return;
            }

            if (target.scrollTop > 0 && target.scrollTop < (target.scrollHeight - target.offsetHeight - 3)) {
                this.scrollPos = "both";
                return;
            }

            if (target.scrollTop >= (target.scrollHeight - target.offsetHeight - 3)) {
                this.scrollPos = "top";
                return;
            }

            this.scrollPos = "";
        }
    }
};
</script>

<template lang="html">
    <div id="toolWrap">
        <Tool
            :title="$t('additional:modules.tools.cosi.dipas.title')"
            :icon="icon"
            :active="active"
            :render-to-window="renderToWindow"
            :resizable-window="resizableWindow"
            :deactivate-gfi="deactivateGFI"
        >
            <template #toolBody>
                <v-app class="clamp-600px">
                    <ToolInfo
                        :url="readmeUrl"
                        :locale="currentLocale"
                        :summary="$t('additional:modules.tools.cosi.dipas.summary')"
                    />
                    <div
                        v-if="active"
                        id="dipas"
                    >
                        <v-card
                            class="mx-auto"
                            tile
                        >
                            <v-list>
                                <v-list-group
                                    v-for="(feature, index) in projectsFeatureCollection"
                                    :key="feature.get('id')"
                                    @click="scrollPosition(feature.get('id'))"
                                >
                                    <template #activator>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                class="text-wrap"
                                            >
                                                {{ feature.get("nameFull") }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle
                                                class="text-wrap"
                                            >
                                                {{ getDateString(feature) }}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            <v-btn
                                                :color="projectsColors[index]"
                                                small
                                                dark
                                            >
                                                <v-icon
                                                    v-if="isProjectActive(feature.get('id'))"
                                                    dark
                                                >
                                                    mdi-checkbox-marked-circle
                                                </v-icon>
                                                <v-icon
                                                    v-else
                                                    dark
                                                >
                                                    mdi-cancel
                                                </v-icon>
                                            </v-btn>
                                        </v-list-item-icon>
                                    </template>
                                    <div
                                        :id="feature.get('id')"
                                        ref="pdesc"
                                        class="p_description"
                                        :class="scrollPos"
                                        @scroll="scrollPosition(feature.get('id'))"
                                    >
                                        <p
                                            v-html="feature.get('description')"
                                        />
                                    </div>
                                    <v-chip
                                        v-for="category in feature.get('standardCategories')"
                                        :key="feature.get('id') + category.id"
                                        class="ma-1 category"
                                        :color="handleColor(feature.get('id'), category.name)"
                                        small
                                    >
                                        {{ category.name }}
                                    </v-chip>
                                    <v-list-item>
                                        <v-list-item-action>
                                            <v-switch
                                                v-model="projectsActive[feature.get('id')]['layer']"
                                                @change="changeProjectVisibility(feature.get('id'), $event)"
                                            />
                                        </v-list-item-action>
                                        <v-list-item-content>
                                            <v-list-item-title>{{ $t('additional:modules.tools.cosi.dipas.showProject') }}</v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon v-if="projectsActive[feature.get('id')]['layer']">
                                            <v-icon
                                                :title="$t('additional:modules.tools.cosi.dipas.showProject')"
                                                @click="zoomToProject(feature)"
                                            >
                                                mdi-magnify
                                            </v-icon>
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-action>
                                            <v-switch
                                                v-model="projectsActive[feature.get('id')]['contributions']"
                                                @change="changeContributionVisibility(feature, $event)"
                                            />
                                        </v-list-item-action>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                {{ $t('additional:modules.tools.cosi.dipas.showContributions') }}
                                                <v-btn
                                                    v-if="contributions[feature.get('id')].loading"
                                                    plain
                                                    loading
                                                    small
                                                />
                                            </v-list-item-title>
                                        </v-list-item-content>
                                        <v-list-item-icon>
                                            {{ feature.get('hasParticipatoryText').length }} {{ $t('additional:modules.tools.cosi.dipas.contributions') }}
                                        </v-list-item-icon>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-action>
                                            <v-switch
                                                v-model="projectsActive[feature.get('id')]['heatmap']"
                                                @change="changeHeatmapVisibility(feature.get('id'), $event)"
                                            />
                                        </v-list-item-action>
                                        <v-list-item-content>
                                            <v-list-item-title>{{ $t('additional:modules.tools.cosi.dipas.showHeatmap') }}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider />
                                </v-list-group>
                            </v-list>
                        </v-card>
                    </div>
                    <v-divider />
                    <div id="radio">
                        <div class="mb-1">
                            {{ $t('additional:modules.tools.cosi.dipas.styling.label') }}
                        </div>
                        <label>
                            <input
                                v-model="selectedStyling"
                                type="radio"
                                value="project"
                            > {{ $t('additional:modules.tools.cosi.dipas.styling.byProject') }}
                        </label>
                        <label>
                            <input
                                v-model="selectedStyling"
                                type="radio"
                                value="category"
                            > {{ $t('additional:modules.tools.cosi.dipas.styling.byCategories') }}
                        </label>
                        <label>
                            <input
                                v-model="selectedStyling"
                                type="radio"
                                value="categoryRainbow"
                            > {{ $t('additional:modules.tools.cosi.dipas.styling.byCategoriesRainbow') }}
                        </label>
                        <label>
                            <input
                                v-model="selectedStyling"
                                type="radio"
                                value="voting"
                            > {{ $t('additional:modules.tools.cosi.dipas.styling.byVoting') }}
                        </label>
                    </div>
                    <v-divider />
                    <div
                        id="actions"
                    >
                        <v-btn
                            id="download-geojson"
                            dense
                            small
                            tile
                            color="green lighten-1"
                            :title="$t('additional:modules.tools.cosi.dipas.download.title')"
                            :disabled="!Object.values(projectsActive).map(project => project.layer || project.contributions || project.heatmap).reduce((t, value) => t || value, false)"
                            @click="exportDipas()"
                        >
                            <v-icon
                                left
                            >
                                mdi-floppy
                            </v-icon>
                            Download GeoJSON
                        </v-btn>
                        <v-checkbox
                            v-model="pollingEnabled"
                            small
                            :title="$t('additional:modules.tools.cosi.dipas.polling.help')"
                            :label="$t('additional:modules.tools.cosi.dipas.polling.label')"
                            dense
                            hide-details
                            class="float-right"
                            type="checkbox"
                        />
                    </div>
                </v-app>
            </template>
        </Tool>
    </div>
</template>

<style lang="scss" scoped>
#dipas {
  width: auto;
  min-height: 100px;
  max-height: 43vh;
  overflow-y: auto;
  overflow-x:hidden;
}

#radio {
    margin-top: 5px;
}

.feature-item {
    white-space: nowrap;
    overflow-x: auto;
}

.feature-item-content {
    display: inline-block;
    margin-left: 20px;
}

.p_description {
    position:relative;
    margin:20px auto;
    width:90%;
    box-sizing:content-box;
    padding: 20px;
    padding-bottom:0px;
    padding-right:60px;
    overflow-y: auto;
    overflow-x:hidden;
    border-radius:10px;
    max-height: 240px;
    background:whitesmoke;

    p {
        height:auto;
        width:100%;
        overflow-x:hidden;
        line-height: 1.5rem;
    }

    &.top {
        border-top:4px solid #ccc;
    }

    &.bottom {
        border-bottom:4px solid #ccc;
    }

    &.both {
        border-top:4px solid #ccc;
        border-bottom:4px solid #ccc;
    }
}

.v-chip.category {
    border: 1px solid rgb(0,0,0) !important;
}
</style>
