<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname"/>
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Edit Client" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Edit Client"></staff-header>
      		</div>
      		<div class='loaderbox'  v-if="!this.data.id">
        	    <img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
        	</div>
      		<div class="content-page">
	    	    <div class="fullrow">
    		      	<div class="row">
        	    		<div class="col-md-4">
        	      			<div class="back-button-setup">
        	        			<router-link :to="{ name: 'clients' }"><img src="../../assets/images/back-left-arrow.png" alt="&laquo;" />Back</router-link>
        	      			</div>
        	    		</div>
        	    		<div class="col-12">
        	      			<div class="admin-new-client-form">
        	        			<div id="tabs">
        	          				<div class="tab whiteborder">
        	            				<input id="individual" type="radio" class="clientradio" v-model="data.client_type" @click="removeValue" value="Individual" />
										<label for="individual">Individual</label>
        	          				</div>
        	          				<div class="tab">
        	            				<input id="organization" type="radio" class="clientradio" v-model="data.client_type" @click="removeValue" value="Organization" />
        	            				<label for="organization">Organization</label>
        	          				</div>
        	          				<div class="tabContent" v-show="data.client_type === 'Individual'" >
        	            				<form class="form-box" @submit.prevent method="post">
        	              					<div class="row">
        	                					<div class="col-sm-12">
													<input type="text" name="name" placeholder="Name" v-model="data.name" required />
        	                  						<p style="color: red">{{ errors.name }}</p>
        	                					</div>
        	                					<div class="col-sm-6">
													<input readonly type="email" name="email" v-model="data.email" placeholder="Email Address" />
        	                  						<p></p>
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="text" name="website" placeholder="Website URL" v-model="data.website" />
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="tel" name="phone" placeholder="Phone Number" v-model="data.phone" />
        	                  						<!-- <p style="color: red">{{ errors.phone }}</p> -->
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="tel" name="fax" placeholder="Fax Number" v-model="data.fax" />
        	                					</div>
        	                					<div class="col-sm-12">
        	                  						<textarea name="address" rows="3" placeholder="Address" v-model="data.address" required ></textarea>
        	                  						<!-- <p style="color: red">{{ errors.address }}</p> -->
        	                					</div>
        	                					<div class="col-sm-3">
        	                  						<input type="text" name="pincode" placeholder="Postal Code" v-model="data.pincode" required />
        	                  						<!-- <p style="color: red">{{ errors.pincode }}</p> -->
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="text" name="city" placeholder="City" v-model="data.city" required />
        	                  						<!-- <p style="color: red">{{ errors.city }}</p> -->
        	                					</div>
        	                					<div class="col-sm-3">
        	                  						<input type="text" name="state" placeholder="State" v-model="data.state" />
        	                  						<p></p>
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<select name="country" id="country" v-model="data.country" required >
        	                    						<option value="">Country</option>
        	                    						<option v-for="data in countries" :value="data.countryname" :key="data.countryname" >{{ data.countryname }}</option>
        	                  						</select>
        	                  						<!-- <p style="color: red">{{ errors.country }}</p> -->
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<select name="currency" id="vurrency" v-model="data.currency" required >
        	                    						<option value="">Currency</option>
        	                    						<option v-for="data in currencise" :value="data.code" :key="data.code" >{{ data.code }}</option>
        	                  						</select>
        	                  						<!-- <p style="color: red">{{ errors.currency }}</p> -->
        	                					</div>
        	                					<div div class="col-sm-12">
        	                  						<input style="margin-bottom: 25px !important" type="text" name="taxno" placeholder="Tax Identification Number" v-model="data.taxno" />
        	                					</div>
        	                					<div class="col-sm-12">
        	                  						<textarea style="margin-bottom: 25px !important" name="notes" rows="3" placeholder="Notes" v-model="data.notes" ></textarea>
        	                					</div>
        	                					<div class="col-12">
        	                  						<label for="permission" style="font-size: 18px;line-height: 21px;font-weight: bold; ">Projects</label>
        	                					</div>
        	                					<p></p>
        	                					<tr v-for="data in data.projects" :key="data.id">
        	                  						<td>{{ data.project_name }}</td>
        	                  						<input type="checkbox" v-model="checked" :value="data.id" />
        	                					</tr>
        	                					<p></p>
        	                					<div class="col-2">
        	                  						<input type="submit" class="yellow-button" value="Save" @click="updateClients" />
        	                					</div>
        	                					<div class="col-8"></div>
        	              					</div>
        	            				</form>
        	          				</div>
        	          				<div class="tabContent" v-show="data.client_type === 'Organization'" >
        	            				<form class="form-box" @submit.prevent method="post">
        	              					<div class="row">
        	                					<div class="col-sm-12">
        	                  						<input type="text"	 name="organization" placeholder="Organization Name" v-model="data.organization" required />
        	                  						<p style="color: red">{{ errors.organization }}</p>
        	                					</div>
        	                					<div class="col-sm-12">
        	                  						<input type="text" name="name" placeholder="Name" v-model="data.name" required />
        	                  						<p style="color: red">{{ errors.name }}</p>
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input readonly type="email" name="email" placeholder="Email Address" v-model="data.email" />
        	                  						<p></p>
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="text" name="website" placeholder="Website URL" v-model="data.website" />
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="tel" name="phone" placeholder="Phone Number" v-model="data.phone" />
        	                  						<!-- <p style="color: red"> {{ errors.phone }} </p> -->
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="tel" name="fax" placeholder="Fax Number" v-model="data.fax" />
        	                					</div>
        	                					<div class="col-sm-12">
        	                  						<textarea rows="3" placeholder="Address" name="address" v-model="data.address" required ></textarea>
        	                  						<!-- <p style="color: red">{{ errors.address }}</p> -->
        	                					</div>
        	                					<div class="col-sm-3">
        	                  						<input type="text" name="pincode" placeholder="Postal Code" v-model="data.pincode" required />
        	                  						<!-- <p style="color: red">{{ errors.pincode }}</p> -->
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<input type="text" name="city" placeholder="City" v-model="data.city" required />
        	                  						<!-- <p style="color: red"> {{ errors.city }} </p> -->
												</div>
        	                					<div class="col-sm-3">
        	                  						<input type="text" name="state" placeholder="State" v-model="data.state" />
        	                  						<p></p>
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<select name="country" id="country" v-model="data.country" required >
        	                    						<option value="">Country</option>
        	                    						<option v-for="data in countries" :value="data.countryname" :key="data.countryname" >{{ data.countryname }}</option>
        	                  						</select>
        	                  						<!-- <p style="color: red">{{ errors.country }}</p> -->
        	                					</div>
        	                					<div class="col-sm-6">
        	                  						<select name="currency" id="vurrency" v-model="data.currency" required >
        	                    						<option value="">Currency</option>
        	                    						<option v-for="data in currencise" :value="data.code" :key="data.code" >{{ data.code }}</option>
        	                  						</select>
        	                  						<!-- <p style="color: red">{{ errors.currency }}</p> -->
        	                					</div>
        	                					<div class="col-sm-12">
        	                  						<input style="margin-bottom: 25px !important" type="text" name="taxno" placeholder="Tax Identification Number" v-model="data.taxno" />
        	                					</div>
        	                					<div class="col-sm-12">
        	                  						<textarea style="margin-bottom: 25px !important" rows="3" placeholder="Notes" name="notes" v-model="data.notes" ></textarea>
        	                					</div>
        	                					<div class="col-12">
        	                  						<label for="permission" style=" font-size: 18px; line-height: 21px; font-weight: bold;">Projects</label>
        	                					</div>
        	                					<p></p>
        	                					<tr v-for="data in data.projects" :key="data.id">
        	                  						<td>{{ data.project_name }}</td>
        	                  						<input type="checkbox" v-model="checked" :value="data.id" />
        	                					</tr>
        	                					<p></p>
        	                					<div class="col-2">
        	                  						<input type="submit" class="yellow-button" @click="updateClients" value="Save" />
        	                					</div>
        	                					<div class="col-8"></div>
        	              					</div>
        	            				</form>
        	          				</div>
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
import generator from "generate-password";
const bcrypt = require("bcryptjs");

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
      		currencise: [],
      		currency: 0,
      		countries: [],
      		country: 0,
      		data: {
        		name: "",
        		email: "",
        		website: "",
        		organization: "",
        		phone: "",
        		fax: "",
        		address: "",
        		pincode: "",
        		city: "",
        		state: "",
        		country: "India",
        		currency: "",
        		taxno: "",
        		notes: "",
        		client_type: "Individual",
        		id: "",
        		projects: [],
        		is_status: "",
      		},
      		errors: [],
      		checked: [],
    	};
  	},
  	beforeRouteEnter(to, from, next) {
    	if (localStorage.getItem("type") == "staff") {
      		if (localStorage.getItem("permission").includes("clients")) {
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
        	this.getClientById(), this.getCurrency(), this.getCountry();
      	});
  	},
  	methods: {
    	async getCurrency() {
    	  	const response = await axios.get(`${base_url}/currency`);
    	  	this.currencise = response.data;
    	},
    	async getCountry() {
      		const response = await axios.get(`${base_url}/country`);
      		this.countries = response.data;
    	},
    	async getClientById() {
      		const response = await axios.get(`${base_url}/clients/${this.$route.params.id}`);
      		this.data.name = response.data.name;
      		this.data.client_type = response.data.client_type;
      		this.data.organization = response.data.organization;
      		this.data.phone = response.data.phone;
      		this.data.email = response.data.email;
      		this.data.website = response.data.website;
      		this.data.fax = response.data.fax;
      		this.data.address = response.data.address;
      		this.data.pincode = response.data.pincode;
      		this.data.city = response.data.city;
      		this.data.state = response.data.state;
      		this.data.country = response.data.country;
      		this.data.currency = response.data.currency;
      		this.data.taxno = response.data.taxno;
      		this.data.notes = response.data.notes;
      		this.data.id = response.data.id;
      		this.data.is_status = response.data.is_status;
      		const res = await axios.get(`${base_url}/clientprojects/${this.data.id}`);
      		this.data.projects = res.data;
      		console.log(res);
      		await axios.post(`${base_url}/clientprojectsvalue`, {
          		client_id: this.data.id,
          		admin_id: this.$store.state.user.id,
        	}).then((result) => {
          		this.checked = result.data.projects.split(",");
        	});
    	},
    	async updateClients() {
      		this.errors = [];
      		if (!this.data.name) {
        		this.errors["name"] = "Name is Required";
      		}
      		if (this.data.client_type == "Organization") {
      		  	if (!this.data.organization) {
      		    	this.errors["organization"] = "Organization Name is Required";
      		  	}
      		}
      		if (!this.data.email) {
        		this.errors["email"] = "Email is Required";
      		} else if (!this.validEmail(this.data.email)) {
        		this.errors.push("Valid email required.");
      		}
      		// if (this.data.phone.length > 1) {
        	// 	if (!this.validPhone(this.data.phone)) {
          	// 		this.errors["phone"] = "Please enter valid Phone number";
        	// 	}
      		// }
      		// if (!this.data.address) {
        	// 	this.errors["address"] = "Address is Required";
      		// }
      		// if (!this.data.pincode) {
        	// 	this.errors["pincode"] = "Pincode is Required";
      		// }
      		// if (!this.data.city) {
        	// 	this.errors["city"] = "City is Required";
      		// }
      		// if (!this.data.country) {
        	// 	this.errors["country"] = "Country is Required";
      		// }
      		// if (!this.data.currency) {
        	// 	this.errors["currency"] = "Currency is Required";
      		// }
      		// if ( !this.errors["name"] && !this.errors["organization"] && !this.errors["email"] && !this.errors["phone"] && !this.errors["address"] && !this.errors["pincode"] && !this.errors["city"] && !this.errors["country"] && !this.errors["currency"]) {
				if ( !this.errors["name"] && !this.errors["organization"] && !this.errors["email"]) {
        		await axios.post(`${base_url}/clients/${this.data.id}`, {
            		name: this.data.name,
            		client_type: this.data.client_type,
            		organization: this.data.organization,
            		phone: this.data.phone,
            		email: this.data.email,
            		website: this.data.website,
            		fax: this.data.fax,
            		address: this.data.address,
            		pincode: this.data.pincode,
            		city: this.data.city,
            		state: this.data.state,
            		country: this.data.country,
            		currency: this.data.currency,
            		taxno: this.data.taxno,
            		notes: this.data.notes,
          		}).then((res) => {
            		this.errors.push(res.data);
            		if (res.data == "Clients updated") {
              			this.$router.push({ name: "clients" });
              			this.$notify({ title: "<b>Client</b> edited successfully!", type: "warn",});
            		}
          		});
        		var password = generator.generate({ length: 8, numbers: true, lowercase: true, uppecase: true, symbols: true, });
        		var temp = this.checked.length;
        		if (this.checked.length > 0 || temp != this.checked.length) {
          			var salt = bcrypt.genSaltSync(10);
          			await axios.post(`${base_url}/checkedprojects`, {
            			projects: this.checked.join(),
            			client_id: this.data.id,
            			email: this.data.email,
            			admin_id: this.$store.state.user.id,
            			password: password,
            			bpassword: bcrypt.hashSync(password, salt),
            			is_status: this.data.is_status,
            			admin_name: this.$store.state.user.name,
            			image: this.$store.state.user.image,
            			name: this.data.name,
          			});
        		}
      		}
    	},
    	validEmail: function (email) {
      		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      		return re.test(email);
    	},
    	validPhone: function (mobile) {
      		var phone = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      		return phone.test(mobile);
    	},
  	},
};
</script>
