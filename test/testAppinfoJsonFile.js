/*
 * testAppinfoJsonFile.js - test the appinfo.json file type handler object.
 *
 * Copyright (c) 2019-2020, 2022 JEDLSoft
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
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
    var ResourceString =  require("loctool/lib/ResourceString.js");
}

var p = new CustomProject({
    id: "app",
    type: "webos-web",
    sourceLocale: "en-US",
    schema: "./test/testfiles/appinfo.schema.json",
    resourceDirs: {
        "json": "localized_json"
    },
    }, "./test/testfiles", {
    locales:["en-GB", "ko-KR"],
    "json": {
        "mappings": {
            "**/appinfo.json": {
                "template": "[dir]/[resDir]/[locale]/[filename]"
            }
        }
    }
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
    "main": "index.html",
    "title": ["Settings"],
    "sysAssetsBasePath": "assets",
}

var ajft = new AppinfoJsonFileType(p);

module.exports.appinfojsonfile = {
    testAppinfoJsonFileConstructor: function(test) {
        test.expect(1);

        var ajf = new AppinfoJsonFile({project: p, type:ajft});
        test.ok(ajf);
        test.done();
    },
    testAppinfoJsonFileConstructorParams: function(test) {
        test.expect(1);

        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });

        test.ok(ajf);
        test.done();
    },
    testAppinfoJsonFileConstructorNoFile: function(test) {
        test.expect(1);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);
        test.done();
    },
    testAppinfoJsonFileMakeKey: function(test) {
        test.expect(2);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);
        test.equal(ajf.makeKey("title"), "title");
        test.done();
    },
    testAppinfoJsonFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse(sampleAppinfo);

        var set = ajf.getTranslationSet();
        test.ok(set);

        var r = set.getBy({
            reskey: "Settings"
        });
        test.ok(r);

        test.equal(r[0].getSource(), "Settings");
        test.equal(r[0].getKey(), "Settings");

        test.done();
    },
    testAppinfoJsonFileParseSimpleGetByKey2: function(test) {
        test.expect(3);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse(sampleAppinfo2);

        var set = ajf.getTranslationSet();
        test.ok(set);

        ajf.extract();

        var set = ajf.getTranslationSet();
        test.equal(set.size(), 1);
        test.done();

    },
    testAppinfoJsonFileParseMultipleWithKey: function(test) {
        test.expect(6);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);

        ajf.parse('{"title":"Settings"}');

        var set = ajf.getTranslationSet();
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

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: "./appinfo.json",
            type: ajft
        });
        test.ok(ajf);

        // should read the file
        ajf.extract();
        var set = ajf.getTranslationSet();
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
        testAppinfoJsonFiledefaultPath: function(test) {
        test.expect(2);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: ".",
            type: ajft
        });
        test.ok(ajf);

        // should attempt to read the file and not fail
        ajf.extract();

        var set = ajf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },
    testAppinfoJsonFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: undefined,
            type: ajft
        });
        test.ok(ajf);

        // should attempt to read the file and not fail
        ajf.extract();

        var set = ajf.getTranslationSet();
        test.equal(set.size(), 0);
        test.done();
    },
    testAppinfoJsonFileTest2: function(test) {
        test.expect(2);

        var ajf = new AppinfoJsonFile({
            project: p,
            pathName: "./js/t2.js",
            type: ajft
        });
        test.ok(ajf);

        // should attempt to read the file and not fail
        ajf.extract();

        var set = ajf.getTranslationSet();
        test.equal(set.size(), 0);
        test.done();
    },
    testAppinfoJsonParse: function (test) {
        test.expect(5);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Settings",
            "version": "4.0.1",
            "type": "webos-web",
            "usePrerendering": true,
            "v8SnapshotFile": "snapshot_b"
        });
        var set = ajf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Settings");
        test.ok(r);
        test.equal(r.getSource(), "Settings");
        test.equal(r.getKey(), "Settings");

        test.done();
    },
    testAppinfoJsonParseMultiple: function (test) {
        test.expect(6);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Settings",
            "title@oled": "Settings@oled",
            "subject": "web app",
            "displayName": "Settings",
            "version": "4.0.1",
            "appmenu": "webos app",
            "usePrerendering": true,
            "v8SnapshotFile": "snapshot_b"
        });
        var set = ajf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 4);

        var r = set.getBySource("Settings@oled");
        test.ok(r);
        test.equal(r.getSource(), "Settings@oled");
        test.equal(r.getKey(), "Settings@oled");
        test.done();

    },
    testAppinfoJsonLocalzeText: function(test) {
        test.expect(2);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Photo &amp; Video",
            "version": "4.0.1",
            "type": "webos-web",
            "usePrerendering": true,
            "v8SnapshotFile": "snapshot_b"
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Photo &amp; Video",
            sourceLocale: "en-US",
            key: "Photo &amp; Video",
            target: "사진 &amp; 동영상",
            targetLocale: "ko-KR",
            datatype: "javascript"
        })
        translations.add(resource);

        var actual = ajf.localizeText(translations, "ko-KR");
        var expected = '{\n    "title": "사진 &amp; 동영상"\n}';
        test.equal(actual, expected);
        test.done();
    },
    testAppinfoJsonLocalzeTextxJsonKey: function(test) {
        test.expect(2);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Photo &amp; Video",
            "version": "4.0.1",
            "type": "webos-web",
            "usePrerendering": true,
            "v8SnapshotFile": "snapshot_b"
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Photo &amp; Video",
            sourceLocale: "en-US",
            key: "Photo &amp; Video",
            target: "사진 &amp; 동영상",
            targetLocale: "ko-KR",
            datatype: "x-json"
        })
        translations.add(resource);

        var actual = ajf.localizeText(translations, "ko-KR");
        var expected = '{\n    "title": "사진 &amp; 동영상"\n}';
        test.equal(actual, expected);
        test.done();
    },
    testAppinfoJsonLocalzeTextxJsonKey2: function(test) {
        test.expect(2);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Photo &amp; Video",
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Photo &amp; Video",
            sourceLocale: "en-US",
            key: "Photo &amp; Video",
            target: "사진 &amp; 동영상",
            targetLocale: "ko-KR",
            datatype: "x-json"
        })
        translations.add(resource);

        var resource2 = new ResourceString({
            project: "app",
            source: "Photo &amp; Video",
            sourceLocale: "en-US",
            key: "Photo &amp; Video",
            target: "사진 &amp; 동영상2",
            targetLocale: "ko-KR",
            datatype: "javascript"
        })
        translations.add(resource2);

        var actual = ajf.localizeText(translations, "ko-KR");
        var expected = '{\n    "title": "사진 &amp; 동영상"\n}';
        test.equal(actual, expected);
        test.done();
    },
    testAppinfoJsonLocalzeTextxJsonKey3: function(test) {
        test.expect(2);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Photo &amp; Video",
        });
        var translations = new TranslationSet();
        var resource2 = new ResourceString({
            project: "app",
            source: "Photo &amp; Video",
            sourceLocale: "en-US",
            key: "Photo &amp; Video",
            target: "사진 &amp; 동영상2",
            targetLocale: "ko-KR",
            datatype: "javascript"
        })
        translations.add(resource2);

        var actual = ajf.localizeText(translations, "ko-KR");
        var expected = '{\n    "title": "사진 &amp; 동영상2"\n}';
        test.equal(actual, expected);
        test.done();
    },
    testAppinfoJsonLocalzeTextMultiple: function(test) {
        test.expect(2);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Photo &amp; Video",
            "title@oled": "Photo &amp; Video@oled",
            "version": "4.0.1",
            "type": "webos-web",
            "displayName": "PhoeoVideo",
            "usePrerendering": true,
            "v8SnapshotFile": "snapshot_b"
        });
        var translations = new TranslationSet();

        translations.add(new ResourceString({
            project: "app",
            source: "Photo &amp; Video",
            sourceLocale: "en-US",
            key: "Photo &amp; Video",
            target: "사진 &amp; 동영상",
            targetLocale: "ko-KR",
            datatype: "javascript"
        }));

        translations.add(new ResourceString({
            project: "app",
            source: "Photo &amp; Video@oled",
            sourceLocale: "en-US",
            key: "Photo &amp; Video@oled",
            target: "사진 &amp; 동영상",
            targetLocale: "ko-KR",
            datatype: "x-json"
        }));

        var actual = ajf.localizeText(translations, "ko-KR");
        var expected =
        '{\n    "title": "사진 &amp; 동영상",\n'+
        '    "title@oled": "사진 &amp; 동영상"\n'+
        '}'
        test.equal(actual, expected);
        test.done();
    },
    testJSONResourceFileGetResourceFilePaths: function(test) {
        test.expect(193);
        var locales = ["af-ZA","am-ET","ar-AE","ar-BH","ar-DJ","ar-DZ","ar-EG","ar-IQ",
        "ar-JO","ar-KW","ar-LB","ar-LY","ar-MA","ar-MR","ar-OM","ar-QA","ar-SA","ar-SD",
        "ar-SY","ar-TN","ar-YE","as-IN","az-Latn-AZ","bg-BG","bn-IN","bs-Latn-BA","bs-Latn-ME",
        "cs-CZ","da-DK","de-AT","de-CH","de-DE","de-LU","el-CY","el-GR","en-AM","en-AU","en-AZ",
        "en-CA","en-CN","en-ET","en-GB","en-GE","en-GH","en-GM","en-HK","en-IE","en-IN","en-IS",
        "en-JP","en-KE","en-LK","en-LR","en-MM","en-MW","en-MX","en-MY","en-NG","en-NZ","en-PH",
        "en-PK","en-PR","en-RW","en-SD","en-SG","en-SL","en-TW","en-TZ","en-UG","en-US","en-ZA",
        "en-ZM","es-AR","es-BO","es-CA","es-CL","es-CO","es-CR","es-DO","es-EC","es-ES","es-GQ",
        "es-GT","es-HN","es-MX","es-NI","es-PA","es-PE","es-PH","es-PR","es-PY","es-SV","es-US",
        "es-UY","es-VE","et-EE","fa-AF","fa-IR","fi-FI","fr-BE","fr-BF","fr-BJ","fr-CA","fr-CD",
        "fr-CF","fr-CG","fr-CH","fr-CI","fr-CM","fr-GQ","fr-DJ","fr-DZ","fr-FR","fr-GA","fr-GN",
        "fr-LB","fr-LU","fr-ML","fr-RW","fr-SN","fr-TG","ga-IE","gu-IN","ha-Latn-NG","he-IL",
        "hi-IN","hr-HR","hr-ME","hu-HU","id-ID","is-IS","it-CH","it-IT","ja-JP","kk-Cyrl-KZ","km-KH",
        "kn-IN","ko-KR","ku-Arab-IQ","lt-LT","lv-LV","mk-MK","ml-IN","mn-Cyrl-MN","mr-IN","ms-MY",
        "ms-SG","nb-NO","nl-BE","nl-NL","or-IN","pa-IN","pa-PK","pl-PL","pt-AO","pt-BR","pt-GQ",
        "pt-CV","pt-PT","ro-RO","ru-BY","ru-GE","ru-KG","ru-KZ","ru-RU","ru-UA","si-LK","sk-SK",
        "sl-SI","sq-AL","sq-ME","sr-Latn-ME","sr-Latn-RS","sv-FI","sv-SE","sw-Latn-KE","ta-IN",
        "te-IN","th-TH","tr-AM","tr-AZ","tr-CY","tr-TR","uk-UA","ur-IN","ur-PK","uz-Latn-UZ","vi-VN",
        "zh-Hans-CN","zh-Hans-MY","zh-Hans-SG","zh-Hant-HK","zh-Hant-TW"];

        var expected = [
            "test/testfiles/localized_json/af/appinfo.json",
            "test/testfiles/localized_json/am/appinfo.json",
            "test/testfiles/localized_json/ar/AE/appinfo.json",
            "test/testfiles/localized_json/ar/BH/appinfo.json",
            "test/testfiles/localized_json/ar/DJ/appinfo.json",
            "test/testfiles/localized_json/ar/DZ/appinfo.json",
            "test/testfiles/localized_json/ar/appinfo.json",
            "test/testfiles/localized_json/ar/IQ/appinfo.json",
            "test/testfiles/localized_json/ar/JO/appinfo.json",
            "test/testfiles/localized_json/ar/KW/appinfo.json",
            "test/testfiles/localized_json/ar/LB/appinfo.json",
            "test/testfiles/localized_json/ar/LY/appinfo.json",
            "test/testfiles/localized_json/ar/MA/appinfo.json",
            "test/testfiles/localized_json/ar/MR/appinfo.json",
            "test/testfiles/localized_json/ar/OM/appinfo.json",
            "test/testfiles/localized_json/ar/QA/appinfo.json",
            "test/testfiles/localized_json/ar/SA/appinfo.json",
            "test/testfiles/localized_json/ar/SD/appinfo.json",
            "test/testfiles/localized_json/ar/SY/appinfo.json",
            "test/testfiles/localized_json/ar/TN/appinfo.json",
            "test/testfiles/localized_json/ar/YE/appinfo.json",
            "test/testfiles/localized_json/as/appinfo.json",
            "test/testfiles/localized_json/az/appinfo.json",
            "test/testfiles/localized_json/bg/appinfo.json",
            "test/testfiles/localized_json/bn/IN/appinfo.json",
            "test/testfiles/localized_json/bs/appinfo.json",
            "test/testfiles/localized_json/bs/Latn/ME/appinfo.json",
            "test/testfiles/localized_json/cs/appinfo.json",
            "test/testfiles/localized_json/da/appinfo.json",
            "test/testfiles/localized_json/de/AT/appinfo.json",
            "test/testfiles/localized_json/de/CH/appinfo.json",
            "test/testfiles/localized_json/de/appinfo.json",
            "test/testfiles/localized_json/de/LU/appinfo.json",
            "test/testfiles/localized_json/el/CY/appinfo.json",
            "test/testfiles/localized_json/el/appinfo.json",
            "test/testfiles/localized_json/en/AM/appinfo.json",
            "test/testfiles/localized_json/en/AU/appinfo.json",
            "test/testfiles/localized_json/en/AZ/appinfo.json",
            "test/testfiles/localized_json/en/CA/appinfo.json",
            "test/testfiles/localized_json/en/CN/appinfo.json",
            "test/testfiles/localized_json/en/ET/appinfo.json",
            "test/testfiles/localized_json/en/GB/appinfo.json",
            "test/testfiles/localized_json/en/GE/appinfo.json",
            "test/testfiles/localized_json/en/GH/appinfo.json",
            "test/testfiles/localized_json/en/GM/appinfo.json",
            "test/testfiles/localized_json/en/HK/appinfo.json",
            "test/testfiles/localized_json/en/IE/appinfo.json",
            "test/testfiles/localized_json/en/IN/appinfo.json",
            "test/testfiles/localized_json/en/IS/appinfo.json",
            "test/testfiles/localized_json/en/JP/appinfo.json",
            "test/testfiles/localized_json/en/KE/appinfo.json",
            "test/testfiles/localized_json/en/LK/appinfo.json",
            "test/testfiles/localized_json/en/LR/appinfo.json",
            "test/testfiles/localized_json/en/MM/appinfo.json",
            "test/testfiles/localized_json/en/MW/appinfo.json",
            "test/testfiles/localized_json/en/MX/appinfo.json",
            "test/testfiles/localized_json/en/MY/appinfo.json",
            "test/testfiles/localized_json/en/NG/appinfo.json",
            "test/testfiles/localized_json/en/NZ/appinfo.json",
            "test/testfiles/localized_json/en/PH/appinfo.json",
            "test/testfiles/localized_json/en/PK/appinfo.json",
            "test/testfiles/localized_json/en/PR/appinfo.json",
            "test/testfiles/localized_json/en/RW/appinfo.json",
            "test/testfiles/localized_json/en/SD/appinfo.json",
            "test/testfiles/localized_json/en/SG/appinfo.json",
            "test/testfiles/localized_json/en/SL/appinfo.json",
            "test/testfiles/localized_json/en/TW/appinfo.json",
            "test/testfiles/localized_json/en/TZ/appinfo.json",
            "test/testfiles/localized_json/en/UG/appinfo.json",
            "test/testfiles/localized_json/appinfo.json",
            "test/testfiles/localized_json/en/ZA/appinfo.json",
            "test/testfiles/localized_json/en/ZM/appinfo.json",
            "test/testfiles/localized_json/es/AR/appinfo.json",
            "test/testfiles/localized_json/es/BO/appinfo.json",
            "test/testfiles/localized_json/es/CA/appinfo.json",
            "test/testfiles/localized_json/es/CL/appinfo.json",
            "test/testfiles/localized_json/es/CO/appinfo.json",
            "test/testfiles/localized_json/es/CR/appinfo.json",
            "test/testfiles/localized_json/es/DO/appinfo.json",
            "test/testfiles/localized_json/es/EC/appinfo.json",
            "test/testfiles/localized_json/es/appinfo.json",
            "test/testfiles/localized_json/es/GQ/appinfo.json",
            "test/testfiles/localized_json/es/GT/appinfo.json",
            "test/testfiles/localized_json/es/HN/appinfo.json",
            "test/testfiles/localized_json/es/MX/appinfo.json",
            "test/testfiles/localized_json/es/NI/appinfo.json",
            "test/testfiles/localized_json/es/PA/appinfo.json",
            "test/testfiles/localized_json/es/PE/appinfo.json",
            "test/testfiles/localized_json/es/PH/appinfo.json",
            "test/testfiles/localized_json/es/PR/appinfo.json",
            "test/testfiles/localized_json/es/PY/appinfo.json",
            "test/testfiles/localized_json/es/SV/appinfo.json",
            "test/testfiles/localized_json/es/US/appinfo.json",
            "test/testfiles/localized_json/es/UY/appinfo.json",
            "test/testfiles/localized_json/es/VE/appinfo.json",
            "test/testfiles/localized_json/et/appinfo.json",
            "test/testfiles/localized_json/fa/AF/appinfo.json",
            "test/testfiles/localized_json/fa/appinfo.json",
            "test/testfiles/localized_json/fi/appinfo.json",
            "test/testfiles/localized_json/fr/BE/appinfo.json",
            "test/testfiles/localized_json/fr/BF/appinfo.json",
            "test/testfiles/localized_json/fr/BJ/appinfo.json",
            "test/testfiles/localized_json/fr/CA/appinfo.json",
            "test/testfiles/localized_json/fr/CD/appinfo.json",
            "test/testfiles/localized_json/fr/CF/appinfo.json",
            "test/testfiles/localized_json/fr/CG/appinfo.json",
            "test/testfiles/localized_json/fr/CH/appinfo.json",
            "test/testfiles/localized_json/fr/CI/appinfo.json",
            "test/testfiles/localized_json/fr/CM/appinfo.json",
            "test/testfiles/localized_json/fr/GQ/appinfo.json",
            "test/testfiles/localized_json/fr/DJ/appinfo.json",
            "test/testfiles/localized_json/fr/DZ/appinfo.json",
            "test/testfiles/localized_json/fr/appinfo.json",
            "test/testfiles/localized_json/fr/GA/appinfo.json",
            "test/testfiles/localized_json/fr/GN/appinfo.json",
            "test/testfiles/localized_json/fr/LB/appinfo.json",
            "test/testfiles/localized_json/fr/LU/appinfo.json",
            "test/testfiles/localized_json/fr/ML/appinfo.json",
            "test/testfiles/localized_json/fr/RW/appinfo.json",
            "test/testfiles/localized_json/fr/SN/appinfo.json",
            "test/testfiles/localized_json/fr/TG/appinfo.json",
            "test/testfiles/localized_json/ga/appinfo.json",
            "test/testfiles/localized_json/gu/appinfo.json",
            "test/testfiles/localized_json/ha/appinfo.json",
            "test/testfiles/localized_json/he/appinfo.json",
            "test/testfiles/localized_json/hi/appinfo.json",
            "test/testfiles/localized_json/hr/appinfo.json",
            "test/testfiles/localized_json/hr/ME/appinfo.json",
            "test/testfiles/localized_json/hu/appinfo.json",
            "test/testfiles/localized_json/id/appinfo.json",
            "test/testfiles/localized_json/is/appinfo.json",
            "test/testfiles/localized_json/it/CH/appinfo.json",
            "test/testfiles/localized_json/it/appinfo.json",
            "test/testfiles/localized_json/ja/appinfo.json",
            "test/testfiles/localized_json/kk/appinfo.json",
            "test/testfiles/localized_json/km/appinfo.json",
            "test/testfiles/localized_json/kn/appinfo.json",
            "test/testfiles/localized_json/ko/appinfo.json",
            "test/testfiles/localized_json/ku/Arab/IQ/appinfo.json",
            "test/testfiles/localized_json/lt/appinfo.json",
            "test/testfiles/localized_json/lv/appinfo.json",
            "test/testfiles/localized_json/mk/appinfo.json",
            "test/testfiles/localized_json/ml/appinfo.json",
            "test/testfiles/localized_json/mn/appinfo.json",
            "test/testfiles/localized_json/mr/appinfo.json",
            "test/testfiles/localized_json/ms/appinfo.json",
            "test/testfiles/localized_json/ms/SG/appinfo.json",
            "test/testfiles/localized_json/nb/appinfo.json",
            "test/testfiles/localized_json/nl/BE/appinfo.json",
            "test/testfiles/localized_json/nl/appinfo.json",
            "test/testfiles/localized_json/or/appinfo.json",
            "test/testfiles/localized_json/pa/appinfo.json",
            "test/testfiles/localized_json/pa/PK/appinfo.json",
            "test/testfiles/localized_json/pl/appinfo.json",
            "test/testfiles/localized_json/pt/AO/appinfo.json",
            "test/testfiles/localized_json/pt/appinfo.json",
            "test/testfiles/localized_json/pt/GQ/appinfo.json",
            "test/testfiles/localized_json/pt/CV/appinfo.json",
            "test/testfiles/localized_json/pt/PT/appinfo.json",
            "test/testfiles/localized_json/ro/appinfo.json",
            "test/testfiles/localized_json/ru/BY/appinfo.json",
            "test/testfiles/localized_json/ru/GE/appinfo.json",
            "test/testfiles/localized_json/ru/KG/appinfo.json",
            "test/testfiles/localized_json/ru/KZ/appinfo.json",
            "test/testfiles/localized_json/ru/appinfo.json",
            "test/testfiles/localized_json/ru/UA/appinfo.json",
            "test/testfiles/localized_json/si/appinfo.json",
            "test/testfiles/localized_json/sk/appinfo.json",
            "test/testfiles/localized_json/sl/appinfo.json",
            "test/testfiles/localized_json/sq/appinfo.json",
            "test/testfiles/localized_json/sq/ME/appinfo.json",
            "test/testfiles/localized_json/sr/Latn/ME/appinfo.json",
            "test/testfiles/localized_json/sr/Latn/RS/appinfo.json",
            "test/testfiles/localized_json/sv/FI/appinfo.json",
            "test/testfiles/localized_json/sv/appinfo.json",
            "test/testfiles/localized_json/sw/Latn/KE/appinfo.json",
            "test/testfiles/localized_json/ta/appinfo.json",
            "test/testfiles/localized_json/te/appinfo.json",
            "test/testfiles/localized_json/th/appinfo.json",
            "test/testfiles/localized_json/tr/AM/appinfo.json",
            "test/testfiles/localized_json/tr/AZ/appinfo.json",
            "test/testfiles/localized_json/tr/CY/appinfo.json",
            "test/testfiles/localized_json/tr/appinfo.json",
            "test/testfiles/localized_json/uk/appinfo.json",
            "test/testfiles/localized_json/ur/IN/appinfo.json",
            "test/testfiles/localized_json/ur/appinfo.json",
            "test/testfiles/localized_json/uz/appinfo.json",
            "test/testfiles/localized_json/vi/appinfo.json",
            "test/testfiles/localized_json/zh/appinfo.json",
            "test/testfiles/localized_json/zh/Hans/MY/appinfo.json",
            "test/testfiles/localized_json/zh/Hans/SG/appinfo.json",
            "test/testfiles/localized_json/zh/Hant/HK/appinfo.json",
            "test/testfiles/localized_json/zh/Hant/TW/appinfo.json"
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new AppinfoJsonFile({
                project: p,
                pathName: "./test/testfiles/appinfo.json",
                type: ajft,
                locale: locales[i]
            });
            test.equal(jsrf.getLocalizedPath(locales[i]), expected[i]);
        }
        test.done();
    },
    testJSONResourceFileGetResourceFilePathsSimple: function(test) {
        test.expect(10);
        var locales = ["af-ZA","am-ET","ar-AE","ar-BH","ar-DJ","ar-DZ","ar-EG","ar-IQ",
        "ar-JO","ar-KW"];

        var expected = [
            "localized_json/af/appinfo.json",
            "localized_json/am/appinfo.json",
            "localized_json/ar/AE/appinfo.json",
            "localized_json/ar/BH/appinfo.json",
            "localized_json/ar/DJ/appinfo.json",
            "localized_json/ar/DZ/appinfo.json",
            "localized_json/ar/appinfo.json",
            "localized_json/ar/IQ/appinfo.json",
            "localized_json/ar/JO/appinfo.json",
            "localized_json/ar/KW/appinfo.json",
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new AppinfoJsonFile({
                project: p,
                pathName: "appinfo.json",
                type: ajft,
                locale: locales[i]
            });
            test.equal(jsrf.getLocalizedPath(locales[i]), expected[i]);
        }
        test.done();
    },
    testJSONResourceFileGetResourceFullFilePathsSimple: function(test) {
        test.expect(10);
        var locales = ["af-ZA","am-ET","ar-AE","ar-BH","ar-DJ","ar-DZ","ar-EG","ar-IQ",
        "ar-JO","ar-KW"];

        var expected = [
            "test/testfiles/localized_json/af/appinfo.json",
            "test/testfiles/localized_json/am/appinfo.json",
            "test/testfiles/localized_json/ar/AE/appinfo.json",
            "test/testfiles/localized_json/ar/BH/appinfo.json",
            "test/testfiles/localized_json/ar/DJ/appinfo.json",
            "test/testfiles/localized_json/ar/DZ/appinfo.json",
            "test/testfiles/localized_json/ar/appinfo.json",
            "test/testfiles/localized_json/ar/IQ/appinfo.json",
            "test/testfiles/localized_json/ar/JO/appinfo.json",
            "test/testfiles/localized_json/ar/KW/appinfo.json",
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new AppinfoJsonFile({
                project: p,
                pathName: "appinfo.json",
                type: ajft,
                locale: locales[i]
            });
            test.equal(jsrf.getfullLocalizedPath(locales[i]), expected[i]);
        }
        test.done();
    },
    testJSONResourceFileGetResourceFilePathsWithTranslations: function(test) {
        test.expect(5);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Live TV",
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-US",
            key: "Live TV",
            target: "(fr-FR) Live TV",
            targetLocale: "fr-FR",
            datatype: "x-json"
        })
        translations.add(resource);

        var resource2 = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-US",
            key: "Live TV",
            target: "(fr-CA) Live TV",
            targetLocale: "fr-CA",
            datatype: "x-json"
        })
        translations.add(resource2);

        var actual = ajf.localizeText(translations, "fr-FR");
        var expected = '{\n    "title": "(fr-FR) Live TV"\n}';
        test.equal(actual, expected);
        var actual2 = ajf.localizeText(translations, "fr-CA");
        var expected2 = '{\n    "title": "(fr-CA) Live TV"\n}';
        test.equal(actual2, expected2);

        test.equal(ajf.getLocalizedPath("fr-FR"), "localized_json/fr/");
        test.equal(ajf.getLocalizedPath("fr-CA"), "localized_json/fr/CA/");
        test.done();
    },
    testAppinfoJsonLocalzeTextWithBaseTranslations: function(test) {
        test.expect(4);
        var ajf = new AppinfoJsonFile({
            project: p,
            type: ajft
        });
        test.ok(ajf);
        ajf.parse({
            "id": "app",
            "title": "Live TV",
        });
        var translations = new TranslationSet();
        var resource = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-US",
            key: "Live TV",
            target: "(fr) Live TV",
            targetLocale: "fr-FR",
            datatype: "x-json"
        })
        translations.add(resource);

        var resource2 = new ResourceString({
            project: "app",
            source: "Live TV",
            sourceLocale: "en-US",
            key: "Live TV",
            target: "(fr) Live TV",
            targetLocale: "fr-CA",
            datatype: "x-json"
        })
        translations.add(resource2);

        var actual = ajf.localizeText(translations, "fr-FR");
        var expected = '{\n    "title": "(fr) Live TV"\n}';
        test.equal(actual, expected);
        var actual2 = ajf.localizeText(translations, "fr-CA");
        var expected2 = '{}';
        test.equal(actual2, expected2);

        test.equal(ajf.getLocalizedPath("fr-FR"), "localized_json/fr/");
        test.done();
    }
};
