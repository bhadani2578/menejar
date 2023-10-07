<template>
    <div class='loaderbox' v-if="this.loading">
        <img style="width:100px" src="../assets/images/Loading-bar.gif" alt="&laquo;"/>
    </div>
</template>

<script>

export default {
    name : 'Loader',
    props: {
        loading: {
            type: Boolean,
            required: true,
        },
    }
}
</script>