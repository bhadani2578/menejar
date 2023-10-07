import db from "../../config/database.js";
import bcrypt from "bcryptjs";

export const getStaffLogin = (email, result) => {
  db.query(
    "SELECT email, password FROM staff WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results[0]);
      }
    }
  );
};

export const getDashboardImg = (id, result) => {
  db.query("SELECT admin_id FROM staff WHERE id = ?", [id], (err, results) => {
    if (err) {
      result(err, null);
    } else {
      const admin_id = results[0]["admin_id"];
      db.query(
        `SELECT image, cname,id FROM users WHERE id = ${admin_id}`,
        (err, results) => {
          if (err) {
            result(err, null);
          } else {
            result(null, results[0]);
          }
        }
      );
    }
  });
};

export const staffPermission = (id, admin_id, result) => {
  db.query(
    "SELECT * FROM staff_permission WHERE staff_id = ? AND admin_id = ?",
    [id, admin_id],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results[0]);
      }
    }
  );
};

//staff password change
export const passwordChange = (data, result) => {
  let user_password = false;
  db.query(
    `SELECT password FROM staff WHERE id = ${data.id}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        const hash_pass = results[0].password;
        var salt = bcrypt.genSaltSync(10);
        const new_pass = bcrypt.hashSync(data.npassword, salt);
        user_password = bcrypt.compareSync(data.current_pass, hash_pass);
        if (user_password == true) {
          db.query(
            "UPDATE staff SET password = ? WHERE id = ?",
            [new_pass, data.id],
            (err, results) => {
              if (err) {
                result(err, null);
              } else {
                result("Password Change successfully.", results);
              }
            }
          );
        } else {
          result("invalid Current pass", results);
        }
      }
    }
  );
};
