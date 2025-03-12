const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 500,
        icon: 'src/images/tic-tac-toe (1).png',
        webPreferences: {
            enableRemoteModule: true
        }
    })


    app.isPackaged
        ? win.loadFile(path.join(__dirname, "index.html")) // Prod
        : win.loadURL("http://localhost:3000"); // Dev
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
