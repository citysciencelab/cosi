<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCosiFileImport";
import mutations from "../store/mutationsCosiFileImport";

export default {
    name: "ImportManager",
    components: {
    },
    data () {
        return {
            setLayer: 0,
            drag: false,
            dragEl: "",
            dragIndex: 0,
            clone: "",
            mouseX: "",
            mouseY: "",
            placeholder: ""
        };
    },
    computed: {
        ...mapGetters("Tools/CosiFileImport", Object.keys(getters)),
        layerList () {
            return document.getElementById("layerList");
        }
    },
    watch: {
        setLayer () {
            this.setActiveLayer(this.setLayer);
        }
    },
    methods: {
        ...mapMutations("Tools/CosiFileImport", Object.keys(mutations)), ...mapActions("Tools/CosiFileImport", ["deleteLayerFromTree"]),
        mouseDownHandler (e) {
            const originalRow = e.target.closest("draggable");

            this.dragIndex = [].slice.call(this.layerList.querySelectorAll("li")).indexOf(originalRow);
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            document.addEventListener("mousemove", this.mouseMoveHandler);
            document.addEventListener("mouseup", this.mouseUpHandler);
        },
        mouseMoveHandler (e) {
            if (!this.drag) {
                this.drag = true;

                this.cloneRow();
                // this.dragEl = [].slice.call(this.clone.children)[this.dragIndex];
                this.dragEl = e.target.parentNode;
                this.dragEl.classList.add("dragging");

                this.placeholder = document.createElement("div");
                this.placeholder.classList.add("placeholder");
                this.dragEl.parentNode.insertBefore(this.placeholder, this.dragEl.nextSibling);
                this.placeholder.style.height = `${this.dragEl.offsetHeight}px`;
            }

            this.dragEl.style.position = "absolute";
            this.dragEl.style.top = this.dragEl.offsetTop + e.clientY - this.mouseY + "px";
            this.dragEl.style.left = this.dragEl.offsetLeft + e.clientX - this.mouseX + "px";

            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            const prevEl = this.dragEl.previousElementSibling,
                nextEl = this.placeholder.nextElementSibling;

            // console.log("try", prevEl, nextEl);

            if (prevEl && prevEl.previousElementSibling && this.checkPosition(this.dragEl, prevEl)) {
                this.swapRows(this.placeholder, this.dragEl);
                this.swapRows(this.placeholder, this.prevEl);
            }

            if (nextEl && this.checkPosition(nextEl, this.dragEl)) {
                this.swapRows(nextEl, this.placeholder);
                this.swapRows(nextEl, this.dragEl);
            }
        },
        mouseUpHandler () {
            this.placeholder.remove();
            this.dragEl.classList.remove("dragging");
            this.dragEl.style.removeProperty("top");
            this.dragEl.style.removeProperty("left");
            this.dragEl.style.removeProperty("position");
            this.clone.parentNode.removeChild(this.clone);
            this.layerList.removeProperty("visibility");

            const endRowIndex = [].slice.call(this.clone.children).indexOf(this.dragEl),
                rows = [].slice.call(this.layerList.querySelectorAll("li"));

            if (this.dragIndex > endRowIndex) {
                rows[endRowIndex].parentNode.insertBefore(rows[this.dragIndex], rows[endRowIndex]);
            }
            else {
                rows[endRowIndex].parentNode.insertBefore(rows[this.dragIndex], rows[endRowIndex].nextSibling);
            }

            this.drag = false;
            document.removeEventListener("mousemove", this.mouseMoveHandler);
            document.removeEventListener("mouseup", this.mouseUpHandler);
        },
        cloneRow () {
            const rect = this.layerList.getBoundingClientRect(),
                width = parseInt(window.getComputedStyle(this.layerList).width, 10);

            this.clone = document.createElement("div");
            this.clone.style.position = "absolute";
            this.clone.style.left = `${rect.left}px`;
            this.clone.style.top = `${rect.top}px`;
            this.layerList.parentNode.insertBefore(this.clone, this.layerList);
            this.layerList.querySelectorAll("li").forEach(row => {
                const item = document.createElement("div"),
                    newList = document.createElement("ul"),
                    newRow = document.createElement("li"),
                    contents = [].slice.call(row.children);

                item.classList.add("draggable");
                newList.setAttribute("class", "clone-table");
                newList.style.width = `${width}px`;
                contents.forEach(el => {
                    const newEl = el.cloneNode(true);

                    newEl.style.width = `${parseInt(window.getComputedStyle(el).width, 10)}px`;
                    newRow.appendChild(newEl);
                });


                newList.appendChild(newRow);
                item.appendChild(newList);

                this.layerList.appendChild(item);
            });
        },
        swapRows (nodeA, nodeB) {
            const parentA = nodeA.parentNode,
                siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

            // Move `nodeA` to before the `nodeB`
            nodeB.parentNode.insertBefore(nodeA, nodeB);

            // Move `nodeB` to before the sibling of `nodeA`
            parentA.insertBefore(nodeB, siblingA);
        },
        checkPosition (nodeA, nodeB) {
            // Get the bounding rectangle of nodes
            const rectA = nodeA.getBoundingClientRect(),
                rectB = nodeB.getBoundingClientRect();

            return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
        },
        removeLayer (layer) {
            this.deleteLayerFromTree(layer.filename);
            const layerArray = this.importedLayers.filter(x => x.id !== layer.id);

            this.setImportedLayers(layerArray);
        }
    }
};
</script>

