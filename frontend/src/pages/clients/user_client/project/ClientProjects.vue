<template>
  	<div class="panelbox">
	    <LeftPannel />
	    <div class="right-panel">
      		<div class="header">
        		<CommonHeader title="Projects" :name="this.$store.state.user.name" />
      		</div>
      		<div class="content-page admin-projects-page">
        		<div class="fullrow">
          			<div class="row">
            			<div class="col-12">
	              			<div class="fullwidth-table track-table-body admin-project-table-body">
                				<table>
                  					<tr>
                    					<th>ID</th>
                    					<th>Project Name</th>
                    					<th>Short Description</th>
                    					<th>Developers</th>
                    					<th>View Tasks</th>
                  					</tr>
                  					<tr v-for="(item, index) in items" :key="item.id">
                    					<td style="text-align: center">{{ index + 1 }}</td>
                    					<td>{{ item.project_name }}</td>
                    					<td style="width: 50%">
                      						<div v-if="item.description.length <= 50">{{ item.description }}</div>
                      						<div v-else>{{ item.description.substring(0, 50) + ".." }}</div>
                    					</td>
                    					<td></td>	
                    					<td style="text-align: center">
                      						<router-link :to="{ name: 'client_viewproject', params: { id: item.id }}">
												<img src="../../../../assets/images/eye.png" alt="View" />
											</router-link>
                    					</td>
                  					</tr>
                				</table>
              				</div>
            			</div>
          			</div>
        		</div>
      		</div>
      		<div class="content-page"><div class="fullrow"></div></div>
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
  	components: {
    	LeftPannel,
    	CommonHeader,
    	CommonFooter,
  	},
  	data() {
    	return {
      		items: [],
    	};
  	},
  	created() {
    	if (this.$store.state.user.length != 0) {
      		this.showProject();
    	} else {
      		axios.post(`${base_url}/get_client/${localStorage.getItem("token")}`).then((res) => {
          		this.$store.state.user = res.data.user;
          		this.showProject();
        	});
    	}
  	},
  	methods: {
	    async showProject() {
      		const response = await axios.post(`${base_url}/taskclientprojects/${this.$store.state.user.id}`);
      		this.items = response.data;
    	},
  	},
};
</script>

<style></style>
