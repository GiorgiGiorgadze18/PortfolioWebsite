const vertex = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 resolution, pointer;
uniform float time, strength, frequency;
out vec4 color;

float surface(vec2 p) {
  float r = length(p - pointer);
  float ripple = sin(r * 18.0 - time * 1.8) * exp(-r * 3.1);
  vec2 warp = p + 0.16 * vec2(sin(p.y*5.0 + time*.5), cos(p.x*4.0-time*.3));
  return sin(warp.x * frequency + warp.y*4.0 + time)
       + 0.42 * cos(warp.y * frequency - time*.7)
       + strength * ripple;
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  float h = surface(p);
  vec3 n = normalize(vec3(-dFdx(h), -dFdy(h), 12.0 / resolution.y));
  float light = max(dot(n, normalize(vec3(-.6,.7,1.0))), 0.0);
  float bands = .5 + .5 * cos(h * 4.0);
  vec3 pigment = mix(vec3(.035,.06,.13), vec3(.045,.32,.39), light * bands);
  float specular = pow(max(dot(n,normalize(vec3(-.25,.36,1.0))),0.0),26.0);
  color = vec4((pigment + specular*vec3(.24,.44,.47)) * exp(-dot(p,p)*.12), 1.0);
}`;

export function mount(api) {
  const canvas = api.canvas('A teal wave surface with highlights shaped by mathematical height derivatives');
  const gl = canvas.getContext('webgl2', {alpha: false, antialias: false, preserveDrawingBuffer: true, powerPreference: 'low-power'});
  if (!gl) throw new Error('WebGL 2 unavailable');
  api.cleanup(() => gl.getExtension('WEBGL_lose_context')?.loseContext());
  api.listen(canvas, 'webglcontextlost', event => {
    event.preventDefault();
    api.fail(new Error('Graphics context lost'));
  });

  function compile(type, source) {
    const shader = gl.createShader(type);
    api.cleanup(() => gl.deleteShader(shader));
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  const program = gl.createProgram();
  api.cleanup(() => gl.deleteProgram(program));
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const uniforms = Object.fromEntries(['resolution', 'pointer', 'time', 'strength', 'frequency']
    .map(name => [name, gl.getUniformLocation(program, name)]));
  const {settings} = api;
  let time = 0, x = .5, y = .5, pointer, coordinates;
  api.pointer(canvas, (px, py) => { pointer = [px, py]; });
  return {
    resize({width, height, dpr}) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    reset() { time = 0; pointer = undefined; x = settings.x; y = settings.y; },
    draw(dt, reduced) {
      const key = settings.x + ':' + settings.y;
      if (coordinates !== key) { coordinates = key; pointer = undefined; }
      const [tx, ty] = pointer ?? [settings.x, settings.y];
      const blend = reduced || !dt ? 1 : 1 - Math.exp(-dt * 11);
      x += (tx - x) * blend;
      y += (ty - y) * blend;
      if (!reduced) time += dt * settings.speed;
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.pointer, (x * 2 - 1) * canvas.width / canvas.height, 1 - y * 2);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.strength, settings.strength);
      gl.uniform1f(uniforms.frequency, settings.frequency);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.flush();
      return settings.speed > 0 || Math.hypot(tx - x, ty - y) > .001;
    }
  };
}
