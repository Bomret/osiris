package models

/**
 * User: Stefan Reichel
 * Date: 24.07.12
 * Time: 21:04
 */

sealed trait OsirisDataModels

case class SceneInformation(name: String, file: String)

case class ShaderInformation(name: String, config: String)

case class SceneAndShaderInfos(scenes: Array[SceneInformation], shaders: Array[ShaderInformation])
