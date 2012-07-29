package models

/**
 * User: Stefan Reichel
 * Date: 26.07.12
 * Time: 16:31
 */

object ShaderType extends Enumeration {
  type ShaderType = Value
  val VertexShader = Value("vertexShader")
  val FragmentShader = Value("fragmentShader")
}
