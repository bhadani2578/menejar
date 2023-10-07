<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname"/>
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="New Client" :name="this.$store.state.user.name" />
        		<staff-header v-else title="New Client"></staff-header>
      		</div>
      		<div class="content-page">
    			<div class="fullrow">
          			<div class="row">
            			<div class="col-12">
              				<div class="admin-new-client-form">
                				<div id="tabs">
                  					<div class="tab whiteborder">
                    					<input id="individual" type="radio" class="clientradio" v-model="data.client_type" @click="removeValue" value="Individual"/>
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
                          							<input type="email" name="email" v-model="data.email" placeholder="Email Address" required />
                          							<p v-if="errors.allreadyexist" style="color: red">{{ errors.allreadyexist }}</p>
                          							<p v-else style="color: red">{{ errors.email }}</p>
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="text" name="website" placeholder="Website URL" v-model="data.website" />
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="tel" name="phone" placeholder="Phone Number" v-model="data.phone" :class="[errors.phone ? 'invalid-class' : '']" />
                          							<!-- <p style="color: red">{{ errors.phone }}</p> -->
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="tel" name="fax" placeholder="Fax Number" v-model="data.fax" />
                        						</div>
                        						<div class="col-sm-12">
                          							<textarea name="address" rows="3" placeholder="Address" v-model="data.address" :class="[errors.address ? 'invalid-class' : '']" required></textarea>
                          							<!-- <p style="color: red">{{ errors.address }}</p> -->
                        						</div>
                        						<div class="col-sm-3">
                          							<input type="textr" name="pincode" placeholder="Postal Code" v-model="data.pincode" :class="[errors.pincode ? 'invalid-class' : '']" required />
                          							<!-- <p style="color: red">{{ errors.pincode }}</p> -->
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="text" name="city" placeholder="City" v-model="data.city" :class="[errors.city ? 'invalid-class' : '']" required />
                          							<!-- <p style="color: red">{{ errors.city }}</p> -->
                        						</div>
                        						<div class="col-sm-3">
                          							<input type="text" name="state" placeholder="State" v-model="data.state" :class="[errors.state ? 'invalid-class' : '']" required />
                          							<!-- <p style="color: red">{{ errors.state }}</p> -->
                        						</div>
                        						<div class="col-sm-6">	
                          							<select name="country" id="country" v-model="data.country" :class="[errors.country ? 'invalid-class' : '']" required>
                            							<option value="">Country</option>
                            							<option v-for="data in countries" :value="data.countryname" :key="data.countryname">{{ data.countryname }}</option>
                          							</select>
                          							<!-- <p style="color: red">{{ errors.country }}</p> -->
                        						</div>
                        						<div class="col-sm-6">
                          							<select name="currency" id="vurrency" v-model="data.currency" :class="[errors.currency ? 'invalid-class' : '']" required>
                            							<option value="">Currency</option>
                            							<option v-for="data in currencise" :value="data.code" :key="data.code">{{ data.code }}</option>
                          							</select>
                          							<!-- <p style="color: red">{{ errors.currency }}</p> -->
                        						</div>
                        						<div div class="col-sm-12">
                          							<input style="margin-bottom: 25px !important" type="text" name="taxno" placeholder="Tax Identification Number" v-model="data.taxno" />
                        						</div>
                        						<div class="col-sm-12">
                          							<textarea style="margin-bottom: 25px !important" name="notes" rows="3" placeholder="Notes" v-model="data.notes"></textarea>
                        						</div>													
                        						<div class="col-2">
                           							<input type="submit" class="yellow-button" value="Save" @click="addIndividual" />
                        						</div>
                        						<div class="col-8"></div>
                      						</div>
                    					</form>
                  					</div>
                  					<div class="tabContent" v-show="data.client_type === 'Organization'" >
                    					<form class="form-box" @submit.prevent method="post">
                      						<div class="row">
                        						<div class="col-sm-12">
                          							<input type="text" name="organization" placeholder="Organization Name" v-model="data.organization" :class="[errors.organization ? 'invalid-class' : '']" required />
                          							<p style="color: red">{{ errors.organization }}</p>
                        						</div>
                        						<div class="col-sm-12">
                          							<input type="text" name="name" placeholder="Name" v-model="data.name" required />
                          							<p style="color: red">{{ errors.name }}</p>
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="email" name="email" placeholder="Email Address" v-model="data.email" :class="[errors.email ? 'invalid-class' : '']" required />
													  <p v-if="errors.allreadyexist" style="color: red">{{ errors.allreadyexist }}</p>
                          							<p v-else style="color: red">{{ errors.email }}</p>
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="text" name="website" placeholder="Website URL" v-model="data.website" />
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="tel" name="phone" placeholder="Phone Number" v-model="data.phone" :class="[errors.phone ? 'invalid-class' : '']" />
                          							<!-- <p style="color: red">{{ errors.phone }}</p> -->
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="tel" name="fax" placeholder="Fax Number" v-model="data.fax" />
                        						</div>
                        						<div class="col-sm-12">
                          							<textarea rows="3" placeholder="Address" name="address" v-model="data.address" :class="[errors.address ? 'invalid-class' : '']" required ></textarea>
                          							<!-- <p style="color: red">{{ errors.address }}</p> -->
                        						</div>
                        						<div class="col-sm-3">
                          							<input type="text" name="pincode" placeholder="Postal Code" v-model="data.pincode" :class="[errors.pincode ? 'invalid-class' : '']" required />
                          							<!-- <p style="color: red">{{ errors.pincode }}</p> -->
                        						</div>
                        						<div class="col-sm-6">
                          							<input type="text" name="city" placeholder="City" v-model="data.city" :class="[errors.city ? 'invalid-class' : '']" required />
                          							<!-- <p style="color: red">{{ errors.city }}</p> -->
                        						</div>
                        						<div class="col-sm-3">
                          							<input type="text" name="state" placeholder="State" v-model="data.state" :class="[errors.state ? 'invalid-class' : '']" required />
                          							<p></p>
                        						</div>	
                        						<div class="col-sm-6">
                          							<select name="country" id="country" v-model="data.country" :class="[errors.country ? 'invalid-class' : '']" required>
                            							<option value="">Country</option>
                            							<option v-for="data in countries" :value="data.countryname" :key="data.countryname" >{{ data.countryname }}</option>
                          							</select>
                          							<!-- <p style="color: red">{{ errors.country }}</p> -->
                        						</div>
                        						<div class="col-sm-6">
                          							<select name="currency" id="vurrency" v-model="data.currency" :class="[errors.currency ? 'invalid-class' : '']" required>
                            							<option value="">Currency</option>
                            							<option v-for="data in currencise" :value="data.code" :key="data.code">{{ data.code }}</option>
                          							</select>
                          							<!-- <p style="color: red">{{ errors.currency }}</p> -->
                        						</div>
                        						<div class="col-sm-12">
                          							<input style="margin-bottom: 25px !important" type="text" name="taxno" placeholder="Tax Identification Number" v-model="data.taxno" />
                        						</div>
                        						<div class="col-sm-12">
                          							<textarea style="margin-bottom: 25px !important" rows="3" placeholder="Notes" name="notes" v-model="data.notes"></textarea>
                        						</div>
                        						<div class="col-2">
                          							<input type="submit" class="yellow-button" @click="addOrganization" value="Save" />
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

