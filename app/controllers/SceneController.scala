package controllers

import play.api.mvc.{Action, Controller}
import play.api.libs.json.Json
import osiris.infrastructure.{OsirisConfiguration, ReadTextFile}
import java.io.FileNotFoundException
import play.api.Logger

/**
 * Serves specific scenes to the caller that match the specification contained in the request.
 *
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 23:38
 */
object SceneController extends Controller {

  /**
   * Parses the sent request and serves the matching scene to the caller. If there is no scene that matches the request a Not Found response will be sent. If something goes wrong an Internal Server Error is sent.
   *
   * It is assumed that the request contains a valid JSON object that specifies a scene.
   */
  def getSceneByFilename = Action(parse.json) {
    request =>
      try {
        val filename = (request.body \ "file").as[String]
        val scenePath = OsirisConfiguration.SCENEPATH + filename
        val scene = ReadTextFile.fromPath(scenePath)
        val response = Json.parse(scene)
        Ok(response)
      } catch {
        case fnfEx: FileNotFoundException => {
          Logger.error("The specified scene was not found", fnfEx)
          NotFound("The specified scene was not found")
        }
        case ex: Exception => {
          Logger.error("Exception loading the specified Scene", ex)
          InternalServerError("There was a problem loading the specified Scene")
        }
      }
  }
}
