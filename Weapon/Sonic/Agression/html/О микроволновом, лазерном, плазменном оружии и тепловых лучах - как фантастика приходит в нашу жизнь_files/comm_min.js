
var vadsLoaderCfg = JSON.parse("{\"7047\":{\"allowedTags\":[],\"autoSlot\":false,\"autostart\":false,\"capping\":0,\"closeButton\":true,\"closeCountdownVisibility\":true,\"closeSingleTimer\":false,\"contentTime\":5,\"cssPriorityPlace\":\"head\",\"customLogo_clickthrough\":\"\",\"customLogo_height\":12,\"customLogo_width\":46,\"delay\":0,\"destroyOnClose\":true,\"extraEvents\":[],\"floating_size\":0,\"floating_mode\":0,\"height\":0,\"hidecontrols\":true,\"hideOnInput\":false,\"Impression\":10000000,\"infrm\":false,\"inpageHeader\":true,\"inpageHeader_bg\":\"#FFFFFF\",\"interscroller_bg\":\"#FFFFFF\",\"interscroller_height\":1,\"interscroller_minheight\":600,\"interscroller_mode\":0,\"loglevel\":0,\"logo\":false,\"max_width\":432,\"max_width_inpage\":432,\"MaxRun\":50,\"midrolltime\":2,\"muted\":true,\"noadsdelay\":1,\"maxNoAdsDelay\":5,\"observeYaRTBFeed\":false,\"onNoAds\":\"\",\"overlayposition\":{\"bottom\":35,\"left\":5},\"place_x\":\"Right\",\"place_y\":\"Bottom\",\"playerVersion\":2297,\"posDfp\":false,\"pos_bottom\":0,\"pos_left\":0,\"pos_right\":0,\"pos_top\":0,\"preloader_click\":\"\",\"preloader_hls_link\":\"https:\\/\\/rucdn.viadata.store\\/media\\/14_society_eng.m3u8\",\"preloader_link\":\"https:\\/\\/rucdn.viadata.store\\/media\\/14_society_eng.mp4\",\"report_able\":false,\"restartOnClose\":20,\"runcheck\":false,\"scroll\":\"\",\"scrollValue\":0,\"skip\":false,\"styles\":{\"customCSS\":\"\",\"zIndex\":2147483647,\"width\":432,\"position\":{\"bottom\":0,\"right\":0},\"close\":{\"enable\":true,\"size\":24,\"clickArea\":0,\"position\":\"left\",\"showCountdown\":true},\"slider\":{\"maxWidth\":432,\"zIndex\":2147483647,\"ratio\":\"16\\/9\",\"position\":{\"bottom\":0,\"right\":0},\"close\":{\"enable\":true,\"size\":24,\"clickArea\":0,\"position\":\"left\",\"showCountdown\":true},\"maxHeight\":{\"def\":\"400px\"}}},\"showFooter\":false,\"secure\":{\"ya\":true,\"yafb\":true,\"adman\":true,\"yains\":true},\"skipText\":\"\",\"slotBackgroundColor\":\"#FFFFFF\",\"soundButton\":true,\"stopnoads\":false,\"timeouts\":{\"fsObserveDuration\":10000,\"waterfallstart\":1000,\"waterfallend\":10000,\"yainit\":5000,\"yartbstart\":5000,\"yab\":15000,\"gnezdo\":15000,\"initVPAID\":5000,\"vpaidstart\":5000,\"googleImaInit\":5000,\"admanstart\":5000,\"cleanup\":2500},\"typeCfg\":[],\"width\":100,\"x_after\":15,\"x_click_area\":0,\"x_pos_logo\":\"Right\",\"x_size\":24,\"yandex\":{\"secure\":true,\"h\":false},\"rprc\":40,\"yandexInframe\":false,\"yandexHeaderResize\":\"none\",\"yaContinuousRTB\":true,\"yaRefresh\":1,\"tagsChunkSize\":10,\"watchContainer\":false,\"zIndex\":2147483647,\"zone_type\":\"video\",\"type\":\"slider\",\"max_height\":400,\"autoplay\":true,\"content_mode\":\"pre\",\"floating_floatOnBottom\":true,\"blocks_count\":0,\"ratio\":\"16x9\",\"logo_position\":\"Left\",\"embed_floating\":0,\"zindex\":2147483647,\"autoSize\":false,\"sticky_size\":1,\"position\":\"Bottom-Right\",\"content\":{\"type\":\"tags\",\"x_after\":15,\"noadsdelay\":1},\"closePosition\":\"left\",\"closeInside\":false,\"logoPosition\":\"right\",\"closeSwipe\":false,\"passbackMode\":\"OFF\",\"passbackType\":\"\",\"passbackUrl\":\"\",\"uuid\":\"\",\"region\":\"ru.\",\"ldom\":\"logs.viadata.store\",\"tdom\":\"rux.viadata.store\",\"autotune\":1222222222,\"ld\":\"ll.viadata.store\"},\"7484\":{\"adaptiveWidth\":true,\"autostart\":false,\"bannerTime\":20,\"capping\":0,\"delay\":0,\"imp\":999,\"max_run\":999,\"noadsdelay\":5,\"place_x\":\"Right\",\"place_y\":\"Bottom\",\"pos_bottom\":0,\"pos_left\":0,\"pos_right\":0,\"pos_top\":0,\"zone_type\":\"banner\",\"max_width\":432,\"max_height\":300,\"x_timer\":5,\"zindex\":100001,\"viewportOnly\":true,\"onnoads\":\"delay\",\"type\":\"inline\",\"logo\":\"OFF\",\"passbackMode\":\"OFF\",\"passbackUrl\":\"\",\"autotune\":1222222222,\"uuid\":\"\",\"ldom\":\"logs.viadata.store\",\"ld\":\"ll.viadata.store\",\"tdom\":\"rux.viadata.store\",\"region\":\"ru.\"}}");
var containerId = '';

