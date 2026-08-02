(function (c) {
    function isEngineInited(attr) {
        return  document.querySelectorAll('[' + attr +']').length;
    }

    function insertScript(src, attr) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = 1;
        script.src = src;
        script.dataset[attr] = 'true';

        let head = document.getElementsByTagName('head')[0];
        head.insertBefore(script, head.firstChild);
    }

    if (c.isCoreEngineEnabled && !isEngineInited('data-roxot-core-inited')) {
        insertScript(c.coreEngineUrl, 'roxotCoreInited');

        window.rxtCore = window.rxtCore || {icmd: []};
        window.rxtCore.icmd = window.rxtCore.icmd || [];
        window.rxtCore.icmd.push(c.coreEngineSettings);
    }

    if (c.isEngineEnabled && !isEngineInited('data-roxot-ad-inited')) {

        insertScript(c.managerUrl, 'roxotAdInited');

        window.rom = window.rom || {cmd: [], icmd: []};
        window.rom.icmd = window.rom.icmd || [];
        window.rom.icmd.push(c);
    }
})({"publisherId":"e66e8ed1-e605-4e08-a6f6-00d63f7b7134","publisher":"\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u043f\u0440\u0435\u0434\u043f\u0440\u0438\u043d\u0438\u043c\u0430\u0442\u0435\u043b\u044c \u0412\u0438\u0441\u043a\u043e\u0432  \u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u0415\u0432\u0433\u0435\u043d\u044c\u0435\u0432\u0438\u0447","isEngineEnabled":false,"adBlockMode":"main","iframeSspList":[],"managerUrl":"https:\/\/cdn.skcrtxr.com\/wrapper\/js\/common-engine.js?v=s-f9c7522c-4d16-4c34-9cb8-d0489c33208e","wrapperUrl":"https:\/\/cdn-c.skcrtxr.com\/wrapper\/js\/wrapper.js?v=s-f9c7522c-4d16-4c34-9cb8-d0489c33208e","placementConfigTemplate":"https:\/\/cdn.skcrtxr.com\/wrapper-builder\/placement\/__PLACEMENT_ID__?v=d-1771339738","gfsPlacementOptionsTemplate":"https:\/\/ad-pixel.ru\/wrapper-builder\/gfs-placement\/__PLACEMENT_ID__?v=d-1771339738","isLanguageSpecific":false,"hostConfig":{"overclockers.ru":{"wrapperOptions":[],"isAcceptableAdsEnabled":false}},"isBrowserSpecific":false,"isOsSpecific":false,"isDeviceTypeSpecific":false,"isGeoSpecific":false,"isGetParamSpecific":false,"dynamicUrlTemplate":"","wrapperConfig":{"roxotYaMetric":{"enabled":true,"counterId":88477929},"monetizationStatsIntegration":{"enabled":true,"requestSettings":{"isNeedToSend":true,"sampleCoefficient":1},"impressionSettings":{"isNeedToSend":true,"sampleCoefficient":1}},"roxotAdPixel":{"enabled":true,"pixels":[{"urlIncludes":"https:\/\/overclockers.ru\/","pixelsUrls":["https:\/\/rap.skcrtxr.com\/pub\/pix\/d4db4577-7025-474f-ab93-365f15d5cf97"]},{"urlIncludes":"https:\/\/overclockers.ru\/itnews","pixelsUrls":["https:\/\/rap.skcrtxr.com\/pub\/pix\/3c2d7d3e-197f-45bb-83e0-f1c9d992e42f"]}]},"cpmGrid":{"enabled":true},"adfox":{"hb":{"timeout":1000}},"prebid":{"path":"https:\/\/cdn.skcrtxr.com\/wrapper\/js\/prebid.js?v=s-f9c7522c-4d16-4c34-9cb8-d0489c33208e"},"videojsLibs":{"path":"https:\/\/cdn.skcrtxr.com\/wrapper\/js\/video-libs.js?v=s-f9c7522c-4d16-4c34-9cb8-d0489c33208e"},"pageUrlVariableName":"roxotPlusPageUrl","stubVideoPath":"https:\/\/cdn.skcrtxr.com\/wrapper\/js\/video-ad?v=s-f9c7522c-4d16-4c34-9cb8-d0489c33208e","adfoxIntegrationType":"common","yandexIntegrationType":"common","openRtbHost":"https:\/\/openrtb.skcrtxr.com"},"lazyLoading":[],"geoSpecificUrl":"https:\/\/openrtb.skcrtxr.com\/def-g","openRtbApiGetUserInfoUrl":"https:\/\/skcrtxr.com\/open-rtb-api\/get-user-bidders-info","syncCookiesUrl":"https:\/\/csync.skcrtxr.com\/user-sync-api\/sync","monetizationStatsUrl":"https:\/\/worker.sttsmntz.ru\/stats\/format","isCoreEngineEnabled":true,"coreEngineUrl":"https:\/\/cdn-c.skcrtxr.com\/wrapper\/js\/rp-core-engine.js?v=s-f9c7522c-4d16-4c34-9cb8-d0489c33208e","coreEngineSettings":{"roxotYaMetric":{"enabled":true,"counterId":88477929},"roxotAdPixel":{"enabled":true,"pixels":[{"urlIncludes":"https:\/\/overclockers.ru\/","pixelsUrls":["https:\/\/rap.skcrtxr.com\/pub\/pix\/d4db4577-7025-474f-ab93-365f15d5cf97"]},{"urlIncludes":"https:\/\/overclockers.ru\/itnews","pixelsUrls":["https:\/\/rap.skcrtxr.com\/pub\/pix\/3c2d7d3e-197f-45bb-83e0-f1c9d992e42f"]}]},"cpmGrid":{"enabled":true},"cpmGridUrl":"https:\/\/grid.skcrtxr.com\/c"}})
