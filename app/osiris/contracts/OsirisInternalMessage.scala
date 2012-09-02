package osiris.contracts

import play.api.libs.json.JsValue
import simplex3d.math.floatm.ConstVec3f

/**
 * Base for the definitions of the messages used internally by the Osiris web application to communicate with the relevant actors for the SIRIS binding.
 *
 * User: Stefan Reichel
 * Date: 01.08.12
 * Time: 21:39
 */
sealed trait OsirisInternalMessage

/**
 * Contains a JSON message from the client.
 *
 * @param message The JSON message from the client
 */
case class MessageFromClient(message: JsValue) extends OsirisInternalMessage

/**
 * Contains the relevant information needed by the physics engine bound to SIRIS to apply a specific manipulation to a specific entity.
 *
 * @param json The JSON encoded manipulation information.
 */
case class ManipulationRequest(private val json: JsValue) extends OsirisInternalMessage {
  def nodeSymbol = Symbol((json \ "data" \ "nodeId").as[String])

  def manipulationType = (json \ "data" \ "type").as[String]

  val data = (json \ "data" \ "manipulationData").as[Array[Float]]

  def manipulationData = ConstVec3f(data(0), data(1), data(2))
}

/**
 * Contains information about the nodes that should be turned into [[siris.core.ontology.types.Entity]] objects and registered in SIRIS.
 *
 * @param json The JSON encoded information about the nodes to be setup in SIRIS.
 */
case class SetupRequest(private val json: JsValue) extends OsirisInternalMessage {
  def nodes = (json \ "data").as[Array[JsValue]]
}