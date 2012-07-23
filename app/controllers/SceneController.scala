package controllers

import play.api.mvc.{Action, Controller}
import io.Source
import play.api.libs.json.Json

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 23:38
 */

object SceneController extends Controller {
  def getAvailableScenes = Action {
    val availableShaders = Source.fromFile("public/scenes/availableScenes.json")
    val lines = availableShaders.mkString
    availableShaders.close()

    try {
      val json = Json.parse(lines)
      Ok(json)
    } catch {
      case e: Exception =>
        InternalServerError("There was an error retrieving the available scenes.")
    }
  }
}
