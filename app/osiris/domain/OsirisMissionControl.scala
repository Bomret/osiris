package osiris.domain

import play.api.libs.json.{JsValue, Json}
import actors.Actor
import akka.actor.SupervisorStrategy.Stop
import osiris.contracts._
import osiris.contracts.ShutdownRequest
import osiris.contracts.SetupRequest
import osiris.contracts.MessageFromClient

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 17:18
 */

class OsirisMissionControl(out: (JsValue) => Unit) extends Actor {
  val evaluateOsirisMessage = new EvaluateMessageFromClient
  val setupSirisComponents = new SetupSirisComponents

  evaluateOsirisMessage.start()
  setupSirisComponents.start()

  def act() {
    while (true) {
      receive {
        case msg: MessageFromClient => evaluateOsirisMessage ! msg
        case msg: SetupRequest => setupSirisComponents ! msg
        case TransformRequest(data) => {
          val transformJson = Json.toJson(
            Map(
              "status" -> "transform",
              "data" -> Json.stringify(data)
            )
          )
          out(transformJson)
        }
        case OsirisError(error) => {
          val errorJson = Json.toJson(
            Map(
              "status" -> "error",
              "data" -> error.getMessage
            )
          )
          out(errorJson)
        }
        case msg: SetupComplete => {
          val responseJson = Json.toJson(
            Map(
              "status" -> "done",
              "data" -> "NodeSetup"
            )
          )
          out(responseJson)
        }
        case msg: ShutdownRequest => exit()
      }
    }
  }
}
