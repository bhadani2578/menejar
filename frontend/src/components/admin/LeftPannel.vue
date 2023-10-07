<template>
  	<div class="left-sidebar">
	    <router-view></router-view>
	    <div class="logo-menu">
      		<div class="logo-div">
        		<div v-if="this.image == 'NULL'">{{ this.cname }}</div>
        		<div v-else>
          			<img :src="`${this.base_url}/static/${this.image}`" style="width: auto; height: auto" class="busines-upload-button" />
        		</div>
      		</div>
      		<div class="mainmenu">
        		<div class="mobilemenu-close">
          			<a href="javascript:void(0)"><img src="../../assets/images/close_white.png"/></a>
        		</div>
        		<ul v-if="this.type == 'admin'">
          			<li>
            			<router-link :to="{ name: 'dashboard' }"><img src="../../assets/images/menu.png" /> Dashboard</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'AttendanceList' }"><img src="../../assets/images/user.png" />Attendance</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'dashboard' }"><img src="../../assets/images/business-and-finance.png" />Reports</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'clients' }"><img src="../../assets/images/customer.png" />Clients</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'invoice' }"><img src="../../assets/images/check.png" /> Invoices</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'projects' }" ><img src="../../assets/images/layers.png" /> Projects</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'TaskList' }"><img src="../../assets/images/list.png" /> Tasks</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'TrackList' }"><img src="../../assets/images/sand-clock.png" />Track</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'StaffList' }"><img src="../../assets/images/staff.png" /> Staff</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'leave' }"><img src="../../assets/images/calendar-leave.png" />Leave</router-link>
          			</li>
					<li>
					  	<router-link :to="{ name: 'Timesheets' }"><img src="../../assets/images/calendar-leave.png" />Timesheets</router-link>
					</li>
          			<li>
						<router-link :to="{ name: 'business_setting' }" ><img src="../../assets/images/settings.png" /> Business Settings</router-link>
          			</li>
          			<li>
            			<a href="#" @click="logout"><img src="../../assets/images/logout.png" /> Logout</a>
        	  		</li>
        		</ul>
        		<div v-if="this.type == 'staff'">
          			<staff-pannel />
        		</div>
      		</div>
      		<div class="mobilemenu">
        		<a href="javascript:void(0)"><img src="../../assets/images/menubar.png"/></a>
      		</div>
    	</div>
  	</div>
</template>

<script>
const $ = require("jquery");
window.$ = $;

import base_url from "../../base_url.js";
import staffPannel from "../user/LeftPannel.vue";
import axios from "axios";

export default {
  	props: ["image", "cname"],
  	components: {
	    staffPannel,
  	},
  	data() {
	    return {
      		base_url: "",
      		type: "",
    	};
  	},
  	created() {
	    this.type = localStorage.getItem("type");
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
    	axios.post(`${base_url}/favicon`, {
        	headers: { token: localStorage.getItem("token") },
        	type: localStorage.getItem("type"),
      	}).then((res) => {
        	if (res.data !== "staff") {
          		const favicon = document.getElementById("favicon");
          		favicon.href = `${base_url}/static/${res.data.image}`;
        	}
      	});
  	},
  	methods: {
	    logout() {
      		localStorage.clear();
      		this.$store.state.user = "";
      		this.$router.go();
    	},
  	},
};
</script>
