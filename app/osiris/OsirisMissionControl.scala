package osiris

import contracts.{JsonMessage, SceneDescription, MessageFromClient}
import play.api.libs.json.Json
import actors.Actor
import akka.actor.SupervisorStrategy.Stop

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 17:18
 */

class OsirisMissionControl(out: (String) => Unit) extends Actor {
  var shouldRun = true
  val evaluateOsirisMessage = new EvaluateMessageFromClient

  evaluateOsirisMessage.start()

  def act() {
    while (shouldRun) {
      receive {
        case MessageFromClient(message) => {
          try {
            out("Incoming message: " + message)
            val json = Json.parse(message)
            evaluateOsirisMessage ! JsonMessage(json)
          } catch {
            case exception: Exception => out(exception.getMessage)
          }
        }
        case SceneDescription(sceneDescription) => {
          val scene = Json.stringify(sceneDescription)
          out(scene)
        }
        case Stop => {
          shouldRun = false
        }
      }
    }
  }
}
