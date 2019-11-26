/*
 * testAppinfoJsonFile.js - test the appinfo.json file type handler object.
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
            datatype: "javascript"
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
            "localized_json/af",
            "localized_json/am",
            "localized_json/ar/AE",
            "localized_json/ar/BH",
            "localized_json/ar/DJ",
            "localized_json/ar/DZ",
            "localized_json/ar",
            "localized_json/ar/IQ",
            "localized_json/ar/JO",
            "localized_json/ar/KW",
            "localized_json/ar/LB",
            "localized_json/ar/LY",
            "localized_json/ar/MA",
            "localized_json/ar/MR",
            "localized_json/ar/OM",
            "localized_json/ar/QA",
            "localized_json/ar/SA",
            "localized_json/ar/SD",
            "localized_json/ar/SY",
            "localized_json/ar/TN",
            "localized_json/ar/YE",
            "localized_json/as",
            "localized_json/az",
            "localized_json/bg",
            "localized_json/bn",
            "localized_json/bs",
            "localized_json/bs/Latn/ME",
            "localized_json/cs",
            "localized_json/da",
            "localized_json/de/AT",
            "localized_json/de/CH",
            "localized_json/de",
            "localized_json/de/LU",
            "localized_json/el/CY",
            "localized_json/el",
            "localized_json/en/AM",
            "localized_json/en/AU",
            "localized_json/en/AZ",
            "localized_json/en/CA",
            "localized_json/en/CN",
            "localized_json/en/ET",
            "localized_json/en/GB",
            "localized_json/en/GE",
            "localized_json/en/GH",
            "localized_json/en/GM",
            "localized_json/en/HK",
            "localized_json/en/IE",
            "localized_json/en/IN",
            "localized_json/en/IS",
            "localized_json/en/JP",
            "localized_json/en/KE",
            "localized_json/en/LK",
            "localized_json/en/LR",
            "localized_json/en/MM",
            "localized_json/en/MW",
            "localized_json/en/MX",
            "localized_json/en/MY",
            "localized_json/en/NG",
            "localized_json/en/NZ",
            "localized_json/en/PH",
            "localized_json/en/PK",
            "localized_json/en/PR",
            "localized_json/en/RW",
            "localized_json/en/SD",
            "localized_json/en/SG",
            "localized_json/en/SL",
            "localized_json/en/TW",
            "localized_json/en/TZ",
            "localized_json/en/UG",
            "localized_json/en",
            "localized_json/en/ZA",
            "localized_json/en/ZM",
            "localized_json/es/AR",
            "localized_json/es/BO",
            "localized_json/es/CA",
            "localized_json/es/CL",
            "localized_json/es/CO",
            "localized_json/es/CR",
            "localized_json/es/DO",
            "localized_json/es/EC",
            "localized_json/es",
            "localized_json/es/GQ",
            "localized_json/es/GT",
            "localized_json/es/HN",
            "localized_json/es/MX",
            "localized_json/es/NI",
            "localized_json/es/PA",
            "localized_json/es/PE",
            "localized_json/es/PH",
            "localized_json/es/PR",
            "localized_json/es/PY",
            "localized_json/es/SV",
            "localized_json/es/US",
            "localized_json/es/UY",
            "localized_json/es/VE",
            "localized_json/et",
            "localized_json/fa/AF",
            "localized_json/fa",
            "localized_json/fi",
            "localized_json/fr/BE",
            "localized_json/fr/BF",
            "localized_json/fr/BJ",
            "localized_json/fr/CA",
            "localized_json/fr/CD",
            "localized_json/fr/CF",
            "localized_json/fr/CG",
            "localized_json/fr/CH",
            "localized_json/fr/CI",
            "localized_json/fr/CM",
            "localized_json/fr/GQ",
            "localized_json/fr/DJ",
            "localized_json/fr/DZ",
            "localized_json/fr",
            "localized_json/fr/GA",
            "localized_json/fr/GN",
            "localized_json/fr/LB",
            "localized_json/fr/LU",
            "localized_json/fr/ML",
            "localized_json/fr/RW",
            "localized_json/fr/SN",
            "localized_json/fr/TG",
            "localized_json/ga",
            "localized_json/gu",
            "localized_json/ha",
            "localized_json/he",
            "localized_json/hi",
            "localized_json/hr",
            "localized_json/hr",
            "localized_json/hu",
            "localized_json/id",
            "localized_json/is",
            "localized_json/it/CH",
            "localized_json/it",
            "localized_json/ja",
            "localized_json/kk",
            "localized_json/km",
            "localized_json/kn",
            "localized_json/ko",
            "localized_json/ku/Arab/IQ",
            "localized_json/lt",
            "localized_json/lv",
            "localized_json/mk",
            "localized_json/ml",
            "localized_json/mn",
            "localized_json/mr",
            "localized_json/ms",
            "localized_json/ms/SG",
            "localized_json/nb",
            "localized_json/nl/BE",
            "localized_json/nl",
            "localized_json/or",
            "localized_json/pa",
            "localized_json/pa/PK",
            "localized_json/pl",
            "localized_json/pt/AO",
            "localized_json/pt",
            "localized_json/pt/GQ",
            "localized_json/pt/CV",
            "localized_json/pt/PT",
            "localized_json/ro",
            "localized_json/ru/BY",
            "localized_json/ru/GE",
            "localized_json/ru/KG",
            "localized_json/ru/KZ",
            "localized_json/ru",
            "localized_json/ru/UA",
            "localized_json/si",
            "localized_json/sk",
            "localized_json/sl",
            "localized_json/sq",
            "localized_json/sq/ME",
            "localized_json/sr/Latn/ME",
            "localized_json/sr/Latn/RS",
            "localized_json/sv/FI",
            "localized_json/sv",
            "localized_json/sw/Latn/KE",
            "localized_json/ta",
            "localized_json/te",
            "localized_json/th",
            "localized_json/tr/AM",
            "localized_json/tr/AZ",
            "localized_json/tr/CY",
            "localized_json/tr",
            "localized_json/uk",
            "localized_json/ur/IN",
            "localized_json/ur",
            "localized_json/uz",
            "localized_json/vi",
            "localized_json/zh",
            "localized_json/zh/Hans/MY",
            "localized_json/zh/Hans/SG",
            "localized_json/zh/Hant/HK",
            "localized_json/zh/Hant/TW"
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
            "localized_json/af",
            "localized_json/am",
            "localized_json/ar/AE",
            "localized_json/ar/BH",
            "localized_json/ar/DJ",
            "localized_json/ar/DZ",
            "localized_json/ar",
            "localized_json/ar/IQ",
            "localized_json/ar/JO",
            "localized_json/ar/KW",
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
    }
};
