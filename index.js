module.exports = class {
    constructor(target, handler) {
        this._preproxy = new WeakMap();
        this._handler = handler;
        return this.proxify(target, []);
    }

    makeHandler(path) {
        let dp = this;
        return {
            set(target, key, value, receiver) {
                if (typeof value === "object")
                    value = dp.proxify(value, [...path, key]);

                target[key] = value;

                if (dp._handler.set)
                    dp._handler.set(target, [...path, key], value, receiver);

                return true;
            },

            deleteProperty(target, key) {
                if (Reflect.has(target, key)) {
                    dp.unproxy(target, key);
                    let deleted = Reflect.deleteProperty(target, key);
                    if (deleted && dp._handler.deleteProperty)
                        dp._handler.deleteProperty(target, [...path, key]);
                    return deleted;
                }
                return false;
            },
        };
    }

    unproxy(obj, key) {
        if (this._preproxy.has(obj[key])) {
            obj[key] = this._preproxy.get(obj[key]);
            this._preproxy.delete(obj[key]);
        }

        for (let k of Object.keys(obj[key]))
            if (typeof obj[key][k] === "object") this.unproxy(obj[key], k);
    }

    proxify(obj, path) {
        for (let key of Object.keys(obj))
            if (typeof obj[key] === "object")
                obj[key] = this.proxify(obj[key], [...path, key]);
        let p = new Proxy(obj, this.makeHandler(path));
        this._preproxy.set(p, obj);
        return p;
    }
}