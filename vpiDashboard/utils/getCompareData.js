import generateDataArray from "./generateDataArray";

const getCompareData = {
    getCompareData (dataFromEndpoint, backgroundColor, endpoint, chartType) {
        const data = generateDataArray.generateDataArray(dataFromEndpoint, backgroundColor, endpoint, chartType);

        return data;
    }
};

export default getCompareData;
