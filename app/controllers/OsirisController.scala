package controllers

import play.api.mvc.{WebSocket, Controller}
import play.api.libs.iteratee.{Iteratee, Enumerator}
import osiris.contracts.MessageFromClient
import osiris.domain.OsirisMessageEvaluator
import play.api.libs.json.JsValue

/**
 * Provides the interface for the WebSocket communication link with the client. Also contains the binding actor to SIRIS.
 *
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:01
 */

object OsirisController extends Controller {
  val out = Enumerator.imperative[JsValue]()
  val osirisMissionControl = new OsirisMessageEvaluator(msg => out push msg)

  osirisMissionControl start()

  def socket = WebSocket.using[JsValue] {
    request =>
      val in = Iteratee.foreach[JsValue](content => osirisMissionControl ! MessageFromClient(content))

      (in, out)
  }
}
