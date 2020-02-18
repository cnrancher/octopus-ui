<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/images/logo.svg">
    <HelloWorld msg="Welcome to Rancher Edge"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
