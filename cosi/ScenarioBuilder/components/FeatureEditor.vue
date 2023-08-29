<script>
import {mapGetters} from "vuex";
import Modal from "../../../../src/share-components/modals/components/ModalItem.vue";
import {unpackCluster} from "../../utils/features/unpackCluster";
import beautifyKey from "../../../../src/utils/beautifyKey";
import ToolInfo from "../../components/ToolInfo.vue";

export default {
    name: "FeatureEditor",
    components: {
        Modal,
        ToolInfo
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        editDialog: false,
        editModal: false,
        featureSelectionList: [],
        featureSelectionModal: false,
        panel: [0],
        selectedFeature: {
            layerMap: null,
            properties: null,
            feature: null
        },
        noScenarioWarning: false,
        confirmDialog: false,
        lock: true,
        confirmText: "",
        confirmAction: {
            function: () => null,
            text: ""
        },
        subReadMeUrl: {
            "de-DE": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/010einrichtungenbearbeiten.md",
            "en-US": "https://bitbucket.org/geowerkstatt-hamburg/addons/src/dev/cosi/manuals/010featureeditor.md"
        }
    }),
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Maps", ["getLayerById"]),
        ...mapGetters("Tools/FeaturesList", ["activeVectorLayerList", "layerMapById"]),
        ...mapGetters("Tools/ScenarioBuilder", ["activeScenario"]),
        /**
         * gets the 2D map from the collection
         * @returns {module:ol/Map} the 2D map
         */
        map () {
            return mapCollection.getMap("2D");
        },
        isSimulation () {
            return this.selectedFeature.properties?.isSimulation;
        },
        isModified () {
            return this.selectedFeature.properties?.isModified;
        }
    },
    created () {
        mapCollection.getMap("2D").addEventListener("click", this.openEditDialog.bind(this));
        this.confirmText = this.$t("additional:modules.tools.cosi.featureEditor.noScenarioconfirmDeleteWarning");
    },
    methods: {
        openEditDialog (evt) {
            // escape if the feature editor has been disabled from the outside
            if (this.disabled) {
                return;
            }

            this.reset();

            mapCollection.getMap("2D").forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                for (const _feature of unpackCluster(feature)) {
                    this.featureSelectionList.push({
                        layerMap: this.layerMapById(layer.get("id")),
                        feature: _feature,
                        properties: _feature.getProperties()
                    });
                }
            }, {
                layerFilter: l => {
                    return this.activeVectorLayerList.includes(l);
                }
            });

            if (this.featureSelectionList.length === 1) {
                this.selectedFeature.layerMap = this.featureSelectionList[0].layerMap;
                this.selectedFeature.feature = this.featureSelectionList[0].feature;
                this.selectedFeature.properties = this.featureSelectionList[0].properties;
            }
            if (this.featureSelectionList.length > 0) {
                if (this.activeScenario) {
                    this.editDialog = true;
                }
                else {
                    this.noScenarioWarning = true;
                }
            }
        },

        editFeature () {
            if (this.selectedFeature.properties) {
                this.editModal = true;
            }
            else {
                this.featureSelectionModal = true;
            }
            this.editDialog = false;
        },

        editProp (v, prop) {
            const _v = v?.match(/^[0-9,.]{1,}$/) ? parseFloat(v.replace(",", ".")) : v;

            this.selectedFeature.properties[prop] = _v;
        },

        deleteSelectedFeature () {
            this.activeScenario.removeSimulatedFeature(this.selectedFeature.feature);
            this.reset();
        },

        reset () {
            this.selectedFeature.properties = null;
            this.selectedFeature.feature = null;
            this.selectedFeature.layerMap = null;
            this.editDialog = false;
            this.editModal = false;
            this.confirmDialog = false;
            this.lock = true;
            this.featureSelectionList = [];
            this.featureSelectionModal = false;
        },

        updateSelectedFeature () {
            const layer = this.getLayerById({layerId: this.selectedFeature.layerMap.layerId});

            this.activeScenario.modifyFeature(this.selectedFeature.feature, this.selectedFeature.properties, layer);
            this.reset();
        },

        resetSelectedFeature () {
            this.activeScenario.resetFeature(this.selectedFeature.feature, undefined, true);
            this.reset();
        },

        isObject (val) {
            return typeof val === "object";
        },

        onDelete () {
            this.confirmDialog = true;
            this.confirmText = this.$t("additional:modules.tools.cosi.featureEditor.confirmDelete");
            this.confirmAction.function = this.deleteSelectedFeature;
            this.confirmAction.text = this.$t("common:button.delete");
        },

        onReset () {
            this.confirmDialog = true;
            this.confirmText = this.$t("additional:modules.tools.cosi.featureEditor.confirmReset");
            this.confirmAction.function = this.resetSelectedFeature;
            this.confirmAction.text = this.$t("common:button.reset");
        },

        beautifyKey,

        setSelectedFeature (featureToEdit) {
            this.selectedFeature.layerMap = featureToEdit.layerMap;
            this.selectedFeature.feature = featureToEdit.feature;
            this.selectedFeature.properties = featureToEdit.properties;
            this.$nextTick(() => {
                this.featureSelectionModal = false;
                this.editModal = true;
            });
        }
    }
};
</script>

