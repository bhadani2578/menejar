import db from "../../config/database.js";

//insert staff track
export const insertStaffTrack = (data, result) => {
  const createddate = data.date + " " + data.start;
  db.query(
    `INSERT INTO track SET staffid = ?,projectid = ?,date = ?,start = ?,end = ?,task= ?,time=?,admin_id=?,createdDate='${createddate}'`,
    [
      data.staffid,
      data.projectid,
      data.date,
      data.start,
      data.end,
      data.task,
      data.time,
      data.admin_id,
    ],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

//get staff projects
export const staffProjects = (adminid, result) => {
  db.query(
    `SELECT id,project_name FROM projects WHERE is_status = 1 AND admin_id=${adminid}`,
    // `SELECT id,project_name FROM projects WHERE is_status = 1`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

//get staff tracks
export const staffTracks = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  console.log("INto request")
  db.query(
    `SELECT task from track WHERE staffid=${data.staffid} AND date BETWEEN '${data.indate}' AND '${data.outdate}'`,
    (err, length) => {
      if (err) {
        result(err, null);
      } else {
        db.query(
          `SELECT track.id,date,st.name,pt.project_name,task,start,end,time from track INNER JOIN staff as st ON track.staffid=st.id INNER JOIN projects as pt ON track.projectid=pt.id WHERE track.staffid=${data.staffid} AND date BETWEEN '${data.indate}' AND '${data.outdate}' ORDER BY track.id DESC LIMIT ${limit} OFFSET ${offset}`,
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

//track filter query
export const trackFilter = (data, page, size, result) => {
  const limit = size;
  const offset = (page - 1) * limit;
  let xyz = "";
  if (data.clientid) {
    if (xyz) {
      xyz += " AND ";
    }
    xyz += `staffid = ${data.staffid} AND client_id= ${data.clientid}`;
  }
  if (data.projectid) {
    if (xyz) {
      xyz += " AND ";
    }
    xyz += `staffid = ${data.staffid} AND projectid = ${data.projectid}`;
  }
  if (data.indate || data.outdate) {
    if (xyz) {
      xyz += " AND ";
    }
    if (data.indate && data.outdate) {
      xyz += `staffid = ${data.staffid} AND date BETWEEN '${data.indate}' AND '${data.outdate}'`;
    } else if (data.indate) {
      xyz += `staffid = ${data.staffid} AND date= '${data.indate}'`;
    } else {
      xyz += `staffid = ${data.staffid} AND date= '${data.outdate}'`;
    }
  }
  if (!data.clientid && !data.projectid && !data.indate && !data.outdate) {
    xyz += `staffid = ${data.staffid}`;
  }
  db.query(
    `SELECT track.id from track INNER JOIN staff as st ON track.staffid=st.id INNER JOIN projects as pt ON track.projectid=pt.id INNER JOIN clients as cl ON cl.id=pt.client_id WHERE ${xyz}`,
    (err, length) => {
      if (err) {
        result(err, null);
      } else {
        db.query(
          `SELECT track.id,date,st.name,pt.project_name,task,start,end,time from track INNER JOIN staff as st ON track.staffid=st.id INNER JOIN projects as pt ON track.projectid=pt.id INNER JOIN clients as cl ON cl.id=pt.client_id WHERE ${xyz} order by track.id DESC LIMIT ${limit} OFFSET ${offset}`,
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

//get time
export const getTime = (data, result) => {
  let xyz = "";
  if (data.clientid) {
    if (xyz) {
      xyz += " AND ";
    }
    xyz += `track.admin_id = ${data.admin_id} AND client_id= ${data.clientid}`;
  }
  if (data.projectid) {
    if (xyz) {
      xyz += " AND ";
    }
    xyz += `staffid = ${data.staffid} AND projectid = ${data.projectid}`;
  }
  if (data.indate || data.outdate) {
    if (xyz) {
      xyz += " AND ";
    }
    if (data.indate && data.outdate) {
      xyz += `staffid = ${data.staffid} AND date BETWEEN '${data.indate}' AND '${data.outdate}'`;
    } else if (data.indate) {
      xyz += `staffid = ${data.staffid} AND date= '${data.indate}'`;
    } else {
      xyz += `staffid = ${data.staffid} AND date= '${data.outdate}'`;
    }
  }
  if (!data.clientid && !data.projectid && !data.indate && !data.outdate) {
    xyz += `staffid = ${data.staffid}`;
  }
  db.query(
    `SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time))) AS time from track INNER JOIN staff as st ON track.staffid=st.id INNER JOIN projects as pt ON track.projectid=pt.id INNER JOIN clients as cl ON cl.id=pt.client_id WHERE ${xyz} AND end!="00:00:00"`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

export const getTrackById = (data, result) => {
  db.query(
    `SELECT pt.project_name,track.id,projectid,task from track INNER JOIN staff as st ON track.staffid=st.id INNER JOIN projects as pt ON track.projectid=pt.id WHERE track.staffid=${data.staffid} AND end='00:00:00' ORDER BY id DESC LIMIT 1`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results[0]);
      }
    }
  );
};

//update track from staff side
export const updateTrack = (data, staffid, result) => {
  db.query(
    `UPDATE track SET staffid = ?,projectid = ?,date = ?,start = ?,end = ?,task= ?,time=TIMEDIFF('${data.end1}',createdDate) WHERE staffid=? AND end='00:00:00' ORDER BY id DESC LIMIT 1`,
    [
      data.staffid,
      data.projectid,
      data.date,
      data.start,
      data.end,
      data.task,
      staffid,
    ],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(null, results);
      }
    }
  );
};

//staff time value
export const checkTime = (data, result) => {
  db.query(
    `SELECT start,end FROM track WHERE staffid = ${data.staffid} AND end='00:00:00' ORDER BY id DESC LIMIT 1`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        if (results.length == 0) {
          result("empty database", results[0]);
        } else {
          result(results);
        }
      }
    }
  );
};

export const getTimeSheetData = (data, result) => {
  // const staff_id = String(data.staff_id)
  console.log("data", data);
  db.query(
    // `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, SEC_TO_TIME(SUM(TIME_TO_SEC(time))) AS time FROM track WHERE staffid = ${data.staff_id} AND projectid = ${data.project_id} AND date BETWEEN '${data.first}' AND '${data.last}' GROUP BY date;`,
    `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, TIME_FORMAT(SEC_TO_TIME(SUM(TIME_TO_SEC(time))), '%H:%i') AS time FROM track WHERE staffid = ${data.staff_id} AND projectid = ${data.project_id} AND date = '${data.week_date}' GROUP BY date;`,
    // `SELECT time, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM track WHERE staffid = '57' AND projectid = '65' AND date BETWEEN '2023-07-02' AND '2023-07-07'`,
    // `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS date, SEC_TO_TIME(SUM(TIME_TO_SEC(time))) AS total_time FROM track WHERE staffid = '57' AND projectid = '65' AND date BETWEEN '2023-07-02' AND '2023-07-07' GROUP BY date;`,
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        console.log("final results", results)
        result(results);
      }
    }
  );  
};

export const submitCommonSheetData = (data, result) => {
  db.query(
    "INSERT INTO timesheets SET staffid = ?, month = ?, week = ?",
    [data.staffid, data.month, data.week],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        result(results);
      }
    }
    );
  };
  
  export const submitTimesheetData = (data, result) => {
  const timesheet = JSON.stringify(data.timesheet);
  const timesheetId = data.sheetid;
  const projectId = data.projectid;
  console.log("project ids", data.projectid)
  db.query(
    "INSERT INTO timesheet_data SET timesheet_id = ?, project_id = ?, sheet_data = ?",
    [timesheetId, projectId,timesheet],
    (err, results) => {
      if (err) {
        result(err, null);
      } else {
        console.log("timesheet aded")
        result("Timesheet Data Added");
      }
    }
  );
};


