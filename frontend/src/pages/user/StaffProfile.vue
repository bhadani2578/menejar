<template>
 	<div class="panelbox">
    	<LeftPannel />
    	<div class="right-panel staff-section-page">
    	  	<div class="header">
    	    	<CommonHeader title="Profile" />
    	  	</div>			  

			<Loader :loading=this.loading />
			
    	  	<div class="content-page admin-new-attendance-page">
		        <div class="fullrow">
    	      		<div class="row">
    	        		<div class="col-12">
    	          			<div class="common-white-shadow-background">
    	            			<div class="edit-staff-data-form add-new-staff-form">
    	              				<form class="form-box row" @submit.prevent enctype="multipart/form-data">
    	                				<div class="col-12">
    	                  					<input type="text" name="editname" placeholder="Name" v-model="this.$store.state.user.name" readonly />
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-6">
    	                  					<input type="email" name="editemail" placeholder="Email" v-model="this.$store.state.user.email" readonly />
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-6">
    	                  					<input type="phone" Placeholder="Phone Number" required v-model="this.$store.state.user.phone" readonly />
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-12 editstaff-address">
    	                  					<textarea type="textarea" placeholder="address" required v-model="this.$store.state.user.address" readonly ></textarea>
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-if="this.$store.state.user.photo">
    	                  					<a style=" text-decoration: none; cursor: pointer; color: inherit;" :href="`${this.base_url}/static/${this.$store.state.user.photo}`" target="blank">{{ this.$store.state.user.photo }}</a>
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-else>
    	                  					No Photo
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-if="this.$store.state.user.doc1">
    	                  					<a style=" text-decoration: none; cursor: pointer; color: inherit;" :href="`${this.base_url}/static/${this.$store.state.user.doc1}`" target="blank">{{ this.$store.state.user.doc1 }}</a>
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-else>
    	                  					No Document 1
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-if="this.$store.state.user.doc2">
    	                  					<a style=" text-decoration: none; cursor: pointer; color: inherit;" :href="`${this.base_url}/static/${this.$store.state.user.doc2}`" target="blank">
    	                    					{{ this.$store.state.user.doc2 }}
											</a>
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-else>
    	                  					No Document 2
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-if="this.$store.state.user.doc3">
    	                  					<a style=" text-decoration: none; cursor: pointer; color: inherit;" :href="`${this.base_url}/static/${this.$store.state.user.doc3}`" target="blank">
    	                    					{{ this.$store.state.user.doc3 }}
											</a>
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-else>
    	                  					No Document 3
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-if="this.$store.state.user.doc4">
    	                  					<a style=" text-decoration: none; cursor: pointer; color: inherit;" :href="`${this.base_url}/static/${this.$store.state.user.doc4}`" target="blank">
    	                    					{{ this.$store.state.user.doc4 }}
											</a>
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-sm-4 view-staff-images" v-else>
    	                  					No Document 4
    	                			 	 	<p></p>
    	                				</div>
    	                				<p></p>
    	                				<div class="col-12 editstaff-notes">
    	                  					<textarea type="textarea" placeholder="Note" required v-model="this.$store.state.user.note" readonly></textarea>
    	                  					<p></p>
    	                				</div>
    	                				<div class="col-12">
    	                  					<label for="permission">Permissions</label>
    	                				</div>
    	                				<p></p>
    	                				<div class="col-sm-2">Attendance</div>
    	                				<div class="col-sm-2">
    	                  					<input type="checkbox" v-model="checked" value="AttendanceList" disabled />
    	                				</div>
    	                				<div class="col-sm-2">Clients</div>
    	                				<div class="col-sm-2">
    	                  					<input type="checkbox" v-model="checked" value="clients" disabled />
    	                				</div>
    	                				<div class="col-sm-2">Invoices</div>
    	                				<div class="col-sm-2">
    	                  					<input type="checkbox" v-model="checked" value="invoice" disabled />
    	                				</div>
    	                				<div class="col-sm-2">Projects</div>
    	                				<div class="col-sm-2">
    	                  					<input type="checkbox" v-model="checked" value="projects" disabled />
    	                				</div>
    	                				<div class="col-sm-2">Track</div>
    	                				<div class="col-sm-2">
    	                  					<input type="checkbox" v-model="checked" value="TrackList" disabled />
    	                				</div>
    	                				<div class="col-sm-2">Staff</div>
    	                				<div class="col-sm-2">
    	                  					<input type="checkbox" v-model="checked" value="StaffList" disabled />
    	                				</div>
    	                				<div class="col-sm-2">Leave</div>
    	                				<div class="col-sm-2">
    	                  					<input type="checkbox" v-model="checked" value="leave" disabled />
    	                				</div>
    	              				</form>
    	              				<p></p>
    	              				<div class="col-12" style="left: 0; bottom: 0; display: flex">
    	                				<div class="forgot-pass-link">
    	                  					<a style="color: #1e4077">Change Password ?</a>
    	                				</div>
    	              				</div>
    	              				<form class="form-box row" @submit.prevent>
    	                				<p></p>
    	                				<div class="col-sm-3">
    	                  					<input type="password" name="current_pass" placeholder="Current Password" v-model="formData.current_pass" required />
    	                  					<p style="color: red">
    	                    					{{ errors.current_pass }}
    	                  					</p>
    	                				</div>
    	                				<div class="col-sm-3">
    	                  					<input type="password" name="npassword" placeholder="New Password" v-model="formData.npassword" required />
    	                  					<p style="color: red">
    	                    					{{ errors.npassword }}
    	                  					</p>
    	                				</div>
    	                				<div class="col-sm-3">
    	                  					<input type="password" name="cpassword" placeholder="Confirm Password" v-model="formData.cpassword" required />
    	                  					<p style="color: red">
    	                    					{{ errors.cpassword }}
    	                  					</p>
    	                				</div>
    	                				<div class="col-sm-3">
    	                  					<input type="submit" value="Change Password" class="yellow-button" @click="change_password()" />
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
import LeftPannel from "../../components/user/LeftPannel.vue";
import CommonHeader from "../../components/user/CommonHeader.vue";
import CommonFooter from "../../components/CommonFooter.vue";
import Loader from "../../components/Loader.vue";
import base_url from "../../base_url.js";

