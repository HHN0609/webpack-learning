import { helloWorld } from "./hello-world";
import imgsrc from "./asset/nodeType.png"
import svgsrc from './asset/topic.svg';
import text from './asset/test.txt'
import './style/style1.css'
import notes from './asset/data/data1.xml'
import yamlData from './asset/data/data2.yaml'
import _ from 'lodash'
import { scalarOptions } from "yaml";

console.log(_.join(['Another', 'module', 'lodash'], '--'))

helloWorld()
console.log("data from .xml", notes)
console.log("data from .yaml:", yamlData)
const png = document.createElement('img')
png.src = imgsrc
document.body.appendChild(png)

const svg = document.createElement('img')
svg.src = svgsrc
document.body.appendChild(svg)

const txt = document.createElement('div')
txt.textContent = text
txt.classList.add('hello')
document.body.appendChild(txt)

const button = document.createElement('button')
button.textContent = "click me"
button.addEventListener("click", () => {
    // 用import来对资源进行懒加载
    import('./math.js')
        .then(({ add }) => {
            let res = add(10, 11)
            console.log(res)
        })
})
document.body.appendChild(button)
