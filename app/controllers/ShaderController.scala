package controllers

import play.api.mvc.{Request, Action, Controller}
import play.api.libs.json.{JsValue, Json}
import osiris.infrastructure.{OsirisConfiguration, ReadTextFile}
import play.api.Logger
import java.io.FileNotFoundException
import play.api.libs.concurrent.Akka
import play.api.Play.current
import osiris.contracts.types.ShaderType
import osiris.contracts.types.ShaderType._

/**
 * Serves specific shader program configurations to the caller that match the specification contained in the request.
 *
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 14:59
 */
object ShaderController extends Controller {

  /**
   * Parses the sent request and serves the matching shader program configuration to the caller. If there is no shader program configuration that matches the request a Not Found response will be sent. If something goes wrong an Internal Server Error is sent.
   *
   * It is assumed that the request contains a valid JSON object that specifies a scene.
   */
  def getShaderConfigurationByFilename = Action(parse.json) {
    request =>
      try {
        val promise = Akka.future {
          _retrieveShaderConfiguration(request)
        }

        Async {
          promise.map(shaderConfig => Ok(shaderConfig))
        }
      } catch {
        case fnfEx: FileNotFoundException => {
          Logger.error("The specified shader was not found", fnfEx)
          NotFound("The specified shader was not found")
        }
        case ex: Exception => {
          Logger.error("Exception loading the specified shader", ex)
          InternalServerError("There was a problem loading the specified shader")
        }
      }
  }

  /**
   * Parses the given request and returns the matching shader program configuration.
   *
   * @param request The client request. Must contain a JSON body.
   * @return A [[play.api.libs.json.JsValue]] containing the requested shader program configuration.
   */
  private def _retrieveShaderConfiguration(request: Request[JsValue]): JsValue = {
    val name = (request.body \ "name").as[JsValue]
    val path = (request.body \ "config" \ "path").as[String] + "/"

    val configJson = _retrieveShaderConfigFile(request, path)
    val vertexShaderCode = _retrieveShaderCode(ShaderType.VertexShader, path, configJson)
    val fragmentShaderCode = _retrieveShaderCode(ShaderType.FragmentShader, path, configJson)
    val bindables = (configJson \ "bindables").as[JsValue]

    Json.toJson(
      Map(
        "name" -> name,
        "vertexShader" -> vertexShaderCode,
        "fragmentShader" -> fragmentShaderCode,
        "bindables" -> bindables
      )
    )
  }

  /**
   * Retrieves the requested shader configuration file from the given path relative to the shader home dir in the filesystem.
   *
   * @param request The client request. Must contain a JSON body.
   * @param path The path where the requested shader configuration file can be found. Is assumed as relative to the shader home directory.
   * @return The shader configuration file wrapped as [[play.api.libs.json.JsValue]] object.
   */
  private def _retrieveShaderConfigFile(request: Request[JsValue], path: String): JsValue = {
    val filename = (request.body \ "config" \ "file").as[String]
    val configPath = OsirisConfiguration.SHADERPATH + path + filename
    val shaderconfig = ReadTextFile.fromPath(configPath)
    Json.parse(shaderconfig)
  }

  /**
   * Retrieves the shader code specified by the given parameters.
   *
   * @param shaderType The type of the shader.
   * @param path The path to the directory this shader file lies in.
   * @param config The shader configuration object this shader is specified in.
   * @return The shader code wrapped as a [[play.api.libs.json.JsValue]] object.
   */
  private def _retrieveShaderCode(shaderType: ShaderType, path: String, config: JsValue): JsValue = {
    val shaderFile = (config \ shaderType.toString \ "file").as[String]
    val shaderFilePath = OsirisConfiguration.SHADERPATH + path + shaderFile
    val shaderCode = ReadTextFile.fromPath(shaderFilePath)
    Json.toJson(shaderCode)
  }
}
