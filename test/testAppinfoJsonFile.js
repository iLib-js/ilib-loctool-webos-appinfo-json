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
    plugins: ["../."],
    sourceLocale: "en-US"
    }, "./test/testfiles", {
    locales:["en-GB"]
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
        test.equal(j.makeKey("This is a test"), "This is a test");
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
        j.parse('rb.getString("This is a test")');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "This is a test"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "This is a test");
        test.equal(r[0].getKey(), "This is a test");

        test.done();
    },
    testAppinfoJsonFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "x"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.ok(!r[0].getAutoKey());
        test.equal(r[0].getKey(), "x");

        r = set.getBy({
            reskey: "y"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test");
        test.ok(!r[0].getAutoKey());
        test.equal(r[0].getKey(), "y");

        test.done();
    },
    testAppinfoJsonFileExtractFile: function(test) {
        test.expect(8);

        var j = new AppinfoJsonFile({
            project: p,
            pathName: "./js/testAppinfo.json",
            type: jsft
        });
        test.ok(j);

        // should read the file
        j.extract();
        var set = j.getTranslationSet();
        test.equal(set.size(), 4);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");

        var r = set.getBy({
            reskey: "id1"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "This is a test with a unique id");
        test.equal(r[0].getKey(), "id1");

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
        test.equal(set.size(), 10);
        test.done();
    }
};
