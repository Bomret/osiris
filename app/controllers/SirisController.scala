package controllers

import play.api.mvc.{WebSocket, Controller}
import play.api.libs.iteratee.{Iteratee, Enumerator}
import osiris.contracts.MessageFromClient
import osiris.domain.OsirisMissionControl
import actors.Actor
import collection.mutable
import play.api.libs.json.JsValue

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:01
 */

object SirisController extends Controller {
  val users = mutable.HashMap[String, Actor]()
  val out = Enumerator.imperative[JsValue]()
  val osirisMissionControl = new OsirisMissionControl(msg => out push msg)

  osirisMissionControl start()

  def socket = WebSocket.using[JsValue] {
    request =>
    //      val id = request.session.get("connected").getOrElse(util.UUID.randomUUID().toString)
    //      if (!users.contains(id)) {
    //        val osirisMissionControl = new OsirisMissionControl((msg) => out.push(msg))
    //        users.put(id, osirisMissionControl)
    //        osirisMissionControl.start()
    //      }
      val in = Iteratee.foreach[JsValue](content => osirisMissionControl ! MessageFromClient(content))

      (in, out)
  }
}
