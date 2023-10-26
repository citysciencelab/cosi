<script>
import ToolTemplate from "../../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersTemplateAdmin";
import mutations from "../store/mutationsTemplateAdmin";
import {getComponent} from "../../../../src/utils/getComponent";
import TemplateAdminForm from "./TemplateAdminForm.vue";

export default {
    name: "TemplateAdmin",
    components: {
        ToolTemplate,
        TemplateAdminForm
    },
    data () {
        return {
            dataOptions: ["Select option", "options", "selected", "multiple", "label", "searchable", "clearOnSelect", "hideSelected", "maxHeight", "allowEmpty", "showLabels", "onChange", "touched"],
            statOptions: ["data1", "data2", "data3"],
            toolOptions: ["tool1", "tool2", "tool3"],
            currentTab: "#add-template-tab"
        };
    },
    computed: {
        ...mapGetters("Tools/TemplateAdmin", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
    },

    methods: {
        ...mapMutations("Tools/TemplateAdmin", Object.keys(mutations)),

        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :focus-to-close-icon="true"
        :initial-width="500"
        class="template-admin"
    >
        <template #toolBody>
            <div class="container">
                <div
                    class="decription mb-2"
                >
                    {{ $t("additional:modules.tools.cosi.templateAdmin.description") }}
                </div>
                <!-- Nav tabs -->
                <ul
                    id="templateTabs"
                    class="nav nav-tabs"
                    role="tablist"
                >
                    <li
                        class="nav-item"
                        role="presentation"
                    >
                        <button
                            id="add-template-tab"
                            :class="currentTab === '#add-template-tab' ? 'active' : ''"
                            class="nav-link"
                            data-bs-toggle="tab"
                            data-bs-target="#add-template"
                            type="button"
                            role="tab"
                            aria-controls="add-template"
                            aria-selected="true"
                            @click="currentTab = '#add-template-tab'"
                        >
                            <i class="bi bi-plus-square" />
                            {{ $t("additional:modules.tools.cosi.templateAdmin.button.addTemplate") }}
                        </button>
                    </li>
                    <li
                        class="nav-item"
                        role="presentation"
                    >
                        <button
                            id="edit-template-tab"
                            :class="currentTab === '#edit-template-tab' ? 'active' : ''"
                            class="nav-link"
                            data-bs-toggle="tab"
                            data-bs-target="#edit-template"
                            type="button"
                            role="tab"
                            aria-controls="edit-template"
                            aria-selected="false"
                            @click="currentTab = '#edit-template-tab'"
                        >
                            <i class="bi bi-pencil-square" />
                            {{ $t("additional:modules.tools.cosi.templateAdmin.button.editTemplate") }}
                        </button>
                    </li>
                </ul>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div
                        id="add-template"
                        :class="currentTab === '#add-template-tab' ? 'active' : ''"
                        class="tab-pane"
                        role="tabpanel"
                        aria-labelledby="add-template-tab"
                        tabindex="0"
                    >
                        <TemplateAdminForm
                            :geo-data="dataOptions"
                            :stat-data="statOptions"
                            :tool-data="toolOptions"
                        />
                    </div>
                    <div
                        id="edit-template"
                        :class="currentTab === '#edit-template-tab' ? 'active' : ''"
                        class="tab-pane"
                        role="tabpanel"
                        aria-labelledby="edit-template-tab"
                        tabindex="0"
                    >
                        <TemplateAdminForm
                            :geo-data="dataOptions"
                            :stat-data="statOptions"
                            :show-edit-template="true"
                        />
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
@import "~variables";

.nav-tabs .nav-link.active {
    color: $light_blue;
    font-family: "MasterPortalFont Bold";
    background-color: white;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.nav-tabs, .nav-link  {
    background-color: #F3F3F3;
    color: $secondary_icon_button;

}

</style>
