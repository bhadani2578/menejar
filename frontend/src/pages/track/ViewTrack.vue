<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="View Track" :name="this.$store.state.user.name" />
        		<staff-header v-else title="View Track"></staff-header>
      		</div>
      		<div class='loaderbox'  v-if="!this.staffname">
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
                      						<input type="name" placeholder="Date" v-model="date" :max="date" readonly />
                    					</div>
                    					<div>
                      						<label>Staff Name : </label>
                      						<input type="name" placeholder="Name" v-model="staffname" readonly />
                    					</div>
                    					<div>
                      						<label>Project Name : </label>
                      						<input type="name" placeholder="Name" v-model="project_name" readonly />
                    					</div>
                    					<div>
                      						<label>Task : </label>
                      						<textarea rows="3" cols="60" type="textarea" placeholder="task" v-model="task" readonly></textarea>
                    					</div>
                    					<div>
                      						<label>Start : </label>
                      						<input type="name" placeholder="Start" v-model="start" readonly />
                    					</div>
                    					<div>
                      						<label>End : </label>
                      						<input type="name" placeholder="End" v-model="end" readonly />
                    					</div>
                    					<div>
                      						<label>Time : </label>
                      						<input v-if="end === '00:00:00'" type="name" placeholder="NaN" readonly />
                      						<input v-else type="name" placeholder="Time" v-model="time" readonly />
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
      		project_name: "",
      		date: "",
      		start: "",
      		end: "",
      		task: "",
      		name: "",
      		staffname: "",
      		time: "",
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
        	this.singleTrackSelect();
      	});
  	},
  	methods: {
    	async singleTrackSelect() {
      		const response = await axios.get(`${base_url}/track/${this.$route.params.id}`);
      		this.staffname = response.data.name;
      		this.project_name = response.data.project_name;
      		this.date = this.convertDate(response.data.date);
      		this.start = response.data.start;
      		this.end = response.data.end;
      		this.task = response.data.task;
      		this.time = response.data.time;
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
  	},
};
</script>

<style></style>
