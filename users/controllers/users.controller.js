const UserModel = require("../models/users.model");
const crypto = require("crypto");

exports.insert = (req, res) => {
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  req.body.permissionLevel = 1;
  UserModel.createUser(req.body).then((result) => {
    res.status(201).send({ id: result._id });
  });
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  UserModel.list(limit, page).then((result) => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  UserModel.findById(req.params.userId).then((result) => {
    res.status(200).send(result);
  });
};
exports.patchById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }

  UserModel.patchUser(req.params.userId, req.body).then((result) => {
    res.status(204).send({});
  });
};

exports.patchUser = (id, userData) => {
  return User.findOneAndUpdate(
    {
      _id: id,
    },
    userData
  );
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  UserModel.list(limit, page).then((result) => {
    res.status(200).send(result);
  });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (err, users) {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
  });
};

exports.getById = (req, res) => {
  UserModel.findById(req.params.userId).then((result) => {
    res.status(200).send(result);
  });
};

exports.removeById = (userId) => {
  return new Promise((resolve, reject) => {
    User.deleteMany({ _id: userId }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};
exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId).then((result) => {
    res.status(204).send({});
  });
};

exports.login = (req, res) => {
  try {
    let refreshId = req.body.userId + jwtSecret;
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(refreshId)
      .digest("base64");
    req.body.refreshKey = salt;
    let token = jwt.sign(req.body, jwtSecret);
    let b = Buffer.from(hash);
    let refresh_token = b.toString("base64");
    res.status(201).send({ accessToken: token, refreshToken: refresh_token });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
};
