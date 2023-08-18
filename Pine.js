// Purpose: Generates a pine tree
import * as THREE from 'three';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

class PineTree {
    constructor(height, x, z, expansion = 0.5, slenderness = 50 , trunkRatio = 0.2, leafThreshold = 0.2, spawningStength = 1, leafBlobPropotion = 0.5, leafSize = 20, curve = true, leafColor = 0x558822, leafOpacity = 0.2 ) {
        // console.log("tree total height", height, "tree x", x, "tree z", z, "expansion", expansion, "slenderness", slenderness, "trunkRatio", trunkRatio)
        this.height = height; //assumed total height of the tree, mostly 1.5m to 20m
        this.x = x;
        this.z = z;
        this.expansion = expansion; //branch horizontal expansion, 0.5 is normal
        this.slenderness = slenderness; //height thickness ratio, 50-80 is normal
        this.trunkRatio = trunkRatio; //trunk height ratio, 0.2-0.4 is normal
        this.leafThreshold = leafThreshold; //branch diameter threshold, below which it becomes a leaf
        this.spawningStength = spawningStength; //branch spawning strength, 1 is normal
        this.leafBlobPropotion = leafBlobPropotion; //leaf blob propotion, 0.5 is normal
        this.leafSize = leafSize; //leaf size, 20 is normal
        this.leafColor = leafColor; //leaf color, green
        this.leafOpacity = leafOpacity; //leaf opacity, 0.2 is normal
        this.curve = curve; //curve or straight branches, false is normal
        this.woodMaterial = new THREE.MeshStandardMaterial({color: 0x553311}); // dark brown
        this.leafMaterial = new THREE.MeshStandardMaterial({color: this.leafColor, transparent: true, opacity: this.leafOpacity}); // translucent green
        this.level = 0;
        this.leafs = 0;
        this.treeGroup = new THREE.Group();
        this.treeGroup.position.set(this.x, 0, this.z);
        this.generateTrunk();//must be the last called
        
    }

