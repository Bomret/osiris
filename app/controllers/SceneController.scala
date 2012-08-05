package controllers

import play.api.mvc.{Action, Controller}
import play.api.libs.json.Json
import osiris.infrastructure.{OsirisConfiguration, ReadTextFile}
import java.io.FileNotFoundException
import play.api.Logger

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 23:38
 */

object SceneController extends Controller {
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
          Logger.error("The specified Scene was not found", fnfEx)
          NotFound("The specified scen was not found")
        }
        case ex: Exception => {
          Logger.error("Exception loading the specified Scene", ex)
          InternalServerError("There was a problem loading the specified Scene")
        }
      }
  }
}
