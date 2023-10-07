<template>
  	<select class="select-dropdown" v-model="filter.currency" @change="filterCurrency($event)">
    	<option v-for="data in filter.currencise" :value="data.code" :key="data.code">
      		{{ data.code }}
    	</option>
  	</select>
  	<select class="right-dropdown" name="month" v-model="filter.invoice" @change="filterCurrency($event)">
    	<option v-for="data in invoice_filter_value" :value="data.val" :key="data.name">
      		{{ data.name }}
    	</option>
  	</select>
  	<apexcharts width="1000px" height="300px" type="bar" :options="this.chartOptions" :series="this.series"></apexcharts>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import axios from "axios";
import base_url from "../base_url.js";

export default {
  	name: "Chart",
  	components: {
	    apexcharts: VueApexCharts,
  	},
  	props: ["admin_id"],
  	data: function () {
    	return {
      		test: [],
      		chartOptions: {
        		chart: {
          			type: "bar",
        		},
        		dataLabels: {
          			enabled: true,
        		},
        		plotOptions: {
          			bar: {
            			vertical: true,
            			columnWidth: "50%",
            			distributed: false,
          			},		
        		},
        		xaxis: {
          			type: "date",
          			categories: [],
          			labels: {
            			hideOverlappingLabels: true,
          			},
        		},
        		colors: ["#f39223", "#1e4077"],
      		},
      		series: [
	        	{
          			name: "Invoiced",
          			data: [],
        		},
        		{
          			name: "Received",
          			data: [],
        		},
      		],
      		invoice_filter_value: [
	        	{ val: "this_month", name: "This month" },
        		{ val: "last_3", name: "Last 3 months" },
        		{ val: "last_6", name: "Last 6 months" },
        		{ val: "last_12", name: "Last 12 months" },
      		],
      		filter: {
        		currency: "",
        		invoice: "",
        		currencise: [],
      		},
      		filter_type: "",
      		last3Months: [],
    	};
  	},
  	created() {
    	this.filter.invoice = "last_3";
    	this.filter_type = "this_month";
    	this.filter.currency = "INR";
    	this.getCurrency();
    	this.filterCurrency();
    	//  this.getDaysInMonth(1, 2022);
  	},
  	methods: {
    	async filterCurrency() {
      		if (this.filter.invoice == "last_3") {
        		this.chartOptions.xaxis.categories.splice(0);
        		this.getLast3Months();
      		} else {
        		this.chartOptions.xaxis.categories.splice(0);				
        		this.getDaysInMonth(2, 2022);
      		}	
      		const invoiced = [];
      		const received = [];
      		var months = [];
      		const params ="?currency=" + this.filter.currency + "&invoice=" + this.filter.invoice;
      		await axios.post(`${base_url}/dashboard_invoice` + params, {
          		headers: { token: localStorage.getItem("token") },
          		admin_id: this.admin_id,
        	}).then((res) => {
          		for ( var i = 0; i < Math.max(res.data["invoiced"].length, res.data["received"].length); i++) {
            		invoiced.push(res.data["invoiced"][i].currency);
          		}
          		for (var j = 0; j < res.data["received"].length; j++) {
            		months.push(res.data["received"][j].month - 1);					
            		received.push(res.data["received"][j].currency);
          		}
          		var invoice_received = [];
          		for (const key of this.chartOptions.xaxis.categories.keys()) {
            		if (months.includes(key)) {
              			if (months.length == this.chartOptions.xaxis.categories.length) {
                			invoice_received.push(received[key]);
              			} else if (months.length < this.chartOptions.xaxis.categories.length) {
                			if (key == 0) {
                  				invoice_received.push(received[key]);
                			} else {
                  				invoice_received.push(received[key - 1]);
                			}
              			}
        			} else {
            	  		invoice_received.push("0");
            		}
          		}
          		var invoiced_data = [];
          		for (const key of this.chartOptions.xaxis.categories.keys()) {
            		if (months.includes(key)) {
              			if (months.length == this.chartOptions.xaxis.categories.length) {
                			invoiced_data.push(invoiced[key]);
              			} else if (months.length < this.chartOptions.xaxis.categories.length) {
                			if (key == 0) {
                  				invoiced_data.push(invoiced[key]);
                			} else {
                  				invoiced_data.push(invoiced[key - 1]);
                			}
              			}
            		} else {
              			invoiced_data.push("0");
            		}
          		}
          		this.series[0]["data"] = invoiced_data;
          		this.series[1]["data"] = invoice_received;
        	});
    	},
    	//get currency
    	async getCurrency() {
      		const response = await axios.get(`${base_url}/currency`);
      		this.filter.currencise = response.data;
    	},
    	//last 3 months name
    	getLast3Months() {
      		var monthNames = [
        		"January",
        		"February",
        		"March",
        		"April",
        		"May",
        		"June",
        		"July",
        		"August",
        		"September",
        		"October",
        		"November",
        		"December",
      		];		
      		var today = new Date();
      		for (var i = 0; i < 3; i++) {
        		this.last3Months.push(monthNames[today.getMonth() - i]);
      		}			
      		this.chartOptions.xaxis.categories = this.last3Months.reverse();
    	},
    	//this months date
    	getDaysInMonth(month, year) {
      		var date = new Date(year, month, 1);
      		var days = [];
      		while (date.getMonth() === month) {
        		days.push(new Date(date));
        		date.setDate(date.getDate() + 1);
      		}
      		for (var x = 0; x < new Date().getDate(); x++) {
        		this.chartOptions.xaxis.categories.push(days[x].toString().substring(8, 10));
      		}
    	},
  	},
};
</script>
