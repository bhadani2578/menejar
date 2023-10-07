<template>
  	<div class="left-sidebar">
    	<router-view></router-view>
    	<div class="logo-menu">
      		<div class="logo-div">
        		<div v-if="this.$store.state.cimage.image == 'NULL'">{{ this.$store.state.cimage.cname }}</div>
        		<div v-else>
          			<img :src="`${this.base_url}/static/${this.$store.state.cimage.image}`" style="width: auto; height: auto" class="busines-upload-button" />
        		</div>
      		</div>
      		<div class="mainmenu">
        		<div class="mobilemenu-close">
          			<a href="javascript:void(0)"><img src="../../assets/images/close_white.png" /></a>
        		</div>
        		<ul>
          			<li>
            			<router-link :to="{ name: 'client_projects' }">
							<img src="../../assets/images/layers.png" />Projects
						</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'client_task' }">
							<img src="../../assets/images/list.png" /> Tasks
						</router-link>
          			</li>
          			<li>
            			<router-link :to="{ name: 'client_profile' }">
							<img style="width: 25px" src="../../assets/images/profile.png" />Profile
						</router-link>
          			</li>
        			<li>
            			<a href="#" @click="logout"><img src="../../assets/images/logout.png" /> Logout</a>
          			</li>
        		</ul>
      		</div>
      		<div class="mobilemenu">
        		<a href="javascript:void(0)">
					<img src="../../assets/images/menubar.png"/>
				</a>
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
    	};
  	},
  	created() {
	    this.base_url = base_url;
    	axios.post(`${base_url}/client_image`, {
        	headers: { token: localStorage.getItem("token") },
      	}).then((res) => {
        	this.$store.state.cimage = res.data;
        	const favicon = document.getElementById("favicon");
        	favicon.href = `${this.base_url}/static/${this.$store.state.cimage.image}`;
      	});
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
  	},
};
</script>
