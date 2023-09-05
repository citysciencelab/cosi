/**
 * @param {array} chapter is part that gets added to chapters after each iteration through the json array
 * @param {array} docDefinition an object used by pdfMake to maintain the overall structure of the document
 * @return {array} the function returns value of chapter
 */
export function addChapter (chapter, docDefinition) {
    // title, desc, tool, settings are attributes of json file of ReportTemplate with optional styles
    const title = {text: chapter.title, style: "header", bold: true, fontSize: 14},
        desc = {text: chapter.description, style: "header"},
        tool = {text: chapter.tool, style: "header"};
    let sourceInfo = "Quelleninformation fehlt.";

    if (chapter.output.sourceInfo) {

        sourceInfo = Object.values(chapter.output.sourceInfo).map((metadata)=>{

            const metadata_no_html_p_tags = metadata;

            // remove html tags
            metadata_no_html_p_tags.Abstrakt = metadata.Abstrakt.replace(/<p>/g, "\n").replace(/<\/p>/g, "\n");
            return Object.values(metadata_no_html_p_tags).map((info, index)=>{
                return Object.keys(metadata_no_html_p_tags)[index] + ": " + info;
            });
        });
        sourceInfo = sourceInfo.map(x=>{ // add line breaks between sources
            return [x, "\n"];
        });
    }

    docDefinition.content.push(title);
    docDefinition.content.push("\n"); // add line break
    docDefinition.content.push(desc);
    docDefinition.content.push("\n"); // add line break
    docDefinition.content.push(tool);
    docDefinition.content.push("\n"); // add line break

    // if the property type is table, then we return the array of headers and body. Headers are for the table headers and body is set of values
    if (chapter.output.type === "table") {

        const headers = Object.keys(chapter.output.result[0]).map(header => ({
                border: [false, false, false, true],
                fillColor: "#dddddd",
                text: header
            })),

            body = chapter.output.result.map(row => Object.values(row));

        docDefinition.content.push({
            table: {
                headerRows: 1,
                body: [headers, ...body]
            },
            fontSize: 8,
            pageBreak: "after"
        });
    }

    // if the property type is image, we put the image into content of docDefinition
    if (chapter.output.type === "image") {

        docDefinition.content.push({
            image: chapter.output.result,
            width: 500,
            pageBreak: "after"
        });
    }

    docDefinition.content.push("\n"); // add line break
    docDefinition.content.push("\n");
    docDefinition.content.push("Datenquellen:\n\n", sourceInfo);

    return docDefinition;
}
