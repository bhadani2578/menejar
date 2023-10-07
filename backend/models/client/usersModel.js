import db from "../../config/database.js";
import bcrypt from "bcryptjs";

export const getDashboardImg = (id, result) => {
  db.query(
    "SELECT admin_id FROM clients WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        const admin_id = results[0]["admin_id"];
        db.query(
          `SELECT image, cname, id FROM users WHERE id = ${admin_id}`,
          (err, results) => {
            if (err) {
              result(err, null);
            } else {
              result(null, results[0]);
            }
          }
        );
      }
    }
  );
};

//client password change
export const passwordChange = (data, result) => {
  let user_password = false;
  db.query(
    "SELECT password FROM client_projects WHERE client_id = ?",
    [data.id],
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
            "UPDATE client_projects SET password = ? WHERE client_id = ?",
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
