import Alpine from '../alpine-csp/3.0.0-alpha.0/dist/module.esm.js'
import popuphtml from './popup-html.html'

function getExtInfo(callback) {
	chrome.management.getSelf(callback)
}

function setup(extInfo) {
	document.body.innerHTML = popuphtml

	document.addEventListener('alpine:init', () => onAlpineInit(extInfo))

	window.Alpine = Alpine
	Alpine.start()
}

function onAlpineInit(extInfo) {
	const { name, version } = extInfo

	Alpine.data('app', () => ({
		name: `${version}f - ${name}`,
	}))
}

getExtInfo(setup)
