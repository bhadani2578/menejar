<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Add Track" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Add Track"></staff-header>
      		</div>
      		<div class="content-page admin-new-editstaff-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-sm-6">
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
                      						<label for="staffname">Staff Name : </label>
                      						<select v-model="staffid" required>
                        						<option value="" selected>Name</option>
                        						<option v-for="data in names" :value="data.id" :key="data.id">{{ data.name }}</option>
                      						</select>
                      						<p style="color: red">{{ errors.staffid }}</p>
                    					</div>
                    					<div>
                      						<label>Date : </label>
                      						<input type="date" name="date" v-model="date" :max="date" required />
                      						<p style="color: red">{{ errors.date }}</p>
                    					</div>
                    					<div>
                      						<label>Start Time : </label>
                      						<input type="time" name="start" v-model="start" required />
                      						<p style="color: red">{{ errors.start }}</p>
                    					</div>
                    					<div>
                      						<label>End Time : </label>
                      						<input type="time" name="end" v-model="end" required />
                      						<p style="color: red">{{ errors.end }}</p>
                    					</div>
                    					<div>
                      						<label>Project Name : </label>
                      						<select v-model="projectid" required>
                        						<option value="" selected>Project</option>
                        						<option v-for="data in projectnames" :value="data.id" :key="data.id">{{ data.project_name }}</option>
                      						</select>
                      						<p style="color: red">{{ errors.projectid }}</p>
                    					</div>
                    					<div>
                      						<label>Task : </label>
                      						<textarea rows="3" cols="60" type="textarea" placeholder="Task" v-model="task" required></textarea>
                      						<p style="color: red">{{ errors.task }}</p>
                    					</div>
                    					<div class="attendance-form-submit">
                      						<input type="submit" class="yellow-button" value="Submit" @click="OnTrackSubmit" />
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
import LeftPannel from "../../components/admin/LeftPannel.vue";
import CommonHeader from "../../components/admin/CommonHeader.vue";
import CommonFooter from "../../components/CommonFooter.vue";
import StaffHeader from "../../components/user/CommonHeader.vue";
import axios from "axios";
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
      		name: "",
      		names: [],
      		projectname: "",
      		projectnames: [],
      		date: new Date().toISOString().substr(0, 10),
      		staffid: "",
      		projectid: "",
      		start: "",
      		end: "",
      		errors: [],
      		task: "",
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
        	this.getName(), this.getProjectName();
        	if (this.$store.state.user.is_business == 1) {
        		this.$router.push("/addtrack");
        	} else {
          		this.$router.push("/business_setting");
        	}
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
    	async OnTrackSubmit() {
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
        		await axios.post(`${base_url}/track`, {
            		staffid: this.staffid,
            		projectid: this.projectid,
            		date: this.date,
            		start: this.start,
            		end: this.end,
            		task: this.task,
            		admin_id: this.$store.state.user.id,
          		}).then((res) => {
            		if (res.data == "exist") {
              			this.errors["result"] = "Work already exist in this time period!";
            		} else {
              			this.$router.push({ name: "TrackList" });
              			this.$notify({
                			title: "<b>Track</b> added successfully!",
                			type: "warn",
              			});
            		}
          		});
      		}
    	},
  	},
};
</script>

<style></style>
