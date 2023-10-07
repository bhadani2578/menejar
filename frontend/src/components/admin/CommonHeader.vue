<template>
  	<div class="left-title">
	    <h1>{{ title }}</h1>
  	</div>
  	<div class="right-admindetail">
    	<p><span>{{ name.charAt(0).toUpperCase() }}</span> {{ name }}</p>
  	</div>
</template>

<script>
export default {
  	props: ["title", "name"],
  	created() {
	    document.title = this.title;
  	},
};
</script>
