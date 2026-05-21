const sushiModel = require('../models/sushiModel');

module.exports.listSushis = async (req, res, next) => {
  try {
    const sushis = await sushiModel.listByUser(req.session.user_id);
    res.json(sushis);
  } catch (err) {
    next(err);
  }
};

module.exports.createSushi = async (req, res, next) => {
  try {
    const { title, description, matrix } = req.body;

    if (!title || !description || !Array.isArray(matrix)) {
      return res.status(400).json({
        error: 'Title, description, and matrix are required.',
      });
    }

    const sushi = await sushiModel.create(
      title,
      description,
      matrix,
      req.session.user_id
    );

    res.status(201).json(sushi);
  } catch (err) {
    next(err);
  }
};

module.exports.updateSushi = async (req, res, next) => {
  try {
    const { sushi_id } = req.params;

    const sushi = await sushiModel.find(sushi_id);

    if (!sushi) {
      return res.status(404).send({ error: 'Sushi not found.' });
    }

    if (Number(sushi.user_id) !== Number(req.session.user_id)) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const updatedSushi = await sushiModel.update(
      sushi_id,
      req.body
    );

    res.json(updatedSushi);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteSushi = async (req, res, next) => {
  try {
    const { sushi_id } = req.params;

    const sushi = await sushiModel.find(sushi_id);

    if (!sushi) {
      return res.status(404).send({ error: 'Sushi not found.' });
    }

    if (Number(sushi.user_id) !== Number(req.session.user_id)) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    const destroyedSushi = await sushiModel.destroy(sushi_id);

    res.json(destroyedSushi);
  } catch (err) {
    next(err);
  }
};
