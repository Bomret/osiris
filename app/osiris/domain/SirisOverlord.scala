package osiris.domain

import siris.components.io.IORegistryHandling
import siris.components.physics.jbullet.JBulletComponent
import siris.components.physics._
import siris.components.physics.PhysBox
import siris.components.physics.PhysicsConfiguration
import siris.components.physics.PhysPlane
import siris.core.entity.{Entity, EntityCreationHandling}
import siris.core.ontology.EntityDescription
import siris.core.ontology.types.Transformation
import siris.core.svaractor.SVarActorHW
import simplex3d.math.floatm.FloatMath
import simplex3d.math.floatm.renamed.{ConstMat4, Mat4x4}
import simplex3d.math.floatm.ConstVec3f
import play.api.libs.json.JsValue
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
 * Represents the Osiris <-> SIRIS binding. This actor behaves similar to the [[siris.core.SIRISApplication]] class. It sets up the required SIRIS actors (currently [[siris.components.physics.jbullet.JBulletComponent]] only), handles the creation and registration of new [[siris.core.entity.Entity]] objects, handles [[osiris.contracts.ManipulationRequest]] messages and sends [[osiris.contracts.TransformRequest]] messages when the transformation matrix of a registered [[siris.core.entity.Entity]] has changed.
 *
 * User: Stefan Reichel
 * Date: 19.07.12
 * Time: 15:09
 */
sealed class SirisOverlord extends SVarActorHW with EntityCreationHandling with IORegistryHandling {
  var physicsActor: AbstractActor = null

  override def startUp() {
    _createComponents()
  }

  /**
   * Creates the necessary components for Osiris to run. Currently only creates the physics component.
   */
  private def _createComponents() {
    createActor[JBulletComponent]()(physics => {
      physics ! PhysicsConfiguration(ConstVec3f(0.0f, -9.81f, 0.0f))

      physicsActor = physics
    })(error => sender ! OsirisError(error.getMessage, error.getStackTraceString))
  }

  override def shutdown() {
    super.shutdown()
  }

  /**
   * Creates a [[siris.components.physics.PhysicsAspect]] for the given node.
   *
   * It reads the physics description in the node's properties and creates an appropriate aspect.
   *
   * @param node The node the [[siris.components.physics.PhysicsAspect]] should be created for.
   * @return An appropriate [[siris.components.physics.PhysicsAspect]] for the node.
   */
  private def _makePhysicShape(node: JsValue): PhysicsAspect = {
    var physShape: PhysicsAspect = null

    val trans = _makeTransformation(node)
    val physics = (node \ "physics").as[JsObject]
    val shape = (physics \ "shape").as[String]

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

  /**
   * Creates a transformation matrix usable by SIRIS for the given node.
   *
   * @param node The node the transformation matrix should be created for.
   * @return The created transformation matrix.
   */
  private def _makeTransformation(node: JsValue): ConstMat4 = {
    val transformation = (node \ "transformation").as[Array[Float]]

    ConstMat4(
      transformation(0), transformation(1), transformation(2), transformation(3),
      transformation(4), transformation(5), transformation(6), transformation(7),
      transformation(8), transformation(9), transformation(10), transformation(11),
      transformation(12), transformation(13), transformation(14), transformation(15)
    )
  }

  /**
   * Handles [[osiris.contracts.SetupRequest]] messages by checking each contained node wether it has already been registered. If so, the registered node's transformation matrix will be replaced by the incoming node's one. If not, a new [[siris.core.entity.Entity]] is created from the node and registered in SIRIS.
   *
   * It also observes the newly created entity's transformation matrix and sends [[osiris.contracts.TransformRequest]] messages whenever that changes.
   *
   * If something goes wrong an [[osiris.contracts.OsirisError]] message is sent.
   */
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

  /**
   * Handles [[osiris.contracts.ManipulationRequest]] messages by transforming the provided manipulation data into a format SIRIS understands and applies that.
   *
   * If the node referenced in the request was not registered before, an [[osiris.contracts.OsirisError]] is sent.
   */
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
