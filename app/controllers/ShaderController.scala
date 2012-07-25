package controllers

import play.api.mvc.{Action, Controller}
import io.Source
import play.api.libs.json.Json
import osiris.infrastructure.ReadTextFile
import play.api.Logger
import java.io.{File, FileNotFoundException}

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 14:59
 */

object ShaderController extends Controller {
  val _readFile = new ReadTextFile

  def getShaderByFilename = Action(parse.json) {
    request =>
      try {
        val filename = (request.body \ "file").as[String]
        val shaderconfig = _readFile.fromPath("public/shaders/" + filename)
        val configJson = Json.parse(shaderconfig)

        Ok(configJson)
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
}
