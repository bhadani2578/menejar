import {
  leaveFilter,
  generateLeave,
  staffLeaveList,
  cancleLeaveById,
  updateLeaveById,
  getLeaveById,
  findSummary,
} from "../../models/user/leaveModel.js";

export const createLeave = (req, res) => {
  const data = req.body;
  generateLeave(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const staffLeave = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  staffLeaveList(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//edit leave
export const updateLeave = (req, res) => {
  const data = req.body;
  updateLeaveById(data, req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//display leave by id
export const showLeaveById = (req, res) => {
  getLeaveById(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const cancleLeave = (req, res) => {
  const data = req.body;
  cancleLeaveById(req.params.id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//staff leave summary
export const leaveSummary = (req, res) => {
  const data = req.body;
  findSummary(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//filter on leave
export const staff_leave_search = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  leaveFilter(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
