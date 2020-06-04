import Vue from 'vue';

const imageIsExist = function(url) {
  return new Promise((resolve) => {
    let img = new Image();

    img.onload = function() {
      if (this.complete === true) {
        resolve(true);
        img = null;
      }
    };
    img.onerror = function() {
      resolve(false);
      img = null;
    };
    img.src = url;
  });
};

export default Vue.directive('real-img', async(el, binding) => {
  const imgURL = binding.value;

  if (imgURL) {
    const exist = await imageIsExist(imgURL);

    if (exist) {
      el.setAttribute('src', imgURL);
    }
  }
});
