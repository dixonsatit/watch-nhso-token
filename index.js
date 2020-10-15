const fs = require('fs');
const mqtt = require('mqtt')
require('log-timestamp');
require('dotenv').config()

const updateTokenTopic = process.env.TOPIC_NAME;
const nhsoLogfile = process.env.WATCH_FILE;

const client = mqtt.connect(`mqtt://${process.env.MQTT_SERVER}`, {
    clientId: 'q4u_nhso_token-' + Math.floor(Math.random() * 1000000),
    username: process.env.MQTT_SERVER,
    password: process.env.MQTT_PASSWORD
});

function readFile(path) {
    const file = fs.readFileSync(path);
    const data = file.toString('utf8').split('\n');
    if (data.length === 2) {
        console.log(data);
        client.publish(updateTokenTopic, JSON.stringify({ 'id_card': data[0], token: data[1] }))
    }
}

readFile(nhsoLogfile);
client.on('connect', () => {
    console.log(`Watching for file nhso changes on ${nhsoLogfile}`);
    fs.watch(nhsoLogfile, (curr, prev) => {
        readFile(nhsoLogfile);
    });
});
