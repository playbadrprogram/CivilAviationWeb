import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();

scene.background =
new THREE.Color(0x87ceeb);

const camera =
new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
10000
);

const renderer =
new THREE.WebGLRenderer();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

const light =
new THREE.DirectionalLight(
0xffffff,
1
);

light.position.set(
100,
100,
100
);

scene.add(light);

const runway =
new THREE.Mesh(
new THREE.BoxGeometry(
50,
0.1,
500
),
new THREE.MeshStandardMaterial(
{color:0x444444}
)
);

scene.add(runway);

const aircraft =
new THREE.Mesh(
new THREE.BoxGeometry(
2,
1,
8
),
new THREE.MeshStandardMaterial(
{color:0xffffff}
)
);

aircraft.position.y = 1;

scene.add(aircraft);

camera.position.set(
0,
5,
-15
);

let speed = 0;

document.addEventListener(
'keydown',
(e)=>{
    if(e.key==="ArrowUp")
        speed += 0.02;
}
);

function animate(){

requestAnimationFrame(
animate
);

aircraft.position.z += speed;

camera.position.z =
aircraft.position.z - 15;

camera.position.y =
aircraft.position.y + 5;

camera.lookAt(
aircraft.position
);

document.getElementById(
"speed"
).innerText =
(speed*1000).toFixed(0);

document.getElementById(
"altitude"
).innerText =
aircraft.position.y.toFixed(0);

renderer.render(
scene,
camera
);

}

animate();