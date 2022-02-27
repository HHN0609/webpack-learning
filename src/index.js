import { helloWorld } from "./hello-world";
import imgsrc from "./asset/nodeType.png"
import svgsrc from './asset/topic.svg';
import text from './asset/test.txt'
helloWorld()

const png = document.createElement('img')
png.src = imgsrc
document.body.appendChild(png)

const svg = document.createElement('img')
svg.src = svgsrc
document.body.appendChild(svg)

const txt = document.createElement('div')
txt.textContent = text
document.body.appendChild(txt)