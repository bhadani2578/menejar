<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div class="right-panel">
      		<div class="header">
        		<CommonHeader title="Tasks" :name="this.$store.state.user.name" />
      		</div>	
      		<div class='loaderbox'  v-if="this.loading">
        		<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
      		</div>
      		<div class="content-page">
        		<div class="fullrow">
          			<div class="">
            			<div class="row admin-staff-list-toppart">
              				<div class="col-md-4">
                				<input class="search-leave satff-listing-page-search" type="text" name="search" v-model="filter.name" placeholder="Search Task / Description" />
              				</div>
              				<div class="col-md-4">
                				<input type="submit" value="Submit" class="yellow-button" @click="filterSearch" />
                				<input type="submit" value="Clear" class="yellow-button" v-if="filter.is_filter == 1" @click="showTask" />
              				</div>
              				<div class="col-md-4">
                				<div class="addnew-button">
                  					<router-link :to="{ name: 'AddTask' }"><span>
										<img src="../../assets/images/plus-icon.png" alt="Add Task" /></span>Add New
									</router-link>
                				</div>
              				</div>
            			</div>	
            			<div class="track-top-filter-form staff-date common-white-shadow-background">
              				<div class="trach-filter-form-field">
                				<select name="project" v-model="filter.project" @change="filterSearch($event)" >
                  					<option value="" selected>All Projects</option>
                  					<option v-for="data in projectnames" :value="data.project_id" :key="data.project_id">
                    					{{ data.project_name }}
                  					</option>
                				</select>
              				</div>
              				<div class="trach-filter-form-field">
                				<input type="date" v-model="filter.date" @change="filterSearch($event)" />
              				</div>
              				<div class="trach-filter-form-field">
                				<select v-model="filter.status" @change="filterSearch($event)">
                  					<option value="" selected>Status</option>
                  					<option	 v-for="data in status" :value="data.id" :key="data.name">
                    					{{ data.name }}
                  					</option>
                				</select>
              				</div>
              				<div class="trach-filter-form-field">
                				<select v-model="filter.isSort" @change="filterSearch($event)">
                  					<option value="" selected>Sort results by</option>
                  					<option v-for="data in task_sort" :value="data.val" :key="data.name">{{ data.name }}</option>
                				</select>
              				</div>
              				<div class="trach-filter-form-field" v-if="filter.archive == 0">
                				<input type="submit" value="Archived ˃" @click="showArchiveTask" />
              				</div>
              				<div class="trach-filter-form-field" v-if="filter.archive == 1">
                				<input style="border: 1px solid red" type="submit" value="Archived ˅" @click="showArchiveTask" />
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
          			</div>
          			<div class="row">
            			<div class="col-12">
              				<div class="fullwidth-table track-table-body">
                				<table>
                  					<tr>
                    					<th>ID</th>
                    					<th>Date</th>
                    					<th>Project</th>
                    					<th>Task</th>
                    					<th>Description</th>
                    					<th>Deadline</th>
                    					<th>Status</th>
                    					<th></th>
                  					</tr>
                  					<tr v-for="(item, index) in items" :key="item.id">
                    					<td style="text-align: center">{{ index + 1 }}</td>
                    					<td>{{ this.convertDate(item.date) }}</td>
                    					<td>{{ item.project_name }}</td>
                    					<td style="text-align: center">{{ item.task }}</td>
                    					<td>
                      						<div v-if="item.description.length <= 50">{{ item.description }}</div>
                      						<div v-else>{{ item.description.substring(0, 50) + ".." }}</div>
                    					</td>
                    					<td v-if="(item.deadline = '1899-11-30T00:00:00.000Z')" style="text-align: center; width: 14%"></td>
                    					<td v-else style="text-align: center; width: 14%">{{ this.convertDate(item.deadline) }}</td>
                    					<td>
                      						<div v-if="item.status == 0" style=" background: #a4a4a4; border-radius: 5px; text-align: center; color: white;">Pending</div>
                      						<div v-if="item.status == 1" style=" background: #1e4077; border-radius: 5px; text-align: center; color: white;">Working</div>
                      						<div v-if="item.status == 2" style=" background: #ff2442; border-radius: 5px; text-align: center; color: white;">Review</div>
                      						<div v-if="item.status == 3" style=" background: #469f01; border-radius: 5px; text-align: center; color: white;">Completed</div>
                      						<div v-if="item.status == 4" style=" background: #f39223; border-radius: 5px; text-align: center; color: white;">Archived</div>
                    					</td>
                    					<td style="text-align: center">
                      						<router-link :to="{ name: 'EditTask', params: { id: item.id }}">
												<img src="../../assets/images/eye.png" alt="Edit"/>
											</router-link>
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
                  					<a :class="pageNumber == page ? 'active' : ''" v-for="pageNumber in pages.slice(page - 1, page + 2)" :key="pageNumber" @click="pageCounts(pageNumber)" > {{ pageNumber }}</a>
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
  	},
  	data() {
	    return {
      		loading: true,
      		items: [],
      		page: 1,
      		filter_page: 1,
      		result_length: "",
      		perPage: 50,
      		pageSize: 50,
      		pages: [],
      		projectnames: [],
      		status: [
        		{ id: 0, name: "Pending" },
        		{ id: 1, name: "Working" },
        		{ id: 2, name: "Review" },
        		{ id: 3, name: "Completed" },
      		],
      		task_sort: [
        		{ val: "dt_desc", name: "By Date Desc" },
        		{ val: "dd_desc", name: "By Deadline Desc" },
        		{ val: "dt_asc", name: "By Date Asc" },
        		{ val: "dd_asc", name: "By Deadline Asc" },
      		],
      		filter: {
        		name: "",
        		project: "",
        		date: "",
        		status: "",
        		isSort: "",
        		is_filter: 0,
        		archive: 0,
      		},
    	};
  	},
  	created() {
    	if (this.$store.state.user.length != 0) {
      		this.getProjectName();
      		if (localStorage.getItem("TaskFilter")) {
        		var name = JSON.parse(localStorage.getItem("TaskFilter"))["name"];
        		var project = JSON.parse(localStorage.getItem("TaskFilter"))["project"];
        		var date = JSON.parse(localStorage.getItem("TaskFilter"))["date"];
        		var status = JSON.parse(localStorage.getItem("TaskFilter"))["status"];
        		var isSort = JSON.parse(localStorage.getItem("TaskFilter"))["isSort"];
        		var archive = JSON.parse(localStorage.getItem("TaskFilter"))["archive"];
        		this.filter.name = name;
        		this.filter.project = project;
        		this.filter.date = date;
        		this.filter.status = status;
        		this.filter.isSort = isSort;
        		this.filter.archive = archive;
        		this.filterSearch();
      		} else {
        		this.showTask();
      		}
      		if (this.$store.state.user.is_business == 1) {
        		this.$router.push("/tasklist");
      		} else {
        		this.$router.push("/business_setting");
      		}
    	} else {
      		axios.post(`${base_url}/user`, {
          		headers: { token: localStorage.getItem("token") },
          		type: localStorage.getItem("type"),
        	}).then((res) => {
          		this.$store.state.user = res.data.user;
          		this.getProjectName();
          		if (localStorage.getItem("TaskFilter")) {
            		var name = JSON.parse(localStorage.getItem("TaskFilter"))["name"];
            		var project = JSON.parse(localStorage.getItem("TaskFilter"))["project"];
            		var date = JSON.parse(localStorage.getItem("TaskFilter"))["date"];
            		var status = JSON.parse(localStorage.getItem("TaskFilter"))["status"];
            		var isSort = JSON.parse(localStorage.getItem("TaskFilter"))["isSort"];
            		var archive = JSON.parse(localStorage.getItem("TaskFilter"))["archive"];
            		this.filter.name = name;
            		this.filter.project = project;
            		this.filter.date = date;
            		this.filter.status = status;
            		this.filter.isSort = isSort;
            		this.filter.archive = archive;
            		this.filterSearch();
          		} else {
            		this.showTask();
          		}
          		if (this.$store.state.user.is_business == 1) {
            		this.$router.push("/tasklist");
          		} else {
            		this.$router.push("/business_setting");
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
    	async filterSearch() {
      		var filter = {
        		name: this.filter.name,
        		project: this.filter.project,
        		date: this.filter.date,
        		status: this.filter.status,
        		isSort: this.filter.isSort,
        		archive: this.filter.archive,
      		};
      		localStorage.setItem("TaskFilter", [JSON.stringify(filter)]);
      		const params = "?pages=" + this.filter_page + "&size=" + this.pageSize;
      		await axios.post(`${base_url}/task_adminfilter` + params, {
          		name: this.filter.name,
          		project: this.filter.project,
          		date: this.filter.date,
          		status: this.filter.status,
          		isSort: this.filter.isSort,
          		admin_id: this.$store.state.user.id,
          		archive: this.filter.archive,
        	}).then((res) => {
          		this.loading = false;
          		this.items = res.data.results;
          		this.page = res.data.page;
          		this.result_length = res.data.length.length;
        	});
    	  	if (this.filter.name) {
	        	this.filter.is_filter = 1;
      		}
    	},
    	async showTask() {
      		const params = "?pages=" + this.page + "&size=" + this.pageSize;
      		const response = await axios.post(`${base_url}/get_admintask` + params, {
        		admin_id: this.$store.state.user.id,
      		});
      		this.loading = false;
      		this.items = response.data.results;
      		this.page = response.data.page;
      		this.result_length = response.data.length.length;
      		this.filter.is_filter = 0;
      		this.filter.name = "";
      		localStorage.removeItem("TaskFilter");
    	},		
    	async showArchiveTask() {
      		this.filter.name = this.filter.project = this.filter.date = this.filter.status = this.filter.isSort = "";
      		if (!this.filter.archive) {
        		this.filter.archive = 1;
      		} else {
        		this.filter.archive = 0;
      		}
      		this.filterSearch();
    	},
    	async getProjectName() {
      		const response = await axios.post(`${base_url}/projectsoftask/${this.$store.state.user.id}`);
      		this.projectnames = response.data;
    	},
    	convertDate: function (cvt_date) {
      		var date = new Date(cvt_date);
      		var year = date.getFullYear();
      		var month = date.toLocaleString("default", { month: "short" });
      		var dt = date.getDate();
      		if (dt < 10) {
      		  	dt = "0" + dt;
      		}
      		if (month < 10) {
        		month = "0" + month;
      		}
      		const cvt_date_formate = month + " " + dt + ", " + year;
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
      		this.showTask();
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
      		this.showTask();
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
      		this.showTask();
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
        		this.showTask();
      		}
    	},
  	},
};
</script>
