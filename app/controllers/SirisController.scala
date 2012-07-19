package controllers

import play.api.mvc.{WebSocket, Controller}
import play.api.libs.iteratee.{Iteratee, Enumerator}
import actors.AbstractActor
import siris.core.svaractor.SVarActorHW
import osiris.BuildScene

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:01
 */

object SirisController extends Controller {
  var actor:AbstractActor = BuildScene

  def socket = WebSocket.using[String] {
    request =>
      val out = Enumerator.imperative[String]()
      val in = Iteratee.foreach[String](content => out.push("5"))

      (in, out)
  }
}
