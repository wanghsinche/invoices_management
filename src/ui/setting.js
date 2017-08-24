require('./css/ui.css');
require('./css/photon.css');
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
let hostname = localStorage.getItem('hostname');
document.getElementById('textcon').value = hostname;
document.getElementById('save').addEventListener('click', function () {
    var addr = document.getElementById('textcon').value;
    localStorage.setItem('hostname', addr);
    ipc.send('update-hostname');
    remote.getCurrentWindow().close();
});
document.getElementById('cancel').addEventListener('click', function () {
    remote.getCurrentWindow().close();
});