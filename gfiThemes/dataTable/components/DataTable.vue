<script>

import {mapGetters} from "vuex";
import getters from "../../../../src/modules/tools/gfi/store/gettersGfi";
import {isWebLink} from "../../../../src/utils/urlHelper.js";
import ExportButtonCSV from "../../../../src/share-components/exportButton/components/ExportButtonCSV.vue";
import isObject from "../../../../src/utils/isObject";
import Multiselect from "vue-multiselect";
import localeCompare from "../../../../src/utils/localeCompare";
import {getCenter as getCenterOfExtent} from "ol/extent";
import getUniqueValuesByName from "../../../../src/utils/getUniqueValuesByName";

export default {
    name: "DataTable",
    components: {
        ExportButtonCSV,
        Multiselect
    },
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            columns: this.getColumns(this.feature.getAttributesToShow()),
            rows: this.feature.getFeatures().map(singleFeature => singleFeature.getMappedProperties()),
            dropdownSelected: {},
            filterObject: {},
            originFilteredRows: undefined
        };
    },
    computed: {
        ...mapGetters("Language", ["currentLocale"]),
        ...mapGetters("Maps", ["projection"]),
        ...mapGetters("Tools/Gfi", Object.keys(getters)),
        /**
         * Gets the unsorted and unfiltered rows.
         * @returns {Object[]} The origin rows.
         */
        originRows: function () {
            return this.feature.getFeatures().map(singleFeature => singleFeature.getMappedProperties());
        },

        /**
         * Returns whether download Button is enabled.
         * @returns {Boolean} True if the download Buttion is enabled.
         */
        enableDownload: function () {
            return this.feature?.getTheme()?.params?.enableDownload || false;
        },

        /**
         * Returns whether the table is sortable.
         * @returns {Boolean} True if the table is sortable otherwise false.
         */
        isSortable: function () {
            return this.feature.getTheme()?.params?.isSortable || false;
        },

        /**
         * Returns whether the table is filterable.
         * @returns {Boolean} True if the table is filterable otherwise false.
         */
        isFilterable: function () {
            return this.feature.getTheme()?.params?.isFilterable || false;
        },

        /**
         * Returns the value of parameter shownCount
         * @returns {String|undefined} the value of parameter shownCount
         */
        showCount: function () {
            return this.feature.getTheme()?.params?.showCount;
        },

        /**
         * Returns the column which has an other order than 'origin'.
         * @returns {Object|undefined} The column or undefined if no column is found.
         */
        sortingColumn: function () {
            return this.columns.find(column => column.order !== "origin");
        },
        rowsWithAdditionalData () {
            if (typeof this.feature?.getBBox !== "function" || !this.feature?.getBBox()) {
                return this.rows;
            }
            const result = JSON.parse(JSON.stringify(this.rows)),
                extent = this.feature.getBBox(),
                epsg = this.projection.getCode(),
                coordinates = getCenterOfExtent(extent);

            result.forEach(row => {
                const obj = {
                    EPSG: epsg,
                    Rechtswert: coordinates[0],
                    Hochwert: coordinates[1]
                };

                Object.assign(row, obj);
            });
            return result;
        }
    },
    watch: {
        filterObject: {
            handler () {
                const filteredRows = this.getFilteredRows(this.filterObject, this.originRows);

                this.originFilteredRows = filteredRows;
                if (this.sortingColumn) {
                    this.rows = this.getSortedRows(this.originFilteredRows ? this.originFilteredRows : this.rows, this.sortingColumn.order, this.sortingColumn.name);
                }
                else {
                    this.rows = filteredRows;
                }
            },
            deep: true
        }
    },
    created () {
        this.fileName = this.feature?.getTitle();
    },
    methods: {
        isWebLink,
        isObject,
        getUniqueValuesByName,
        /**
         * Creates and returns the columns for the table.
         * @param {Object} gfiAttributes - The attributes to be displayed.
         * @returns {Object[]} The column objects.
         */
        getColumns (gfiAttributes) {
            return Object.keys(gfiAttributes).map((key, idx) => {
                return {
                    name: gfiAttributes[key],
                    order: "origin",
                    index: idx
                };
            });
        },

        /**
         * Gets a specific icon class to the passed order.
         * @param {String} order - The order in which the table is sorted.
         * @returns {String} The icon css class for the given order.
         */
        getIconClassByOrder (order) {
            if (order === "asc") {
                return "bi-arrow-up";
            }
            if (order === "desc") {
                return "bi-arrow-down";
            }
            return "bi-arrow-down-up origin-order";
        },

        /**
         * Gets the old sorted column if another one is to be sorted.
         * @param {Object[]} columns - The columns objects.
         * @param {Number} indexNewColumn - The index of the column that will be sorted.
         * @returns {Object|undefined} The old sorted column or undefined if it not exits.
         */
        getOldSortedColumn (columns, indexNewColumn) {
            return columns.find(col => {
                return col.order !== "origin" && col.index !== indexNewColumn;
            });
        },

        /**
         * Gets the rows sorted in the correct order.
         * @param {Object[]} rows - The rows.
         * @param {String} order - The order in which the table is sorted.
         * @param {String} columnName - The name of the column to sort by.
         * @returns {Object[]} The sorted rows.
         */
        getSortedRows (rows, order, columnName) {
            if (order === "origin") {
                return this.originFilteredRows ? this.originFilteredRows : this.originRows;
            }
            const sorted = [...rows].sort((a, b) => {
                if (typeof a[columnName] === "undefined") {
                    return -1;
                }
                if (typeof b[columnName] === "undefined") {
                    return 1;
                }
                return localeCompare(a[columnName], b[columnName], this.currentLocale, {ignorePunctuation: true});
            });

            return order === "asc" ? sorted : sorted.reverse();
        },

        /**
         * Gets the next sort order.
         * @param {String} order - The order in which the table is sorted.
         * @returns {String} The sort order.
         */
        getSortOrder (order) {
            if (order === "origin") {
                return "asc";
            }
            if (order === "asc") {
                return "desc";
            }
            return "origin";
        },

        /**
         * Sets the order and sorts the table by the given column.
         * Sorting by a new column resets the order of the old column.
         * @param {Object} column - The column to sort by.
         * @returns {void}
         */
        runSorting (column) {
            const oldColumn = this.getOldSortedColumn(this.columns, column.index);

            if (oldColumn) {
                oldColumn.order = "origin";
            }
            column.order = this.getSortOrder(column.order);
            this.rows = this.getSortedRows(this.originFilteredRows ? this.originFilteredRows : this.rows, column.order, column.name);
        },

        /**
         * Gets the unique values sorted for given column name.
         * @param {String} columnName The column name.
         * @param {Object[]} originRows The rows to iterate.
         * @returns {String[]} the sorted unique values.
         */
        getSortedUniqueValues (columnName, originRows) {
            const uniqueValues = getUniqueValuesByName(columnName, originRows);

            return uniqueValues.sort((a, b) => localeCompare(a, b, this.currentLocale, {ignorePunctuation: true}));
        },

        /**
         * Adds a filter to the filterObject property.
         * @param {String} selectedOption The selected option.
         * @param {String} columnName The name of the column.
         * @returns {void}
         */
        addFilter (selectedOption, columnName) {
            if (typeof selectedOption !== "string" || typeof columnName !== "string") {
                return;
            }

            const value = selectedOption.toLowerCase(),
                filterObject = JSON.parse(JSON.stringify(this.filterObject));

            if (!Object.prototype.hasOwnProperty.call(filterObject, columnName)) {
                filterObject[columnName] = {};
            }
            filterObject[columnName][value] = true;
            this.filterObject = filterObject;
        },

        /**
         * Removes a filter from the filterObject property.
         * @param {String} removedOption The selected option.
         * @param {String} columnName The name of the column.
         * @returns {void}
         */
        removeFilter (removedOption, columnName) {
            if (typeof removedOption !== "string" || typeof columnName !== "string") {
                return;
            }
            const value = removedOption.toLowerCase(),
                filterObject = JSON.parse(JSON.stringify(this.filterObject));

            if (Object.keys(filterObject[columnName]).length === 1) {
                delete filterObject[columnName];
            }
            else {
                delete filterObject[columnName][value];
            }
            this.filterObject = filterObject;
        },

        /**
         * Gets the rows based on given filter.
         * @param {Object} filter The filter object.
         * @param {Object[]} allRows All rows to filter.
         * @returns {Object[]} the rows who matches the filter object.
         */
        getFilteredRows (filter, allRows) {
            if (!isObject(filter) || !Array.isArray(allRows)) {
                return [];
            }
            return allRows.filter((row) => {
                let filterHit = true,
                    allMatching = true;

                Object.keys(filter).forEach(key => {
                    if (!allMatching) {
                        return;
                    }
                    const filterValue = typeof row[key] === "string" ? filter[key][row[key].toLowerCase()] : false;

                    if (!filterValue) {
                        allMatching = false;
                        filterHit = false;
                    }
                });
                return filterHit;
            });
        },
        /**
         * Resets the table data to original data and also reset the stored filtered parameter
         * @returns {void}
         */
        resetAll () {
            this.filterObject = {};
            this.dropdownSelected = {};
            if (this.sortingColumn) {
                this.columns.forEach(col => {
                    col.order = "origin";
                });
            }
            this.rows = this.originRows;
            this.columns = this.getColumns(this.feature.getAttributesToShow());
        },

        /**
         * Gets the css z-index for the column header.
         * The left column should always have a higher z-index than the right column.
         * @param {Number} idx - The of the column.
         * @return {Object} The style object.
         */
        getZIndex (idx) {
            return {
                "z-index": this.columns.length - idx
            };
        }
    }
};
</script>

