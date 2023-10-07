<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Edit Track" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Edit Track"></staff-header>
      		</div>
      		<div class='loaderbox'  v-if="!this.id">
        		<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
      		</div>
      		<div class="content-page admin-new-attendance-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-12">
              				<div class="back-button-setup">
                				<router-link :to="{ name: 'TrackList' }">
									<img src="../../assets/images/back-left-arrow.png" alt="&laquo;" />Back
								</router-link>
              				</div>
            			</div>
            			<div class="col-12">
              				<div class="common-white-shadow-background">
                				<div class="new-attendance-form-setup">
                  					<form @submit.prevent>
                    					<div>
                      						<label>Date : </label>
                      						<input type="date" placeholder="Date" v-model="date" :max="date" required />
                      						<p style="color: red">{{ errors.date }}</p>
                    					</div>
                    					<div>
                      						<label>Staff Name : </label>
                      						<select v-model="staffid" required>
                        						<option v-for="data in names" :value="data.id" :key="data.id">{{ data.name }}</option>
                      						</select>
                      						<p style="color: red">{{ errors.staffid }}</p>
                    					</div>
                    					<div>
                      						<label>Project Name : </label>
                      						<select v-model="projectid" required>
                        						<option v-for="data in projectnames" :value="data.id" :key="data.id">{{ data.project_name }}</option>
                      						</select>
                      						<p style="color: red">{{ errors.projectid }}</p>
                    					</div>
                    					<div>
                      						<label>Task : </label>
                      						<textarea rows="3" cols="60" type="textarea" placeholder="task" v-model="task" required></textarea>
                      						<p style="color: red">{{ errors.task }}</p>
                    					</div>
                    					<div>
                      						<label>Start : </label>
                      						<input type="time" placeholder="Start" v-model="start" />
                      						<p style="color: red">{{ errors.start }}</p>
                    					</div>
                    					<div>
                      						<label>End : </label>
                      						<input type="time" placeholder="End" v-model="end" />
                      						<p style="color: red">{{ errors.end }}</p>
                    					</div>
                    					<div class="col-12" v-if="this.end !== '00:00:00'">
                      						<input type="submit" value="Save" class="yellow-button" @click="editTrack" />
                      						<p style="color: red">{{ errors.result }}</p>
                    					</div>
                    					<div class="col-12" v-else>
                      						<input type="submit" value="Save" class="yellow-button" @click="canteditTrack" />
                      						<p style="color: red">{{ errors.result }}</p>
                    					</div>
    	              				</form>
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
import LeftPannel from "../../components/admin/LeftPannel.vue";
import CommonHeader from "../../components/admin/CommonHeader.vue";
import CommonFooter from "../../components/CommonFooter.vue";
import StaffHeader from "../../components/user/CommonHeader.vue";
import base_url from "../../base_url.js";

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
      		staffid: "",
      		projectid: "",
      		date: "",
      		start: "",
      		end: "",
      		task: "",
      		name: "",
      		names: [],
      		projectname: "",
      		projectnames: [],
      		errors: [],
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
        	this.singleTrackSelect(), this.getName(), this.getProjectName();
      	});
  	},
  	methods: {
    	async getName() {
      		const response = await axios.post(`${base_url}/staffsfortrack/${this.$store.state.user.id}`);
      		this.names = response.data;
    	},
    	async getProjectName() {
      		const response = await axios.post(`${base_url}/projectsfortrack/${this.$store.state.user.id}`);
      		this.projectnames = response.data;
    	},
    	async singleTrackSelect() {
      		const response = await axios.get(`${base_url}/track/${this.$route.params.id}`);
      		this.staffid = response.data.staffid;
      		this.projectid = response.data.projectid;
      		this.date = this.convertDate(response.data.date);
      		this.start = response.data.start;
      		this.end = response.data.end;
      		this.task = response.data.task;
      		this.id = response.data.id;
    	},
    	async editTrack() {
      		this.errors = [];
      		if (!this.staffid) {
        		this.errors["staffid"] = "Staff Name is required";
      		}
      		if (!this.projectid) {
        		this.errors["projectid"] = "Project Name is required";
      		}
      		if (!this.date) {
        		this.errors["date"] = "Date is required";
      		}
      		if (!this.start) {
        		this.errors["start"] = "Check In Time is required";
      		}
      		if (!this.end) {
        		this.errors["end"] = "Check Out Time is required";
      		}
      		if (!this.task) {
        		this.errors["task"] = "Task is required";
      		}
      		if ( !this.errors["staffid"] && !this.errors["projectid"] && !this.errors["date"] && !this.errors["start"] && !this.errors["end"] && !this.errors["task"]) {
        		await axios.post(`${base_url}/track/${this.id}`, {
            		staffid: this.staffid,
            		projectid: this.projectid,
            		date: this.date,
            		start: this.start,
            		end: this.end,
            		task: this.task,
          		}).then((res) => {
            		if (res.data == "exist") {
              			this.errors["result"] = "Work already exist in this time period!";
            		} else {
              			this.$router.push({ name: "TrackList" });
              			this.$notify({
                			title: "<b>Track</b> updated successfully!",
                			type: "warn",
              			});
            		}
          		});
      		}
    	},
    	canteditTrack() {
      		this.errors["result"] = "Sorry, you can't stop ongoing tracker!";
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
      		const cvt_date_formate = year + "-" + month + "-" + dt;
      		return cvt_date_formate;
    	},
  	},
};
</script>

<style></style>
