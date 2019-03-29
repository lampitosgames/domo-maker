const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };
  const newDomo = new Domo.DomoModel(domoData);
  return newDomo.save().then(() => {
    res.json({ redirect: '/maker' });
  }).catch((err) => {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }
    return res.status(400).json({ error: 'An error occured' });
  });
};

const getDomos = (_req, _res) => {
  const req = _req;
  const res = _res;
  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ domos: docs });
  });
};

module.exports = { makerPage, makeDomo, getDomos };
