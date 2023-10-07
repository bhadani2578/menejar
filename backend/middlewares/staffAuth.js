import db from "../config/database.js";

export const authorizeStaff = (req, res, next) => {
  const data = req.body;
  console.log("bodyyyyyy", data)
  const staff_id = data.staff_id | data.staffid;
    db.query(
      `SELECT is_active from staff WHERE id = ${staff_id}`,
      (err, results) => {
        if (err) {
          err, null;
        } else {
          console.log("status::", results[0].is_active);
          if (results[0].is_active == 1) {
            next();
          } else {
            res.json({ error: "Not Authorized" });
          }
        }
      }
    );
  };
