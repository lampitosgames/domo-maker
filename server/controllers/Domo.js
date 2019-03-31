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
  if (!req.body.name || !req.body.age || !req.body.height) {
    return res.status(400).json({ error: 'RAWR! Name, age, and height are all required' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
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

const deleteDomo = (_req, _res) => {
  const req = _req;
  const res = _res;
  return Domo.DomoModel.deleteDomo(
    req.session.account._id,
    req.body.name,
    req.body.age,
    req.body.height,
    (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ redirect: '/maker' });
    });
};

module.exports = { makerPage, makeDomo, getDomos, deleteDomo };
