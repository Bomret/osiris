package controllers

import play.api.mvc.{Action, Controller}
import io.Source
import play.api.libs.json.Json

/**
 * Created with IntelliJ IDEA.
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 14:59
 * To change this template use File | Settings | File Templates.
 */

object ShaderController extends Controller {
  def getShaders = Action {
    val availableShaders = Source.fromFile("public/shaders/availableShaders.conf")
    val lines = availableShaders.mkString
    availableShaders.close()

    try {
      val json = Json.parse(lines)
      Ok(json)
    } catch {
      case e: Exception =>
        InternalServerError("There was an error retrieving the available shaders.")
    }
  }

  def getShaderByName = Action {
    Ok
  }
}
