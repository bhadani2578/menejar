<template>
  	<div class="panelbox">
	    <LeftPannel />
	    <div class="right-panel staff-section-page">
      		<div class="header">
        		<CommonHeader title="Track" />
      		</div>
      		<div class="content-page" style="padding: 15px">
        		<div class="fullrow">
          			<div class="">
            			<div class="track-top-filter-form staff-date common-white-shadow-background">
              				<div class="trach-filter-form-field" style="width: 15.44%">
                				<select v-model="filter.clientid" @change="getProjectName($event.target.value)">
                  					<option value="" selected>Select Client</option>
                  					<option v-for="data in clients" :value="data.id" :key="data.id">
                    					{{ data.organization }}
                    					{{ data.name }}
                  					</option>
                				</select>
              				</div>
              				<div class="trach-filter-form-field" style="width: 15.44%">
                				<select v-model="filter.projectid">
                  					<option value="" selected>Select Project</option>
                  					<option v-for="data in projectnames" :value="data.id" :key="data.id">{{ data.project_name }}</option>
                				</select>
              				</div>
              				<div class="trach-filter-form-field" style="width: 15.44%">
                				<input type="date" name="from" v-model="filter.indate" style="padding: 10px 10px !important" />
              				</div>
              				<div class="trach-filter-form-field" style="width: 15.44%">
                				<input type="date" name="to" v-model="filter.outdate" style="padding: 10px 10px !important" />
              				</div>
              				<div class="trach-filter-form-field" style="width: 15.44%; margin-right: 8px" >
                				<input type="submit" value="Submit" class="yellow-button" @click="filterSearch" />
              				</div>
              				<div class="trach-filter-form-field" style="width: 15.44%">
                				<input type="submit" value="Clear" class="yellow-button" v-if="filter.is_filter == 1" @click="removeSearch" />
              				</div>
            			</div>
            			<p v-if="filter.is_filter == 1">
              				Showing {{ this.result_length }} on {{ this.pages.length }} page
            			</p>

            			<div class="col-md-12 page-dropdown">
              				<select class="select-dropdown" v-model="pageSize" @change="pageChange($event)"> >
                				<option value="50">50</option>
                				<option value="30">30</option>
                				<option value="20">20</option>
                				<option value="10">10</option>
              				</select>
            			</div>
            			<div class='loaderbox'  v-if="this.loading">
        					<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
      					</div>
            			<div class="row">
              				<div class="col-12">
            					<div class="fullwidth-table track-table-body">
                  					<table>
                    					<tr>
                    						<th style="15px 42px 15px 42px">Date</th>
                      						<th style="15px 42px 15px 42px">User</th>
                      						<th style="15px 42px 15px 42px">Project</th>
                      						<th style="15px 42px 15px 42px">Task</th>
                      						<th style="15px 42px 15px 42px">Start</th>
                      						<th style="15px 42px 15px 42px">End</th>
                      						<th style="15px 42px 15px 42px">Time</th>
                    					</tr>
                    					<tr v-for="item in items" :key="item.id">
                      						<td>{{ this.convertDate(item.date) }}</td>
                      						<td>{{ item.name }}</td>
                      						<td>{{ item.project_name }}</td>
                      						<td>
                        						<div v-if="item.task.length <= 50">{{ item.task }}</div>
                        						<div v-else>{{ item.task.substring(0, 50) + ".." }}</div>
                      						</td>
                      						<td>{{ item.start }}</td>
                      						<td>{{ item.end }}</td>
                      						<td v-if="item.end === '00:00:00'"></td>
                      						<td v-else>{{ item.time }}</td>
                    					</tr>
                  					</table>
                				</div>
              				</div>
              				<!-- Pagination -->
              				<div class="col-12">
                				<div class="admininvoice-pagination">
                  					<div v-if="filter.is_filter == 0" class="pagination">
                    					<img src="../../assets/images/pagi-left.png" v-if="page != 1" @click="prevPage" alt="&laquo;" />
                    					<a v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCount(pageNumber)" >
                      						{{ pageNumber }}
                    					</a>
                    					<img src="../../assets/images/pagi-right.png" alt="&raquo;" @click="nextPage" v-if="page < pages.length" />
                  					</div>
                  					<div v-else class="pagination">
                    					<button type="button" class="btn btn-sm btn-outline-secondary" v-if="page != 1" @click="prevPages">Prev</button>
                    					<button type="button" class="btn btn-sm btn-outline-secondary" v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCounts(pageNumber)" > {{ pageNumber }}</button>
                    					<button type="button" @click="nextPages" v-if="page < pages.length" class="btn btn-sm btn-outline-secondary">Next</button>
                  					</div>
                				</div>
              				</div>
              				<div class="col-12">
                				<div class="track-total-time">
                  					<ul>
                    					<li>Total Time</li>
                    					<li>{{ totaltime }}</li>
                  					</ul>
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
      		clients: [],
      		projectnames: [],
      		items: [],
      		page: 1,
      		filter_page: 1,
      		result_length: "",
      		perPage: 50,
      		pageSize: 50,
      		totaltime: "",
      		pages: [],
      		filter: {
        		clientid: "",
        		staffid: "",
        		projectid: "",
        		indate: new Date(new Date().getFullYear(),new Date().getMonth() - 1,new Date().getDate() + 1).toISOString().substr(0, 10),
        		outdate: new Date().toISOString().substr(0, 10),
        		is_filter: 0,
      		},
    	};
  	},
  	created() {
		// this.checkActivation();

	    if (this.$store.state.user.length != 0) {
      		this.getClientName(), this.getProjectName();
      		if (localStorage.getItem("StaffTrackFilter")) {
        		var clientid = JSON.parse(localStorage.getItem("StaffTrackFilter"))["clientid"];
        		var indate = JSON.parse(localStorage.getItem("StaffTrackFilter"))["indate"];
        		var outdate = JSON.parse(localStorage.getItem("StaffTrackFilter"))["outdate"];
        		this.filter.clientid = clientid;
        		this.filter.indate = indate;
        		this.filter.outdate = outdate;
        		this.filterSearch();
      		} else {
        		this.showStaffTrack();
      		}
    	} else {
      		axios.post(`${base_url}/get_staff`, {
				staff_id: this.$store.state.user.staffid, 
          		headers: { 
					token: localStorage.getItem("token"),
				},
        	}).then((res) => {
					this.$store.state.user = res.data.user;
					this.getClientName(), this.getProjectName();
					if (localStorage.getItem("StaffTrackFilter")) {
					  var clientid = JSON.parse(localStorage.getItem("StaffTrackFilter"))["clientid"];
					  var indate = JSON.parse(localStorage.getItem("StaffTrackFilter"))["indate"];
					  var outdate = JSON.parse(localStorage.getItem("StaffTrackFilter"))["outdate"];
					  this.filter.clientid = clientid;
					  this.filter.indate = indate;
					  this.filter.outdate = outdate;
					  this.filterSearch();
					} else {
					  this.showStaffTrack();
					}
        	});
    	}
  	},
  	watch: {
	    items() {
      		this.setPages();
    	},
  	},
  	methods: {
		// async checkActivation() {
		// 	await axios
		// 		.post(`${base_url}/checkactivation`)
		// 		.then((response) => {
		// 			if (response.data.error) {
		// 				localStorage.clear();
      	// 				this.$store.state.user = "";
      	// 				this.$router.go();
		// 			}
		// 		})
		// },
	    async getClientName() {
      		const response = await axios.post(`${base_url}/filterclients`, {
        		admin_id: this.$store.state.user.id,
        		staffid: this.$store.state.user.staffid,
      		});
      		this.clients = response.data;
    	},
    	async getProjectName(chosen) {
      		if (!chosen) {
        		// const response = await axios.get(`${base_url}/projectsforstaff/${this.$store.state.user.id}`);
        		// this.projectnames = response.data;
				const response = await axios.get(`${base_url}/staffassignedprojects/${this.$store.state.user.staffid}`);
      			this.projectnames = response.data;
				console.log("project in tracks", this.projectnames)
        		this.filter.projectid = "";
      		} else {
        		const response = await axios.get(`${base_url}/clientprojects/${chosen}`);
        		this.projectnames = response.data;
        		this.filter.projectid = "";
      		}
    	},
    	async filterSearch() {
      		var filter = {
        		clientid: this.filter.clientid,
        		indate: this.filter.indate,
        		outdate: this.filter.outdate,
      		};
      		localStorage.setItem("StaffTrackFilter", [JSON.stringify(filter)]);
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/staff_track_search` + params, {
          		clientid: this.filter.clientid,
          		staffid: this.$store.state.user.staffid,
          		projectid: this.filter.projectid,
          		indate: this.filter.indate,
          		outdate: this.filter.outdate,
        	}).then((res) => {
          		this.loading = false;
          		this.items = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter.is_filter = 1;
        	});
      		await axios.post(`${base_url}/totaltime`, {
          		clientid: this.$store.state.user.clientid,
          		staffid: this.$store.state.user.staffid,
          		projectid: this.filter.projectid,
          		indate: this.filter.indate,
          		outdate: this.filter.outdate,
        	}).then((res) => {
          		if (res.data[0].time) {
            		this.totaltime = res.data[0].time.substr(0, 8);
          		} else {
            		this.totaltime = "";
          		}
        	});
    	},
    	async removeSearch() {
      		localStorage.removeItem("StaffTrackFilter");
      		this.filter_page = 1;
      		this.filter.clientid = "";
      		this.filter.projectid = "";
      		this.getProjectName();
      		(this.filter.indate = new Date(new Date().getFullYear(),new Date().getMonth() - 1,new Date().getDate() + 1).toISOString().substr(0, 10)),
        	(this.filter.outdate = new Date().toISOString().substr(0, 10));
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/staff_track_search` + params, {
          		staffid: this.$store.state.user.staffid,
          		clientid: this.filter.clientid,
          		projectid: this.filter.projectid,
          		indate: this.filter.indate,
          		outdate: this.filter.outdate,
        	}).then((res) => {
          		this.items = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
          		this.filter_page = 1;
          		this.filter.is_filter = 0;
          		this.totaltime = "";
        	});
    	},
    	async showStaffTrack() {
      		const params = "?pages=" + this.page + "&size=" + this.pageSize;
      		await axios
				.post(`${base_url}/tracksforstaff` + params, {
        			staffid: this.$store.state.user.staffid,
        			indate: this.filter.indate,
        			outdate: this.filter.outdate,
     		 	})
				.then((response) => {
					if (response.data.error) {
						localStorage.clear();
      					this.$store.state.user = "";
      					this.$router.go();
						// this.$router.push('/login');
					} else { 
						this.loading = false;
						this.items = response.data.results;
						this.page = response.data.page;
						this.result_length = response.data.length.length;
					}
				})
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
      		this.showStaffTrack();
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
      		this.showStaffTrack();
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
      		this.showStaffTrack();
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
        		this.showStaffTrack();
      		}
    	},
  	},
};
</script>
