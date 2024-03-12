import pdfMake from "pdfmake";
import addChapter from "../utils/addChapter";

/**
 *
 *  This function converts data from reportTemplates to pdf
 * @param {Object} _ vuex context
 * @param {Object} chapters reportTempate addon's templateItems definition as payload
 * @returns {void}
 *
 */
function reportTemplateToPDF (_, chapters) {
    let docDefinition = {
        content: [],
        pageOrientation: "landscape",
        pageSize: "A4"
    };

    for (const chapter of chapters) {
        docDefinition = addChapter(chapter, docDefinition);
    }

    // Here we call the pdfMake function to render pdf from the docDefinition
    pdfMake.createPdf(docDefinition).download("ReportTemplate.pdf");
}


export default {
    reportTemplateToPDF

};
