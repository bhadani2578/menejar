<template>
  <div class="panelbox">
    <LeftPannel />
    <div class="right-panel staff-section-page">
      <div class="header">
        <CommonHeader title="Leave" />
      </div>
      <div class="content-page">
        <div class="fullrow">
          <div class="row staff-total-timing-list">
            <div class="col-sm-3">
              <div class="staff-total-timing" style="margin-bottom: 30px">
                <p>Approved</p>
                <span> {{ this.approve_leave }}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="staff-total-timing">
                <p>Pending</p>
                <span> {{ this.pending_leave }}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="staff-total-timing">
                <p>Rejected</p>
                <span> {{ this.reject_leave }}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="staff-total-timing">
                <p>Canceled</p>
                <span>{{ this.cancle_leave }}</span>
              </div>
            </div>
          </div>
          <div
            class="track-top-filter-form common-white-shadow-background admin-attendance-filter"
            style="margin: '0px 0px 15px 0px"
          >
            <div class="trach-filter-form-field">
              <input type="date" v-model="filter.start_date" />
            </div>
            <div class="trach-filter-form-field">
              <input type="date" v-model="filter.end_date" />
            </div>
            <div class="trach-filter-form-field">
              <select name="leave_type" v-model="filter.leave_type">
                <option value="" selected>Leave Type</option>
                <option
                  v-for="data in leave_status"
                  :value="data.id"
                  :key="data.name"
                >
                  {{ data.name }}
                </option>
              </select>
            </div>
            <div class="trach-filter-form-field">
              <input
                type="submit"
                value="Submit"
                class="yellow-button"
                @click="filterSearch"
              />
            </div>
            <div class="trach-filter-form-field">
              <input
                type="submit"
                value="Clear"
                class="yellow-button"
                v-if="this.filter.is_filter == 1"
                @click="removeSearch"
              />
            </div>
          </div>
          <p v-if="this.filter.is_filter == 1">
            Showing {{ this.result_length }} on {{ this.pages.length }} page
          </p>
          <div class="col-md-12 page-dropdown">
            <select
              class="select-dropdown"
              v-model="pageSize"
              @change="pageChange($event)"
              style="margin-right: 30px; padding: 8px"
            >
              <option value="50">50</option>
              <option value="30">30</option>
              <option value="20">20</option>
              <option value="10">10</option>
            </select>
            <div class="download-track-button">
              <router-link
                :to="{ name: 'create_leave' }"
                style="padding: 11px 11px"
                ><span>+ </span> Apply Leave Application</router-link
              >
            </div>
          </div>
          <div class="loaderbox" v-if="this.loading">
            <img
              style="width: 100px"
              src="../../assets/images/Loading-bar.gif"
              alt="&laquo;"
            />
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-box fullwidth-table staff-leave-table-body">
                <table>
                  <tr>
                    <th>Applied Date</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>No. of days</th>
                    <th>Status</th>
                    <th style="text-align: center"></th>
                  </tr>
                  <tr v-for="item in leaves" :key="item.id">
                    <td>{{ this.convertDate(item.created_at) }}</td>
                    <td>{{ this.convertDate(item.start_date) }}</td>
                    <td>{{ this.convertDate(item.end_date) }}</td>
                    <td>{{ item.total_day }} Days</td>
                    <td>
                      <a
                        style="text-decoration: none; cursor: pointer"
                        v-if="item.is_status == 0"
                        class="gray-btn pending"
                        >Pending</a
                      >
                      <a
                        style="text-decoration: none; cursor: pointer"
                        v-else-if="item.is_status == 1"
                        class="gray-btn approve"
                        >Approved</a
                      >
                      <a
                        style="text-decoration: none; cursor: pointer"
                        v-else-if="item.is_status == 2"
                        class="gray-btn reject"
                        >Rejected</a
                      >
                      <a
                        style="text-decoration: none; cursor: pointer"
                        v-else
                        class="gray-btn cancel"
                        >Canceled</a
                      >
                    </td>
                    <td>
                      <span
                        v-if="
                          dateDifference(this.data.date, item.start_date) < 0
                        "
                        >NA</span
                      >
                      <span v-else-if="item.is_status == 3"> NA</span>
                      <div v-else>
                        <ul class="action-buttons-list">
                          <li>
                            <router-link
                              v-if="item.is_status !== 1"
                              :to="{
                                name: 'edit_leave',
                                params: { id: item.id },
                              }"
                            >
                              <img
                                src="../../assets/images/pen.png"
                                alt="Edit"
                              />
                            </router-link>
                          </li>
                          <li>
                            <a @click="cancleLeave(item.id)">
                              <img
                                src="../../assets/images/close.png"
                                alt="Delete"
                              />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-12">
                <div class="admininvoice-pagination">
                  <div v-if="filter.is_filter == 0" class="pagination">
                    <a v-if="page != 1" @click="prevPage">
                      <img
                        src="../../assets/images/pagi-left.png"
                        alt="&laquo;"
                      />
                    </a>
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
                    <a v-if="page != 1" @click="prevPages">
                      <img
                        src="../../assets/images/pagi-left.png"
                        alt="&laquo;"
                      />
                    </a>
                    <a
                      :class="pageNumber == page ? 'active' : ''"
                      v-for="pageNumber in pages.slice(page - 1, page + 2)"
                      :key="pageNumber"
                      @click="pageCounts(pageNumber)"
                    >
                      {{ pageNumber }}
                    </a>
                    <a @click="nextPages" v-if="page < pages.length">
                      <img
                        src="../../assets/images/pagi-right.png"
                        alt="&raquo;"
                      />
                    </a>
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
      		loading: true,
      		date: "",
      		data: {
        		date: new Date().toISOString().substr(0, 10),
      		},
      		leaves: [],
      		errors: [],
      		page: 1,
      		filter_page: 1,
      		perPage: 50,
      		pageSize: 50,
      		pages: [],
      		approve_leave: "",
      		pending_leave: "",
      		cancle_leave: "",
      		reject_leave: "",
      		total_leave: "",
      		filter: {
        		is_filter: 0,
        		start_date: "",
        		end_date: "",
        		leave_type: "",
      		},
      		leave_status: [
        		{ id: 2, name: "Rejected" },
        		{ id: 3, name: "Canceled" },
        		{ id: 1, name: "Approved" },
        		{ id: 0, name: "Pending" },
      		],
      		timer: "",
    	};
  	},
  	watch: {
    	leaves() {
      		this.setPages();
    	},
  	},
  	created() {
    	if (this.$store.state.user.length != 0) {
      		this.leaveSummary();
      		if (localStorage.getItem("StaffLeaveFilter")) {
        		var leave_type = JSON.parse(localStorage.getItem("StaffLeaveFilter"))["leave_type"];
        		var start_date = JSON.parse(localStorage.getItem("StaffLeaveFilter"))["start_date"];
        		var end_date = JSON.parse(localStorage.getItem("StaffLeaveFilter"))["end_date"];
        		this.filter.leave_type = leave_type;
        		this.filter.start_date = start_date;
        		this.filter.end_date = end_date;
        		this.filterSearch();
      		} else {
        		this.showLeave();
      		}
    	} else {
      		axios.post(`${base_url}/get_staff`, {
          		headers: { token: localStorage.getItem("token") },
        	}).then((res) => {
          		this.$store.state.user = res.data.user;
          		this.leaveSummary();
          		if (localStorage.getItem("StaffLeaveFilter")) {
            		var leave_type = JSON.parse(localStorage.getItem("StaffLeaveFilter"))["leave_type"];
            		var start_date = JSON.parse(localStorage.getItem("StaffLeaveFilter"))["start_date"];
            		var end_date = JSON.parse(localStorage.getItem("StaffLeaveFilter"))["end_date"];
            		this.filter.leave_type = leave_type;
            		this.filter.start_date = start_date;
            		this.filter.end_date = end_date;
            		this.filterSearch();
          		} else {
            		this.showLeave();
          		}
        	});
    	}
  	},
  	methods: {
    	//listing leave
    	async showLeave() {
      		const params = "?pages=" + this.page + "&size=" + this.pageSize;
      		await axios
				.post(`${base_url}/staff_leave` + params, {
        			staff_id: this.$store.state.user.staffid,
      			})
				.then((response) => {
					if (response.data.error) {
						localStorage.clear();
      					this.$store.state.user = "";
      					this.$router.go();
					} else {
						this.loading = false;
						this.leaves = response.data.results;
						this.page = response.data.page;
						this.result_length = response.data.length.length;
					}
				})
    	},
    	//delete leave
    	async cancleLeave(id) {
      		await axios.post(`${base_url}/cancle_leave/${id}`, {
          		staff_name: this.$store.state.user.name,
          		staff_email: this.$store.state.user.email,
          		staff_date: this.$store.state.user.createdDate,
          		admin_id: this.$store.state.user.id,
        	}).then(() => {
          		this.$notify({
            		title: "<b>Leave</b> Canceled!",
            		type: "warn",
          		});
        	});
      		this.showLeave();
      		this.leaveSummary();
    	},
    	//per page change
    	pageChange() {
      		this.filter_page = 1;
      		this.page = 1;
      		if (this.filter.is_filter == 1) {
        		this.filterSearch();
      		} else {
        		this.showLeave();
      		}
    	},
    	//leave summary
    	async leaveSummary() {
      		await axios.post(`${base_url}/leavesummary`, {
          		staff_id: this.$store.state.user.staffid,
        	}).then((res) => {
          		if (!res.data.total_leave) {
            		this.total_leave = "0";
          		} else {
            		this.total_leave = res.data.total_leave;
          		}
          		if (!res.data.pending_leave) {
            		this.pending_leave = "0";
          		} else {
            		this.pending_leave = res.data.pending_leave;
          		}
          		if (!res.data.cancle_leave) {
            		this.cancle_leave = "0";
          		} else {
            		this.cancle_leave = res.data.cancle_leave;
          		}
          		if (!res.data.reject_leave) {
            		this.reject_leave = "0";
          		} else {
            		this.reject_leave = res.data.reject_leave;
          		}
          		if (!res.data.approve_leave) {
            		this.approve_leave = "0";
          		} else {
            		this.approve_leave = res.data.approve_leave;
          		}
        	});
    	},
    	async filterSearch() {
      		var filter = {
        		leave_type: this.filter.leave_type,
        		start_date: this.filter.start_date,
        		end_date: this.filter.end_date,
      		};
      		localStorage.setItem("StaffLeaveFilter", [JSON.stringify(filter)]);
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/staff_leave_search` + params, {
          		staff_id: this.$store.state.user.staffid,
          		leave_type: this.filter.leave_type,
          		start_date: this.filter.start_date,
          		end_date: this.filter.end_date,
        	}).then((res) => {
          		this.loading = false;
          		this.leaves = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter.is_filter = 1;
          		if (res.data.results.length == 0) {
            		this.pending_leave = "0";
            		this.cancle_leave = "0";
            		this.reject_leave = "0";
            		this.total_leave = "0";
            		this.approve_leave = "0";
          		} else {
            		if (!res.data.results[0]["total_leave"]) {
              			this.total_leave = "0";
            		} else {
              			this.total_leave = res.data.results[0]["total_leave"];
            		}
            		if (!res.data.results[0]["pending_leave"]) {
              			this.pending_leave = "0";
            		} else {
              			this.pending_leave = res.data.results[0]["pending_leave"];
            		}
            		if (!res.data.results[0]["cancle_leave"]) {
              			this.cancle_leave = "0";
            		} else {
              			this.cancle_leave = res.data.results[0]["cancle_leave"];
            		}
            		if (!res.data.results[0]["reject_leave"]) {
              			this.reject_leave = "0";
            		} else {
              			this.reject_leave = res.data.results[0]["reject_leave"];
            		}
            		if (!res.data.results[0]["approve_leave"]) {
              			this.approve_leave = "0";
            		} else {
              			this.approve_leave = res.data.results[0]["approve_leave"];
            		}
          		}
        	});
    	},
    	async removeSearch() {
      		this.filter_page = 1;
      		this.filter.start_date = "";
      		this.filter.end_date = "";
      		this.filter.leave_type = "";
      		this.leaveSummary();
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/staff_leave_search` + params, {
          		staff_id: this.$store.state.user.staffid,
          		leave_type: this.filter.leave_type,
          		start_date: this.filter.start_date,
          		end_date: this.filter.end_date,
        	}).then((res) => {
          		this.loading = false;
          		localStorage.removeItem("StaffLeaveFilter");
          		this.leaves = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter_page = 1;
          		this.filter.is_filter = 0;
        	});
    	},
    	//date formate
    	convertDate: function (cvt_date) {
      		var date = new Date(cvt_date);
      		var year = date.getFullYear();
      		var month = date.getMonth() + 1;
      		var dt = date.getDate();
      		if (dt < 10) {
        		dt = "0" + dt;
      		}
      		if (month < 10) {
        		month = "0" + month;
      		}
      		const cvt_date_formate = dt + "/" + month + "/" + year;
      		return cvt_date_formate;
    	},
    	convertTime: function (cvt_time) {
      		const hms = cvt_time;
      		const [hr, mt, s] = hms.split(":");
      		const totalSeconds = +hr * 60 * 60 + +mt * 60 + +s;
      		var hours = Math.floor(totalSeconds / 3600);
      		var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
      		if (minutes < 10) {
        		minutes = "0" + minutes;
      		}
      		if (hours > 0) {
        		return hours + "." + minutes;
      		} else {
        		return hours + "." + minutes;
      		}
    	},
    	dateDifference(date, due_date) {
      		const date1 = new Date(date);
      		const date2 = new Date(due_date);
      		const diffTime = date2 - date1;
      		var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      		return diffDays;
    	},
    	//page number wise display
    	//no filter page number
    	pageCount(pageNumber) {
      		$(window).scrollTop(0);
      		if (!pageNumber) {
      		  	this.page++;
      		}
      		this.page = pageNumber;
      		this.showLeave();
    	},
    	//filter page number
    	pageCounts(pageNumber) {
      		if (!pageNumber) {
        		this.filter_page++;
      		}
      		this.filter_page = pageNumber;
      		this.filterSearch();
    	},
    	//no filter prev page
    	prevPage() {
      		$(window).scrollTop(0);
      		this.page--;
      		this.showLeave();
    	},
    	//filter prev page
    	prevPages() {
      		this.filter_page--;
      		this.filterSearch();
    	},
    	//filter display next page
    	nextPage() {
      		$(window).scrollTop(0);
      		this.page++;
      		this.showLeave();
    	},
    	nextPages() {
      		this.filter_page++;
      		this.filterSearch();
    	},
    	setPages() {
      		this.pages = [];
      		this.perPage = this.pageSize;
      		let numberOfPages = Math.ceil(this.result_length / this.perPage);
      		for (let index = 1; index <= numberOfPages; index++) {
        		this.pages.push(index);
      		}
    	},
  	},
};
</script>
