import * as THREE from 'three'
import './style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap';

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.5
})

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const light = new THREE.PointLight(0xffffff, 100);
light.position.set(0, 10, 10);
scene.add(light)

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height,  0.1, 100)
camera.position.z = 20
scene.add(camera) 

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(2)

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera)

const control = new OrbitControls(camera, canvas)
control.enableDamping = true
control.enablePan = false
control.enableZoom = false
control.autoRotate = true
control.autoRotateSpeed = 8

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  control.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}

loop()

const tl = gsap.timeline({defaults : {duration: 1}})
tl.fromTo(mesh.scale, {z:0, y:0, x:0}, {z:1, y:1, x:1})
tl.fromTo('nav', {y:"-100%"}, {y:'0%'})
tl.fromTo('.title', {opacity: 0}, {opacity: 1})

let mouseDown = false
let rgb = []

window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = true))

window.addEventListener("mousemove", (e) => {
  if(mouseDown){
    rgb = [Math.round((e.pageX)/sizes.width)*255, Math.round((e.pageY) /sizes.width)*255, 180]

    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b})
  }
})

