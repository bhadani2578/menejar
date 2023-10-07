<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Track" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Track"></staff-header>
      		</div>
      		<div class='loaderbox'  v-if="this.loading">
        		<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
      		</div>
      		<div class="content-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-sm-6"></div>
            				<div class="col-sm-6 download-track-button-sec">
              					<ul>
                					<li>
                  						<div class="download-track-button">
                    						<a @click="trackCSV"><img src="../../assets/images/download-arrow.png" alt="Download"/>Download</a>
                  						</div>
                					</li>
                					<li>
                  						<div class="download-track-button">
                    						<router-link :to="{ name: 'AddTrack' }">
												<img src="../../assets/images/plus-icon.png" alt="Add Track"/>Add Track
											</router-link>
                  						</div>
                					</li>
              					</ul>
            				</div>
          				</div>
        			</div>
        			<div class="track-top-filter-form common-white-shadow-background">
          				<div class="trach-filter-form-field" style="width: 14.44%; margin-right: 9px">
            				<select v-model="filter.staffid">
              					<option value="" selected>Staff</option>
              					<option v-for="data in names" :value="data.id" :key="data.id">
	                				{{ data.name }}
              					</option>
            				</select>
          				</div>
          			<div class="trach-filter-form-field" style="width: 14.44%; margin-right: 9px">
            			<select v-model="filter.clientid" @change="getProjectName($event.target.value)">
              				<option value="" selected>Clients</option>
              				<option v-for="data in clients" :value="data.id" :key="data.id"> {{ data.organization }} {{ data.name }}</option>
            			</select>
          			</div>
          			<div class="trach-filter-form-field" style="width: 14.44%; margin-right: 9px">
            			<select v-model="filter.projectid">
              				<option value="" selected>Projects</option>
              				<option v-for="data in projectnames" :value="data.id" :key="data.id">{{ data.project_name }}</option>
            			</select>
          			</div>
          			<div class="trach-filter-form-field" style="width: 14.44%; margin-right: 9px">
            			<input style="padding: 12px 5px !important" type="date" name="from" id="From" :max="filter.outdate" v-model="filter.indate" />
          			</div>
          			<div class="trach-filter-form-field" style="width: 14.44%; margin-right: 9px">
            			<input style="padding: 12px 5px !important" type="date" name="to" id="To" :max="filter.outdate" v-model="filter.outdate" />
          			</div>
          			<div>
            			<input type="submit" value="Submit" class="yellow-button" @click="filterSearch" style="width: 90px" />
            			<input type="submit" value="Clear" class="yellow-button" v-if="filter.is_filter == 1" @click="removeSearch" style="width: 90px; margin-left: 5px" />
          			</div>
        		</div>
        		<div v-if="filter.is_filter == 1">
          			Showing {{ this.result_length }} on {{ this.pages.length }} page
        		</div>
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
            			<div class="fullwidth-table track-table-body">
              				<table>
                				<tr>
                					<th>Date</th>
                  					<th>Staff</th>
                  					<th>Project</th>
                  					<th style="width: 270px">Task</th>
                  					<th>Start</th>
                  					<th>End</th>
                  					<th>Time</th>
                  					<th style="width: 270px">Actions</th>
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
                  					<td style="text-align: center">
                    					<ul>
                      						<li>
                        						<router-link :to="{ name: 'ViewTrack', params: { id: item.id } }">
													<img src="../../assets/images/visibility.png" alt="View"/>
												</router-link>
                      						</li>
                      						<li>
                        						<router-link :to="{ name: 'EditTrack', params: { id: item.id } }">
													<img src="../../assets/images/pen.png" alt="Edit" />
												</router-link>
                      						</li>
                      						<li>
                        						<a @click="deleteTrack(item.id)"><img src="../../assets/images/delete.png" alt="Delete"/></a>
                      						</li>
                    					</ul>
                  					</td>
                				</tr>
              				</table>
            			</div>
          			</div>
          			<div class="col-12">
            			<div class="admininvoice-pagination">
              				<div v-if="filter.is_filter == 0" class="pagination">
                				<a v-if="page != 1" @click="prevPage"><img src="../../assets/images/pagi-left.png" alt="&laquo;" /></a>
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
                				<a :class="pageNumber == page ? 'active' : ''" v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCounts(pageNumber)">
                  					{{ pageNumber }}
                				</a>
                				<a @click="nextPages" v-if="page < pages.length"><img src="../../assets/images/pagi-right.png" alt="&raquo;" /></a>
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
      		<CommonFooter />
    	</div>
  	</div>
</template>

