<template>
    <div
        id="vpiDashboardLoader"
        class="centered-box-wrapper loader-is-loading loader-is-initially-loading"
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
/* Loader Overlay */
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
#generic-masterportal-logo {
    background-color:rgba(255,255,255,0.8);
    opacity:1;
    padding: 20px 20px 10px 20px;
    position: absolute;
    text-align:center;
    transition:opacity 0.35s 3s;
    width:170px;
}
#generic-masterportal-logo.initial-fadeout-animation {
    opacity:0;
}
#generic-masterportal-logo img {
    width:100%;
}
@media (max-width: 1023px) {
    .vpi-loader-spinner-itself.default {
        border: 5px solid #AAAAAA;
    }
    #generic-masterportal-logo {
        bottom: 15%;
        left:50%;
        margin-left:-85px;
        border-radius: 14px;
    }
}
@media (min-width: 1024px) {
    #vpi-loader-spinner-itself.default {
        border: 8px solid #AAAAAA;
    }
    #generic-masterportal-logo {
        bottom: 0;
        right: 0;
        border-radius: 14px 0 0 0;
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
#portal-logo-box {
    opacity:1;
    transition:opacity 0.35s 3s;
    background-color:rgba(255,255,255,0.8);
    font-family: "MasterPortalFont Bold", "Arial Narrow", Arial, sans-serif;
    font-size:36px;
    margin-bottom:24px;
    padding:15px 40px 30px 40px;
    border-radius:14px;
    text-align:center;
}
@media (max-width: 767px) {
    #portal-logo-box {
        padding:15px 10px 30px 10px;
    }
}
#portal-logo-box.initial-fadeout-animation {
    opacity:0;
}
#portal-logo-main-title {
    margin:10px 0 8px 0;
}
#portal-logo-sub-title {
    font-size:0.75em;
    margin:8px 0 0 0;
}
/* End "Loader Overlay" */
</style>
