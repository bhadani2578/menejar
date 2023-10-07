<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="View Project" :name="this.$store.state.user.name" />
        		<staff-header v-else title="View Project"></staff-header>
      		</div>
      		<div class='loaderbox'  v-if="!this.formData.project_name">
        		<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
      		</div>
      		<div class="content-page admin-addproject-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-6">
              				<div class="back-button-setup">
                				<router-link :to="{ name: 'projects' }">
									<img src="../../assets/images/back-left-arrow.png" alt="&laquo;"/>Back
								</router-link>
              				</div>
            			</div>
            			<div class="col-12">
              				<div class="common-white-shadow-background">
                				<div class="edit-staff-data-form add-new-staff-form">
                  					<form @submit.prevent class="form-box row">
                    					<div class="col-12">
                      						<input type="text" name="project_name" placeholder="Project name" v-model="formData.project_name" readonly />
                      						<p></p>
                    					</div>
                    					<div class="col-12">
                      						<input type="text" name="client_name" placeholder="Client name" v-model="formData.client_name" readonly />
                      						<p></p>
                    					</div>
                    					<div class="col-12">
                      						<textarea name="description" rows="3" placeholder="Description" v-model="formData.description" readonly></textarea>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="date" name="sign_date" placeholder="Project Sign Date" v-model="formData.sign_date" readonly />
                      						<p></p>
                    					</div>												
                    					<div class="col-sm-6">
                      						<input type="date" name="deadline_date" placeholder="Project Deadline Date" v-model="formData.deadline_date" readonly />
                      						<p></p>
                    					</div>
                    					<div>
                      						<Multiselect v-model="value" placeholder="Add Staff" mode="tags" label="name" trackBy="name" :options="options" :searchable="true" />
                      						<p></p>
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
import Multiselect from "@vueform/multiselect";

export default {
  	name: "ViewProject",
  	components: {
    	LeftPannel,
    	CommonHeader,
    	CommonFooter,
    	StaffHeader,
    	Multiselect,
  	},
  	data() {
	    return {
      		type: "",
      		formData: {
        		project_name: "",
        		client_name: "",
        		email: "",
        		phone: "",
        		description: "",
        		sign_date: "",
        		deadline_date: "",
      		},
      		value: [],
      		options: [],
    	};
  	},
  	beforeRouteEnter(to, from, next) {
    	if (localStorage.getItem("type") == "staff") {
      		if (localStorage.getItem("permission").includes("projects")) {
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
        	this.getProjectById(), this.getStaff();
      	});
  	},
  	methods: {
	    async getStaff() {
      		const response = await axios.get(`${base_url}/projectdevelopers/${this.$store.state.user.id}`);
      		this.options = response.data;
    	},
    	// Get Product By Id
    	async getProjectById() {
      		const response = await axios.get(`${base_url}/projects/${this.$route.params.id}`);
      		this.formData.project_name = response.data.project_name;
      		if (response.data.organization) {
        		this.formData.client_name =
          		response.data.organization + " " + response.data.name;
      		} else {
        		this.formData.client_name = response.data.name;
      		}
      		this.formData.email = response.data.email;
      		this.formData.phone = response.data.phone;
      		this.formData.description = response.data.description;
      		if (response.data.sign_date != "1899-11-30T00:00:00.000Z") {
        		this.formData.sign_date = this.convertDate(response.data.sign_date);
      		} else {
        		this.formData.sign_date = "";
      		}
      		if (response.data.deadline_date != "1899-11-30T00:00:00.000Z") {
        		this.formData.deadline_date = this.convertDate(response.data.deadline_date);
      		} else {
        		this.formData.deadline_date = "";
      		}
      		this.value = JSON.parse(response.data.staff);
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
