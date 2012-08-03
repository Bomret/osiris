package osiris.contracts.types

/**
 * User: Stefan Reichel
 * Date: 01.08.12
 * Time: 15:08
 */

object ShaderType extends Enumeration {
  type ShaderType = Value
  val VertexShader = Value("vertexShader")
  val FragmentShader = Value("fragmentShader")
}
