precision mediump float;

uniform sampler2D uColorMap;

varying vec2 vTexCoords;

void main() {
    gl_FragColor = texture2D(uColorMap, vTexCoords);
    //gl_FragColor = vVertexColor;
}