<template>
  	<div class="panelbox">
    	<LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="New Invoice" :name="this.$store.state.user.name" />
        		<staff-header v-else title="New Invoice"></staff-header>
      		</div>
      		<div class="content-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-12">
              				<div class="newinvoice-section1">
                				<form class="form-box" @submit.prevent>
                  					<input type="text" name="invoice_no" placeholder="Invoice No." v-model="formData.invoice_no" />
                  					<select name="currency" id="currency" v-model="formData.clientCurrency">
                    					<option value="0">Currency</option>
                    					<option v-for="data in currencise" :value="data.code" :key="data.code">{{ data.code }}</option>
                  					</select>
                				</form>
              				</div>
            			</div>
          			</div>
          			<div class="newinvoice-section2">
            			<div class="row">
              				<div class="col-6 newinvoice-section2-left">
                				<div class="newinvoice-titles"><strong>From</strong></div>
                				<div class="newinvoice-name">{{ $store.state.user.cname }} <br />{{ $store.state.user.address }}
                  					<br />
                  					{{ formData.useraddress2 }}, {{ $store.state.user.country }}
                  					<br />
                  					<span v-if="$store.state.user.taxname_one &&$store.state.user.taxname_one">
                    					{{ $store.state.user.taxname_one }}:{{$store.state.user.taxno_one}}
									</span>
                  					<br />
                  					<span v-if="$store.state.user.taxname_two &&$store.state.user.taxname_two">
                    					{{ $store.state.user.taxname_two }}:{{$store.state.user.taxno_two}}
									</span>
                				</div>
                				<div class="row">
                  					<div class="col-6">
                    					<div class="newinvoice-titles"><strong>To</strong></div>
                  					</div>
                  					<div class="col-6">
                    					<div class="newclient-button">
                      						<router-link to="create_client">New Client</router-link>
                    					</div>
                  					</div>
                				</div>
                				<div>
                  					<select name="currency" v-model="formData.client" @change="myFunction($event.target.value)">
                    					<option value="" selected>Select Client</option>
                    					<option v-for="data in clients" :value="data.id" :key="data.id">{{ data.organization }}{{ data.name }}</option>
                  					</select>
                				</div>
              				</div>
              				<div class="col-6 newinvoice-section2-right">
                				<div class="newinvoice-titles"><strong>Date</strong></div>
                				<div>
                  					<input type="date" name="date" v-model="formData.date" />
                				</div>
                				<div class="newinvoice-due-dateset">
                  					<div class="newinvoice-titles"><strong>Due Date</strong></div>
                  					<input type="date" name="date" v-model="formData.due_date" />
                				</div>
              				</div>
            			</div>
          			</div>
          			<div class="newinvoice-section3">
            			<div class="newinvoice-data-titles">
              				<div class="row">
                				<div class="col-5"><h3>Description</h3></div>
                				<div class="col-2"><h3>Quantity</h3></div>
                				<div class="col-2"><h3>Rate</h3></div>
                				<div class="col-2"><h3>Amount</h3></div>
                				<div class="col-1"></div>
              				</div>
              				<div class="newinvoice-data-list">
                				<div class="row newinvoice-data-single" v-for="(invoice_product, k) in invoice_products" :key="k">
                  					<div class="col-5">
                    					<div class="item-desc-name">
                      						<textarea style="height: 50px" rows="1" v-model="invoice_product.description" placeholder="Item Name & Description"></textarea>
                    					</div>
                  					</div>
                  					<div class="col-2">
                    					<div class="newinvoice-quantity">
                      						<input placeholder="Quantity" type="number" min="0" step=".01" v-model="invoice_product.qty" @change="calculateLineTotal(invoice_product)" />
                    					</div>
                  					</div>
                  					<div class="col-2">
                    					<div class="newinvoice-rate">
                      						<input placeholder="0.00" type="number" min="0" step=".01" v-model="invoice_product.price" @change="calculateLineTotal(invoice_product)" />
                    					</div>
                  					</div>
                  					<div class="col-2">
                    					<div class="newinvoice-amount">
                      						<input readonly placeholder="0.00" type="number" min="0" step=".01" v-model="invoice_product.amount" />
                    					</div>
                  					</div>
                  					<div class="col-1">
                    					<div class="newinvoice-less" v-if="k >= 1" @click="deleteRow(k, invoice_product)">
                      						<img src="../../assets/images/remove.jpg" alt="Add Less" />
                    					</div>
                  					</div>
                				</div>
              				</div>
              				<div class="newinvoice-data-plus">
                				<div class="addnew-button">
                  					<a style="color: #fff" @click="addNewRow"><span style="font-size: 30px !important">+</span>AddLine</a>
                				</div>
              				</div>
              				<hr />
              				<div class="newinvoice-subtotal-section" style="padding-top: 20px">
                				<div class="row">
                  					<div class="col-sm-5"></div>
	                  				<div class="col-sm-7">
                    					<div class="newinvoice-subtotal">
                      						<div class="row">
                        						<div class="col-6 left-name-subtotal">Sub Total</div>
                        						<div class="col-6 right-price-subtotal">{{ invoice_subtotal }}</div>
                      						</div>
                      						<hr />
                      						<div class="row">
                        						<div class="col-9 left-name-tax" style="width: 60%">Tax</div>
                        						<div class="col-2 middle-gst-price">
                          							<select name="currency" v-model="formData.tax_label" @change="taxChange($event)">
                            							<option value="tax" selected>Tax - {{ this.formData.taxvaluezero }} %</option>
                            							<option v-for="data in select_tax" :value="data.tax_name" :key="data.id" :data-name="data.tax_rate">
                              								{{ data.tax_name }} - {{ data.tax_rate }} %
                            							</option>
                          							</select>
                        						</div>
                        						<div class="col-2 right-price-tax" style="margin-left: 30px" >{{ this.formData.taxvalue }}</div>
                      						</div>
                      						<div class="row" v-for="(tax, k) in tax_list" :key="k">
                        						<div class="col-9 left-name-tax" style="width: 60%" v-if="k >= 1" @click="deleteTaxRow(k, tax)">
                          						<!-- <input placeholder="Tax Label" type="text" v-model="tax.tax_name" />                           -->
                      								<img src="../../assets/images/remove.jpg" alt="Add Less" />														
                        						</div>
                        						<div class="col-2 middle-gst-price" v-if="k >= 1">
                          							<select name="currency" v-model="tax.tax_rate" @change="taxRateChange($event, tax)" >
                            							<option value="" data-name="Tax" selected>Tax - {{ this.formData.taxvaluezero }} %</option>
                            							<option v-for="data in select_tax" :value="data.tax_rate" :key="data.id" :data-name="data.tax_name">
                              								{{ data.tax_name }} - {{ data.tax_rate }} %
                            							</option>
                          							</select>
                        						</div>
                        						<div class="col-2 right-price-tax" style="margin-left: 30px" v-if="k >= 1">
                          							{{ tax.tax_amount }}
                        						</div>													
                      						</div>													
                      						<div class="newinvoice-data-plus">
                        						<div class="addnew-button">
                          							<a style="color: #fff" @click="addNewTax"><span style="font-size: 30px !important">+</span>Add Tax</a>
                        						</div>
                      						</div>
                      						<div class="row">
                        						<div class="col-2 left-name-total">Total</div>
                        						<div class="col-7 total-usd">{{ this.formData.clientCurrency }}</div>
                        						<div class="col-3 right-price-usd">{{ invoice_total }}</div>
                      						</div>
                    					</div>
                  					</div>
                				</div>
              				</div>
            			</div>
          			</div>
          			<div class="newinvoice-section4">
            			<div class="row">
              				<div class="col-9">
                				<form @submit.prevent class="invoicenotice-form">
                					<textarea name="from" rows="4" placeholder="Invoice Note (Default Note)" v-model="$store.state.user.notes"></textarea>
                					<br />
                					<p v-if="errors.length">
                						<ul>
                   							<li v-for="error in errors" :key="error" style="color: red">{{ error }}</li>
                						</ul>
                					</p>
                					<br />
                					<input type="submit" class="yellow-button" value="Save" @click="create_invoice" style="width: 120px" />
                				</form>
              				</div>
              				<div class="col-3">
                				<div class="footer-edit-button">
                					<a class="yellow-button" @click="DefaultFooter">Save Default Footer</a>
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

