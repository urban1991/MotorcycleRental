class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  static formatQuery(query) {
    if (Array.isArray(query)) {
      query = query.join(" ");
    }
    return query.replaceAll(",", " ");
  }

  filter() {
    const queryObj = {...this.queryString};
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query.sort(this.constructor.formatQuery(this.queryString.sort));
      return this;
    }

    this.query.sort("-createdAt");
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;

    const skippedRecords = (page - 1) * limit;
    this.query = this.query.skip(skippedRecords).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
