import db from "../../config/database.js";
import mail_api from "../../config/mailAuth.js";
import { Curl } from "node-libcurl";

export const taskClientProjects = (id, result) => {
  db.query(
    `SELECT projects FROM client_projects WHERE client_id = ${id}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        const test = Object.values(results[0]).toString();
        var t = test.split(",");
        var templength = t.length;
        var result1 = [];
        for (let p of t) {
          db.query(
            "SELECT id,project_name,description,staff FROM projects WHERE id = ?",
            [p],
            (err, results) => {
              if (err) {
                console.error(err);
              } else {
                result1.push(results[0]);
                if (result1.length == templength) {
                  result(null, result1);
                }
              }
            }
          );
        }
      }
    }
  );
};

export const insertClientTask = (data, result) => {
  if(data.date == ''){
    data.date = null;
  }
  if(data.deadline == ''){
    data.deadline = null;
  }
  db.query(
    "INSERT INTO task SET date = ?,client_id= ?,project_id = ?,name = ?,task = ?,description = ?,deadline = ?,status= ?,admin_id=?",
    [
      data.date,
      data.client_id,
      data.project_id,
      data.name,
      data.task,
      data.description,
      data.deadline,
      data.status,
      data.admin_id,
    ],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
        db.query(
          `SELECT project_name,image,users.email as uemail,clients.email as cemail,staff FROM task INNER JOIN users ON task.admin_id = users.id INNER JOIN clients ON task.client_id = clients.id INNER JOIN projects ON task.project_id = projects.id WHERE task.id=${results.insertId}`,
          (err, results) => {
            if (err) {
              console.log(err);
            } else {
              const withoutFirstAndLast = results[0].staff.slice(1, -1);
              var ids = withoutFirstAndLast.split(",");
              var templength = ids.length;
              var emails = [];
              for (let id of ids) {
                db.query(
                  "SELECT email FROM staff WHERE id = ?",
                  [id],
                  (err, response) => {
                    if (err) {
                      console.log(err);
                    } else {
                      emails.push(response[0]);
                      if (emails.length == templength) {
                        if (!data.deadline) {
                          data.deadline = "NA";
                        } else {
                          data.deadline = data.deadline;
                        }
                        for (let i = 0; i < emails.length; i++) {
                          const curl = new Curl();
                          var fieldsStr = `{"from": {"email": "noreply@menejar.com", "name": "${data.name}"}, "personalizations": [{"to": [{"email": "${emails[i]["email"]}"}],"dynamic_template_data":{"subject": "Task Assigned","image":"${results[0].image}","project": "${results[0].project_name}","date": "${data.date}","task": "${data.task}","description": "${data.description}","deadline": "${data.deadline}","name": "${data.name}"}}], "TEMPLATE_ID":"d-bf0d2723ef3d4652bc6956e4128caa89"}`;
                          curl.setOpt(
                            Curl.option.URL,
                            "https://api.sendgrid.com/v3/mail/send"
                          );
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
                        const curl = new Curl();
                        var fieldsStr = `{"from": {"email": "noreply@menejar.com", "name": "${data.name}"}, "personalizations": [{"to": [{"email": "${results[0].uemail}"},{"email": "${results[0].cemail}"},],"dynamic_template_data":{"subject": "Task Assigned","image":"${results[0].image}","project": "${results[0].project_name}","date": "${data.date}","task": "${data.task}","description": "${data.description}","deadline": "${data.deadline}","name": "${data.name}"}}], "TEMPLATE_ID":"d-bf0d2723ef3d4652bc6956e4128caa89"}`;
                        curl.setOpt(
                          Curl.option.URL,
                          "https://api.sendgrid.com/v3/mail/send"
                        );
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
                  }
                );
              }
            }
          }
        );
      }
    }
  );
};

export const getTask = (data, page, size, result) => {
  let xyz = "";
  if (data.client_id && data.project_id) {
    xyz += `task.client_id=${data.client_id} AND task.project_id=${data.project_id}`;
  } else {
    xyz += `task.client_id=${data.client_id}`;
  }
  const limit = size;
  const offset = (page - 1) * limit;
  db.query(
    `SELECT task.id from task INNER JOIN projects as pr ON task.project_id=pr.id WHERE ${xyz} AND archive=0 AND is_status=1`,
    (err, length) => {
      if (err) {
        result(err, null);
      } else {
        db.query(
          `SELECT task.id,date,project_id,project_name,task,task.description,deadline,status from task INNER JOIN projects as pr ON task.project_id=pr.id WHERE ${xyz} AND archive=0 AND is_status=1 ORDER BY task.id DESC LIMIT ${limit} OFFSET ${offset}`,
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

export const archiveTaskById = (id, data, result) => {
  db.query(
    `UPDATE task SET archive = ${data.archive} WHERE id = ${id}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

export const getTaskById = (id, result) => {
  db.query(
    `SELECT task.id,date,project_id,name,task,task.description,deadline,status,archive from task INNER JOIN projects as pr ON task.project_id=pr.id WHERE task.id=${id}`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results[0]);
      }
    }
  );
};

