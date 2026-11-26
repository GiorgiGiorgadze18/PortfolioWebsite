export const experiments = [
  {
    id: 'shader', title: 'Interactive Shader Playground', technology: 'GLSL · WebGL 2',
    description: 'A procedural surface bends around the pointer. Change the wave spacing to see how the shader builds its highlights.',
    instructions: 'Move across the surface or drag a finger. Use the coordinate sliders for keyboard control.',
    capability: 'WebGL 2', fallback: 'The preview shows the shape of the wave bands. Live distortion requires WebGL 2.',
    controls: [['speed', 'Speed', 0, 2, 1, .1], ['strength', 'Distortion', 0, 2, 1, .1], ['frequency', 'Wave frequency', 2, 12, 6, 1],
      ['x', 'Pointer X', 0, 1, .5, .05], ['y', 'Pointer Y', 0, 1, .5, .05]],
    animated: true, load: () => import('./shader.js')
  },
  {
    id: 'lighting', title: 'Real-Time Lighting Studio', technology: 'Three.js · WebGL 2 · PBR',
    description: 'Light a machined form and compare the way its finish spreads highlights and casts shadows.',
    instructions: 'Adjust the key light angle and intensity. Compare a rough finish with a polished one.',
    capability: 'WebGL 2', fallback: 'The preview illustrates a lit volume. A WebGL 2 renderer is needed to recalculate light and shadows.',
    controls: [['angle', 'Light angle', -170, 170, 45, 5], ['power', 'Intensity', 5, 65, 34, 1],
      ['roughness', 'Roughness', .14, 1, .28, .02], ['ambient', 'Ambient light', 0, 2, .7, .1]],
    animated: false, load: () => import('./lighting.js')
  },
  {
    id: 'physics', title: 'Motion Physics Lab', technology: 'JavaScript · Canvas 2D',
    description: 'Compare a damped spring with cubic easing. Each marker follows the same trajectory that is plotted in the graph.',
    instructions: 'Change stiffness and damping, then replay. The blue curve is the spring and the pale curve is cubic easing.',
    capability: 'Canvas 2D', fallback: 'The preview compares overshoot with a smooth approach. Canvas 2D is needed to plot your settings.',
    controls: [['stiffness', 'Stiffness', 35, 240, 110, 5], ['damping', 'Damping', 2, 32, 10, 1],
      ['duration', 'Easing duration (s)', .25, 1.8, .75, .05]],
    animated: true, replay: true, load: () => import('./physics.js')
  },
  {
    id: 'particles', title: 'Interactive Particle Field', technology: 'JavaScript · Canvas 2D',
    description: 'The same points move between a grid, a globe and a wave. A local force attracts or repels the points.',
    instructions: 'Choose a form or move across the field. Position sliders offer the same control without a pointer.',
    capability: 'Canvas 2D', fallback: 'The dot pattern shows the grid form. Canvas 2D is needed to move and reshape the points.',
    controls: [['shape', 'Form', ['Globe', 'Grid', 'Wave']], ['mode', 'Pointer force', ['Repel', 'Attract']],
      ['strength', 'Force strength', 0, 2, 1, .1], ['x', 'Pointer X', 0, 1, .5, .05], ['y', 'Pointer Y', 0, 1, .5, .05]],
    animated: true, load: () => import('./particles.js')
  },
  {
    id: 'spatial', title: 'Spatial UI Playground', technology: 'CSS 3D · JavaScript',
    description: 'Separate the navigation, workspace and toolbar of a sample interface to see how perspective changes their relationship.',
    instructions: 'Adjust depth, perspective and viewing angle. The assembled control brings the layers back together.',
    capability: 'CSS 3D', fallback: 'The three layers are navigation, workspace and tools. Perspective controls require CSS 3D.',
    controls: [['layout', 'Composition', ['Exploded', 'Assembled']], ['depth', 'Layer depth', 0, 90, 54, 2],
      ['perspective', 'Perspective', 380, 1200, 750, 20], ['angle', 'Viewing angle', -35, 35, -17, 1]],
    animated: false, load: () => import('./spatial.js')
  }
];
