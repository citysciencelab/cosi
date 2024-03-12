<script>
import dayjs from "dayjs";

export default {
    name: "DipasCockpitTheme",
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    computed: {
        attributes: function () {
            return this.feature.getMappedProperties();
        },
        dateStart: function () {
            return dayjs(this.attributes.dateStart, "YYYY-MM-DD HH:mm:ss").format("DD.MM.YYYY");
        },
        dateEnd: function () {
            return dayjs(this.attributes.dateEnd, "YYYY-MM-DD HH:mm:ss").format("DD.MM.YYYY");
        }
    },
    mounted () {
        if (document.getElementsByClassName("tool-window-vue").length) {
            document.querySelector(".tool-window-vue").style.borderRadius = "15px";
            document.querySelector(".tool-window-vue").style.border = "2px solid #003063";
            document.querySelector(".tool-window-heading-title").style.paddingLeft = "15px";
            document.querySelector(".tool-window-heading-title").style.fontFamily = "Roboto,sans-serif";
            document.querySelector(".tool-window-heading-title").style.fontSize = "16px";
        }
        else if (document.getElementsByClassName("modal-content").length) {
            document.querySelector(".modal-content").style.borderRadius = "15px";
            document.querySelector(".modal-content").style.border = "2px solid #003063 !important";
        }
    },
    methods: {
        /**
         * Opens the given link in a new window.
         * @param {String} link Link to be opened in a new window.
         * @returns {void}
         */
        onClick (link) {
            window.open(link, "_blank");
        }
    }
};
</script>

<template>
    <div class="dipas-cockpit-theme">
        <div class="dipas-cockpit-first-row">
            <div class="dipas-cockpit-proceeding-status">
                <span class="dipas-cockpit-location-icon">
                    <img
                        :src="attributes.status_icon"
                        alt="Icon for proceeding status"
                    >
                </span>
                <span class="dipas-cockpit-status-label">{{ attributes.status }}</span>
            </div>
            <span class="dipas-cockpit-dateRange">
                <span>Verfahrenslaufzeit:</span>
                <span class="dipas-cockpit-dateRange-dates">{{ dateStart }} - {{ dateEnd }}</span>
            </span>
        </div>
        <div class="dipas-cockpit-title">
            {{ attributes.proceeding }}
        </div>
        <div class="dipas-cockpit-themes">
            <span class="dipas-cockpit-themes-key"> {{ $t("additional:addons.gfiThemes.dipasCockpit.themes") }}: </span>
            {{ attributes.themes }}
        </div>
        <div class="dipas-cockpit-description">
            {{ attributes.description }}
        </div>
        <div class="dipas-cockpit-initiators">
            {{ $t("additional:addons.gfiThemes.dipasCockpit.initiators") }}:
            <span class="dipas-cockpit-responsible-list"> {{ attributes.responsible }} </span>
        </div>
        <a
            class="dipas-cockpit-proceedingLink"
            role="button"
            tabindex="0"
            @click="onClick(attributes.link)"
            @keyup.enter="onClick(attributes.link)"
        >
            {{ attributes.link }}
        </a>
        <div class="dipas-cockpit-proceedingNumbers">
            {{ attributes.numberContributions }} {{ $t("additional:addons.gfiThemes.dipasCockpit.contributions") }} |
            {{ attributes.numberComments }} {{ $t("additional:addons.gfiThemes.dipasCockpit.comments") }}
        </div>
        <div
            v-if="attributes.documentation.length"
            class="dipas-cockpit-documentation"
        >
            {{ $t("additional:addons.gfiThemes.dipasCockpit.documentation") }}:
            <div
                v-for="document in attributes.documentation"
                :key="document.name"
                class="dipas-cockpit-document"
                role="button"
                tabindex="0"
                @click="onClick(document.url)"
                @keyup.enter="onClick(document.url)"
            >
                <span class="dipas-cockpit-document-icon">
                    <img
                        :src="document.icon"
                        alt="Icon for document"
                    >
                </span>
                {{ document.name }}
            </div>
        </div>
    </div>
</template>


<style lang="scss">
@import "~variables";

.vue-tool-content-body {
    border-radius: 15px;
}

.dipas-cockpit-theme {
     max-width: 615px;
     color: $dark_grey;
     font-family: Roboto, sans-serif;
     font-size: 0.75rem;
     padding-left: 24px;
     padding-right: 15px;

    .dipas-cockpit-first-row {
        display: flex;
        flex-direction: row;
    }

    .dipas-cockpit-proceeding-status {
        background-color: $dark_blue;
        width: fit-content;
        height: fit-content;
        padding: 6px 6px;
        margin: 10px 0px;
        color: $white;
        display: flex;

        .dipas-cockpit-location-icon {
            img {
                height: 18px;
            }
        }

        .dipas-cockpit-status-label {
            position: relative;
            top: 1px;
            padding: 0px 2px;
        }
    }

    .dipas-cockpit-dateRange {
        margin: 18px 10px;
        position: relative;
        top: 1px;
        display: flex;

        span.dipas-cockpit-dateRange-dates {
            padding-left: 3px;
        }
    }

    .dipas-cockpit-title {
        font-size: 1rem;
        font-weight: bold;
        color: $dark_blue;
    }

    .dipas-cockpit-themes {
        font-size: 0.875rem;
        color: $dark_grey;
        margin: 3px 0px;

        span.dipas-cockpit-themes-key {
            font-weight: bold;
        }
    }

    .dipas-cockpit-description {
        font-size: 0.875rem;
        margin-bottom: 26px;
    }

    .dipas-cockpit-initiators {
        margin-bottom: 8px;
        display: inline-flex;

        .dipas-cockpit-responsible-list {
            padding-left: 5px;
        }
    }

    a.dipas-cockpit-proceedingLink {
        color: $dark_blue;
        text-decoration: underline;
        cursor: pointer;
        display: block;
    }

    .dipas-cockpit-proceedingNumbers {
        margin: 8px 0px 14px 0px;
    }

    .dipas-cockpit-documentation {
        font-weight: bold;
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        align-items: baseline;

        .dipas-cockpit-document {
            font-weight: normal;
            background-color: $dark_blue;
            border-radius: 15px;
            color: $white;
            padding: 6px 6px;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 28px;
            max-width: 145px;
            overflow: hidden;
            margin-left: 10px;
            cursor: pointer;

            img {
                height: 18px;
            }
        }
    }
}

</style>
