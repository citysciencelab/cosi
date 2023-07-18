<script>
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import {getComponent} from "../../../src/utils/getComponent";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersSessionTool";
import mutations from "../store/mutationsSessionTool";
import isObject from "../../../src/utils/isObject";
import {downloadBlobPerHTML5, downloadBlobPerNavigator} from "../../../src/share-components/exportButton/utils/exportButtonUtils.js";

import {register as registerMap} from "../observer/MapObserver";
import {register as registerLayers} from "../observer/LayerObserver";
import {register as registerFilter} from "../observer/FilterObserver";
import {register as registerDraw} from "../observer/DrawObserver";

export default {
    name: "SessionTool",
    components: {
        ToolTemplate
    },
    data () {
        return {
            storePath: this.$store.state.Tools.SessionTool,
            fileName: ""
        };
    },
    computed: {
        ...mapGetters("Tools/SessionTool", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
        registerMap(this.$store);
        registerLayers(this.$store);
        registerFilter(this.$store);
        registerDraw(this.$store);
    },
    methods: {
        ...mapMutations("Tools/SessionTool", Object.keys(mutations)),
        close () {
            this.setActive(false);
            const model = getComponent(this.storePath.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Upload selected file.
         * @param {Event} event the native upload event
         * @returns {void}
         */
        async uploadFile (event) {
            const file = event.target.files.item(0),
                fileReader = new FileReader();

            fileReader.onload = (evt) => this.onFileLoad(evt.target.result);

            if (file) {
                fileReader.readAsText(file);
                this.fileName = file?.name ? file.name : "";
            }
        },
        /**
         * Onload function for the FileReader.
         * @param {String} fileContent The file content as string.
         * @returns {void}
         */
        onFileLoad (fileContent) {
            let json;

            try {
                json = JSON.parse(fileContent);
            }
            catch (e) {
                console.warn("Trying to parse given string into a json", json);
                this.$store.dispatch("Alerting/addSingleAlert", i18next.t("additional:modules.tools.sessionTool.errorOnLoad"));
            }
            if (!isObject(json?.state)) {
                return;
            }
            this.observer.forEach(({key, setter}) => {
                if (typeof setter !== "function") {
                    return;
                }

                Object.entries(json.state).forEach(async ([jsonKey, value]) => {
                    if (jsonKey === key) {
                        await setter(value, json.state);
                    }
                });
            });
            this.close();
        },
        /**
         * Creates a file based on given blob.
         * @param {Blob} blob the blob to create the file on
         * @param {String} fileName the file name
         * @returns {void}
         */
        createFile (blob, fileName) {
            const succeed = downloadBlobPerNavigator(blob, fileName);

            if (!succeed) {
                downloadBlobPerHTML5(blob, fileName);
            }
        },
        /**
         * Downloads a file.
         * @param {Object[]} observer the observer array from state
         * @returns {void}
         */
        async downloadFile (observer) {
            const copyObject = {
                state: {}
            };

            if (!Array.isArray(observer)) {
                return;
            }

            for (let index = 0; index < observer.length; index++) {
                if (typeof observer[index]?.getter !== "function") {
                    continue;
                }
                const result = await observer[index].getter();

                copyObject.state[observer[index].key] = result;
            }
            this.createFile(new Blob([JSON.stringify(copyObject)], {type: "application/json;"}), "session.masterportal");
        },
        /**
         * Triggers a click event on the hidden button to trigger the upload.
         * @returns {void}
         */
        triggerUpload () {
            if (this.$refs.fileInput) {
                this.$refs.fileInput.click();
            }
        }
    }
};
</script>

<template>
    <ToolTemplate
        :title="$t(name)"
        icon="bi-funnel-fill"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div class="session-tool">
                <div class="card">
                    <div class="card-header">
                        {{ $t('additional:modules.tools.sessionTool.uploadHeader') }}
                    </div>
                    <div class="card-body">
                        <input
                            ref="fileInput"
                            class="d-none"
                            :aria-hidden="true"
                            type="file"
                            name="fileUpload"
                            @change="uploadFile"
                        >
                        <input
                            id="fileUpload"
                            type="button"
                            class="btn btn-primary"
                            :aria-label="$t('additional:modules.tools.sessionTool.buttonTextUpload')"
                            :value="$t('additional:modules.tools.sessionTool.buttonTextUpload')"
                            @click="triggerUpload"
                        >
                        <span class="ms-2">{{ fileName }}</span>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-header">
                        {{ $t('additional:modules.tools.sessionTool.downloadHeader') }}
                    </div>
                    <div class="card-body">
                        <input
                            id="fileDownload"
                            class="btn btn-primary"
                            type="button"
                            :value="$t('additional:modules.tools.sessionTool.buttonTextDownload')"
                            @click.prevent="downloadFile(observer)"
                        >
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>
