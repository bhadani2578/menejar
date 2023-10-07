import db from "../../config/database.js";
import mail_api from "../../config/mailAuth.js";
import { Curl } from "node-libcurl";

export const generateLeave = (data, result) => {
  let staff_email, staff_name, date;
  var reason, start_date, end_date, total_day, comments, admin_name;
  db.query("INSERT INTO staff_leave SET ?", [data], (err, results) => {
    if (err) {
      result(err, null);
    } else {
      result("Leave Generate", results);
    }
  });
  db.query(
    `select name,email from staff where is_status = '1' AND id = ${data.staff_id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        staff_email = results[0]["email"];
        staff_name = results[0]["name"];
        date = new Date().toLocaleDateString();
      }
    }
  );
  db.query(
    `Select email, fullname, image from users where id = ${data.admin_id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        var admin_email = results[0]["email"];
        admin_name = results[0]["fullname"];
        var image = results[0]["image"];
        reason = data.leave_type;
        start_date = data.start_date.split("-").reverse().join("-");
        end_date = data.end_date.split("-").reverse().join("-");
        total_day = data.total_day;
        comments = data.comments;
        const curl = new Curl();
        var fieldsStr = `{"from": {"email": "noreply@menejar.com", "name": "${admin_name}"}, "personalizations": [{"to": [{"email": "${admin_email}"}], "dynamic_template_data":{"subject": "Leave Request - ${staff_name} - ${start_date}","image":"${image}", "names":"${admin_name}","reason": "${reason}", "start_date": "${start_date}", "end_date": "${end_date}", "total_date": "${total_day}", "comments": "${comments}"}}], "TEMPLATE_ID":"d-9136baa31f5e456897f210d147678af4"}`;
        curl.setOpt(Curl.option.URL, "https://api.sendgrid.com/v3/mail/send");
        curl.setOpt(Curl.option.POST, true);
        curl.setOpt(Curl.option.POSTFIELDS, fieldsStr);
        curl.setOpt(Curl.option.HTTPHEADER, [
          `Authorization: Bearer ${mail_api}`,
          "Content-Type: application/json",
        ]);
        curl.perform();
        curl.on("error", curl.close.bind(curl));
        curl.close.bind(curl);
      }
    }
  );
};

//staff leave list
export const staffLeaveList = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  db.query(
    `SELECT staff_id FROM staff_leave WHERE staff_id = ${data.staff_id}`,
    (err, length) => {
      if (err) {
        result(err, null);
      } else {
        db.query(
          `SELECT id,created_at,start_date,end_date,total_day,is_status FROM staff_leave WHERE staff_id = ${data.staff_id} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
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

//display leave by id
export const getLeaveById = (id, result) => {
  db.query(
    `SELECT id,leave_type,start_date,end_date,comments,total_day FROM staff_leave WHERE id = ${id}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results[0]);
      }
    }
  );
};

//update leave by id
export const updateLeaveById = (data, id, result) => {
  var leave_date, reason, start_date, end_date, total_day, comments, admin_name;
  db.query(
    `UPDATE staff_leave SET  leave_type = ?, start_date = ?, end_date = ?, total_day = ?, comments = ? WHERE id = ${id}`,
    [
      data.leave_type,
      data.start_date,
      data.end_date,
      data.total_day,
      data.comments,
    ],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result("Leave updated", results);
      }
    }
  );
  db.query(
    `select start_date from staff_leave where id = ${id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        leave_date = results[0]["start_date"].toLocaleDateString();
      }
    }
  );
  db.query(
    `Select email, fullname, image from users where id = ${data.admin_id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        var admin_email = results[0]["email"];
        admin_name = results[0]["fullname"];
        var image = results[0]["image"];
        reason = data.leave_type; // replace {{name}} with Adebola
        start_date = data.start_date.split("-").reverse().join("-"); // replace {{company}} with My Company
        end_date = data.end_date.split("-").reverse().join("-");
        total_day = data.total_day;
        comments = data.comments;
        const curl = new Curl();
        var fieldsStr = `{"from": {"email": "noreply@menejar.com", "name": "${admin_name}"}, "personalizations": [{"to": [{"email": "${admin_email}"}], "dynamic_template_data":{"subject": "Update Leave Request - ${
          data.staff_name
        } - ${leave_date.replaceAll(
          "/",
          "-"
        )}","image":"${image}", "names":"${admin_name}","reason": "${
          data.leave_type
        }", "start_date": "${start_date}", "end_date": "${end_date}", "total_date": "${
          data.total_day
        }", "comments": "${
          data.comments
        }"}}], "TEMPLATE_ID":"d-9136baa31f5e456897f210d147678af4"}`;
        curl.setOpt(Curl.option.URL, "https://api.sendgrid.com/v3/mail/send");
        curl.setOpt(Curl.option.POST, true);
        curl.setOpt(Curl.option.POSTFIELDS, fieldsStr);
        curl.setOpt(Curl.option.HTTPHEADER, [
          `Authorization: Bearer ${mail_api}`,
          "Content-Type: application/json",
        ]);
        curl.perform();
        curl.on("error", curl.close.bind(curl));
        curl.close.bind(curl);
      }
    }
  );
};

