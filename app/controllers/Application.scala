package controllers

import play.api.mvc._
import play.api.libs.json.{JsObject, Json}
import play.api.Logger
import play.api.libs.concurrent.Akka
import play.api.Play.current
import osiris.infrastructure.{OsirisConfiguration, ReadTextFile}
import osiris.contracts.{SceneAndShaderInfos, ShaderConfiguration, SceneInformation}

/**
 * Augments the HTML page with information about the available scenes and shader programs, then serves it to the client.
 * User: Stefan Reichel
 * Date: 25.07.12
 * Time: 18:13
 */
object Application extends Controller {

  /**
   * Reads the information about the currently available scenes from the filesystem and returns those.
   *
   * @return An [[scala.Array]] containing [[osiris.contracts.SceneInformation]] objects
   */
  private def _readSceneInformation: Array[SceneInformation] = {
    val scenesFileContent = ReadTextFile.fromPath(OsirisConfiguration.SCENEPATH + "availableScenes.json")

    val json = Json.parse(scenesFileContent)
    val scenes: Array[JsObject] = (json \ "scenes").as[Array[JsObject]]

    scenes map (obj => {
      val name = (obj \ "name").as[String]
      val file = (obj \ "file").as[String]
      SceneInformation(name, file)
    })
  }

  /**
   * Reads the information about the available shader programs from the filesystem and returns those.
   *
   * @return An [[scala.Array]] containing [[osiris.contracts.ShaderConfiguration]] objects
   */
  private def _readShaderInformation: Array[ShaderConfiguration] = {
    val shadersFileContent = ReadTextFile fromPath (OsirisConfiguration.SHADERPATH + "availableShaders.json")

    val json = Json.parse(shadersFileContent)
    val shaders: Array[JsObject] = (json \ "shaderConfigs").as[Array[JsObject]]

    shaders map (obj => {
      val name = (obj \ "name").as[String]
      val config = (obj \ "config").as[JsObject]
      ShaderConfiguration(name, config)
    })
  }

  /**
   * Retrieves the information about the currently available scenes and shader programs and returns those.
   *
   * @return An [[osiris.contracts.SceneAndShaderInfos]] object containing information about the currently available scenes and shader programs.
   */
  private def _retrieveSceneAndShaderInformation: SceneAndShaderInfos = {
    val sceneInfos = _readSceneInformation
    val shaderInfos = _readShaderInformation
    SceneAndShaderInfos(sceneInfos, shaderInfos)
  }

  /**
   * Does the necessary computations asynchronously to build the main page and serves it to the client.
   *
   * If anything goes wrong the occuring exception will be logged to the application log and the client will get an Internal Server Error response.
   *
   * @return The compiled main page or an Internal Server Error response if anything goes wrong
   */
  def index = Action {
    try {
      val promise = Akka future {
        _retrieveSceneAndShaderInformation
      }

      Async {
        promise.map(infos => Ok(views.html.index(infos.scenes, infos.shaders)))
      }

    } catch {
      case ex: Exception => {
        Logger.error("Error retrieving the available shaders and scenes in index", ex)
        InternalServerError("There was a problem retrieving the available scenes and shaders.")
      }
    }
  }
}