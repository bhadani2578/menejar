<template>
  	<div class="panelbox">
	    <LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Add Project" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Add Project"></staff-header>
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
                      						<input type="text" name="project_name" placeholder="Project Name" v-model="formData.project_name" required />
                      						<p style="color: red">{{ errors.project_name }}</p>
                    					</div>
                    					<div class="col-12">
                      						<select name="client_name" v-model="formData.client" >
                        						<option value="" selected>Select Client</option>
                        						<option v-for="data in clients" :value="data.id" :key="data.id">{{ data.organization }} {{ data.name }} </option>
                      						</select>
                      						<!-- <p style="color: red"> {{ errors.client }}</p> -->
                    					</div>
                    					<div class="col-12">
                      						<textarea name="description" rows="3" placeholder="Description" v-model="formData.description" ></textarea>
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
                      						<input type="submit" value="Submit" class="yellow-button" @click="create_project" />
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
        		client: "",
        		email: "",
        		phone: "",
        		description: "",
        		sign_date: "",
        		deadline_date: "",
      		},
      		clients: [],
      		errors: [],
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
        	this.getClient(), this.getStaff();
        	if (this.$store.state.user.is_business == 1) {
          		this.$router.push("/create_project");
        	} else {
          		this.$router.push("/business_setting");
        	}
      	});
  	},
  	methods: {
    	async getClient() {
      		const response = await axios.post(`${base_url}/invoiceclients/${this.$store.state.user.id}`);
      		this.clients = response.data;
    	},
    	async getStaff() {
      		const response = await axios.get(`${base_url}/projectdevelopers/${this.$store.state.user.id}`);
      		this.options = response.data;
    	},
    	async create_project() {
      		this.errors = [];
      		if (!this.formData.project_name) {
        		this.errors["project_name"] = "Project Name is Required";
      		}
      		// if (!this.formData.client) {
        	// 	this.errors["client"] = "Client Name is Required";
      		// }
      		if(!this.formData.sign_date){
        		this.formData.sign_date = '0000-00-00';
      		}
      		if(!this.formData.deadline_date){
        		this.formData.deadline_date = '0000-00-00';
      		}
      		if (!this.errors["project_name"] ) {
        		await axios.post(`${base_url}/projects`, {
            		project_name: this.formData.project_name,
            		client_id: this.formData.client,
            		description: this.formData.description,
            		sign_date: this.formData.sign_date,
            		deadline_date: this.formData.deadline_date,
            		staff: JSON.stringify(this.value),
            		admin_id: this.$store.state.user.id,
          		}).then((res) => {
            		this.errors.push(res.data);
            		if (res.data == "Project Created") {
              			this.$router.push({ name: "projects" });
              			this.$notify({
                			title: "<b>Project</b> added successfully!",
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
  	},
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
