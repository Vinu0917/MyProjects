// 3D background with Three.js
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('webgl-background')) {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('webgl-background'),
            alpha: true
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create geometry
        const geometry = new THREE.IcosahedronGeometry(20, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x2a3b4c,
            wireframe: true,
            emissive: 0x112240,
            emissiveIntensity: 0.4,
            shininess: 0
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        // Add lights
        const light1 = new THREE.DirectionalLight(0x64ffda, 1);
        light1.position.set(0, 0, 1);
        scene.add(light1);
        
        const light2 = new THREE.DirectionalLight(0x7928ca, 1);
        light2.position.set(0, 0, -1);
        scene.add(light2);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        // Position camera
        camera.position.z = 50;
        
        // Mouse movement effect
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            
            sphere.rotation.y += 0.005;
            sphere.rotation.x += 0.005;
            sphere.rotation.y += (targetX - sphere.rotation.y) * 0.05;
            sphere.rotation.x += (targetY - sphere.rotation.x) * 0.05;
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
});