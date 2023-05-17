import {S3Client} from "@aws-sdk/client-s3";
import {DynamoDBClient, PutItemCommand, PutItemCommandOutput} from "@aws-sdk/client-dynamodb";
import toProductDao from "@functions/createProduct/toProductDao";
import { v4 as uuid } from 'uuid';


class ProductService {
    private static instance: ProductService;
    protected dynamoDbClient: DynamoDBClient;
    protected s3Client: S3Client;
    private constructor() {
        this.dynamoDbClient = new DynamoDBClient({region: "eu-north-1"});
        this.s3Client = new S3Client({region: "eu-north-1"})
    }
    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }

        return ProductService.instance;
    }

    async createProduct(data: {title: string; price: string;description: string; image?:string;}): Promise<PutItemCommandOutput> {
        try {
            console.log(data.title)
            const params = {
                TableName: process.env.PRODUCTS_TABLE_NAME || "",
                Item: toProductDao({
                    id: uuid(),
                    title: data.title || "",
                    price: data.price || "0",
                    description: data.description || "",
                    image: data.image || ""
                })
            };
            console.log(params)
            const resp: PutItemCommandOutput = await this.dynamoDbClient.send(new PutItemCommand(params))
            console.log(resp)
            return resp
        }catch (e) {
            console.log('err')
            console.log(e)
        }
        console.log(data.title)
    }
}
export default ProductService