
'use strict';

const fs = require('fs');
const mqtt = require('mqtt')
const { dialog } = require('electron').remote

var client = null;
var watcher = null;
var watchFileName = null;
var mqttServer = null;
var mqttUsername = null;
var mqttPassword = null;
var mqttTopicName = null;
var watchFileStatus = false;

document.getElementById('btn-save-setting').addEventListener('click', () => {
    saveSetting();
});
document.getElementById('btn-start').addEventListener('click', () => {

    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-stop').style.display = 'block';
    startWatchFile();
});
document.getElementById('btn-stop').addEventListener('click', () => {

    document.getElementById('btn-stop').style.display = 'none';
    document.getElementById('btn-start').style.display = 'block';
    stopWatchFile();
});

document.getElementById('select-file').addEventListener('click', function () {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        console.log(result.canceled);
        console.log(result.filePaths);
        if (result.canceled === false) {
            watchFileName = result.filePaths[0];
            document.getElementById("watch-filename").value = watchFileName;
            localStorage.setItem('watchFileName', watchFileName);
        }
    }).catch(err => {
        console.log(err);
    })
}, false);


function onClickTab(tabName) {
    const activeTab = document.getElementById(tabName);
    const tabsLink = document.querySelectorAll('.siimple-tabs .siimple-tabs-item');
    tabsLink.forEach((link) => link.classList.remove('siimple-tabs-item--selected'));
    activeTab.classList.add('siimple-tabs-item--selected');

    const tabcontents = document.querySelectorAll('.tabcontents .tabcontent');
    tabcontents.forEach((tab, index) => tab.style.display = 'none');
    const activeContent = document.getElementById(activeTab.dataset.tab);
    activeContent.style.display = 'block';
}


function loadSettingData() {
    watchFileName = localStorage.getItem('watchFileName');
    mqttServer = localStorage.getItem('mqttServer');
    mqttUsername = localStorage.getItem('mqttUsername');
    mqttPassword = localStorage.getItem('mqttPassword');
    mqttTopicName = localStorage.getItem('mqttTopicName');
    watchFileStatus = localStorage.getItem('watchFileStatus');

    document.getElementById("watch-filename").value = watchFileName;
    document.getElementById("mqtt-server").value = mqttServer;
    document.getElementById("mqtt-username").value = mqttUsername;
    document.getElementById("mqtt-password").value = mqttPassword;
    document.getElementById("mqtt-topic-name").value = mqttTopicName;

    if (watchFileStatus === 'true') {
        document.getElementById('btn-start').style.display = 'none';
        document.getElementById('btn-stop').style.display = 'block';
        startWatchFile();
    }
}

function saveSetting() {
    watchFileName = document.getElementById("watch-filename").value;
    mqttServer = document.getElementById("mqtt-server").value;
    mqttUsername = document.getElementById("mqtt-username").value;
    mqttPassword = document.getElementById("mqtt-password").value;
    mqttTopicName = document.getElementById("mqtt-topic-name").value;

    localStorage.setItem('watchFileName', watchFileName);
    localStorage.setItem('mqttServer', mqttServer);
    localStorage.setItem('mqttUsername', mqttUsername);
    localStorage.setItem('mqttPassword', mqttPassword);
    localStorage.setItem('mqttTopicName', mqttTopicName);
    dialog.showMessageBox({
        type: 'info',
        detail: 'Save settings complete.',
    });
}

function initTabs() {
    const tabsLink = document.querySelectorAll('.siimple-tabs .siimple-tabs-item');
    const tabcontents = document.querySelectorAll('.tabcontents .tabcontent');
    tabcontents.forEach((tab, index) => tab.style.display = 'none');
    tabsLink.forEach((link, index) => {
        if (link.classList.contains('siimple-tabs-item--selected')) {
            const activeTab = document.getElementById(link.dataset.tab);
            activeTab.style.display = 'block';
        }
    });

    loadSettingData();
}

function readFile(path) {
    const file = fs.readFileSync(path);
    const data = file.toString('utf8').split('\n');
    if (data.length === 2) {
        const log = 'Token update:' + data[0].split(0, data[1].length - 3) + '***' + ', ' + data[1].split(0, data[1].length - 3) + '***';
        console.log(log);
        document.getElementById("txt-log").value += '\n' + log;
        client.publish(mqttTopicName, JSON.stringify({ 'id_card': data[0], token: data[1] }))
    }
}

function stopWatchFile() {
    watchFileStatus = false;
    localStorage.setItem('watchFileStatus', false);
    watcher.close();
    try {
        client.disconnect();
    } catch (error) {

    }

}

function startWatchFile() {
    watchFileStatus = true;
    localStorage.setItem('watchFileStatus', true);

    client = mqtt.connect(`mqtt://${mqttServer}`, {
        clientId: 'watch_nhso_token-' + Math.floor(Math.random() * 1000000),
        username: mqttUsername,
        password: mqttPassword
    });

    client.on('connect', () => {
        console.log('mqtt is connect')
        readFile(watchFileName);
        watcher = fs.watch(watchFileName, (curr, prev) => {
            readFile(watchFileName);
        });
    })

    client.on('error', (err) => {
        console.log(err)
    })

    client.on('close', function () {
        console.log('mqtt closed');
    });

    client.on('offline', function () {
        console.log('offline');
    });

    client.on('reconnect', function () {
        console.log('reconnect');
    });
}


initTabs();