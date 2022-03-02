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
    // 在import里面添加“魔法注释”，来实现额外的功能
    // prefetch: 会在主页面加载完成后有空闲时，加载math.bundle.js，对应脚本的<script>标签上会多一个ref=prefetch
    // 这里的prefetch的脚本在被加载时候，返回的状态码是304
    // preload: 
    import(/*webpackChunkName: 'math', webpackPrefetch: true*/'./math.js')
        .then(({ add }) => {
            let res = add(10, 11)
            console.log(res)
        })
})
document.body.appendChild(button)
