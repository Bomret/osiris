package osiris.contracts

import play.api.libs.json.{Json, JsValue}
import simplex3d.math.floatm.renamed.ConstMat4

/**
 * Base for the definitions of the messages used by the Osiris web application to notify the client of new status events.
 *
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 16:57
 */
sealed trait OsirisResponseMessage {
  def getJson: JsValue
}

/**
 * Signals the client that a previous [[osiris.contracts.SetupRequest]] was successful.
 */
case class NodesSetupComplete() extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> "ok",
      "data" -> "NodeSetup"
    )
  )
}

/**
 * Signals the client that the transformation matrix of a registered entity has changed.
 *
 * @param entityId The id of the entity that has changed.
 * @param transform The new transformation matrix of the entity.
 */
case class TransformRequest(private val entityId: String, private val transform: ConstMat4) extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> Json.toJson("transform"),
      "data" -> Json.toJson(
        Map(
          "nodeId" -> Json.toJson(entityId),
          "transformation" -> Json.toJson(
            Seq(
              transform.m00, transform.m01, transform.m02, transform.m03, transform.m10, transform.m11, transform.m12, transform.m13, transform.m20, transform.m21, transform.m22, transform.m23, transform.m30, transform.m31, transform.m32, transform.m33
            )
          )
        )
      )
    )
  )
}

/**
 * Signals the client that an error has occured.
 *
 * @param message The error message.
 * @param stack The error stack, if available. Otherwise "No stack trace available" will be send.
 */
case class OsirisError(private val message: String, private val stack: String = "No stack trace available") extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> Json.toJson("error"),
      "data" -> Json.toJson(
        Map(
          "message" -> Json.toJson(message),
          "stack" -> Json.toJson(stack)
        )
      )
    )
  )
}