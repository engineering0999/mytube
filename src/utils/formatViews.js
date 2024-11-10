// src/utils/formatViews.js
const formatViews = (views) => {
    if (views >= 10000000) {
      return (views / 10000000).toFixed(1) + ' Cr';
    } else if (views >= 100000) {
      return (views / 100000).toFixed(1) + ' Lakh';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + ' K';
    } else {
      return views.toString();
    }
  };

  export default formatViews;
