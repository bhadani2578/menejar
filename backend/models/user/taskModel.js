import db from "../../config/database.js";

export const getstaffTask = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  db.query(
    `SELECT task.id from task INNER JOIN projects as pr ON task.project_id=pr.id WHERE JSON_CONTAINS(staff, '${data.staff_id}') AND archive=0 AND is_status=1`,
    (err, length) => {
      if (err) {
        result(err, null);
      } else {
        db.query(
          `SELECT task.id,date,project_id,project_name,task,task.description,deadline,status,staff from task INNER JOIN projects as pr ON task.project_id=pr.id WHERE JSON_CONTAINS(staff, '${data.staff_id}') AND archive=0 AND is_status=1 ORDER BY task.id DESC LIMIT ${limit} OFFSET ${offset}`,
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

export const staffProjects = (id, result) => {
  db.query(
    `SELECT id,project_name FROM projects WHERE JSON_CONTAINS(staff, '${id}') AND is_status=1`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

export const StaffSearchFilter = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  var order,
    task = "task",
    date = "date",
    deadline = "deadline";
  let xyz = "";
  if (data.name) {
    xyz += `JSON_CONTAINS(staff, '${data.staff_id}') AND (task LIKE '%${data.name}%' OR task.description LIKE '%${data.name}%')`;
  }
  if (data.project) {
    if (xyz) {
      xyz += " AND ";
    }
    xyz += `JSON_CONTAINS(staff, '${data.staff_id}') AND task.project_id= ${data.project}`;
  }
  if (data.date !== "" || data.status !== "") {
    if (xyz) {
      xyz += " AND ";
    }
    if (data.date !== "" && data.status !== "") {
      xyz += `JSON_CONTAINS(staff, '${data.staff_id}') AND status=${data.status} AND task.date = '${data.date}'`;
    } else if (data.date) {
      xyz += `JSON_CONTAINS(staff, '${data.staff_id}') AND task.date= '${data.date}'`;
    } else {
      xyz += `JSON_CONTAINS(staff, '${data.staff_id}') AND status=${data.status}`;
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
    xyz += `JSON_CONTAINS(staff, '${data.staff_id}')`;
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
