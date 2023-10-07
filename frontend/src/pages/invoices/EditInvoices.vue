<template>
  	<div class="panelbox">
	    <LeftPannel :image="this.$store.state.user.image" :cname="this.$store.state.user.cname" />
    	<div :class="type == 'admin' ? 'right-panel' : 'right-panel staff-section-page'">
      		<div class="header">
        		<CommonHeader v-if="type == 'admin'" title="Edit Invoice" :name="this.$store.state.user.name" />
        		<staff-header v-else title="Edit Invoice"></staff-header>
      		</div>
      		<div class='loaderbox'  v-if="!this.formData.invoice_no">
              	<img style="width:100px" src="../../assets/images/Loading-bar.gif" alt="&laquo;"/>
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
                				<div class="newinvoice-name">
                 					{{ $store.state.user.cname }} <br />
                  					{{ $store.state.user.address }} <br />
                  					{{ formData.useraddress2 }}, {{ $store.state.user.country }} <br />
                  					<span v-if="$store.state.user.taxname_one && $store.state.user.taxname_one">
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
                				</div>
                				<div>
                  					<select name="currency" v-model="formData.client" @change="myFunction($event.target.value)">
                    					<option value="" selected>Select Client</option>
                    					<option v-for="data in clients" :value="data.id" :key="data.id">
                      						{{ data.organization }}
                      						{{ data.name }}
                    					</option>
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
                    					<div class="newinvoice-less" v-if="k >= 1" @click="deleteRow(k, invoice_product, invoice_product.id)">
                    						<img src="../../assets/images/remove.jpg" alt="Add Less" />
                    					</div>
                  					</div>
                				</div>
              				</div>
              				<div class="newinvoice-data-plus">
                				<div class="addnew-button">
                  					<a style="color: #fff" @click="addNewRow"><span style="font-size: 30px !important">+</span>Add Line</a>
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

                    						
                    						<div class="row" v-for="(tax, k) in this.tax_list" :key="k" >
												<div class="col-9 left-name-tax" style="width: 60%" v-if="k < 1">Tax</div>
                    							<div class="col-9 left-name-tax" style="width: 60%" v-else  @click="deleteTaxRow(k, tax, tax.id)">
                      								<!-- <input placeholder="Tax Label" type="text" v-model="tax.tax_name" /> -->
                      								<img src="../../assets/images/remove.jpg" alt="Add Less" />
                      								<input type="hidden" v-model="tax.id" />
                    							</div>
                    							<div class="col-2 middle-gst-price" >
                      								<select name="currency" v-model="tax.tax_name" @change="taxRateChange($event, tax)">
                        								<option value="" data-name="Tax" selected>Tax - {{ this.formData.taxvaluezero }} %</option>
                        								<option v-for="data in this.select_tax" :value="data.tax_name" :data-name="data.tax_rate" :key="data.id">
                          									{{ data.tax_name }} - {{ data.tax_rate }} %
                        								</option>
                      								</select>
                    							</div>
                    							<div class="col-2 right-price-tax" style="margin-left: 30px" >{{ tax.tax_amount }}</div>
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
                  					<textarea name="from" rows="4" placeholder="Invoice Note (Default Note)" v-model="this.formData.notes"></textarea>
                  					<br />
                  					<p v-if="errors.length">
                    					<ul>
                    						<li v-for="error in errors" :key="error" style="color: red">{{ error }}</li>
                    					</ul>
                  					</p>
                  					<br />
                  					<input type="submit" class="yellow-button" value="Update" @click="edit_invoice" style="width: 120px" />
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
      		id: "",
      		currency: 0,
      		currencise: [],
      		clients: [],
      		client_id: "",
      		formData: {
        		from: "",
        		invoice_no: "",
        		useraddress2: "",
        		client: "",
        		date: "",
        		due_date: "",
        		tax: "",
        		taxvalue: 0,
        		taxvaluezero: 0,
        		subtotal: "",
        		total: "",
        		clientCurrency: "",
        		notes: "",
      		},
      		temp: 0,
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
          			tax_total: "",
          			invoice_no: "",
          			admin_id: ""
        		},
      		],
      		invoice_subtotal: 0,
      		invoice_total: 0,
      		invoice_tax: 0,
      		select_tax: "",
      		errors: [],
      		items: "",
      		j: 0
    	};
  	},
  	created() {
    	this.type = localStorage.getItem("type");
    	this.start();
    	axios.post(`${base_url}/user`, {
        	headers: { token: localStorage.getItem("token") },
        	type: localStorage.getItem("type"),
      	}).then((res) => {
        	this.$store.state.user = res.data.user;
        	this.getCurrency(), this.getClient();
        	this.invoice_products[0]["admin_id"] = this.$store.state.user.id;
        	this.formData.useraddress2 = this.$store.state.user.city + ", " + this.$store.state.user.state + ", " + this.$store.state.user.pincode;
        	axios.post(`${base_url}/get_tax_details`, {
            	admin_id: this.$store.state.user.id,
          	}).then((res) => {
            	this.select_tax = res.data;				
            	this.invoice_tax = res.data[0]["tax_rate"];
          	});          
      	});
  	},
  	methods: {
	    async start() {
      		const response = await axios.get(`${base_url}/download_invoice/${this.$route.params.id}`);
      		this.id = response.data.id;
      		this.formData.invoice_no = response.data.invoice_no;
      		this.formData.clientCurrency = response.data.currency;
      		this.formData.date = this.convertDate(response.data.date);
      		this.formData.due_date = this.convertDate(response.data.due_date);
      		this.formData.client = response.data.client_id;
      		const res = await axios.post(`${base_url}/forpdftabledata/${this.formData.invoice_no}`);
      		this.invoice_products = res.data;
      		this.invoice_subtotal = response.data.subtotal;
      		this.invoice_total = response.data.total;
			console.log(this.invoice_total);
      		if (response.data.tax) {
        		this.formData.tax = response.data.tax;
      		} else {
        		this.formData.tax = "0";
      		}
      		this.formData.taxvalue = parseFloat((response.data.subtotal*response.data.tax) / 100).toFixed(2);
      		this.formData.notes = response.data.notes;
      		await axios.post(`${base_url}/get_invoice_tax_details`, {
            	admin_id: this.$store.state.user.id,
            	invoice_no: this.formData.invoice_no
         	}).then((res) => {
            	console.log(res.data);
            	this.tax_list = res.data;
          	});
    	}, 
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
    	}, //tax rate change
    	// taxChange(e) {
      	// 	this.invoice_tax = e.target.value;
      	// 	this.formData.tax = this.invoice_tax;
      	// 	this.calculateTotal();
    	// },
    	taxRateChange(e, tax_detail){
			console.log(e.target.value);
      		
      		const selectedOption = e.target.options[e.target.selectedIndex];
      		const tax_value = selectedOption.getAttribute('data-name');
			tax_detail.tax_amount = parseFloat((this.invoice_subtotal * tax_value) / 100).toFixed(2);
			const selectedName = e.target.value;
			  
      		tax_detail.tax_name = selectedName;
			tax_detail.tax_rate = tax_value;
      		this.calculateTotal();

    	},
    	//add dynamic row
    	addNewRow() {
      		this.temp++;
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
			  console.log(total.toFixed(2))
      		this.formData.subtotal = this.invoice_subtotal;
      		this.formData.taxvalue = (this.formData.subtotal * this.formData.tax) / 100;
      		this.formData.taxvalue = parseFloat(this.formData.taxvalue).toFixed(2);
			 
      		this.invoice_products[0]["invoice_no"] = this.formData.invoice_no;
      		if (this.formData.taxvalue == "0.00") {
        		total = subtotal;
      		} else {
        		total =  subtotal;
      		}
			console.log(this.invoice_tax);
      		let sum = 0;
			  console.log(this.tax_list);
      		for (let i = 0; i < this.tax_list.length; i++) {
        		sum += parseFloat(this.tax_list[i].tax_amount);
      		}
      		console.log(total);
      		total = parseFloat(total) + parseFloat(sum);
			console.log(total);
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
    	async deleteRow(index, invoice_product, id) {
      		var idx = this.invoice_products.indexOf(invoice_product);
      		if (idx > -1) {
        		this.invoice_products.splice(idx, 1);
      		}
      		this.temp--;
      		await axios.post(`${base_url}/delete_invoicedetail/${id}`);
      		this.calculateTotal();
    	},
     	//remove row
     	async deleteTaxRow(index, tax_detail, id) {
      		var idx = this.tax_list.indexOf(tax_detail);
      		if (idx > -1) {
        		this.tax_list.splice(idx, 1);
      		}
      		this.j--;
      		console.log(id);
      		await axios.post(`${base_url}/delete_invoice_tax_detail/${id}`);
      		this.calculateTotal();
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
    	}, // save default footer
    	async DefaultFooter() {
      		await axios.post(`${base_url}/default_foolter`, {
        		default_footer: this.formData.notes,
        		admin_id: this.$store.state.user.id,
      		});
    	},
    	//invocie edit
    	async edit_invoice() {
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
      		if ( this.invoice_products[this.temp]["description"].length <= 0 || this.invoice_products[this.temp]["price"].length <= 0 || this.invoice_products[this.temp]["qty"].length <= 0) {
        		this.errors.push("Description,Quantity & Rate value is Required");
      		}
      		if (this.errors.length == 0) {
        		await axios.post(`${base_url}/invoices/${this.id}`, {
          			invoice_no: this.formData.invoice_no,
          			admin_id: this.$store.state.user.id,
          			currency: this.formData.clientCurrency,
          			from_address: this.formData.from,
          			client_id: this.formData.client,
          			date: this.formData.date,
          			due_date: this.formData.due_date,
          			notes: this.formData.notes,
          			subtotal: this.invoice_subtotal,
          			total: this.invoice_total,
          			tax: this.formData.tax,
        		});  
        		await axios.post(`${base_url}/invoice_details/${this.id}`, {
          			user_data: this.invoice_products,
        		}); 
				console.log("Tax list",this.tax_list);
        		if(this.tax_list.length > 0){
					console.log(this.tax_list);
					await axios.post(`${base_url}/invoice_tax_details/${this.formData.invoice_no}`, {
						tax_data: this.tax_list,
        			});
				}
				this.$router.push({ name: "invoice" });
				this.$notify({ title: "<b>Invoice</b> updated successfully!", type: "warn",});
            }
    	},
  	},
};
</script>

<style></style>