<template>
    <v-app>
        <v-snackbar
            v-model="confirmDialog"
            :timeout="-1"
            color="white"
            light
            centered
        >
            {{ confirmText }}

            <template #action="{ attrs }">
                <v-btn
                    v-bind="attrs"
                    text
                    @click="confirmAction.function"
                >
                    {{ confirmAction.text }}
                </v-btn>
                <v-btn
                    text
                    v-bind="attrs"
                    @click="confirmDialog = false"
                >
                    {{ $t('common:button.cancel') }}
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar
            v-model="noScenarioWarning"
            :timeout="3000"
            color="grey lighten-1"
        >
            {{ $t('additional:modules.tools.cosi.featureEditor.noScenarioWarning') }}

            <template #action="{ attrs }">
                <v-btn
                    text
                    v-bind="attrs"
                    @click="noScenarioWarning = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar
            v-model="editDialog"
            :timeout="8000"
            color="primary lighten-1"
        >
            {{ $t('additional:modules.tools.cosi.featureEditor.editFeature') }}

            <template #action="{ attrs }">
                <v-btn
                    v-if="isSimulation"
                    v-bind="attrs"
                    text
                    @click="onDelete"
                >
                    {{ $t("common:button.delete") }}
                </v-btn>
                <v-btn
                    v-bind="attrs"
                    text
                    @click="editFeature"
                >
                    {{ $t("common:button.edit") }}
                </v-btn>
                <v-btn
                    v-if="isModified"
                    v-bind="attrs"
                    text
                    @click="onReset"
                >
                    {{ $t("common:button.reset") }}
                </v-btn>
                <v-btn
                    text
                    v-bind="attrs"
                    @click="editDialog = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
        <Modal
            :show-modal="featureSelectionModal"
            @clickedOnX="reset"
            @clickedOutside="reset"
        >
            <v-app>
                <v-simple-table dense>
                    <template #default>
                        <thead>
                            <tr class="header-row">
                                <th>Einrichtung</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(feature, index) in featureSelectionList"
                                :key="index"
                                class="selectable-row"
                                @click="setSelectedFeature(feature)"
                            >
                                <th>{{ feature.layerMap.id }}</th>
                                <td>{{ feature.feature.get(feature.layerMap.keyOfAttrName) }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-app>
        </Modal>
        <Modal
            v-if="selectedFeature.properties"
            :show-modal="editModal"
            @modalHid="reset"
            @clickedOnX="reset"
            @clickedOutside="reset"
        >
            <v-app>
                <v-container>
                    <v-subheader>
                        {{ $t("additional:modules.tools.cosi.featureEditor.editFeature") }}
                    </v-subheader>
                    <ToolInfo :url="subReadMeUrl[currentLocale]" />
                    <v-card-title primary-title>
                        {{ selectedFeature.properties[selectedFeature.layerMap.keyOfAttrName] }}
                    </v-card-title>
                    <v-card-subtitle>
                        {{ selectedFeature.layerMap.id }} | {{ selectedFeature.layerMap.group }}
                        <v-btn
                            v-if="!isSimulation"
                            :title="lock ? $t('additional:modules.tools.cosi.moveFeatures.toggleOnlySimulatedTooltip') : $t('additional:modules.tools.cosi.moveFeatures.toggleOnlySimulatedOffTooltip')"
                            dense
                            small
                            tile
                            class="float-right"
                            :color="lock ? 'grey lighten-1' : 'warning'"
                            @click="lock = !lock"
                        >
                            <span>
                                <v-icon>{{ lock ? 'mdi-lock' : 'mdi-lock-open' }}</v-icon>
                            </span>
                        </v-btn>
                    </v-card-subtitle>
                    <div class="stats-table-modal">
                        <v-row
                            v-for="(val, key) in selectedFeature.properties"
                            :key="key"
                            dense
                        >
                            <template v-if="!isObject(val) && key !== 'isSimulation' && key !== 'isModified'">
                                <v-col cols="3">
                                    <v-subheader :title="beautifyKey(key)">
                                        {{ beautifyKey(key) }}
                                    </v-subheader>
                                </v-col>
                                <v-col cols="9">
                                    <v-switch
                                        v-if="typeof val === 'boolean'"
                                        :value="val"
                                        dense
                                        :hide-details="true"
                                        :disabled="!isSimulation && lock"
                                        @change="editProp($event, key)"
                                    />
                                    <v-text-field
                                        v-else
                                        :value="val"
                                        :name="key"
                                        :title="val"
                                        dense
                                        :disabled="!isSimulation && lock"
                                        @change="editProp($event, key)"
                                    />
                                </v-col>
                            </template>
                        </v-row>
                    </div>
                    <v-card-actions>
                        <v-btn
                            dense
                            small
                            tile
                            color="primary"
                            :title="$t('additional:modules.tools.cosi.featureEditor.update')"
                            @click="updateSelectedFeature"
                        >
                            <v-icon>mdi-pencil</v-icon>
                            <span>
                                {{ $t('additional:modules.tools.cosi.featureEditor.update') }}
                            </span>
                        </v-btn>
                        <v-btn
                            dense
                            small
                            tile
                            color="primary"
                            :disabled="!isModified"
                            :title="$t('additional:modules.tools.cosi.featureEditor.reset')"
                            @click="resetSelectedFeature"
                        >
                            <v-icon>mdi-undo</v-icon>
                            <span>
                                {{ $t('additional:modules.tools.cosi.featureEditor.reset') }}
                            </span>
                        </v-btn>
                        <v-btn
                            dense
                            small
                            tile
                            color="grey lighten-1"
                            :title="$t('common:button.cancel')"
                            @click="reset"
                        >
                            <v-icon>mdi-close</v-icon>
                            <span>
                                {{ $t('common:button.cancel') }}
                            </span>
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-app>
        </Modal>
    </v-app>
</template>

<style lang="scss" scoped>
    .flex {
        display: flex;
        .flex-item {
            margin: 0 2px 0 2px;
        }
    }
    .stats-table-modal {
        height: 65vh;
        overflow-y: scroll;
        overflow-x: hidden;
        min-width: 34vw;
        margin-bottom: 20px;
        .v-text-field {
            font-size: 12px;
        }
    }

    .selectable-row {
        cursor: pointer;
    }

</style>
