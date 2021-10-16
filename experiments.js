"use strict";

var { Services } = ChromeUtils.import(
    "resource://gre/modules/Services.jsm");
var { ExtensionSupport } = ChromeUtils.import(
    "resource:///modules/ExtensionSupport.jsm");
var { ExtensionParent } = ChromeUtils.import(
    "resource://gre/modules/ExtensionParent.jsm");

const EXTENSION_NAME = "tabControl@nuitcodecitoyen.org";
var extension = ExtensionParent.GlobalManager.getExtension(EXTENSION_NAME);

// Implements the functions defined in the experiments section of schema.json.
var tabControl = class extends ExtensionCommon.ExtensionAPI {
    onStartup() {
    }

    onShutdown(isAppShutdown) {
        if (isAppShutdown) return;
        // Looks like we got uninstalled. Maybe a new version will be installed
        // now. Due to new versions not taking effect
        // (https://bugzilla.mozilla.org/show_bug.cgi?id=1634348)
        // we invalidate the startup cache. That's the same effect as starting
        // with -purgecaches (or deleting the startupCache directory from the
        // profile).
        Services.obs.notifyObservers(null, "startupcache-invalidate");
    }

    getAPI(context) {
        context.callOnClose(this);
        return {
          tabControl: {
                addWindowListener(dummy) {
                    var prefix = "chrome://messenger/content/";
                    var windows = [
                        "addressbook/addressbook",
                        "messenger",
                        "messageWindow",
                        "messengercompose/messengercompose",
                    ];
                    var suffixes = ["xul", "xhtml"];
                    var urls = suffixes.map(s => windows.map(
                        w => prefix + w + "." + s)).flat(1);
                    // Adds a listener to detect new windows.
                    ExtensionSupport.registerWindowListener(EXTENSION_NAME, {
                        chromeURLs: urls,
                        onLoadWindow: paint,
                    });
                }
            }
        }
    }

    close() {
        ExtensionSupport.unregisterWindowListener(EXTENSION_NAME);
    }
};


function paint(win) {
    if (win.location == "chrome://messenger/content/messenger.xul" ||
    win.location == "chrome://messenger/content/messenger.xhtml") {
        win.setTimeout(function () {
        try {
          win.atStartupRestoreTabs = function (aDontRestoreFirstTab) {
            return false;
          };
        } catch (e) {
          Components.utils.reportError(e);
        }
      }, 10);
    }
}
