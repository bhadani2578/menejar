import db from "../../config/database.js";

//staff attendace list
export const getStaffAttendance = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  db.query(
    `SELECT date FROM attendance  WHERE staffid = ${data.staffid} AND date BETWEEN '${data.start_date}' AND '${data.end_date}'`,
    (err, length) => {
      if (err) {
        result(err, null);
      } else {
        db.query(
          `SELECT date,checkin,checkout,hours,isCheckout FROM attendance  WHERE staffid = ${data.staffid} AND date BETWEEN '${data.start_date}' AND '${data.end_date}' ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
          (err, results) => {
            if (err) {
              result(err, null);
            } else {
              const numberofPage = Math.ceil(results.length / limit);
              result({ results, page, numberofPage, length });
            }
          }
        );
      }
    }
  );
};

//staff checkin
export const checkin = (data, result) => {
  db.query(
    `SELECT date FROM attendance WHERE staffid = ${data.staffid} AND date = '${data.date}'`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        if (results.length == 0) {
          db.query("INSERT INTO attendance SET ?", [data], (err, results) => {
            if (err) {
              result(err, null);
            } else {
              result("Attendance Add", results);
            }
          });
        } else {
          result("Allready Checkin", results[0]);
        }
      }
    }
  );
};

//staff checkout
export const checkout = (data, result) => {
  db.query(
    `SELECT isCheckout FROM attendance WHERE staffid = ${data.staffid} AND date = '${data.date}' AND isCheckout = '${data.isCheckout}'`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        if (results.length == 0) {
          db.query(
            "UPDATE attendance SET  checkout = ?, hours = TIMEDIFF(?, checkin), isCheckout = ? WHERE staffid = ? AND date = ?",
            [
              data.checkout,
              data.checkout,
              data.isCheckout,
              data.staffid,
              data.date,
            ],
            (err, results) => {
              if (err) {
                result(err, null);
              } else {
                result("Checkout Successfully", results);
              }
            }
          );
        } else {
          result("Allready Checkout", results[0]);
        }
      }
    }
  );
};

//staff checkbox value
export const checkBox = (data, result) => {
  db.query(
    `SELECT isCheckout,date FROM attendance WHERE staffid = ${data.staffid} AND date = '${data.date}'`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        if (results.length == 0) {
          result("remove value", results[0]);
        } else {
          result(results);
        }
      }
    }
  );
};

//attendance summary
export const findSummary = (data, result) => {
  let xyz = "";
  if (data.start_date || data.end_date) {
    if (data.start_date && data.end_date) {
      xyz += `staffid= ${data.staffid} AND date BETWEEN '${data.start_date}' AND '${data.end_date}'`;
    } else if (data.start_date) {
      xyz += `staffid= ${data.staffid} AND date= '${data.start_date}'`;
    } else {
      xyz += `staffid= ${data.staffid} AND date= '${data.end_date}'`;
    }
  } else {
    xyz += `staffid = ${data.staffid}`;
  }
  db.query(
    `SELECT (SELECT SEC_TO_TIME( SUM( TIME_TO_SEC( hours ) ) ) FROM attendance WHERE isCheckout = 'Yes' AND ${xyz}) AS total_hours, (SELECT COUNT(isCheckout) FROM attendance WHERE isCheckout = 'yes' AND hours > '04:00:00' AND ${xyz}) AS full_day, (SELECT COUNT(isCheckout) FROM attendance WHERE hours <= '04:00:00' AND ${xyz}) AS half_day FROM attendance WHERE staffid = ${data.staffid}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(results[0]);
      }
    }
  );
};

//attendance filter query
export const attendanceFilter = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  let xyz = "";
  if (data.start_date || data.end_date) {
    if (data.start_date && data.end_date) {
      xyz += `staffid= ${data.staffid} AND date BETWEEN '${data.start_date}' AND '${data.end_date}'`;
    } else if (data.start_date) {
      xyz += `staffid= ${data.staffid} AND date= '${data.start_date}'`;
    } else {
      xyz += `staffid= ${data.staffid} AND date= '${data.end_date}'`;
    }
  } else {
    xyz += `staffid = ${data.staffid}`;
  }
  db.query(`SELECT date FROM attendance WHERE ${xyz}`, (err, length) => {
    if (err) {
      result(err, null);
    } else {
      db.query(
        `SELECT date,checkin,checkout,hours,isCheckout FROM attendance WHERE ${xyz} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
        (err, results) => {
          if (err) {
            result(err, null);
          } else {
            const numberofPage = Math.ceil(results.length / limit);
            result({ results, page, numberofPage, length });
          }
        }
      );
    }
  });
};
