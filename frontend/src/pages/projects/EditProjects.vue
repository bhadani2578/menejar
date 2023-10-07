<template>
  	<div class="panelbox">
	    <LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Edit Project" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Edit Project"></staff-header>
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
                  					<form class="form-box row" @submit.prevent>
                    					<div class="col-12">
                      						<input type="text" name="project_name" placeholder="Project name" v-model="formData.project_name" :class="[errors.project_name ? 'invalid-class' : '']" required />
                      						<p style="color: red">{{ errors.project_name }}</p>
                    					</div>
                    					<div class="col-12">
                      						<!-- <select name="client_name" v-model="formData.client" :class="[errors.client ? 'invalid-class' : '']" required style="color: black" > -->
											<select name="client_name" v-model="formData.client" style="color: black" >
                        						<option v-for="data in formData.clients" :value="data.id" :key="data.id"> {{ data.organization }} {{ data.name }} </option>
                      						</select>
                      						<!-- <p style="color: red">{{ errors.client }}</p> -->
                    					</div>
                    					<div class="col-12">
                      						<textarea name="description" rows="3" placeholder="Description" v-model="formData.description"></textarea>
                      						<p></p>
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="date" name="sign_date" placeholder="Project Sign Date" v-model="formData.sign_date" />
                      						<p></p>
                    					</div>
                    					<div class="col-sm-6">
                      						<input type="date" name="deadline_date" placeholder="Project Deadline Date" v-model="formData.deadline_date" :min="formData.sign_date" />
                      						<p></p>
                    					</div>
                    					<div>
                      						<Multiselect class="task-developers" v-model="value" placeholder="Add Staff" mode="tags" label="name" trackBy="name" :options="options" :searchable="true" />
                      						<p></p>
                    					</div>
                    					<div class="col-12">	
                      						<input type="submit" value="Update" class="yellow-button" @click="updateProduct" />
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
import Multiselect from "@vueform/multiselect";

export default {
  	name: "EditProject",
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
      		today: new Date().toISOString().substr(0, 10),
      		formData: {
      		  	project_name: "",
        		client: "",
        		clients: [],
        		description: "",
        		sign_date: "",
        		deadline_date: "",
      		},
      		value: [],
      		tempValue: [],
      		options: [],
      		errors: [],
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
        	this.getProjectById(), this.getName(), this.getStaff();
      	});
  	},
  	methods: {
    	async getName() {
      		const response = await axios.post(`${base_url}/invoiceclients/${this.$store.state.user.id}`);
      		this.formData.clients = response.data;
    	},
    	async getStaff() {
      		const response = await axios.get(`${base_url}/projectdevelopers/${this.$store.state.user.id}`);
      		this.options = response.data;
    	},
    	// Get Product By Id
    	async getProjectById() {
      		const response = await axios.get(`${base_url}/projects/${this.$route.params.id}`);
      		this.formData.project_name = response.data.project_name;
			this.formData.client = response.data.client_id;
			this.formData.description = response.data.description;			
      		console.log(response.data.sign_date);
      		console.log(response.data.deadline_date);
      		if (response.data.sign_date != "1899-11-30T00:00:00.000Z" && response.data.sign_date != null) {
        		this.formData.sign_date = this.convertDate(response.data.sign_date);
      		} else {
        		this.formData.sign_date = '0000-00-00';
      		}
      		if (response.data.deadline_date != "1899-11-30T00:00:00.000Z" && response.data.deadline_date != null) {
        		this.formData.deadline_date = this.convertDate(response.data.deadline_date);
      		} else {
		        this.formData.deadline_date = '0000-00-00';
      		}
			this.value = JSON.parse(response.data.staff);
      		this.tempValue = this.value;
    	},
    	// Update product
    	async updateProduct() {
      		const newstaff = this.value.filter((e) => !this.tempValue.includes(e));
      		const removestaff = this.tempValue.filter((e) => !this.value.includes(e));
      		this.errors = [];
      		if (!this.formData.project_name) {
        		this.errors["project_name"] = "Project Name is Required";
      		}
      		// if (!this.formData.client) {
        	// 	this.errors["client"] = "Client Name is Required";
      		// }
      		if (!this.errors["project_name"] ) {
        		await axios.post(`${base_url}/projects/${this.$route.params.id}`, {
            		project_name: this.formData.project_name,
            		client_id: this.formData.client,
            		description: this.formData.description,
            		sign_date: this.formData.sign_date,
            		deadline_date: this.formData.deadline_date,
            		staff: JSON.stringify(this.value),
            		newstaff: newstaff,
            		removestaff: removestaff,
          		}).then((res) => {
            		if (res.data == "Project updated") {
              			this.$router.push({ name: "projects" });
              			this.$notify({
                			title: "<b>Project</b> edited successfully!",
                			type: "warn",
              			});
            		}
          		});
      		}
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
