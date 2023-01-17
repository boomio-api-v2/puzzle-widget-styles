////constants
const localStoragePropertyName = 'boomioPluginPuzzleConfig';

const defaultSuccessStatus = true;

const defaultAnimation = 0;

const defaultQrCode = '3877216F19FE4DD59E0C08C3BA569A0F';

const defaultAppUrl = 'https://www.boomio.com/?coupon_id=3877216F19FE4DD59E0C08C3BA569A0F';

const defaultGifImage =
    'https://github.com/boomio-api-v2/easter-egg-styles/blob/16df9945f669319808bd93be1df1de3924234e46/img/5.gif?raw=true';

// const appStoreImage =
//     'https://github.com/boomio-api-v2/easter-egg-styles/blob/main/img/appstore.png?raw=true';
// const playStoreImage =
//     'https://github.com/boomio-api-v2/easter-egg-styles/blob/main/img/playstore.png?raw=true';
// const dotImage =
//     'https://github.com/boomio-api-v2/easter-egg-styles/blob/main/img/dot.png?raw=true';

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const frameSvg = '/img/frame.png';

const puzzlesCoordinate = [
    { top: '0px', left: '0px', width: '89.84px', height: '112.33px' },
    { top: '0px', left: '67px', width: '112.3px', height: '89.86px' },
    { top: '87px', left: '0px', width: '112.3px', height: '89.86px' },
    { top: '64px', left: '89px', width: '89.84px', height: '112.33px' },
]

const puzzleImagesList = [
    '/img/puzzle-1.png',
    '/img/puzzle-2.png',
    '/img/puzzle-3.png',
    '/img/puzzle-4.png',
];

const puzzleWidgetSize = 190;

let isPuzzleWidgetDiplayed = false;

/////////////

const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;


const dragElement = (elmnt) => {
    const closeDragElement = () => {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    const elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }


    const dragMouseDown = (e) => {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (isMobileDevice) {
        elmnt.addEventListener('touchmove', (e) =>  {
            const touchLocation = e.targetTouches[0];
            elmnt.style.left = touchLocation.pageX + 'px';
            elmnt.style.top = touchLocation.pageY + 'px';
        })
        return;
    }

    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;

    }


}

///////// Local Storage Config Class ///////
class LocalStorageConfig {
    constructor() {
        this.config = this.getLocalStorageStringToObject()
    }
    getLocalStorageStringToObject() {
        const config = localStorage.getItem(localStoragePropertyName);
        return JSON.parse(config);
    }

    updateConfig (property) {
        this.config = { ...this.config, ...property }
        const objToString = JSON.stringify(this.config)
        localStorage.setItem(localStoragePropertyName, objToString)
    }

    getDefaultConfig() {
        const config = this.config
        const qrCode = config?.qrCode ?? defaultQrCode;
        const img = config?.img ?? defaultGifImage;
        const animationNR = config?.animation ?? defaultAnimation;
        const appUrl = config?.appUrl ?? defaultAppUrl;
        const isPuzzle = config?.isPuzzle ?? defaultSuccessStatus;
        const puzzlesAlreadyCollected = config?.puzzlesAlreadyCollected ?? 0;
        const appearingPuzzleNr = config?.appearingPuzzleNr ?? 1;
        const renderCount = config?.renderCount ?? 0;
        return { isPuzzle, img, qrCode, animationNR, appUrl, puzzlesAlreadyCollected, appearingPuzzleNr, renderCount };
    };
};
/////////////////////////////////////