export default {
  	components: {
    	LeftPannel,
    	CommonHeader,
    	CommonFooter,
		Loader
  	},
  	data() {
    	return {
      		base_url: "",
      		checked: [],
      		permissions: [],
      		formData: {
      		  	npassword: "",
        		cpassword: "",
        		current_pass: "",
      		},
      		errors: [],
			loading:true,
    	};
  	},
  	created() {
		this.checkActivated();
		
    	if (this.$store.state.user.length != 0) {
      		axios.post(`${base_url}/get_permission`, {
          		headers: { token: localStorage.getItem("token") },
          		type: localStorage.getItem("type"),
          		staff_id: this.$store.state.user.staffid,
				from: "get_permission of profile",
          		admin_id: this.$store.state.user.id,
        	}).then((response) => {
						this.permissions = JSON.parse(response.data.permission);
						this.checked = this.permissions;
						this.loading=false;
        	});
    	} else {
      		axios.post(`${base_url}/get_staff`, {
          		headers: { token: localStorage.getItem("token") },
        	}).then((res) => {
          		this.$store.state.user = res.data.user;
          		axios.post(`${base_url}/get_permission`, {
          			headers: { token: localStorage.getItem("token") },
          			type: localStorage.getItem("type"),
					from: "get_permission of profile 1",
          			staff_id: this.$store.state.user.staffid,
          			admin_id: this.$store.state.user.id,
        		}).then((response) => {
						this.permissions = JSON.parse(response.data.permission);
						this.checked = this.permissions;
						this.loading=false;
        	});
        	});
    	}

    	this.base_url = base_url;
  	},
  	methods: {
		//check activation status of staff
		async checkActivated() {
			await axios
				.post(`${base_url}/checkactivation`, {
					staff_id: this.$store.state.user.staffid,
				})
				.then((response) => {
					if(response.data.error) {
						localStorage.clear();
      					this.$store.state.user = "";
      					// this.$router.go();
						this.$router.push('/login');
					}
				})
			},

    	//password change
    	async change_password() {
      		this.errors = [];
      		if (!this.formData.current_pass) {
        		this.errors["current_pass"] = "Current Password is Required";
      		}
      		if (!this.formData.npassword) {
        		this.errors["npassword"] = "New Password is Required";
      		} else if (!this.validPass(this.formData.npassword)) {
        		this.errors["npassword"] = "Password has one digit, uppercase, lowercase, speical character and 8 character";
      		}
      		if (!this.formData.cpassword) {
        		this.errors["cpassword"] = "Confirm password is Required";
      		} else if (this.formData.npassword !== this.formData.cpassword) {
        		this.errors["cpassword"] = "Password not match";
      		}
      		if ( !this.errors["current_pass"] && !this.errors["npassword"] && !this.errors["cpassword"]) {
        		await axios.post(`${base_url}/staff_change_pass`, {
            		current_pass: this.formData.current_pass,
            		npassword: this.formData.npassword,
            		id: this.$store.state.user.staffid,
          		}).then((res) => {
            		if (res.data == "invalid Current pass") {
              			this.errors["current_pass"] = "Invalid Current Password";
            		}
            		if (res.data == "Password Change successfully.") {
              			this.$notify({
                			title: "<b>Password</b> changed successfully!",
                			type: "warn",
              			});
              			this.formData.password = "";
              			this.formData.cpassword = "";
              			this.formData.current_pass = "";
            		}
          		});
      		}
    	},
    	validPass: function (password) {
      		var pass =
        		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
      		return pass.test(password);
    	},
  	},
};
</script>

<style></style>
