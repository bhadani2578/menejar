import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";

import {
  remove_tax,
  get_tax_details,
  addBusinessIndividual,
  tax_details,
  getCountry,
  getCurrency,
  showProductById,
  createProduct,
  getUser,
  updatePass,
  googlelogin,
  setFavicon,
  forgotPass,
  getToken,
  adminChangePass,
} from "../controllers/users.js";
import {
  projectSearch,
  createProject,
  showProjects,
  showProjectById,
  updateProject,
  deleteProjects,
  showProjectDevelopers,
} from "../controllers/project.js";
import {
  addIndividual,
  showClients,
  showClientById,
  updateClient,
  deleteClients,
  clientSearch,
  clientProjects,
  checkedProjects,
  clientprojectsvalue,
} from "../controllers/client.js";
import {
  invoiceSearch,
  invoiceCatSearch,
  unpaidInvoices,
  createInvoices,
  updateInvoices,
  invoiceDetails,
  updateinvoiceDetails,
  showInoives,
  paidInvoice,
  invoiceSeries,
  showinvoiceClients,
  forpdftabledata,
  defaultFooter,
  invoicedate,
  filterclients,
  invoiceclient,
  currencytotal,
  downloadPdf,
  deleteInvoicedetail,
  deleteInvoices,
  invoiceTaxDetails,
  getInvoiceTaxDetails,
  updateinvoiceTaxDetails,
  deleteInvoiceTaxDetail,
  showAllFilterInvoice
} from "../controllers/invoices.js";
import {
  allLeave,
  approveLeave,
  rejectLeave,
  all_leaveSummary,
  all_leave_search,
} from "../controllers/leave.js";
import {
  dashboardPendingLeave,
  dashboardLeave,
  dashboardAttendace,
  dashboardProject,
} from "../controllers/dashboard.js";

import {
  staffList,
  showStaffById,
  addStaff,
  editStaff,
  activateStaff,
  deactivateStaff,
  deleteStaff,
  staffSearch,
  staffPermission,
} from "../controllers/staff.js";
import {
  addAttendance,
  attendanceList,
  attendanceCSV,
  attendanceSearch,
} from "../controllers/attendance.js";
import {
  addTrack,
  showTrackById,
  trackList,
  editTrack,
  deleteTrack,
  trackCSV,
  projectsfortrack,
  staffsfortrack,
  trackSearch,
  admintotaltime,
  stafftimesheet, 
  approvetimesheet
} from "../controllers/track.js";
import {
  admintaskList,
  taskAdminFilter,
  projectsoftask,
  editdevelopers,
} from "../controllers/task.js";

// init express router
const router = express.Router();
router.use(
  session({
    secret: "email",
    resave: true,
    saveUninitialized: true,
  })
);
router.use(cookieParser());

// login admin
router.post("/login", showProductById);
router.post("/googlelogin", googlelogin);

// register admin
router.post("/register", createProduct);

//forgot & update password
router.post("/updat-pass", updatePass);
router.post("/forgot-password", forgotPass);
router.get("/get_token", getToken);
router.post("/admin_change_pass", adminChangePass);

//dashboard module
router.post("/dashboard_pending_leave", dashboardPendingLeave);
router.post("/dashboard_upcoming_leave", dashboardLeave);
router.post("/dashboard_attendance", dashboardAttendace);
router.post("/dashboard_project", dashboardProject);

//project module
router.post("/projects", createProject);
router.post("/get_projects", showProjects);
router.get("/projects/:id", showProjectById);
router.post("/projects/:id", updateProject);
router.post("/remove_projects/:id", deleteProjects);
router.post("/project_search", projectSearch);
router.get("/projectdevelopers/:id", showProjectDevelopers);

//get currency
router.get("/currency", getCurrency);
//get country
router.get("/country", getCountry);

//get user
router.post("/user", getUser);
router.post("/favicon", setFavicon);

//client module
router.post("/add_individual", addIndividual);
router.post("/clients", showClients);
router.get("/clients/:id", showClientById);
router.post("/clients/:id", updateClient);
router.post("/remove_clients/:id", deleteClients);
router.post("/client_search", clientSearch);
router.get("/clientprojects/:id", clientProjects);
router.post("/checkedprojects", checkedProjects);
router.post("/clientprojectsvalue", clientprojectsvalue);

