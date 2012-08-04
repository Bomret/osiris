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

case class OsirisDebug(msg: String) extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> "debug",
      "data" -> msg
    )
  )
}

case class NodesSetupComplete() extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> "ok",
      "data" -> "NodeSetup"
    )
  )
}

case class TransformRequest(private val nodeId: String, private val transform: ConstMat4) extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> Json.toJson("transform"),
      "data" -> Json.toJson(
        Map(
          "nodeId" -> Json.toJson(nodeId),
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

case class RenderStartResponse() extends OsirisResponseMessage {
  def getJson = Json.toJson(
    Map(
      "status" -> "ok",
      "data" -> "StartRender"
    )
  )
}