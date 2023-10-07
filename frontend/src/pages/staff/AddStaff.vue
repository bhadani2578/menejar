<template>
  	<div class="panelbox">
	    <LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Add Staff" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Add Staff"></staff-header>
      		</div>
      		<div class="content-page admin-new-addstaff-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-6">
              				<div class="back-button-setup">
                				<router-link :to="{ name: 'StaffList' }">
									<img src="../../assets/images/back-left-arrow.png" alt="&laquo;" />Back
								</router-link>
              				</div>
            			</div>
            			<div class="col-12">
              				<div class="common-white-shadow-background">
                				<div class="edit-staff-data-form add-new-staff-form">
                  					<form class="form-box row" @submit.prevent enctype="multipart/form-data">
                    					<div class="col-12">
                      						<input type="text" name="editname" placeholder="Name" v-model="name" required />
                      						<p style="color: red">{{ errors.name }}</p>
                    					</div>											
                    					<div class="col-sm-6">
                      						<input type="email" name="editemail" placeholder="Email" v-model="email" required />
                      						<p v-if="errors.allreadyexist" style="color: red">{{ errors.allreadyexist }}</p>
                      						<p v-else style="color: red">{{ errors.email }}</p>
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="tel" name="editphone" placeholder="Phone Number" v-model="phone" required />
                      						<p style="color: red">{{ errors.phone }}</p>
                    					</div>
                    					<div class="col-12 editstaff-address">
                      						<textarea name="editaddress" rows="3" placeholder="Address" v-model="address" required></textarea>
                      						<p style="color: red">{{ errors.address }}</p>
                    					</div>
                    					<div class="col-sm-4">
                      						<label for="myphoto">Photo</label>
                      						<input type="file" id="photo" name="myphoto" key="photo" ref="photo" @change="onPhoto" />
                    					</div>
                    					<div class="col-sm-4">
                      						<label for="mydoc1">Document 1</label>
                      						<input type="file" id="mydoc1" name="mydoc1" key="doc1" ref="doc1" @change="onDoc1" />
                    					</div>
                    					<div class="col-sm-4">
                      						<label for="mydoc2">Document 2</label>
                      						<input type="file" id="mydoc2" ref="doc2" key="doc2" name="mydoc2" @change="onDoc2" />
                    					</div>
                    					<div class="col-sm-4">
                      						<label for="mydoc3">Document 3</label>
                      						<input type="file" id="mydoc3" ref="doc3" key="doc3" name="mydoc3" @change="onDoc3" />
                    					</div>
                    					<div class="col-sm-4">
                      						<label for="mydoc4">Document 4</label>
                      						<input type="file" id="mydoc4" ref="doc4" key="doc4" name="mydoc4" @change="onDoc4" />
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="password" name="pass" placeholder="Password*" v-model="password" required />
                      						<p style="color: red">{{ errors.password }}</p>
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="password" name="cpass" placeholder="Confirm Password*" v-model="cpassword" required />
                      						<p style="color: red">{{ errors.cpassword }}</p>
                    					</div>
                    					<div class="col-12 editstaff-notes">
                      						<textarea name="editnote" rows="3" placeholder="Note" v-model="note"></textarea>
                      						<p></p>
                    					</div>
                    					<div class="col-12">
                      						<label for="permission">Permissions</label>
                    					</div>
                    					<p></p>
                    					<div class="col-sm-2">Attendance</div>
                    					<div class="col-sm-2">
                      						<input type="checkbox" v-model="checked" value="AttendanceList" />
                    					</div>
                    					<div class="col-sm-2">Clients</div>
                    					<div class="col-sm-2">
                      						<input type="checkbox" v-model="checked" value="clients" />
                    					</div>
                    					<div class="col-sm-2">Invoices</div>
                    					<div class="col-sm-2">
                      						<input type="checkbox" v-model="checked" value="invoice" />
                    					</div>
                    					<div class="col-sm-2">Projects</div>
                    					<div class="col-sm-2">
                      						<input type="checkbox" v-model="checked" value="projects" />
                    					</div>
                    					<div class="col-sm-2">Track</div>
                    					<div class="col-sm-2">	
                      						<input type="checkbox"	 v-model="checked" value="TrackList" />
                    					</div>
                    					<div class="col-sm-2">Staff</div>
                    					<div class="col-sm-2">
                      						<input type="checkbox" v-model="checked" value="StaffList" />
                    					</div>
                    					<div class="col-sm-2">Leave</div>
                    					<div class="col-sm-2">
                      						<input type="checkbox" v-model="checked" value="leave" />
                    					</div>
                    					<p></p>
                    					<div class="col-12">
                      						<input type="submit" value="Submit" class="yellow-button" @click="staffdataSubmit" />
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
import base_url from "../../base_url.js";
import StaffHeader from "../../components/user/CommonHeader.vue";