var i = 0;

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
      		currency: 0,
      		currencise: [],
      		clients: [],
      		formData: {
      		  	from: "",
        		invoice_no: "",
        		useraddress2: "",
        		client: "",
        		date: new Date().toISOString().substr(0, 10),
        		due_date: new Date().toISOString().substr(0, 10),
        		tax: "",
        		taxvalue: 0,
        		taxvaluezero: 0,
        		subtotal: "",
        		total: "",
        		clientCurrency: "",
				tax_label: "tax",
      		},
      		invoice_products: [
        		{
          			description: "",
          			qty: "",
          			price: "",
          			admin_id: "",
          			invoice_no: "",
          			amount: 0,
        		},
      		],
      		tax_list: [
        		{
          			tax_name:"",
          			tax_rate: "",
          			tax_amount: 0,
          			invoice_no: 0,
          			admin_id: 0
        		},
      		],
      		invoice_subtotal: 0,
      		invoice_total: 0,
      		invoice_tax: 0,
      		select_tax: "",
      		errors: [],
      		j: 0
    	};
  	},
  	beforeRouteEnter(to, from, next) {
	    if (localStorage.getItem("type") == "staff") {
      		if (localStorage.getItem("permission").includes("invoice")) {
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
        	this.formData.clientCurrency = this.$store.state.user.currency;
        	this.getCurrency(), this.getClient(), this.invoiceSeries();
        	this.formData.from = this.$store.state.user.name + ", " + this.$store.state.user.address + ", " + this.$store.state.user.city + ", " + this.$store.state.user.state + ", " + this.$store.state.user.pincode + ", " + this.$store.state.user.country;
        	this.formData.useraddress2 = this.$store.state.user.city + ", " + this.$store.state.user.state + ", " + this.$store.state.user.pincode;
        	this.invoice_products[0]["admin_id"] = this.$store.state.user.id;
        	axios.post(`${base_url}/get_tax_details`, {
            	admin_id: this.$store.state.user.id,
          	}).then((res) => {
            	this.select_tax = res.data;
            	this.invoice_tax = res.data[0]["tax_rate"];
          	});
        	if (this.$store.state.user.is_business == 1) {
          		this.$router.push("/create_invoice");
        	} else {
          		this.$router.push("/business_setting");
        	}
      	});
  	},
  	methods: {
	    //get currency from database
	    async getCurrency() {
      		const response = await axios.get(`${base_url}/currency`);
      		this.currencise = response.data;
    	},
    	//get client list from database
    	async getClient() {
      		const response = await axios.post(`${base_url}/invoiceclients/${this.$store.state.user.id}`);
      		this.clients = response.data;
    	},
    	async myFunction(chosen) {
      		const response = await axios.get(`${base_url}/clients/${chosen}`);
      		this.formData.clientCurrency = response.data.currency;
    	},
    	async invoiceSeries() {
      		const response = await axios.post(`${base_url}/invoice_no/${this.$store.state.user.id}`);
      		this.formData.invoice_no = response.data;
    	},
    	//tax rate change
    	taxChange(e) {
      		
			const selectedOption = e.target.options[e.target.selectedIndex];
			const selectedTax = selectedOption.getAttribute('data-name');
			this.invoice_tax = selectedTax;
			this.formData.tax = this.invoice_tax;
			this.formData.tax_label = e.target.value;
			this.tax_list[0].tax_name = e.target.value;
			this.tax_list[0].admin_id =  this.$store.state.user.id;
			this.tax_list[0].invoice_no = this.formData.invoice_no;
			this.tax_list[0].tax_rate = this.invoice_tax;
			this.tax_list[0].tax_amount = parseFloat((this.invoice_subtotal * selectedTax) / 100).toFixed(2);
      		this.calculateTotal();
    	},
    	taxRateChange(e, tax_detail){
      		tax_detail.tax_amount = parseFloat((this.invoice_subtotal * e.target.value) / 100).toFixed(2);
      		this.calculateTotal();
      		const selectedOption = e.target.options[e.target.selectedIndex];
      		const selectedName = selectedOption.getAttribute('data-name');
      		tax_detail.tax_name = selectedName;
      
    	},
    	//add dynamic row
    	addNewRow() {
      		i++;
      		this.invoice_products.push({
        		description: "",
        		price: "",
        		qty: "",
        		admin_id: this.$store.state.user.id,
        		invoice_no: this.formData.invoice_no,
        		amount: 0,
      		});
    	},
    	addNewTax() {
      		this.j++;
      		this.tax_list.push({				
        		admin_id: this.$store.state.user.id,
        		invoice_no: this.formData.invoice_no,
        		tax_name:"",
        		tax_amount: "",
      		});
    	},
    	//total and subtotal calculate
    	calculateTotal() {
      		var subtotal, total;
      		subtotal = this.invoice_products.reduce(function (sum, product) {
        		var lineTotal = parseFloat(product.amount);
        		if (!isNaN(lineTotal)) {
          			return sum + lineTotal;
        		}
      		}, 0);
      		this.invoice_subtotal = subtotal.toFixed(2);
      		total = this.invoice_products.reduce(function (sum, product) {
        		var lineTotal = parseFloat(product.amount);
        		if (!isNaN(lineTotal)) {
          			return sum + lineTotal;
        		}
      		}, 0);
      		this.invoice_total = total.toFixed(2);
      		this.formData.subtotal = this.invoice_subtotal;
      		this.formData.taxvalue = (this.formData.subtotal * this.formData.tax) / 100;
      		this.formData.taxvalue = parseFloat(this.formData.taxvalue).toFixed(2);
			
      		this.invoice_products[0]["invoice_no"] = this.formData.invoice_no;
      		if (this.formData.taxvalue == "0.00") {
        		total = subtotal;
      		} else {
        		total = subtotal * (this.invoice_tax / 100) + subtotal;
      		}     
      		let sum = 0;
      		for (let i = 1; i < this.tax_list.length; i++) {
        		sum += parseFloat(this.tax_list[i].tax_amount);
      		}     
      		total = parseFloat(total) + parseFloat(sum);
      		if (!isNaN(total)) {
        		this.invoice_total = total.toFixed(2);
        		this.formData.total = this.invoice_total;
      		} else {
        		this.invoice_total = "0.00";
        		this.formData.total = this.invoice_total;
      		}
    	},
    	//row calculate
    	calculateLineTotal(invoice_product) {
      		var total = parseFloat(invoice_product.price) * parseFloat(invoice_product.qty);
      		if (!isNaN(total)) {
        		invoice_product.amount = total.toFixed(2);
      		}
      		this.calculateTotal();
    	},
    	//remove row
    	deleteRow(index, invoice_product) {
      		var idx = this.invoice_products.indexOf(invoice_product);
      		if (idx > -1) {
        		this.invoice_products.splice(idx, 1);
      		}
      		i--;
      		this.calculateTotal();
    	},
     	//remove row
     	deleteTaxRow(index, tax_detail) {
      		var idx = this.tax_list.indexOf(tax_detail);
      		if (idx > -1) {
        		this.tax_list.splice(idx, 1);
      		}
      		this.j--;				
      		this.calculateTotal();
    	},
    	//invocie generate
    	async create_invoice() {
      		this.tax = this.invoice_tax;
      		this.errors = [];
      		if (!this.formData.invoice_no) {
        		this.errors.push("Invoice No. is Required");
      		}
      		if (this.formData.clientCurrency == 0) {
        		this.errors.push("Currency is Required");
      		}
      		if (!this.formData.date) {
        		this.errors.push("Date is Required");
      		}
      		if (!this.formData.due_date) {
        		this.errors.push("Due Date is Required");
      		}
      		if (!this.formData.client) {
        		this.errors.push("Client Name is Required");
      		}
      		if (this.invoice_subtotal == 0 && this.invoice_total == 0) {
        		this.errors.push("Invoice item is Required");
      		}
      		if ( this.invoice_products[i]["description"].length <= 0 || this.invoice_products[i]["price"].length <= 0 || this.invoice_products[i]["qty"].length <= 0) {
        		this.errors.push("Description,Quantity & Rate value is Required");
      		}			
			if (this.errors.length == 0) {
				console.log(this.formData);
				console.log(this.invoice_products);
				console.log(this.tax_list);
        		await axios.post(`${base_url}/invoices`, {
          			invoice_no: this.formData.invoice_no,
          			admin_id: this.$store.state.user.id,
          			currency: this.formData.clientCurrency,
          			from_address: this.formData.from,
          			client_id: this.formData.client,
          			date: this.formData.date,
          			due_date: this.formData.due_date,
          			notes: this.$store.state.user.notes,
          			subtotal: this.formData.subtotal,
          			total: this.formData.total,
          			tax: this.formData.tax,
        		});
        		await axios.post(`${base_url}/invoice_details`, {
          			user_data: this.invoice_products,
        		});				
        		if(this.tax_list[0].tax_name !== ""){
					await axios.post(`${base_url}/invoice_tax_details`, {
						// tax_data: this.tax_detail,
						tax_data: this.tax_list
					});
        		}     
				i = 0;
				this.$router.push({ name: "invoice" });
				this.$notify({
					  title: "<b>Invoice</b> created successfully!",
					  type: "warn",
				});
      		}
    	},	
    	// save default footer
    	async DefaultFooter() {
      		await axios.post(`${base_url}/default_foolter`, {
        		default_footer: this.$store.state.user.notes,
        		admin_id: this.$store.state.user.id,
      		});
    	},
  	},
};
</script>
