// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function t(n) {
    return typeof n == "function";
}
function e(o) {
    let r = o((t)=>{
        Error.call(t), t.stack = new Error().stack;
    });
    return r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r;
}
var p = e((i)=>function(r) {
        i(this), this.message = r ? `${r.length} errors occurred during unsubscription:
${r.map((n, s)=>`${s + 1}) ${n.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = r;
    });
function o(e, n) {
    if (e) {
        let i = e.indexOf(n);
        0 <= i && e.splice(i, 1);
    }
}
var e1 = class {
    constructor(i){
        this.initialTeardown = i, this.closed = !1, this._parentage = null, this._finalizers = null;
    }
    unsubscribe() {
        let i;
        if (!this.closed) {
            this.closed = !0;
            let { _parentage: s  } = this;
            if (s) if (this._parentage = null, Array.isArray(s)) for (let t1 of s)t1.remove(this);
            else s.remove(this);
            let { initialTeardown: c  } = this;
            if (t(c)) try {
                c();
            } catch (t11) {
                i = t11 instanceof p ? t11.errors : [
                    t11
                ];
            }
            let { _finalizers: f  } = this;
            if (f) {
                this._finalizers = null;
                for (let t2 of f)try {
                    h(t2);
                } catch (o) {
                    i = i ?? [], o instanceof p ? i = [
                        ...i,
                        ...o.errors
                    ] : i.push(o);
                }
            }
            if (i) throw new p(i);
        }
    }
    add(i) {
        var s;
        if (i && i !== this) if (this.closed) h(i);
        else {
            if (i instanceof e1) {
                if (i.closed || i._hasParent(this)) return;
                i._addParent(this);
            }
            (this._finalizers = (s = this._finalizers) !== null && s !== void 0 ? s : []).push(i);
        }
    }
    _hasParent(i) {
        let { _parentage: s  } = this;
        return s === i || Array.isArray(s) && s.includes(i);
    }
    _addParent(i) {
        let { _parentage: s  } = this;
        this._parentage = Array.isArray(s) ? (s.push(i), s) : s ? [
            s,
            i
        ] : i;
    }
    _removeParent(i) {
        let { _parentage: s  } = this;
        s === i ? this._parentage = null : Array.isArray(s) && o(s, i);
    }
    remove(i) {
        let { _finalizers: s  } = this;
        s && o(s, i), i instanceof e1 && i._removeParent(this);
    }
};
e1.EMPTY = (()=>{
    let r = new e1;
    return r.closed = !0, r;
})();
var p1 = e1.EMPTY;
function d(r) {
    return r instanceof e1 || r && "closed" in r && t(r.remove) && t(r.add) && t(r.unsubscribe);
}
function h(r) {
    t(r) ? r() : r.unsubscribe();
}
var e2 = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1
};
var u = {
    setTimeout (t, e, ...i) {
        let { delegate: o  } = u;
        return o?.setTimeout ? o.setTimeout(t, e, ...i) : setTimeout(t, e, ...i);
    },
    clearTimeout (t) {
        let { delegate: e  } = u;
        return (e?.clearTimeout || clearTimeout)(t);
    },
    delegate: void 0
};
function m(o) {
    u.setTimeout(()=>{
        let { onUnhandledError: r  } = e2;
        if (r) r(o);
        else throw o;
    });
}
function o1() {}
var o2 = (()=>e3("C", void 0, void 0))();
function r(n) {
    return e3("E", void 0, n);
}
function f(n) {
    return e3("N", n, void 0);
}
function e3(n, t, i) {
    return {
        kind: n,
        value: t,
        error: i
    };
}
var r1 = null;
function u1(o) {
    if (e2.useDeprecatedSynchronousErrorHandling) {
        let e = !r1;
        if (e && (r1 = {
            errorThrown: !1,
            error: null
        }), o(), e) {
            let { errorThrown: t , error: i  } = r1;
            if (r1 = null, t) throw i;
        }
    } else o();
}
function c(o) {
    e2.useDeprecatedSynchronousErrorHandling && r1 && (r1.errorThrown = !0, r1.error = o);
}
var l = class extends e1 {
    constructor(t){
        super(), this.isStopped = !1, t ? (this.destination = t, d(t) && t.add(this)) : this.destination = I;
    }
    static create(t, i, o) {
        return new u2(t, i, o);
    }
    next(t) {
        this.isStopped ? p2(f(t), this) : this._next(t);
    }
    error(t) {
        this.isStopped ? p2(r(t), this) : (this.isStopped = !0, this._error(t));
    }
    complete() {
        this.isStopped ? p2(o2, this) : (this.isStopped = !0, this._complete());
    }
    unsubscribe() {
        this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null);
    }
    _next(t) {
        this.destination.next(t);
    }
    _error(t) {
        try {
            this.destination.error(t);
        } finally{
            this.unsubscribe();
        }
    }
    _complete() {
        try {
            this.destination.complete();
        } finally{
            this.unsubscribe();
        }
    }
}, w = Function.prototype.bind;
function c1(e, t) {
    return w.call(e, t);
}
var d1 = class {
    constructor(t){
        this.partialObserver = t;
    }
    next(t) {
        let { partialObserver: i  } = this;
        if (i.next) try {
            i.next(t);
        } catch (o) {
            s(o);
        }
    }
    error(t) {
        let { partialObserver: i  } = this;
        if (i.error) try {
            i.error(t);
        } catch (o) {
            s(o);
        }
        else s(t);
    }
    complete() {
        let { partialObserver: t  } = this;
        if (t.complete) try {
            t.complete();
        } catch (i) {
            s(i);
        }
    }
}, u2 = class extends l {
    constructor(t1, i, o){
        super();
        let r;
        if (t(t1) || !t1) r = {
            next: t1 ?? void 0,
            error: i ?? void 0,
            complete: o ?? void 0
        };
        else {
            let n;
            this && e2.useDeprecatedNextContext ? (n = Object.create(t1), n.unsubscribe = ()=>this.unsubscribe(), r = {
                next: t1.next && c1(t1.next, n),
                error: t1.error && c1(t1.error, n),
                complete: t1.complete && c1(t1.complete, n)
            }) : r = t1;
        }
        this.destination = new d1(r);
    }
};
function s(e) {
    e2.useDeprecatedSynchronousErrorHandling ? c(e) : m(e);
}
function F(e) {
    throw e;
}
function p2(e, t) {
    let { onStoppedNotification: i  } = e2;
    i && u.setTimeout(()=>i(e, t));
}
var I = {
    closed: !0,
    next: o1,
    error: F,
    complete: o1
};
var o3 = (()=>typeof Symbol == "function" && Symbol.observable || "@@observable")();
function n(t) {
    return t;
}
function p3(r) {
    return r.length === 0 ? n : r.length === 1 ? r[0] : function(e) {
        return r.reduce((t, i)=>i(t), e);
    };
}
var o4 = class {
    constructor(r){
        r && (this._subscribe = r);
    }
    lift(r) {
        let t = new o4;
        return t.source = this, t.operator = r, t;
    }
    subscribe(r, t, n) {
        let s = w1(r) ? r : new u2(r, t, n);
        return u1(()=>{
            let { operator: e , source: c  } = this;
            s.add(e ? e.call(s, c) : c ? this._subscribe(s) : this._trySubscribe(s));
        }), s;
    }
    _trySubscribe(r) {
        try {
            return this._subscribe(r);
        } catch (t) {
            r.error(t);
        }
    }
    forEach(r, t) {
        return t = f1(t), new t((n, s)=>{
            let e = new u2({
                next: (c)=>{
                    try {
                        r(c);
                    } catch (m) {
                        s(m), e.unsubscribe();
                    }
                },
                error: s,
                complete: n
            });
            this.subscribe(e);
        });
    }
    _subscribe(r) {
        var t;
        return (t = this.source) === null || t === void 0 ? void 0 : t.subscribe(r);
    }
    [o3]() {
        return this;
    }
    pipe(...r) {
        return p3(r)(this);
    }
    toPromise(r) {
        return r = f1(r), new r((t, n)=>{
            let s;
            this.subscribe((e)=>s = e, (e)=>n(e), ()=>t(s));
        });
    }
};
o4.create = (i)=>new o4(i);
function f1(i) {
    var r;
    return (r = i ?? e2.Promise) !== null && r !== void 0 ? r : Promise;
}
function d2(i) {
    return i && t(i.next) && t(i.error) && t(i.complete);
}
function w1(i) {
    return i && i instanceof l || d2(i) && d(i);
}
function o5(t1) {
    return t(t1?.lift);
}
function l1(t) {
    return (r)=>{
        if (o5(r)) return r.lift(function(n) {
            try {
                return t(n, this);
            } catch (i) {
                this.error(i);
            }
        });
        throw new TypeError("Unable to lift unknown Observable type");
    };
}
function a(n, r, s, i, c) {
    return new u3(n, r, s, i, c);
}
var u3 = class extends l {
    constructor(r, s, i, c, h, o){
        super(r), this.onFinalize = h, this.shouldUnsubscribe = o, this._next = s ? function(e) {
            try {
                s(e);
            } catch (t) {
                r.error(t);
            }
        } : super._next, this._error = c ? function(e) {
            try {
                c(e);
            } catch (t) {
                r.error(t);
            } finally{
                this.unsubscribe();
            }
        } : super._error, this._complete = i ? function() {
            try {
                i();
            } catch (e) {
                r.error(e);
            } finally{
                this.unsubscribe();
            }
        } : super._complete;
    }
    unsubscribe() {
        var r;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let { closed: s  } = this;
            super.unsubscribe(), !s && ((r = this.onFinalize) === null || r === void 0 || r.call(this));
        }
    }
};
var e4 = {
    now () {
        return (e4.delegate || performance).now();
    },
    delegate: void 0
};
var t1 = {
    schedule (n) {
        let e = requestAnimationFrame, i = cancelAnimationFrame, { delegate: a  } = t1;
        a && (e = a.requestAnimationFrame, i = a.cancelAnimationFrame);
        let r = e((o)=>{
            i = void 0, n(o);
        });
        return new e1(()=>i?.(r));
    },
    requestAnimationFrame (...n) {
        let { delegate: e  } = t1;
        return (e?.requestAnimationFrame || requestAnimationFrame)(...n);
    },
    cancelAnimationFrame (...n) {
        let { delegate: e  } = t1;
        return (e?.cancelAnimationFrame || cancelAnimationFrame)(...n);
    },
    delegate: void 0
};
function m1(n) {
    return new o4((r)=>{
        let t = n || e4, c = t.now(), o = 0, e = ()=>{
            r.closed || (o = t1.requestAnimationFrame((s)=>{
                o = 0;
                let a = t.now();
                r.next({
                    timestamp: n ? a : s,
                    elapsed: a - c
                }), e();
            }));
        };
        return e(), ()=>{
            o && t1.cancelAnimationFrame(o);
        };
    });
}
m1();
var t2 = e((r)=>function() {
        r(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
    });
var i = class extends o4 {
    constructor(){
        super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null;
    }
    lift(r) {
        let e = new o6(this, this);
        return e.operator = r, e;
    }
    _throwIfClosed() {
        if (this.closed) throw new t2;
    }
    next(r) {
        u1(()=>{
            if (this._throwIfClosed(), !this.isStopped) {
                this.currentObservers || (this.currentObservers = Array.from(this.observers));
                for (let e of this.currentObservers)e.next(r);
            }
        });
    }
    error(r) {
        u1(()=>{
            if (this._throwIfClosed(), !this.isStopped) {
                this.hasError = this.isStopped = !0, this.thrownError = r;
                let { observers: e  } = this;
                for(; e.length;)e.shift().error(r);
            }
        });
    }
    complete() {
        u1(()=>{
            if (this._throwIfClosed(), !this.isStopped) {
                this.isStopped = !0;
                let { observers: r  } = this;
                for(; r.length;)r.shift().complete();
            }
        });
    }
    unsubscribe() {
        this.isStopped = this.closed = !0, this.observers = this.currentObservers = null;
    }
    get observed() {
        var r;
        return ((r = this.observers) === null || r === void 0 ? void 0 : r.length) > 0;
    }
    _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
    }
    _subscribe(r) {
        return this._throwIfClosed(), this._checkFinalizedStatuses(r), this._innerSubscribe(r);
    }
    _innerSubscribe(r) {
        let { hasError: e , isStopped: s , observers: t  } = this;
        return e || s ? p1 : (this.currentObservers = null, t.push(r), new e1(()=>{
            this.currentObservers = null, o(t, r);
        }));
    }
    _checkFinalizedStatuses(r) {
        let { hasError: e , thrownError: s , isStopped: t  } = this;
        e ? r.error(s) : t && r.complete();
    }
    asObservable() {
        let r = new o4;
        return r.source = this, r;
    }
};
i.create = (n, r)=>new o6(n, r);
var o6 = class extends i {
    constructor(r, e){
        super(), this.destination = r, this.source = e;
    }
    next(r) {
        var e, s;
        (s = (e = this.destination) === null || e === void 0 ? void 0 : e.next) === null || s === void 0 || s.call(e, r);
    }
    error(r) {
        var e, s;
        (s = (e = this.destination) === null || e === void 0 ? void 0 : e.error) === null || s === void 0 || s.call(e, r);
    }
    complete() {
        var r, e;
        (e = (r = this.destination) === null || r === void 0 ? void 0 : r.complete) === null || e === void 0 || e.call(r);
    }
    _subscribe(r) {
        var e, s;
        return (s = (e = this.source) === null || e === void 0 ? void 0 : e.subscribe(r)) !== null && s !== void 0 ? s : p1;
    }
};
var e5 = {
    now () {
        return (e5.delegate || Date).now();
    },
    delegate: void 0
};
var h1 = class extends i {
    constructor(i = 1 / 0, e = 1 / 0, t = e5){
        super(), this._bufferSize = i, this._windowTime = e, this._timestampProvider = t, this._buffer = [], this._infiniteTimeWindow = !0, this._infiniteTimeWindow = e === 1 / 0, this._bufferSize = Math.max(1, i), this._windowTime = Math.max(1, e);
    }
    next(i) {
        let { isStopped: e , _buffer: t , _infiniteTimeWindow: f , _timestampProvider: n , _windowTime: s  } = this;
        e || (t.push(i), !f && t.push(n.now() + s)), this._trimBuffer(), super.next(i);
    }
    _subscribe(i) {
        this._throwIfClosed(), this._trimBuffer();
        let e = this._innerSubscribe(i), { _infiniteTimeWindow: t , _buffer: f  } = this, n = f.slice();
        for(let s = 0; s < n.length && !i.closed; s += t ? 1 : 2)i.next(n[s]);
        return this._checkFinalizedStatuses(i), e;
    }
    _trimBuffer() {
        let { _bufferSize: i , _timestampProvider: e , _buffer: t , _infiniteTimeWindow: f  } = this, n = (f ? 1 : 2) * i;
        if (i < 1 / 0 && n < t.length && t.splice(0, t.length - n), !f) {
            let s = e.now(), r = 0;
            for(let o = 1; o < t.length && t[o] <= s; o += 2)r = o;
            r && t.splice(0, r + 1);
        }
    }
};
var e6 = class extends e1 {
    constructor(r, s){
        super();
    }
    schedule(r, s = 0) {
        return this;
    }
};
var n1 = {
    setInterval (t, e, ...l) {
        let { delegate: r  } = n1;
        return r?.setInterval ? r.setInterval(t, e, ...l) : setInterval(t, e, ...l);
    },
    clearInterval (t) {
        let { delegate: e  } = n1;
        return (e?.clearInterval || clearInterval)(t);
    },
    delegate: void 0
};
var l2 = class extends e6 {
    constructor(t, e){
        super(t, e), this.scheduler = t, this.work = e, this.pending = !1;
    }
    schedule(t, e = 0) {
        var s;
        if (this.closed) return this;
        this.state = t;
        let i = this.id, r = this.scheduler;
        return i != null && (this.id = this.recycleAsyncId(r, i, e)), this.pending = !0, this.delay = e, this.id = (s = this.id) !== null && s !== void 0 ? s : this.requestAsyncId(r, this.id, e), this;
    }
    requestAsyncId(t, e, s = 0) {
        return n1.setInterval(t.flush.bind(t, this), s);
    }
    recycleAsyncId(t, e, s = 0) {
        if (s != null && this.delay === s && this.pending === !1) return e;
        e != null && n1.clearInterval(e);
    }
    execute(t, e) {
        if (this.closed) return new Error("executing a cancelled action");
        this.pending = !1;
        let s = this._execute(t, e);
        if (s) return s;
        this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
    }
    _execute(t, e) {
        let s = !1, i;
        try {
            this.work(t);
        } catch (r) {
            s = !0, i = r || new Error("Scheduled action threw falsy error");
        }
        if (s) return this.unsubscribe(), i;
    }
    unsubscribe() {
        if (!this.closed) {
            let { id: t , scheduler: e  } = this, { actions: s  } = e;
            this.work = this.state = this.scheduler = null, this.pending = !1, o(s, this), t != null && (this.id = this.recycleAsyncId(e, t, null)), this.delay = null, super.unsubscribe();
        }
    }
};
var s1 = 1, r2, t3 = {};
function l3(e) {
    return e in t3 ? (delete t3[e], !0) : !1;
}
var o7 = {
    setImmediate (e) {
        let n = s1++;
        return t3[n] = !0, r2 || (r2 = Promise.resolve()), r2.then(()=>l3(n) && e()), n;
    },
    clearImmediate (e) {
        l3(e);
    }
};
var { setImmediate: i1 , clearImmediate: a1  } = o7, d3 = {
    setImmediate (...t) {
        let { delegate: e  } = d3;
        return (e?.setImmediate || i1)(...t);
    },
    clearImmediate (t) {
        let { delegate: e  } = d3;
        return (e?.clearImmediate || a1)(t);
    },
    delegate: void 0
};
var u4 = class extends l2 {
    constructor(n, t){
        super(n, t), this.scheduler = n, this.work = t;
    }
    requestAsyncId(n, t, e = 0) {
        return e !== null && e > 0 ? super.requestAsyncId(n, t, e) : (n.actions.push(this), n._scheduled || (n._scheduled = d3.setImmediate(n.flush.bind(n, void 0))));
    }
    recycleAsyncId(n, t, e = 0) {
        var i;
        if (e != null ? e > 0 : this.delay > 0) return super.recycleAsyncId(n, t, e);
        let { actions: r  } = n;
        t != null && ((i = r[r.length - 1]) === null || i === void 0 ? void 0 : i.id) !== t && (d3.clearImmediate(t), n._scheduled = void 0);
    }
};
var t4 = class {
    constructor(o, s = t4.now){
        this.schedulerActionCtor = o, this.now = s;
    }
    schedule(o, s = 0, r) {
        return new this.schedulerActionCtor(this, o).schedule(r, s);
    }
};
t4.now = e5.now;
var r3 = class extends t4 {
    constructor(e, s = t4.now){
        super(e, s), this.actions = [], this._active = !1;
    }
    flush(e) {
        let { actions: s  } = this;
        if (this._active) {
            s.push(e);
            return;
        }
        let t;
        this._active = !0;
        do if (t = e.execute(e.state, e.delay)) break;
        while (e = s.shift())
        if (this._active = !1, t) {
            for(; e = s.shift();)e.unsubscribe();
            throw t;
        }
    }
};
var d4 = class extends r3 {
    flush(e) {
        this._active = !0;
        let t = this._scheduled;
        this._scheduled = void 0;
        let { actions: s  } = this, h;
        e = e || s.shift();
        do if (h = e.execute(e.state, e.delay)) break;
        while ((e = s[0]) && e.id === t && s.shift())
        if (this._active = !1, h) {
            for(; (e = s[0]) && e.id === t && s.shift();)e.unsubscribe();
            throw h;
        }
    }
};
new d4(u4);
new r3(l2);
var r4 = class extends l2 {
    constructor(t, s){
        super(t, s), this.scheduler = t, this.work = s;
    }
    schedule(t, s = 0) {
        return s > 0 ? super.schedule(t, s) : (this.delay = s, this.state = t, this.scheduler.flush(this), this);
    }
    execute(t, s) {
        return s > 0 || this.closed ? super.execute(t, s) : this._execute(t, s);
    }
    requestAsyncId(t, s, e = 0) {
        return e != null && e > 0 || e == null && this.delay > 0 ? super.requestAsyncId(t, s, e) : (t.flush(this), 0);
    }
};
var s2 = class extends r3 {
};
new s2(r4);
var u5 = class extends l2 {
    constructor(n, t){
        super(n, t), this.scheduler = n, this.work = t;
    }
    requestAsyncId(n, t, e = 0) {
        return e !== null && e > 0 ? super.requestAsyncId(n, t, e) : (n.actions.push(this), n._scheduled || (n._scheduled = t1.requestAnimationFrame(()=>n.flush(void 0))));
    }
    recycleAsyncId(n, t, e = 0) {
        var r;
        if (e != null ? e > 0 : this.delay > 0) return super.recycleAsyncId(n, t, e);
        let { actions: s  } = n;
        t != null && ((r = s[s.length - 1]) === null || r === void 0 ? void 0 : r.id) !== t && (t1.cancelAnimationFrame(t), n._scheduled = void 0);
    }
};
var t5 = class extends r3 {
    flush(e) {
        this._active = !0;
        let d = this._scheduled;
        this._scheduled = void 0;
        let { actions: s  } = this, h;
        e = e || s.shift();
        do if (h = e.execute(e.state, e.delay)) break;
        while ((e = s[0]) && e.id === d && s.shift())
        if (this._active = !1, h) {
            for(; (e = s[0]) && e.id === d && s.shift();)e.unsubscribe();
            throw h;
        }
    }
};
new t5(u5);
var n2 = class extends r3 {
    constructor(e = r5, t = 1 / 0){
        super(e, ()=>this.frame), this.maxFrames = t, this.frame = 0, this.index = -1;
    }
    flush() {
        let { actions: e , maxFrames: t  } = this, s, i;
        for(; (i = e[0]) && i.delay <= t && (e.shift(), this.frame = i.delay, !(s = i.execute(i.state, i.delay))););
        if (s) {
            for(; i = e.shift();)i.unsubscribe();
            throw s;
        }
    }
};
n2.frameTimeFactor = 10;
var r5 = class extends l2 {
    constructor(e, t, s = e.index += 1){
        super(e, t), this.scheduler = e, this.work = t, this.index = s, this.active = !0, this.index = e.index = s;
    }
    schedule(e, t = 0) {
        if (Number.isFinite(t)) {
            if (!this.id) return super.schedule(e, t);
            this.active = !1;
            let s = new r5(this.scheduler, this.work);
            return this.add(s), s.schedule(e, t);
        } else return e1.EMPTY;
    }
    requestAsyncId(e, t, s = 0) {
        this.delay = e.frame + s;
        let { actions: i  } = e;
        return i.push(this), i.sort(r5.sortActions), 1;
    }
    recycleAsyncId(e, t, s = 0) {}
    _execute(e, t) {
        if (this.active === !0) return super._execute(e, t);
    }
    static sortActions(e, t) {
        return e.delay === t.delay ? e.index === t.index ? 0 : e.index > t.index ? 1 : -1 : e.delay > t.delay ? 1 : -1;
    }
};
var o8 = new o4((e)=>e.complete());
function n3(r) {
    return r && t(r.schedule);
}
function n4(e) {
    return e[e.length - 1];
}
function f2(e) {
    return n3(n4(e)) ? e.pop() : void 0;
}
function c2(e, o) {
    return typeof n4(e) == "number" ? e.pop() : o;
}
var b = function(t, e) {
    return b = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(r, n) {
        r.__proto__ = n;
    } || function(r, n) {
        for(var a in n)Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
    }, b(t, e);
};
var w2 = function() {
    return w2 = Object.assign || function(e) {
        for(var r, n = 1, a = arguments.length; n < a; n++){
            r = arguments[n];
            for(var o in r)Object.prototype.hasOwnProperty.call(r, o) && (e[o] = r[o]);
        }
        return e;
    }, w2.apply(this, arguments);
};
function T(t, e, r, n) {
    function a(o) {
        return o instanceof r ? o : new r(function(i) {
            i(o);
        });
    }
    return new (r || (r = Promise))(function(o, i) {
        function f(l) {
            try {
                u(n.next(l));
            } catch (y) {
                i(y);
            }
        }
        function s(l) {
            try {
                u(n.throw(l));
            } catch (y) {
                i(y);
            }
        }
        function u(l) {
            l.done ? o(l.value) : a(l.value).then(f, s);
        }
        u((n = n.apply(t, e || [])).next());
    });
}
Object.create ? function(t, e, r, n) {
    n === void 0 && (n = r);
    var a = Object.getOwnPropertyDescriptor(e, r);
    (!a || ("get" in a ? !e.__esModule : a.writable || a.configurable)) && (a = {
        enumerable: !0,
        get: function() {
            return e[r];
        }
    }), Object.defineProperty(t, n, a);
} : function(t, e, r, n) {
    n === void 0 && (n = r), t[n] = e[r];
};
function d5(t) {
    var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], n = 0;
    if (r) return r.call(t);
    if (t && typeof t.length == "number") return {
        next: function() {
            return t && n >= t.length && (t = void 0), {
                value: t && t[n++],
                done: !t
            };
        }
    };
    throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function h2(t) {
    return this instanceof h2 ? (this.v = t, this) : new h2(t);
}
function M(t, e, r) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var n = r.apply(t, e || []), a, o = [];
    return a = {}, i("next"), i("throw"), i("return"), a[Symbol.asyncIterator] = function() {
        return this;
    }, a;
    function i(c) {
        n[c] && (a[c] = function(p) {
            return new Promise(function(_, x) {
                o.push([
                    c,
                    p,
                    _,
                    x
                ]) > 1 || f(c, p);
            });
        });
    }
    function f(c, p) {
        try {
            s(n[c](p));
        } catch (_) {
            y(o[0][3], _);
        }
    }
    function s(c) {
        c.value instanceof h2 ? Promise.resolve(c.value.v).then(u, l) : y(o[0][2], c);
    }
    function u(c) {
        f("next", c);
    }
    function l(c) {
        f("throw", c);
    }
    function y(c, p) {
        c(p), o.shift(), o.length && f(o[0][0], o[0][1]);
    }
}
function G(t) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var e = t[Symbol.asyncIterator], r;
    return e ? e.call(t) : (t = typeof d5 == "function" ? d5(t) : t[Symbol.iterator](), r = {}, n("next"), n("throw"), n("return"), r[Symbol.asyncIterator] = function() {
        return this;
    }, r);
    function n(o) {
        r[o] = t[o] && function(i) {
            return new Promise(function(f, s) {
                i = t[o](i), a(f, s, i.done, i.value);
            });
        };
    }
    function a(o, i, f, s) {
        Promise.resolve(s).then(function(u) {
            o({
                value: u,
                done: f
            });
        }, i);
    }
}
Object.create ? function(t, e) {
    Object.defineProperty(t, "default", {
        enumerable: !0,
        value: e
    });
} : function(t, e) {
    t.default = e;
};
var t6 = (e)=>e && typeof e.length == "number" && typeof e != "function";
function r6(i) {
    return t(i?.then);
}
function i2(o) {
    return t(o[o3]);
}
function o9(r) {
    return Symbol.asyncIterator && t(r?.[Symbol.asyncIterator]);
}
function r7(e) {
    return new TypeError(`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
}
function t7() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
}
var r8 = t7();
function m2(o) {
    return t(o?.[r8]);
}
function c3(e) {
    return M(this, arguments, function*() {
        let t = e.getReader();
        try {
            for(;;){
                let { value: a , done: i  } = yield h2(t.read());
                if (i) return yield h2(void 0);
                yield yield h2(a);
            }
        } finally{
            t.releaseLock();
        }
    });
}
function s3(e) {
    return t(e?.getReader);
}
function B(r) {
    if (r instanceof o4) return r;
    if (r != null) {
        if (i2(r)) return I1(r);
        if (t6(r)) return k(r);
        if (r6(r)) return A(r);
        if (o9(r)) return m3(r);
        if (m2(r)) return L(r);
        if (s3(r)) return S(r);
    }
    throw r7(r);
}
function I1(r) {
    return new o4((e)=>{
        let o = r[o3]();
        if (t(o.subscribe)) return o.subscribe(e);
        throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
}
function k(r) {
    return new o4((e)=>{
        for(let o = 0; o < r.length && !e.closed; o++)e.next(r[o]);
        e.complete();
    });
}
function A(r) {
    return new o4((e)=>{
        r.then((o)=>{
            e.closed || (e.next(o), e.complete());
        }, (o)=>e.error(o)).then(null, m);
    });
}
function L(r) {
    return new o4((e)=>{
        for (let o of r)if (e.next(o), e.closed) return;
        e.complete();
    });
}
function m3(r) {
    return new o4((e)=>{
        O(r, e).catch((o)=>e.error(o));
    });
}
function S(r) {
    return m3(c3(r));
}
function O(r, e) {
    var o, n, f, a;
    return T(this, void 0, void 0, function*() {
        try {
            for(o = G(r); n = yield o.next(), !n.done;){
                let l = n.value;
                if (e.next(l), e.closed) return;
            }
        } catch (l1) {
            f = {
                error: l1
            };
        } finally{
            try {
                n && !n.done && (a = o.return) && (yield a.call(o));
            } finally{
                if (f) throw f.error;
            }
        }
        e.complete();
    });
}
function l4(e, d, i, u = 0, s = !1) {
    let c = d.schedule(function() {
        i(), s ? e.add(this.schedule(null, u)) : this.unsubscribe();
    }, u);
    if (e.add(c), !s) return c;
}
function a2(t, e = 0) {
    return l1((r, o)=>{
        r.subscribe(a(o, (m)=>l4(o, t, ()=>o.next(m), e), ()=>l4(o, t, ()=>o.complete(), e), (m)=>l4(o, t, ()=>o.error(m), e)));
    });
}
function c4(r, o = 0) {
    return l1((t, e)=>{
        e.add(r.schedule(()=>t.subscribe(e), o));
    });
}
function b1(o, r) {
    return B(o).pipe(c4(r), a2(r));
}
function f3(o, r) {
    return B(o).pipe(c4(r), a2(r));
}
function c5(t, n) {
    return new o4((e)=>{
        let l = 0;
        return n.schedule(function() {
            l === t.length ? e.complete() : (e.next(t[l++]), e.closed || this.schedule());
        });
    });
}
function c6(m, r) {
    return new o4((t1)=>{
        let e;
        return l4(t1, r, ()=>{
            e = m[r8](), l4(t1, r, ()=>{
                let o, n;
                try {
                    ({ value: o , done: n  } = e.next());
                } catch (i) {
                    t1.error(i);
                    return;
                }
                n ? t1.complete() : t1.next(o);
            }, 0, !0);
        }), ()=>t(e?.return) && e.return();
    });
}
function f4(t, o) {
    if (!t) throw new Error("Iterable cannot be null");
    return new o4((e)=>{
        l4(e, o, ()=>{
            let l = t[Symbol.asyncIterator]();
            l4(e, o, ()=>{
                l.next().then((n)=>{
                    n.done ? e.complete() : e.next(n.value);
                });
            }, 0, !0);
        });
    });
}
function n5(e, r) {
    return f4(c3(e), r);
}
function T1(r, e) {
    if (r != null) {
        if (i2(r)) return b1(r, e);
        if (t6(r)) return c5(r, e);
        if (r6(r)) return f3(r, e);
        if (o9(r)) return f4(r, e);
        if (m2(r)) return c6(r, e);
        if (s3(r)) return n5(r, e);
    }
    throw r7(r);
}
function e7(r, o) {
    return o ? T1(r, o) : B(r);
}
function p4(...o) {
    let r = f2(o);
    return e7(o, r);
}
function p5(n, o) {
    let e = t(n) ? n : ()=>n, i = (t)=>t.error(e());
    return new o4(o ? (t)=>o.schedule(i, 0, t) : i);
}
var c7;
(function(e) {
    e.NEXT = "N", e.ERROR = "E", e.COMPLETE = "C";
})(c7 || (c7 = {}));
var n6 = class {
    constructor(t, o, i){
        this.kind = t, this.value = o, this.error = i, this.hasValue = t === "N";
    }
    observe(t) {
        return E(this, t);
    }
    do(t, o, i) {
        let { kind: r , value: l , error: u  } = this;
        return r === "N" ? t?.(l) : r === "E" ? o?.(u) : i?.();
    }
    accept(t1, o, i) {
        var r;
        return t((r = t1) === null || r === void 0 ? void 0 : r.next) ? this.observe(t1) : this.do(t1, o, i);
    }
    toObservable() {
        let { kind: t , value: o , error: i  } = this, r = t === "N" ? p4(o) : t === "E" ? p5(()=>i) : t === "C" ? o8 : 0;
        if (!r) throw new TypeError(`Unexpected notification kind ${t}`);
        return r;
    }
    static createNext(t) {
        return new n6("N", t);
    }
    static createError(t) {
        return new n6("E", void 0, t);
    }
    static createComplete() {
        return n6.completeNotification;
    }
};
n6.completeNotification = new n6("C");
function E(e, t) {
    var o, i, r;
    let { kind: l , value: u , error: s  } = e;
    if (typeof l != "string") throw new TypeError('Invalid notification, missing "kind"');
    l === "N" ? (o = t.next) === null || o === void 0 || o.call(t, u) : l === "E" ? (i = t.error) === null || i === void 0 || i.call(t, s) : (r = t.complete) === null || r === void 0 || r.call(t);
}
function s4(r) {
    return !!r && (r instanceof o4 || t(r.lift) && t(r.subscribe));
}
e((r)=>function() {
        r(this), this.name = "EmptyError", this.message = "no elements in sequence";
    });
e((r)=>function() {
        r(this), this.name = "ArgumentOutOfRangeError", this.message = "argument out of range";
    });
e((r)=>function(o) {
        r(this), this.name = "NotFoundError", this.message = o;
    });
e((r)=>function(e) {
        r(this), this.name = "SequenceError", this.message = e;
    });
e((e)=>function(t = null) {
        e(this), this.message = "Timeout has occurred", this.name = "TimeoutError", this.info = t;
    });
function f5(e, t) {
    return l1((o, r)=>{
        let p = 0;
        o.subscribe(a(r, (a)=>{
            r.next(e.call(t, a, p++));
        }));
    });
}
var { isArray: o10  } = Array;
var { isArray: o11  } = Array, { getPrototypeOf: s5 , prototype: y , keys: c8  } = Object;
function S1(v, t, x, c, m, p, h, r) {
    let l = [], o = 0, C = 0, i = !1, s = ()=>{
        i && !l.length && !o && t.complete();
    }, u = (f)=>o < c ? n(f) : l.push(f), n = (f)=>{
        p && t.next(f), o++;
        let d = !1;
        B(x(f, C++)).subscribe(a(t, (e)=>{
            m?.(e), p ? u(e) : t.next(e);
        }, ()=>{
            d = !0;
        }, void 0, ()=>{
            if (d) try {
                for(o--; l.length && o < c;){
                    let e = l.shift();
                    h ? l4(t, h, ()=>n(e)) : n(e);
                }
                s();
            } catch (e1) {
                t.error(e1);
            }
        }));
    };
    return v.subscribe(a(t, u, ()=>{
        i = !0, s();
    })), ()=>{
        r?.();
    };
}
function F1(o, m, f = 1 / 0) {
    return t(m) ? F1((i, r)=>f5((n, p)=>m(i, n, r, p))(B(o(i, r))), f) : (typeof m == "number" && (f = m), l1((i, r)=>S1(i, r, o, f)));
}
function n7(r = 1 / 0) {
    return F1(n, r);
}
function t8() {
    return n7(1);
}
function n8(...o) {
    return t8()(e7(o, f2(o)));
}
function g(...o) {
    let e = f2(o), m = c2(o, 1 / 0), r = o;
    return r.length ? r.length === 1 ? B(r[0]) : n7(m)(e7(r, e)) : o8;
}
new o4(o1);
var { isArray: n9  } = Array;
function a3(t, o) {
    return l1((i, r)=>{
        let n = 0;
        i.subscribe(a(r, (e)=>t.call(o, e, n++) && r.next(e)));
    });
}
function x(e) {
    return e <= 0 ? ()=>o8 : l1((o, r)=>{
        let t = 0;
        o.subscribe(a(r, (m)=>{
            ++t <= e && (r.next(m), e <= t && r.complete());
        }));
    });
}
function b2(e, t = n) {
    return e = e ?? p6, l1((o, i)=>{
        let n, r = !0;
        o.subscribe(a(i, (f)=>{
            let u = t(f);
            (r || !e(n, u)) && (r = !1, n = u, i.next(f));
        }));
    });
}
function p6(e, t) {
    return e === t;
}
function m4(...o) {
    return (r)=>n8(r, p4(...o));
}
function U(s = {}) {
    let { connector: r = ()=>new i , resetOnError: m = !0 , resetOnComplete: u = !0 , resetOnRefCountZero: h = !0  } = s;
    return (x)=>{
        let t, e, n, c = 0, i = !1, l = !1, f = ()=>{
            e?.unsubscribe(), e = void 0;
        }, a = ()=>{
            f(), t = n = void 0, i = l = !1;
        }, S = ()=>{
            let o = t;
            a(), o?.unsubscribe();
        };
        return l1((o, v)=>{
            c++, !l && !i && f();
            let b = n = n ?? r();
            v.add(()=>{
                c--, c === 0 && !l && !i && (e = p7(S, h));
            }), b.subscribe(v), !t && c > 0 && (t = new u2({
                next: (d)=>b.next(d),
                error: (d)=>{
                    l = !0, f(), e = p7(a, m, d), b.error(d);
                },
                complete: ()=>{
                    i = !0, f(), e = p7(a, u), b.complete();
                }
            }), B(o).subscribe(t));
        })(x);
    };
}
function p7(s, r, ...m) {
    if (r === !0) {
        s();
        return;
    }
    if (r === !1) return;
    let u = new u2({
        next: ()=>{
            u.unsubscribe(), s();
        }
    });
    return r(...m).subscribe(u);
}
function l5(i) {
    return l1((n, o)=>{
        let t = !1, r = a(o, ()=>{
            r?.unsubscribe(), t = !0;
        }, o1);
        B(i).subscribe(r), n.subscribe(a(o, (p)=>t && o.next(p)));
    });
}
function l6(r) {
    return l1((t, o)=>{
        B(r).subscribe(a(o, ()=>o.complete(), o1)), !o.closed && t.subscribe(o);
    });
}
function x1(t1, v, e) {
    let l = t(t1) || v || e ? {
        next: t1,
        error: v,
        complete: e
    } : t1;
    return l ? l1((d, a1)=>{
        var n;
        (n = l.subscribe) === null || n === void 0 || n.call(l);
        let r = !0;
        d.subscribe(a(a1, (i)=>{
            var o;
            (o = l.next) === null || o === void 0 || o.call(l, i), a1.next(i);
        }, ()=>{
            var i;
            r = !1, (i = l.complete) === null || i === void 0 || i.call(l), a1.complete();
        }, (i)=>{
            var o;
            r = !1, (o = l.error) === null || o === void 0 || o.call(l, i), a1.error(i);
        }, ()=>{
            var i, o;
            r && ((i = l.unsubscribe) === null || i === void 0 || i.call(l)), (o = l.finalize) === null || o === void 0 || o.call(l);
        }));
    }) : n;
}
const omit = (obj, keys)=>{
    const newObj = {
        ...obj
    };
    keys.forEach((key)=>delete newObj[key]);
    return newObj;
};
const hasOnlyKeys = (obj, allowed)=>Object.keys(omit(obj, allowed)).length === 0;
const isCommand = (command)=>typeof command === "function";
const isEvent = (event)=>!!(event.type && hasOnlyKeys(event, [
        "type",
        "payload",
        "error",
        "meta"
    ]) && (event.error === undefined || typeof event.error === "boolean") && (event.meta === undefined || typeof event.meta === "object"));
const isValidEvent = (event)=>!!event && (isCommand(event) || isEvent(event));
const isPromise = (value)=>Promise.resolve(value) === value;
const asObservable = (obj)=>{
    if (isPromise(obj) || Array.isArray(obj)) {
        return e7(obj);
    }
    return !s4(obj) ? p4(obj) : obj;
};
const commandMiddleware = ({ addEffect , getProjectionValue , dispatch  })=>(eventOrCommand)=>{
        if (!isCommand(eventOrCommand)) {
            return p4(eventOrCommand);
        }
        try {
            asObservable(eventOrCommand({
                addEffect,
                getProjectionValue
            })).subscribe(dispatch);
        } catch (error) {
            return p5(()=>error);
        }
        return o8;
    };
const empty = {};
const createEventBuilder = (type, payloadBuilder = n, metaBuilder = null)=>{
    const eventBuilder = (args = empty)=>{
        const event = {
            type
        };
        let payload;
        let meta;
        try {
            payload = payloadBuilder(args);
        } catch (error) {
            payload = error;
            event.error = true;
        }
        if (metaBuilder) {
            try {
                meta = metaBuilder(args);
            } catch (error1) {
                payload = error1;
                event.error = true;
            }
        }
        if (payload !== empty) {
            event.payload = payload;
        }
        if (meta) {
            event.meta = meta;
        }
        if (payload instanceof Error) {
            event.error = true;
        }
        return event;
    };
    eventBuilder.toString = ()=>type;
    return eventBuilder;
};
const chain = (...funcs)=>funcs.reduce((acc, func)=>(...args)=>{
            func(...args);
            acc(...args);
        }, o1);
const pipe = (...fn)=>fn.slice(1).reduce((acc, fn)=>(...args)=>fn(acc(...args)), fn[0] || n);
const simpleUnsub = (subscription)=>()=>subscription && subscription.unsubscribe ? subscription.unsubscribe() : subscription && subscription();
const propEquals = (propname)=>(value)=>(obj)=>obj[propname] === value;
const payloadEquals = propEquals("payload");
const variableFunction = (initialBehaviour = o1)=>{
    let behaviour = initialBehaviour;
    const setup = (func)=>{
        behaviour = func;
    };
    return {
        func: (...args)=>behaviour(...args),
        setup
    };
};
const createBroadcastSubject = ()=>{
    const eventsEntry = new i();
    const feedbacksEntry = new i();
    const broadcastSubject = i.create(eventsEntry, feedbacksEntry);
    const addTarget = (target)=>{
        const targetSubscription = eventsEntry.subscribe(typeof target !== "function" ? target : {
            next: target,
            error: o1,
            complete: o1
        });
        if (target instanceof o4) {
            const targetFeedbackSubscription = target.subscribe((payload)=>feedbacksEntry.next(payload), (error)=>feedbacksEntry.error(error));
            return ()=>{
                targetSubscription.unsubscribe();
                targetFeedbackSubscription.unsubscribe();
            };
        }
        return ()=>targetSubscription.unsubscribe();
    };
    return {
        broadcastSubject,
        addTarget
    };
};
const createExtensibleObservable = ()=>{
    let sources = [];
    let sourceManagers = [];
    const addSource = (source)=>{
        sources.push(source);
        sourceManagers.forEach(({ add  })=>add(source));
        return ()=>{
            sources = sources.filter((registered)=>registered !== source);
            sourceManagers.forEach(({ remove  })=>remove(source));
        };
    };
    const observable = new o4((observer)=>{
        if (!sources.length) {
            observer.complete();
            return o1;
        }
        const subject = new i();
        let subscriptions = [];
        let subscriptionDone = false;
        const remove = (source)=>{
            subscriptions = subscriptions.filter(({ source: subscribedSource , subscription: sourceSubscription  })=>{
                if (subscribedSource !== source) {
                    return true;
                }
                sourceSubscription.unsubscribe();
                return false;
            });
            if (subscriptionDone && subscriptions.length === 0) {
                subject.complete();
            }
        };
        const add = (source)=>{
            subscriptions.push({
                source,
                subscription: source.subscribe((event)=>subject.next(event), (error)=>subject.error(error), ()=>remove(source))
            });
        };
        const sourceManager = {
            add,
            remove
        };
        const subscription = subject.subscribe(observer);
        const unsubscribe = ()=>{
            subscription.unsubscribe();
            subscriptions.forEach(({ subscription: sourceSubscription  })=>sourceSubscription.unsubscribe());
            sourceManagers = sourceManagers.filter((registered)=>registered !== sourceManager);
        };
        sourceManagers.push(sourceManager);
        sources.forEach(add);
        subscriptionDone = true;
        if (subscriptions.length === 0) {
            subject.complete();
        }
        return unsubscribe;
    });
    return {
        observable,
        add: addSource
    };
};
const createExtensibleOperator = ()=>{
    let operators = [];
    let updators = [];
    const operator = (source)=>new o4((observer)=>{
            const inputSubject = new i();
            let observerSubscription;
            const updateOperators = ()=>{
                if (observerSubscription) {
                    observerSubscription.unsubscribe();
                }
                observerSubscription = inputSubject.pipe(...operators).subscribe({
                    next: (arg)=>observer.next(arg),
                    error: (error)=>observer.error(error),
                    complete: ()=>observer.complete()
                });
            };
            updateOperators();
            updators.push(updateOperators);
            const sourceSubscription = source.subscribe({
                next: (arg)=>inputSubject.next(arg),
                error: (error)=>inputSubject.error(error),
                complete: ()=>inputSubject.complete()
            });
            return ()=>{
                updators = updators.filter((updator)=>updator !== updateOperators);
                sourceSubscription.unsubscribe();
                observerSubscription.unsubscribe();
            };
        });
    const add = (...newOperatorsList)=>{
        operators.push(...newOperatorsList);
        updators.forEach((updator)=>updator());
        return ()=>{
            operators = operators.filter((operator)=>!newOperatorsList.includes(operator));
            updators.forEach((updator)=>updator());
        };
    };
    return {
        operator,
        add
    };
};
const uniqSymbol = ()=>Symbol("uniqSymbol" + Math.random().toString(36).substring(2, 15));
const preventEventLoops = (secretKey = uniqSymbol())=>(event)=>{
        if (event.meta && event.meta[secretKey]) {
            throw new Error("Event coming back to source detected");
        }
        return {
            ...event,
            meta: Object.defineProperty({
                ...event.meta
            }, secretKey, {
                configurable: false,
                enumerable: true,
                writable: false,
                value: true
            })
        };
    };
const hrToMs = (hr)=>hr[0] * 1e3 + hr[1] / 1e6;
const hasPerformance = typeof window !== "undefined" && typeof performance !== "undefined";
const hasHr = typeof process !== "undefined" && !!process.hrtime;
const dateRef = hasPerformance && (performance.timeOrigin || performance.timing && performance.timing.navigationStart) || +new Date();
const timeDeltaRef = hasHr && process.hrtime();
const getTimestamp = hasPerformance && (()=>dateRef + performance.now()) || hasHr && (()=>dateRef + hrToMs(process.hrtime(timeDeltaRef))) || (()=>+new Date());
const stampEvent = (event)=>event && event.meta && event.meta.timestamp ? event : {
        ...event,
        meta: {
            timestamp: getTimestamp(),
            ...event.meta
        }
    };
const throwFalsy = (validator, error)=>(arg)=>{
        if (!validator(arg)) {
            throw error;
        }
    };
const lossless = (source)=>{
    const buffer = [];
    let error;
    let completed = false;
    let bufferSubscription;
    let subscriptionsCount = 0;
    const bufferize = ()=>{
        bufferSubscription = source.subscribe((event)=>buffer.push(event), (err)=>{
            error = err;
        }, ()=>{
            completed = true;
        });
    };
    bufferize();
    return new o4((observer)=>{
        let subscription;
        if (error) {
            observer.error(error);
        } else if (completed) {
            observer.complete();
        } else {
            subscription = source.subscribe(observer);
            subscriptionsCount += 1;
        }
        if (bufferSubscription) {
            const eventsToReplay = buffer.slice();
            bufferSubscription.unsubscribe();
            bufferSubscription = undefined;
            buffer.length = 0;
            error = undefined;
            completed = false;
            eventsToReplay.forEach((event)=>observer.next(event));
        }
        return ()=>{
            if (!subscription) {
                return;
            }
            subscription.unsubscribe();
            subscription = undefined;
            subscriptionsCount -= 1;
            if (subscriptionsCount === 0) {
                bufferize();
            }
        };
    });
};
const createEventSubject = (pastSource = o8, logObserver = o1, eventEnhancer = n, pastEventEnhancer = n, eventMiddleware = (event)=>p4(event))=>{
    let newevent$;
    const neweventSubject = newevent$ = new i();
    if (logObserver && logObserver instanceof i) {
        newevent$ = g(neweventSubject, logObserver);
    }
    const startoverNewevent$ = newevent$.pipe(lossless, F1(eventMiddleware), x1(throwFalsy(isValidEvent, new TypeError("Invalid event"))), f5(preventEventLoops()), f5(stampEvent), eventEnhancer, x1(logObserver));
    const event$ = n8(pastSource.pipe(f5(stampEvent), pastEventEnhancer), startoverNewevent$);
    return i.create(neweventSubject, event$);
};
const FIRST_EVENT_TYPE = "All past events have been read";
const buildFirstEvent = ()=>({
        type: FIRST_EVENT_TYPE,
        payload: {}
    });
const createExtensibleEventMiddleware = ()=>{
    const { operator , add  } = createExtensibleOperator();
    return {
        eventMiddleware: (event)=>p4(event).pipe(operator),
        addEventMiddleware: (middleware)=>add(F1(middleware))
    };
};
const createExtensibleEventSubject = ()=>{
    const { broadcastSubject: logger , addTarget: addLogger  } = createBroadcastSubject();
    const { operator: eventEnhancer , add: addEventEnhancer  } = createExtensibleOperator();
    const { operator: pastEventEnhancer , add: addPastEventEnhancer  } = createExtensibleOperator();
    const { eventMiddleware , addEventMiddleware  } = createExtensibleEventMiddleware();
    const { observable: pastSource , add: addPastSource  } = createExtensibleObservable();
    const addAnyAsPastSource = (source)=>addPastSource(e7(source));
    const { func: fusableAddPastSource , setup: changeFusableAddPastSource  } = variableFunction(addAnyAsPastSource);
    const disableAddPastSource = ()=>changeFusableAddPastSource(()=>{
            throw new Error("addSource must be called before all sources completed");
        });
    const firstEvent = buildFirstEvent();
    const isFirstEvent = payloadEquals(firstEvent.payload);
    const eventSubject = createEventSubject(pastSource.pipe(m4(firstEvent)), logger, eventEnhancer, pastEventEnhancer, eventMiddleware);
    return {
        eventSubject,
        addLogger,
        addEventEnhancer,
        addPastEventEnhancer,
        addEventMiddleware,
        addSource: fusableAddPastSource,
        disableAddSource: disableAddPastSource,
        isFirstEvent
    };
};
const parseStoreArgs = (initialOptions, ...rest)=>{
    let options = initialOptions || {};
    let effects;
    if (typeof options === "function") {
        effects = [
            options,
            ...rest
        ];
        options = {};
    } else if (options.effects && Array.isArray(options.effects)) {
        effects = [
            ...options.effects,
            ...rest
        ];
    } else {
        effects = rest;
    }
    return {
        ...options,
        effects
    };
};
const withSimpleStoreSignature = (callback)=>pipe(parseStoreArgs, callback);
const createSubsetGetter = (index, getNotYetIndexed)=>(indexed, key, rest)=>{
        let subset = indexed.subset;
        if (!subset) {
            subset = createIndex((...args)=>getNotYetIndexed(key, ...args));
            index.set(key, {
                ...indexed,
                subset
            });
        }
        return subset.get(...rest);
    };
const createValueGetter = (index, getNotYetIndexed, getSubset = createSubsetGetter(index, getNotYetIndexed))=>(key, ...rest)=>{
        const indexed = index.get(key) || {};
        if (rest.length) {
            return getSubset(indexed, key, rest);
        }
        if (indexed.loading) {
            throw new Error("Cycle index referencing is not possible");
        }
        if ("value" in indexed) {
            return indexed.value;
        }
        indexed.loading = true;
        const value = getNotYetIndexed(key);
        index.set(key, {
            ...indexed,
            value,
            loading: false
        });
        return value;
    };
const createIndex = (getNotYetIndexed)=>{
    let index = new Map();
    const get = createValueGetter(index, getNotYetIndexed);
    const list = ()=>[
            ...index
        ].reduce((list, [key, { subset , value  }])=>[
                ...list,
                ...value ? [
                    [
                        [
                            key
                        ],
                        value
                    ]
                ] : [],
                ...subset ? subset.list().map(([subkey, value])=>[
                        [].concat(key, subkey),
                        value
                    ]) : []
            ], []);
    const flush = (key, ...rest)=>{
        if (rest.length) {
            const indexed = index.get(key);
            if (indexed && indexed.subset) {
                indexed.subset.flush(...rest);
            }
            return;
        }
        index = new Map([
            ...index
        ].filter(([itemKey])=>itemKey !== key));
    };
    return {
        get,
        list,
        flush
    };
};
const setValueGetter = (obj, getter)=>{
    obj.getValue = getter;
    Object.defineProperty(obj, "value", {
        configurable: false,
        enumerable: true,
        get: getter
    });
    return obj;
};
const useState = (initialState)=>{
    let state = initialState;
    return {
        getState: ()=>state,
        setState: (newState)=>state = newState
    };
};
const countSubscriptions = (callback)=>(source)=>{
        const { getState , setState  } = useState(0);
        const up = ()=>callback(setState(getState() + 1));
        const down = ()=>callback(setState(getState() - 1));
        return new o4((observer)=>{
            up();
            const unsub = simpleUnsub(source.subscribe(observer));
            return ()=>{
                down();
                unsub();
            };
        });
    };
const isError = (executionResult)=>"error" in executionResult;
const protectExecution = (executable)=>(...args)=>{
        try {
            return {
                result: executable(...args)
            };
        } catch (error) {
            return {
                error
            };
        }
    };
const getUniqKeyName = (obj, name)=>{
    if (!name) {
        return getUniqKeyName(obj, "unnamed");
    }
    if (name in obj) {
        const match = name.match(/^(.*)-(\d+)$/);
        const count = match && parseInt(match[2], 10) || 1;
        const basename = match && match[1] || name;
        return getUniqKeyName(obj, `${basename}-${count + 1}`);
    }
    return name;
};
const objectFrom = (arr)=>arr.reduce((acc, [key, value])=>({
            ...acc,
            [getUniqKeyName(acc, key)]: value
        }), {});
const setName = (settings)=>(name)=>{
        settings.name = name;
    };
const sourceEvent = {};
const useEvent = (settings)=>(...eventTypes)=>{
        if (settings.eventTypes !== undefined) {
            throw new Error("useEvent should not be called more than once in an projection definition setup");
        }
        settings.allEvents = !eventTypes.length;
        settings.eventTypes = eventTypes.map((eventType)=>eventType.toString());
        settings.sources.push(sourceEvent);
    };
const useProjection = (settings)=>(projection, refreshOnNewValue = true)=>{
        if (!refreshOnNewValue) {
            settings.skipIndexes.push(settings.sources.length);
        }
        settings.sources.push(projection);
    };
const sourceState = {};
const useState1 = (settings)=>(initialValue)=>{
        if (settings.stateIndex !== undefined) {
            throw new Error("useState should be used only once in an projection definition setup");
        }
        settings.initialState = initialValue;
        settings.stateIndex = settings.sources.length;
        settings.sources.push(sourceState);
    };
const useValue = (settings)=>(value)=>settings.sources.push({
            value
        });
const throwUnexpectedScope = (funcName)=>()=>{
        throw new Error(`Unexpected out-of-scope usage of function ${funcName}`);
    };
const createInputsGetter = (initialInputs, stateFlows, stateIndex, allEvents, eventTypes, skipIndexes)=>{
    const processInputs = (currentState, event)=>stateFlows.map((stateFlow, idx)=>idx === stateIndex ? currentState : stateFlow.getNextValue(event));
    if (allEvents) {
        return processInputs;
    }
    if (eventTypes) {
        return (state, event)=>{
            const inputs = processInputs(state, event);
            if (!eventTypes.includes(event.type)) {
                return;
            }
            return inputs;
        };
    }
    let lastInputs = initialInputs;
    return (state, event)=>{
        const inputs = processInputs(state, event);
        const anyChange = inputs.some((value, idx)=>idx !== stateIndex && !skipIndexes.includes(idx) && value !== lastInputs[idx]);
        lastInputs = inputs;
        return anyChange ? inputs : undefined;
    };
};
const getPostTreatmentData = (settings)=>(name, projectionBehavior, getStateFlow)=>{
        if (typeof projectionBehavior !== "function") {
            throw new TypeError("Given projection is not working");
        }
        const finalName = settings.name || name;
        const finalProjectionBehavior = (...args)=>{
            try {
                return projectionBehavior(...args);
            } catch (error) {
                error.message = `Projection "${finalName}" execution error: ${error.message}`;
                throw error;
            }
        };
        const stateFlows = settings.sources.map((source)=>{
            if (source === sourceState) {
                return {
                    getValue: o1,
                    getNextValue: o1
                };
            }
            if (source === sourceEvent) {
                return {
                    getValue: o1,
                    getNextValue: n
                };
            }
            if (typeof source === "function") {
                return getStateFlow(source);
            }
            if (Array.isArray(source)) {
                return getStateFlow(...source);
            }
            const getValue = ()=>source.value;
            return {
                getValue,
                getNextValue: getValue
            };
        });
        const initialInputs = !settings.eventTypes && stateFlows.map(({ getValue  })=>getValue());
        const initialState = settings.initialState !== undefined ? settings.initialState : !settings.eventTypes ? finalProjectionBehavior(...initialInputs) : undefined;
        const getInputs = createInputsGetter(initialInputs, stateFlows, settings.stateIndex, settings.allEvents, settings.eventTypes, settings.skipIndexes);
        const stateless = settings.stateIndex === undefined && !settings.eventTypes;
        return {
            name: finalName,
            isNullSetup: settings.sources.length === 0,
            initialState,
            getInputs,
            stateless,
            finalProjectionBehavior
        };
    };
const createProjectionSetupAPI = ()=>{
    const settings = {
        allEvents: false,
        eventTypes: undefined,
        sources: [],
        stateIndex: undefined,
        initialState: undefined,
        skipIndexes: [],
        name: undefined
    };
    const setupAPIRaw = Object.entries({
        useState: useState1(settings),
        useEvent: useEvent(settings),
        useProjection: useProjection(settings),
        useValue: useValue(settings),
        setName: setName(settings)
    }).map(([key, value])=>[
            key,
            variableFunction(value)
        ]);
    const setupAPI = objectFrom(setupAPIRaw.map(([key, { func  }])=>[
            key,
            func
        ]));
    const preventOutOfScopeUsage = chain(...setupAPIRaw.map(([key, { setup  }])=>()=>setup(throwUnexpectedScope(key))));
    return {
        setupAPI,
        preventOutOfScopeUsage,
        getPostTreatmentData: getPostTreatmentData(settings)
    };
};
const compileProjection = (projection, getStateFlow)=>{
    if (typeof projection !== "function") {
        throw new TypeError("Projection must be a function");
    }
    const { setupAPI , preventOutOfScopeUsage , getPostTreatmentData  } = createProjectionSetupAPI();
    const executionResult = protectExecution(projection)(setupAPI);
    if (isError(executionResult)) {
        executionResult.error.message = `Projection setup error: ${executionResult.error.message}`;
        throw executionResult.error;
    }
    const projectionBehavior = executionResult.result;
    preventOutOfScopeUsage();
    const { name , initialState , getInputs , stateless , finalProjectionBehavior  } = getPostTreatmentData(projection.name, projectionBehavior, getStateFlow);
    const reducer = (lastState, event)=>{
        const inputs = getInputs(lastState, event);
        if (!inputs) {
            return lastState;
        }
        return finalProjectionBehavior(...inputs);
    };
    Object.defineProperty(reducer, "name", {
        value: name,
        writable: false
    });
    Object.defineProperty(reducer, "stateless", {
        value: stateless,
        writable: false
    });
    return {
        initialState,
        reducer
    };
};
const createReducedState = (reducer, value, event, error)=>{
    if (typeof reducer !== "function") {
        throw new TypeError("reducer must be a function");
    }
    const getNextState = (nextEvent)=>{
        if (!nextEvent) {
            throw new Error("Needs an event to get a new state");
        }
        if (error) {
            return reducedState;
        }
        if (nextEvent === event) {
            return reducedState;
        }
        try {
            return createReducedState(reducer, reducer(value, nextEvent), nextEvent);
        } catch (error1) {
            return createReducedState(reducer, value, nextEvent, error1);
        }
    };
    const reducedState = {
        name: reducer.name,
        stateless: !!reducer.stateless,
        getNextState,
        value,
        ...error && {
            error
        }
    };
    return reducedState;
};
const getReducedStateValue = (reducedState)=>{
    if (reducedState.error) {
        throw reducedState.error;
    }
    return reducedState.value;
};
const createReducedStateChain = (initialReducedState)=>{
    const { getState , setState  } = useState(initialReducedState);
    const getValue = ()=>getReducedStateValue(getState());
    const getNextState = (event)=>getState().getNextState(event);
    const getNextValue = (event)=>getReducedStateValue(setState(getNextState(event)));
    return {
        initialReducedState,
        getValue,
        getNextValue,
        getNextState,
        setState
    };
};
const createSnapshotReducer = (getStatFlowList)=>{
    const snapshotReducer = ()=>objectFrom(getStatFlowList().filter((stateFlow)=>!stateFlow.stateless).map((stateFlow)=>[
                stateFlow.name,
                stateFlow.getValue()
            ]));
    Object.defineProperty(snapshotReducer, "name", {
        value: "snapshot",
        writable: false
    });
    Object.defineProperty(snapshotReducer, "stateless", {
        value: true,
        writable: false
    });
    return snapshotReducer;
};
const createStateFlow = (event$, skipUntil$, getStateFlow, getStateFlowList)=>(...args)=>{
        let reducer;
        let initialState;
        if (args[0] === "snapshot") {
            reducer = createSnapshotReducer(getStateFlowList);
        } else if (args[0] === "reducer") {
            [, reducer, initialState] = args;
        } else {
            const [projection] = args;
            ({ reducer , initialState  } = compileProjection(projection, getStateFlow));
        }
        const { getValue , getNextValue , getNextState , setState  } = createReducedStateChain(createReducedState(reducer, initialState));
        const state$ = event$.pipe(f5(getNextState), x1(setState), l5(skipUntil$), f5(getReducedStateValue), b2());
        let connectionCount = 0;
        const connectionState$ = state$.pipe(countSubscriptions((count)=>connectionCount = count));
        state$.connect = !reducer.stateless ? ()=>simpleUnsub(connectionState$.subscribe()) : ()=>o1;
        setValueGetter(state$, getValue);
        return {
            name: reducer.name,
            getValue,
            getNextValue,
            state$,
            stateless: !!reducer.stateless,
            isConnected: ()=>connectionCount > 0
        };
    };
const createStateFlowFactory = (event$, skipUntil$, createStateFlow1 = createStateFlow)=>{
    const getStateFlow = (...args)=>factory.get(...args);
    const getStateFlowList = ()=>factory.list().filter(([[projection]])=>projection !== "snapshot").map(([, stateFlow])=>stateFlow);
    const factory = createIndex(createStateFlow1(event$, skipUntil$, getStateFlow, getStateFlowList));
    return (...args)=>factory.get(...args).state$;
};
const createStore = pipe(parseStoreArgs, (options)=>{
    const { eventSubject , addLogger , addEventEnhancer , addPastEventEnhancer , addEventMiddleware , addSource , disableAddSource , isFirstEvent  } = createExtensibleEventSubject();
    const addAllEventsEnhancer = (enhancer)=>{
        const removePastEventEnhancer = addPastEventEnhancer(enhancer);
        const removeEventEnhancer = addEventEnhancer(enhancer);
        return ()=>{
            removePastEventEnhancer();
            removeEventEnhancer();
        };
    };
    if (options.eventEnhancer) {
        addAllEventsEnhancer(options.eventEnhancer);
    }
    const handleError = options.errorHandler || ((error)=>{
        throw error;
    });
    const eventCaster = new i();
    const eventCatcher = new i();
    const initDone$ = eventCaster.pipe(a3(isFirstEvent), x(1), U({
        connector: ()=>new h1(1),
        resetOnRefCountZero: false,
        resetOnComplete: false,
        resetOnError: true
    }));
    const pastEvent$ = eventCaster.pipe(l6(initDone$));
    const event$ = eventCaster.pipe(l5(initDone$));
    const projectionsEvent$ = eventCaster.pipe(U({
        connector: ()=>new h1(1),
        resetOnRefCountZero: false,
        resetOnComplete: true,
        resetOnError: true
    }));
    const stateFlowFactoryBuilder = options.stateFlowFactoryBuilder || createStateFlowFactory;
    const withProjection = stateFlowFactoryBuilder(projectionsEvent$, initDone$);
    let dispatch = ()=>{
        throw new Error("Dispatch while constructing your middleware is not allowed. " + "Other middleware would not be applied to this dispatch.");
    };
    const effectAPI = {
        addEffect: (effect)=>simpleUnsub(effect({
                ...effectAPI
            })),
        addSource,
        addLogger,
        addEventEnhancer,
        addPastEventEnhancer,
        addAllEventsEnhancer,
        pastEvent$,
        event$,
        dispatch: (event)=>dispatch(event),
        withProjection
    };
    const middlewareAPI = {
        addEffect: effectAPI.addEffect,
        getProjectionValue: (projection)=>effectAPI.withProjection(projection).getValue(),
        dispatch: effectAPI.dispatch
    };
    const middlewaresList = (options.middlewares || [
        commandMiddleware
    ]).map((middleware)=>middleware(middlewareAPI));
    const removeEventMiddlewares = addEventMiddleware(...middlewaresList);
    dispatch = eventCatcher.next.bind(eventCatcher);
    const initDoneSubscription = initDone$.subscribe(disableAddSource);
    const eventCatcherSubscription = eventCatcher.subscribe(eventSubject);
    const removeEffects = chain(...options.effects.map(effectAPI.addEffect));
    const eventCasterSubscription = eventSubject.subscribe((value)=>eventCaster.next(value), (error)=>{
        destroyStore();
        handleError(error);
    }, ()=>destroyStore());
    const destroyStore = chain(simpleUnsub(initDoneSubscription), simpleUnsub(eventCatcherSubscription), simpleUnsub(eventCasterSubscription), ()=>eventCaster.complete(), removeEventMiddlewares, removeEffects);
    return {
        destroyStore,
        addEffect: effectAPI.addEffect
    };
});
export { commandMiddleware as commandMiddleware };
export { createEventBuilder as createEventBuilder };
export { createStore as createStore };
export { FIRST_EVENT_TYPE as FIRST_EVENT_TYPE };
export { parseStoreArgs as parseStoreArgs, withSimpleStoreSignature as withSimpleStoreSignature };
export { createStateFlow as createStateFlow };
export { createStateFlowFactory as createStateFlowFactory };
