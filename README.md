# octopus-ui
[![Build Status](http://drone-pandaria.cnrancher.com/api/badges/cnrancher/octopus-ui/status.svg)](http://drone-pandaria.cnrancher.com/cnrancher/octopus-ui)

Octopus Dashboard UI.  For the other Dashboard UI see [dashboard/ui](https://github.com/rancher/dashboard).

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at https://localhost:8005
$ API=http://localhost:8005 yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

 ## Running with standalone Steve on a Mac
 ```bash
 cd steve
 make run-host

 cd dashboard
 docker build -f Dockerfile.dev -t cnrancher/octopus-ui:dev
 docker run -v $(pwd):/src -v dashboard_node:/src/node_modules -p 8005:8005 -e API=http://172.17.0.1:8989 cnrancher/octopus-ui:dev
 #
 # The first time will take forever installing node_modules into the volume, it will be faster next time.
 #
 # Goto https://localhost:8005


License
=======
Copyright (c) 2014-2020 [Rancher Labs, Inc.](http://rancher.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
