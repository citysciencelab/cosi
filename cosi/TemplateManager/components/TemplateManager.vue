<script>
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import {getComponent} from "../../../../src/utils/getComponent";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersTemplateManager";
import mutations from "../store/mutationsTemplateManager";
import actions from "../store/actionsTemplateManager";
import ToolInfo from "../../components/ToolInfo.vue";
import TemplateManagerImport from "./TemplateManagerImport.vue";
import axios from "axios";
import mapping from "../../assets/mapping.json";

export default {
    name: "TemplateManager",
    components: {
        Tool,
        ToolInfo,
        TemplateManagerImport
    },
    data () {
        return {
            templates: [],
            filters: []
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/TemplateManager", Object.keys(getters)),
        ...mapGetters("Tools/SaveSession", []),
        ...mapGetters("Tools/DistrictSelector", ["districtLevels"]),
        ...mapGetters("Tools/FeaturesList", ["flatLayerMapping"])
    },
    watch: {
        /**
         * Unselect the Menu item if the tool is deactivated
         * @param {boolean} state - Defines if the tool is active.
         * @returns {void}
         */
        active (state) {
            if (!state) {
                const model = getComponent(this.id);

                if (model) {
                    model.set("isActive", false);
                }
            }
        },
        templates: "createFilterObjects"
    },
    created () {
        /**
         * listens to the close event of the Tool Component
         * @listens #close
         */
        this.$on("close", () => {
            this.setActive(false);
        });
    },
    mounted () {
        this.loadTemplates();
    },
    methods: {
        ...mapMutations("Tools/TemplateManager", Object.keys(mutations)),
        ...mapActions("Tools/TemplateManager", Object.keys(actions)),
        ...mapMutations("Tools/DistrictSelector", ["setMapping"]),
        ...mapActions("Tools/SaveSession", ["loadSessionData"]),

        /**
         * Load templates from paths defined in config.json
         * @async
         * @returns {void}
         */
        async loadTemplates () {
            let path, res;
            const templates = [];

            for (const filename of this.templateFiles) {
                path = `${this.templatePath}/${filename}.json`;

                try {
                    res = await axios(path);
                    res = await res.data;
                    templates.push(res);
                }
                catch (e) {
                    console.warn(`Template at ${path} could not be loaded. Please check that it is a valid JSON file.`);
                }
            }

            this.templates = templates;
        },

        createFilterObjects () {
            this.filters = this.templates.map(template => ({
                activeLayerList: Object.fromEntries(this.getActiveLayerList(template).map(el => [el.layerId, true])),
                selectedDistrictNames: Object.fromEntries(this.getSelectedDistricts(template).map(el => [el, true])),
                statsCategories: Object.fromEntries(this.getStatsCategories(template).map(el => [el, true])),
                calculations: Object.fromEntries(this.getCalculations(template).map(el => [el.id, true]))
            }));
        },

        applyFilters (template, index) {
            const
                _template = JSON.parse(JSON.stringify(template)),
                filter = this.filters[index],
                activeLayerList = Object.keys(filter.activeLayerList).filter(key => filter.activeLayerList[key]),
                selectedDistrictNames = Object.keys(filter.selectedDistrictNames).filter(key => filter.selectedDistrictNames[key]),
                statsCategories = Object.keys(filter.statsCategories).filter(key => filter.statsCategories[key]),
                calculations = this.getCalculations(template).filter(calc => filter.calculations[calc.id]);

            if (_template.state.Maps?.layerIds) {
                _template.state.Maps.layerIds = activeLayerList;
            }
            if (_template.state.Tools.DistrictSelector?.selectedDistrictNames) {
                _template.state.Tools.DistrictSelector.selectedDistrictNames = selectedDistrictNames;
            }
            if (_template.state.Tools.Dashboard?.statsFeatureFilter) {
                _template.state.Tools.Dashboard.statsFeatureFilter = statsCategories;
            }
            if (_template.state.Tools.Dashboard?.calculations) {
                _template.state.Tools.Dashboard.calculations = calculations;
            }

            return _template;
        },

        loadFromTemplate (template, index) {
            template.meta.isActive = true;

            const _template = this.applyFilters(template, index),
                startingTool = template?.state?.Tools?.toolToOpen;

            if (this.useTemplatesForMapping) {
                this.createMappingByTemplates(this.templates, mapping);
            }

            this.loadSessionData(_template);
            this.setActive(false);
            this.openTool(startingTool);

        },

        /**
         * Opening a tool after loading the template
         * @param {String} startingTool - the starting tool to open after loading the template
         * @returns {void}
         */
        openTool (startingTool) {
            if (typeof startingTool === "string") {
                this.$store.dispatch("Tools/setToolActive", {id: startingTool, active: true});
            }
            else if (typeof this.toolToOpen === "string") {
                this.$store.dispatch("Tools/setToolActive", {id: this.toolToOpen, active: true});
            }
        },

        getActiveLayerList (template) {
            return this.flatLayerMapping
                .filter(layer => (template.state?.Maps?.layerIds || []).includes(layer.layerId));
        },

        getActiveTool (template) {
            const id = Object.entries(template.state.Tools).find(tool => tool[1].active)?.[0];

            return this.$store.getters[`Tools/${id}/name`];
        },

        getActiveDistrictLevel (template) {
            const layerId = template.state.Tools?.DistrictSelector?.selectedDistrictLevelId;

            return this.districtLevels.find(districtLevel => districtLevel.layerId === layerId)?.label;
        },

        getSelectedDistricts (template) {
            return template.state.Tools?.DistrictSelector?.selectedDistrictNames || [];
        },

        getStatsCategories (template) {
            return template.state.Tools?.Dashboard?.statsFeatureFilter || [];
        },

        getCalculations (template) {
            return template.state.Tools?.Dashboard?.calculations || [];
        },

        /**
         * Adds a template to the list of templates.
         * @param {Object} template - The template to add.
         * @returns {void}
         */
        addTemplate (template) {
            this.templates.push(template);
        },

        /*
         * Creates a new mapping based on the statistical data in the templates.
         * The name of the template is used as the name of the group.
         * @param {Object[]} templates - All available templates.
         * @param {Object[]} initMapping - The mapping array for statistical data.
         * @returns {void}
         */
        createMappingByTemplates (templates, initMapping) {
            const activeTemplates = templates.filter(template => template.meta.isActive),
                newMapping = [];

            activeTemplates.forEach(template => {
                if (template.state?.Tools?.Dashboard?.statsFeatureFilter) {
                    template.state.Tools.Dashboard.statsFeatureFilter.forEach(statName => {
                        const mappingObject = initMapping.find(obj => obj.value === statName);

                        if (mappingObject) {
                            newMapping.push({
                                "category": mappingObject.category,
                                "value": statName,
                                "group": template.meta.title,
                                "valueType": mappingObject.valueType,
                                "stat_gebiet": "112233"
                            });
                        }
                    });
                }
            });

            if (newMapping.length > 0) {
                this.setMapping(newMapping);
            }
        }
    }
};
</script>

<template lang="html">
    <Tool
        ref="tool"
        :title="$t('additional:modules.tools.cosi.templateManager.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template
            v-if="active"
            #toolBody
        >
            <v-app
                id="template-manager"
                class="clamp-40vw"
            >
                <ToolInfo
                    :url="readmeUrl"
                    :locale="currentLocale"
                    :summary="$t('additional:modules.tools.cosi.templateManager.infoLoadFromTemplates')"
                />
                <div>
                    <div class="mb-3">
                        <span class="text-subtitle-2">
                            {{ $t("additional:modules.tools.cosi.templateManager.loadFromTemplate") }}
                        </span>
                        <TemplateManagerImport
                            v-if="useImport"
                            class="float-end"
                            @addTemplate="addTemplate"
                        />
                    </div>
                    <v-list dense>
                        <v-list-group
                            v-for="(template, i) in templates"
                            :key="i"
                            color="primary"
                            :prepend-icon="template.meta.icon"
                            no-action
                        >
                            <template #activator>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ template.meta.title }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>

                            <v-list-item class="template">
                                <v-list-item-content class="no-flex">
                                    <v-row>
                                        <v-simple-table
                                            dense
                                        >
                                            <template #default>
                                                <tbody>
                                                    <tr>
                                                        <th v-text="$t('additional:modules.tools.cosi.templateManager.created')" />
                                                        <td v-text="template.meta.created" />
                                                    </tr>
                                                    <tr>
                                                        <th v-text="$t('additional:modules.tools.cosi.templateManager.info')" />
                                                        <td v-html="template.meta.info || $t('additional:modules.tools.cosi.templateManager.noInfo')" />
                                                    </tr>
                                                    <tr>
                                                        <th v-text="$t('additional:modules.tools.cosi.templateManager.layers')" />
                                                        <td>
                                                            <v-chip
                                                                v-for="layerMap in getActiveLayerList(template)"
                                                                :key="template.meta.title + layerMap.id"
                                                                class="ma-1"
                                                                small
                                                            >
                                                                {{ layerMap.id }}
                                                                <v-checkbox
                                                                    v-model="filters[i].activeLayerList[layerMap.layerId]"
                                                                    small
                                                                />
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="getActiveDistrictLevel(template)">
                                                        <th>
                                                            {{ $t("additional:modules.tools.cosi.templateManager.districtLevel") }}
                                                        </th>
                                                        <td>
                                                            {{ getActiveDistrictLevel(template) }}
                                                        </td>
                                                    </tr>
                                                    <tr v-if="getSelectedDistricts(template).length > 0">
                                                        <th>
                                                            {{ $t("additional:modules.tools.cosi.templateManager.selectedDistricts") }}
                                                        </th>
                                                        <td>
                                                            <v-chip
                                                                v-for="districtName in getSelectedDistricts(template)"
                                                                :key="template.meta.title + districtName"
                                                                class="ma-1"
                                                                small
                                                            >
                                                                {{ districtName }}
                                                                <v-checkbox
                                                                    v-model="filters[i].selectedDistrictNames[districtName]"
                                                                    small
                                                                />
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="getStatsCategories(template).length > 0">
                                                        <th v-text="$t('additional:modules.tools.cosi.templateManager.categories')" />
                                                        <td>
                                                            <v-chip
                                                                v-for="category in getStatsCategories(template)"
                                                                :key="template.meta.title + category"
                                                                class="ma-1"
                                                                small
                                                            >
                                                                {{ category }}
                                                                <v-checkbox
                                                                    v-model="filters[i].statsCategories[category]"
                                                                    small
                                                                />
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="getCalculations(template).length > 0">
                                                        <th v-text="$t('additional:modules.tools.cosi.templateManager.calculations')" />
                                                        <td>
                                                            <v-chip
                                                                v-for="(calculation, j) in getCalculations(template)"
                                                                :key="template.meta.title + 'calculation' + j"
                                                                class="ma-1"
                                                                small
                                                            >
                                                                {{ calculation.id }}
                                                                <v-checkbox
                                                                    v-model="filters[i].calculations[calculation.id]"
                                                                    small
                                                                />
                                                            </v-chip>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="getActiveTool(template)">
                                                        <th>
                                                            {{ $t("additional:modules.tools.cosi.templateManager.activeTool") }}
                                                        </th>
                                                        <td>
                                                            {{ getActiveTool(template) }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </template>
                                        </v-simple-table>
                                    </v-row>
                                    <v-divider />
                                    <v-row justify="end">
                                        <v-col>
                                            <button
                                                class="btn btn-outline lh-1 fs-5 mb-3"
                                                @click="loadFromTemplate(template, i)"
                                            >
                                                <i class="bi bi-upload pe-2" />{{ $t("additional:modules.tools.cosi.templateManager.loadFromTemplate") }}
                                            </button>
                                        </v-col>
                                    </v-row>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </div>
            </v-app>
        </template>
    </Tool>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #template-manager {
        font-family: $font_family_default;

        .btn-outline {
            border-color: $light_blue;
            color: $light_blue;
        }
       .btn-outline:hover {
            cursor: pointer;
            background-color: $light_blue;
            color: $white;
       }

       th {
            font-family: $font_family_accent;
       }
    }

    .info-table {
        max-width: 640px;
    }
    .clamp-40vw .v-list-group--no-action >.v-list-group__items >.v-list-item.template {
        padding-left: 0;
    }
    .no-flex {
        display: block;
    }
</style>