//business profile
router.post("/add_business", addBusinessIndividual);
router.post("/tax_details", tax_details);
router.post("/get_tax_details", get_tax_details);
router.post("/tax_details/:id", remove_tax);

// image upload in business profile
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(path.resolve("./uploads"))
    cb(null, '/var/www/html/meback/uploads/');
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/imageupload", upload.single("file"), (req, res) => {
  console.log(path.resolve("./uploads"))
  res.json({ file: req.file.filename });
});

//invoice router
router.post("/invoices", createInvoices);
router.post("/invoices/:id", updateInvoices);
router.post("/delete_invoicedetail/:id", deleteInvoicedetail);
router.post("/invoice_details", invoiceDetails);
router.post("/invoice_details/:id", updateinvoiceDetails);
router.get("/get_inovoice/:id", showInoives);
router.post("/get_all_filter_inovoice/:id", showAllFilterInvoice);
router.post("/paid_invoice/:id", paidInvoice);
router.post("/invoice_no/:id", invoiceSeries);
router.post("/unpaid_invoices", unpaidInvoices);
router.post("/invoice_client", invoiceclient);
router.post("/invoice_date", invoicedate);
router.post("/filterclients", filterclients);
router.post("/currency_total", currencytotal);
router.post("/invoice_cat_search", invoiceCatSearch);
router.post("/invoices_search", invoiceSearch);
router.post("/invoiceclients/:id", showinvoiceClients);
router.post("/forpdftabledata/:id", forpdftabledata);
router.post("/default_foolter", defaultFooter);
router.get("/download_invoice/:id", downloadPdf);
router.post("/remove_invoice/:id", deleteInvoices);
router.post("/invoice_tax_details", invoiceTaxDetails);
router.post("/get_invoice_tax_details", getInvoiceTaxDetails); 
router.post("/invoice_tax_details/:id", updateinvoiceTaxDetails);
router.post("/delete_invoice_tax_detail/:id", deleteInvoiceTaxDetail);

//leave router
router.get("/leave/:id", allLeave);
router.post("/approve/:id", approveLeave);
router.post("/reject/:id", rejectLeave);
router.post("/all_leavesummary", all_leaveSummary);
router.post("/all_leave_search", all_leave_search);

//For Staff Module
var multipleUpload = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "doc1", maxCount: 1 },
  { name: "doc2", maxCount: 1 },
  { name: "doc3", maxCount: 1 },
  { name: "doc4", maxCount: 1 },
]);

router.post("/upload", multipleUpload, (req, res) => {
  res.json({ files: req.files });
});

router.post("/upload/:id", multipleUpload, (req, res) => {
  res.json({ files: req.files });
});

//Staff router
router.post("/get_stafflist", staffList);
router.get("/staff/:id", showStaffById);
router.post("/staff", addStaff);
router.post("/staff/:id", editStaff);
router.post("/activatestaff/:id", activateStaff);
router.post("/deactivatestaff/:id", deactivateStaff);
router.post("/deletestaff/:id", deleteStaff);
router.post("/staff_search", staffSearch);
router.post("/permission", staffPermission);

//Attendance router
router.post("/attendance", addAttendance);
router.post("/get_attendance", attendanceList);
router.post("/attendancecsv", attendanceCSV);
router.post("/attendance_search", attendanceSearch);

//Track router
router.post("/track", addTrack);
router.get("/track/:id", showTrackById);
router.post("/get_track", trackList);
router.post("/track/:id", editTrack);
router.post("/deletetrack/:id", deleteTrack);
router.post("/trackcsv", trackCSV);
router.post("/projectsfortrack/:id", projectsfortrack);
router.post("/staffsfortrack/:id", staffsfortrack);
router.post("/track_search", trackSearch);
router.post("/admintotaltime", admintotaltime);
router.post("/getstafftimesheet", stafftimesheet);
router.post("/approvetimesheet", approvetimesheet);

//Task router
router.post("/get_admintask", admintaskList);
router.post("/task_adminfilter", taskAdminFilter);
router.post("/projectsoftask/:id", projectsoftask);
router.post("/editdevelopers/:id", editdevelopers);

export default router;