    generateTrunk() {
        //trunk height is 0.3 * height  * expansion and normal distribution
        const trunkHeight = this.trunkRatio * this.height * normalRandom(0.2)  //0.3 is the average trunk height ratio
        const trunkDiameter = this.height / this.slenderness * normalRandom(0.2);
        const trunkGeometry = new THREE.CylinderGeometry(trunkDiameter/2*0.8, trunkDiameter/2 , trunkHeight,6);
        const trunkMesh = new THREE.Mesh(trunkGeometry, this.woodMaterial);
        trunkMesh.position.y = trunkHeight/2;  // Adjust so trunk begins at y=0
        this.treeGroup.add(trunkMesh);
        // console.log("trunk height: " + trunkHeight.toFixed(2) + " trunk diameter: " + trunkDiameter.toFixed(2))
        this.level += 1;
        // Generate branches at the top of the trunk
        if (this.curve) {
            this.generateCurveBranches(0, trunkHeight, 0, trunkDiameter);
        } else {
            this.generateBranches(0, trunkHeight, 0, trunkDiameter);
        }
    }
    generateCurveBranches(startX, startY, startZ, parentDiameter) {
        if (parentDiameter < this.leafThreshold) {
            const leafGeometry = new THREE.SphereGeometry(parentDiameter * this.leafSize, 6, 3);
            const leafMesh = new THREE.Mesh(leafGeometry, this.leafMaterial);
            leafMesh.position.set(startX, startY, startZ);
            leafMesh.scale.set(1, this.leafBlobPropotion, 1);
            this.treeGroup.add(leafMesh);
            this.leafs += 1;
            return;
        } else {
            let pivot1 = new THREE.Object3D();
            let pivot2 = new THREE.Object3D();
            this.treeGroup.add(pivot1);
            this.treeGroup.add(pivot2);
            pivot1.position.set(startX, startY, startZ);
            pivot2.position.set(startX, startY, startZ);
            const d1 = Math.sqrt(this.spawningStength * parentDiameter * parentDiameter)  * (Math.random()*0.8+0.1);
            const d2 = Math.sqrt(this.spawningStength * parentDiameter * parentDiameter - d1 * d1);
            const rotationY1 = Math.random() * Math.PI;
            const rotationY2 = rotationY1 + Math.PI;  // Opposite direction
            const l1 = d1 * this.slenderness * this.trunkRatio ;
            const s1 = l1 * this.expansion ;        
            const prod = l1 * s1 * d1 **2;
            const l2 = Math.sqrt(prod/(d2 * this.expansion));
            const s2 = d1 **2 * l1 * s1 / (d2** 1* l2);
     

            const startPoint1 = new THREE.Vector3(0, 0, 0);
            const startControlPoint1 = new THREE.Vector3(s1/2, l1/3, 0);  // Control direction at start
            const endControlPoint1 = new THREE.Vector3(s1, l1/2, 0);  // Control direction at end
            const endPoint1 = new THREE.Vector3(s1, l1, 0);
            const curve1 = new THREE.CubicBezierCurve3(startPoint1, startControlPoint1, endControlPoint1, endPoint1);
            const segments = 10;  // Number of segments along the curve
            const radiusSegments = 6;  // Number of segments around the tube
            const closed = false;
            const tubeGeometry1 = new THREE.TubeGeometry(curve1, segments, d1/2, radiusSegments, closed);
            const branch1Mesh = new THREE.Mesh(tubeGeometry1, this.woodMaterial);
            pivot1.add(branch1Mesh);
            pivot1.rotation.y = rotationY1;

            const startPoint2 = new THREE.Vector3(0, 0, 0);
            const startControlPoint2 = new THREE.Vector3(s2/2, l2/3, 0);  // Control direction at start
            const endControlPoint2 = new THREE.Vector3(s2, l2/2, 0);  // Control direction at end
            const endPoint2 = new THREE.Vector3(s2, l2, 0);
            const curve2 = new THREE.CubicBezierCurve3(startPoint2, startControlPoint2, endControlPoint2, endPoint2);
            const tubeGeometry2 = new THREE.TubeGeometry(curve2, segments, d2/2, radiusSegments, closed);
            const branch2Mesh = new THREE.Mesh(tubeGeometry2, this.woodMaterial);
            pivot2.add(branch2Mesh);
            pivot2.rotation.y = rotationY2;
            
            let tipLocalPosition1 = new THREE.Vector3(s1, l1, 0);
            let tipLocalPosition2 = new THREE.Vector3(s2, l2, 0);
            pivot1.updateMatrixWorld();
            let tipWorldPosition1 = tipLocalPosition1.applyMatrix4(pivot1.matrixWorld);

            pivot2.updateMatrixWorld();
            let tipWorldPosition2 = tipLocalPosition2.applyMatrix4(pivot2.matrixWorld);

            this.level += 1;
            this.generateCurveBranches(tipWorldPosition1.x, tipWorldPosition1.y, tipWorldPosition1.z, d1, l1);
            this.generateCurveBranches(tipWorldPosition2.x, tipWorldPosition2.y, tipWorldPosition2.z, d2, l2);



        }
    }

