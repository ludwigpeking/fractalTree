# Pine Tree Generator
The author is Richard Qian Li, 2023
version 0.0.1

# Usage
## Import the modules you need

```javascript
import * as THREE from 'three';
import PineTree from './Pine';

```
if you need to test its property settings, You may use the dat.gui, you can import it like this, and use it like this:
```javascript

import * as dat from 'lil-gui';

```
const global = {
  message:'twitter@urban_banal                    ',
  expansion: 0.95,
  slenderness: 50,
  trunkRatio: 0.2,
  leafThreshold: 0.2,
  leafSize: 20,
  height: 50,
  spawningStength: 1,
  leafBlobPropotion: 0.3,
  leafOpacity: 0.4,
  x: 0,
  z: 0,
  leafColor: '#558822',
  curve: true,
  regenerate: regenerate,
  saveImage: function() {
    captureImage = true;
  },
  saveModel: function() {
    if(pine)pine.exportToOBJ();
  }
}

const gui = new dat.GUI();
gui.add(global, 'message').name('Author: Richard Qian Li, 2023');
gui.add(global, 'expansion', 0.15, 0.95, 0.05)
gui.add(global, 'slenderness', 5, 100,5);
gui.add(global, 'trunkRatio', 0.1, 1, 0.1);
gui.add(global, 'spawningStength', 0.1, 1.2, 0.1);
gui.add(global, 'leafBlobPropotion', 0.1, 2, 0.1);
gui.add(global, 'leafThreshold', 0.05, 1, 0.05);
gui.add(global, 'leafSize', 0, 100, 10).onChange(()=>{if(pine)pine.leafSize = global.leafSize;});
gui.add(global, 'leafOpacity', 0, 1, 0.1).onChange(()=>{if(pine)pine.leafOpacity = global.leafOpacity;});
gui.add(global, 'height', 1, 100, 1).onChange(regenerate);
gui.add(global, 'x', -100, 100,1).onChange(()=>{if(pine)pine.treeGroup.position.x = global.x;});
gui.add(global, 'z', -100, 100,1).onChange(()=>{if(pine)pine.treeGroup.position.z = global.z;});
gui.add(global, 'curve').onChange(()=>{if(pine)pine.curve = global.curve;});
gui.addColor(global, 'leafColor').onChange(()=>{if(pine)pine.leafColor = global.leafColor;});
gui.add(global, 'regenerate');
gui.add(global, 'saveImage');
gui.add(global, 'saveModel');

```
the constructor of the pine tree is like this:
```javascript
let pine = new PineTree(height, x, z, expansion, slenderness, trunkRatio, leafThreshold, spawningStength, leafBlobPropotion, leafSize, curve, leafColor, leafOpacity);
```

#MIT License

Copyright (c) [2023] [Qian Li]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