const $ = require("jquery");
window.$ = $;

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
        		currency: "INR",
        		taxno: "",
        		notes: "",
        		client_type: "Individual",
      		},
      		errors: [],
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
        	this.getCurrency(), this.getCountry();
        	if (this.$store.state.user.is_business == 1) {
          		this.$router.push("/create_client");
        	} else {
          		this.$router.push("/business_setting");
        	}
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
    	async addIndividual(e) {
      		e.preventDefault();
      		this.errors = [];
      		if (!this.data.name) {
        		this.errors["name"] = "Name is Required";
      		}
      		if (!this.data.email) {
        		this.errors["email"] = "Email is Required";
      		} else if (!this.validEmail(this.data.email)) {
        		this.errors["email"] = "Please enter valid email address";
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
        	// 	this.errors["pincode"] = "Postal Code is Required";
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
      		// if ( !this.errors["name"] && !this.errors["email"] && !this.errors["phone"] && !this.errors["address"] && !this.errors["pincode"] && !this.errors["city"] && !this.errors["country"] && !this.errors["currency"] ) {
				if ( !this.errors["name"] && !this.errors["email"] ) {
        		await axios.post(`${base_url}/add_individual`, {
            		name: this.data.name,
            		client_type: this.data.client_type,
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
            		admin_id: this.$store.state.user.id,
          		}).then((res) => {
            		if (res.data == "Client successfully add") {
              			this.$router.push({ name: "clients" });
              			this.$notify({
                			title: "<b>Client</b> added successfully!",
                			type: "warn",
              			});
            		}
            		if (res.data == "Email allready exists") {
              			this.errors["allreadyexist"] = "Email allready exists";
              			$(window).scrollTop(0);
            		}
          		});
      		}
    	},
    	async addOrganization(e) {
      		e.preventDefault();
      		this.errors = [];
      		if (!this.data.name) {
        		this.errors["name"] = "Name is Required";
      		}
      		if (!this.data.organization) {
        		this.errors["organization"] = "Organization Name is Required";
      		}
      		if (!this.data.email) {
        		this.errors["email"] = "Email is Required";
      		} else if (!this.validEmail(this.data.email)) {
        		this.errors["email"] = "Please enter valid email address";
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
      		// if ( !this.errors["name"] && !this.errors["organization"] && !this.errors["email"] && !this.errors["phone"] && !this.errors["address"] && !this.errors["pincode"] && !this.errors["city"] && !this.errors["country"] && !this.errors["currency"] ) {
				if ( !this.errors["name"] && !this.errors["organization"] && !this.errors["email"]) {
        		await axios.post(`${base_url}/add_individual`, {
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
            		admin_id: this.$store.state.user.id,
          		}).then((res) => {
            		if (res.data == "Client successfully add") {
              			this.$router.push({ name: "clients" });
              			this.$notify({
                			title: "<b>Client</b> added successfully!",
                			type: "warn",
              			});
            		}
            		if (res.data == "Email allready exists") {
              			this.errors["allreadyexist"] = "Email allready exists";
              			$(window).scrollTop(0);
            		}
          		});
      		}
    	},
    	removeValue() {
      		this.errors = [];
      		this.data.name = "";
      		this.data.organization = "";
      		this.data.phone = "";
      		this.data.email = "";
      		this.data.website = "";
      		this.data.fax = "";
      		this.data.address = "";
      		this.data.pincode = "";
      		this.data.city = "";
      		this.data.state = "";
      		this.data.country = "";
      		this.data.currency = "";
      		this.data.taxno = "";
      		this.data.notes = "";
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
