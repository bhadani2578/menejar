import { createRouter, createWebHistory } from "vue-router";

import StartMenejar from "./pages/StartMenejar.vue";
import Dasboard from "./pages/Dashboard.vue";
import Register from "./pages/Register.vue";
import Login from "./pages/Login.vue";
import ForgotPassword from "./pages/ForgotPassword.vue";
import ChangePassword from "./pages/ChangePassword.vue";
//project module
import Projects from "./pages/Projects.vue";
import CreateProject from "./pages/projects/CreateProjects.vue";
import EditProject from "./pages/projects/EditProjects.vue";
import ViewProject from "./pages/projects/ViewProjects.vue";
//client module
import Clients from "./pages/Clients.vue";
import CreateClient from "./pages/clients/CreateClients.vue";
import EditClient from "./pages/clients/EditClients.vue";
//business setting
import BusinessSetting from "./pages/BusinessSetting.vue";
//invoice module
import Invoice from "./pages/Invoices.vue";
import CreateInvoice from "./pages/invoices/CreateInvoices.vue";
import EditInvoice from "./pages/invoices/EditInvoices.vue";
//download pdf page
import downloadpdfpage from "./components/admin/downloadpdfpage.vue";
//leave module
import Leave from "./pages/Leaves.vue";
import CreateAdminLeave from "./pages/leave/CreateAdminLeave.vue";
//Staff module
import StaffList from "./pages/staff/StaffList.vue";
import AddStaff from "./pages/staff/AddStaff.vue";
import EditStaff from "./pages/staff/EditStaff.vue";
import ViewStaff from "./pages/staff/ViewStaff.vue";
//Attendance module
import AttendanceList from "./pages/attendance/AttendanceList.vue";
import AddAttendance from "./pages/attendance/AddAttendance.vue";
//Track module
import TrackList from "./pages/track/TrackList.vue";
import AddTrack from "./pages/track/AddTrack.vue";
import EditTrack from "./pages/track/EditTrack.vue";
import ViewTrack from "./pages/track/ViewTrack.vue";
//Task module
import TaskList from "./pages/tasks/TaskList.vue";
import AddTask from "./pages/tasks/AddTask.vue";
import EditTask from "./pages/tasks/EditTask.vue";
//staff login
// import StaffLogin from './pages/user/StaffLogin.vue';
import StaffDashboard from "./pages/user/StaffDashboard.vue";
//staff leave
import StaffLeave from "./pages/user/StaffLeave.vue";
import CreateLeave from "./pages/user/leave/CreateLeave.vue";
import EditLeave from "./pages/user/leave/EditLeave.vue";
//staff track
import StaffTrackList from "./pages/user/StaffTrackList.vue";
//staff task
import StaffTaskList from "./pages/user/task/StaffTaskList.vue";
import StaffAddTask from "./pages/user/task/StaffAddTask.vue";
import StaffEditTask from "./pages/user/task/StaffEditTask.vue";
//staff profile
import StaffProfile from "./pages/user/StaffProfile.vue";
//user_client Project
import ClientProjects from "./pages/clients/user_client/project/ClientProjects.vue";
import ClientViewProject from "./pages/clients/user_client/project/ClientViewProject.vue";
import AddProjectTask from "./pages/clients/user_client/project/AddProjectTask.vue";
import EditProjectTask from "./pages/clients/user_client/project/EditProjectTask.vue";
//user_client Task
import ClientTask from "./pages/clients/user_client/task/ClientTask.vue";
import ClientAddTask from "./pages/clients/user_client/task/ClientAddTask.vue";
import ClientEditTask from "./pages/clients/user_client/task/ClientEditTask.vue";
//user_client Profile
import ClientProfile from "./pages/clients/user_client/ClientProfile.vue";
//page not found
import PageNotFound from "./pages/PageNotFound.vue";
//staff timesheet module
import StaffTimesheet from "./pages/user/StaffTimesheet.vue";

import Timesheets from "./pages/Timesheets.vue"

