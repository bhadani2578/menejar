import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import {
  getDashImage,
  getClient,
  clientChangePass,
} from "../../controllers/client/users.js";

import {
  taskclientprojects,
  clientaddtask,
  taskList,
  showTaskById,
  archiveTask,
  editTask,
  taskFilterSearch,
} from "../../controllers/client/task.js";

const router = express.Router();

router.use(
  session({
    secret: "email",
    resave: true,
    saveUninitialized: true,
  })
);
router.use(cookieParser());

//get client
router.post("/get_client/:id", getClient);
router.post("/client_image", getDashImage);
router.post("/client_change_pass", clientChangePass);

//task and project
router.post("/taskclientprojects/:id", taskclientprojects);
router.post("/get_task", taskList);
router.post("/clientaddtask", clientaddtask);
router.get("/task/:id", showTaskById);
router.post("/task/:id", editTask);
router.post("/task_filtersearch", taskFilterSearch);
router.post("/archiveTask/:id", archiveTask);

export default router;
