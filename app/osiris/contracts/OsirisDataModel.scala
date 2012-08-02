package osiris.contracts

import play.api.libs.json.JsObject
import simplex3d.math.floatm.renamed.ConstMat4
import simplex3d.math.floatm.ConstVec3f

/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 21:04
 */

sealed trait OsirisDataModel

case class SceneInformation(name: String, file: String) extends OsirisDataModel

case class ShaderConfiguration(name: String, config: JsObject) extends OsirisDataModel

case class SceneAndShaderInfos(scenes: Array[SceneInformation], shaders: Array[ShaderConfiguration]) extends OsirisDataModel

case class Shader(shaderType: String, code: String) extends OsirisDataModel

case class ShaderProgramConfiguration(name: String, vertexShader: Shader, fragmentShader: Shader, bindables: JsObject) extends OsirisDataModel
