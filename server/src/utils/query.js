async function getPagination(query) {
    const page = Math.abs(query.page) || 1;
    const limit = Math.abs(query.limit || 0); // for mongo, limit 0 is the same as all records

    const skip = (page-1) * limit

    return {
        skip,
        limit,
    }
};

module.exports= {
    getPagination,
}