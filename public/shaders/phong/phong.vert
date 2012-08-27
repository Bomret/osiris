attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexTexCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec3 vTransformedVertexNormal;
varying vec2 vVertexTexCoord;
varying vec3 vVertexPosition;

void main(void) {
    vVertexTexCoord = aVertexTexCoord;	// Send texture coordinates to fragment shader
    vTransformedVertexNormal = normalize((uMVMatrix * vec4(aVertexNormal, 0.0)).xyz); // Convert vertex normal to eye space and send it to fragment shader

	vec4 vertexEyePosition = uMVMatrix * vec4(aVertexPosition, 1.0);	// Convert vertex position to eye space
	vVertexPosition = vertexEyePosition.xyz / vertexEyePosition.w;	// Send calculated vertex position to fragment shader

	gl_Position = uPMatrix * vertexEyePosition;	// Transform geometry
}