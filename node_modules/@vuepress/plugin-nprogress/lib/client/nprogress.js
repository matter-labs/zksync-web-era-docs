/**
 * NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT
 */
export const nprogress = {
    settings: {
        minimum: 0.08,
        easing: 'ease',
        speed: 200,
        trickle: true,
        trickleRate: 0.02,
        trickleSpeed: 800,
        barSelector: '[role="bar"]',
        parent: 'body',
        template: '<div class="bar" role="bar"></div>',
    },
    status: null,
    set: (n) => {
        const started = nprogress.isStarted();
        n = clamp(n, nprogress.settings.minimum, 1);
        nprogress.status = n === 1 ? null : n;
        const progress = nprogress.render(!started);
        const bar = progress.querySelector(nprogress.settings.barSelector);
        const speed = nprogress.settings.speed;
        const ease = nprogress.settings.easing;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        progress.offsetWidth; /* Repaint */
        queue((next) => {
            // Add transition
            css(bar, {
                transform: 'translate3d(' + toBarPerc(n) + '%,0,0)',
                transition: 'all ' + speed + 'ms ' + ease,
            });
            if (n === 1) {
                // Fade out
                css(progress, {
                    transition: 'none',
                    opacity: '1',
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                progress.offsetWidth; /* Repaint */
                setTimeout(function () {
                    css(progress, {
                        transition: 'all ' + speed + 'ms linear',
                        opacity: '0',
                    });
                    setTimeout(function () {
                        nprogress.remove();
                        next();
                    }, speed);
                }, speed);
            }
            else {
                setTimeout(() => next(), speed);
            }
        });
        return nprogress;
    },
    isStarted: () => typeof nprogress.status === 'number',
    start: () => {
        if (!nprogress.status)
            nprogress.set(0);
        const work = () => {
            setTimeout(() => {
                if (!nprogress.status)
                    return;
                nprogress.trickle();
                work();
            }, nprogress.settings.trickleSpeed);
        };
        if (nprogress.settings.trickle)
            work();
        return nprogress;
    },
    done: (force) => {
        if (!force && !nprogress.status)
            return nprogress;
        return nprogress.inc(0.3 + 0.5 * Math.random()).set(1);
    },
    inc: (amount) => {
        let n = nprogress.status;
        if (!n) {
            return nprogress.start();
        }
        if (typeof amount !== 'number') {
            amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
        }
        n = clamp(n + amount, 0, 0.994);
        return nprogress.set(n);
    },
    trickle: () => nprogress.inc(Math.random() * nprogress.settings.trickleRate),
    render: (fromStart) => {
        if (nprogress.isRendered()) {
            return document.getElementById('nprogress');
        }
        addClass(document.documentElement, 'nprogress-busy');
        const progress = document.createElement('div');
        progress.id = 'nprogress';
        progress.innerHTML = nprogress.settings.template;
        const bar = progress.querySelector(nprogress.settings.barSelector);
        const perc = fromStart ? '-100' : toBarPerc(nprogress.status || 0);
        const parent = document.querySelector(nprogress.settings.parent);
        css(bar, {
            transition: 'all 0 linear',
            transform: 'translate3d(' + perc + '%,0,0)',
        });
        if (parent !== document.body) {
            addClass(parent, 'nprogress-custom-parent');
        }
        parent?.appendChild(progress);
        return progress;
    },
    remove: () => {
        removeClass(document.documentElement, 'nprogress-busy');
        removeClass(document.querySelector(nprogress.settings.parent), 'nprogress-custom-parent');
        const progress = document.getElementById('nprogress');
        progress && removeElement(progress);
    },
    isRendered: () => !!document.getElementById('nprogress'),
};
const clamp = (n, min, max) => {
    if (n < min)
        return min;
    if (n > max)
        return max;
    return n;
};
const toBarPerc = (n) => (-1 + n) * 100;
const queue = (function () {
    const pending = [];
    function next() {
        const fn = pending.shift();
        if (fn) {
            fn(next);
        }
    }
    return function (fn) {
        pending.push(fn);
        if (pending.length === 1)
            next();
    };
})();
const css = (function () {
    const cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'];
    const cssProps = {};
    function camelCase(string) {
        return string
            .replace(/^-ms-/, 'ms-')
            .replace(/-([\da-z])/gi, function (match, letter) {
            return letter.toUpperCase();
        });
    }
    function getVendorProp(name) {
        const style = document.body.style;
        if (name in style)
            return name;
        let i = cssPrefixes.length;
        const capName = name.charAt(0).toUpperCase() + name.slice(1);
        let vendorName;
        while (i--) {
            vendorName = cssPrefixes[i] + capName;
            if (vendorName in style)
                return vendorName;
        }
        return name;
    }
    function getStyleProp(name) {
        name = camelCase(name);
        return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }
    function applyCss(element, prop, value) {
        prop = getStyleProp(prop);
        element.style[prop] = value;
    }
    return function (element, properties) {
        for (const prop in properties) {
            const value = properties[prop];
            if (value !== undefined &&
                Object.prototype.hasOwnProperty.call(properties, prop))
                applyCss(element, prop, value);
        }
    };
})();
const hasClass = (element, name) => {
    const list = typeof element === 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
};
const addClass = (element, name) => {
    const oldList = classList(element);
    const newList = oldList + name;
    if (hasClass(oldList, name))
        return;
    element.className = newList.substring(1);
};
const removeClass = (element, name) => {
    const oldList = classList(element);
    if (!hasClass(element, name))
        return;
    const newList = oldList.replace(' ' + name + ' ', ' ');
    element.className = newList.substring(1, newList.length - 1);
};
const classList = (element) => {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
};
const removeElement = (element) => {
    element && element.parentNode && element.parentNode.removeChild(element);
};