export const updateTask = (data, id, result) => {
  db.query(
    "UPDATE task SET project_id = ?,task = ?,description = ?,deadline = ?,status=? WHERE id = ?",
    [
      data.project_id,
      data.task,
      data.description,
      data.deadline,
      data.status,
      id,
    ],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
        if (data.status !== data.tempstatus) {
          let taskstatus;
          if (data.status == 0) {
            taskstatus = "Pending";
          } else if (data.status == 1) {
            taskstatus = "Working";
          } else if (data.status == 2) {
            taskstatus = "Review";
          } else {
            taskstatus = "Completed";
          }
          db.query(
            `SELECT project_name,image,task.name,users.email as uemail,clients.email as cemail,staff FROM task INNER JOIN users ON task.admin_id = users.id INNER JOIN clients ON task.client_id = clients.id INNER JOIN projects ON task.project_id = projects.id WHERE task.id=${id}`,
            (err, results) => {
              if (err) {
                console.log(err);
              } else {
                const withoutFirstAndLast = results[0].staff.slice(1, -1);
                var ids = withoutFirstAndLast.split(",");
                var templength = ids.length;
                var emails = [];
                for (let id of ids) {
                  db.query(
                    "SELECT email FROM staff WHERE id = ?",
                    [id],
                    (err, response) => {
                      if (err) {
                        console.log(err);
                      } else {
                        emails.push(response[0]);
                        if (emails.length == templength) {
                          if (!data.deadline) {
                            data.deadline = "NA";
                          } else {
                            data.deadline = data.deadline;
                          }
                          for (let i = 0; i < emails.length; i++) {
                            const curl = new Curl();
                            var fieldsStr = `{"from": {"email": "noreply@menejar.com", "name": "${results[0].name}"}, "personalizations": [{"to": [{"email": "${emails[i]["email"]}"}],"dynamic_template_data":{"subject": "Task Status Changed","image":"${results[0].image}","project": "${results[0].project_name}","date": "${data.date}","task": "${data.task}","description": "${data.description}","deadline": "${data.deadline}","status": "${taskstatus}","name": "${results[0].name}"}}], "TEMPLATE_ID":"d-983b225599c1420fbbd34d1e71da226e"}`;
                            curl.setOpt(
                              Curl.option.URL,
                              "https://api.sendgrid.com/v3/mail/send"
                            );
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
                          const curl = new Curl();
                          var fieldsStr = `{"from": {"email": "noreply@menejar.com", "name": "${results[0].name}"}, "personalizations": [{"to": [{"email": "${results[0].uemail}"},{"email": "${results[0].cemail}"},],"dynamic_template_data":{"subject": "Task Status Changed","image":"${results[0].image}","project": "${results[0].project_name}","date": "${data.date}","task": "${data.task}","description": "${data.description}","deadline": "${data.deadline}","status": "${taskstatus}","name": "${results[0].name}"}}], "TEMPLATE_ID":"d-983b225599c1420fbbd34d1e71da226e"}`;
                          curl.setOpt(
                            Curl.option.URL,
                            "https://api.sendgrid.com/v3/mail/send"
                          );
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
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
};

export const taskSearchFilter = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  var order,
    task = "task",
    date = "date",
    deadline = "deadline";
  let xyz = "";
  if (data.name) {
    xyz += `task.client_id = ${data.client_id} AND (task LIKE '%${data.name}%' OR task.description LIKE '%${data.name}%')`;
  }
  if (data.project) {
    if (xyz) {
      xyz += " AND ";
    }
    xyz += `task.client_id = ${data.client_id} AND task.project_id= ${data.project}`;
  }
  if (data.date !== "" || data.status !== "") {
    if (xyz) {
      xyz += " AND ";
    }
    if (data.date !== "" && data.status !== "") {
      xyz += `task.client_id = ${data.client_id} AND status=${data.status} AND task.date = '${data.date}'`;
    } else if (data.date) {
      xyz += `task.client_id = ${data.client_id} AND task.date= '${data.date}'`;
    } else {
      xyz += `task.client_id = ${data.client_id} AND status=${data.status}`;
    }
  }
  if (data.isSort == "dt_desc") {
    order = task + "." + date + " " + "DESC";
  } else if (data.isSort == "dd_desc") {
    order = task + "." + deadline + " " + "DESC";
  } else if (data.isSort == "dt_asc") {
    order = task + "." + date + " " + "ASC";
  } else if (data.isSort == "dd_asc") {
    order = task + "." + deadline + " " + "ASC";
  } else {
    order = "task.id DESC";
  }
  if (
    data.name == "" &&
    data.project == "" &&
    data.date == "" &&
    data.status === ""
  ) {
    xyz += `task.client_id = ${data.client_id}`;
  }
  db.query(
    `SELECT task.id from task INNER JOIN projects as pr ON task.project_id=pr.id WHERE ${xyz} AND archive=${data.archive} AND is_status=1`,
    (err, length) => {
      if (err) {
        result(err, null);
      } else {
        db.query(
          `SELECT task.id,date,project_name,task,task.description,deadline,status from task INNER JOIN projects as pr ON task.project_id=pr.id WHERE ${xyz} AND archive=${data.archive} AND is_status=1 ORDER BY ${order} LIMIT ${limit} OFFSET ${offset}`,
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
