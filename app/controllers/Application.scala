package controllers

import play.api.mvc._
import models.{ShaderInformation, SceneInformation}
import io.{BufferedSource, Source}
import play.api.libs.json.{JsObject, JsArray, Json}

object Application extends Controller {

  private def _readTextFile(url: String): String = {
    val file = Source fromFile (url)
    val lines = file.mkString
    file.close()

    lines
  }

  private def _readSceneInformation: Array[SceneInformation] = {
    val scenesFileContent = _readTextFile("public/scenes/availableScenes.json")

    val json = Json.parse(scenesFileContent)
    val scenes: Array[JsObject] = (json \ "scenes").as[Array[JsObject]]

    scenes map (obj => {
      val name = (obj \ "name").as[String]
      val file = (obj \ "file").as[String]
      SceneInformation(name, file)
    })
  }

  private def _readShaderInformation: Array[ShaderInformation] = {
    val shadersFileContent = _readTextFile("public/shaders/availableShaders.json")

    val json = Json.parse(shadersFileContent)
    val shaders: Array[JsObject] = (json \ "shaders").as[Array[JsObject]]

    shaders map (obj => {
      val name = (obj \ "name").as[String]
      val description = (obj \ "description").as[String]
      val config = (obj \ "config").as[String]
      ShaderInformation(name, description, config)
    })
  }

  def index = Action {
    try {
      val sceneInfos = _readSceneInformation
      val shaderInfos = _readShaderInformation

      Ok(views.html.index(sceneInfos, shaderInfos))
    } catch {
      case ex:Exception => InternalServerError("There was a problem retrieving the available scenes and shaders.")
    }
  }
}