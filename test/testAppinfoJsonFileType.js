/*
 * testAppinfoJsonFileType.js - test the HTML template file type handler object.
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

if (!JavaScriptFile) {
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
        var htf = new AppinfoJsonFileType(p);
        test.ok(htf);
        test.done();
    },

    testAppinfoJsonFileTypeHandlesJSTrue: function(test) {
        test.expect(2);
        var htf = new AppinfoJsonFileType(p);
        test.ok(htf);
        test.ok(htf.handles("appinfo"));
        test.done();
    },
    testAppinfoJsonFileTypeHandlesJSFalseClose: function(test) {
        test.expect(2);
        var htf = new AppinfoJsonFileType(p);
        test.ok(htf);
        test.ok(!htf.handles("foojs"));
        test.done();
    }
};