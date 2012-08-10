attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTexCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec3 vVertexNormal;
varying vec2 vVertexTexCoord;
varying vec3 vVertexPosition;

void main(void) {
    vVertexTexCoord = aVertexTexCoord;	// Send texture coordinates to fragment shader
	vVertexNormal = normalize(aVertexNormal * uNMatrix);	// Convert vertex normal to eye space and send it to fragment shader

	vec4 mvPosition = uMVMatrix * vec4(aVertexPosition, 1.0);	// Convert vertex position to eye space
	vVertexPosition = mvPosition.xyz / mvPosition.z;	// Send calculated vertex position to fragment shader

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);	// Transform geometry
}