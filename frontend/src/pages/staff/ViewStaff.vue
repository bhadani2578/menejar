<template>
  	<div class="panelbox">
	    <LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
         		<CommonHeader v-if="type == 'admin'" title="View Staff" :name="this.$store.state.user.name" />
        		<staff-header v-else title="View Staff"></staff-header>
      		</div>
      		<div class='loaderbox'  v-if="!this.id">
        		<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
      		</div>
      		<div class="content-page admin-new-attendance-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-12">
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
                      						<input type="text" name="editname" placeholder="Name" v-model="name" readonly />
                      						<p></p>
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="email" name="editemail" placeholder="Email" v-model="email" readonly />
                      						<p></p>
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="phone" Placeholder="Phone Number" required v-model="phone" readonly />
                      						<p></p>
                    					</div>
                    					<div class="col-12 editstaff-address">
                      						<textarea type="textarea" placeholder="address" required v-model="address" readonly></textarea>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-if="photo">
                      						<a style="text-decoration: none; color: inherit" :href="`${this.base_url}/static/${this.photo}`" target="blank">{{ photo }}</a>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-else>
											No Photo
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-if="doc1">
                      						<a style="text-decoration: none; color: inherit" :href="`${this.base_url}/static/${this.doc1}`" target="blank">{{ doc1 }}</a>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-else>
                      						No Document 1
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-if="doc2">
                      						<a style="text-decoration: none; color: inherit" :href="`${this.base_url}/static/${this.doc2}`" target="blank">{{ doc2 }}</a>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-else>
                      						No Document 2
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-if="doc3">
                      						<a style="text-decoration: none; color: inherit" :href="`${this.base_url}/static/${this.doc3}`" target="blank">{{ doc3 }}</a>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-else>
                      						No Document 3
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-if="doc4">
                      						<a style="text-decoration: none; color: inherit" :href="`${this.base_url}/static/${this.doc4}`" target="blank">{{ doc4 }}</a>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-4 view-staff-images" v-else>
                      						No Document 4	
                      						<p></p>
                    					</div>
                    					<p></p>
                    					<div class="col-12 editstaff-notes">
                      						<textarea type="textarea" placeholder="Note" required v-model="note" readonly></textarea>
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
      		id: "",
      		name: "",
      		email: "",
      		phone: "",
      		address: "",
      		note: "",
      		photo: "",
      		doc1: "",
      		doc2: "",
      		doc3: "",
      		doc4: "",
      		checked: [],
      		permissions: [],
      		base_url: "",
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
    	this.base_url = base_url;
    	axios.post(`${base_url}/user`, {
        	headers: { token: localStorage.getItem("token") },
        	type: localStorage.getItem("type"),
      	}).then((res) => {
        	this.$store.state.user = res.data.user;
        	this.singleStaffSelect();
      	});
  	},
  	methods: {
    	async singleStaffSelect() {
      		const response = await axios.get(`${base_url}/staff/${this.$route.params.id}`);
      		this.name = response.data.name;
      		this.email = response.data.email;
      		this.phone = response.data.phone;
      		this.address = response.data.address;
      		this.note = response.data.note;
      		this.photo = response.data.photo;
      		this.doc1 = response.data.doc1;
      		this.doc2 = response.data.doc2;
      		this.doc3 = response.data.doc3;
      		this.doc4 = response.data.doc4;
      		this.id = response.data.id;
      		await axios.post(`${base_url}/get_permission`, {
          		headers: { token: localStorage.getItem("token") },
          		type: localStorage.getItem("type"),
          		id: this.id,
          		admin_id: this.$store.state.user.id,
        	}).then((res) => {
          		this.permissions = JSON.parse(res.data.permission);
          		this.checked = this.permissions;
        	});
    	},
  	},
};
</script>

<style></style>
