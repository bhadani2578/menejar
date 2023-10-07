import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import {
  staffLogin,
  getStaff,
  getDashImage,
  getPermission,
  staffChangePass,
} from "../../controllers/user/users.js";
import {
  staffAttendanceList,
  staffCheckin,
  staffCheckout,
  staffCheckBox,
  attendanceSummary,
  staff_attendance_search,
} from "../../controllers/user/attendance.js";
import {
  createLeave,
  staffLeave,
  cancleLeave,
  updateLeave,
  showLeaveById,
  leaveSummary,
  staff_leave_search,
} from "../../controllers/user/leave.js";
import {
  projectsforstaff,
  tracksforstaff,
  staff_trackSearch,
  totaltime,
  getlasttrack,
  lasttrackupdate,
  staffCheckTime,
  addStaffTrack,
  staffTimeSheetData,
  submitTimesheet, 
  submitSheetData
} from "../../controllers/user/track.js";
import {
  stafftaskList,
  staffassignedprojects,
  taskStaffFilter,
} from "../../controllers/user/task.js";
import { authorizeStaff } from "../../middlewares/staffAuth.js";
import { checkActivation } from "../../controllers/user/checkActivation.js";

const router = express.Router();

router.use(
  session({
    secret: "email",
    resave: true,
    saveUninitialized: true,
  })
);
router.use(cookieParser());

//staff login
router.post("/staff_login", staffLogin);

//get staff
router.post("/get_staff", getStaff);
router.post("/staff_image", getDashImage);
router.post("/get_permission", getPermission);
router.post("/staff_change_pass", staffChangePass);

//attendance list
router.post("/staff_attendance_list", authorizeStaff, staffAttendanceList);
router.post("/checkin", staffCheckin);
router.post("/checkout", staffCheckout);
router.post("/checkbox", staffCheckBox);
router.post("/attendancesummary", attendanceSummary);
router.post("/staff_attendance_search", staff_attendance_search);

//leave
router.post("/create_leave", createLeave);
router.post("/staff_leave", authorizeStaff, staffLeave);
router.post("/cancle_leave/:id", cancleLeave);
router.post("/update_leave/:id", updateLeave);
router.get("/staff_leave/:id", showLeaveById);
router.post("/leavesummary", leaveSummary);
router.post("/staff_leave_search", staff_leave_search);

//staff track
router.post("/addstafftrack", addStaffTrack);
router.get("/projectsforstaff/:id", projectsforstaff);
router.post("/tracksforstaff", authorizeStaff, tracksforstaff);
router.post("/staff_track_search", staff_trackSearch);
router.post("/getlasttrack", getlasttrack);
router.post("/lasttrackupdate/:id", lasttrackupdate);
router.post("/totaltime", totaltime);
router.post("/checktime", staffCheckTime);
router.post("/gettimesheetdata", staffTimeSheetData);
router.post("/submittimesheet", submitTimesheet);
router.post("/submitsheetdata", submitSheetData);

//staff task
router.post("/get_stafftask", authorizeStaff, stafftaskList);
router.get("/staffassignedprojects/:id", staffassignedprojects);
router.post("/task_stafffilter", taskStaffFilter);

router.post("/checkactivation", checkActivation)

export default router;
