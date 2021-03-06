/* global window */

import {
  MeshLayer,
  ScenegraphLayer,
  GreatCircleLayer,
  S2Layer
  // KMLLayer
} from 'deck.gl';

import {_GPUGridLayer as GPUGridLayer} from '@deck.gl/aggregation-layers';

import {CylinderGeometry} from 'luma.gl';
import {GLTFParser} from '@loaders.gl/gltf';
import * as dataSamples from '../data-samples';

const MeshLayerExample = {
  layer: MeshLayer,
  props: {
    id: 'mesh-layer',
    data: dataSamples.points,
    texture: 'data/texture.png',
    mesh: new CylinderGeometry({
      radius: 1,
      topRadius: 1,
      bottomRadius: 1,
      topCap: true,
      bottomCap: true,
      height: 5,
      nradial: 20,
      nvertical: 1
    }),
    sizeScale: 10,
    getPosition: d => d.COORDINATES,
    getColor: d => [0, d.RACKS * 50, d.SPACES * 20],
    getMatrix: d => [
      Math.random() * 2,
      Math.random() * 2,
      Math.random() * 2,
      0,
      Math.random() * 2,
      Math.random() * 2,
      Math.random() * 2,
      0,
      Math.random() * 2,
      Math.random() * 2,
      Math.random() * 2,
      0,
      Math.random() * 2,
      Math.random() * 2,
      Math.random() * 2,
      1
    ]
  }
};

const ScenegraphLayerExample = {
  layer: ScenegraphLayer,
  initialize: () => {
    const url =
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb';
    window
      .fetch(url)
      .then(res => res.arrayBuffer())
      .then(data => {
        const gltfParser = new GLTFParser();
        ScenegraphLayerExample.props.gltf = gltfParser.parse(data);
      });
  },
  props: {
    id: 'scenegraph-layer',
    data: dataSamples.points,
    sizeScale: 1,
    pickable: true,
    getPosition: d => [d.COORDINATES[0], d.COORDINATES[1], Math.random() * 10000]
  }
};

const GPUGridLayerExample = {
  layer: GPUGridLayer,
  getData: () => dataSamples.points,
  props: {
    id: 'gpu-grid-layer',
    cellSize: 200,
    opacity: 1,
    extruded: true,
    pickable: false,
    getPosition: d => d.COORDINATES
  }
};

const GPUGridLayerPerfExample = (id, getData) => ({
  layer: GPUGridLayer,
  getData,
  props: {
    id: `gpuGridLayerPerf-${id}`,
    cellSize: 200,
    opacity: 1,
    extruded: true,
    pickable: false,
    getPosition: d => d
  }
});

const GreatCircleLayerExample = {
  layer: GreatCircleLayer,
  getData: () => dataSamples.greatCircles,
  props: {
    id: 'greatCircleLayer',
    getSourcePosition: d => d.source,
    getTargetPosition: d => d.target,
    getSourceColor: [64, 255, 0],
    getTargetColor: [0, 128, 200],
    getStrokeWidth: 5,
    pickable: true
  }
};

const S2LayerExample = {
  layer: S2Layer,
  props: {
    data: dataSamples.s2cells,
    opacity: 0.6,
    getS2Token: f => f.token,
    getFillColor: f => [f.value * 255, (1 - f.value) * 255, (1 - f.value) * 128, 128],
    getElevation: f => Math.random() * 1000,
    pickable: true
  }
};

/* eslint-disable quote-props */
export default {
  'Mesh Layers': {
    MeshLayer: MeshLayerExample,
    ScenegraphLayer: ScenegraphLayerExample
  },
  'Geo Layers': {
    S2Layer: S2LayerExample,
    GreatCircleLayer: GreatCircleLayerExample
  },
  'Experimental Core Layers': {
    GPUGridLayer: GPUGridLayerExample,
    'GPUGridLayer (1M)': GPUGridLayerPerfExample('1M', dataSamples.getPoints1M),
    'GPUGridLayer (5M)': GPUGridLayerPerfExample('5M', dataSamples.getPoints5M)
  }
};
