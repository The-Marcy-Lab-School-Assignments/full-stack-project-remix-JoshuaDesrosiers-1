const sushiModel = require('../models/sushiModel');

module.exports.listTodos = async (req, res, next) => {
  try {
    const sushis = await sushiModel.listByUser(req.session.user_id);
    res.send(sushis);
  } catch (err) {
    next(err);
  }
};

module.exports.createTodo = async (req, res, next) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).send({ error: 'Title is required.' });
    const sushi = await sushiModel.create(data, req.session.user_id);
    res.status(201).send(sushi);
  } catch (err) {
    next(err);
  }
};

module.exports.updateTodo = async (req, res, next) => {
  try {
    const { sushi_id } = req.params;
    const sushi = await sushiModel.find(sushi_id);
    if (!sushi) return res.status(404).send({ error: 'Todo not found.' });
    if (sushi.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedTodo = await sushiModel.update(sushi_id, req.body);
    res.send(updatedTodo);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTodo = async (req, res, next) => {
  try {
    const { sushi_id } = req.params;

    // First find the sushi to verify ownership
    const sushi = await sushiModel.find(sushi_id);
    if (!sushi) return res.status(404).send({ error: 'Todo not found.' });
    if (sushi.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the sushi only after ownership has been verified
    const destroyedTodo = await sushiModel.destroy(sushi_id);
    res.send(destroyedTodo);
  } catch (err) {
    next(err);
  }
};
