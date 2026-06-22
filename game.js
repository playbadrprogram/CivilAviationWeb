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
color:0x2e7d32
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
color:0x333333
})
);

runway.position.y = 0.05;
scene.add(runway);

for(let i=-280;i<=280;i+=30)
{
const mark = new THREE.Mesh(
new THREE.BoxGeometry(
3,
0.11,
15
),
new THREE.MeshStandardMaterial({
color:0xffffff
})
);

mark.position.set(
0,
0.11,
i
);

scene.add(mark);
}



// =========================
// AIRPORTS SYSTEM V5
// =========================

const airports = [
{
name:"Sanaa",
x:0,
z:0
},
{
name:"Aden",
x:1200,
z:1500
},
{
name:"Mukalla",
x:-1400,
z:1800
}
];



let currentAirport = "Sanaa";
let targetAirport = "Aden";

let missionReward = 5000;

let landingRewardGiven = false;

function createAirport(x,z)
{
const airportRunway =
new THREE.Mesh(
new THREE.BoxGeometry(
80,
0.1,
700
),
new THREE.MeshStandardMaterial({
color:0x222222
})
);

airportRunway.position.set(
x,
0.05,
z
);

scene.add(
airportRunway
);

return airportRunway;
}

const adenAirport =
createAirport(
1200,
1500
);

const mukallaAirport =
createAirport(
-1400,
1800
);

// =========================
// FUEL STATION
// =========================

const fuelStation =
new THREE.Mesh(
new THREE.BoxGeometry(
20,
12,
20
),
new THREE.MeshStandardMaterial({
color:0xffcc00
})
);

fuelStation.position.set(
100,
6,
-250
);

scene.add(
fuelStation
);

// =========================
// CLOUDS
// =========================

for(let i=0;i<50;i++)
{
const cloud =
new THREE.Mesh(
new THREE.SphereGeometry(
20,
16,
16
),
new THREE.MeshStandardMaterial({
color:0xffffff
})
);

cloud.position.set(
(Math.random()-0.5)*4000,
120+Math.random()*100,
(Math.random()-0.5)*4000
);

scene.add(
cloud
);
}
const runway2 = new THREE.Mesh(
new THREE.BoxGeometry(
60,
0.1,
600
),
new THREE.MeshStandardMaterial({
color:0x222222
})
);

runway2.position.set(
1200,
0.05,
1500
);

scene.add(runway2);

function createAircraft()
{
const aircraft = new THREE.Group();

const body = new THREE.Mesh(
new THREE.CylinderGeometry(
0.45,
0.45,
20,
24
),
new THREE.MeshStandardMaterial({
color:0xf5f5f5
})
);

body.rotation.z = Math.PI / 2;
aircraft.add(body);

const nose = new THREE.Mesh(
new THREE.ConeGeometry(
0.45,
2.5,
24
),
new THREE.MeshStandardMaterial({
color:0xd0d0d0
})
);

nose.rotation.z = -Math.PI/2;
nose.position.x = 11;

aircraft.add(nose);

const wing = new THREE.Mesh(
new THREE.BoxGeometry(
22,
0.25,
4
),
new THREE.MeshStandardMaterial({
color:0xe0e0e0
})
);

aircraft.add(wing);

const tailWing = new THREE.Mesh(
new THREE.BoxGeometry(
8,
0.25,
2
),
new THREE.MeshStandardMaterial({
color:0xd0d0d0
})
);

tailWing.position.z = -9;
aircraft.add(tailWing);

const verticalTail = new THREE.Mesh(
new THREE.BoxGeometry(
0.5,
3,
2
),
new THREE.MeshStandardMaterial({
color:0xff4444
})
);

verticalTail.position.set(
0,
1.8,
-9
);

aircraft.add(verticalTail);

const engine1 = new THREE.Mesh(
new THREE.CylinderGeometry(
0.6,
0.6,
3,
20
),
new THREE.MeshStandardMaterial({
color:0x444444
})
);

engine1.rotation.z = Math.PI/2;
engine1.position.set(
-7,
-0.7,
0
);

aircraft.add(engine1);

const engine2 = engine1.clone();
engine2.position.x = 7;
aircraft.add(engine2);

for(let i=-7;i<=7;i+=1.5)
{
const windowMesh = new THREE.Mesh(
new THREE.BoxGeometry(
0.2,
0.2,
0.2
),
new THREE.MeshStandardMaterial({
color:0x4da6ff,
emissive:0x003366
})
);

windowMesh.position.set(
i,
0.45,
0
);

aircraft.add(windowMesh);
}

return aircraft;
}

