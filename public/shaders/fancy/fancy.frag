precision mediump float;

uniform vec3 uAmbientLightColor;
uniform vec3 uPointLightColor;
uniform vec3 uPointLightSpecularColor;

uniform sampler2D uColorMap;
uniform sampler2D uNormalMap;
uniform sampler2D uSpecularMap;

varying vec3 vVertexNormal;
varying vec2 vVertexTexCoord;
varying vec3 vLightDir;

void main(void) {

    // Calculate fragment normal
    vec3 normalMap = texture2D(uNormalMap, vVertexTexCoord).rgb * 2.0 - 1.0;
	vec3 normal = normalize(vVertexNormal - normalMap);

	vec3 normalLightDir = normalize(vLightDir);

	// Calc diffuse light color of fragment
	float diffuseLightWeighting = max(0.0, dot(normal, normalLightDir));
	vec3 diffuseLightColor = vec3(1.0,1.0,1.0) * diffuseLightWeighting;

	// Calc specular light color of fragment
	vec3 specularLightColor;

	float specularFactor= texture2D(uSpecularMap, vVertexTexCoord).r;

	if (specularFactor == 0.0) { // Avoid unnecessary computation if specularfacor is 0.0
        specularLightColor = vec3 (0.0, 0.0, 0.0);
	} else {
	    vec3 reflectDir = normalize(reflect(-normalLightDir, normal));
   		float specularLightWeighting = pow(max(0.0, dot(normal, reflectDir)), 32.0);
   		specularLightColor = uPointLightSpecularColor * specularLightWeighting * specularFactor;
	}

	// Add calculated ambient, diffuse and specular light color
	vec3 lightColor = uAmbientLightColor + diffuseLightColor + specularLightColor;

	vec4 fragmentColor = texture2D(uColorMap, vVertexTexCoord);

	// Final fragment color is interpolation of itself and light color
	gl_FragColor = vec4 (fragmentColor.rgb * lightColor, fragmentColor.a);
}