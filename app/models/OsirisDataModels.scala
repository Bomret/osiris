package models

import play.api.libs.json.JsObject

/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 21:04
 */

sealed trait OsirisDataModels

case class SceneInformation(name: String, file: String)

case class ShaderConfiguration(name: String, config: JsObject)

case class SceneAndShaderInfos(scenes: Array[SceneInformation], shaders: Array[ShaderConfiguration])

case class Shader(shaderType: String, code: String)

case class ShaderProgramConfiguration(name: String, vertexShader: Shader, fragmentShader: Shader, bindables: JsObject)