////////Puzzle Class ////////////
class Puzzle extends LocalStorageConfig {
    constructor() {
        super()
        this.config = super.getDefaultConfig();
        super.updateConfig({ renderCount: this.config.renderCount + 1 })
    }
    addStyles (cssRules)  {
        const style = document.createElement('style');
        style.setAttribute('id', 'boomio--stylesheet');
        document.getElementsByTagName('head')[0].appendChild(style);
        if (style.styleSheet) {
            style.styleSheet.cssText = cssRules;
        } else {
            style.appendChild(document.createTextNode(cssRules));
        }
    };
    showPuzzleWidget () {
        const puzzleWidget = document.createElement('div');
        puzzleWidget.setAttribute('id', 'puzzle-widget');
        puzzleWidget.style.backgroundImage = ` url(${frameSvg})`;
        puzzleWidget.style.backgroundColor = '#F5F5F5';
        puzzleWidget.style.borderRadius = '10px';
        puzzleWidget.style.backgroundSize = 'contain';
        puzzleWidget.style.width = `${puzzleWidgetSize}px`;
        puzzleWidget.style.height = `${puzzleWidgetSize}px`;
        puzzleWidget.style.position = 'fixed';
        puzzleWidget.style.zIndex = '2';
        puzzleWidget.style.left = '10px';
        puzzleWidget.style.top = '10px';
        document.body.appendChild(puzzleWidget);
        this.puzzleWidget = puzzleWidget
        dragElement(this.puzzleWidget)
        isPuzzleWidgetDiplayed = true;
    }

    drawPuzzlesByCollectedCount () {
        const puzzleWidget = document.getElementById('puzzle-widget')
        for (let i = 0; i < this.config.puzzlesAlreadyCollected; i++) {
            const animationEl =  document.createElement('div')
            animationEl.setAttribute('id',`boomio--animation-${i}`);
            const { top, left, width, height } =  puzzlesCoordinate[i];
            animationEl.style.top = top;
            animationEl.style.left = left;
            animationEl.style.width = width;
            animationEl.style.height = height;
            animationEl.style.position = 'absolute';
            animationEl.classList.add('boomio--animation__wrapper');
            animationEl.classList.add('boomio--animation__wrapper--initial');
            animationEl.style.content = `url(${puzzleImagesList[i]})`;
            puzzleWidget.appendChild(animationEl);
        }
        this.startAnimation()
    }

