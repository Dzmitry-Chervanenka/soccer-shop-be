import {S3Client} from "@aws-sdk/client-s3";
import {
    DynamoDBClient,
    PutItemCommand,
    PutItemCommandOutput,
    ScanCommand,
    ScanCommandInput,
    ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import toProductDao from "@functions/createProduct/toProductDao";
import {v4 as uuid} from 'uuid';
import {fromProductDao} from "@functions/getProductsList/fromProductDao";


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

    async getProductsWithStocks() {
        try {
            const scanProductsParams: ScanCommandInput = {
                TableName: process.env.PRODUCTS_TABLE_NAME,
            }
            const scanStocksParams: ScanCommandInput = {
                TableName: process.env.STOCKS_TABLE_NAME,
            }
            const client = new DynamoDBClient({});

            const products: ScanCommandOutput = await client.send(new ScanCommand( scanProductsParams))
            const stocks: ScanCommandOutput = await client.send(new ScanCommand(scanStocksParams))
            return products.Items.map((product) => ({
                ...fromProductDao(product),
                count: +stocks.Items.find(stock => stock.product_id.S === product.id.S)?.count?.N || 0
            }))
        } catch (e) {
            console.log('error')
            console.log(e)
        }
    }
    async getProductsWithStocksMock() {
        return [
            {
                "description": "Manchester City Home Jersey 2022/23 With 21/22 CHAMPIONS Printing",
                "id": "0451019c-17f2-4650-8301-21ce017db67c",
                "price": "85",
                "title": "Manchester City Champions Jersey",
                "image": "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw4b98bb90/images/large/701221508AI001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit",
                "count": 0
            },
            {
                "description": "Men Home shirt 22-23. Logo position: Left of the chest. Logo type: embroidered logo",
                "id": "1c99092b-f165-46fb-8aef-eb66a394c713",
                "price": "75",
                "title": "Bayern Munich T-shirt",
                "image": "https://img.fcbayern.com/image/upload/f_auto,q_auto,w_640/eCommerce/produkte/28800",
                "count": 0
            },
            {
                "description": "RBL Leipzig Überall Hoodie III",
                "id": "093e5c01-e8d0-48f9-87e3-baa269ac9478",
                "price": "60",
                "title": "Red Bull Hoodie",
                "image": "https://assets.redbullshop.com/images/f_auto,q_auto/t_product-detail-3by4/products/RBL/2023/RBL23097_45_M01/RBL-Leipzig-Ueberall-Hoodie-III.jpg",
                "count": 0
            },
            {
                "description": "The classic sky blue Home uniform features the iconic 'Olympia' eagle printed diagonally across the front of the jersey.",
                "id": "0af16e00-7ccd-45fd-8b99-b6926fd06d00",
                "price": "85",
                "title": "SS LAZIO HOME JERSEY 2022/23",
                "image": "https://www.laziostylestore.com/images/lazio/products/small/LZ22A01.webp",
                "count": 0
            },
            {
                "description": "Logo position: Lateral right Logo type: Printed logo Puzzle consisting of 1000 pieces",
                "id": "cbc74cb8-a8b1-4a2c-b597-1b25911a7021",
                "price": "17",
                "title": "Puzzle Team 22-23 1000 pieces",
                "image": "https://img.fcbayern.com/image/upload/f_auto,q_auto,w_640/eCommerce/produkte/31124",
                "count": 0
            },
            {
                "description": "Manchester City Away Jersey 2022/23 With FODEN 47 Printing",
                "id": "ed792c75-b660-4264-a89c-54082b9cb22c",
                "price": "35",
                "title": "Phil Foden Jersey",
                "image": "https://shop.mancity.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog-MAN/default/dw3ee08e3b/images/large/701221522DO001_pp_01_mcfc.png?sw=1600&sh=1600&sm=fit",
                "count": 0
            }
        ]
    }
}
export default ProductService