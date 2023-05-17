export const fromProductDao = (product) => {
    console.log(product)
    return {
        description: product.description.S,
        id: product.id.S,
        price: product.price.N,
        title: product.title.S,
        image: product.image.S
    }
}
