attribute vec3 aVertexPosition;
attribute vec2 aVertexTexCoords;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoords;

void main() {
    vTexCoords = aVertexTexCoords;

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}