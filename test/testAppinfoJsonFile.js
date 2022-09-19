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
    "main": "index.html",
    "title": ["Settings"],
    "sysAssetsBasePath": "assets",
}

var ajft = new AppinfoJsonFileType(p);

module.exports.appinfojsonfile = {
    testAppinfoJsonFileConstructor: function(test) {
        test.expect(1);

        var ajf = new AppinfoJsonFile({project: p});
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
            "test/testfiles/localized_json/af",
            "test/testfiles/localized_json/am",
            "test/testfiles/localized_json/ar/AE",
            "test/testfiles/localized_json/ar/BH",
            "test/testfiles/localized_json/ar/DJ",
            "test/testfiles/localized_json/ar/DZ",
            "test/testfiles/localized_json/ar",
            "test/testfiles/localized_json/ar/IQ",
            "test/testfiles/localized_json/ar/JO",
            "test/testfiles/localized_json/ar/KW",
            "test/testfiles/localized_json/ar/LB",
            "test/testfiles/localized_json/ar/LY",
            "test/testfiles/localized_json/ar/MA",
            "test/testfiles/localized_json/ar/MR",
            "test/testfiles/localized_json/ar/OM",
            "test/testfiles/localized_json/ar/QA",
            "test/testfiles/localized_json/ar/SA",
            "test/testfiles/localized_json/ar/SD",
            "test/testfiles/localized_json/ar/SY",
            "test/testfiles/localized_json/ar/TN",
            "test/testfiles/localized_json/ar/YE",
            "test/testfiles/localized_json/as",
            "test/testfiles/localized_json/az",
            "test/testfiles/localized_json/bg",
            "test/testfiles/localized_json/bn/IN",
            "test/testfiles/localized_json/bs",
            "test/testfiles/localized_json/bs/Latn/ME",
            "test/testfiles/localized_json/cs",
            "test/testfiles/localized_json/da",
            "test/testfiles/localized_json/de/AT",
            "test/testfiles/localized_json/de/CH",
            "test/testfiles/localized_json/de",
            "test/testfiles/localized_json/de/LU",
            "test/testfiles/localized_json/el/CY",
            "test/testfiles/localized_json/el",
            "test/testfiles/localized_json/en/AM",
            "test/testfiles/localized_json/en/AU",
            "test/testfiles/localized_json/en/AZ",
            "test/testfiles/localized_json/en/CA",
            "test/testfiles/localized_json/en/CN",
            "test/testfiles/localized_json/en/ET",
            "test/testfiles/localized_json/en/GB",
            "test/testfiles/localized_json/en/GE",
            "test/testfiles/localized_json/en/GH",
            "test/testfiles/localized_json/en/GM",
            "test/testfiles/localized_json/en/HK",
            "test/testfiles/localized_json/en/IE",
            "test/testfiles/localized_json/en/IN",
            "test/testfiles/localized_json/en/IS",
            "test/testfiles/localized_json/en/JP",
            "test/testfiles/localized_json/en/KE",
            "test/testfiles/localized_json/en/LK",
            "test/testfiles/localized_json/en/LR",
            "test/testfiles/localized_json/en/MM",
            "test/testfiles/localized_json/en/MW",
            "test/testfiles/localized_json/en/MX",
            "test/testfiles/localized_json/en/MY",
            "test/testfiles/localized_json/en/NG",
            "test/testfiles/localized_json/en/NZ",
            "test/testfiles/localized_json/en/PH",
            "test/testfiles/localized_json/en/PK",
            "test/testfiles/localized_json/en/PR",
            "test/testfiles/localized_json/en/RW",
            "test/testfiles/localized_json/en/SD",
            "test/testfiles/localized_json/en/SG",
            "test/testfiles/localized_json/en/SL",
            "test/testfiles/localized_json/en/TW",
            "test/testfiles/localized_json/en/TZ",
            "test/testfiles/localized_json/en/UG",
            "test/testfiles/localized_json",
            "test/testfiles/localized_json/en/ZA",
            "test/testfiles/localized_json/en/ZM",
            "test/testfiles/localized_json/es/AR",
            "test/testfiles/localized_json/es/BO",
            "test/testfiles/localized_json/es/CA",
            "test/testfiles/localized_json/es/CL",
            "test/testfiles/localized_json/es/CO",
            "test/testfiles/localized_json/es/CR",
            "test/testfiles/localized_json/es/DO",
            "test/testfiles/localized_json/es/EC",
            "test/testfiles/localized_json/es",
            "test/testfiles/localized_json/es/GQ",
            "test/testfiles/localized_json/es/GT",
            "test/testfiles/localized_json/es/HN",
            "test/testfiles/localized_json/es/MX",
            "test/testfiles/localized_json/es/NI",
            "test/testfiles/localized_json/es/PA",
            "test/testfiles/localized_json/es/PE",
            "test/testfiles/localized_json/es/PH",
            "test/testfiles/localized_json/es/PR",
            "test/testfiles/localized_json/es/PY",
            "test/testfiles/localized_json/es/SV",
            "test/testfiles/localized_json/es/US",
            "test/testfiles/localized_json/es/UY",
            "test/testfiles/localized_json/es/VE",
            "test/testfiles/localized_json/et",
            "test/testfiles/localized_json/fa/AF",
            "test/testfiles/localized_json/fa",
            "test/testfiles/localized_json/fi",
            "test/testfiles/localized_json/fr/BE",
            "test/testfiles/localized_json/fr/BF",
            "test/testfiles/localized_json/fr/BJ",
            "test/testfiles/localized_json/fr/CA",
            "test/testfiles/localized_json/fr/CD",
            "test/testfiles/localized_json/fr/CF",
            "test/testfiles/localized_json/fr/CG",
            "test/testfiles/localized_json/fr/CH",
            "test/testfiles/localized_json/fr/CI",
            "test/testfiles/localized_json/fr/CM",
            "test/testfiles/localized_json/fr/GQ",
            "test/testfiles/localized_json/fr/DJ",
            "test/testfiles/localized_json/fr/DZ",
            "test/testfiles/localized_json/fr",
            "test/testfiles/localized_json/fr/GA",
            "test/testfiles/localized_json/fr/GN",
            "test/testfiles/localized_json/fr/LB",
            "test/testfiles/localized_json/fr/LU",
            "test/testfiles/localized_json/fr/ML",
            "test/testfiles/localized_json/fr/RW",
            "test/testfiles/localized_json/fr/SN",
            "test/testfiles/localized_json/fr/TG",
            "test/testfiles/localized_json/ga",
            "test/testfiles/localized_json/gu",
            "test/testfiles/localized_json/ha",
            "test/testfiles/localized_json/he",
            "test/testfiles/localized_json/hi",
            "test/testfiles/localized_json/hr",
            "test/testfiles/localized_json/hr/ME",
            "test/testfiles/localized_json/hu",
            "test/testfiles/localized_json/id",
            "test/testfiles/localized_json/is",
            "test/testfiles/localized_json/it/CH",
            "test/testfiles/localized_json/it",
            "test/testfiles/localized_json/ja",
            "test/testfiles/localized_json/kk",
            "test/testfiles/localized_json/km",
            "test/testfiles/localized_json/kn",
            "test/testfiles/localized_json/ko",
            "test/testfiles/localized_json/ku/Arab/IQ",
            "test/testfiles/localized_json/lt",
            "test/testfiles/localized_json/lv",
            "test/testfiles/localized_json/mk",
            "test/testfiles/localized_json/ml",
            "test/testfiles/localized_json/mn",
            "test/testfiles/localized_json/mr",
            "test/testfiles/localized_json/ms",
            "test/testfiles/localized_json/ms/SG",
            "test/testfiles/localized_json/nb",
            "test/testfiles/localized_json/nl/BE",
            "test/testfiles/localized_json/nl",
            "test/testfiles/localized_json/or",
            "test/testfiles/localized_json/pa",
            "test/testfiles/localized_json/pa/PK",
            "test/testfiles/localized_json/pl",
            "test/testfiles/localized_json/pt/AO",
            "test/testfiles/localized_json/pt",
            "test/testfiles/localized_json/pt/GQ",
            "test/testfiles/localized_json/pt/CV",
            "test/testfiles/localized_json/pt/PT",
            "test/testfiles/localized_json/ro",
            "test/testfiles/localized_json/ru/BY",
            "test/testfiles/localized_json/ru/GE",
            "test/testfiles/localized_json/ru/KG",
            "test/testfiles/localized_json/ru/KZ",
            "test/testfiles/localized_json/ru",
            "test/testfiles/localized_json/ru/UA",
            "test/testfiles/localized_json/si",
            "test/testfiles/localized_json/sk",
            "test/testfiles/localized_json/sl",
            "test/testfiles/localized_json/sq",
            "test/testfiles/localized_json/sq/ME",
            "test/testfiles/localized_json/sr/Latn/ME",
            "test/testfiles/localized_json/sr/Latn/RS",
            "test/testfiles/localized_json/sv/FI",
            "test/testfiles/localized_json/sv",
            "test/testfiles/localized_json/sw/Latn/KE",
            "test/testfiles/localized_json/ta",
            "test/testfiles/localized_json/te",
            "test/testfiles/localized_json/th",
            "test/testfiles/localized_json/tr/AM",
            "test/testfiles/localized_json/tr/AZ",
            "test/testfiles/localized_json/tr/CY",
            "test/testfiles/localized_json/tr",
            "test/testfiles/localized_json/uk",
            "test/testfiles/localized_json/ur/IN",
            "test/testfiles/localized_json/ur",
            "test/testfiles/localized_json/uz",
            "test/testfiles/localized_json/vi",
            "test/testfiles/localized_json/zh",
            "test/testfiles/localized_json/zh/Hans/MY",
            "test/testfiles/localized_json/zh/Hans/SG",
            "test/testfiles/localized_json/zh/Hant/HK",
            "test/testfiles/localized_json/zh/Hant/TW"
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new AppinfoJsonFile({
                project: p,
                pathName: undefined,
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
            "test/testfiles/localized_json/af",
            "test/testfiles/localized_json/am",
            "test/testfiles/localized_json/ar/AE",
            "test/testfiles/localized_json/ar/BH",
            "test/testfiles/localized_json/ar/DJ",
            "test/testfiles/localized_json/ar/DZ",
            "test/testfiles/localized_json/ar",
            "test/testfiles/localized_json/ar/IQ",
            "test/testfiles/localized_json/ar/JO",
            "test/testfiles/localized_json/ar/KW",
        ];

        for (var i=0; i<locales.length;i++) {
            jsrf = new AppinfoJsonFile({
                project: p,
                pathName: undefined,
                type: ajft,
                locale: locales[i]
            });
            test.equal(jsrf.getLocalizedPath(locales[i]), expected[i]);
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

        test.equal(ajf.getLocalizedPath("fr-FR"), "test/testfiles/localized_json/fr");
        test.equal(ajf.getLocalizedPath("fr-CA"), "test/testfiles/localized_json/fr/CA");
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

        test.equal(ajf.getLocalizedPath("fr-FR"), "test/testfiles/localized_json/fr");
        test.done();
    }
};
