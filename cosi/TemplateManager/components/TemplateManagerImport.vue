<script>
import {mapActions} from "vuex";

export default {
    name: "TemplateManagerImport",
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
        },

        /**
         * Parses the file content to JSON and emits it.
         * @param {Event} evt - A file reader load event.
         * @returns {void}
         */
        parseFileContent (evt) {
            try {
                const template = JSON.parse(evt.target.result);

                this.$emit("addTemplate", template);
            }
            catch (err) {
                this.addSingleAlert({
                    content: `${this.$t("additional:modules.tools.cosi.templateManager.errors.invalid")}`,
                    category: "Warning",
                    displayClass: "warning"
                });
                console.error(err);
            }
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
        <label for="file-input">
            <input
                id="file-input"
                type="file"
                multiple
                class="d-none"
                @change="loadFiles"
            >
        </label>
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
    }

</style>
