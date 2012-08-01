package osiris.domain

import play.api.libs.json.{JsValue, Json}
import actors.{Exit, Actor}
import osiris.contracts._
import osiris.contracts.SetupRequest
import osiris.contracts.MessageFromClient

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 17:18
 */

class OsirisMissionControl(out: (JsValue) => Unit) extends Actor {
  val sirisOverlord = new SirisOverlord
  sirisOverlord start()

  def act() {
    while (true) {
      receive {
        case msg: MessageFromClient => {
          try {
            val json = Json toJson msg.message
            (json \ "request").as[String]
            match {
              case "setup" => {
                sirisOverlord ! SetupRequest(json)
              }

              case "manipulate" => {
                sirisOverlord ! ManipulationRequest(json)
              }

              case "shutdown" => {
                sirisOverlord ! Exit
                exit()
              }
            }
          } catch {
            case ex: Exception => out(OsirisError(ex) getJson)
          }
        }

        case msg: NodesSetupComplete => out(msg getJson)

        case msg: TransformRequest => out(msg getJson)

        case msg: OsirisError => out(msg getJson)
      }
    }
  }
}
