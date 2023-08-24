<script>
import {mapActions} from "vuex";
export default {
    name: "EditForReportTemplate",
    props: {
        "reportTemplateMode": {type: Number, required: false, default: null},
        "toolName": {type: String, required: false, default: ""},
        "instructions": {type: String, required: false, default: "Wählen Sie die für Ihre Analyse notwendigen Datenlayer aus dem Themenbaum aus. Geben Sie dann alle gewünschten Einstellungen hier ein. Drücken Sie auf übernehmen, um die Einstellungen in das Report Template zu übernehmen."}
    },
    data () {
        return {
            settingsIssues: [] // any problems with the current settings?
        };
    },
    computed: {
        validationStatus () {
            if (this.settingsIssues.length === 0) {
                return "noSettingsIssues";
            }
            return "hasSettingsIssues";
        }
    },
    methods: {
        ...mapActions("Tools/ReportTemplates", ["finishEditingToolSettings", "abortEditingToolSettings"]),
        stopEditing () {
            const finishEditingValidationResult = this.finishEditingToolSettings(this.toolName);

            finishEditingValidationResult.then((validation)=>{
                if (!validation.success) {
                    this.settingsIssues = validation.individualMessages;
                }
                else {
                    this.settingsIssues = [];
                }
            });

        }

    }
};
</script>

<template>
    <v-card
        v-if="!(reportTemplateMode===null)"
        variant="tonal"
        width="400px"
        class="mt-3 mb-3"
    >
        <v-card-title>Tool für Report Template Einstellen</v-card-title>
        {{ instructions }}
        <br>

        <ul :class="validationStatus">
            <li
                v-for="(issue, index) in settingsIssues"
                :key="index"
            >
                {{ issue }}
            </li>
        </ul>
        <v-card-text />
        <v-card-actions>
            <v-btn
                dense
                small
                tile
                color="grey lighten-1"
                @click="abortEditingToolSettings(toolName)"
            >
                Abbrechen
            </v-btn>
            <v-btn
                dense
                small
                tile
                color="light green"
                @click="stopEditing()"
            >
                Übernehmen
            </v-btn>
        </v-card-actions>
    </v-card>
</template>


<style scoped>
.hasSettingsIssues{
    color: orange;
}
.noSettingsIssues{
    color: rgb(166, 164, 164);
}
</style>
