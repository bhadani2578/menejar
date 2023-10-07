<template>
  	<div class="left-title">
    	<h1>{{ title }}</h1>
  	</div>
  	<a class="staff-timer-div" @click="timerstarting" v-if="startTracker" v-bind:style="{'padding': '4px 0','text-decoration': 'none','color': 'inherit',}">
    	<p>
      		<span class="staf-timing">
				<a v-bind:style="{'text-decoration': 'none','color': 'inherit'}">
					<img src="../../assets/images/timer.png" />Tracker
				</a>
			</span>
    	</p>
  	</a>
  	<a class="staff-timer-div" @click="stopTracking" v-if="stopTracker" v-bind:style="{'padding': '4px 0','text-decoration': 'none','color': 'inherit'}">
    	<p>
      		<span class="staf-timing">
				<a>
					<img src="../../assets/images/timer.png" />{{formattedElapsedTime}}
				</a>
			</span>
    	</p>
  	</a>
  	<div class="staff-checkinout-div">
	    <label class="round_ckbox" for="staff_check_in">
      		<input type="checkbox" id="staff_check_in" v-model="data.is_checkin" @change="checkIn" value="checkin" />
      		<span class="checkmark"></span>Check In
    	</label>
    	<label class="round_ckbox" for="staff_check_out">
			<input type="checkbox" id="staff_check_out" v-model="data.is_checkout" @change="checkOut" value="checkout" />
			<span class="checkmark"></span>Check Out
		</label>
  	</div>
  	<startTracking v-if="showstartTracker">
	    <div id="popup1" class="popup-container">
      		<div class="popup-content">
        		<a href="#" class="close" @click="closepopup">&times;</a>
        		<div class="start-tracking-body" id="">
          			<h3>Start Tracking</h3>
        			<div class="start-track-form">
            			<form @submit.prevent>
              				<select name="Select_Project" id="Select-Project" v-model="projectid">
                				<option value="" selected>Project Name</option>
                				<option v-for="data in projectnames" :value="data.id" :key="data.id">
                  					{{ data.project_name }}
                				</option>
              				</select>
              				<p></p>
              				<textarea name="Task" rows="3" placeholder="Task" v-model="task"></textarea>
              				<p></p>
              				<input v-if="this.task && this.projectid" type="submit" value="Start" name="start_button" @click.once="start" />
            			</form>
          			</div>
        		</div>
      		</div>
    	</div>
  	</startTracking>
  	<stopTracking v-if="showstopTracker">
    	<div id="popup2" class="popup-container popup-style-2">
    		<div class="popup-content">
    			<a href="#" class="close">&times;</a>
    			<div class="start-tracking-body" id="">
      				<h3>Stop Tracking</h3>
      				<div class="start-track-form">
        				<form @submit.prevent>
          					<select name="occa-design" id="OCCA-Design" v-model="projectid">
            					<option v-for="data in projectnames" :value="data.id" :key="data.id">
              						{{ data.project_name }}
            					</option>
          					</select>
          					<p></p>
          					<textarea name="Task" rows="3" v-model="task" v-bind:style="{'margin-top': '20px'}"></textarea>
          					<p></p>
          					<h2 class="popup-total-time">Time: {{ formattedElapsedTime }}</h2>
          					<p></p>
          					<input v-if="this.task && this.projectid" type="submit" value="Stop" name="start_button" @click.once="stop" />
        				</form>
      				</div>
    			</div>
    		</div>
    	</div>
  	</stopTracking>
  	<div class="right-admindetail">
    	<p>
    		<span>{{ matches.toUpperCase() }}</span>
    	</p>
  	</div>
</template>

<script>
import axios from "axios";
import startTracking from "./startTracking.vue";
import stopTracking from "./stopTracking.vue";
import base_url from "../../base_url.js";
import moment from "moment";

const $ = require("jquery");
window.$ = $;

