<script>
import {mapGetters} from "vuex";
import axios from "axios";
import {TrafficCountCache} from "../utils/trafficCountCache";
import {DauerzaehlstellenRadApi} from "../utils/dauerzaehlstellenRadApi";
import TrafficCountInfo from "./TrafficCountInfo.vue";
import TrafficCountDay from "./TrafficCountDay.vue";
import TrafficCountWeek from "./TrafficCountWeek.vue";
import TrafficCountYear from "./TrafficCountYear.vue";
import TrafficCountFooter from "./TrafficCountFooter.vue";
import TrafficCountDownloads from "./TrafficCountDownloads.vue";
import convertHttpLinkToSSL from "../../../../src/utils/convertHttpLinkToSSL";

export default {
    name: "TrafficCount",
    components: {
        TrafficCountInfo,
        TrafficCountDay,
        TrafficCountWeek,
        TrafficCountYear,
        TrafficCountFooter,
        TrafficCountDownloads
    },
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            api: null,
            propThingId: 0,
            propMeansOfTransport: "",
            title: "",
            type: "",
            meansOfTransport: "",
            direction: "",
            currentTabId: "infos",
            keyInfo: "info",
            keyDay: "day",
            keyWeek: "week",
            keyYear: "year",
            keyDownloads: "downloads",
            dayCheckReset: false,
            weekCheckReset: false,
            yearCheckReset: false,
            holidays: [
                "newYearsDay",
                "goodFriday",
                "easterSunday",
                "easterMonday",
                "laborDay",
                "ascensionDay",
                "pentecostSunday",
                "pentecostMonday",
                "germanUnityDay",
                "reformationDay",
                "christmasEve",
                "christmasDay",
                "secondDayOfChristmas",
                "newYearsEve"
            ],
            checkGurlittInsel: false
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        infoLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.infoLabel");
        },

        dayLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.dayLabel");
        },

        weekLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.weekLabel");
        },

        yearLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.yearLabel");
        },

        downloadsLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.downloads");
        },

        typeAssoc: function () {
            return {
                Anzahl_Kfz: this.$t("additional:modules.tools.gfi.themes.trafficCount.infraredsensor"),
                Anzahl_Fahrraeder: this.$t("additional:modules.tools.gfi.themes.trafficCount.infraredsensor")
            };
        },

        meansOfTransportAssoc: function () {
            return {
                Anzahl_Kfz: this.$t("additional:modules.tools.gfi.themes.trafficCount.carLabel"),
                Anzahl_Fahrraeder: this.$t("additional:modules.tools.gfi.themes.trafficCount.bicycleLabel")
            };
        },

        idLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.idLabel");
        },

        typeLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.typeLabel");
        },

        meansOfTransportLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.meansOfTransportLabel");
        },

        directionLabel: function () {
            return this.$t("additional:modules.tools.gfi.themes.trafficCount.directionLabel");
        },

        downloadUrl: function () {
            if (this.checkGurlittInsel && this.feature?.getProperties()?.link_download) {
                return convertHttpLinkToSSL(this.feature.getProperties().link_download);
            }

            return false;
        },

        downloadFilename () {
            if (this.checkGurlittInsel && this.feature?.getProperties()?.link_download) {
                return false;
            }

            return this.propMeansOfTransport + "_" + this.propThingId + "_" + this.direction;
        }
    },
    watch: {
        // When the gfi window switched with arrow, the connection will be refreshed
        feature: {
            handler (newVal, oldVal) {
                if (oldVal) {
                    if (this.isGurlittInsel(newVal)) {
                        this.createDataConnectionDauerzaehlstellenRad(newVal, errormsg => {
                            console.warn("An error occured constructing Gurlitt Insel:", errormsg);
                        });
                        this.checkGurlittInsel = true;
                    }
                    else {
                        this.createDataConnection(newVal.getProperties(), errormsg => {
                            console.warn("An error occured constructing SensorThings Api:", errormsg);
                        }, null);
                        this.checkGurlittInsel = false;
                    }
                    this.setHeader(this.api, this.propThingId, this.propMeansOfTransport);
                    this.setComponentKey(this.propThingId + this.propMeansOfTransport);
                    this.setActiveDefaultTab();
                    this.setHolidays(newVal);
                }
            },
            immediate: true
        },

        // When language is switched, the header will be rerendered
        currentLocale: function (newVal, oldVal) {
            if (oldVal) {
                this.setHeader(this.api, this.propThingId, this.propMeansOfTransport);
                this.setComponentKey(newVal);
                this.setActiveDefaultTab();
            }
        },

        currentTabId: function (newVal) {
            if (newVal !== "infos") {
                this.setGfiDiagramWidth();
            }
            else {
                this.setGfiDefaultWidth();
            }
        }
    },
    created: function () {
        if (this.isGurlittInsel(this.feature)) {
            this.createDataConnectionDauerzaehlstellenRad(this.feature, errormsg => {
                console.warn("An error occured constructing Gurlitt Insel:", errormsg);
            });
            this.checkGurlittInsel = true;
        }
        else {
            this.createDataConnection(this.feature.getProperties(), errormsg => {
                console.warn("An error occured constructing SensorThings Api:", errormsg);
            }, null);
            this.checkGurlittInsel = false;
        }
    },
    mounted: function () {
        this.setHeader(this.api, this.propThingId, this.propMeansOfTransport);
        this.setHolidays(this.feature);
    },
    beforeDestroy: function () {
        this.api.unsubscribeEverything();
    },
    methods: {
        /**
         * checks if this is the feature of Gurlitt-Insel
         * @param {Object} feature the feature
         * @returns {void}
         */
        isGurlittInsel (feature) {
            return typeof feature === "object" && feature !== null
                && typeof feature.getMimeType === "function" && feature.getMimeType() === "text/xml"
                && typeof feature.getId === "function" && typeof feature.getId() === "string" && feature.getId().indexOf("DE.HH.UP_DAUERZAEHLSTELLEN_RAD") === 0;
        },
        /**
         * sets the GFI up for the Gurlitt-Insel feature
         * @param {Object} feature the feature
         * @param {Function} [onerror] a function to call on error
         * @returns {void}
         */
        createDataConnectionDauerzaehlstellenRad (feature, onerror) {
            this.api = new DauerzaehlstellenRadApi(feature, onerror, (link, onsuccess, onAxiosError) => {
                axios({
                    method: "get",
                    url: link,
                    responseType: "text"
                }).then(function (response) {
                    if (typeof onsuccess === "function" && typeof response === "object" && response !== null && Object.prototype.hasOwnProperty.call(response, "data")) {
                        onsuccess(response.data);
                    }
                }).catch(function (error) {
                    if (typeof onAxiosError === "function") {
                        onAxiosError(error);
                    }
                });
            });
            this.propThingId = this.api.getThingId(onerror);
            this.propMeansOfTransport = this.api.getMeansOfTransport();
        },
        /**
         * it will make conntection to thing api
         * @param {Object} feature the feature properties from thing
         * @param {Function} [onerror] a function to call on error
         * @param {Object} [sensorThingsApiOpt=null] an optional api for testing
         * @returns {void}
         */
        createDataConnection: function (feature, onerror, sensorThingsApiOpt = null) {
            const thingId = feature["@iot.id"],
                meansOfTransport = this.getMeansOfTransportFromDatastream(feature.Datastreams, Object.keys(this.typeAssoc)),
                url = feature.requestUrl,
                sensorThingsApiVersion = "v" + feature.versionUrl,
                mqttOptions = {
                    host: url.split("/")[2],
                    rhPath: url,
                    context: this,
                    path: "/mqtt",
                    protocol: "wss",
                    mqttVersion: "3.1.1"
                };

            this.api = new TrafficCountCache(url, sensorThingsApiVersion, mqttOptions, sensorThingsApiOpt);
            this.propThingId = thingId;
            this.propMeansOfTransport = meansOfTransport;
        },

        /**
         * returns the value in meansOfTransportArray that matches the start of the given array of datastreams property layerName, returns first match
         * @param {Object[]} datastreams the array of datastreams from the SensorThingsAPI
         * @param {String[]} meansOfTransportArray an array representing all terms to look for in the datastreams layerName
         * @returns {String|Boolean}  a string representing the means of transport (e.g. Anzahl_Kfz, Anzahl_Fahrraeder) or false if no means of transport where found
         */
        getMeansOfTransportFromDatastream: function (datastreams, meansOfTransportArray) {
            let key,
                i,
                datastream = null;

            if (!Array.isArray(datastreams) || datastreams.length === 0) {
                return false;
            }

            for (i in datastreams) {
                datastream = datastreams[i];

                if (!datastream || typeof datastream !== "object" || !datastream?.properties || !datastream.properties?.layerName) {
                    continue;
                }

                for (key in meansOfTransportArray) {
                    if (datastream.properties.layerName.indexOf(meansOfTransportArray[key]) === 0) {
                        return meansOfTransportArray[key];
                    }
                }
            }

            return false;
        },

        /**
         * set the default infos tab active when switch the language by triggering the click event
         * @returns {Void} -
         */
        setActiveDefaultTab: function () {
            this.$el.querySelector("li[value='infos'] a").click();
        },
        isActiveTab (tabId) {
            return this.currentTabId === tabId;
        },
        /**
         * set the current tab id after clicking.
         * @param {Object[]} evt the target of current click event
         * @returns {Void} -
         */
        setCurrentTabId: function (evt) {
            if (evt && evt.target && evt.target.hash) {
                this.currentTabId = evt.target.hash.substring(1);
            }
        },

        /**
         * set the header of gfi theme
         * @param {Object} api the api from library
         * @param {String} thingId the current thing Id
         * @param {String} meansOfTransport the means of transportation
         * @returns {Void} -
         */
        setHeader: function (api, thingId, meansOfTransport) {
            // title
            api.updateTitle(thingId, title => {
                this.setTitle(title);
            }, errormsg => {
                this.setTitle("(kein Titel empfangen)");
                console.warn("The title received is incomplete:", errormsg);
                Radio.trigger("Alert", "alert", {
                    content: "Der vom Sensor-Server erhaltene Titel des geöffneten GFI konnte wegen eines API-Fehlers nicht empfangen werden.",
                    category: "Info"
                });
            });

            // type
            if (meansOfTransport && Object.prototype.hasOwnProperty.call(this.typeAssoc, meansOfTransport)) {
                if (this.isGurlittInsel(this.feature)) {
                    this.type = this.$t("additional:modules.tools.gfi.themes.trafficCount.inductionLoop");
                }
                else {
                    this.type = this.typeAssoc[meansOfTransport];
                }
            }
            else {
                this.type = "";
            }

            // means of transport
            if (meansOfTransport && Object.prototype.hasOwnProperty.call(this.meansOfTransportAssoc, meansOfTransport)) {
                this.meansOfTransport = this.meansOfTransportAssoc[meansOfTransport];
            }
            else {
                this.meansOfTransport = "";
            }

            // direction
            api.updateDirection(thingId, direction => {
                this.setDirection(direction);
            }, errormsg => {
                this.setDirection("");
                console.warn("The direction received is incomplete:", errormsg);
                Radio.trigger("Alert", "alert", {
                    content: "Die vom Sensor-Server erhaltene Richtung des geöffneten GFI konnte wegen eines API-Fehlers nicht empfangen werden.",
                    category: "Info"
                });
            });
        },

        /**
         * setter for title
         * @param {String} value the title to be shown in the template
         * @returns {void}
         */
        setTitle: function (value) {
            this.title = value;
        },

        /**
         * setter for direction
         * @param {String} value the direction to be shown in the template
         * @returns {void}
         */
        setDirection: function (value) {
            this.direction = value;
        },

        /**
         * setter for the compoent key
         * @param {String} value the dynamic changed value from watch hook
         * @returns {void}
         */
        setComponentKey: function (value) {
            this.keyInfo = value + "info";
            this.keyDay = value + "day";
            this.keyWeek = value + "week";
            this.keyYear = value + "year";
            this.keyDownloads = value + "downloads";
        },

        /**
         * setting the width for day, week and year tabs to show the whole diagram
         * @returns {void}  -
         */
        setGfiDiagramWidth: function () {
            document.querySelector(".tool-window-vue").style.maxWidth = "640px";
        },

        /**
         * setting the standard width for info tab
         * @returns {void} -
         */
        setGfiDefaultWidth: function () {
            document.querySelector(".tool-window-vue").style.maxWidth = "600px";
        },

        /**
         * Setting the holidays in Array if there are holiday configured in config.json
         * @param {Object} feature the feature
         * @returns {void}
         */
        setHolidays (feature) {
            const gfiTheme = feature?.getTheme(),
                gfiParams = gfiTheme?.params,
                holidays = gfiParams?.holidays;

            if (Array.isArray(holidays) && holidays.length) {
                this.holidays = holidays;
            }
        },

        /**
         * changing resetting check status for the active tab
         * @returns {void} -
         */
        resetTab: function () {
            if (this.currentTabId === "day") {
                this.dayCheckReset = !this.dayCheckReset;
            }
            else if (this.currentTabId === "week") {
                this.weekCheckReset = !this.weekCheckReset;
            }
            else if (this.currentTabId === "year") {
                this.yearCheckReset = !this.yearCheckReset;
            }
        }
    }
};
</script>

