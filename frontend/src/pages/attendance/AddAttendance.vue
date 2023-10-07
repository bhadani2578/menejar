<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Add Attendance" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Add Attendance"></staff-header>
      		</div>
      		<div class="content-page admin-new-attendance-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-12">
              				<div class="back-button-setup">
                				<router-link :to="{ name: 'AttendanceList' }">
									<img src="../../assets/images/back-left-arrow.png" alt="&laquo;" />Back
								</router-link>
              				</div>
            			</div>
            			<div class="col-12">
              				<div class="common-white-shadow-background">
                				<div class="new-attendance-form-setup">
                  					<form class="form-box" @submit.prevent>
                    					<div class="staffname-div">
                      						<label for="staffname">Staff Name</label>
                      						<select v-model="staffid" name="staffname" id="staffname" required>
                        						<option value="" selected>Choose one</option>
                        						<option v-for="data in names" :value="data.id" :key="data.id">
                          							{{ data.name }}
                        						</option>
                      						</select>
                      						<p style="color: red">{{ errors.staffid }}</p>
                    					</div>
                    					<div>
                      						<label for="checkinout">Check in/ Out Date</label>
                      						<input type="date" name="checkinout" class="checkindate" placeholder="Checkin Date" v-model="date" :max="date" required />
                      						<p style="color: red">{{ errors.date }}</p>
                    					</div>
                    					<div>
                      						<label for="checkintime">Check in Time</label>
                      						<input type="time" name="checkintime" class="checkintime" v-model="checkin" required />
                      						<p style="color: red">{{ errors.checkin }}</p>
                    					</div>
                    					<div>
                      						<label for="checkouttime">Check Out Time</label>
                      						<input type="time" name="checkouttime" class="checkintime" v-model="checkout" required />
                      						<p style="color: red">{{ errors.checkout }}</p>
                    					</div>
                    					<div class="attendance-form-submit">
                      						<input type="submit" class="yellow-button" value="Submit" @click="OnStaffSubmit" />
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
      		name: "",
      		names: [],
      		date: new Date().toISOString().substr(0, 10),
      		staffid: "",
      		checkin: "",
      		checkout: "",
      		errors: [],
      		type: "",
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
        	if (this.$store.state.user.is_business == 1) {
          		this.$router.push("/addattendance");
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
    	async OnStaffSubmit() {
      		this.errors = [];
      		if (!this.staffid) {
        		this.errors["staffid"] = "Staff Name is required";
      		}
      		if (!this.date) {
        		this.errors["date"] = "Date is required";
      		}
      		if (!this.checkin) {
        		this.errors["checkin"] = "Check In Time is required";
      		}
      		if (!this.checkout) {
        		this.errors["checkout"] = "Check Out Time is required";
      		}

      		if ( !this.errors["staffid"] && !this.errors["date"] && !this.errors["checkin"] && !this.errors["checkout"]) {
        		await axios.post(`${base_url}/attendance`, {
            		staffid: this.staffid,
            		date: this.date,
            		checkin: this.checkin,
            		checkout: this.checkout,
            		isCheckout: "Yes",
            		admin_id: this.$store.state.user.id,
          		}).then((res) => {
            		this.errors.push(res.data);
            		this.$router.push({ name: "AttendanceList" });
            		this.$notify({
              			title: "<b>Attendance</b> added successfully!",
              			type: "warn",
            		});
          		});
      		}
    	},
  	},
};
</script>

<style></style>
