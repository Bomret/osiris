package osiris.contracts

import play.api.libs.json.JsValue

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 16:57
 */

sealed trait OsirisMessages

case class MessageFromClient(message: String)

case class JsonMessage(json: JsValue)

case class SceneDescription(sceneDescription: JsValue)

case class OsirisError(error: Exception)


