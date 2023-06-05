import generateDataArray from "./generateDataArray";

const getCompareData = {
    getCompareData (dataFromEndpoint, label, backgroundColor, endpoint) {
        const data = generateDataArray.generateDataArray(dataFromEndpoint, label, backgroundColor, endpoint);

        return data;
    }
};

export default getCompareData;
