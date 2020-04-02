/*
 * AppinfoFile.js - plugin to extract resources from a appinfo.json code file
 *
 * Copyright © 2019-2020, JEDLSoft
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
var Locale = require("ilib/lib/Locale.js");
var LocaleMatcher = require("ilib/lib/LocaleMatcher.js");

var log4js = require("log4js");
var logger = log4js.getLogger("loctool.plugin.AppinfoJsonFile");

/**
 * Create a new appinfo.json file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var AppinfoJsonFile = function(props) {
    var lanDefaultLocale, propsLocale;

    this.baseLocale = false;
    this.project = props.project;
    this.pathName = props.pathName;
    this.locale = new LocaleMatcher({locale:props.locale}).getLikelyLocaleMinimal();
    this.API = props.project.getAPI();

    langDefaultLocale = new LocaleMatcher({locale: this.locale.language});
    this.baseLocale = langDefaultLocale.getLikelyLocaleMinimal().getSpec() === this.locale.getSpec();
    this.type = props.type;

    this.datatype = "x-json";
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
 * exactly with the code in file so that the
 * resources match up. See the class IResourceBundle in
 * this project under the directory for the corresponding
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

AppinfoJsonFile.prototype.loadSchema = function(source) {
    var localizeProperties = {}, schemaFilePath;
    if (this.project.schema) {
        schemaFilePath = path.join(process.env.PWD, this.project.schema);
    } else {
        schemaFilePath = path.join(process.env.PWD, "node_modules", "ilib-loctool-webos-appinfo-json", "schema/appinfo.schema.json");
    }
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
            localizeProperties[key] = schemaData.properties[key];
        }
    }
    return localizeProperties;
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
AppinfoJsonFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    this.parsedData = data;

    if (typeof data !== "object") {
        this.parsedData = JSON.parse(data);
    }

    if (!this.schema) {
        this.schema = this.loadSchema();
    }
    this.resourceIndex = 0;
    for (var property in this.schema) {
        if ((this.parsedData[property]) &&
            (this.schema[property].type === typeof this.parsedData[property])) {
            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: AppinfoJsonFile.unescapeString(this.parsedData[property]),
                sourceLocale: this.project.sourceLocale,
                source: AppinfoJsonFile.cleanString(this.parsedData[property]),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: undefined,
                datatype: this.datatype,
                index: this.resourceIndex++
            });
            this.set.add(r);
        } else {
            logger.debug("[" + property + "] property doesn't have localized `true` or not match the required data type.");
        }
    }
};

/**
 * Extract all the localizable strings from the appinfo.json file and add them to the
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
 * Return the set of resources found in the current appinfo.json file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current appinfo.json file.
 */
AppinfoJsonFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write appinfo.json source files
AppinfoJsonFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
AppinfoJsonFile.prototype.getLocalizedPath = function(locale) {
    var rootPath = this.project.getResourceDirs("json")[0] || ".";
    var fullPath = "";

    var splitLocale = locale.split("-");
    if (this.baseLocale) {
        fullPath = "/" + splitLocale[0];
    } else {
        for (var i=0; i < splitLocale.length; i++) {
            fullPath += "/"+ splitLocale[i];
        }
    }
    return rootPath + fullPath;
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
AppinfoJsonFile.prototype.localizeText = function(translations, locale) {
    var output = {};
    var stringifyOuput ="";
    for (var property in this.parsedData) {
        if (this.schema[property]){
            var text = this.parsedData[property];
            var key = this.makeKey(this.API.utils.escapeInvalidChars(text));
            var tester = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                sourceLocale: this.project.getSourceLocale(),
                reskey: key,
                datatype: this.datatype
            });
            var hashkey = tester.hashKeyForTranslation(locale);
            var alternativeKey = hashkey.replace("x-json", "javascript");

            var translated = translations.getClean(hashkey) || translations.getClean(alternativeKey);

            if (translated) {
                output[property] = translated.target;
            } else {
                logger.trace("New string found: " + text);
                var r = this.API.newResource({
                    resType: "string",
                    project: this.project.getProjectId(),
                    key: this.makeKey(this.API.utils.escapeInvalidChars(text)),
                    sourceLocale: this.project.getSourceLocale(),
                    source: this.API.utils.escapeInvalidChars(text),
                    targetLocale: locale,
                    target: this.API.utils.escapeInvalidChars(text),
                    reskey: key,
                    state: "new",
                    datatype: this.datatype
                });
                this.type.newres.add(r);
            }
        }
    }

    if (output) {
        stringifyOuput = JSON.stringify(output, true, 4);
    }

    return stringifyOuput;
}

/**
  * Localize the contents of this appinfo.json file and write out the
  * localized appinfo.json file to a different file path.
  *
  * @param {TranslationSet} translations the current set of
  * translations
  * @param {Array.<String>} locales array of locales to translate to
  */
AppinfoJsonFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    for (var i=0; i < locales.length; i++) {
       if (!this.project.isSourceLocale(locales[i])) {
            var pathName = this.getLocalizedPath(locales[i]);
            var translatedOutput = this.localizeText(translations, locales[i]);
            if (translatedOutput !== "{}") {
                this.API.utils.makeDirs(pathName);
                fs.writeFileSync(pathName + "/appinfo.json", translatedOutput, "utf-8");
            }
       }
    }
};

/**
  * Write the manifest file to dist.
  */
AppinfoJsonFile.prototype.writeManifest = function(filePath) {
    var manifest = {
        files: []
    };

    if (!fs.existsSync(filePath)) return;

    function walk(root, dir) {
        var list = fs.readdirSync(path.join(root, dir));
        list.forEach(function (file) {
            var sourcePathRelative = path.join(dir, file);
            var sourcePath = path.join(root, sourcePathRelative);
            var stat = fs.statSync(sourcePath);
            if (stat && stat.isDirectory()) {
                walk(root, sourcePathRelative);
            } else {
                if (file.match(/\.json$/) && (file !== "ilibmanifest.json")) {
                    manifest.files.push(sourcePathRelative);
                }
            }
        });
    }

    walk(filePath, "");
    for (var i=0; i < manifest.files.length; i++) {
        logger.info("Generated resource list " + manifest.files[i]);
    }
    var manifestFilePath = path.join(filePath, "ilibmanifest.json");
    fs.writeFileSync(manifestFilePath, JSON.stringify(manifest), 'utf8');
}

module.exports = AppinfoJsonFile;