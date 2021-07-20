"use strict";

var _newMy$chto;

//? User Agents
let ua = window.navigator.userAgent;
let msie = ua.indexOf("MSIE ");
let isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
  }
};

function isIE() {
  ua = navigator.userAgent;
  let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  return is_ie;
}

if (isIE()) {
  document.querySelector('body').classList.add('ie');
}

if (isMobile.any()) {
  document.querySelector('body').classList.add('_touch');
} //? WEBP supported


function testWebP(callback) {
  let webP = new Image();

  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };

  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector('body').classList.add('_webp');
  } else {
    document.querySelector('body').classList.add('_no-webp');
  }
}); //? Преобразвывает высоту VH css за вычетом шторки навигации браузера.

/* if (document.querySelector("body").classList.contains("_touch")) {

	function adaptiveVH() {
		const portrait = window.matchMedia('(orientation: portrait)');
		const defaultVh = window.innerHeight;
		const defaultOrientation = portrait.matches;
		let activeOrientation = defaultOrientation;
		let vh = window.innerHeight;

		document.querySelector(".hero").style.height = vh + 'px';

		window.addEventListener("resize", function() {
			if (activeOrientation !== portrait.matches) {
				activeOrientation = portrait.matches;
				if (activeOrientation === defaultOrientation) {
					vh = defaultVh;
				} else {
					vh = window.innerHeight;
				}
				document.querySelector(".hero").style.height = vh + 'px'; //! Куда?
				popupInit();
			}
		});
	}
	adaptiveVH();
} */
//?-----------------------------------------------------------------------
//Menu

let iconMenu = document.querySelector(".icon-menu");

if (iconMenu != null) {
  let delay = 500;
  let menuBody = document.querySelector(".menu__body");
  iconMenu.addEventListener("click", function (e) {
    if (unlock) {
      body_lock(delay);
      iconMenu.classList.toggle("_active");
      menuBody.classList.toggle("_active");
      document.querySelector('.bottom-line').classList.toggle("_active");
    }
  });
}

;

function menu_close() {
  let iconMenu = document.querySelector(".icon-menu");
  let menuBody = document.querySelector(".menu__body");
  iconMenu.classList.remove("_active");
  menuBody.classList.remove("_active");
} //=================


let controller = new ScrollMagic.Controller();
/* function initMap() {
    let googleMap = new ScrollMagic.Scene({
        triggerElement: '.contacts__map-plug',
        triggerHook: 0.8,
    })
    .on('start', function(event) {
        map();
        googleMap.destroy(true);
    })
    .addTo(controller);
} */

let newMy = {
  chto: 'wow'
};
console.log(newMy === null || newMy === void 0 ? void 0 : (_newMy$chto = newMy.chto) === null || _newMy$chto === void 0 ? void 0 : _newMy$chto.aga);