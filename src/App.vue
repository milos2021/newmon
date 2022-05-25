<template>
  <v-app class="monitoring">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({

  }),
  methods: {

  },
  // beforeRouteUpdate(to, from, next) {
  //   console.log([to, from, next]);
  // },
  created() {

  }
};
</script>
<style>
.v-toolbar__content {
  background-color: red !important;
}
.v-main{
  background-color: #1F211E;
  font-size:15px
}
#version {
  flex: none;
}
.mobileHidden {
  display: flex;
}
.v-subheader {
  font-weight: bold !important;
}
.v-list-item__content {
  padding-left: 20px !important;
}
@media screen and (max-width: 768px) {
  .mobileHidden {
    display: none !important;
  }
  #list .v-input {
    max-width: fit-content !important;
  }
}

 @import 'assets/style.css';
 @import "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css";
 @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
 @import '~vue-context/dist/css/vue-context.css';
</style>
