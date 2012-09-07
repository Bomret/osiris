package osiris.contracts

import play.api.libs.json.JsObject

/**
 * Contains the definitions for the data models used by the Osiris web application.
 *
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 21:04
 */
sealed trait OsirisDataModel

/**
 * Contains the relevant information for the client about a scene.
 *
 * @param name The name of the scene
 * @param file The filename of the scene
 */
case class SceneInformation(name: String, file: String) extends OsirisDataModel

/**
 * Contains the relevant information for the client about a shader configuration.
 *
 * @param name The name of the shader configuration
 * @param config The JSON encoded information about the shader configuration file.
 */
case class ShaderConfiguration(name: String, config: JsObject) extends OsirisDataModel

/**
 * Contains information about available scenes and shader configurations.
 *
 * @param scenes An [[scala.Array]] containing [[osiris.contracts.SceneInformation]] objects.
 * @param shaders An [[scala.Array]] containing [[osiris.contracts.ShaderConfiguration]] objects.
 */
case class SceneAndShaderInfos(scenes: Array[SceneInformation], shaders: Array[ShaderConfiguration]) extends OsirisDataModel

/**
 * Contains information about a specific shader.
 *
 * @param shaderType The type of the shader ("vertexShader" or "fragmentShader").
 * @param code The shader source code.
 */
case class Shader(shaderType: String, code: String) extends OsirisDataModel

/**
 * Contains all the necessary information for the client to build a WebGL shader program.
 *
 * @param name The name of the shader program.
 * @param vertexShader The vertex shader as a [[osiris.contracts.Shader]] object.
 * @param fragmentShader The fragment shader as a [[osiris.contracts.Shader]] object.
 * @param bindables The bindable Attributes and Uniforms provided by this shader program.
 */
case class ShaderProgramConfiguration(name: String, vertexShader: Shader, fragmentShader: Shader, bindables: JsObject) extends OsirisDataModel
