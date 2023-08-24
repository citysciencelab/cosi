<script>
import {mapState} from "vuex";
import {highlightSelectedLocationOnMap} from "../utils/highlightSelectedLocationOnMap";

export default {
    name: "DashboardTabs",
    props: {
        tabItems: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data () {
        return {
            currentTabIndex: 0
        };
    },
    computed: {
        ...mapState("Tools/VpiDashboard", ["selectedLocationId"]),
        tabItemsComputed () {
            return this.tabItems;
        }
    },
    watch: {
        currentTabIndex () {
            highlightSelectedLocationOnMap(this.selectedLocationId, "clear");
            this.$store.commit("Tools/VpiDashboard/setSelectLocationBInMap", false);
        }
    },
    methods: {
        /**
         * reacts on the change of tab in the dashboard
         * @param {Integer} index number of selected tab
         * @returns {void}
         */
        selectTab (index) {
            this.tabItemsComputed.forEach(tab => {
                if (tab.index === index) {
                    tab.selected = true;
                    this.currentTabIndex = tab.index;
                }
                else {
                    tab.selected = false;
                }
            });
        }
    }
};
</script>

<template>
    <div id="vpiDashboard-tabs">
        <ul class="nav nav-tabs">
            <li
                v-for="(tab, index) in tabItemsComputed"
                :key="index"
                class="nav-item"
            >
                <a
                    class="nav-link"
                    :class="{ active: tab.selected }"
                    role="button"
                    tabindex="0"
                    @click="selectTab(tab.index)"
                    @keydown="selectTab(tab.index)"
                >{{ tab.name }}</a>
            </li>
        </ul>
        <div :class="`tab-content-` + currentTabIndex">
            <slot :name="`tab-content-` + currentTabIndex" />
        </div>
    </div>
</template>

<style scoped>
.nav{
  margin-bottom:1rem;
}
.nav-item{
  cursor: pointer;
  color:black;
  font-size: 0.7rem;
}

.nav-item .nav-link{
  color:gray;
}
</style>