    startAnimation () {
        const { isPuzzle, qrCode, animationNR, puzzlesAlreadyCollected, img, renderCount, appearingPuzzleNr } = this.config
        if (renderCount % appearingPuzzleNr !== 0) return;
        if (!isPuzzle) return;
        const divsize = 100;

        const dash = '-';
        const pos = qrCode.indexOf(dash);
        if (pos != -1) {
            this.config.qrCode = qrCode.substring(0, pos);
        }

        // const posx = (Math.random() * (document.documentElement.clientWidth - QRsize)).toFixed();
        // const posy = (Math.random() * (document.documentElement.clientHeight - QRsize * 1.5)).toFixed();

        const clientWidth = document.documentElement.clientWidth
        const clientHeight = document.documentElement.clientHeight

        const posx = getRandomArbitrary(puzzleWidgetSize + 20, clientWidth - divsize).toFixed();
        const posy = getRandomArbitrary(puzzleWidgetSize + 20, clientHeight - divsize).toFixed();

        const animate = (animation) => (el) => {
            el.classList.add(`boomio--animation--${animation}`);
        };
        const animArr = [
            animate('moveRight'),
            animate('moveLeft'),
            animate('moveDown'),
            animate('moveUp'),
            animate('fadeIn'),
            animate('moveDiagonalDown'),
            animate('rotateRight'),
            animate('zoomIn'),
            animate('skewLeft'),
            animate('moveDiagonalUp'),
            animate('tada'),
            animate('lightSpeedInLeft'),
            animate('rollIn'),
        ];
        const { width, height } =  puzzlesCoordinate[puzzlesAlreadyCollected];
        const animFunc = animArr[animationNR];
        const animationEl = document.createElement('div');
        animationEl.setAttribute('id', `boomio--animation-${puzzlesAlreadyCollected}`);
        animationEl.classList.add('boomio--animation__wrapper');
        animationEl.classList.add('boomio--animation__wrapper--initial');
        animationEl.style.width = width;
        animationEl.style.height = height
        animationEl.style.content = `url(${puzzleImagesList[puzzlesAlreadyCollected]})`;
        animationEl.classList.remove('boomio--qr');

        // const showCouponCard = () => {
        //     const elementRemove = document.getElementById('boomio--qr');
        //     if (elementRemove != null) {
        //         elementRemove.remove();
        //     }
        //     animationEl.classList.remove('boomio--animation__wrapper--initial');
        //     animationEl.classList.add('boomio--animation__wrapper--qr');
        //     const qrEl = document.createElement('div');
        //     qrEl.setAttribute('id', 'boomio--qr');
        //     qrEl.innerHTML = this.qrCodeInnerHtml();
        //
        //     document.body.append(qrEl);
        //     new QRCode('qrcodeShowHtml', {
        //         text: qrCode,
        //         width: 250,
        //         height: 250,
        //         colorDark: '#000000',
        //         colorLight: '#ffffff',
        //         correctLevel: QRCode.CorrectLevel.H,
        //     });
        //
        //     const showQR = (e) => {
        //         document.getElementById('qrcodeShow').style.display = 'block';
        //         document.getElementById('coupon_div').style.display = 'none';
        //         e.stopPropagation();
        //     }
        //
        //     const showCoupon = (e) => {
        //         document.getElementById('qrcodeShow').style.display = 'none';
        //         document.getElementById('coupon_div').style.display = 'block';
        //         e.stopPropagation();
        //     }
        //
        //     const closeDiscount = (e) => {
        //         const elementRemove = document.getElementById('boomio--qr');
        //         elementRemove.remove();
        //         e.stopPropagation();
        //     }
        //
        //     document.getElementById('coupon_div').onclick = showQR;
        //     document.getElementById('qrcodeShow').onclick = showCoupon;
        //     document.getElementById('close').onclick = closeDiscount;
        // }

        const removeClickListener = () => {
            animationEl.removeEventListener('click',  onPuzzleClick);
        }

        const onPuzzleClick = (e) => {
            const puzzle = e.target;
            const puzzleTop = puzzle.offsetTop;
            const puzzleLeft = puzzle.offsetLeft;
            document.body.removeChild(puzzle)
            this.puzzleWidget.appendChild(puzzle)
            puzzle.classList.remove('boomio--animation__wrapper--initial')
            puzzle.style.position = 'absolute';
            const parentTop = puzzle.offsetParent.offsetTop;
            const parentLeft = puzzle.offsetParent.offsetLeft;
            puzzle.style.left = `${ puzzleLeft - parentLeft}px`;
            puzzle.style.top = `${  puzzleTop - parentTop}px`;
            e.stopPropagation();
            setTimeout(() => {
                this.addPuzzleToWidget(puzzle)
            }, 200)
            // if (this.config.puzzlesAlreadyCollected >= 4) {
            //     setTimeout(() => {
            //         // this.removeWidgetAndAllPuzzles()
            //         // showCouponCard()
            //         const widgetText = document.createElement('div');
            //         widgetText.classList.add('boomio--puzzle-widget-text')
            //         widgetText.innerText = '20% discount';
            //         this.puzzleWidget.appendChild(widgetText)
            //         super.updateConfig({puzzlesAlreadyCollected: 0})
            //     }, 2000)
            // }
            removeClickListener();
        }

        animationEl.addEventListener('click',  onPuzzleClick);
        document.body.appendChild(animationEl);

        const systemFont =
            'system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue';
        const duration = '1000ms';
        const easingBack = 'cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        const easing = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

        const initialPosition = {
            x: animationEl.clientWidth + parseInt(posy),
            nx: -1 * (animationEl.clientWidth + parseInt(posy)),
            y: animationEl.clientHeight + parseInt(posx),
            ny: -1 * (animationEl.clientHeight + parseInt(posx)),
        };
        const css = `
        [draggable=true] {
            cursor: move;
        }
        .boomio--puzzle-widget-text {
            z-index: 100000;
            position: absolute;
            color: white;
            font-weight: bold;
            top: 60px;
            font-size: 36px;
            text-align: center;
        }
        #boomio--qr {
            position: absolute;
            top: 0px;
            left: 0px;
        }
        .boomio--puzzle-widget {
            background-image: url(${frameSvg});
            background-color: #F5F5F5;
            border-radius: 10px;
            background-size: contain;
            width: 150px;
            height: 150px;
            position: fixed;
            z-index: 2;
            left: 10px;
            top: 10px;
        }
		.boomio--animation__wrapper {
			text-align: center;
			position: fixed;
			z-index: 9999;
			left: ${posx}px;
			top: ${posy}px;
			visibility: visible;
			opacity: 1;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
		}
        .boomio--animation__wrapper {
          outline: none !important;
        }
        .boomio--animation__wrapper:empty {
			display: block !important;
		}
		.boomio--animation__wrapper--initial {
			width: ${divsize}px;
			// content: url(${img});
			cursor: pointer;
			transition: transform 300ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
			animation-duration: ${duration};
			animation-timing-function: ${easing};
			animation-iteration-count: 1;
		}

		.boomio--animation__wrapper--initial:hover {
			transform: scale(1.1);
		}

		.boomio--animation__wrapper--initial:active {
			transform: scale(.9);
		}

		.boomio--animation__wrapper--qr {
			animation-name: boomio-animate-qr;
			animation-duration: 300ms;
			animation-timing-function: cubic-bezier(0.18, 0.89, 0.32, 1.28);
			animation-fill-mode: forwards;
			animation-iteration-count: 1;
			background-color: #ffffff;
			box-shadow: rgba(22, 31, 39, 0.42) 0px 60px 123px -25px, rgba(19, 26, 32, 0.08) 0px 35px 75px -35px;
			// padding: 16px;
			border-radius: 7px;
		}

		.boomio--animation__heading {
			color: #000;
			font: 22px/1.2 ${systemFont};
			margin: 0 0 16px;
		}

		h4.boomio--animation__heading {
			font-size: 16px;
			opacity: .7;
			margin-top: -8px;
		}

		.boomio--animation--moveRight { animation-name: boomio-animate--moveRight; animation-timing-function: ${easingBack}; }
		.boomio--animation--moveLeft { animation-name: boomio-animate--moveLeft; animation-timing-function: ${easingBack}; }
		.boomio--animation--moveUp { animation-name: boomio-animate--moveUp; }
		.boomio--animation--moveDown { animation-name: boomio-animate--moveDown; }
		.boomio--animation--moveDiagonalDown { animation-name: boomio-animate--moveDiagonalDown; }
		.boomio--animation--moveDiagonalUp { animation-name: boomio-animate--moveDiagonalUp; }
		.boomio--animation--fadeIn { animation-name: boomio-animate--fadeIn; }
		.boomio--animation--zoomIn { animation-name: boomio-animate--zoomIn; animation-timing-function: ${easingBack}; }
		.boomio--animation--rotateRight { animation-name: boomio-animate--rotateRight; animation-timing-function: ${easingBack}; }
		.boomio--animation--skewLeft { animation-name: boomio-animate--skewLeft; }
		.boomio--animation--tada { animation-name: boomio-animate--tada; }
		.boomio--animation--lightSpeedInLeft { animation-name: boomio-animate--lightSpeedInLeft; }
		.boomio--animation--rollIn { animation-name: boomio-animate--rollIn; }

		@keyframes boomio-animate-qr {
			0% {
				transform: scale(0);
			}
			100% {
				transform: scale(1);
			}
		}

		@keyframes boomio-animate--rollIn {
			from {
				opacity: 0;
				transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
			}
		
			to {
				opacity: 1;
				transform: translate3d(0, 0, 0);
			}
		}
		
		@keyframes boomio-animate--lightSpeedInLeft {
			from {
				transform: translate3d(${initialPosition.nx}px, 0, 0) skewX(30deg);
				opacity: 0;
			}
		
			60% {
				transform: skewX(-20deg);
				opacity: 1;
			}
		
			80% {
				transform: skewX(5deg);
			}
		
			to {
				transform: translate3d(0, 0, 0);
			}
		}
		
		@keyframes boomio-animate--tada {
			from {
				transform: scale3d(1, 1, 1);
			}
		
			10%,
			20% {
				transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
			}
		
			30%,
			50%,
			70%,
			90% {
				transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
			}
		
			40%,
			60%,
			80% {
				transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
			}
		
			to {
				transform: scale3d(1, 1, 1);
			}
		}

		@keyframes boomio-animate--moveRight {
			0% {
				transform: translateX(${initialPosition.nx}px);
			}
			100% {
				transform: translateX(0);
			}
		}

		@keyframes boomio-animate--moveLeft {
			0% {
				transform: translateX(${initialPosition.x}px);
			}
			100% {
				transform: translateX(0);
			}
		}

		@keyframes boomio-animate--moveDown {
			0% {
				transform: translateY(${initialPosition.ny}px);
			}
			100% {
				transform: translateY(0);
			}
		}
		
		@keyframes boomio-animate--moveUp {
			0% {
				transform: translateY(${initialPosition.y}px);
			}
			100% {
				transform: translateY(0);
			}
		}

		@keyframes boomio-animate--fadeIn {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		
		@keyframes boomio-animate--moveDiagonalDown {
			0% {
				transform: translate(${initialPosition.nx}px, ${initialPosition.ny}px);
			}
			100% {
				transform: translate(0, 0);
			}
		}
		
		@keyframes boomio-animate--moveDiagonalUp {
			0% {
				transform: translate(${initialPosition.nx}px, ${initialPosition.y}px);
			}
			100% {
				transform: translate(0, 0);
			}
		}

		@keyframes boomio-animate--rotateRight {
			0% {
				transform: rotate(360deg);
			}
			100% {
				transform: rotate(0deg);
			}
		}

		@keyframes boomio-animate--skewLeft {
			0% {
				transform: skew(60deg, 60deg);
			}
			100% {
				transform: skew(0deg, 0deg);
			}
		}

		@keyframes boomio-animate--zoomIn {
			0% {
				transform: scale(0);
			}
			100% {
				transform: scale(1);
			}
		}
		.align-items-center {
            align-items: center !important;
        }

        .justify-content-center {
            justify-content: center !important;
        }

        .flex-column {
            flex-direction: column !important;
        }

        .d-flex {
            display: flex !important;
        }

        .pt-2 {
            padding-top: 0.5rem !important;
        }
	
        .coupon__preview__body {
            padding: 40px 32px;
        }

		@import url('https://fonts.googleapis.com/css?family=Montserrat');
          
        .product-design-bg-2 *{
            font-family: 'Montserrat' ;
            font-style: normal;
        }
        .coupon_discount_modal .coupon__preview__card__header h1 {
            text-transform: uppercase;
            margin-bottom: 14px;
        }

        .coupon__preview__card__header h1 {
            font-weight: 600;
            font-size: 20px;
            line-height: 24px;
            letter-spacing: -0.02em;
            color: #473F4E;
            margin: 0px;
        }

        .product-design-bg-2 {
            background-color: #ffffff;
            width: 375px;
            height: -moz-fit-content;
            height: fit-content;
            padding: 20px;
            border-radius: 10px;
            padding: 0;
        }

        .coupon_discount_modal .coupon_preview_card_info {
            padding: 10px 30px;
            cursor: pointer;
        }

        .coupon_discount_modal .coupon__preview__card {
            box-shadow: 10px 11px 5px -5px rgb(195 195 195 / 35%);
        }

        .coupon__preview__card {
            position: relative;
            width: 100%;
            height: 282px;
            border: double 2px transparent;
            border-radius: 24px;
            background-image: linear-gradient(#FBFAFC, #FBFAFC), linear-gradient(39.06deg, #FFC24F 8.58%, #FF3183 32.32%, #8559F3 60.82%, #657BEA 66.73%, #34B0DC 77.01%, #15D1D3 84.73%, #09DDD0 88.95%);
            background-origin: border-box;
            background-clip: content-box, border-box;
        }

        .coupon__preview__card::before {
            content: "";
            position: absolute;
            top: 50%;
            left: -18px;
            /* background-color: #fff; */
            width: 32px;
            height: 37.6px;
            transform: translate(0%, -50%);
            border-radius: 50%;
            border: 2px solid transparent;
            background-image: linear-gradient(#fff, #fff), linear-gradient(228.29deg, #FD5A97 10.56%, #FB6E80 86.04%);
            background-origin: border-box;
            background-clip: content-box, border-box;
        }

        .coupon__preview__card__after {
            position: absolute;
            content: "";
            width: 19px;
            top: 50%;
            left: 0px;
            height: 50px;
            background-color: #fff;
            transform: translate(-111%, -50%);
        }

        .coupon__preview__card::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -18px;
            background-color: #fff;
            width: 32px;
            height: 37.6px;
            transform: translate(0%, -50%);
            border-radius: 50%;
            border: 2px solid transparent;
            background-image: linear-gradient(#fff, #fff), linear-gradient(180deg, #5CB1E0 0%, #7E85E9 100%);
            background-clip: content-box, border-box;
        }

        .coupon__preview__card__befor {
            position: absolute;
            content: "";
            width: 19px;
            top: 50%;
            right: 0px;
            height: 50px;
            z-index: 1;
            background-color: #fff;
            transform: translate(111%, -50%);
        }

        .coupon_discount_modal .coupon__preview__card__header {
            padding: 0;
            margin-top: 10%;
            text-align: center;
        }

        .coupon_discount_modal .coupon__preview__card__header h1 {
            text-transform: uppercase;
            margin-bottom: 14px;
        }

        .coupon_discount_modal .coupon__preview__card {
            height: auto;
        }

        .coupon_discount_modal .coupon_info {
            padding: 32px;
        }

        .coupon_discount_modal .coupon_preview_card_info {
            padding: 10px 30px;
            cursor: pointer;
        }

      

        .coupon_discount_modal .coupon__preview__card {
            box-shadow: 10px 11px 5px -5px rgba(195, 195, 195, 0.35);
        }

        .coupon_discount_modal .coupon_info h3 {
            margin: 0;
            padding: 0;
        }

        .coupon_discount_modal .coupon_info h3:first-child {
            font-size: 40px;
            background: -webkit-linear-gradient(#FF3183, #8559F3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 600;
            line-height: 37px;
        }

        .coupon_discount_modal .coupon_info h3 {
            background: -webkit-linear-gradient(#FF3183, #8559F3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
            font-weight: 900;
            font-size: 30px;
        }

        .coupon_discount_modal .coupon_info p {
            padding: 0;
            font-size: 13px;
            font-weight: 600;
            margin: 0;
        }


        .coupon_discount_modal .coupon_preview_card_footer {
            margin-top: 8%;
        }
		.coupon_discount_modal .coupon_preview_card_footer a {
            color:black
        }

        .coupon_discount_modal .coupon_preview_card_footer p {
            font-size: 14px;
        }

        .coupon_preview_card_footer .btn-content {
            width: 100%;
            border: none;
            padding: 1px;
            height: 47px;
            border: double 2px transparent;
            border-radius: 24px;
            background-image: linear-gradient(#e8dff7, #fee0e7), linear-gradient(39.06deg, #FFC24F 8.58%, #FF3183 32.32%, #8559F3 60.82%, #657BEA 66.73%, #34B0DC 77.01%, #15D1D3 84.73%, #09DDD0 88.95%);
            background-origin: border-box;
            background-clip: content-box, border-box;
        }

        .coupon_preview_card_footer .btn-content img {
            width: 30px;
        }

        .coupon_preview_card_footer .btn-content .small-font {
            font-weight: 500;
            font-size: 14px;
			text-align: left;
        }

        .coupon_preview_card_footer .appstore-img img,
        .coupon_preview_card_footer .playstore-img img {
            width: 150px;
        }
        .coupon_preview_card_footer .btn-text-group {
            line-height: 14px;
            font-size: 14px;
        }
        .coupon_preview_card_footer .btn-content {
            cursor: pointer;
        }
        .footer-dec {
            margin: 0;
            padding: 0;
            text-align: center;
            padding-top: 11px;
            line-height: 21px;
        }
		.close{
			position: absolute;
			right: 7px;
			font-size: 20px;
			top: 6px;
			color: #000;
			cursor: pointer;
		}`;

        this.addStyles( css);

        animFunc(animationEl);
    };

