package osiris.domain

import actors.Actor
import osiris.contracts._
import osiris.contracts.ShutdownRequest
import osiris.contracts.SetupRequest
import osiris.contracts.MessageFromClient
import play.api.libs.json.JsObject

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 16:52
 */

class EvaluateMessageFromClient extends Actor {

  def act() {
    while (true) {
      receive {
        case MessageFromClient(json) => {
          try {
            (json \ "request").as[String]
            match {
              case "setup" => {
                val nodes = (json \ "data").as[Array[JsObject]]
                sender ! SetupRequest(nodes)
              }
              case "start" => sender ! RenderStartRequest
              case "shutdown" => sender ! ShutdownRequest
            }
          } catch {
            case ex: Exception => sender ! OsirisError(ex)
          }
        }
        case msg: ShutdownRequest => exit()
      }
    }
  }
}
