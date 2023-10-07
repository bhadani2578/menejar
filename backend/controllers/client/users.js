import jwt from "jsonwebtoken";
import db from "../../config/database.js";

import {
  getDashboardImg,
  passwordChange,
} from "../../models/client/usersModel.js";

//get client details
export const getClient = (req, res) => {
  let token = req.params.id; //token
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "unauthorized",
      });
    const tokenid = decoded.userId;
    db.query(
      "SELECT id,name,admin_id FROM clients WHERE id = ?",
      [tokenid],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json({
            title: "client grabbed",
            user: {
              name: results[0].name,
              id: results[0].id,
              admin_id: results[0].admin_id,
            },
          });
        }
      }
    );
  });
};

export const getDashImage = (req, res) => {
  let token = req.body.headers.token; //token
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "unauthorized",
      });
    const id = decoded.userId;
    getDashboardImg(id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  });
};

// client password change
export const clientChangePass = (req, res) => {
  const data = req.body;
  passwordChange(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
