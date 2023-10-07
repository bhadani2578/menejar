<template>
  	<div class="panelbox">
    	<LeftPannel />
    	<div class="right-panel">
      		<div class="header">
        		<CommonHeader title="Edit Task" :name="this.$store.state.user.name" />
      		</div>
      		<div class="content-page admin-new-editstaff-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-sm-6">
              				<div class="back-button-setup">
                				<a @click="goBack">
									<img src="../../../../assets/images/back-left-arrow.png" alt="&laquo;" />Back
								</a>
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
                      						<select v-model="project_id" required>
                        						<option value="" selected>Project</option>
                        						<option v-for="data in projectnames" :value="data.id" :key="data.id">{{ data.project_name }}</option>
                      						</select>
                      						<p style="color: red">{{ errors.project_id }}</p>
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
                      						<label>Assigned by : </label>
                      						<input type="text" v-model="name" disabled />
                      						<p></p>
                    					</div>
                    					<div>
                      						<label>Status : </label>
                      						<select v-model="statusvalue" required>
                        						<option value="" selected>Status</option>
                        						<option v-for="data in status" :value="data.id" :key="data.name">{{ data.name }}</option>
                      						</select>
                      						<p></p>
                    					</div>
                    					<div>
                      						<input v-if="this.archive == 0" type="submit" style=" color: black; font-size: 18px; line-height: 21px; border: 1px solid black; width: 131px; padding: 11px;" value="Archive" @click="archiveTask(this.$route.params.id)" />
                      						<input v-if="this.archive == 1" type="submit" style=" color: black; font-size: 18px; line-height: 21px; border: 1px solid black; width: 131px; padding: 11px;" value="Unarchive" @click="archiveTask(this.$route.params.id)" />
                      						<p></p>
                    					</div>
                    					<div class="attendance-form-submit">
                      						<input type="submit" class="yellow-button" value="Update" @click="editTask" />
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
import LeftPannel from "../../../../components/client/LeftPannel.vue";
import CommonHeader from "../../../../components/client/CommonHeader.vue";
import CommonFooter from "../../../../components/CommonFooter.vue";
import base_url from "../../../../base_url.js";
import axios from "axios";

export default {
  	components: { LeftPannel, CommonHeader, CommonFooter },
  	created() {
	    if (this.$store.state.user.length != 0) {
      		this.getTaskById(), this.getProjectName();
    	} else {
      		axios.post(`${base_url}/get_client/${localStorage.getItem("token")}`).then((res) => {
          		this.$store.state.user = res.data.user;
          		this.getTaskById(), this.getProjectName();
        	});
    	}
  	},
  	data() {
	    return {
      		project_id: "",
      		projectnames: [],
      		date: new Date().toISOString().substr(0, 10),
      		name: "",
		    task: "",
		    description: "",
      		deadline: "",
      		errors: [],
      		statusvalue: "",
      		archive: "",
      		status: [
        		{ id: 0, name: "Pending" },
        		{ id: 1, name: "Working" },
        		{ id: 2, name: "Review" },
        		{ id: 3, name: "Completed" },
      		],
    	};
  	},
  	methods: {
	    //get task by id
	    async getTaskById() {
      		const response = await axios.get(`${base_url}/task/${this.$route.params.id}`);
      		this.date = this.convertDate(response.data.date);
      		this.project_id = response.data.project_id;
      		this.name = response.data.name;
      		this.task = response.data.task;
      		this.description = response.data.description;
      		this.deadline = this.convertDate(response.data.deadline);
      		this.statusvalue = response.data.status;
      		this.archive = response.data.archive;
    	},		
    	async getProjectName() {
      		const response = await axios.post(`${base_url}/taskclientprojects/${this.$store.state.user.id}`);
  			this.projectnames = response.data;
    	},
    	async archiveTask(id) {
      		if (!this.archive) {
        		this.archive = true;
      		} else {
        		this.archive = false;
      		}
      		await axios.post(`${base_url}/archiveTask/${id}`, {
        		archive: this.archive,
      		});
      		this.$router.back();
      		if (this.archive == 1) {
        		this.$notify({
          			title: "<b>Task</b> Archived!",
          			type: "warn",
        		});
      		} else {
        		this.$notify({
          			title: "<b>Task</b> Unarchived!",
          			type: "warn",
        		});
      		}
		},
    	async editTask() {
      		this.errors = [];
      		if (!this.project_id) {
        		this.errors["project_id"] = "Project Name is required";
      		}
      		if (!this.task) {
        		this.errors["task"] = "Task is required";
      		}
      		if (!this.description) {
        		this.errors["description"] = "Description is required";
      		}
      		if ( !this.errors["project_id"] && !this.errors["task"] && !this.errors["description"]) {
        		await axios.post(`${base_url}/task/${this.$route.params.id}`, {
					date: this.date,
					project_id: this.project_id,
					task: this.task,
					description: this.description,
					deadline: this.deadline,
					status: this.statusvalue,
        		});
        		this.$router.back();
        		this.$notify({
          			title: "<b>Task</b> updated successfully!",
          			type: "warn",
        		});
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
    	goBack() {
      		this.$router.back();
    	},
  	},
};
</script>

<style></style>
