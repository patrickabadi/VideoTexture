import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'

// custom global variables
var video, videoImage, videoImageContext, videoTexture;


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// create the video element
video = document.createElement( 'video' );
video.src = "assets/squid.mp4";
video.loop = true;
video.autoplay = true;
video.load(); // must call after setting/changing source
video.play();

videoImage = document.createElement( 'canvas' );
videoImage.width = 960;
videoImage.height = 576;

videoImageContext = videoImage.getContext( '2d' );
// background color if no video present
videoImageContext.fillStyle = '#000000';
videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

videoTexture = new THREE.Texture( videoImage );
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );


// Objects
var loader = new GLTFLoader();
loader.load( 'assets/retextured.glb', function ( gltf )
{
    gltf.scene.traverse((o) => {
        if (o.isMesh) o.material = movieMaterial;
      });

    scene.add(gltf.scene);
} );  



// // the geometry on which the movie will be displayed;
// // 		movie image will be scaled to fit these dimensions.
// var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
// var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
// movieScreen.position.set(0,50,0);
// scene.add(movieScreen);


// Lights
// const light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 66) {
        video.play();
    }
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
 const controls = new OrbitControls(camera, canvas)
 controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor (0x222222, 1);

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

// function update()
// {
// 	if ( keyboard.pressed("p") )
// 		video.play();
		
// 	if ( keyboard.pressed("space") )
// 		video.pause();

// 	if ( keyboard.pressed("s") ) // stop video
// 	{
// 		video.pause();
// 		video.currentTime = 0;
// 	}
	
// 	if ( keyboard.pressed("r") ) // rewind video
// 		video.currentTime = 0;
	
// 	controls.update();
// 	stats.update();
// }

tick()