const $ = require("jquery");
window.$ = $;
const bcrypt = require("bcryptjs");

export default {
  	name: "Create",
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
      		email: "",
      		phone: "",
      		address: "",
      		password: "",
      		cpassword: "",
      		photo: "",
      		note: "",
      		supportphoto: "",
      		doc1: "",
      		supportdoc1: "",
      		doc2: "",
      		supportdoc2: "",
      		doc3: "",
      		supportdoc3: "",
      		doc4: "",
      		supportdoc4: "",
      		errors: [],
      		checked: [],
    	};
  	},
  	beforeRouteEnter(to, from, next) {
    	if (localStorage.getItem("type") == "staff") {
      		if (localStorage.getItem("permission").includes("StaffList")) {
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
        	if (this.$store.state.user.is_business == 1) {
          		this.$router.push("/addstaff");
        	} else {
          		this.$router.push("/business_setting");
        	}
      	});
  	},
  	methods: {
	    onPhoto() {
      		const photo = this.$refs.photo.files[0];
      		this.photo = photo;
    	},
    	onDoc1() {
      		const doc1 = this.$refs.doc1.files[0];
      		this.doc1 = doc1;
    	},
    	onDoc2() {
      		const doc2 = this.$refs.doc2.files[0];
      		this.doc2 = doc2;
    	},
    	onDoc3() {
      		const doc3 = this.$refs.doc3.files[0];
      		this.doc3 = doc3;
    	},
    	onDoc4() {
      		const doc4 = this.$refs.doc4.files[0];
      		this.doc4 = doc4;
    	},
    	async staffdataSubmit() {
      		this.errors = [];
      		var salt = bcrypt.genSaltSync(10);
      		if (!this.name) {
        		this.errors["name"] = "Name is Required";
      		}
      		if (!this.email) {
        		this.errors["email"] = "Email is Required";
      		} else if (!this.validEmail(this.email)) {
        		this.errors["email"] = "Please enter valid email address";
      		}
      		if (this.phone.length === 0) {
        		this.errors["phone"] = "Phone Number is Required";
      		} else if (!this.validPhone(this.phone)) {
        		this.errors["phone"] = "Please enter valid Phone number";
      		}
      		if (!this.address) {
        		this.errors["address"] = "Address is Required";
      		}
      		if (!this.password) {
        		this.errors["password"] = "Password is Required";
      		} else if (!this.validPass(this.password)) {
        		this.errors["password"] = "Password has one digit, uppercase, lowercase, speical character and 8 character";
      		}
      		if (!this.cpassword) {
        		this.errors["cpassword"] = "Confirm password is Required";
      		} else if (this.password !== this.cpassword) {
        		this.errors["cpassword"] = "Password not match";
      		}
      		if ( !this.errors["name"] && !this.errors["email"] && !this.errors["address"] && !this.errors["password"] && !this.errors["cpassword"] && !this.errors["phone"]) {
        		const formData = new FormData();
        		formData.append("photo", this.photo);
        		formData.append("doc1", this.doc1);
        		formData.append("doc2", this.doc2);
        		formData.append("doc3", this.doc3);
        		formData.append("doc4", this.doc4);
        		await axios.post(`${base_url}/upload`, formData).then((res) => {
          			this.supportphoto = this.supportdoc1 = this.supportdoc2 = this.supportdoc3 = this.supportdoc4 = "";
          			if (res.data.files.photo) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.doc1) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.doc2) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.doc3) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.doc4) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if (res.data.files.photo && res.data.files.doc1) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.photo && res.data.files.doc2) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.photo && res.data.files.doc3) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.photo && res.data.files.doc4) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if (res.data.files.doc1 && res.data.files.doc2) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.doc1 && res.data.files.doc3) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.doc1 && res.data.files.doc4) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if (res.data.files.doc2 && res.data.files.doc3) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = this.doc4;
          			}
          			if (res.data.files.doc2 && res.data.files.doc4) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if (res.data.files.doc3 && res.data.files.doc4) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = this.doc2;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc2) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = this.doc4;
          			}
          			if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc3) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = this.doc4;
          			}
          			if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc4) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if (res.data.files.photo && res.data.files.doc2 && res.data.files.doc3) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = this.doc4;
          			}
          			if ( res.data.files.photo && res.data.files.doc2 && res.data.files.doc4) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if ( res.data.files.photo && res.data.files.doc3 && res.data.files.doc4 ) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if ( res.data.files.doc1 && res.data.files.doc2 && res.data.files.doc3) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = this.doc4;
          			}
          			if ( res.data.files.doc1 && res.data.files.doc2 && res.data.files.doc4) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = this.doc3;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if ( res.data.files.doc1 && res.data.files.doc3 && res.data.files.doc4) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = this.doc2;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if ( res.data.files.doc2 && res.data.files.doc3 && res.data.files.doc4) {
            			this.supportphoto = this.photo;
            			this.supportdoc1 = this.doc1;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			if ( res.data.files.photo && res.data.files.doc1 && res.data.files.doc2 && res.data.files.doc3 && res.data.files.doc4) {
            			this.supportphoto = res.data.files.photo[0].filename;
            			this.supportdoc1 = res.data.files.doc1[0].filename;
            			this.supportdoc2 = res.data.files.doc2[0].filename;
            			this.supportdoc3 = res.data.files.doc3[0].filename;
            			this.supportdoc4 = res.data.files.doc4[0].filename;
          			}
          			axios.post(`${base_url}/staff`, {
              			name: this.name,
              			email: this.email,
              			phone: this.phone,
              			address: this.address,
              			password: bcrypt.hashSync(this.password, salt),
              			note: this.note,
              			photo: this.supportphoto,
              			doc1: this.supportdoc1,
              			doc2: this.supportdoc2,
              			doc3: this.supportdoc3,
              			doc4: this.supportdoc4,
              			admin_id: this.$store.state.user.id,
              			staff_pass: this.password,
              			admin_name: this.$store.state.user.name,
              			image: this.$store.state.user.image,
            		}).then((res) => {
              			if (res.data.title == "register Success") {
                			this.$router.push({ name: "StaffList" });
                			this.$notify({
                  				title: "<b>Staff</b> added successfully!",
                  				type: "warn",
                			});
                			this.permission(res.data.user.insert_id);
              			}
              			if (res.data == "Email allready exists") {
                			this.errors["allreadyexist"] = "Email allready exists";
                			$(window).scrollTop(0);
              			}
            		});
        		});
      		}
    	},
    	async permission(id) {
      		await axios.post(`${base_url}/permission`, {
        		permission: JSON.stringify(this.checked),
        		staff_id: id,
        		admin_id: this.$store.state.user.id,
      		});
    	},
    	validEmail: function (email) {
      		var re =
        		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      		return re.test(email);
    	},
    	validPhone: function (mobile) {
      		var phone = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      		return phone.test(mobile);
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
