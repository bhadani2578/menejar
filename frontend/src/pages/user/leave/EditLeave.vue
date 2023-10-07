<template>
  	<div class="panelbox">
    	<LeftPannel />
    	<div class="right-panel staff-section-page">
      		<div class="header">
        		<CommonHeader title="Leave Application Form" />
      		</div>
      		<div class="content-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-6">
              				<div class="back-button-setup">
                				<router-link :to="{ name: 'staff_leave' }">
									<img src="../../../assets/images/back-left-arrow.png" alt="&laquo;"/>Back
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
                      						<p style="color: red"> {{ errors.start_date }}</p>
                    					</div>
                    					<div class="col-sm-6 setupdate">
                      						<input type="date" name="lday_absence" placeholder="Last day of absence" v-model="formData.end_date" @change="dateDifference" :min="formData.start_date" required />
                      						<p style="color: red"> {{ errors.end_date }}</p>
                    					</div>
                    					<div class="col-sm-6 setupdate">
                      						<div class="leave-from-radio-options">
                        						<h3 class="leave-from-radio-label">Half Leave</h3>
                        						<input style="margin-left: 15px; margin-top: 10px" type="checkbox" name="half_leave" v-model="formData.half_leave" @change="dateDifference" />
                      						</div>
                    					</div>
                    					<p></p>
                    					<div>
                      						<div class="col-sm-6">
                        						<h3 class="leave-from-radio-label">No. of days requested</h3>
                        						<p></p>
                        						<input type="text" name="day_request" v-model="formData.total_day" readonly placeholder="No. of days requested" />
                      						</div>
                    					</div>
                    					<div class="col-12">
                      					<br />
                      						<textarea name="leave-comments" rows="3" placeholder="Comments" v-model="formData.comments" required></textarea>
                      						<p style="color: red">{{ errors.comments }}</p>
                    					</div>
                    					<div class="col-12">
                      						<input type="submit" value="Send Request" class="yellow-button" @click="updateLeave" />
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
// import axios
import axios from "axios";
import LeftPannel from "../../../components/user/LeftPannel.vue";
import CommonHeader from "../../../components/user/CommonHeader.vue";
import CommonFooter from "../../../components/CommonFooter.vue";
import base_url from "../../../base_url.js";

export default {
  	name: "EditProject",
  	components: {
    	LeftPannel,
    	CommonHeader,
    	CommonFooter,
  	},
  	data() {
    	return {
      		formData: {
        		leave_type: "",
        		half_leave: "",
        		start_date: "",
        		end_date: "",
        		total_day: "",
        		comments: "",
        		id: "",
      		},
      		date: new Date().toISOString().substr(0, 10),
      		errors: [],
    	};
  	},
  	created() {
    	if (this.$store.state.user.length != 0) {
      		this.getLeaveById(), this.dateDifference();
    	} else {
      		axios.post(`${base_url}/get_staff`, {
          		headers: { token: localStorage.getItem("token") },
        	}).then((res) => {
          		this.$store.state.user = res.data.user;
          		this.getLeaveById(), this.dateDifference();
        	});
    	}
  	},
  	methods: {
    	async getLeaveById() {
      		const response = await axios.get(`${base_url}/staff_leave/${this.$route.params.id}`);
      		this.formData.leave_type = response.data.leave_type;
      		this.formData.start_date = this.convertDate(response.data.start_date);
      		this.formData.end_date = this.convertDate(response.data.end_date);
      		this.formData.comments = response.data.comments;
      		this.formData.total_day = response.data.total_day;
      		if (this.formData.total_day.toString().indexOf(".") >= 0) {
        		this.formData.half_leave = "true";
      		} else {
        		this.formData.half_leave = "false";
      		}
      		this.formData.id = response.data.id;
    	},
    	async updateLeave() {
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
      		if ( !this.errors["leave_type"] && !this.errors["start_date"] && !this.errors["end_date"] && !this.errors["comments"]) {
        		await axios.post(`${base_url}/update_leave/${this.formData.id}`, {
            		leave_type: this.formData.leave_type,
            		start_date: this.formData.start_date,
            		end_date: this.formData.end_date,
            		total_day: this.formData.total_day,
            		comments: this.formData.comments,
            		staff_name: this.$store.state.user.name,
            		staff_email: this.$store.state.user.email,
            		admin_id: this.$store.state.user.id,
          		}).then((res) => {
            		this.errors.push(res.data);
            		if (res.data == "Leave updated") {
              			this.$router.push({ name: "staff_leave" });
              			this.$notify({
                			title: "<b>Leave</b> Updated!",
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