<template>
    <div
        id="table-data-container"
        :class="enableDownload ? 'enable-download' : ''"
    >
        <div
            v-if="typeof showCount !== 'undefined'"
            class="count"
        >
            <b>{{ $t(showCount) }}</b> {{ rows.length }}
        </div>
        <table
            class="table table-hover"
        >
            <thead>
                <th
                    v-for="col in columns"
                    :key="col.index"
                    class="filter-select-box-container"
                    :class="[typeof showCount !== 'undefined' ? 'more-sticky' : '']"
                    :style="getZIndex(col.index)"
                >
                    <span
                        v-if="isFilterable"
                        class="multiselect-dropdown"
                    >
                        <Multiselect
                            v-model="dropdownSelected[col.name]"
                            :options="getSortedUniqueValues(col.name, originRows)"
                            :multiple="true"
                            :show-labels="false"
                            open-direction="auto"
                            :close-on-select="true"
                            :clear-on-select="false"
                            :searchable="false"
                            placeholder=""
                            :taggable="true"
                            class="multiselect-dropdown"
                            @select="(selectedOption) => addFilter(selectedOption, col.name)"
                            @remove="(removedOption) => removeFilter(removedOption, col.name)"
                        >
                            <template
                                slot="selection"
                            >
                                <span
                                    class="multiselect__single"
                                >{{ col.name }}</span>
                            </template>d
                        </Multiselect>
                    </span>
                    <span v-else>{{ col.name }}</span>
                    <span
                        v-if="isSortable"
                        class="bootstrap-icon"
                        :class="getIconClassByOrder(col.order) + ' sort'"
                        @click="runSorting(col)"
                        @keypress="runSorting(col)"
                    />
                </th>
            </thead>
            <tbody v-if="rows.length > 0">
                <tr
                    v-for="(singleRow, index1) in rows"
                    :key="index1"
                >
                    <td
                        v-for="(col, index2) in columns"
                        :key="index2"
                    >
                        <a
                            v-if="isWebLink(singleRow[col.name])"
                            :href="singleRow[col.name]"
                            target="_blank"
                        >
                            {{ singleRow[col.name] ? singleRow[col.name] : '' }}
                        </a>
                        <span v-else>
                            {{ singleRow[col.name] ? singleRow[col.name] : '' }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div
            v-if="enableDownload"
            class="download"
        >
            <ExportButtonCSV
                :url="false"
                :filename="fileName"
                :data="rowsWithAdditionalData"
                :use-semicolon="true"
                :title="$t('modules.tools.filter.download.labelBtn')"
            />
        </div>
        <div
            v-if="isFilterable || isSortable"
            class="reset-all"
        >
            <button
                type="button"
                class="btn btn-primary reset"
                @click="resetAll"
                @keypress="resetAll"
            >
                {{ $t('additional:addons.gfiThemes.dataTable.reset') }}
            </button>
        </div>
    </div>
</template>

<style lang="scss">
@import "~variables";

#table-data-container {
    margin:6px 15px 0 12px;
    min-height: 350px;

    &.enable-download {
        margin:6px 15px 60px 12px;
    }

    .sort {
        position: absolute;
        right: 10px;
        top: 18px;
        z-index: 50;
    }
    .origin-order {
        opacity: 0.3;
        &:hover {
            opacity: 1;
        }
    }

    .count {
        padding-top: 25px;
        padding-left: 6px;
        position: sticky;
        top: 0px;
        background-color: #ffffff;
    }

    table {
        margin: 0;
        table-layout: fixed;
        th {
            padding: 6px 15px 6px 6px;
            position: sticky;
            top: 0px;
            background: $white;
            vertical-align: top;
            &.more-sticky {
                top: 37px;
            }
            span {
                cursor: pointer;
                padding: 0;
            }
            .multiselect-dropdown {
                padding: 0;
            }
        }
        td{
            padding: 6px;
        }
    }
    .download {
        position: sticky;
        bottom: 22px;
        float: right;
        margin-left: 20px;
    }
    .reset-all {
        position: sticky;
        bottom: 22px;
        float: right;
    }
    .filter-select-box-container {
        .multiselect {
            margin:0;
            padding: 0;
            .multiselect__single {
                font-family: inherit;
                font-size: $font-size-base;
                margin:0;
                padding: 0;
            }
            .filter-select-box-container {
                .multiselect__input {
                    font-family: inherit;
                    font-size: $font-size-base;
                }
            }
            .multiselect__tags {
                border: none;
                box-shadow: none;
                padding: 8px 40px 0 0;
            }
            .multiselect__option {
                display: block;
                min-height: 16px;
                line-height: 8px;
                text-decoration: none;
                text-transform: none;
                vertical-align: middle;
                position: relative;
                cursor: pointer;
                white-space: nowrap;
                padding: 10px 12px;
            }
            .multiselect__option--selected {
                background: $light_blue;
                outline: none;
                color: $white;
            }
            .option__image {
                width: 22px;
            }
            .multiselect__option--highlight {
                background: $light_blue;
                outline: none;
                color: $white;
                &::after {
                    content: attr(data-select);
                    background: $light_blue;
                    color: $white;
                }
            }
            .multiselect__tag-icon {
                &::after {
                    content: "\D7";
                    color: $light_grey;
                    font-size: $font_size_big;
                }
                &:hover {
                    background: $light_blue;
                }
                &:hover {
                    background: $light_grey;
                }
                &:focus {
                    background: $light_grey;
                }
            }
            .multiselect__placeholder {
                display: none;
            }
            .multiselect__select {
                height: 34px;
                line-height: 14px;
                top: inherit;
                &::before {
                    top: 64%;
                }
            }
            .multiselect__content-wrapper {
                overflow-y: auto;
                width: auto;
                top: 54px;
            }
        }
        .multiselect__select {
            height: 34px;
            line-height: 14px;
            &::before {
                top: 64%;
            }
        }
        .multiselect--active {
            color: $black;
            background-color: $white;
            border-color: $light_blue;
            outline: 0;
            box-shadow: unset;
        }
    }
}
</style>
