attribute vec3 aVertexPosition;
attribute vec2 aVertexTexCoords;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoords;

void main() {
    vTexCoords = aVertexTexCoords;

    vec4 vertexEyePosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);	// Convert vertex position to eye space
    gl_Position = uProjectionMatrix * vertexEyePosition;	// Transform geometry
}