package osiris.contracts.types

/**
 * Contains the possible shader types that can be served to the client.
 *
 * User: Stefan Reichel
 * Date: 01.08.12
 * Time: 15:08
 */
object ShaderType extends Enumeration {
  type ShaderType = Value
  val VertexShader = Value("vertexShader")
  val FragmentShader = Value("fragmentShader")
}
