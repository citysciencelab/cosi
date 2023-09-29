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
                </div>
            </div>
        </div>


        <div class="section">
            <h2>Das Fachportal – Verborgene Potenziale Innenstadt</h2>

            <div>
                <p>
                    Das Fachportal - Verborgene Potenziale Innenstadt wurde im Rahmen des Förderprojektes
                    „Verborgene Potenziale – Für ein lebendiges und resilientes Hamburger Zentrum“ umgesetzt.
                    Ziel des vom Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen sowie der Freien und Hansestadt Hamburg
                    geförderten Projektes ist es, gemeinsam mit den Akteurinnen und Akteuren die Nutzungsvielfalt in der Hamburger Innenstadt zu stärken.
                    Weitere Informationen zum Projekt selbst können Sie unter folgendem Link aufrufen: <a href="https://www.hamburg.de/verborgene-potenziale/">https://www.hamburg.de/verborgene-potenziale/</a>
                </p>
                <p>
                    Der Innenstadtkoordination dient das Fachportal für den Austausch mit zentralen Innenstadtakteuren
                    sowie Bürgerinnen und Bürgern. Im Zusammenspiel mit unterschiedlichen Beteiligungsformaten ist es Ziel
                    des Projektes verborgene Potenziale der Innenstadt zu identifizieren und für den Umbauprozess in der Innenstadt nutzbar zu machen.
                    Das Fachportal – Verborgene Potenziale baut auf der Masterportal-Technologie des LGV auf.
                    Bestehende Werkzeuge und Fachdaten der Urban Data Platform werden für den fundierten Austausch in Workshops und
                    öffentlichen Beteiligungsgelegenheiten nutzbar. Das Portal wird kontinuierlich weiterentwickelt.
                    Interessierte die sich aktiv an der Entwicklung der Innenstadt beteiligen wollen finden weitere Informationen unter
                    <a href="https:\\verborgene-potenziale.beteiligung.hamburg">https:\\verborgene-potenziale.beteiligung.hamburg</a>.
                </p>
            </div>
        </div>

        <div class="section">
            <h2>VPI Dashboard</h2>

            <div>
                <p>
                    Mit dem VPI Dashboard lassen sich für definierte Standorte in den Innenstadt-Stadtteilen Hamburg-Neustadt, -Altstadt und HafenCity
                    Analysen zu Frequenzdaten wie Aktivitäten, Besucherzahlen, Besuchertypen oder Verweildauer durchführen. Darüber hinaus ermöglicht das
                    Dashboard den Vergleich unterschiedlicher Standorte und Zeiträume.
                </p>
                <p>
                    Für die Frequenzdaten werden Telekommunikationsdaten (Signaldaten) der Telefónica Deutschland GmbH & Co. OHG genutzt.
                    Das Bundesamt für Statistik aggregiert die Daten auf die gesamte Bundesbevölkerung innerhalb jeder Zelle hoch. Rund 90-95% werden so erfasst.
                    Die so für jede Mobilfunkzellen erhoben Daten ermöglichen eine flächendeckende Betrachtung des Passanten/Besucheraufkommens in der gesamten Innenstadt.
                </p>
                <p>
                    Im Folgenden finden Sie eine Beschreibung der einzelnen Tabs der Anwendung:
                    <ul>
                        <li>
                            <a href="#aktivitaeten">Tab Aktivitäten</a>
                        </li>
                        <li>
                            <a href="#besucher">Tab Besuchertypen</a>
                        </li>
                        <li>
                            <a href="#alter">Tab Altersgruppen</a>
                        </li>
                        <li>
                            <a href="#verweildauer">Tab Verweildauer</a>
                        </li>
                        <li>
                            <a href="#standort">Tab Standorte vergleichen</a>
                        </li>
                        <li>
                            <a href="#zeitraum">Tab Zeitraum vergleichen</a>
                        </li>
                    </ul>
                </p>
                <p>
                    Informationen zu den genutzten <a href="#datenquelle">Datenquellen</a> finden Sie am Ende dieses Dokuments.
                </p>
            </div>
        </div>

        <div class="section">
            <h2>Beschreibung der Tabs</h2>

            <div
                id="aktivitaeten"
                class="listBlock"
            >
                <strong class="listHeader">Aktivitäten</strong>

                <p>
                    Der Tab Aktivitäten setzt sich aus drei Datenkacheln und einer filterbaren Grafik zusammen.
                </p>
                <p>
                    Die Datenkacheln zeigen (von links nach rechts) die Aktivitäten (Events) eines Standortes pro Jahr und Monat sowie den Durchschnitt
                    pro Wochentag für das ausgewählte Kalenderjahr (2019 bis 2023) an. Beim Öffnen des VPI Dashboards wird in den Kacheln das aktuelle Kalenderjahr beginnend im
                    Januar und mit dem Wochentag Montag initial geladen. Die ausgewählten Merkmale werden grafisch als Diagramm dargestellt.
                    Über Pfeiltasten in den Kacheln lassen sich die Werte für Jahr, Monat und Wochentag ändern. Die Darstellung im Diagramm passt sich entsprechend an.
                    Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Die Standortauswahl ist sowohl über die Karte als auch den Adressfilter im Dashboard möglich.
                </p>
                <p>
                    Über die Filterfunktion „Datengrundlage für Grafik auswählen“ können weitere Daten geladen werden.
                </p>

                <p>Anzahl der monatlichen Besucher im Jahr:</p>
                <ul>
                    <li>
                        zeigt die Anzahl an Aktivitäten/Events je Monat an
                    </li>
                </ul>

                <p>Besucher Insgesamt seit 2019:</p>
                <ul>
                    <li>
                        stellt die Anzahl an Aktivitäten/Events über den Gesamtzeitraum seit Januar 2019 dar
                    </li>
                </ul>

                <p>durchschnittliche tägliche Aktivitäten im Monat:</p>
                <ul>
                    <li>
                        zeigt die durchschnittlichen Aktivitäten für den jeweiligen Wochentag im ausgewählten Jahr an
                    </li>
                </ul>

                <p>Besucher eines bestimmten Tages (stündlich):</p>
                <ul>
                    <li>
                        Stundenweise angezeigt werden die Aktivitäten für einen bestimmten Tag (00:00-24:00). Über die Kalenderfunktion lassen sich die Tage frei auswählen
                    </li>
                </ul>

                <p>Besucher einer bestimmten Zeitspanne (täglich):</p>
                <ul>
                    <li>
                        Über die Kalenderfunktion lässt sich ein Zeitraum wählen für den die Aktivitäten angezeigt werden sollen.
                    </li>
                </ul>
            </div>

            <div
                id="besucher"
                class="listBlock"
            >
                <strong class="listHeader">Besuchertypen</strong>

                <p>
                    Der Tab Besuchertypen besteht aus drei Datenkacheln und einem Stapeldiagramm. Die Ansicht lässt sich mit den Pfeiltasten über der mittleren Kachel jahresweise verändern.
                </p>
                <p>
                    Im Diagramm werden monatsweise die durchschnittlichen wöchentlichen Besucher im jeweiligen Kalenderjahr angezeigt.
                    In der Datenkachel Touristen pro Woche wurden Tages und Übernachtungstouristen zusammengefasst. Zur Herleitung der Besuchertypen wird die Mobilität
                    der Nutzer an mindestens 365 aufeinander folgenden Tagen gemessen. Aus den Mobilitätsmustern werden die Besuchertypen abgeleitet. Folgende Besuchertypen
                    werden unterschieden:
                </p>
                <ul>
                    <li>
                        Hamburger = Besucher kommt aus Hamburg
                    </li>
                    <li>
                        Pendler = Besucher die nicht in Hamburg leben aber regelmäßig von außerhalb in die Mobilfunkzelle kommen
                    </li>
                    <li>
                        Tagestouristen = Besucher die sich nicht regelmäßig und lediglich für einen Tag oder stundenweise und ohne Übernachtung in der Mobilfunkzelle aufhalten
                    </li>
                    <li>
                        Übernachtungstouristen = Besucher die sich mit Übernachtung für einen oder mehrere Tage in der Mobilfunkzelle aufhalten
                    </li>
                </ul>
            </div>

            <div
                id="alter"
                class="listBlock"
            >
                <strong class="listHeader">Altersgruppe</strong>

                <p>
                    Der Tab Altersgruppen besteht aus zwei Diagrammen die eine jährliche und monatsweise Betrachtung ermöglichen.
                    Über die Pfeiltasten oberhalb des Kreisdiagramms lassen sich die angezeigten Daten ändern. Dargestellt werden die durchschnittlichen,
                    wöchentlichen Besucher eines Monats im ausgewählten Kalenderjahr. Angaben zum Alter stammen aus den Mobilfunkverträgen der Besucher.
                    Diese werden anonymisiert zu Altersklassen aggregiert. Jedes Mobilfunkgerät und somit jeder Besucher der sich in einer Mobilfunkzelle aufhält
                    wird einmal für den Tag (00-24Uhr) gezählt. Unter 18-Jährige werden nicht erfasst. In der Altersgruppe der 18-19Jährigen bestehen Datenlücken,
                    weshalb der Datensatz ebenfalls nicht berücksichtigt wurde:
                </p>
                <ul>
                    <li>
                        20-29
                    </li>
                    <li>
                        30-39
                    </li>
                    <li>
                        40-49
                    </li>
                    <li>
                        50-59
                    </li>
                    <li>
                        60-69
                    </li>
                    <li>
                        >69
                    </li>
                </ul>
            </div>

            <div
                id="verweildauer"
                class="listBlock"
            >
                <strong class="listHeader">Verweildauer</strong>

                <p>
                    Die Verweildauer gibt an wie lange sich Besucher am jeweiligen Standort aufgehalten haben. Die Datenseite besteht aus zwei Diagrammen
                    die eine jährliche und monatsweise Betrachtung ermöglichen. Über die Pfeiltasten oberhalb des Kreisdiagramms lassen sich die angezeigten
                    Daten jahresweise ändern. Gezählt werden die durchschnittlichen wöchentlichen Besucher je Monat im jeweiligen Kalenderjahr.
                </p>
                <p>
                    Die Verweildauer ergibt sich aus der Zeit zwischen eingehendem und ausgehendem Mobilfunksignal je Mobilfunkzelle. Jedes Mobilfunkgerät
                    das sich in einer Mobilfunkzelle aufhält wird einmal für den Tag (00-24Uhr) gezählt. Die Verweildauer wird in vier Intervallen unterschieden:
                </p>
                <ul>
                    <li>
                        30-60 Minuten
                    </li>
                    <li>
                        60-120 Minuten
                    </li>
                    <li>
                        120-240 Minuten
                    </li>
                    <li>
                        240+ Minuten
                    </li>
                </ul>
            </div>

            <div
                id="standort"
                class="listBlock"
            >
                <strong class="listHeader">Standorte vergleichen</strong>

                <p>
                    Ermöglicht den Vergleich zweier Standorte für bestimmte Merkmale. Während Standort (A) standardmäßig vorausgewählt ist kann der Vergleichsstandort (B)
                    entweder über die Karte oder die Adressauswahl hinzugefügt werden. Ist der Haken im Kästchen „Deaktivieren …“ gesetzt lassen sich nur Adressen zu
                    Standort B über die Karte hinzufügen. Ist der Haken nicht gesetzt lassen sich auch Standorte für A über die Karte auswählen.
                </p>
                <p>
                    Über die Filterfunktion ist das Laden folgender Merkmale möglich:
                </p>
                <p class="paragraph_underline">
                    Besucher einer bestimmten Zeitspanne (täglich):
                </p>
                <ul>
                    <li>
                        Über die Kalenderfunktion lässt sich ein Zeitraum wählen, für den die Aktivitäten von Standort A und B in einem Diagramm angezeigt werden. Der Wechsel in der Darstellung zwischen Balken- und Liniendiagramm ist möglich. Unterhalb des Diagramms werden die Werte für Standort A und B zudem tabellarisch angezeigt.
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Besucher eines bestimmten Tages (stündlich):
                </p>
                <ul>
                    <li>
                        Für die Standorte A und B werden die Aktivitäten für einen bestimmten Tag (00:00-24:00) stundenweise angezeigt. Über die Kalenderfunktion lassen sich die Tage frei auswählen. In der Darstellung ist ein Wechsle zwischen Balken- und Liniendiagramm möglich. Unterhalb des Diagramms werden stundengenau die Werte für Standort A und B tabellarisch angezeigt.
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Altersgruppe:
                </p>
                <p>
                    Über die Kalenderfunktion lassen sich für Standort A und B die durchschnittlichen wöchentlichen Besucher je Monat im ausgewählten Kalenderjahr anzeigen. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Unterhalb des Diagramms werden die Werte nach Altersgruppen für Standort A und B tabellarisch angezeigt. Unter 18-Jährige werden nicht erfasst. In der Altersgruppe der 18-19Jährigen bestehen Datenlücken, weshalb der Datensatz ebenfalls nicht berücksichtigt wurde.
                </p>
                <ul>
                    <li>
                        20-29
                    </li>
                    <li>
                        30-39
                    </li>
                    <li>
                        40-49
                    </li>
                    <li>
                        50-59
                    </li>
                    <li>
                        60-69
                    </li>
                    <li>
                        >69
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Verweildauer:
                </p>
                <p>
                    Über die Kalenderfunktion lassen sich für Standort A und B die durchschnittlichen wöchentlichen Besucher je Monat im ausgewählten Kalenderjahr anzeigen. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Die Verweildauer gibt an wie lange sich Besucher am Standort A oder B aufgehalten haben. Unterhalb des Diagramms werden die Werte nach Zeitintervallen für Standort A und B tabellarisch angezeigt. Die Verweildauer unterscheidet zwischen vier Intervallen:
                </p>
                <ul>
                    <li>
                        30-60 Minuten
                    </li>
                    <li>
                        60-120 Minuten
                    </li>
                    <li>
                        120-240 Minuten
                    </li>
                    <li>
                        240+ Minuten
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Besuchertypen:
                </p>
                <p>
                    Über die Kalenderfunktion lassen sich für Standort A und B die durchschnittlichen wöchentlichen Besucher je Monat im ausgewählten Kalenderjahr anzeigen. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Folgende Besuchertypen werden unterschieden:
                </p>
                <ul>
                    <li>
                        Einwohner = Besucher kommt aus Hamburg
                    </li>
                    <li>
                        Pendler = Besucher die nicht in Hamburg leben aber regelmäßig von außerhalb in die Mobilfunkzelle kommen
                    </li>
                    <li>
                        Tagestouristen = Besucher die sich nicht regelmäßig und lediglich für einen Tag oder stundenweise und ohne Übernachtung in der Mobilfunkzelle aufhalten
                    </li>
                    <li>
                        Übernachtungstouristen = Besucher die sich mit Übernachtung für einen oder mehrere Tage in der Mobilfunkzelle aufhalten
                    </li>
                </ul>
            </div>
            <div
                id="zeitraum"
                class="listBlock"
            >
                <strong class="listHeader">Zeitraum vergleichen</strong>

                <p>
                    Ermöglicht die Betrachtung/den Vergleich spezifischer Merkmale eines Standortes zu unterschiedlichen Zeitpunkten. Über die Filterfunktion lassen sich folgende Merkmale laden:
                </p>
                <p class="paragraph_underline">
                    Besucher einer bestimmten Zeitspanne (täglich):
                </p>
                <ul>
                    <li>
                        Mit den Kalenderfunktionen lassen sich zwei Zeiträume bestimmen für die Aktivitäten im Diagramm angezeigt werden. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Unterhalb des Diagramms werden die Werte für Basisdatum und das Vergleichsdatum tabellarisch angezeigt.
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Besucher eines bestimmten Tages (stündlich):
                </p>
                <ul>
                    <li>
                        Stundenweise angezeigt werden die Aktivitäten für einen bestimmten Tag (00:00-24:00) für das Basis- und das Vergleichsdatum. Über die Kalenderfunktion lassen sich die Tage frei auswählen. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Unterhalb des Diagramms werden die stundengenauen Werte für Standort A und B tabellarisch angezeigt
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Altersgruppe:
                </p>
                <p>
                    Über die Kalenderfunktion lassen sich für Standort A und B die durchschnittlichen wöchentlichen Besucher je Monat anzeigen. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Unterhalb des Diagramms werden die Werte nach Altersgruppen für das Basisdatum und das Vergleichsdatum tabellarisch angezeigt. Unter 18-Jährige werden nicht erfasst. In der Altersgruppe der 18-19Jährigen bestehen Datenlücken, weshalb der Datensatz ebenfalls nicht berücksichtigt wurde.
                </p>
                <ul>
                    <li>
                        20-29
                    </li>
                    <li>
                        30-39
                    </li>
                    <li>
                        40-49
                    </li>
                    <li>
                        50-59
                    </li>
                    <li>
                        60-69
                    </li>
                    <li>
                        >69
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Verweildauer:
                </p>
                <p>
                    Über die Kalenderfunktion lassen sich für Basis- und Vergleichsdatum die durchschnittlichen wöchentlichen Besucher je Monat anzeigen. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Die Verweildauer gibt an wie lange sich Besucher am Basis- und Vergleichsdatum aufgehalten haben. Unterhalb des Diagramms werden die Werte nach Zeitintervallen für tabellarisch angezeigt. Die Verweildauer unterscheidet zwischen vier Intervallen:
                </p>
                <ul>
                    <li>
                        30-60 Minuten
                    </li>
                    <li>
                        60-120 Minuten
                    </li>
                    <li>
                        120-240 Minuten
                    </li>
                    <li>
                        240+ Minuten
                    </li>
                </ul>
                <p class="paragraph_underline">
                    Besuchertypen:
                </p>
                <p>
                    Über die Kalenderfunktion lassen sich für das Basis- und das Vergleichsdatum die durchschnittlichen wöchentlichen Besucher je Monat anzeigen. Der Wechsel zwischen Balken- und Liniendiagramm ist möglich. Folgende Besuchertypen werden unterschieden:
                </p>
                <ul>
                    <li>
                        Einwohner = Besucher kommt aus Hamburg
                    </li>
                    <li>
                        Pendler = Besucher die nicht in Hamburg leben aber regelmäßig von außerhalb in die Mobilfunkzelle kommen
                    </li>
                    <li>
                        Tagestouristen = Besucher die sich nicht regelmäßig und lediglich für einen Tag oder stundenweise und ohne Übernachtung in der Mobilfunkzelle aufhalten
                    </li>
                    <li>
                        Übernachtungstouristen = Besucher die sich mit Übernachtung für einen oder mehrere Tage in der Mobilfunkzelle aufhalten
                    </li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2 id="datenquelle">
                Datenquellen
            </h2>

            <div>
                <p>
                    Als Datengrundlage dienen Signalisierungsdaten der Telefónica Deutschland GmbH & Co. OHG, welche anonymisiert über den Dienstleister WhatAlocation und via API-Schnittstelle im VPI Dashboard bereitgestellt werden. Erfasst werden sogenannte Events, die im regulären Geschäftsbetrieb standardmäßig als Kommunikation zwischen Mobilfunkgerät und Mobilfunkzelle anfallen. Die mittlere Anzahl an Events pro Gerät beträgt täglich etwa 270. Für die Darstellung der Aktivitäten eines Standorts wird die Gesamtzahl der Events pro Gerät innerhalb einer Mobilfunkzelle genutzt. Dieses Vorgehen ist mit anderen Erhebungsmethoden wie Laserscanning oder der visuellen Passanten Zählung vergleichbar bei denen ebenfalls nicht die Personen sondern die Anzahl an Aktivitäten erfasst werden. Bei den Merkmalen Besuchertypen, Altersgruppe und Verweildauer bildet die Anzahl an Geräten innerhalb einer Mobilfunkzelle die entsprechende Bezugsgröße, weshalb die Werte im Vergleich zu den Aktivitäten niedriger ausfallen. Die Daten für Besuchertypen, Altersgruppen und Verweildauer werden mit einer zeitlichen Verzögerung von einigen Monaten bereitgestellt. Daten zu Aktivitäten können mit einer zeitlichen Verzögerung von bis zu 7 Tagen bereitgestellt werden.
                </p>
                <p>
                    WhatAlocation ist ein in Deutschland ansässiges Unternehmen, welches die Signaldaten in einem mit dem Bundesbeauftragten für Datenschutz und die Informationsfreiheit (BfDI) abgestimmten Verfahren DSGVO-Konform anonymisiert und aggregiert bereitstellt, um daraus Erkenntnisse zu Aufenthalts- und Bewegungsverhalten zu generieren.
                </p>
                <p>
                    Für das Anlegen und Erstellen der im Dashboard angezeigten Standorte wird die Applikation von WhatAlocation genutzt.
                    <a
                        href="https://www.whatalocation.ai/"
                        target="_blank"
                        rel="nofollow noopener"
                    >WHATALOCATION.ai</a>
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#vpiDashboardTabInfo {

    padding: 0.25rem 0 1.5rem 0;

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
    .paragraph_underline {
        text-decoration: underline;
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
