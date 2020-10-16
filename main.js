const { menubar } = require('menubar');

const mb = menubar({
    browserWindow: {
        width: 650,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    }
});

mb.on('ready', () => {
    console.log('Menubar app is ready.');
});

