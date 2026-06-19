import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
10000
);

const renderer = new THREE.WebGLRenderer({
antialias: true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

document.body.appendChild(
renderer.domElement
);

const light = new THREE.DirectionalLight(
0xffffff,
1
);

light.position.set(
100,
200,
100
);

scene.add(light);

scene.add(
new THREE.AmbientLight(
0xffffff,
0.5
)
);

const ground = new THREE.Mesh(
new THREE.PlaneGeometry(
5000,
5000
),
new THREE.MeshStandardMaterial({
color: 0x3fa34d
})
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);

const runway = new THREE.Mesh(
new THREE.BoxGeometry(
50,
0.1,
500
),
new THREE.MeshStandardMaterial({
color: 0x444444
})
);

runway.position.y = 0.05;

scene.add(runway);

const aircraft = new THREE.Mesh(
new THREE.BoxGeometry(
2,
1,
8
),
new THREE.MeshStandardMaterial({
color: 0xffffff
})
);

aircraft.position.set(
0,
1,
0
);

scene.add(aircraft);

for(let i = 0; i < 150; i++)
{
    const height =
    Math.random() * 60 + 5;

    const building =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            10,
            height,
            10
        ),
        new THREE.MeshStandardMaterial({
            color: 0x888888
        })
    );

    building.position.set(
        (Math.random() - 0.5) * 1500,
        height / 2,
        (Math.random() - 0.5) * 1500
    );

    scene.add(building);
}

let speed = 0;
let altitude = 1;
let fuel = 100;

let pitch = 0;

const keys = {};

document.addEventListener(
'keydown',
(e)=>{
    keys[e.key] = true;
}
);

document.addEventListener(
'keyup',
(e)=>{
    keys[e.key] = false;
}
);

function animate()
{
    requestAnimationFrame(
        animate
    );

    if(keys["ArrowUp"] && fuel > 0)
    {
        speed += 0.001;
    }

    if(keys["ArrowDown"])
    {
        speed -= 0.001;
    }

    speed = Math.max(
        0,
        Math.min(1,speed)
    );

    if(keys["ArrowLeft"])
    {
        aircraft.rotation.y += 0.02;
    }

    if(keys["ArrowRight"])
    {
        aircraft.rotation.y -= 0.02;
    }

    if(keys["w"] || keys["W"])
    {
        pitch += 0.01;
    }

    if(keys["s"] || keys["S"])
    {
        pitch -= 0.01;
    }

    pitch = Math.max(
        -0.5,
        Math.min(0.5,pitch)
    );

    aircraft.rotation.x = pitch;

    altitude +=
    pitch *
    speed *
    2;

    altitude = Math.max(
        1,
        altitude
    );

    aircraft.position.y =
    altitude;

    aircraft.translateZ(
        speed * 2
    );

    if(speed > 0 && fuel > 0)
    {
        fuel -= 0.005;
    }

    fuel = Math.max(
        0,
        fuel
    );

    camera.position.x =
    aircraft.position.x;

    camera.position.y =
    aircraft.position.y + 8;

    camera.position.z =
    aircraft.position.z - 20;

    camera.lookAt(
        aircraft.position
    );

    document.getElementById(
        "speed"
    ).innerText =
    Math.round(
        speed * 1000
    );

    document.getElementById(
        "altitude"
    ).innerText =
    Math.round(
        altitude
    );

    document.getElementById(
        "fuel"
    ).innerText =
    Math.round(
        fuel
    );

    renderer.render(
        scene,
        camera
    );
}

animate();

window.addEventListener(
'resize',
()=>{
    camera.aspect =
    window.innerWidth /
    window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}
);