const router = createRouter({
  history: createWebHistory("/"),
  base: "/",
  routes: [
    // { path: "/", name: "login", redirect: "/login" },
    { path: "/", name: "index",component: StartMenejar },
    {
      path: "/register",
      component: Register,
      name: "register",
      meta: { guest: true },
    },
    {
      path: "/dashboard",
      component: Dasboard,
      name: "dashboard",
      meta: { requiresAuth: true },
    },
    { path: "/login", component: Login, name: "login", meta: { guest: true } },
    {
      path: "/change-password/:token",
      component: ChangePassword,
      name: "changepassword",
    },
    { path: "/change-password", redirect: "/" },
    //projects module
    {
      path: "/projects",
      component: Projects,
      name: "projects",
      meta: { requiresAuth: true },
    },
    {
      path: "/create_project",
      component: CreateProject,
      name: "create_project",
      meta: { requiresAuth: true },
    },
    {
      path: "/edit_project/:id",
      component: EditProject,
      name: "edit_project",
      meta: { requiresAuth: true },
    },
    {
      path: "/view_project/:id",
      component: ViewProject,
      name: "view_project",
      meta: { requiresAuth: true },
    },
    //clients module
    {
      path: "/clients",
      component: Clients,
      name: "clients",
      meta: { requiresAuth: true },
    },
    {
      path: "/create_client",
      component: CreateClient,
      name: "create_client",
      meta: { requiresAuth: true },
    },
    {
      path: "/edit_client/:id",
      component: EditClient,
      name: "edit_client",
      meta: { requiresAuth: true },
    },
    //business setting
    {
      path: "/business_setting",
      component: BusinessSetting,
      name: "business_setting",
      meta: { requiresAuth: true },
    },
    //invoice module
    {
      path: "/invoices",
      component: Invoice,
      name: "invoice",
      meta: { requiresAuth: true },
    },
    {
      path: "/create_invoice",
      component: CreateInvoice,
      name: "create_invoice",
      meta: { requiresAuth: true },
    },
    {
      path: "/edit_invoice/:id",
      component: EditInvoice,
      name: "edit_invoice",
      meta: { requiresAuth: true },
    },
    {
      path: "/downloadpdfpage/:id",
      component: downloadpdfpage,
      name: "downloadpdfpage",
      meta: { requiresAuth: true },
    },
    //admin leave module
    {
      path: "/leave",
      component: Leave,
      name: "leave",
      meta: { requiresAuth: true },
    },
    {
      path: "/create_admin_leave",
      component: CreateAdminLeave,
      name: "create_admin_leave",
      meta: { requiresAuth: true },
    },
    //Staff module
    {
      path: "/stafflist",
      component: StaffList,
      name: "StaffList",
      meta: { requiresAuth: true },
    },
    {
      path: "/addstaff",
      component: AddStaff,
      name: "AddStaff",
      meta: { requiresAuth: true },
    },
    {
      path: "/editstaff/:id",
      component: EditStaff,
      name: "EditStaff",
      meta: { requiresAuth: true },
    },
    {
      path: "/viewstaff/:id",
      component: ViewStaff,
      name: "ViewStaff",
      meta: { requiresAuth: true },
    },
    //Timesheet module
    {
      path: "/timesheets",
      component: Timesheets,
      name: "Timesheets",
      meta: { requiresAuth: true },
    },
    //Attendance module
    {
      path: "/addattendance",
      component: AddAttendance,
      name: "AddAttendance",
      meta: { requiresAuth: true },
    },
    {
      path: "/attendancelist",
      component: AttendanceList,
      name: "AttendanceList",
      meta: { requiresAuth: true },
    },
    //Track module
    {
      path: "/addtrack",
      component: AddTrack,
      name: "AddTrack",
      meta: { requiresAuth: true },
    },
    {
      path: "/tracklist",
      component: TrackList,
      name: "TrackList",
      meta: { requiresAuth: true },
    },
    {
      path: "/viewtrack/:id",
      component: ViewTrack,
      name: "ViewTrack",
      meta: { requiresAuth: true },
    },
    {
      path: "/edittrack/:id",
      component: EditTrack,
      name: "EditTrack",
      meta: { requiresAuth: true },
    },
    {
      path: "/staff_dashboard",
      component: StaffDashboard,
      name: "staff_dashboard",
      meta: { staffAuth: true },
    },
    //Task module
    {
      path: "/addtask",
      component: AddTask,
      name: "AddTask",
      meta: { requiresAuth: true },
    },
    {
      path: "/tasklist",
      component: TaskList,
      name: "TaskList",
      meta: { requiresAuth: true },
    },
    {
      path: "/edittask/:id",
      component: EditTask,
      name: "EditTask",
      meta: { requiresAuth: true },
    },
    //staff leave
    {
      path: "/staff_leave",
      component: StaffLeave,
      name: "staff_leave",
      meta: { staffAuth: true },
    },
    {
      path: "/create_leave",
      component: CreateLeave,
      name: "create_leave",
      meta: { staffAuth: true },
    },
    {
      path: "/edit_leave/:id",
      component: EditLeave,
      name: "edit_leave",
      meta: { staffAuth: true },
    },
    //staff TrackList
    {
      path: "/staff_tracklist",
      component: StaffTrackList,
      name: "StaffTrackList",
      meta: { staffAuth: true },
    },
    //staff Task
    {
      path: "/staff_tasklist",
      component: StaffTaskList,
      name: "StaffTaskList",
      meta: { staffAuth: true },
    },
    {
      path: "/staff_addtask",
      component: StaffAddTask,
      name: "StaffAddTask",
      meta: { staffAuth: true },
    },
    {
      path: "/staff_edittask/:id",
      component: StaffEditTask,
      name: "StaffEditTask",
      meta: { staffAuth: true },
    },
    //staff profile
    {
      path: "/staff_profile",
      component: StaffProfile,
      name: "StaffProfile",
      meta: { staffAuth: true },
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
      name: "forgotpassword",
    },
    {
      path: "/:pathMatch(.*)",
      component: PageNotFound,
      name: "PageNotFound",
    },
    //client projects
    {
      path: "/client_projects",
      component: ClientProjects,
      name: "client_projects",
      meta: { clientAuth: true },
    },
    //client view project
    {
      path: "/client_viewproject/:id",
      component: ClientViewProject,
      name: "client_viewproject",
      meta: { clientAuth: true },
    },
    //client add task
    {
      path: "/add_projecttask/:id",
      component: AddProjectTask,
      name: "add_projecttask",
      meta: { clientAuth: true },
    },
    //client edit task
    {
      path: "/edit_projecttask/:id",
      component: EditProjectTask,
      name: "edit_projecttask",
      meta: { clientAuth: true },
    },
    //client task
    {
      path: "/client_task",
      component: ClientTask,
      name: "client_task",
      meta: { clientAuth: true },
    },
    //client add task
    {
      path: "/client_addtask",
      component: ClientAddTask,
      name: "client_addtask",
      meta: { clientAuth: true },
    },
    //client edit task
    {
      path: "/client_edittask/:id",
      component: ClientEditTask,
      name: "client_edittask",
      meta: { clientAuth: true },
    },
    //client profile
    {
      path: "/client_profile",
      component: ClientProfile,
      name: "client_profile",
      meta: { clientAuth: true },
    },
    {
      path: "/staff_timesheet",
      component: StaffTimesheet,
      name: "staff_timesheet",
      meta: { staffAuth: true },
    },
  ],
});

function loggedIn() {
  if (localStorage.getItem("type") == "admin") {
    return localStorage.getItem("type");
  }
}
function staffLoggedIn() {
  if (localStorage.getItem("type") == "staff") {
    return localStorage.getItem("type");
  }
}
function clientLoggedIn() {
  if (localStorage.getItem("type") == "client") {
    return localStorage.getItem("type");
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!loggedIn()) {
      if (localStorage.getItem("access") == "yes") {
        next();
      } else {
        next({
          name: "login",
        });
      }
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.staffAuth)) {
    if (!staffLoggedIn()) {
      next({
        name: "login",
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.staffGuest)) {
    if (staffLoggedIn()) {
      next({
        name: "staff_dashboard",
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    // console.log("client auth");
    // if (!clientLoggedIn()) {
    if (localStorage.getItem("type") == "admin") {
      next({
        name: "dashboard",
      });
    } else {

      next();
    }
  }
   else if (to.matched.some((record) => record.meta.clientAuth)) {
    if (!clientLoggedIn()) {
      next({
        name: "index",
      });
    } else {
      next();
    }
  } 
  else if (to.matched.some((record) => record.meta.clientGuest)) {
    if (clientLoggedIn()) {
      next({
        name: "client_projects",
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
