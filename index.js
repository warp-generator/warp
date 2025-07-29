// DOM Elements
const AWGm = document.querySelector('.get-btn');
const AWGp = document.querySelector('.get-btn2');
const AWGr = document.querySelector('.get-btn3');
const Karing = document.querySelector('.get-btn4');
const WiW = document.querySelector('.get-btn5');
const Neko = document.querySelector('.get-btn6');
const Husi = document.querySelector('.get-btn7');
const Clash = document.querySelector('.get-btn8');
const wireGuardConfig = document.querySelector('.wire-guard-config');
const v2rayConfig = document.querySelector('.v2ray-config');
const container = document.querySelector('.container');

function generateRandomEndpoint() {
    const prefixes = ["188.114.96.", "188.114.97.", "188.114.98.", "188.114.99.", "162.159.192.", "162.159.195.", "8.47.69.", "8.6.112.", "8.34.146.", "8.35.211.", "8.39.204.", "8.39.214.", "8.34.70.", "8.39.125."];
    const ports = [500, 854, 859, 864, 878, 880, 890, 891, 894, 903, 908, 928, 934, 939, 942, 943, 945, 946, 955, 968, 987, 988, 1002, 1010, 1014, 1018, 1070, 1074, 1180, 1387, 1701, 1843, 2371, 2408, 2506, 3138, 3476, 3581, 3854, 4177, 4198, 4233, 4500, 5279, 5956, 7103, 7152, 7156, 7281, 7559, 8319, 8742, 8854, 8886];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 256);
    const port = ports[Math.floor(Math.random() * ports.length)];
    return `${prefix}${randomNumber}:${port}`;
}
function getRandomJcParams() {
    const options = [
        "Jc = 4\nJmin = 40\nJmax = 70",
        "Jc = 120\nJmin = 23\nJmax = 911"
    ];
    return options[Math.floor(Math.random() * options.length)];
}
const generateRandomString = (length) =>
    Array.from({ length }, () =>
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
            Math.floor(Math.random() * 62)
        )
    ).join('');
const fetchKeys = async () => {
    try {
        const response = await fetch('https://keygen.warp-generator.workers.dev');
        if (!response.ok) throw new Error(`Failed to fetch keys: ${response.status}`);
        const data = await response.text();
        return {
            publicKey: extractKey(data, 'PublicKey'),
            privateKey: extractKey(data, 'PrivateKey'),
        };
    } catch (error) {
        console.error('Error fetching keys:', error);
        throw error;
    }
};
const fetchKeys2 = async () => {
    try {
        const response = await fetch('https://keygen.warp-generator.workers.dev');
        if (!response.ok) throw new Error(`Failed to fetch keys: ${response.status}`);
        const data = await response.text();
        return {
            publicKey2: extractKey(data, 'PublicKey'),
            privateKey2: extractKey(data, 'PrivateKey'),
        };
    } catch (error) {
        console.error('Error fetching keys:', error);
        throw error;
    }
};
const extractKey = (data, keyName) =>
    data.match(new RegExp(`${keyName}:\\s(.+)`))?.[1].trim() || null;
const fetchAccount = async (publicKey, installId, fcmToken) => {
    const apiUrl = 'https://www.warp-generator.workers.dev/wg';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'User-Agent': 'okhttp/3.12.1',
                'CF-Client-Version': 'a-6.10-2158',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: publicKey,
                install_id: installId,
                fcm_token: fcmToken,
                tos: new Date().toISOString(),
                model: 'PC',
                serial_number: installId,
                locale: 'de_DE',
            }),
        });
        if (!response.ok) throw new Error(`Failed to fetch account: ${response.status}`);
        return response.json();
    } catch (error) {
        console.error('Error fetching account:', error);
        throw error;
    }
};
const generateReserved = (clientId) =>
    Array.from(atob(clientId))
        .map((char) => char.charCodeAt(0))
        .slice(0, 3)
        .join(', ');

// Generate V2Ray URL
const generateV2RayURL = (privateKey, publicKey, ipv4, ipv6, reserved) =>
    `wireguard://${encodeURIComponent(privateKey)}@engage.cloudflareclient.com:2408?address=${encodeURIComponent(
        ipv4 + '/32'
    )},${encodeURIComponent(ipv6 + '/128')}&reserved=${reserved}&publickey=${encodeURIComponent(
        publicKey
    )}&mtu=1420#V2ray-Config`;

// Handle Copy Button Click
const handleCopyButtonClick = async function(e) {
    const targetId = this.getAttribute('data-target');
    const messageId = this.getAttribute('data-message');
    try {
        const textArea = document.getElementById(targetId);
        await navigator.clipboard.writeText(textArea.value);
        showPopup('Config copied successfully!');
        showCopyMessage(messageId, 'Copied!');
    } catch (error) {
        console.error('Copy failed:', error);
        showPopup('Failed to copy, please try again.', 'error');
        showCopyMessage(messageId, 'Failed to copy');
    }
};


// Show popup notification
const showPopup = (message, type = 'success') => {
    const popup = document.createElement('div');
    popup.className = 'popup-message';
    popup.textContent = message;
    
    if (type === 'error') {
        popup.style.backgroundColor = '#d32f2f';
    }
    
    document.body.appendChild(popup);
    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 2500);
};


const downloadConfig = (fileName, content) => {

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'application/octet-stream' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
	
};


// Generate and Display Configurations
const generateConfig = (data, privateKey) => {
    const reserved = generateReserved(data.config.client_id);
    const wireGuardText = generateWireGuardConfig(data, privateKey);
    const v2rayText = generateV2RayURL(
        privateKey,
        data.config.peers[0].public_key,
        data.config.interface.addresses.v4,
        data.config.interface.addresses.v6,
        reserved
    );
    updateDOM(wireGuardConfig, 'WireGuard Format', 'wireguardBox', wireGuardText, 'message1');
    updateDOM(v2rayConfig, 'V2Ray Format', 'v2rayBox', v2rayText, 'message2');
    downloadBtn.style.display = 'block';
    
    // Add event listeners to newly created copy buttons
    document.querySelectorAll('.copy-button').forEach(btn => {
        btn.addEventListener('click', handleCopyButtonClick);
    });
};

