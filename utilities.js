"use strict";

/**
 * Tell the browser to wait a specific amount of time
 * in milliseconds.
 * 
 * @param {long} ms - The milliseconds to wait
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Send a message to console.
 * 
 * @param {string} msg - The message to print as debug
 */
function debug(msg) {
    console.log("[DEBUG] " + msg);
}