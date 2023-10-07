<template>
	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div class="right-panel">
      		<div class="header">
        		<CommonHeader title="Add Task" :name="this.$store.state.user.name" />
      		</div>
      		<div class="content-page admin-new-editstaff-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-sm-6">
              				<div class="back-button-setup">
                				<router-link :to="{ name: 'TaskList' }">
									<img src="../../assets/images/back-left-arrow.png" alt="&laquo;" />Back
								</router-link>
              				</div>
            			</div>
            			<div class="col-12">
              				<div class="common-white-shadow-background" style="padding-top: 1px">
                				<div class="new-attendance-form-setup">
                  					<form @submit.prevent>
                    					<div>
                      						<label>Date : </label>
                      						<input type="date" v-model="date" disabled />
                      						<p></p>	
                    					</div>
                    					<div>
                      						<label>Project Name : </label>
                      						<select v-model="project_id" @change="myFunction($event.target.value)" required >
                        						<option value="" selected>Project</option>
                        						<option v-for="data in projectnames" :value="data.id" :key="data.id">{{ data.project_name }}</option>
                      						</select>
                      						<p style="color: red">{{ errors.project_id }}</p>
                    					</div>
                    					<div v-if="project_id">
                      						<label>Assign Staff : </label>
                      						<Multiselect class="task-developers" v-model="value" placeholder="Staff Name" mode="tags" label="name" trackBy="name" :options="options" :searchable="true" />
                      						<p style="color: red">{{ errors.value }}</p>
                    					</div>
                    					<div>
                      						<label>Task : </label>
                      						<input type="text" v-model="task" placeholder="Title" required />
                      						<p style="color: red">{{ errors.task }}</p>
                    					</div>
                    					<div>
                      						<label>Description : </label>
                      						<textarea rows="3" cols="60" type="textarea" placeholder="Description" v-model="description" required></textarea>
                      						<p style="color: red">{{ errors.description }}</p>
                    					</div>
                    					<div>
                      						<label>Deadline : </label>
                      						<input type="date" v-model="deadline" :min="date" />
                      						<p></p>
                    					</div>
                    					<div>
                      						<label>Status : </label>
                      						<input type="text" placeholder="Pending" disabled />
                      						<p></p>
                    					</div>	
                    					<div class="attendance-form-submit">
                      						<input type="submit" class="yellow-button" value="Submit" @click="onTaskSubmit" />
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
import axios from "axios";
import base_url from "../../base_url.js";
import Multiselect from "@vueform/multiselect";

const $ = require("jquery");
window.$ = $;

export default {
  	components: {
    	LeftPannel,
    	CommonHeader,
    	CommonFooter,
    	Multiselect,
  	},
  	data() {
    	return {
      		project_id: "",
      		client_id: "",
      		projectnames: [],
      		date: new Date().toISOString().substr(0, 10),
      		task: "",
      		description: "",
      		deadline: "",
      		value: [],
      		tempValue: [],
      		options: [],
      		errors: [],
      		temp: [],
      		id: "",
    	};		
  	},
  	created() {
    	if (this.$store.state.user.length != 0) {
      		this.getProjectName(), this.getStaff();
    	} else {
	      	axios.post(`${base_url}/get_client/${localStorage.getItem("token")}`).then((res) => {
          		this.$store.state.user = res.data.user;
          		this.getProjectName(), this.getStaff();
        	});
    	}
  	},
  	methods: {
    	async myFunction(chosen) {
      		const response = await axios.get(`${base_url}/projects/${chosen}`);
      		if (response.data.staff) {
        		this.value = JSON.parse(response.data.staff);
      		} else {
        		this.value = [];
      		}
      		this.client_id = response.data.client_id;
      		this.id = chosen;
      		this.temp = this.value;
    	},
    	async getStaff() {
      		const response = await axios.get(`${base_url}/projectdevelopers/${this.$store.state.user.id}`);
      		this.options = response.data;
    	},
    	async getProjectName() {
      		const response = await axios.post(`${base_url}/projectsfortrack/${this.$store.state.user.id}`);
      		this.projectnames = response.data;
    	},
    	async onTaskSubmit() {
      		this.errors = [];
      		if (!this.project_id) {
        		this.errors["project_id"] = "Project Name is required";
      		}
      		if (this.value.length == 0) {
        		$(window).scrollTop(0);
        		this.errors["value"] = "Assign staff";
      		}
      		if (!this.task) {
        		this.errors["task"] = "Task Title is required";
      		}
      		if (!this.description) {
        		this.errors["description"] = "Task Description is required";
      		}
      		if ( !this.errors["project_id"] && !this.errors["value"] && !this.errors["task"] && !this.errors["description"]) {
        		const newstaff = this.value.filter((e) => !this.temp.includes(e));
        		const removestaff = this.temp.filter((e) => !this.value.includes(e));
        		if (this.temp != this.value) {
          			await axios.post(`${base_url}/editdevelopers/${this.id}`, {
            			staff: JSON.stringify(this.value),
            			newstaff: newstaff,
            			removestaff: removestaff,
          			});
        		}
        		await axios.post(`${base_url}/clientaddtask`, {
            		date: this.date,
            		client_id: this.client_id,
            		project_id: this.project_id,
            		name: this.$store.state.user.name,
            		task: this.task,
            		description: this.description,
            		deadline: this.deadline,
            		status: 0,
            		admin_id: this.$store.state.user.id,
          		}).then(() => {
            		this.$router.push({ name: "TaskList" });
            		this.$notify({
              			title: "<b>Task</b> added successfully!",
              			type: "warn",
            		});
          		});
      		}
    	},
  	},
};
</script>
