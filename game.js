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

const sun = new THREE.DirectionalLight(
0xffffff,
1
);

sun.position.set(
100,
200,
100
);

scene.add(sun);

scene.add(
new THREE.AmbientLight(
0xffffff,
0.6
)
);

const ground = new THREE.Mesh(
new THREE.PlaneGeometry(
5000,
5000
),
new THREE.MeshStandardMaterial({
color: 0x2e7d32
})
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);

const runway = new THREE.Mesh(
new THREE.BoxGeometry(
60,
0.1,
600
),
new THREE.MeshStandardMaterial({
color: 0x333333
})
);

runway.position.y = 0.05;

scene.add(runway);

for(let i = -280; i <= 280; i += 30)
{
    const mark = new THREE.Mesh(
        new THREE.BoxGeometry(
            3,
            0.11,
            15
        ),
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        })
    );

    mark.position.set(
        0,
        0.11,
        i
    );

    scene.add(mark);
}

const aircraft = new THREE.Group();

const body = new THREE.Mesh(
new THREE.BoxGeometry(
2,
1,
8
),
new THREE.MeshStandardMaterial({
color: 0xffffff
})
);

const wing = new THREE.Mesh(
new THREE.BoxGeometry(
10,
0.2,
2
),
new THREE.MeshStandardMaterial({
color: 0xdedede
})
);

const tailWing = new THREE.Mesh(
new THREE.BoxGeometry(
4,
0.2,
1
),
new THREE.MeshStandardMaterial({
color: 0xdedede
})
);

tailWing.position.z = -3;

const verticalTail = new THREE.Mesh(
new THREE.BoxGeometry(
0.3,
1.5,
1
),
new THREE.MeshStandardMaterial({
color: 0xff0000
})
);

verticalTail.position.set(
0,
0.8,
-3
);

aircraft.add(body);
aircraft.add(wing);
aircraft.add(tailWing);
aircraft.add(verticalTail);

aircraft.position.set(
0,
1,
0
);

scene.add(aircraft);

for(let i = 0; i < 150; i++)
{
    let x;
    let z;

    do
    {
        x = (Math.random() - 0.5) * 1500;
        z = (Math.random() - 0.5) * 1500;
    }
    while(
        Math.abs(x) < 120 &&
        Math.abs(z) < 350
    );

    const height =
    Math.random() * 60 + 10;

    const building =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            10,
            height,
            10
        ),
        new THREE.MeshStandardMaterial({
            color: 0x666666
        })
    );

    building.position.set(
        x,
        height / 2,
        z
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
        speed += 0.0015;
    }

    if(keys["ArrowDown"])
    {
        speed -= 0.0015;
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
        -0.4,
        Math.min(0.4,pitch)
    );

    aircraft.rotation.x = pitch;

    altitude +=
    pitch *
    speed *
    3;

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
        fuel -= 0.004;
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

    const speedElement =
    document.getElementById("speed");

    if(speedElement)
    {
        speedElement.innerText =
        Math.round(
            speed * 1000
        );
    }

    const altitudeElement =
    document.getElementById("altitude");

    if(altitudeElement)
    {
        altitudeElement.innerText =
        Math.round(
            altitude
        );
    }

    const fuelElement =
    document.getElementById("fuel");

    if(fuelElement)
    {
        fuelElement.innerText =
        Math.round(
            fuel
        );
    }

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
