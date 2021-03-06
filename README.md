# ilib-loctool-webos-appinfo-json

ilib-loctool-webos-appinfo-json is a plugin for the loctool that
allows it to read and localize `appinfo.json` file. This plugin is optimized for webOS platform

## Release Notes
v1.2.9
* Update dependent module version to have the latest one. (loctool: 2.14.1)

v1.2.8
* Update dependent module version to have the latest one. (loctool: 2.13.0)

v1.2.7
* Update dependent module version to have the latest one. (loctool: 2.12.0)

v1.2.6
* Update dependent module version to have the latest one. (loctool: 2.10.3)

v1.2.5
* Update dependent module version to have the latest one.

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
* Create `x-json` type which will search first to get a translation. If it doesn't exist, it will search the `javascript` group tag as an alternative.
* Fix not to create a file if there is no translation data.

v1.1.0
* Added feature to generate `ilibmanifest.json` file

v1.0.0
* Implemented `appinfo.json` file localization. The appinfo.json file resides in an app's root directory and contains a single JSON object. Some Some properties data in a JSON object need to be localized, such as `title`. It is defined in the schema file. If you want to get more information regarding `appinfo.json` on webOS, Please visit this [link](https://www.webosose.org/docs/guides/development/configuration-files/appinfo-json/).


## License

Copyright (c) 2019-2021, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
