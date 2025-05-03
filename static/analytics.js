// Better Analytics - Privacy-focused, cookieless analytics
(function() {
    // Get the script element and required site ID
    var script = document.currentScript || document.querySelector('script[src*="analytics.js"]');
    var siteId = script.getAttribute("data-site-id");
    
    if (!siteId) {
        return console.error("Better Analytics: data-site-id attribute missing");
    }

    function ping() {
        return fetch(
            "http://localhost:3001/ping",
            {
                method: "GET",
                cache: "default",
                mode: "cors",
                keepalive: false
            }
        )
            .then((res) => res.json())
            .catch((error) => console.error("Analytics ping failed:", error));
    }

    // Track current path for SPA navigation
    var currentPath = window.location.pathname;

    async function trackEvent() {
        const isUnique = await ping();

        var url = window.location.href;
        var referrer = document.referrer || null;
        var userAgent = navigator.userAgent;
        var screenResolution = window.screen.width + "x" + window.screen.height;
        
        // Generate visitor ID from browser fingerprint
        var visitorId = (function(fingerprint) {
            var hash = 0;
            for (var i = 0; i < fingerprint.length; i++) {
                var char = fingerprint.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        })(userAgent + screenResolution);

        // Send tracking data
        fetch("http://localhost:3001/track", {
            method: "POST",
            keepalive: true,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                site_id: siteId,
                url: url,
                referrer: referrer,
                user_agent: userAgent,
                screen_resolution: screenResolution,
                visitor_id: visitorId,
                timestamp: Math.floor(Date.now() / 1000)
            })
        }).catch(function(error) {
            console.error("Analytics tracking failed:", error);
        });
    }

    // Track initial page view
    trackEvent();

    // Track page visibility changes
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === "visible") {
            trackEvent();
        }
    });

    // Track SPA navigation
    if (window.history.pushState) {
        // Override pushState to track navigation
        var originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            if (currentPath !== window.location.pathname) {
                currentPath = window.location.pathname;
                trackEvent();
            }
        };

        // Track popstate (back/forward navigation)
        window.addEventListener("popstate", function() {
            if (currentPath !== window.location.pathname) {
                currentPath = window.location.pathname;
                trackEvent();
            }
        });
    }
})();