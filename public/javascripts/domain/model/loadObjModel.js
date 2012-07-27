/**
 * User: Stefan
 * Date: 13.06.12
 */

define(["utils", "parseObjFile", "transformObjModel"], function(utils, parseObjFile, transformObjModel) {
    "use strict";

    return {
        execute: function(pathToModelFile, context) {
            var modelFile,
                parsedModel,
                renderableModel;

            modelFile = loadFile.execute(pathToModelFile);
            parsedModel = parseObjFile.execute(modelFile);
            utils.log("parsedModel", parsedModel);

            renderableModel = transformObjModel.execute(parsedModel, context);

            return renderableModel;
        }
    };
});