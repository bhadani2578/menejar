<template>
  <div class="panelbox">
    <LeftPannel />
    <div class="right-panel staff-section-page">
      <div class="header"><CommonHeader title="Timesheet" /></div>
      <div class="content-page">
        <div class="fullrow">
          <div
            class="common-white-shadow-background staff-date staff-dashboard-filter"
          >
            <div class="row">
              <div class="col-4">
                <select
                  name="Select_Month"
                  id="Select-Month"
                  v-model="currentMonth"
                  @change="getmonthsweek($event.target.value)"
                >
                  <option value="" selected>Select Month</option>
                  <option
                    v-for="data in listMonths"
                    :value="data.val"
                    :key="data.name"
                  >
                    {{ data.name }}
                  </option>
                </select>
              </div>
              <div class="col-4">
                <select v-model="this.currentWeek">
                  <option value="" selected>Select Week</option>
                  <option
                    v-for="data in weekarray"
                    :value="data.value"
                    :key="data.name"
                  >
                    {{ data.name }}
                  </option>
                </select>
              </div>
              <div class="col-2">
                <input
                  type="submit"
                  value="Submit"
                  class="yellow-button"
                  @click="getWeeksDay()"
                />
              </div>
              <!-- <div class="col-2">
                <input
                  type="submit"
                  value="Clear"
                  v-if="filter.is_filter == 1"
                  @click="removeSearch"
                  class="yellow-button"
                />
              </div> -->
            </div>
          </div>
          <p v-if="filter.is_filter == 1">
            Showing {{ this.result_length }} on {{ this.pages.length }} page
          </p>
          <div class="col-md-12 page-dropdown">
            <select
              class="select-dropdown"
              v-model="pageSize"
              @change="pageChange($event)"
            >
              <option value="50">50</option>
              <option value="30">30</option>
              <option value="20">20</option>
              <option value="10">10</option>
            </select>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-box fullwidth-table staff-dashboard-table-body">
                <table>
                  <tr>
                    <th>Project</th>
                    <th v-for="data in this.weekday" :key="data.index">
                      {{
                        new Date(
                          this.year + "-" + (this.months + 1) + "-" + data
                        ).toLocaleDateString("en-us", { weekday: "short" })
                      }}
                      <br />{{ data }}/{{ this.months + 1 }}
                    </th>
                    <th>Total Hrs</th>
                  </tr>
                  <tr v-for="(timesheet, k) in timesheetData" :key="k">
                    <td>
                      <select
                        v-model="timesheet.project_id"
                        @change="getTimeSheetData($event.target.value, k)"
                      >
                        <option value="null" selected>Select Project</option>
                        <option
                          v-for="data in projectnames"
                          :value="data.id"
                          :key="data.id"
                        >
                          {{ data.project_name }}
                        </option>
                      </select>
                      <br />
                      <select
                        v-model="timesheet.project_id"
                        disabled
                      >
                        <option :value="timesheet.project_id" selected>
                          {{  }}
                        </option>
                      </select>
                    </td>
                    <td v-for="(data, i) in timesheet.project_ts_data" :key="i">
                      <input
                        type="text"
                        v-model="data.time"
                        @change="calculateTotalHours(k)"
                      />
                      <br />
                      <input
                        type="text"
                        :value="this.nonMutableData[k].copy_ts_data[i].time"
                        readonly
                      />
                    </td>
                    <td>
                      <input type="text" v-model="timesheet.total_hours" />
                      <br />
                      <input
                        type="text"
                        :value="this.nonMutableData[k].copy_total_hours"
                        disabled
                      />
                    </td>
                    <td class="col-1">
                      <div class="newinvoice-less" v-if="k >= 0">
                        <a @click="deleteRow(k, timesheet)">
                          <img
                            src="../../assets/images/remove.jpg"
                            alt="Add Less"
                          />
                        </a>
                      </div>
                    </td>
                    <td>
                      <div class="newinvoice-data-plus">
                        <div class="addnew-button">
                          <a @click="addNewRow"><span>+</span> New Line </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <div>
                <div>
                  <button
                    @click="submitTimesheet"
                    class="button addnew-button button-box"
                  >
                    Submit
                  </button>
                </div>
              </div>
              <!-- Pagination -->
              <div class="col-12">
                <div class="admininvoice-pagination">
                  <div v-if="filter.is_filter == 0" class="pagination">
                    <a v-if="page != 1" @click="prevPage"
                      ><img
                        src="../../assets/images/pagi-left.png"
                        alt="&laquo;"
                    /></a>
                    <a
                      :class="pageNumber == page ? 'active' : ''"
                      v-for="pageNumber in pages.slice(page - 1, page + 2)"
                      :key="pageNumber"
                      @click="pageCount(pageNumber)"
                    >
                      {{ pageNumber }}
                    </a>
                    <a @click="nextPage" v-if="page < pages.length">
                      <img
                        src="../../assets/images/pagi-right.png"
                        alt="&raquo;"
                      />
                    </a>
                  </div>
                  <div v-else class="pagination">
                    <a v-if="page != 1" @click="prevPages"
                      ><img
                        src="../../assets/images/pagi-left.png"
                        alt="&laquo;"
                    /></a>
                    <a
                      :class="pageNumber == page ? 'active' : ''"
                      v-for="pageNumber in pages.slice(page - 1, page + 2)"
                      :key="pageNumber"
                      @click="pageCounts(pageNumber)"
                    >
                      {{ pageNumber }}
                    </a>
                    <a @click="nextPages" v-if="page < pages.length"
                      ><img
                        src="../../assets/images/pagi-right.png"
                        alt="&raquo;"
                    /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LeftPannel from "../../components/user/LeftPannel.vue";
