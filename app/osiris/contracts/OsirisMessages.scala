package osiris.contracts

import play.api.libs.json.{JsObject, JsValue}

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 16:57
 */

sealed trait OsirisMessages

case class MessageFromClient(message: JsValue)

case class SetupRequest(nodes: Array[JsObject])

case class SetupComplete()

case class TransformRequest(transform: JsValue)

case class RenderStartRequest()

case class ShutdownRequest()

case class OsirisError(error: Exception)