const aircraft = createAircraft();

aircraft.position.set(
0,
1,
0
);

scene.add(aircraft);

for(let i=0;i<250;i++)
{
let x;
let z;

do
{
x = (Math.random()-0.5)*2000;
z = (Math.random()-0.5)*2000;
}
while(
Math.abs(x)<150 &&
Math.abs(z)<350
);

const h =
Math.random()*120+20;

const building = new THREE.Mesh(
new THREE.BoxGeometry(
10,
h,
10
),
new THREE.MeshStandardMaterial({
color:0x666666
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


let money = 10000;
let speed = 0;
let fuel = 100;
let altitude = 1;
let pitch = 0;
let verticalSpeed = 0;

let acceleration = 0;
let previousSpeed = 0;

const gravity = 0.003;
const liftFactor = 0.01;

let dayTime = 0;

const keys = {};

document.addEventListener(
'keydown',
e=>keys[e.key]=true
);

document.addEventListener(
'keyup',
e=>keys[e.key]=false
);

function getHeading()
{
    let angle =
    aircraft.rotation.y *
    180 / Math.PI;

    angle =
    (angle % 360 + 360) % 360;

    if(angle < 22.5) return "N";
    if(angle < 67.5) return "NE";
    if(angle < 112.5) return "E";
    if(angle < 157.5) return "SE";
    if(angle < 202.5) return "S";
    if(angle < 247.5) return "SW";
    if(angle < 292.5) return "W";
    if(angle < 337.5) return "NW";

    return "N";
}

function animate()
{

    const distanceElement =
document.getElementById(
"distance"
);

if(distanceElement)
{
    distanceElement.innerText =
    Math.round(
        missionDistance
    );
}

    const headingElement =
document.getElementById(
"heading"
);

if(headingElement)
{
    headingElement.innerText =
    getHeading();
}،

    const missionDistance =
aircraft.position.distanceTo(
adenAirport.position
);
    
    requestAnimationFrame(
        animate
    );

    acceleration =
    (speed - previousSpeed) * 1000;

    previousSpeed = speed;

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
        Math.min(1, speed)
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
        Math.min(0.4, pitch)
    );

    aircraft.rotation.x = pitch;

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

    fuel = Math.max(
        0,
        fuel
    );

    const fuelDistance =
    aircraft.position.distanceTo(
        fuelStation.position
    );

    if(
        fuelDistance < 30 &&
        speed < 0.05
    )
    {
        fuel = 100;
    }

    const moneyElement =
document.getElementById(
"money"
);

if(moneyElement)
{
    moneyElement.innerText =
    Math.round(money);
}

    const airportDistance =
    aircraft.position.distanceTo(
        runway2.position
    );

    if(
        airportDistance < 100 &&
        altitude < 5 &&
        speed < 0.15
!landingRewardGiven
)
{
    money += missionReward;

    landingRewardGiven = true;

    alert(
        "تم الوصول إلى مطار عدن بنجاح!"
    );
}
    
if(altitude > 20)
{
    landingRewardGiven = false;
}
    
    const cameraOffset =
    new THREE.Vector3(
        0,
        15,
        -40
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

    const accelerationElement =
    document.getElementById(
        "acceleration"
    );

    if(accelerationElement)
    {
        accelerationElement.innerText =
        acceleration.toFixed(1);
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