var vadsLoaderDrivers = {};

function isLibLoaded(doc, name) {
    return Boolean(doc.document.querySelector(`script[src*="${name}"`));
}

function createScriptTag(doc, name) {
    function createScript() {
        const script = doc.document.createElement('script');
        script.src = name;
		script.async = !0;
		script.defer = !0;
        doc.document.body.appendChild(script);
    }

    if (doc.document.body) {
        createScript();
        return;
    }

    if (window.MutationObserver) {
        const observer = new MutationObserver(() => {
            if (doc.document.body) {
                observer.disconnect();
                createScript();
            }
        });
        observer.observe(doc.document.documentElement, { childList: true, subtree: true });
        return;
    }

    const interval = setInterval(() => {
        if (doc.document.body) {
            clearInterval(interval);
            createScript();
        }
    }, 500);

    doc.document.addEventListener('DOMContentLoaded', () => {
        if (doc.document.body) {
            clearInterval(interval);
            createScript();
        }
    });
}

function getNearestSelector(sel) {	
	if (sel.length == 1) {
		return sel[0];
	} else {
		let nearestId = -1;
		let nearestValue = 0;
		for (let i = 0; i < sel.length; i++) {
			let rect = sel[i].getBoundingClientRect();
			if (nearestId == -1 || (nearestValue < 0 && rect.bottom > nearestValue) || (nearestValue > 0 && rect.bottom < nearestValue)) {
				nearestId = i;
				nearestValue = rect.bottom;
			}
		}
		return sel[nearestId];
	}
}

const fpPromise = import('https://viadata.store/tag/fp.js').then(FingerprintJS => FingerprintJS.load())
fpPromise.then(fp => fp.get()).then(result => {
      var vadsSyncJS = 'https://ru.viadata.store/tag/bsync.js?sid=108540&u='+result.visitorId;
      if (!isLibLoaded(window.frameElement ? window.parent : window, vadsSyncJS)) {
		createScriptTag(window.frameElement ? window.parent : window, vadsSyncJS);
	}
    })
