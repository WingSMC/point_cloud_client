uniform float pointSize;
uniform vec3 cameraPos;
varying vec3 vColor;
varying float vTime;

void main() {
	vColor = color;
	float dist = distance(position.xyz, cameraPos.xyz);
	gl_PointSize = 10.0 / dist;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}