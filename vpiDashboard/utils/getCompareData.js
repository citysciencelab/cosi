import generateDataArray from "./generateDataArray";

const getCompareData = {
    getCompareData (dataFromEndpoint, backgroundColor, endpoint) {
        const data = generateDataArray.generateDataArray(dataFromEndpoint, backgroundColor, endpoint);

        return data;
    }
};

export default getCompareData;
