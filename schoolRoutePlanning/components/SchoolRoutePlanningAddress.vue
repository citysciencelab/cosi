<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import getters from "../store/gettersSchoolRoutePlanning";
import actions from "../store/actionsSchoolRoutePlanning";
import mutations from "../store/mutationsSchoolRoutePlanning";

export default {
    name: "SchoolRoutePlanningAddress",
    props: {
        layer: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Tools/SchoolRoutePlanning", Object.keys(getters)),
        /**
         * Getter and setter for the input address.
         */
        inputAddress: {
            /**
             * Gets the input address from the vuex state.
             * @returns {String} The input address.
             */
            get () {
                if (this.$refs.input) {
                    this.$refs.input.focus();
                }

                return this.$store.state.Tools.SchoolRoutePlanning.inputAddress;
            },
            /**
             * Sets the input address to the vuex state.
             * @param {String} value The input address.
             * @returns {void}
             */
            set (value) {
                this.setInputAddress(value);
            }
        }
    },
    methods: {
        ...mapMutations("Tools/SchoolRoutePlanning", Object.keys(mutations)),
        ...mapActions("Tools/SchoolRoutePlanning", Object.keys(actions))
    }

};
</script>

<template>
    <div class="mb-3 position-relative">
        <label
            for="tool-schoolRoutePlanning-search-address"
            class="form-label"
        >
            {{ $t('additional:modules.tools.schoolRoutePlanning.inputLabel') }}
        </label>
        <input
            id="tool-schoolRoutePlanning-search-address"
            ref="input"
            v-model="inputAddress"
            type="search"
            autocomplete="false"
            class="form-control"
            @keyup="(evt) => processInput({evt, layer})"
        >
        <template
            v-if="streetNames.length > 0 && inputAddress !== ''"
        >
            <ul
                class="list-group address-list w-100"
            >
                <template v-if="streetNames.length > 1">
                    <li
                        v-for="streetName in streetNames"
                        :key="streetName"
                        tabindex="0"
                        class="list-group-item"
                        @click="searchHousenumbers({streetName, eventType: 'click'})"
                        @keyup.enter.stop="searchHousenumbers({streetName, eventType: 'click'})"
                    >
                        {{ streetName }}
                    </li>
                </template>
                <template v-else>
                    <li
                        v-for="houseNumber in filteredHouseNumbers"
                        :key="houseNumber.name"
                        tabindex="0"
                        class="list-group-item"
                        @click="findHouseNumber({input: houseNumber.name, layer})"
                        @keyup.enter.stop="findHouseNumber({input: houseNumber.name, layer})"
                    >
                        {{ houseNumber.name }}
                    </li>
                </template>
            </ul>
        </template>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.address-list {
    position: absolute;
    z-index: 3;
    overflow-y: auto;
    max-height: calc((18px + 16px) * 5 + 6px); // height and padding of five <li> and six borders

    li {
        &:hover, &:focus {
            cursor: pointer;
            background-color: $secondary;
        }
    }
}
</style>
