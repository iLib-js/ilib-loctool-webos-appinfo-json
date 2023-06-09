# ilib-loctool-webos-appinfo-json

ilib-loctool-webos-appinfo-json is a plugin for the loctool that
allows it to read and localize `appinfo.json` file. This plugin is optimized for webOS platform

## Release Notes
v1.7.0
* Added the `mappings` conguration which a mapping between file matchers and an object that gives info used to localize the files that match it.
* Added feature not to do localization if the file is already located in localization directory.

v1.6.1
* Fixed to generate `ilibmanifest.json` file correctly even when a dummy file exists.

v1.6.0
* Added a timestamp in `ilibmanifest.json` file to support wee localization.
* Updated to skip writing `ilibmanifest.json` creation logic if it has already been done in another plugin.

v1.5.0
* Updated dependencies. (loctool: 2.20.2)
* Fixed not generating duplicated resources by comparing language default locale translation even if the locale follows the locale inheritance rule.

v1.4.1
* Added guard code to prevent errors when the common data path is incorrect.

v1.4.0
* Updated dependencies. (loctool: 2.20.0)
* Added ability to define custom locale inheritance.
    ~~~~
       "settings": {
            "localeInherit": {
                "en-AU": "en-GB"
            }
        }
    ~~~~
* Added ability to use common locale data.
  * App's xliff data has a higher priority, if there's no matched string there, then loctool checks data in the commonXliff directory.
    ~~~~
       "settings": {
            "webos": {
                "commonXliff": "./common"
            }
        }
    ~~~~

v1.3.0
* Updated dependencies. (loctool: 2.18.0)
* Added ability to override language default locale.
    ~~~~
       "settings": {
            "localeMap": {
                "es-CO": "es"
            }
        }
    ~~~~

v1.2.12
* Updated dependencies. (loctool: 2.17.0)
* Fixed not to generate duplicated resource by comparing language default locale translation.

v1.2.11
* Updated dependencies. (loctool: 2.16.3)
* Used the logger provided by the loctool instead of using log4js directly.
* Added node 16 version testing for circleCI (minimum version of node is v10.0.0)
* Fixed to set baseLocale correctly when calculating resource path.

v1.2.10
* Updated dependent module version to have the latest one. (loctool: 2.16.2)

v1.2.9
* Updated dependent module version to have the latest one. (loctool: 2.14.1)

v1.2.8
* Updated dependent module version to have the latest one. (loctool: 2.13.0)

v1.2.7
* Updated dependent module version to have the latest one. (loctool: 2.12.0)

v1.2.6
* Updated dependent module version to have the latest one. (loctool: 2.10.3)

v1.2.5
* Updated dependent module version to have the latest one.

v1.2.4
* Changed en-US translation data to be located in the resource root directory
* Fixed to generate `ilibmanifest.json` file properly in the nested project localization case.

v1.2.3
* Fixed not to generate `ilibmanifest.json` when the content is empty.

v1.2.2
* Fixed resource target path
* Updated code to print log with log4js

v1.2.1
* Fixed to load schema file correctly wherever plugin is installed

v1.2.0
* Created `x-json` type which will search first to get a translation. If it doesn't exist, it will search the `javascript` group tag as an alternative.
* Fix not to create a file if there is no translation data.

v1.1.0
* Added feature to generate `ilibmanifest.json` file

v1.0.0
* Implemented `appinfo.json` file localization. The appinfo.json file resides in an app's root directory and contains a single JSON object. Some Some properties data in a JSON object need to be localized, such as `title`. It is defined in the schema file. If you want to get more information regarding `appinfo.json` on webOS, Please visit this [link](https://www.webosose.org/docs/guides/development/configuration-files/appinfo-json/).


## License

Copyright (c) 2019-2023, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
