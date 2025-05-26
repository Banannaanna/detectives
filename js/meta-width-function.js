function adaptiveSizePageScaleInit(definedStartWidth) {
	let startWidth = definedStartWidth;
	let firstViewport;

	function setNewMeta(startWidth) {
		let screenWidth = window.innerWidth; // Отримуємо ширину вікна браузера
		if (screenWidth <= startWidth) {
			if (!firstViewport) {
				firstViewport = document.querySelector('meta[name="viewport"]');
			}
			let oldViewport = document.querySelector('meta[name="viewport"]');
			let newViewport = document.createElement("meta");
			newViewport.setAttribute("name", "viewport");
			newViewport.setAttribute("content", "width=" + `${startWidth}`);
			document.head.replaceChild(newViewport, oldViewport);
		} else if (firstViewport && document.querySelector('meta[name="viewport"]') != firstViewport) {
			let oldViewport = document.querySelector('meta[name="viewport"]');
			document.head.replaceChild(firstViewport, oldViewport);
		}
	}

	window.addEventListener("resize", function () {
		setNewMeta(startWidth);
	});

	setNewMeta(startWidth);
}

function startOnSpecificBrowserInit() {
	let userAgent = window.navigator.userAgent.toLowerCase();
	let browser;
	switch (true) {
		case userAgent.indexOf("edge") > -1:
			browser = "msEdge";
			break;
		case userAgent.indexOf("edg/") > -1:
			browser = "chrEdge";
			break;
		case userAgent.indexOf("opr") > -1 && !!window.opr:
			browser = "opera";
			break;
		case userAgent.indexOf("chrome") > -1 && !!window.chrome:
			browser = "сhrome";
			break;
		case userAgent.indexOf("trident") > -1:
			browser = "ie";
			break;
		case userAgent.indexOf("firefox") > -1:
			browser = "firefox";
			break;
		case userAgent.indexOf("safari") > -1:
			browser = "safari";
			break;
		default:
			browser = "other";
	}

	if (browser == "safari" || browser == "firefox") {
		// Передаємо мінімальну ширину 480 пікселів у функцію
		adaptiveSizePageScaleInit(480);
	}
}

// Викликаємо функцію для початку на визначеному браузері
startOnSpecificBrowserInit();
