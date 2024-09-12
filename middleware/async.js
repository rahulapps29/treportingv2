const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      console.log("a");
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncWrapper;
