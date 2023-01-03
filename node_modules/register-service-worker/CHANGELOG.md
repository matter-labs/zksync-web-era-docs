<a name="1.7.2"></a>
## [1.7.2](https://github.com/yyx990803/register-service-worker/compare/v1.7.1...v1.7.2) (2020-12-10)


### Bug Fixes

* catch serviceWorker.ready Promise rejections ([#46](https://github.com/yyx990803/register-service-worker/issues/46)) ([563fa94](https://github.com/yyx990803/register-service-worker/commit/563fa94)), closes [#45](https://github.com/yyx990803/register-service-worker/issues/45)



<a name="1.7.1"></a>
## [1.7.1](https://github.com/yyx990803/register-service-worker/compare/v1.7.0...v1.7.1) (2020-03-19)


### Bug Fixes

* do not throw when required on server-side ([9588bf9](https://github.com/yyx990803/register-service-worker/commit/9588bf9))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/yyx990803/register-service-worker/compare/v1.6.2...v1.7.0) (2020-03-10)


### Features

* also emit 'offline' in non-localhost ([#32](https://github.com/yyx990803/register-service-worker/issues/32)) ([c94341e](https://github.com/yyx990803/register-service-worker/commit/c94341e))
* also emit 'ready' in non-localhost ([#37](https://github.com/yyx990803/register-service-worker/issues/37)) ([16d2a77](https://github.com/yyx990803/register-service-worker/commit/16d2a77)), closes [#20](https://github.com/yyx990803/register-service-worker/issues/20)
* allow `register` to be called on-demand after `onload` event ([#33](https://github.com/yyx990803/register-service-worker/issues/33)) ([5f96e33](https://github.com/yyx990803/register-service-worker/commit/5f96e33))


<a name="1.6.2"></a>
## [1.6.2](https://github.com/yyx990803/register-service-worker/compare/v1.6.1...v1.6.2) (2019-02-18)


### Bug Fixes

* remove default scope from registrationOptions ([#26](https://github.com/yyx990803/register-service-worker/issues/26)) ([73794b4](https://github.com/yyx990803/register-service-worker/commit/73794b4))



<a name="1.6.1"></a>
## [1.6.1](https://github.com/yyx990803/register-service-worker/compare/v1.4.1...v1.6.1) (2019-02-11)


### Bug Fixes

* **types:** add type for updatefound event ([2be9827](https://github.com/yyx990803/register-service-worker/commit/2be9827))
* fix missing registration arguments ([#11](https://github.com/yyx990803/register-service-worker/issues/11)) ([d11b254](https://github.com/yyx990803/register-service-worker/commit/d11b254))
* **types:** make hooks parameter optional ([#18](https://github.com/yyx990803/register-service-worker/issues/18)) ([283c570](https://github.com/yyx990803/register-service-worker/commit/283c570))
* misleading error when wrong MIME type returned ([#21](https://github.com/yyx990803/register-service-worker/issues/21)) ([#22](https://github.com/yyx990803/register-service-worker/issues/22)) ([d3287d3](https://github.com/yyx990803/register-service-worker/commit/d3287d3))
* **types:** Make registrationOptions optional ([#24](https://github.com/yyx990803/register-service-worker/issues/24)) ([27d74c2](https://github.com/yyx990803/register-service-worker/commit/27d74c2)), closes [#23](https://github.com/yyx990803/register-service-worker/issues/23)


### Features

* add "updatefound" event ([#7](https://github.com/yyx990803/register-service-worker/issues/7)) ([bee2641](https://github.com/yyx990803/register-service-worker/commit/bee2641))
* emit updated event when registration.waiting was found ([#9](https://github.com/yyx990803/register-service-worker/issues/9)) ([937040f](https://github.com/yyx990803/register-service-worker/commit/937040f))
* registration options ([#17](https://github.com/yyx990803/register-service-worker/issues/17)) ([c6f0386](https://github.com/yyx990803/register-service-worker/commit/c6f0386))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/yyx990803/register-service-worker/compare/v1.5.2...v1.6.0) (2019-02-08)


### Bug Fixes

* **types:** make hooks parameter optional ([#18](https://github.com/yyx990803/register-service-worker/issues/18)) ([283c570](https://github.com/yyx990803/register-service-worker/commit/283c570))
* misleading error when wrong MIME type returned ([#21](https://github.com/yyx990803/register-service-worker/issues/21)) ([#22](https://github.com/yyx990803/register-service-worker/issues/22)) ([d3287d3](https://github.com/yyx990803/register-service-worker/commit/d3287d3))


### Features

* registration options ([#17](https://github.com/yyx990803/register-service-worker/issues/17)) ([c6f0386](https://github.com/yyx990803/register-service-worker/commit/c6f0386))



<a name="1.5.2"></a>
## [1.5.2](https://github.com/yyx990803/register-service-worker/compare/v1.5.1...v1.5.2) (2018-08-16)


### Bug Fixes

* fix missing registration arguments ([#11](https://github.com/yyx990803/register-service-worker/issues/11)) ([d11b254](https://github.com/yyx990803/register-service-worker/commit/d11b254))



<a name="1.5.1"></a>
## [1.5.1](https://github.com/yyx990803/register-service-worker/compare/v1.5.0...v1.5.1) (2018-08-13)


### Bug Fixes

* **types:** add type for updatefound event ([2be9827](https://github.com/yyx990803/register-service-worker/commit/2be9827))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/yyx990803/register-service-worker/compare/v1.4.1...v1.5.0) (2018-08-13)


### Features

* add "updatefound" event ([#7](https://github.com/yyx990803/register-service-worker/issues/7)) ([bee2641](https://github.com/yyx990803/register-service-worker/commit/bee2641))
* emit updated event when registration.waiting was found ([#9](https://github.com/yyx990803/register-service-worker/issues/9)) ([937040f](https://github.com/yyx990803/register-service-worker/commit/937040f))



<a name="1.4.1"></a>
## [1.4.1](https://github.com/yyx990803/register-service-worker/compare/v1.4.0...v1.4.1) (2018-06-18)



<a name="1.4.0"></a>
# [1.4.0](https://github.com/yyx990803/register-service-worker/compare/v1.3.0...v1.4.0) (2018-06-01)


### Features

* add registered event ([#3](https://github.com/yyx990803/register-service-worker/issues/3)) ([6be9f87](https://github.com/yyx990803/register-service-worker/commit/6be9f87))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/yyx990803/register-service-worker/compare/v1.2.0...v1.3.0) (2018-05-28)


### Features

* Pass registration as argument on cached and updated event ([#2](https://github.com/yyx990803/register-service-worker/issues/2)) ([61ebc74](https://github.com/yyx990803/register-service-worker/commit/61ebc74))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/yyx990803/register-service-worker/compare/v1.1.1...v1.2.0) (2018-04-13)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/yyx990803/register-service-worker/compare/v1.1.0...v1.1.1) (2018-02-12)


### Bug Fixes

* check if hooks are provided ([#1](https://github.com/yyx990803/register-service-worker/issues/1)) ([55276a5](https://github.com/yyx990803/register-service-worker/commit/55276a5))



<a name="1.1.0"></a>
# 1.1.0 (2018-01-11)



