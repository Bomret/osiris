package controllers

import play.api.mvc._
import models.{SceneAndShaderInfos, ShaderInformation, SceneInformation}
import play.api.libs.json.{JsObject, Json}
import play.api.Logger
import play.api.libs.concurrent.Akka
import play.api.Play.current
import osiris.infrastructure.ReadTextFile

object Application extends Controller {
  private val _readTextFile = new ReadTextFile

  private def _readSceneInformation: Array[SceneInformation] = {
    val scenesFileContent = _readTextFile.fromPath("public/scenes/availableScenes.json")

    val json = Json.parse(scenesFileContent)
    val scenes: Array[JsObject] = (json \ "scenes").as[Array[JsObject]]

    scenes map (obj => {
      val name = (obj \ "name").as[String]
      val file = (obj \ "file").as[String]
      SceneInformation(name, file)
    })
  }

  private def _readShaderInformation: Array[ShaderInformation] = {
    val shadersFileContent = _readTextFile.fromPath("public/shaders/availableShaders.json")

    val json = Json.parse(shadersFileContent)
    val shaders: Array[JsObject] = (json \ "shaders").as[Array[JsObject]]

    shaders map (obj => {
      val name = (obj \ "name").as[String]
      val config = (obj \ "config").as[String]
      ShaderInformation(name, config)
    })
  }

  private def _retrieveSceneAndShaderInformation: SceneAndShaderInfos = {
    val sceneInfos = _readSceneInformation
    val shaderInfos = _readShaderInformation
    SceneAndShaderInfos(sceneInfos, shaderInfos)
  }

  /**
   * This Action does the necessary computations asynchronously to build the main page
   * and serves it to the client.
   *
   * If anything goes wrong the occuring exception will be logged to the application log
   * and the client will get an Internal Server Error response.
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