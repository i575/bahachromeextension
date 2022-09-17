import contentScriptHTML from './content-script.html'

const div = document.createElement('template')
div.innerHTML = contentScriptHTML
document.body.append(div.content)
