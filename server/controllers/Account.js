const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login')
};

const signupPage = (req, res) => {
  res.render('signup');
};

const logout = (req, res) => {
  res.redirect('/');
};

const login = (_req, _res) => {
  const req = _req;
  const res = _res;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    return res.json({ redirect: '/maker' });
  });
};

const signup = (_req, _res) => {
  const req = _req;
  const res = _res;
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    newAccount.save().then(() => {
      res.json({ redirect: '/maker' });
    }).catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: "Username already in use." });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  })
};

module.exports = { loginPage, login, logout, signupPage, signup };