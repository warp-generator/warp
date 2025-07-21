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
    const prefixes = ["188.114.96.", "188.114.97.", "188.114.98.", "188.114.99.", "162.159.192.", "162.159.195."];
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

// Show Copy Success or Error Message
const showCopyMessage = (messageId, message) => {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.classList.add('visible');
        setTimeout(() => {
            messageElement.classList.remove('visible');
            messageElement.textContent = '';
        }, 2000);
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
		const wireGuardText = `[Interface]
PrivateKey = ${privateKey}
Address = ${accountData.config.interface.addresses.v4}, ${accountData.config.interface.addresses.v6}
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001
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
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = 188.114.99.224:1002`;
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
		const wireGuardText = `[Interface]
PrivateKey = ${privateKey}
Address = ${accountData.config.interface.addresses.v4}, ${accountData.config.interface.addresses.v6}
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001
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
AllowedIPs = 0.0.0.0/0, ::/0
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
		const wireGuardText = `[Interface]
PrivateKey = ${privateKey}
Address = ${accountData.config.interface.addresses.v4}, ${accountData.config.interface.addresses.v6}
DNS = 1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001
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
AllowedIPs = 0.0.0.0/0, ::/0
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
    downloadConfig(`Скачать WARPinWARP_${randomNumber}.conf`, content);
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
    window.location.href = 'https://t.me/warp_1_1_1_1';
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


document.getElementById('githubButton').onclick = function() {
    window.location.href = 'https://chatter-bike-3df.notion.site/1f72684dab0d8092a582ed6328632d06';
}

document.getElementById('promoButton').onclick = function() {
    window.location.href = 'https://chatter-bike-3df.notion.site/Amnezia-Premium-1f72684dab0d8013a057ed6562c8bdca';
}