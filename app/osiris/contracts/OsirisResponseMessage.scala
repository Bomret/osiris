package osiris.contracts

import play.api.libs.json.{Json, JsValue}
import simplex3d.math.floatm.renamed.ConstMat4

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 16:57
 */

sealed trait OsirisResponseMessage {
  def getJson: JsValue
}

case class NodesSetupComplete() extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> "done",
      "data" -> "NodeSetup"
    )
  )
}

case class TransformRequest(private val transform: ConstMat4) extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> Json.toJson("transform"),
      "data" -> Json.toJson(transform.toString())
    )
  )
}

case class OsirisError(private val error: Exception) extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> Json.toJson("error"),
      "data" -> Json.toJson(
        Map(
          "message" -> Json.toJson(error.getMessage),
          "stack" -> Json.toJson(error.getStackTraceString)
        )
      )
    )
  )
}