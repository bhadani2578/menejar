import {
  getStaffAttendance,
  checkin,
  checkout,
  checkBox,
  findSummary,
  attendanceFilter,
} from "../../models/user/attendanceModel.js";

export const staffAttendanceList = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  getStaffAttendance(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//staf check in
export const staffCheckin = (req, res) => {
  const data = req.body;
  checkin(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//staff checkout
export const staffCheckout = (req, res) => {
  const data = req.body;
  console.log(data);
  checkout(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//staff checkbox value
export const staffCheckBox = (req, res) => {
  const data = req.body;
  checkBox(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//staff attendance summary
export const attendanceSummary = (req, res) => {
  const data = req.body;
  findSummary(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//filter on attendance
export const staff_attendance_search = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  attendanceFilter(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
