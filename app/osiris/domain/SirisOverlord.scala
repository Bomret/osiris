package osiris.domain

import siris.components.io.IORegistryHandling
import siris.components.physics.ApplyImpulse
import siris.components.physics.jbullet.JBulletComponent
import siris.components.physics._
import siris.components.physics.PhysBox
import siris.components.physics.PhysicsConfiguration
import siris.components.physics.PhysPlane
import siris.core.entity.description.AspectBase
import siris.core.entity.{Entity, EntityCreationHandling}
import siris.core.ontology.EntityDescription
import siris.core.ontology.EntityDescription
import siris.core.ontology.types.Transformation
import siris.core.svaractor.SVarActorHW
import simplex3d.math.floatm.FloatMath
import simplex3d.math.floatm.renamed.{ConstMat4, Mat4x4}
import simplex3d.math.floatm.ConstVec3f
import osiris.contracts._
import scala.Left
import play.api.libs.json.{JsValue, JsObject}
import scala.Some
import actors.AbstractActor
import scala.Left
import osiris.contracts.NodesSetupComplete
import osiris.contracts.TransformRequest
import osiris.contracts.OsirisError
import scala.Some
import osiris.contracts.SetupRequest
import play.api.libs.json.JsObject
import osiris.contracts.ManipulationRequest

/**
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:09
 */

class SirisOverlord extends SVarActorHW with EntityCreationHandling with IORegistryHandling {
  var physicsActor: AbstractActor = null

  override def startUp() {
    _createComponents()
  }

  protected def _createComponents() {
    createActor[JBulletComponent]()(physics => {
      physics ! PhysicsConfiguration(ConstVec3f(0.0f, -9.81f, 0.0f))

      physicsActor = physics
    })(error => sender ! OsirisError(error.getMessage, error.getStackTraceString))
  }

  override def shutdown() {
    super.shutdown()
  }

  private def _makePhysicShape(node: JsValue): AspectBase = {
    val trans = _makeTransformation(node)
    val physics = (node \ "physics").as[JsObject]
    val shape = (physics \ "shape").as[String]

    var physShape: AspectBase = null

    if (shape == "box") {
      val halfExtends = (physics \ "halfExtends").as[Float]
      val restitution = (physics \ "restitution").as[Float]
      val mass = (physics \ "mass").as[Float]

      physShape = PhysBox(
        transform = Left(trans),
        halfExtends = ConstVec3f(halfExtends, halfExtends, halfExtends),
        restitution = restitution,
        mass = mass
      )
    } else if (shape == "plane") {
      val normal = (physics \ "normal").as[Array[Float]]
      val mass = (physics \ "mass").as[Float]
      physShape = PhysPlane(
        transform = Left(trans),
        normal = ConstVec3f(normal(0), normal(1), normal(2)),
        mass = mass
      )
    }

    physShape
  }

  private def _makeTransformation(node: JsValue): ConstMat4 = {
    val transformation = (node \ "transformation").as[Array[Float]]
    val trans = ConstMat4(
      transformation(0), transformation(1), transformation(2), transformation(3),
      transformation(4), transformation(5), transformation(6), transformation(7),
      transformation(8), transformation(9), transformation(10), transformation(11),
      transformation(12), transformation(13), transformation(14), transformation(15)
    )
    trans
  }

  addHandler[SetupRequest] {
    msg => {
      val origin = sender

      msg.nodes foreach {
        node => {
          val id = Symbol((node \ "id").as[String])

          handleEntity(id)(entity => entity match {
            case Some(ent) => physicsActor ! SetTransformation(ent, _makeTransformation(node))
            case None => {
              realize(
                EntityDescription(
                  _makePhysicShape(node)
                ),
                (e: Entity) => {
                  registerEntity(id, e)

                  e.get(Transformation) match {
                    case Some(sVar) => observe(sVar, (mat: Mat4x4) => origin ! TransformRequest(id.name, FloatMath.transpose(mat)))
                    case None => origin ! OsirisError("The node '" + id + "' has no transformation")
                  }
                }
              )
            }
          })
        }
      }

      origin ! NodesSetupComplete()
    }
  }

  addHandler[ManipulationRequest] {
    request => {
      val origin = sender

      handleEntity(request.nodeSymbol)(node => node match {
        case Some(n) => {
          if (request.manipulationType == "ApplyImpulse") {
            val data = request.manipulationData
            physicsActor ! ApplyImpulse(node.get, data)
          }
        }
        case None => origin ! OsirisError("A node with id '" + request.nodeSymbol + "' was not registered.")
      })
    }
  }
}
