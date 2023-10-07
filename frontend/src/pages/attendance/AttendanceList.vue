<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Attendance" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Attendance"></staff-header>
      		</div>
      		<div class="content-page admin-attendance-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-sm-6"></div>
            			<div class="col-sm-6 download-track-button-sec">
              				<ul>
                				<li>
                  					<div class="download-track-button">
                    					<a @click="attendanceCSV">
                      						<img src="../../assets/images/download-arrow.png" alt="Download"/>Download
										</a>
                  					</div>
                				</li>
                				<li>
                  					<div class="download-track-button">
                    					<router-link :to="{ name: 'AddAttendance' }">
											<img src="../../assets/images/plus-icon.png" alt="Add Track"/>Add Attendance
										</router-link>
                  					</div>
                				</li>
              				</ul>
            			</div>
          			</div>
          			<div class="track-top-filter-form common-white-shadow-background admin-attendance-filter">
            			<div class="trach-filter-form-field">
              				<select v-model="filter.staffid">
                				<option value="" selected>All</option>
                				<option v-for="data in names" :value="data.id" :key="data.id">{{ data.name }}</option>
              				</select>
            			</div>
            			<div class="trach-filter-form-field">
              				<input type="date" name="from" :max="filter.outdate" v-model="filter.indate" />
            			</div>
            			<div class="trach-filter-form-field">
              				<input type="date" name="to" :max="filter.outdate" v-model="filter.outdate" />
            			</div>
            			<div class="trach-filter-form-field">
              				<input type="submit" value="Submit" class="yellow-button" @click="filterSearch" />
            			</div>
            				<input type="submit" value="Clear" class="yellow-button" v-if="filter.is_filter == 1" @click="removeSearch" />
          				</div>
          				<div v-if="filter.is_filter == 1">Showing {{ this.result_length }} on {{ this.pages.length }} page</div>
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
              					<div class="fullwidth-table track-table-body attendance-admin-table-body">
                					<table>
                  						<tr>
                    						<th style="padding: 15px 21px 15px 29px">Date</th>
                    						<th style="padding: 15px 21px 15px 29px">User</th>
                    						<th style="padding: 15px 21px 15px 29px">Check In</th>
                    						<th style="padding: 15px 21px 15px 29px">Check Out</th>
                    						<th style="padding: 15px 21px 15px 29px">Hours</th>
                    						<th style="padding: 15px 21px 15px 29px">Is Checkout</th>
                  						</tr>
                  						<tr v-for="item in items" :key="item.id">
                    						<td>{{ this.convertDate(item.date) }}</td>
                    						<td>{{ item.name }}</td>
                    						<td>{{ item.checkin }}</td>
                    						<td>{{ item.checkout }}</td>
                    						<td>{{ item.hours }}</td>
                    						<td>
												<a :class="{'gray-btn approve': item.isCheckout === 'Yes','gray-btn reject': item.isCheckout === 'No',}">
                        							{{ item.isCheckout }}
                      							</a>
                    						</td>
                  						</tr>
                					</table>
              					</div>
            				</div>
            				<div class="col-12">
              					<div class="admininvoice-pagination">
                					<div v-if="filter.is_filter == 0" class="pagination">
                  						<a v-if="page != 1" @click="prevPage">
											<img src="../../assets/images/pagi-left.png" alt="&laquo;" />
                  						</a>
                  						<a :class="pageNumber == page ? 'active' : ''" v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCount(pageNumber)">
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
                  						<a :class="pageNumber == page ? 'active' : ''" v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCounts(pageNumber)">
                    						{{ pageNumber }}
                  						</a>
                  						<a @click="nextPages" v-if="page < pages.length">
                    						<img src="../../assets/images/pagi-right.png" alt="&raquo;" />
                  						</a>
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
import LeftPannel from "../../components/admin/LeftPannel.vue";
import CommonHeader from "../../components/admin/CommonHeader.vue";
import StaffHeader from "../../components/user/CommonHeader.vue";
import CommonFooter from "../../components/CommonFooter.vue";
import axios from "axios";
import base_url from "../../base_url.js";

const $ = require("jquery");
window.$ = $;

