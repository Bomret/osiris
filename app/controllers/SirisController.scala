package controllers

import play.api.mvc.{WebSocket, Controller}
import play.api.libs.iteratee.{Iteratee, Enumerator}
import osiris.contracts.MessageFromClient
import osiris.OsirisMissionControl

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:01
 */

object SirisController extends Controller {
  val out = Enumerator.imperative[String]()
  val actor = new OsirisMissionControl((msg: String) => {
    out.push(msg)
  })

  actor.start()

  def socket = WebSocket.using[String] {
    request =>
      val in = Iteratee.foreach[String](content => actor ! MessageFromClient(content))

      (in, out)
  }
}