    addPuzzleToWidget (element)  {
        let { puzzlesAlreadyCollected } = this.config
        // if (!isPuzzleWidgetDiplayed) {
        //     this.showPuzzleWidget()
        // }
        const { top, left } =  puzzlesCoordinate[puzzlesAlreadyCollected];

        element.style.transition = 'all 2s ease'
        element.style.top = top;
        element.style.left = left;
        puzzlesAlreadyCollected += 1;
        console.log(puzzlesAlreadyCollected +1)
        super.updateConfig({ puzzlesAlreadyCollected })
            setTimeout(() => {
                if (puzzlesAlreadyCollected >= 4) {
                    // this.removeWidgetAndAllPuzzles()
                    // showCouponCard()
                    const widgetText = document.createElement('div');
                    widgetText.classList.add('boomio--puzzle-widget-text')
                    widgetText.innerText = '20% discount';
                    this.puzzleWidget.appendChild(widgetText)
                    super.updateConfig({puzzlesAlreadyCollected: 0})
                } else {
                    this.startAnimation()
                }
            }, 2000)
        // setTimeout(() => {
        //     this.startAnimation()
        // }, 2000)
    }

    // removeWidgetAndAllPuzzles () {
    //     document.getElementById('puzzle-widget').remove();
    //     for (let i = 0; i <= 3; i++) {
    //         document.getElementById(`boomio--animation-${i}`).remove();
    //     }
    // }