export default {
  	components: {
    	LeftPannel,
    	CommonHeader,
    	CommonFooter,
    	StaffHeader,
  	},
  	data() {
	    return {
      		type: "",
      		items: [],
      		names: [],
      		page: 1,
      		filter_page: 1,
      		result_length: "",
      		perPage: 50,
      		pageSize: 50,
      		pages: [],
      		filter: {
        		staffid: "",
        		indate: new Date(new Date().getFullYear(),new Date().getMonth() - 1,new Date().getDate() + 1).toISOString().substr(0, 10),
        		outdate: new Date().toISOString().substr(0, 10),
        		is_filter: 0,
      		},
    	};
  	},
  	beforeRouteEnter(to, from, next) {
    	if (localStorage.getItem("type") == "staff") {
      		if (localStorage.getItem("permission").includes("AttendanceList")) {
        		next();
      		} else {
        		next({ name: "staff_dashboard" });
      		}
    	} else {
      		next();
    	}
  	},
  	created() {
    	this.type = localStorage.getItem("type");
    	axios.post(`${base_url}/user`, {
        	headers: { token: localStorage.getItem("token") },
        	type: localStorage.getItem("type"),
      	}).then((res) => {
        	this.$store.state.user = res.data.user;
        	this.getName();
        	if (localStorage.getItem("AttendanceFilter")) {
          		var staffid = JSON.parse(localStorage.getItem("AttendanceFilter"))["staffid"];
          		var indate = JSON.parse(localStorage.getItem("AttendanceFilter"))["indate"];
          		var outdate = JSON.parse(localStorage.getItem("AttendanceFilter"))["outdate"];
          		this.filter.staffid = staffid;
          		this.filter.indate = indate;
          		this.filter.outdate = outdate;
          		this.filterSearch();
        	} else {
          		this.showAttendance();
        	}
        	if (this.$store.state.user.is_business == 1) {
          		this.$router.push("/attendancelist");
        	} else {
          		this.$router.push("/business_setting");
        	}
      	});
  	},
  	watch: {
	    items() {
      		this.setPages();
    	},
  	},
  	methods: {
    	async filterSearch() {
      		var filter = {
        		staffid: this.filter.staffid,
        		indate: this.filter.indate,
        		outdate: this.filter.outdate,
      		};
      		localStorage.setItem("AttendanceFilter", [JSON.stringify(filter)]);
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/attendance_search` + params, {
          		admin_id: this.$store.state.user.id,
          		staffid: this.filter.staffid,
          		indate: this.filter.indate,
          		outdate: this.filter.outdate,
        	}).then((res) => {
          		this.items = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter.is_filter = 1;
        	});
    	},
    	async removeSearch() {
      		this.filter_page = 1;
      		this.filter.staffid = "";
      		(this.filter.indate = new Date(new Date().getFullYear(),new Date().getMonth() - 1,new Date().getDate() + 1).toISOString().substr(0, 10)),
        	(this.filter.outdate = new Date().toISOString().substr(0, 10));
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/attendance_search` + params, {
          		admin_id: this.$store.state.user.id,
          		staffid: this.filter.staffid,
          		indate: this.filter.indate,
          		outdate: this.filter.outdate,
        	}).then((res) => {
          		localStorage.removeItem("AttendanceFilter");
          		this.items = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter_page = 1;
          		this.filter.is_filter = 0;
        	});
    	},
    	async getName() {
      		const response = await axios.post(`${base_url}/staffsfortrack/${this.$store.state.user.id}`);
      		this.names = response.data;
    	},
    	async attendanceCSV() {
      		let x = await axios.post(`${base_url}/attendancecsv`, {
        		admin_id: this.$store.state.user.id,
        		staffid: this.filter.staffid,
        		indate: this.filter.indate,
        		outdate: this.filter.outdate,
      		});
      		var outer = [];
      		for (var i = 0; i < x.data.length; i++) {
        		let temp = [];
        		temp[0] = x.data[i].name;
        		temp[1] = x.data[i].date;
        		temp[2] = x.data[i].checkin;
        		temp[3] = x.data[i].checkout;
        		temp[4] = x.data[i].hours;
        		temp[5] = x.data[i].isCheckout;
        		outer.push(temp);
      		}
      		this.download_csv_file(outer);
    	},
    	download_csv_file(csvFileData) {
      		var csv = "Name,Date,Checkin,Checkout,hours,isCheckout\n";
      		csvFileData.forEach(function (row) {
        		csv += row.join(",");
        		csv += "\n";
      		});
      		var hiddenElement = document.createElement("a");
      		hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      		hiddenElement.target = "_blank";
      		hiddenElement.download = "attendance.csv";
      		hiddenElement.click();
    	},
    	async showAttendance() {
      		const params = "?pages=" + this.page + "&size=" + this.pageSize;
      		const response = await axios.post(`${base_url}/get_attendance` + params, {
      		  	admin_id: this.$store.state.user.id,
        		indate: this.filter.indate,
        		outdate: this.filter.outdate,
      		});
      		this.items = response.data.results;
      		this.page = response.data.page;
      		this.result_length = response.data.length.length;
    	},
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
    	setPages() {
      		this.pages = [];
      		this.perPage = this.pageSize;
      		let numberOfPages = Math.ceil(this.result_length / this.perPage);
      		for (let index = 1; index <= numberOfPages; index++) {
        		this.pages.push(index);
      		}
    	},
    	//page number wise display
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
    	//display prev page
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
    	//display next page
    	nextPage() {
      		$(window).scrollTop(0);
      		this.page++;
      		this.showAttendance();
    	},
    	nextPages() {
      		this.filter_page++;
      		this.filterSearch();
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
  	},
};
</script>

<style></style>
