let _config = false;
let _lastTabId;
let _tabs = {};

let config_data = [
	{
		regexp: "daletra\..+",
		site: "daletra",
		func: () => {
			try {
				return {
					artist: document.querySelector("header h2 a").innerText.trim() || '',
					music: document.querySelector("h1.music-name").innerText.trim() || '',
				};
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "music\\.youtube\\.com",
		site: "youtube-music",
		func: () => {
			try {
				return {
					title: document.querySelector("ytd-channel-name yt-formatted-string a")?.innerText?.trim() || document.querySelector("yt-formatted-string.title.ytmusic-player-bar")?.innerText || '',
					channel: document.querySelector("ytmusic-player-bar a.yt-simple-endpoint")?.innerText?.trim() || '',
					youtube_id: window.location.search.match(/[?&]v=([^?&]+)/)?.[1] || document.querySelector("#player a.ytp-title-link")?.getAttribute("href")?.match(/[?&]v=([^?&]+)/)?.[1] || ''
				};
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "youtube\\.com",
		site: "youtube",
		func: () => {
			try {
				return {
					title: document.querySelector("#title h1")?.innerText?.trim() || '',
					channel: document.querySelector("ytd-watch-metadata ytd-channel-name yt-formatted-string a")?.innerText?.trim() || '',
					youtube_id: window.location.search.match(/[?&]v=([^?&]+)/)?.[1] || ''
				};
			} catch (e) {
				return false;
			}
		},
		blacklist: ["/channel/", "/shorts/", "/results", "/feed/subscriptions", "/user/", "/$"]
	},
	{
		regexp: "www\\.reverbnation\\.com",
		site: "reverbnation",
		func: () => {
			try {
				return {
					artist: document.querySelector("#music_player h4")?.innerText?.trim() || '',
					music: document.querySelector("#music_player h3")?.innerText?.trim() || '',
				};
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "last\\.fm\\/",
		site: "last.fm",
		func: () => {
			try {
				return {
					artist: document.querySelector(".player-bar-now-playing .player-bar-artist-name")?.innerText?.trim() || '',
					music: document.querySelector(".player-bar-now-playing .player-bar-track-name")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "(app\\.|^)napster\\.com",
		site: "napster",
		func: () => {
			try {
				return {
					artist: document.querySelector("div.player-artist a")?.innerText?.trim() || '',
					music: document.querySelector("div.player-track a")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "kissfm\\.com\\.br",
		site: "kissfm",
		func: () => {
			try {
				return {
					artist: document.querySelector("#td-player-vertical__track-info__artist-name span")?.innerText?.trim() || '',
					music: document.querySelector("#td-player-vertical__track-info__cue-title span")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "deezer\\.com\\/",
		site: "deezer",
		func: () => {
			try {
				return {
					artist: document.querySelector("#page_player p[data-testid='item_subtitle']")?.innerText?.trim() || '',
					music: document.querySelector("#page_player p[data-testid='item_title']")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "youzeek\\.com\\/",
		site: "youzeek",
		func: () => {
			try {
				return {
					artist: document.querySelector("#player p.player-artist")?.innerText?.trim() || '',
					music: document.querySelector("#player h3.player-title")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "soundcloud\\.com",
		site: "soundcloud",
		func: () => {
			try {
				return {
					artist: document.querySelector(".playbackSoundBadge__titleContextContainer > a")?.innerText?.trim() || '',
					music: document.querySelector(".playbackSoundBadge__title > a > span:nth-child(2)")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		},
		blacklist: ["developers\\.soundcloud\\.com", "blog\\.soundcloud\\.com"]
	},
	{
		regexp: "hypem\\.com",
		site: "hypem",
		func: () => {
			try {
				return {
					artist: document.querySelectorAll("#player-nowplaying > a")[0]?.innerText?.trim() || '',
					music: document.querySelectorAll("#player-nowplaying > a")[1]?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "vimeo\\.com\\/\\d+",
		site: "vimeo.com",
		monitor: false,
		func: () => {
			try {
				return {
					title: document.querySelector("#main > div > main > div > div h1 span:nth-child(1)")?.innerText?.trim() || '',
					channel: document.querySelector('.clip_info-subline--watch.clip_info-subline--inline a.js-user_link')?.innerText?.trim() || '',
					vimeo_id: window.location.href.match(/^https?\:\/\/vimeo\.com\/([0-9]+)/)?.[1] || ''

				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "music\\.apple\\.com",
		site: "apple-music",
		func: () => {
			try {
				return {
					artist: document.querySelector("amp-lcd")?.shadowRoot?.querySelector("amp-lcd-metadata")?.querySelector("amp-marquee-text.lcd-meta__secondary button:first-child")?.innerText || document.querySelector("amp-lcd")?.shadowRoot?.querySelector("amp-lcd-metadata")?.querySelector("amp-marquee-text.lcd-meta__secondary .lcd-meta-line__text-content span:first-child")?.innerText?.trim() || '',
					music: document.querySelector("amp-lcd")?.shadowRoot?.querySelector("amp-lcd-metadata")?.querySelector("amp-marquee-text.lcd-meta__primary")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "open\\.spotify\\.com",
		site: "spotify",
		func: () => {
			try {
				return {
					artist: document.querySelector("[data-testid='context-item-info-artist']")?.innerText?.trim() || '',
					music: document.querySelector("[data-testid='context-item-info-title']")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	},
	{
		regexp: "listen\\.tidal\\.com",
		site: "tidal",
		func: () => {
			try {
				return {
					artist: document.querySelector("div[class^='trackTitleContainer--'] span")?.innerText?.trim() || '',
					music: document.querySelector("div[class^='currentMediaItemDetails--'] > div span a")?.innerText?.trim() || ''
				}
			} catch (e) {
				return false;
			}
		}
	}
];

function getExtensionVersion() {
    return chrome.runtime.getManifest().version;
}

function showMessage(errorId) {
    const iconMap = {
        loading: "fa-loader fa-spin",
        not_found: "fa-square-question",
        not_identified: "fa-square-question"
    };

    const errorMessage = chrome.i18n.getMessage(`${errorId}_message`);
    const errorTitle = chrome.i18n.getMessage(`${errorId}_title`);
    const errorIcon = iconMap[errorId] || "fa-triangle-exclamation";

    const messageContainer = document.getElementById("message");
    messageContainer.className = errorId || '';
    const iconElement = messageContainer.querySelector('.icon i');
    const titleElement = messageContainer.querySelector('.title');
    const textElement = messageContainer.querySelector('.text');

    // Atualizar ícone
    iconElement.className = `fa-solid ${errorIcon}`;

    // Atualizar título e texto
    titleElement.textContent = errorTitle || '';
    titleElement.style.display = errorTitle ? '' : 'none';
    textElement.innerHTML = errorMessage ? parseLinks(errorMessage) : '';
    textElement.style.display = errorMessage ? '' : 'none';

    // Mostrar ou ocultar o contêiner de mensagem
    document.getElementById("article").style.display = 'none';
    messageContainer.style.display = (errorTitle || errorMessage) ? 'flex' : 'none';

}

function parseLinks(text) {
    // Converter markdown style links para HTML links
    return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (match, label, url) => {
        return `<a href="${url}" role="link" target="_blank">${label}</a>`;
    });
}




let _lastSrc = null;
function displayResult(params, site) {
    let src = chrome.i18n.getMessage('site') + "/chrome-ext.html?version=" + getExtensionVersion() + "&site=" + site;
    if (params) src += '&' + new URLSearchParams(params);

    if (!site) {
    	showMessage('unsupported_site');
	    return false;
    }
	if (!params) {
		showMessage('not_identified');
		return false;
	}


    if (src === _lastSrc) return false;
    _lastSrc = src;

	let article = document.getElementById("article");

    fetch(src)
        .then(response => {
            if (response.status === 200) {
                response.text().then(content => {
                	document.getElementById('message').style.display = 'none';
                    article.style.display = "block";
                    article.innerHTML = content;
                    setBadgeText(true);
                });
            } else if (response.status === 403) {
                showMessage('unsupported_version');
            } else if (response.status === 404) {
                showMessage('not_found');
            } else {
                showMessage('error');
            }
        })
        .catch(() => {
			_lastSrc = null;
			showMessage('error');
    	});
}

function searchTab(tabId) {

	_tabs[tabId] = true;
	_config = false;

	chrome.tabs.get(tabId, function(tab) {
		if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError.message);
			return;
		}

		if (!tab.url) return displayResult(false);

		let host = new URL(tab.url).host;

		if (host) for (var i = 0; i < config_data.length; i++) {
		    if (host.match(config_data[i].regexp)) {
		        _config = config_data[i];
		        break;
		    }
		}

		if (!_config) return displayResult(false);

		if (_config.blacklist instanceof Array) {
			if ((new RegExp("(?:" + _config.blacklist.join("|") + ")")).test(tab.url)) return displayResult(false, _config.site);
		}

		chrome.scripting.executeScript({ target: { tabId: tab.id }, func: _config.func }, results => {
			if (results?.length == 1) displayResult(results[0].result, _config.site);
		});

	});
}

function setBadgeText(on) {
	if (_lastTabId) chrome.action.setBadgeText({ text: on ? "1" : "", tabId: _lastTabId });
}

chrome.tabs.query({ currentWindow: true, active: true }, found => {
	_lastTabId = found[0].id;
	searchTab(_lastTabId);
});

chrome.tabs.onUpdated.addListener((tab, info) => {
	if (info.status === "complete" || info.title) {
		_tabs[tab] = false;
		if (!_lastTabId) _lastTabId = tab;
		if (_lastTabId === tab) searchTab(tab);
	}
});

chrome.tabs.onActivated.addListener(tab => {
	setBadgeText(false);
	_lastTabId = tab.tabId;
	if (!_tabs[_lastTabId]) searchTab(_lastTabId);
});

document.getElementById('closeButton').addEventListener('click', function() {
    window.close();
});

document.getElementById('logo-link').setAttribute('href', chrome.i18n.getMessage('site'));