    // qrCodeInnerHtml = () =>  `<div class="product-design-bg-2 p-0 Preview-select box-show qr-div" >
	// 	<span class='close' id='close'>&#x2715; </span>
	// 	<div class="coupon__preview__body coupon_discount_modal">
	//
	// 		<div class="coupon__preview__card__header text-center d-block">
	// 			<h1>YOU GOT A 20% DISCOUNT </h1>
	// 		</div>
    //
	// 		<div class="coupon_preview_card_info ">
	// 			<div id='qrcodeShow' style="display:none">
	// 				<a class="qrcodeShowHtml" id="qrcodeShowHtml"> </a>
	// 			</div>
	// 			<div class="coupon__preview__card coupon_div" id="coupon_div" >
	// 				<div class="coupon_info">
	// 					<h3>20 %</h3>
	// 					<h3>Discount</h3>
	// 					<p>Unique code: <span id="qrcode">${this.config.qrCode}</span> </p>
	// 				</div>
	// 				<div class="coupon__preview__card__after"></div>
	// 				<div class="coupon__preview__card__befor"></div>
	// 			</div>
	// 		</div>
	// 		<div class="coupon_preview_card_footer">
	// 			<p>To have immpediate access for all your great rewards <b> open of download</b></p>
	// 			<a href=${this.config.appUrl}>
	// 			<div class="btn-content d-flex align-items-center justify-content-center" style="height: 46px;">
	// 				<img src="${dotImage}" alt="img not find">
	// 				<div class="d-flex flex-column btn-text-group ml-2"><small class="small-font">Open</small>
	// 					<b>Boomio
	// 						app</b>
	// 				</div>
	// 			</div>
	// 			</a>
	// 			<div class="d-flex pt-2">
	// 				<div class="appstore-img "><a href=""><img src="${appStoreImage}"
	// 							alt="App Store"></a></div>
	// 				<div class="playstore-img"><a href=${this.config.appUrl}"><img src="${playStoreImage}"
	// 							alt="Play Store"></a></div>
	// 			</div>
	// 			<div>
	// 				<p class="footer-dec">Don't have time now? Make a screenshot and use it later!</p>
	// 			</div>
	// 		</div>
	// 	</div>
	// </div>`
}
////////////////////////////


document.onreadystatechange = () => {
    if (document.readyState !== 'complete') return;
    const puzzle = new Puzzle()
    puzzle.showPuzzleWidget()
    if (puzzle.config.puzzlesAlreadyCollected > 0) {
        puzzle.drawPuzzlesByCollectedCount()
    } else {
        puzzle.startAnimation();
    }
};
