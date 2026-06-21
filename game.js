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

renderer.shadowMap.enabled = true;

document.body.appendChild(
renderer.domElement
);

const sun = new THREE.DirectionalLight(
0xffffff,
1.2
);

sun.position.set(
100,
200,
100
);

sun.castShadow = true;

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
ground.receiveShadow = true;

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
runway.receiveShadow = true;

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

function createAircraft()
{
    const aircraft = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.35,
            0.35,
            18,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xf0f0f0
        })
    );

    body.rotation.z = Math.PI / 2;
    body.castShadow = true;

    aircraft.add(body);

    const nose = new THREE.Mesh(
        new THREE.ConeGeometry(
            0.35,
            2,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0xcccccc
        })
    );

    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 10;

    aircraft.add(nose);

    const wing = new THREE.Mesh(
        new THREE.BoxGeometry(
            20,
            0.3,
            3
        ),
        new THREE.MeshStandardMaterial({
            color: 0xe0e0e0
        })
    );

    aircraft.add(wing);

    const tailWing = new THREE.Mesh(
        new THREE.BoxGeometry(
            7,
            0.25,
            2
        ),
        new THREE.MeshStandardMaterial({
            color: 0xd0d0d0
        })
    );

    tailWing.position.z = -8;

    aircraft.add(tailWing);

    const verticalTail = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.5,
            2.5,
            1.5
        ),
        new THREE.MeshStandardMaterial({
            color: 0xff4444
        })
    );

    verticalTail.position.set(
        0,
        1.4,
        -8
    );

    aircraft.add(verticalTail);

    const leftEngine = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.45,
            0.45,
            2.5,
            16
        ),
        new THREE.MeshStandardMaterial({
            color: 0x444444
        })
    );

    leftEngine.rotation.z =
    Math.PI / 2;

    leftEngine.position.set(
        -6,
        -0.6,
        0
    );

    aircraft.add(leftEngine);

    const rightEngine =
    leftEngine.clone();

    rightEngine.position.x = 6;

    aircraft.add(rightEngine);

    return aircraft;
}

const aircraft =
createAircraft();

aircraft.position.set(
0,
1,
0
);

scene.add(aircraft);

for(let i = 0; i < 200; i++)
{
    let x;
    let z;

    do
    {
        x =
        (Math.random()-0.5)
        * 1800;

        z =
        (Math.random()-0.5)
        * 1800;

    } while(
        Math.abs(x) < 150 &&
        Math.abs(z) < 350
    );

    const h =
    Math.random()*80+10;

    const building =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            10,
            h,
            10
        ),
        new THREE.MeshStandardMaterial({
            color: 0x666666
        })
    );

    building.position.set(
        x,
        h/2,
        z
    );

    building.castShadow = true;

    scene.add(building);
}

let speed = 0;
let fuel = 100;

let altitude = 1;

let pitch = 0;

let verticalSpeed = 0;

const gravity = 0.003;
const liftFactor = 0.01;

let dayTime = 0;

const keys = {};

document.addEventListener(
'keydown',
(e)=>{
    keys[e.key]=true;
}
);

document.addEventListener(
'keyup',
(e)=>{
    keys[e.key]=false;
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

    speed =
    Math.max(
        0,
        Math.min(
            1,
            speed
        )
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

    pitch =
    Math.max(
        -0.4,
        Math.min(
            0.4,
            pitch
        )
    );

    aircraft.rotation.x =
    pitch;

    const lift =
    speed *
    speed *
    liftFactor *
    (1 + pitch);

    verticalSpeed += lift;

    verticalSpeed -= gravity;

    altitude += verticalSpeed;

    if(altitude < 1)
    {
        altitude = 1;
        verticalSpeed = 0;
    }

    aircraft.position.y =
    altitude;

    aircraft.translateZ(
        speed * 2
    );

    if(speed > 0)
    {
        fuel -= speed * 0.02;
    }

    fuel =
    Math.max(
        0,
        fuel
    );

    const cameraOffset =
    new THREE.Vector3(
        0,
        8,
        -25
    );

    cameraOffset.applyQuaternion(
        aircraft.quaternion
    );

    camera.position.copy(
        aircraft.position
    ).add(
        cameraOffset
    );

    camera.lookAt(
        aircraft.position
    );

    dayTime += 0.0005;

    sun.position.x =
    Math.cos(dayTime) * 500;

    sun.position.y =
    Math.sin(dayTime) * 500;

    if(sun.position.y < 0)
    {
        scene.background =
        new THREE.Color(
            0x000022
        );
    }
    else
    {
        scene.background =
        new THREE.Color(
            0x87ceeb
        );
    }

    const speedElement =
    document.getElementById(
        "speed"
    );

    if(speedElement)
    {
        speedElement.innerText =
        Math.round(
            speed * 1000
        );
    }

    const altitudeElement =
    document.getElementById(
        "altitude"
    );

    if(altitudeElement)
    {
        altitudeElement.innerText =
        Math.round(
            altitude
        );
    }

    const fuelElement =
    document.getElementById(
        "fuel"
    );

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
let acceleration = 0;
let previousSpeed = 0;

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
