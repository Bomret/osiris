package osiris.contracts

import play.api.libs.json.{JsValue, JsObject}
import types.ManipulationType
import simplex3d.math.floatm.ConstVec3f

/**
 * User: Stefan Reichel
 * Date: 01.08.12
 * Time: 21:39
 */

sealed trait OsirisInternalMessage

case class MessageFromClient(message: JsValue) extends OsirisInternalMessage

case class ManipulationRequest(private val json: JsValue) extends OsirisInternalMessage {
  def nodeSymbol = Symbol((json \ "nodeId").as[String])

  def manipulationType = ManipulationType.withName((json \ "data" \ "type").as[String])

  val data = (json \ "data" \ "data").as[Seq[Float]]

  def manipulationData = ConstVec3f(data(0), data(1), data(2))
}

case class SetupRequest(private val json: JsValue) extends OsirisInternalMessage {
  def nodes = (json \ "data").as[Array[JsValue]]
}