/*
 * testAppinfoJsonFileType.js - test the appinfo.json template file type handler object.
 *
 * Copyright (c) 2019-2020, JEDLSoft
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

if (!AppinfoJsonFileType) {
    var AppinfoJsonFileType = require("../AppinfoJsonFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "test",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

module.exports.appinfojsonfiletype = {
    testAppinfoJsonFileTypeConstructor: function(test) {
        test.expect(1);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.done();
    },
    testAppinfoJsonFileTypeHandlesJsonTrue: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("appinfo.json"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesJsonPath: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("foo/bar/appinfo.json"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesJsonFalse: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("foo.js"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesJsonFalse1: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("lappinfo.json"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesFalseWithlocaleDir: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("ko/appinfo.json"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesFalseWithlocaleDir2: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("resources/zh/Hant/appinfo.json"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesFalseWithlocaleDir3: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(!ajft.handles("resources/en/GB/appinfo.json"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesWithlocaleDir4: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("sources/GB/appinfo.json"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesWithlocaleDir5: function(test) {
        test.expect(2);
        var ajft = new AppinfoJsonFileType(p);
        test.ok(ajft);
        test.ok(ajft.handles("res/Hant/appinfo.json"));
        test.done();
    }
};
