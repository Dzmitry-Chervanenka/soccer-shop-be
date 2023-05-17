const toProductDao = (product) => {
    return {
        id: {S : product.id},
        title: {S: product.title},
        price: {N: product.price},
        description: {S: product.description},
        image: {S: product.image}
    }
}

export default toProductDao;