<template>
    <div class="trafficCount-gfi">
        <div class="header">
            <span class="title">{{ idLabel }} {{ title }}</span><br>
            {{ typeLabel }} <span class="type">{{ type }}</span><br>
            {{ meansOfTransportLabel }} <span class="meansOfTransport">{{ meansOfTransport }}</span><br>
            {{ $t("additional:modules.tools.gfi.themes.trafficCount.directionLabel") }} <span class="direction">{{ direction }}</span>
        </div>
        <div>
            <ul
                class="nav nav-pills"
                role="button"
                tabindex="0"
                @click="setCurrentTabId"
                @keydown.enter="setCurrentTabId"
            >
                <li
                    value="infos"
                    class="nav-item"
                >
                    <a
                        class="nav-link"
                        :class="{ active: isActiveTab('infos'), 'nav-link': true }"
                        data-toggle="tab"
                        href="#infos"
                    >{{ infoLabel }}</a>
                </li>
                <li
                    value="day"
                    class="nav-item"
                >
                    <a
                        class="nav-link"
                        :class="{ active: isActiveTab('day'), 'nav-link': true }"
                        data-toggle="tab"
                        href="#day"
                    >{{ dayLabel }}</a>
                </li>
                <li
                    value="week"
                    class="nav-item"
                >
                    <a
                        class="nav-link"
                        :class="{ active: isActiveTab('week'), 'nav-link': true }"
                        data-toggle="tab"
                        href="#week"
                    >{{ weekLabel }}</a>
                </li>
                <li
                    value="year"
                    class="nav-item"
                >
                    <a
                        class="nav-link"
                        :class="{ active: isActiveTab('year'), 'nav-link': true }"
                        data-toggle="tab"
                        href="#year"
                    >{{ yearLabel }}</a>
                </li>
                <li
                    value="downloads"
                    class="nav-item"
                >
                    <a
                        class="nav-link"
                        :class="{ active: isActiveTab('downloads'), 'nav-link': true }"
                        data-toggle="tab"
                        href="#downloads"
                    >{{ downloadsLabel }}</a>
                </li>
            </ul>
            <div class="tab-content">
                <TrafficCountInfo
                    id="infos"
                    :key="keyInfo"
                    :class="{ 'tab-pane': true, 'active': currentTabId === 'infos' }"
                    :api="api"
                    :thing-id="propThingId"
                    :holidays="holidays"
                    :means-of-transport="propMeansOfTransport"
                />
                <TrafficCountDay
                    id="day"
                    :key="keyDay"
                    :class="{ 'tab-pane': true, 'active': currentTabId === 'day' }"
                    :api="api"
                    :thing-id="propThingId"
                    :means-of-transport="propMeansOfTransport"
                    :reset="dayCheckReset"
                    :holidays="holidays"
                    :check-gurlitt-insel="checkGurlittInsel"
                />
                <TrafficCountWeek
                    id="week"
                    :key="keyWeek"
                    :class="{ 'tab-pane': true, 'active': currentTabId === 'week' }"
                    :api="api"
                    :thing-id="propThingId"
                    :means-of-transport="propMeansOfTransport"
                    :reset="weekCheckReset"
                    :holidays="holidays"
                />
                <TrafficCountYear
                    id="year"
                    :key="keyYear"
                    :class="{ 'tab-pane': true, 'active': currentTabId === 'year' }"
                    :api="api"
                    :thing-id="propThingId"
                    :means-of-transport="propMeansOfTransport"
                    :reset="yearCheckReset"
                    :holidays="holidays"
                    :check-gurlitt-insel="checkGurlittInsel"
                />
                <TrafficCountDownloads
                    id="downloads"
                    :key="keyDownloads"
                    :class="{ 'tab-pane': true, 'active': currentTabId === 'downloads' }"
                    :api="api"
                    :holidays="holidays"
                    :thing-id="propThingId"
                    :means-of-transport="propMeansOfTransport"
                    :download-url="downloadUrl"
                    :download-filename="downloadFilename"
                />
            </div>
        </div>
        <TrafficCountFooter
            class="footer"
            :current-tab-id="currentTabId"
            :api="api"
            :thing-id="propThingId"
            :means-of-transport="propMeansOfTransport"
            @resetTab="resetTab"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~/css/mixins.scss";

.trafficCount-gfi {
    padding: 10px 5px 0;

    @media (max-width: 600px) {
        width: inherit;
        height: inherit;
        padding-left: 10px;
        padding-right: 10px;

        div.graph {
            width: inherit;
            height: inherit;
        }
    }

    .nav-pills {
        @include active-pill(0.625rem, 1.25em);

        & > li > a {
            margin-bottom: 0.5em;
        }
    }

    .header {
        min-width: 280px;
        max-width: 320px;
        margin: 0 auto 10px;
        padding: 0 40px;
        text-align: left;
    }
    .footer {
        position: relative;
        display: inline-block;
        width: 100%;
        padding-bottom: 5px;
    }
}
</style>
