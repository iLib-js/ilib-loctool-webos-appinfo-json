/*
 * AppinfoFile.js - plugin to extract resources from a appinfo.json code file
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

var logger = log4js.getLogger("loctool.plugin.AppinfoJsonFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var AppinfoJsonFile = function(props) {
    this.project = props.project;
    this.pathName = props.pathName;
    this.type = props.type;
    this.API = props.project.getAPI();

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
AppinfoJsonFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = unescaped.
        replace(/\\\\n/g, "").                // line continuation
        replace(/\\\n/g, "").                // line continuation
        replace(/^\\\\/, "\\").             // unescape backslashes
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/^\\'/, "'").               // unescape quotes
        replace(/([^\\])\\'/g, "$1'").
        replace(/^\\"/, '"').
        replace(/([^\\])\\"/g, '$1"');

    return unescaped;
};

/**
 * Clean the string to make a resource name string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code but increases matching.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
AppinfoJsonFile.cleanString = function(string) {
    var unescaped = AppinfoJsonFile.unescapeString(string);

    unescaped = unescaped.
        replace(/\\[btnfr]/g, " ").
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in htglob jar file so that the
 * resources match up. See the class IResourceBundle in
 * this project under the java directory for the corresponding
 * code.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
AppinfoJsonFile.prototype.makeKey = function(source) {
    return AppinfoJsonFile.unescapeString(source);
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
AppinfoJsonFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);
    var schema = this.type.schema;
    var parsedData = JSON.parse(data);
    this.resourceIndex = 0;

    for (var i =0; i < schema.length; i++) {
        if (parsedData[schema[i]]) {
            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: AppinfoJsonFile.unescapeString(parsedData[schema[i]]),
                sourceLocale: this.project.sourceLocale,
                source: AppinfoJsonFile.cleanString(parsedData[schema[i]]),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: undefined,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            this.set.add(r);
        }
        else {
            logger.warn("Warning: Bogus empty string in get string call: ");
            //logger.warn("... " + data.substring(result.index, reGetString.lastIndex) + " ...");
        }
    }

    // now check for and report on errors in the source
    this.API.utils.generateWarnings(data, reGetStringBogusConcatenation1,
        "Warning: string concatenation is not allowed in the RB.getString() parameters:",
        logger,
        this.pathName);

    this.API.utils.generateWarnings(data, reGetStringBogusConcatenation2,
        "Warning: string concatenation is not allowed in the RB.getString() parameters:",
        logger,
        this.pathName);

    this.API.utils.generateWarnings(data, reGetStringBogusParam,
        "Warning: non-string arguments are not allowed in the RB.getString() parameters:",
        logger,
        this.pathName);
};

/**
 * Extract all the localizable strings from the java file and add them to the
 * project's translation set.
 */
AppinfoJsonFile.prototype.extract = function() {
    logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
        }
    }
};

/**
 * Return the set of resources found in the current JavaScript file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current JavaScript file.
 */
AppinfoJsonFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write javascript source files
AppinfoJsonFile.prototype.localize = function() {};
AppinfoJsonFile.prototype.write = function() {};

module.exports = AppinfoJsonFile;
