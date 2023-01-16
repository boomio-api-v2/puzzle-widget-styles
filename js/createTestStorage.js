const defaultConfig = {
    qrCode: '3877216F19FE4DD59E0C08C3BA569A0F',
    img: 'https://github.com/boomio-api-v2/easter-egg-styles/blob/16df9945f669319808bd93be1df1de3924234e46/img/5.gif?raw=true',
    animation: 3,
    appUrl: 'https://www.boomio.com/?coupon_id=3877216F19FE4DD59E0C08C3BA569A0F',
    success: true,
};

const isData = localStorage.getItem('boomioPluginPuzzleConfig')
if (!isData) {
    localStorage.setItem('boomioPluginPuzzleConfig', JSON.stringify(defaultConfig));
}

