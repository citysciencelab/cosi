<script>
import {mapActions} from "vuex";
import componentExists from "../../../../../src/utils/componentExists.js";

export default {
    name: "TargetSchoolIcon",
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            id: "schoolRoutePlanning"
        };
    },
    methods: {
        ...mapActions("Tools", ["setToolActive"]),
        ...mapActions("Tools/SchoolRoutePlanning", ["selectInitializeSchoolNumber"]),
        componentExists,

        /**
         * Sets the schulwegrouting tool active,
         * takes over the school for the routing and close the gfi.
         * @param {Event} event The click or keydown event.
         * @returns {void}
         */
        takeRoute: function (event) {
            const id = this.feature.getProperties().schul_id,
                name = `${this.feature.getProperties().schulname}, ${this.feature.getProperties().adresse_strasse_hausnr}`;

            Radio.trigger("ModelList", "setModelAttributesById", this.id, {isActive: true});
            this.setToolActive({id: this.id, active: true});
            this.selectInitializeSchoolNumber({id, name});
            this.$parent.$parent.close(event);
        }
    }
};
</script>

<template>
    <span
        v-if="componentExists(id)"
        class="bootstrap-icon"
        :title="$t('additional:modules.tools.gfi.themes.schulinfo.favoriteicons.adoptedTargetSchool')"
        role="button"
        tabindex="0"
        @click="takeRoute"
        @keydown.enter="takeRoute"
    >
        <i class="bi-geo-alt-fill" />
    </span>
</template>

<style lang="scss" scoped>
@import "~/css/mixins.scss";

span.bootstrap-icon {
    &:focus {
        @include primary_action_focus;
    }
    &:hover {
        @include primary_action_hover;
    }
}
</style>
