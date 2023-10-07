import {
  taskClientProjects,
  insertClientTask,
  getTask,
  archiveTaskById,
  getTaskById,
  updateTask,
  taskSearchFilter,
} from "../../models/client/taskModel.js";

export const taskclientprojects = (req, res) => {
  taskClientProjects(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const clientaddtask = (req, res) => {
  const data = req.body;
  insertClientTask(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const taskList = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  getTask(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const archiveTask = (req, res) => {
  const data = req.body;
  archiveTaskById(req.params.id, data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const showTaskById = (req, res) => {
  getTaskById(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const editTask = (req, res) => {
  const data = req.body;
  updateTask(data, req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const taskFilterSearch = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  taskSearchFilter(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};
