varying vec3 vColor;

void main() {
	float strength = distance(gl_PointCoord, vec2(0.5, 0.5));
	if (strength > 0.5) discard;
	gl_FragColor = vec4(vColor, 1.0 - strength);
}
