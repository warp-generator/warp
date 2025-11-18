const AWG = document.querySelector('.get-btn1');
const AWGm1 = document.querySelector('.get-btn2');
const AWGm2 = document.querySelector('.get-btn3');
const AWGm3 = document.querySelector('.get-btn4');
const Clash = document.querySelector('.get-btn5');
const Throne = document.querySelector('.get-btn6');
const Neko = document.querySelector('.get-btn7');
const Husi = document.querySelector('.get-btn8');
const Karing = document.querySelector('.get-btn9');
const WireSock = document.querySelector('.get-btn10');
const wireGuardConfig = document.querySelector('.wire-guard-config');
const container = document.querySelector('.container');

function generateRandomEndpoint() {
    const prefixes = ["162.159.192.", "162.159.195.", "engage.cloudflareclient.com"];
    const ports = [4500, 2408, 1701, 500];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const port = ports[Math.floor(Math.random() * ports.length)];

    if (prefix === "engage.cloudflareclient.com") {
        return `${prefix}:${port}`;
    } else {
        return `${prefix}${randomNumber}:${port}`;
    }
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

// AWG
AWG.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton1');
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
		const randomEndpoint = generateRandomEndpoint();
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

// AWGm1
AWGm1.addEventListener('click', async () => {
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
I1 = <b 0xc10000000114367096bb0fb3f58f3a3fb8aaacd61d63a1c8a40e14f7374b8a62dccba6431716c3abf6f5afbcfb39bd008000047c32e268567c652e6f4db58bff759bc8c5aaca183b87cb4d22938fe7d8dca22a679a79e4d9ee62e4bbb3a380dd78d4e8e48f26b38a1d42d76b371a5a9a0444827a69d1ab5872a85749f65a4104e931740b4dc1e2dd77733fc7fac4f93011cd622f2bb47e85f71992e2d585f8dc765a7a12ddeb879746a267393ad023d267c4bd79f258703e27345155268bd3cc0506ebd72e2e3c6b5b0f005299cd94b67ddabe30389c4f9b5c2d512dcc298c14f14e9b7f931e1dc397926c31fbb7cebfc668349c218672501031ecce151d4cb03c4c660b6c6fe7754e75446cd7de09a8c81030c5f6fb377203f551864f3d83e27de7b86499736cbbb549b2f37f436db1cae0a4ea39930f0534aacdd1e3534bc87877e2afabe959ced261f228d6362e6fd277c88c312d966c8b9f67e4a92e757773db0b0862fb8108d1d8fa262a40a1b4171961f0704c8ba314da2482ac8ed9bd28d4b50f7432d89fd800c25a50c5e2f5c0710544fef5273401116aa0572366d8e49ad758fcb29e6a92912e644dbe227c247cb3417eabfab2db16796b2fba420de3b1dc94e8361f1f324a331ddaf1e626553138860757fd0bf687566108b77b70fb9f8f8962eca599c4a70ed373666961a8cb506b96756d9e28b94122b20f16b54f118c0e603ce0b831efea614ad836df6cf9affbdd09596412547496967da758cec9080295d853b0861670b71d9abde0d562b1a6de82782a5b0c14d297f27283a895abc889a5f6703f0e6eb95f67b2da45f150d0d8ab805612d570c2d5cb6997ac3a7756226c2f5c8982ffbd480c5004b0660a3c9468945efde90864019a2b519458724b55d766e16b0da25c0557c01f3c11ddeb024b62e303640e17fdd57dedb3aeb4a2c1b7c93059f9c1d7118d77caac1cd0f6556e46cbc991c1bb16970273dea833d01e5090d061a0c6d25af2415cd2878af97f6d0e7f1f936247b394ecb9bd484da6be936dee9b0b92dc90101a1b4295e97a9772f2263eb09431995aa173df4ca2abd687d87706f0f93eaa5e13cbe3b574fa3cfe94502ace25265778da6960d561381769c24e0cbd7aac73c16f95ae74ff7ec38124f7c722b9cb151d4b6841343f29be8f35145e1b27021056820fed77003df8554b4155716c8cf6049ef5e318481460a8ce3be7c7bfac695255be84dc491c19e9dedc449dd3471728cd2a3ee51324ccb3eef121e3e08f8e18f0006ea8957371d9f2f739f0b89e4db11e5c6430ada61572e589519fbad4498b460ce6e4407fc2d8f2dd4293a50a0cb8fcaaf35cd9a8cc097e3603fbfa08d9036f52b3e7fcce11b83ad28a4ac12dba0395a0cc871cefd1a2856fffb3f28d82ce35cf80579974778bab13d9b3578d8c75a2d196087a2cd439aff2bb33f2db24ac175fff4ed91d36a4cdbfaf3f83074f03894ea40f17034629890da3efdbb41141b38368ab532209b69f057ddc559c19bc8ae62bf3fd564c9a35d9a83d14a95834a92bae6d9a29ae5e8ece07910d16433e4c6230c9bd7d68b47de0de9843988af6dc88b5301820443bd4d0537778bf6b4c1dd067fcf14b81015f2a67c7f2a28f9cb7e0684d3cb4b1c24d9b343122a086611b489532f1c3a26779da1706c6759d96d8ab>

[Peer]
PublicKey = ${accountData.config.peers[0].public_key}
AllowedIPs = ${allowedIPs}
Endpoint = engage.cloudflareclient.com:4500`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
	
    downloadConfig(`WARPm1_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
	
});

// AWGm2
AWGm2.addEventListener('click', async () => {
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
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4
I1 = <b 0xc2000000011419fa4bb3599f336777de79f81ca9a8d80d91eeec000044c635cef024a885dcb66d1420a91a8c427e87d6cf8e08b563932f449412cddf77d3e2594ea1c7a183c238a89e9adb7ffa57c133e55c59bec101634db90afb83f75b19fe703179e26a31902324c73f82d9354e1ed8da39af610afcb27e6590a44341a0828e5a3d2f0e0f7b0945d7bf3402feea0ee6332e19bdf48ffc387a97227aa97b205a485d282cd66d1c384bafd63dc42f822c4df2109db5b5646c458236ddcc01ae1c493482128bc0830c9e1233f0027a0d262f92b49d9d8abd9a9e0341f6e1214761043c021d7aa8c464b9d865f5fbe234e49626e00712031703a3e23ef82975f014ee1e1dc428521dc23ce7c6c13663b19906240b3efe403cf30559d798871557e4e60e86c29ea4504ed4d9bb8b549d0e8acd6c334c39bb8fb42ede68fb2aadf00cfc8bcc12df03602bbd4fe701d64a39f7ced112951a83b1dbbe6cd696dd3f15985c1b9fef72fa8d0319708b633cc4681910843ce753fac596ed9945d8b839aeff8d3bf0449197bd0bb22ab8efd5d63eb4a95db8d3ffc796ed5bcf2f4a136a8a36c7a0c65270d511aebac733e61d414050088a1c3d868fb52bc7e57d3d9fd132d78b740a6ecdc6c24936e92c28672dbe00928d89b891865f885aeb4c4996d50c2bbbb7a99ab5de02ac89b3308e57bcecf13f2da0333d1420e18b66b4c23d625d836b538fc0c221d6bd7f566a31fa292b85be96041d8e0bfe655d5dc1afed23eb8f2b3446561bbee7644325cc98d31cea38b865bdcc507e48c6ebdc7553be7bd6ab963d5a14615c4b81da7081c127c791224853e2d19bafdc0d9f3f3a6de898d14abb0e2bc849917e0a599ed4a541268ad0e60ea4d147dc33d17fa82f22aa505ccb53803a31d10a7ca2fea0b290a52ee92c7bf4aab7cea4e3c07b1989364eed87a3c6ba65188cd349d37ce4eefde9ec43bab4b4dc79e03469c2ad6b902e28e0bbbbf696781ad4edf424ffb35ce0236d373629008f142d04b5e08a124237e03e3149f4cdde92d7fae581a1ac332e26b2c9c1a6bdec5b3a9c7a2a870f7a0c25fc6ce245e029b686e346c6d862ad8df6d9b62474fbc31dbb914711f78074d4441f4e6e9edca3c52315a5c0653856e23f681558d669f4a4e6915bcf42b56ce36cb7dd3983b0b1d6fdf0f8efddb68e7ca0ae9dd4570fe6978fbb524109f6ec957ca61f1767ef74eb803b0f16abd0087cf2d01bc1db1c01d97ac81b3196c934586963fe7cf2d310e0739621e8bd00dc23fded18576d8c8f285d7bb5f43b547af3c76235de8b6f757f817683b2151600b11721219212bf27558edd439e73fce951f61d582320e5f4d6c315c71129b719277fc144bbe8ded25ab6d29b6e189c9bd9b16538faf60cc2aab3c3bb81fc2213657f2dd0ceb9b3b871e1423d8d3e8cc008721ef03b28e0ee7bb66b8f2a2ac01ef88df1f21ed49bf1ce435df31ac34485936172567488812429c269b49ee9e3d99652b51a7a614b7c460bf0d2d64d8349ded7345bedab1ea0a766a8470b1242f38d09f7855a32db39516c2bd4bcc538c52fa3a90c8714d4b006a15d9c7a7d04919a1cab48da7cce0d5de1f9e5f8936cffe469132991c6eb84c5191d1bcf69f70c58d9a7b66846440a9f0eef25ee6ab62715b50ca7bef0bc3013d4b62e1639b5028bdf757454356e9326a4c76dabfb497d451a3a1d2dbd46ec283d255799f72dfe878ae25892e25a2542d3ca9018394d8ca35b53ccd94947a8>

[Peer]
PublicKey = ${accountData.config.peers[0].public_key}
AllowedIPs = ${allowedIPs}
Endpoint = engage.cloudflareclient.com:4500`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`WARPm2_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// AWGm3
AWGm3.addEventListener('click', async () => {
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
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4
I1 = <b 0x494e56495445207369703a626f624062696c6f78692e636f6d205349502f322e300d0a5669613a205349502f322e302f55445020706333332e61746c616e74612e636f6d3b6272616e63683d7a39684734624b3737366173646864730d0a4d61782d466f7277617264733a2037300d0a546f3a20426f62203c7369703a626f624062696c6f78692e636f6d3e0d0a46726f6d3a20416c696365203c7369703a616c6963654061746c616e74612e636f6d3e3b7461673d313932383330313737340d0a43616c6c2d49443a20613834623463373665363637313040706333332e61746c616e74612e636f6d0d0a435365713a2033313431353920494e564954450d0a436f6e746163743a203c7369703a616c69636540706333332e61746c616e74612e636f6d3e0d0a436f6e74656e742d547970653a206170706c69636174696f6e2f7364700d0a436f6e74656e742d4c656e6774683a20300d0a0d0a>
I2 = <b 0x5349502f322e302031303020547279696e670d0a5669613a205349502f322e302f55445020706333332e61746c616e74612e636f6d3b6272616e63683d7a39684734624b3737366173646864730d0a546f3a20426f62203c7369703a626f624062696c6f78692e636f6d3e0d0a46726f6d3a20416c696365203c7369703a616c6963654061746c616e74612e636f6d3e3b7461673d313932383330313737340d0a43616c6c2d49443a20613834623463373665363637313040706333332e61746c616e74612e636f6d0d0a435365713a2033313431353920494e564954450d0a436f6e74656e742d4c656e6774683a20300d0a0d0a>
J1 = <b 0xabcdef1234567890>
ITime = 120

[Peer]
PublicKey = ${accountData.config.peers[0].public_key}
AllowedIPs = ${allowedIPs}
Endpoint = engage.cloudflareclient.com:4500`;
	    const content = wireGuardText || "No configuration available";
    if (content === "No configuration available") {
        showPopup('No configuration to download', 'Ошибка');
        return;
    }
    downloadConfig(`WARPm3_${randomNumber}.conf`, content);
    showPopup('Скачивание конфигурации');
    } catch (error) {
        console.error('Error processing configuration:', error);
showPopup('Failed to generate config. Please try again.', 'error');
    } finally {
        button.disabled = false;
        button.classList.remove("button--loading");
    } 
});

// Clash-----
Clash.addEventListener('click', async () => {
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
        const wireGuardText = `warp-common: &warp-common
  type: wireguard
  ip: ${accountData.config.interface.addresses.v4}
  ipv6: ${accountData.config.interface.addresses.v6}
  private-key: ${privateKey}
  public-key: ${accountData.config.peers[0].public_key}
  allowed-ips: ['0.0.0.0/0']
  reserved: [${reserved}]
  udp: true
  mtu: 1280
  remote-dns-resolve: true
  dns: [1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001]
  server: 162.159.192.1
  port: 4500
   
proxies:
- name: "AWG 1.5 (1 Вариант)"
  <<: *warp-common
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
   i1: <b 0xc10000000114367096bb0fb3f58f3a3fb8aaacd61d63a1c8a40e14f7374b8a62dccba6431716c3abf6f5afbcfb39bd008000047c32e268567c652e6f4db58bff759bc8c5aaca183b87cb4d22938fe7d8dca22a679a79e4d9ee62e4bbb3a380dd78d4e8e48f26b38a1d42d76b371a5a9a0444827a69d1ab5872a85749f65a4104e931740b4dc1e2dd77733fc7fac4f93011cd622f2bb47e85f71992e2d585f8dc765a7a12ddeb879746a267393ad023d267c4bd79f258703e27345155268bd3cc0506ebd72e2e3c6b5b0f005299cd94b67ddabe30389c4f9b5c2d512dcc298c14f14e9b7f931e1dc397926c31fbb7cebfc668349c218672501031ecce151d4cb03c4c660b6c6fe7754e75446cd7de09a8c81030c5f6fb377203f551864f3d83e27de7b86499736cbbb549b2f37f436db1cae0a4ea39930f0534aacdd1e3534bc87877e2afabe959ced261f228d6362e6fd277c88c312d966c8b9f67e4a92e757773db0b0862fb8108d1d8fa262a40a1b4171961f0704c8ba314da2482ac8ed9bd28d4b50f7432d89fd800c25a50c5e2f5c0710544fef5273401116aa0572366d8e49ad758fcb29e6a92912e644dbe227c247cb3417eabfab2db16796b2fba420de3b1dc94e8361f1f324a331ddaf1e626553138860757fd0bf687566108b77b70fb9f8f8962eca599c4a70ed373666961a8cb506b96756d9e28b94122b20f16b54f118c0e603ce0b831efea614ad836df6cf9affbdd09596412547496967da758cec9080295d853b0861670b71d9abde0d562b1a6de82782a5b0c14d297f27283a895abc889a5f6703f0e6eb95f67b2da45f150d0d8ab805612d570c2d5cb6997ac3a7756226c2f5c8982ffbd480c5004b0660a3c9468945efde90864019a2b519458724b55d766e16b0da25c0557c01f3c11ddeb024b62e303640e17fdd57dedb3aeb4a2c1b7c93059f9c1d7118d77caac1cd0f6556e46cbc991c1bb16970273dea833d01e5090d061a0c6d25af2415cd2878af97f6d0e7f1f936247b394ecb9bd484da6be936dee9b0b92dc90101a1b4295e97a9772f2263eb09431995aa173df4ca2abd687d87706f0f93eaa5e13cbe3b574fa3cfe94502ace25265778da6960d561381769c24e0cbd7aac73c16f95ae74ff7ec38124f7c722b9cb151d4b6841343f29be8f35145e1b27021056820fed77003df8554b4155716c8cf6049ef5e318481460a8ce3be7c7bfac695255be84dc491c19e9dedc449dd3471728cd2a3ee51324ccb3eef121e3e08f8e18f0006ea8957371d9f2f739f0b89e4db11e5c6430ada61572e589519fbad4498b460ce6e4407fc2d8f2dd4293a50a0cb8fcaaf35cd9a8cc097e3603fbfa08d9036f52b3e7fcce11b83ad28a4ac12dba0395a0cc871cefd1a2856fffb3f28d82ce35cf80579974778bab13d9b3578d8c75a2d196087a2cd439aff2bb33f2db24ac175fff4ed91d36a4cdbfaf3f83074f03894ea40f17034629890da3efdbb41141b38368ab532209b69f057ddc559c19bc8ae62bf3fd564c9a35d9a83d14a95834a92bae6d9a29ae5e8ece07910d16433e4c6230c9bd7d68b47de0de9843988af6dc88b5301820443bd4d0537778bf6b4c1dd067fcf14b81015f2a67c7f2a28f9cb7e0684d3cb4b1c24d9b343122a086611b489532f1c3a26779da1706c6759d96d8ab>
- name: "AWG 1.5 (2 Вариант)"
  <<: *warp-common
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
   i1: <b 0xc2000000011419fa4bb3599f336777de79f81ca9a8d80d91eeec000044c635cef024a885dcb66d1420a91a8c427e87d6cf8e08b563932f449412cddf77d3e2594ea1c7a183c238a89e9adb7ffa57c133e55c59bec101634db90afb83f75b19fe703179e26a31902324c73f82d9354e1ed8da39af610afcb27e6590a44341a0828e5a3d2f0e0f7b0945d7bf3402feea0ee6332e19bdf48ffc387a97227aa97b205a485d282cd66d1c384bafd63dc42f822c4df2109db5b5646c458236ddcc01ae1c493482128bc0830c9e1233f0027a0d262f92b49d9d8abd9a9e0341f6e1214761043c021d7aa8c464b9d865f5fbe234e49626e00712031703a3e23ef82975f014ee1e1dc428521dc23ce7c6c13663b19906240b3efe403cf30559d798871557e4e60e86c29ea4504ed4d9bb8b549d0e8acd6c334c39bb8fb42ede68fb2aadf00cfc8bcc12df03602bbd4fe701d64a39f7ced112951a83b1dbbe6cd696dd3f15985c1b9fef72fa8d0319708b633cc4681910843ce753fac596ed9945d8b839aeff8d3bf0449197bd0bb22ab8efd5d63eb4a95db8d3ffc796ed5bcf2f4a136a8a36c7a0c65270d511aebac733e61d414050088a1c3d868fb52bc7e57d3d9fd132d78b740a6ecdc6c24936e92c28672dbe00928d89b891865f885aeb4c4996d50c2bbbb7a99ab5de02ac89b3308e57bcecf13f2da0333d1420e18b66b4c23d625d836b538fc0c221d6bd7f566a31fa292b85be96041d8e0bfe655d5dc1afed23eb8f2b3446561bbee7644325cc98d31cea38b865bdcc507e48c6ebdc7553be7bd6ab963d5a14615c4b81da7081c127c791224853e2d19bafdc0d9f3f3a6de898d14abb0e2bc849917e0a599ed4a541268ad0e60ea4d147dc33d17fa82f22aa505ccb53803a31d10a7ca2fea0b290a52ee92c7bf4aab7cea4e3c07b1989364eed87a3c6ba65188cd349d37ce4eefde9ec43bab4b4dc79e03469c2ad6b902e28e0bbbbf696781ad4edf424ffb35ce0236d373629008f142d04b5e08a124237e03e3149f4cdde92d7fae581a1ac332e26b2c9c1a6bdec5b3a9c7a2a870f7a0c25fc6ce245e029b686e346c6d862ad8df6d9b62474fbc31dbb914711f78074d4441f4e6e9edca3c52315a5c0653856e23f681558d669f4a4e6915bcf42b56ce36cb7dd3983b0b1d6fdf0f8efddb68e7ca0ae9dd4570fe6978fbb524109f6ec957ca61f1767ef74eb803b0f16abd0087cf2d01bc1db1c01d97ac81b3196c934586963fe7cf2d310e0739621e8bd00dc23fded18576d8c8f285d7bb5f43b547af3c76235de8b6f757f817683b2151600b11721219212bf27558edd439e73fce951f61d582320e5f4d6c315c71129b719277fc144bbe8ded25ab6d29b6e189c9bd9b16538faf60cc2aab3c3bb81fc2213657f2dd0ceb9b3b871e1423d8d3e8cc008721ef03b28e0ee7bb66b8f2a2ac01ef88df1f21ed49bf1ce435df31ac34485936172567488812429c269b49ee9e3d99652b51a7a614b7c460bf0d2d64d8349ded7345bedab1ea0a766a8470b1242f38d09f7855a32db39516c2bd4bcc538c52fa3a90c8714d4b006a15d9c7a7d04919a1cab48da7cce0d5de1f9e5f8936cffe469132991c6eb84c5191d1bcf69f70c58d9a7b66846440a9f0eef25ee6ab62715b50ca7bef0bc3013d4b62e1639b5028bdf757454356e9326a4c76dabfb497d451a3a1d2dbd46ec283d255799f72dfe878ae25892e25a2542d3ca9018394d8ca35b53ccd94947a8>
- name: "AWG 1.5 (3 Вариант)"
  <<: *warp-common
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
   i1: <b 0x494e56495445207369703a626f624062696c6f78692e636f6d205349502f322e300d0a5669613a205349502f322e302f55445020706333332e61746c616e74612e636f6d3b6272616e63683d7a39684734624b3737366173646864730d0a4d61782d466f7277617264733a2037300d0a546f3a20426f62203c7369703a626f624062696c6f78692e636f6d3e0d0a46726f6d3a20416c696365203c7369703a616c6963654061746c616e74612e636f6d3e3b7461673d313932383330313737340d0a43616c6c2d49443a20613834623463373665363637313040706333332e61746c616e74612e636f6d0d0a435365713a2033313431353920494e564954450d0a436f6e746163743a203c7369703a616c69636540706333332e61746c616e74612e636f6d3e0d0a436f6e74656e742d547970653a206170706c69636174696f6e2f7364700d0a436f6e74656e742d4c656e6774683a20300d0a0d0a>
   i2: <b 0x5349502f322e302031303020547279696e670d0a5669613a205349502f322e302f55445020706333332e61746c616e74612e636f6d3b6272616e63683d7a39684734624b3737366173646864730d0a546f3a20426f62203c7369703a626f624062696c6f78692e636f6d3e0d0a46726f6d3a20416c696365203c7369703a616c6963654061746c616e74612e636f6d3e3b7461673d313932383330313737340d0a43616c6c2d49443a20613834623463373665363637313040706333332e61746c616e74612e636f6d0d0a435365713a2033313431353920494e564954450d0a436f6e74656e742d4c656e6774683a20300d0a0d0a>
   j1: <b 0xabcdef1234567890>
   itime: 120
  
proxy-groups:
- name: WARP
  type: select
  icon: https://www.vectorlogo.zone/logos/cloudflare/cloudflare-icon.svg
  proxies:
    - "AWG 1.5 (1 Вариант)"
    - "AWG 1.5 (2 Вариант)"
    - "AWG 1.5 (3 Вариант)"
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

// Throne
Throne.addEventListener('click', async () => {
    const button = document.getElementById('generateButton6');
    button.disabled = true;
    button.classList.add("button--loading");
    try {
        const { publicKey, privateKey } = await fetchKeys();
        const installId = generateRandomString(22);
        const fcmToken = `${installId}:APA91b${generateRandomString(134)}`;
        const accountData = await fetchAccount(publicKey, installId, fcmToken);
        const reserved = generateReserved(accountData.config.client_id).replace(/, /g, '-');
        const privateKeyWithoutEqual = privateKey.replace(/=$/, '');
        const wireGuardText = `wg://162.159.192.1:500?private_key=${privateKeyWithoutEqual}%3D&peer_public_key=bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo%3D&pre_shared_key=&reserved=${reserved}&persistent_keepalive=0&mtu=1280&use_system_interface=false&local_address=${accountData.config.interface.addresses.v4}/32-${accountData.config.interface.addresses.v6}/128&workers=0&enable_amnezia=true&junk_packet_count=4&junk_packet_min_size=40&junk_packet_max_size=70&init_packet_junk_size=0&response_packet_junk_size=0&init_packet_magic_header=1&response_packet_magic_header=2&underload_packet_magic_header=3&transport_packet_magic_header=4#WARP`;

        // Показываем модальное окно с конфигурацией
        document.getElementById('throneText').value = wireGuardText;
        modal2.style.display = "block";
        
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
		const wireGuardText = `{
"mtu": 1280,
"reserved": [${reserved}],
"private_key": "${privateKey}",
"type": "wireguard",
"local_address": ["${accountData.config.interface.addresses.v4}/32", "${accountData.config.interface.addresses.v6}/128"],
"peer_public_key": "${accountData.config.peers[0].public_key}",
"server": "162.159.192.1",
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
"address": "162.159.192.1",
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

// Karing
Karing.addEventListener('click', async () => {
    	const button = document.getElementById('generateButton9');
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
"server": "162.159.192.1",
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

// WireSock
WireSock.addEventListener('click', async () => {
    const button = document.getElementById('generateButton10');
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
        const randomEndpoint = generateRandomEndpoint();
        const domains = ['ozon.ru', 'apteka.ru', 'mail.ru', 'sberbank.ru', 'psbank.ru', 'lenta.ru', 'www.pochta.ru'];
        const randomDomain = domains[Math.floor(Math.random() * domains.length)];
        
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

# Protocol masking

Id = ${randomDomain}
Ip = quic
Ib = firefox

[Peer]
PublicKey = ${accountData.config.peers[0].public_key}
AllowedIPs = ${allowedIPs}
Endpoint = ${randomEndpoint}`;
        
        const content = wireGuardText || "No configuration available";
        if (content === "No configuration available") {
            showPopup('No configuration to download', 'Ошибка');
            return;
        }
        downloadConfig(`WARPw_${randomNumber}.conf`, content);
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


document.getElementById('promoButton').onclick = function() {
    window.location.href = 'https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=VG755WBZDBAPGGYM';
}

function getSelectedDNS() {
    if (document.getElementById('dns1').checked) {
        return "1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001";
    } else if (document.getElementById('dns2').checked) {
        return "84.21.189.133, 2a12:bec4:1460:d5::2, 64.188.98.242, 2a01:ecc0:2c1:2::2";
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
        { id: 'st10', ip: '103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19, 103.39.64.0/18, 103.42.0.0/16, 103.56.0.0/17, 103.73.160.0/21, 103.97.0.0/18, 103.97.128.0/18, 104.16.0.0/12, 104.244.40.0/21, 107.181.160.0/19, 108.160.160.0/20, 111.0.0.0/8, 114.0.0.0/10, 115.126.0.0/15, 116.64.0.0/10, 118.107.180.0/22, 118.128.0.0/9, 119.16.0.0/12, 122.0.0.0/10, 122.248.0.0/14, 124.0.0.0/9, 128.121.0.0/16, 128.242.0.0/16, 13.64.0.0/11, 130.211.0.0/16, 148.163.0.0/17, 150.107.0.0/18, 154.64.0.0/10, 156.233.0.0/16, 157.240.0.0/16, 159.106.0.0/16, 159.138.0.0/16, 159.65.0.0/16, 162.125.0.0/16, 162.220.8.0/21, 167.89.0.0/17, 168.143.0.0/16, 173.208.128.0/17, 173.231.0.0/18, 173.234.32.0/19, 173.236.128.0/17, 173.244.192.0/19, 173.252.192.0/18, 173.252.64.0/18, 173.255.192.0/18, 174.36.0.0/15, 179.60.0.0/16, 18.128.0.0/9, 182.0.0.0/9, 184.172.0.0/15, 184.72.0.0/15, 185.45.4.0/22, 185.60.216.0/22, 192.133.76.0/22, 198.27.64.0/18, 198.44.160.0/19, 199.16.156.0/22, 199.193.112.0/21, 199.59.148.0/22, 199.96.56.0/21, 20.64.0.0/10, 202.160.0.0/15, 202.182.0.0/15, 202.52.0.0/14, 203.110.0.0/15, 204.79.196.0/23, 205.186.128.0/18, 208.0.0.0/11, 208.101.0.0/18, 208.43.0.0/16, 208.77.40.0/21, 209.95.32.0/19, 210.0.0.0/7, 216.198.0.0/18, 23.224.0.0/15, 23.234.0.0/18, 23.96.0.0/13, 3.0.0.0/9, 31.13.64.0/18, 34.64.0.0/10, 35.208.0.0/12, 38.0.0.0/7, 4.0.0.0/9, 40.126.0.0/18, 43.226.16.0/20, 45.114.8.0/21, 45.76.0.0/15, 46.51.192.0/20, 47.88.0.0/14, 50.117.0.0/17, 50.22.0.0/15, 50.87.0.0/16, 52.0.0.0/10, 52.160.0.0/11, 52.224.0.0/11, 52.84.0.0/14, 54.216.0.0/14, 54.224.0.0/11, 54.64.0.0/11, 59.0.0.0/9, 59.160.0.0/11, 64.13.192.0/18, 65.49.0.0/17, 66.220.144.0/20, 67.15.0.0/16, 67.228.0.0/16, 67.230.160.0/19, 69.162.128.0/18, 69.171.224.0/19, 69.197.128.0/18, 69.30.0.0/18, 69.50.192.0/19, 69.63.176.0/20, 74.86.0.0/16, 75.126.0.0/16, 80.87.198.0/23, 88.191.249.0/24, 93.179.96.0/21, 96.44.128.0/18, 98.159.96.0/20' },
		{ id: 'st11', ip: '104.16.0.0/12, 136.243.0.0/16, 146.255.0.0/16, 152.89.28.0/23, 162.255.116.0/22, 172.64.0.0/13, 176.58.38.0/23, 176.58.40.0/24, 176.58.41.0/24, 176.58.42.0/24, 176.58.45.0/24, 176.58.46.0/24, 176.58.48.0/23, 176.58.50.0/24, 176.58.54.0/24, 176.58.56.0/24, 176.58.57.0/24, 178.63.75.0/26, 179.32.0.0/12, 185.190.188.0/24, 185.190.190.0/24, 199.59.240.0/22, 199.80.52.0/22, 212.124.124.0/25, 212.124.96.0/24, 45.10.216.0/23, 5.45.76.0/22, 5.45.84.0/22, 5.9.51.64/27, 82.221.104.144/29, 82.221.105.0/24, 85.217.222.0/24, 89.105.207.64/26, 91.132.188.0/23' }
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
const span1 = document.getElementById("close2");
const modal2 = document.getElementById("ThroneModal");

infoBtn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
	modal2.style.display = "none";
}

span1.onclick = function() {
    modal.style.display = "none";
	modal2.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
	if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

// Обработчик кнопки копирования в модальном окне Throne
document.getElementById('copyThroneButton').addEventListener('click', function() {
    const throneText = document.getElementById('throneText');
    throneText.select();
    document.execCommand('copy');
    showPopup('Конфигурация скопирована!');
});
