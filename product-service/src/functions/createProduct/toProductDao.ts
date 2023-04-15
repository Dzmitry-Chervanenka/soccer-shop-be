const toProductDao = (product) => {
    return {
        id: {S : product.id},
        title: {S: product.title},
        price: {N: product.price},
        description: {S: product.description}
    }
}

export default toProductDao;