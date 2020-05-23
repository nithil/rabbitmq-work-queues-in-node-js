/**
 *
 * @param {Number} ms milliseconds to sleep
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { sleep };
