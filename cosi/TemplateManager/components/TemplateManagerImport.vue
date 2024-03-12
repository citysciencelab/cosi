<script>
import {mapGetters, mapActions} from "vuex";
import getters from "../store/gettersTemplateManager";

export default {
    name: "TemplateManagerImport",
    computed: {
        ...mapGetters("Tools/TemplateManager", Object.keys(getters))
    },
    methods: {
        ...mapActions("Alerting", ["addSingleAlert"]),

        /**
         * Triggers the click event on the file input to open the explorer.
         * @returns {void}
         */
        triggerFileInput () {
            this.$el.querySelector("#file-input").click();
        },

        /**
         * Loading the data from files.
         * @param {Event} evt - A input change event.
         * @returns {void}
         */
        loadFiles (evt) {
            for (const file of evt.target.files) {
                if (!file.type.match("application/json")) {
                    this.addSingleAlert({
                        content: `${file.name}: ${this.$t("additional:modules.tools.cosi.templateManager.errors.wrongFileFormat")}`,
                        category: "Warning",
                        displayClass: "warning"
                    });
                    continue;
                }
                const reader = new FileReader();

                reader.onload = this.parseFileContent;
                reader.readAsText(file);
            }
            this.$refs.form.reset();
        },

        /**
         * Parses the file content to JSON and emits it.
         * @param {Event} evt - A file reader load event.
         * @returns {void}
         */
        parseFileContent (evt) {
            let template = {};

            try {
                template = JSON.parse(evt?.target?.result);
            }
            catch (err) {
                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }

            if (!Object.prototype.hasOwnProperty.call(template, "meta")) {
                const attribute = "Meta";

                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")} ${this.$t("additional:modules.tools.cosi.templateManager.errors.attErr", {attribute})}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }
            if (!Object.prototype.hasOwnProperty.call(template?.meta, "title")) {
                const attribute = "Title";

                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")} ${this.$t("additional:modules.tools.cosi.templateManager.errors.attErr", {attribute})}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }
            if (!Object.prototype.hasOwnProperty.call(template, "state")) {
                const attribute = "State";

                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")} ${this.$t("additional:modules.tools.cosi.templateManager.errors.attErr", {attribute})}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }
            if (!Object.prototype.hasOwnProperty.call(template?.state, "Tools")) {
                const attribute = "Tools";

                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")} ${this.$t("additional:modules.tools.cosi.templateManager.errors.attErr", {attribute})}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }
            if (!Object.prototype.hasOwnProperty.call(template?.state?.Tools, "Dashboard")) {
                const attribute = "Dashboard";

                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")} ${this.$t("additional:modules.tools.cosi.templateManager.errors.attErr", {attribute})}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }
            if (!Object.prototype.hasOwnProperty.call(template?.state?.Tools?.Dashboard, "statsFeatureFilter")) {
                const attribute = "statsFeatureFilter";

                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")} ${this.$t("additional:modules.tools.cosi.templateManager.errors.attErr", {attribute})}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                return;
            }

            if (Array.isArray(this.importedTemplateNames) && this.importedTemplateNames.includes(template?.meta?.title)) {
                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.templateName")} ${template?.meta?.title} ${this.$t("additional:modules.tools.cosi.templateManager.errors.isLoaded")}`,
                    category: "Warning",
                    displayClass: "warning"
                });

                return;
            }
            this.importedTemplateNames.push(template?.meta?.title);

            this.$emit("addTemplate", template);
        }
    }
};
</script>

<template lang="html">
    <div id="template-manager-import">
        <button
            class="btn btn-outline lh-1 fs-5 mb-3"
            @click="triggerFileInput"
        >
            <i class="bi bi-upload pe-2" />{{ $t("additional:modules.tools.cosi.templateManager.importTemplate") }}
        </button>
        <form ref="form">
            <label for="file-input">
                <input
                    id="file-input"
                    type="file"
                    multiple
                    class="d-none"
                    @change="loadFiles"
                >
            </label>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #template-manager-import {
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

       form {
            height: 0;
       }
    }

</style>
