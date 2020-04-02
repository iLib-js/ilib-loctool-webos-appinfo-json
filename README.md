# ilib-loctool-webos-appinfo-json

ilib-loctool-webos-appinfo-json is a plugin for the loctool that
allows it to read and localize `appinfo.json` file. This plugin is optimized for webOS platform

## Release Notes
v1.2.0
* Create `x-json` type which will search first to get a translation. If it doesn't exist, it will search the `javascript` group tag as an alternative.
* Fix not to create a file if there is no translation data.

v1.1.0
* Added feature to generate `ilibmanifest.json` file

v1.0.0
* Implemented `appinfo.json` file localization. The appinfo.json file resides in an app's root directory and contains a single JSON object. Some Some properties data in a JSON object need to be localized, such as `title`. It is defined in the schema file. If you want to get more information regarding `appinfo.json` on webOS, Please visit this [link](https://www.webosose.org/docs/guides/development/configuration-files/appinfo-json/).


## License

Copyright © 2019-2020, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
