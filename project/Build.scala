import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName = "Osiris"
  val appVersion = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
  )

  // Siris is its own root project. It is also assumed that Osiris and siris share the same parent directory
  lazy val siris = RootProject(file("../siris"))

  val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
    // Add your own project settings here
  ) dependsOn(siris) // Osiris depends on Siris

}
