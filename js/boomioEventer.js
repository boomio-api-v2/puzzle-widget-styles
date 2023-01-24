const scripts = [
    'https://cdn.jsdelivr.net/gh/boomio-api-v2/puzzle-widget-styles@main/js/puzzlePluginV10.js',
    'https://cdn.jsdelivr.net/gh/boomio-api-v2/easter-egg-styles@main/js/eastereggV2.js',
    'https://cdn.jsdelivr.net/gh/boomio-api-v2/wheel-of-fortune@main/js/wheelOfFortune.js'
];
const url = 'https://api.mars.boomio.com/easter-service/get-qr-code';
const config = {
    user_session: "0818e86681915e375ac408d1f1",
    "current_page_url": "https://opencart.boomio.com/index.php?route=product/product&path=24&product_id=29",
    extra_data: {
        go_hunt: "true"
    }
};

const createScript = (url) => {
    const script = document.createElement('script');
    script.setAttribute('src', url)
    document.head.appendChild(script)
};

fetch(url, {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(config)
})
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('boomioPluginConfig', JSON.stringify(data));
        scripts.forEach((script) => {
            createScript(script);
        })
    })