vadsLoaderDrivers["video"] = function(cfg, cb) {
    var { zoneId, container, containerId, videoId = 0, videoExt = "", onError, onComplete, onStart, onClose } = cb;
    
    cfg.logErrors = false;
    cfg.vpaidTryVisibility = !1;
    cfg.tracesSampleRate = 0.01;
    cfg.prerollDelay = 0;
    cfg.preloaderLogo = false;
    cfg.ws = !1;
	cfg.bl = ['.adstreamer.ru/vpaid.php','.suprion.ru/static/vpaid/vpaidk.min.1.7.4.js'];
    cfg.loglevel = 0;
    cfg.libHLS = 'https://rucdn.viadata.store/js/player/hls2.js';
    cfg.dev = !1;
    
    if (!cfg.content || cfg.content.length == 0) {
		var content = {type:"none"}
		cfg.content = content;
	} else {
		cfg.content.linesPerSlide = 2;
	}
		
	if (cfg.type == 'slider' && (!cfg.onNoAds || cfg.onNoAds == '') && (!cfg.content || cfg.content.type == 'none')) {
		cfg.onNoAds = 'hide';
	}
	
	function vadsInit(doc) {
		if (zoneId == 4840) { container = null; }
		function vadsStart() {
            if (!isLibLoaded(doc, 'https://rucdn.viadata.store/js/player/260225_e0269d5a/main.js')) {
                (function(a, b, c, d, e, f, g) {
                    var s = b.createElement(c);
                    s.src = d;
                    s.type = "application/javascript";
                    s.async = !0;
                    s.defer = !0;
                    b.body.appendChild(s);
                    a[f] = a[f] || [];
                    a[e] = function() {
                        var _a$f;
                        (_a$f = a[f]).push.apply(_a$f, arguments);
                    }
                    a[g] = a[g] || {};
                })(doc, doc.document, "script", 'https://rucdn.viadata.store/js/player/260225_e0269d5a/main.js', "vadsPlayer", "vadsPlayerCaller", "vadsPlayerCfg");
            }
            doc.vadsPlayerCfg[zoneId] = cfg;
            doc._vadsPlayer = (params)=>{
                doc.vadsPlayerCalls = doc.vadsPlayerCalls || [];
                doc.vadsPlayerCalls.push({
                    params,
                    processed: false
                });
            };
            doc._vadsPlayer({ sid: 108540, zone: zoneId, container: container, videoid: videoId, videoext: videoExt, watchContainer: cfg.watchContainer, callbacks: {onError, onComplete, onStart, onClose}});
        }
        
        (new Image).src = "https://ll.viadata.store/event/req?sid=108540&uid=&zid="+ zoneId +"&v="+ cfg.playerVersion +"&cb=" + Date.now();
			
		if (cfg.restartOnClose) {
            onClose = function () {
                setTimeout(function() {
                    doc._vadsPlayer({ sid: 108540, zone: zoneId, container: container, videoid: videoId, videoext: videoExt, watchContainer: cfg.watchContainer, callbacks: {onError, onComplete, onStart, onClose}});
                }, cfg.restartOnClose*1000);
            }
        }
        
        if (cfg.type == "slider" || cfg.type == "interstitial" || cfg.type == "sticky") { container = doc.document.body; }
        if (window.location.hostname == 'proglib.io') {
			container = null;
			cfg.autoSlot = true;
		}
        if (container == null) {
            if (cfg.autoSlot) {
				const getAdContainer = (doc) => {
					const containerRequirements = {
						fitReq: (container, px) => {
							const { width, height, top } = container.getBoundingClientRect();
							return width >= px && height < 600;
						},
						lowerThan: (container) => {
							const { bottom } = container.getBoundingClientRect();
							return bottom-window.innerHeight > 0;
						},
						isElementContains: (parent, child) => parent.contains(child)
					};
					var containersFitReq = false;
					if (cfg.autoSlotCfg && cfg.autoSlotCfg.allowedContainers && cfg.autoSlotCfg.allowedContainers.length > 0) {
						let { allowedSelectors, allowedContainers, forbiddenSelectors } = cfg.autoSlotCfg;
						allowedContainers = [...allowedContainers, "body"];
						let allowedElems = [], allowedLowerElems = [], forbiddenElems = [];
						
						forbiddenSelectors.forEach(selector => {
							forbiddenElems.push(...document.querySelectorAll(selector));
						});
						
						for (let i = 0; i < allowedContainers.length; i++) {
							const elem = doc.document.querySelector(allowedContainers[i]);
							if (elem != null) {
								allowedElems = [...elem.querySelectorAll(allowedSelectors.join(", "))].filter((el) =>  containerRequirements.fitReq(el, window.innerWidth < 900 ? 330 : 600) && forbiddenElems.every(fEl => !containerRequirements.isElementContains(fEl, el)));
								if (allowedElems.length > 0) {
									allowedLowerElems = allowedElems.filter((el) =>  containerRequirements.lowerThan(el));
									if (allowedLowerElems.length > 0) {
										containersFitReq = allowedLowerElems[0];
										break;
									} else {
										containersFitReq = allowedElems[0];
										break;
									}
								}
							}
						}
					}

					const container = doc.document.createElement("div");
					container.style.cssText = "width: 100%;display: flex;justify-content: center;";

					if (containersFitReq !== false) {
						containersFitReq.after(container);
					} else {
						doc.document.body.appendChild(container);
					}
					return container;
				};

                if (document.readyState != "complete" && document.readyState != "interactive") {
					document.addEventListener('DOMContentLoaded', () => {
						container = getAdContainer(doc); 
						vadsStart();
					}, false); 
				} else {
					container = getAdContainer(doc); 
					vadsStart();
				}
            } else {
                const isElementLoaded = async selector => {
                    while ( document.querySelectorAll(selector).length == 0) {
                        await new Promise( resolve =>  requestAnimationFrame(resolve) )
                    }
                    return document.querySelectorAll(selector);
                };
                let sel = '#'+containerId;
                if (cfg.type == "embed" && containerId == "") {
                    if (cfg.content.mode == "rutube") {
                        sel = 'iframe[src^="https://rutube.ru/play/embed/"]';
                    }
                }
                isElementLoaded(sel).then((selector) => {
					selector = getNearestSelector(selector);
                    if (cfg.type == "embed") {
                        cfg.height = selector.height;
                        cfg.width = selector.width;
                    }
                    container = selector;
                    vadsStart();
                });
            }
        } else {
            vadsStart();
        }
    }
    
    if (cfg.capping && cfg.capping > 0) {
        var lr = localStorage.getItem('vads_ls_' + zoneId), time_now  = (new Date()).getTime();
        if (lr && (time_now - lr) > 60000 * cfg.capping) {            
            setTimeout(function () {
                vadsInit(!cfg.infrm && window.frameElement ? window.parent : window);
            }, cfg.delay * 1000);
        } else {
            if (!lr) setTimeout(function () { vadsInit(!cfg.infrm && window.frameElement ? window.parent : window); }, cfg.delay * 1000);           
        }
    } else {
        setTimeout(function () {
            vadsInit(!cfg.infrm && window.frameElement ? window.parent : window);
        }, cfg.delay * 1000);      
    }
};

