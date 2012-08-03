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
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 14:59
 */

object ShaderController extends Controller {

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
   *
   * @param request
   * @param path
   * @return
   */
  private def _retrieveShaderConfigFile(request: Request[JsValue], path: String): JsValue = {
    val filename = (request.body \ "config" \ "file").as[String]
    val configPath = OsirisConfiguration.SHADERPATH + path + filename
    val shaderconfig = ReadTextFile.fromPath(configPath)
    Json.parse(shaderconfig)
  }

  /**
   *
   * @param shaderType The type of the shader
   * @param path The path to the directory this shader file lies in
   * @param config The shader configuration object this shader is specified in
   * @return The shader code wrapped as a JsValue object
   */
  private def _retrieveShaderCode(shaderType: ShaderType, path: String, config: JsValue): JsValue = {
    val shaderFile = (config \ shaderType.toString \ "file").as[String]
    val shaderFilePath = OsirisConfiguration.SHADERPATH + path + shaderFile
    val shaderCode = ReadTextFile.fromPath(shaderFilePath)
    Json.toJson(shaderCode)
  }
}
