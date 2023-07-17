<script>
// Documentation in ./doc/ReportTemplates.md
import Tool from "../../../../src/modules/tools/ToolTemplate.vue";
import ToolInfo from "../../components/ToolInfo.vue";
import {getComponent} from "../../../../src/utils/getComponent";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersReportTemplates";
import mutations from "../store/mutationsReportTemplates";
import tableify from "tableify"; // generate html tables from js objects
import promisedEvent from "../utils/promisedEvent";
import validateToolSettings from "../utils/validateToolSettings";

export default {
    name: "ReportTemplates",
    components: {
        Tool,
        ToolInfo
    },
    data () {
        return {
            uploadedTemplate: null, // file input field for report templates. This variable is watched and used to replace `templateItems` store variable
            supportedExportFormats: ["HTML", "PDF", "Importierbares Template (json)"],
            selectedExportFormat: "HTML",
            uiModes: {
                startingTemplateSelected: false
            },
            exportLoading: false // true if currently applying a template and exporting
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Tools/ReportTemplates", Object.keys(getters)),
        ...mapGetters("Tools/ToolBridge", ["currentSettings"]),
        ...mapGetters("Maps", {getMapView: "getView"}),
        ...mapGetters("Tools/SelectionManager", ["lastSelectionWithCurrentDataLayers"]),
        ...mapGetters("Tools/DistrictSelector", ["selectedDistrictNames"])

    },
    watch: {
        /**
         * whenever the template file input changes, load the file and overwrite templateItems array
         * @param {*} file file name (given in file input field)
         * @return {void}
         */
        uploadedTemplate (file) {
            // this is a bit convoluted:
            // 1. create a file reader object
            // 2. define the function that updates our array based on the file
            // 3. tell the fileReader to use that function when the file is loaded
            // 4. use the reader on the file

            if (!file) {
                this.uiModes.startingTemplateSelected = false;
                return;
            }
            // 1. create a file reader object
            const reader = new FileReader(),
                // 2. define the function that updates our array based on the file
                updateTemplateItems = (() => { // callback when file is read: replace templateItem array

                    return (newItems) => {
                        // alert and exit if json is not in reportTemplate format
                        if (!this.templateItemJsonValid(newItems)) {
                            this.addSingleAlert("Datei ist kein valides Report Template.");
                            this.uploadedTemplate = null;
                            return;
                        }
                        // ..otherwise update state
                        this.$store.state.Tools.ReportTemplates.templateItems = newItems;

                    };
                })();

            // 3. tell the fileReader to use that function when the file is loaded
            reader.onload = () => { // when file is read, parse json and run callback
                let parsedJson = null;

                if (reader.result) {
                    try {
                        parsedJson = JSON.parse(reader.result);
                    }
                    catch (e) {
                        // on error, clear file input
                        this.uploadedTemplate = null;
                        this.addSingleAlert({
                            content: "Datei nicht lesbar oder kein valides JSON",
                            category: "Fehler",
                            displayClass: "error"
                        });
                        throw new Error(e); // error in the above string (in this case, yes)!
                    }
                }

                updateTemplateItems(parsedJson);

            };
            // 4. use the reader on the file
            reader.readAsText(file); // read file (and inherently run callback which replaces the templateItems array)
            this.uiModes.startingTemplateSelected = true;
        },
        editingTool (newValue, oldValue) {
            const stopEditing = newValue.toolName === null,
                startEditing = !stopEditing,
                editsAccepted = newValue.accepted;

            if (startEditing) {
                // update tool interface based on stored settings via toolbridge (without actually applying the tool)
                this.runTool({
                    toolName: this.templateItems[newValue.templateItemsIndex].tool, // the selected tool
                    settings: this.templateItems[newValue.templateItemsIndex].settings, // the settings stored previously via the `updateToolSeetings()` method
                    // eslint-disable-next-line no-empty-function
                    outputCallback: ()=>{},
                    updateInterfaceOnly: true
                });
            }

            // if we just finished editing and edits were accepted...
            if (stopEditing & editsAccepted) {
                // copy settings from tool
                this.updateToolSettings(oldValue.templateItemsIndex);
                // copy data selection
                // if no data selection can be applied, only throw a warning - this may be okay depending on what tool is used.
                try {
                    this.copyCurrentDataSelection(oldValue.templateItemsIndex);
                }
                catch (error) {
                    console.warn(error);
                }


            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    mounted () {
        // ...
    },
    methods: {
        ...mapActions("Tools/ReportTemplates", ["startEditingToolSettings", "finishEditingToolSettings", "abortEditingToolSettings"]),
        ...mapActions("Alerting", ["addSingleAlert", "cleanup"]),
        ...mapMutations("Tools/ReportTemplates", Object.keys(mutations)),
        ...mapActions("Tools/ToolBridge", ["runTool"]),
        ...mapActions("Maps", ["zoomToExtent"]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        ...mapActions("Tools/ExportPDF", ["reportTemplateToPDF"]),
        ...mapMutations("Tools/SelectionManager", ["addSelection", "setActiveSelection", "setAcceptSelection"]),
        // store settings from selected addon in the template
        updateToolSettings (templateItemsIndex) {
            // get settings via ToolBridge currentSettings() method
            const toolSettings = this.currentSettings(this.templateItems[templateItemsIndex].tool);

            // update array
            this.templateItems[templateItemsIndex].settings = toolSettings; // update settings
            this.templateItems[templateItemsIndex].hasSettings = true;
            this.clearTemplateItemOutput(templateItemsIndex); // delete any previous results - they may no longer match the settings


        },
        /**
         * Apply all template chapters sequentially
         * @param {function} callback runs after all chapters were applied (no input and return value not returned)
         * @param {number} startIndex from which chapter to start (parameter needed for recursion)
         * @return {void}
         */
        runTemplate (callback, startIndex = 0) {
            // recursive function - exit with callback after all chapters finished
            if (startIndex >= this.templateItems.length) {
                if (callback) {
                    // eslint-disable-next-line callback-return
                    callback();
                }
                return;
            }
            // run chapter, then restart this function with the next chapter
            this.applyChapter(startIndex, ()=>{
                this.runTemplate(callback, startIndex + 1);
            });

        },
        /**
         * apply chapter data selection, wait for data, run analysis
         * @param {number} templateItemsIndex index of chapter in templateItems
         * @param {function} finallyDo what to do in the end, no matter if applying the chapter worked or not (no input expected)
         * @return {void}
         */
        applyChapter (templateItemsIndex, finallyDo) {
            const chapter = this.templateItems[templateItemsIndex],

                // validate tool settings with validateToolSettings function
                settingsValid = validateToolSettings(chapter.tool, chapter.settings);

            this.addSingleAlert({
                content: "kapitel anwendung!",
                category: "Fehler",
                displayClass: "error"
            });

            if (!settingsValid.success) {
                this.addSingleAlert({
                    content: "Tool Einstellungen für Kapitel " + (templateItemsIndex + 1) + " sind nicht valide:" + settingsValid.message,
                    category: "Fehler",
                    displayClass: "error"
                });
                return;
            }


            // 1. set data selection (or give resolved promise if none)
            let dataSelected = Promise.resolve();

            if (Object.keys(chapter.dataSelection).length !== 0) {
                dataSelected = this.setCurrentDataSelectionLayersOnly(chapter.dataSelection);
            }
            const addSingleAlert = this.addSingleAlert;

            // 2. run analysis
            dataSelected.then(()=>{
                console.log("data selected.");
            })
            // 3. alert on failure
                .catch((e)=>{
                    console.log("error:", e);
                    addSingleAlert({
                        content: "Daten Kapitel " + (templateItemsIndex + 1) + " konnten nicht geladen werden.",
                        category: "Fehler",
                        displayClass: "error"
                    });
                    console.log("error:", e);
                }).finally(()=>{ // after trying to load data is finished, run analysis
                    console.log("data selected now run script");
                    this.clearTemplateItemOutput(templateItemsIndex);
                    return this.updateToolOutput(templateItemsIndex);
                })
                .catch((e)=>{
                    console.log("error:", e);
                    addSingleAlert({
                        content: "Analyse Kapitel " + (templateItemsIndex + 1) + " konnte eventuell nicht ausgefuehrt werden. Bitte überprüfen Sie die Tool Einstellungen.",
                        category: "Fehler",
                        displayClass: "error"
                    });
                })
            // 4. run callback once all finished
                .finally(()=>{
                    if (finallyDo) {
                        finallyDo();
                    }
                });
        },
        /**
         * run a different addon based on templateItem, store results
         * @param {number} templateItemsIndex array index of the templateItem to run
         * @param {function} callbackAfterOutputReceived what to do after the results are commited back from the external tool to the reportTemplate store (receives no input)
         * @returns {Promise} a promise that resolves once the output is received, or is rejected after a timeOut
         */
        updateToolOutput (templateItemsIndex) {


            // check if tool settings are stored
            if (!this.templateItems[templateItemsIndex].hasSettings) {
                this.addSingleAlert({
                    content: "Keine Tool Einstellungen verfügbar",
                    category: "Fehler",
                    displayClass: "error"
                });
                // since updateToolOutput failed, directly return a rejected promise
                return Promise.reject(new Error("No toolBridge settings available for template item " + templateItemsIndex));
            }

            // in the end...
            // eslint-disable-next-line require-jsdoc
            const outputCallback = (output)=>{
                const itemID = templateItemsIndex;

                console.log(output);
                if (output.type === "error") {
                    this.addSingleAlert({
                        content: "Problem mit Tool Einstellungen: " + output.message,
                        category: "Fehler",
                        displayClass: "error"
                    });
                }
                // ..commit the result to the store variable
                this.$store.commit("Tools/ReportTemplates/templateItemOutput", {output, itemID});
                // emit event that resolves the promise returned from updateToolOutput function
                this.$root.$emit("reportTemplates-received-output-" + templateItemsIndex);
            };


            // calls toolBridge to run the selected tool with the given settings
            // outputCallback then saves the results to this.templateItems
            console.log("running tool on", this.templateItems[templateItemsIndex]);
            this.runTool({
                toolName: this.templateItems[templateItemsIndex].tool, // the selected tool
                settings: this.templateItems[templateItemsIndex].settings, // the settings stored previously via the `updateToolSeetings()` method
                outputCallback: outputCallback
            });
            return promisedEvent.call(this,
                "reportTemplates-received-output-" + templateItemsIndex,
                15000);


        },

        exportTemplate () {
            this.exportLoading = true;
            if (this.selectedExportFormat === "Importierbares Template (json)") {
                this.exportTemplateJSON();
                this.exportLoading = false;
                return;
            }
            this.runTemplate(()=>{
                if (this.selectedExportFormat === "HTML") {
                    this.exportTemplateToHTML();
                }
                else if (this.selectedExportFormat === "PDF") {
                    this.reportTemplateToPDF(this.templateItems); // from ExportPDF addon
                }
                this.exportLoading = false;
            });
        },
        exportTemplateJSON () {
            this.downloadObjectAsJson(this.templateItems, "template");

        },
        exportTemplateToHTML () {

            /** Don't allow html input by user, show it as plain text instead by escaping special html characters
             * @param {*} unsafe - todo
             * @return {String} save html
             */
            function escapeHtml (unsafe) {
                // make sure input is a string
                if (!(typeof unsafe === "string")) {
                    throw new Error("escapeHTML must be a string");
                }

                return unsafe
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
            // manually assemble an html document.
            const tips = "<span style='color:orange;'>Weiterverarbeitung in Word: <ul><li>Neues Word Dokument öffnen</li><li>In Word Querformat einstellen</li><li>Inhalt dieser seite markieren (Strg+A) und in Word kopieren</li><li>Alles markieren und Schriftgröße verkleinern</li><li>Zeilenumbrüche in Kopfzeilen von Tabellen einfügen</li><li>Sollten Tabellen nach wie vor zu breit sein, Anzahl der Spalten bzw. ausgewählten Gebiete begrenzen</li><li>Spaltenbreite anpassen</li></ul></span>",

                exportedHtml = tips + this.templateItems.map((item) => {

                    // for each chapter...
                    // set defaults
                    let resulthtml = "",
                        sourceInfo = "Quelleninformation fehlt.";// defaults

                    // make table or image html..
                    if (item.output.type === "table") {
                        resulthtml = "<br>" + tableify(item.output.result); // tableify converts an js object to a (string) html table
                    }
                    if (item.output.type === "image") {
                        resulthtml = "<img src='" + item.output.result + "'>";
                    }
                    // add source info if it exists
                    if (item.output.sourceInfo) {
                        // // simplify nested object into array of arrays
                        // sourceInfo = Object.values(item.output.sourceInfo).map(Object.values).map(x=>{
                        //     return x.flat();
                        // });
                        // Experimental
                        sourceInfo = Object.values(item.output.sourceInfo).map((metadata) => { // for each meta data entry..
                            return Object.values(metadata).map((x, i) => { // for each piece of information in  the entry..
                                return Object.keys(metadata)[i] + ": " + x; // concatenate keys to values..
                            }).join("<br>"); // combine this metadata entry to single string..
                        }).join("<br><br><br>"); // combine all metadata entries together to single string
                    }
                    // put together in structured & styled HTML
                    return "<h1>" + escapeHtml(item.title) + "</h1><br>" + // title as h1 element
                    "<span>" + escapeHtml(item
                        .description) + "</span><br><br>" + // description as span element
                        resulthtml + "<br><br><span> <b>Quellen:</b><br><br><small>" + sourceInfo + "</small></span>";

                }).join("<br>") // concatenate resulting array of strings into a single string with line breaks
                // rotate table column headers
                + "<style>" +
                "tr{font-size:8pt;}" +
                "th{font-size:8pt;}" +
                "th {\n    height: 240px;\n    vertical-align: bottom;\n    text-align: left;\n    line-height: 1;\n  }" +
                "th {\n    width: 300px;\n    transform-origin: bottom left;\n    transform: translateX(75px) rotate(-45deg);\n  }" +
                "</style>",
                // open a new window and fill it with the constructed html

                win = window.open("", "Export", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));

            win.document.body.innerHTML = exportedHtml;

            win.focus();

        },
        downloadObjectAsJson (exportObj, exportName) { // used to save the template as json
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj)),
                downloadAnchorNode = document.createElement("a");

            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", exportName + ".json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
        emptyTemplate () {
            this.setTemplateItems([]);
            this.uploadedTemplate = null;
            this.addEmptyTemplateItem();
        },
        addEmptyTemplateItem () { // "+" button to add new chapters to the template
            const newID = 1 + Math.max(...this.templateItems.map(o => o.id)); // create an ID one larger than the highest id in array

            this.templateItems.push({title: "Neues Kapitel...", description: "", tool: "Dashboard", settings: {}, hasSettings: false, output: {}, dataSelection: {}, dataSelectionApplied: false, id: newID});

        },
        deleteTemplateItem (index) { // id is the value for key "id" in the templateItem (stable & unique), not the array index (unstable)
            this.templateItems.splice(index, 1);
        },
        clearTemplateItemDataSelection (index) {
            this.templateItems[index].dataSelection = {};

        },
        clearTemplateItemSettings (index) {
            this.templateItems[index].settings = {};
            this.templateItems[index].hasSettings = false;

        },
        clearTemplateItemOutput (index) {
            this.templateItems[index].output = {};
        },

        // copy data selection from SelectionManager
        copyCurrentDataSelection (index) {

            this.templateItems[index].dataSelection = this.lastSelectionWithCurrentDataLayers;


        },
        // add stored selection to  SelectionManager
        /**
         *
         * @param {Object} dataSelection the data selection as retreived from selectionManager
         * @return {Promise} a promise that resolves when data is loaded, or gets rejected after a timeout
         */
        setCurrentDataSelection (dataSelection) {
            if (Object.keys(dataSelection).length === 0) {
                this.addSingleAlert({
                    content: "Gespeicherte Datenauswahl ist leer",
                    category: "Fehler",
                    displayClass: "error"
                });
                return Promise.resolve();
            }
            this.setAcceptSelection(null); // make sure watcher is triggered in next line
            this.setAcceptSelection(dataSelection); // commit to selectionManager
            // returns a promise that resolves when data is loaded (or gets rejected after timeout)
            return promisedEvent.call(
                this,
                "featureListUpdatedBy-setBBoxToGeom-updateSource",
                15000);

        },
        /**
         * Set layers of dataSelection without changing the area boundary (via selectionManager)
         * @param {Object} dataSelection data selection as retreived by selectionManager
         * @returns {Promise} resolved when data selection loaded
         */
        setCurrentDataSelectionLayersOnly (dataSelection) {
            // get the current data selection from selectionmanager for the geometry..
            const lastSelection = this.lastSelectionWithCurrentDataLayers,
                newSelection = lastSelection;

            // replace the selected data layers with whats in the dataSelection provided as parameters
            newSelection.storedLayers = dataSelection.storedLayers;
            // apply it
            return this.setCurrentDataSelection(newSelection);

        },
        /**
         * apply data selection and track which one is selected
         * @param {integer} index the array item index of the templateItem
         * @return {void}
         */
        dataSelectionAppliedToggle (index) {
            // if the dataselection is turned on...
            if (this.templateItems[index].dataSelectionApplied) {
                // set dataSelectionApplied to false for all templateItems except the selected one
                for (let i = 0; i < this.templateItems.length; i++) {
                    if (i !== index) {
                        this.templateItems[i].dataSelectionApplied = false;
                    }
                }
                // apply data selection
                this.setCurrentDataSelection(this.templateItems[index].dataSelection);
            }
            // if dataselection is turned of, nothing happens. Data selection is a one way street - we don't "unselect" data.

        },

        getSelectionAndSettings (index) {
            this.clearTemplateItemDataSelection(index);
            this.clearTemplateItemSettings(index);
            this.copyCurrentDataSelection(index);
            this.updateToolSettings(index);

        },
        /**
         * check if json format matches what is expected from reportTemplate(items) array
         * @param {*} reportTemplate a reportTemplate as Json (matching reportTemplateItems)
         * @returns {boolean} true if jsonObj is an array and each item has the required keys
         */
        templateItemJsonValid (reportTemplate) {

            // must be an array
            if (!Array.isArray(reportTemplate)) {
                console.warn("reportTemplate JSON is not an array");
                return false;
            }

            // each item must have the required keys (if not, return false)
            const requiredKeys = ["title", "description", "tool", "settings", "hasSettings", "output", "dataSelection", "dataSelectionApplied", "id"];

            for (const i in reportTemplate) {
                for (const j in requiredKeys) {
                    if (!(requiredKeys[j] in reportTemplate[i])) {
                        console.warn("reportTemplate JSON array item " + i + " does not contain key " + requiredKeys[j]);
                        return false;
                    }

                }
            }
            // if passed all checks
            return true;

        },
        /**
         * Open a tool's interface
         * @param {character} toolName name of the tool that should be opened
         * @param {boolean} closeReportTemplates true if reportTempates tool should be closed
         * @returns {void}
         */
        openToolInterface (toolName, closeReportTemplates = true) {
            this.$store.commit("Tools/" + toolName + "/setActive", true);
            if (closeReportTemplates) {
                this.setActive(false);
            }
        },
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
    <Tool
        :id="id"
        :title="$t('additional:modules.tools.cosi.reportTemplates.title')"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <v-app id="reporttemplates">
                <ToolInfo
                    :url="readmeUrl"
                    :locale="currentLocale"
                />
                <v-container class="main_container">
                    <!-- IMPORT / START NEW -->
                    <v-row>
                        "Report Templates" sind Dokumente mit voreingestellten Analysen, die sich dann auf Gebiete anwenden lassen. Jedes Report Template besteht aus Kapiteln. Jedes Kapitel enthält:<br><br>
                    </v-row>
                    <v-row>
                        <ul>
                            <li>Einen Titel</li>
                            <li>Eine Beschreibung</li>
                            <li>Das Anlayse Tool, das für das Kapitel verwendet wird</li>
                            <li>Intern, die gewählten Einstellungen des Tools sowie die zugehörigen Datenlayer</li>
                        </ul><br><br>
                    </v-row>
                    <v-row>
                        Verwenden Sie das Report Templates Tool wie folgt:<br><br>
                    </v-row>
                    <v-row>
                        <ol>
                            <li>
                                Laden Sie ein bestehendes Template hoch oder erstellen sie ein Neues.
                            </li>
                            <li>Bearbeiten Sie bei Bedarf dann die Kapitel und die Einstellungen der gewählten Analyse Tools. Mit dem "speichern" knopf können sie das Template als Datei herunterladen, mit der das aktuelle Template später wieder geladen werden kann.</li>
                            <li>Wählen Sie das Gebiet, auf das das Template angewendet werden soll in der Gebietsauswahl aus. </li>
                            <li>Entscheiden Sie sich für ein Exportforrmat</li>
                            <li>Klicken Sie dann auf "Anwenden", um das Template auszuführen und den Report im gewählten Format zu öffnen bzw. herunterzuladen</li>
                        </ol>
                    </v-row>

                    <v-row class="mt-5">
                        <v-col>
                            <v-row>
                                <v-divider />
                            </v-row>
                            <v-row>
                                <h4>Template wählen</h4>
                            </v-row>
                            <v-row class="">
                                Sie können entweder ein bestehendes Report Template hochladen, oder ein neues Template erstellen.
                            </v-row>
                            <v-row class="">
                                <v-file-input
                                    v-model="uploadedTemplate"
                                    accept="application/JSON"
                                    label="Datei wählen.."
                                    solo-filled
                                    dense
                                />
                                <v-btn
                                    dense
                                    small
                                    tile
                                    color="grey lighten-1"
                                    @click="emptyTemplate();uiModes.startingTemplateSelected=true"
                                >
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-row>
                        </v-col>
                    </v-row>
                    <!-- EDITING -->
                    <v-row
                        v-if="templateItems.length>0"
                        class="mb-4"
                    >
                        <v-col>
                            <v-row>
                                <v-divider />
                            </v-row>
                            <v-row>
                                <h4>Template Bearbeiten</h4>
                            </v-row>
                            <v-row class="ml-5">
                                Hier können Sie die Kapitel des Templates bearbeiten. Geben Sie für jedes Kapitel einen Titel und eine Beschreibung ein. Wählen Sie dann ein Analyse Tool für das Kapitel. Klicken Sie dann auf den Stift. Dann öffnet sich das Tool. Wählen Sie die relevanten Datenlayer aus dem Themenbaum, und geben Sie die gewünschten Einstellungen im Tool ein.
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <!-- one v-card per chapter in the template -->
                                    <v-card
                                        v-for="(templateItem,index) in templateItems"
                                        :key="index"
                                        class="mt-5 mb-8 ml-5"
                                        color="grey lighten-3"
                                        tile
                                    >
                                        <v-card-title>Kapitel {{ index+1 }}</v-card-title>

                                        <v-container>
                                            <!-- delete item button -->
                                            <v-row>
                                                <v-col
                                                    cols="12"
                                                    align="right"
                                                >
                                                    #{{ index+1 }}
                                                    <v-icon
                                                        small
                                                        @click="deleteTemplateItem(index)"
                                                    >
                                                        mdi-trash-can
                                                    </v-icon>
                                                </v-col>
                                            </v-row>
                                            <!-- title -->
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-text-field
                                                        v-model="templateItem.title"
                                                        label="Titel"
                                                    />
                                                </v-col>
                                            </v-row>
                                            <!-- description -->
                                            <v-row>
                                                <v-col cols="12">
                                                    <v-textarea
                                                        v-model="templateItem.description"
                                                        label="Beschreibung"
                                                    />
                                                </v-col>
                                            </v-row>
                                            <!-- tool selection -->
                                            <v-row>
                                                <v-col cols="8">
                                                    <v-select
                                                        v-model="templateItem.tool"
                                                        label="Tool wählen"
                                                        :items="supportedTools"
                                                        item-text="title"
                                                        item-value="value"
                                                        @change="startEditingToolSettings({toolName: templateItem.tool,templateItemsIndex: index})"
                                                    />
                                                </v-col>
                                                <v-col cols="4">
                                                    <v-btn
                                                        dense
                                                        @click="startEditingToolSettings({toolName: templateItem.tool,templateItemsIndex: index})"
                                                    >
                                                        <!-- <v-tooltip
                                                            activator="parent"
                                                            position="right"
                                                        >
                                                            Öffnet das gewählte Tool, um die Einstellungen für die Analyse dieses Kapitels vorzunehmen
                                                        </v-tooltip> -->
                                                        hello!
                                                        <v-tooltip
                                                            activator="parent"
                                                        >
                                                            Tooltip
                                                        </v-tooltip>
                                                        <!-- <v-icon>mdi-pen</v-icon> -->
                                                    </v-btn><br><br>
                                                    <v-tooltip text="Tooltip">
                                                        <template #activator="{ props }">
                                                            <v-btn v-bind="props">
                                                                Tooltip
                                                            </v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </v-col>
                                            </v-row>
                                            <v-row v-if="!templateItem.hasToolSettings & templateItem.tool">
                                                <v-card
                                                    color="orange"
                                                    class="m-3 p-3  ml-5"
                                                >
                                                    <v-card-text>Keine Tool Einstellungen gewählt. Bitte klicken Sie auf den Stift, und stellen Sie das Tool ein</v-card-text>
                                                </v-card>
                                            </v-row>
                                        </v-container>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-row class="mb-2">
                                <v-col
                                    cols="12"
                                    align="right"
                                >
                                    <v-icon
                                        @click="addEmptyTemplateItem"
                                    >
                                        mdi-note-plus
                                    </v-icon>
                                    <v-row />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-btn
                                    v-if="templateItems.length>0"
                                    color="grey lighten-1"
                                    class="ml-5"
                                    dense
                                    small
                                    tile
                                    @click="exportTemplateJSON"
                                >
                                    Speichern
                                </v-btn>
                            </v-row>
                        </v-col>
                    </v-row>
                    <!-- EXPORT -->
                    <v-row
                        v-if="templateItems.length>0"
                        class="mt-4"
                    >
                        <v-col>
                            <v-row><v-divider /></v-row>
                            <v-row>
                                <h4>Auf Gebiet anwenden</h4>
                            </v-row>
                            <v-row height="5px" />
                            <v-row v-if="selectedDistrictNames.length===0">
                                <v-card
                                    color="orange lighten-1"
                                    class="ml-5"
                                >
                                    <v-card-text>Keine Gebiete gewählt. Öffnen Sie die Gebietsauswahl, und wählen Sie die Gebiete, auf die Sie das Report Template anwenden wollen. Kehren Sie dann zum Report Template tool zurück, um es auf die gewählten Gebiete anzuwenden.</v-card-text>
                                    <v-card-actions>
                                        <v-btn @click="openToolInterface('DistrictSelector')">
                                            zur Gebietsauswahl
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-row>
                            <ul v-if="selectedDistrictNames.length>0">
                                <li
                                    v-for="(districtName,index) in selectedDistrictNames"
                                    :key="index"
                                >
                                    {{ districtName }}
                                </li>
                            </ul>
                            <v-row v-if="selectedDistrictNames.length>0">
                                <v-select
                                    v-model="selectedExportFormat"
                                    label="Export Format"
                                    :items="supportedExportFormats"
                                />
                            </v-row>
                            <v-row
                                v-if="selectedDistrictNames.length>0"
                                class="mb-2"
                            >
                                <v-btn
                                    dense
                                    small
                                    tile
                                    class="ml-5"
                                    width="100px"
                                    color="grey lighten-1"
                                    @click="exportTemplate"
                                >
                                    <div v-if="!exportLoading">
                                        Exportieren
                                    </div>
                                    <div v-else>
                                        <v-progress-circular indeterminate />
                                    </div>
                                </v-btn>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </v-app>
        </template>
    </Tool>
</template>

<style lang="scss" scoped>

#reportTemplates{
    overflow-y: auto;
    width:500px;
    height:100%;
}
    .textfieldtitle {
        font-size: 2em !important;

    }
    .textfieldtitle input {
        line-height: 2em;
        min-height:em;
    }
    .rawData{
        max-width:500px;
        max-height:50px;
        overflow:scroll;
    }
    .limitSize{
        max-width:500px;
        max-height:10em;
        overflow-y: scroll;
        overflow-x:hidden;
    }
    .templateItem{
        width:90%;
        left:5%;
        background:rgb(200, 200, 200);
    }

    // custom buttons
    .btn-done{
        background-color: green;
    }
   // toolbridge output table
   td{
        padding-right: 5px;
        border-right-style: solid;
        border-left-style:solid;
        background:rgb(131, 113, 71);
    }
    th{
        border-bottom-style: solid;
    }

</style>
