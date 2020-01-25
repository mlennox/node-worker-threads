
module.exports = {
  // makes setTimeout async rather than requiring a callback
  sleep: (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
};