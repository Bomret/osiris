package controllers

import play.api.libs.iteratee._
import play.api.mvc._
import io.Source
import play.api.libs.json.Json
import javax.accessibility.AccessibleTable

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

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

  def socket = WebSocket.using[String] {
    request =>

    // Send a single 'Hello!' message and close
      val out = Enumerator.imperative[String]()

      // Just consume and ignore the input
      val in = Iteratee.foreach[String](content => out.push("5"))

      (in, out)
  }
}