// AWGm
AWGm.addEventListener('click', async () => {
	const button = document.getElementById('generateButton6');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const selectedDNS = getSelectedDNS();
		const allowedIPs = getSelectedSites();
		const wireGuardText = `[Interface]
PrivateKey = ${privateKey}
Address = ${accountData.config.interface.addresses.v4}, ${accountData.config.interface.addresses.v6}
DNS = ${selectedDNS}
MTU = 1280
S1 = 0
S2 = 0
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = ${accountData.config.peers[0].public_key}
AllowedIPs = ${allowedIPs}
Endpoint = 8.47.69.0:1002`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
	
    downloadConfig(`WARPm_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
	
});

// AWGp
AWGp.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const selectedDNS = getSelectedDNS();
		const allowedIPs = getSelectedSites();
		const wireGuardText = `[Interface]
PrivateKey = ${privateKey}
Address = ${accountData.config.interface.addresses.v4}, ${accountData.config.interface.addresses.v6}
DNS = ${selectedDNS}
MTU = 1280
S1 = 0
S2 = 0
Jc = 120
Jmin = 23
Jmax = 911
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = ${accountData.config.peers[0].public_key}
AllowedIPs = ${allowedIPs}
Endpoint = engage.cloudflareclient.com:500`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`WARPp_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// AWGr
AWGr.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton4');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const randomEndpoint = generateRandomEndpoint();
		const jcParams = getRandomJcParams();
		const selectedDNS = getSelectedDNS();
		const allowedIPs = getSelectedSites();
		const wireGuardText = `[Interface]
PrivateKey = ${privateKey}
Address = ${accountData.config.interface.addresses.v4}, ${accountData.config.interface.addresses.v6}
DNS = ${selectedDNS}	
MTU = 1280
S1 = 0
S2 = 0
${jcParams}
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = ${accountData.config.peers[0].public_key}
AllowedIPs = ${allowedIPs}
Endpoint = ${randomEndpoint}`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`WARPr_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// Karing
Karing.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton2');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const reserved = generateReserved(accountData.config.client_id);
		const wireGuardText = `{
  "outbounds":   [
{
"tag": "WARP",
"reserved": [${reserved}],
"mtu": 1280,
"fake_packets": "5-10",
"fake_packets_size": "40-100",
"fake_packets_delay": "20-250",
"fake_packets_mode": "m4",
"private_key": "${privateKey}",
"type": "wireguard",
"local_address": ["${accountData.config.interface.addresses.v4}/32", "${accountData.config.interface.addresses.v6}/128"],
"peer_public_key": "${accountData.config.peers[0].public_key}",
"server": "engage.cloudflareclient.com",
"server_port": 500
}
  ]
}`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`KaringWARP_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// Karing WiW
WiW.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton3');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const reserved = generateReserved(accountData.config.client_id);
		const { publicKey2, privateKey2 } = await fetchKeys2();
		const installId2 = generateRandomString(22);
        const fcmToken2 = `${installId2}:APA91b${generateRandomString(134)}`;
        const accountData2 = await fetchAccount(publicKey2, installId2, fcmToken2);
		const reserved2 = generateReserved(accountData2.config.client_id);
		const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
		const randomNumber2 = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
		const wireGuardText = `{
  "outbounds":   [
{
"tag": "WARP_${randomNumber}",
"reserved": [${reserved}],
"mtu": 1280,
"fake_packets": "5-10",
"fake_packets_size": "40-100",
"fake_packets_delay": "20-250",
"fake_packets_mode": "m4",
"private_key": "${privateKey}",
"type": "wireguard",
"local_address": ["${accountData.config.interface.addresses.v4}/32", "${accountData.config.interface.addresses.v6}/128"],
"peer_public_key": "${accountData.config.peers[0].public_key}",
"server": "188.114.97.170",
"server_port": 500
},
  {
   "type": "wireguard",
   "tag": "WARPinWARP_${randomNumber2}",
   "detour": "WARP_${randomNumber}",
   "local_address": ["${accountData2.config.interface.addresses.v4}/32", "${accountData2.config.interface.addresses.v6}/128"],
   "private_key": "${privateKey2}",
   "peer_public_key": "${accountData2.config.peers[0].public_key}",
   "reserved": [${reserved2}],
   "mtu": 1200,
   "server": "188.114.97.170",
   "server_port": 1018
  }
  ]
}`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`WARPinWARP_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// Neko
Neko.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton5');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const reserved = generateReserved(accountData.config.client_id);
		const wireGuardText = `{
"mtu": 1280,
"reserved": [${reserved}],
"private_key": "${privateKey}",
"type": "wireguard",
"local_address": ["${accountData.config.interface.addresses.v4}/32", "${accountData.config.interface.addresses.v6}/128"],
"peer_public_key": "${accountData.config.peers[0].public_key}",
"server": "188.114.97.0",
"server_port": 500
}`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`NekoWARP_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// Husi
Husi.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton8');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const reserved = generateReserved(accountData.config.client_id);
		const wireGuardText = `{
"type": "wireguard",
"tag": "proxy",
"mtu": 1280,
"address": ["${accountData.config.interface.addresses.v4}/32", "${accountData.config.interface.addresses.v6}/128"],
"private_key": "${privateKey}",
"listen_port": 0,
"peers": [
{
"address": "188.114.97.0",
"port": 500,
"public_key": "${accountData.config.peers[0].public_key}",
"pre_shared_key": "",
"allowed_ips": [
"0.0.0.0/0",
"::/0"
],
"persistent_keepalive_interval": 600,
"reserved": "${reserved}"
}
],
"detour": "direct"
}`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`HusiWARP_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// Clash
Clash.addEventListener('click', async () => {
    const button = document.getElementById('generateButton7');
    const status = document.getElementById('status');
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
		const reserved = generateReserved(accountData.config.client_id);
		const { publicKey2, privateKey2 } = await fetchKeys2();
		const installId2 = generateRandomString(22);
        const fcmToken2 = `${installId2}:APA91b${generateRandomString(134)}`;
        const accountData2 = await fetchAccount(publicKey2, installId2, fcmToken2);
		const reserved2 = generateReserved(accountData2.config.client_id);
		const wireGuardText = `proxies:
- name: "WARP"
  type: wireguard
  private-key: ${privateKey}
  server: 188.114.96.0
  port: 500
  ip: ${accountData.config.interface.addresses.v4}
  public-key: ${accountData.config.peers[0].public_key}
  allowed-ips: ['0.0.0.0/0']
  reserved: [${reserved}]
  udp: true
  mtu: 1280
  remote-dns-resolve: true
  dns: [1.1.1.1, 1.0.0.1]
  amnezia-wg-option:
   jc: 120
   jmin: 23
   jmax: 911
   s1: 0
   s2: 0
   h1: 1
   h2: 2
   h4: 3
   h3: 4
   
- name: "WARP in WARP"
  dialer-proxy: WARP
  type: wireguard
  private-key: ${privateKey2}
  server: 188.114.97.170
  port: 1018
  ip: ${accountData2.config.interface.addresses.v4}
  public-key: ${accountData2.config.peers[0].public_key}
  allowed-ips: ['0.0.0.0/0']
  reserved: [${reserved2}]
  udp: true
  mtu: 1200
  remote-dns-resolve: true
  dns: [1.1.1.1, 1.0.0.1]
  
proxy-groups:
- name: Cloudflare
  type: select
  icon: https://developers.cloudflare.com/_astro/logo.p_ySeMR1.svg
  proxies:
    - WARP
    - WARP in WARP
  url: 'http://speed.cloudflare.com/'
  interval: 300`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`ClashWARP_${randomNumber}.yaml`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

document.getElementById('telegramButton').onclick = function() {
    window.location.href = 'https://my-other-projects.vercel.app/';
}


document.getElementById('DonationAlertsButton').onclick = function() {
    window.location.href = 'https://pay.cloudtips.ru/p/209310e4';
}

document.getElementById('BoostyNewButton').onclick = function() {
    window.location.href = 'https://boosty.to/warphelp/donate';
}

document.getElementById('BoostyButton').onclick = function() {
    const newButtons = document.getElementById('newButtons');

    if (newButtons.classList.contains('show')) {
        // Если блок видим, скрываем его с анимацией
        newButtons.classList.remove('show');
        setTimeout(() => {
            this.style.display = 'block'; // Показываем кнопку BoostyButton
        }, 500); // Задержка должна соответствовать длительности анимации
    } else {
        // Если блок скрыт, показываем его с анимацией
        this.style.display = 'none';
        newButtons.classList.add('show');

        // Добавляем задержку перед прокруткой
        setTimeout(() => {
            // Прокручиваем страницу до самого низа
            window.scrollTo({
                top: document.body.scrollHeight, // Прокручиваем до конца страницы
                behavior: 'smooth' // Плавная прокрутка
            });
        }, 300); // Увеличиваем задержку до 500 мс
    }
};


document.getElementById('promoButton').onclick = function() {
    window.location.href = 'https://chatter-bike-3df.notion.site/Amnezia-Premium-1f72684dab0d8013a057ed6562c8bdca';
}

function getSelectedDNS() {
    if (document.getElementById('dns1').checked) {
        return "1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001";
    } else if (document.getElementById('dns2').checked) {
        return "46.226.165.53, 2a12:5940:cf09::2, 64.188.98.242, 2a01:ecc0:2c1:2::2";
    } else if (document.getElementById('dns3').checked) {
        return "176.99.11.77, 80.78.247.254, 2a00:f940:2:4:2::5d1b, 2a00:f940:2:4:2::21ed";
    }
}

function getSelectedSites() {
    const sites = [
        { id: 'st1', ip: '1.0.0.0/9, 1.192.0.0/10, 101.64.0.0/10, 103.0.0.0/14, 103.100.128.0/19, 103.101.0.0/18, 103.103.128.0/17, 103.105.0.0/16, 103.106.192.0/18, 103.107.128.0/17, 103.108.0.0/17, 103.111.128.0/17, 103.111.64.0/19, 103.112.48.0/21, 103.118.64.0/18, 103.119.0.0/16, 103.12.0.0/16, 103.120.0.0/16, 103.122.0.0/15, 103.124.0.0/16, 103.132.16.0/20, 103.132.64.0/18, 103.137.0.0/17, 103.139.128.0/17, 103.14.16.0/20, 103.140.0.0/16, 103.141.64.0/22, 103.144.0.0/16, 103.146.0.0/15, 103.148.0.0/14, 103.15.0.0/16, 103.152.0.0/13, 103.160.0.0/11, 103.17.128.0/17, 103.192.0.0/17, 103.193.0.0/17, 103.196.128.0/17, 103.199.0.0/18, 103.199.192.0/19, 103.199.224.0/21, 103.199.64.0/20, 103.20.0.0/16, 103.200.28.0/22, 103.200.32.0/19, 103.206.128.0/18, 103.21.0.0/17, 103.21.128.0/18, 103.211.104.0/21, 103.211.16.0/20, 103.214.160.0/20, 103.214.192.0/18, 103.218.0.0/16, 103.221.128.0/17, 103.225.176.0/20, 103.225.96.0/19, 103.226.128.0/18, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.232.128.0/19, 103.233.0.0/16, 103.234.0.0/17, 103.240.180.0/22, 103.242.0.0/19, 103.242.128.0/17, 103.243.0.0/18, 103.243.112.0/21, 103.246.240.0/21, 103.249.0.0/16, 103.25.128.0/17, 103.251.0.0/17, 103.251.192.0/18, 103.252.96.0/19, 103.26.208.0/20, 103.27.0.0/17, 103.28.0.0/15, 103.38.0.0/16, 103.39.128.0/17, 103.39.64.0/18, 103.40.0.0/16, 103.41.0.0/19, 103.42.0.0/16, 103.44.0.0/16, 103.52.0.0/16, 103.54.32.0/19, 103.56.0.0/17, 103.58.64.0/18, 103.59.128.0/17, 103.62.128.0/17, 103.66.64.0/18, 103.7.0.0/17, 103.70.0.0/16, 103.73.160.0/21, 103.73.64.0/18, 103.76.192.0/18, 103.80.0.0/17, 103.85.128.0/17, 103.85.64.0/18, 103.88.192.0/19, 103.89.0.0/16, 103.94.128.0/17, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.237.160.0/19, 104.244.40.0/21, 104.36.192.0/21, 105.0.0.0/8, 106.0.0.0/8, 107.181.160.0/19, 108.160.160.0/20, 108.177.0.0/17, 109.224.41.0/24, 109.239.184.0/21, 110.0.0.0/10, 110.128.0.0/10, 110.64.0.0/12, 110.93.128.0/17, 111.0.0.0/8, 112.0.0.0/8, 113.128.0.0/10, 113.192.0.0/13, 113.64.0.0/10, 114.0.0.0/9, 114.136.0.0/13, 114.250.63.0/24, 114.250.64.0/23, 114.250.67.0/24, 114.250.69.0/24, 114.250.70.0/24, 115.126.0.0/15, 115.164.0.0/15, 115.176.0.0/12, 115.64.0.0/11, 116.204.128.0/18, 116.206.0.0/18, 116.206.128.0/19, 116.212.128.0/19, 116.56.0.0/13, 116.64.0.0/10, 117.0.0.0/12, 117.128.0.0/9, 117.52.0.0/15, 117.55.224.0/19, 117.96.0.0/12, 118.107.180.0/22, 118.128.0.0/9, 118.68.0.0/14, 118.96.0.0/13, 119.0.0.0/13, 119.152.0.0/13, 119.16.0.0/12, 119.160.0.0/11, 119.32.0.0/11, 120.0.0.0/8, 121.64.0.0/12, 122.0.0.0/10, 122.144.0.0/14, 122.152.0.0/13, 122.192.0.0/11, 122.248.0.0/14, 122.252.0.0/15, 123.104.0.0/13, 123.128.0.0/10, 123.192.0.0/11, 123.240.0.0/13, 123.253.0.0/18, 124.0.0.0/9, 124.192.0.0/11, 124.248.0.0/14, 125.128.0.0/9, 125.64.0.0/10, 128.0.0.0/16, 128.121.0.0/16, 128.242.0.0/16, 128.75.0.0/16, 130.211.0.0/16, 137.59.16.0/20, 137.59.32.0/20, 137.59.64.0/18, 139.5.64.0/19, 14.102.128.0/18, 14.128.0.0/9, 140.213.0.0/16, 142.161.0.0/16, 142.250.0.0/15, 144.48.128.0/18, 145.236.72.0/23, 145.255.0.0/20, 148.163.0.0/17, 148.64.96.0/20, 148.69.0.0/16, 149.54.0.0/17, 150.107.0.0/18, 150.107.204.0/22, 150.129.0.0/21, 150.129.32.0/19, 150.129.96.0/19, 154.0.0.0/13, 154.64.0.0/10, 156.233.0.0/16, 157.20.0.0/16, 157.240.0.0/16, 157.8.0.0/14, 159.106.0.0/16, 159.138.0.0/16, 159.192.0.0/16, 159.65.0.0/16, 161.49.0.0/17, 162.125.0.0/16, 162.220.8.0/21, 162.252.180.0/22, 163.40.0.0/13, 163.53.64.0/18, 164.215.0.0/16, 165.165.0.0/16, 165.21.0.0/16, 166.70.0.0/16, 168.143.0.0/16, 170.238.0.0/16, 171.128.0.0/9, 171.96.0.0/11, 172.217.0.0/16, 172.253.0.0/16, 172.64.0.0/13, 173.194.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.234.32.0/19, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 175.104.0.0/14, 175.112.0.0/12, 175.96.0.0/13, 176.28.128.0/17, 177.64.0.0/12, 178.151.230.0/24, 178.176.156.0/24, 178.22.168.0/24, 179.32.0.0/12, 179.60.0.0/16, 179.64.0.0/10, 180.149.224.0/19, 180.149.48.0/20, 180.149.64.0/18, 180.160.0.0/11, 180.192.0.0/11, 181.0.0.0/11, 181.208.0.0/14, 182.0.0.0/9, 182.176.0.0/12, 182.192.0.0/10, 183.0.0.0/8, 184.150.0.0/17, 184.150.128.0/18, 184.172.0.0/15, 184.72.0.0/15, 185.100.209.0/24, 185.158.208.0/23, 185.192.248.0/26, 185.192.249.0/24, 185.192.251.192/26, 185.23.124.0/23, 185.45.4.0/22, 185.48.9.0/24, 185.5.161.0/26, 185.60.216.0/22, 185.61.94.0/23, 186.128.0.0/9, 187.0.0.0/11, 187.128.0.0/9, 188.114.96.0/22, 188.120.127.0/24, 188.21.9.0/24, 188.43.61.0/24, 188.43.68.0/23, 188.93.174.0/24, 189.128.0.0/9, 190.0.0.0/10, 190.224.0.0/11, 192.133.76.0/22, 192.135.88.0/21, 192.178.0.0/15, 192.248.0.0/17, 192.86.0.0/24, 193.109.164.0/22, 193.126.242.0/26, 194.78.0.0/24, 194.9.24.0/24, 194.9.25.0/24, 195.12.177.0/26, 195.176.255.192/26, 195.187.0.0/16, 195.87.177.0/24, 195.95.178.0/24, 196.1.128.0/17, 196.128.0.0/9, 196.32.0.0/11, 197.0.0.0/8, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.85.224.0/21, 199.96.56.0/21, 200.96.0.0/11, 201.0.0.0/11, 201.160.0.0/11, 201.48.0.0/16, 202.128.0.0/14, 202.136.0.0/13, 202.148.0.0/14, 202.152.0.0/13, 202.160.0.0/15, 202.163.0.0/16, 202.165.0.0/16, 202.166.0.0/15, 202.168.0.0/15, 202.182.0.0/15, 202.184.0.0/13, 202.24.0.0/13, 202.39.0.0/16, 202.51.64.0/21, 202.51.72.0/22, 202.51.79.0/24, 202.52.0.0/14, 202.60.0.0/16, 202.64.0.0/14, 202.68.0.0/15, 202.70.0.0/16, 202.72.0.0/14, 202.79.0.0/17, 202.80.0.0/13, 202.88.0.0/14, 202.93.0.0/16, 203.101.0.0/16, 203.110.0.0/15, 203.112.0.0/12, 203.128.0.0/12, 203.144.0.0/13, 203.162.0.0/15, 203.167.0.0/16, 203.170.0.0/16, 203.171.128.0/17, 203.176.0.0/13, 203.184.0.0/14, 203.189.0.0/17, 203.192.0.0/10, 203.64.0.0/13, 203.76.0.0/15, 203.78.0.0/17, 203.80.0.0/13, 204.145.2.0/23, 204.79.196.0/23, 204.84.0.0/15, 205.186.128.0/18, 206.144.0.0/14, 207.231.168.0/21, 208.0.0.0/11, 208.101.0.0/18, 208.110.64.0/19, 208.187.128.0/17, 208.192.0.0/10, 208.43.0.0/16, 208.54.0.0/17, 208.77.40.0/21, 208.84.220.0/22, 208.98.128.0/18, 209.115.128.0/17, 209.141.112.0/20, 209.145.96.0/19, 209.146.0.0/17, 209.148.128.0/17, 209.191.192.0/19, 209.52.0.0/15, 209.85.128.0/17, 209.91.64.0/18, 209.95.32.0/19, 210.0.0.0/7, 212.106.200.0/21, 212.113.52.0/24, 212.156.0.0/16, 212.188.10.0/24, 212.188.34.0/24, 212.188.35.0/24, 212.188.37.0/24, 212.188.49.0/24, 212.20.18.0/24, 212.39.86.0/24, 212.43.1.0/24, 212.43.8.0/21, 212.55.184.0/22, 212.90.48.0/20, 213.152.1.64/27, 213.202.0.0/21, 213.55.64.0/18, 213.59.192.0/18, 216.105.64.0/20, 216.123.192.0/18, 216.19.176.0/20, 216.239.32.0/19, 216.58.192.0/19, 217.119.118.64/26, 217.130.7.0/25, 217.175.200.64/26, 217.197.248.0/23, 217.73.128.0/22, 218.0.0.0/7, 220.0.0.0/9, 220.160.0.0/11, 221.0.0.0/8, 222.0.0.0/8, 223.128.0.0/9, 223.25.128.0/17, 223.27.128.0/17, 223.32.0.0/11, 23.142.48.0/24, 23.152.160.0/24, 23.192.0.0/11, 23.224.0.0/15, 23.234.0.0/18, 23.96.0.0/13, 24.244.0.0/18, 27.112.0.0/13, 27.128.0.0/9, 27.2.0.0/15, 27.64.0.0/11, 27.96.0.0/12, 31.13.64.0/18, 31.145.0.0/16, 34.64.0.0/10, 36.0.0.0/9, 37.152.0.0/22, 38.0.0.0/7, 4.0.0.0/9, 40.136.0.0/15, 41.0.0.0/8, 42.0.0.0/8, 43.224.0.0/16, 43.226.16.0/20, 43.228.0.0/16, 43.230.128.0/21, 43.245.128.0/20, 43.245.144.0/21, 43.245.192.0/20, 43.245.96.0/20, 43.250.0.0/16, 43.252.16.0/21, 45.112.128.0/18, 45.113.128.0/18, 45.114.8.0/21, 45.116.192.0/19, 45.116.224.0/20, 45.118.240.0/21, 45.121.128.0/17, 45.124.0.0/18, 45.127.0.0/17, 45.14.108.0/22, 45.249.0.0/16, 45.253.0.0/16, 45.54.0.0/17, 45.64.0.0/16, 45.76.0.0/15, 46.134.192.0/18, 46.32.101.0/24, 46.36.112.0/20, 46.61.0.0/16, 47.88.0.0/14, 49.192.0.0/11, 49.224.0.0/13, 49.32.0.0/11, 5.195.0.0/16, 5.21.228.0/22, 5.30.0.0/15, 5.32.175.0/24, 50.0.0.0/15, 50.117.0.0/17, 50.128.0.0/9, 50.22.0.0/15, 50.87.0.0/16, 51.39.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 54.144.0.0/12, 54.224.0.0/11, 54.64.0.0/11, 58.0.0.0/10, 58.112.0.0/12, 58.128.0.0/9, 58.64.0.0/11, 59.0.0.0/9, 59.152.0.0/18, 59.152.96.0/20, 59.153.128.0/17, 59.160.0.0/11, 61.0.0.0/13, 61.128.0.0/9, 61.16.0.0/12, 61.32.0.0/11, 61.64.0.0/10, 62.0.0.0/16, 62.149.96.0/20, 62.212.240.0/20, 62.231.75.0/24, 63.64.0.0/10, 64.13.192.0/18, 64.15.112.0/20, 64.233.160.0/19, 64.4.224.0/20, 64.53.128.0/17, 65.192.0.0/11, 65.240.0.0/13, 65.49.0.0/17, 66.102.0.0/20, 66.112.176.0/20, 66.220.144.0/20, 66.248.254.0/24, 66.58.128.0/17, 66.96.224.0/19, 67.15.0.0/16, 67.204.128.0/18, 67.228.0.0/16, 67.230.160.0/19, 67.50.0.0/17, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.48.216.0/21, 69.50.192.0/19, 69.51.64.0/18, 69.59.192.0/19, 69.63.176.0/20, 72.19.32.0/19, 72.234.0.0/15, 74.125.0.0/16, 74.86.0.0/16, 75.126.0.0/16, 75.98.144.0/20, 77.120.12.0/22, 77.37.252.0/23, 79.133.76.0/23, 80.253.29.0/24, 80.77.172.0/22, 80.87.198.0/23, 80.87.64.0/19, 80.97.192.0/18, 81.130.96.0/20, 81.192.0.0/16, 81.200.2.0/24, 81.23.16.0/21, 81.23.24.0/21, 81.27.242.128/27, 82.114.162.0/23, 82.147.133.128/26, 82.148.96.0/19, 82.76.231.64/26, 83.219.145.0/24, 83.224.64.0/20, 84.15.64.0/24, 84.235.64.0/22, 84.235.77.0/24, 84.235.78.0/24, 85.112.112.0/20, 86.120.7.128/27, 86.62.126.64/27, 87.245.192.0/20, 87.245.216.0/21, 88.191.249.0/24, 88.201.0.0/17, 89.27.128.0/17, 90.180.0.0/14, 90.200.0.0/14, 91.185.2.0/24, 92.80.0.0/13, 93.123.23.0/24, 93.179.96.0/21, 94.142.38.0/24, 94.203.108.0/23, 94.24.192.0/18, 94.31.189.0/24, 94.96.0.0/14, 95.142.107.0/27, 95.167.73.0/24, 95.168.192.0/19, 95.59.170.0/24, 95.66.0.0/18, 96.30.64.0/18, 96.44.128.0/18, 96.63.128.0/19, 96.9.128.0/19, 98.159.96.0/20' },
        { id: 'st2', ip: '103.224.0.0/16, 104.16.0.0/12, 108.136.0.0/14, 108.156.0.0/14, 13.224.0.0/12, 13.248.0.0/14, 13.32.0.0/12, 138.128.136.0/21, 143.204.0.0/16, 15.196.0.0/14, 15.204.0.0/16, 162.158.0.0/15, 162.210.192.0/21, 170.178.160.0/19, 172.64.0.0/13, 18.128.0.0/9, 18.64.0.0/10, 185.107.56.0/24, 188.114.96.0/22, 192.157.48.0/20, 199.115.112.0/21, 204.11.56.0/23, 207.244.64.0/18, 208.91.196.0/23, 216.137.32.0/19, 23.227.32.0/19, 3.128.0.0/9, 34.0.0.0/15, 34.2.0.0/15, 35.192.0.0/12, 35.208.0.0/12, 37.1.216.0/21, 37.48.64.0/18, 45.134.10.0/24, 5.200.14.128/25, 51.81.0.0/16, 52.222.0.0/16, 52.84.0.0/14, 65.8.0.0/14, 66.22.192.0/18, 69.162.64.0/18, 70.32.0.0/20, 74.63.192.0/18, 76.223.0.0/17, 8.0.0.0/13, 8.32.0.0/11, 82.192.64.0/19' },
        { id: 'st3', ip: '104.16.0.0/12, 104.244.40.0/21, 146.75.0.0/16, 151.101.0.0/16, 152.192.0.0/13, 162.158.0.0/15, 172.64.0.0/13, 192.229.128.0/17, 199.232.0.0/16, 209.237.192.0/19, 68.232.32.0/20, 69.195.160.0/19, 93.184.220.0/22' },
        { id: 'st4', ip: '102.0.0.0/8, 103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19, 103.39.64.0/18, 103.42.0.0/16, 103.56.0.0/17, 103.73.160.0/21, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.244.40.0/21, 107.181.160.0/19, 108.160.160.0/20, 111.0.0.0/8, 114.0.0.0/10, 115.126.0.0/15, 116.64.0.0/10, 118.107.180.0/22, 118.128.0.0/9, 119.16.0.0/12, 122.0.0.0/10, 122.248.0.0/14, 124.0.0.0/9, 128.121.0.0/16, 128.242.0.0/16, 129.134.0.0/16, 130.211.0.0/16, 148.163.0.0/17, 150.107.0.0/18, 154.64.0.0/10, 156.233.0.0/16, 157.240.0.0/16, 159.106.0.0/16, 159.138.0.0/16, 159.65.0.0/16, 162.125.0.0/16, 162.220.8.0/21, 163.70.128.0/17, 168.143.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.234.32.0/19, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 179.60.0.0/16, 182.0.0.0/9, 184.172.0.0/15, 184.72.0.0/15, 185.45.4.0/22, 185.60.216.0/22, 192.133.76.0/22, 195.229.0.0/16, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.96.56.0/21, 202.160.0.0/15, 202.182.0.0/15, 202.52.0.0/14, 203.110.0.0/15, 204.79.196.0/23, 205.186.128.0/18, 208.0.0.0/11, 208.101.0.0/18, 208.43.0.0/16, 208.77.40.0/21, 209.95.32.0/19, 210.0.0.0/7, 212.95.183.192/26, 213.169.57.64/26, 23.224.0.0/15, 23.234.0.0/18, 23.96.0.0/13, 31.13.64.0/18, 38.0.0.0/7, 4.0.0.0/9, 43.226.16.0/20, 45.114.8.0/21, 45.76.0.0/15, 47.88.0.0/14, 50.117.0.0/17, 50.22.0.0/15, 50.87.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 54.224.0.0/11, 54.64.0.0/11, 57.0.0.0/8, 59.0.0.0/9, 59.160.0.0/11, 64.13.192.0/18, 65.49.0.0/17, 66.220.144.0/20, 67.15.0.0/16, 67.228.0.0/16, 67.230.160.0/19, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.50.192.0/19, 69.63.176.0/20, 74.86.0.0/16, 75.126.0.0/16, 80.87.198.0/23, 87.245.208.0/20, 88.191.249.0/24, 93.179.96.0/21, 96.44.128.0/18, 98.159.96.0/20' },
        { id: 'st5', ip: '102.0.0.0/8, 103.200.28.0/22, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19, 103.42.0.0/16, 103.56.0.0/17, 103.73.160.0/21, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.244.40.0/21, 104.64.0.0/10, 107.181.160.0/19, 108.160.160.0/20, 111.0.0.0/8, 112.0.0.0/8, 114.0.0.0/10, 115.126.0.0/15, 116.64.0.0/10, 118.107.180.0/22, 118.128.0.0/9, 119.16.0.0/12, 122.0.0.0/10, 122.248.0.0/14, 124.0.0.0/9, 128.121.0.0/16, 128.242.0.0/16, 129.134.0.0/16, 13.104.0.0/14, 148.163.0.0/17, 150.107.0.0/18, 152.192.0.0/13, 154.64.0.0/10, 156.233.0.0/16, 157.240.0.0/16, 159.106.0.0/16, 159.138.0.0/16, 159.65.0.0/16, 162.125.0.0/16, 162.220.8.0/21, 163.70.128.0/17, 168.143.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 179.60.0.0/16, 182.0.0.0/9, 184.172.0.0/15, 184.24.0.0/13, 184.50.0.0/15, 184.72.0.0/15, 185.45.4.0/22, 185.60.216.0/22, 192.133.76.0/22, 195.229.0.0/16, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.96.56.0/21, 2.16.102.0/23, 2.16.154.0/24, 2.16.16.0/23, 2.16.168.0/23, 2.16.172.0/23, 2.16.52.0/23, 2.17.251.0/24, 2.18.16.0/20, 2.18.64.0/20, 2.19.192.0/24, 2.19.204.0/22, 2.20.45.0/24, 2.21.244.0/23, 2.22.61.0/24, 2.23.144.0/20, 2.23.96.0/20, 202.160.0.0/15, 202.182.0.0/15, 202.52.0.0/14, 203.110.0.0/15, 205.186.128.0/18, 208.0.0.0/11, 208.101.0.0/18, 208.43.0.0/16, 208.77.40.0/21, 209.95.32.0/19, 210.0.0.0/7, 212.95.165.0/26, 213.155.157.0/24, 23.0.0.0/12, 23.192.0.0/11, 23.224.0.0/15, 23.234.0.0/18, 23.32.0.0/11, 23.72.0.0/13, 23.96.0.0/13, 31.13.64.0/18, 38.0.0.0/7, 4.0.0.0/9, 43.226.16.0/20, 45.114.8.0/21, 45.76.0.0/15, 47.88.0.0/14, 50.117.0.0/17, 50.22.0.0/15, 50.87.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 54.224.0.0/11, 54.64.0.0/11, 57.0.0.0/8, 59.0.0.0/9, 59.160.0.0/11, 62.115.252.0/24, 62.115.253.0/24, 64.13.192.0/18, 65.49.0.0/17, 66.220.144.0/20, 67.15.0.0/16, 67.228.0.0/16, 67.230.160.0/19, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.50.192.0/19, 69.63.176.0/20, 72.246.0.0/15, 74.86.0.0/16, 75.126.0.0/16, 80.67.82.0/24, 80.87.198.0/23, 88.191.249.0/24, 88.221.110.0/24, 88.221.111.0/24, 88.221.128.0/21, 92.122.100.0/22, 92.122.224.0/21, 92.123.96.0/20, 93.179.96.0/21, 95.100.128.0/20, 95.100.176.0/20, 95.101.108.0/22, 95.101.20.0/22, 95.101.35.0/24, 95.101.72.0/22, 95.101.76.0/22, 96.44.128.0/18, 98.159.96.0/20' },
        { id: 'st6', ip: '100.24.0.0/13, 103.224.0.0/16, 104.16.0.0/12, 104.64.0.0/10, 107.20.0.0/14, 108.136.0.0/14, 108.156.0.0/14, 108.177.0.0/17, 13.208.0.0/12, 13.224.0.0/12, 13.248.0.0/14, 13.32.0.0/12, 136.143.176.0/20, 139.162.0.0/16, 142.250.0.0/15, 143.204.0.0/16, 15.184.0.0/14, 15.196.0.0/14, 152.228.128.0/17, 16.24.0.0/13, 172.104.0.0/15, 172.217.0.0/16, 172.64.0.0/13, 173.194.0.0/16, 173.222.0.0/15, 174.129.0.0/16, 18.128.0.0/9, 18.64.0.0/10, 184.24.0.0/13, 184.50.0.0/15, 184.72.0.0/15, 185.199.108.0/22, 185.53.177.0/24, 188.114.96.0/22, 192.155.80.0/20, 194.90.0.0/16, 199.59.240.0/22, 199.60.103.0/24, 2.19.16.0/20, 2.20.16.0/22, 2.20.208.0/20, 2.21.192.0/20, 2.22.128.0/20, 204.141.0.0/16, 204.236.128.0/17, 209.85.128.0/17, 216.137.32.0/19, 216.198.0.0/18, 216.58.192.0/19, 23.0.0.0/12, 23.192.0.0/11, 23.20.0.0/14, 23.239.0.0/19, 23.32.0.0/11, 23.64.0.0/14, 3.0.0.0/9, 3.128.0.0/9, 34.192.0.0/10, 34.64.0.0/10, 35.152.0.0/13, 35.160.0.0/12, 35.176.0.0/13, 37.59.32.0/19, 44.192.0.0/10, 50.16.0.0/14, 51.24.0.0/16, 51.91.18.0/24, 52.0.0.0/10, 52.192.0.0/12, 52.208.0.0/13, 52.222.0.0/16, 52.64.0.0/12, 52.84.0.0/14, 54.144.0.0/12, 54.160.0.0/11, 54.192.0.0/12, 54.208.0.0/13, 54.220.0.0/15, 54.224.0.0/11, 54.38.0.0/16, 54.64.0.0/11, 64.233.160.0/19, 65.8.0.0/14, 66.175.208.0/20, 67.202.0.0/18, 69.192.0.0/16, 72.44.32.0/19, 74.125.0.0/16, 74.207.224.0/19, 75.101.128.0/17, 8.0.0.0/13, 8.32.0.0/11, 88.221.68.0/22, 88.221.96.0/22, 92.122.12.0/22, 92.122.68.0/22, 92.123.160.0/21, 92.123.176.0/22, 95.100.224.0/20, 95.100.48.0/20, 95.213.180.0/23, 96.16.0.0/15, 96.6.0.0/15, 98.80.0.0/12, 99.83.128.0/17, 99.84.0.0/16, 99.86.0.0/16' },
        { id: 'st7', ip: '104.16.0.0/12, 162.158.0.0/15, 172.64.0.0/13, 185.81.128.0/23, 188.114.96.0/22' },
        { id: 'st8', ip: '162.19.0.0/16, 186.2.165.0/24, 188.124.37.0/24, 188.165.24.0/21, 54.36.0.0/15, 94.23.152.0/21, 95.129.232.0/24' },
        { id: 'st9', ip: '104.16.0.0/12, 172.64.0.0/13, 185.178.208.0/22, 49.13.80.0/20' },
        { id: 'st10', ip: '103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19, 103.39.64.0/18, 103.42.0.0/16, 103.56.0.0/17, 103.73.160.0/21, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.244.40.0/21, 107.181.160.0/19, 108.160.160.0/20, 111.0.0.0/8, 114.0.0.0/10, 115.126.0.0/15, 116.64.0.0/10, 118.107.180.0/22, 118.128.0.0/9, 119.16.0.0/12, 122.0.0.0/10, 122.248.0.0/14, 124.0.0.0/9, 128.121.0.0/16, 128.242.0.0/16, 130.211.0.0/16, 148.163.0.0/17, 150.107.0.0/18, 154.64.0.0/10, 156.233.0.0/16, 157.240.0.0/16, 159.106.0.0/16, 159.138.0.0/16, 159.65.0.0/16, 162.125.0.0/16, 162.220.8.0/21, 168.143.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.234.32.0/19, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 179.60.0.0/16, 182.0.0.0/9, 184.172.0.0/15, 184.72.0.0/15, 185.45.4.0/22, 185.60.216.0/22, 192.133.76.0/22, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.96.56.0/21, 202.160.0.0/15, 202.182.0.0/15, 202.52.0.0/14, 203.110.0.0/15, 204.79.196.0/23, 205.186.128.0/18, 208.0.0.0/11, 208.101.0.0/18, 208.43.0.0/16, 208.77.40.0/21, 209.95.32.0/19, 210.0.0.0/7, 23.224.0.0/15, 23.234.0.0/18, 23.96.0.0/13, 31.13.64.0/18, 38.0.0.0/7, 4.0.0.0/9, 43.226.16.0/20, 45.114.8.0/21, 45.76.0.0/15, 47.88.0.0/14, 50.117.0.0/17, 50.22.0.0/15, 50.87.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 54.224.0.0/11, 54.64.0.0/11, 59.0.0.0/9, 59.160.0.0/11, 64.13.192.0/18, 65.49.0.0/17, 66.220.144.0/20, 67.15.0.0/16, 67.228.0.0/16, 67.230.160.0/19, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.50.192.0/19, 69.63.176.0/20, 74.86.0.0/16, 75.126.0.0/16, 80.87.198.0/23, 88.191.249.0/24, 93.179.96.0/21, 96.44.128.0/18, 98.159.96.0/20' },
		{ id: 'st11', ip: '104.16.0.0/12, 136.243.0.0/16, 146.255.0.0/16, 152.89.28.0/23, 162.255.116.0/22, 172.64.0.0/13, 176.58.38.0/23, 176.58.40.0/24, 176.58.41.0/24, 176.58.42.0/24, 176.58.45.0/24, 176.58.48.0/23, 176.58.50.0/24, 176.58.56.0/24, 176.58.57.0/24, 178.63.75.0/26, 179.32.0.0/12, 185.190.188.0/24, 185.190.190.0/24, 199.59.240.0/22, 199.80.52.0/22, 212.124.124.0/25, 212.124.96.0/24, 45.10.216.0/23, 5.45.76.0/22, 5.45.84.0/22, 5.9.51.64/27, 82.221.104.144/29, 82.221.105.0/24, 85.217.222.0/24, 89.105.207.64/26, 91.132.188.0/23' }
		//{ id: 'st', ip: '' },//
	];

    const selectedSites = sites.filter(site => document.getElementById(site.id).checked);
    
    if (selectedSites.length === 0) {
        return "0.0.0.0/0, ::/0"; // default
    } else {
        const ips = selectedSites.map(site => site.ip).join(', ');
        return ips; 
    }
}

const modal = document.getElementById("infoModal");
const infoBtn = document.getElementById("infoButton");
const span = document.getElementsByClassName("close")[0];

infoBtn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