<template lang="html">
    <div class="import_manager">
        <div class="list">
            <ul id="layerList">
                <li
                    v-for="(layer, i) in importedLayers"
                    :key="layer.id"
                    class="draggable"
                    :class="{active: setLayer === i}"
                    role="button"
                    tabindex="0"
                    @click="setLayer = i"
                    @keydown.enter="setLayer = i"
                >
                    <div
                        class="handle"
                        role="button"
                        tabindex="0"
                        @mousedown.left="mouseDownHandler($event)"
                    >
                        <template v-if="layer.type === 'Polygon'">
                            <div
                                class="icon"
                                :style="{backgroundColor: layer.color}"
                            />
                        </template>
                        <template v-else>
                            <div
                                class="icon"
                                :style="{backgroundColor: layer.color, backgroundImage: 'url(./assets/svg/' + layer.icon + ')'}"
                            />
                        </template>
                    </div>
                    <div class="content">
                        {{ layer.name }}
                    </div>
                    <v-btn
                        class="remove"
                        @click="removeLayer(layer)"
                    >
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </li>
            </ul>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    @import "~variables";
    @import "../../utils/variables.scss";

    .list {
        ul {
            display:flex;
            flex-flow:row wrap;
            justify-content:flex-start;
            list-style:none;

            li {
                display:flex;
                flex-flow:row wrap;
                justify-content:flex-start;
                flex:1 0 100%;
                background:white;
                border-left:1px solid #ccc;
                border-bottom:1px solid #ccc;
                line-height:20px;
                padding:5px 10px;
                box-sizing: border-box;
                margin:0.5px 0;
                opacity:0.75;
                z-index:1;
                box-shadow: 10px 10px 25px -16px rgba(0,0,0,0.75);

                &.active {
                    border-left:1px solid white;
                    opacity:1;
                    z-index:3;
                }

                &:first-child {
                    margin:0 0 0.5px 0px;
                }

                .handle {
                    height:20px;
                    flex-basis:20px;
                    margin-right:10px;

                    .icon {
                        width:20px;
                        height:20px;
                        background-size:80%;
                        background-position: center;
                        background-repeat:no-repeat;
                    }

                    &:hover {
                        cursor:grab;
                    }
                }

                .content {
                    flex-grow:0;
                    flex-basis:auto;
                }

                .remove {
                    justify-self: flex-end;
                    margin:0px 0px 0px auto;
                    flex-basis:20px;
                    width:20px;
                    height:20px;
                    min-width:20px;
                    border-radius:0;
                    color:whitesmoke;
                    opacity:0.75;
                    background:$error_red;

                    .v-icon {
                        font-size:18px;
                    }
                }
            }
        }
    }
</style>
