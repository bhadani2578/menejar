import {
  getStaffLogin,
  getDashboardImg,
  staffPermission,
  passwordChange,
} from "../../models/user/usersModel.js";
import bcrypt from "bcryptjs";

import db from "../../config/database.js";
import jwt from "jsonwebtoken";
let id = "";

// staff login
export const staffLogin = (req, res) => {
  const user_email = req.body.email;
  let user_password = false;
  const password = req.body.password;

  db.query(
    "SELECT id, password FROM staff WHERE email = ?",
    [user_email],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const data = results[0];
        if (data !== undefined) {
          const hash_pass = results[0].password;
          user_password = bcrypt.compareSync(password, hash_pass);
          id = results[0].id;
        }
      }
    }
  );
  getStaffLogin(user_email, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      const email = results;
      if (email !== undefined) {
        if (email.email == user_email && user_password == true) {
          let token = jwt.sign({ userId: id }, "secretkey");
          res.status(200).json({ title: "Login Success", token: token });
        } else {
          res.status(200).json({ title: "Invalid Creadintial" });
        }
      } else {
        res.status(200).json({ title: "Invalid Creadintial" });
      }
    }
  });
};

//get staff details
export const getStaff = (req, res) => {
  let token = req.body.headers.token; //token
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "unauthorized",
      });
    const tokenid = decoded.userId;
    db.query("SELECT * FROM staff WHERE id = ?", [tokenid], (err, results) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({
          title: "staff grabbed",
          user: {
            id: results[0].admin_id,
            staffid: results[0].id,
            name: results[0].name,
            email: results[0].email,
            phone: results[0].phone,
            address: results[0].address,
            photo: results[0].photo,
            doc1: results[0].doc1,
            doc2: results[0].doc2,
            doc3: results[0].doc3,
            doc4: results[0].doc4,
            note: results[0].note,
            createdDate: results[0].createdDate,
          },
        });
      }
    });
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

//get staff permission
export const getPermission = (req, res) => {
  var u_id;
  let token = req.body.headers.token; //token
  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: "unauthorized",
      });
    if (req.body.type == "admin") {
      u_id = req.body.id;
    } else {
      u_id = decoded.userId;
    }
    const admin_id = req.body.admin_id;
    staffPermission(u_id, admin_id, (err, results) => {
      if (err) {
        res.send(err);
      } else {
        res.json(results);
      }
    });
  });
};

//staff password change
export const staffChangePass = (req, res) => {
  const data = req.body;
  passwordChange(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
