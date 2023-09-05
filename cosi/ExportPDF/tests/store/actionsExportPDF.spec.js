import sinon from "sinon";
import {expect} from "chai";
import actions from "../../../store/actionsExportPDF.js";
import pdfMake from "pdfmake";

const EXAMPLECHAPTERS = [],
    EXAMPLEDOCDEF = [];

describe("actionsExportPDF", () => {
    const downloadStub = sinon.stub();

    sinon.stub(pdfMake, "createPdf").returns({
        download: downloadStub
    });
    describe("reportTemplateToPDF", () => {
        const stubDispatch = sinon.stub(),
            docDefinition = actions.reportTemplateToPDF({
                dispatch: stubDispatch
            }, EXAMPLECHAPTERS);

        expect(docDefinition).to.be.deep.equal(EXAMPLEDOCDEF);
        expect(stubDispatch.calledOnceWith("downloadPDF", docDefinition)).to.be.true;
    });
});
