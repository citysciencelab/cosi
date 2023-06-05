<script>
export default {
    name: "TabInfo"
};
</script>

<template>
    <div id="vpiDashboardTabInfo">
        <div class="section">
            <h1>{{ $t("additional:modules.tools.vpidashboard.tabitems.info") }}</h1>

            <div>
                <div>
                    <p>
                        Auf dieser Seite haben wir Informationen zusammengefasst, die Ihnen bei der Bedienung der
                        Anwendung helfen sollen.
                    </p>
                    <p>
                        Die Anwendung befindet sich zurzeit im Aufbau und wird ständig weiterentwickelt.
                    </p>
                </div>
            </div>
        </div>


        <div class="section">
            <h2>Beschreibung der Tabs</h2>

            <div>
                <h3>Tab "{{ $t("additional:modules.tools.vpidashboard.tabitems.individuals") }}"</h3>
                <div>
                    <p>
                        Dieser Tab beinhaltet Infokarten für eine Schnellübersicht sowie eine filterbare Grafik.
                    </p>

                    <div class="listBlock">
                        <strong class="listHeader">Infokarten:</strong>

                        <p>
                            Die Infokarten bieten einen direkten Zugriff auf vorausgewählte Daten.
                        </p>

                        <ul>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.avgVisitorsYear") }}"</strong>
                            </li>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.avgVisitorsDay") }}"</strong>
                                <p>
                                    Auswahlmöglichkeit: Wochentage
                                </p>
                            </li>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.avgVisitorsMonth") }}"</strong>
                                <p>
                                    Auswahlmöglichkeit: Monate
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div class="listBlock">
                        <strong class="listHeader">Grafik (Balken- und Liniendiagramm):</strong>

                        <p>
                            Durch folgende Optionen können die angezeigten Daten gefiltert werden.
                        </p>

                        <ul>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.allData") }}"</strong>
                            </li>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.dailyOverview") }}"</strong>
                            </li>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.monthlyOverview") }}"</strong>
                            </li>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.hourly") }}"</strong>
                                <p>
                                    Auswahlmöglichkeit: Datum
                                </p>
                            </li>
                            <li>
                                <strong>"{{ $t("additional:modules.tools.vpidashboard.unique.timeRange") }}"</strong>
                                <p>
                                    Auswahlmöglichkeit: Zeitraum (von/bis Datum)
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3>Tab "{{ $t("additional:modules.tools.vpidashboard.tabitems.gender") }}"</h3>
            </div>

            <div>
                <h3>Tab "{{ $t("additional:modules.tools.vpidashboard.tabitems.age") }}"</h3>
            </div>

            <div>
                <h3>Tab "{{ $t("additional:modules.tools.vpidashboard.tabitems.dwelltime") }}"</h3>
            </div>

            <div>
                <h3>Tab "{{ $t("additional:modules.tools.vpidashboard.tabitems.types") }}"</h3>
            </div>

            <div>
                <h3>Tab "{{ $t("additional:modules.tools.vpidashboard.tabitems.distance") }}"</h3>
            </div>
        </div>

        <div class="section">
            <h2>Datenquellen</h2>

            <div>
                <div>
                    <p>
                        Diese Anwendung nutzt Daten, die von der Firma
                        <a
                            href="https://www.whatalocation.ai/"
                            target="_blank"
                            rel="nofollow noopener"
                        >WHATALOCATION.ai</a> bereitgestellt werden.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#vpiDashboardTabInfo {

    padding: 0.25rem 0 0 0;

    H2,
    H3,
    H4 {
        font-size: 1rem;
        margin: 0;
        padding: 0;
        border: none;
        text-transform: none;
        font-weight: normal;
        line-height: normal;
    }

    H1,
    h2, {
        margin: 0 0 1.5rem 0;
        padding: 0 1rem 1rem 1rem;
        border-bottom: solid 1px var(--bs-gray-300);
    }

    h3,
    h4 {
        margin: 0 0 1rem 0;
    }

    h4 {
        font-size: 0.85rem;
    }

    p {
        margin: 0 0 1rem 0;
        color: var(--bs-black);
    }

    ul {
        padding: 0 0 0 1rem;

        li {
            margin: 0 0 1rem 0;
        }
    }

    .section {
        margin: 0 0 2rem 0;

        > div {
            margin: 0 0 2rem 0;
            padding: 0 1rem;

            .listHeader {
                display: inline-block;
                margin: 0 0 1rem 0;
                padding: 0 0 0.25rem 0;
                border-bottom: solid 1px var(--bs-gray-300);
            }

            .listBlock {
                margin: 0 0 2rem 0;
            }
        }
    }

}
</style>
