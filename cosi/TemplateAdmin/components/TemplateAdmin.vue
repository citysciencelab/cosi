<script>
import ToolTemplate from "../../../../src/modules/tools/ToolTemplate.vue";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersTemplateAdmin";
import mutations from "../store/mutationsTemplateAdmin";
import {getComponent} from "../../../../src/utils/getComponent";

export default {
    name: "TemplateAdmin",
    components: {
        ToolTemplate
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
    >
        <template #toolBody>
            Das ist dsm template admin Component
        </template>
    </ToolTemplate>
</template>