    generateBranches(startX, startY, startZ, parentDiameter) {
        if (parentDiameter < this.leafThreshold) {
            const leafGeometry = new THREE.SphereGeometry(parentDiameter * this.leafSize, 6, 3);
            const leafMesh = new THREE.Mesh(leafGeometry, this.leafMaterial);
            leafMesh.position.set(startX, startY, startZ);
            leafMesh.scale.set(1, this.leafBlobPropotion, 1);
            this.treeGroup.add(leafMesh);
            this.leafs += 1;
            return;
        } else {
            let pivot1 = new THREE.Object3D();
            let pivot2 = new THREE.Object3D();
            
            // Add the pivots to the tree group
            this.treeGroup.add(pivot1);
            this.treeGroup.add(pivot2);
            // Set the position of the pivots
            pivot1.position.set(startX, startY, startZ);
            pivot2.position.set(startX, startY, startZ);
        
            // Calculate diameters based on parent's diameter
            const d1 = Math.sqrt(this.spawningStength * parentDiameter * parentDiameter)  * (Math.random()*0.8+0.1);
            // const d1 = Math.sqrt(this.spawningStength * parentDiameter * parentDiameter /2);
            const d2 = Math.sqrt(this.spawningStength * parentDiameter * parentDiameter - d1 * d1);
        
            // Random y-axis rotation
            const rotationY1 = Math.random() * Math.PI;
            const rotationY2 = rotationY1;  // Opposite direction
            const l1 = d1 * this.slenderness * this.trunkRatio ;
            const s1 = l1 * this.expansion ;
            // const l1 = d1 * this.slenderness * 0.5 * normalRandom(0.1);
            // const s1 = l1 * this.expansion * normalRandom(0.1);
        
            const prod = l1 * s1 * d1 **2;
            const l2 = Math.sqrt(prod/(d2 * this.expansion));
            
            const s2 = d1 **2 * l1 * s1 / (d2** 1* l2);
            const rotationZ1 = Math.asin(s1 / l1); 
            const rotationZ2 = -Math.asin (s2 / l2);
            
  
            const branch1Geometry = new THREE.CylinderGeometry(d1/2 * 0.8, d1/2 , l1);
            const branch1Mesh = new THREE.Mesh(branch1Geometry, this.woodMaterial);
            const branch2Geometry = new THREE.CylinderGeometry(d2/2 *0.8 , d2/2 , l2);
            const branch2Mesh = new THREE.Mesh(branch2Geometry, this.woodMaterial);
            
            // Adjust the position of the branches within their respective pivots
            branch1Mesh.position.y = l1 / 2;
            branch2Mesh.position.y = l2 / 2;
            
            // Add the branches to their respective pivots
            pivot1.add(branch1Mesh);
            pivot2.add(branch2Mesh);
            
            // Apply rotations to the pivots
            pivot1.rotation.z = rotationZ1;
            pivot1.rotation.y = rotationY1;
            
            pivot2.rotation.z = rotationZ2;
            pivot2.rotation.y = rotationY2;
            
            // Calculate the world coordinates for the tips of the branches
            let tipLocalPosition1 = new THREE.Vector3(0, l1, 0);
            let tipLocalPosition2 = new THREE.Vector3(0, l2, 0);

            pivot1.updateMatrixWorld();
            let tipWorldPosition1 = tipLocalPosition1.applyMatrix4(pivot1.matrixWorld);
            pivot2.updateMatrixWorld();
            let tipWorldPosition2 = tipLocalPosition2.applyMatrix4(pivot2.matrixWorld);

            this.level += 1;
            // Recursively generate branches
            this.generateBranches(tipWorldPosition1.x, tipWorldPosition1.y, tipWorldPosition1.z, d1, l1);
            this.generateBranches(tipWorldPosition2.x, tipWorldPosition2.y, tipWorldPosition2.z, d2, l2);
        }
    }
    addToScene(scene) {
        console.log(" number of leafs: ",this.leafs);
        scene.add(this.treeGroup);
    }
    exportToOBJ() {
        const exporter = new OBJExporter();
        const result = exporter.parse(this.treeGroup);
        
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'pine_tree.obj';

        document.body.appendChild(a);
        a.click();

        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
    
}

function normalRandom(standardDeviation) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return 1 + z0 * standardDeviation;
}

export default PineTree;


const generateTrunk=() =>{
    const trunkHeight = this.trunkRatio * this.height * normalRandom(0.15);
    const trunkDiameter = this.height / this.slenderness * normalRandom(0.15);
    
    // Define the Bezier curve control points
    const startPoint = new THREE.Vector3(0, 0, 0);
    const startControlPoint = new THREE.Vector3(trunkHeight * 0.3, 0, 0);  // Control direction at start
    const endControlPoint = new THREE.Vector3(trunkHeight * 0.3, trunkHeight, 0);  // Control direction at end
    const endPoint = new THREE.Vector3(0, trunkHeight, 0);
    
    const curve = new THREE.CubicBezierCurve3(startPoint, startControlPoint, endControlPoint, endPoint);
    
    const segments = 20;  // Number of segments along the curve
    const radiusSegments = 8;  // Number of segments around the tube
    const closed = false;
    
    const tubeGeometry = new THREE.TubeGeometry(curve, segments, trunkDiameter/2, radiusSegments, closed);
    const trunkMesh = new THREE.Mesh(tubeGeometry, this.woodMaterial);
    
    this.treeGroup.add(trunkMesh);

    this.level += 1;
    this.generateBranches(0, trunkHeight, 0, trunkDiameter);
    }