export const cancleLeaveById = (id, data, result) => {
  let leave_type,
    comments,
    start_date,
    end_date,
    total_day,
    leave_date,
    admin_name;
  db.query(
    `UPDATE staff_leave SET is_status = '3' WHERE id = ${id}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result("Leave Cancle", results);
      }
    }
  );
  db.query(
    `select leave_type,start_date,end_date,total_day,comments,start_date from staff_leave where id = ${id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        leave_type = results[0]["leave_type"];
        start_date = results[0]["start_date"].toLocaleDateString();
        end_date = results[0]["end_date"].toLocaleDateString();
        total_day = results[0]["total_day"];
        comments = results[0]["comments"];
        leave_date = results[0]["start_date"].toLocaleDateString();
      }
    }
  );
  db.query(
    `Select email, fullname, image from users where id = ${data.admin_id}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        var admin_email = results[0]["email"];
        admin_name = results[0]["fullname"];
        var image = results[0]["image"];
        const curl = new Curl();
        var fieldsStr = `{"from": {"email": "noreply@menejar.com", "name": "${admin_name}"}, "personalizations": [{"to": [{"email": "${admin_email}"}], "dynamic_template_data":{"subject": "Cancle Leave - ${
          data.staff_name
        } - ${leave_date.replaceAll(
          "/",
          "-"
        )}","image":"${image}","name":"${admin_name}","reason": "${leave_type}", "start_date": "${start_date.replaceAll(
          "/",
          "-"
        )}", "end_date": "${end_date.replaceAll(
          "/",
          "-"
        )}", "total_date": "${total_day}", "comments": "${comments}"}}], "TEMPLATE_ID":"d-30eb8ce30899413bad70ec50b47f4f2c"}`;
        curl.setOpt(Curl.option.URL, "https://api.sendgrid.com/v3/mail/send");
        curl.setOpt(Curl.option.POST, true);
        curl.setOpt(Curl.option.POSTFIELDS, fieldsStr);
        curl.setOpt(Curl.option.HTTPHEADER, [
          `Authorization: Bearer ${mail_api}`,
          "Content-Type: application/json",
        ]);
        curl.perform();
        curl.on("error", curl.close.bind(curl));
        curl.close.bind(curl);
      }
    }
  );
};

//attendance summary
export const findSummary = (data, result) => {
  db.query(
    `SELECT (SELECT SUM(total_day) FROM staff_leave WHERE staff_id = ${data.staff_id} AND is_status = '0') AS pending_leave, (SELECT SUM(total_day) FROM staff_leave WHERE staff_id = ${data.staff_id} AND is_status = '1') AS total_leave, (SELECT SUM(total_day) FROM staff_leave WHERE staff_id = ${data.staff_id} AND is_status = '1') AS approve_leave, (SELECT SUM(total_day) FROM staff_leave WHERE staff_id = ${data.staff_id} AND is_status = '2') AS reject_leave, (SELECT SUM(total_day) FROM staff_leave WHERE staff_id = ${data.staff_id} AND is_status = '3') AS cancle_leave FROM staff_leave WHERE staff_id = ${data.staff_id}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(results[0]);
      }
    }
  );
};

//leave filter query
export const leaveFilter = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  let xyz = "";
  if (
    data.start_date !== "" &&
    data.end_date !== "" &&
    data.leave_type !== ""
  ) {
    xyz += `staff_id = ${data.staff_id} AND start_date >= "${data.start_date}" AND end_date <= "${data.end_date}" AND is_status = ${data.leave_type}`;
  } else if (data.start_date !== "" && data.end_date !== "") {
    xyz += `staff_id = ${data.staff_id} AND start_date >= "${data.start_date}" AND end_date <= "${data.end_date}"`;
  } else if (data.start_date !== "" && data.leave_type !== "") {
    xyz += `staff_id = ${data.staff_id} AND start_date = "${data.start_date}" AND is_status = ${data.leave_type}`;
  } else if (data.end_date !== "" && data.leave_type !== "") {
    xyz += `staff_id = ${data.staff_id} AND end_date = "${data.end_date}" AND is_status = ${data.leave_type}`;
  } else if (data.start_date !== "") {
    xyz += `staff_id = ${data.staff_id} AND start_date = "${data.start_date}"`;
  } else if (data.end_date !== "") {
    xyz += `staff_id = ${data.staff_id} AND end_date = "${data.end_date}"`;
  } else if (data.leave_type !== "") {
    xyz += `staff_id = ${data.staff_id} AND is_status = ${data.leave_type}`;
  } else {
    xyz += `staff_id = ${data.staff_id} `;
  }
  db.query(
    `SELECT (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 0 AND ${xyz}) AS pending_leave, (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 1 AND ${xyz}) AS total_leave, (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 3 AND ${xyz}) AS cancle_leave, (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 2 AND ${xyz}) AS reject_leave, (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 1 AND ${xyz}) AS approve_leave, is_status FROM staff_leave WHERE ${xyz}`,
    (err, length) => {
      if (err) {
        console.log(err);
        result(err, null);
      } else {
        db.query(
          `SELECT (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 0 AND ${xyz}) AS pending_leave,(SELECT SUM(total_day) FROM staff_leave WHERE is_status = 1 AND ${xyz}) AS total_leave, (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 3 AND ${xyz}) AS cancle_leave, (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 2 AND ${xyz}) AS reject_leave, (SELECT SUM(total_day) FROM staff_leave WHERE is_status = 1 AND ${xyz}) AS approve_leave, created_at, start_date, end_date, total_day, is_status FROM staff_leave WHERE ${xyz} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`,
          (err, results) => {
            if (err) {
              console.log(err);
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
