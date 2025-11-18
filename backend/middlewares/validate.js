function validate(schema) {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync(
        { body: req.body, params: req.params, query: req.query },
        { abortEarly: false, stripUnknown: true }
      );
      req.body = value.body ?? req.body;
      req.params = value.params ?? req.params;
      req.query = value.query ?? req.query;
      next();
    } catch (err) {
      return res.status(400).json({
        message: 'Ошибка валидации',
        details: err.details?.map((d) => d.message) ?? [],
      });
    }
  };
}

module.exports = validate;


