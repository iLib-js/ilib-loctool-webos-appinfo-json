/*
 * AppinfoFileType.js - Represents a collection of appinfo.json files
 *
 * Copyright © 2019, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var AppinfoJsonFile = require("./AppinfoJsonFile.js");
var logger = log4js.getLogger("loctool.plugin.AppinfoJsonFileType");

var AppinfoJsonFileType = function(project) {
    this.type = "json";
    this.resourceType = "json";
    this.project = project;
    this.extensions = [".json"];

    /* in order to match proper xliff
    * datatype value is using to create reskey
    */
    var dataTypeMap = {
        "webos-web":"javascript",
        "webos-qml": "x-qml",
        "webos-cpp": "cpp",
        "webos-c": "cpp"
    }

    this.datatype = dataTypeMap[project.options.projectType] || "javascript";

    this.API = project.getAPI();
    this.extracted = this.API.newTranslationSet(project.getSourceLocale());
    this.newres = this.API.newTranslationSet(project.getSourceLocale());
    this.pseudo = this.API.newTranslationSet(project.getSourceLocale());

    this.schema = loadSchema();
};

function loadSchema() {
    var localizeKeys = [];
    var schemaFilePath = path.join(process.env.PWD, "node_modules", "ilib-loctool-webos-appinfo-json", "schema/appinfo.schema.json");
    logger.debug("AppinfoJsonFileTyp load Schema File " + schemaFilePath + "?");
    var loadSchemaFile, schemaData;

    if (fs.existsSync(schemaFilePath)) {
        loadSchemaFile = fs.readFileSync(schemaFilePath, "utf-8");
        schemaData = JSON.parse(loadSchemaFile);
    } else {
        logger.warn("Could not open schema file: " + schemaFilePath);
    }

    for (var key in schemaData.properties) {
        if (schemaData.properties[key].localizable == true) {
            localizeKeys.push(key);
        }
    }
    return localizeKeys;
}

/**
 * Return true if the given path is a java file and is handled
 * by the current file type.
 *
 * @param {String} pathName path to the file being questions
 * @returns {boolean} true if the path is a java file, or false
 * otherwise
 */
AppinfoJsonFileType.prototype.handles = function(pathName) {
    logger.debug("AppinfoJsonFileTyp handles " + pathName + "?");
    if (!pathName) return false;
    
    return (pathName === "appinfo.json") ? true : false
};

AppinfoJsonFileType.prototype.name = function() {
    return "Appinfo Json File Type";
};

/**
 * Write out the aggregated resources for this file type. In
 * some cases, the string are written out to a common resource
 * file, and in other cases, to a type-specific resource file.
 * In yet other cases, nothing is written out, as the each of
 * the files themselves are localized individually, so there
 * are no aggregated strings.
 */
AppinfoJsonFileType.prototype.write = function(translations, locales) {
    // templates are localized individually, so we don't have to
    // write out the resources
};

AppinfoJsonFileType.prototype.newFile = function(path) {
    return new AppinfoJsonFile({
        project: this.project,
        pathName: path,
        type: this
    });
};

AppinfoJsonFileType.prototype.getDataType = function() {
    return this.datatype;
};

AppinfoJsonFileType.prototype.getResourceTypes = function() {
    return {};
};

/**
 * Return the name of the node module that implements the resource file type, or
 * the path to a javascript file that implements the resource filetype.
 * @returns {Function|undefined} node module name or path, or undefined if this file type does not
 * need resource files
 */
AppinfoJsonFileType.prototype.getResourceFileType = function() {
    return AppinfoJsonFileType;
};


AppinfoJsonFileType.prototype.getResourceFile = function(locale) {
    return {};
}

/**
 * Return the translation set containing all of the extracted
 * resources for all instances of this type of file. This includes
 * all new strings and all existing strings. If it was extracted
 * from a source file, it should be returned here.
 *
 * @returns {TranslationSet} the set containing all of the
 * extracted resources
 */
AppinfoJsonFileType.prototype.getExtracted = function() {
    return this.extracted;
};

/**
 * Add the contents of the given translation set to the extracted resources
 * for this file type.
 *
 * @param {TranslationSet} set set of resources to add to the current set
 */
AppinfoJsonFileType.prototype.addSet = function(set) {
    this.extracted.addSet(set);
};

/**
 * Return the translation set containing all of the new
 * resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * new resources
 */
AppinfoJsonFileType.prototype.getNew = function() {
    return this.newres;
};

/**
 * Return the translation set containing all of the pseudo
 * localized resources for all instances of this type of file.
 *
 * @returns {TranslationSet} the set containing all of the
 * pseudo localized resources
 */
AppinfoJsonFileType.prototype.getPseudo = function() {
    return this.pseudo;
};

/**
 * Return the list of file name extensions that this plugin can
 * process.
 *
 * @returns {Array.<string>} the list of file name extensions
 */
AppinfoJsonFileType.prototype.getExtensions = function() {
    return this.extensions;
};

module.exports = AppinfoJsonFileType;