vadsLoaderDrivers["none"] = function (zones) {};
vadsLoaderDrivers["hb"] = function (zones) {};

vadsLoaderDrivers["banner"] = function(zones) {    
    function vadsInit(doc) {
        if (!isLibLoaded(doc, 'https://rucdn.viadata.store/js/br/251230_246d9ad1.js')) {
            createScriptTag(doc, 'https://rucdn.viadata.store/js/br/251230_246d9ad1.js');
        }
            
        var config = { sid: 108540, ld: 'll.viadata.store', ver: '60', logs: !1, zones: [] };
        zones.forEach((element) => {
            var { cb, cfg } = element;
            var { zoneId, container = document.body, containerId, onError, onComplete, onStart, onClose } = cb;            
            var zconfig = { mode: cfg.type, zoneid: zoneId, container: container, containerId: containerId, config: cfg };
            config.zones.push(zconfig);
        });
    
        window.VADSBannerRotatorQueue = window.VADSBannerRotatorQueue || [];
        window.VADSBannerRotatorQueue.push(config);
    }
    vadsInit(window.frameElement ? window.parent : window);
};

window.vadsLoaderQueue = new Proxy(window.vadsLoaderQueue || [], { set(target, prop, value) { if (prop !== "length") { if (typeof value !== "function") { throw new Error("function expected"); } value.call(); } return true; } });

var runOnce = !0;
window.vadsLoader = {};
window.vadsLoader.run = function(a) {
    var vadsBanners = [];
    for (let entry of a) {
        if (vadsLoaderCfg[entry.zoneId] !== undefined) {  
            if(vadsLoaderCfg[entry.zoneId].zone_type == "banner") {
                vadsBanners.push({"cfg":vadsLoaderCfg[entry.zoneId],"cb":entry});
            } else {
                vadsLoaderDrivers[vadsLoaderCfg[entry.zoneId].zone_type](vadsLoaderCfg[entry.zoneId], entry);
            }
        }
    }
    if(vadsBanners.length > 0) {
        vadsLoaderDrivers["banner"](vadsBanners);
    }
}

if (window.vadsLoaderQueue && window.vadsLoaderQueue.length) { window.vadsLoaderQueue.forEach(function(runCall, index, object) { runCall.call(); object.splice(index, 1); }); }

var runOptions = [];
for (var zone in vadsLoaderCfg) {
    if (vadsLoaderCfg[zone].autostart && vadsLoaderCfg[zone].type != 'preroll' && vadsLoaderCfg[zone].type != 'vast outstream' && vadsLoaderCfg[zone].type != 'vast instream') {
        var runElement = {zoneId: Number(zone)};
        if (vadsLoaderCfg[zone].type == "inpage" || vadsLoaderCfg[zone].type == "embed" || vadsLoaderCfg[zone].type == "stream" || vadsLoaderCfg[zone].type == "floating" || vadsLoaderCfg[zone].type == "inline") {
            var contId;
            if (containerId == '') { contId = 'via_108540_' + zone; } else { contId = containerId; }
            runElement.containerId = contId;
        }
        runOptions.push(runElement);
    }
};

if (runOptions.length > 0) { window.vadsLoaderQueue.push(()=>{ vadsLoader.run(runOptions); }); }