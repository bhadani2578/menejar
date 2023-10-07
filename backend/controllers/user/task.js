import {
  getstaffTask,
  staffProjects,
  StaffSearchFilter,
} from "../../models/user/taskModel.js";

export const stafftaskList = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  getstaffTask(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const staffassignedprojects = (req, res) => {
  staffProjects(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const taskStaffFilter = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  StaffSearchFilter(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
