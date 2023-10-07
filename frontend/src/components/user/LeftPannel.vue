<template>
  	<div class="left-sidebar">
    	<router-view></router-view>
    	<div class="logo-menu">
      		<div class="logo-div">
        		<div v-if="this.$store.state.cimage.image == 'NULL'">{{ this.$store.state.cimage.cname }}</div>
        		<div v-else>
          			<img :src="`${this.base_url}/static/${this.$store.state.cimage.image}`" :style="{ width: 'auto', height: 'auto' }" class="busines-upload-button" />
        		</div>
      		</div>
      		<div class="mainmenu">
        		<div class="mobilemenu-close">
          			<a href="javascript:void(0)"><img src="../../assets/images/close_white.png" /></a>
        		</div>
        		<ul>
          			<li>
            			<router-link :to="{ name: 'staff_dashboard' }">
							<img src="../../assets/images/menu.png" /> Dashboard
						</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'staff_dashboard' }"><img src="../../assets/images/user.png" />Attendance</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'StaffTrackList' }"><img src="../../assets/images/sand-clock.png" />Track</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'StaffTaskList' }"><img src="../../assets/images/list.png" /> Tasks</router-link>
          			</li>
					<li>
            			<router-link :to="{ name: 'staff_timesheet' }"><img src="../../assets/images/calendar-leave.png" />Time Sheet</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'staff_leave' }"><img src="../../assets/images/calendar-leave.png" />Leave</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'StaffProfile' }"><img :style="{ width: '25px' }" src="../../assets/images/profile.png" />Profile</router-link>
          			</li>
          			<li v-if="this.access == '1'" @click="admintoggle">
            			<a :style="{ color: '#ffffff' }">
              				<img :style="{ width: '25px' }" src="../../assets/images/administrator.png"/>Administrator
						</a>
          			</li>
          			<ul v-if="this.toggle == 'true'" :style="{ 'margin-top': '0px' }">
            			<li v-if="this.permissions.includes('AttendanceList')">
              				<router-link :to="{ name: 'AttendanceList' }">
								<img src="../../assets/images/user.png"/>Attendance
							</router-link>
            			</li>
            			<li v-if="this.permissions.includes('clients')">
              				<router-link :to="{ name: 'clients' }">
								<img src="../../assets/images/customer.png" />Clients
							</router-link>
            			</li>
            			<li v-if="this.permissions.includes('invoice')">
              				<router-link :to="{ name: 'invoice' }">
								<img src="../../assets/images/check.png" />Invoices
							</router-link>
            			</li>
            			<li v-if="this.permissions.includes('projects')">
              				<router-link :to="{ name: 'projects' }">
								<img src="../../assets/images/layers.png" />Projects
							</router-link>
            			</li>
            			<li v-if="this.permissions.includes('TrackList')">
              				<router-link :to="{ name: 'TrackList' }">
								<img src="../../assets/images/sand-clock.png"/>Track
							</router-link>
            			</li>
            			<li v-if="this.permissions.includes('StaffList')">
              				<router-link :to="{ name: 'StaffList' }">
								<img src="../../assets/images/staff.png" /> Staff
							</router-link>
            			</li>
            			<li v-if="this.permissions.includes('leave')">
              				<router-link :to="{ name: 'leave' }">
								<img src="../../assets/images/calendar-leave.png"/>Leave
							</router-link>
            			</li>
          			</ul>
          			<li>
            			<a href="#" @click="logout">
							<img src="../../assets/images/logout.png" /> Logout
						</a>
          			</li>
        		</ul>
      		</div>
      		<div class="mobilemenu">
        		<a href="javascript:void(0)"><img src="../../assets/images/menubar.png" /></a>
      		</div>
    	</div>
  	</div>
</template>

<script>
const $ = require("jquery");
window.$ = $;

import axios from "axios";
import base_url from "../../base_url.js";

export default {
  	data() {
	    return {
      		cname: "",
      		image: "",
      		base_url: "",
      		admin_id: "",
      		permissions: [],
      		toggle: "false",
      		access: "0",
    	};
  	},
  	created() {
    	const favicon = document.getElementById("favicon");
    	if (this.$store.state.cimage.length != 0) {
      		favicon.href = `${this.base_url}/static/${this.$store.state.cimage.image}`;
      		this.getPermissionMenu();
    	} else {
      		axios.post(`${base_url}/staff_image`, {
          		headers: { token: localStorage.getItem("token") },
        	}).then((res) => {
          		this.$store.state.cimage = res.data;
          		favicon.href = `${this.base_url}/static/${this.$store.state.cimage.image}`;
          		this.getPermissionMenu();
        	});
    	}
    	this.base_url = base_url;
    	$(document).ready(function () {
      		$(".mobilemenu a").click(function () {
    			$(".mainmenu").css("display", "block");
        		$(".mobilemenu-close a").css("display", "block");
        		$(".mobilemenu a").css("display", "none");
      		});
      		$(".mobilemenu-close a").click(function () {
        		$(".mainmenu").css("display", "none");
        		$(".mobilemenu a").css("display", "block");
        		$(".mobilemenu-close a").css("display", "none");
      		});
    	});
  	},
  	methods: {
	    logout() {
      		localStorage.clear();
      		this.$store.state.user = "";
      		this.$router.go();
    	},
    	async getPermissionMenu() {
      		await axios.post(`${base_url}/get_permission`, {
          		headers: { token: localStorage.getItem("token") },
          		type: localStorage.getItem("type"),
				staff_id: this.$store.state.user.staffid,
          		admin_id: this.$store.state.cimage.id,
       		}).then((res) => {
          		if (res.data !== "") {
            		this.permissions = JSON.parse(res.data.permission);
            		if (this.permissions.length > 0) {
              			this.access = "1";
            		}
          		}
        	});
    	},
    	async admintoggle() {
      		if (this.toggle == "false") {
        		this.toggle = "true";
      		} else {
        		this.toggle = "false";
      		}
    	},
  	},
};
</script>
