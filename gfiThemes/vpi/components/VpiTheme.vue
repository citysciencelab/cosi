<script>
export default {
    name: "VpiTheme",
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    computed: {
        attributes: function () {
            return this.feature.getMappedProperties();
        }
    },
    watch: {
        feature (value, oldValue) {
            if (value.ID !== oldValue.ID) {
                this.updateSelectedLocationId();
            }
        }
    },
    async mounted () {

        if (!this.$store.getters["Tools/VpiDashboard/active"]) {
            await this.$store.commit("Tools/VpiDashboard/setActive", true);
        }
        this.updateSelectedLocationId();
    },
    methods: {
        /**
         * Updates the selected location ID for VPI dashboard.
         * @returns {void}
         */
        updateSelectedLocationId: function () {
            const locationID = this.feature.getMappedProperties().ID,
                source = "map";

            this.$store.commit("Tools/VpiDashboard/setSelectedLocationId", {locationID, source});
        }
    }
};
</script>

<template>
    <div class="vpi-theme">
        <table class="vpi-theme-table">
            <tbody>
                <tr
                    v-for="(key, idx) in Object.keys(attributes)"
                    :key="idx"
                >
                    <td> {{ key }} </td>
                    <td> {{ attributes[key] }}  </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
  .vpi-theme {
    table td {
      padding: 5px;
    }
  }

</style>
