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

// دالة لبناء طائرة واقعية وحقيقية
function createRealisticAircraft() {
    const aircraft = new THREE.Group();

    // الجسم الرئيسي (Fuselage) - أسطواني الشكل أطول وأنحف
    const fuselageGeometry = new THREE.CylinderGeometry(0.35, 0.35, 18, 16, 8);
    const fuselageMaterial = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        metalness: 0.4,
        roughness: 0.3
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.z = Math.PI / 2;
    aircraft.add(fuselage);

    // مقدمة الطائرة (Nose Cone) - مخروطي الشكل
    const noseGeometry = new THREE.ConeGeometry(0.35, 2, 16);
    const noseMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.5,
        roughness: 0.3
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 10;
    aircraft.add(nose);

    // نوافذ الطائرة (Windows) - أكثر عدداً وتفصيلاً
    for (let i = -3; i <= 3; i++) {
        const windowGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
        const windowMaterial = new THREE.MeshStandardMaterial({
            color: 0x4da6ff,
            metalness: 0.9,
            roughness: 0.05
        });
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.rotation.z = Math.PI / 2;
        window.position.set(i * 1.5, 0.4, 0);
        aircraft.add(window);
    }

    // الأجنحة الرئيسية (Main Wings) - أطول وأعرض
    const wingGeometry = new THREE.BoxGeometry(20, 0.3, 3.5);
    const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8e8e8,
        metalness: 0.25,
        roughness: 0.4
    });
    const wing = new THREE.Mesh(wingGeometry, wingMaterial);
    wing.position.y = 0.25;
    aircraft.add(wing);

    // محركات الطائرة (Engines) - تحت الأجنحة - أكبر حجماً
    const engineGeometry = new THREE.CylinderGeometry(0.45, 0.45, 2.5, 16, 8);
    const engineMaterial = new THREE.MeshStandardMaterial({
        color: 0x404040,
        metalness: 0.7,
        roughness: 0.5
    });
    
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.rotation.z = Math.PI / 2;
    leftEngine.position.set(-6, -0.6, 0);
    aircraft.add(leftEngine);

    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.rotation.z = Math.PI / 2;
    rightEngine.position.set(6, -0.6, 0);
    aircraft.add(rightEngine);

    // مراوح المحركات (Propellers)
    const propellerGeometry = new THREE.BoxGeometry(3, 0.15, 0.15);
    const propellerMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.6,
        roughness: 0.5
    });

    const leftPropeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
    leftPropeller.position.set(-6, -0.6, 0);
    leftPropeller.rotation.y = Math.PI / 4;
    aircraft.add(leftPropeller);

    const rightPropeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
    rightPropeller.position.set(6, -0.6, 0);
    rightPropeller.rotation.y = Math.PI / 4;
    aircraft.add(rightPropeller);

    // الأجنحة الثانوية (Horizontal Stabilizer) - ذيل أفقي
    const tailWingGeometry = new THREE.BoxGeometry(7.5, 0.25, 2.5);
    const tailWingMaterial = new THREE.MeshStandardMaterial({
        color: 0xd9d9d9,
        metalness: 0.25,
        roughness: 0.4
    });
    const tailWing = new THREE.Mesh(tailWingGeometry, tailWingMaterial);
    tailWing.position.set(0, 0.15, -8);
    aircraft.add(tailWing);

    // الذيل الرأسي (Vertical Tail/Rudder) - أطول
    const verticalTailGeometry = new THREE.BoxGeometry(0.5, 2.5, 1.8);
    const verticalTailMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        metalness: 0.25,
        roughness: 0.4
    });
    const verticalTail = new THREE.Mesh(verticalTailGeometry, verticalTailMaterial);
    verticalTail.position.set(0, 1.4, -8);
    aircraft.add(verticalTail);

    // خطوط الديكور على الذيل
    const tailStripeGeometry = new THREE.BoxGeometry(0.35, 0.4, 1.3);
    const tailStripeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff
    });
    const tailStripe = new THREE.Mesh(tailStripeGeometry, tailStripeMaterial);
    tailStripe.position.set(0, 0.9, -8);
    aircraft.add(tailStripe);

    // عجلات الهبوط (Landing Gear) - الرئيسية
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 16, 8);
    const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.5,
        roughness: 0.7
    });

    // عجلات أمامية
    const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.rotation.z = Math.PI / 2;
    frontLeftWheel.position.set(-2.5, -0.6, 2);
    aircraft.add(frontLeftWheel);

    const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.rotation.z = Math.PI / 2;
    frontRightWheel.position.set(2.5, -0.6, 2);
    aircraft.add(frontRightWheel);

    // عجلات خلفية
    const backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backLeftWheel.rotation.z = Math.PI / 2;
    backLeftWheel.position.set(-2.5, -0.6, -3);
    aircraft.add(backLeftWheel);

    const backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backRightWheel.rotation.z = Math.PI / 2;
    backRightWheel.position.set(2.5, -0.6, -3);
    aircraft.add(backRightWheel);

    // أماميات العجلات (Struts)
    const strutGeometry = new THREE.BoxGeometry(0.12, 1.3, 0.12);
    const strutMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.6
    });

    const frontLeftStrut = new THREE.Mesh(strutGeometry, strutMaterial);
    frontLeftStrut.position.set(-2.5, -0.15, 2);
    aircraft.add(frontLeftStrut);

    const frontRightStrut = new THREE.Mesh(strutGeometry, strutMaterial);
    frontRightStrut.position.set(2.5, -0.15, 2);
    aircraft.add(frontRightStrut);

    const backLeftStrut = new THREE.Mesh(strutGeometry, strutMaterial);
    backLeftStrut.position.set(-2.5, -0.15, -3);
    aircraft.add(backLeftStrut);

    const backRightStrut = new THREE.Mesh(strutGeometry, strutMaterial);
    backRightStrut.position.set(2.5, -0.15, -3);
    aircraft.add(backRightStrut);

    // أضواء الملاحة (Navigation Lights)
    const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    
    const redLightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.7
    });
    const leftNavLight = new THREE.Mesh(lightGeometry, redLightMaterial);
    leftNavLight.position.set(-10, 0.15, 0);
    aircraft.add(leftNavLight);

    const greenLightMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.7
    });
    const rightNavLight = new THREE.Mesh(lightGeometry, greenLightMaterial);
    rightNavLight.position.set(10, 0.15, 0);
    aircraft.add(rightNavLight);

    // إضاءة بيضاء في المقدمة
    const whiteLightMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.7
    });
    const frontLight = new THREE.Mesh(lightGeometry, whiteLightMaterial);
    frontLight.position.set(10, -0.25, 0);
    aircraft.add(frontLight);

    return aircraft;
}

const aircraft = createRealisticAircraft();

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
