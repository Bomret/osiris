package controllers

import play.api._
import libs.iteratee._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def socket = WebSocket.using[String] {
    request =>

    // Just consume and ignore the input
      val in = Iteratee.consume[String]()

      // Send a single 'Hello!' message and close
      val out = Enumerator("Hello!") >>> Enumerator.eof

      (in, out)
  }
}