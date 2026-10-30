import { Menu, Tray } from "electron";
import { WindowManager } from "./window";
import path = require("path")

var tray: Tray = null
var isQuitting: boolean = false;
var manager: WindowManager = null;

export function initializeTray(mgr: WindowManager, statusTray: boolean = false) {
    manager = mgr;

    if (statusTray)
        createTray();

    setTimeout(() => {

        manager.mainWindow.on("close", (e) => {
            if (!isQuitting) e.preventDefault()
            manager.mainWindow.hide()
        })

    }, 1000);
}

function createTray() {
    tray = new Tray(path.join(__dirname, "../build/icon.png"))
    var contextMenu = Menu.buildFromTemplate([
        {
            label: manager.mainWindow.webContents.send("request-translate", "quit") ?? "Quit",
            click: () => {
                isQuitting = true;
                manager.mainWindow.close();
            },
        },
    ])

    tray.setToolTip("Fluent Reader")
    tray.on("click", () => manager.mainWindow.show())
    tray.setContextMenu(contextMenu)
}

export function toggleTray() {
    if (tray) {
        isQuitting = true;
        tray.destroy();
        tray = null;
    } else {
        isQuitting = false;
        createTray();
    }
}