<script>
import LeftPannel from "../../components/admin/LeftPannel.vue";
import CommonHeader from "../../components/admin/CommonHeader.vue";
import CommonFooter from "../../components/CommonFooter.vue";
import StaffHeader from "../../components/user/CommonHeader.vue";
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
      		loading: true,
      		type: "",
      		items: [],
      		names: [],
      		name: "",
      		clients: [],
      		project_name: "",
      		projectnames: [],
      		page: 1,
      		filter_page: 1,
      		result_length: "",
      		perPage: 50,
      		pageSize: 50,
      		totaltime: "",
      		pages: [],
      		filter: {
        		staffid: "",
        		clientid: "",
        		projectid: "",
        		indate: new Date( new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().substr(0, 10),
        		outdate: new Date().toISOString().substr(0, 10),
        		is_filter: 0,
      		},
    	};
  	},
  	beforeRouteEnter(to, from, next) {
    	if (localStorage.getItem("type") == "staff") {
      		if (localStorage.getItem("permission").includes("TrackList")) {
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
        	this.getName(), this.getClientName(), this.getProjectName();
        	if (localStorage.getItem("TrackFilter")) {
          		var staffid = JSON.parse(localStorage.getItem("TrackFilter"))["staffid"];
          		var clientid = JSON.parse(localStorage.getItem("TrackFilter"))["clientid"];
          		var indate = JSON.parse(localStorage.getItem("TrackFilter"))["indate"];
          		var outdate = JSON.parse(localStorage.getItem("TrackFilter"))["outdate"];
          		this.filter.staffid = staffid;
          		this.filter.clientid = clientid;
          		this.filter.indate = indate;
          		this.filter.outdate = outdate;
          		this.filterSearch();
        	} else {
          		this.showTrack();
        	}
        	if (this.$store.state.user.is_business == 1) {
          		this.$router.push("/tracklist");
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
    	async showTrack() {
      		const params = "?pages=" + this.page + "&size=" + this.pageSize;
      		const response = await axios.post(`${base_url}/get_track` + params, {
        		admin_id: this.$store.state.user.id,
        		indate: this.filter.indate,
        		outdate: this.filter.outdate,
      		});
      		this.loading = false;
      		this.items = response.data.results;
      		this.page = response.data.page;
      		this.result_length = response.data.length.length;
    	},
    	async getName() {
      		const response = await axios.post(`${base_url}/staffsfortrack/${this.$store.state.user.id}`);
      		this.names = response.data;
    	},
    	async getClientName() {
      		const response = await axios.post(`${base_url}/filterclients`, {admin_id: this.$store.state.user.id});
      		this.clients = response.data;
    	},
    	async getProjectName(chosen) {
      		if (!chosen) {
        		const response = await axios.post(`${base_url}/projectsfortrack/${this.$store.state.user.id}`);
        		this.projectnames = response.data;
        		this.filter.projectid = "";
      		} else {
        		const response = await axios.get(`${base_url}/clientprojects/${chosen}`);
        		this.projectnames = response.data;
        		this.filter.projectid = "";
      		}
    	},
    	async filterSearch() {
      		var filter = {
        		staffid: this.filter.staffid,
        		clientid: this.filter.clientid,
        		projectid: this.filter.projectid,
        		indate: this.filter.indate,
        		outdate: this.filter.outdate,
      		};
      		localStorage.setItem("TrackFilter", [JSON.stringify(filter)]);
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/track_search` + params, {
          		admin_id: this.$store.state.user.id,
          		staffid: this.filter.staffid,
          		clientid: this.filter.clientid,
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
      		await axios.post(`${base_url}/admintotaltime`, {
          		admin_id: this.$store.state.user.id,
          		staffid: this.filter.staffid,
          		clientid: this.filter.clientid,
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
      		localStorage.removeItem("TrackFilter");
      		this.filter_page = 1;
      		this.filter.staffid = "";
      		this.filter.clientid = "";
      		this.filter.projectid = "";
      		this.getProjectName();
      		(this.filter.indate = new Date( new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate() + 1).toISOString().substr(0, 10)),
        	(this.filter.outdate = new Date().toISOString().substr(0, 10));
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/track_search` + params, {
          		admin_id: this.$store.state.user.id,
          		staffid: this.filter.staffid,
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
    	async trackCSV() {
      		let x = await axios.post(`${base_url}/trackcsv`, {
        		admin_id: this.$store.state.user.id,
        		staffid: this.filter.staffid,
        		clientid: this.filter.clientid,
        		projectid: this.filter.projectid,
        		indate: this.filter.indate,
        		outdate: this.filter.outdate,
      		});
      		var outer = [];
      		for (var i = 0; i < x.data.length; i++) {
        		let temp = [];
        		temp[0] = x.data[i].name;
        		temp[1] = x.data[i].date;
        		temp[2] = x.data[i].start;
        		temp[3] = x.data[i].end;
        		temp[4] = x.data[i].time;
        		temp[5] = x.data[i].project_name;
        		temp[6] = x.data[i].task;
        		outer.push(temp);
      		}
      		this.download_csv_file(outer);
    	},
    	download_csv_file(csvFileData) {
      		var csv = "Name,Date,start,end,Time,Project Name,Task\n";
      		csvFileData.forEach(function (row) {
      		  	csv += row.join(",");
        		csv += "\n";
      		});
      		var hiddenElement = document.createElement("a");
      		hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      		hiddenElement.target = "_blank";
      		hiddenElement.download = "track.csv";
      		hiddenElement.click();
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
    	async deleteTrack(id) {
      		await axios.post(`${base_url}/deletetrack/${id}`);
      		this.showTrack();
      		this.$notify({
      		  	title: "<b>Track</b> deleted successfully!",
        		type: "warn",
      		});
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
      		this.showTrack();
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
      		this.showTrack();
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
      		this.showTrack();
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
        		this.showTrack();
      		}
    	},
  	},
};
</script>

<style></style>