export default {
  	components: { startTracking, stopTracking },
  	props: ["title"],
  	data() {
	    return {
      		data: {
        		is_checkin: "false",
        		is_checkout: "false",
        		checkin: "",
        		checkout: "",
        		hours: "",
        		date: new Date().toISOString().substr(0, 10),
        		isCheckout: "No",
      		},
      		startTracker: true,
      		stopTracker: false,
      		showstartTracker: false,
      		showstopTracker: false,
      		projectid: "",
      		project_name: "",
      		projectnames: [],
      		task: "",
      		end: "",
      		timer: undefined,
      		starttime: 0,
      		now_time: 0,
      		temptime: 0,
      		totalSeconds: 0,
      		timerbeforecheckout: true,
      		checkoutyes: "",
      		matches: "",
    	};
  	},
  	computed: {
    	formattedElapsedTime() {
      		const sec = parseInt(this.totalSeconds, 10);
      		let hours = Math.floor(sec / 3600);
      		let minutes = Math.floor((sec - hours * 3600) / 60);
      		let seconds = sec - hours * 3600 - minutes * 60;
      		if (hours < 10) {
        		hours = "0" + hours;
      		}
      		if (minutes < 10) {
        		minutes = "0" + minutes;
      		}
      		if (seconds < 10) {
        		seconds = "0" + seconds;
      		}
      		return hours + ":" + minutes + ":" + seconds;
    	},
  	},
  	created() {
	    document.title = this.title;
    	axios.post(`${base_url}/get_staff`, {
        	headers: { token: localStorage.getItem("token") },
      	}).then((res) => {
        	this.$store.state.user = res.data.user;
        	this.matches = this.$store.state.user.name.match(/\b(\w)/g).join("");
        	this.checkBox(), this.checkTime();
      	});
  	},
  	methods: {
	    //check box value control
	    async checkBox() {
      		if (this.$store.state.checkbox.length != 0) {
        		this.checkoutyes = this.$store.state.checkbox.isCheckout;
        		if (this.$store.state.checkbox.isCheckout == "Yes") {
          			this.data.is_checkin = "true";
          			this.data.is_checkout = "true";
        		} else if ( this.$store.state.checkbox.isCheckout == "No" && this.$store.state.checkbox.date !== "") {
          			this.data.is_checkin = "true";
        		} else {
          			this.data.is_checkin = "false";
          			this.data.is_checkout = "false";
        		}
      		} else {
        		await axios.post(`${base_url}/checkbox`, {
            		date: this.data.date,
            		staffid: this.$store.state.user.staffid,
          		}).then((res) => {
            		this.$store.state.checkbox = res.data[0];
            		this.checkoutyes = this.$store.state.checkbox.isCheckout;
            		if (this.$store.state.checkbox.isCheckout == "Yes") {
              			this.data.is_checkin = "true";
              			this.data.is_checkout = "true";
            		} else if ( this.$store.state.checkbox.isCheckout == "No" && this.$store.state.checkbox.date !== "") {
            			this.data.is_checkin = "true";
            		} else {
              			this.data.is_checkin = "false";
              			this.data.is_checkout = "false";
            		}
          		});
      		}
    	},
    	//staff check in
    	async checkIn() {
      		var curr_time = new Date();
      		const time = curr_time.getHours() + ":" + curr_time.getMinutes() + ":" + curr_time.getSeconds();
			this.data.checkin = time;		
      		this.data.is_checkin = "true";
      		await axios.post(`${base_url}/checkin`, {
          		date: this.data.date,
          		staffid: this.$store.state.user.staffid,
          		admin_id: this.$store.state.user.id,
          		checkin: this.data.checkin,
          		isCheckout: this.data.isCheckout,
        	}).then((res) => {
          		if (res.data == "Allready Checkin") {
            		alert("Allready Checkin");
            		this.data.is_checkin = "true";
          		} else {
            		this.data.is_checkin = "true";
            		this.$router.go();
          		}
        	});
    	},
    	//staff checkout
    	async checkOut() {
      		if (this.data.checkin == "" && this.data.is_checkin == "") {
        		alert("Checked In is Required");
        		this.data.is_checkin = "";
        		this.data.is_checkout = "false";
      		}
      		if (this.data.hours == "" && this.data.is_checkin == "false") {
        		alert("Checked In is Required");
        		this.data.is_checkin = "";
        		this.data.is_checkout = "false";
      		}
      		if (this.timerbeforecheckout == false) {
        		alert("Close the Tracker first");
        		this.data.is_checkin = "true";
        		this.data.is_checkout = "false";
      		}
      		if (this.data.is_checkin == "true" && this.timerbeforecheckout == true) {
        		var curr_time = new Date();
        		const time = curr_time.getHours() + ":" + curr_time.getMinutes() + ":" + curr_time.getSeconds();
        		this.data.checkout = time;
        		this.data.isCheckout = "Yes";
        		await axios.post(`${base_url}/checkout`, {
            		date: this.data.date,
            		staffid: this.$store.state.user.staffid,
            		checkin: this.data.checkin,
            		checkout: this.data.checkout,
            		isCheckout: this.data.isCheckout,
          		}).then((res) => {
            		if (res.data == "Allready Checkout") {
              			alert("Allready Checkout");
              			this.data.is_checkin = "true";
              			this.data.is_checkout = "true";
            		} else {
              			this.data.is_checkout = "true";
              			this.$router.go();
            		}
          		});
      		}
    	},
    	async checkTime() {
      		if (this.$store.state.checktime.length != 0) {
        		if (this.$store.state.checktime.end == "00:00:00") {
          			this.stopTracking();
          			this.timerbeforecheckout = false;
          			this.stopTracker = true;
          			this.startTracker = false;
          			this.starttime = this.$store.state.checktime.start;
          			this.now_time = (new Date().getHours() +":" +new Date().getMinutes() +":" +new Date().getSeconds()).toString();
          			var now_time = moment(this.now_time, "HH:mm:ss");
          			var starttime = moment(this.starttime, "HH:mm:ss");
          			var hrs = moment.utc(now_time.diff(starttime)).format("HH");
          			var min = moment.utc(now_time.diff(starttime)).format("mm");
          			var sec = moment.utc(now_time.diff(starttime)).format("ss");
          			this.temptime = [hrs, min, sec].join(":");
          			const hms = this.temptime;
          			const [hr, mt, s] = hms.split(":");
          			this.totalSeconds = +hr * 60 * 60 + +mt * 60 + +s;
          			setInterval(() => {
            			this.totalSeconds += 1;
          			}, 1000);
        		} else {
          			this.startTracker = true;
        		}
      		} else {
        		await axios.post(`${base_url}/checktime`, {
            		staffid: this.$store.state.user.staffid,
          		}).then((res) => {
            		this.$store.state.checktime = res.data[0];
            		if (this.$store.state.checktime.end == "00:00:00") {
              			this.stopTracking();
              			this.timerbeforecheckout = false;
              			this.stopTracker = true;
              			this.startTracker = false;
              			this.starttime = this.$store.state.checktime.start;
              			this.now_time = ( new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()).toString();
              			var now_time = moment(this.now_time, "HH:mm:ss");
              			var starttime = moment(this.starttime, "HH:mm:ss");
              			var hrs = moment.utc(now_time.diff(starttime)).format("HH");
              			var min = moment.utc(now_time.diff(starttime)).format("mm");
              			var sec = moment.utc(now_time.diff(starttime)).format("ss");
              			this.temptime = [hrs, min, sec].join(":");
              			const hms = this.temptime;
              			const [hr, mt, s] = hms.split(":");
              			this.totalSeconds = +hr * 60 * 60 + +mt * 60 + +s;
              			setInterval(() => {
                			this.totalSeconds += 1;
              			}, 1000);
            		} else {
              			this.startTracker = true;
            		}	
          		});
      		}
    	},
    	timerstarting() {
      		if (this.data.is_checkin == "false" && this.data.is_checkout == "false") {
        		alert("Checkin is required");
      		}
      		if (this.data.is_checkin == "true" && this.data.is_checkout == "false") {
        		$("a").attr("href", "#popup1");
        		this.startTracking();
      		}
      		if (this.checkoutyes == "Yes") {
        		alert("Checkout done");
      		}
    	},
    	startTracking() {
      		this.projectid = "";
      		this.task = "";
      		this.showstartTracker = true;
      		this.getProjectName();
    	},
    	async stopTracking() {
      		$(".staff-timer-div").attr("href", "#popup2");
      		this.getProjectName();
      		try {
        		const response = await axios.post(`${base_url}/getlasttrack`, {staffid: this.$store.state.user.staffid});
        		this.task = response.data.task;
        		this.projectid = response.data.projectid;
      		} catch (err) {
        		console.log(err);
      		}
      		this.showstopTracker = true;
    	},
    	async getProjectName() {
      		try {
        		// const response = await axios.get(`${base_url}/projectsforstaff/${this.$store.state.user.id}`);
        		// this.projectnames = response.data;
				const response = await axios.get(`${base_url}/staffassignedprojects/${this.$store.state.user.staffid}`);
      		this.projectnames = response.data;
      		} catch (err) {
        		console.log(err);
      		}
    	},
    	async start() {
      		await axios.post(`${base_url}/addstafftrack`, {
          		staffid: this.$store.state.user.staffid,
          		projectid: this.projectid,
          		date: new Date().toISOString().substr(0, 10),
          		start: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
          		end: this.end,
          		task: this.task,
          		time: "00:00:00",
          		admin_id: this.$store.state.user.id,
        	}).then((res) => {
          		console.log(res);
          		this.showstartTracker = false;
          		this.startTracker = false;
          		this.stopTracker = true;
          		this.$router.go();
        	});
    	},
    	async stop() {
      		await axios.post(`${base_url}/lasttrackupdate/${this.$store.state.user.staffid}`,
    		{
          		staffid: this.$store.state.user.staffid,
          		projectid: this.projectid,
          		date: new Date().toISOString().substr(0, 10),
          		start: this.starttime,
          		end: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
          		end1: new Date().toISOString().substr(0, 10) + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
          		task: this.task,
          		admin_id: this.$store.state.user.id,
        	});
      		this.showstopTracker = false;
      		this.stopTracker = false;
      		this.startTracker = true;
      		this.$router.go();
    	},
    	closepopup() {
      		this.showstartTracker = false;
      		this.showstopTracker = false;
    	},
  	},
};
</script>
