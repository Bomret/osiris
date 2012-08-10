attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTexCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform vec3 uPointLightPosition;

varying vec3 vVertexNormal;
varying vec2 vVertexTexCoord;
varying vec3 vLightDir;

void main(void) {
    vVertexTexCoord = aVertexTexCoord;	// Send texture coordinates to fragment shader
	vVertexNormal = aVertexNormal * uNMatrix;	// Convert vertex normal to eye space and send it to fragment shader

	vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);	// Convert vertex position to eye space
	vLightDir = normalize(uPointLightPosition - mvPosition.xyz);	// Send calculated light direction to fragment shader

	gl_Position = uPMatrix * mvPosition;	// Transform geometry
}