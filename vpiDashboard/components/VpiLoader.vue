<template>
    <div
        id="vpiDashboardLoader"
        class="centered-box-wrapper loader-is-initially-loading"
    >
        <div class="centered-box-content">
            <div
                id="vpi-loader-spinner-itself"
                class="default"
            />
        </div>
    </div>
</template>

<style scoped>
#vpiDashboardLoader {
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background-color:rgba(255,255,255,0.4);
    display:none;
    padding-bottom:100px;
    z-index:1000; /* z-index race yaaay! */
}
#vpiDashboardLoader.loader-is-initially-loading {
    background-color:rgba(255,255,255,0);
}
#vpiDashboardLoader.loader-is-loading {
    display:block;
}

@media (max-width: 1023px) {
    .vpi-loader-spinner-itself.default {
        border: 5px solid #AAAAAA;
    }
}
@media (min-width: 1024px) {
    #vpi-loader-spinner-itself.default {
        border: 8px solid #AAAAAA;
    }
}
#vpi-loader-spinner-itself.default {
    animation: loaderSpinAnimation 1s 0.1s ease-in-out infinite both;
    border-radius: 50%;
    border-top-color: #777777;
    content: "";
    transition:border-color 0.25s;
}
#vpi-loader-spinner-itself {
    display:inline-block;
    height: 5vw;
    max-height:70px;
    max-width:70px;
    min-height:40px;
    min-width:40px;
    transition:opacity 0.35s;
    opacity:1;
    width: 5vw;
}
#vpi-loader-spinner-itself.default:hover {
    border-top-color: #E10019;
}
#vpi-loader-spinner-itself.initial-fadeout-animation {
    opacity:0;
}
@keyframes loaderSpinAnimation {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}

</style>
