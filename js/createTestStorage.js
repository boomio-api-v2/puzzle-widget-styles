const defaultConfig = {
    qrCode: '3877216F19FE4DD59E0C08C3BA569A0F',
    animation: 3,
    appUrl: 'https://www.boomio.com/?coupon_id=3877216F19FE4DD59E0C08C3BA569A0F',
    showPuzzleWidget: true,
    customText: '20% discount',
    appearingPuzzleNr: 1,
    puzzlesAlreadyCollected: 0
};

const isData = localStorage.getItem('boomioPluginPuzzleConfig')
if (!isData) {
    localStorage.setItem('boomioPluginPuzzleConfig', JSON.stringify(defaultConfig));
}

