const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

// const getAlldynamicIn = async (req, res) => {
//   const tasks = await Task.find({});
//   return res.status(200).json({ tasks });
// };

const getAlldynamicIn = async (req, res) => {
  console.log(req.query);

  const {
    completed,
    company,
    desc,
    year_month,
    sort,
    fields,
    numericFilters,
    transtype,
  } = req.query;
  const queryObject = {};

  if (completed) {
    queryObject.completed = completed === "true" ? true : false;
  }

  // if (company) {
  //   queryObject.company = company;
  // }

  if (year_month) {
    queryObject.year_month = { $regex: year_month, $options: "i" };
  }

  if (desc) {
    queryObject.desc = { $regex: desc, $options: "i" };
  }

  if (transtype) {
    queryObject.transtype = { $regex: transtype, $options: "i" };
  }

  if (numericFilters) {
    const opeartorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$e",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${opeartorMap[match]}-`
    );
    console.log(filters);

    const options = ["amt"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    console.log(numericFilters);
  }

  console.log(queryObject);

  let result = Task.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-tdate");
  }
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10000;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  console.log(page);
  console.log(limit);
  const tasks = await result;
  res.status(200).json({ tasks, transCount: tasks.length });
};

const getAlldynamic = asyncWrapper(getAlldynamicIn);

module.exports = {
  getAlldynamic,
};
