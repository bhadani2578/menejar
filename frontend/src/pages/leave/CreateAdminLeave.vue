<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class=" type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
	        	<CommonHeader v-if="type == 'admin'" title="Leave Application Form" :name="this.$store.state.user.name" />
				<staff-header v-else title="Add Project"></staff-header>
      		</div>
      		<div class="content-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-6">
              				<div class="back-button-setup">
                				<router-link :to="{ name: 'leave' }">
									<img src="../../assets/images/back-left-arrow.png" alt="&laquo;" />Back
								</router-link>
              				</div>
            			</div>
            			<div class="col-12">
              				<div class="common-white-shadow-background">
                				<div class="edit-staff-data-form leave-application-form">
                  					<form @submit.prevent class="form-box row">											
                    					<div class="col-12">
                      						<h3 class="leave-from-radio-label">Reason For Leave</h3>
                      						<p></p>
                      						<div class="leave-from-radio-options">
                        						<input type="radio" id="emergency_leave" name="emergency_leave" v-model="formData.leave_type" value="emergency" />
                        						<label for="emergency_leave">Emergency Leave</label>
                        						<input type="radio" id="annual_leave" name="annual_leave" v-model="formData.leave_type" value="annual"/>
												<label for="annual_leave">Annual Leave</label>
                        						<input type="radio" id="other" name="other" v-model="formData.leave_type" value="other"/>
												<label for="other">Other</label>
                      						</div>
                      						<p style="color: red">{{ errors.leave_type }}</p>
                    					</div>											
                    					<div class="col-sm-6 setupdate">
                      						<input type="date" name="fday_absence" placeholder="First day of absence" v-model="formData.start_date" @change="dateDifference" required />
                      						<p style="color: red">{{ errors.start_date }}</p>
                    					</div>
                    					<div class="col-sm-6 setupdate">
                      						<input type="date" name="lday_absence" placeholder="Last day of absence" v-model="formData.end_date" @change="dateDifference" :min="formData.start_date" required />
                      						<p style="color: red">{{ errors.end_date }}</p>
                    					</div>
                    					<div class="col-sm-6 setupdate">
                      						<div class="leave-from-radio-options">
                        						<label style="font-weight: bold" for="half_leave" class="leave-from-radio-label">Half Leave</label>
                        						<input id="half_leave" style="margin-top: 10px" type="checkbox" name="half_leave" v-model="formData.half_leave" @change="dateDifference" />
                      						</div>
                    					</div>
                    					<p></p>											
                      					<div class="col-sm-6">
                        					<h3 class="leave-from-radio-label">No. of days requested</h3>
                        					<p></p>
                        					<input v-if="isNaN(formData.total_day)" type="text" name="day_request" value="0" placeholder="No. of days requested" readonly />
                        					<input v-else type="text" name="day_request" v-model="formData.total_day" placeholder="No. of days requested" readonly />
                      					</div>
                      					<div class="col-sm-6">
                      						<h3 class="leave-from-radio-label">Staff Name</h3>
                        					<p></p>
                      						<select v-model="formData.staffid" required>
                        						<option value="" selected>Name</option>
                        						<option v-for="data in names" :value="data.id" :key="data.id">{{ data.name }}</option>
                      						</select>
                      						<p style="color: red">{{ errors.staffid }}</p>
                    					</div>										
                    					<div class="col-12">
                      						<br />
                      						<textarea name="leave-comments" rows="3" placeholder="Comments" v-model="formData.comments" required></textarea>
                      						<p style="color: red">{{ errors.comments }}</p>
                    					</div>
                    					<div class="col-12">
                      						<input type="submit" value="Send Request" class="yellow-button" @click="create_leave" />
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
      		formData: {
        		leave_type: "",
        		half_leave: "",
        		start_date: "",
        		end_date: "",
        		total_day: "",
        		comments: "",
        		staffid: "",
      		},
      		names: [],
      		date: new Date().toISOString().substr(0, 10),
      		errors: [],
    	};
  	},
  	beforeRouteEnter(to, from, next) {
	    if (localStorage.getItem("type") == "staff") {
      		if (localStorage.getItem("permission").includes("leave")) {
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
    	this.dateDifference();
    	if (this.$store.state.user.length == 0) {
      		axios.post(`${base_url}/user`, {
        	  	headers: { token: localStorage.getItem("token") },
        	  	type: localStorage.getItem("type"),
        	}).then((res) => {          
	    	    this.$store.state.user = res.data.user;
        	  	this.getStaffName();
        	});
    	}
  	},
  	methods: {
    	async getStaffName() {
      		const response = await axios.post(`${base_url}/staffsfortrack/${this.$store.state.user.id}`);
      		// console.log(response.data);
      		this.names = response.data;
      		// console.log(response);
    	},	
    	async create_leave() {
      		this.errors = [];
      		if (!this.formData.leave_type) {
        		this.errors["leave_type"] = "Leave Reason is Required";
      		}
      		if (!this.formData.start_date) {
        		this.errors["start_date"] = "First Day is Required";
      		}
      		if (!this.formData.end_date) {
        		this.errors["end_date"] = "Last Day is Required";
      		}
      		if (!this.formData.comments) {
        		this.errors["comments"] = "Comments Required";
      		}
      		if (!this.formData.staffid) {
        		this.errors["staffid"] = "Staff Name Required";
      		}
      		if ( !this.errors["leave_type"] && !this.errors["start_date"] && !this.errors["end_date"] && !this.errors["comments"] && !this.errors["staffid"]) {
        		await axios.post(`${base_url}/create_leave`, {
            		staff_id: this.formData.staffid,
            		admin_id: this.$store.state.user.id,
            		leave_type: this.formData.leave_type,
            		start_date: this.formData.start_date,
            		end_date: this.formData.end_date,
            		total_day: this.formData.total_day,
            		comments: this.formData.comments,
          		}).then((res) => {
            		if (res.data == "Leave Generate") {
              			this.$router.push("/staff_leave");
              			this.$notify({
                			title: "<b>Leave</b> Applied!",
                			type: "warn",
              			});
            		}
          		});
      		}
    	},	
    	async dateDifference() {
      		const date1 = new Date(this.formData.start_date);
      		const date2 = new Date(this.formData.end_date);
      		const diffTime = Math.abs(date2 - date1);
      		var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      		if (this.formData.half_leave == true) {
        		if (!diffDays) {
          			diffDays += 0.5;
          			this.formData.total_day = diffDays;
        		} else {
          			diffDays += 0.5;
          			this.formData.total_day = diffDays;
        		}
      		} else if (this.formData.half_leave == "NaN") {
        		diffDays = "0";
        		this.formData.total_day = 0;
      		} else if (!diffDays) {
        		diffDays += 1;
        		if (!diffDays) {
          			this.formData.total_day = 0;
        		} else {
          			this.formData.total_day = diffDays;
        		}
      		} else {
        		diffDays += 1;
        		this.formData.total_day = diffDays;
      		}
    	},
  	},
};
</script>