import CommonHeader from "../../components/user/CommonHeader.vue";
import CommonFooter from "../../components/CommonFooter.vue";
import base_url from "../../base_url.js";
const moment = require("moment");
const $ = require("jquery");
window.$ = $;

export default {
  components: {
    LeftPannel,
    CommonHeader,
    CommonFooter,
  },
  data() {
    return {
      // attendance: [],
      errors: [],
      full_day: "",
      half_day: "",
      page: 1,
      filter_page: 1,
      perPage: 50,
      pageSize: 50,
      selectedProjectId: [],
      pages: [],
      today: new Date().toISOString().substr(0, 10),
      filter: {
        is_filter: 0,
        start_date: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          new Date().getDate() + 1
        )
          .toISOString()
          .substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
      },
      //new variabe above are remove after complete working this page
      listMonths: [
        {
          val: new Date().getFullYear() + "-1",
          name: "January - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-2",
          name: "February - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-3",
          name: "March - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-4",
          name: "April -" + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-5",
          name: "May - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-6",
          name: "June - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-7",
          name: "July - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-8",
          name: "August - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-9",
          name: "September - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-10",
          name: "October - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-11",
          name: "November - " + new Date().getFullYear(),
        },
        {
          val: new Date().getFullYear() + "-12",
          name: "December - " + new Date().getFullYear(),
        },
      ],
      currentMonth:
        new Date().getFullYear() + "-" + (new Date().getMonth() + 1),
      projectnames: [],
      weekarray: [],
      months: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      weekday: [],
      year: new Date().getFullYear(),
      currentWeek: "",
      timesheetData: [
        {
          project_id: "",
          project_ts_data: [],
          total_hours: 0,
        },
      ],
      nonMutableData: [
        {
          copy_ts_data: [],
          copy_total_hours: 0,
        },
      ],
    };
  },
  created() {
    if (this.$store.state.user.length != 0) {
      this.getProjectName();
      if (localStorage.getItem("StaffTrackFilter")) {
        var clientid = JSON.parse(localStorage.getItem("StaffTrackFilter"))[
          "clientid"
        ];
        var indate = JSON.parse(localStorage.getItem("StaffTrackFilter"))[
          "indate"
        ];
        var outdate = JSON.parse(localStorage.getItem("StaffTrackFilter"))[
          "outdate"
        ];
        this.filter.clientid = clientid;
        this.filter.indate = indate;
        this.filter.outdate = outdate;
        this.filterSearch();
      }
    } else {
      axios
        .post(`${base_url}/get_staff`, {
          staff_id: this.$store.state.user.staffid,
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.$store.state.user = res.data.user;
          this.getProjectName();
          if (localStorage.getItem("StaffTrackFilter")) {
            var clientid = JSON.parse(localStorage.getItem("StaffTrackFilter"))[
              "clientid"
            ];
            var indate = JSON.parse(localStorage.getItem("StaffTrackFilter"))[
              "indate"
            ];
            var outdate = JSON.parse(localStorage.getItem("StaffTrackFilter"))[
              "outdate"
            ];
            this.filter.clientid = clientid;
            this.filter.indate = indate;
            this.filter.outdate = outdate;
            this.filterSearch();
          }
        });
    }
  },
  watch: {
    attendance() {
      this.setPages();
    },
  },
  mounted() {
    this.getProjectName();
    this.monthsList(this.currentYear, this.months);
  },
  methods: {
    //project list
    async getProjectName() {
      try {
        // const response = await axios.get(
        //   `${base_url}/projectsforstaff/${this.$store.state.user.id}`
        // );
        // this.projectnames = response.data;
        const response = await axios.get(`${base_url}/staffassignedprojects/${this.$store.state.user.staffid}`);
      	this.projectnames = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    //page number wise display

    //list of all months week date
    async monthsList(year, month) {
      const weeks = [];
      const firstDate = new Date(year, month, 1);
      const lastDate = new Date(year, month + 1, 0);
      const numDays = lastDate.getDate();
      const date = new Date().getDate();
      let dayOfWeekCounter = firstDate.getDay();

      for (let date = 1; date <= numDays; date++) {
        if (dayOfWeekCounter === 0 || weeks.length === 0) {
          weeks.push([]);
        }
        weeks[weeks.length - 1].push(date);
        dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
      }

      var fullmonth = firstDate.toLocaleString("default", { month: "long" });
      month = month + 1;
      this.weeks = weeks;
      this.weekarray = weeks.filter((w) => !!w.length).map((w) => ({
          start: w[0],
          end: w[w.length - 1],
          value: year + "-" + month  + "-" + `${w[0]<10?`0${w[0]}`:w[0]}` + ":" +  year + "-" + month + "-"+ `${w[w.length - 1] < 10 ? `0${w[w.length - 1]}` : w[w.length - 1]}`,
          name: `${w[0] < 10 ? `0${w[0]}` : w[0]}` + "-" + fullmonth +  "-" + year + " : " +  `${ w[w.length - 1] < 10 ? `0${w[w.length - 1]}` : w[w.length - 1] }` + "-" + fullmonth + "-" + year,
          dates: w,
        }));

      weeks.filter((w) => {
        if (w.includes(date)) {
          this.currentWeek = year + "-" + month + "-" + `${w[0] < 10 ? `0${w[0]}` : w[0]}` + ":" + year + "-" + month + "-" + `${w[w.length - 1] < 10 ? `0${w[w.length - 1]}` : w[w.length - 1]}`;
          this.weekday = w;
        }
      });
    },

    //display week based on months name
    async getmonthsweek(e) {
      var month = e.substr(e.indexOf("-") + 1);
      this.selectMonth, (this.months = parseInt(month) - 1);
      //  = parseInt(month);
      this.year = this.currentYear;

      this.monthsList(this.currentYear, parseInt(month) - 1);
      // this.timesheetData = null;
    },
    //display week day based on selected week
    async getWeeksDay() {
      // this.timesheetData = null;
      if (this.timesheetData.length > 1) {
        this.timesheetData = [
          {
            project_id: "",
            project_ts_data: [],
            total_hours: 0,
          },
        ];
      }
      var first_date = this.currentWeek.substr(
        0,
        this.currentWeek.indexOf(":")
      );
      var last_date = this.currentWeek.substr(
        this.currentWeek.indexOf(":") + 1
      );
      var first_reverse = first_date.split("-").reverse().join("-");
      var last_reverse = last_date.split("-").reverse().join("-");

      var week_first = first_reverse.substr(0, first_reverse.indexOf("-"));
      var week_last = last_reverse.substr(0, last_reverse.indexOf("-"));

      this.weeks.filter((w) => {
        if (week_first == w[0] && week_last == w[w.length - 1]) {
          this.weekday = w;
        }
      });
    },
    async getTimeSheetData(e, rowIndex) {
      const project_id = String(e);
      this.selectedProjectId[rowIndex] = e;
      const staff_id = String(this.$store.state.user.staffid);
      const first_date = String(this.currentWeek.split(":")[0]);
      const last_date = String(this.currentWeek.split(":")[1]);
      const dates = [];
      const startDate = new Date(first_date);
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(last_date);
      endDate.setDate(endDate.getDate() + 1);

      let currentDate = moment(startDate);
      const endDate1 = moment(endDate);

      while (currentDate.isSameOrBefore(endDate1)) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.add(1, "day");
      }

      const timesheetPromises = dates.map((date) => {
        return axios.post(`${base_url}/gettimesheetdata`, {
          project_id: project_id,
          staff_id: staff_id,
          week_date: date,
          // first: first_date,
          // last: last_date,
        });
      });

      try {
        this.timesheetData.pop();
        this.nonMutableData.pop();
        const responses = await Promise.all(timesheetPromises);
        let times = [];
        const timeSheetData = responses.map((response, index) => {
          const data = response.data;
          const date = dates[index];
          if (data.length === 0) {
            return { date: date, time: "00 : 00" }; // Placeholder for missing data
          } else {
            times.push(data[0].time);
            const time = data[0].time;
            return { date: date, time: time };
          }
        });
        const timeSheetDataCopy = JSON.parse(JSON.stringify(timeSheetData));

        this.timesheetData.push({
          project_id: e,
          project_ts_data: timeSheetData,
          total_hours: this.sumTimes(times),
        });
        const nonEditableDataCopy = {
          copy_ts_data: JSON.parse(JSON.stringify(timeSheetDataCopy)),
          copy_total_hours: this.sumTimes(times),
        };
        this.nonMutableData.push({
          copy_ts_data: nonEditableDataCopy.copy_ts_data,
          copy_total_hours: nonEditableDataCopy.copy_total_hours,
        });
      } catch (error) {
        console.log(error);
      }
    },

    //submit tmesheet
    async submitTimesheet() {
      const month = this.currentMonth;
      const week = this.currentWeek;
      const timesheet = this.timesheetData;
      const staff_id = this.$store.state.user.staffid;
      const projectIDs = this.selectedProjectId;
      try {
        const res = await axios.post(`${base_url}/submitsheetdata`, {
          month: month,
          week: week,
          staffid: staff_id,
        });
        const insertID = res.data.insertId;
        timesheet.map(async (sheet, index) => {
          await axios.post(`${base_url}/submittimesheet`, {
            projectid: projectIDs[index],
            timesheet: sheet,
            sheetid: insertID,  
          });
        });
        this.$notify({
          title: "Timesheet Submitted Successfuly",
          type: "sucess",
        });
        (this.timesheetData = [
          {
            project_id: "",
            project_ts_data: [],
            total_hours: 0,
          },
        ]),
          (this.nonMutableData = [
            {
              copy_ts_data: [],
              copy_total_hours: 0,
            },
          ]);
      } catch (error) {
        console.log(error);
      }
    },

    //check aprovement status
    // async checkApprovedStatus() {
    //   const month = this.currentMonth;
    //   const week = this.currentWeek;
    //   const staff_id = this.$store.state.user.staffid;

    //   const res = await axios.post(`${base_url}/checkapprovedstatus`, {
    //     month: month,
    //     week: week,
    //     staffid: staff_id
    //   })
    //   console.log("checkapprove", res);
    //   return res;
    // },

    sumTimes(timeStrings) {
      const totalMinutes = timeStrings.reduce((total, timeString) => {
        const [hours, minutes] = timeString.split(":");
        return total + parseInt(hours, 10) * 60 + parseInt(minutes, 10);
      }, 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const sumTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      return sumTime;
    },
    calculateTotalHours(row) {
      const timesheetRecords = this.timesheetData[row].project_ts_data;
      const times = [];
      let newTotalHours = "";
      timesheetRecords.map((timesheet) => {
        times.push(timesheet.time);
      });
      newTotalHours = this.sumTimes(times);
      this.timesheetData[row].total_hours = newTotalHours;
    },
    addNewRow() {
      this.timesheetData.push({
        project_id: "",
        project_ts_data: [],
        total_hours: 0,
      });
      this.nonMutableData.push({
        copy_ts_data: [],
        copy_total_hours: 0,
      });
    },

    deleteRow(index, timesheet) {
      if (this.timesheetData.length == 1) {
        this.$notify({
          title: "It is the only row",
          type: "warn",
        });
      } else {
        var idx = this.timesheetData.indexOf(timesheet);
        if (idx > -1) {
          this.timesheetData.splice(idx, 1);
          this.nonMutableData.splice(idx, 1);
          this.selectedProjectId.splice(idx, 1)
        }
      }
    },
  },
};
</script>
