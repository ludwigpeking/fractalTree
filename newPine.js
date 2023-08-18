import * as THREE from 'three';

class newPine {
    constructor(x, y, mass = 15, expansion = 0.7, slenderness = 20 , trunkRatio = 0.4) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.expansion = expansion;
        this.slenderness = slenderness;
        this.trunkRatio = trunkRatio;
        this.treeGroup = new THREE.Group();
        this.treeGroup.position.set(this.x, 0, this.y);
        this.level = 0;
        this.generateTrunk();
    }

    generateTrunk() {
        const trunkMass = this.trunkRatio * this.mass * normalRandom(0.15);
        const trunkHeight = sqrt(trunkMass / this.slenderness);
        const trunkDiameter = trunkHeight / this.slenderness * normalRandom(0.15);
    }
}