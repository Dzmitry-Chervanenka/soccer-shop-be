import {formatJSONResponse} from "@libs/api-gateway";

const catalogBatchProcess= async (event) => {

    return formatJSONResponse({products: 'resp'})
};
