precision mediump float;

uniform vec3 uAmbientLightColor;
uniform vec3 uPointLightColor;
uniform vec3 uPointLightSpecularColor;
uniform vec3 uPointLightPosition;

uniform sampler2D uColorMap;
uniform sampler2D uSpecularMap;

varying vec3 vTransformedVertexNormal;
varying vec2 vVertexTexCoord;
varying vec3 vVertexPosition;

void main(void) {

    // Normalize fragment normal
	vec3 normal = normalize(vTransformedVertexNormal);

	vec3 vecToLight = normalize(vec3(uPointLightPosition - vVertexPosition));

	// Calc diffuse light color of fragment
	float diffuseLightWeighting = max(0.0, dot(normal, vecToLight));
	vec3 diffuseLightColor = vec3(uPointLightColor) * diffuseLightWeighting;

	// Calc specular light color of fragment
	vec3 specularLightColor;
	float specularFactor;

    specularFactor = texture2D(uSpecularMap, vVertexTexCoord).r;

	if (specularFactor == 0.0) { // Avoid unnecessary computation if specularfacor is 0.0
        specularLightColor = vec3 (0.0, 0.0, 0.0);
	} else {
	    vec3 reflectDir = normalize(reflect(-vecToLight, normal));
   		float specularLightWeighting = pow(max(0.0, dot(normal, reflectDir)), 32.0);
   		specularLightColor = uPointLightSpecularColor * specularLightWeighting * specularFactor;
	}

	// Add calculated ambient, diffuse and specular light color
	vec3 lightColor = uAmbientLightColor + diffuseLightColor + specularLightColor;

	vec4 fragmentColor = texture2D(uColorMap, vVertexTexCoord);

	// Final fragment color is interpolation of itself and light color
	gl_FragColor = vec4 (fragmentColor.rgb * lightColor, fragmentColor.a);
}