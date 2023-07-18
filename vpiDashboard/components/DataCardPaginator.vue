<script>
export default {
    name: "DataCardPaginator",
    props: {
        navigationFilter: {
            type: Object,
            required: false,
            default: () => ({name: "Paginator"})
        },
        paginatorData: {
            type: Array,
            required: false,
            default: () => ["eins", "zwei", "drei"]
        },
        subtitleIndex: {
            type: String,
            required: false,
            default: ""
        }
    },
    data () {
        return {
            index: 0
        };
    },
    computed: {
        /**
         * calculates size of the array of the data to be paginated
         * @returns {void}
         */
        sizeOfArray () {
            return this.paginatorData.length;
        }
    },
    methods: {
        /**
         * switches to previous page or turns over if it is first one
         * emits event to parent to change the content based on the selected page
         * @returns {void}
         */
        previous () {
            if (this.index === 0) {
                this.index = this.sizeOfArray - 1;
            }
            else {
                this.index -= 1;
            }

            this.$emit("pager", this.index);
        },
        /**
         * switches to next page or turns over if it is last one
         * emits event to parent to change the content based on the selected page
         * @returns {void}
         */
        next () {
            if (this.index === this.sizeOfArray - 1) {
                this.index = 0;
            }
            else {
                this.index += 1;
            }
            this.$emit("pager", this.index);
        }
    }
};
</script>

<template>
    <div
        id="paginator"
        class="d-flex w-100 justify-content-center align-items-center"
    >
        <nav aria-label="navigation">
            <ul class="pagination">
                <li
                    class="page-item"
                    @click="previous"
                    @keydown="previous"
                >
                    <a
                        class="page-link"
                        href="#"
                        aria-label="Previous"
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item paginator-index">
                    {{ paginatorData[index] }}
                </li>
                <li
                    class="page-item"
                    @click="next"
                    @keydown="next"
                >
                    <a
                        class="page-link"
                        href="#"
                        aria-label="Next"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>
.pagination{
  padding:0;
  margin:0;
}
.paginator-index {
    margin: 0 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
