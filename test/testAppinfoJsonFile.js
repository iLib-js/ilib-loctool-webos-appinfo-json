/*
 * testAppinfoJsonFileType.js - test the appinfo.json template file type handler object.
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

if (!AppinfoJsonFile) {
    var AppinfoJsonFile = require("../AppinfoJsonFile.js");
    var AppinfoJsonFileType = require("../AppinfoJsonFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "app",
    sourceLocale: "en-US",
    schema: "./test/testfiles/appinfo.schema.json"
    }, "./test/testfiles", {
    locales:["en-GB", "ko-KR"]
});

var sampleAppinfo = {
    "id": "com.palm.app.settings",
    "version": "4.0.1",
    "vendor": "Palm",
    "type": "web",
    "main": "index.html",
    "title": "Settings",
    "sysAssetsBasePath": "assets",
}
var sampleAppinfo2 = {
    "id": "com.palm.app.settings",
    "version": "4.0.1",
    "vendor": "Palm",
    "type": "web",
    "main": ["index.html"],
    "title": "Settings",
    "sysAssetsBasePath": "assets",
}

var jsft = new AppinfoJsonFileType(p);

module.exports.appinfojsonfile = {
    testAppinfoJsonFileConstructor: function(test) {
        test.expect(1);

        var j = new AppinfoJsonFile({project: p});
        test.ok(j);
        test.done();
    },
    testAppinfoJsonFileConstructorParams: function(test) {
        test.expect(1);

        var j = new AppinfoJsonFile({
            project: p,
            type: jsft
        });

        test.ok(j);
        test.done();
    },
    testAppinfoJsonFileConstructorNoFile: function(test) {
        test.expect(1);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        test.ok(j);
        test.done();
    },
    testAppinfoJsonFileMakeKey: function(test) {
        test.expect(2);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        test.ok(j);
        test.equal(j.makeKey("title"), "title");
        test.done();
    },
    testAppinfoJsonFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        test.ok(j);
        j.parse(sampleAppinfo);

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Settings"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "Settings");
        test.equal(r[0].getKey(), "Settings");

        test.done();
    },
    testAppinfoJsonFileParseMultipleWithKey: function(test) {
        test.expect(6);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        test.ok(j);

        j.parse('{"title":"Settings"}');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Settings"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Settings");
        test.ok(r[0].getAutoKey());
        test.equal(r[0].getKey(), "Settings");

        test.done();
    },
    testAppinfoJsonFileExtractFile: function(test) {
        test.expect(8);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: "./appinfo.json",
            type: jsft
        });
        test.ok(j);

        // should read the file
        j.extract();
        var set = j.getTranslationSet();
        test.equal(set.size(), 2);

        var r = set.getBySource("Settings");
        test.ok(r);
        test.equal(r.getSource(), "Settings");
        test.equal(r.getKey(), "Settings");

        var r = set.getBy({
            reskey: "Settings"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Settings");
        test.equal(r[0].getKey(), "Settings");

        test.done();
    },
    testAppinfoJsonFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        test.ok(j);

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        test.done();
    },
    testAppinfoJsonFileTest2: function(test) {
        test.expect(2);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: "./js/t2.js",
            type: jsft
        });
        test.ok(j);

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);
        test.done();
    }
};