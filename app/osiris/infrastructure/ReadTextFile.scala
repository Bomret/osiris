package osiris.infrastructure

import io.Source

/**
 * This object contains several methods to read the content of text files from specified locations.
 *
 * User: Stefan Reichel
 * Date: 25.07.12
 * Time: 00:23
 */
object ReadTextFile {
  /**
   * Reads the content of a text file specified by a given path and returns that.
   *
   * It is assumed that the path is valid (exists) and points to a file on the local file system.
   * This method does not do any error handling, so if any exceptions ar thrown on the inside they
   * will get through.
   *
   * @param path The path the text file should be read from
   * @return The complete content of the text file
   */
  def fromPath(path: String): String = {
    val file = Source fromFile (path)
    val lines = file.mkString
    file.close()

    lines
  }
}
