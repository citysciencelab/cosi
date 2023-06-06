<script>
import {mapMutations} from "vuex";

export default {
    name: "EditForReportTemplate",
    props: {
        "reportTemplateMode": {type: Number, required: false, default: null},
        "toolName": {type: String, required: false, default: ""},
        "instructions": {type: String, required: false, default: "Wählen Sie die für Ihre Analyse notwendigen Datenlayer aus dem Themenbaum aus. Geben Sie dann alle gewünschten Einstellungen hier ein. Drücken Sie auf übernehmen, um die Einstellungen in das Report Template zu übernehmen."}
    },
    data () {
        return {};
    },
    methods: {
        ...mapMutations("Tools/ReportTemplates", ["finishEditingToolSettings", "abortEditingToolSettings"])
    }
};
</script>

<template>
    <v-card
        v-if="!(reportTemplateMode===null)"
        variant="tonal"
        color="grey lighten-3"
        width="400px"
        class="mt-3 mb-3"
    >
        <v-card-title>Tool für Report Template Einstellen</v-card-title>
        {{ instructions }}
        <v-card-text />
        <v-card-actions>
            <v-btn
                dense
                small
                tile
                color="grey lighten-1"
                @click="abortEditingToolSettings(toolName)"
            >
                abbrechen
            </v-btn>
            <v-btn
                dense
                small
                tile
                color="light green"
                @click="finishEditingToolSettings(toolName)"
            >
                übernehmen
            </v-btn>
        </v-card-actions>
    </v-card>
</template>


