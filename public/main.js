const { app, BrowserWindow } = require('electron')
require('@electron/remote/main').initialize()

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 600,
        icon: 'src/images/tic-tac-toe (1).png',
        webPreferences: {
            enableRemoteModule: true
        }
    })

    win.loadURL('http://localhost:3000')
    win.removeMenu()
}


app.on('ready', createWindow)

//explicitly quit the app when all windows are closed - set as behavior on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//re-create the window in the app when the app is activated and no windows are open - set as default behavior on macOS
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
