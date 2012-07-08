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

      // Send a single 'Hello!' message and close
      val out = Enumerator.imperative[String]()

      // Just consume and ignore the input
      val in = Iteratee.foreach[String](content => out.push("5"))

      (in, out)
  }
}