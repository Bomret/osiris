package osiris

import contracts.{SceneDescription, JsonMessage}
import actors.Actor

/**
 * User: Stefan Reichel
 * Date: 23.07.12
 * Time: 16:52
 */

class EvaluateMessageFromClient extends Actor {
  var shouldRun = true

  def act() {
    while (shouldRun) {
      receive {
        case JsonMessage(json) => {
          //val messageType = (json \ "type").asOpt[String]
          //if (messageType == "scene") {
          sender ! SceneDescription(json)
          //}
        }
      }
    }
  }
}
