<template>
  	<div class="panelbox">
    	<LeftPannel />
    	<div class="right-panel staff-section-page">
      		<div class="header">
        		<CommonHeader title="DashBoard" />
      		</div>
      		<div class="content-page">
        		<div class="fullrow">
          			<div class="row staff-total-timing-list">
            			<div class="col-sm-3">
              				<div class="staff-total-timing" style="margin-bottom: 30px">
                				<p>Total Hours</p>
                				<span v-if="isNaN(this.total_hours)">0</span>
                				<span v-else>{{ this.total_hours }}</span>
              				</div>
            			</div>
            			<div class="col-sm-3">
              				<div class="staff-total-timing">
                				<p>Total Full Days</p>
                				<span v-if="isNaN(this.full_day)">0</span>
                				<span>{{ this.full_day }}</span>
              				</div>
            			</div>
            			<div class="col-sm-3">
              				<div class="staff-total-timing">
                				<p>Total Half Days</p>
                				<span v-if="isNaN(this.half_day)">0</span>
                				<span>{{ this.half_day }}</span>
              				</div>
            			</div>
          			</div>
          			<div class='loaderbox'  v-if="this.attendance.length < 0">
        				<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
      				</div>
          			<div class="common-white-shadow-background staff-date staff-dashboard-filter" >
            			<div class="row">
              				<div class="col-4">
                				<input type="date" style="height: auto" id="From" v-model="filter.start_date" :max="this.today" />
              				</div>
              				<div class="col-4">
                				<input type="date" style="height: auto" v-model="filter.end_date" :min="filter.start_date" />
              				</div>
              				<div class="col-2">
                				<input type="submit" value="Submit" class="yellow-button" @click="filterSearch" />
              				</div>
              				<div class="col-2">
                				<input type="submit" value="Clear" v-if="filter.is_filter == 1" @click="removeSearch" class="yellow-button" />
              				</div>
            			</div>
          			</div>
          			<p v-if="filter.is_filter == 1">
            			Showing {{ this.result_length }} on {{ this.pages.length }} page
          			</p>
          			<div class="col-md-12 page-dropdown">
            			<select class="select-dropdown" v-model="pageSize" @change="pageChange($event)">
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
                    					<th>Date</th>
                    					<th>Check In</th>
                    					<th>Check Out</th>
                    					<th>Hours</th>
                    					<th>Is Checkout</th>
                  					</tr>
                  					<tr v-for="item in attendance" :key="item.id">
                    					<td>{{ this.convertDate(item.date) }}</td>
                    					<td>{{ item.checkin }}</td>
                    					<td>{{ item.checkout }}</td>
                    					<td>{{ this.convertTime(item.hours) >= 1 ? this.convertTime(item.hours) + " Hours" : this.convertTime(item.hours) + " Minutes" }}</td>
                    					<td v-if="item.isCheckout == 'Yes'">
                      						<a style="text-decoration: none; cursor: default" class="gray-btn approve" >{{ item.isCheckout }}</a>
                    					</td>
                    					<td v-else>
                      						<a class="gray-btn reject" style="text-decoration: none; cursor: default">{{ item.isCheckout }}</a>
                    					</td>
                  					</tr>
                				</table>
              				</div>
              				<!-- Pagination -->
              				<div class="col-12">
                				<div class="admininvoice-pagination">
                  					<div v-if="filter.is_filter == 0" class="pagination">
                    					<a v-if="page != 1" @click="prevPage">
                      						<img src="../../assets/images/pagi-left.png" alt="&laquo;"/>
										</a>
                    					<a :class="pageNumber == page ? 'active' : ''" v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCount(pageNumber)" >
                      						{{ pageNumber }}
                    					</a>
                    					<a @click="nextPage" v-if="page < pages.length">
                      						<img src="../../assets/images/pagi-right.png" alt="&raquo;" />
                    					</a>
                  					</div>
                  					<div v-else class="pagination">
                    					<a v-if="page != 1" @click="prevPages">
											<img src="../../assets/images/pagi-left.png" alt="&laquo;" />
                    					</a>
                    					<a :class="pageNumber == page ? 'active' : ''" v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCounts(pageNumber)" >
                      						{{ pageNumber }}
                    					</a>	
                    					<a @click="nextPages" v-if="page < pages.length" >
											<img src="../../assets/images/pagi-right.png" alt="&raquo;" />
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
      		attendance: [],
      		errors: [],
      		total_hours: "",
      		full_day: "",
      		half_day: "",
      		page: 1,
      		filter_page: 1,
      		perPage: 50,
      		pageSize: 50,
      		pages: [],
      		today: new Date().toISOString().substr(0, 10),
      		filter: {
        		is_filter: 0,
        		start_date: new Date(new Date().getFullYear(),new Date().getMonth() - 1,new Date().getDate() + 1).toISOString().substr(0, 10),
        		end_date: new Date().toISOString().substr(0, 10),
      		},
    	};
  	},
  	watch: {
    	attendance() {
      		this.setPages();
    	},
  	},
  	created() {
	    if (this.$store.state.user.length != 0) {
      		this.attendanceSummary();
      		if (localStorage.getItem("StaffDashboardFilter")) {
        		var start_date = JSON.parse(localStorage.getItem("StaffDashboardFilter"))["start_date"];
        		var end_date = JSON.parse(localStorage.getItem("StaffDashboardFilter"))["end_date"];
        		this.filter.start_date = start_date;
        		this.filter.end_date = end_date;
        		this.filterSearch();
      		} else {
        		this.showAttendance();
      		}
    	} else {
      		axios.post(`${base_url}/get_staff`, {
          		headers: { token: localStorage.getItem("token") },
        	}).then((res) => {
          		this.$store.state.user = res.data.user;
          		this.attendanceSummary();
          		if (localStorage.getItem("StaffDashboardFilter")) {
            		var start_date = JSON.parse(localStorage.getItem("StaffDashboardFilter"))["start_date"];
            		var end_date = JSON.parse(localStorage.getItem("StaffDashboardFilter"))["end_date"];
            		this.filter.start_date = start_date;
            		this.filter.end_date = end_date;
            		this.filterSearch();
          		} else {
            		this.showAttendance();
          		}
        	});
    	}
  	},
  	methods: {
	    //listing attendance
	    async showAttendance() {
      		const params = "?pages=" + this.page + "&size=" + this.pageSize;
      		await axios
				.post(`${base_url}/staff_attendance_list` + params,{
          		staffid: this.$store.state.user.staffid,
          		start_date: this.filter.start_date,
          		end_date: this.filter.end_date,
        		})
				.then((response) => {
					if (response.data.error) {
						localStorage.clear();
      					this.$store.state.user = "";
      					this.$router.go();
						// this.$router.push('/login');
					} else {
						this.attendance = response.data.results;
						this.page = response.data.page;
						this.result_length = response.data.length.length;
					}
				})
    	},
    	//per page change
    	pageChange() {
      		this.filter_page = 1;
      		this.page = 1;
      		if (this.filter.is_filter == 1) {
        		this.filterSearch();
      		} else {
        		this.showAttendance();
      		}
    	},
    	async filterSearch() {
      		this.attendanceSummary();
      		var filter = {
        		start_date: this.filter.start_date,
        		end_date: this.filter.end_date,
      		};
      		localStorage.setItem("StaffDashboardFilter", [JSON.stringify(filter)]);
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/staff_attendance_search` + params, {
          		staffid: this.$store.state.user.staffid,
          		start_date: this.filter.start_date,
          		end_date: this.filter.end_date,
        	}).then((res) => {
          		this.attendance = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter.is_filter = 1;
        	});
    	},
    	async removeSearch() {
      		this.filter_page = 1;
      		this.filter.start_date = new Date( new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().substr(0, 10);
      		this.filter.end_date = new Date().toISOString().substr(0, 10);
      		this.attendanceSummary();
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/staff_attendance_search` + params, {
          		staffid: this.$store.state.user.staffid,
          		start_date: this.filter.start_date,
          		end_date: this.filter.end_date,
        	}).then((res) => {
          		localStorage.removeItem("StaffDashboardFilter");
          		this.attendance = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter_page = 1;
          		this.filter.is_filter = 0;
        	});
    	},
    	//attendance summary
    	async attendanceSummary() {
      		await axios.post(`${base_url}/attendancesummary`, {
          		staffid: this.$store.state.user.staffid,
          		start_date: this.filter.start_date,
          		end_date: this.filter.end_date,
        	}).then((res) => {
          		this.total_hours = parseFloat(res.data.total_hours);
          		this.full_day = res.data.full_day;
          		this.half_day = res.data.half_day;
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
    	//page number wise display
    	//no filter page number
    	pageCount(pageNumber) {
      		$(window).scrollTop(0);
      		if (!pageNumber) {
        		this.page++;
      		}
      		this.page = pageNumber;
      		this.showAttendance();
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
      		this.showAttendance();
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
      		this.showAttendance();
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
