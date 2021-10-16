"use strict";

/* globals browser */

var init = async () => {
    browser.tabControl.addWindowListener("dummy");
};

init();
