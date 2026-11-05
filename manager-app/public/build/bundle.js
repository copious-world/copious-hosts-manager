
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space$1() {
        return text$1(' ');
    }
    function empty$1() {
        return text$1('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
    function is_void(name) {
        return void_element_names.test(name) || name.toLowerCase() === '!doctype';
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function validate_dynamic_element(tag) {
        const is_string = typeof tag === 'string';
        if (tag && !is_string) {
            throw new Error('<svelte:element> expects "this" attribute to be a string.');
        }
    }
    function validate_void_dynamic_element(tag) {
        if (tag && is_void(tag)) {
            throw new Error(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$3 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$4 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$1 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded_ = false;
            _this.activationTimer_ = 0;
            _this.fgDeactivationRemovalTimer_ = 0;
            _this.fgScale_ = '0';
            _this.frame_ = { width: 0, height: 0 };
            _this.initialSize_ = 0;
            _this.layoutFrame_ = 0;
            _this.maxRadius_ = 0;
            _this.unboundedCoords_ = { left: 0, top: 0 };
            _this.activationState_ = _this.defaultActivationState_();
            _this.activationTimerCallback_ = function () {
                _this.activationAnimationHasEnded_ = true;
                _this.runDeactivationUXLogicIfReady_();
            };
            _this.activateHandler_ = function (e) { return _this.activate_(e); };
            _this.deactivateHandler_ = function () { return _this.deactivate_(); };
            _this.focusHandler_ = function () { return _this.handleFocus(); };
            _this.blurHandler_ = function () { return _this.handleBlur(); };
            _this.resizeHandler_ = function () { return _this.layout(); };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$4;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple_();
            this.registerRootHandlers_(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal_();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple_()) {
                if (this.activationTimer_) {
                    clearTimeout(this.activationTimer_);
                    this.activationTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer_) {
                    clearTimeout(this.fgDeactivationRemovalTimer_);
                    this.fgDeactivationRemovalTimer_ = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars_();
                });
            }
            this.deregisterRootHandlers_();
            this.deregisterDeactivationHandlers_();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activate_(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivate_();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame_) {
                cancelAnimationFrame(this.layoutFrame_);
            }
            this.layoutFrame_ = requestAnimationFrame(function () {
                _this.layoutInternal_();
                _this.layoutFrame_ = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple_ = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState_ = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers_ = function (supportsPressRipple) {
            var _this = this;
            if (supportsPressRipple) {
                ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerInteractionHandler(evtType, _this.activateHandler_);
                });
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler_);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler_);
            this.adapter.registerInteractionHandler('blur', this.blurHandler_);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers_ = function (evt) {
            var _this = this;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler_);
            }
            else {
                POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                    _this.adapter.registerDocumentInteractionHandler(evtType, _this.deactivateHandler_);
                });
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers_ = function () {
            var _this = this;
            ACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterInteractionHandler(evtType, _this.activateHandler_);
            });
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler_);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler_);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler_);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers_ = function () {
            var _this = this;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler_);
            POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {
                _this.adapter.deregisterDocumentInteractionHandler(evtType, _this.deactivateHandler_);
            });
        };
        MDCRippleFoundation.prototype.removeCssVars_ = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activate_ = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState_;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent_;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState_();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers_(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation_();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive_(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation_();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState_ = _this.defaultActivationState_();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive_ = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation_ = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal_();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates_(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer_);
            clearTimeout(this.fgDeactivationRemovalTimer_);
            this.rmBoundedActivationClasses_();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer_ = setTimeout(function () { return _this.activationTimerCallback_(); }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates_ = function () {
            var _a = this.activationState_, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame_.width / 2,
                    y: this.frame_.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize_ / 2),
                y: startPoint.y - (this.initialSize_ / 2),
            };
            var endPoint = {
                x: (this.frame_.width / 2) - (this.initialSize_ / 2),
                y: (this.frame_.height / 2) - (this.initialSize_ / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady_ = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState_, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded_) {
                this.rmBoundedActivationClasses_();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer_ = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$1.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses_ = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded_ = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState_ = function () {
            var _this = this;
            this.previousActivationEvent_ = this.activationState_.activationEvent;
            this.activationState_ = this.defaultActivationState_();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent_ = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivate_ = function () {
            var _this = this;
            var activationState = this.activationState_;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () { return _this.animateDeactivation_(state); });
                this.resetActivationState_();
            }
            else {
                this.deregisterDeactivationHandlers_();
                requestAnimationFrame(function () {
                    _this.activationState_.hasDeactivationUXRun = true;
                    _this.animateDeactivation_(state);
                    _this.resetActivationState_();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation_ = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady_();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal_ = function () {
            var _this = this;
            this.frame_ = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame_.height, this.frame_.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame_.width, 2) + Math.pow(_this.frame_.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius_ = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize_ = initialSize - 1;
            }
            else {
                this.initialSize_ = initialSize;
            }
            this.fgScale_ = "" + this.maxRadius_ / this.initialSize_;
            this.updateLayoutCssVars_();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars_ = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize_ + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale_);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords_ = {
                    left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
                    top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords_.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords_.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$2 = {
        ACTIVE: 'mdc-tab-indicator--active',
        FADE: 'mdc-tab-indicator--fade',
        NO_TRANSITION: 'mdc-tab-indicator--no-transition',
    };
    var strings$3 = {
        CONTENT_SELECTOR: '.mdc-tab-indicator__content',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCTabIndicatorFoundation, _super);
        function MDCTabIndicatorFoundation(adapter) {
            return _super.call(this, __assign(__assign({}, MDCTabIndicatorFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCTabIndicatorFoundation, "cssClasses", {
            get: function () {
                return cssClasses$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabIndicatorFoundation, "strings", {
            get: function () {
                return strings$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabIndicatorFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    computeContentClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    setContentStyleProperty: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabIndicatorFoundation.prototype.computeContentClientRect = function () {
            return this.adapter.computeContentClientRect();
        };
        return MDCTabIndicatorFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /* istanbul ignore next: subclass is not a branch statement */
    var MDCFadingTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCFadingTabIndicatorFoundation, _super);
        function MDCFadingTabIndicatorFoundation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCFadingTabIndicatorFoundation.prototype.activate = function () {
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        MDCFadingTabIndicatorFoundation.prototype.deactivate = function () {
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        return MDCFadingTabIndicatorFoundation;
    }(MDCTabIndicatorFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /* istanbul ignore next: subclass is not a branch statement */
    var MDCSlidingTabIndicatorFoundation = /** @class */ (function (_super) {
        __extends(MDCSlidingTabIndicatorFoundation, _super);
        function MDCSlidingTabIndicatorFoundation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCSlidingTabIndicatorFoundation.prototype.activate = function (previousIndicatorClientRect) {
            // Early exit if no indicator is present to handle cases where an indicator
            // may be activated without a prior indicator state
            if (!previousIndicatorClientRect) {
                this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
                return;
            }
            // This animation uses the FLIP approach. You can read more about it at the link below:
            // https://aerotwist.com/blog/flip-your-animations/
            // Calculate the dimensions based on the dimensions of the previous indicator
            var currentClientRect = this.computeContentClientRect();
            var widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
            var xPosition = previousIndicatorClientRect.left - currentClientRect.left;
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
            this.adapter.setContentStyleProperty('transform', "translateX(" + xPosition + "px) scaleX(" + widthDelta + ")");
            // Force repaint before updating classes and transform to ensure the transform properly takes effect
            this.computeContentClientRect();
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.NO_TRANSITION);
            this.adapter.addClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
            this.adapter.setContentStyleProperty('transform', '');
        };
        MDCSlidingTabIndicatorFoundation.prototype.deactivate = function () {
            this.adapter.removeClass(MDCTabIndicatorFoundation.cssClasses.ACTIVE);
        };
        return MDCSlidingTabIndicatorFoundation;
    }(MDCTabIndicatorFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        ACTIVE: 'mdc-tab--active',
    };
    var strings$2 = {
        ARIA_SELECTED: 'aria-selected',
        CONTENT_SELECTOR: '.mdc-tab__content',
        INTERACTED_EVENT: 'MDCTab:interacted',
        RIPPLE_SELECTOR: '.mdc-tab__ripple',
        TABINDEX: 'tabIndex',
        TAB_INDICATOR_SELECTOR: '.mdc-tab-indicator',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabFoundation = /** @class */ (function (_super) {
        __extends(MDCTabFoundation, _super);
        function MDCTabFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabFoundation.defaultAdapter), adapter)) || this;
            _this.focusOnActivate_ = true;
            return _this;
        }
        Object.defineProperty(MDCTabFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    hasClass: function () { return false; },
                    setAttr: function () { return undefined; },
                    activateIndicator: function () { return undefined; },
                    deactivateIndicator: function () { return undefined; },
                    notifyInteracted: function () { return undefined; },
                    getOffsetLeft: function () { return 0; },
                    getOffsetWidth: function () { return 0; },
                    getContentOffsetLeft: function () { return 0; },
                    getContentOffsetWidth: function () { return 0; },
                    focus: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabFoundation.prototype.handleClick = function () {
            // It's up to the parent component to keep track of the active Tab and
            // ensure we don't activate a Tab that's already active.
            this.adapter.notifyInteracted();
        };
        MDCTabFoundation.prototype.isActive = function () {
            return this.adapter.hasClass(cssClasses$1.ACTIVE);
        };
        /**
         * Sets whether the tab should focus itself when activated
         */
        MDCTabFoundation.prototype.setFocusOnActivate = function (focusOnActivate) {
            this.focusOnActivate_ = focusOnActivate;
        };
        /**
         * Activates the Tab
         */
        MDCTabFoundation.prototype.activate = function (previousIndicatorClientRect) {
            this.adapter.addClass(cssClasses$1.ACTIVE);
            this.adapter.setAttr(strings$2.ARIA_SELECTED, 'true');
            this.adapter.setAttr(strings$2.TABINDEX, '0');
            this.adapter.activateIndicator(previousIndicatorClientRect);
            if (this.focusOnActivate_) {
                this.adapter.focus();
            }
        };
        /**
         * Deactivates the Tab
         */
        MDCTabFoundation.prototype.deactivate = function () {
            // Early exit
            if (!this.isActive()) {
                return;
            }
            this.adapter.removeClass(cssClasses$1.ACTIVE);
            this.adapter.setAttr(strings$2.ARIA_SELECTED, 'false');
            this.adapter.setAttr(strings$2.TABINDEX, '-1');
            this.adapter.deactivateIndicator();
        };
        /**
         * Returns the dimensions of the Tab
         */
        MDCTabFoundation.prototype.computeDimensions = function () {
            var rootWidth = this.adapter.getOffsetWidth();
            var rootLeft = this.adapter.getOffsetLeft();
            var contentWidth = this.adapter.getContentOffsetWidth();
            var contentLeft = this.adapter.getContentOffsetLeft();
            return {
                contentLeft: rootLeft + contentLeft,
                contentRight: rootLeft + contentLeft + contentWidth,
                rootLeft: rootLeft,
                rootRight: rootLeft + rootWidth,
            };
        };
        return MDCTabFoundation;
    }(MDCFoundation));

    // Match modifiers on DOM events.
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match modifiers on other events.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;

    function forwardEventsBuilder(component) {
      // This is our pseudo $on function. It is defined on component mount.
      let $on;
      // This is a list of events bound before mount.
      let events = [];
      // This is the original component $on function.
      const componentOn = component.$on;

      // And we override the $on function to forward all bound events.
      component.$on = (fullEventType, ...args) => {
        let eventType = fullEventType;
        let destructor = () => {};
        if ($on) {
          // The event was bound programmatically.
          destructor = $on(eventType);
        } else {
          // The event was bound before mount by Svelte.
          events.push(eventType);
        }
        const oldModifierMatch = eventType.match(oldModifierRegex);
        const newModifierMatch = eventType.match(newModifierRegex);
        const modifierMatch = oldModifierMatch || newModifierMatch;

        if (oldModifierMatch && console) {
          console.warn(
            'Event modifiers in SMUI now use "$" instead of ":", so that all events can be bound with modifiers. Please update your event binding: ',
            eventType
          );
        }

        if (modifierMatch) {
          // Remove modifiers from the real event.
          const parts = eventType.split(oldModifierMatch ? ':' : '$');
          eventType = parts[0];
        }

        // Call the original $on function.
        const componentDestructor = componentOn.call(component, eventType, ...args);

        return (...args) => {
          destructor();
          return componentDestructor(...args);
        };
      };

      function forward(e) {
        // Internally bubble the event up from Svelte components.
        bubble(component, e);
      }

      return (node) => {
        const destructors = [];

        // This function is responsible for forwarding all bound events.
        $on = (fullEventType) => {
          let eventType = fullEventType;
          let handler = forward;
          // DOM addEventListener options argument.
          let options = false;
          const oldModifierMatch = eventType.match(oldModifierRegex);
          const newModifierMatch = eventType.match(newModifierRegex);
          const modifierMatch = oldModifierMatch || newModifierMatch;
          if (modifierMatch) {
            // Parse the event modifiers.
            // Supported modifiers:
            // - preventDefault
            // - stopPropagation
            // - passive
            // - nonpassive
            // - capture
            // - once
            const parts = eventType.split(oldModifierMatch ? ':' : '$');
            eventType = parts[0];
            options = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
            if (options.nonpassive) {
              options.passive = false;
              delete options.nonpassive;
            }
            if (options.preventDefault) {
              handler = prevent_default(handler);
              delete options.preventDefault;
            }
            if (options.stopPropagation) {
              handler = stop_propagation(handler);
              delete options.stopPropagation;
            }
          }

          const off = listen(node, eventType, handler, options);
          const destructor = () => {
            off();
            const idx = destructors.indexOf(destructor);
            if (idx > -1) {
              destructors.splice(idx, 1);
            }
          };

          destructors.push(destructor);
          return destructor;
        };

        for (let i = 0; i < events.length; i++) {
          // Listen to all the events added before mount.
          $on(events[i]);
        }

        return {
          destroy: () => {
            // Remove all event listeners.
            for (let i = 0; i < destructors.length; i++) {
              destructors[i]();
            }
          },
        };
      };
    }

    function classMap(classObj) {
      return Object.entries(classObj)
        .filter(([name, value]) => name !== '' && value)
        .map(([name]) => name)
        .join(' ');
    }

    function dispatch(
      element,
      eventType,
      detail = {},
      eventInit = { bubbles: true }
    ) {
      if (typeof Event !== 'undefined' && element) {
        const event = new Event(eventType, eventInit);
        event.detail = detail;
        const el = 'getElement' in element ? element.getElement() : element;
        el.dispatchEvent(event);
        return event;
      }
    }

    function exclude(obj, keys) {
      let names = Object.getOwnPropertyNames(obj);
      const newObj = {};

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const cashIndex = name.indexOf('$');
        if (
          cashIndex !== -1 &&
          keys.indexOf(name.substring(0, cashIndex + 1)) !== -1
        ) {
          continue;
        }
        if (keys.indexOf(name) !== -1) {
          continue;
        }
        newObj[name] = obj[name];
      }

      return newObj;
    }

    function prefixFilter(obj, prefix) {
      let names = Object.getOwnPropertyNames(obj);
      const newObj = {};

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.substring(0, prefix.length) === prefix) {
          newObj[name.substring(prefix.length)] = obj[name];
        }
      }

      return newObj;
    }

    function useActions(node, actions) {
      let objects = [];

      if (actions) {
        for (let i = 0; i < actions.length; i++) {
          const isArray = Array.isArray(actions[i]);
          const action = isArray ? actions[i][0] : actions[i];
          if (isArray && actions[i].length > 1) {
            objects.push(action(node, actions[i][1]));
          } else {
            objects.push(action(node));
          }
        }
      }

      return {
        update(actions) {
          if (((actions && actions.length) || 0) != objects.length) {
            throw new Error('You must not change the length of an actions array.');
          }

          if (actions) {
            for (let i = 0; i < actions.length; i++) {
              if (objects[i] && 'update' in objects[i]) {
                const isArray = Array.isArray(actions[i]);
                if (isArray && actions[i].length > 1) {
                  objects[i].update(actions[i][1]);
                } else {
                  objects[i].update();
                }
              }
            }
          }
        },

        destroy() {
          for (let i = 0; i < objects.length; i++) {
            if (objects[i] && 'destroy' in objects[i]) {
              objects[i].destroy();
            }
          }
        },
      };
    }

    const { applyPassive } = events;
    const { matches } = ponyfill;

    function Ripple(
      node,
      {
        ripple = true,
        surface = false,
        unbounded = false,
        disabled = false,
        color = null,
        active = null,
        eventTarget = null,
        activeTarget = null,
        addClass = (className) => node.classList.add(className),
        removeClass = (className) => node.classList.remove(className),
        addStyle = (name, value) => node.style.setProperty(name, value),
        initPromise = Promise.resolve(),
      } = {}
    ) {
      let instance;
      let addLayoutListener = getContext('SMUI:addLayoutListener');
      let removeLayoutListener;
      let oldActive = active;
      let oldEventTarget = eventTarget;
      let oldActiveTarget = activeTarget;

      function handleProps() {
        if (surface) {
          addClass('mdc-ripple-surface');
          if (color === 'primary') {
            addClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          } else if (color === 'secondary') {
            removeClass('smui-ripple-surface--primary');
            addClass('smui-ripple-surface--secondary');
          } else {
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }
        }

        // Handle activation first.
        if (instance && oldActive !== active) {
          oldActive = active;
          if (active) {
            instance.activate();
          } else if (active === false) {
            instance.deactivate();
          }
        }

        // Then create/destroy an instance.
        if (ripple && !instance) {
          instance = new MDCRippleFoundation({
            addClass,
            browserSupportsCssVars: () => supportsCssVariables(window),
            computeBoundingRect: () => node.getBoundingClientRect(),
            containsEventTarget: (target) => node.contains(target),
            deregisterDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterInteractionHandler: (evtType, handler) =>
              (eventTarget || node).removeEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            deregisterResizeHandler: (handler) =>
              window.removeEventListener('resize', handler),
            getWindowPageOffset: () => ({
              x: window.pageXOffset,
              y: window.pageYOffset,
            }),
            isSurfaceActive: () =>
              active == null ? matches(activeTarget || node, ':active') : active,
            isSurfaceDisabled: () => !!disabled,
            isUnbounded: () => !!unbounded,
            registerDocumentInteractionHandler: (evtType, handler) =>
              document.documentElement.addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerInteractionHandler: (evtType, handler) =>
              (eventTarget || node).addEventListener(
                evtType,
                handler,
                applyPassive()
              ),
            registerResizeHandler: (handler) =>
              window.addEventListener('resize', handler),
            removeClass,
            updateCssVariable: addStyle,
          });

          initPromise.then(() => {
            instance.init();
            instance.setUnbounded(unbounded);
          });
        } else if (instance && !ripple) {
          initPromise.then(() => {
            instance.destroy();
            instance = null;
          });
        }

        // Now handle event/active targets
        if (
          instance &&
          (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)
        ) {
          oldEventTarget = eventTarget;
          oldActiveTarget = activeTarget;

          instance.destroy();
          requestAnimationFrame(() => {
            if (instance) {
              instance.init();
              instance.setUnbounded(unbounded);
            }
          });
        }

        if (!ripple && unbounded) {
          addClass('mdc-ripple-upgraded--unbounded');
        }
      }

      handleProps();

      if (addLayoutListener) {
        removeLayoutListener = addLayoutListener(layout);
      }

      function layout() {
        if (instance) {
          instance.layout();
        }
      }

      return {
        update(props) {
          ({
            ripple,
            surface,
            unbounded,
            disabled,
            color,
            active,
            eventTarget,
            activeTarget,
            addClass,
            removeClass,
            addStyle,
            initPromise,
          } = {
            ripple: true,
            surface: false,
            unbounded: false,
            disabled: false,
            color: null,
            active: null,
            eventTarget: null,
            activeTarget: null,
            addClass: (className) => node.classList.add(className),
            removeClass: (className) => node.classList.remove(className),
            addStyle: (name, value) => node.style.setProperty(name, value),
            initPromise: Promise.resolve(),
            ...props,
          });
          handleProps();
        },

        destroy() {
          if (instance) {
            instance.destroy();
            instance = null;
            removeClass('mdc-ripple-surface');
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
          }

          if (removeLayoutListener) {
            removeLayoutListener();
          }
        },
      };
    }

    /* node_modules/@smui/common/A.svelte generated by Svelte v3.49.0 */
    const file$e = "node_modules/@smui/common/A.svelte";

    function create_fragment$f(ctx) {
    	let a;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*$$restProps*/ ctx[4]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('A', slots, ['default']);
    	let { href = 'javascript:void(0);' } = $$props;
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		href,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		a_binding
    	];
    }

    class A extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$f, safe_not_equal, { href: 0, use: 1, getElement: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "A",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get href() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get use() {
    		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[5];
    	}

    	set getElement(value) {
    		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/Button.svelte generated by Svelte v3.49.0 */
    const file$d = "node_modules/@smui/common/Button.svelte";

    function create_fragment$e(ctx) {
    	let button;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let button_levels = [/*$$restProps*/ ctx[3]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element = null;

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$e, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get use() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab-indicator/TabIndicator.svelte generated by Svelte v3.49.0 */

    const file$c = "node_modules/@smui/tab-indicator/TabIndicator.svelte";

    function create_fragment$d(ctx) {
    	let span1;
    	let span0;
    	let span0_class_value;
    	let span0_style_value;
    	let span0_aria_hidden_value;
    	let useActions_action;
    	let span1_class_value;
    	let useActions_action_1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	let span0_levels = [
    		{
    			class: span0_class_value = classMap({
    				[/*content$class*/ ctx[6]]: true,
    				'mdc-tab-indicator__content': true,
    				'mdc-tab-indicator__content--underline': /*type*/ ctx[3] === 'underline',
    				'mdc-tab-indicator__content--icon': /*type*/ ctx[3] === 'icon'
    			})
    		},
    		{
    			style: span0_style_value = Object.entries(/*contentStyles*/ ctx[10]).map(func$2).join(' ')
    		},
    		{
    			"aria-hidden": span0_aria_hidden_value = /*type*/ ctx[3] === 'icon' ? 'true' : null
    		},
    		prefixFilter(/*$$restProps*/ ctx[12], 'content$')
    	];

    	let span0_data = {};

    	for (let i = 0; i < span0_levels.length; i += 1) {
    		span0_data = assign(span0_data, span0_levels[i]);
    	}

    	let span1_levels = [
    		{
    			class: span1_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-tab-indicator': true,
    				'mdc-tab-indicator--active': /*active*/ ctx[0],
    				'mdc-tab-indicator--fade': /*transition*/ ctx[4] === 'fade',
    				.../*internalClasses*/ ctx[9]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[12], ['content$'])
    	];

    	let span1_data = {};

    	for (let i = 0; i < span1_levels.length; i += 1) {
    		span1_data = assign(span1_data, span1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span0, span0_data);
    			add_location(span0, file$c, 13, 2, 316);
    			set_attributes(span1, span1_data);
    			add_location(span1, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			/*span0_binding*/ ctx[22](span0);
    			/*span1_binding*/ ctx[23](span1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span0, /*content$use*/ ctx[5])),
    					action_destroyer(useActions_action_1 = useActions.call(null, span1, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[11].call(null, span1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span0, span0_data = get_spread_update(span0_levels, [
    				(!current || dirty & /*content$class, type*/ 72 && span0_class_value !== (span0_class_value = classMap({
    					[/*content$class*/ ctx[6]]: true,
    					'mdc-tab-indicator__content': true,
    					'mdc-tab-indicator__content--underline': /*type*/ ctx[3] === 'underline',
    					'mdc-tab-indicator__content--icon': /*type*/ ctx[3] === 'icon'
    				}))) && { class: span0_class_value },
    				(!current || dirty & /*contentStyles*/ 1024 && span0_style_value !== (span0_style_value = Object.entries(/*contentStyles*/ ctx[10]).map(func$2).join(' '))) && { style: span0_style_value },
    				(!current || dirty & /*type*/ 8 && span0_aria_hidden_value !== (span0_aria_hidden_value = /*type*/ ctx[3] === 'icon' ? 'true' : null)) && { "aria-hidden": span0_aria_hidden_value },
    				dirty & /*$$restProps*/ 4096 && prefixFilter(/*$$restProps*/ ctx[12], 'content$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*content$use*/ 32) useActions_action.update.call(null, /*content$use*/ ctx[5]);

    			set_attributes(span1, span1_data = get_spread_update(span1_levels, [
    				(!current || dirty & /*className, active, transition, internalClasses*/ 533 && span1_class_value !== (span1_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					'mdc-tab-indicator': true,
    					'mdc-tab-indicator--active': /*active*/ ctx[0],
    					'mdc-tab-indicator--fade': /*transition*/ ctx[4] === 'fade',
    					.../*internalClasses*/ ctx[9]
    				}))) && { class: span1_class_value },
    				dirty & /*$$restProps*/ 4096 && exclude(/*$$restProps*/ ctx[12], ['content$'])
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 2) useActions_action_1.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (default_slot) default_slot.d(detaching);
    			/*span0_binding*/ ctx[22](null);
    			/*span1_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$2 = ([name, value]) => `${name}: ${value};`;

    function instance_1$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","active","type","transition","content$use","content$class","activate","deactivate","computeContentClientRect","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabIndicator', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { type = 'underline' } = $$props;
    	let { transition = 'slide' } = $$props;
    	let { content$use = [] } = $$props;
    	let { content$class = '' } = $$props;
    	let element;
    	let instance;
    	let content;
    	let internalClasses = {};
    	let contentStyles = {};
    	let changeSets = [];
    	let oldTransition = transition;

    	onMount(() => {
    		$$invalidate(17, instance = getInstance());
    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function getInstance() {
    		const Foundation = ({
    			fade: MDCFadingTabIndicatorFoundation,
    			slide: MDCSlidingTabIndicatorFoundation
    		})[transition] || MDCSlidingTabIndicatorFoundation;

    		return Foundation
    		? new Foundation({
    					addClass: (...props) => doChange(() => addClass(...props)),
    					removeClass: (...props) => doChange(() => removeClass(...props)),
    					computeContentClientRect,
    					setContentStyleProperty: (...props) => doChange(() => addContentStyle(...props))
    				})
    		: undefined;
    	}

    	function doChange(fn) {
    		if (changeSets.length) {
    			changeSets[changeSets.length - 1].push(fn);
    		} else {
    			fn();
    		}
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addContentStyle(name, value) {
    		if (contentStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete contentStyles[name];
    				((($$invalidate(10, contentStyles), $$invalidate(19, oldTransition)), $$invalidate(4, transition)), $$invalidate(17, instance));
    			} else {
    				$$invalidate(10, contentStyles[name] = value, contentStyles);
    			}
    		}
    	}

    	function activate(previousIndicatorClientRect) {
    		$$invalidate(0, active = true);
    		instance.activate(previousIndicatorClientRect);
    	}

    	function deactivate() {
    		$$invalidate(0, active = false);
    		instance.deactivate();
    	}

    	function computeContentClientRect() {
    		changeSets.push([]);
    		$$invalidate(18, changeSets);
    		return content.getBoundingClientRect();
    	}

    	function getElement() {
    		return element;
    	}

    	function span0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			content = $$value;
    			$$invalidate(8, content);
    		});
    	}

    	function span1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ('type' in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ('transition' in $$new_props) $$invalidate(4, transition = $$new_props.transition);
    		if ('content$use' in $$new_props) $$invalidate(5, content$use = $$new_props.content$use);
    		if ('content$class' in $$new_props) $$invalidate(6, content$class = $$new_props.content$class);
    		if ('$$scope' in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCFadingTabIndicatorFoundation,
    		MDCSlidingTabIndicatorFoundation,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		active,
    		type,
    		transition,
    		content$use,
    		content$class,
    		element,
    		instance,
    		content,
    		internalClasses,
    		contentStyles,
    		changeSets,
    		oldTransition,
    		getInstance,
    		doChange,
    		addClass,
    		removeClass,
    		addContentStyle,
    		activate,
    		deactivate,
    		computeContentClientRect,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(0, active = $$new_props.active);
    		if ('type' in $$props) $$invalidate(3, type = $$new_props.type);
    		if ('transition' in $$props) $$invalidate(4, transition = $$new_props.transition);
    		if ('content$use' in $$props) $$invalidate(5, content$use = $$new_props.content$use);
    		if ('content$class' in $$props) $$invalidate(6, content$class = $$new_props.content$class);
    		if ('element' in $$props) $$invalidate(7, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(17, instance = $$new_props.instance);
    		if ('content' in $$props) $$invalidate(8, content = $$new_props.content);
    		if ('internalClasses' in $$props) $$invalidate(9, internalClasses = $$new_props.internalClasses);
    		if ('contentStyles' in $$props) $$invalidate(10, contentStyles = $$new_props.contentStyles);
    		if ('changeSets' in $$props) $$invalidate(18, changeSets = $$new_props.changeSets);
    		if ('oldTransition' in $$props) $$invalidate(19, oldTransition = $$new_props.oldTransition);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*oldTransition, transition, instance*/ 655376) {
    			if (oldTransition !== transition) {
    				$$invalidate(19, oldTransition = transition);
    				instance && instance.destroy();
    				$$invalidate(9, internalClasses = {});
    				$$invalidate(10, contentStyles = {});
    				$$invalidate(17, instance = getInstance());
    				instance.init();
    			}
    		}

    		if ($$self.$$.dirty & /*changeSets*/ 262144) {
    			// Use sets of changes for DOM updates, to facilitate animations.
    			if (changeSets.length) {
    				requestAnimationFrame(() => {
    					const changeSet = changeSets.shift();
    					$$invalidate(18, changeSets);

    					for (const fn of changeSet) {
    						fn();
    					}
    				});
    			}
    		}
    	};

    	return [
    		active,
    		use,
    		className,
    		type,
    		transition,
    		content$use,
    		content$class,
    		element,
    		content,
    		internalClasses,
    		contentStyles,
    		forwardEvents,
    		$$restProps,
    		activate,
    		deactivate,
    		computeContentClientRect,
    		getElement,
    		instance,
    		changeSets,
    		oldTransition,
    		$$scope,
    		slots,
    		span0_binding,
    		span1_binding
    	];
    }

    class TabIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1$3, create_fragment$d, safe_not_equal, {
    			use: 1,
    			class: 2,
    			active: 0,
    			type: 3,
    			transition: 4,
    			content$use: 5,
    			content$class: 6,
    			activate: 13,
    			deactivate: 14,
    			computeContentClientRect: 15,
    			getElement: 16
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabIndicator",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get use() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$use() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$use(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$class() {
    		throw new Error("<TabIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$class(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[13];
    	}

    	set activate(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[14];
    	}

    	set deactivate(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get computeContentClientRect() {
    		return this.$$.ctx[15];
    	}

    	set computeContentClientRect(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[16];
    	}

    	set getElement(value) {
    		throw new Error("<TabIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab/Tab.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1 } = globals;
    const file$b = "node_modules/@smui/tab/Tab.svelte";
    const get_tab_indicator_slot_changes_1 = dirty => ({});
    const get_tab_indicator_slot_context_1 = ctx => ({});
    const get_tab_indicator_slot_changes = dirty => ({});
    const get_tab_indicator_slot_context = ctx => ({});

    // (48:4) {#if indicatorSpanOnlyContent}
    function create_if_block_1$5(ctx) {
    	let tabindicator;
    	let current;

    	const tabindicator_spread_levels = [
    		{ active: /*active*/ ctx[18] },
    		prefixFilter(/*$$restProps*/ ctx[24], 'tabIndicator$')
    	];

    	let tabindicator_props = {
    		$$slots: { default: [create_default_slot_2$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    		tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
    	}

    	tabindicator = new TabIndicator({
    			props: tabindicator_props,
    			$$inline: true
    		});

    	/*tabindicator_binding*/ ctx[31](tabindicator);

    	const block = {
    		c: function create() {
    			create_component(tabindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabindicator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabindicator_changes = (dirty[0] & /*active, $$restProps*/ 17039360)
    			? get_spread_update(tabindicator_spread_levels, [
    					dirty[0] & /*active*/ 262144 && { active: /*active*/ ctx[18] },
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[24], 'tabIndicator$'))
    				])
    			: {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				tabindicator_changes.$$scope = { dirty, ctx };
    			}

    			tabindicator.$set(tabindicator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*tabindicator_binding*/ ctx[31](null);
    			destroy_component(tabindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(48:4) {#if indicatorSpanOnlyContent}",
    		ctx
    	});

    	return block;
    }

    // (49:6) <TabIndicator         bind:this={tabIndicator}         {active}         {...prefixFilter($$restProps, 'tabIndicator$')}         >
    function create_default_slot_2$1(ctx) {
    	let current;
    	const tab_indicator_slot_template = /*#slots*/ ctx[30]["tab-indicator"];
    	const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], get_tab_indicator_slot_context);

    	const block = {
    		c: function create() {
    			if (tab_indicator_slot) tab_indicator_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (tab_indicator_slot) {
    				tab_indicator_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tab_indicator_slot) {
    				if (tab_indicator_slot.p && (!current || dirty[1] & /*$$scope*/ 16)) {
    					update_slot_base(
    						tab_indicator_slot,
    						tab_indicator_slot_template,
    						ctx,
    						/*$$scope*/ ctx[35],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[35])
    						: get_slot_changes(tab_indicator_slot_template, /*$$scope*/ ctx[35], dirty, get_tab_indicator_slot_changes),
    						get_tab_indicator_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_indicator_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_indicator_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tab_indicator_slot) tab_indicator_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(49:6) <TabIndicator         bind:this={tabIndicator}         {active}         {...prefixFilter($$restProps, 'tabIndicator$')}         >",
    		ctx
    	});

    	return block;
    }

    // (57:2) {#if !indicatorSpanOnlyContent}
    function create_if_block$7(ctx) {
    	let tabindicator;
    	let current;

    	const tabindicator_spread_levels = [
    		{ active: /*active*/ ctx[18] },
    		prefixFilter(/*$$restProps*/ ctx[24], 'tabIndicator$')
    	];

    	let tabindicator_props = {
    		$$slots: { default: [create_default_slot_1$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabindicator_spread_levels.length; i += 1) {
    		tabindicator_props = assign(tabindicator_props, tabindicator_spread_levels[i]);
    	}

    	tabindicator = new TabIndicator({
    			props: tabindicator_props,
    			$$inline: true
    		});

    	/*tabindicator_binding_1*/ ctx[33](tabindicator);

    	const block = {
    		c: function create() {
    			create_component(tabindicator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabindicator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabindicator_changes = (dirty[0] & /*active, $$restProps*/ 17039360)
    			? get_spread_update(tabindicator_spread_levels, [
    					dirty[0] & /*active*/ 262144 && { active: /*active*/ ctx[18] },
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(prefixFilter(/*$$restProps*/ ctx[24], 'tabIndicator$'))
    				])
    			: {};

    			if (dirty[1] & /*$$scope*/ 16) {
    				tabindicator_changes.$$scope = { dirty, ctx };
    			}

    			tabindicator.$set(tabindicator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabindicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabindicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*tabindicator_binding_1*/ ctx[33](null);
    			destroy_component(tabindicator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(57:2) {#if !indicatorSpanOnlyContent}",
    		ctx
    	});

    	return block;
    }

    // (58:4) <TabIndicator       bind:this={tabIndicator}       {active}       {...prefixFilter($$restProps, 'tabIndicator$')}       >
    function create_default_slot_1$2(ctx) {
    	let current;
    	const tab_indicator_slot_template = /*#slots*/ ctx[30]["tab-indicator"];
    	const tab_indicator_slot = create_slot(tab_indicator_slot_template, ctx, /*$$scope*/ ctx[35], get_tab_indicator_slot_context_1);

    	const block = {
    		c: function create() {
    			if (tab_indicator_slot) tab_indicator_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (tab_indicator_slot) {
    				tab_indicator_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tab_indicator_slot) {
    				if (tab_indicator_slot.p && (!current || dirty[1] & /*$$scope*/ 16)) {
    					update_slot_base(
    						tab_indicator_slot,
    						tab_indicator_slot_template,
    						ctx,
    						/*$$scope*/ ctx[35],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[35])
    						: get_slot_changes(tab_indicator_slot_template, /*$$scope*/ ctx[35], dirty, get_tab_indicator_slot_changes_1),
    						get_tab_indicator_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab_indicator_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab_indicator_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tab_indicator_slot) tab_indicator_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(58:4) <TabIndicator       bind:this={tabIndicator}       {active}       {...prefixFilter($$restProps, 'tabIndicator$')}       >",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-tab': true,     'mdc-tab--active': active,     'mdc-tab--stacked': stacked,     'mdc-tab--min-width': minWidth,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role="tab"   aria-selected={active ? 'true' : 'false'}   tabindex={active || forceAccessible ? '0' : '-1'}   {href}   on:click={instance && instance.handleClick()}   {...internalAttrs}   {...exclude($$restProps, ['content$', 'tabIndicator$'])} >
    function create_default_slot$3(ctx) {
    	let span0;
    	let t0;
    	let span0_class_value;
    	let useActions_action;
    	let t1;
    	let t2;
    	let span1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[30].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[35], null);
    	let if_block0 = /*indicatorSpanOnlyContent*/ ctx[6] && create_if_block_1$5(ctx);

    	let span0_levels = [
    		{
    			class: span0_class_value = classMap({
    				[/*content$class*/ ctx[9]]: true,
    				'mdc-tab__content': true
    			})
    		},
    		prefixFilter(/*$$restProps*/ ctx[24], 'content$')
    	];

    	let span0_data = {};

    	for (let i = 0; i < span0_levels.length; i += 1) {
    		span0_data = assign(span0_data, span0_levels[i]);
    	}

    	let if_block1 = !/*indicatorSpanOnlyContent*/ ctx[6] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			t0 = space$1();
    			if (if_block0) if_block0.c();
    			t1 = space$1();
    			if (if_block1) if_block1.c();
    			t2 = space$1();
    			span1 = element("span");
    			set_attributes(span0, span0_data);
    			add_location(span0, file$b, 37, 2, 818);
    			attr_dev(span1, "class", "mdc-tab__ripple");
    			add_location(span1, file$b, 64, 2, 1497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			append_dev(span0, t0);
    			if (if_block0) if_block0.m(span0, null);
    			/*span0_binding*/ ctx[32](span0);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(useActions_action = useActions.call(null, span0, /*content$use*/ ctx[8]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[35],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[35])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[35], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*indicatorSpanOnlyContent*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*indicatorSpanOnlyContent*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(span0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			set_attributes(span0, span0_data = get_spread_update(span0_levels, [
    				(!current || dirty[0] & /*content$class*/ 512 && span0_class_value !== (span0_class_value = classMap({
    					[/*content$class*/ ctx[9]]: true,
    					'mdc-tab__content': true
    				}))) && { class: span0_class_value },
    				dirty[0] & /*$$restProps*/ 16777216 && prefixFilter(/*$$restProps*/ ctx[24], 'content$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*content$use*/ 256) useActions_action.update.call(null, /*content$use*/ ctx[8]);

    			if (!/*indicatorSpanOnlyContent*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*indicatorSpanOnlyContent*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			/*span0_binding*/ ctx[32](null);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-tab': true,     'mdc-tab--active': active,     'mdc-tab--stacked': stacked,     'mdc-tab--min-width': minWidth,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role=\\\"tab\\\"   aria-selected={active ? 'true' : 'false'}   tabindex={active || forceAccessible ? '0' : '-1'}   {href}   on:click={instance && instance.handleClick()}   {...internalAttrs}   {...exclude($$restProps, ['content$', 'tabIndicator$'])} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[21],
    						removeClass: /*removeClass*/ ctx[22],
    						addStyle: /*addStyle*/ ctx[23]
    					}
    				],
    				/*forwardEvents*/ ctx[20],
    				.../*use*/ ctx[0]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-tab': true,
    				'mdc-tab--active': /*active*/ ctx[18],
    				'mdc-tab--stacked': /*stacked*/ ctx[4],
    				'mdc-tab--min-width': /*minWidth*/ ctx[5],
    				.../*internalClasses*/ ctx[15]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[16]).map(func$1).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		{ role: "tab" },
    		{
    			"aria-selected": /*active*/ ctx[18] ? 'true' : 'false'
    		},
    		{
    			tabindex: /*active*/ ctx[18] || /*forceAccessible*/ ctx[19]
    			? '0'
    			: '-1'
    		},
    		{ href: /*href*/ ctx[7] },
    		/*internalAttrs*/ ctx[17],
    		exclude(/*$$restProps*/ ctx[24], ['content$', 'tabIndicator$'])
    	];

    	var switch_value = /*component*/ ctx[10];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$3] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[34](switch_instance);

    		switch_instance.$on("click", function () {
    			if (is_function(/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick())) (/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick()).apply(this, arguments);
    		});
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty[0] & /*ripple, addClass, removeClass, addStyle, forwardEvents, use, className, active, stacked, minWidth, internalClasses, internalStyles, style, forceAccessible, href, internalAttrs, $$restProps*/ 33521855)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*ripple, addClass, removeClass, addStyle, forwardEvents, use*/ 15728649 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[3],
    									unbounded: false,
    									addClass: /*addClass*/ ctx[21],
    									removeClass: /*removeClass*/ ctx[22],
    									addStyle: /*addStyle*/ ctx[23]
    								}
    							],
    							/*forwardEvents*/ ctx[20],
    							.../*use*/ ctx[0]
    						]
    					},
    					dirty[0] & /*className, active, stacked, minWidth, internalClasses*/ 294962 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-tab': true,
    							'mdc-tab--active': /*active*/ ctx[18],
    							'mdc-tab--stacked': /*stacked*/ ctx[4],
    							'mdc-tab--min-width': /*minWidth*/ ctx[5],
    							.../*internalClasses*/ ctx[15]
    						})
    					},
    					dirty[0] & /*internalStyles, style*/ 65540 && {
    						style: Object.entries(/*internalStyles*/ ctx[16]).map(func$1).concat([/*style*/ ctx[2]]).join(' ')
    					},
    					switch_instance_spread_levels[3],
    					dirty[0] & /*active*/ 262144 && {
    						"aria-selected": /*active*/ ctx[18] ? 'true' : 'false'
    					},
    					dirty[0] & /*active, forceAccessible*/ 786432 && {
    						tabindex: /*active*/ ctx[18] || /*forceAccessible*/ ctx[19]
    						? '0'
    						: '-1'
    					},
    					dirty[0] & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty[0] & /*internalAttrs*/ 131072 && get_spread_object(/*internalAttrs*/ ctx[17]),
    					dirty[0] & /*$$restProps*/ 16777216 && get_spread_object(exclude(/*$$restProps*/ ctx[24], ['content$', 'tabIndicator$']))
    				])
    			: {};

    			if (dirty[0] & /*active, $$restProps, tabIndicator, indicatorSpanOnlyContent, content$class, content, content$use*/ 17064768 | dirty[1] & /*$$scope*/ 16) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[10])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[34](switch_instance);

    					switch_instance.$on("click", function () {
    						if (is_function(/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick())) (/*instance*/ ctx[11] && /*instance*/ ctx[11].handleClick()).apply(this, arguments);
    					});

    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[34](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$2($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","tab","ripple","stacked","minWidth","indicatorSpanOnlyContent","href","content$use","content$class","component","activate","deactivate","focus","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default','tab-indicator']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { tab: tabId } = $$props;
    	let { ripple = true } = $$props;
    	let { stacked = false } = $$props;
    	let { minWidth = false } = $$props;
    	let { indicatorSpanOnlyContent = false } = $$props;
    	let { href = null } = $$props;
    	let { content$use = [] } = $$props;
    	let { content$class = '' } = $$props;
    	let element;
    	let instance;
    	let content;
    	let tabIndicator;
    	let internalClasses = {};
    	let internalStyles = {};
    	let internalAttrs = {};
    	let focusOnActivate = getContext('SMUI:tab:focusOnActivate');
    	let active = tabId === getContext('SMUI:tab:initialActive');
    	let forceAccessible = false;
    	let { component = href == null ? Button : A } = $$props;
    	setContext('SMUI:label:context', 'tab');
    	setContext('SMUI:icon:context', 'tab');

    	if (!tabId) {
    		throw new Error('The tab property is required! It should be passed down from the TabBar to the Tab.');
    	}

    	onMount(() => {
    		$$invalidate(11, instance = new MDCTabFoundation({
    				setAttr: addAttr,
    				addClass,
    				removeClass,
    				hasClass,
    				activateIndicator: previousIndicatorClientRect => tabIndicator.activate(previousIndicatorClientRect),
    				deactivateIndicator: () => tabIndicator.deactivate(),
    				notifyInteracted: () => dispatch(getElement(), 'MDCTab:interacted', { tabId }),
    				getOffsetLeft: () => getElement().offsetLeft,
    				getOffsetWidth: () => getElement().offsetWidth,
    				getContentOffsetLeft: () => content.offsetLeft,
    				getContentOffsetWidth: () => content.offsetWidth,
    				focus
    			}));

    		const accessor = {
    			tabId,
    			get element() {
    				return getElement();
    			},
    			get active() {
    				return active;
    			},
    			forceAccessible(accessible) {
    				$$invalidate(19, forceAccessible = accessible);
    			},
    			computeIndicatorClientRect: () => tabIndicator.computeContentClientRect(),
    			computeDimensions: () => instance.computeDimensions(),
    			focus,
    			activate,
    			deactivate
    		};

    		dispatch(getElement(), 'SMUI:tab:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(getElement(), 'SMUI:tab:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(15, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(15, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(16, internalStyles);
    			} else {
    				$$invalidate(16, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(17, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function activate(previousIndicatorClientRect, skipFocus) {
    		$$invalidate(18, active = true);

    		if (skipFocus) {
    			instance.setFocusOnActivate(false);
    		}

    		instance.activate(previousIndicatorClientRect);

    		if (skipFocus) {
    			instance.setFocusOnActivate(focusOnActivate);
    		}
    	}

    	function deactivate() {
    		$$invalidate(18, active = false);
    		instance.deactivate();
    	}

    	function focus() {
    		getElement().focus();
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function tabindicator_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tabIndicator = $$value;
    			$$invalidate(14, tabIndicator);
    		});
    	}

    	function span0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			content = $$value;
    			$$invalidate(13, content);
    		});
    	}

    	function tabindicator_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tabIndicator = $$value;
    			$$invalidate(14, tabIndicator);
    		});
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(12, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(24, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('tab' in $$new_props) $$invalidate(25, tabId = $$new_props.tab);
    		if ('ripple' in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('stacked' in $$new_props) $$invalidate(4, stacked = $$new_props.stacked);
    		if ('minWidth' in $$new_props) $$invalidate(5, minWidth = $$new_props.minWidth);
    		if ('indicatorSpanOnlyContent' in $$new_props) $$invalidate(6, indicatorSpanOnlyContent = $$new_props.indicatorSpanOnlyContent);
    		if ('href' in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ('content$use' in $$new_props) $$invalidate(8, content$use = $$new_props.content$use);
    		if ('content$class' in $$new_props) $$invalidate(9, content$class = $$new_props.content$class);
    		if ('component' in $$new_props) $$invalidate(10, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(35, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabFoundation,
    		onMount,
    		setContext,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		A,
    		Button,
    		TabIndicator,
    		forwardEvents,
    		use,
    		className,
    		style,
    		tabId,
    		ripple,
    		stacked,
    		minWidth,
    		indicatorSpanOnlyContent,
    		href,
    		content$use,
    		content$class,
    		element,
    		instance,
    		content,
    		tabIndicator,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		focusOnActivate,
    		active,
    		forceAccessible,
    		component,
    		hasClass,
    		addClass,
    		removeClass,
    		addStyle,
    		addAttr,
    		activate,
    		deactivate,
    		focus,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('tabId' in $$props) $$invalidate(25, tabId = $$new_props.tabId);
    		if ('ripple' in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('stacked' in $$props) $$invalidate(4, stacked = $$new_props.stacked);
    		if ('minWidth' in $$props) $$invalidate(5, minWidth = $$new_props.minWidth);
    		if ('indicatorSpanOnlyContent' in $$props) $$invalidate(6, indicatorSpanOnlyContent = $$new_props.indicatorSpanOnlyContent);
    		if ('href' in $$props) $$invalidate(7, href = $$new_props.href);
    		if ('content$use' in $$props) $$invalidate(8, content$use = $$new_props.content$use);
    		if ('content$class' in $$props) $$invalidate(9, content$class = $$new_props.content$class);
    		if ('element' in $$props) $$invalidate(12, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(11, instance = $$new_props.instance);
    		if ('content' in $$props) $$invalidate(13, content = $$new_props.content);
    		if ('tabIndicator' in $$props) $$invalidate(14, tabIndicator = $$new_props.tabIndicator);
    		if ('internalClasses' in $$props) $$invalidate(15, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(16, internalStyles = $$new_props.internalStyles);
    		if ('internalAttrs' in $$props) $$invalidate(17, internalAttrs = $$new_props.internalAttrs);
    		if ('focusOnActivate' in $$props) $$invalidate(36, focusOnActivate = $$new_props.focusOnActivate);
    		if ('active' in $$props) $$invalidate(18, active = $$new_props.active);
    		if ('forceAccessible' in $$props) $$invalidate(19, forceAccessible = $$new_props.forceAccessible);
    		if ('component' in $$props) $$invalidate(10, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*instance*/ 2048) {
    			if (instance) {
    				instance.setFocusOnActivate(focusOnActivate);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		stacked,
    		minWidth,
    		indicatorSpanOnlyContent,
    		href,
    		content$use,
    		content$class,
    		component,
    		instance,
    		element,
    		content,
    		tabIndicator,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		active,
    		forceAccessible,
    		forwardEvents,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		tabId,
    		activate,
    		deactivate,
    		focus,
    		getElement,
    		slots,
    		tabindicator_binding,
    		span0_binding,
    		tabindicator_binding_1,
    		switch_instance_binding,
    		$$scope
    	];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$2,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				style: 2,
    				tab: 25,
    				ripple: 3,
    				stacked: 4,
    				minWidth: 5,
    				indicatorSpanOnlyContent: 6,
    				href: 7,
    				content$use: 8,
    				content$class: 9,
    				component: 10,
    				activate: 26,
    				deactivate: 27,
    				focus: 28,
    				getElement: 29
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tabId*/ ctx[25] === undefined && !('tab' in props)) {
    			console.warn("<Tab> was created without expected prop 'tab'");
    		}
    	}

    	get use() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tab() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stacked() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stacked(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minWidth() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minWidth(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indicatorSpanOnlyContent() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indicatorSpanOnlyContent(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$use() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$use(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content$class() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content$class(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error_1("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activate() {
    		return this.$$.ctx[26];
    	}

    	set activate(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get deactivate() {
    		return this.$$.ctx[27];
    	}

    	set deactivate(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[28];
    	}

    	set focus(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[29];
    	}

    	set getElement(value) {
    		throw new Error_1("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/common/CommonLabel.svelte generated by Svelte v3.49.0 */
    const file$a = "node_modules/@smui/common/CommonLabel.svelte";

    function create_fragment$b(ctx) {
    	let span;
    	let span_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let span_levels = [
    		{
    			class: span_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-button__label': /*context*/ ctx[4] === 'button',
    				'mdc-fab__label': /*context*/ ctx[4] === 'fab',
    				'mdc-tab__text-label': /*context*/ ctx[4] === 'tab',
    				'mdc-image-list__label': /*context*/ ctx[4] === 'image-list',
    				'mdc-snackbar__label': /*context*/ ctx[4] === 'snackbar',
    				'mdc-banner__text': /*context*/ ctx[4] === 'banner',
    				'mdc-segmented-button__label': /*context*/ ctx[4] === 'segmented-button',
    				'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[4] === 'data-table:pagination',
    				'mdc-data-table__header-cell-label': /*context*/ ctx[4] === 'data-table:sortable-header-cell'
    			})
    		},
    		/*context*/ ctx[4] === 'snackbar'
    		? { 'aria-atomic': 'false' }
    		: {},
    		{ tabindex: /*tabindex*/ ctx[5] },
    		/*$$restProps*/ ctx[6]
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[10](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[3].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				(!current || dirty & /*className*/ 2 && span_class_value !== (span_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-button__label': /*context*/ ctx[4] === 'button',
    					'mdc-fab__label': /*context*/ ctx[4] === 'fab',
    					'mdc-tab__text-label': /*context*/ ctx[4] === 'tab',
    					'mdc-image-list__label': /*context*/ ctx[4] === 'image-list',
    					'mdc-snackbar__label': /*context*/ ctx[4] === 'snackbar',
    					'mdc-banner__text': /*context*/ ctx[4] === 'banner',
    					'mdc-segmented-button__label': /*context*/ ctx[4] === 'segmented-button',
    					'mdc-data-table__pagination-rows-per-page-label': /*context*/ ctx[4] === 'data-table:pagination',
    					'mdc-data-table__header-cell-label': /*context*/ ctx[4] === 'data-table:sortable-header-cell'
    				}))) && { class: span_class_value },
    				/*context*/ ctx[4] === 'snackbar'
    				? { 'aria-atomic': 'false' }
    				: {},
    				{ tabindex: /*tabindex*/ ctx[5] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommonLabel', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;
    	const context = getContext('SMUI:label:context');
    	const tabindex = getContext('SMUI:label:tabindex');

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		forwardEvents,
    		use,
    		className,
    		element,
    		context,
    		tabindex,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		element,
    		forwardEvents,
    		context,
    		tabindex,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		span_binding
    	];
    }

    class CommonLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$b, safe_not_equal, { use: 0, class: 1, getElement: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonLabel",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get use() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommonLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[7];
    	}

    	set getElement(value) {
    		throw new Error("<CommonLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses = {
        ANIMATING: 'mdc-tab-scroller--animating',
        SCROLL_AREA_SCROLL: 'mdc-tab-scroller__scroll-area--scroll',
        SCROLL_TEST: 'mdc-tab-scroller__test',
    };
    var strings$1 = {
        AREA_SELECTOR: '.mdc-tab-scroller__scroll-area',
        CONTENT_SELECTOR: '.mdc-tab-scroller__scroll-content',
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTL = /** @class */ (function () {
        function MDCTabScrollerRTL(adapter) {
            this.adapter = adapter;
        }
        return MDCTabScrollerRTL;
    }());

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLDefault = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLDefault, _super);
        function MDCTabScrollerRTLDefault() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLDefault.prototype.getScrollPositionRTL = function () {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var right = this.calculateScrollEdges_().right;
            // Scroll values on most browsers are ints instead of floats so we round
            return Math.round(right - currentScrollLeft);
        };
        MDCTabScrollerRTLDefault.prototype.scrollToRTL = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(edges.right - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLDefault.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLDefault.prototype.getAnimatingScrollPosition = function (scrollX) {
            return scrollX;
        };
        MDCTabScrollerRTLDefault.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: 0,
                right: contentWidth - rootWidth,
            };
        };
        MDCTabScrollerRTLDefault.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.left, scrollX), edges.right);
        };
        return MDCTabScrollerRTLDefault;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLNegative = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLNegative, _super);
        function MDCTabScrollerRTLNegative() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLNegative.prototype.getScrollPositionRTL = function (translateX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            return Math.round(translateX - currentScrollLeft);
        };
        MDCTabScrollerRTLNegative.prototype.scrollToRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(-scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLNegative.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft - scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: clampedScrollLeft - currentScrollLeft,
            };
        };
        MDCTabScrollerRTLNegative.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
            return scrollX - translateX;
        };
        MDCTabScrollerRTLNegative.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: rootWidth - contentWidth,
                right: 0,
            };
        };
        MDCTabScrollerRTLNegative.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.max(Math.min(edges.right, scrollX), edges.left);
        };
        return MDCTabScrollerRTLNegative;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerRTLReverse = /** @class */ (function (_super) {
        __extends(MDCTabScrollerRTLReverse, _super);
        function MDCTabScrollerRTLReverse() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCTabScrollerRTLReverse.prototype.getScrollPositionRTL = function (translateX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            // Scroll values on most browsers are ints instead of floats so we round
            return Math.round(currentScrollLeft - translateX);
        };
        MDCTabScrollerRTLReverse.prototype.scrollToRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: currentScrollLeft - clampedScrollLeft,
            };
        };
        MDCTabScrollerRTLReverse.prototype.incrementScrollRTL = function (scrollX) {
            var currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
            var clampedScrollLeft = this.clampScrollValue_(currentScrollLeft + scrollX);
            return {
                finalScrollPosition: clampedScrollLeft,
                scrollDelta: currentScrollLeft - clampedScrollLeft,
            };
        };
        MDCTabScrollerRTLReverse.prototype.getAnimatingScrollPosition = function (scrollX, translateX) {
            return scrollX + translateX;
        };
        MDCTabScrollerRTLReverse.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: contentWidth - rootWidth,
                right: 0,
            };
        };
        MDCTabScrollerRTLReverse.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.right, scrollX), edges.left);
        };
        return MDCTabScrollerRTLReverse;
    }(MDCTabScrollerRTL));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCTabScrollerFoundation = /** @class */ (function (_super) {
        __extends(MDCTabScrollerFoundation, _super);
        function MDCTabScrollerFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabScrollerFoundation.defaultAdapter), adapter)) || this;
            /**
             * Controls whether we should handle the transitionend and interaction events during the animation.
             */
            _this.isAnimating_ = false;
            return _this;
        }
        Object.defineProperty(MDCTabScrollerFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabScrollerFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabScrollerFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    eventTargetMatchesSelector: function () { return false; },
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    addScrollAreaClass: function () { return undefined; },
                    setScrollAreaStyleProperty: function () { return undefined; },
                    setScrollContentStyleProperty: function () { return undefined; },
                    getScrollContentStyleValue: function () { return ''; },
                    setScrollAreaScrollLeft: function () { return undefined; },
                    getScrollAreaScrollLeft: function () { return 0; },
                    getScrollContentOffsetWidth: function () { return 0; },
                    getScrollAreaOffsetWidth: function () { return 0; },
                    computeScrollAreaClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    computeScrollContentClientRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    computeHorizontalScrollbarHeight: function () { return 0; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCTabScrollerFoundation.prototype.init = function () {
            // Compute horizontal scrollbar height on scroller with overflow initially hidden, then update overflow to scroll
            // and immediately adjust bottom margin to avoid the scrollbar initially appearing before JS runs.
            var horizontalScrollbarHeight = this.adapter.computeHorizontalScrollbarHeight();
            this.adapter.setScrollAreaStyleProperty('margin-bottom', -horizontalScrollbarHeight + 'px');
            this.adapter.addScrollAreaClass(MDCTabScrollerFoundation.cssClasses.SCROLL_AREA_SCROLL);
        };
        /**
         * Computes the current visual scroll position
         */
        MDCTabScrollerFoundation.prototype.getScrollPosition = function () {
            if (this.isRTL_()) {
                return this.computeCurrentScrollPositionRTL_();
            }
            var currentTranslateX = this.calculateCurrentTranslateX_();
            var scrollLeft = this.adapter.getScrollAreaScrollLeft();
            return scrollLeft - currentTranslateX;
        };
        /**
         * Handles interaction events that occur during transition
         */
        MDCTabScrollerFoundation.prototype.handleInteraction = function () {
            // Early exit if we aren't animating
            if (!this.isAnimating_) {
                return;
            }
            // Prevent other event listeners from handling this event
            this.stopScrollAnimation_();
        };
        /**
         * Handles the transitionend event
         */
        MDCTabScrollerFoundation.prototype.handleTransitionEnd = function (evt) {
            // Early exit if we aren't animating or the event was triggered by a different element.
            var evtTarget = evt.target;
            if (!this.isAnimating_ ||
                !this.adapter.eventTargetMatchesSelector(evtTarget, MDCTabScrollerFoundation.strings.CONTENT_SELECTOR)) {
                return;
            }
            this.isAnimating_ = false;
            this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
        };
        /**
         * Increment the scroll value by the scrollXIncrement using animation.
         * @param scrollXIncrement The value by which to increment the scroll position
         */
        MDCTabScrollerFoundation.prototype.incrementScroll = function (scrollXIncrement) {
            // Early exit for non-operational increment values
            if (scrollXIncrement === 0) {
                return;
            }
            this.animate_(this.getIncrementScrollOperation_(scrollXIncrement));
        };
        /**
         * Increment the scroll value by the scrollXIncrement without animation.
         * @param scrollXIncrement The value by which to increment the scroll position
         */
        MDCTabScrollerFoundation.prototype.incrementScrollImmediate = function (scrollXIncrement) {
            // Early exit for non-operational increment values
            if (scrollXIncrement === 0) {
                return;
            }
            var operation = this.getIncrementScrollOperation_(scrollXIncrement);
            if (operation.scrollDelta === 0) {
                return;
            }
            this.stopScrollAnimation_();
            this.adapter.setScrollAreaScrollLeft(operation.finalScrollPosition);
        };
        /**
         * Scrolls to the given scrollX value
         */
        MDCTabScrollerFoundation.prototype.scrollTo = function (scrollX) {
            if (this.isRTL_()) {
                return this.scrollToRTL_(scrollX);
            }
            this.scrollTo_(scrollX);
        };
        /**
         * @return Browser-specific {@link MDCTabScrollerRTL} instance.
         */
        MDCTabScrollerFoundation.prototype.getRTLScroller = function () {
            if (!this.rtlScrollerInstance_) {
                this.rtlScrollerInstance_ = this.rtlScrollerFactory_();
            }
            return this.rtlScrollerInstance_;
        };
        /**
         * @return translateX value from a CSS matrix transform function string.
         */
        MDCTabScrollerFoundation.prototype.calculateCurrentTranslateX_ = function () {
            var transformValue = this.adapter.getScrollContentStyleValue('transform');
            // Early exit if no transform is present
            if (transformValue === 'none') {
                return 0;
            }
            // The transform value comes back as a matrix transformation in the form
            // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
            // we're going to grab all the parenthesized values, strip out tx, and
            // parse it.
            var match = /\((.+?)\)/.exec(transformValue);
            if (!match) {
                return 0;
            }
            var matrixParams = match[1];
            // tslint:disable-next-line:ban-ts-ignore "Unused vars" should be a linter warning, not a compiler error.
            // @ts-ignore These unused variables should retain their semantic names for clarity.
            var _a = __read(matrixParams.split(','), 6); _a[0]; _a[1]; _a[2]; _a[3]; var tx = _a[4]; _a[5];
            return parseFloat(tx); // tslint:disable-line:ban
        };
        /**
         * Calculates a safe scroll value that is > 0 and < the max scroll value
         * @param scrollX The distance to scroll
         */
        MDCTabScrollerFoundation.prototype.clampScrollValue_ = function (scrollX) {
            var edges = this.calculateScrollEdges_();
            return Math.min(Math.max(edges.left, scrollX), edges.right);
        };
        MDCTabScrollerFoundation.prototype.computeCurrentScrollPositionRTL_ = function () {
            var translateX = this.calculateCurrentTranslateX_();
            return this.getRTLScroller().getScrollPositionRTL(translateX);
        };
        MDCTabScrollerFoundation.prototype.calculateScrollEdges_ = function () {
            var contentWidth = this.adapter.getScrollContentOffsetWidth();
            var rootWidth = this.adapter.getScrollAreaOffsetWidth();
            return {
                left: 0,
                right: contentWidth - rootWidth,
            };
        };
        /**
         * Internal scroll method
         * @param scrollX The new scroll position
         */
        MDCTabScrollerFoundation.prototype.scrollTo_ = function (scrollX) {
            var currentScrollX = this.getScrollPosition();
            var safeScrollX = this.clampScrollValue_(scrollX);
            var scrollDelta = safeScrollX - currentScrollX;
            this.animate_({
                finalScrollPosition: safeScrollX,
                scrollDelta: scrollDelta,
            });
        };
        /**
         * Internal RTL scroll method
         * @param scrollX The new scroll position
         */
        MDCTabScrollerFoundation.prototype.scrollToRTL_ = function (scrollX) {
            var animation = this.getRTLScroller().scrollToRTL(scrollX);
            this.animate_(animation);
        };
        /**
         * Internal method to compute the increment scroll operation values.
         * @param scrollX The desired scroll position increment
         * @return MDCTabScrollerAnimation with the sanitized values for performing the scroll operation.
         */
        MDCTabScrollerFoundation.prototype.getIncrementScrollOperation_ = function (scrollX) {
            if (this.isRTL_()) {
                return this.getRTLScroller().incrementScrollRTL(scrollX);
            }
            var currentScrollX = this.getScrollPosition();
            var targetScrollX = scrollX + currentScrollX;
            var safeScrollX = this.clampScrollValue_(targetScrollX);
            var scrollDelta = safeScrollX - currentScrollX;
            return {
                finalScrollPosition: safeScrollX,
                scrollDelta: scrollDelta,
            };
        };
        /**
         * Animates the tab scrolling
         * @param animation The animation to apply
         */
        MDCTabScrollerFoundation.prototype.animate_ = function (animation) {
            var _this = this;
            // Early exit if translateX is 0, which means there's no animation to perform
            if (animation.scrollDelta === 0) {
                return;
            }
            this.stopScrollAnimation_();
            // This animation uses the FLIP approach.
            // Read more here: https://aerotwist.com/blog/flip-your-animations/
            this.adapter.setScrollAreaScrollLeft(animation.finalScrollPosition);
            this.adapter.setScrollContentStyleProperty('transform', "translateX(" + animation.scrollDelta + "px)");
            // Force repaint
            this.adapter.computeScrollAreaClientRect();
            requestAnimationFrame(function () {
                _this.adapter.addClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
                _this.adapter.setScrollContentStyleProperty('transform', 'none');
            });
            this.isAnimating_ = true;
        };
        /**
         * Stops scroll animation
         */
        MDCTabScrollerFoundation.prototype.stopScrollAnimation_ = function () {
            this.isAnimating_ = false;
            var currentScrollPosition = this.getAnimatingScrollPosition_();
            this.adapter.removeClass(MDCTabScrollerFoundation.cssClasses.ANIMATING);
            this.adapter.setScrollContentStyleProperty('transform', 'translateX(0px)');
            this.adapter.setScrollAreaScrollLeft(currentScrollPosition);
        };
        /**
         * Gets the current scroll position during animation
         */
        MDCTabScrollerFoundation.prototype.getAnimatingScrollPosition_ = function () {
            var currentTranslateX = this.calculateCurrentTranslateX_();
            var scrollLeft = this.adapter.getScrollAreaScrollLeft();
            if (this.isRTL_()) {
                return this.getRTLScroller().getAnimatingScrollPosition(scrollLeft, currentTranslateX);
            }
            return scrollLeft - currentTranslateX;
        };
        /**
         * Determines the RTL Scroller to use
         */
        MDCTabScrollerFoundation.prototype.rtlScrollerFactory_ = function () {
            // Browsers have three different implementations of scrollLeft in RTL mode,
            // dependent on the browser. The behavior is based off the max LTR
            // scrollLeft value and 0.
            //
            // * Default scrolling in RTL *
            //    - Left-most value: 0
            //    - Right-most value: Max LTR scrollLeft value
            //
            // * Negative scrolling in RTL *
            //    - Left-most value: Negated max LTR scrollLeft value
            //    - Right-most value: 0
            //
            // * Reverse scrolling in RTL *
            //    - Left-most value: Max LTR scrollLeft value
            //    - Right-most value: 0
            //
            // We use those principles below to determine which RTL scrollLeft
            // behavior is implemented in the current browser.
            var initialScrollLeft = this.adapter.getScrollAreaScrollLeft();
            this.adapter.setScrollAreaScrollLeft(initialScrollLeft - 1);
            var newScrollLeft = this.adapter.getScrollAreaScrollLeft();
            // If the newScrollLeft value is negative,then we know that the browser has
            // implemented negative RTL scrolling, since all other implementations have
            // only positive values.
            if (newScrollLeft < 0) {
                // Undo the scrollLeft test check
                this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
                return new MDCTabScrollerRTLNegative(this.adapter);
            }
            var rootClientRect = this.adapter.computeScrollAreaClientRect();
            var contentClientRect = this.adapter.computeScrollContentClientRect();
            var rightEdgeDelta = Math.round(contentClientRect.right - rootClientRect.right);
            // Undo the scrollLeft test check
            this.adapter.setScrollAreaScrollLeft(initialScrollLeft);
            // By calculating the clientRect of the root element and the clientRect of
            // the content element, we can determine how much the scroll value changed
            // when we performed the scrollLeft subtraction above.
            if (rightEdgeDelta === newScrollLeft) {
                return new MDCTabScrollerRTLReverse(this.adapter);
            }
            return new MDCTabScrollerRTLDefault(this.adapter);
        };
        MDCTabScrollerFoundation.prototype.isRTL_ = function () {
            return this.adapter.getScrollContentStyleValue('direction') === 'rtl';
        };
        return MDCTabScrollerFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Stores result from computeHorizontalScrollbarHeight to avoid redundant processing.
     */
    var horizontalScrollbarHeight_;
    /**
     * Computes the height of browser-rendered horizontal scrollbars using a self-created test element.
     * May return 0 (e.g. on OS X browsers under default configuration).
     */
    function computeHorizontalScrollbarHeight(documentObj, shouldCacheResult) {
        if (shouldCacheResult === void 0) { shouldCacheResult = true; }
        if (shouldCacheResult && typeof horizontalScrollbarHeight_ !== 'undefined') {
            return horizontalScrollbarHeight_;
        }
        var el = documentObj.createElement('div');
        el.classList.add(cssClasses.SCROLL_TEST);
        documentObj.body.appendChild(el);
        var horizontalScrollbarHeight = el.offsetHeight - el.clientHeight;
        documentObj.body.removeChild(el);
        if (shouldCacheResult) {
            horizontalScrollbarHeight_ = horizontalScrollbarHeight;
        }
        return horizontalScrollbarHeight;
    }

    var util = /*#__PURE__*/Object.freeze({
        __proto__: null,
        computeHorizontalScrollbarHeight: computeHorizontalScrollbarHeight
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings = {
        ARROW_LEFT_KEY: 'ArrowLeft',
        ARROW_RIGHT_KEY: 'ArrowRight',
        END_KEY: 'End',
        ENTER_KEY: 'Enter',
        HOME_KEY: 'Home',
        SPACE_KEY: 'Space',
        TAB_ACTIVATED_EVENT: 'MDCTabBar:activated',
        TAB_SCROLLER_SELECTOR: '.mdc-tab-scroller',
        TAB_SELECTOR: '.mdc-tab',
    };
    var numbers = {
        ARROW_LEFT_KEYCODE: 37,
        ARROW_RIGHT_KEYCODE: 39,
        END_KEYCODE: 35,
        ENTER_KEYCODE: 13,
        EXTRA_SCROLL_AMOUNT: 20,
        HOME_KEYCODE: 36,
        SPACE_KEYCODE: 32,
    };

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var ACCEPTABLE_KEYS = new Set();
    // IE11 has no support for new Set with iterable so we need to initialize this by hand
    ACCEPTABLE_KEYS.add(strings.ARROW_LEFT_KEY);
    ACCEPTABLE_KEYS.add(strings.ARROW_RIGHT_KEY);
    ACCEPTABLE_KEYS.add(strings.END_KEY);
    ACCEPTABLE_KEYS.add(strings.HOME_KEY);
    ACCEPTABLE_KEYS.add(strings.ENTER_KEY);
    ACCEPTABLE_KEYS.add(strings.SPACE_KEY);
    var KEYCODE_MAP = new Map();
    // IE11 has no support for new Map with iterable so we need to initialize this by hand
    KEYCODE_MAP.set(numbers.ARROW_LEFT_KEYCODE, strings.ARROW_LEFT_KEY);
    KEYCODE_MAP.set(numbers.ARROW_RIGHT_KEYCODE, strings.ARROW_RIGHT_KEY);
    KEYCODE_MAP.set(numbers.END_KEYCODE, strings.END_KEY);
    KEYCODE_MAP.set(numbers.HOME_KEYCODE, strings.HOME_KEY);
    KEYCODE_MAP.set(numbers.ENTER_KEYCODE, strings.ENTER_KEY);
    KEYCODE_MAP.set(numbers.SPACE_KEYCODE, strings.SPACE_KEY);
    var MDCTabBarFoundation = /** @class */ (function (_super) {
        __extends(MDCTabBarFoundation, _super);
        function MDCTabBarFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCTabBarFoundation.defaultAdapter), adapter)) || this;
            _this.useAutomaticActivation_ = false;
            return _this;
        }
        Object.defineProperty(MDCTabBarFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabBarFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCTabBarFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
                return {
                    scrollTo: function () { return undefined; },
                    incrementScroll: function () { return undefined; },
                    getScrollPosition: function () { return 0; },
                    getScrollContentWidth: function () { return 0; },
                    getOffsetWidth: function () { return 0; },
                    isRTL: function () { return false; },
                    setActiveTab: function () { return undefined; },
                    activateTabAtIndex: function () { return undefined; },
                    deactivateTabAtIndex: function () { return undefined; },
                    focusTabAtIndex: function () { return undefined; },
                    getTabIndicatorClientRectAtIndex: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                    getTabDimensionsAtIndex: function () { return ({ rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0 }); },
                    getPreviousActiveTabIndex: function () { return -1; },
                    getFocusedTabIndex: function () { return -1; },
                    getIndexOfTabById: function () { return -1; },
                    getTabListLength: function () { return 0; },
                    notifyTabActivated: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Switches between automatic and manual activation modes.
         * See https://www.w3.org/TR/wai-aria-practices/#tabpanel for examples.
         */
        MDCTabBarFoundation.prototype.setUseAutomaticActivation = function (useAutomaticActivation) {
            this.useAutomaticActivation_ = useAutomaticActivation;
        };
        MDCTabBarFoundation.prototype.activateTab = function (index) {
            var previousActiveIndex = this.adapter.getPreviousActiveTabIndex();
            if (!this.indexIsInRange_(index) || index === previousActiveIndex) {
                return;
            }
            var previousClientRect;
            if (previousActiveIndex !== -1) {
                this.adapter.deactivateTabAtIndex(previousActiveIndex);
                previousClientRect =
                    this.adapter.getTabIndicatorClientRectAtIndex(previousActiveIndex);
            }
            this.adapter.activateTabAtIndex(index, previousClientRect);
            this.scrollIntoView(index);
            this.adapter.notifyTabActivated(index);
        };
        MDCTabBarFoundation.prototype.handleKeyDown = function (evt) {
            // Get the key from the event
            var key = this.getKeyFromEvent_(evt);
            // Early exit if the event key isn't one of the keyboard navigation keys
            if (key === undefined) {
                return;
            }
            // Prevent default behavior for movement keys, but not for activation keys, since :active is used to apply ripple
            if (!this.isActivationKey_(key)) {
                evt.preventDefault();
            }
            if (this.useAutomaticActivation_) {
                if (this.isActivationKey_(key)) {
                    return;
                }
                var index = this.determineTargetFromKey_(this.adapter.getPreviousActiveTabIndex(), key);
                this.adapter.setActiveTab(index);
                this.scrollIntoView(index);
            }
            else {
                var focusedTabIndex = this.adapter.getFocusedTabIndex();
                if (this.isActivationKey_(key)) {
                    this.adapter.setActiveTab(focusedTabIndex);
                }
                else {
                    var index = this.determineTargetFromKey_(focusedTabIndex, key);
                    this.adapter.focusTabAtIndex(index);
                    this.scrollIntoView(index);
                }
            }
        };
        /**
         * Handles the MDCTab:interacted event
         */
        MDCTabBarFoundation.prototype.handleTabInteraction = function (evt) {
            this.adapter.setActiveTab(this.adapter.getIndexOfTabById(evt.detail.tabId));
        };
        /**
         * Scrolls the tab at the given index into view
         * @param index The tab index to make visible
         */
        MDCTabBarFoundation.prototype.scrollIntoView = function (index) {
            // Early exit if the index is out of range
            if (!this.indexIsInRange_(index)) {
                return;
            }
            // Always scroll to 0 if scrolling to the 0th index
            if (index === 0) {
                return this.adapter.scrollTo(0);
            }
            // Always scroll to the max value if scrolling to the Nth index
            // MDCTabScroller.scrollTo() will never scroll past the max possible value
            if (index === this.adapter.getTabListLength() - 1) {
                return this.adapter.scrollTo(this.adapter.getScrollContentWidth());
            }
            if (this.isRTL_()) {
                return this.scrollIntoViewRTL_(index);
            }
            this.scrollIntoView_(index);
        };
        /**
         * Private method for determining the index of the destination tab based on what key was pressed
         * @param origin The original index from which to determine the destination
         * @param key The name of the key
         */
        MDCTabBarFoundation.prototype.determineTargetFromKey_ = function (origin, key) {
            var isRTL = this.isRTL_();
            var maxIndex = this.adapter.getTabListLength() - 1;
            var shouldGoToEnd = key === strings.END_KEY;
            var shouldDecrement = key === strings.ARROW_LEFT_KEY && !isRTL || key === strings.ARROW_RIGHT_KEY && isRTL;
            var shouldIncrement = key === strings.ARROW_RIGHT_KEY && !isRTL || key === strings.ARROW_LEFT_KEY && isRTL;
            var index = origin;
            if (shouldGoToEnd) {
                index = maxIndex;
            }
            else if (shouldDecrement) {
                index -= 1;
            }
            else if (shouldIncrement) {
                index += 1;
            }
            else {
                index = 0;
            }
            if (index < 0) {
                index = maxIndex;
            }
            else if (index > maxIndex) {
                index = 0;
            }
            return index;
        };
        /**
         * Calculates the scroll increment that will make the tab at the given index visible
         * @param index The index of the tab
         * @param nextIndex The index of the next tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the Tab Bar
         */
        MDCTabBarFoundation.prototype.calculateScrollIncrement_ = function (index, nextIndex, scrollPosition, barWidth) {
            var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
            var relativeContentLeft = nextTabDimensions.contentLeft - scrollPosition - barWidth;
            var relativeContentRight = nextTabDimensions.contentRight - scrollPosition;
            var leftIncrement = relativeContentRight - numbers.EXTRA_SCROLL_AMOUNT;
            var rightIncrement = relativeContentLeft + numbers.EXTRA_SCROLL_AMOUNT;
            if (nextIndex < index) {
                return Math.min(leftIncrement, 0);
            }
            return Math.max(rightIncrement, 0);
        };
        /**
         * Calculates the scroll increment that will make the tab at the given index visible in RTL
         * @param index The index of the tab
         * @param nextIndex The index of the next tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the Tab Bar
         * @param scrollContentWidth The width of the scroll content
         */
        MDCTabBarFoundation.prototype.calculateScrollIncrementRTL_ = function (index, nextIndex, scrollPosition, barWidth, scrollContentWidth) {
            var nextTabDimensions = this.adapter.getTabDimensionsAtIndex(nextIndex);
            var relativeContentLeft = scrollContentWidth - nextTabDimensions.contentLeft - scrollPosition;
            var relativeContentRight = scrollContentWidth - nextTabDimensions.contentRight - scrollPosition - barWidth;
            var leftIncrement = relativeContentRight + numbers.EXTRA_SCROLL_AMOUNT;
            var rightIncrement = relativeContentLeft - numbers.EXTRA_SCROLL_AMOUNT;
            if (nextIndex > index) {
                return Math.max(leftIncrement, 0);
            }
            return Math.min(rightIncrement, 0);
        };
        /**
         * Determines the index of the adjacent tab closest to either edge of the Tab Bar
         * @param index The index of the tab
         * @param tabDimensions The dimensions of the tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the tab bar
         */
        MDCTabBarFoundation.prototype.findAdjacentTabIndexClosestToEdge_ = function (index, tabDimensions, scrollPosition, barWidth) {
            /**
             * Tabs are laid out in the Tab Scroller like this:
             *
             *    Scroll Position
             *    +---+
             *    |   |   Bar Width
             *    |   +-----------------------------------+
             *    |   |                                   |
             *    |   V                                   V
             *    |   +-----------------------------------+
             *    V   |             Tab Scroller          |
             *    +------------+--------------+-------------------+
             *    |    Tab     |      Tab     |        Tab        |
             *    +------------+--------------+-------------------+
             *        |                                   |
             *        +-----------------------------------+
             *
             * To determine the next adjacent index, we look at the Tab root left and
             * Tab root right, both relative to the scroll position. If the Tab root
             * left is less than 0, then we know it's out of view to the left. If the
             * Tab root right minus the bar width is greater than 0, we know the Tab is
             * out of view to the right. From there, we either increment or decrement
             * the index.
             */
            var relativeRootLeft = tabDimensions.rootLeft - scrollPosition;
            var relativeRootRight = tabDimensions.rootRight - scrollPosition - barWidth;
            var relativeRootDelta = relativeRootLeft + relativeRootRight;
            var leftEdgeIsCloser = relativeRootLeft < 0 || relativeRootDelta < 0;
            var rightEdgeIsCloser = relativeRootRight > 0 || relativeRootDelta > 0;
            if (leftEdgeIsCloser) {
                return index - 1;
            }
            if (rightEdgeIsCloser) {
                return index + 1;
            }
            return -1;
        };
        /**
         * Determines the index of the adjacent tab closest to either edge of the Tab Bar in RTL
         * @param index The index of the tab
         * @param tabDimensions The dimensions of the tab
         * @param scrollPosition The current scroll position
         * @param barWidth The width of the tab bar
         * @param scrollContentWidth The width of the scroller content
         */
        MDCTabBarFoundation.prototype.findAdjacentTabIndexClosestToEdgeRTL_ = function (index, tabDimensions, scrollPosition, barWidth, scrollContentWidth) {
            var rootLeft = scrollContentWidth - tabDimensions.rootLeft - barWidth - scrollPosition;
            var rootRight = scrollContentWidth - tabDimensions.rootRight - scrollPosition;
            var rootDelta = rootLeft + rootRight;
            var leftEdgeIsCloser = rootLeft > 0 || rootDelta > 0;
            var rightEdgeIsCloser = rootRight < 0 || rootDelta < 0;
            if (leftEdgeIsCloser) {
                return index + 1;
            }
            if (rightEdgeIsCloser) {
                return index - 1;
            }
            return -1;
        };
        /**
         * Returns the key associated with a keydown event
         * @param evt The keydown event
         */
        MDCTabBarFoundation.prototype.getKeyFromEvent_ = function (evt) {
            if (ACCEPTABLE_KEYS.has(evt.key)) {
                return evt.key;
            }
            return KEYCODE_MAP.get(evt.keyCode);
        };
        MDCTabBarFoundation.prototype.isActivationKey_ = function (key) {
            return key === strings.SPACE_KEY || key === strings.ENTER_KEY;
        };
        /**
         * Returns whether a given index is inclusively between the ends
         * @param index The index to test
         */
        MDCTabBarFoundation.prototype.indexIsInRange_ = function (index) {
            return index >= 0 && index < this.adapter.getTabListLength();
        };
        /**
         * Returns the view's RTL property
         */
        MDCTabBarFoundation.prototype.isRTL_ = function () {
            return this.adapter.isRTL();
        };
        /**
         * Scrolls the tab at the given index into view for left-to-right user agents.
         * @param index The index of the tab to scroll into view
         */
        MDCTabBarFoundation.prototype.scrollIntoView_ = function (index) {
            var scrollPosition = this.adapter.getScrollPosition();
            var barWidth = this.adapter.getOffsetWidth();
            var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
            var nextIndex = this.findAdjacentTabIndexClosestToEdge_(index, tabDimensions, scrollPosition, barWidth);
            if (!this.indexIsInRange_(nextIndex)) {
                return;
            }
            var scrollIncrement = this.calculateScrollIncrement_(index, nextIndex, scrollPosition, barWidth);
            this.adapter.incrementScroll(scrollIncrement);
        };
        /**
         * Scrolls the tab at the given index into view in RTL
         * @param index The tab index to make visible
         */
        MDCTabBarFoundation.prototype.scrollIntoViewRTL_ = function (index) {
            var scrollPosition = this.adapter.getScrollPosition();
            var barWidth = this.adapter.getOffsetWidth();
            var tabDimensions = this.adapter.getTabDimensionsAtIndex(index);
            var scrollWidth = this.adapter.getScrollContentWidth();
            var nextIndex = this.findAdjacentTabIndexClosestToEdgeRTL_(index, tabDimensions, scrollPosition, barWidth, scrollWidth);
            if (!this.indexIsInRange_(nextIndex)) {
                return;
            }
            var scrollIncrement = this.calculateScrollIncrementRTL_(index, nextIndex, scrollPosition, barWidth, scrollWidth);
            this.adapter.incrementScroll(scrollIncrement);
        };
        return MDCTabBarFoundation;
    }(MDCFoundation));

    /* node_modules/@smui/tab-scroller/TabScroller.svelte generated by Svelte v3.49.0 */

    const file$9 = "node_modules/@smui/tab-scroller/TabScroller.svelte";

    function create_fragment$a(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div0_style_value;
    	let useActions_action;
    	let div1_class_value;
    	let div1_style_value;
    	let useActions_action_1;
    	let div2_class_value;
    	let useActions_action_2;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	let div0_levels = [
    		{
    			class: div0_class_value = classMap({
    				[/*scrollContent$class*/ ctx[6]]: true,
    				'mdc-tab-scroller__scroll-content': true
    			})
    		},
    		{
    			style: div0_style_value = Object.entries(/*scrollContentStyles*/ ctx[14]).map(func).join(' ')
    		},
    		prefixFilter(/*$$restProps*/ ctx[16], 'scrollContent$')
    	];

    	let div0_data = {};

    	for (let i = 0; i < div0_levels.length; i += 1) {
    		div0_data = assign(div0_data, div0_levels[i]);
    	}

    	let div1_levels = [
    		{
    			class: div1_class_value = classMap({
    				[/*scrollArea$class*/ ctx[4]]: true,
    				'mdc-tab-scroller__scroll-area': true,
    				.../*scrollAreaClasses*/ ctx[12]
    			})
    		},
    		{
    			style: div1_style_value = Object.entries(/*scrollAreaStyles*/ ctx[13]).map(func_1).join(' ')
    		},
    		prefixFilter(/*$$restProps*/ ctx[16], 'scrollArea$')
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	let div2_levels = [
    		{
    			class: div2_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-tab-scroller': true,
    				'mdc-tab-scroller--align-start': /*align*/ ctx[2] === 'start',
    				'mdc-tab-scroller--align-end': /*align*/ ctx[2] === 'end',
    				'mdc-tab-scroller--align-center': /*align*/ ctx[2] === 'center',
    				.../*internalClasses*/ ctx[11]
    			})
    		},
    		exclude(/*$$restProps*/ ctx[16], ['scrollArea$', 'scrollContent$'])
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div0, div0_data);
    			add_location(div0, file$9, 32, 4, 1108);
    			set_attributes(div1, div1_data);
    			add_location(div1, file$9, 14, 2, 406);
    			set_attributes(div2, div2_data);
    			add_location(div2, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[24](div0);
    			/*div1_binding*/ ctx[26](div1);
    			/*div2_binding*/ ctx[32](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div0, /*scrollContent$use*/ ctx[5])),
    					listen_dev(div0, "transitionend", /*transitionend_handler*/ ctx[25], false, false, false),
    					action_destroyer(useActions_action_1 = useActions.call(null, div1, /*scrollArea$use*/ ctx[3])),
    					listen_dev(div1, "wheel", /*wheel_handler*/ ctx[27], { passive: true }, false, false),
    					listen_dev(div1, "touchstart", /*touchstart_handler*/ ctx[28], { passive: true }, false, false),
    					listen_dev(div1, "pointerdown", /*pointerdown_handler*/ ctx[29], false, false, false),
    					listen_dev(div1, "mousedown", /*mousedown_handler*/ ctx[30], false, false, false),
    					listen_dev(div1, "keydown", /*keydown_handler*/ ctx[31], false, false, false),
    					action_destroyer(useActions_action_2 = useActions.call(null, div2, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[15].call(null, div2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div0, div0_data = get_spread_update(div0_levels, [
    				(!current || dirty[0] & /*scrollContent$class*/ 64 && div0_class_value !== (div0_class_value = classMap({
    					[/*scrollContent$class*/ ctx[6]]: true,
    					'mdc-tab-scroller__scroll-content': true
    				}))) && { class: div0_class_value },
    				(!current || dirty[0] & /*scrollContentStyles*/ 16384 && div0_style_value !== (div0_style_value = Object.entries(/*scrollContentStyles*/ ctx[14]).map(func).join(' '))) && { style: div0_style_value },
    				dirty[0] & /*$$restProps*/ 65536 && prefixFilter(/*$$restProps*/ ctx[16], 'scrollContent$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*scrollContent$use*/ 32) useActions_action.update.call(null, /*scrollContent$use*/ ctx[5]);

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				(!current || dirty[0] & /*scrollArea$class, scrollAreaClasses*/ 4112 && div1_class_value !== (div1_class_value = classMap({
    					[/*scrollArea$class*/ ctx[4]]: true,
    					'mdc-tab-scroller__scroll-area': true,
    					.../*scrollAreaClasses*/ ctx[12]
    				}))) && { class: div1_class_value },
    				(!current || dirty[0] & /*scrollAreaStyles*/ 8192 && div1_style_value !== (div1_style_value = Object.entries(/*scrollAreaStyles*/ ctx[13]).map(func_1).join(' '))) && { style: div1_style_value },
    				dirty[0] & /*$$restProps*/ 65536 && prefixFilter(/*$$restProps*/ ctx[16], 'scrollArea$')
    			]));

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty[0] & /*scrollArea$use*/ 8) useActions_action_1.update.call(null, /*scrollArea$use*/ ctx[3]);

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty[0] & /*className, align, internalClasses*/ 2054 && div2_class_value !== (div2_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-tab-scroller': true,
    					'mdc-tab-scroller--align-start': /*align*/ ctx[2] === 'start',
    					'mdc-tab-scroller--align-end': /*align*/ ctx[2] === 'end',
    					'mdc-tab-scroller--align-center': /*align*/ ctx[2] === 'center',
    					.../*internalClasses*/ ctx[11]
    				}))) && { class: div2_class_value },
    				dirty[0] & /*$$restProps*/ 65536 && exclude(/*$$restProps*/ ctx[16], ['scrollArea$', 'scrollContent$'])
    			]));

    			if (useActions_action_2 && is_function(useActions_action_2.update) && dirty[0] & /*use*/ 1) useActions_action_2.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[24](null);
    			/*div1_binding*/ ctx[26](null);
    			/*div2_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([name, value]) => `${name}: ${value};`;
    const func_1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","align","scrollArea$use","scrollArea$class","scrollContent$use","scrollContent$class","getScrollPosition","getScrollContentWidth","incrementScroll","scrollTo","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabScroller', slots, ['default']);
    	const { matches } = ponyfill;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { align = null } = $$props;
    	let { scrollArea$use = [] } = $$props;
    	let { scrollArea$class = '' } = $$props;
    	let { scrollContent$use = [] } = $$props;
    	let { scrollContent$class = '' } = $$props;
    	let element;
    	let instance;
    	let scrollArea;
    	let scrollContent;
    	let internalClasses = {};
    	let scrollAreaClasses = {};
    	let scrollAreaStyles = {};
    	let scrollContentStyles = {};

    	onMount(() => {
    		$$invalidate(8, instance = new MDCTabScrollerFoundation({
    				eventTargetMatchesSelector: (evtTarget, selector) => matches(evtTarget, selector),
    				addClass,
    				removeClass,
    				addScrollAreaClass,
    				setScrollAreaStyleProperty: addScrollAreaStyle,
    				setScrollContentStyleProperty: addScrollContentStyle,
    				getScrollContentStyleValue: getScrollContentStyle,
    				setScrollAreaScrollLeft: scrollX => $$invalidate(9, scrollArea.scrollLeft = scrollX, scrollArea),
    				getScrollAreaScrollLeft: () => scrollArea.scrollLeft,
    				getScrollContentOffsetWidth: () => scrollContent.offsetWidth,
    				getScrollAreaOffsetWidth: () => scrollArea.offsetWidth,
    				computeScrollAreaClientRect: () => scrollArea.getBoundingClientRect(),
    				computeScrollContentClientRect: () => scrollContent.getBoundingClientRect(),
    				computeHorizontalScrollbarHeight: () => computeHorizontalScrollbarHeight(document)
    			}));

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(11, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addScrollAreaClass(className) {
    		if (!scrollAreaClasses[className]) {
    			$$invalidate(12, scrollAreaClasses[className] = true, scrollAreaClasses);
    		}
    	}

    	function addScrollAreaStyle(name, value) {
    		if (scrollAreaStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete scrollAreaStyles[name];
    				$$invalidate(13, scrollAreaStyles);
    			} else {
    				$$invalidate(13, scrollAreaStyles[name] = value, scrollAreaStyles);
    			}
    		}
    	}

    	function addScrollContentStyle(name, value) {
    		if (scrollContentStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete scrollContentStyles[name];
    				$$invalidate(14, scrollContentStyles);
    			} else {
    				$$invalidate(14, scrollContentStyles[name] = value, scrollContentStyles);
    			}
    		}
    	}

    	function getScrollContentStyle(name) {
    		return name in scrollContentStyles
    		? scrollContentStyles[name]
    		: getComputedStyle(scrollContent).getPropertyValue(name);
    	}

    	function getScrollPosition() {
    		return instance.getScrollPosition();
    	}

    	function getScrollContentWidth() {
    		return scrollContent.offsetWidth;
    	}

    	function incrementScroll(scrollXIncrement) {
    		instance.incrementScroll(scrollXIncrement);
    	}

    	function scrollTo(scrollX) {
    		instance.scrollTo(scrollX);
    	}

    	function getElement() {
    		return element;
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			scrollContent = $$value;
    			$$invalidate(10, scrollContent);
    		});
    	}

    	const transitionend_handler = event => instance && instance.handleTransitionEnd(event);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			scrollArea = $$value;
    			$$invalidate(9, scrollArea);
    		});
    	}

    	const wheel_handler = () => instance && instance.handleInteraction();
    	const touchstart_handler = () => instance && instance.handleInteraction();
    	const pointerdown_handler = () => instance && instance.handleInteraction();
    	const mousedown_handler = () => instance && instance.handleInteraction();
    	const keydown_handler = () => instance && instance.handleInteraction();

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(7, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('scrollArea$use' in $$new_props) $$invalidate(3, scrollArea$use = $$new_props.scrollArea$use);
    		if ('scrollArea$class' in $$new_props) $$invalidate(4, scrollArea$class = $$new_props.scrollArea$class);
    		if ('scrollContent$use' in $$new_props) $$invalidate(5, scrollContent$use = $$new_props.scrollContent$use);
    		if ('scrollContent$class' in $$new_props) $$invalidate(6, scrollContent$class = $$new_props.scrollContent$class);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabScrollerFoundation,
    		util,
    		ponyfill,
    		onMount,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		matches,
    		forwardEvents,
    		use,
    		className,
    		align,
    		scrollArea$use,
    		scrollArea$class,
    		scrollContent$use,
    		scrollContent$class,
    		element,
    		instance,
    		scrollArea,
    		scrollContent,
    		internalClasses,
    		scrollAreaClasses,
    		scrollAreaStyles,
    		scrollContentStyles,
    		addClass,
    		removeClass,
    		addScrollAreaClass,
    		addScrollAreaStyle,
    		addScrollContentStyle,
    		getScrollContentStyle,
    		getScrollPosition,
    		getScrollContentWidth,
    		incrementScroll,
    		scrollTo,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('scrollArea$use' in $$props) $$invalidate(3, scrollArea$use = $$new_props.scrollArea$use);
    		if ('scrollArea$class' in $$props) $$invalidate(4, scrollArea$class = $$new_props.scrollArea$class);
    		if ('scrollContent$use' in $$props) $$invalidate(5, scrollContent$use = $$new_props.scrollContent$use);
    		if ('scrollContent$class' in $$props) $$invalidate(6, scrollContent$class = $$new_props.scrollContent$class);
    		if ('element' in $$props) $$invalidate(7, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(8, instance = $$new_props.instance);
    		if ('scrollArea' in $$props) $$invalidate(9, scrollArea = $$new_props.scrollArea);
    		if ('scrollContent' in $$props) $$invalidate(10, scrollContent = $$new_props.scrollContent);
    		if ('internalClasses' in $$props) $$invalidate(11, internalClasses = $$new_props.internalClasses);
    		if ('scrollAreaClasses' in $$props) $$invalidate(12, scrollAreaClasses = $$new_props.scrollAreaClasses);
    		if ('scrollAreaStyles' in $$props) $$invalidate(13, scrollAreaStyles = $$new_props.scrollAreaStyles);
    		if ('scrollContentStyles' in $$props) $$invalidate(14, scrollContentStyles = $$new_props.scrollContentStyles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		align,
    		scrollArea$use,
    		scrollArea$class,
    		scrollContent$use,
    		scrollContent$class,
    		element,
    		instance,
    		scrollArea,
    		scrollContent,
    		internalClasses,
    		scrollAreaClasses,
    		scrollAreaStyles,
    		scrollContentStyles,
    		forwardEvents,
    		$$restProps,
    		getScrollPosition,
    		getScrollContentWidth,
    		incrementScroll,
    		scrollTo,
    		getElement,
    		$$scope,
    		slots,
    		div0_binding,
    		transitionend_handler,
    		div1_binding,
    		wheel_handler,
    		touchstart_handler,
    		pointerdown_handler,
    		mousedown_handler,
    		keydown_handler,
    		div2_binding
    	];
    }

    class TabScroller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$1,
    			create_fragment$a,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				align: 2,
    				scrollArea$use: 3,
    				scrollArea$class: 4,
    				scrollContent$use: 5,
    				scrollContent$class: 6,
    				getScrollPosition: 17,
    				getScrollContentWidth: 18,
    				incrementScroll: 19,
    				scrollTo: 20,
    				getElement: 21
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabScroller",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollArea$use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollArea$use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollArea$class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollArea$class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollContent$use() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollContent$use(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollContent$class() {
    		throw new Error("<TabScroller>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollContent$class(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getScrollPosition() {
    		return this.$$.ctx[17];
    	}

    	set getScrollPosition(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getScrollContentWidth() {
    		return this.$$.ctx[18];
    	}

    	set getScrollContentWidth(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get incrementScroll() {
    		return this.$$.ctx[19];
    	}

    	set incrementScroll(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollTo() {
    		return this.$$.ctx[20];
    	}

    	set scrollTo(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[21];
    	}

    	set getElement(value) {
    		throw new Error("<TabScroller>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@smui/tab-bar/TabBar.svelte generated by Svelte v3.49.0 */
    const file$8 = "node_modules/@smui/tab-bar/TabBar.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[34] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({ tab: dirty[0] & /*tabs*/ 4 });
    const get_default_slot_context = ctx => ({ tab: /*tab*/ ctx[32] });

    // (21:4) {#each tabs as tab, i (key(tab))}
    function create_each_block$3(key_2, ctx) {
    	let first;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[27], get_default_slot_context);

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			first = empty$1();
    			if (default_slot) default_slot.c();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, tabs*/ 134217732)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[27], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(21:4) {#each tabs as tab, i (key(tab))}",
    		ctx
    	});

    	return block;
    }

    // (17:2) <TabScroller     bind:this={tabScroller}     {...prefixFilter($$restProps, 'tabScroller$')}   >
    function create_default_slot$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*tabs*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*key*/ ctx[3](/*tab*/ ctx[32]);
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$$scope, tabs, key*/ 134217740) {
    				each_value = /*tabs*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$3, each_1_anchor, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(17:2) <TabScroller     bind:this={tabScroller}     {...prefixFilter($$restProps, 'tabScroller$')}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let tabscroller;
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const tabscroller_spread_levels = [prefixFilter(/*$$restProps*/ ctx[10], 'tabScroller$')];

    	let tabscroller_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tabscroller_spread_levels.length; i += 1) {
    		tabscroller_props = assign(tabscroller_props, tabscroller_spread_levels[i]);
    	}

    	tabscroller = new TabScroller({ props: tabscroller_props, $$inline: true });
    	/*tabscroller_binding*/ ctx[21](tabscroller);

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-tab-bar': true
    			})
    		},
    		{ role: "tablist" },
    		exclude(/*$$restProps*/ ctx[10], ['tabScroller$'])
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tabscroller.$$.fragment);
    			set_attributes(div, div_data);
    			add_location(div, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tabscroller, div, null);
    			/*div_binding*/ ctx[22](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, div)),
    					listen_dev(div, "SMUI:tab:mount", /*SMUI_tab_mount_handler*/ ctx[23], false, false, false),
    					listen_dev(div, "SMUI:tab:unmount", /*SMUI_tab_unmount_handler*/ ctx[24], false, false, false),
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[25], false, false, false),
    					listen_dev(div, "MDCTab:interacted", /*MDCTab_interacted_handler*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const tabscroller_changes = (dirty[0] & /*$$restProps*/ 1024)
    			? get_spread_update(tabscroller_spread_levels, [get_spread_object(prefixFilter(/*$$restProps*/ ctx[10], 'tabScroller$'))])
    			: {};

    			if (dirty[0] & /*$$scope, tabs*/ 134217732) {
    				tabscroller_changes.$$scope = { dirty, ctx };
    			}

    			tabscroller.$set(tabscroller_changes);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className*/ 2 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-tab-bar': true
    				}))) && { class: div_class_value },
    				{ role: "tablist" },
    				dirty[0] & /*$$restProps*/ 1024 && exclude(/*$$restProps*/ ctx[10], ['tabScroller$'])
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabscroller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabscroller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*tabscroller_binding*/ ctx[21](null);
    			destroy_component(tabscroller);
    			/*div_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","tabs","key","focusOnActivate","focusOnProgrammatic","useAutomaticActivation","active","scrollIntoView","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabBar', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { tabs = [] } = $$props;
    	let { key = tab => tab } = $$props;
    	let { focusOnActivate = true } = $$props;
    	let { focusOnProgrammatic = false } = $$props;
    	let { useAutomaticActivation = true } = $$props;
    	let { active = null } = $$props;
    	let element;
    	let instance;
    	let tabScroller;
    	let activeIndex = tabs.indexOf(active);
    	let tabAccessorMap = {};
    	let tabAccessorWeakMap = new WeakMap();
    	let skipFocus = false;
    	setContext('SMUI:tab:focusOnActivate', focusOnActivate);
    	setContext('SMUI:tab:initialActive', active);

    	onMount(() => {
    		$$invalidate(4, instance = new MDCTabBarFoundation({
    				scrollTo: scrollX => tabScroller.scrollTo(scrollX),
    				incrementScroll: scrollXIncrement => tabScroller.incrementScroll(scrollXIncrement),
    				getScrollPosition: () => tabScroller.getScrollPosition(),
    				getScrollContentWidth: () => tabScroller.getScrollContentWidth(),
    				getOffsetWidth: () => getElement().offsetWidth,
    				isRTL: () => getComputedStyle(getElement()).getPropertyValue('direction') === 'rtl',
    				setActiveTab: index => {
    					$$invalidate(11, active = tabs[index]);
    					$$invalidate(17, activeIndex = index);
    					instance.activateTab(index);
    				},
    				activateTabAtIndex: (index, clientRect) => getAccessor(tabs[index]).activate(clientRect, skipFocus),
    				deactivateTabAtIndex: index => getAccessor(tabs[index]).deactivate(),
    				focusTabAtIndex: index => getAccessor(tabs[index]).focus(),
    				getTabIndicatorClientRectAtIndex: index => getAccessor(tabs[index]).computeIndicatorClientRect(),
    				getTabDimensionsAtIndex: index => getAccessor(tabs[index]).computeDimensions(),
    				getPreviousActiveTabIndex: () => {
    					for (let i = 0; i < tabs.length; i++) {
    						if (getAccessor(tabs[i]).active) {
    							return i;
    						}
    					}

    					return -1;
    				},
    				getFocusedTabIndex: () => {
    					const tabElements = tabs.map(tab => getAccessor(tab).element);
    					const activeElement = document.activeElement;
    					return tabElements.indexOf(activeElement);
    				},
    				getIndexOfTabById: id => tabs.indexOf(id),
    				getTabListLength: () => tabs.length,
    				notifyTabActivated: index => dispatch(getElement(), 'MDCTabBar:activated', { index })
    			}));

    		instance.init();

    		return () => {
    			instance.destroy();
    		};
    	});

    	function handleTabMount(event) {
    		const accessor = event.detail;
    		addAccessor(accessor.tabId, accessor);
    	}

    	function handleTabUnmount(event) {
    		const accessor = event.detail;
    		removeAccessor(accessor.tabId);
    	}

    	function getAccessor(tabId) {
    		return tabId instanceof Object
    		? tabAccessorWeakMap.get(tabId)
    		: tabAccessorMap[tabId];
    	}

    	function addAccessor(tabId, accessor) {
    		if (tabId instanceof Object) {
    			tabAccessorWeakMap.set(tabId, accessor);
    			$$invalidate(19, tabAccessorWeakMap);
    		} else {
    			$$invalidate(18, tabAccessorMap[tabId] = accessor, tabAccessorMap);
    			$$invalidate(18, tabAccessorMap);
    		}
    	}

    	function removeAccessor(tabId) {
    		if (tabId instanceof Object) {
    			tabAccessorWeakMap.delete(tabId);
    			$$invalidate(19, tabAccessorWeakMap);
    		} else {
    			delete tabAccessorMap[tabId];
    			$$invalidate(18, tabAccessorMap);
    		}
    	}

    	function scrollIntoView(index) {
    		instance.scrollIntoView(index);
    	}

    	function getElement() {
    		return element;
    	}

    	function tabscroller_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tabScroller = $$value;
    			$$invalidate(6, tabScroller);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	const SMUI_tab_mount_handler = event => handleTabMount(event);
    	const SMUI_tab_unmount_handler = event => handleTabUnmount(event);
    	const keydown_handler = event => instance && instance.handleKeyDown(event);
    	const MDCTab_interacted_handler = event => instance && instance.handleTabInteraction(event);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('tabs' in $$new_props) $$invalidate(2, tabs = $$new_props.tabs);
    		if ('key' in $$new_props) $$invalidate(3, key = $$new_props.key);
    		if ('focusOnActivate' in $$new_props) $$invalidate(12, focusOnActivate = $$new_props.focusOnActivate);
    		if ('focusOnProgrammatic' in $$new_props) $$invalidate(13, focusOnProgrammatic = $$new_props.focusOnProgrammatic);
    		if ('useAutomaticActivation' in $$new_props) $$invalidate(14, useAutomaticActivation = $$new_props.useAutomaticActivation);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('$$scope' in $$new_props) $$invalidate(27, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		MDCTabBarFoundation,
    		onMount,
    		setContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		TabScroller,
    		forwardEvents,
    		use,
    		className,
    		tabs,
    		key,
    		focusOnActivate,
    		focusOnProgrammatic,
    		useAutomaticActivation,
    		active,
    		element,
    		instance,
    		tabScroller,
    		activeIndex,
    		tabAccessorMap,
    		tabAccessorWeakMap,
    		skipFocus,
    		handleTabMount,
    		handleTabUnmount,
    		getAccessor,
    		addAccessor,
    		removeAccessor,
    		scrollIntoView,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('tabs' in $$props) $$invalidate(2, tabs = $$new_props.tabs);
    		if ('key' in $$props) $$invalidate(3, key = $$new_props.key);
    		if ('focusOnActivate' in $$props) $$invalidate(12, focusOnActivate = $$new_props.focusOnActivate);
    		if ('focusOnProgrammatic' in $$props) $$invalidate(13, focusOnProgrammatic = $$new_props.focusOnProgrammatic);
    		if ('useAutomaticActivation' in $$props) $$invalidate(14, useAutomaticActivation = $$new_props.useAutomaticActivation);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(4, instance = $$new_props.instance);
    		if ('tabScroller' in $$props) $$invalidate(6, tabScroller = $$new_props.tabScroller);
    		if ('activeIndex' in $$props) $$invalidate(17, activeIndex = $$new_props.activeIndex);
    		if ('tabAccessorMap' in $$props) $$invalidate(18, tabAccessorMap = $$new_props.tabAccessorMap);
    		if ('tabAccessorWeakMap' in $$props) $$invalidate(19, tabAccessorWeakMap = $$new_props.tabAccessorWeakMap);
    		if ('skipFocus' in $$props) skipFocus = $$new_props.skipFocus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*active, tabs, activeIndex, instance, focusOnProgrammatic*/ 141332) {
    			if (active !== tabs[activeIndex]) {
    				$$invalidate(17, activeIndex = tabs.indexOf(active));

    				if (instance) {
    					skipFocus = !focusOnProgrammatic;
    					instance.activateTab(activeIndex);
    					skipFocus = false;
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tabs, tabAccessorWeakMap, tabAccessorMap, activeIndex*/ 917508) {
    			if (tabs.length) {
    				// Manually get the accessor so it is reactive.
    				const accessor = tabs[0] instanceof Object
    				? tabAccessorWeakMap.get(tabs[0])
    				: tabAccessorMap[tabs[0]];

    				if (accessor) {
    					accessor.forceAccessible(activeIndex === -1);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, useAutomaticActivation*/ 16400) {
    			if (instance) {
    				instance.setUseAutomaticActivation(useAutomaticActivation);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		tabs,
    		key,
    		instance,
    		element,
    		tabScroller,
    		forwardEvents,
    		handleTabMount,
    		handleTabUnmount,
    		$$restProps,
    		active,
    		focusOnActivate,
    		focusOnProgrammatic,
    		useAutomaticActivation,
    		scrollIntoView,
    		getElement,
    		activeIndex,
    		tabAccessorMap,
    		tabAccessorWeakMap,
    		slots,
    		tabscroller_binding,
    		div_binding,
    		SMUI_tab_mount_handler,
    		SMUI_tab_unmount_handler,
    		keydown_handler,
    		MDCTab_interacted_handler,
    		$$scope
    	];
    }

    class TabBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				tabs: 2,
    				key: 3,
    				focusOnActivate: 12,
    				focusOnProgrammatic: 13,
    				useAutomaticActivation: 14,
    				active: 11,
    				scrollIntoView: 15,
    				getElement: 16
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabBar",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get use() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusOnActivate() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusOnActivate(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusOnProgrammatic() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusOnProgrammatic(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useAutomaticActivation() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useAutomaticActivation(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TabBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollIntoView() {
    		return this.$$.ctx[15];
    	}

    	set scrollIntoView(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[16];
    	}

    	set getElement(value) {
    		throw new Error("<TabBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MakeEntryDialog.svelte generated by Svelte v3.49.0 */

    const file$7 = "src/MakeEntryDialog.svelte";

    // (75:4) {:else}
    function create_else_block$6(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$7, 75, 4, 1611);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$7, 75, 56, 1663);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[15]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 1 && input.value !== /*admin_pass*/ ctx[0]) {
    				set_input_value(input, /*admin_pass*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(75:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (73:4) {#if password_view_type }
    function create_if_block$6(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$7, 73, 4, 1477);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$7, 73, 56, 1529);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[14]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 1 && input.value !== /*admin_pass*/ ctx[0]) {
    				set_input_value(input, /*admin_pass*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(73:4) {#if password_view_type }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let button0;
    	let t4;
    	let div5;
    	let div1;
    	let label0;
    	let t6;
    	let input0;
    	let t7;
    	let div2;
    	let label1;
    	let t9;
    	let input1;
    	let t10;
    	let div3;
    	let span0;
    	let t12;
    	let input2;
    	let t13;
    	let span1;
    	let t15;
    	let input3;
    	let t16;
    	let div4;
    	let label2;
    	let t18;
    	let input4;
    	let t19;
    	let div6;
    	let button1;
    	let t21;
    	let button2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*password_view_type*/ ctx[6]) return create_if_block$6;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text$1(/*message*/ ctx[5]);
    			t1 = space$1();
    			div0 = element("div");
    			if_block.c();
    			t2 = space$1();
    			button0 = element("button");
    			button0.textContent = "👁";
    			t4 = space$1();
    			div5 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t6 = text$1("  \n        ");
    			input0 = element("input");
    			t7 = space$1();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Runner:";
    			t9 = text$1("  \n        ");
    			input1 = element("input");
    			t10 = space$1();
    			div3 = element("div");
    			span0 = element("span");
    			span0.textContent = "Run On Start:";
    			t12 = space$1();
    			input2 = element("input");
    			t13 = text$1("\n            \n        ");
    			span1 = element("span");
    			span1.textContent = "Attempt Reconnect:";
    			t15 = space$1();
    			input3 = element("input");
    			t16 = space$1();
    			div4 = element("div");
    			label2 = element("label");
    			label2.textContent = "Parameters:";
    			t18 = text$1("  ");
    			input4 = element("input");
    			t19 = space$1();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t21 = space$1();
    			button2 = element("button");
    			button2.textContent = "Okay";
    			add_location(h2, file$7, 70, 2, 1371);
    			set_style(button0, "font-size", "larger");
    			add_location(button0, file$7, 77, 4, 1739);
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "text-align", "left");
    			add_location(div0, file$7, 71, 2, 1392);
    			attr_dev(label0, "for", "new-name");
    			add_location(label0, file$7, 82, 8, 1890);
    			attr_dev(input0, "id", "new-name");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$7, 83, 8, 1946);
    			attr_dev(div1, "class", "eform svelte-12ml3r5");
    			add_location(div1, file$7, 81, 4, 1862);
    			attr_dev(label1, "for", "new-runner");
    			add_location(label1, file$7, 86, 8, 2048);
    			attr_dev(input1, "id", "new-runner");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$7, 87, 8, 2108);
    			attr_dev(div2, "class", "eform svelte-12ml3r5");
    			add_location(div2, file$7, 85, 4, 2020);
    			attr_dev(span0, "for", "run_on_start");
    			add_location(span0, file$7, 90, 8, 2210);
    			attr_dev(input2, "id", "run_on_start");
    			attr_dev(input2, "type", "checkbox");
    			add_location(input2, file$7, 90, 54, 2256);
    			attr_dev(span1, "for", "attempt_reconnect");
    			add_location(span1, file$7, 92, 8, 2369);
    			attr_dev(input3, "id", "attempt_reconnect");
    			attr_dev(input3, "type", "checkbox");
    			add_location(input3, file$7, 92, 64, 2425);
    			attr_dev(div3, "class", "eform svelte-12ml3r5");
    			add_location(div3, file$7, 89, 4, 2182);
    			attr_dev(label2, "for", "new-args");
    			add_location(label2, file$7, 95, 8, 2550);
    			attr_dev(input4, "id", "new-args");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file$7, 95, 61, 2603);
    			attr_dev(div4, "class", "eform svelte-12ml3r5");
    			add_location(div4, file$7, 94, 4, 2522);
    			attr_dev(div5, "class", "eform svelte-12ml3r5");
    			add_location(div5, file$7, 79, 2, 1837);
    			add_location(button1, file$7, 101, 6, 2709);
    			add_location(button2, file$7, 104, 6, 2778);
    			attr_dev(div6, "class", "buttons svelte-12ml3r5");
    			add_location(div6, file$7, 100, 2, 2681);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			if_block.m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t6);
    			append_dev(div1, input0);
    			set_input_value(input0, /*new_name*/ ctx[7]);
    			append_dev(div5, t7);
    			append_dev(div5, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t9);
    			append_dev(div2, input1);
    			set_input_value(input1, /*runner*/ ctx[3]);
    			append_dev(div5, t10);
    			append_dev(div5, div3);
    			append_dev(div3, span0);
    			append_dev(div3, t12);
    			append_dev(div3, input2);
    			input2.checked = /*run_on_start*/ ctx[1];
    			append_dev(div3, t13);
    			append_dev(div3, span1);
    			append_dev(div3, t15);
    			append_dev(div3, input3);
    			input3.checked = /*attempt_reconnect*/ ctx[2];
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, label2);
    			append_dev(div4, t18);
    			append_dev(div4, input4);
    			set_input_value(input4, /*args*/ ctx[4]);
    			insert_dev(target, t19, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, button1);
    			append_dev(div6, t21);
    			append_dev(div6, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle_password_view*/ ctx[8], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[16]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[17]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[18]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[19]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[20]),
    					listen_dev(button1, "click", /*_onCancel*/ ctx[9], false, false, false),
    					listen_dev(button2, "click", /*_onOkay*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 32) set_data_dev(t0, /*message*/ ctx[5]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, t2);
    				}
    			}

    			if (dirty & /*new_name*/ 128 && input0.value !== /*new_name*/ ctx[7]) {
    				set_input_value(input0, /*new_name*/ ctx[7]);
    			}

    			if (dirty & /*runner*/ 8 && input1.value !== /*runner*/ ctx[3]) {
    				set_input_value(input1, /*runner*/ ctx[3]);
    			}

    			if (dirty & /*run_on_start*/ 2) {
    				input2.checked = /*run_on_start*/ ctx[1];
    			}

    			if (dirty & /*attempt_reconnect*/ 4) {
    				input3.checked = /*attempt_reconnect*/ ctx[2];
    			}

    			if (dirty & /*args*/ 16 && input4.value !== /*args*/ ctx[4]) {
    				set_input_value(input4, /*args*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t19);
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MakeEntryDialog', slots, []);
    	let { message } = $$props;

    	let { onCancel = () => {
    		
    	} } = $$props;

    	let { onOkay = () => {
    		
    	} } = $$props;

    	let { admin_pass } = $$props;
    	let { name = "" } = $$props;
    	let { run_on_start = true } = $$props;
    	let { attempt_reconnect = false } = $$props;
    	let { runner = "node" } = $$props;
    	let { args = "" } = $$props;
    	let password_view_type = true;

    	function toggle_password_view(ev) {
    		$$invalidate(6, password_view_type = !password_view_type);
    	}

    	let new_name = "";

    	function _onCancel() {
    		onCancel();
    	}

    	function _onOkay() {
    		if (admin_pass.length === 0) {
    			alert("No admin password");
    			return;
    		}

    		let dialog_data = {
    			"name": new_name,
    			run_on_start,
    			attempt_reconnect,
    			runner,
    			args
    		};

    		onOkay(dialog_data);
    	}

    	const writable_props = [
    		'message',
    		'onCancel',
    		'onOkay',
    		'admin_pass',
    		'name',
    		'run_on_start',
    		'attempt_reconnect',
    		'runner',
    		'args'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MakeEntryDialog> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		admin_pass = this.value;
    		$$invalidate(0, admin_pass);
    	}

    	function input_input_handler_1() {
    		admin_pass = this.value;
    		$$invalidate(0, admin_pass);
    	}

    	function input0_input_handler() {
    		new_name = this.value;
    		($$invalidate(7, new_name), $$invalidate(13, name));
    	}

    	function input1_input_handler() {
    		runner = this.value;
    		$$invalidate(3, runner);
    	}

    	function input2_change_handler() {
    		run_on_start = this.checked;
    		$$invalidate(1, run_on_start);
    	}

    	function input3_change_handler() {
    		attempt_reconnect = this.checked;
    		$$invalidate(2, attempt_reconnect);
    	}

    	function input4_input_handler() {
    		args = this.value;
    		$$invalidate(4, args);
    	}

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(5, message = $$props.message);
    		if ('onCancel' in $$props) $$invalidate(11, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(12, onOkay = $$props.onOkay);
    		if ('admin_pass' in $$props) $$invalidate(0, admin_pass = $$props.admin_pass);
    		if ('name' in $$props) $$invalidate(13, name = $$props.name);
    		if ('run_on_start' in $$props) $$invalidate(1, run_on_start = $$props.run_on_start);
    		if ('attempt_reconnect' in $$props) $$invalidate(2, attempt_reconnect = $$props.attempt_reconnect);
    		if ('runner' in $$props) $$invalidate(3, runner = $$props.runner);
    		if ('args' in $$props) $$invalidate(4, args = $$props.args);
    	};

    	$$self.$capture_state = () => ({
    		message,
    		onCancel,
    		onOkay,
    		admin_pass,
    		name,
    		run_on_start,
    		attempt_reconnect,
    		runner,
    		args,
    		password_view_type,
    		toggle_password_view,
    		new_name,
    		_onCancel,
    		_onOkay
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(5, message = $$props.message);
    		if ('onCancel' in $$props) $$invalidate(11, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(12, onOkay = $$props.onOkay);
    		if ('admin_pass' in $$props) $$invalidate(0, admin_pass = $$props.admin_pass);
    		if ('name' in $$props) $$invalidate(13, name = $$props.name);
    		if ('run_on_start' in $$props) $$invalidate(1, run_on_start = $$props.run_on_start);
    		if ('attempt_reconnect' in $$props) $$invalidate(2, attempt_reconnect = $$props.attempt_reconnect);
    		if ('runner' in $$props) $$invalidate(3, runner = $$props.runner);
    		if ('args' in $$props) $$invalidate(4, args = $$props.args);
    		if ('password_view_type' in $$props) $$invalidate(6, password_view_type = $$props.password_view_type);
    		if ('new_name' in $$props) $$invalidate(7, new_name = $$props.new_name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name*/ 8192) {
    			$$invalidate(7, new_name = name);
    		}
    	};

    	return [
    		admin_pass,
    		run_on_start,
    		attempt_reconnect,
    		runner,
    		args,
    		message,
    		password_view_type,
    		new_name,
    		toggle_password_view,
    		_onCancel,
    		_onOkay,
    		onCancel,
    		onOkay,
    		name,
    		input_input_handler,
    		input_input_handler_1,
    		input0_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		input3_change_handler,
    		input4_input_handler
    	];
    }

    class MakeEntryDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			message: 5,
    			onCancel: 11,
    			onOkay: 12,
    			admin_pass: 0,
    			name: 13,
    			run_on_start: 1,
    			attempt_reconnect: 2,
    			runner: 3,
    			args: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MakeEntryDialog",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[5] === undefined && !('message' in props)) {
    			console.warn("<MakeEntryDialog> was created without expected prop 'message'");
    		}

    		if (/*admin_pass*/ ctx[0] === undefined && !('admin_pass' in props)) {
    			console.warn("<MakeEntryDialog> was created without expected prop 'admin_pass'");
    		}
    	}

    	get message() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCancel() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOkay() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOkay(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get admin_pass() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set admin_pass(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get run_on_start() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set run_on_start(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get attempt_reconnect() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set attempt_reconnect(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get runner() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set runner(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get args() {
    		throw new Error("<MakeEntryDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set args(value) {
    		throw new Error("<MakeEntryDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ExecDialog.svelte generated by Svelte v3.49.0 */

    const file$6 = "src/ExecDialog.svelte";

    // (62:4) {:else}
    function create_else_block$5(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$6, 62, 4, 1323);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$6, 62, 56, 1375);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 1 && input.value !== /*admin_pass*/ ctx[0]) {
    				set_input_value(input, /*admin_pass*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(62:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:4) {#if password_view_type }
    function create_if_block_1$4(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$6, 60, 4, 1189);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$6, 60, 56, 1241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 1 && input.value !== /*admin_pass*/ ctx[0]) {
    				set_input_value(input, /*admin_pass*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(60:4) {#if password_view_type }",
    		ctx
    	});

    	return block;
    }

    // (69:2) {#if hasForm}
    function create_if_block$5(ctx) {
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Runner:";
    			t1 = text$1("  \n        ");
    			input0 = element("input");
    			t2 = space$1();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Parameters:";
    			t4 = text$1("  ");
    			input1 = element("input");
    			attr_dev(label0, "for", "new-runner");
    			add_location(label0, file$6, 70, 8, 1616);
    			attr_dev(input0, "id", "new-runner");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$6, 71, 8, 1676);
    			attr_dev(div0, "class", "eform svelte-5z98r9");
    			add_location(div0, file$6, 69, 4, 1588);
    			attr_dev(label1, "for", "new-args");
    			add_location(label1, file$6, 74, 8, 1778);
    			attr_dev(input1, "id", "new-args");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$6, 74, 61, 1831);
    			attr_dev(div1, "class", "eform svelte-5z98r9");
    			add_location(div1, file$6, 73, 4, 1750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*runner*/ ctx[3]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			set_input_value(input1, /*args*/ ctx[4]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*runner*/ 8 && input0.value !== /*runner*/ ctx[3]) {
    				set_input_value(input0, /*runner*/ ctx[3]);
    			}

    			if (dirty & /*args*/ 16 && input1.value !== /*args*/ ctx[4]) {
    				set_input_value(input1, /*args*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(69:2) {#if hasForm}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let button0;
    	let t4;
    	let div1;
    	let t5;
    	let div2;
    	let button1;
    	let t7;
    	let button2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*password_view_type*/ ctx[5]) return create_if_block_1$4;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*hasForm*/ ctx[2] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text$1(/*message*/ ctx[1]);
    			t1 = space$1();
    			div0 = element("div");
    			if_block0.c();
    			t2 = space$1();
    			button0 = element("button");
    			button0.textContent = "👁";
    			t4 = space$1();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t5 = space$1();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t7 = space$1();
    			button2 = element("button");
    			button2.textContent = "Okay";
    			add_location(h2, file$6, 57, 2, 1083);
    			set_style(button0, "font-size", "larger");
    			add_location(button0, file$6, 64, 4, 1451);
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "text-align", "left");
    			add_location(div0, file$6, 58, 2, 1104);
    			attr_dev(div1, "class", "eform svelte-5z98r9");
    			add_location(div1, file$6, 66, 2, 1547);
    			add_location(button1, file$6, 80, 6, 1944);
    			add_location(button2, file$6, 83, 6, 2013);
    			attr_dev(div2, "class", "buttons svelte-5z98r9");
    			add_location(div2, file$6, 79, 2, 1916);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			if_block0.m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block1) if_block1.m(div1, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button1);
    			append_dev(div2, t7);
    			append_dev(div2, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle_password_view*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*_onCancel*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*_onOkay*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 2) set_data_dev(t0, /*message*/ ctx[1]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, t2);
    				}
    			}

    			if (/*hasForm*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if_block0.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExecDialog', slots, []);
    	let { exec_dialog_data } = $$props;
    	let { message } = $$props;
    	let { hasForm = false } = $$props;

    	let { onCancel = () => {
    		
    	} } = $$props;

    	let { onOkay = () => {
    		
    	} } = $$props;

    	let { admin_pass } = $$props;
    	let password_view_type = true;

    	function toggle_password_view(ev) {
    		$$invalidate(5, password_view_type = !password_view_type);
    	}

    	let new_name = "";

    	function _onCancel() {
    		onCancel();
    	}

    	function _onOkay() {
    		if (admin_pass.length === 0) {
    			alert("No admin password");
    			return;
    		}

    		onOkay(new_name);
    	}

    	let runner = "node";
    	let args = "";
    	const writable_props = ['exec_dialog_data', 'message', 'hasForm', 'onCancel', 'onOkay', 'admin_pass'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExecDialog> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		admin_pass = this.value;
    		$$invalidate(0, admin_pass);
    	}

    	function input_input_handler_1() {
    		admin_pass = this.value;
    		$$invalidate(0, admin_pass);
    	}

    	function input0_input_handler() {
    		runner = this.value;
    		$$invalidate(3, runner);
    	}

    	function input1_input_handler() {
    		args = this.value;
    		$$invalidate(4, args);
    	}

    	$$self.$$set = $$props => {
    		if ('exec_dialog_data' in $$props) $$invalidate(9, exec_dialog_data = $$props.exec_dialog_data);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('hasForm' in $$props) $$invalidate(2, hasForm = $$props.hasForm);
    		if ('onCancel' in $$props) $$invalidate(10, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(11, onOkay = $$props.onOkay);
    		if ('admin_pass' in $$props) $$invalidate(0, admin_pass = $$props.admin_pass);
    	};

    	$$self.$capture_state = () => ({
    		exec_dialog_data,
    		message,
    		hasForm,
    		onCancel,
    		onOkay,
    		admin_pass,
    		password_view_type,
    		toggle_password_view,
    		new_name,
    		_onCancel,
    		_onOkay,
    		runner,
    		args
    	});

    	$$self.$inject_state = $$props => {
    		if ('exec_dialog_data' in $$props) $$invalidate(9, exec_dialog_data = $$props.exec_dialog_data);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('hasForm' in $$props) $$invalidate(2, hasForm = $$props.hasForm);
    		if ('onCancel' in $$props) $$invalidate(10, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(11, onOkay = $$props.onOkay);
    		if ('admin_pass' in $$props) $$invalidate(0, admin_pass = $$props.admin_pass);
    		if ('password_view_type' in $$props) $$invalidate(5, password_view_type = $$props.password_view_type);
    		if ('new_name' in $$props) new_name = $$props.new_name;
    		if ('runner' in $$props) $$invalidate(3, runner = $$props.runner);
    		if ('args' in $$props) $$invalidate(4, args = $$props.args);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*runner, args*/ 24) {
    			$$invalidate(9, exec_dialog_data = {
    				"name": "exec",
    				runner,
    				"run_on_start": false,
    				"attempt_reconnect": false,
    				args
    			});
    		}
    	};

    	return [
    		admin_pass,
    		message,
    		hasForm,
    		runner,
    		args,
    		password_view_type,
    		toggle_password_view,
    		_onCancel,
    		_onOkay,
    		exec_dialog_data,
    		onCancel,
    		onOkay,
    		input_input_handler,
    		input_input_handler_1,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class ExecDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			exec_dialog_data: 9,
    			message: 1,
    			hasForm: 2,
    			onCancel: 10,
    			onOkay: 11,
    			admin_pass: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExecDialog",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*exec_dialog_data*/ ctx[9] === undefined && !('exec_dialog_data' in props)) {
    			console.warn("<ExecDialog> was created without expected prop 'exec_dialog_data'");
    		}

    		if (/*message*/ ctx[1] === undefined && !('message' in props)) {
    			console.warn("<ExecDialog> was created without expected prop 'message'");
    		}

    		if (/*admin_pass*/ ctx[0] === undefined && !('admin_pass' in props)) {
    			console.warn("<ExecDialog> was created without expected prop 'admin_pass'");
    		}
    	}

    	get exec_dialog_data() {
    		throw new Error("<ExecDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set exec_dialog_data(value) {
    		throw new Error("<ExecDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<ExecDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<ExecDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasForm() {
    		throw new Error("<ExecDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasForm(value) {
    		throw new Error("<ExecDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCancel() {
    		throw new Error("<ExecDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<ExecDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOkay() {
    		throw new Error("<ExecDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOkay(value) {
    		throw new Error("<ExecDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get admin_pass() {
    		throw new Error("<ExecDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set admin_pass(value) {
    		throw new Error("<ExecDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/ExecNpm.svelte generated by Svelte v3.49.0 */

    const file$5 = "src/ExecNpm.svelte";

    // (72:4) {:else}
    function create_else_block$4(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$5, 72, 4, 1603);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$5, 72, 56, 1655);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 1 && input.value !== /*admin_pass*/ ctx[0]) {
    				set_input_value(input, /*admin_pass*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(72:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:4) {#if password_view_type }
    function create_if_block_1$3(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$5, 70, 4, 1469);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$5, 70, 56, 1521);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 1 && input.value !== /*admin_pass*/ ctx[0]) {
    				set_input_value(input, /*admin_pass*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(70:4) {#if password_view_type }",
    		ctx
    	});

    	return block;
    }

    // (80:2) {#if hasForm}
    function create_if_block$4(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let div;
    	let label;
    	let t4;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text$1("Type the name of an npm module you want to ");
    			t1 = text$1(/*npm_action*/ ctx[3]);
    			t2 = space$1();
    			div = element("div");
    			label = element("label");
    			label.textContent = "module name:";
    			t4 = text$1("  ");
    			input = element("input");
    			add_location(span, file$5, 80, 4, 1869);
    			attr_dev(label, "for", "new-args");
    			add_location(label, file$5, 82, 8, 1970);
    			attr_dev(input, "id", "new-args");
    			attr_dev(input, "type", "text");
    			add_location(input, file$5, 82, 62, 2024);
    			attr_dev(div, "class", "eform svelte-12ml3r5");
    			add_location(div, file$5, 81, 4, 1942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t4);
    			append_dev(div, input);
    			set_input_value(input, /*args*/ ctx[4]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[14]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*npm_action*/ 8) set_data_dev(t1, /*npm_action*/ ctx[3]);

    			if (dirty & /*args*/ 16 && input.value !== /*args*/ ctx[4]) {
    				set_input_value(input, /*args*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(80:2) {#if hasForm}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let button0;
    	let t4;
    	let div1;
    	let t5;
    	let div2;
    	let button1;
    	let t7;
    	let button2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*password_view_type*/ ctx[5]) return create_if_block_1$3;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*hasForm*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text$1(/*message*/ ctx[1]);
    			t1 = space$1();
    			div0 = element("div");
    			if_block0.c();
    			t2 = space$1();
    			button0 = element("button");
    			button0.textContent = "👁";
    			t4 = space$1();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t5 = space$1();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t7 = space$1();
    			button2 = element("button");
    			button2.textContent = "Okay";
    			add_location(h2, file$5, 67, 2, 1363);
    			set_style(button0, "font-size", "larger");
    			add_location(button0, file$5, 74, 4, 1731);
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "text-align", "left");
    			add_location(div0, file$5, 68, 2, 1384);
    			attr_dev(div1, "class", "eform svelte-12ml3r5");
    			add_location(div1, file$5, 77, 2, 1828);
    			add_location(button1, file$5, 88, 6, 2137);
    			add_location(button2, file$5, 91, 6, 2206);
    			attr_dev(div2, "class", "buttons svelte-12ml3r5");
    			add_location(div2, file$5, 87, 2, 2109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			if_block0.m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			if (if_block1) if_block1.m(div1, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button1);
    			append_dev(div2, t7);
    			append_dev(div2, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle_password_view*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*_onCancel*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*_onOkay*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 2) set_data_dev(t0, /*message*/ ctx[1]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, t2);
    				}
    			}

    			if (/*hasForm*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if_block0.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExecNpm', slots, []);
    	let { npm_dialog_data } = $$props;
    	let { message } = $$props;
    	let { hasForm = false } = $$props;

    	let { onCancel = () => {
    		
    	} } = $$props;

    	let { onOkay = () => {
    		
    	} } = $$props;

    	let { npm_action = "install" } = $$props;
    	let { admin_pass } = $$props;
    	let password_view_type = true;

    	function toggle_password_view(ev) {
    		$$invalidate(5, password_view_type = !password_view_type);
    	}

    	let new_name = "";

    	function _onCancel() {
    		onCancel();
    	}

    	function _onOkay() {
    		if (admin_pass.length === 0) {
    			alert("No admin password");
    			return;
    		}

    		$$invalidate(9, npm_dialog_data = {
    			"name": "exec",
    			"runner": 'npm',
    			"run_on_start": false,
    			"attempt_reconnect": false,
    			"action": npm_action,
    			args
    		});

    		onOkay(new_name);
    	}

    	let args = "";

    	const writable_props = [
    		'npm_dialog_data',
    		'message',
    		'hasForm',
    		'onCancel',
    		'onOkay',
    		'npm_action',
    		'admin_pass'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExecNpm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		admin_pass = this.value;
    		$$invalidate(0, admin_pass);
    	}

    	function input_input_handler_1() {
    		admin_pass = this.value;
    		$$invalidate(0, admin_pass);
    	}

    	function input_input_handler_2() {
    		args = this.value;
    		$$invalidate(4, args);
    	}

    	$$self.$$set = $$props => {
    		if ('npm_dialog_data' in $$props) $$invalidate(9, npm_dialog_data = $$props.npm_dialog_data);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('hasForm' in $$props) $$invalidate(2, hasForm = $$props.hasForm);
    		if ('onCancel' in $$props) $$invalidate(10, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(11, onOkay = $$props.onOkay);
    		if ('npm_action' in $$props) $$invalidate(3, npm_action = $$props.npm_action);
    		if ('admin_pass' in $$props) $$invalidate(0, admin_pass = $$props.admin_pass);
    	};

    	$$self.$capture_state = () => ({
    		npm_dialog_data,
    		message,
    		hasForm,
    		onCancel,
    		onOkay,
    		npm_action,
    		admin_pass,
    		password_view_type,
    		toggle_password_view,
    		new_name,
    		_onCancel,
    		_onOkay,
    		args
    	});

    	$$self.$inject_state = $$props => {
    		if ('npm_dialog_data' in $$props) $$invalidate(9, npm_dialog_data = $$props.npm_dialog_data);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('hasForm' in $$props) $$invalidate(2, hasForm = $$props.hasForm);
    		if ('onCancel' in $$props) $$invalidate(10, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(11, onOkay = $$props.onOkay);
    		if ('npm_action' in $$props) $$invalidate(3, npm_action = $$props.npm_action);
    		if ('admin_pass' in $$props) $$invalidate(0, admin_pass = $$props.admin_pass);
    		if ('password_view_type' in $$props) $$invalidate(5, password_view_type = $$props.password_view_type);
    		if ('new_name' in $$props) new_name = $$props.new_name;
    		if ('args' in $$props) $$invalidate(4, args = $$props.args);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*npm_action, args*/ 24) {
    			$$invalidate(9, npm_dialog_data = {
    				"name": "exec",
    				"runner": 'npm',
    				"run_on_start": false,
    				"attempt_reconnect": false,
    				"action": npm_action,
    				args
    			});
    		}
    	};

    	return [
    		admin_pass,
    		message,
    		hasForm,
    		npm_action,
    		args,
    		password_view_type,
    		toggle_password_view,
    		_onCancel,
    		_onOkay,
    		npm_dialog_data,
    		onCancel,
    		onOkay,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2
    	];
    }

    class ExecNpm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			npm_dialog_data: 9,
    			message: 1,
    			hasForm: 2,
    			onCancel: 10,
    			onOkay: 11,
    			npm_action: 3,
    			admin_pass: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExecNpm",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*npm_dialog_data*/ ctx[9] === undefined && !('npm_dialog_data' in props)) {
    			console.warn("<ExecNpm> was created without expected prop 'npm_dialog_data'");
    		}

    		if (/*message*/ ctx[1] === undefined && !('message' in props)) {
    			console.warn("<ExecNpm> was created without expected prop 'message'");
    		}

    		if (/*admin_pass*/ ctx[0] === undefined && !('admin_pass' in props)) {
    			console.warn("<ExecNpm> was created without expected prop 'admin_pass'");
    		}
    	}

    	get npm_dialog_data() {
    		throw new Error("<ExecNpm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set npm_dialog_data(value) {
    		throw new Error("<ExecNpm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<ExecNpm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<ExecNpm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasForm() {
    		throw new Error("<ExecNpm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasForm(value) {
    		throw new Error("<ExecNpm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCancel() {
    		throw new Error("<ExecNpm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<ExecNpm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOkay() {
    		throw new Error("<ExecNpm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOkay(value) {
    		throw new Error("<ExecNpm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get npm_action() {
    		throw new Error("<ExecNpm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set npm_action(value) {
    		throw new Error("<ExecNpm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get admin_pass() {
    		throw new Error("<ExecNpm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set admin_pass(value) {
    		throw new Error("<ExecNpm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@zerodevx/svelte-json-view/src/JsonView.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$4 = "node_modules/@zerodevx/svelte-json-view/src/JsonView.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (44:0) {#if items.length}
    function create_if_block$3(ctx) {
    	let span2;
    	let span0;
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let span1;
    	let t3;
    	let t4;
    	let span3;
    	let t5;
    	let t6;
    	let t7;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block0 = !/*_last*/ ctx[3] && create_if_block_2$2(ctx);
    	let if_block1 = !/*_last*/ ctx[3] && /*collapsed*/ ctx[8] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			span2 = element("span");
    			span0 = element("span");
    			t0 = text$1(/*openBracket*/ ctx[6]);
    			t1 = space$1();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space$1();
    			span1 = element("span");
    			t3 = text$1(/*closeBracket*/ ctx[7]);
    			if (if_block0) if_block0.c();
    			t4 = space$1();
    			span3 = element("span");
    			t5 = text$1(/*openBracket*/ ctx[6]);
    			t6 = text$1(collapsedSymbol);
    			t7 = text$1(/*closeBracket*/ ctx[7]);
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty$1();
    			attr_dev(span0, "class", "bracket svelte-gbh3pt");
    			attr_dev(span0, "tabindex", "0");
    			add_location(span0, file$4, 45, 4, 813);
    			attr_dev(ul, "class", "svelte-gbh3pt");
    			add_location(ul, file$4, 46, 4, 892);
    			attr_dev(span1, "class", "bracket svelte-gbh3pt");
    			attr_dev(span1, "tabindex", "0");
    			add_location(span1, file$4, 62, 4, 1410);
    			attr_dev(span2, "class", "svelte-gbh3pt");
    			toggle_class(span2, "hidden", /*collapsed*/ ctx[8]);
    			add_location(span2, file$4, 44, 2, 777);
    			attr_dev(span3, "class", "bracket svelte-gbh3pt");
    			attr_dev(span3, "tabindex", "0");
    			toggle_class(span3, "hidden", !/*collapsed*/ ctx[8]);
    			add_location(span3, file$4, 66, 2, 1558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span2, anchor);
    			append_dev(span2, span0);
    			append_dev(span0, t0);
    			append_dev(span2, t1);
    			append_dev(span2, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(span2, t2);
    			append_dev(span2, span1);
    			append_dev(span1, t3);
    			if (if_block0) if_block0.m(span2, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, span3, anchor);
    			append_dev(span3, t5);
    			append_dev(span3, t6);
    			append_dev(span3, t7);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*clicked*/ ctx[11], false, false, false),
    					listen_dev(span1, "click", /*clicked*/ ctx[11], false, false, false),
    					listen_dev(span3, "click", /*clicked*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*openBracket*/ 64) set_data_dev(t0, /*openBracket*/ ctx[6]);

    			if (dirty & /*json, items, depth, _lvl, getType, format, isArray*/ 1591) {
    				each_value = /*items*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*closeBracket*/ 128) set_data_dev(t3, /*closeBracket*/ ctx[7]);

    			if (!/*_last*/ ctx[3]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(span2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*collapsed*/ 256) {
    				toggle_class(span2, "hidden", /*collapsed*/ ctx[8]);
    			}

    			if (!current || dirty & /*openBracket*/ 64) set_data_dev(t5, /*openBracket*/ ctx[6]);
    			if (!current || dirty & /*closeBracket*/ 128) set_data_dev(t7, /*closeBracket*/ ctx[7]);

    			if (dirty & /*collapsed*/ 256) {
    				toggle_class(span3, "hidden", !/*collapsed*/ ctx[8]);
    			}

    			if (!/*_last*/ ctx[3] && /*collapsed*/ ctx[8]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span2);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(span3);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(44:0) {#if items.length}",
    		ctx
    	});

    	return block;
    }

    // (50:10) {#if !isArray}
    function create_if_block_5$2(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*i*/ ctx[12] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text$1("\"");
    			t1 = text$1(t1_value);
    			t2 = text$1("\":");
    			attr_dev(span, "class", "key");
    			add_location(span, file$4, 50, 12, 977);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 32 && t1_value !== (t1_value = /*i*/ ctx[12] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(50:10) {#if !isArray}",
    		ctx
    	});

    	return block;
    }

    // (55:10) {:else}
    function create_else_block$3(ctx) {
    	let span;
    	let t_value = /*format*/ ctx[10](/*json*/ ctx[0][/*i*/ ctx[12]]) + "";
    	let t;
    	let span_class_value;
    	let if_block = /*idx*/ ctx[14] < /*items*/ ctx[5].length - 1 && create_if_block_4$2(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text$1(t_value);
    			if (if_block) if_block.c();
    			attr_dev(span, "class", span_class_value = "val " + /*getType*/ ctx[9](/*json*/ ctx[0][/*i*/ ctx[12]]) + " svelte-gbh3pt");
    			add_location(span, file$4, 55, 12, 1201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*json, items*/ 33 && t_value !== (t_value = /*format*/ ctx[10](/*json*/ ctx[0][/*i*/ ctx[12]]) + "")) set_data_dev(t, t_value);

    			if (/*idx*/ ctx[14] < /*items*/ ctx[5].length - 1) {
    				if (if_block) ; else {
    					if_block = create_if_block_4$2(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*json, items*/ 33 && span_class_value !== (span_class_value = "val " + /*getType*/ ctx[9](/*json*/ ctx[0][/*i*/ ctx[12]]) + " svelte-gbh3pt")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(55:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:10) {#if getType(json[i]) === 'object'}
    function create_if_block_3$2(ctx) {
    	let jsonview;
    	let current;

    	jsonview = new JsonView({
    			props: {
    				json: /*json*/ ctx[0][/*i*/ ctx[12]],
    				depth: /*depth*/ ctx[1],
    				_lvl: /*_lvl*/ ctx[2] + 1,
    				_last: /*idx*/ ctx[14] === /*items*/ ctx[5].length - 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(jsonview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(jsonview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const jsonview_changes = {};
    			if (dirty & /*json, items*/ 33) jsonview_changes.json = /*json*/ ctx[0][/*i*/ ctx[12]];
    			if (dirty & /*depth*/ 2) jsonview_changes.depth = /*depth*/ ctx[1];
    			if (dirty & /*_lvl*/ 4) jsonview_changes._lvl = /*_lvl*/ ctx[2] + 1;
    			if (dirty & /*items*/ 32) jsonview_changes._last = /*idx*/ ctx[14] === /*items*/ ctx[5].length - 1;
    			jsonview.$set(jsonview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jsonview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jsonview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(jsonview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(53:10) {#if getType(json[i]) === 'object'}",
    		ctx
    	});

    	return block;
    }

    // (57:32) {#if idx < items.length - 1}
    function create_if_block_4$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = ",";
    			attr_dev(span, "class", "comma svelte-gbh3pt");
    			add_location(span, file$4, 56, 60, 1298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(57:32) {#if idx < items.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (48:6) {#each items as i, idx}
    function create_each_block$2(ctx) {
    	let li;
    	let t0;
    	let show_if;
    	let current_block_type_index;
    	let if_block1;
    	let t1;
    	let current;
    	let if_block0 = !/*isArray*/ ctx[4] && create_if_block_5$2(ctx);
    	const if_block_creators = [create_if_block_3$2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*json, items*/ 33) show_if = null;
    		if (show_if == null) show_if = !!(/*getType*/ ctx[9](/*json*/ ctx[0][/*i*/ ctx[12]]) === 'object');
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (if_block0) if_block0.c();
    			t0 = space$1();
    			if_block1.c();
    			t1 = space$1();
    			add_location(li, file$4, 48, 8, 935);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if (if_block0) if_block0.m(li, null);
    			append_dev(li, t0);
    			if_blocks[current_block_type_index].m(li, null);
    			append_dev(li, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*isArray*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5$2(ctx);
    					if_block0.c();
    					if_block0.m(li, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(li, t1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(48:6) {#each items as i, idx}",
    		ctx
    	});

    	return block;
    }

    // (63:79) {#if !_last}
    function create_if_block_2$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = ",";
    			attr_dev(span, "class", "comma svelte-gbh3pt");
    			add_location(span, file$4, 62, 91, 1497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(63:79) {#if !_last}",
    		ctx
    	});

    	return block;
    }

    // (69:3) {#if !_last && collapsed}
    function create_if_block_1$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = ",";
    			attr_dev(span, "class", "comma svelte-gbh3pt");
    			add_location(span, file$4, 68, 28, 1722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(69:3) {#if !_last && collapsed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*items*/ ctx[5].length && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*items*/ ctx[5].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*items*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const collapsedSymbol = '...';

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('JsonView', slots, []);
    	let { json } = $$props;
    	let { depth = Infinity } = $$props;
    	let { _lvl = 0 } = $$props;
    	let { _last = true } = $$props;

    	const getType = i => {
    		if (i === null) return 'null';
    		return typeof i;
    	};

    	let items;
    	let isArray;
    	let openBracket;
    	let closeBracket;
    	let collapsed;

    	const format = i => {
    		switch (getType(i)) {
    			case 'string':
    				return `"${i}"`;
    			case 'function':
    				return 'f () {...}';
    			case 'symbol':
    				return i.toString();
    			default:
    				return i;
    		}
    	};

    	const clicked = () => {
    		$$invalidate(8, collapsed = !collapsed);
    	};

    	const writable_props = ['json', 'depth', '_lvl', '_last'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<JsonView> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('json' in $$props) $$invalidate(0, json = $$props.json);
    		if ('depth' in $$props) $$invalidate(1, depth = $$props.depth);
    		if ('_lvl' in $$props) $$invalidate(2, _lvl = $$props._lvl);
    		if ('_last' in $$props) $$invalidate(3, _last = $$props._last);
    	};

    	$$self.$capture_state = () => ({
    		json,
    		depth,
    		_lvl,
    		_last,
    		collapsedSymbol,
    		getType,
    		items,
    		isArray,
    		openBracket,
    		closeBracket,
    		collapsed,
    		format,
    		clicked
    	});

    	$$self.$inject_state = $$props => {
    		if ('json' in $$props) $$invalidate(0, json = $$props.json);
    		if ('depth' in $$props) $$invalidate(1, depth = $$props.depth);
    		if ('_lvl' in $$props) $$invalidate(2, _lvl = $$props._lvl);
    		if ('_last' in $$props) $$invalidate(3, _last = $$props._last);
    		if ('items' in $$props) $$invalidate(5, items = $$props.items);
    		if ('isArray' in $$props) $$invalidate(4, isArray = $$props.isArray);
    		if ('openBracket' in $$props) $$invalidate(6, openBracket = $$props.openBracket);
    		if ('closeBracket' in $$props) $$invalidate(7, closeBracket = $$props.closeBracket);
    		if ('collapsed' in $$props) $$invalidate(8, collapsed = $$props.collapsed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*json, isArray*/ 17) {
    			{
    				$$invalidate(5, items = getType(json) === 'object' ? Object.keys(json) : []);
    				$$invalidate(4, isArray = Array.isArray(json));
    				$$invalidate(6, openBracket = isArray ? '[' : '{');
    				$$invalidate(7, closeBracket = isArray ? ']' : '}');
    			}
    		}

    		if ($$self.$$.dirty & /*depth, _lvl*/ 6) {
    			$$invalidate(8, collapsed = depth < _lvl);
    		}
    	};

    	return [
    		json,
    		depth,
    		_lvl,
    		_last,
    		isArray,
    		items,
    		openBracket,
    		closeBracket,
    		collapsed,
    		getType,
    		format,
    		clicked
    	];
    }

    class JsonView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { json: 0, depth: 1, _lvl: 2, _last: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JsonView",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*json*/ ctx[0] === undefined && !('json' in props)) {
    			console.warn("<JsonView> was created without expected prop 'json'");
    		}
    	}

    	get json() {
    		throw new Error("<JsonView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set json(value) {
    		throw new Error("<JsonView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get depth() {
    		throw new Error("<JsonView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set depth(value) {
    		throw new Error("<JsonView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get _lvl() {
    		throw new Error("<JsonView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set _lvl(value) {
    		throw new Error("<JsonView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get _last() {
    		throw new Error("<JsonView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set _last(value) {
    		throw new Error("<JsonView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/EditConfDialog.svelte generated by Svelte v3.49.0 */
    const file$3 = "src/EditConfDialog.svelte";

    // (101:4) {:else}
    function create_else_block$2(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$3, 101, 4, 2121);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$3, 101, 56, 2173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 2 && input.value !== /*admin_pass*/ ctx[1]) {
    				set_input_value(input, /*admin_pass*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(101:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#if password_view_type }
    function create_if_block$2(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			t1 = text$1(" ");
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			add_location(label, file$3, 99, 4, 1987);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "id", "admin-pass");
    			add_location(input, file$3, 99, 56, 2039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*admin_pass*/ 2 && input.value !== /*admin_pass*/ ctx[1]) {
    				set_input_value(input, /*admin_pass*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(99:4) {#if password_view_type }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let button0;
    	let t4;
    	let div7;
    	let div3;
    	let div1;
    	let t6;
    	let div2;
    	let jsonview;
    	let t7;
    	let div6;
    	let div4;
    	let t9;
    	let div5;
    	let textarea;
    	let t10;
    	let div8;
    	let button1;
    	let t12;
    	let button2;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*password_view_type*/ ctx[3]) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	jsonview = new JsonView({
    			props: { json: /*conf_dialog_data*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text$1(/*message*/ ctx[2]);
    			t1 = space$1();
    			div0 = element("div");
    			if_block.c();
    			t2 = space$1();
    			button0 = element("button");
    			button0.textContent = "👁";
    			t4 = space$1();
    			div7 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "Output:";
    			t6 = space$1();
    			div2 = element("div");
    			create_component(jsonview.$$.fragment);
    			t7 = space$1();
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "Edit JSON Here:";
    			t9 = space$1();
    			div5 = element("div");
    			textarea = element("textarea");
    			t10 = space$1();
    			div8 = element("div");
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t12 = space$1();
    			button2 = element("button");
    			button2.textContent = "Okay";
    			add_location(h2, file$3, 96, 0, 1883);
    			set_style(button0, "font-size", "larger");
    			add_location(button0, file$3, 103, 4, 2249);
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "text-align", "left");
    			add_location(div0, file$3, 97, 0, 1902);
    			add_location(div1, file$3, 107, 8, 2489);
    			set_style(div2, "height", "fit-content");
    			set_style(div2, "border", "solid 1px black");
    			set_style(div2, "padding", "8px");
    			add_location(div2, file$3, 108, 8, 2516);
    			set_style(div3, "display", "inline-block");
    			set_style(div3, "vertical-align", "top");
    			set_style(div3, "height", "fit-content");
    			add_location(div3, file$3, 106, 4, 2408);
    			add_location(div4, file$3, 113, 8, 2710);
    			attr_dev(textarea, "class", "" + (null_to_empty(/*inputClasses*/ ctx[10]) + " svelte-8sif34"));
    			attr_dev(textarea, "placeholder", /*placeholder*/ ctx[9]);
    			attr_dev(textarea, "rows", /*rows*/ ctx[11]);
    			attr_dev(textarea, "cols", /*cols*/ ctx[12]);
    			add_location(textarea, file$3, 115, 12, 2764);
    			add_location(div5, file$3, 114, 8, 2745);
    			set_style(div6, "display", "inline-block");
    			add_location(div6, file$3, 112, 4, 2667);
    			attr_dev(div7, "class", "eform svelte-8sif34");
    			set_style(div7, "vertical-align", "top");
    			set_style(div7, "text-align", "left");
    			add_location(div7, file$3, 105, 0, 2341);
    			add_location(button1, file$3, 130, 6, 3114);
    			add_location(button2, file$3, 133, 6, 3183);
    			attr_dev(div8, "class", "buttons svelte-8sif34");
    			add_location(div8, file$3, 129, 0, 3086);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			if_block.m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			mount_component(jsonview, div2, null);
    			append_dev(div7, t7);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			append_dev(div5, textarea);
    			/*textarea_binding*/ ctx[20](textarea);
    			set_input_value(textarea, /*edit_str*/ ctx[5]);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, button1);
    			append_dev(div8, t12);
    			append_dev(div8, button2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle_password_view*/ ctx[6], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[21]),
    					listen_dev(textarea, "input", /*handleInput*/ ctx[13], false, false, false),
    					listen_dev(textarea, "blur", /*handleBlur*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*_onCancel*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*_onOkay*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*message*/ 4) set_data_dev(t0, /*message*/ ctx[2]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, t2);
    				}
    			}

    			const jsonview_changes = {};
    			if (dirty & /*conf_dialog_data*/ 1) jsonview_changes.json = /*conf_dialog_data*/ ctx[0];
    			jsonview.$set(jsonview_changes);

    			if (dirty & /*edit_str*/ 32) {
    				set_input_value(textarea, /*edit_str*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jsonview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jsonview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if_block.d();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div7);
    			destroy_component(jsonview);
    			/*textarea_binding*/ ctx[20](null);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div8);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditConfDialog', slots, []);
    	let { conf_dialog_data } = $$props;
    	let { message } = $$props;

    	let { onCancel = () => {
    		
    	} } = $$props;

    	let { onOkay = () => {
    		
    	} } = $$props;

    	let { admin_pass } = $$props;
    	let password_view_type = true;

    	function toggle_password_view(ev) {
    		$$invalidate(3, password_view_type = !password_view_type);
    	}

    	function _onCancel() {
    		onCancel();
    	}

    	function _onOkay() {
    		if (admin_pass.length === 0) {
    			alert("No admin password");
    			return;
    		}

    		onOkay(conf_dialog_data_str);
    	}

    	// 
    	let conf_dialog_data_str = JSON.stringify(conf_dialog_data, null, 4);

    	//
    	let inputEl = false;

    	let value = "";
    	let placeholder = "JSON input ... edit it";
    	let inputClasses = "inputClasses";
    	let rows = 20;
    	let cols = 100;
    	let edit_str = conf_dialog_data_str;

    	function handleInput(ev) {
    		try {
    			let teststr = edit_str;
    			let obj = JSON.parse(teststr);
    			$$invalidate(0, conf_dialog_data = obj);
    		} catch(e) {
    			return;
    		}
    	}

    	function handleBlur(ev) {
    		try {
    			let teststr = edit_str;
    			let obj = JSON.parse(teststr);
    			$$invalidate(0, conf_dialog_data = obj);
    		} catch(e) {
    			return;
    		}
    	}

    	const writable_props = ['conf_dialog_data', 'message', 'onCancel', 'onOkay', 'admin_pass'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditConfDialog> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		admin_pass = this.value;
    		$$invalidate(1, admin_pass);
    	}

    	function input_input_handler_1() {
    		admin_pass = this.value;
    		$$invalidate(1, admin_pass);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputEl = $$value;
    			$$invalidate(4, inputEl);
    		});
    	}

    	function textarea_input_handler() {
    		edit_str = this.value;
    		(($$invalidate(5, edit_str), $$invalidate(17, conf_dialog_data_str)), $$invalidate(0, conf_dialog_data));
    	}

    	$$self.$$set = $$props => {
    		if ('conf_dialog_data' in $$props) $$invalidate(0, conf_dialog_data = $$props.conf_dialog_data);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    		if ('onCancel' in $$props) $$invalidate(15, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(16, onOkay = $$props.onOkay);
    		if ('admin_pass' in $$props) $$invalidate(1, admin_pass = $$props.admin_pass);
    	};

    	$$self.$capture_state = () => ({
    		JsonView,
    		conf_dialog_data,
    		message,
    		onCancel,
    		onOkay,
    		admin_pass,
    		password_view_type,
    		toggle_password_view,
    		_onCancel,
    		_onOkay,
    		conf_dialog_data_str,
    		inputEl,
    		value,
    		placeholder,
    		inputClasses,
    		rows,
    		cols,
    		edit_str,
    		handleInput,
    		handleBlur
    	});

    	$$self.$inject_state = $$props => {
    		if ('conf_dialog_data' in $$props) $$invalidate(0, conf_dialog_data = $$props.conf_dialog_data);
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    		if ('onCancel' in $$props) $$invalidate(15, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(16, onOkay = $$props.onOkay);
    		if ('admin_pass' in $$props) $$invalidate(1, admin_pass = $$props.admin_pass);
    		if ('password_view_type' in $$props) $$invalidate(3, password_view_type = $$props.password_view_type);
    		if ('conf_dialog_data_str' in $$props) $$invalidate(17, conf_dialog_data_str = $$props.conf_dialog_data_str);
    		if ('inputEl' in $$props) $$invalidate(4, inputEl = $$props.inputEl);
    		if ('value' in $$props) value = $$props.value;
    		if ('placeholder' in $$props) $$invalidate(9, placeholder = $$props.placeholder);
    		if ('inputClasses' in $$props) $$invalidate(10, inputClasses = $$props.inputClasses);
    		if ('rows' in $$props) $$invalidate(11, rows = $$props.rows);
    		if ('cols' in $$props) $$invalidate(12, cols = $$props.cols);
    		if ('edit_str' in $$props) $$invalidate(5, edit_str = $$props.edit_str);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*conf_dialog_data*/ 1) {
    			$$invalidate(17, conf_dialog_data_str = JSON.stringify(conf_dialog_data, null, 4));
    		}

    		if ($$self.$$.dirty & /*conf_dialog_data_str*/ 131072) {
    			$$invalidate(5, edit_str = conf_dialog_data_str);
    		}
    	};

    	return [
    		conf_dialog_data,
    		admin_pass,
    		message,
    		password_view_type,
    		inputEl,
    		edit_str,
    		toggle_password_view,
    		_onCancel,
    		_onOkay,
    		placeholder,
    		inputClasses,
    		rows,
    		cols,
    		handleInput,
    		handleBlur,
    		onCancel,
    		onOkay,
    		conf_dialog_data_str,
    		input_input_handler,
    		input_input_handler_1,
    		textarea_binding,
    		textarea_input_handler
    	];
    }

    class EditConfDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			conf_dialog_data: 0,
    			message: 2,
    			onCancel: 15,
    			onOkay: 16,
    			admin_pass: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditConfDialog",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*conf_dialog_data*/ ctx[0] === undefined && !('conf_dialog_data' in props)) {
    			console.warn("<EditConfDialog> was created without expected prop 'conf_dialog_data'");
    		}

    		if (/*message*/ ctx[2] === undefined && !('message' in props)) {
    			console.warn("<EditConfDialog> was created without expected prop 'message'");
    		}

    		if (/*admin_pass*/ ctx[1] === undefined && !('admin_pass' in props)) {
    			console.warn("<EditConfDialog> was created without expected prop 'admin_pass'");
    		}
    	}

    	get conf_dialog_data() {
    		throw new Error("<EditConfDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set conf_dialog_data(value) {
    		throw new Error("<EditConfDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<EditConfDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<EditConfDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCancel() {
    		throw new Error("<EditConfDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<EditConfDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOkay() {
    		throw new Error("<EditConfDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOkay(value) {
    		throw new Error("<EditConfDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get admin_pass() {
    		throw new Error("<EditConfDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set admin_pass(value) {
    		throw new Error("<EditConfDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const componentsContextKey = 'components';
    const getComponentsMap = () => getContext(componentsContextKey);
    const setComponentsContext = (value) => setContext(componentsContextKey, value);
    const createComponentsContextValue = (init) => {
        const { set, subscribe } = writable(init);
        return { set, subscribe };
    };
    const astContextKey = 'ast';
    const setAstContext = (value) => setContext(astContextKey, value);
    const createAstContextValue = (init) => {
        const { set, subscribe } = writable(init);
        return { set, subscribe };
    };

    /* node_modules/svelte-exmarkdown/dist/SVGElement.svelte generated by Svelte v3.49.0 */

    const file$2 = "node_modules/svelte-exmarkdown/dist/SVGElement.svelte";

    // (6:0) <svelte:element this={__tag} {...$$restProps}>
    function create_dynamic_element$1(ctx) {
    	let svelte_element;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let svelte_element_levels = [/*$$restProps*/ ctx[1]];
    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = svg_element("svelte:element");
    			if (default_slot) default_slot.c();
    			set_svg_attributes(svelte_element, svelte_element_data);
    			add_location(svelte_element, file$2, 5, 0, 73);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			if (default_slot) {
    				default_slot.m(svelte_element, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_svg_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element$1.name,
    		type: "child_dynamic_element",
    		source: "(6:0) <svelte:element this={__tag} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let previous_tag = /*__tag*/ ctx[0];
    	let svelte_element_anchor;
    	let current;
    	validate_dynamic_element(/*__tag*/ ctx[0]);
    	validate_void_dynamic_element(/*__tag*/ ctx[0]);
    	let svelte_element = /*__tag*/ ctx[0] && create_dynamic_element$1(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*__tag*/ ctx[0]) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element$1(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*__tag*/ ctx[0])) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*__tag*/ ctx[0]);
    					validate_void_dynamic_element(/*__tag*/ ctx[0]);
    					svelte_element = create_dynamic_element$1(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*__tag*/ ctx[0];
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelte_element);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelte_element);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["__tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SVGElement', slots, ['default']);
    	let { __tag } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('__tag' in $$new_props) $$invalidate(0, __tag = $$new_props.__tag);
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ __tag });

    	$$self.$inject_state = $$new_props => {
    		if ('__tag' in $$props) $$invalidate(0, __tag = $$new_props.__tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [__tag, $$restProps, $$scope, slots];
    }

    class SVGElement extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { __tag: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SVGElement",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*__tag*/ ctx[0] === undefined && !('__tag' in props)) {
    			console.warn("<SVGElement> was created without expected prop '__tag'");
    		}
    	}

    	get __tag() {
    		throw new Error("<SVGElement>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set __tag(value) {
    		throw new Error("<SVGElement>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var __defProp = Object.defineProperty;
    var __export = (target, all2) => {
      for (var name in all2)
        __defProp(target, name, { get: all2[name], enumerable: true });
    };

    // node_modules/.pnpm/mdast-util-to-string@4.0.0/node_modules/mdast-util-to-string/lib/index.js
    var emptyOptions = {};
    function toString(value, options) {
      const settings = options || emptyOptions;
      const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
      const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
      return one(value, includeImageAlt, includeHtml);
    }
    function one(value, includeImageAlt, includeHtml) {
      if (node(value)) {
        if ("value" in value) {
          return value.type === "html" && !includeHtml ? "" : value.value;
        }
        if (includeImageAlt && "alt" in value && value.alt) {
          return value.alt;
        }
        if ("children" in value) {
          return all(value.children, includeImageAlt, includeHtml);
        }
      }
      if (Array.isArray(value)) {
        return all(value, includeImageAlt, includeHtml);
      }
      return "";
    }
    function all(values, includeImageAlt, includeHtml) {
      const result = [];
      let index2 = -1;
      while (++index2 < values.length) {
        result[index2] = one(values[index2], includeImageAlt, includeHtml);
      }
      return result.join("");
    }
    function node(value) {
      return Boolean(value && typeof value === "object");
    }

    // node_modules/.pnpm/character-entities@2.0.2/node_modules/character-entities/index.js
    var characterEntities = {
      AElig: "\xC6",
      AMP: "&",
      Aacute: "\xC1",
      Abreve: "\u0102",
      Acirc: "\xC2",
      Acy: "\u0410",
      Afr: "\u{1D504}",
      Agrave: "\xC0",
      Alpha: "\u0391",
      Amacr: "\u0100",
      And: "\u2A53",
      Aogon: "\u0104",
      Aopf: "\u{1D538}",
      ApplyFunction: "\u2061",
      Aring: "\xC5",
      Ascr: "\u{1D49C}",
      Assign: "\u2254",
      Atilde: "\xC3",
      Auml: "\xC4",
      Backslash: "\u2216",
      Barv: "\u2AE7",
      Barwed: "\u2306",
      Bcy: "\u0411",
      Because: "\u2235",
      Bernoullis: "\u212C",
      Beta: "\u0392",
      Bfr: "\u{1D505}",
      Bopf: "\u{1D539}",
      Breve: "\u02D8",
      Bscr: "\u212C",
      Bumpeq: "\u224E",
      CHcy: "\u0427",
      COPY: "\xA9",
      Cacute: "\u0106",
      Cap: "\u22D2",
      CapitalDifferentialD: "\u2145",
      Cayleys: "\u212D",
      Ccaron: "\u010C",
      Ccedil: "\xC7",
      Ccirc: "\u0108",
      Cconint: "\u2230",
      Cdot: "\u010A",
      Cedilla: "\xB8",
      CenterDot: "\xB7",
      Cfr: "\u212D",
      Chi: "\u03A7",
      CircleDot: "\u2299",
      CircleMinus: "\u2296",
      CirclePlus: "\u2295",
      CircleTimes: "\u2297",
      ClockwiseContourIntegral: "\u2232",
      CloseCurlyDoubleQuote: "\u201D",
      CloseCurlyQuote: "\u2019",
      Colon: "\u2237",
      Colone: "\u2A74",
      Congruent: "\u2261",
      Conint: "\u222F",
      ContourIntegral: "\u222E",
      Copf: "\u2102",
      Coproduct: "\u2210",
      CounterClockwiseContourIntegral: "\u2233",
      Cross: "\u2A2F",
      Cscr: "\u{1D49E}",
      Cup: "\u22D3",
      CupCap: "\u224D",
      DD: "\u2145",
      DDotrahd: "\u2911",
      DJcy: "\u0402",
      DScy: "\u0405",
      DZcy: "\u040F",
      Dagger: "\u2021",
      Darr: "\u21A1",
      Dashv: "\u2AE4",
      Dcaron: "\u010E",
      Dcy: "\u0414",
      Del: "\u2207",
      Delta: "\u0394",
      Dfr: "\u{1D507}",
      DiacriticalAcute: "\xB4",
      DiacriticalDot: "\u02D9",
      DiacriticalDoubleAcute: "\u02DD",
      DiacriticalGrave: "`",
      DiacriticalTilde: "\u02DC",
      Diamond: "\u22C4",
      DifferentialD: "\u2146",
      Dopf: "\u{1D53B}",
      Dot: "\xA8",
      DotDot: "\u20DC",
      DotEqual: "\u2250",
      DoubleContourIntegral: "\u222F",
      DoubleDot: "\xA8",
      DoubleDownArrow: "\u21D3",
      DoubleLeftArrow: "\u21D0",
      DoubleLeftRightArrow: "\u21D4",
      DoubleLeftTee: "\u2AE4",
      DoubleLongLeftArrow: "\u27F8",
      DoubleLongLeftRightArrow: "\u27FA",
      DoubleLongRightArrow: "\u27F9",
      DoubleRightArrow: "\u21D2",
      DoubleRightTee: "\u22A8",
      DoubleUpArrow: "\u21D1",
      DoubleUpDownArrow: "\u21D5",
      DoubleVerticalBar: "\u2225",
      DownArrow: "\u2193",
      DownArrowBar: "\u2913",
      DownArrowUpArrow: "\u21F5",
      DownBreve: "\u0311",
      DownLeftRightVector: "\u2950",
      DownLeftTeeVector: "\u295E",
      DownLeftVector: "\u21BD",
      DownLeftVectorBar: "\u2956",
      DownRightTeeVector: "\u295F",
      DownRightVector: "\u21C1",
      DownRightVectorBar: "\u2957",
      DownTee: "\u22A4",
      DownTeeArrow: "\u21A7",
      Downarrow: "\u21D3",
      Dscr: "\u{1D49F}",
      Dstrok: "\u0110",
      ENG: "\u014A",
      ETH: "\xD0",
      Eacute: "\xC9",
      Ecaron: "\u011A",
      Ecirc: "\xCA",
      Ecy: "\u042D",
      Edot: "\u0116",
      Efr: "\u{1D508}",
      Egrave: "\xC8",
      Element: "\u2208",
      Emacr: "\u0112",
      EmptySmallSquare: "\u25FB",
      EmptyVerySmallSquare: "\u25AB",
      Eogon: "\u0118",
      Eopf: "\u{1D53C}",
      Epsilon: "\u0395",
      Equal: "\u2A75",
      EqualTilde: "\u2242",
      Equilibrium: "\u21CC",
      Escr: "\u2130",
      Esim: "\u2A73",
      Eta: "\u0397",
      Euml: "\xCB",
      Exists: "\u2203",
      ExponentialE: "\u2147",
      Fcy: "\u0424",
      Ffr: "\u{1D509}",
      FilledSmallSquare: "\u25FC",
      FilledVerySmallSquare: "\u25AA",
      Fopf: "\u{1D53D}",
      ForAll: "\u2200",
      Fouriertrf: "\u2131",
      Fscr: "\u2131",
      GJcy: "\u0403",
      GT: ">",
      Gamma: "\u0393",
      Gammad: "\u03DC",
      Gbreve: "\u011E",
      Gcedil: "\u0122",
      Gcirc: "\u011C",
      Gcy: "\u0413",
      Gdot: "\u0120",
      Gfr: "\u{1D50A}",
      Gg: "\u22D9",
      Gopf: "\u{1D53E}",
      GreaterEqual: "\u2265",
      GreaterEqualLess: "\u22DB",
      GreaterFullEqual: "\u2267",
      GreaterGreater: "\u2AA2",
      GreaterLess: "\u2277",
      GreaterSlantEqual: "\u2A7E",
      GreaterTilde: "\u2273",
      Gscr: "\u{1D4A2}",
      Gt: "\u226B",
      HARDcy: "\u042A",
      Hacek: "\u02C7",
      Hat: "^",
      Hcirc: "\u0124",
      Hfr: "\u210C",
      HilbertSpace: "\u210B",
      Hopf: "\u210D",
      HorizontalLine: "\u2500",
      Hscr: "\u210B",
      Hstrok: "\u0126",
      HumpDownHump: "\u224E",
      HumpEqual: "\u224F",
      IEcy: "\u0415",
      IJlig: "\u0132",
      IOcy: "\u0401",
      Iacute: "\xCD",
      Icirc: "\xCE",
      Icy: "\u0418",
      Idot: "\u0130",
      Ifr: "\u2111",
      Igrave: "\xCC",
      Im: "\u2111",
      Imacr: "\u012A",
      ImaginaryI: "\u2148",
      Implies: "\u21D2",
      Int: "\u222C",
      Integral: "\u222B",
      Intersection: "\u22C2",
      InvisibleComma: "\u2063",
      InvisibleTimes: "\u2062",
      Iogon: "\u012E",
      Iopf: "\u{1D540}",
      Iota: "\u0399",
      Iscr: "\u2110",
      Itilde: "\u0128",
      Iukcy: "\u0406",
      Iuml: "\xCF",
      Jcirc: "\u0134",
      Jcy: "\u0419",
      Jfr: "\u{1D50D}",
      Jopf: "\u{1D541}",
      Jscr: "\u{1D4A5}",
      Jsercy: "\u0408",
      Jukcy: "\u0404",
      KHcy: "\u0425",
      KJcy: "\u040C",
      Kappa: "\u039A",
      Kcedil: "\u0136",
      Kcy: "\u041A",
      Kfr: "\u{1D50E}",
      Kopf: "\u{1D542}",
      Kscr: "\u{1D4A6}",
      LJcy: "\u0409",
      LT: "<",
      Lacute: "\u0139",
      Lambda: "\u039B",
      Lang: "\u27EA",
      Laplacetrf: "\u2112",
      Larr: "\u219E",
      Lcaron: "\u013D",
      Lcedil: "\u013B",
      Lcy: "\u041B",
      LeftAngleBracket: "\u27E8",
      LeftArrow: "\u2190",
      LeftArrowBar: "\u21E4",
      LeftArrowRightArrow: "\u21C6",
      LeftCeiling: "\u2308",
      LeftDoubleBracket: "\u27E6",
      LeftDownTeeVector: "\u2961",
      LeftDownVector: "\u21C3",
      LeftDownVectorBar: "\u2959",
      LeftFloor: "\u230A",
      LeftRightArrow: "\u2194",
      LeftRightVector: "\u294E",
      LeftTee: "\u22A3",
      LeftTeeArrow: "\u21A4",
      LeftTeeVector: "\u295A",
      LeftTriangle: "\u22B2",
      LeftTriangleBar: "\u29CF",
      LeftTriangleEqual: "\u22B4",
      LeftUpDownVector: "\u2951",
      LeftUpTeeVector: "\u2960",
      LeftUpVector: "\u21BF",
      LeftUpVectorBar: "\u2958",
      LeftVector: "\u21BC",
      LeftVectorBar: "\u2952",
      Leftarrow: "\u21D0",
      Leftrightarrow: "\u21D4",
      LessEqualGreater: "\u22DA",
      LessFullEqual: "\u2266",
      LessGreater: "\u2276",
      LessLess: "\u2AA1",
      LessSlantEqual: "\u2A7D",
      LessTilde: "\u2272",
      Lfr: "\u{1D50F}",
      Ll: "\u22D8",
      Lleftarrow: "\u21DA",
      Lmidot: "\u013F",
      LongLeftArrow: "\u27F5",
      LongLeftRightArrow: "\u27F7",
      LongRightArrow: "\u27F6",
      Longleftarrow: "\u27F8",
      Longleftrightarrow: "\u27FA",
      Longrightarrow: "\u27F9",
      Lopf: "\u{1D543}",
      LowerLeftArrow: "\u2199",
      LowerRightArrow: "\u2198",
      Lscr: "\u2112",
      Lsh: "\u21B0",
      Lstrok: "\u0141",
      Lt: "\u226A",
      Map: "\u2905",
      Mcy: "\u041C",
      MediumSpace: "\u205F",
      Mellintrf: "\u2133",
      Mfr: "\u{1D510}",
      MinusPlus: "\u2213",
      Mopf: "\u{1D544}",
      Mscr: "\u2133",
      Mu: "\u039C",
      NJcy: "\u040A",
      Nacute: "\u0143",
      Ncaron: "\u0147",
      Ncedil: "\u0145",
      Ncy: "\u041D",
      NegativeMediumSpace: "\u200B",
      NegativeThickSpace: "\u200B",
      NegativeThinSpace: "\u200B",
      NegativeVeryThinSpace: "\u200B",
      NestedGreaterGreater: "\u226B",
      NestedLessLess: "\u226A",
      NewLine: "\n",
      Nfr: "\u{1D511}",
      NoBreak: "\u2060",
      NonBreakingSpace: "\xA0",
      Nopf: "\u2115",
      Not: "\u2AEC",
      NotCongruent: "\u2262",
      NotCupCap: "\u226D",
      NotDoubleVerticalBar: "\u2226",
      NotElement: "\u2209",
      NotEqual: "\u2260",
      NotEqualTilde: "\u2242\u0338",
      NotExists: "\u2204",
      NotGreater: "\u226F",
      NotGreaterEqual: "\u2271",
      NotGreaterFullEqual: "\u2267\u0338",
      NotGreaterGreater: "\u226B\u0338",
      NotGreaterLess: "\u2279",
      NotGreaterSlantEqual: "\u2A7E\u0338",
      NotGreaterTilde: "\u2275",
      NotHumpDownHump: "\u224E\u0338",
      NotHumpEqual: "\u224F\u0338",
      NotLeftTriangle: "\u22EA",
      NotLeftTriangleBar: "\u29CF\u0338",
      NotLeftTriangleEqual: "\u22EC",
      NotLess: "\u226E",
      NotLessEqual: "\u2270",
      NotLessGreater: "\u2278",
      NotLessLess: "\u226A\u0338",
      NotLessSlantEqual: "\u2A7D\u0338",
      NotLessTilde: "\u2274",
      NotNestedGreaterGreater: "\u2AA2\u0338",
      NotNestedLessLess: "\u2AA1\u0338",
      NotPrecedes: "\u2280",
      NotPrecedesEqual: "\u2AAF\u0338",
      NotPrecedesSlantEqual: "\u22E0",
      NotReverseElement: "\u220C",
      NotRightTriangle: "\u22EB",
      NotRightTriangleBar: "\u29D0\u0338",
      NotRightTriangleEqual: "\u22ED",
      NotSquareSubset: "\u228F\u0338",
      NotSquareSubsetEqual: "\u22E2",
      NotSquareSuperset: "\u2290\u0338",
      NotSquareSupersetEqual: "\u22E3",
      NotSubset: "\u2282\u20D2",
      NotSubsetEqual: "\u2288",
      NotSucceeds: "\u2281",
      NotSucceedsEqual: "\u2AB0\u0338",
      NotSucceedsSlantEqual: "\u22E1",
      NotSucceedsTilde: "\u227F\u0338",
      NotSuperset: "\u2283\u20D2",
      NotSupersetEqual: "\u2289",
      NotTilde: "\u2241",
      NotTildeEqual: "\u2244",
      NotTildeFullEqual: "\u2247",
      NotTildeTilde: "\u2249",
      NotVerticalBar: "\u2224",
      Nscr: "\u{1D4A9}",
      Ntilde: "\xD1",
      Nu: "\u039D",
      OElig: "\u0152",
      Oacute: "\xD3",
      Ocirc: "\xD4",
      Ocy: "\u041E",
      Odblac: "\u0150",
      Ofr: "\u{1D512}",
      Ograve: "\xD2",
      Omacr: "\u014C",
      Omega: "\u03A9",
      Omicron: "\u039F",
      Oopf: "\u{1D546}",
      OpenCurlyDoubleQuote: "\u201C",
      OpenCurlyQuote: "\u2018",
      Or: "\u2A54",
      Oscr: "\u{1D4AA}",
      Oslash: "\xD8",
      Otilde: "\xD5",
      Otimes: "\u2A37",
      Ouml: "\xD6",
      OverBar: "\u203E",
      OverBrace: "\u23DE",
      OverBracket: "\u23B4",
      OverParenthesis: "\u23DC",
      PartialD: "\u2202",
      Pcy: "\u041F",
      Pfr: "\u{1D513}",
      Phi: "\u03A6",
      Pi: "\u03A0",
      PlusMinus: "\xB1",
      Poincareplane: "\u210C",
      Popf: "\u2119",
      Pr: "\u2ABB",
      Precedes: "\u227A",
      PrecedesEqual: "\u2AAF",
      PrecedesSlantEqual: "\u227C",
      PrecedesTilde: "\u227E",
      Prime: "\u2033",
      Product: "\u220F",
      Proportion: "\u2237",
      Proportional: "\u221D",
      Pscr: "\u{1D4AB}",
      Psi: "\u03A8",
      QUOT: '"',
      Qfr: "\u{1D514}",
      Qopf: "\u211A",
      Qscr: "\u{1D4AC}",
      RBarr: "\u2910",
      REG: "\xAE",
      Racute: "\u0154",
      Rang: "\u27EB",
      Rarr: "\u21A0",
      Rarrtl: "\u2916",
      Rcaron: "\u0158",
      Rcedil: "\u0156",
      Rcy: "\u0420",
      Re: "\u211C",
      ReverseElement: "\u220B",
      ReverseEquilibrium: "\u21CB",
      ReverseUpEquilibrium: "\u296F",
      Rfr: "\u211C",
      Rho: "\u03A1",
      RightAngleBracket: "\u27E9",
      RightArrow: "\u2192",
      RightArrowBar: "\u21E5",
      RightArrowLeftArrow: "\u21C4",
      RightCeiling: "\u2309",
      RightDoubleBracket: "\u27E7",
      RightDownTeeVector: "\u295D",
      RightDownVector: "\u21C2",
      RightDownVectorBar: "\u2955",
      RightFloor: "\u230B",
      RightTee: "\u22A2",
      RightTeeArrow: "\u21A6",
      RightTeeVector: "\u295B",
      RightTriangle: "\u22B3",
      RightTriangleBar: "\u29D0",
      RightTriangleEqual: "\u22B5",
      RightUpDownVector: "\u294F",
      RightUpTeeVector: "\u295C",
      RightUpVector: "\u21BE",
      RightUpVectorBar: "\u2954",
      RightVector: "\u21C0",
      RightVectorBar: "\u2953",
      Rightarrow: "\u21D2",
      Ropf: "\u211D",
      RoundImplies: "\u2970",
      Rrightarrow: "\u21DB",
      Rscr: "\u211B",
      Rsh: "\u21B1",
      RuleDelayed: "\u29F4",
      SHCHcy: "\u0429",
      SHcy: "\u0428",
      SOFTcy: "\u042C",
      Sacute: "\u015A",
      Sc: "\u2ABC",
      Scaron: "\u0160",
      Scedil: "\u015E",
      Scirc: "\u015C",
      Scy: "\u0421",
      Sfr: "\u{1D516}",
      ShortDownArrow: "\u2193",
      ShortLeftArrow: "\u2190",
      ShortRightArrow: "\u2192",
      ShortUpArrow: "\u2191",
      Sigma: "\u03A3",
      SmallCircle: "\u2218",
      Sopf: "\u{1D54A}",
      Sqrt: "\u221A",
      Square: "\u25A1",
      SquareIntersection: "\u2293",
      SquareSubset: "\u228F",
      SquareSubsetEqual: "\u2291",
      SquareSuperset: "\u2290",
      SquareSupersetEqual: "\u2292",
      SquareUnion: "\u2294",
      Sscr: "\u{1D4AE}",
      Star: "\u22C6",
      Sub: "\u22D0",
      Subset: "\u22D0",
      SubsetEqual: "\u2286",
      Succeeds: "\u227B",
      SucceedsEqual: "\u2AB0",
      SucceedsSlantEqual: "\u227D",
      SucceedsTilde: "\u227F",
      SuchThat: "\u220B",
      Sum: "\u2211",
      Sup: "\u22D1",
      Superset: "\u2283",
      SupersetEqual: "\u2287",
      Supset: "\u22D1",
      THORN: "\xDE",
      TRADE: "\u2122",
      TSHcy: "\u040B",
      TScy: "\u0426",
      Tab: "	",
      Tau: "\u03A4",
      Tcaron: "\u0164",
      Tcedil: "\u0162",
      Tcy: "\u0422",
      Tfr: "\u{1D517}",
      Therefore: "\u2234",
      Theta: "\u0398",
      ThickSpace: "\u205F\u200A",
      ThinSpace: "\u2009",
      Tilde: "\u223C",
      TildeEqual: "\u2243",
      TildeFullEqual: "\u2245",
      TildeTilde: "\u2248",
      Topf: "\u{1D54B}",
      TripleDot: "\u20DB",
      Tscr: "\u{1D4AF}",
      Tstrok: "\u0166",
      Uacute: "\xDA",
      Uarr: "\u219F",
      Uarrocir: "\u2949",
      Ubrcy: "\u040E",
      Ubreve: "\u016C",
      Ucirc: "\xDB",
      Ucy: "\u0423",
      Udblac: "\u0170",
      Ufr: "\u{1D518}",
      Ugrave: "\xD9",
      Umacr: "\u016A",
      UnderBar: "_",
      UnderBrace: "\u23DF",
      UnderBracket: "\u23B5",
      UnderParenthesis: "\u23DD",
      Union: "\u22C3",
      UnionPlus: "\u228E",
      Uogon: "\u0172",
      Uopf: "\u{1D54C}",
      UpArrow: "\u2191",
      UpArrowBar: "\u2912",
      UpArrowDownArrow: "\u21C5",
      UpDownArrow: "\u2195",
      UpEquilibrium: "\u296E",
      UpTee: "\u22A5",
      UpTeeArrow: "\u21A5",
      Uparrow: "\u21D1",
      Updownarrow: "\u21D5",
      UpperLeftArrow: "\u2196",
      UpperRightArrow: "\u2197",
      Upsi: "\u03D2",
      Upsilon: "\u03A5",
      Uring: "\u016E",
      Uscr: "\u{1D4B0}",
      Utilde: "\u0168",
      Uuml: "\xDC",
      VDash: "\u22AB",
      Vbar: "\u2AEB",
      Vcy: "\u0412",
      Vdash: "\u22A9",
      Vdashl: "\u2AE6",
      Vee: "\u22C1",
      Verbar: "\u2016",
      Vert: "\u2016",
      VerticalBar: "\u2223",
      VerticalLine: "|",
      VerticalSeparator: "\u2758",
      VerticalTilde: "\u2240",
      VeryThinSpace: "\u200A",
      Vfr: "\u{1D519}",
      Vopf: "\u{1D54D}",
      Vscr: "\u{1D4B1}",
      Vvdash: "\u22AA",
      Wcirc: "\u0174",
      Wedge: "\u22C0",
      Wfr: "\u{1D51A}",
      Wopf: "\u{1D54E}",
      Wscr: "\u{1D4B2}",
      Xfr: "\u{1D51B}",
      Xi: "\u039E",
      Xopf: "\u{1D54F}",
      Xscr: "\u{1D4B3}",
      YAcy: "\u042F",
      YIcy: "\u0407",
      YUcy: "\u042E",
      Yacute: "\xDD",
      Ycirc: "\u0176",
      Ycy: "\u042B",
      Yfr: "\u{1D51C}",
      Yopf: "\u{1D550}",
      Yscr: "\u{1D4B4}",
      Yuml: "\u0178",
      ZHcy: "\u0416",
      Zacute: "\u0179",
      Zcaron: "\u017D",
      Zcy: "\u0417",
      Zdot: "\u017B",
      ZeroWidthSpace: "\u200B",
      Zeta: "\u0396",
      Zfr: "\u2128",
      Zopf: "\u2124",
      Zscr: "\u{1D4B5}",
      aacute: "\xE1",
      abreve: "\u0103",
      ac: "\u223E",
      acE: "\u223E\u0333",
      acd: "\u223F",
      acirc: "\xE2",
      acute: "\xB4",
      acy: "\u0430",
      aelig: "\xE6",
      af: "\u2061",
      afr: "\u{1D51E}",
      agrave: "\xE0",
      alefsym: "\u2135",
      aleph: "\u2135",
      alpha: "\u03B1",
      amacr: "\u0101",
      amalg: "\u2A3F",
      amp: "&",
      and: "\u2227",
      andand: "\u2A55",
      andd: "\u2A5C",
      andslope: "\u2A58",
      andv: "\u2A5A",
      ang: "\u2220",
      ange: "\u29A4",
      angle: "\u2220",
      angmsd: "\u2221",
      angmsdaa: "\u29A8",
      angmsdab: "\u29A9",
      angmsdac: "\u29AA",
      angmsdad: "\u29AB",
      angmsdae: "\u29AC",
      angmsdaf: "\u29AD",
      angmsdag: "\u29AE",
      angmsdah: "\u29AF",
      angrt: "\u221F",
      angrtvb: "\u22BE",
      angrtvbd: "\u299D",
      angsph: "\u2222",
      angst: "\xC5",
      angzarr: "\u237C",
      aogon: "\u0105",
      aopf: "\u{1D552}",
      ap: "\u2248",
      apE: "\u2A70",
      apacir: "\u2A6F",
      ape: "\u224A",
      apid: "\u224B",
      apos: "'",
      approx: "\u2248",
      approxeq: "\u224A",
      aring: "\xE5",
      ascr: "\u{1D4B6}",
      ast: "*",
      asymp: "\u2248",
      asympeq: "\u224D",
      atilde: "\xE3",
      auml: "\xE4",
      awconint: "\u2233",
      awint: "\u2A11",
      bNot: "\u2AED",
      backcong: "\u224C",
      backepsilon: "\u03F6",
      backprime: "\u2035",
      backsim: "\u223D",
      backsimeq: "\u22CD",
      barvee: "\u22BD",
      barwed: "\u2305",
      barwedge: "\u2305",
      bbrk: "\u23B5",
      bbrktbrk: "\u23B6",
      bcong: "\u224C",
      bcy: "\u0431",
      bdquo: "\u201E",
      becaus: "\u2235",
      because: "\u2235",
      bemptyv: "\u29B0",
      bepsi: "\u03F6",
      bernou: "\u212C",
      beta: "\u03B2",
      beth: "\u2136",
      between: "\u226C",
      bfr: "\u{1D51F}",
      bigcap: "\u22C2",
      bigcirc: "\u25EF",
      bigcup: "\u22C3",
      bigodot: "\u2A00",
      bigoplus: "\u2A01",
      bigotimes: "\u2A02",
      bigsqcup: "\u2A06",
      bigstar: "\u2605",
      bigtriangledown: "\u25BD",
      bigtriangleup: "\u25B3",
      biguplus: "\u2A04",
      bigvee: "\u22C1",
      bigwedge: "\u22C0",
      bkarow: "\u290D",
      blacklozenge: "\u29EB",
      blacksquare: "\u25AA",
      blacktriangle: "\u25B4",
      blacktriangledown: "\u25BE",
      blacktriangleleft: "\u25C2",
      blacktriangleright: "\u25B8",
      blank: "\u2423",
      blk12: "\u2592",
      blk14: "\u2591",
      blk34: "\u2593",
      block: "\u2588",
      bne: "=\u20E5",
      bnequiv: "\u2261\u20E5",
      bnot: "\u2310",
      bopf: "\u{1D553}",
      bot: "\u22A5",
      bottom: "\u22A5",
      bowtie: "\u22C8",
      boxDL: "\u2557",
      boxDR: "\u2554",
      boxDl: "\u2556",
      boxDr: "\u2553",
      boxH: "\u2550",
      boxHD: "\u2566",
      boxHU: "\u2569",
      boxHd: "\u2564",
      boxHu: "\u2567",
      boxUL: "\u255D",
      boxUR: "\u255A",
      boxUl: "\u255C",
      boxUr: "\u2559",
      boxV: "\u2551",
      boxVH: "\u256C",
      boxVL: "\u2563",
      boxVR: "\u2560",
      boxVh: "\u256B",
      boxVl: "\u2562",
      boxVr: "\u255F",
      boxbox: "\u29C9",
      boxdL: "\u2555",
      boxdR: "\u2552",
      boxdl: "\u2510",
      boxdr: "\u250C",
      boxh: "\u2500",
      boxhD: "\u2565",
      boxhU: "\u2568",
      boxhd: "\u252C",
      boxhu: "\u2534",
      boxminus: "\u229F",
      boxplus: "\u229E",
      boxtimes: "\u22A0",
      boxuL: "\u255B",
      boxuR: "\u2558",
      boxul: "\u2518",
      boxur: "\u2514",
      boxv: "\u2502",
      boxvH: "\u256A",
      boxvL: "\u2561",
      boxvR: "\u255E",
      boxvh: "\u253C",
      boxvl: "\u2524",
      boxvr: "\u251C",
      bprime: "\u2035",
      breve: "\u02D8",
      brvbar: "\xA6",
      bscr: "\u{1D4B7}",
      bsemi: "\u204F",
      bsim: "\u223D",
      bsime: "\u22CD",
      bsol: "\\",
      bsolb: "\u29C5",
      bsolhsub: "\u27C8",
      bull: "\u2022",
      bullet: "\u2022",
      bump: "\u224E",
      bumpE: "\u2AAE",
      bumpe: "\u224F",
      bumpeq: "\u224F",
      cacute: "\u0107",
      cap: "\u2229",
      capand: "\u2A44",
      capbrcup: "\u2A49",
      capcap: "\u2A4B",
      capcup: "\u2A47",
      capdot: "\u2A40",
      caps: "\u2229\uFE00",
      caret: "\u2041",
      caron: "\u02C7",
      ccaps: "\u2A4D",
      ccaron: "\u010D",
      ccedil: "\xE7",
      ccirc: "\u0109",
      ccups: "\u2A4C",
      ccupssm: "\u2A50",
      cdot: "\u010B",
      cedil: "\xB8",
      cemptyv: "\u29B2",
      cent: "\xA2",
      centerdot: "\xB7",
      cfr: "\u{1D520}",
      chcy: "\u0447",
      check: "\u2713",
      checkmark: "\u2713",
      chi: "\u03C7",
      cir: "\u25CB",
      cirE: "\u29C3",
      circ: "\u02C6",
      circeq: "\u2257",
      circlearrowleft: "\u21BA",
      circlearrowright: "\u21BB",
      circledR: "\xAE",
      circledS: "\u24C8",
      circledast: "\u229B",
      circledcirc: "\u229A",
      circleddash: "\u229D",
      cire: "\u2257",
      cirfnint: "\u2A10",
      cirmid: "\u2AEF",
      cirscir: "\u29C2",
      clubs: "\u2663",
      clubsuit: "\u2663",
      colon: ":",
      colone: "\u2254",
      coloneq: "\u2254",
      comma: ",",
      commat: "@",
      comp: "\u2201",
      compfn: "\u2218",
      complement: "\u2201",
      complexes: "\u2102",
      cong: "\u2245",
      congdot: "\u2A6D",
      conint: "\u222E",
      copf: "\u{1D554}",
      coprod: "\u2210",
      copy: "\xA9",
      copysr: "\u2117",
      crarr: "\u21B5",
      cross: "\u2717",
      cscr: "\u{1D4B8}",
      csub: "\u2ACF",
      csube: "\u2AD1",
      csup: "\u2AD0",
      csupe: "\u2AD2",
      ctdot: "\u22EF",
      cudarrl: "\u2938",
      cudarrr: "\u2935",
      cuepr: "\u22DE",
      cuesc: "\u22DF",
      cularr: "\u21B6",
      cularrp: "\u293D",
      cup: "\u222A",
      cupbrcap: "\u2A48",
      cupcap: "\u2A46",
      cupcup: "\u2A4A",
      cupdot: "\u228D",
      cupor: "\u2A45",
      cups: "\u222A\uFE00",
      curarr: "\u21B7",
      curarrm: "\u293C",
      curlyeqprec: "\u22DE",
      curlyeqsucc: "\u22DF",
      curlyvee: "\u22CE",
      curlywedge: "\u22CF",
      curren: "\xA4",
      curvearrowleft: "\u21B6",
      curvearrowright: "\u21B7",
      cuvee: "\u22CE",
      cuwed: "\u22CF",
      cwconint: "\u2232",
      cwint: "\u2231",
      cylcty: "\u232D",
      dArr: "\u21D3",
      dHar: "\u2965",
      dagger: "\u2020",
      daleth: "\u2138",
      darr: "\u2193",
      dash: "\u2010",
      dashv: "\u22A3",
      dbkarow: "\u290F",
      dblac: "\u02DD",
      dcaron: "\u010F",
      dcy: "\u0434",
      dd: "\u2146",
      ddagger: "\u2021",
      ddarr: "\u21CA",
      ddotseq: "\u2A77",
      deg: "\xB0",
      delta: "\u03B4",
      demptyv: "\u29B1",
      dfisht: "\u297F",
      dfr: "\u{1D521}",
      dharl: "\u21C3",
      dharr: "\u21C2",
      diam: "\u22C4",
      diamond: "\u22C4",
      diamondsuit: "\u2666",
      diams: "\u2666",
      die: "\xA8",
      digamma: "\u03DD",
      disin: "\u22F2",
      div: "\xF7",
      divide: "\xF7",
      divideontimes: "\u22C7",
      divonx: "\u22C7",
      djcy: "\u0452",
      dlcorn: "\u231E",
      dlcrop: "\u230D",
      dollar: "$",
      dopf: "\u{1D555}",
      dot: "\u02D9",
      doteq: "\u2250",
      doteqdot: "\u2251",
      dotminus: "\u2238",
      dotplus: "\u2214",
      dotsquare: "\u22A1",
      doublebarwedge: "\u2306",
      downarrow: "\u2193",
      downdownarrows: "\u21CA",
      downharpoonleft: "\u21C3",
      downharpoonright: "\u21C2",
      drbkarow: "\u2910",
      drcorn: "\u231F",
      drcrop: "\u230C",
      dscr: "\u{1D4B9}",
      dscy: "\u0455",
      dsol: "\u29F6",
      dstrok: "\u0111",
      dtdot: "\u22F1",
      dtri: "\u25BF",
      dtrif: "\u25BE",
      duarr: "\u21F5",
      duhar: "\u296F",
      dwangle: "\u29A6",
      dzcy: "\u045F",
      dzigrarr: "\u27FF",
      eDDot: "\u2A77",
      eDot: "\u2251",
      eacute: "\xE9",
      easter: "\u2A6E",
      ecaron: "\u011B",
      ecir: "\u2256",
      ecirc: "\xEA",
      ecolon: "\u2255",
      ecy: "\u044D",
      edot: "\u0117",
      ee: "\u2147",
      efDot: "\u2252",
      efr: "\u{1D522}",
      eg: "\u2A9A",
      egrave: "\xE8",
      egs: "\u2A96",
      egsdot: "\u2A98",
      el: "\u2A99",
      elinters: "\u23E7",
      ell: "\u2113",
      els: "\u2A95",
      elsdot: "\u2A97",
      emacr: "\u0113",
      empty: "\u2205",
      emptyset: "\u2205",
      emptyv: "\u2205",
      emsp13: "\u2004",
      emsp14: "\u2005",
      emsp: "\u2003",
      eng: "\u014B",
      ensp: "\u2002",
      eogon: "\u0119",
      eopf: "\u{1D556}",
      epar: "\u22D5",
      eparsl: "\u29E3",
      eplus: "\u2A71",
      epsi: "\u03B5",
      epsilon: "\u03B5",
      epsiv: "\u03F5",
      eqcirc: "\u2256",
      eqcolon: "\u2255",
      eqsim: "\u2242",
      eqslantgtr: "\u2A96",
      eqslantless: "\u2A95",
      equals: "=",
      equest: "\u225F",
      equiv: "\u2261",
      equivDD: "\u2A78",
      eqvparsl: "\u29E5",
      erDot: "\u2253",
      erarr: "\u2971",
      escr: "\u212F",
      esdot: "\u2250",
      esim: "\u2242",
      eta: "\u03B7",
      eth: "\xF0",
      euml: "\xEB",
      euro: "\u20AC",
      excl: "!",
      exist: "\u2203",
      expectation: "\u2130",
      exponentiale: "\u2147",
      fallingdotseq: "\u2252",
      fcy: "\u0444",
      female: "\u2640",
      ffilig: "\uFB03",
      fflig: "\uFB00",
      ffllig: "\uFB04",
      ffr: "\u{1D523}",
      filig: "\uFB01",
      fjlig: "fj",
      flat: "\u266D",
      fllig: "\uFB02",
      fltns: "\u25B1",
      fnof: "\u0192",
      fopf: "\u{1D557}",
      forall: "\u2200",
      fork: "\u22D4",
      forkv: "\u2AD9",
      fpartint: "\u2A0D",
      frac12: "\xBD",
      frac13: "\u2153",
      frac14: "\xBC",
      frac15: "\u2155",
      frac16: "\u2159",
      frac18: "\u215B",
      frac23: "\u2154",
      frac25: "\u2156",
      frac34: "\xBE",
      frac35: "\u2157",
      frac38: "\u215C",
      frac45: "\u2158",
      frac56: "\u215A",
      frac58: "\u215D",
      frac78: "\u215E",
      frasl: "\u2044",
      frown: "\u2322",
      fscr: "\u{1D4BB}",
      gE: "\u2267",
      gEl: "\u2A8C",
      gacute: "\u01F5",
      gamma: "\u03B3",
      gammad: "\u03DD",
      gap: "\u2A86",
      gbreve: "\u011F",
      gcirc: "\u011D",
      gcy: "\u0433",
      gdot: "\u0121",
      ge: "\u2265",
      gel: "\u22DB",
      geq: "\u2265",
      geqq: "\u2267",
      geqslant: "\u2A7E",
      ges: "\u2A7E",
      gescc: "\u2AA9",
      gesdot: "\u2A80",
      gesdoto: "\u2A82",
      gesdotol: "\u2A84",
      gesl: "\u22DB\uFE00",
      gesles: "\u2A94",
      gfr: "\u{1D524}",
      gg: "\u226B",
      ggg: "\u22D9",
      gimel: "\u2137",
      gjcy: "\u0453",
      gl: "\u2277",
      glE: "\u2A92",
      gla: "\u2AA5",
      glj: "\u2AA4",
      gnE: "\u2269",
      gnap: "\u2A8A",
      gnapprox: "\u2A8A",
      gne: "\u2A88",
      gneq: "\u2A88",
      gneqq: "\u2269",
      gnsim: "\u22E7",
      gopf: "\u{1D558}",
      grave: "`",
      gscr: "\u210A",
      gsim: "\u2273",
      gsime: "\u2A8E",
      gsiml: "\u2A90",
      gt: ">",
      gtcc: "\u2AA7",
      gtcir: "\u2A7A",
      gtdot: "\u22D7",
      gtlPar: "\u2995",
      gtquest: "\u2A7C",
      gtrapprox: "\u2A86",
      gtrarr: "\u2978",
      gtrdot: "\u22D7",
      gtreqless: "\u22DB",
      gtreqqless: "\u2A8C",
      gtrless: "\u2277",
      gtrsim: "\u2273",
      gvertneqq: "\u2269\uFE00",
      gvnE: "\u2269\uFE00",
      hArr: "\u21D4",
      hairsp: "\u200A",
      half: "\xBD",
      hamilt: "\u210B",
      hardcy: "\u044A",
      harr: "\u2194",
      harrcir: "\u2948",
      harrw: "\u21AD",
      hbar: "\u210F",
      hcirc: "\u0125",
      hearts: "\u2665",
      heartsuit: "\u2665",
      hellip: "\u2026",
      hercon: "\u22B9",
      hfr: "\u{1D525}",
      hksearow: "\u2925",
      hkswarow: "\u2926",
      hoarr: "\u21FF",
      homtht: "\u223B",
      hookleftarrow: "\u21A9",
      hookrightarrow: "\u21AA",
      hopf: "\u{1D559}",
      horbar: "\u2015",
      hscr: "\u{1D4BD}",
      hslash: "\u210F",
      hstrok: "\u0127",
      hybull: "\u2043",
      hyphen: "\u2010",
      iacute: "\xED",
      ic: "\u2063",
      icirc: "\xEE",
      icy: "\u0438",
      iecy: "\u0435",
      iexcl: "\xA1",
      iff: "\u21D4",
      ifr: "\u{1D526}",
      igrave: "\xEC",
      ii: "\u2148",
      iiiint: "\u2A0C",
      iiint: "\u222D",
      iinfin: "\u29DC",
      iiota: "\u2129",
      ijlig: "\u0133",
      imacr: "\u012B",
      image: "\u2111",
      imagline: "\u2110",
      imagpart: "\u2111",
      imath: "\u0131",
      imof: "\u22B7",
      imped: "\u01B5",
      in: "\u2208",
      incare: "\u2105",
      infin: "\u221E",
      infintie: "\u29DD",
      inodot: "\u0131",
      int: "\u222B",
      intcal: "\u22BA",
      integers: "\u2124",
      intercal: "\u22BA",
      intlarhk: "\u2A17",
      intprod: "\u2A3C",
      iocy: "\u0451",
      iogon: "\u012F",
      iopf: "\u{1D55A}",
      iota: "\u03B9",
      iprod: "\u2A3C",
      iquest: "\xBF",
      iscr: "\u{1D4BE}",
      isin: "\u2208",
      isinE: "\u22F9",
      isindot: "\u22F5",
      isins: "\u22F4",
      isinsv: "\u22F3",
      isinv: "\u2208",
      it: "\u2062",
      itilde: "\u0129",
      iukcy: "\u0456",
      iuml: "\xEF",
      jcirc: "\u0135",
      jcy: "\u0439",
      jfr: "\u{1D527}",
      jmath: "\u0237",
      jopf: "\u{1D55B}",
      jscr: "\u{1D4BF}",
      jsercy: "\u0458",
      jukcy: "\u0454",
      kappa: "\u03BA",
      kappav: "\u03F0",
      kcedil: "\u0137",
      kcy: "\u043A",
      kfr: "\u{1D528}",
      kgreen: "\u0138",
      khcy: "\u0445",
      kjcy: "\u045C",
      kopf: "\u{1D55C}",
      kscr: "\u{1D4C0}",
      lAarr: "\u21DA",
      lArr: "\u21D0",
      lAtail: "\u291B",
      lBarr: "\u290E",
      lE: "\u2266",
      lEg: "\u2A8B",
      lHar: "\u2962",
      lacute: "\u013A",
      laemptyv: "\u29B4",
      lagran: "\u2112",
      lambda: "\u03BB",
      lang: "\u27E8",
      langd: "\u2991",
      langle: "\u27E8",
      lap: "\u2A85",
      laquo: "\xAB",
      larr: "\u2190",
      larrb: "\u21E4",
      larrbfs: "\u291F",
      larrfs: "\u291D",
      larrhk: "\u21A9",
      larrlp: "\u21AB",
      larrpl: "\u2939",
      larrsim: "\u2973",
      larrtl: "\u21A2",
      lat: "\u2AAB",
      latail: "\u2919",
      late: "\u2AAD",
      lates: "\u2AAD\uFE00",
      lbarr: "\u290C",
      lbbrk: "\u2772",
      lbrace: "{",
      lbrack: "[",
      lbrke: "\u298B",
      lbrksld: "\u298F",
      lbrkslu: "\u298D",
      lcaron: "\u013E",
      lcedil: "\u013C",
      lceil: "\u2308",
      lcub: "{",
      lcy: "\u043B",
      ldca: "\u2936",
      ldquo: "\u201C",
      ldquor: "\u201E",
      ldrdhar: "\u2967",
      ldrushar: "\u294B",
      ldsh: "\u21B2",
      le: "\u2264",
      leftarrow: "\u2190",
      leftarrowtail: "\u21A2",
      leftharpoondown: "\u21BD",
      leftharpoonup: "\u21BC",
      leftleftarrows: "\u21C7",
      leftrightarrow: "\u2194",
      leftrightarrows: "\u21C6",
      leftrightharpoons: "\u21CB",
      leftrightsquigarrow: "\u21AD",
      leftthreetimes: "\u22CB",
      leg: "\u22DA",
      leq: "\u2264",
      leqq: "\u2266",
      leqslant: "\u2A7D",
      les: "\u2A7D",
      lescc: "\u2AA8",
      lesdot: "\u2A7F",
      lesdoto: "\u2A81",
      lesdotor: "\u2A83",
      lesg: "\u22DA\uFE00",
      lesges: "\u2A93",
      lessapprox: "\u2A85",
      lessdot: "\u22D6",
      lesseqgtr: "\u22DA",
      lesseqqgtr: "\u2A8B",
      lessgtr: "\u2276",
      lesssim: "\u2272",
      lfisht: "\u297C",
      lfloor: "\u230A",
      lfr: "\u{1D529}",
      lg: "\u2276",
      lgE: "\u2A91",
      lhard: "\u21BD",
      lharu: "\u21BC",
      lharul: "\u296A",
      lhblk: "\u2584",
      ljcy: "\u0459",
      ll: "\u226A",
      llarr: "\u21C7",
      llcorner: "\u231E",
      llhard: "\u296B",
      lltri: "\u25FA",
      lmidot: "\u0140",
      lmoust: "\u23B0",
      lmoustache: "\u23B0",
      lnE: "\u2268",
      lnap: "\u2A89",
      lnapprox: "\u2A89",
      lne: "\u2A87",
      lneq: "\u2A87",
      lneqq: "\u2268",
      lnsim: "\u22E6",
      loang: "\u27EC",
      loarr: "\u21FD",
      lobrk: "\u27E6",
      longleftarrow: "\u27F5",
      longleftrightarrow: "\u27F7",
      longmapsto: "\u27FC",
      longrightarrow: "\u27F6",
      looparrowleft: "\u21AB",
      looparrowright: "\u21AC",
      lopar: "\u2985",
      lopf: "\u{1D55D}",
      loplus: "\u2A2D",
      lotimes: "\u2A34",
      lowast: "\u2217",
      lowbar: "_",
      loz: "\u25CA",
      lozenge: "\u25CA",
      lozf: "\u29EB",
      lpar: "(",
      lparlt: "\u2993",
      lrarr: "\u21C6",
      lrcorner: "\u231F",
      lrhar: "\u21CB",
      lrhard: "\u296D",
      lrm: "\u200E",
      lrtri: "\u22BF",
      lsaquo: "\u2039",
      lscr: "\u{1D4C1}",
      lsh: "\u21B0",
      lsim: "\u2272",
      lsime: "\u2A8D",
      lsimg: "\u2A8F",
      lsqb: "[",
      lsquo: "\u2018",
      lsquor: "\u201A",
      lstrok: "\u0142",
      lt: "<",
      ltcc: "\u2AA6",
      ltcir: "\u2A79",
      ltdot: "\u22D6",
      lthree: "\u22CB",
      ltimes: "\u22C9",
      ltlarr: "\u2976",
      ltquest: "\u2A7B",
      ltrPar: "\u2996",
      ltri: "\u25C3",
      ltrie: "\u22B4",
      ltrif: "\u25C2",
      lurdshar: "\u294A",
      luruhar: "\u2966",
      lvertneqq: "\u2268\uFE00",
      lvnE: "\u2268\uFE00",
      mDDot: "\u223A",
      macr: "\xAF",
      male: "\u2642",
      malt: "\u2720",
      maltese: "\u2720",
      map: "\u21A6",
      mapsto: "\u21A6",
      mapstodown: "\u21A7",
      mapstoleft: "\u21A4",
      mapstoup: "\u21A5",
      marker: "\u25AE",
      mcomma: "\u2A29",
      mcy: "\u043C",
      mdash: "\u2014",
      measuredangle: "\u2221",
      mfr: "\u{1D52A}",
      mho: "\u2127",
      micro: "\xB5",
      mid: "\u2223",
      midast: "*",
      midcir: "\u2AF0",
      middot: "\xB7",
      minus: "\u2212",
      minusb: "\u229F",
      minusd: "\u2238",
      minusdu: "\u2A2A",
      mlcp: "\u2ADB",
      mldr: "\u2026",
      mnplus: "\u2213",
      models: "\u22A7",
      mopf: "\u{1D55E}",
      mp: "\u2213",
      mscr: "\u{1D4C2}",
      mstpos: "\u223E",
      mu: "\u03BC",
      multimap: "\u22B8",
      mumap: "\u22B8",
      nGg: "\u22D9\u0338",
      nGt: "\u226B\u20D2",
      nGtv: "\u226B\u0338",
      nLeftarrow: "\u21CD",
      nLeftrightarrow: "\u21CE",
      nLl: "\u22D8\u0338",
      nLt: "\u226A\u20D2",
      nLtv: "\u226A\u0338",
      nRightarrow: "\u21CF",
      nVDash: "\u22AF",
      nVdash: "\u22AE",
      nabla: "\u2207",
      nacute: "\u0144",
      nang: "\u2220\u20D2",
      nap: "\u2249",
      napE: "\u2A70\u0338",
      napid: "\u224B\u0338",
      napos: "\u0149",
      napprox: "\u2249",
      natur: "\u266E",
      natural: "\u266E",
      naturals: "\u2115",
      nbsp: "\xA0",
      nbump: "\u224E\u0338",
      nbumpe: "\u224F\u0338",
      ncap: "\u2A43",
      ncaron: "\u0148",
      ncedil: "\u0146",
      ncong: "\u2247",
      ncongdot: "\u2A6D\u0338",
      ncup: "\u2A42",
      ncy: "\u043D",
      ndash: "\u2013",
      ne: "\u2260",
      neArr: "\u21D7",
      nearhk: "\u2924",
      nearr: "\u2197",
      nearrow: "\u2197",
      nedot: "\u2250\u0338",
      nequiv: "\u2262",
      nesear: "\u2928",
      nesim: "\u2242\u0338",
      nexist: "\u2204",
      nexists: "\u2204",
      nfr: "\u{1D52B}",
      ngE: "\u2267\u0338",
      nge: "\u2271",
      ngeq: "\u2271",
      ngeqq: "\u2267\u0338",
      ngeqslant: "\u2A7E\u0338",
      nges: "\u2A7E\u0338",
      ngsim: "\u2275",
      ngt: "\u226F",
      ngtr: "\u226F",
      nhArr: "\u21CE",
      nharr: "\u21AE",
      nhpar: "\u2AF2",
      ni: "\u220B",
      nis: "\u22FC",
      nisd: "\u22FA",
      niv: "\u220B",
      njcy: "\u045A",
      nlArr: "\u21CD",
      nlE: "\u2266\u0338",
      nlarr: "\u219A",
      nldr: "\u2025",
      nle: "\u2270",
      nleftarrow: "\u219A",
      nleftrightarrow: "\u21AE",
      nleq: "\u2270",
      nleqq: "\u2266\u0338",
      nleqslant: "\u2A7D\u0338",
      nles: "\u2A7D\u0338",
      nless: "\u226E",
      nlsim: "\u2274",
      nlt: "\u226E",
      nltri: "\u22EA",
      nltrie: "\u22EC",
      nmid: "\u2224",
      nopf: "\u{1D55F}",
      not: "\xAC",
      notin: "\u2209",
      notinE: "\u22F9\u0338",
      notindot: "\u22F5\u0338",
      notinva: "\u2209",
      notinvb: "\u22F7",
      notinvc: "\u22F6",
      notni: "\u220C",
      notniva: "\u220C",
      notnivb: "\u22FE",
      notnivc: "\u22FD",
      npar: "\u2226",
      nparallel: "\u2226",
      nparsl: "\u2AFD\u20E5",
      npart: "\u2202\u0338",
      npolint: "\u2A14",
      npr: "\u2280",
      nprcue: "\u22E0",
      npre: "\u2AAF\u0338",
      nprec: "\u2280",
      npreceq: "\u2AAF\u0338",
      nrArr: "\u21CF",
      nrarr: "\u219B",
      nrarrc: "\u2933\u0338",
      nrarrw: "\u219D\u0338",
      nrightarrow: "\u219B",
      nrtri: "\u22EB",
      nrtrie: "\u22ED",
      nsc: "\u2281",
      nsccue: "\u22E1",
      nsce: "\u2AB0\u0338",
      nscr: "\u{1D4C3}",
      nshortmid: "\u2224",
      nshortparallel: "\u2226",
      nsim: "\u2241",
      nsime: "\u2244",
      nsimeq: "\u2244",
      nsmid: "\u2224",
      nspar: "\u2226",
      nsqsube: "\u22E2",
      nsqsupe: "\u22E3",
      nsub: "\u2284",
      nsubE: "\u2AC5\u0338",
      nsube: "\u2288",
      nsubset: "\u2282\u20D2",
      nsubseteq: "\u2288",
      nsubseteqq: "\u2AC5\u0338",
      nsucc: "\u2281",
      nsucceq: "\u2AB0\u0338",
      nsup: "\u2285",
      nsupE: "\u2AC6\u0338",
      nsupe: "\u2289",
      nsupset: "\u2283\u20D2",
      nsupseteq: "\u2289",
      nsupseteqq: "\u2AC6\u0338",
      ntgl: "\u2279",
      ntilde: "\xF1",
      ntlg: "\u2278",
      ntriangleleft: "\u22EA",
      ntrianglelefteq: "\u22EC",
      ntriangleright: "\u22EB",
      ntrianglerighteq: "\u22ED",
      nu: "\u03BD",
      num: "#",
      numero: "\u2116",
      numsp: "\u2007",
      nvDash: "\u22AD",
      nvHarr: "\u2904",
      nvap: "\u224D\u20D2",
      nvdash: "\u22AC",
      nvge: "\u2265\u20D2",
      nvgt: ">\u20D2",
      nvinfin: "\u29DE",
      nvlArr: "\u2902",
      nvle: "\u2264\u20D2",
      nvlt: "<\u20D2",
      nvltrie: "\u22B4\u20D2",
      nvrArr: "\u2903",
      nvrtrie: "\u22B5\u20D2",
      nvsim: "\u223C\u20D2",
      nwArr: "\u21D6",
      nwarhk: "\u2923",
      nwarr: "\u2196",
      nwarrow: "\u2196",
      nwnear: "\u2927",
      oS: "\u24C8",
      oacute: "\xF3",
      oast: "\u229B",
      ocir: "\u229A",
      ocirc: "\xF4",
      ocy: "\u043E",
      odash: "\u229D",
      odblac: "\u0151",
      odiv: "\u2A38",
      odot: "\u2299",
      odsold: "\u29BC",
      oelig: "\u0153",
      ofcir: "\u29BF",
      ofr: "\u{1D52C}",
      ogon: "\u02DB",
      ograve: "\xF2",
      ogt: "\u29C1",
      ohbar: "\u29B5",
      ohm: "\u03A9",
      oint: "\u222E",
      olarr: "\u21BA",
      olcir: "\u29BE",
      olcross: "\u29BB",
      oline: "\u203E",
      olt: "\u29C0",
      omacr: "\u014D",
      omega: "\u03C9",
      omicron: "\u03BF",
      omid: "\u29B6",
      ominus: "\u2296",
      oopf: "\u{1D560}",
      opar: "\u29B7",
      operp: "\u29B9",
      oplus: "\u2295",
      or: "\u2228",
      orarr: "\u21BB",
      ord: "\u2A5D",
      order: "\u2134",
      orderof: "\u2134",
      ordf: "\xAA",
      ordm: "\xBA",
      origof: "\u22B6",
      oror: "\u2A56",
      orslope: "\u2A57",
      orv: "\u2A5B",
      oscr: "\u2134",
      oslash: "\xF8",
      osol: "\u2298",
      otilde: "\xF5",
      otimes: "\u2297",
      otimesas: "\u2A36",
      ouml: "\xF6",
      ovbar: "\u233D",
      par: "\u2225",
      para: "\xB6",
      parallel: "\u2225",
      parsim: "\u2AF3",
      parsl: "\u2AFD",
      part: "\u2202",
      pcy: "\u043F",
      percnt: "%",
      period: ".",
      permil: "\u2030",
      perp: "\u22A5",
      pertenk: "\u2031",
      pfr: "\u{1D52D}",
      phi: "\u03C6",
      phiv: "\u03D5",
      phmmat: "\u2133",
      phone: "\u260E",
      pi: "\u03C0",
      pitchfork: "\u22D4",
      piv: "\u03D6",
      planck: "\u210F",
      planckh: "\u210E",
      plankv: "\u210F",
      plus: "+",
      plusacir: "\u2A23",
      plusb: "\u229E",
      pluscir: "\u2A22",
      plusdo: "\u2214",
      plusdu: "\u2A25",
      pluse: "\u2A72",
      plusmn: "\xB1",
      plussim: "\u2A26",
      plustwo: "\u2A27",
      pm: "\xB1",
      pointint: "\u2A15",
      popf: "\u{1D561}",
      pound: "\xA3",
      pr: "\u227A",
      prE: "\u2AB3",
      prap: "\u2AB7",
      prcue: "\u227C",
      pre: "\u2AAF",
      prec: "\u227A",
      precapprox: "\u2AB7",
      preccurlyeq: "\u227C",
      preceq: "\u2AAF",
      precnapprox: "\u2AB9",
      precneqq: "\u2AB5",
      precnsim: "\u22E8",
      precsim: "\u227E",
      prime: "\u2032",
      primes: "\u2119",
      prnE: "\u2AB5",
      prnap: "\u2AB9",
      prnsim: "\u22E8",
      prod: "\u220F",
      profalar: "\u232E",
      profline: "\u2312",
      profsurf: "\u2313",
      prop: "\u221D",
      propto: "\u221D",
      prsim: "\u227E",
      prurel: "\u22B0",
      pscr: "\u{1D4C5}",
      psi: "\u03C8",
      puncsp: "\u2008",
      qfr: "\u{1D52E}",
      qint: "\u2A0C",
      qopf: "\u{1D562}",
      qprime: "\u2057",
      qscr: "\u{1D4C6}",
      quaternions: "\u210D",
      quatint: "\u2A16",
      quest: "?",
      questeq: "\u225F",
      quot: '"',
      rAarr: "\u21DB",
      rArr: "\u21D2",
      rAtail: "\u291C",
      rBarr: "\u290F",
      rHar: "\u2964",
      race: "\u223D\u0331",
      racute: "\u0155",
      radic: "\u221A",
      raemptyv: "\u29B3",
      rang: "\u27E9",
      rangd: "\u2992",
      range: "\u29A5",
      rangle: "\u27E9",
      raquo: "\xBB",
      rarr: "\u2192",
      rarrap: "\u2975",
      rarrb: "\u21E5",
      rarrbfs: "\u2920",
      rarrc: "\u2933",
      rarrfs: "\u291E",
      rarrhk: "\u21AA",
      rarrlp: "\u21AC",
      rarrpl: "\u2945",
      rarrsim: "\u2974",
      rarrtl: "\u21A3",
      rarrw: "\u219D",
      ratail: "\u291A",
      ratio: "\u2236",
      rationals: "\u211A",
      rbarr: "\u290D",
      rbbrk: "\u2773",
      rbrace: "}",
      rbrack: "]",
      rbrke: "\u298C",
      rbrksld: "\u298E",
      rbrkslu: "\u2990",
      rcaron: "\u0159",
      rcedil: "\u0157",
      rceil: "\u2309",
      rcub: "}",
      rcy: "\u0440",
      rdca: "\u2937",
      rdldhar: "\u2969",
      rdquo: "\u201D",
      rdquor: "\u201D",
      rdsh: "\u21B3",
      real: "\u211C",
      realine: "\u211B",
      realpart: "\u211C",
      reals: "\u211D",
      rect: "\u25AD",
      reg: "\xAE",
      rfisht: "\u297D",
      rfloor: "\u230B",
      rfr: "\u{1D52F}",
      rhard: "\u21C1",
      rharu: "\u21C0",
      rharul: "\u296C",
      rho: "\u03C1",
      rhov: "\u03F1",
      rightarrow: "\u2192",
      rightarrowtail: "\u21A3",
      rightharpoondown: "\u21C1",
      rightharpoonup: "\u21C0",
      rightleftarrows: "\u21C4",
      rightleftharpoons: "\u21CC",
      rightrightarrows: "\u21C9",
      rightsquigarrow: "\u219D",
      rightthreetimes: "\u22CC",
      ring: "\u02DA",
      risingdotseq: "\u2253",
      rlarr: "\u21C4",
      rlhar: "\u21CC",
      rlm: "\u200F",
      rmoust: "\u23B1",
      rmoustache: "\u23B1",
      rnmid: "\u2AEE",
      roang: "\u27ED",
      roarr: "\u21FE",
      robrk: "\u27E7",
      ropar: "\u2986",
      ropf: "\u{1D563}",
      roplus: "\u2A2E",
      rotimes: "\u2A35",
      rpar: ")",
      rpargt: "\u2994",
      rppolint: "\u2A12",
      rrarr: "\u21C9",
      rsaquo: "\u203A",
      rscr: "\u{1D4C7}",
      rsh: "\u21B1",
      rsqb: "]",
      rsquo: "\u2019",
      rsquor: "\u2019",
      rthree: "\u22CC",
      rtimes: "\u22CA",
      rtri: "\u25B9",
      rtrie: "\u22B5",
      rtrif: "\u25B8",
      rtriltri: "\u29CE",
      ruluhar: "\u2968",
      rx: "\u211E",
      sacute: "\u015B",
      sbquo: "\u201A",
      sc: "\u227B",
      scE: "\u2AB4",
      scap: "\u2AB8",
      scaron: "\u0161",
      sccue: "\u227D",
      sce: "\u2AB0",
      scedil: "\u015F",
      scirc: "\u015D",
      scnE: "\u2AB6",
      scnap: "\u2ABA",
      scnsim: "\u22E9",
      scpolint: "\u2A13",
      scsim: "\u227F",
      scy: "\u0441",
      sdot: "\u22C5",
      sdotb: "\u22A1",
      sdote: "\u2A66",
      seArr: "\u21D8",
      searhk: "\u2925",
      searr: "\u2198",
      searrow: "\u2198",
      sect: "\xA7",
      semi: ";",
      seswar: "\u2929",
      setminus: "\u2216",
      setmn: "\u2216",
      sext: "\u2736",
      sfr: "\u{1D530}",
      sfrown: "\u2322",
      sharp: "\u266F",
      shchcy: "\u0449",
      shcy: "\u0448",
      shortmid: "\u2223",
      shortparallel: "\u2225",
      shy: "\xAD",
      sigma: "\u03C3",
      sigmaf: "\u03C2",
      sigmav: "\u03C2",
      sim: "\u223C",
      simdot: "\u2A6A",
      sime: "\u2243",
      simeq: "\u2243",
      simg: "\u2A9E",
      simgE: "\u2AA0",
      siml: "\u2A9D",
      simlE: "\u2A9F",
      simne: "\u2246",
      simplus: "\u2A24",
      simrarr: "\u2972",
      slarr: "\u2190",
      smallsetminus: "\u2216",
      smashp: "\u2A33",
      smeparsl: "\u29E4",
      smid: "\u2223",
      smile: "\u2323",
      smt: "\u2AAA",
      smte: "\u2AAC",
      smtes: "\u2AAC\uFE00",
      softcy: "\u044C",
      sol: "/",
      solb: "\u29C4",
      solbar: "\u233F",
      sopf: "\u{1D564}",
      spades: "\u2660",
      spadesuit: "\u2660",
      spar: "\u2225",
      sqcap: "\u2293",
      sqcaps: "\u2293\uFE00",
      sqcup: "\u2294",
      sqcups: "\u2294\uFE00",
      sqsub: "\u228F",
      sqsube: "\u2291",
      sqsubset: "\u228F",
      sqsubseteq: "\u2291",
      sqsup: "\u2290",
      sqsupe: "\u2292",
      sqsupset: "\u2290",
      sqsupseteq: "\u2292",
      squ: "\u25A1",
      square: "\u25A1",
      squarf: "\u25AA",
      squf: "\u25AA",
      srarr: "\u2192",
      sscr: "\u{1D4C8}",
      ssetmn: "\u2216",
      ssmile: "\u2323",
      sstarf: "\u22C6",
      star: "\u2606",
      starf: "\u2605",
      straightepsilon: "\u03F5",
      straightphi: "\u03D5",
      strns: "\xAF",
      sub: "\u2282",
      subE: "\u2AC5",
      subdot: "\u2ABD",
      sube: "\u2286",
      subedot: "\u2AC3",
      submult: "\u2AC1",
      subnE: "\u2ACB",
      subne: "\u228A",
      subplus: "\u2ABF",
      subrarr: "\u2979",
      subset: "\u2282",
      subseteq: "\u2286",
      subseteqq: "\u2AC5",
      subsetneq: "\u228A",
      subsetneqq: "\u2ACB",
      subsim: "\u2AC7",
      subsub: "\u2AD5",
      subsup: "\u2AD3",
      succ: "\u227B",
      succapprox: "\u2AB8",
      succcurlyeq: "\u227D",
      succeq: "\u2AB0",
      succnapprox: "\u2ABA",
      succneqq: "\u2AB6",
      succnsim: "\u22E9",
      succsim: "\u227F",
      sum: "\u2211",
      sung: "\u266A",
      sup1: "\xB9",
      sup2: "\xB2",
      sup3: "\xB3",
      sup: "\u2283",
      supE: "\u2AC6",
      supdot: "\u2ABE",
      supdsub: "\u2AD8",
      supe: "\u2287",
      supedot: "\u2AC4",
      suphsol: "\u27C9",
      suphsub: "\u2AD7",
      suplarr: "\u297B",
      supmult: "\u2AC2",
      supnE: "\u2ACC",
      supne: "\u228B",
      supplus: "\u2AC0",
      supset: "\u2283",
      supseteq: "\u2287",
      supseteqq: "\u2AC6",
      supsetneq: "\u228B",
      supsetneqq: "\u2ACC",
      supsim: "\u2AC8",
      supsub: "\u2AD4",
      supsup: "\u2AD6",
      swArr: "\u21D9",
      swarhk: "\u2926",
      swarr: "\u2199",
      swarrow: "\u2199",
      swnwar: "\u292A",
      szlig: "\xDF",
      target: "\u2316",
      tau: "\u03C4",
      tbrk: "\u23B4",
      tcaron: "\u0165",
      tcedil: "\u0163",
      tcy: "\u0442",
      tdot: "\u20DB",
      telrec: "\u2315",
      tfr: "\u{1D531}",
      there4: "\u2234",
      therefore: "\u2234",
      theta: "\u03B8",
      thetasym: "\u03D1",
      thetav: "\u03D1",
      thickapprox: "\u2248",
      thicksim: "\u223C",
      thinsp: "\u2009",
      thkap: "\u2248",
      thksim: "\u223C",
      thorn: "\xFE",
      tilde: "\u02DC",
      times: "\xD7",
      timesb: "\u22A0",
      timesbar: "\u2A31",
      timesd: "\u2A30",
      tint: "\u222D",
      toea: "\u2928",
      top: "\u22A4",
      topbot: "\u2336",
      topcir: "\u2AF1",
      topf: "\u{1D565}",
      topfork: "\u2ADA",
      tosa: "\u2929",
      tprime: "\u2034",
      trade: "\u2122",
      triangle: "\u25B5",
      triangledown: "\u25BF",
      triangleleft: "\u25C3",
      trianglelefteq: "\u22B4",
      triangleq: "\u225C",
      triangleright: "\u25B9",
      trianglerighteq: "\u22B5",
      tridot: "\u25EC",
      trie: "\u225C",
      triminus: "\u2A3A",
      triplus: "\u2A39",
      trisb: "\u29CD",
      tritime: "\u2A3B",
      trpezium: "\u23E2",
      tscr: "\u{1D4C9}",
      tscy: "\u0446",
      tshcy: "\u045B",
      tstrok: "\u0167",
      twixt: "\u226C",
      twoheadleftarrow: "\u219E",
      twoheadrightarrow: "\u21A0",
      uArr: "\u21D1",
      uHar: "\u2963",
      uacute: "\xFA",
      uarr: "\u2191",
      ubrcy: "\u045E",
      ubreve: "\u016D",
      ucirc: "\xFB",
      ucy: "\u0443",
      udarr: "\u21C5",
      udblac: "\u0171",
      udhar: "\u296E",
      ufisht: "\u297E",
      ufr: "\u{1D532}",
      ugrave: "\xF9",
      uharl: "\u21BF",
      uharr: "\u21BE",
      uhblk: "\u2580",
      ulcorn: "\u231C",
      ulcorner: "\u231C",
      ulcrop: "\u230F",
      ultri: "\u25F8",
      umacr: "\u016B",
      uml: "\xA8",
      uogon: "\u0173",
      uopf: "\u{1D566}",
      uparrow: "\u2191",
      updownarrow: "\u2195",
      upharpoonleft: "\u21BF",
      upharpoonright: "\u21BE",
      uplus: "\u228E",
      upsi: "\u03C5",
      upsih: "\u03D2",
      upsilon: "\u03C5",
      upuparrows: "\u21C8",
      urcorn: "\u231D",
      urcorner: "\u231D",
      urcrop: "\u230E",
      uring: "\u016F",
      urtri: "\u25F9",
      uscr: "\u{1D4CA}",
      utdot: "\u22F0",
      utilde: "\u0169",
      utri: "\u25B5",
      utrif: "\u25B4",
      uuarr: "\u21C8",
      uuml: "\xFC",
      uwangle: "\u29A7",
      vArr: "\u21D5",
      vBar: "\u2AE8",
      vBarv: "\u2AE9",
      vDash: "\u22A8",
      vangrt: "\u299C",
      varepsilon: "\u03F5",
      varkappa: "\u03F0",
      varnothing: "\u2205",
      varphi: "\u03D5",
      varpi: "\u03D6",
      varpropto: "\u221D",
      varr: "\u2195",
      varrho: "\u03F1",
      varsigma: "\u03C2",
      varsubsetneq: "\u228A\uFE00",
      varsubsetneqq: "\u2ACB\uFE00",
      varsupsetneq: "\u228B\uFE00",
      varsupsetneqq: "\u2ACC\uFE00",
      vartheta: "\u03D1",
      vartriangleleft: "\u22B2",
      vartriangleright: "\u22B3",
      vcy: "\u0432",
      vdash: "\u22A2",
      vee: "\u2228",
      veebar: "\u22BB",
      veeeq: "\u225A",
      vellip: "\u22EE",
      verbar: "|",
      vert: "|",
      vfr: "\u{1D533}",
      vltri: "\u22B2",
      vnsub: "\u2282\u20D2",
      vnsup: "\u2283\u20D2",
      vopf: "\u{1D567}",
      vprop: "\u221D",
      vrtri: "\u22B3",
      vscr: "\u{1D4CB}",
      vsubnE: "\u2ACB\uFE00",
      vsubne: "\u228A\uFE00",
      vsupnE: "\u2ACC\uFE00",
      vsupne: "\u228B\uFE00",
      vzigzag: "\u299A",
      wcirc: "\u0175",
      wedbar: "\u2A5F",
      wedge: "\u2227",
      wedgeq: "\u2259",
      weierp: "\u2118",
      wfr: "\u{1D534}",
      wopf: "\u{1D568}",
      wp: "\u2118",
      wr: "\u2240",
      wreath: "\u2240",
      wscr: "\u{1D4CC}",
      xcap: "\u22C2",
      xcirc: "\u25EF",
      xcup: "\u22C3",
      xdtri: "\u25BD",
      xfr: "\u{1D535}",
      xhArr: "\u27FA",
      xharr: "\u27F7",
      xi: "\u03BE",
      xlArr: "\u27F8",
      xlarr: "\u27F5",
      xmap: "\u27FC",
      xnis: "\u22FB",
      xodot: "\u2A00",
      xopf: "\u{1D569}",
      xoplus: "\u2A01",
      xotime: "\u2A02",
      xrArr: "\u27F9",
      xrarr: "\u27F6",
      xscr: "\u{1D4CD}",
      xsqcup: "\u2A06",
      xuplus: "\u2A04",
      xutri: "\u25B3",
      xvee: "\u22C1",
      xwedge: "\u22C0",
      yacute: "\xFD",
      yacy: "\u044F",
      ycirc: "\u0177",
      ycy: "\u044B",
      yen: "\xA5",
      yfr: "\u{1D536}",
      yicy: "\u0457",
      yopf: "\u{1D56A}",
      yscr: "\u{1D4CE}",
      yucy: "\u044E",
      yuml: "\xFF",
      zacute: "\u017A",
      zcaron: "\u017E",
      zcy: "\u0437",
      zdot: "\u017C",
      zeetrf: "\u2128",
      zeta: "\u03B6",
      zfr: "\u{1D537}",
      zhcy: "\u0436",
      zigrarr: "\u21DD",
      zopf: "\u{1D56B}",
      zscr: "\u{1D4CF}",
      zwj: "\u200D",
      zwnj: "\u200C"
    };

    // node_modules/.pnpm/decode-named-character-reference@1.0.2/node_modules/decode-named-character-reference/index.js
    var own = {}.hasOwnProperty;
    function decodeNamedCharacterReference(value) {
      return own.call(characterEntities, value) ? characterEntities[value] : false;
    }

    // node_modules/.pnpm/micromark-util-chunked@2.0.0/node_modules/micromark-util-chunked/index.js
    function splice(list3, start, remove, items) {
      const end = list3.length;
      let chunkStart = 0;
      let parameters;
      if (start < 0) {
        start = -start > end ? 0 : end + start;
      } else {
        start = start > end ? end : start;
      }
      remove = remove > 0 ? remove : 0;
      if (items.length < 1e4) {
        parameters = Array.from(items);
        parameters.unshift(start, remove);
        list3.splice(...parameters);
      } else {
        if (remove)
          list3.splice(start, remove);
        while (chunkStart < items.length) {
          parameters = items.slice(chunkStart, chunkStart + 1e4);
          parameters.unshift(start, 0);
          list3.splice(...parameters);
          chunkStart += 1e4;
          start += 1e4;
        }
      }
    }
    function push(list3, items) {
      if (list3.length > 0) {
        splice(list3, list3.length, 0, items);
        return list3;
      }
      return items;
    }

    // node_modules/.pnpm/micromark-util-combine-extensions@2.0.0/node_modules/micromark-util-combine-extensions/index.js
    var hasOwnProperty = {}.hasOwnProperty;
    function combineExtensions(extensions) {
      const all2 = {};
      let index2 = -1;
      while (++index2 < extensions.length) {
        syntaxExtension(all2, extensions[index2]);
      }
      return all2;
    }
    function syntaxExtension(all2, extension2) {
      let hook;
      for (hook in extension2) {
        const maybe = hasOwnProperty.call(all2, hook) ? all2[hook] : void 0;
        const left = maybe || (all2[hook] = {});
        const right = extension2[hook];
        let code2;
        if (right) {
          for (code2 in right) {
            if (!hasOwnProperty.call(left, code2))
              left[code2] = [];
            const value = right[code2];
            constructs(
              // @ts-expect-error Looks like a list.
              left[code2],
              Array.isArray(value) ? value : value ? [value] : []
            );
          }
        }
      }
    }
    function constructs(existing, list3) {
      let index2 = -1;
      const before = [];
      while (++index2 < list3.length) {
        (list3[index2].add === "after" ? existing : before).push(list3[index2]);
      }
      splice(existing, 0, 0, before);
    }

    // node_modules/.pnpm/micromark-util-decode-numeric-character-reference@2.0.0/node_modules/micromark-util-decode-numeric-character-reference/index.js
    function decodeNumericCharacterReference(value, base) {
      const code2 = Number.parseInt(value, base);
      if (
        // C0 except for HT, LF, FF, CR, space.
        code2 < 9 || code2 === 11 || code2 > 13 && code2 < 32 || // Control character (DEL) of C0, and C1 controls.
        code2 > 126 && code2 < 160 || // Lone high surrogates and low surrogates.
        code2 > 55295 && code2 < 57344 || // Noncharacters.
        code2 > 64975 && code2 < 65008 || (code2 & 65535) === 65535 || (code2 & 65535) === 65534 || // Out of range
        code2 > 1114111
      ) {
        return "\uFFFD";
      }
      return String.fromCharCode(code2);
    }

    // node_modules/.pnpm/micromark-util-normalize-identifier@2.0.0/node_modules/micromark-util-normalize-identifier/index.js
    function normalizeIdentifier(value) {
      return value.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
    }

    // node_modules/.pnpm/micromark-util-character@2.0.1/node_modules/micromark-util-character/index.js
    var unicodePunctuationInternal = regexCheck(/\p{P}/u);
    var asciiAlpha = regexCheck(/[A-Za-z]/);
    var asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
    var asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
    function asciiControl(code2) {
      return (
        // Special whitespace codes (which have negative values), C0 and Control
        // character DEL
        code2 !== null && (code2 < 32 || code2 === 127)
      );
    }
    var asciiDigit = regexCheck(/\d/);
    var asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
    var asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
    function markdownLineEnding(code2) {
      return code2 !== null && code2 < -2;
    }
    function markdownLineEndingOrSpace(code2) {
      return code2 !== null && (code2 < 0 || code2 === 32);
    }
    function markdownSpace(code2) {
      return code2 === -2 || code2 === -1 || code2 === 32;
    }
    function unicodePunctuation(code2) {
      return asciiPunctuation(code2) || unicodePunctuationInternal(code2);
    }
    var unicodeWhitespace = regexCheck(/\s/);
    function regexCheck(regex) {
      return check;
      function check(code2) {
        return code2 !== null && code2 > -1 && regex.test(String.fromCharCode(code2));
      }
    }

    // node_modules/.pnpm/micromark-util-sanitize-uri@2.0.0/node_modules/micromark-util-sanitize-uri/index.js
    function normalizeUri(value) {
      const result = [];
      let index2 = -1;
      let start = 0;
      let skip = 0;
      while (++index2 < value.length) {
        const code2 = value.charCodeAt(index2);
        let replace = "";
        if (code2 === 37 && asciiAlphanumeric(value.charCodeAt(index2 + 1)) && asciiAlphanumeric(value.charCodeAt(index2 + 2))) {
          skip = 2;
        } else if (code2 < 128) {
          if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code2))) {
            replace = String.fromCharCode(code2);
          }
        } else if (code2 > 55295 && code2 < 57344) {
          const next = value.charCodeAt(index2 + 1);
          if (code2 < 56320 && next > 56319 && next < 57344) {
            replace = String.fromCharCode(code2, next);
            skip = 1;
          } else {
            replace = "\uFFFD";
          }
        } else {
          replace = String.fromCharCode(code2);
        }
        if (replace) {
          result.push(value.slice(start, index2), encodeURIComponent(replace));
          start = index2 + skip + 1;
          replace = "";
        }
        if (skip) {
          index2 += skip;
          skip = 0;
        }
      }
      return result.join("") + value.slice(start);
    }

    // node_modules/.pnpm/micromark-factory-space@2.0.0/node_modules/micromark-factory-space/index.js
    function factorySpace(effects, ok3, type, max) {
      const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
      let size = 0;
      return start;
      function start(code2) {
        if (markdownSpace(code2)) {
          effects.enter(type);
          return prefix(code2);
        }
        return ok3(code2);
      }
      function prefix(code2) {
        if (markdownSpace(code2) && size++ < limit) {
          effects.consume(code2);
          return prefix;
        }
        effects.exit(type);
        return ok3(code2);
      }
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/initialize/content.js
    var content = {
      tokenize: initializeContent
    };
    function initializeContent(effects) {
      const contentStart = effects.attempt(
        this.parser.constructs.contentInitial,
        afterContentStartConstruct,
        paragraphInitial
      );
      let previous2;
      return contentStart;
      function afterContentStartConstruct(code2) {
        if (code2 === null) {
          effects.consume(code2);
          return;
        }
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return factorySpace(effects, contentStart, "linePrefix");
      }
      function paragraphInitial(code2) {
        effects.enter("paragraph");
        return lineStart(code2);
      }
      function lineStart(code2) {
        const token = effects.enter("chunkText", {
          contentType: "text",
          previous: previous2
        });
        if (previous2) {
          previous2.next = token;
        }
        previous2 = token;
        return data(code2);
      }
      function data(code2) {
        if (code2 === null) {
          effects.exit("chunkText");
          effects.exit("paragraph");
          effects.consume(code2);
          return;
        }
        if (markdownLineEnding(code2)) {
          effects.consume(code2);
          effects.exit("chunkText");
          return lineStart;
        }
        effects.consume(code2);
        return data;
      }
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/initialize/document.js
    var document$1 = {
      tokenize: initializeDocument
    };
    var containerConstruct = {
      tokenize: tokenizeContainer
    };
    function initializeDocument(effects) {
      const self2 = this;
      const stack = [];
      let continued = 0;
      let childFlow;
      let childToken;
      let lineStartOffset;
      return start;
      function start(code2) {
        if (continued < stack.length) {
          const item = stack[continued];
          self2.containerState = item[1];
          return effects.attempt(
            item[0].continuation,
            documentContinue,
            checkNewContainers
          )(code2);
        }
        return checkNewContainers(code2);
      }
      function documentContinue(code2) {
        continued++;
        if (self2.containerState._closeFlow) {
          self2.containerState._closeFlow = void 0;
          if (childFlow) {
            closeFlow();
          }
          const indexBeforeExits = self2.events.length;
          let indexBeforeFlow = indexBeforeExits;
          let point4;
          while (indexBeforeFlow--) {
            if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
              point4 = self2.events[indexBeforeFlow][1].end;
              break;
            }
          }
          exitContainers(continued);
          let index2 = indexBeforeExits;
          while (index2 < self2.events.length) {
            self2.events[index2][1].end = Object.assign({}, point4);
            index2++;
          }
          splice(
            self2.events,
            indexBeforeFlow + 1,
            0,
            self2.events.slice(indexBeforeExits)
          );
          self2.events.length = index2;
          return checkNewContainers(code2);
        }
        return start(code2);
      }
      function checkNewContainers(code2) {
        if (continued === stack.length) {
          if (!childFlow) {
            return documentContinued(code2);
          }
          if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
            return flowStart(code2);
          }
          self2.interrupt = Boolean(
            childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack
          );
        }
        self2.containerState = {};
        return effects.check(
          containerConstruct,
          thereIsANewContainer,
          thereIsNoNewContainer
        )(code2);
      }
      function thereIsANewContainer(code2) {
        if (childFlow)
          closeFlow();
        exitContainers(continued);
        return documentContinued(code2);
      }
      function thereIsNoNewContainer(code2) {
        self2.parser.lazy[self2.now().line] = continued !== stack.length;
        lineStartOffset = self2.now().offset;
        return flowStart(code2);
      }
      function documentContinued(code2) {
        self2.containerState = {};
        return effects.attempt(
          containerConstruct,
          containerContinue,
          flowStart
        )(code2);
      }
      function containerContinue(code2) {
        continued++;
        stack.push([self2.currentConstruct, self2.containerState]);
        return documentContinued(code2);
      }
      function flowStart(code2) {
        if (code2 === null) {
          if (childFlow)
            closeFlow();
          exitContainers(0);
          effects.consume(code2);
          return;
        }
        childFlow = childFlow || self2.parser.flow(self2.now());
        effects.enter("chunkFlow", {
          contentType: "flow",
          previous: childToken,
          _tokenizer: childFlow
        });
        return flowContinue(code2);
      }
      function flowContinue(code2) {
        if (code2 === null) {
          writeToChild(effects.exit("chunkFlow"), true);
          exitContainers(0);
          effects.consume(code2);
          return;
        }
        if (markdownLineEnding(code2)) {
          effects.consume(code2);
          writeToChild(effects.exit("chunkFlow"));
          continued = 0;
          self2.interrupt = void 0;
          return start;
        }
        effects.consume(code2);
        return flowContinue;
      }
      function writeToChild(token, eof) {
        const stream = self2.sliceStream(token);
        if (eof)
          stream.push(null);
        token.previous = childToken;
        if (childToken)
          childToken.next = token;
        childToken = token;
        childFlow.defineSkip(token.start);
        childFlow.write(stream);
        if (self2.parser.lazy[token.start.line]) {
          let index2 = childFlow.events.length;
          while (index2--) {
            if (
              // The token starts before the line ending…
              childFlow.events[index2][1].start.offset < lineStartOffset && // …and either is not ended yet…
              (!childFlow.events[index2][1].end || // …or ends after it.
              childFlow.events[index2][1].end.offset > lineStartOffset)
            ) {
              return;
            }
          }
          const indexBeforeExits = self2.events.length;
          let indexBeforeFlow = indexBeforeExits;
          let seen;
          let point4;
          while (indexBeforeFlow--) {
            if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === "chunkFlow") {
              if (seen) {
                point4 = self2.events[indexBeforeFlow][1].end;
                break;
              }
              seen = true;
            }
          }
          exitContainers(continued);
          index2 = indexBeforeExits;
          while (index2 < self2.events.length) {
            self2.events[index2][1].end = Object.assign({}, point4);
            index2++;
          }
          splice(
            self2.events,
            indexBeforeFlow + 1,
            0,
            self2.events.slice(indexBeforeExits)
          );
          self2.events.length = index2;
        }
      }
      function exitContainers(size) {
        let index2 = stack.length;
        while (index2-- > size) {
          const entry = stack[index2];
          self2.containerState = entry[1];
          entry[0].exit.call(self2, effects);
        }
        stack.length = size;
      }
      function closeFlow() {
        childFlow.write([null]);
        childToken = void 0;
        childFlow = void 0;
        self2.containerState._closeFlow = void 0;
      }
    }
    function tokenizeContainer(effects, ok3, nok) {
      return factorySpace(
        effects,
        effects.attempt(this.parser.constructs.document, ok3, nok),
        "linePrefix",
        this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
      );
    }

    // node_modules/.pnpm/micromark-util-classify-character@2.0.0/node_modules/micromark-util-classify-character/index.js
    function classifyCharacter(code2) {
      if (code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)) {
        return 1;
      }
      if (unicodePunctuation(code2)) {
        return 2;
      }
    }

    // node_modules/.pnpm/micromark-util-resolve-all@2.0.0/node_modules/micromark-util-resolve-all/index.js
    function resolveAll(constructs2, events, context) {
      const called = [];
      let index2 = -1;
      while (++index2 < constructs2.length) {
        const resolve = constructs2[index2].resolveAll;
        if (resolve && !called.includes(resolve)) {
          events = resolve(events, context);
          called.push(resolve);
        }
      }
      return events;
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/attention.js
    var attention = {
      name: "attention",
      tokenize: tokenizeAttention,
      resolveAll: resolveAllAttention
    };
    function resolveAllAttention(events, context) {
      let index2 = -1;
      let open;
      let group;
      let text4;
      let openingSequence;
      let closingSequence;
      let use;
      let nextEvents;
      let offset;
      while (++index2 < events.length) {
        if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
          open = index2;
          while (open--) {
            if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && // If the markers are the same:
            context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
              if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
                continue;
              }
              use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
              const start = Object.assign({}, events[open][1].end);
              const end = Object.assign({}, events[index2][1].start);
              movePoint(start, -use);
              movePoint(end, use);
              openingSequence = {
                type: use > 1 ? "strongSequence" : "emphasisSequence",
                start,
                end: Object.assign({}, events[open][1].end)
              };
              closingSequence = {
                type: use > 1 ? "strongSequence" : "emphasisSequence",
                start: Object.assign({}, events[index2][1].start),
                end
              };
              text4 = {
                type: use > 1 ? "strongText" : "emphasisText",
                start: Object.assign({}, events[open][1].end),
                end: Object.assign({}, events[index2][1].start)
              };
              group = {
                type: use > 1 ? "strong" : "emphasis",
                start: Object.assign({}, openingSequence.start),
                end: Object.assign({}, closingSequence.end)
              };
              events[open][1].end = Object.assign({}, openingSequence.start);
              events[index2][1].start = Object.assign({}, closingSequence.end);
              nextEvents = [];
              if (events[open][1].end.offset - events[open][1].start.offset) {
                nextEvents = push(nextEvents, [
                  ["enter", events[open][1], context],
                  ["exit", events[open][1], context]
                ]);
              }
              nextEvents = push(nextEvents, [
                ["enter", group, context],
                ["enter", openingSequence, context],
                ["exit", openingSequence, context],
                ["enter", text4, context]
              ]);
              nextEvents = push(
                nextEvents,
                resolveAll(
                  context.parser.constructs.insideSpan.null,
                  events.slice(open + 1, index2),
                  context
                )
              );
              nextEvents = push(nextEvents, [
                ["exit", text4, context],
                ["enter", closingSequence, context],
                ["exit", closingSequence, context],
                ["exit", group, context]
              ]);
              if (events[index2][1].end.offset - events[index2][1].start.offset) {
                offset = 2;
                nextEvents = push(nextEvents, [
                  ["enter", events[index2][1], context],
                  ["exit", events[index2][1], context]
                ]);
              } else {
                offset = 0;
              }
              splice(events, open - 1, index2 - open + 3, nextEvents);
              index2 = open + nextEvents.length - offset - 2;
              break;
            }
          }
        }
      }
      index2 = -1;
      while (++index2 < events.length) {
        if (events[index2][1].type === "attentionSequence") {
          events[index2][1].type = "data";
        }
      }
      return events;
    }
    function tokenizeAttention(effects, ok3) {
      const attentionMarkers2 = this.parser.constructs.attentionMarkers.null;
      const previous2 = this.previous;
      const before = classifyCharacter(previous2);
      let marker;
      return start;
      function start(code2) {
        marker = code2;
        effects.enter("attentionSequence");
        return inside(code2);
      }
      function inside(code2) {
        if (code2 === marker) {
          effects.consume(code2);
          return inside;
        }
        const token = effects.exit("attentionSequence");
        const after = classifyCharacter(code2);
        const open = !after || after === 2 && before || attentionMarkers2.includes(code2);
        const close = !before || before === 2 && after || attentionMarkers2.includes(previous2);
        token._open = Boolean(marker === 42 ? open : open && (before || !close));
        token._close = Boolean(marker === 42 ? close : close && (after || !open));
        return ok3(code2);
      }
    }
    function movePoint(point4, offset) {
      point4.column += offset;
      point4.offset += offset;
      point4._bufferIndex += offset;
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/autolink.js
    var autolink = {
      name: "autolink",
      tokenize: tokenizeAutolink
    };
    function tokenizeAutolink(effects, ok3, nok) {
      let size = 0;
      return start;
      function start(code2) {
        effects.enter("autolink");
        effects.enter("autolinkMarker");
        effects.consume(code2);
        effects.exit("autolinkMarker");
        effects.enter("autolinkProtocol");
        return open;
      }
      function open(code2) {
        if (asciiAlpha(code2)) {
          effects.consume(code2);
          return schemeOrEmailAtext;
        }
        return emailAtext(code2);
      }
      function schemeOrEmailAtext(code2) {
        if (code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) {
          size = 1;
          return schemeInsideOrEmailAtext(code2);
        }
        return emailAtext(code2);
      }
      function schemeInsideOrEmailAtext(code2) {
        if (code2 === 58) {
          effects.consume(code2);
          size = 0;
          return urlInside;
        }
        if ((code2 === 43 || code2 === 45 || code2 === 46 || asciiAlphanumeric(code2)) && size++ < 32) {
          effects.consume(code2);
          return schemeInsideOrEmailAtext;
        }
        size = 0;
        return emailAtext(code2);
      }
      function urlInside(code2) {
        if (code2 === 62) {
          effects.exit("autolinkProtocol");
          effects.enter("autolinkMarker");
          effects.consume(code2);
          effects.exit("autolinkMarker");
          effects.exit("autolink");
          return ok3;
        }
        if (code2 === null || code2 === 32 || code2 === 60 || asciiControl(code2)) {
          return nok(code2);
        }
        effects.consume(code2);
        return urlInside;
      }
      function emailAtext(code2) {
        if (code2 === 64) {
          effects.consume(code2);
          return emailAtSignOrDot;
        }
        if (asciiAtext(code2)) {
          effects.consume(code2);
          return emailAtext;
        }
        return nok(code2);
      }
      function emailAtSignOrDot(code2) {
        return asciiAlphanumeric(code2) ? emailLabel(code2) : nok(code2);
      }
      function emailLabel(code2) {
        if (code2 === 46) {
          effects.consume(code2);
          size = 0;
          return emailAtSignOrDot;
        }
        if (code2 === 62) {
          effects.exit("autolinkProtocol").type = "autolinkEmail";
          effects.enter("autolinkMarker");
          effects.consume(code2);
          effects.exit("autolinkMarker");
          effects.exit("autolink");
          return ok3;
        }
        return emailValue(code2);
      }
      function emailValue(code2) {
        if ((code2 === 45 || asciiAlphanumeric(code2)) && size++ < 63) {
          const next = code2 === 45 ? emailValue : emailLabel;
          effects.consume(code2);
          return next;
        }
        return nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/blank-line.js
    var blankLine = {
      tokenize: tokenizeBlankLine,
      partial: true
    };
    function tokenizeBlankLine(effects, ok3, nok) {
      return start;
      function start(code2) {
        return markdownSpace(code2) ? factorySpace(effects, after, "linePrefix")(code2) : after(code2);
      }
      function after(code2) {
        return code2 === null || markdownLineEnding(code2) ? ok3(code2) : nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/block-quote.js
    var blockQuote = {
      name: "blockQuote",
      tokenize: tokenizeBlockQuoteStart,
      continuation: {
        tokenize: tokenizeBlockQuoteContinuation
      },
      exit
    };
    function tokenizeBlockQuoteStart(effects, ok3, nok) {
      const self2 = this;
      return start;
      function start(code2) {
        if (code2 === 62) {
          const state = self2.containerState;
          if (!state.open) {
            effects.enter("blockQuote", {
              _container: true
            });
            state.open = true;
          }
          effects.enter("blockQuotePrefix");
          effects.enter("blockQuoteMarker");
          effects.consume(code2);
          effects.exit("blockQuoteMarker");
          return after;
        }
        return nok(code2);
      }
      function after(code2) {
        if (markdownSpace(code2)) {
          effects.enter("blockQuotePrefixWhitespace");
          effects.consume(code2);
          effects.exit("blockQuotePrefixWhitespace");
          effects.exit("blockQuotePrefix");
          return ok3;
        }
        effects.exit("blockQuotePrefix");
        return ok3(code2);
      }
    }
    function tokenizeBlockQuoteContinuation(effects, ok3, nok) {
      const self2 = this;
      return contStart;
      function contStart(code2) {
        if (markdownSpace(code2)) {
          return factorySpace(
            effects,
            contBefore,
            "linePrefix",
            self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
          )(code2);
        }
        return contBefore(code2);
      }
      function contBefore(code2) {
        return effects.attempt(blockQuote, ok3, nok)(code2);
      }
    }
    function exit(effects) {
      effects.exit("blockQuote");
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/character-escape.js
    var characterEscape = {
      name: "characterEscape",
      tokenize: tokenizeCharacterEscape
    };
    function tokenizeCharacterEscape(effects, ok3, nok) {
      return start;
      function start(code2) {
        effects.enter("characterEscape");
        effects.enter("escapeMarker");
        effects.consume(code2);
        effects.exit("escapeMarker");
        return inside;
      }
      function inside(code2) {
        if (asciiPunctuation(code2)) {
          effects.enter("characterEscapeValue");
          effects.consume(code2);
          effects.exit("characterEscapeValue");
          effects.exit("characterEscape");
          return ok3;
        }
        return nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/character-reference.js
    var characterReference = {
      name: "characterReference",
      tokenize: tokenizeCharacterReference
    };
    function tokenizeCharacterReference(effects, ok3, nok) {
      const self2 = this;
      let size = 0;
      let max;
      let test;
      return start;
      function start(code2) {
        effects.enter("characterReference");
        effects.enter("characterReferenceMarker");
        effects.consume(code2);
        effects.exit("characterReferenceMarker");
        return open;
      }
      function open(code2) {
        if (code2 === 35) {
          effects.enter("characterReferenceMarkerNumeric");
          effects.consume(code2);
          effects.exit("characterReferenceMarkerNumeric");
          return numeric;
        }
        effects.enter("characterReferenceValue");
        max = 31;
        test = asciiAlphanumeric;
        return value(code2);
      }
      function numeric(code2) {
        if (code2 === 88 || code2 === 120) {
          effects.enter("characterReferenceMarkerHexadecimal");
          effects.consume(code2);
          effects.exit("characterReferenceMarkerHexadecimal");
          effects.enter("characterReferenceValue");
          max = 6;
          test = asciiHexDigit;
          return value;
        }
        effects.enter("characterReferenceValue");
        max = 7;
        test = asciiDigit;
        return value(code2);
      }
      function value(code2) {
        if (code2 === 59 && size) {
          const token = effects.exit("characterReferenceValue");
          if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self2.sliceSerialize(token))) {
            return nok(code2);
          }
          effects.enter("characterReferenceMarker");
          effects.consume(code2);
          effects.exit("characterReferenceMarker");
          effects.exit("characterReference");
          return ok3;
        }
        if (test(code2) && size++ < max) {
          effects.consume(code2);
          return value;
        }
        return nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/code-fenced.js
    var nonLazyContinuation = {
      tokenize: tokenizeNonLazyContinuation,
      partial: true
    };
    var codeFenced = {
      name: "codeFenced",
      tokenize: tokenizeCodeFenced,
      concrete: true
    };
    function tokenizeCodeFenced(effects, ok3, nok) {
      const self2 = this;
      const closeStart = {
        tokenize: tokenizeCloseStart,
        partial: true
      };
      let initialPrefix = 0;
      let sizeOpen = 0;
      let marker;
      return start;
      function start(code2) {
        return beforeSequenceOpen(code2);
      }
      function beforeSequenceOpen(code2) {
        const tail = self2.events[self2.events.length - 1];
        initialPrefix = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
        marker = code2;
        effects.enter("codeFenced");
        effects.enter("codeFencedFence");
        effects.enter("codeFencedFenceSequence");
        return sequenceOpen(code2);
      }
      function sequenceOpen(code2) {
        if (code2 === marker) {
          sizeOpen++;
          effects.consume(code2);
          return sequenceOpen;
        }
        if (sizeOpen < 3) {
          return nok(code2);
        }
        effects.exit("codeFencedFenceSequence");
        return markdownSpace(code2) ? factorySpace(effects, infoBefore, "whitespace")(code2) : infoBefore(code2);
      }
      function infoBefore(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("codeFencedFence");
          return self2.interrupt ? ok3(code2) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
        }
        effects.enter("codeFencedFenceInfo");
        effects.enter("chunkString", {
          contentType: "string"
        });
        return info(code2);
      }
      function info(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("chunkString");
          effects.exit("codeFencedFenceInfo");
          return infoBefore(code2);
        }
        if (markdownSpace(code2)) {
          effects.exit("chunkString");
          effects.exit("codeFencedFenceInfo");
          return factorySpace(effects, metaBefore, "whitespace")(code2);
        }
        if (code2 === 96 && code2 === marker) {
          return nok(code2);
        }
        effects.consume(code2);
        return info;
      }
      function metaBefore(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          return infoBefore(code2);
        }
        effects.enter("codeFencedFenceMeta");
        effects.enter("chunkString", {
          contentType: "string"
        });
        return meta(code2);
      }
      function meta(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("chunkString");
          effects.exit("codeFencedFenceMeta");
          return infoBefore(code2);
        }
        if (code2 === 96 && code2 === marker) {
          return nok(code2);
        }
        effects.consume(code2);
        return meta;
      }
      function atNonLazyBreak(code2) {
        return effects.attempt(closeStart, after, contentBefore)(code2);
      }
      function contentBefore(code2) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return contentStart;
      }
      function contentStart(code2) {
        return initialPrefix > 0 && markdownSpace(code2) ? factorySpace(
          effects,
          beforeContentChunk,
          "linePrefix",
          initialPrefix + 1
        )(code2) : beforeContentChunk(code2);
      }
      function beforeContentChunk(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code2);
        }
        effects.enter("codeFlowValue");
        return contentChunk(code2);
      }
      function contentChunk(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("codeFlowValue");
          return beforeContentChunk(code2);
        }
        effects.consume(code2);
        return contentChunk;
      }
      function after(code2) {
        effects.exit("codeFenced");
        return ok3(code2);
      }
      function tokenizeCloseStart(effects2, ok4, nok2) {
        let size = 0;
        return startBefore;
        function startBefore(code2) {
          effects2.enter("lineEnding");
          effects2.consume(code2);
          effects2.exit("lineEnding");
          return start2;
        }
        function start2(code2) {
          effects2.enter("codeFencedFence");
          return markdownSpace(code2) ? factorySpace(
            effects2,
            beforeSequenceClose,
            "linePrefix",
            self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
          )(code2) : beforeSequenceClose(code2);
        }
        function beforeSequenceClose(code2) {
          if (code2 === marker) {
            effects2.enter("codeFencedFenceSequence");
            return sequenceClose(code2);
          }
          return nok2(code2);
        }
        function sequenceClose(code2) {
          if (code2 === marker) {
            size++;
            effects2.consume(code2);
            return sequenceClose;
          }
          if (size >= sizeOpen) {
            effects2.exit("codeFencedFenceSequence");
            return markdownSpace(code2) ? factorySpace(effects2, sequenceCloseAfter, "whitespace")(code2) : sequenceCloseAfter(code2);
          }
          return nok2(code2);
        }
        function sequenceCloseAfter(code2) {
          if (code2 === null || markdownLineEnding(code2)) {
            effects2.exit("codeFencedFence");
            return ok4(code2);
          }
          return nok2(code2);
        }
      }
    }
    function tokenizeNonLazyContinuation(effects, ok3, nok) {
      const self2 = this;
      return start;
      function start(code2) {
        if (code2 === null) {
          return nok(code2);
        }
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return lineStart;
      }
      function lineStart(code2) {
        return self2.parser.lazy[self2.now().line] ? nok(code2) : ok3(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/code-indented.js
    var codeIndented = {
      name: "codeIndented",
      tokenize: tokenizeCodeIndented
    };
    var furtherStart = {
      tokenize: tokenizeFurtherStart,
      partial: true
    };
    function tokenizeCodeIndented(effects, ok3, nok) {
      const self2 = this;
      return start;
      function start(code2) {
        effects.enter("codeIndented");
        return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
      }
      function afterPrefix(code2) {
        const tail = self2.events[self2.events.length - 1];
        return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? atBreak(code2) : nok(code2);
      }
      function atBreak(code2) {
        if (code2 === null) {
          return after(code2);
        }
        if (markdownLineEnding(code2)) {
          return effects.attempt(furtherStart, atBreak, after)(code2);
        }
        effects.enter("codeFlowValue");
        return inside(code2);
      }
      function inside(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("codeFlowValue");
          return atBreak(code2);
        }
        effects.consume(code2);
        return inside;
      }
      function after(code2) {
        effects.exit("codeIndented");
        return ok3(code2);
      }
    }
    function tokenizeFurtherStart(effects, ok3, nok) {
      const self2 = this;
      return furtherStart2;
      function furtherStart2(code2) {
        if (self2.parser.lazy[self2.now().line]) {
          return nok(code2);
        }
        if (markdownLineEnding(code2)) {
          effects.enter("lineEnding");
          effects.consume(code2);
          effects.exit("lineEnding");
          return furtherStart2;
        }
        return factorySpace(effects, afterPrefix, "linePrefix", 4 + 1)(code2);
      }
      function afterPrefix(code2) {
        const tail = self2.events[self2.events.length - 1];
        return tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4 ? ok3(code2) : markdownLineEnding(code2) ? furtherStart2(code2) : nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/code-text.js
    var codeText = {
      name: "codeText",
      tokenize: tokenizeCodeText,
      resolve: resolveCodeText,
      previous
    };
    function resolveCodeText(events) {
      let tailExitIndex = events.length - 4;
      let headEnterIndex = 3;
      let index2;
      let enter;
      if ((events[headEnterIndex][1].type === "lineEnding" || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === "lineEnding" || events[tailExitIndex][1].type === "space")) {
        index2 = headEnterIndex;
        while (++index2 < tailExitIndex) {
          if (events[index2][1].type === "codeTextData") {
            events[headEnterIndex][1].type = "codeTextPadding";
            events[tailExitIndex][1].type = "codeTextPadding";
            headEnterIndex += 2;
            tailExitIndex -= 2;
            break;
          }
        }
      }
      index2 = headEnterIndex - 1;
      tailExitIndex++;
      while (++index2 <= tailExitIndex) {
        if (enter === void 0) {
          if (index2 !== tailExitIndex && events[index2][1].type !== "lineEnding") {
            enter = index2;
          }
        } else if (index2 === tailExitIndex || events[index2][1].type === "lineEnding") {
          events[enter][1].type = "codeTextData";
          if (index2 !== enter + 2) {
            events[enter][1].end = events[index2 - 1][1].end;
            events.splice(enter + 2, index2 - enter - 2);
            tailExitIndex -= index2 - enter - 2;
            index2 = enter + 2;
          }
          enter = void 0;
        }
      }
      return events;
    }
    function previous(code2) {
      return code2 !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
    }
    function tokenizeCodeText(effects, ok3, nok) {
      let sizeOpen = 0;
      let size;
      let token;
      return start;
      function start(code2) {
        effects.enter("codeText");
        effects.enter("codeTextSequence");
        return sequenceOpen(code2);
      }
      function sequenceOpen(code2) {
        if (code2 === 96) {
          effects.consume(code2);
          sizeOpen++;
          return sequenceOpen;
        }
        effects.exit("codeTextSequence");
        return between(code2);
      }
      function between(code2) {
        if (code2 === null) {
          return nok(code2);
        }
        if (code2 === 32) {
          effects.enter("space");
          effects.consume(code2);
          effects.exit("space");
          return between;
        }
        if (code2 === 96) {
          token = effects.enter("codeTextSequence");
          size = 0;
          return sequenceClose(code2);
        }
        if (markdownLineEnding(code2)) {
          effects.enter("lineEnding");
          effects.consume(code2);
          effects.exit("lineEnding");
          return between;
        }
        effects.enter("codeTextData");
        return data(code2);
      }
      function data(code2) {
        if (code2 === null || code2 === 32 || code2 === 96 || markdownLineEnding(code2)) {
          effects.exit("codeTextData");
          return between(code2);
        }
        effects.consume(code2);
        return data;
      }
      function sequenceClose(code2) {
        if (code2 === 96) {
          effects.consume(code2);
          size++;
          return sequenceClose;
        }
        if (size === sizeOpen) {
          effects.exit("codeTextSequence");
          effects.exit("codeText");
          return ok3(code2);
        }
        token.type = "codeTextData";
        return data(code2);
      }
    }

    // node_modules/.pnpm/micromark-util-subtokenize@2.0.0/node_modules/micromark-util-subtokenize/index.js
    function subtokenize(events) {
      const jumps = {};
      let index2 = -1;
      let event;
      let lineIndex;
      let otherIndex;
      let otherEvent;
      let parameters;
      let subevents;
      let more;
      while (++index2 < events.length) {
        while (index2 in jumps) {
          index2 = jumps[index2];
        }
        event = events[index2];
        if (index2 && event[1].type === "chunkFlow" && events[index2 - 1][1].type === "listItemPrefix") {
          subevents = event[1]._tokenizer.events;
          otherIndex = 0;
          if (otherIndex < subevents.length && subevents[otherIndex][1].type === "lineEndingBlank") {
            otherIndex += 2;
          }
          if (otherIndex < subevents.length && subevents[otherIndex][1].type === "content") {
            while (++otherIndex < subevents.length) {
              if (subevents[otherIndex][1].type === "content") {
                break;
              }
              if (subevents[otherIndex][1].type === "chunkText") {
                subevents[otherIndex][1]._isInFirstContentOfListItem = true;
                otherIndex++;
              }
            }
          }
        }
        if (event[0] === "enter") {
          if (event[1].contentType) {
            Object.assign(jumps, subcontent(events, index2));
            index2 = jumps[index2];
            more = true;
          }
        } else if (event[1]._container) {
          otherIndex = index2;
          lineIndex = void 0;
          while (otherIndex--) {
            otherEvent = events[otherIndex];
            if (otherEvent[1].type === "lineEnding" || otherEvent[1].type === "lineEndingBlank") {
              if (otherEvent[0] === "enter") {
                if (lineIndex) {
                  events[lineIndex][1].type = "lineEndingBlank";
                }
                otherEvent[1].type = "lineEnding";
                lineIndex = otherIndex;
              }
            } else {
              break;
            }
          }
          if (lineIndex) {
            event[1].end = Object.assign({}, events[lineIndex][1].start);
            parameters = events.slice(lineIndex, index2);
            parameters.unshift(event);
            splice(events, lineIndex, index2 - lineIndex + 1, parameters);
          }
        }
      }
      return !more;
    }
    function subcontent(events, eventIndex) {
      const token = events[eventIndex][1];
      const context = events[eventIndex][2];
      let startPosition = eventIndex - 1;
      const startPositions = [];
      const tokenizer = token._tokenizer || context.parser[token.contentType](token.start);
      const childEvents = tokenizer.events;
      const jumps = [];
      const gaps = {};
      let stream;
      let previous2;
      let index2 = -1;
      let current = token;
      let adjust = 0;
      let start = 0;
      const breaks = [start];
      while (current) {
        while (events[++startPosition][1] !== current) {
        }
        startPositions.push(startPosition);
        if (!current._tokenizer) {
          stream = context.sliceStream(current);
          if (!current.next) {
            stream.push(null);
          }
          if (previous2) {
            tokenizer.defineSkip(current.start);
          }
          if (current._isInFirstContentOfListItem) {
            tokenizer._gfmTasklistFirstContentOfListItem = true;
          }
          tokenizer.write(stream);
          if (current._isInFirstContentOfListItem) {
            tokenizer._gfmTasklistFirstContentOfListItem = void 0;
          }
        }
        previous2 = current;
        current = current.next;
      }
      current = token;
      while (++index2 < childEvents.length) {
        if (
          // Find a void token that includes a break.
          childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line
        ) {
          start = index2 + 1;
          breaks.push(start);
          current._tokenizer = void 0;
          current.previous = void 0;
          current = current.next;
        }
      }
      tokenizer.events = [];
      if (current) {
        current._tokenizer = void 0;
        current.previous = void 0;
      } else {
        breaks.pop();
      }
      index2 = breaks.length;
      while (index2--) {
        const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
        const start2 = startPositions.pop();
        jumps.unshift([start2, start2 + slice.length - 1]);
        splice(events, start2, 2, slice);
      }
      index2 = -1;
      while (++index2 < jumps.length) {
        gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
        adjust += jumps[index2][1] - jumps[index2][0] - 1;
      }
      return gaps;
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/content.js
    var content2 = {
      tokenize: tokenizeContent,
      resolve: resolveContent
    };
    var continuationConstruct = {
      tokenize: tokenizeContinuation,
      partial: true
    };
    function resolveContent(events) {
      subtokenize(events);
      return events;
    }
    function tokenizeContent(effects, ok3) {
      let previous2;
      return chunkStart;
      function chunkStart(code2) {
        effects.enter("content");
        previous2 = effects.enter("chunkContent", {
          contentType: "content"
        });
        return chunkInside(code2);
      }
      function chunkInside(code2) {
        if (code2 === null) {
          return contentEnd(code2);
        }
        if (markdownLineEnding(code2)) {
          return effects.check(
            continuationConstruct,
            contentContinue,
            contentEnd
          )(code2);
        }
        effects.consume(code2);
        return chunkInside;
      }
      function contentEnd(code2) {
        effects.exit("chunkContent");
        effects.exit("content");
        return ok3(code2);
      }
      function contentContinue(code2) {
        effects.consume(code2);
        effects.exit("chunkContent");
        previous2.next = effects.enter("chunkContent", {
          contentType: "content",
          previous: previous2
        });
        previous2 = previous2.next;
        return chunkInside;
      }
    }
    function tokenizeContinuation(effects, ok3, nok) {
      const self2 = this;
      return startLookahead;
      function startLookahead(code2) {
        effects.exit("chunkContent");
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return factorySpace(effects, prefixed, "linePrefix");
      }
      function prefixed(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          return nok(code2);
        }
        const tail = self2.events[self2.events.length - 1];
        if (!self2.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === "linePrefix" && tail[2].sliceSerialize(tail[1], true).length >= 4) {
          return ok3(code2);
        }
        return effects.interrupt(self2.parser.constructs.flow, nok, ok3)(code2);
      }
    }

    // node_modules/.pnpm/micromark-factory-destination@2.0.0/node_modules/micromark-factory-destination/index.js
    function factoryDestination(effects, ok3, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
      const limit = max || Number.POSITIVE_INFINITY;
      let balance = 0;
      return start;
      function start(code2) {
        if (code2 === 60) {
          effects.enter(type);
          effects.enter(literalType);
          effects.enter(literalMarkerType);
          effects.consume(code2);
          effects.exit(literalMarkerType);
          return enclosedBefore;
        }
        if (code2 === null || code2 === 32 || code2 === 41 || asciiControl(code2)) {
          return nok(code2);
        }
        effects.enter(type);
        effects.enter(rawType);
        effects.enter(stringType);
        effects.enter("chunkString", {
          contentType: "string"
        });
        return raw(code2);
      }
      function enclosedBefore(code2) {
        if (code2 === 62) {
          effects.enter(literalMarkerType);
          effects.consume(code2);
          effects.exit(literalMarkerType);
          effects.exit(literalType);
          effects.exit(type);
          return ok3;
        }
        effects.enter(stringType);
        effects.enter("chunkString", {
          contentType: "string"
        });
        return enclosed(code2);
      }
      function enclosed(code2) {
        if (code2 === 62) {
          effects.exit("chunkString");
          effects.exit(stringType);
          return enclosedBefore(code2);
        }
        if (code2 === null || code2 === 60 || markdownLineEnding(code2)) {
          return nok(code2);
        }
        effects.consume(code2);
        return code2 === 92 ? enclosedEscape : enclosed;
      }
      function enclosedEscape(code2) {
        if (code2 === 60 || code2 === 62 || code2 === 92) {
          effects.consume(code2);
          return enclosed;
        }
        return enclosed(code2);
      }
      function raw(code2) {
        if (!balance && (code2 === null || code2 === 41 || markdownLineEndingOrSpace(code2))) {
          effects.exit("chunkString");
          effects.exit(stringType);
          effects.exit(rawType);
          effects.exit(type);
          return ok3(code2);
        }
        if (balance < limit && code2 === 40) {
          effects.consume(code2);
          balance++;
          return raw;
        }
        if (code2 === 41) {
          effects.consume(code2);
          balance--;
          return raw;
        }
        if (code2 === null || code2 === 32 || code2 === 40 || asciiControl(code2)) {
          return nok(code2);
        }
        effects.consume(code2);
        return code2 === 92 ? rawEscape : raw;
      }
      function rawEscape(code2) {
        if (code2 === 40 || code2 === 41 || code2 === 92) {
          effects.consume(code2);
          return raw;
        }
        return raw(code2);
      }
    }

    // node_modules/.pnpm/micromark-factory-label@2.0.0/node_modules/micromark-factory-label/index.js
    function factoryLabel(effects, ok3, nok, type, markerType, stringType) {
      const self2 = this;
      let size = 0;
      let seen;
      return start;
      function start(code2) {
        effects.enter(type);
        effects.enter(markerType);
        effects.consume(code2);
        effects.exit(markerType);
        effects.enter(stringType);
        return atBreak;
      }
      function atBreak(code2) {
        if (size > 999 || code2 === null || code2 === 91 || code2 === 93 && !seen || // To do: remove in the future once we’ve switched from
        // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
        // which doesn’t need this.
        // Hidden footnotes hook.
        /* c8 ignore next 3 */
        code2 === 94 && !size && "_hiddenFootnoteSupport" in self2.parser.constructs) {
          return nok(code2);
        }
        if (code2 === 93) {
          effects.exit(stringType);
          effects.enter(markerType);
          effects.consume(code2);
          effects.exit(markerType);
          effects.exit(type);
          return ok3;
        }
        if (markdownLineEnding(code2)) {
          effects.enter("lineEnding");
          effects.consume(code2);
          effects.exit("lineEnding");
          return atBreak;
        }
        effects.enter("chunkString", {
          contentType: "string"
        });
        return labelInside(code2);
      }
      function labelInside(code2) {
        if (code2 === null || code2 === 91 || code2 === 93 || markdownLineEnding(code2) || size++ > 999) {
          effects.exit("chunkString");
          return atBreak(code2);
        }
        effects.consume(code2);
        if (!seen)
          seen = !markdownSpace(code2);
        return code2 === 92 ? labelEscape : labelInside;
      }
      function labelEscape(code2) {
        if (code2 === 91 || code2 === 92 || code2 === 93) {
          effects.consume(code2);
          size++;
          return labelInside;
        }
        return labelInside(code2);
      }
    }

    // node_modules/.pnpm/micromark-factory-title@2.0.0/node_modules/micromark-factory-title/index.js
    function factoryTitle(effects, ok3, nok, type, markerType, stringType) {
      let marker;
      return start;
      function start(code2) {
        if (code2 === 34 || code2 === 39 || code2 === 40) {
          effects.enter(type);
          effects.enter(markerType);
          effects.consume(code2);
          effects.exit(markerType);
          marker = code2 === 40 ? 41 : code2;
          return begin;
        }
        return nok(code2);
      }
      function begin(code2) {
        if (code2 === marker) {
          effects.enter(markerType);
          effects.consume(code2);
          effects.exit(markerType);
          effects.exit(type);
          return ok3;
        }
        effects.enter(stringType);
        return atBreak(code2);
      }
      function atBreak(code2) {
        if (code2 === marker) {
          effects.exit(stringType);
          return begin(marker);
        }
        if (code2 === null) {
          return nok(code2);
        }
        if (markdownLineEnding(code2)) {
          effects.enter("lineEnding");
          effects.consume(code2);
          effects.exit("lineEnding");
          return factorySpace(effects, atBreak, "linePrefix");
        }
        effects.enter("chunkString", {
          contentType: "string"
        });
        return inside(code2);
      }
      function inside(code2) {
        if (code2 === marker || code2 === null || markdownLineEnding(code2)) {
          effects.exit("chunkString");
          return atBreak(code2);
        }
        effects.consume(code2);
        return code2 === 92 ? escape : inside;
      }
      function escape(code2) {
        if (code2 === marker || code2 === 92) {
          effects.consume(code2);
          return inside;
        }
        return inside(code2);
      }
    }

    // node_modules/.pnpm/micromark-factory-whitespace@2.0.0/node_modules/micromark-factory-whitespace/index.js
    function factoryWhitespace(effects, ok3) {
      let seen;
      return start;
      function start(code2) {
        if (markdownLineEnding(code2)) {
          effects.enter("lineEnding");
          effects.consume(code2);
          effects.exit("lineEnding");
          seen = true;
          return start;
        }
        if (markdownSpace(code2)) {
          return factorySpace(
            effects,
            start,
            seen ? "linePrefix" : "lineSuffix"
          )(code2);
        }
        return ok3(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/definition.js
    var definition = {
      name: "definition",
      tokenize: tokenizeDefinition
    };
    var titleBefore = {
      tokenize: tokenizeTitleBefore,
      partial: true
    };
    function tokenizeDefinition(effects, ok3, nok) {
      const self2 = this;
      let identifier;
      return start;
      function start(code2) {
        effects.enter("definition");
        return before(code2);
      }
      function before(code2) {
        return factoryLabel.call(
          self2,
          effects,
          labelAfter,
          // Note: we don’t need to reset the way `markdown-rs` does.
          nok,
          "definitionLabel",
          "definitionLabelMarker",
          "definitionLabelString"
        )(code2);
      }
      function labelAfter(code2) {
        identifier = normalizeIdentifier(
          self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1)
        );
        if (code2 === 58) {
          effects.enter("definitionMarker");
          effects.consume(code2);
          effects.exit("definitionMarker");
          return markerAfter;
        }
        return nok(code2);
      }
      function markerAfter(code2) {
        return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, destinationBefore)(code2) : destinationBefore(code2);
      }
      function destinationBefore(code2) {
        return factoryDestination(
          effects,
          destinationAfter,
          // Note: we don’t need to reset the way `markdown-rs` does.
          nok,
          "definitionDestination",
          "definitionDestinationLiteral",
          "definitionDestinationLiteralMarker",
          "definitionDestinationRaw",
          "definitionDestinationString"
        )(code2);
      }
      function destinationAfter(code2) {
        return effects.attempt(titleBefore, after, after)(code2);
      }
      function after(code2) {
        return markdownSpace(code2) ? factorySpace(effects, afterWhitespace, "whitespace")(code2) : afterWhitespace(code2);
      }
      function afterWhitespace(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("definition");
          self2.parser.defined.push(identifier);
          return ok3(code2);
        }
        return nok(code2);
      }
    }
    function tokenizeTitleBefore(effects, ok3, nok) {
      return titleBefore2;
      function titleBefore2(code2) {
        return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, beforeMarker)(code2) : nok(code2);
      }
      function beforeMarker(code2) {
        return factoryTitle(
          effects,
          titleAfter,
          nok,
          "definitionTitle",
          "definitionTitleMarker",
          "definitionTitleString"
        )(code2);
      }
      function titleAfter(code2) {
        return markdownSpace(code2) ? factorySpace(effects, titleAfterOptionalWhitespace, "whitespace")(code2) : titleAfterOptionalWhitespace(code2);
      }
      function titleAfterOptionalWhitespace(code2) {
        return code2 === null || markdownLineEnding(code2) ? ok3(code2) : nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/hard-break-escape.js
    var hardBreakEscape = {
      name: "hardBreakEscape",
      tokenize: tokenizeHardBreakEscape
    };
    function tokenizeHardBreakEscape(effects, ok3, nok) {
      return start;
      function start(code2) {
        effects.enter("hardBreakEscape");
        effects.consume(code2);
        return after;
      }
      function after(code2) {
        if (markdownLineEnding(code2)) {
          effects.exit("hardBreakEscape");
          return ok3(code2);
        }
        return nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/heading-atx.js
    var headingAtx = {
      name: "headingAtx",
      tokenize: tokenizeHeadingAtx,
      resolve: resolveHeadingAtx
    };
    function resolveHeadingAtx(events, context) {
      let contentEnd = events.length - 2;
      let contentStart = 3;
      let content3;
      let text4;
      if (events[contentStart][1].type === "whitespace") {
        contentStart += 2;
      }
      if (contentEnd - 2 > contentStart && events[contentEnd][1].type === "whitespace") {
        contentEnd -= 2;
      }
      if (events[contentEnd][1].type === "atxHeadingSequence" && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === "whitespace")) {
        contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
      }
      if (contentEnd > contentStart) {
        content3 = {
          type: "atxHeadingText",
          start: events[contentStart][1].start,
          end: events[contentEnd][1].end
        };
        text4 = {
          type: "chunkText",
          start: events[contentStart][1].start,
          end: events[contentEnd][1].end,
          contentType: "text"
        };
        splice(events, contentStart, contentEnd - contentStart + 1, [
          ["enter", content3, context],
          ["enter", text4, context],
          ["exit", text4, context],
          ["exit", content3, context]
        ]);
      }
      return events;
    }
    function tokenizeHeadingAtx(effects, ok3, nok) {
      let size = 0;
      return start;
      function start(code2) {
        effects.enter("atxHeading");
        return before(code2);
      }
      function before(code2) {
        effects.enter("atxHeadingSequence");
        return sequenceOpen(code2);
      }
      function sequenceOpen(code2) {
        if (code2 === 35 && size++ < 6) {
          effects.consume(code2);
          return sequenceOpen;
        }
        if (code2 === null || markdownLineEndingOrSpace(code2)) {
          effects.exit("atxHeadingSequence");
          return atBreak(code2);
        }
        return nok(code2);
      }
      function atBreak(code2) {
        if (code2 === 35) {
          effects.enter("atxHeadingSequence");
          return sequenceFurther(code2);
        }
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("atxHeading");
          return ok3(code2);
        }
        if (markdownSpace(code2)) {
          return factorySpace(effects, atBreak, "whitespace")(code2);
        }
        effects.enter("atxHeadingText");
        return data(code2);
      }
      function sequenceFurther(code2) {
        if (code2 === 35) {
          effects.consume(code2);
          return sequenceFurther;
        }
        effects.exit("atxHeadingSequence");
        return atBreak(code2);
      }
      function data(code2) {
        if (code2 === null || code2 === 35 || markdownLineEndingOrSpace(code2)) {
          effects.exit("atxHeadingText");
          return atBreak(code2);
        }
        effects.consume(code2);
        return data;
      }
    }

    // node_modules/.pnpm/micromark-util-html-tag-name@2.0.0/node_modules/micromark-util-html-tag-name/index.js
    var htmlBlockNames = [
      "address",
      "article",
      "aside",
      "base",
      "basefont",
      "blockquote",
      "body",
      "caption",
      "center",
      "col",
      "colgroup",
      "dd",
      "details",
      "dialog",
      "dir",
      "div",
      "dl",
      "dt",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "frame",
      "frameset",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hr",
      "html",
      "iframe",
      "legend",
      "li",
      "link",
      "main",
      "menu",
      "menuitem",
      "nav",
      "noframes",
      "ol",
      "optgroup",
      "option",
      "p",
      "param",
      "search",
      "section",
      "summary",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "title",
      "tr",
      "track",
      "ul"
    ];
    var htmlRawNames = ["pre", "script", "style", "textarea"];

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/html-flow.js
    var htmlFlow = {
      name: "htmlFlow",
      tokenize: tokenizeHtmlFlow,
      resolveTo: resolveToHtmlFlow,
      concrete: true
    };
    var blankLineBefore = {
      tokenize: tokenizeBlankLineBefore,
      partial: true
    };
    var nonLazyContinuationStart = {
      tokenize: tokenizeNonLazyContinuationStart,
      partial: true
    };
    function resolveToHtmlFlow(events) {
      let index2 = events.length;
      while (index2--) {
        if (events[index2][0] === "enter" && events[index2][1].type === "htmlFlow") {
          break;
        }
      }
      if (index2 > 1 && events[index2 - 2][1].type === "linePrefix") {
        events[index2][1].start = events[index2 - 2][1].start;
        events[index2 + 1][1].start = events[index2 - 2][1].start;
        events.splice(index2 - 2, 2);
      }
      return events;
    }
    function tokenizeHtmlFlow(effects, ok3, nok) {
      const self2 = this;
      let marker;
      let closingTag;
      let buffer;
      let index2;
      let markerB;
      return start;
      function start(code2) {
        return before(code2);
      }
      function before(code2) {
        effects.enter("htmlFlow");
        effects.enter("htmlFlowData");
        effects.consume(code2);
        return open;
      }
      function open(code2) {
        if (code2 === 33) {
          effects.consume(code2);
          return declarationOpen;
        }
        if (code2 === 47) {
          effects.consume(code2);
          closingTag = true;
          return tagCloseStart;
        }
        if (code2 === 63) {
          effects.consume(code2);
          marker = 3;
          return self2.interrupt ? ok3 : continuationDeclarationInside;
        }
        if (asciiAlpha(code2)) {
          effects.consume(code2);
          buffer = String.fromCharCode(code2);
          return tagName;
        }
        return nok(code2);
      }
      function declarationOpen(code2) {
        if (code2 === 45) {
          effects.consume(code2);
          marker = 2;
          return commentOpenInside;
        }
        if (code2 === 91) {
          effects.consume(code2);
          marker = 5;
          index2 = 0;
          return cdataOpenInside;
        }
        if (asciiAlpha(code2)) {
          effects.consume(code2);
          marker = 4;
          return self2.interrupt ? ok3 : continuationDeclarationInside;
        }
        return nok(code2);
      }
      function commentOpenInside(code2) {
        if (code2 === 45) {
          effects.consume(code2);
          return self2.interrupt ? ok3 : continuationDeclarationInside;
        }
        return nok(code2);
      }
      function cdataOpenInside(code2) {
        const value = "CDATA[";
        if (code2 === value.charCodeAt(index2++)) {
          effects.consume(code2);
          if (index2 === value.length) {
            return self2.interrupt ? ok3 : continuation;
          }
          return cdataOpenInside;
        }
        return nok(code2);
      }
      function tagCloseStart(code2) {
        if (asciiAlpha(code2)) {
          effects.consume(code2);
          buffer = String.fromCharCode(code2);
          return tagName;
        }
        return nok(code2);
      }
      function tagName(code2) {
        if (code2 === null || code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
          const slash = code2 === 47;
          const name = buffer.toLowerCase();
          if (!slash && !closingTag && htmlRawNames.includes(name)) {
            marker = 1;
            return self2.interrupt ? ok3(code2) : continuation(code2);
          }
          if (htmlBlockNames.includes(buffer.toLowerCase())) {
            marker = 6;
            if (slash) {
              effects.consume(code2);
              return basicSelfClosing;
            }
            return self2.interrupt ? ok3(code2) : continuation(code2);
          }
          marker = 7;
          return self2.interrupt && !self2.parser.lazy[self2.now().line] ? nok(code2) : closingTag ? completeClosingTagAfter(code2) : completeAttributeNameBefore(code2);
        }
        if (code2 === 45 || asciiAlphanumeric(code2)) {
          effects.consume(code2);
          buffer += String.fromCharCode(code2);
          return tagName;
        }
        return nok(code2);
      }
      function basicSelfClosing(code2) {
        if (code2 === 62) {
          effects.consume(code2);
          return self2.interrupt ? ok3 : continuation;
        }
        return nok(code2);
      }
      function completeClosingTagAfter(code2) {
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return completeClosingTagAfter;
        }
        return completeEnd(code2);
      }
      function completeAttributeNameBefore(code2) {
        if (code2 === 47) {
          effects.consume(code2);
          return completeEnd;
        }
        if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
          effects.consume(code2);
          return completeAttributeName;
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return completeAttributeNameBefore;
        }
        return completeEnd(code2);
      }
      function completeAttributeName(code2) {
        if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
          effects.consume(code2);
          return completeAttributeName;
        }
        return completeAttributeNameAfter(code2);
      }
      function completeAttributeNameAfter(code2) {
        if (code2 === 61) {
          effects.consume(code2);
          return completeAttributeValueBefore;
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return completeAttributeNameAfter;
        }
        return completeAttributeNameBefore(code2);
      }
      function completeAttributeValueBefore(code2) {
        if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
          return nok(code2);
        }
        if (code2 === 34 || code2 === 39) {
          effects.consume(code2);
          markerB = code2;
          return completeAttributeValueQuoted;
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return completeAttributeValueBefore;
        }
        return completeAttributeValueUnquoted(code2);
      }
      function completeAttributeValueQuoted(code2) {
        if (code2 === markerB) {
          effects.consume(code2);
          markerB = null;
          return completeAttributeValueQuotedAfter;
        }
        if (code2 === null || markdownLineEnding(code2)) {
          return nok(code2);
        }
        effects.consume(code2);
        return completeAttributeValueQuoted;
      }
      function completeAttributeValueUnquoted(code2) {
        if (code2 === null || code2 === 34 || code2 === 39 || code2 === 47 || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96 || markdownLineEndingOrSpace(code2)) {
          return completeAttributeNameAfter(code2);
        }
        effects.consume(code2);
        return completeAttributeValueUnquoted;
      }
      function completeAttributeValueQuotedAfter(code2) {
        if (code2 === 47 || code2 === 62 || markdownSpace(code2)) {
          return completeAttributeNameBefore(code2);
        }
        return nok(code2);
      }
      function completeEnd(code2) {
        if (code2 === 62) {
          effects.consume(code2);
          return completeAfter;
        }
        return nok(code2);
      }
      function completeAfter(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          return continuation(code2);
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return completeAfter;
        }
        return nok(code2);
      }
      function continuation(code2) {
        if (code2 === 45 && marker === 2) {
          effects.consume(code2);
          return continuationCommentInside;
        }
        if (code2 === 60 && marker === 1) {
          effects.consume(code2);
          return continuationRawTagOpen;
        }
        if (code2 === 62 && marker === 4) {
          effects.consume(code2);
          return continuationClose;
        }
        if (code2 === 63 && marker === 3) {
          effects.consume(code2);
          return continuationDeclarationInside;
        }
        if (code2 === 93 && marker === 5) {
          effects.consume(code2);
          return continuationCdataInside;
        }
        if (markdownLineEnding(code2) && (marker === 6 || marker === 7)) {
          effects.exit("htmlFlowData");
          return effects.check(
            blankLineBefore,
            continuationAfter,
            continuationStart
          )(code2);
        }
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("htmlFlowData");
          return continuationStart(code2);
        }
        effects.consume(code2);
        return continuation;
      }
      function continuationStart(code2) {
        return effects.check(
          nonLazyContinuationStart,
          continuationStartNonLazy,
          continuationAfter
        )(code2);
      }
      function continuationStartNonLazy(code2) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return continuationBefore;
      }
      function continuationBefore(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          return continuationStart(code2);
        }
        effects.enter("htmlFlowData");
        return continuation(code2);
      }
      function continuationCommentInside(code2) {
        if (code2 === 45) {
          effects.consume(code2);
          return continuationDeclarationInside;
        }
        return continuation(code2);
      }
      function continuationRawTagOpen(code2) {
        if (code2 === 47) {
          effects.consume(code2);
          buffer = "";
          return continuationRawEndTag;
        }
        return continuation(code2);
      }
      function continuationRawEndTag(code2) {
        if (code2 === 62) {
          const name = buffer.toLowerCase();
          if (htmlRawNames.includes(name)) {
            effects.consume(code2);
            return continuationClose;
          }
          return continuation(code2);
        }
        if (asciiAlpha(code2) && buffer.length < 8) {
          effects.consume(code2);
          buffer += String.fromCharCode(code2);
          return continuationRawEndTag;
        }
        return continuation(code2);
      }
      function continuationCdataInside(code2) {
        if (code2 === 93) {
          effects.consume(code2);
          return continuationDeclarationInside;
        }
        return continuation(code2);
      }
      function continuationDeclarationInside(code2) {
        if (code2 === 62) {
          effects.consume(code2);
          return continuationClose;
        }
        if (code2 === 45 && marker === 2) {
          effects.consume(code2);
          return continuationDeclarationInside;
        }
        return continuation(code2);
      }
      function continuationClose(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("htmlFlowData");
          return continuationAfter(code2);
        }
        effects.consume(code2);
        return continuationClose;
      }
      function continuationAfter(code2) {
        effects.exit("htmlFlow");
        return ok3(code2);
      }
    }
    function tokenizeNonLazyContinuationStart(effects, ok3, nok) {
      const self2 = this;
      return start;
      function start(code2) {
        if (markdownLineEnding(code2)) {
          effects.enter("lineEnding");
          effects.consume(code2);
          effects.exit("lineEnding");
          return after;
        }
        return nok(code2);
      }
      function after(code2) {
        return self2.parser.lazy[self2.now().line] ? nok(code2) : ok3(code2);
      }
    }
    function tokenizeBlankLineBefore(effects, ok3, nok) {
      return start;
      function start(code2) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return effects.attempt(blankLine, ok3, nok);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/html-text.js
    var htmlText = {
      name: "htmlText",
      tokenize: tokenizeHtmlText
    };
    function tokenizeHtmlText(effects, ok3, nok) {
      const self2 = this;
      let marker;
      let index2;
      let returnState;
      return start;
      function start(code2) {
        effects.enter("htmlText");
        effects.enter("htmlTextData");
        effects.consume(code2);
        return open;
      }
      function open(code2) {
        if (code2 === 33) {
          effects.consume(code2);
          return declarationOpen;
        }
        if (code2 === 47) {
          effects.consume(code2);
          return tagCloseStart;
        }
        if (code2 === 63) {
          effects.consume(code2);
          return instruction;
        }
        if (asciiAlpha(code2)) {
          effects.consume(code2);
          return tagOpen;
        }
        return nok(code2);
      }
      function declarationOpen(code2) {
        if (code2 === 45) {
          effects.consume(code2);
          return commentOpenInside;
        }
        if (code2 === 91) {
          effects.consume(code2);
          index2 = 0;
          return cdataOpenInside;
        }
        if (asciiAlpha(code2)) {
          effects.consume(code2);
          return declaration;
        }
        return nok(code2);
      }
      function commentOpenInside(code2) {
        if (code2 === 45) {
          effects.consume(code2);
          return commentEnd;
        }
        return nok(code2);
      }
      function comment(code2) {
        if (code2 === null) {
          return nok(code2);
        }
        if (code2 === 45) {
          effects.consume(code2);
          return commentClose;
        }
        if (markdownLineEnding(code2)) {
          returnState = comment;
          return lineEndingBefore(code2);
        }
        effects.consume(code2);
        return comment;
      }
      function commentClose(code2) {
        if (code2 === 45) {
          effects.consume(code2);
          return commentEnd;
        }
        return comment(code2);
      }
      function commentEnd(code2) {
        return code2 === 62 ? end(code2) : code2 === 45 ? commentClose(code2) : comment(code2);
      }
      function cdataOpenInside(code2) {
        const value = "CDATA[";
        if (code2 === value.charCodeAt(index2++)) {
          effects.consume(code2);
          return index2 === value.length ? cdata : cdataOpenInside;
        }
        return nok(code2);
      }
      function cdata(code2) {
        if (code2 === null) {
          return nok(code2);
        }
        if (code2 === 93) {
          effects.consume(code2);
          return cdataClose;
        }
        if (markdownLineEnding(code2)) {
          returnState = cdata;
          return lineEndingBefore(code2);
        }
        effects.consume(code2);
        return cdata;
      }
      function cdataClose(code2) {
        if (code2 === 93) {
          effects.consume(code2);
          return cdataEnd;
        }
        return cdata(code2);
      }
      function cdataEnd(code2) {
        if (code2 === 62) {
          return end(code2);
        }
        if (code2 === 93) {
          effects.consume(code2);
          return cdataEnd;
        }
        return cdata(code2);
      }
      function declaration(code2) {
        if (code2 === null || code2 === 62) {
          return end(code2);
        }
        if (markdownLineEnding(code2)) {
          returnState = declaration;
          return lineEndingBefore(code2);
        }
        effects.consume(code2);
        return declaration;
      }
      function instruction(code2) {
        if (code2 === null) {
          return nok(code2);
        }
        if (code2 === 63) {
          effects.consume(code2);
          return instructionClose;
        }
        if (markdownLineEnding(code2)) {
          returnState = instruction;
          return lineEndingBefore(code2);
        }
        effects.consume(code2);
        return instruction;
      }
      function instructionClose(code2) {
        return code2 === 62 ? end(code2) : instruction(code2);
      }
      function tagCloseStart(code2) {
        if (asciiAlpha(code2)) {
          effects.consume(code2);
          return tagClose;
        }
        return nok(code2);
      }
      function tagClose(code2) {
        if (code2 === 45 || asciiAlphanumeric(code2)) {
          effects.consume(code2);
          return tagClose;
        }
        return tagCloseBetween(code2);
      }
      function tagCloseBetween(code2) {
        if (markdownLineEnding(code2)) {
          returnState = tagCloseBetween;
          return lineEndingBefore(code2);
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return tagCloseBetween;
        }
        return end(code2);
      }
      function tagOpen(code2) {
        if (code2 === 45 || asciiAlphanumeric(code2)) {
          effects.consume(code2);
          return tagOpen;
        }
        if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
          return tagOpenBetween(code2);
        }
        return nok(code2);
      }
      function tagOpenBetween(code2) {
        if (code2 === 47) {
          effects.consume(code2);
          return end;
        }
        if (code2 === 58 || code2 === 95 || asciiAlpha(code2)) {
          effects.consume(code2);
          return tagOpenAttributeName;
        }
        if (markdownLineEnding(code2)) {
          returnState = tagOpenBetween;
          return lineEndingBefore(code2);
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return tagOpenBetween;
        }
        return end(code2);
      }
      function tagOpenAttributeName(code2) {
        if (code2 === 45 || code2 === 46 || code2 === 58 || code2 === 95 || asciiAlphanumeric(code2)) {
          effects.consume(code2);
          return tagOpenAttributeName;
        }
        return tagOpenAttributeNameAfter(code2);
      }
      function tagOpenAttributeNameAfter(code2) {
        if (code2 === 61) {
          effects.consume(code2);
          return tagOpenAttributeValueBefore;
        }
        if (markdownLineEnding(code2)) {
          returnState = tagOpenAttributeNameAfter;
          return lineEndingBefore(code2);
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return tagOpenAttributeNameAfter;
        }
        return tagOpenBetween(code2);
      }
      function tagOpenAttributeValueBefore(code2) {
        if (code2 === null || code2 === 60 || code2 === 61 || code2 === 62 || code2 === 96) {
          return nok(code2);
        }
        if (code2 === 34 || code2 === 39) {
          effects.consume(code2);
          marker = code2;
          return tagOpenAttributeValueQuoted;
        }
        if (markdownLineEnding(code2)) {
          returnState = tagOpenAttributeValueBefore;
          return lineEndingBefore(code2);
        }
        if (markdownSpace(code2)) {
          effects.consume(code2);
          return tagOpenAttributeValueBefore;
        }
        effects.consume(code2);
        return tagOpenAttributeValueUnquoted;
      }
      function tagOpenAttributeValueQuoted(code2) {
        if (code2 === marker) {
          effects.consume(code2);
          marker = void 0;
          return tagOpenAttributeValueQuotedAfter;
        }
        if (code2 === null) {
          return nok(code2);
        }
        if (markdownLineEnding(code2)) {
          returnState = tagOpenAttributeValueQuoted;
          return lineEndingBefore(code2);
        }
        effects.consume(code2);
        return tagOpenAttributeValueQuoted;
      }
      function tagOpenAttributeValueUnquoted(code2) {
        if (code2 === null || code2 === 34 || code2 === 39 || code2 === 60 || code2 === 61 || code2 === 96) {
          return nok(code2);
        }
        if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
          return tagOpenBetween(code2);
        }
        effects.consume(code2);
        return tagOpenAttributeValueUnquoted;
      }
      function tagOpenAttributeValueQuotedAfter(code2) {
        if (code2 === 47 || code2 === 62 || markdownLineEndingOrSpace(code2)) {
          return tagOpenBetween(code2);
        }
        return nok(code2);
      }
      function end(code2) {
        if (code2 === 62) {
          effects.consume(code2);
          effects.exit("htmlTextData");
          effects.exit("htmlText");
          return ok3;
        }
        return nok(code2);
      }
      function lineEndingBefore(code2) {
        effects.exit("htmlTextData");
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return lineEndingAfter;
      }
      function lineEndingAfter(code2) {
        return markdownSpace(code2) ? factorySpace(
          effects,
          lineEndingAfterPrefix,
          "linePrefix",
          self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
        )(code2) : lineEndingAfterPrefix(code2);
      }
      function lineEndingAfterPrefix(code2) {
        effects.enter("htmlTextData");
        return returnState(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/label-end.js
    var labelEnd = {
      name: "labelEnd",
      tokenize: tokenizeLabelEnd,
      resolveTo: resolveToLabelEnd,
      resolveAll: resolveAllLabelEnd
    };
    var resourceConstruct = {
      tokenize: tokenizeResource
    };
    var referenceFullConstruct = {
      tokenize: tokenizeReferenceFull
    };
    var referenceCollapsedConstruct = {
      tokenize: tokenizeReferenceCollapsed
    };
    function resolveAllLabelEnd(events) {
      let index2 = -1;
      while (++index2 < events.length) {
        const token = events[index2][1];
        if (token.type === "labelImage" || token.type === "labelLink" || token.type === "labelEnd") {
          events.splice(index2 + 1, token.type === "labelImage" ? 4 : 2);
          token.type = "data";
          index2++;
        }
      }
      return events;
    }
    function resolveToLabelEnd(events, context) {
      let index2 = events.length;
      let offset = 0;
      let token;
      let open;
      let close;
      let media;
      while (index2--) {
        token = events[index2][1];
        if (open) {
          if (token.type === "link" || token.type === "labelLink" && token._inactive) {
            break;
          }
          if (events[index2][0] === "enter" && token.type === "labelLink") {
            token._inactive = true;
          }
        } else if (close) {
          if (events[index2][0] === "enter" && (token.type === "labelImage" || token.type === "labelLink") && !token._balanced) {
            open = index2;
            if (token.type !== "labelLink") {
              offset = 2;
              break;
            }
          }
        } else if (token.type === "labelEnd") {
          close = index2;
        }
      }
      const group = {
        type: events[open][1].type === "labelLink" ? "link" : "image",
        start: Object.assign({}, events[open][1].start),
        end: Object.assign({}, events[events.length - 1][1].end)
      };
      const label = {
        type: "label",
        start: Object.assign({}, events[open][1].start),
        end: Object.assign({}, events[close][1].end)
      };
      const text4 = {
        type: "labelText",
        start: Object.assign({}, events[open + offset + 2][1].end),
        end: Object.assign({}, events[close - 2][1].start)
      };
      media = [
        ["enter", group, context],
        ["enter", label, context]
      ];
      media = push(media, events.slice(open + 1, open + offset + 3));
      media = push(media, [["enter", text4, context]]);
      media = push(
        media,
        resolveAll(
          context.parser.constructs.insideSpan.null,
          events.slice(open + offset + 4, close - 3),
          context
        )
      );
      media = push(media, [
        ["exit", text4, context],
        events[close - 2],
        events[close - 1],
        ["exit", label, context]
      ]);
      media = push(media, events.slice(close + 1));
      media = push(media, [["exit", group, context]]);
      splice(events, open, events.length, media);
      return events;
    }
    function tokenizeLabelEnd(effects, ok3, nok) {
      const self2 = this;
      let index2 = self2.events.length;
      let labelStart;
      let defined;
      while (index2--) {
        if ((self2.events[index2][1].type === "labelImage" || self2.events[index2][1].type === "labelLink") && !self2.events[index2][1]._balanced) {
          labelStart = self2.events[index2][1];
          break;
        }
      }
      return start;
      function start(code2) {
        if (!labelStart) {
          return nok(code2);
        }
        if (labelStart._inactive) {
          return labelEndNok(code2);
        }
        defined = self2.parser.defined.includes(
          normalizeIdentifier(
            self2.sliceSerialize({
              start: labelStart.end,
              end: self2.now()
            })
          )
        );
        effects.enter("labelEnd");
        effects.enter("labelMarker");
        effects.consume(code2);
        effects.exit("labelMarker");
        effects.exit("labelEnd");
        return after;
      }
      function after(code2) {
        if (code2 === 40) {
          return effects.attempt(
            resourceConstruct,
            labelEndOk,
            defined ? labelEndOk : labelEndNok
          )(code2);
        }
        if (code2 === 91) {
          return effects.attempt(
            referenceFullConstruct,
            labelEndOk,
            defined ? referenceNotFull : labelEndNok
          )(code2);
        }
        return defined ? labelEndOk(code2) : labelEndNok(code2);
      }
      function referenceNotFull(code2) {
        return effects.attempt(
          referenceCollapsedConstruct,
          labelEndOk,
          labelEndNok
        )(code2);
      }
      function labelEndOk(code2) {
        return ok3(code2);
      }
      function labelEndNok(code2) {
        labelStart._balanced = true;
        return nok(code2);
      }
    }
    function tokenizeResource(effects, ok3, nok) {
      return resourceStart;
      function resourceStart(code2) {
        effects.enter("resource");
        effects.enter("resourceMarker");
        effects.consume(code2);
        effects.exit("resourceMarker");
        return resourceBefore;
      }
      function resourceBefore(code2) {
        return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceOpen)(code2) : resourceOpen(code2);
      }
      function resourceOpen(code2) {
        if (code2 === 41) {
          return resourceEnd(code2);
        }
        return factoryDestination(
          effects,
          resourceDestinationAfter,
          resourceDestinationMissing,
          "resourceDestination",
          "resourceDestinationLiteral",
          "resourceDestinationLiteralMarker",
          "resourceDestinationRaw",
          "resourceDestinationString",
          32
        )(code2);
      }
      function resourceDestinationAfter(code2) {
        return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceBetween)(code2) : resourceEnd(code2);
      }
      function resourceDestinationMissing(code2) {
        return nok(code2);
      }
      function resourceBetween(code2) {
        if (code2 === 34 || code2 === 39 || code2 === 40) {
          return factoryTitle(
            effects,
            resourceTitleAfter,
            nok,
            "resourceTitle",
            "resourceTitleMarker",
            "resourceTitleString"
          )(code2);
        }
        return resourceEnd(code2);
      }
      function resourceTitleAfter(code2) {
        return markdownLineEndingOrSpace(code2) ? factoryWhitespace(effects, resourceEnd)(code2) : resourceEnd(code2);
      }
      function resourceEnd(code2) {
        if (code2 === 41) {
          effects.enter("resourceMarker");
          effects.consume(code2);
          effects.exit("resourceMarker");
          effects.exit("resource");
          return ok3;
        }
        return nok(code2);
      }
    }
    function tokenizeReferenceFull(effects, ok3, nok) {
      const self2 = this;
      return referenceFull;
      function referenceFull(code2) {
        return factoryLabel.call(
          self2,
          effects,
          referenceFullAfter,
          referenceFullMissing,
          "reference",
          "referenceMarker",
          "referenceString"
        )(code2);
      }
      function referenceFullAfter(code2) {
        return self2.parser.defined.includes(
          normalizeIdentifier(
            self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1)
          )
        ) ? ok3(code2) : nok(code2);
      }
      function referenceFullMissing(code2) {
        return nok(code2);
      }
    }
    function tokenizeReferenceCollapsed(effects, ok3, nok) {
      return referenceCollapsedStart;
      function referenceCollapsedStart(code2) {
        effects.enter("reference");
        effects.enter("referenceMarker");
        effects.consume(code2);
        effects.exit("referenceMarker");
        return referenceCollapsedOpen;
      }
      function referenceCollapsedOpen(code2) {
        if (code2 === 93) {
          effects.enter("referenceMarker");
          effects.consume(code2);
          effects.exit("referenceMarker");
          effects.exit("reference");
          return ok3;
        }
        return nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/label-start-image.js
    var labelStartImage = {
      name: "labelStartImage",
      tokenize: tokenizeLabelStartImage,
      resolveAll: labelEnd.resolveAll
    };
    function tokenizeLabelStartImage(effects, ok3, nok) {
      const self2 = this;
      return start;
      function start(code2) {
        effects.enter("labelImage");
        effects.enter("labelImageMarker");
        effects.consume(code2);
        effects.exit("labelImageMarker");
        return open;
      }
      function open(code2) {
        if (code2 === 91) {
          effects.enter("labelMarker");
          effects.consume(code2);
          effects.exit("labelMarker");
          effects.exit("labelImage");
          return after;
        }
        return nok(code2);
      }
      function after(code2) {
        return code2 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code2) : ok3(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/label-start-link.js
    var labelStartLink = {
      name: "labelStartLink",
      tokenize: tokenizeLabelStartLink,
      resolveAll: labelEnd.resolveAll
    };
    function tokenizeLabelStartLink(effects, ok3, nok) {
      const self2 = this;
      return start;
      function start(code2) {
        effects.enter("labelLink");
        effects.enter("labelMarker");
        effects.consume(code2);
        effects.exit("labelMarker");
        effects.exit("labelLink");
        return after;
      }
      function after(code2) {
        return code2 === 94 && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code2) : ok3(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/line-ending.js
    var lineEnding = {
      name: "lineEnding",
      tokenize: tokenizeLineEnding
    };
    function tokenizeLineEnding(effects, ok3) {
      return start;
      function start(code2) {
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        return factorySpace(effects, ok3, "linePrefix");
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/thematic-break.js
    var thematicBreak = {
      name: "thematicBreak",
      tokenize: tokenizeThematicBreak
    };
    function tokenizeThematicBreak(effects, ok3, nok) {
      let size = 0;
      let marker;
      return start;
      function start(code2) {
        effects.enter("thematicBreak");
        return before(code2);
      }
      function before(code2) {
        marker = code2;
        return atBreak(code2);
      }
      function atBreak(code2) {
        if (code2 === marker) {
          effects.enter("thematicBreakSequence");
          return sequence(code2);
        }
        if (size >= 3 && (code2 === null || markdownLineEnding(code2))) {
          effects.exit("thematicBreak");
          return ok3(code2);
        }
        return nok(code2);
      }
      function sequence(code2) {
        if (code2 === marker) {
          effects.consume(code2);
          size++;
          return sequence;
        }
        effects.exit("thematicBreakSequence");
        return markdownSpace(code2) ? factorySpace(effects, atBreak, "whitespace")(code2) : atBreak(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/list.js
    var list = {
      name: "list",
      tokenize: tokenizeListStart,
      continuation: {
        tokenize: tokenizeListContinuation
      },
      exit: tokenizeListEnd
    };
    var listItemPrefixWhitespaceConstruct = {
      tokenize: tokenizeListItemPrefixWhitespace,
      partial: true
    };
    var indentConstruct = {
      tokenize: tokenizeIndent,
      partial: true
    };
    function tokenizeListStart(effects, ok3, nok) {
      const self2 = this;
      const tail = self2.events[self2.events.length - 1];
      let initialSize = tail && tail[1].type === "linePrefix" ? tail[2].sliceSerialize(tail[1], true).length : 0;
      let size = 0;
      return start;
      function start(code2) {
        const kind = self2.containerState.type || (code2 === 42 || code2 === 43 || code2 === 45 ? "listUnordered" : "listOrdered");
        if (kind === "listUnordered" ? !self2.containerState.marker || code2 === self2.containerState.marker : asciiDigit(code2)) {
          if (!self2.containerState.type) {
            self2.containerState.type = kind;
            effects.enter(kind, {
              _container: true
            });
          }
          if (kind === "listUnordered") {
            effects.enter("listItemPrefix");
            return code2 === 42 || code2 === 45 ? effects.check(thematicBreak, nok, atMarker)(code2) : atMarker(code2);
          }
          if (!self2.interrupt || code2 === 49) {
            effects.enter("listItemPrefix");
            effects.enter("listItemValue");
            return inside(code2);
          }
        }
        return nok(code2);
      }
      function inside(code2) {
        if (asciiDigit(code2) && ++size < 10) {
          effects.consume(code2);
          return inside;
        }
        if ((!self2.interrupt || size < 2) && (self2.containerState.marker ? code2 === self2.containerState.marker : code2 === 41 || code2 === 46)) {
          effects.exit("listItemValue");
          return atMarker(code2);
        }
        return nok(code2);
      }
      function atMarker(code2) {
        effects.enter("listItemMarker");
        effects.consume(code2);
        effects.exit("listItemMarker");
        self2.containerState.marker = self2.containerState.marker || code2;
        return effects.check(
          blankLine,
          // Can’t be empty when interrupting.
          self2.interrupt ? nok : onBlank,
          effects.attempt(
            listItemPrefixWhitespaceConstruct,
            endOfPrefix,
            otherPrefix
          )
        );
      }
      function onBlank(code2) {
        self2.containerState.initialBlankLine = true;
        initialSize++;
        return endOfPrefix(code2);
      }
      function otherPrefix(code2) {
        if (markdownSpace(code2)) {
          effects.enter("listItemPrefixWhitespace");
          effects.consume(code2);
          effects.exit("listItemPrefixWhitespace");
          return endOfPrefix;
        }
        return nok(code2);
      }
      function endOfPrefix(code2) {
        self2.containerState.size = initialSize + self2.sliceSerialize(effects.exit("listItemPrefix"), true).length;
        return ok3(code2);
      }
    }
    function tokenizeListContinuation(effects, ok3, nok) {
      const self2 = this;
      self2.containerState._closeFlow = void 0;
      return effects.check(blankLine, onBlank, notBlank);
      function onBlank(code2) {
        self2.containerState.furtherBlankLines = self2.containerState.furtherBlankLines || self2.containerState.initialBlankLine;
        return factorySpace(
          effects,
          ok3,
          "listItemIndent",
          self2.containerState.size + 1
        )(code2);
      }
      function notBlank(code2) {
        if (self2.containerState.furtherBlankLines || !markdownSpace(code2)) {
          self2.containerState.furtherBlankLines = void 0;
          self2.containerState.initialBlankLine = void 0;
          return notInCurrentItem(code2);
        }
        self2.containerState.furtherBlankLines = void 0;
        self2.containerState.initialBlankLine = void 0;
        return effects.attempt(indentConstruct, ok3, notInCurrentItem)(code2);
      }
      function notInCurrentItem(code2) {
        self2.containerState._closeFlow = true;
        self2.interrupt = void 0;
        return factorySpace(
          effects,
          effects.attempt(list, ok3, nok),
          "linePrefix",
          self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
        )(code2);
      }
    }
    function tokenizeIndent(effects, ok3, nok) {
      const self2 = this;
      return factorySpace(
        effects,
        afterPrefix,
        "listItemIndent",
        self2.containerState.size + 1
      );
      function afterPrefix(code2) {
        const tail = self2.events[self2.events.length - 1];
        return tail && tail[1].type === "listItemIndent" && tail[2].sliceSerialize(tail[1], true).length === self2.containerState.size ? ok3(code2) : nok(code2);
      }
    }
    function tokenizeListEnd(effects) {
      effects.exit(this.containerState.type);
    }
    function tokenizeListItemPrefixWhitespace(effects, ok3, nok) {
      const self2 = this;
      return factorySpace(
        effects,
        afterPrefix,
        "listItemPrefixWhitespace",
        self2.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4 + 1
      );
      function afterPrefix(code2) {
        const tail = self2.events[self2.events.length - 1];
        return !markdownSpace(code2) && tail && tail[1].type === "listItemPrefixWhitespace" ? ok3(code2) : nok(code2);
      }
    }

    // node_modules/.pnpm/micromark-core-commonmark@2.0.0/node_modules/micromark-core-commonmark/lib/setext-underline.js
    var setextUnderline = {
      name: "setextUnderline",
      tokenize: tokenizeSetextUnderline,
      resolveTo: resolveToSetextUnderline
    };
    function resolveToSetextUnderline(events, context) {
      let index2 = events.length;
      let content3;
      let text4;
      let definition2;
      while (index2--) {
        if (events[index2][0] === "enter") {
          if (events[index2][1].type === "content") {
            content3 = index2;
            break;
          }
          if (events[index2][1].type === "paragraph") {
            text4 = index2;
          }
        } else {
          if (events[index2][1].type === "content") {
            events.splice(index2, 1);
          }
          if (!definition2 && events[index2][1].type === "definition") {
            definition2 = index2;
          }
        }
      }
      const heading2 = {
        type: "setextHeading",
        start: Object.assign({}, events[text4][1].start),
        end: Object.assign({}, events[events.length - 1][1].end)
      };
      events[text4][1].type = "setextHeadingText";
      if (definition2) {
        events.splice(text4, 0, ["enter", heading2, context]);
        events.splice(definition2 + 1, 0, ["exit", events[content3][1], context]);
        events[content3][1].end = Object.assign({}, events[definition2][1].end);
      } else {
        events[content3][1] = heading2;
      }
      events.push(["exit", heading2, context]);
      return events;
    }
    function tokenizeSetextUnderline(effects, ok3, nok) {
      const self2 = this;
      let marker;
      return start;
      function start(code2) {
        let index2 = self2.events.length;
        let paragraph2;
        while (index2--) {
          if (self2.events[index2][1].type !== "lineEnding" && self2.events[index2][1].type !== "linePrefix" && self2.events[index2][1].type !== "content") {
            paragraph2 = self2.events[index2][1].type === "paragraph";
            break;
          }
        }
        if (!self2.parser.lazy[self2.now().line] && (self2.interrupt || paragraph2)) {
          effects.enter("setextHeadingLine");
          marker = code2;
          return before(code2);
        }
        return nok(code2);
      }
      function before(code2) {
        effects.enter("setextHeadingLineSequence");
        return inside(code2);
      }
      function inside(code2) {
        if (code2 === marker) {
          effects.consume(code2);
          return inside;
        }
        effects.exit("setextHeadingLineSequence");
        return markdownSpace(code2) ? factorySpace(effects, after, "lineSuffix")(code2) : after(code2);
      }
      function after(code2) {
        if (code2 === null || markdownLineEnding(code2)) {
          effects.exit("setextHeadingLine");
          return ok3(code2);
        }
        return nok(code2);
      }
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/initialize/flow.js
    var flow = {
      tokenize: initializeFlow
    };
    function initializeFlow(effects) {
      const self2 = this;
      const initial = effects.attempt(
        // Try to parse a blank line.
        blankLine,
        atBlankEnding,
        // Try to parse initial flow (essentially, only code).
        effects.attempt(
          this.parser.constructs.flowInitial,
          afterConstruct,
          factorySpace(
            effects,
            effects.attempt(
              this.parser.constructs.flow,
              afterConstruct,
              effects.attempt(content2, afterConstruct)
            ),
            "linePrefix"
          )
        )
      );
      return initial;
      function atBlankEnding(code2) {
        if (code2 === null) {
          effects.consume(code2);
          return;
        }
        effects.enter("lineEndingBlank");
        effects.consume(code2);
        effects.exit("lineEndingBlank");
        self2.currentConstruct = void 0;
        return initial;
      }
      function afterConstruct(code2) {
        if (code2 === null) {
          effects.consume(code2);
          return;
        }
        effects.enter("lineEnding");
        effects.consume(code2);
        effects.exit("lineEnding");
        self2.currentConstruct = void 0;
        return initial;
      }
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/initialize/text.js
    var resolver = {
      resolveAll: createResolver()
    };
    var string = initializeFactory("string");
    var text = initializeFactory("text");
    function initializeFactory(field) {
      return {
        tokenize: initializeText,
        resolveAll: createResolver(
          field === "text" ? resolveAllLineSuffixes : void 0
        )
      };
      function initializeText(effects) {
        const self2 = this;
        const constructs2 = this.parser.constructs[field];
        const text4 = effects.attempt(constructs2, start, notText);
        return start;
        function start(code2) {
          return atBreak(code2) ? text4(code2) : notText(code2);
        }
        function notText(code2) {
          if (code2 === null) {
            effects.consume(code2);
            return;
          }
          effects.enter("data");
          effects.consume(code2);
          return data;
        }
        function data(code2) {
          if (atBreak(code2)) {
            effects.exit("data");
            return text4(code2);
          }
          effects.consume(code2);
          return data;
        }
        function atBreak(code2) {
          if (code2 === null) {
            return true;
          }
          const list3 = constructs2[code2];
          let index2 = -1;
          if (list3) {
            while (++index2 < list3.length) {
              const item = list3[index2];
              if (!item.previous || item.previous.call(self2, self2.previous)) {
                return true;
              }
            }
          }
          return false;
        }
      }
    }
    function createResolver(extraResolver) {
      return resolveAllText;
      function resolveAllText(events, context) {
        let index2 = -1;
        let enter;
        while (++index2 <= events.length) {
          if (enter === void 0) {
            if (events[index2] && events[index2][1].type === "data") {
              enter = index2;
              index2++;
            }
          } else if (!events[index2] || events[index2][1].type !== "data") {
            if (index2 !== enter + 2) {
              events[enter][1].end = events[index2 - 1][1].end;
              events.splice(enter + 2, index2 - enter - 2);
              index2 = enter + 2;
            }
            enter = void 0;
          }
        }
        return extraResolver ? extraResolver(events, context) : events;
      }
    }
    function resolveAllLineSuffixes(events, context) {
      let eventIndex = 0;
      while (++eventIndex <= events.length) {
        if ((eventIndex === events.length || events[eventIndex][1].type === "lineEnding") && events[eventIndex - 1][1].type === "data") {
          const data = events[eventIndex - 1][1];
          const chunks = context.sliceStream(data);
          let index2 = chunks.length;
          let bufferIndex = -1;
          let size = 0;
          let tabs;
          while (index2--) {
            const chunk = chunks[index2];
            if (typeof chunk === "string") {
              bufferIndex = chunk.length;
              while (chunk.charCodeAt(bufferIndex - 1) === 32) {
                size++;
                bufferIndex--;
              }
              if (bufferIndex)
                break;
              bufferIndex = -1;
            } else if (chunk === -2) {
              tabs = true;
              size++;
            } else if (chunk === -1) ; else {
              index2++;
              break;
            }
          }
          if (size) {
            const token = {
              type: eventIndex === events.length || tabs || size < 2 ? "lineSuffix" : "hardBreakTrailing",
              start: {
                line: data.end.line,
                column: data.end.column - size,
                offset: data.end.offset - size,
                _index: data.start._index + index2,
                _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex
              },
              end: Object.assign({}, data.end)
            };
            data.end = Object.assign({}, token.start);
            if (data.start.offset === data.end.offset) {
              Object.assign(data, token);
            } else {
              events.splice(
                eventIndex,
                0,
                ["enter", token, context],
                ["exit", token, context]
              );
              eventIndex += 2;
            }
          }
          eventIndex++;
        }
      }
      return events;
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/create-tokenizer.js
    function createTokenizer(parser, initialize, from) {
      let point4 = Object.assign(
        from ? Object.assign({}, from) : {
          line: 1,
          column: 1,
          offset: 0
        },
        {
          _index: 0,
          _bufferIndex: -1
        }
      );
      const columnStart = {};
      const resolveAllConstructs = [];
      let chunks = [];
      let stack = [];
      const effects = {
        consume,
        enter,
        exit: exit2,
        attempt: constructFactory(onsuccessfulconstruct),
        check: constructFactory(onsuccessfulcheck),
        interrupt: constructFactory(onsuccessfulcheck, {
          interrupt: true
        })
      };
      const context = {
        previous: null,
        code: null,
        containerState: {},
        events: [],
        parser,
        sliceStream,
        sliceSerialize,
        now,
        defineSkip,
        write
      };
      let state = initialize.tokenize.call(context, effects);
      if (initialize.resolveAll) {
        resolveAllConstructs.push(initialize);
      }
      return context;
      function write(slice) {
        chunks = push(chunks, slice);
        main();
        if (chunks[chunks.length - 1] !== null) {
          return [];
        }
        addResult(initialize, 0);
        context.events = resolveAll(resolveAllConstructs, context.events, context);
        return context.events;
      }
      function sliceSerialize(token, expandTabs) {
        return serializeChunks(sliceStream(token), expandTabs);
      }
      function sliceStream(token) {
        return sliceChunks(chunks, token);
      }
      function now() {
        const { line, column, offset, _index, _bufferIndex } = point4;
        return {
          line,
          column,
          offset,
          _index,
          _bufferIndex
        };
      }
      function defineSkip(value) {
        columnStart[value.line] = value.column;
        accountForPotentialSkip();
      }
      function main() {
        let chunkIndex;
        while (point4._index < chunks.length) {
          const chunk = chunks[point4._index];
          if (typeof chunk === "string") {
            chunkIndex = point4._index;
            if (point4._bufferIndex < 0) {
              point4._bufferIndex = 0;
            }
            while (point4._index === chunkIndex && point4._bufferIndex < chunk.length) {
              go(chunk.charCodeAt(point4._bufferIndex));
            }
          } else {
            go(chunk);
          }
        }
      }
      function go(code2) {
        state = state(code2);
      }
      function consume(code2) {
        if (markdownLineEnding(code2)) {
          point4.line++;
          point4.column = 1;
          point4.offset += code2 === -3 ? 2 : 1;
          accountForPotentialSkip();
        } else if (code2 !== -1) {
          point4.column++;
          point4.offset++;
        }
        if (point4._bufferIndex < 0) {
          point4._index++;
        } else {
          point4._bufferIndex++;
          if (point4._bufferIndex === chunks[point4._index].length) {
            point4._bufferIndex = -1;
            point4._index++;
          }
        }
        context.previous = code2;
      }
      function enter(type, fields) {
        const token = fields || {};
        token.type = type;
        token.start = now();
        context.events.push(["enter", token, context]);
        stack.push(token);
        return token;
      }
      function exit2(type) {
        const token = stack.pop();
        token.end = now();
        context.events.push(["exit", token, context]);
        return token;
      }
      function onsuccessfulconstruct(construct, info) {
        addResult(construct, info.from);
      }
      function onsuccessfulcheck(_, info) {
        info.restore();
      }
      function constructFactory(onreturn, fields) {
        return hook;
        function hook(constructs2, returnState, bogusState) {
          let listOfConstructs;
          let constructIndex;
          let currentConstruct;
          let info;
          return Array.isArray(constructs2) ? handleListOfConstructs(constructs2) : "tokenize" in constructs2 ? (
            // @ts-expect-error Looks like a construct.
            handleListOfConstructs([constructs2])
          ) : handleMapOfConstructs(constructs2);
          function handleMapOfConstructs(map) {
            return start;
            function start(code2) {
              const def = code2 !== null && map[code2];
              const all2 = code2 !== null && map.null;
              const list3 = [
                // To do: add more extension tests.
                /* c8 ignore next 2 */
                ...Array.isArray(def) ? def : def ? [def] : [],
                ...Array.isArray(all2) ? all2 : all2 ? [all2] : []
              ];
              return handleListOfConstructs(list3)(code2);
            }
          }
          function handleListOfConstructs(list3) {
            listOfConstructs = list3;
            constructIndex = 0;
            if (list3.length === 0) {
              return bogusState;
            }
            return handleConstruct(list3[constructIndex]);
          }
          function handleConstruct(construct) {
            return start;
            function start(code2) {
              info = store();
              currentConstruct = construct;
              if (!construct.partial) {
                context.currentConstruct = construct;
              }
              if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
                return nok();
              }
              return construct.tokenize.call(
                // If we do have fields, create an object w/ `context` as its
                // prototype.
                // This allows a “live binding”, which is needed for `interrupt`.
                fields ? Object.assign(Object.create(context), fields) : context,
                effects,
                ok3,
                nok
              )(code2);
            }
          }
          function ok3(code2) {
            onreturn(currentConstruct, info);
            return returnState;
          }
          function nok(code2) {
            info.restore();
            if (++constructIndex < listOfConstructs.length) {
              return handleConstruct(listOfConstructs[constructIndex]);
            }
            return bogusState;
          }
        }
      }
      function addResult(construct, from2) {
        if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
          resolveAllConstructs.push(construct);
        }
        if (construct.resolve) {
          splice(
            context.events,
            from2,
            context.events.length - from2,
            construct.resolve(context.events.slice(from2), context)
          );
        }
        if (construct.resolveTo) {
          context.events = construct.resolveTo(context.events, context);
        }
      }
      function store() {
        const startPoint = now();
        const startPrevious = context.previous;
        const startCurrentConstruct = context.currentConstruct;
        const startEventsIndex = context.events.length;
        const startStack = Array.from(stack);
        return {
          restore,
          from: startEventsIndex
        };
        function restore() {
          point4 = startPoint;
          context.previous = startPrevious;
          context.currentConstruct = startCurrentConstruct;
          context.events.length = startEventsIndex;
          stack = startStack;
          accountForPotentialSkip();
        }
      }
      function accountForPotentialSkip() {
        if (point4.line in columnStart && point4.column < 2) {
          point4.column = columnStart[point4.line];
          point4.offset += columnStart[point4.line] - 1;
        }
      }
    }
    function sliceChunks(chunks, token) {
      const startIndex = token.start._index;
      const startBufferIndex = token.start._bufferIndex;
      const endIndex = token.end._index;
      const endBufferIndex = token.end._bufferIndex;
      let view;
      if (startIndex === endIndex) {
        view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
      } else {
        view = chunks.slice(startIndex, endIndex);
        if (startBufferIndex > -1) {
          const head = view[0];
          if (typeof head === "string") {
            view[0] = head.slice(startBufferIndex);
          } else {
            view.shift();
          }
        }
        if (endBufferIndex > 0) {
          view.push(chunks[endIndex].slice(0, endBufferIndex));
        }
      }
      return view;
    }
    function serializeChunks(chunks, expandTabs) {
      let index2 = -1;
      const result = [];
      let atTab;
      while (++index2 < chunks.length) {
        const chunk = chunks[index2];
        let value;
        if (typeof chunk === "string") {
          value = chunk;
        } else
          switch (chunk) {
            case -5: {
              value = "\r";
              break;
            }
            case -4: {
              value = "\n";
              break;
            }
            case -3: {
              value = "\r\n";
              break;
            }
            case -2: {
              value = expandTabs ? " " : "	";
              break;
            }
            case -1: {
              if (!expandTabs && atTab)
                continue;
              value = " ";
              break;
            }
            default: {
              value = String.fromCharCode(chunk);
            }
          }
        atTab = chunk === -2;
        result.push(value);
      }
      return result.join("");
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/constructs.js
    var constructs_exports = {};
    __export(constructs_exports, {
      attentionMarkers: () => attentionMarkers,
      contentInitial: () => contentInitial,
      disable: () => disable,
      document: () => document2,
      flow: () => flow2,
      flowInitial: () => flowInitial,
      insideSpan: () => insideSpan,
      string: () => string2,
      text: () => text2
    });
    var document2 = {
      [42]: list,
      [43]: list,
      [45]: list,
      [48]: list,
      [49]: list,
      [50]: list,
      [51]: list,
      [52]: list,
      [53]: list,
      [54]: list,
      [55]: list,
      [56]: list,
      [57]: list,
      [62]: blockQuote
    };
    var contentInitial = {
      [91]: definition
    };
    var flowInitial = {
      [-2]: codeIndented,
      [-1]: codeIndented,
      [32]: codeIndented
    };
    var flow2 = {
      [35]: headingAtx,
      [42]: thematicBreak,
      [45]: [setextUnderline, thematicBreak],
      [60]: htmlFlow,
      [61]: setextUnderline,
      [95]: thematicBreak,
      [96]: codeFenced,
      [126]: codeFenced
    };
    var string2 = {
      [38]: characterReference,
      [92]: characterEscape
    };
    var text2 = {
      [-5]: lineEnding,
      [-4]: lineEnding,
      [-3]: lineEnding,
      [33]: labelStartImage,
      [38]: characterReference,
      [42]: attention,
      [60]: [autolink, htmlText],
      [91]: labelStartLink,
      [92]: [hardBreakEscape, characterEscape],
      [93]: labelEnd,
      [95]: attention,
      [96]: codeText
    };
    var insideSpan = {
      null: [attention, resolver]
    };
    var attentionMarkers = {
      null: [42, 95]
    };
    var disable = {
      null: []
    };

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/parse.js
    function parse(options) {
      const settings = options || {};
      const constructs2 = (
        /** @type {FullNormalizedExtension} */
        combineExtensions([constructs_exports, ...settings.extensions || []])
      );
      const parser = {
        defined: [],
        lazy: {},
        constructs: constructs2,
        content: create(content),
        document: create(document$1),
        flow: create(flow),
        string: create(string),
        text: create(text)
      };
      return parser;
      function create(initial) {
        return creator;
        function creator(from) {
          return createTokenizer(parser, initial, from);
        }
      }
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/postprocess.js
    function postprocess(events) {
      while (!subtokenize(events)) {
      }
      return events;
    }

    // node_modules/.pnpm/micromark@4.0.0/node_modules/micromark/lib/preprocess.js
    var search = /[\0\t\n\r]/g;
    function preprocess() {
      let column = 1;
      let buffer = "";
      let start = true;
      let atCarriageReturn;
      return preprocessor;
      function preprocessor(value, encoding, end) {
        const chunks = [];
        let match;
        let next;
        let startPosition;
        let endPosition;
        let code2;
        value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || void 0).decode(value));
        startPosition = 0;
        buffer = "";
        if (start) {
          if (value.charCodeAt(0) === 65279) {
            startPosition++;
          }
          start = void 0;
        }
        while (startPosition < value.length) {
          search.lastIndex = startPosition;
          match = search.exec(value);
          endPosition = match && match.index !== void 0 ? match.index : value.length;
          code2 = value.charCodeAt(endPosition);
          if (!match) {
            buffer = value.slice(startPosition);
            break;
          }
          if (code2 === 10 && startPosition === endPosition && atCarriageReturn) {
            chunks.push(-3);
            atCarriageReturn = void 0;
          } else {
            if (atCarriageReturn) {
              chunks.push(-5);
              atCarriageReturn = void 0;
            }
            if (startPosition < endPosition) {
              chunks.push(value.slice(startPosition, endPosition));
              column += endPosition - startPosition;
            }
            switch (code2) {
              case 0: {
                chunks.push(65533);
                column++;
                break;
              }
              case 9: {
                next = Math.ceil(column / 4) * 4;
                chunks.push(-2);
                while (column++ < next)
                  chunks.push(-1);
                break;
              }
              case 10: {
                chunks.push(-4);
                column = 1;
                break;
              }
              default: {
                atCarriageReturn = true;
                column = 1;
              }
            }
          }
          startPosition = endPosition + 1;
        }
        if (end) {
          if (atCarriageReturn)
            chunks.push(-5);
          if (buffer)
            chunks.push(buffer);
          chunks.push(null);
        }
        return chunks;
      }
    }

    // node_modules/.pnpm/micromark-util-decode-string@2.0.0/node_modules/micromark-util-decode-string/index.js
    var characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
    function decodeString(value) {
      return value.replace(characterEscapeOrReference, decode);
    }
    function decode($0, $1, $2) {
      if ($1) {
        return $1;
      }
      const head = $2.charCodeAt(0);
      if (head === 35) {
        const head2 = $2.charCodeAt(1);
        const hex = head2 === 120 || head2 === 88;
        return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? 16 : 10);
      }
      return decodeNamedCharacterReference($2) || $0;
    }

    // node_modules/.pnpm/unist-util-stringify-position@4.0.0/node_modules/unist-util-stringify-position/lib/index.js
    function stringifyPosition(value) {
      if (!value || typeof value !== "object") {
        return "";
      }
      if ("position" in value || "type" in value) {
        return position(value.position);
      }
      if ("start" in value || "end" in value) {
        return position(value);
      }
      if ("line" in value || "column" in value) {
        return point(value);
      }
      return "";
    }
    function point(point4) {
      return index(point4 && point4.line) + ":" + index(point4 && point4.column);
    }
    function position(pos) {
      return point(pos && pos.start) + "-" + point(pos && pos.end);
    }
    function index(value) {
      return value && typeof value === "number" ? value : 1;
    }

    // node_modules/.pnpm/mdast-util-from-markdown@2.0.0/node_modules/mdast-util-from-markdown/lib/index.js
    var own2 = {}.hasOwnProperty;
    function fromMarkdown(value, encoding, options) {
      if (typeof encoding !== "string") {
        options = encoding;
        encoding = void 0;
      }
      return compiler(options)(
        postprocess(
          parse(options).document().write(preprocess()(value, encoding, true))
        )
      );
    }
    function compiler(options) {
      const config = {
        transforms: [],
        canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
        enter: {
          autolink: opener(link2),
          autolinkProtocol: onenterdata,
          autolinkEmail: onenterdata,
          atxHeading: opener(heading2),
          blockQuote: opener(blockQuote2),
          characterEscape: onenterdata,
          characterReference: onenterdata,
          codeFenced: opener(codeFlow),
          codeFencedFenceInfo: buffer,
          codeFencedFenceMeta: buffer,
          codeIndented: opener(codeFlow, buffer),
          codeText: opener(codeText2, buffer),
          codeTextData: onenterdata,
          data: onenterdata,
          codeFlowValue: onenterdata,
          definition: opener(definition2),
          definitionDestinationString: buffer,
          definitionLabelString: buffer,
          definitionTitleString: buffer,
          emphasis: opener(emphasis2),
          hardBreakEscape: opener(hardBreak2),
          hardBreakTrailing: opener(hardBreak2),
          htmlFlow: opener(html2, buffer),
          htmlFlowData: onenterdata,
          htmlText: opener(html2, buffer),
          htmlTextData: onenterdata,
          image: opener(image2),
          label: buffer,
          link: opener(link2),
          listItem: opener(listItem2),
          listItemValue: onenterlistitemvalue,
          listOrdered: opener(list3, onenterlistordered),
          listUnordered: opener(list3),
          paragraph: opener(paragraph2),
          reference: onenterreference,
          referenceString: buffer,
          resourceDestinationString: buffer,
          resourceTitleString: buffer,
          setextHeading: opener(heading2),
          strong: opener(strong2),
          thematicBreak: opener(thematicBreak3)
        },
        exit: {
          atxHeading: closer(),
          atxHeadingSequence: onexitatxheadingsequence,
          autolink: closer(),
          autolinkEmail: onexitautolinkemail,
          autolinkProtocol: onexitautolinkprotocol,
          blockQuote: closer(),
          characterEscapeValue: onexitdata,
          characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
          characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
          characterReferenceValue: onexitcharacterreferencevalue,
          codeFenced: closer(onexitcodefenced),
          codeFencedFence: onexitcodefencedfence,
          codeFencedFenceInfo: onexitcodefencedfenceinfo,
          codeFencedFenceMeta: onexitcodefencedfencemeta,
          codeFlowValue: onexitdata,
          codeIndented: closer(onexitcodeindented),
          codeText: closer(onexitcodetext),
          codeTextData: onexitdata,
          data: onexitdata,
          definition: closer(),
          definitionDestinationString: onexitdefinitiondestinationstring,
          definitionLabelString: onexitdefinitionlabelstring,
          definitionTitleString: onexitdefinitiontitlestring,
          emphasis: closer(),
          hardBreakEscape: closer(onexithardbreak),
          hardBreakTrailing: closer(onexithardbreak),
          htmlFlow: closer(onexithtmlflow),
          htmlFlowData: onexitdata,
          htmlText: closer(onexithtmltext),
          htmlTextData: onexitdata,
          image: closer(onexitimage),
          label: onexitlabel,
          labelText: onexitlabeltext,
          lineEnding: onexitlineending,
          link: closer(onexitlink),
          listItem: closer(),
          listOrdered: closer(),
          listUnordered: closer(),
          paragraph: closer(),
          referenceString: onexitreferencestring,
          resourceDestinationString: onexitresourcedestinationstring,
          resourceTitleString: onexitresourcetitlestring,
          resource: onexitresource,
          setextHeading: closer(onexitsetextheading),
          setextHeadingLineSequence: onexitsetextheadinglinesequence,
          setextHeadingText: onexitsetextheadingtext,
          strong: closer(),
          thematicBreak: closer()
        }
      };
      configure(config, (options || {}).mdastExtensions || []);
      const data = {};
      return compile;
      function compile(events) {
        let tree = {
          type: "root",
          children: []
        };
        const context = {
          stack: [tree],
          tokenStack: [],
          config,
          enter,
          exit: exit2,
          buffer,
          resume,
          data
        };
        const listStack = [];
        let index2 = -1;
        while (++index2 < events.length) {
          if (events[index2][1].type === "listOrdered" || events[index2][1].type === "listUnordered") {
            if (events[index2][0] === "enter") {
              listStack.push(index2);
            } else {
              const tail = listStack.pop();
              index2 = prepareList(events, tail, index2);
            }
          }
        }
        index2 = -1;
        while (++index2 < events.length) {
          const handler = config[events[index2][0]];
          if (own2.call(handler, events[index2][1].type)) {
            handler[events[index2][1].type].call(
              Object.assign(
                {
                  sliceSerialize: events[index2][2].sliceSerialize
                },
                context
              ),
              events[index2][1]
            );
          }
        }
        if (context.tokenStack.length > 0) {
          const tail = context.tokenStack[context.tokenStack.length - 1];
          const handler = tail[1] || defaultOnError;
          handler.call(context, void 0, tail[0]);
        }
        tree.position = {
          start: point2(
            events.length > 0 ? events[0][1].start : {
              line: 1,
              column: 1,
              offset: 0
            }
          ),
          end: point2(
            events.length > 0 ? events[events.length - 2][1].end : {
              line: 1,
              column: 1,
              offset: 0
            }
          )
        };
        index2 = -1;
        while (++index2 < config.transforms.length) {
          tree = config.transforms[index2](tree) || tree;
        }
        return tree;
      }
      function prepareList(events, start, length) {
        let index2 = start - 1;
        let containerBalance = -1;
        let listSpread = false;
        let listItem3;
        let lineIndex;
        let firstBlankLineIndex;
        let atMarker;
        while (++index2 <= length) {
          const event = events[index2];
          switch (event[1].type) {
            case "listUnordered":
            case "listOrdered":
            case "blockQuote": {
              if (event[0] === "enter") {
                containerBalance++;
              } else {
                containerBalance--;
              }
              atMarker = void 0;
              break;
            }
            case "lineEndingBlank": {
              if (event[0] === "enter") {
                if (listItem3 && !atMarker && !containerBalance && !firstBlankLineIndex) {
                  firstBlankLineIndex = index2;
                }
                atMarker = void 0;
              }
              break;
            }
            case "linePrefix":
            case "listItemValue":
            case "listItemMarker":
            case "listItemPrefix":
            case "listItemPrefixWhitespace": {
              break;
            }
            default: {
              atMarker = void 0;
            }
          }
          if (!containerBalance && event[0] === "enter" && event[1].type === "listItemPrefix" || containerBalance === -1 && event[0] === "exit" && (event[1].type === "listUnordered" || event[1].type === "listOrdered")) {
            if (listItem3) {
              let tailIndex = index2;
              lineIndex = void 0;
              while (tailIndex--) {
                const tailEvent = events[tailIndex];
                if (tailEvent[1].type === "lineEnding" || tailEvent[1].type === "lineEndingBlank") {
                  if (tailEvent[0] === "exit")
                    continue;
                  if (lineIndex) {
                    events[lineIndex][1].type = "lineEndingBlank";
                    listSpread = true;
                  }
                  tailEvent[1].type = "lineEnding";
                  lineIndex = tailIndex;
                } else if (tailEvent[1].type === "linePrefix" || tailEvent[1].type === "blockQuotePrefix" || tailEvent[1].type === "blockQuotePrefixWhitespace" || tailEvent[1].type === "blockQuoteMarker" || tailEvent[1].type === "listItemIndent") ; else {
                  break;
                }
              }
              if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
                listItem3._spread = true;
              }
              listItem3.end = Object.assign(
                {},
                lineIndex ? events[lineIndex][1].start : event[1].end
              );
              events.splice(lineIndex || index2, 0, ["exit", listItem3, event[2]]);
              index2++;
              length++;
            }
            if (event[1].type === "listItemPrefix") {
              const item = {
                type: "listItem",
                _spread: false,
                start: Object.assign({}, event[1].start),
                // @ts-expect-error: we’ll add `end` in a second.
                end: void 0
              };
              listItem3 = item;
              events.splice(index2, 0, ["enter", item, event[2]]);
              index2++;
              length++;
              firstBlankLineIndex = void 0;
              atMarker = true;
            }
          }
        }
        events[start][1]._spread = listSpread;
        return length;
      }
      function opener(create, and) {
        return open;
        function open(token) {
          enter.call(this, create(token), token);
          if (and)
            and.call(this, token);
        }
      }
      function buffer() {
        this.stack.push({
          type: "fragment",
          children: []
        });
      }
      function enter(node2, token, errorHandler) {
        const parent = this.stack[this.stack.length - 1];
        const siblings = parent.children;
        siblings.push(node2);
        this.stack.push(node2);
        this.tokenStack.push([token, errorHandler]);
        node2.position = {
          start: point2(token.start),
          // @ts-expect-error: `end` will be patched later.
          end: void 0
        };
      }
      function closer(and) {
        return close;
        function close(token) {
          if (and)
            and.call(this, token);
          exit2.call(this, token);
        }
      }
      function exit2(token, onExitError) {
        const node2 = this.stack.pop();
        const open = this.tokenStack.pop();
        if (!open) {
          throw new Error(
            "Cannot close `" + token.type + "` (" + stringifyPosition({
              start: token.start,
              end: token.end
            }) + "): it\u2019s not open"
          );
        } else if (open[0].type !== token.type) {
          if (onExitError) {
            onExitError.call(this, token, open[0]);
          } else {
            const handler = open[1] || defaultOnError;
            handler.call(this, token, open[0]);
          }
        }
        node2.position.end = point2(token.end);
      }
      function resume() {
        return toString(this.stack.pop());
      }
      function onenterlistordered() {
        this.data.expectingFirstListItemValue = true;
      }
      function onenterlistitemvalue(token) {
        if (this.data.expectingFirstListItemValue) {
          const ancestor = this.stack[this.stack.length - 2];
          ancestor.start = Number.parseInt(this.sliceSerialize(token), 10);
          this.data.expectingFirstListItemValue = void 0;
        }
      }
      function onexitcodefencedfenceinfo() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.lang = data2;
      }
      function onexitcodefencedfencemeta() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.meta = data2;
      }
      function onexitcodefencedfence() {
        if (this.data.flowCodeInside)
          return;
        this.buffer();
        this.data.flowCodeInside = true;
      }
      function onexitcodefenced() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
        this.data.flowCodeInside = void 0;
      }
      function onexitcodeindented() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.value = data2.replace(/(\r?\n|\r)$/g, "");
      }
      function onexitdefinitionlabelstring(token) {
        const label = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.label = label;
        node2.identifier = normalizeIdentifier(
          this.sliceSerialize(token)
        ).toLowerCase();
      }
      function onexitdefinitiontitlestring() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.title = data2;
      }
      function onexitdefinitiondestinationstring() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.url = data2;
      }
      function onexitatxheadingsequence(token) {
        const node2 = this.stack[this.stack.length - 1];
        if (!node2.depth) {
          const depth = this.sliceSerialize(token).length;
          node2.depth = depth;
        }
      }
      function onexitsetextheadingtext() {
        this.data.setextHeadingSlurpLineEnding = true;
      }
      function onexitsetextheadinglinesequence(token) {
        const node2 = this.stack[this.stack.length - 1];
        node2.depth = this.sliceSerialize(token).codePointAt(0) === 61 ? 1 : 2;
      }
      function onexitsetextheading() {
        this.data.setextHeadingSlurpLineEnding = void 0;
      }
      function onenterdata(token) {
        const node2 = this.stack[this.stack.length - 1];
        const siblings = node2.children;
        let tail = siblings[siblings.length - 1];
        if (!tail || tail.type !== "text") {
          tail = text4();
          tail.position = {
            start: point2(token.start),
            // @ts-expect-error: we’ll add `end` later.
            end: void 0
          };
          siblings.push(tail);
        }
        this.stack.push(tail);
      }
      function onexitdata(token) {
        const tail = this.stack.pop();
        tail.value += this.sliceSerialize(token);
        tail.position.end = point2(token.end);
      }
      function onexitlineending(token) {
        const context = this.stack[this.stack.length - 1];
        if (this.data.atHardBreak) {
          const tail = context.children[context.children.length - 1];
          tail.position.end = point2(token.end);
          this.data.atHardBreak = void 0;
          return;
        }
        if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
          onenterdata.call(this, token);
          onexitdata.call(this, token);
        }
      }
      function onexithardbreak() {
        this.data.atHardBreak = true;
      }
      function onexithtmlflow() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.value = data2;
      }
      function onexithtmltext() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.value = data2;
      }
      function onexitcodetext() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.value = data2;
      }
      function onexitlink() {
        const node2 = this.stack[this.stack.length - 1];
        if (this.data.inReference) {
          const referenceType = this.data.referenceType || "shortcut";
          node2.type += "Reference";
          node2.referenceType = referenceType;
          delete node2.url;
          delete node2.title;
        } else {
          delete node2.identifier;
          delete node2.label;
        }
        this.data.referenceType = void 0;
      }
      function onexitimage() {
        const node2 = this.stack[this.stack.length - 1];
        if (this.data.inReference) {
          const referenceType = this.data.referenceType || "shortcut";
          node2.type += "Reference";
          node2.referenceType = referenceType;
          delete node2.url;
          delete node2.title;
        } else {
          delete node2.identifier;
          delete node2.label;
        }
        this.data.referenceType = void 0;
      }
      function onexitlabeltext(token) {
        const string3 = this.sliceSerialize(token);
        const ancestor = this.stack[this.stack.length - 2];
        ancestor.label = decodeString(string3);
        ancestor.identifier = normalizeIdentifier(string3).toLowerCase();
      }
      function onexitlabel() {
        const fragment = this.stack[this.stack.length - 1];
        const value = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        this.data.inReference = true;
        if (node2.type === "link") {
          const children = fragment.children;
          node2.children = children;
        } else {
          node2.alt = value;
        }
      }
      function onexitresourcedestinationstring() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.url = data2;
      }
      function onexitresourcetitlestring() {
        const data2 = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.title = data2;
      }
      function onexitresource() {
        this.data.inReference = void 0;
      }
      function onenterreference() {
        this.data.referenceType = "collapsed";
      }
      function onexitreferencestring(token) {
        const label = this.resume();
        const node2 = this.stack[this.stack.length - 1];
        node2.label = label;
        node2.identifier = normalizeIdentifier(
          this.sliceSerialize(token)
        ).toLowerCase();
        this.data.referenceType = "full";
      }
      function onexitcharacterreferencemarker(token) {
        this.data.characterReferenceType = token.type;
      }
      function onexitcharacterreferencevalue(token) {
        const data2 = this.sliceSerialize(token);
        const type = this.data.characterReferenceType;
        let value;
        if (type) {
          value = decodeNumericCharacterReference(
            data2,
            type === "characterReferenceMarkerNumeric" ? 10 : 16
          );
          this.data.characterReferenceType = void 0;
        } else {
          const result = decodeNamedCharacterReference(data2);
          value = result;
        }
        const tail = this.stack.pop();
        tail.value += value;
        tail.position.end = point2(token.end);
      }
      function onexitautolinkprotocol(token) {
        onexitdata.call(this, token);
        const node2 = this.stack[this.stack.length - 1];
        node2.url = this.sliceSerialize(token);
      }
      function onexitautolinkemail(token) {
        onexitdata.call(this, token);
        const node2 = this.stack[this.stack.length - 1];
        node2.url = "mailto:" + this.sliceSerialize(token);
      }
      function blockQuote2() {
        return {
          type: "blockquote",
          children: []
        };
      }
      function codeFlow() {
        return {
          type: "code",
          lang: null,
          meta: null,
          value: ""
        };
      }
      function codeText2() {
        return {
          type: "inlineCode",
          value: ""
        };
      }
      function definition2() {
        return {
          type: "definition",
          identifier: "",
          label: null,
          title: null,
          url: ""
        };
      }
      function emphasis2() {
        return {
          type: "emphasis",
          children: []
        };
      }
      function heading2() {
        return {
          type: "heading",
          // @ts-expect-error `depth` will be set later.
          depth: 0,
          children: []
        };
      }
      function hardBreak2() {
        return {
          type: "break"
        };
      }
      function html2() {
        return {
          type: "html",
          value: ""
        };
      }
      function image2() {
        return {
          type: "image",
          title: null,
          url: "",
          alt: null
        };
      }
      function link2() {
        return {
          type: "link",
          title: null,
          url: "",
          children: []
        };
      }
      function list3(token) {
        return {
          type: "list",
          ordered: token.type === "listOrdered",
          start: null,
          spread: token._spread,
          children: []
        };
      }
      function listItem2(token) {
        return {
          type: "listItem",
          spread: token._spread,
          checked: null,
          children: []
        };
      }
      function paragraph2() {
        return {
          type: "paragraph",
          children: []
        };
      }
      function strong2() {
        return {
          type: "strong",
          children: []
        };
      }
      function text4() {
        return {
          type: "text",
          value: ""
        };
      }
      function thematicBreak3() {
        return {
          type: "thematicBreak"
        };
      }
    }
    function point2(d) {
      return {
        line: d.line,
        column: d.column,
        offset: d.offset
      };
    }
    function configure(combined, extensions) {
      let index2 = -1;
      while (++index2 < extensions.length) {
        const value = extensions[index2];
        if (Array.isArray(value)) {
          configure(combined, value);
        } else {
          extension(combined, value);
        }
      }
    }
    function extension(combined, extension2) {
      let key;
      for (key in extension2) {
        if (own2.call(extension2, key)) {
          switch (key) {
            case "canContainEols": {
              const right = extension2[key];
              if (right) {
                combined[key].push(...right);
              }
              break;
            }
            case "transforms": {
              const right = extension2[key];
              if (right) {
                combined[key].push(...right);
              }
              break;
            }
            case "enter":
            case "exit": {
              const right = extension2[key];
              if (right) {
                Object.assign(combined[key], right);
              }
              break;
            }
          }
        }
      }
    }
    function defaultOnError(left, right) {
      if (left) {
        throw new Error(
          "Cannot close `" + left.type + "` (" + stringifyPosition({
            start: left.start,
            end: left.end
          }) + "): a different token (`" + right.type + "`, " + stringifyPosition({
            start: right.start,
            end: right.end
          }) + ") is open"
        );
      } else {
        throw new Error(
          "Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({
            start: right.start,
            end: right.end
          }) + ") is still open"
        );
      }
    }

    // node_modules/.pnpm/remark-parse@11.0.0/node_modules/remark-parse/lib/index.js
    function remarkParse(options) {
      const self2 = this;
      self2.parser = parser;
      function parser(doc) {
        return fromMarkdown(doc, {
          ...self2.data("settings"),
          ...options,
          // Note: these options are not in the readme.
          // The goal is for them to be set by plugins on `data` instead of being
          // passed by users.
          extensions: self2.data("micromarkExtensions") || [],
          mdastExtensions: self2.data("fromMarkdownExtensions") || []
        });
      }
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
    function blockquote(state, node2) {
      const result = {
        type: "element",
        tagName: "blockquote",
        properties: {},
        children: state.wrap(state.all(node2), true)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/break.js
    function hardBreak(state, node2) {
      const result = { type: "element", tagName: "br", properties: {}, children: [] };
      state.patch(node2, result);
      return [state.applyData(node2, result), { type: "text", value: "\n" }];
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/code.js
    function code(state, node2) {
      const value = node2.value ? node2.value + "\n" : "";
      const properties = {};
      if (node2.lang) {
        properties.className = ["language-" + node2.lang];
      }
      let result = {
        type: "element",
        tagName: "code",
        properties,
        children: [{ type: "text", value }]
      };
      if (node2.meta) {
        result.data = { meta: node2.meta };
      }
      state.patch(node2, result);
      result = state.applyData(node2, result);
      result = { type: "element", tagName: "pre", properties: {}, children: [result] };
      state.patch(node2, result);
      return result;
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/delete.js
    function strikethrough(state, node2) {
      const result = {
        type: "element",
        tagName: "del",
        properties: {},
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
    function emphasis(state, node2) {
      const result = {
        type: "element",
        tagName: "em",
        properties: {},
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
    function footnoteReference(state, node2) {
      const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
      const id = String(node2.identifier).toUpperCase();
      const safeId = normalizeUri(id.toLowerCase());
      const index2 = state.footnoteOrder.indexOf(id);
      let counter;
      let reuseCounter = state.footnoteCounts.get(id);
      if (reuseCounter === void 0) {
        reuseCounter = 0;
        state.footnoteOrder.push(id);
        counter = state.footnoteOrder.length;
      } else {
        counter = index2 + 1;
      }
      reuseCounter += 1;
      state.footnoteCounts.set(id, reuseCounter);
      const link2 = {
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + clobberPrefix + "fn-" + safeId,
          id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
          dataFootnoteRef: true,
          ariaDescribedBy: ["footnote-label"]
        },
        children: [{ type: "text", value: String(counter) }]
      };
      state.patch(node2, link2);
      const sup = {
        type: "element",
        tagName: "sup",
        properties: {},
        children: [link2]
      };
      state.patch(node2, sup);
      return state.applyData(node2, sup);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/heading.js
    function heading(state, node2) {
      const result = {
        type: "element",
        tagName: "h" + node2.depth,
        properties: {},
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/html.js
    function html(state, node2) {
      if (state.options.allowDangerousHtml) {
        const result = { type: "raw", value: node2.value };
        state.patch(node2, result);
        return state.applyData(node2, result);
      }
      return void 0;
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/revert.js
    function revert(state, node2) {
      const subtype = node2.referenceType;
      let suffix = "]";
      if (subtype === "collapsed") {
        suffix += "[]";
      } else if (subtype === "full") {
        suffix += "[" + (node2.label || node2.identifier) + "]";
      }
      if (node2.type === "imageReference") {
        return [{ type: "text", value: "![" + node2.alt + suffix }];
      }
      const contents = state.all(node2);
      const head = contents[0];
      if (head && head.type === "text") {
        head.value = "[" + head.value;
      } else {
        contents.unshift({ type: "text", value: "[" });
      }
      const tail = contents[contents.length - 1];
      if (tail && tail.type === "text") {
        tail.value += suffix;
      } else {
        contents.push({ type: "text", value: suffix });
      }
      return contents;
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
    function imageReference(state, node2) {
      const id = String(node2.identifier).toUpperCase();
      const def = state.definitionById.get(id);
      if (!def) {
        return revert(state, node2);
      }
      const properties = { src: normalizeUri(def.url || ""), alt: node2.alt };
      if (def.title !== null && def.title !== void 0) {
        properties.title = def.title;
      }
      const result = { type: "element", tagName: "img", properties, children: [] };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/image.js
    function image(state, node2) {
      const properties = { src: normalizeUri(node2.url) };
      if (node2.alt !== null && node2.alt !== void 0) {
        properties.alt = node2.alt;
      }
      if (node2.title !== null && node2.title !== void 0) {
        properties.title = node2.title;
      }
      const result = { type: "element", tagName: "img", properties, children: [] };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
    function inlineCode(state, node2) {
      const text4 = { type: "text", value: node2.value.replace(/\r?\n|\r/g, " ") };
      state.patch(node2, text4);
      const result = {
        type: "element",
        tagName: "code",
        properties: {},
        children: [text4]
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
    function linkReference(state, node2) {
      const id = String(node2.identifier).toUpperCase();
      const def = state.definitionById.get(id);
      if (!def) {
        return revert(state, node2);
      }
      const properties = { href: normalizeUri(def.url || "") };
      if (def.title !== null && def.title !== void 0) {
        properties.title = def.title;
      }
      const result = {
        type: "element",
        tagName: "a",
        properties,
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/link.js
    function link(state, node2) {
      const properties = { href: normalizeUri(node2.url) };
      if (node2.title !== null && node2.title !== void 0) {
        properties.title = node2.title;
      }
      const result = {
        type: "element",
        tagName: "a",
        properties,
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/list-item.js
    function listItem(state, node2, parent) {
      const results = state.all(node2);
      const loose = parent ? listLoose(parent) : listItemLoose(node2);
      const properties = {};
      const children = [];
      if (typeof node2.checked === "boolean") {
        const head = results[0];
        let paragraph2;
        if (head && head.type === "element" && head.tagName === "p") {
          paragraph2 = head;
        } else {
          paragraph2 = { type: "element", tagName: "p", properties: {}, children: [] };
          results.unshift(paragraph2);
        }
        if (paragraph2.children.length > 0) {
          paragraph2.children.unshift({ type: "text", value: " " });
        }
        paragraph2.children.unshift({
          type: "element",
          tagName: "input",
          properties: { type: "checkbox", checked: node2.checked, disabled: true },
          children: []
        });
        properties.className = ["task-list-item"];
      }
      let index2 = -1;
      while (++index2 < results.length) {
        const child = results[index2];
        if (loose || index2 !== 0 || child.type !== "element" || child.tagName !== "p") {
          children.push({ type: "text", value: "\n" });
        }
        if (child.type === "element" && child.tagName === "p" && !loose) {
          children.push(...child.children);
        } else {
          children.push(child);
        }
      }
      const tail = results[results.length - 1];
      if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
        children.push({ type: "text", value: "\n" });
      }
      const result = { type: "element", tagName: "li", properties, children };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }
    function listLoose(node2) {
      let loose = false;
      if (node2.type === "list") {
        loose = node2.spread || false;
        const children = node2.children;
        let index2 = -1;
        while (!loose && ++index2 < children.length) {
          loose = listItemLoose(children[index2]);
        }
      }
      return loose;
    }
    function listItemLoose(node2) {
      const spread = node2.spread;
      return spread === null || spread === void 0 ? node2.children.length > 1 : spread;
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/list.js
    function list2(state, node2) {
      const properties = {};
      const results = state.all(node2);
      let index2 = -1;
      if (typeof node2.start === "number" && node2.start !== 1) {
        properties.start = node2.start;
      }
      while (++index2 < results.length) {
        const child = results[index2];
        if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
          properties.className = ["contains-task-list"];
          break;
        }
      }
      const result = {
        type: "element",
        tagName: node2.ordered ? "ol" : "ul",
        properties,
        children: state.wrap(results, true)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
    function paragraph(state, node2) {
      const result = {
        type: "element",
        tagName: "p",
        properties: {},
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/root.js
    function root(state, node2) {
      const result = { type: "root", children: state.wrap(state.all(node2)) };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/strong.js
    function strong(state, node2) {
      const result = {
        type: "element",
        tagName: "strong",
        properties: {},
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/unist-util-position@5.0.0/node_modules/unist-util-position/lib/index.js
    var pointEnd = point3("end");
    var pointStart = point3("start");
    function point3(type) {
      return point4;
      function point4(node2) {
        const point5 = node2 && node2.position && node2.position[type] || {};
        if (typeof point5.line === "number" && point5.line > 0 && typeof point5.column === "number" && point5.column > 0) {
          return {
            line: point5.line,
            column: point5.column,
            offset: typeof point5.offset === "number" && point5.offset > -1 ? point5.offset : void 0
          };
        }
      }
    }
    function position2(node2) {
      const start = pointStart(node2);
      const end = pointEnd(node2);
      if (start && end) {
        return { start, end };
      }
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/table.js
    function table(state, node2) {
      const rows = state.all(node2);
      const firstRow = rows.shift();
      const tableContent = [];
      if (firstRow) {
        const head = {
          type: "element",
          tagName: "thead",
          properties: {},
          children: state.wrap([firstRow], true)
        };
        state.patch(node2.children[0], head);
        tableContent.push(head);
      }
      if (rows.length > 0) {
        const body = {
          type: "element",
          tagName: "tbody",
          properties: {},
          children: state.wrap(rows, true)
        };
        const start = pointStart(node2.children[1]);
        const end = pointEnd(node2.children[node2.children.length - 1]);
        if (start && end)
          body.position = { start, end };
        tableContent.push(body);
      }
      const result = {
        type: "element",
        tagName: "table",
        properties: {},
        children: state.wrap(tableContent, true)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/table-row.js
    function tableRow(state, node2, parent) {
      const siblings = parent ? parent.children : void 0;
      const rowIndex = siblings ? siblings.indexOf(node2) : 1;
      const tagName = rowIndex === 0 ? "th" : "td";
      const align = parent && parent.type === "table" ? parent.align : void 0;
      const length = align ? align.length : node2.children.length;
      let cellIndex = -1;
      const cells = [];
      while (++cellIndex < length) {
        const cell = node2.children[cellIndex];
        const properties = {};
        const alignValue = align ? align[cellIndex] : void 0;
        if (alignValue) {
          properties.align = alignValue;
        }
        let result2 = { type: "element", tagName, properties, children: [] };
        if (cell) {
          result2.children = state.all(cell);
          state.patch(cell, result2);
          result2 = state.applyData(cell, result2);
        }
        cells.push(result2);
      }
      const result = {
        type: "element",
        tagName: "tr",
        properties: {},
        children: state.wrap(cells, true)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
    function tableCell(state, node2) {
      const result = {
        type: "element",
        tagName: "td",
        // Assume body cell.
        properties: {},
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/trim-lines@3.0.1/node_modules/trim-lines/index.js
    var tab = 9;
    var space = 32;
    function trimLines(value) {
      const source = String(value);
      const search2 = /\r?\n|\r/g;
      let match = search2.exec(source);
      let last = 0;
      const lines = [];
      while (match) {
        lines.push(
          trimLine(source.slice(last, match.index), last > 0, true),
          match[0]
        );
        last = match.index + match[0].length;
        match = search2.exec(source);
      }
      lines.push(trimLine(source.slice(last), last > 0, false));
      return lines.join("");
    }
    function trimLine(value, start, end) {
      let startIndex = 0;
      let endIndex = value.length;
      if (start) {
        let code2 = value.codePointAt(startIndex);
        while (code2 === tab || code2 === space) {
          startIndex++;
          code2 = value.codePointAt(startIndex);
        }
      }
      if (end) {
        let code2 = value.codePointAt(endIndex - 1);
        while (code2 === tab || code2 === space) {
          endIndex--;
          code2 = value.codePointAt(endIndex - 1);
        }
      }
      return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/text.js
    function text3(state, node2) {
      const result = { type: "text", value: trimLines(String(node2.value)) };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
    function thematicBreak2(state, node2) {
      const result = {
        type: "element",
        tagName: "hr",
        properties: {},
        children: []
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/handlers/index.js
    var handlers = {
      blockquote,
      break: hardBreak,
      code,
      delete: strikethrough,
      emphasis,
      footnoteReference,
      heading,
      html,
      imageReference,
      image,
      inlineCode,
      linkReference,
      link,
      listItem,
      list: list2,
      paragraph,
      // @ts-expect-error: root is different, but hard to type.
      root,
      strong,
      table,
      tableCell,
      tableRow,
      text: text3,
      thematicBreak: thematicBreak2,
      toml: ignore,
      yaml: ignore,
      definition: ignore,
      footnoteDefinition: ignore
    };
    function ignore() {
      return void 0;
    }

    // node_modules/.pnpm/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/types.js
    var VOID = -1;
    var PRIMITIVE = 0;
    var ARRAY = 1;
    var OBJECT = 2;
    var DATE = 3;
    var REGEXP = 4;
    var MAP = 5;
    var SET = 6;
    var ERROR = 7;
    var BIGINT = 8;

    // node_modules/.pnpm/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/deserialize.js
    var env = typeof self === "object" ? self : globalThis;
    var deserializer = ($, _) => {
      const as = (out, index2) => {
        $.set(index2, out);
        return out;
      };
      const unpair = (index2) => {
        if ($.has(index2))
          return $.get(index2);
        const [type, value] = _[index2];
        switch (type) {
          case PRIMITIVE:
          case VOID:
            return as(value, index2);
          case ARRAY: {
            const arr = as([], index2);
            for (const index3 of value)
              arr.push(unpair(index3));
            return arr;
          }
          case OBJECT: {
            const object = as({}, index2);
            for (const [key, index3] of value)
              object[unpair(key)] = unpair(index3);
            return object;
          }
          case DATE:
            return as(new Date(value), index2);
          case REGEXP: {
            const { source, flags } = value;
            return as(new RegExp(source, flags), index2);
          }
          case MAP: {
            const map = as(/* @__PURE__ */ new Map(), index2);
            for (const [key, index3] of value)
              map.set(unpair(key), unpair(index3));
            return map;
          }
          case SET: {
            const set = as(/* @__PURE__ */ new Set(), index2);
            for (const index3 of value)
              set.add(unpair(index3));
            return set;
          }
          case ERROR: {
            const { name, message } = value;
            return as(new env[name](message), index2);
          }
          case BIGINT:
            return as(BigInt(value), index2);
          case "BigInt":
            return as(Object(BigInt(value)), index2);
        }
        return as(new env[type](value), index2);
      };
      return unpair;
    };
    var deserialize = (serialized) => deserializer(/* @__PURE__ */ new Map(), serialized)(0);

    // node_modules/.pnpm/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/serialize.js
    var EMPTY = "";
    var { toString: toString2 } = {};
    var { keys } = Object;
    var typeOf = (value) => {
      const type = typeof value;
      if (type !== "object" || !value)
        return [PRIMITIVE, type];
      const asString = toString2.call(value).slice(8, -1);
      switch (asString) {
        case "Array":
          return [ARRAY, EMPTY];
        case "Object":
          return [OBJECT, EMPTY];
        case "Date":
          return [DATE, EMPTY];
        case "RegExp":
          return [REGEXP, EMPTY];
        case "Map":
          return [MAP, EMPTY];
        case "Set":
          return [SET, EMPTY];
      }
      if (asString.includes("Array"))
        return [ARRAY, asString];
      if (asString.includes("Error"))
        return [ERROR, asString];
      return [OBJECT, asString];
    };
    var shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol");
    var serializer = (strict, json, $, _) => {
      const as = (out, value) => {
        const index2 = _.push(out) - 1;
        $.set(value, index2);
        return index2;
      };
      const pair = (value) => {
        if ($.has(value))
          return $.get(value);
        let [TYPE, type] = typeOf(value);
        switch (TYPE) {
          case PRIMITIVE: {
            let entry = value;
            switch (type) {
              case "bigint":
                TYPE = BIGINT;
                entry = value.toString();
                break;
              case "function":
              case "symbol":
                if (strict)
                  throw new TypeError("unable to serialize " + type);
                entry = null;
                break;
              case "undefined":
                return as([VOID], value);
            }
            return as([TYPE, entry], value);
          }
          case ARRAY: {
            if (type)
              return as([type, [...value]], value);
            const arr = [];
            const index2 = as([TYPE, arr], value);
            for (const entry of value)
              arr.push(pair(entry));
            return index2;
          }
          case OBJECT: {
            if (type) {
              switch (type) {
                case "BigInt":
                  return as([type, value.toString()], value);
                case "Boolean":
                case "Number":
                case "String":
                  return as([type, value.valueOf()], value);
              }
            }
            if (json && "toJSON" in value)
              return pair(value.toJSON());
            const entries = [];
            const index2 = as([TYPE, entries], value);
            for (const key of keys(value)) {
              if (strict || !shouldSkip(typeOf(value[key])))
                entries.push([pair(key), pair(value[key])]);
            }
            return index2;
          }
          case DATE:
            return as([TYPE, value.toISOString()], value);
          case REGEXP: {
            const { source, flags } = value;
            return as([TYPE, { source, flags }], value);
          }
          case MAP: {
            const entries = [];
            const index2 = as([TYPE, entries], value);
            for (const [key, entry] of value) {
              if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
                entries.push([pair(key), pair(entry)]);
            }
            return index2;
          }
          case SET: {
            const entries = [];
            const index2 = as([TYPE, entries], value);
            for (const entry of value) {
              if (strict || !shouldSkip(typeOf(entry)))
                entries.push(pair(entry));
            }
            return index2;
          }
        }
        const { message } = value;
        return as([TYPE, { name: type, message }], value);
      };
      return pair;
    };
    var serialize = (value, { json, lossy } = {}) => {
      const _ = [];
      return serializer(!(json || lossy), !!json, /* @__PURE__ */ new Map(), _)(value), _;
    };

    // node_modules/.pnpm/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/index.js
    var esm_default = typeof structuredClone === "function" ? (
      /* c8 ignore start */
      (any, options) => options && ("json" in options || "lossy" in options) ? deserialize(serialize(any, options)) : structuredClone(any)
    ) : (any, options) => deserialize(serialize(any, options));

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/footer.js
    function defaultFootnoteBackContent(_, rereferenceIndex) {
      const result = [{ type: "text", value: "\u21A9" }];
      if (rereferenceIndex > 1) {
        result.push({
          type: "element",
          tagName: "sup",
          properties: {},
          children: [{ type: "text", value: String(rereferenceIndex) }]
        });
      }
      return result;
    }
    function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
      return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
    }
    function footer(state) {
      const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
      const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
      const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
      const footnoteLabel = state.options.footnoteLabel || "Footnotes";
      const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
      const footnoteLabelProperties = state.options.footnoteLabelProperties || {
        className: ["sr-only"]
      };
      const listItems = [];
      let referenceIndex = -1;
      while (++referenceIndex < state.footnoteOrder.length) {
        const def = state.footnoteById.get(state.footnoteOrder[referenceIndex]);
        if (!def) {
          continue;
        }
        const content3 = state.all(def);
        const id = String(def.identifier).toUpperCase();
        const safeId = normalizeUri(id.toLowerCase());
        let rereferenceIndex = 0;
        const backReferences = [];
        const counts = state.footnoteCounts.get(id);
        while (counts !== void 0 && ++rereferenceIndex <= counts) {
          if (backReferences.length > 0) {
            backReferences.push({ type: "text", value: " " });
          }
          let children = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
          if (typeof children === "string") {
            children = { type: "text", value: children };
          }
          backReferences.push({
            type: "element",
            tagName: "a",
            properties: {
              href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
              dataFootnoteBackref: "",
              ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
              className: ["data-footnote-backref"]
            },
            children: Array.isArray(children) ? children : [children]
          });
        }
        const tail = content3[content3.length - 1];
        if (tail && tail.type === "element" && tail.tagName === "p") {
          const tailTail = tail.children[tail.children.length - 1];
          if (tailTail && tailTail.type === "text") {
            tailTail.value += " ";
          } else {
            tail.children.push({ type: "text", value: " " });
          }
          tail.children.push(...backReferences);
        } else {
          content3.push(...backReferences);
        }
        const listItem2 = {
          type: "element",
          tagName: "li",
          properties: { id: clobberPrefix + "fn-" + safeId },
          children: state.wrap(content3, true)
        };
        state.patch(def, listItem2);
        listItems.push(listItem2);
      }
      if (listItems.length === 0) {
        return;
      }
      return {
        type: "element",
        tagName: "section",
        properties: { dataFootnotes: true, className: ["footnotes"] },
        children: [
          {
            type: "element",
            tagName: footnoteLabelTagName,
            properties: {
              ...esm_default(footnoteLabelProperties),
              id: "footnote-label"
            },
            children: [{ type: "text", value: footnoteLabel }]
          },
          { type: "text", value: "\n" },
          {
            type: "element",
            tagName: "ol",
            properties: {},
            children: state.wrap(listItems, true)
          },
          { type: "text", value: "\n" }
        ]
      };
    }

    // node_modules/.pnpm/unist-util-is@6.0.0/node_modules/unist-util-is/lib/index.js
    var convert = (
      // Note: overloads in JSDoc can’t yet use different `@template`s.
      /**
       * @type {(
       *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
       *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
       *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
       *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
       *   ((test?: Test) => Check)
       * )}
       */
      /**
       * @param {Test} [test]
       * @returns {Check}
       */
      function(test) {
        if (test === null || test === void 0) {
          return ok2;
        }
        if (typeof test === "function") {
          return castFactory(test);
        }
        if (typeof test === "object") {
          return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
        }
        if (typeof test === "string") {
          return typeFactory(test);
        }
        throw new Error("Expected function, string, or object as test");
      }
    );
    function anyFactory(tests) {
      const checks = [];
      let index2 = -1;
      while (++index2 < tests.length) {
        checks[index2] = convert(tests[index2]);
      }
      return castFactory(any);
      function any(...parameters) {
        let index3 = -1;
        while (++index3 < checks.length) {
          if (checks[index3].apply(this, parameters))
            return true;
        }
        return false;
      }
    }
    function propsFactory(check) {
      const checkAsRecord = (
        /** @type {Record<string, unknown>} */
        check
      );
      return castFactory(all2);
      function all2(node2) {
        const nodeAsRecord = (
          /** @type {Record<string, unknown>} */
          /** @type {unknown} */
          node2
        );
        let key;
        for (key in check) {
          if (nodeAsRecord[key] !== checkAsRecord[key])
            return false;
        }
        return true;
      }
    }
    function typeFactory(check) {
      return castFactory(type);
      function type(node2) {
        return node2 && node2.type === check;
      }
    }
    function castFactory(testFunction) {
      return check;
      function check(value, index2, parent) {
        return Boolean(
          looksLikeANode(value) && testFunction.call(
            this,
            value,
            typeof index2 === "number" ? index2 : void 0,
            parent || void 0
          )
        );
      }
    }
    function ok2() {
      return true;
    }
    function looksLikeANode(value) {
      return value !== null && typeof value === "object" && "type" in value;
    }

    // node_modules/.pnpm/unist-util-visit-parents@6.0.1/node_modules/unist-util-visit-parents/lib/color.js
    function color(d) {
      return d;
    }

    // node_modules/.pnpm/unist-util-visit-parents@6.0.1/node_modules/unist-util-visit-parents/lib/index.js
    var empty = [];
    var CONTINUE = true;
    var EXIT = false;
    var SKIP = "skip";
    function visitParents(tree, test, visitor, reverse) {
      let check;
      if (typeof test === "function" && typeof visitor !== "function") {
        reverse = visitor;
        visitor = test;
      } else {
        check = test;
      }
      const is2 = convert(check);
      const step = reverse ? -1 : 1;
      factory(tree, void 0, [])();
      function factory(node2, index2, parents) {
        const value = (
          /** @type {Record<string, unknown>} */
          node2 && typeof node2 === "object" ? node2 : {}
        );
        if (typeof value.type === "string") {
          const name = (
            // `hast`
            typeof value.tagName === "string" ? value.tagName : (
              // `xast`
              typeof value.name === "string" ? value.name : void 0
            )
          );
          Object.defineProperty(visit3, "name", {
            value: "node (" + color(node2.type + (name ? "<" + name + ">" : "")) + ")"
          });
        }
        return visit3;
        function visit3() {
          let result = empty;
          let subresult;
          let offset;
          let grandparents;
          if (!test || is2(node2, index2, parents[parents.length - 1] || void 0)) {
            result = toResult(visitor(node2, parents));
            if (result[0] === EXIT) {
              return result;
            }
          }
          if ("children" in node2 && node2.children) {
            const nodeAsParent = (
              /** @type {UnistParent} */
              node2
            );
            if (nodeAsParent.children && result[0] !== SKIP) {
              offset = (reverse ? nodeAsParent.children.length : -1) + step;
              grandparents = parents.concat(nodeAsParent);
              while (offset > -1 && offset < nodeAsParent.children.length) {
                const child = nodeAsParent.children[offset];
                subresult = factory(child, offset, grandparents)();
                if (subresult[0] === EXIT) {
                  return subresult;
                }
                offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
              }
            }
          }
          return result;
        }
      }
    }
    function toResult(value) {
      if (Array.isArray(value)) {
        return value;
      }
      if (typeof value === "number") {
        return [CONTINUE, value];
      }
      return value === null || value === void 0 ? empty : [value];
    }

    // node_modules/.pnpm/unist-util-visit@5.0.0/node_modules/unist-util-visit/lib/index.js
    function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
      let reverse;
      let test;
      let visitor;
      if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
        test = void 0;
        visitor = testOrVisitor;
        reverse = visitorOrReverse;
      } else {
        test = testOrVisitor;
        visitor = visitorOrReverse;
        reverse = maybeReverse;
      }
      visitParents(tree, test, overload, reverse);
      function overload(node2, parents) {
        const parent = parents[parents.length - 1];
        const index2 = parent ? parent.children.indexOf(node2) : void 0;
        return visitor(node2, index2, parent);
      }
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/state.js
    var own3 = {}.hasOwnProperty;
    var emptyOptions2 = {};
    function createState(tree, options) {
      const settings = options || emptyOptions2;
      const definitionById = /* @__PURE__ */ new Map();
      const footnoteById = /* @__PURE__ */ new Map();
      const footnoteCounts = /* @__PURE__ */ new Map();
      const handlers2 = { ...handlers, ...settings.handlers };
      const state = {
        all: all2,
        applyData,
        definitionById,
        footnoteById,
        footnoteCounts,
        footnoteOrder: [],
        handlers: handlers2,
        one: one2,
        options: settings,
        patch,
        wrap
      };
      visit(tree, function(node2) {
        if (node2.type === "definition" || node2.type === "footnoteDefinition") {
          const map = node2.type === "definition" ? definitionById : footnoteById;
          const id = String(node2.identifier).toUpperCase();
          if (!map.has(id)) {
            map.set(id, node2);
          }
        }
      });
      return state;
      function one2(node2, parent) {
        const type = node2.type;
        const handle = state.handlers[type];
        if (own3.call(state.handlers, type) && handle) {
          return handle(state, node2, parent);
        }
        if (state.options.passThrough && state.options.passThrough.includes(type)) {
          if ("children" in node2) {
            const { children, ...shallow } = node2;
            const result = esm_default(shallow);
            result.children = state.all(node2);
            return result;
          }
          return esm_default(node2);
        }
        const unknown = state.options.unknownHandler || defaultUnknownHandler;
        return unknown(state, node2, parent);
      }
      function all2(parent) {
        const values = [];
        if ("children" in parent) {
          const nodes = parent.children;
          let index2 = -1;
          while (++index2 < nodes.length) {
            const result = state.one(nodes[index2], parent);
            if (result) {
              if (index2 && nodes[index2 - 1].type === "break") {
                if (!Array.isArray(result) && result.type === "text") {
                  result.value = trimMarkdownSpaceStart(result.value);
                }
                if (!Array.isArray(result) && result.type === "element") {
                  const head = result.children[0];
                  if (head && head.type === "text") {
                    head.value = trimMarkdownSpaceStart(head.value);
                  }
                }
              }
              if (Array.isArray(result)) {
                values.push(...result);
              } else {
                values.push(result);
              }
            }
          }
        }
        return values;
      }
    }
    function patch(from, to) {
      if (from.position)
        to.position = position2(from);
    }
    function applyData(from, to) {
      let result = to;
      if (from && from.data) {
        const hName = from.data.hName;
        const hChildren = from.data.hChildren;
        const hProperties = from.data.hProperties;
        if (typeof hName === "string") {
          if (result.type === "element") {
            result.tagName = hName;
          } else {
            const children = "children" in result ? result.children : [result];
            result = { type: "element", tagName: hName, properties: {}, children };
          }
        }
        if (result.type === "element" && hProperties) {
          Object.assign(result.properties, esm_default(hProperties));
        }
        if ("children" in result && result.children && hChildren !== null && hChildren !== void 0) {
          result.children = hChildren;
        }
      }
      return result;
    }
    function defaultUnknownHandler(state, node2) {
      const data = node2.data || {};
      const result = "value" in node2 && !(own3.call(data, "hProperties") || own3.call(data, "hChildren")) ? { type: "text", value: node2.value } : {
        type: "element",
        tagName: "div",
        properties: {},
        children: state.all(node2)
      };
      state.patch(node2, result);
      return state.applyData(node2, result);
    }
    function wrap(nodes, loose) {
      const result = [];
      let index2 = -1;
      if (loose) {
        result.push({ type: "text", value: "\n" });
      }
      while (++index2 < nodes.length) {
        if (index2)
          result.push({ type: "text", value: "\n" });
        result.push(nodes[index2]);
      }
      if (loose && nodes.length > 0) {
        result.push({ type: "text", value: "\n" });
      }
      return result;
    }
    function trimMarkdownSpaceStart(value) {
      let index2 = 0;
      let code2 = value.charCodeAt(index2);
      while (code2 === 9 || code2 === 32) {
        index2++;
        code2 = value.charCodeAt(index2);
      }
      return value.slice(index2);
    }

    // node_modules/.pnpm/mdast-util-to-hast@13.0.2/node_modules/mdast-util-to-hast/lib/index.js
    function toHast(tree, options) {
      const state = createState(tree, options);
      const node2 = state.one(tree, void 0);
      const foot = footer(state);
      const result = Array.isArray(node2) ? { type: "root", children: node2 } : node2 || { type: "root", children: [] };
      if (foot) {
        result.children.push({ type: "text", value: "\n" }, foot);
      }
      return result;
    }

    // node_modules/.pnpm/remark-rehype@11.0.0/node_modules/remark-rehype/lib/index.js
    function remarkRehype(destination, options) {
      if (destination && "run" in destination) {
        return async function(tree, file) {
          const hastTree = (
            /** @type {HastRoot} */
            toHast(tree, options)
          );
          await destination.run(hastTree, file);
        };
      }
      return function(tree) {
        return (
          /** @type {HastRoot} */
          toHast(tree, options || destination)
        );
      };
    }

    // node_modules/.pnpm/bail@2.0.2/node_modules/bail/index.js
    function bail(error) {
      if (error) {
        throw error;
      }
    }

    // node_modules/.pnpm/is-plain-obj@4.1.0/node_modules/is-plain-obj/index.js
    function isPlainObject(value) {
      if (typeof value !== "object" || value === null) {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
    }

    // node_modules/.pnpm/trough@2.1.0/node_modules/trough/index.js
    function trough() {
      const fns = [];
      const pipeline = { run, use };
      return pipeline;
      function run(...values) {
        let middlewareIndex = -1;
        const callback = values.pop();
        if (typeof callback !== "function") {
          throw new TypeError("Expected function as last argument, not " + callback);
        }
        next(null, ...values);
        function next(error, ...output) {
          const fn = fns[++middlewareIndex];
          let index2 = -1;
          if (error) {
            callback(error);
            return;
          }
          while (++index2 < values.length) {
            if (output[index2] === null || output[index2] === void 0) {
              output[index2] = values[index2];
            }
          }
          values = output;
          if (fn) {
            wrap2(fn, next)(...output);
          } else {
            callback(null, ...output);
          }
        }
      }
      function use(middelware) {
        if (typeof middelware !== "function") {
          throw new TypeError(
            "Expected `middelware` to be a function, not " + middelware
          );
        }
        fns.push(middelware);
        return pipeline;
      }
    }
    function wrap2(middleware, callback) {
      let called;
      return wrapped;
      function wrapped(...parameters) {
        const fnExpectsCallback = middleware.length > parameters.length;
        let result;
        if (fnExpectsCallback) {
          parameters.push(done);
        }
        try {
          result = middleware.apply(this, parameters);
        } catch (error) {
          const exception = (
            /** @type {Error} */
            error
          );
          if (fnExpectsCallback && called) {
            throw exception;
          }
          return done(exception);
        }
        if (!fnExpectsCallback) {
          if (result instanceof Promise) {
            result.then(then, done);
          } else if (result instanceof Error) {
            done(result);
          } else {
            then(result);
          }
        }
      }
      function done(error, ...output) {
        if (!called) {
          called = true;
          callback(error, ...output);
        }
      }
      function then(value) {
        done(null, value);
      }
    }

    // node_modules/.pnpm/vfile-message@4.0.2/node_modules/vfile-message/lib/index.js
    var VFileMessage = class extends Error {
      /**
       * Create a message for `reason`.
       *
       * > 🪦 **Note**: also has obsolete signatures.
       *
       * @overload
       * @param {string} reason
       * @param {Options | null | undefined} [options]
       * @returns
       *
       * @overload
       * @param {string} reason
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns
       *
       * @overload
       * @param {string} reason
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns
       *
       * @overload
       * @param {string} reason
       * @param {string | null | undefined} [origin]
       * @returns
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {string | null | undefined} [origin]
       * @returns
       *
       * @param {Error | VFileMessage | string} causeOrReason
       *   Reason for message, should use markdown.
       * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
       *   Configuration (optional).
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns
       *   Instance of `VFileMessage`.
       */
      // eslint-disable-next-line complexity
      constructor(causeOrReason, optionsOrParentOrPlace, origin) {
        super();
        if (typeof optionsOrParentOrPlace === "string") {
          origin = optionsOrParentOrPlace;
          optionsOrParentOrPlace = void 0;
        }
        let reason = "";
        let options = {};
        let legacyCause = false;
        if (optionsOrParentOrPlace) {
          if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
            options = { place: optionsOrParentOrPlace };
          } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
            options = { place: optionsOrParentOrPlace };
          } else if ("type" in optionsOrParentOrPlace) {
            options = {
              ancestors: [optionsOrParentOrPlace],
              place: optionsOrParentOrPlace.position
            };
          } else {
            options = { ...optionsOrParentOrPlace };
          }
        }
        if (typeof causeOrReason === "string") {
          reason = causeOrReason;
        } else if (!options.cause && causeOrReason) {
          legacyCause = true;
          reason = causeOrReason.message;
          options.cause = causeOrReason;
        }
        if (!options.ruleId && !options.source && typeof origin === "string") {
          const index2 = origin.indexOf(":");
          if (index2 === -1) {
            options.ruleId = origin;
          } else {
            options.source = origin.slice(0, index2);
            options.ruleId = origin.slice(index2 + 1);
          }
        }
        if (!options.place && options.ancestors && options.ancestors) {
          const parent = options.ancestors[options.ancestors.length - 1];
          if (parent) {
            options.place = parent.position;
          }
        }
        const start = options.place && "start" in options.place ? options.place.start : options.place;
        this.ancestors = options.ancestors || void 0;
        this.cause = options.cause || void 0;
        this.column = start ? start.column : void 0;
        this.fatal = void 0;
        this.file;
        this.message = reason;
        this.line = start ? start.line : void 0;
        this.name = stringifyPosition(options.place) || "1:1";
        this.place = options.place || void 0;
        this.reason = this.message;
        this.ruleId = options.ruleId || void 0;
        this.source = options.source || void 0;
        this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
        this.actual;
        this.expected;
        this.note;
        this.url;
      }
    };
    VFileMessage.prototype.file = "";
    VFileMessage.prototype.name = "";
    VFileMessage.prototype.reason = "";
    VFileMessage.prototype.message = "";
    VFileMessage.prototype.stack = "";
    VFileMessage.prototype.column = void 0;
    VFileMessage.prototype.line = void 0;
    VFileMessage.prototype.ancestors = void 0;
    VFileMessage.prototype.cause = void 0;
    VFileMessage.prototype.fatal = void 0;
    VFileMessage.prototype.place = void 0;
    VFileMessage.prototype.ruleId = void 0;
    VFileMessage.prototype.source = void 0;

    // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minpath.browser.js
    var path = { basename, dirname, extname, join, sep: "/" };
    function basename(path2, ext) {
      if (ext !== void 0 && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      assertPath(path2);
      let start = 0;
      let end = -1;
      let index2 = path2.length;
      let seenNonSlash;
      if (ext === void 0 || ext.length === 0 || ext.length > path2.length) {
        while (index2--) {
          if (path2.codePointAt(index2) === 47) {
            if (seenNonSlash) {
              start = index2 + 1;
              break;
            }
          } else if (end < 0) {
            seenNonSlash = true;
            end = index2 + 1;
          }
        }
        return end < 0 ? "" : path2.slice(start, end);
      }
      if (ext === path2) {
        return "";
      }
      let firstNonSlashEnd = -1;
      let extIndex = ext.length - 1;
      while (index2--) {
        if (path2.codePointAt(index2) === 47) {
          if (seenNonSlash) {
            start = index2 + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd < 0) {
            seenNonSlash = true;
            firstNonSlashEnd = index2 + 1;
          }
          if (extIndex > -1) {
            if (path2.codePointAt(index2) === ext.codePointAt(extIndex--)) {
              if (extIndex < 0) {
                end = index2;
              }
            } else {
              extIndex = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) {
        end = firstNonSlashEnd;
      } else if (end < 0) {
        end = path2.length;
      }
      return path2.slice(start, end);
    }
    function dirname(path2) {
      assertPath(path2);
      if (path2.length === 0) {
        return ".";
      }
      let end = -1;
      let index2 = path2.length;
      let unmatchedSlash;
      while (--index2) {
        if (path2.codePointAt(index2) === 47) {
          if (unmatchedSlash) {
            end = index2;
            break;
          }
        } else if (!unmatchedSlash) {
          unmatchedSlash = true;
        }
      }
      return end < 0 ? path2.codePointAt(0) === 47 ? "/" : "." : end === 1 && path2.codePointAt(0) === 47 ? "//" : path2.slice(0, end);
    }
    function extname(path2) {
      assertPath(path2);
      let index2 = path2.length;
      let end = -1;
      let startPart = 0;
      let startDot = -1;
      let preDotState = 0;
      let unmatchedSlash;
      while (index2--) {
        const code2 = path2.codePointAt(index2);
        if (code2 === 47) {
          if (unmatchedSlash) {
            startPart = index2 + 1;
            break;
          }
          continue;
        }
        if (end < 0) {
          unmatchedSlash = true;
          end = index2 + 1;
        }
        if (code2 === 46) {
          if (startDot < 0) {
            startDot = index2;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot > -1) {
          preDotState = -1;
        }
      }
      if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
      preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path2.slice(startDot, end);
    }
    function join(...segments) {
      let index2 = -1;
      let joined;
      while (++index2 < segments.length) {
        assertPath(segments[index2]);
        if (segments[index2]) {
          joined = joined === void 0 ? segments[index2] : joined + "/" + segments[index2];
        }
      }
      return joined === void 0 ? "." : normalize(joined);
    }
    function normalize(path2) {
      assertPath(path2);
      const absolute = path2.codePointAt(0) === 47;
      let value = normalizeString(path2, !absolute);
      if (value.length === 0 && !absolute) {
        value = ".";
      }
      if (value.length > 0 && path2.codePointAt(path2.length - 1) === 47) {
        value += "/";
      }
      return absolute ? "/" + value : value;
    }
    function normalizeString(path2, allowAboveRoot) {
      let result = "";
      let lastSegmentLength = 0;
      let lastSlash = -1;
      let dots = 0;
      let index2 = -1;
      let code2;
      let lastSlashIndex;
      while (++index2 <= path2.length) {
        if (index2 < path2.length) {
          code2 = path2.codePointAt(index2);
        } else if (code2 === 47) {
          break;
        } else {
          code2 = 47;
        }
        if (code2 === 47) {
          if (lastSlash === index2 - 1 || dots === 1) ; else if (lastSlash !== index2 - 1 && dots === 2) {
            if (result.length < 2 || lastSegmentLength !== 2 || result.codePointAt(result.length - 1) !== 46 || result.codePointAt(result.length - 2) !== 46) {
              if (result.length > 2) {
                lastSlashIndex = result.lastIndexOf("/");
                if (lastSlashIndex !== result.length - 1) {
                  if (lastSlashIndex < 0) {
                    result = "";
                    lastSegmentLength = 0;
                  } else {
                    result = result.slice(0, lastSlashIndex);
                    lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
                  }
                  lastSlash = index2;
                  dots = 0;
                  continue;
                }
              } else if (result.length > 0) {
                result = "";
                lastSegmentLength = 0;
                lastSlash = index2;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              result = result.length > 0 ? result + "/.." : "..";
              lastSegmentLength = 2;
            }
          } else {
            if (result.length > 0) {
              result += "/" + path2.slice(lastSlash + 1, index2);
            } else {
              result = path2.slice(lastSlash + 1, index2);
            }
            lastSegmentLength = index2 - lastSlash - 1;
          }
          lastSlash = index2;
          dots = 0;
        } else if (code2 === 46 && dots > -1) {
          dots++;
        } else {
          dots = -1;
        }
      }
      return result;
    }
    function assertPath(path2) {
      if (typeof path2 !== "string") {
        throw new TypeError(
          "Path must be a string. Received " + JSON.stringify(path2)
        );
      }
    }

    // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minproc.browser.js
    var proc = { cwd };
    function cwd() {
      return "/";
    }

    // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minurl.shared.js
    function isUrl(fileUrlOrPath) {
      return Boolean(
        fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && // @ts-expect-error: indexing is fine.
        fileUrlOrPath.auth === void 0
      );
    }

    // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/minurl.browser.js
    function urlToPath(path2) {
      if (typeof path2 === "string") {
        path2 = new URL(path2);
      } else if (!isUrl(path2)) {
        const error = new TypeError(
          'The "path" argument must be of type string or an instance of URL. Received `' + path2 + "`"
        );
        error.code = "ERR_INVALID_ARG_TYPE";
        throw error;
      }
      if (path2.protocol !== "file:") {
        const error = new TypeError("The URL must be of scheme file");
        error.code = "ERR_INVALID_URL_SCHEME";
        throw error;
      }
      return getPathFromURLPosix(path2);
    }
    function getPathFromURLPosix(url) {
      if (url.hostname !== "") {
        const error = new TypeError(
          'File URL host must be "localhost" or empty on darwin'
        );
        error.code = "ERR_INVALID_FILE_URL_HOST";
        throw error;
      }
      const pathname = url.pathname;
      let index2 = -1;
      while (++index2 < pathname.length) {
        if (pathname.codePointAt(index2) === 37 && pathname.codePointAt(index2 + 1) === 50) {
          const third = pathname.codePointAt(index2 + 2);
          if (third === 70 || third === 102) {
            const error = new TypeError(
              "File URL path must not include encoded / characters"
            );
            error.code = "ERR_INVALID_FILE_URL_PATH";
            throw error;
          }
        }
      }
      return decodeURIComponent(pathname);
    }

    // node_modules/.pnpm/vfile@6.0.1/node_modules/vfile/lib/index.js
    var order = (
      /** @type {const} */
      [
        "history",
        "path",
        "basename",
        "stem",
        "extname",
        "dirname"
      ]
    );
    var VFile = class {
      /**
       * Create a new virtual file.
       *
       * `options` is treated as:
       *
       * *   `string` or `Uint8Array` — `{value: options}`
       * *   `URL` — `{path: options}`
       * *   `VFile` — shallow copies its data over to the new file
       * *   `object` — all fields are shallow copied over to the new file
       *
       * Path related fields are set in the following order (least specific to
       * most specific): `history`, `path`, `basename`, `stem`, `extname`,
       * `dirname`.
       *
       * You cannot set `dirname` or `extname` without setting either `history`,
       * `path`, `basename`, or `stem` too.
       *
       * @param {Compatible | null | undefined} [value]
       *   File value.
       * @returns
       *   New instance.
       */
      constructor(value) {
        let options;
        if (!value) {
          options = {};
        } else if (isUrl(value)) {
          options = { path: value };
        } else if (typeof value === "string" || isUint8Array(value)) {
          options = { value };
        } else {
          options = value;
        }
        this.cwd = proc.cwd();
        this.data = {};
        this.history = [];
        this.messages = [];
        this.value;
        this.map;
        this.result;
        this.stored;
        let index2 = -1;
        while (++index2 < order.length) {
          const prop2 = order[index2];
          if (prop2 in options && options[prop2] !== void 0 && options[prop2] !== null) {
            this[prop2] = prop2 === "history" ? [...options[prop2]] : options[prop2];
          }
        }
        let prop;
        for (prop in options) {
          if (!order.includes(prop)) {
            this[prop] = options[prop];
          }
        }
      }
      /**
       * Get the basename (including extname) (example: `'index.min.js'`).
       *
       * @returns {string | undefined}
       *   Basename.
       */
      get basename() {
        return typeof this.path === "string" ? path.basename(this.path) : void 0;
      }
      /**
       * Set basename (including extname) (`'index.min.js'`).
       *
       * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
       * on windows).
       * Cannot be nullified (use `file.path = file.dirname` instead).
       *
       * @param {string} basename
       *   Basename.
       * @returns {undefined}
       *   Nothing.
       */
      set basename(basename2) {
        assertNonEmpty(basename2, "basename");
        assertPart(basename2, "basename");
        this.path = path.join(this.dirname || "", basename2);
      }
      /**
       * Get the parent path (example: `'~'`).
       *
       * @returns {string | undefined}
       *   Dirname.
       */
      get dirname() {
        return typeof this.path === "string" ? path.dirname(this.path) : void 0;
      }
      /**
       * Set the parent path (example: `'~'`).
       *
       * Cannot be set if there’s no `path` yet.
       *
       * @param {string | undefined} dirname
       *   Dirname.
       * @returns {undefined}
       *   Nothing.
       */
      set dirname(dirname2) {
        assertPath2(this.basename, "dirname");
        this.path = path.join(dirname2 || "", this.basename);
      }
      /**
       * Get the extname (including dot) (example: `'.js'`).
       *
       * @returns {string | undefined}
       *   Extname.
       */
      get extname() {
        return typeof this.path === "string" ? path.extname(this.path) : void 0;
      }
      /**
       * Set the extname (including dot) (example: `'.js'`).
       *
       * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
       * on windows).
       * Cannot be set if there’s no `path` yet.
       *
       * @param {string | undefined} extname
       *   Extname.
       * @returns {undefined}
       *   Nothing.
       */
      set extname(extname2) {
        assertPart(extname2, "extname");
        assertPath2(this.dirname, "extname");
        if (extname2) {
          if (extname2.codePointAt(0) !== 46) {
            throw new Error("`extname` must start with `.`");
          }
          if (extname2.includes(".", 1)) {
            throw new Error("`extname` cannot contain multiple dots");
          }
        }
        this.path = path.join(this.dirname, this.stem + (extname2 || ""));
      }
      /**
       * Get the full path (example: `'~/index.min.js'`).
       *
       * @returns {string}
       *   Path.
       */
      get path() {
        return this.history[this.history.length - 1];
      }
      /**
       * Set the full path (example: `'~/index.min.js'`).
       *
       * Cannot be nullified.
       * You can set a file URL (a `URL` object with a `file:` protocol) which will
       * be turned into a path with `url.fileURLToPath`.
       *
       * @param {URL | string} path
       *   Path.
       * @returns {undefined}
       *   Nothing.
       */
      set path(path2) {
        if (isUrl(path2)) {
          path2 = urlToPath(path2);
        }
        assertNonEmpty(path2, "path");
        if (this.path !== path2) {
          this.history.push(path2);
        }
      }
      /**
       * Get the stem (basename w/o extname) (example: `'index.min'`).
       *
       * @returns {string | undefined}
       *   Stem.
       */
      get stem() {
        return typeof this.path === "string" ? path.basename(this.path, this.extname) : void 0;
      }
      /**
       * Set the stem (basename w/o extname) (example: `'index.min'`).
       *
       * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
       * on windows).
       * Cannot be nullified (use `file.path = file.dirname` instead).
       *
       * @param {string} stem
       *   Stem.
       * @returns {undefined}
       *   Nothing.
       */
      set stem(stem) {
        assertNonEmpty(stem, "stem");
        assertPart(stem, "stem");
        this.path = path.join(this.dirname || "", stem + (this.extname || ""));
      }
      // Normal prototypal methods.
      /**
       * Create a fatal message for `reason` associated with the file.
       *
       * The `fatal` field of the message is set to `true` (error; file not usable)
       * and the `file` field is set to the current file path.
       * The message is added to the `messages` field on `file`.
       *
       * > 🪦 **Note**: also has obsolete signatures.
       *
       * @overload
       * @param {string} reason
       * @param {MessageOptions | null | undefined} [options]
       * @returns {never}
       *
       * @overload
       * @param {string} reason
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns {never}
       *
       * @overload
       * @param {string} reason
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns {never}
       *
       * @overload
       * @param {string} reason
       * @param {string | null | undefined} [origin]
       * @returns {never}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns {never}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns {never}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {string | null | undefined} [origin]
       * @returns {never}
       *
       * @param {Error | VFileMessage | string} causeOrReason
       *   Reason for message, should use markdown.
       * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
       *   Configuration (optional).
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns {never}
       *   Never.
       * @throws {VFileMessage}
       *   Message.
       */
      fail(causeOrReason, optionsOrParentOrPlace, origin) {
        const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
        message.fatal = true;
        throw message;
      }
      /**
       * Create an info message for `reason` associated with the file.
       *
       * The `fatal` field of the message is set to `undefined` (info; change
       * likely not needed) and the `file` field is set to the current file path.
       * The message is added to the `messages` field on `file`.
       *
       * > 🪦 **Note**: also has obsolete signatures.
       *
       * @overload
       * @param {string} reason
       * @param {MessageOptions | null | undefined} [options]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {string} reason
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {string} reason
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {string} reason
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @param {Error | VFileMessage | string} causeOrReason
       *   Reason for message, should use markdown.
       * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
       *   Configuration (optional).
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns {VFileMessage}
       *   Message.
       */
      info(causeOrReason, optionsOrParentOrPlace, origin) {
        const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
        message.fatal = void 0;
        return message;
      }
      /**
       * Create a message for `reason` associated with the file.
       *
       * The `fatal` field of the message is set to `false` (warning; change may be
       * needed) and the `file` field is set to the current file path.
       * The message is added to the `messages` field on `file`.
       *
       * > 🪦 **Note**: also has obsolete signatures.
       *
       * @overload
       * @param {string} reason
       * @param {MessageOptions | null | undefined} [options]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {string} reason
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {string} reason
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {string} reason
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Node | NodeLike | null | undefined} parent
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {Point | Position | null | undefined} place
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @overload
       * @param {Error | VFileMessage} cause
       * @param {string | null | undefined} [origin]
       * @returns {VFileMessage}
       *
       * @param {Error | VFileMessage | string} causeOrReason
       *   Reason for message, should use markdown.
       * @param {Node | NodeLike | MessageOptions | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
       *   Configuration (optional).
       * @param {string | null | undefined} [origin]
       *   Place in code where the message originates (example:
       *   `'my-package:my-rule'` or `'my-rule'`).
       * @returns {VFileMessage}
       *   Message.
       */
      message(causeOrReason, optionsOrParentOrPlace, origin) {
        const message = new VFileMessage(
          // @ts-expect-error: the overloads are fine.
          causeOrReason,
          optionsOrParentOrPlace,
          origin
        );
        if (this.path) {
          message.name = this.path + ":" + message.name;
          message.file = this.path;
        }
        message.fatal = false;
        this.messages.push(message);
        return message;
      }
      /**
       * Serialize the file.
       *
       * > **Note**: which encodings are supported depends on the engine.
       * > For info on Node.js, see:
       * > <https://nodejs.org/api/util.html#whatwg-supported-encodings>.
       *
       * @param {string | null | undefined} [encoding='utf8']
       *   Character encoding to understand `value` as when it’s a `Uint8Array`
       *   (default: `'utf-8'`).
       * @returns {string}
       *   Serialized file.
       */
      toString(encoding) {
        if (this.value === void 0) {
          return "";
        }
        if (typeof this.value === "string") {
          return this.value;
        }
        const decoder = new TextDecoder(encoding || void 0);
        return decoder.decode(this.value);
      }
    };
    function assertPart(part, name) {
      if (part && part.includes(path.sep)) {
        throw new Error(
          "`" + name + "` cannot be a path: did not expect `" + path.sep + "`"
        );
      }
    }
    function assertNonEmpty(part, name) {
      if (!part) {
        throw new Error("`" + name + "` cannot be empty");
      }
    }
    function assertPath2(path2, name) {
      if (!path2) {
        throw new Error("Setting `" + name + "` requires `path` to be set too");
      }
    }
    function isUint8Array(value) {
      return Boolean(
        value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
      );
    }

    // node_modules/.pnpm/unified@11.0.2/node_modules/unified/lib/callable-instance.js
    var CallableInstance = (
      /**
       * @type {new <Parameters extends Array<unknown>, Result>(property: string | symbol) => (...parameters: Parameters) => Result}
       */
      /** @type {unknown} */
      /**
       * @this {Function}
       * @param {string | symbol} property
       * @returns {(...parameters: Array<unknown>) => unknown}
       */
      function(property) {
        const self2 = this;
        const constr = self2.constructor;
        const proto = (
          /** @type {Record<string | symbol, Function>} */
          // Prototypes do exist.
          // type-coverage:ignore-next-line
          constr.prototype
        );
        const func = proto[property];
        const apply = function() {
          return func.apply(apply, arguments);
        };
        Object.setPrototypeOf(apply, proto);
        const names = Object.getOwnPropertyNames(func);
        for (const p of names) {
          const descriptor = Object.getOwnPropertyDescriptor(func, p);
          if (descriptor)
            Object.defineProperty(apply, p, descriptor);
        }
        return apply;
      }
    );

    // node_modules/.pnpm/unified@11.0.2/node_modules/unified/lib/index.js
    var own4 = {}.hasOwnProperty;
    var Processor = class _Processor extends CallableInstance {
      /**
       * Create a processor.
       */
      constructor() {
        super("copy");
        this.Compiler = void 0;
        this.Parser = void 0;
        this.attachers = [];
        this.compiler = void 0;
        this.freezeIndex = -1;
        this.frozen = void 0;
        this.namespace = {};
        this.parser = void 0;
        this.transformers = trough();
      }
      /**
       * Copy a processor.
       *
       * @deprecated
       *   This is a private internal method and should not be used.
       * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
       *   New *unfrozen* processor ({@link Processor `Processor`}) that is
       *   configured to work the same as its ancestor.
       *   When the descendant processor is configured in the future it does not
       *   affect the ancestral processor.
       */
      copy() {
        const destination = (
          /** @type {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>} */
          new _Processor()
        );
        let index2 = -1;
        while (++index2 < this.attachers.length) {
          const attacher = this.attachers[index2];
          destination.use(...attacher);
        }
        destination.data(esm_default(this.namespace));
        return destination;
      }
      /**
       * Configure the processor with info available to all plugins.
       * Information is stored in an object.
       *
       * Typically, options can be given to a specific plugin, but sometimes it
       * makes sense to have information shared with several plugins.
       * For example, a list of HTML elements that are self-closing, which is
       * needed during all phases.
       *
       * > 👉 **Note**: setting information cannot occur on *frozen* processors.
       * > Call the processor first to create a new unfrozen processor.
       *
       * > 👉 **Note**: to register custom data in TypeScript, augment the
       * > {@link Data `Data`} interface.
       *
       * @example
       *   This example show how to get and set info:
       *
       *   ```js
       *   import {unified} from 'unified'
       *
       *   const processor = unified().data('alpha', 'bravo')
       *
       *   processor.data('alpha') // => 'bravo'
       *
       *   processor.data() // => {alpha: 'bravo'}
       *
       *   processor.data({charlie: 'delta'})
       *
       *   processor.data() // => {charlie: 'delta'}
       *   ```
       *
       * @template {keyof Data} Key
       *
       * @overload
       * @returns {Data}
       *
       * @overload
       * @param {Data} dataset
       * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
       *
       * @overload
       * @param {Key} key
       * @returns {Data[Key]}
       *
       * @overload
       * @param {Key} key
       * @param {Data[Key]} value
       * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
       *
       * @param {Data | Key} [key]
       *   Key to get or set, or entire dataset to set, or nothing to get the
       *   entire dataset (optional).
       * @param {Data[Key]} [value]
       *   Value to set (optional).
       * @returns {unknown}
       *   The current processor when setting, the value at `key` when getting, or
       *   the entire dataset when getting without key.
       */
      data(key, value) {
        if (typeof key === "string") {
          if (arguments.length === 2) {
            assertUnfrozen("data", this.frozen);
            this.namespace[key] = value;
            return this;
          }
          return own4.call(this.namespace, key) && this.namespace[key] || void 0;
        }
        if (key) {
          assertUnfrozen("data", this.frozen);
          this.namespace = key;
          return this;
        }
        return this.namespace;
      }
      /**
       * Freeze a processor.
       *
       * Frozen processors are meant to be extended and not to be configured
       * directly.
       *
       * When a processor is frozen it cannot be unfrozen.
       * New processors working the same way can be created by calling the
       * processor.
       *
       * It’s possible to freeze processors explicitly by calling `.freeze()`.
       * Processors freeze automatically when `.parse()`, `.run()`, `.runSync()`,
       * `.stringify()`, `.process()`, or `.processSync()` are called.
       *
       * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
       *   The current processor.
       */
      freeze() {
        if (this.frozen) {
          return this;
        }
        const self2 = (
          /** @type {Processor} */
          /** @type {unknown} */
          this
        );
        while (++this.freezeIndex < this.attachers.length) {
          const [attacher, ...options] = this.attachers[this.freezeIndex];
          if (options[0] === false) {
            continue;
          }
          if (options[0] === true) {
            options[0] = void 0;
          }
          const transformer = attacher.call(self2, ...options);
          if (typeof transformer === "function") {
            this.transformers.use(transformer);
          }
        }
        this.frozen = true;
        this.freezeIndex = Number.POSITIVE_INFINITY;
        return this;
      }
      /**
       * Parse text to a syntax tree.
       *
       * > 👉 **Note**: `parse` freezes the processor if not already *frozen*.
       *
       * > 👉 **Note**: `parse` performs the parse phase, not the run phase or other
       * > phases.
       *
       * @param {Compatible | undefined} [file]
       *   file to parse (optional); typically `string` or `VFile`; any value
       *   accepted as `x` in `new VFile(x)`.
       * @returns {ParseTree extends undefined ? Node : ParseTree}
       *   Syntax tree representing `file`.
       */
      parse(file) {
        this.freeze();
        const realFile = vfile(file);
        const parser = this.parser || this.Parser;
        assertParser("parse", parser);
        return parser(String(realFile), realFile);
      }
      /**
       * Process the given file as configured on the processor.
       *
       * > 👉 **Note**: `process` freezes the processor if not already *frozen*.
       *
       * > 👉 **Note**: `process` performs the parse, run, and stringify phases.
       *
       * @overload
       * @param {Compatible | undefined} file
       * @param {ProcessCallback<VFileWithOutput<CompileResult>>} done
       * @returns {undefined}
       *
       * @overload
       * @param {Compatible | undefined} [file]
       * @returns {Promise<VFileWithOutput<CompileResult>>}
       *
       * @param {Compatible | undefined} [file]
       *   File (optional); typically `string` or `VFile`]; any value accepted as
       *   `x` in `new VFile(x)`.
       * @param {ProcessCallback<VFileWithOutput<CompileResult>> | undefined} [done]
       *   Callback (optional).
       * @returns {Promise<VFile> | undefined}
       *   Nothing if `done` is given.
       *   Otherwise a promise, rejected with a fatal error or resolved with the
       *   processed file.
       *
       *   The parsed, transformed, and compiled value is available at
       *   `file.value` (see note).
       *
       *   > 👉 **Note**: unified typically compiles by serializing: most
       *   > compilers return `string` (or `Uint8Array`).
       *   > Some compilers, such as the one configured with
       *   > [`rehype-react`][rehype-react], return other values (in this case, a
       *   > React tree).
       *   > If you’re using a compiler that doesn’t serialize, expect different
       *   > result values.
       *   >
       *   > To register custom results in TypeScript, add them to
       *   > {@link CompileResultMap `CompileResultMap`}.
       *
       *   [rehype-react]: https://github.com/rehypejs/rehype-react
       */
      process(file, done) {
        const self2 = this;
        this.freeze();
        assertParser("process", this.parser || this.Parser);
        assertCompiler("process", this.compiler || this.Compiler);
        return done ? executor(void 0, done) : new Promise(executor);
        function executor(resolve, reject) {
          const realFile = vfile(file);
          const parseTree = (
            /** @type {HeadTree extends undefined ? Node : HeadTree} */
            /** @type {unknown} */
            self2.parse(realFile)
          );
          self2.run(parseTree, realFile, function(error, tree, file2) {
            if (error || !tree || !file2) {
              return realDone(error);
            }
            const compileTree = (
              /** @type {CompileTree extends undefined ? Node : CompileTree} */
              /** @type {unknown} */
              tree
            );
            const compileResult = self2.stringify(compileTree, file2);
            if (looksLikeAValue(compileResult)) {
              file2.value = compileResult;
            } else {
              file2.result = compileResult;
            }
            realDone(
              error,
              /** @type {VFileWithOutput<CompileResult>} */
              file2
            );
          });
          function realDone(error, file2) {
            if (error || !file2) {
              reject(error);
            } else if (resolve) {
              resolve(file2);
            } else {
              done(void 0, file2);
            }
          }
        }
      }
      /**
       * Process the given file as configured on the processor.
       *
       * An error is thrown if asynchronous transforms are configured.
       *
       * > 👉 **Note**: `processSync` freezes the processor if not already *frozen*.
       *
       * > 👉 **Note**: `processSync` performs the parse, run, and stringify phases.
       *
       * @param {Compatible | undefined} [file]
       *   File (optional); typically `string` or `VFile`; any value accepted as
       *   `x` in `new VFile(x)`.
       * @returns {VFileWithOutput<CompileResult>}
       *   The processed file.
       *
       *   The parsed, transformed, and compiled value is available at
       *   `file.value` (see note).
       *
       *   > 👉 **Note**: unified typically compiles by serializing: most
       *   > compilers return `string` (or `Uint8Array`).
       *   > Some compilers, such as the one configured with
       *   > [`rehype-react`][rehype-react], return other values (in this case, a
       *   > React tree).
       *   > If you’re using a compiler that doesn’t serialize, expect different
       *   > result values.
       *   >
       *   > To register custom results in TypeScript, add them to
       *   > {@link CompileResultMap `CompileResultMap`}.
       *
       *   [rehype-react]: https://github.com/rehypejs/rehype-react
       */
      processSync(file) {
        let complete = false;
        let result;
        this.freeze();
        assertParser("processSync", this.parser || this.Parser);
        assertCompiler("processSync", this.compiler || this.Compiler);
        this.process(file, realDone);
        assertDone("processSync", "process", complete);
        return result;
        function realDone(error, file2) {
          complete = true;
          bail(error);
          result = file2;
        }
      }
      /**
       * Run *transformers* on a syntax tree.
       *
       * > 👉 **Note**: `run` freezes the processor if not already *frozen*.
       *
       * > 👉 **Note**: `run` performs the run phase, not other phases.
       *
       * @overload
       * @param {HeadTree extends undefined ? Node : HeadTree} tree
       * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
       * @returns {undefined}
       *
       * @overload
       * @param {HeadTree extends undefined ? Node : HeadTree} tree
       * @param {Compatible | undefined} file
       * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} done
       * @returns {undefined}
       *
       * @overload
       * @param {HeadTree extends undefined ? Node : HeadTree} tree
       * @param {Compatible | undefined} [file]
       * @returns {Promise<TailTree extends undefined ? Node : TailTree>}
       *
       * @param {HeadTree extends undefined ? Node : HeadTree} tree
       *   Tree to transform and inspect.
       * @param {(
       *   RunCallback<TailTree extends undefined ? Node : TailTree> |
       *   Compatible
       * )} [file]
       *   File associated with `node` (optional); any value accepted as `x` in
       *   `new VFile(x)`.
       * @param {RunCallback<TailTree extends undefined ? Node : TailTree>} [done]
       *   Callback (optional).
       * @returns {Promise<TailTree extends undefined ? Node : TailTree> | undefined}
       *   Nothing if `done` is given.
       *   Otherwise, a promise rejected with a fatal error or resolved with the
       *   transformed tree.
       */
      run(tree, file, done) {
        assertNode(tree);
        this.freeze();
        const transformers = this.transformers;
        if (!done && typeof file === "function") {
          done = file;
          file = void 0;
        }
        return done ? executor(void 0, done) : new Promise(executor);
        function executor(resolve, reject) {
          const realFile = vfile(file);
          transformers.run(tree, realFile, realDone);
          function realDone(error, outputTree, file2) {
            const resultingTree = (
              /** @type {TailTree extends undefined ? Node : TailTree} */
              outputTree || tree
            );
            if (error) {
              reject(error);
            } else if (resolve) {
              resolve(resultingTree);
            } else {
              done(void 0, resultingTree, file2);
            }
          }
        }
      }
      /**
       * Run *transformers* on a syntax tree.
       *
       * An error is thrown if asynchronous transforms are configured.
       *
       * > 👉 **Note**: `runSync` freezes the processor if not already *frozen*.
       *
       * > 👉 **Note**: `runSync` performs the run phase, not other phases.
       *
       * @param {HeadTree extends undefined ? Node : HeadTree} tree
       *   Tree to transform and inspect.
       * @param {Compatible | undefined} [file]
       *   File associated with `node` (optional); any value accepted as `x` in
       *   `new VFile(x)`.
       * @returns {TailTree extends undefined ? Node : TailTree}
       *   Transformed tree.
       */
      runSync(tree, file) {
        let complete = false;
        let result;
        this.run(tree, file, realDone);
        assertDone("runSync", "run", complete);
        return result;
        function realDone(error, tree2) {
          bail(error);
          result = tree2;
          complete = true;
        }
      }
      /**
       * Compile a syntax tree.
       *
       * > 👉 **Note**: `stringify` freezes the processor if not already *frozen*.
       *
       * > 👉 **Note**: `stringify` performs the stringify phase, not the run phase
       * > or other phases.
       *
       * @param {CompileTree extends undefined ? Node : CompileTree} tree
       *   Tree to compile.
       * @param {Compatible | undefined} [file]
       *   File associated with `node` (optional); any value accepted as `x` in
       *   `new VFile(x)`.
       * @returns {CompileResult extends undefined ? Value : CompileResult}
       *   Textual representation of the tree (see note).
       *
       *   > 👉 **Note**: unified typically compiles by serializing: most compilers
       *   > return `string` (or `Uint8Array`).
       *   > Some compilers, such as the one configured with
       *   > [`rehype-react`][rehype-react], return other values (in this case, a
       *   > React tree).
       *   > If you’re using a compiler that doesn’t serialize, expect different
       *   > result values.
       *   >
       *   > To register custom results in TypeScript, add them to
       *   > {@link CompileResultMap `CompileResultMap`}.
       *
       *   [rehype-react]: https://github.com/rehypejs/rehype-react
       */
      stringify(tree, file) {
        this.freeze();
        const realFile = vfile(file);
        const compiler2 = this.compiler || this.Compiler;
        assertCompiler("stringify", compiler2);
        assertNode(tree);
        return compiler2(tree, realFile);
      }
      /**
       * Configure the processor to use a plugin, a list of usable values, or a
       * preset.
       *
       * If the processor is already using a plugin, the previous plugin
       * configuration is changed based on the options that are passed in.
       * In other words, the plugin is not added a second time.
       *
       * > 👉 **Note**: `use` cannot be called on *frozen* processors.
       * > Call the processor first to create a new unfrozen processor.
       *
       * @example
       *   There are many ways to pass plugins to `.use()`.
       *   This example gives an overview:
       *
       *   ```js
       *   import {unified} from 'unified'
       *
       *   unified()
       *     // Plugin with options:
       *     .use(pluginA, {x: true, y: true})
       *     // Passing the same plugin again merges configuration (to `{x: true, y: false, z: true}`):
       *     .use(pluginA, {y: false, z: true})
       *     // Plugins:
       *     .use([pluginB, pluginC])
       *     // Two plugins, the second with options:
       *     .use([pluginD, [pluginE, {}]])
       *     // Preset with plugins and settings:
       *     .use({plugins: [pluginF, [pluginG, {}]], settings: {position: false}})
       *     // Settings only:
       *     .use({settings: {position: false}})
       *   ```
       *
       * @template {Array<unknown>} [Parameters=[]]
       * @template {Node | string | undefined} [Input=undefined]
       * @template [Output=Input]
       *
       * @overload
       * @param {Preset | null | undefined} [preset]
       * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
       *
       * @overload
       * @param {PluggableList} list
       * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
       *
       * @overload
       * @param {Plugin<Parameters, Input, Output>} plugin
       * @param {...(Parameters | [boolean])} parameters
       * @returns {UsePlugin<ParseTree, HeadTree, TailTree, CompileTree, CompileResult, Input, Output>}
       *
       * @param {PluggableList | Plugin | Preset | null | undefined} value
       *   Usable value.
       * @param {...unknown} parameters
       *   Parameters, when a plugin is given as a usable value.
       * @returns {Processor<ParseTree, HeadTree, TailTree, CompileTree, CompileResult>}
       *   Current processor.
       */
      use(value, ...parameters) {
        const attachers = this.attachers;
        const namespace = this.namespace;
        assertUnfrozen("use", this.frozen);
        if (value === null || value === void 0) ; else if (typeof value === "function") {
          addPlugin(value, parameters);
        } else if (typeof value === "object") {
          if (Array.isArray(value)) {
            addList(value);
          } else {
            addPreset(value);
          }
        } else {
          throw new TypeError("Expected usable value, not `" + value + "`");
        }
        return this;
        function add(value2) {
          if (typeof value2 === "function") {
            addPlugin(value2, []);
          } else if (typeof value2 === "object") {
            if (Array.isArray(value2)) {
              const [plugin, ...parameters2] = (
                /** @type {PluginTuple<Array<unknown>>} */
                value2
              );
              addPlugin(plugin, parameters2);
            } else {
              addPreset(value2);
            }
          } else {
            throw new TypeError("Expected usable value, not `" + value2 + "`");
          }
        }
        function addPreset(result) {
          if (!("plugins" in result) && !("settings" in result)) {
            throw new Error(
              "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither"
            );
          }
          addList(result.plugins);
          if (result.settings) {
            namespace.settings = {
              ...namespace.settings,
              ...esm_default(result.settings)
            };
          }
        }
        function addList(plugins) {
          let index2 = -1;
          if (plugins === null || plugins === void 0) ; else if (Array.isArray(plugins)) {
            while (++index2 < plugins.length) {
              const thing = plugins[index2];
              add(thing);
            }
          } else {
            throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
          }
        }
        function addPlugin(plugin, parameters2) {
          let index2 = -1;
          let entryIndex = -1;
          while (++index2 < attachers.length) {
            if (attachers[index2][0] === plugin) {
              entryIndex = index2;
              break;
            }
          }
          if (entryIndex === -1) {
            attachers.push([plugin, ...parameters2]);
          } else if (parameters2.length > 0) {
            let [primary, ...rest] = parameters2;
            const currentPrimary = attachers[entryIndex][1];
            if (isPlainObject(currentPrimary) && isPlainObject(primary)) {
              primary = esm_default({ ...currentPrimary, ...primary });
            }
            attachers[entryIndex] = [plugin, primary, ...rest];
          }
        }
      }
    };
    var unified = new Processor().freeze();
    function assertParser(name, value) {
      if (typeof value !== "function") {
        throw new TypeError("Cannot `" + name + "` without `parser`");
      }
    }
    function assertCompiler(name, value) {
      if (typeof value !== "function") {
        throw new TypeError("Cannot `" + name + "` without `compiler`");
      }
    }
    function assertUnfrozen(name, frozen) {
      if (frozen) {
        throw new Error(
          "Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
        );
      }
    }
    function assertNode(node2) {
      if (!isPlainObject(node2) || typeof node2.type !== "string") {
        throw new TypeError("Expected node, got `" + node2 + "`");
      }
    }
    function assertDone(name, asyncName, complete) {
      if (!complete) {
        throw new Error(
          "`" + name + "` finished async. Use `" + asyncName + "` instead"
        );
      }
    }
    function vfile(value) {
      return looksLikeAVFile(value) ? value : new VFile(value);
    }
    function looksLikeAVFile(value) {
      return Boolean(
        value && typeof value === "object" && "message" in value && "messages" in value
      );
    }
    function looksLikeAValue(value) {
      return typeof value === "string" || isUint8Array2(value);
    }
    function isUint8Array2(value) {
      return Boolean(
        value && typeof value === "object" && "byteLength" in value && "byteOffset" in value
      );
    }

    // dist/utils.js
    var nonNullable = (value) => value != null;
    var transform = (node2) => {
      if (node2.type !== "element" || node2.properties === void 0 || !Array.isArray(node2.properties.className))
        return;
      node2.properties.class = node2.properties.className.join(" ");
      delete node2.properties.className;
    };
    var visit2 = (visitor, node2) => {
      visitor(node2);
      node2.children?.forEach((child) => visit2(visitor, child));
    };
    var rehypeReactClassNameToSvelteClass = () => {
      return (node2, _file, done) => {
        try {
          visit2(transform, node2);
          done();
        } catch (e) {
          if (e instanceof Error)
            return done(e);
          return done(new Error(String(e)));
        }
      };
    };
    var createParser = (plugins) => {
      const processor = unified().use(remarkParse).use(plugins.map((plugin) => plugin.remarkPlugin).filter(nonNullable)).use(remarkRehype, { allowDangerousHtml: true }).use(plugins.map((plugin) => plugin.rehypePlugin).filter(nonNullable)).use(rehypeReactClassNameToSvelteClass);
      return (md) => processor.runSync(processor.parse(md), md);
    };
    var resolveComponent = (map, tagName, circularCheck = []) => {
      if (circularCheck.includes(tagName)) {
        circularCheck.push(tagName);
        throw new Error(`Circular dependency detected: ${circularCheck.join(" -> ")}`);
      }
      const component = map[tagName];
      if (typeof component === "string") {
        return resolveComponent(map, component, [...circularCheck, tagName]);
      }
      if (component === null)
        return null;
      if (component === void 0)
        return tagName;
      return component;
    };
    var svgTags = [
      /* 'a',  */
      "animate",
      "animateMotion",
      "animateTransform",
      "circle",
      "clipPath",
      "defs",
      "desc",
      "ellipse",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feDropShadow",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "filter",
      "foreignObject",
      "g",
      "hatch",
      "hatchpath",
      /* 'image', */
      "line",
      "linearGradient",
      "marker",
      "mask",
      "metadata",
      "mpath",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "radialGradient",
      "rect",
      /* 'script',  */
      "set",
      "stop",
      /* 'style',  */
      "svg",
      "switch",
      "symbol",
      "text",
      "textPath",
      /* 'title',  */
      "tspan",
      "use",
      "view"
    ];

    /* node_modules/svelte-exmarkdown/dist/Renderer.svelte generated by Svelte v3.49.0 */
    const file$1 = "node_modules/svelte-exmarkdown/dist/Renderer.svelte";

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_if_ctx(ctx) {
    	const child_ctx = ctx.slice();
    	const constants_0 = resolveComponent(/*$components*/ child_ctx[1], /*astNode*/ child_ctx[0].tagName);
    	child_ctx[8] = constants_0;
    	return child_ctx;
    }

    // (50:75) 
    function create_if_block_8(ctx) {
    	let t_value = /*astNode*/ ctx[0].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text$1(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*astNode*/ 1 && t_value !== (t_value = /*astNode*/ ctx[0].value + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(50:75) ",
    		ctx
    	});

    	return block;
    }

    // (19:48) 
    function create_if_block_1$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_if_block_6$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (typeof /*component*/ ctx[8] === 'string') return 0;
    		if (/*component*/ ctx[8] !== null) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(19:48) ",
    		ctx
    	});

    	return block;
    }

    // (17:0) {#if astNode.type === 'root'}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*astNode*/ ctx[0].children;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*astNode*/ 1) {
    				each_value = /*astNode*/ ctx[0].children;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(17:0) {#if astNode.type === 'root'}",
    		ctx
    	});

    	return block;
    }

    // (41:39) 
    function create_if_block_6$1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_7, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_4(ctx, dirty) {
    		if (dirty & /*astNode*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(Array.isArray(/*astNode*/ ctx[0].children) && /*astNode*/ ctx[0].children.length !== 0);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_4(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_4(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(41:39) ",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#if typeof component === 'string'}
    function create_if_block_2$1(ctx) {
    	let show_if;
    	let show_if_1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_3$1, create_if_block_5$1, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (dirty & /*$components, astNode*/ 3) show_if = null;
    		if (dirty & /*astNode*/ 1) show_if_1 = null;
    		if (show_if == null) show_if = !!/*svgTags*/ ctx[2].includes(/*component*/ ctx[8]);
    		if (show_if) return 0;
    		if (show_if_1 == null) show_if_1 = !!(Array.isArray(/*astNode*/ ctx[0].children) && /*astNode*/ ctx[0].children.length !== 0);
    		if (show_if_1) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(23:4) {#if typeof component === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {:else}
    function create_else_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*astNode*/ ctx[0].properties];
    	var switch_value = /*component*/ ctx[8];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*astNode*/ 1)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*astNode*/ ctx[0].properties)])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[8])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(47:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:39) {#if Array.isArray(astNode.children) && astNode.children.length !== 0}
    function create_if_block_7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*astNode*/ ctx[0].properties];
    	var switch_value = /*component*/ ctx[8];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_1$1] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*astNode*/ 1)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*astNode*/ ctx[0].properties)])
    			: {};

    			if (dirty & /*$$scope, astNode*/ 131073) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[8])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(41:39) {#if Array.isArray(astNode.children) && astNode.children.length !== 0}",
    		ctx
    	});

    	return block;
    }

    // (44:5) {#each astNode.children as child}
    function create_each_block_4(ctx) {
    	let renderer;
    	let current;

    	renderer = new Renderer({
    			props: { astNode: /*child*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(renderer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(renderer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const renderer_changes = {};
    			if (dirty & /*astNode*/ 1) renderer_changes.astNode = /*child*/ ctx[5];
    			renderer.$set(renderer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(renderer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(renderer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(renderer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(44:5) {#each astNode.children as child}",
    		ctx
    	});

    	return block;
    }

    // (41:109) <svelte:component     this={component}     {...astNode.properties}     >
    function create_default_slot_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_4 = /*astNode*/ ctx[0].children;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*astNode*/ 1) {
    				each_value_4 = /*astNode*/ ctx[0].children;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(41:109) <svelte:component     this={component}     {...astNode.properties}     >",
    		ctx
    	});

    	return block;
    }

    // (38:4) {:else}
    function create_else_block_1$1(ctx) {
    	let previous_tag = /*component*/ ctx[8];
    	let svelte_element_anchor;
    	validate_dynamic_element(/*component*/ ctx[8]);
    	let svelte_element = /*component*/ ctx[8] && create_dynamic_element_1(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*component*/ ctx[8]) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element_1(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*component*/ ctx[8])) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*component*/ ctx[8]);
    					svelte_element = create_dynamic_element_1(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*component*/ ctx[8];
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(38:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:86) 
    function create_if_block_5$1(ctx) {
    	let previous_tag = /*component*/ ctx[8];
    	let svelte_element_anchor;
    	validate_dynamic_element(/*component*/ ctx[8]);
    	validate_void_dynamic_element(/*component*/ ctx[8]);
    	let svelte_element = /*component*/ ctx[8] && create_dynamic_element(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*component*/ ctx[8]) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*component*/ ctx[8])) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*component*/ ctx[8]);
    					validate_void_dynamic_element(/*component*/ ctx[8]);
    					svelte_element = create_dynamic_element(ctx);
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    			}

    			previous_tag = /*component*/ ctx[8];
    		},
    		i: noop,
    		o: function outro(local) {
    			transition_out(svelte_element);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(32:86) ",
    		ctx
    	});

    	return block;
    }

    // (23:39) {#if svgTags.includes(component)}
    function create_if_block_3$1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (dirty & /*astNode*/ 1) show_if = null;
    		if (show_if == null) show_if = !!(Array.isArray(/*astNode*/ ctx[0].children) && /*astNode*/ ctx[0].children.length !== 0);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(23:39) {#if svgTags.includes(component)}",
    		ctx
    	});

    	return block;
    }

    // (38:11) <svelte:element     this={component}     {...astNode.properties}    />
    function create_dynamic_element_1(ctx) {
    	let svelte_element;
    	let svelte_element_levels = [/*astNode*/ ctx[0].properties];
    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*component*/ ctx[8]);
    			set_attributes(svelte_element, svelte_element_data);
    			add_location(svelte_element, file$1, 37, 11, 1290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*astNode*/ 1 && /*astNode*/ ctx[0].properties]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element_1.name,
    		type: "child_dynamic_element",
    		source: "(38:11) <svelte:element     this={component}     {...astNode.properties}    />",
    		ctx
    	});

    	return block;
    }

    // (35:5) {#each astNode.children as child}
    function create_each_block_2(ctx) {
    	let renderer;
    	let current;

    	renderer = new Renderer({
    			props: { astNode: /*child*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(renderer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(renderer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const renderer_changes = {};
    			if (dirty & /*astNode*/ 1) renderer_changes.astNode = /*child*/ ctx[5];
    			renderer.$set(renderer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(renderer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(renderer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(renderer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(35:5) {#each astNode.children as child}",
    		ctx
    	});

    	return block;
    }

    // (32:86) <svelte:element     this={component}     {...astNode.properties}     >
    function create_dynamic_element(ctx) {
    	let svelte_element;
    	let current;
    	let each_value_2 = /*astNode*/ ctx[0].children;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let svelte_element_levels = [/*astNode*/ ctx[0].properties];
    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*component*/ ctx[8]);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(svelte_element, svelte_element_data);
    			add_location(svelte_element, file$1, 31, 86, 1110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svelte_element, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*astNode*/ 1) {
    				each_value_2 = /*astNode*/ ctx[0].children;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(svelte_element, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			set_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*astNode*/ 1 && /*astNode*/ ctx[0].properties]));
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element.name,
    		type: "child_dynamic_element",
    		source: "(32:86) <svelte:element     this={component}     {...astNode.properties}     >",
    		ctx
    	});

    	return block;
    }

    // (29:5) {:else}
    function create_else_block$1(ctx) {
    	let svgelement;
    	let current;
    	const svgelement_spread_levels = [{ __tag: /*component*/ ctx[8] }, /*astNode*/ ctx[0].properties];
    	let svgelement_props = {};

    	for (let i = 0; i < svgelement_spread_levels.length; i += 1) {
    		svgelement_props = assign(svgelement_props, svgelement_spread_levels[i]);
    	}

    	svgelement = new SVGElement({ props: svgelement_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(svgelement.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svgelement, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svgelement_changes = (dirty & /*resolveComponent, $components, astNode*/ 3)
    			? get_spread_update(svgelement_spread_levels, [
    					{ __tag: /*component*/ ctx[8] },
    					dirty & /*astNode*/ 1 && get_spread_object(/*astNode*/ ctx[0].properties)
    				])
    			: {};

    			svgelement.$set(svgelement_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svgelement.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svgelement.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svgelement, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(29:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:72) {#if Array.isArray(astNode.children) && astNode.children.length !== 0}
    function create_if_block_4$1(ctx) {
    	let svgelement;
    	let current;
    	const svgelement_spread_levels = [{ __tag: /*component*/ ctx[8] }, /*astNode*/ ctx[0].properties];

    	let svgelement_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < svgelement_spread_levels.length; i += 1) {
    		svgelement_props = assign(svgelement_props, svgelement_spread_levels[i]);
    	}

    	svgelement = new SVGElement({ props: svgelement_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(svgelement.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svgelement, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svgelement_changes = (dirty & /*resolveComponent, $components, astNode*/ 3)
    			? get_spread_update(svgelement_spread_levels, [
    					{ __tag: /*component*/ ctx[8] },
    					dirty & /*astNode*/ 1 && get_spread_object(/*astNode*/ ctx[0].properties)
    				])
    			: {};

    			if (dirty & /*$$scope, astNode*/ 131073) {
    				svgelement_changes.$$scope = { dirty, ctx };
    			}

    			svgelement.$set(svgelement_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svgelement.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svgelement.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svgelement, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(23:72) {#if Array.isArray(astNode.children) && astNode.children.length !== 0}",
    		ctx
    	});

    	return block;
    }

    // (26:6) {#each astNode.children as child}
    function create_each_block_1(ctx) {
    	let renderer;
    	let current;

    	renderer = new Renderer({
    			props: { astNode: /*child*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(renderer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(renderer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const renderer_changes = {};
    			if (dirty & /*astNode*/ 1) renderer_changes.astNode = /*child*/ ctx[5];
    			renderer.$set(renderer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(renderer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(renderer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(renderer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(26:6) {#each astNode.children as child}",
    		ctx
    	});

    	return block;
    }

    // (23:142) <SVGElement      __tag={component}      {...astNode.properties}      >
    function create_default_slot$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*astNode*/ ctx[0].children;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*astNode*/ 1) {
    				each_value_1 = /*astNode*/ ctx[0].children;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(23:142) <SVGElement      __tag={component}      {...astNode.properties}      >",
    		ctx
    	});

    	return block;
    }

    // (17:29) {#each astNode.children as child}
    function create_each_block$1(ctx) {
    	let renderer;
    	let current;

    	renderer = new Renderer({
    			props: { astNode: /*child*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(renderer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(renderer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const renderer_changes = {};
    			if (dirty & /*astNode*/ 1) renderer_changes.astNode = /*child*/ ctx[5];
    			renderer.$set(renderer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(renderer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(renderer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(renderer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(17:29) {#each astNode.children as child}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_if_block_8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*astNode*/ ctx[0].type === 'root') return 0;
    		if (/*astNode*/ ctx[0].type === 'element') return 1;
    		if (/*astNode*/ ctx[0].type === 'text' || /*astNode*/ ctx[0].type === 'raw') return 2;
    		return -1;
    	}

    	function select_block_ctx(ctx, index) {
    		if (index === 1) return get_if_ctx(ctx);
    		return ctx;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](select_block_ctx(ctx, current_block_type_index));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(select_block_ctx(ctx, current_block_type_index), dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](select_block_ctx(ctx, current_block_type_index));
    						if_block.c();
    					} else {
    						if_block.p(select_block_ctx(ctx, current_block_type_index), dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $components;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Renderer', slots, []);
    	let { astNode } = $$props;
    	const svgTags$1 = svgTags;
    	const components = getComponentsMap();
    	validate_store(components, 'components');
    	component_subscribe($$self, components, value => $$invalidate(1, $components = value));
    	const astContext = createAstContextValue(astNode);
    	setAstContext(astContext);
    	const writable_props = ['astNode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Renderer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('astNode' in $$props) $$invalidate(0, astNode = $$props.astNode);
    	};

    	$$self.$capture_state = () => ({
    		SVGElement,
    		createAstContextValue,
    		getComponentsMap,
    		setAstContext,
    		resolveComponent,
    		typedSvgTags: svgTags,
    		astNode,
    		svgTags: svgTags$1,
    		components,
    		astContext,
    		$components
    	});

    	$$self.$inject_state = $$props => {
    		if ('astNode' in $$props) $$invalidate(0, astNode = $$props.astNode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*astNode*/ 1) {
    			astContext.set(astNode);
    		}
    	};

    	return [astNode, $components, svgTags$1, components];
    }

    class Renderer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { astNode: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Renderer",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*astNode*/ ctx[0] === undefined && !('astNode' in props)) {
    			console.warn("<Renderer> was created without expected prop 'astNode'");
    		}
    	}

    	get astNode() {
    		throw new Error("<Renderer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set astNode(value) {
    		throw new Error("<Renderer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-exmarkdown/dist/Markdown.svelte generated by Svelte v3.49.0 */

    function create_fragment$1(ctx) {
    	let renderer;
    	let current;

    	renderer = new Renderer({
    			props: { astNode: /*result*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(renderer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(renderer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const renderer_changes = {};
    			if (dirty & /*result*/ 1) renderer_changes.astNode = /*result*/ ctx[0];
    			renderer.$set(renderer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(renderer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(renderer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(renderer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Markdown', slots, []);
    	let { md } = $$props;
    	let { plugins = [] } = $$props;
    	let parse;
    	const componentsContextValue = createComponentsContextValue({});
    	setComponentsContext(componentsContextValue);
    	let result;
    	const writable_props = ['md', 'plugins'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Markdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('md' in $$props) $$invalidate(1, md = $$props.md);
    		if ('plugins' in $$props) $$invalidate(2, plugins = $$props.plugins);
    	};

    	$$self.$capture_state = () => ({
    		createComponentsContextValue,
    		setComponentsContext,
    		Renderer,
    		createParser,
    		nonNullable,
    		md,
    		plugins,
    		parse,
    		componentsContextValue,
    		result
    	});

    	$$self.$inject_state = $$props => {
    		if ('md' in $$props) $$invalidate(1, md = $$props.md);
    		if ('plugins' in $$props) $$invalidate(2, plugins = $$props.plugins);
    		if ('parse' in $$props) $$invalidate(3, parse = $$props.parse);
    		if ('result' in $$props) $$invalidate(0, result = $$props.result);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*plugins*/ 4) {
    			$$invalidate(3, parse = createParser(plugins));
    		}

    		if ($$self.$$.dirty & /*plugins*/ 4) {
    			componentsContextValue.set({
    				...plugins.map(plugin => plugin.renderer).filter(nonNullable).reduce((acc, cur) => ({ ...acc, ...cur }), {})
    			});
    		}

    		if ($$self.$$.dirty & /*parse, md*/ 10) {
    			$$invalidate(0, result = parse(md));
    		}
    	};

    	return [result, md, plugins, parse];
    }

    class Markdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { md: 1, plugins: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Markdown",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*md*/ ctx[1] === undefined && !('md' in props)) {
    			console.warn("<Markdown> was created without expected prop 'md'");
    		}
    	}

    	get md() {
    		throw new Error("<Markdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Markdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plugins() {
    		throw new Error("<Markdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plugins(value) {
    		throw new Error("<Markdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[98] = list[i];
    	child_ctx[2] = i;
    	return child_ctx;
    }

    // (1445:2) <Label>
    function create_default_slot_2(ctx) {
    	let span;
    	let t_value = /*tab*/ ctx[100] + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text$1(t_value);

    			attr_dev(span, "class", span_class_value = "" + (null_to_empty(/*tab*/ ctx[100] === /*active*/ ctx[1]
    			? "active-tab"
    			: "plain-tab") + " svelte-1kt20zm"));

    			add_location(span, file, 1444, 9, 29425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[3] & /*tab*/ 128 && t_value !== (t_value = /*tab*/ ctx[100] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*active*/ 2 | dirty[3] & /*tab*/ 128 && span_class_value !== (span_class_value = "" + (null_to_empty(/*tab*/ ctx[100] === /*active*/ ctx[1]
    			? "active-tab"
    			: "plain-tab") + " svelte-1kt20zm"))) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(1445:2) <Label>",
    		ctx
    	});

    	return block;
    }

    // (1444:3) <Tab {tab}>
    function create_default_slot_1(ctx) {
    	let label;
    	let current;

    	label = new CommonLabel({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[0] & /*active*/ 2 | dirty[3] & /*$$scope, tab*/ 384) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(1444:3) <Tab {tab}>",
    		ctx
    	});

    	return block;
    }

    // (1442:1) <TabBar tabs={['Overview', 'stdout', 'Ops']} let:tab bind:active>
    function create_default_slot(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				tab: /*tab*/ ctx[100],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_changes = {};
    			if (dirty[3] & /*tab*/ 128) tab_changes.tab = /*tab*/ ctx[100];

    			if (dirty[0] & /*active*/ 2 | dirty[3] & /*$$scope, tab*/ 384) {
    				tab_changes.$$scope = { dirty, ctx };
    			}

    			tab.$set(tab_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1442:1) <TabBar tabs={['Overview', 'stdout', 'Ops']} let:tab bind:active>",
    		ctx
    	});

    	return block;
    }

    // (1524:36) 
    function create_if_block_6(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let table;
    	let tr;
    	let td0;
    	let textarea;
    	let t2;
    	let td1;
    	let markdown;
    	let current;
    	let mounted;
    	let dispose;

    	markdown = new Markdown({
    			props: { md: /*md*/ ctx[21] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Edit Markdown";
    			t1 = space$1();
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			textarea = element("textarea");
    			t2 = space$1();
    			td1 = element("td");
    			create_component(markdown.$$.fragment);
    			attr_dev(h1, "class", "svelte-1kt20zm");
    			add_location(h1, file, 1525, 2, 32476);
    			set_style(textarea, "width", "90%");
    			attr_dev(textarea, "class", "svelte-1kt20zm");
    			add_location(textarea, file, 1529, 5, 32605);
    			set_style(td0, "width", "50%");
    			set_style(td0, "text-align", "left");
    			set_style(td0, "vertical-align", "top");
    			attr_dev(td0, "class", "svelte-1kt20zm");
    			add_location(td0, file, 1528, 4, 32541);
    			set_style(td1, "width", "50%");
    			set_style(td1, "text-align", "left");
    			set_style(td1, "vertical-align", "top");
    			attr_dev(td1, "class", "svelte-1kt20zm");
    			add_location(td1, file, 1531, 4, 32666);
    			attr_dev(tr, "class", "svelte-1kt20zm");
    			add_location(tr, file, 1527, 3, 32532);
    			set_style(table, "width", "100%");
    			attr_dev(table, "class", "svelte-1kt20zm");
    			add_location(table, file, 1526, 2, 32501);
    			set_style(div, "vertical-align", "top");
    			attr_dev(div, "class", "svelte-1kt20zm");
    			add_location(div, file, 1524, 1, 32440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(td0, textarea);
    			set_input_value(textarea, /*md*/ ctx[21]);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			mount_component(markdown, td1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[60]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*md*/ 2097152) {
    				set_input_value(textarea, /*md*/ ctx[21]);
    			}

    			const markdown_changes = {};
    			if (dirty[0] & /*md*/ 2097152) markdown_changes.md = /*md*/ ctx[21];
    			markdown.$set(markdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(markdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(markdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(markdown);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(1524:36) ",
    		ctx
    	});

    	return block;
    }

    // (1520:33) 
    function create_if_block_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Look at particular files here";
    			attr_dev(div, "class", "svelte-1kt20zm");
    			add_location(div, file, 1520, 1, 32356);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(1520:33) ",
    		ctx
    	});

    	return block;
    }

    // (1492:32) 
    function create_if_block_3(ctx) {
    	let div4;
    	let div1;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let t3;
    	let div0;
    	let t4;
    	let button0;
    	let t6;
    	let div2;
    	let button1;
    	let t8;
    	let button2;
    	let t10;
    	let button3;
    	let t12;
    	let button4;
    	let t14;
    	let button5;
    	let t16;
    	let button6;
    	let t18;
    	let div3;
    	let jsonview;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*password_view_type*/ ctx[8]) return create_if_block_4;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	jsonview = new JsonView({
    			props: { json: /*active_proc_data*/ ctx[20] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t0 = text$1(/*active_proc_name*/ ctx[10]);
    			t1 = space$1();
    			span1 = element("span");
    			t2 = text$1(/*running_state*/ ctx[12]);
    			t3 = space$1();
    			div0 = element("div");
    			if_block.c();
    			t4 = space$1();
    			button0 = element("button");
    			button0.textContent = "👁";
    			t6 = space$1();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "run";
    			t8 = space$1();
    			button2 = element("button");
    			button2.textContent = "stop";
    			t10 = space$1();
    			button3 = element("button");
    			button3.textContent = "restart";
    			t12 = text$1("\n\t\t\t◬\n\t\t\t");
    			button4 = element("button");
    			button4.textContent = "update";
    			t14 = space$1();
    			button5 = element("button");
    			button5.textContent = "remove";
    			t16 = space$1();
    			button6 = element("button");
    			button6.textContent = "config";
    			t18 = space$1();
    			div3 = element("div");
    			create_component(jsonview.$$.fragment);
    			set_style(span0, "font-size", "larger");
    			attr_dev(span0, "class", "svelte-1kt20zm");
    			add_location(span0, file, 1494, 3, 31312);
    			set_style(span1, "font-size", "larger");
    			set_style(span1, "color", /*running_color*/ ctx[11]);
    			attr_dev(span1, "class", "svelte-1kt20zm");
    			add_location(span1, file, 1495, 3, 31372);
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "text-align", "left");
    			attr_dev(div0, "class", "svelte-1kt20zm");
    			add_location(div0, file, 1497, 3, 31452);
    			set_style(button0, "font-size", "larger");
    			attr_dev(button0, "class", "svelte-1kt20zm");
    			add_location(button0, file, 1504, 3, 31800);
    			attr_dev(div1, "class", "svelte-1kt20zm");
    			add_location(div1, file, 1493, 2, 31303);
    			attr_dev(button1, "class", "svelte-1kt20zm");
    			add_location(button1, file, 1507, 3, 31923);
    			attr_dev(button2, "class", "svelte-1kt20zm");
    			add_location(button2, file, 1508, 3, 31967);
    			attr_dev(button3, "class", "svelte-1kt20zm");
    			add_location(button3, file, 1509, 3, 32013);
    			attr_dev(button4, "class", "svelte-1kt20zm");
    			add_location(button4, file, 1511, 3, 32077);
    			attr_dev(button5, "class", "svelte-1kt20zm");
    			add_location(button5, file, 1512, 3, 32128);
    			attr_dev(button6, "class", "svelte-1kt20zm");
    			add_location(button6, file, 1513, 3, 32179);
    			attr_dev(div2, "class", "inner_div svelte-1kt20zm");
    			add_location(div2, file, 1506, 2, 31896);
    			attr_dev(div3, "class", "inner_div svelte-1kt20zm");
    			add_location(div3, file, 1515, 2, 32241);
    			attr_dev(div4, "class", "nice_message svelte-1kt20zm");
    			add_location(div4, file, 1492, 1, 31274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t0);
    			append_dev(div1, t1);
    			append_dev(div1, span1);
    			append_dev(span1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    			append_dev(div1, t4);
    			append_dev(div1, button0);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div2, button1);
    			append_dev(div2, t8);
    			append_dev(div2, button2);
    			append_dev(div2, t10);
    			append_dev(div2, button3);
    			append_dev(div2, t12);
    			append_dev(div2, button4);
    			append_dev(div2, t14);
    			append_dev(div2, button5);
    			append_dev(div2, t16);
    			append_dev(div2, button6);
    			append_dev(div4, t18);
    			append_dev(div4, div3);
    			mount_component(jsonview, div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*toggle_password_view*/ ctx[45], false, false, false),
    					listen_dev(button1, "click", /*run_proc*/ ctx[34], false, false, false),
    					listen_dev(button2, "click", /*stop_proc*/ ctx[35], false, false, false),
    					listen_dev(button3, "click", /*restart_proc*/ ctx[33], false, false, false),
    					listen_dev(button4, "click", /*update_entry*/ ctx[40], false, false, false),
    					listen_dev(button5, "click", /*remove_entry*/ ctx[37], false, false, false),
    					listen_dev(button6, "click", /*edit_app_config*/ ctx[41], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*active_proc_name*/ 1024) set_data_dev(t0, /*active_proc_name*/ ctx[10]);
    			if (!current || dirty[0] & /*running_state*/ 4096) set_data_dev(t2, /*running_state*/ ctx[12]);

    			if (!current || dirty[0] & /*running_color*/ 2048) {
    				set_style(span1, "color", /*running_color*/ ctx[11]);
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			const jsonview_changes = {};
    			if (dirty[0] & /*active_proc_data*/ 1048576) jsonview_changes.json = /*active_proc_data*/ ctx[20];
    			jsonview.$set(jsonview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jsonview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jsonview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block.d();
    			destroy_component(jsonview);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(1492:32) ",
    		ctx
    	});

    	return block;
    }

    // (1488:33) 
    function create_if_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "nice_message svelte-1kt20zm");
    			set_style(div, "max-height", "500px");
    			set_style(div, "overflow", "auto");
    			set_style(div, "border", "solid 1px black");
    			add_location(div, file, 1488, 1, 31116);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*console_output*/ ctx[9];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*console_output*/ 512) div.innerHTML = /*console_output*/ ctx[9];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(1488:33) ",
    		ctx
    	});

    	return block;
    }

    // (1450:1) {#if (active === 'Overview')}
    function create_if_block(ctx) {
    	let div7;
    	let div0;
    	let t2;
    	let div5;
    	let div3;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let button2;
    	let t8;
    	let button3;
    	let t10;
    	let div1;
    	let t11;
    	let button4;
    	let t13;
    	let div2;
    	let button5;
    	let t15;
    	let div4;
    	let b;
    	let t17;
    	let button6;
    	let t19;
    	let button7;
    	let t21;
    	let div6;
    	let select;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*password_view_type*/ ctx[8]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);
    	let each_value = /*known_procs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			div0.textContent = `Overview of your processes running on instance :: ${/*todays_date*/ ctx[22]}`;
    			t2 = space$1();
    			div5 = element("div");
    			div3 = element("div");
    			button0 = element("button");
    			button0.textContent = "reload";
    			t4 = space$1();
    			button1 = element("button");
    			button1.textContent = "add";
    			t6 = space$1();
    			button2 = element("button");
    			button2.textContent = "remove";
    			t8 = text$1("\n\t\t\t\t◬\n\t\t\t\t");
    			button3 = element("button");
    			button3.textContent = "exec";
    			t10 = space$1();
    			div1 = element("div");
    			if_block.c();
    			t11 = space$1();
    			button4 = element("button");
    			button4.textContent = "👁";
    			t13 = space$1();
    			div2 = element("div");
    			button5 = element("button");
    			button5.textContent = "shutdown";
    			t15 = space$1();
    			div4 = element("div");
    			b = element("b");
    			b.textContent = "npm modules:";
    			t17 = text$1("  \n\t\t\t\t");
    			button6 = element("button");
    			button6.textContent = "install";
    			t19 = space$1();
    			button7 = element("button");
    			button7.textContent = "uninstall";
    			t21 = space$1();
    			div6 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "front-page-explain svelte-1kt20zm");
    			add_location(div0, file, 1451, 2, 29630);
    			attr_dev(button0, "class", "svelte-1kt20zm");
    			add_location(button0, file, 1456, 4, 29799);
    			attr_dev(button1, "class", "svelte-1kt20zm");
    			add_location(button1, file, 1457, 4, 29849);
    			attr_dev(button2, "class", "svelte-1kt20zm");
    			add_location(button2, file, 1458, 4, 29895);
    			attr_dev(button3, "class", "svelte-1kt20zm");
    			add_location(button3, file, 1460, 4, 29960);
    			set_style(div1, "display", "inline-block");
    			set_style(div1, "text-align", "left");
    			attr_dev(div1, "class", "svelte-1kt20zm");
    			add_location(div1, file, 1461, 4, 30009);
    			set_style(button4, "font-size", "larger");
    			attr_dev(button4, "class", "svelte-1kt20zm");
    			add_location(button4, file, 1468, 4, 30360);
    			attr_dev(button5, "class", "svelte-1kt20zm");
    			add_location(button5, file, 1470, 5, 30516);
    			set_style(div2, "display", "inline-block");
    			set_style(div2, "text-align", "right");
    			set_style(div2, "width", "30%");
    			attr_dev(div2, "class", "svelte-1kt20zm");
    			add_location(div2, file, 1469, 4, 30449);
    			attr_dev(div3, "class", "inner_div svelte-1kt20zm");
    			add_location(div3, file, 1455, 3, 29771);
    			attr_dev(b, "class", "svelte-1kt20zm");
    			add_location(b, file, 1474, 4, 30613);
    			attr_dev(button6, "class", "svelte-1kt20zm");
    			add_location(button6, file, 1475, 4, 30649);
    			attr_dev(button7, "class", "svelte-1kt20zm");
    			add_location(button7, file, 1476, 4, 30701);
    			attr_dev(div4, "class", "inner_div svelte-1kt20zm");
    			add_location(div4, file, 1473, 3, 30585);
    			attr_dev(div5, "class", "nice_message svelte-1kt20zm");
    			add_location(div5, file, 1454, 2, 29741);
    			attr_dev(select, "size", 10);
    			set_style(select, "text-align", "center");
    			attr_dev(select, "class", "svelte-1kt20zm");
    			if (/*u_index*/ ctx[2] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[57].call(select));
    			add_location(select, file, 1480, 3, 30780);
    			attr_dev(div6, "class", "svelte-1kt20zm");
    			add_location(div6, file, 1479, 2, 30771);
    			attr_dev(div7, "class", "splash-if-you-will svelte-1kt20zm");
    			set_style(div7, "height", "fit-content");
    			add_location(div7, file, 1450, 1, 29567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div7, t2);
    			append_dev(div7, div5);
    			append_dev(div5, div3);
    			append_dev(div3, button0);
    			append_dev(div3, t4);
    			append_dev(div3, button1);
    			append_dev(div3, t6);
    			append_dev(div3, button2);
    			append_dev(div3, t8);
    			append_dev(div3, button3);
    			append_dev(div3, t10);
    			append_dev(div3, div1);
    			if_block.m(div1, null);
    			append_dev(div3, t11);
    			append_dev(div3, button4);
    			append_dev(div3, t13);
    			append_dev(div3, div2);
    			append_dev(div2, button5);
    			append_dev(div5, t15);
    			append_dev(div5, div4);
    			append_dev(div4, b);
    			append_dev(div4, t17);
    			append_dev(div4, button6);
    			append_dev(div4, t19);
    			append_dev(div4, button7);
    			append_dev(div7, t21);
    			append_dev(div7, div6);
    			append_dev(div6, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*u_index*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*reload_all*/ ctx[38], false, false, false),
    					listen_dev(button1, "click", /*add_entry*/ ctx[39], false, false, false),
    					listen_dev(button2, "click", /*remove_entry*/ ctx[37], false, false, false),
    					listen_dev(button3, "click", /*run_command*/ ctx[42], false, false, false),
    					listen_dev(button4, "click", /*toggle_password_view*/ ctx[45], false, false, false),
    					listen_dev(button5, "click", /*stopall*/ ctx[36], false, false, false),
    					listen_dev(button6, "click", /*npm_install*/ ctx[43], false, false, false),
    					listen_dev(button7, "click", /*npm_remove*/ ctx[44], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[57]),
    					listen_dev(select, "click", navigate_to_proc, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if (dirty[0] & /*known_procs*/ 1) {
    				each_value = /*known_procs*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*u_index*/ 4) {
    				select_option(select, /*u_index*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(1450:1) {#if (active === 'Overview')}",
    		ctx
    	});

    	return block;
    }

    // (1501:4) {:else}
    function create_else_block_1(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			attr_dev(label, "class", "svelte-1kt20zm");
    			add_location(label, file, 1501, 4, 31667);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "admin-pass-2");
    			attr_dev(input, "class", "svelte-1kt20zm");
    			add_location(input, file, 1501, 50, 31713);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[13]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_3*/ ctx[59]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*admin_pass*/ 8192 && input.value !== /*admin_pass*/ ctx[13]) {
    				set_input_value(input, /*admin_pass*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(1501:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1499:4) {#if password_view_type }
    function create_if_block_4(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			attr_dev(label, "class", "svelte-1kt20zm");
    			add_location(label, file, 1499, 4, 31537);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "id", "admin-pass-2");
    			attr_dev(input, "class", "svelte-1kt20zm");
    			add_location(input, file, 1499, 50, 31583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[13]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_2*/ ctx[58]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*admin_pass*/ 8192 && input.value !== /*admin_pass*/ ctx[13]) {
    				set_input_value(input, /*admin_pass*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(1499:4) {#if password_view_type }",
    		ctx
    	});

    	return block;
    }

    // (1465:5) {:else}
    function create_else_block(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			attr_dev(label, "class", "svelte-1kt20zm");
    			add_location(label, file, 1465, 5, 30226);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "admin-pass");
    			attr_dev(input, "class", "svelte-1kt20zm");
    			add_location(input, file, 1465, 51, 30272);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[13]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler_1*/ ctx[56]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*admin_pass*/ 8192 && input.value !== /*admin_pass*/ ctx[13]) {
    				set_input_value(input, /*admin_pass*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(1465:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (1463:5) {#if password_view_type }
    function create_if_block_1(ctx) {
    	let label;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Admin Password";
    			input = element("input");
    			attr_dev(label, "for", "admin-pass");
    			attr_dev(label, "class", "svelte-1kt20zm");
    			add_location(label, file, 1463, 5, 30096);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "id", "admin-pass");
    			attr_dev(input, "class", "svelte-1kt20zm");
    			add_location(input, file, 1463, 51, 30142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*admin_pass*/ ctx[13]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[55]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*admin_pass*/ 8192 && input.value !== /*admin_pass*/ ctx[13]) {
    				set_input_value(input, /*admin_pass*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1463:5) {#if password_view_type }",
    		ctx
    	});

    	return block;
    }

    // (1482:4) {#each known_procs as maybe_proc, u_index }
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*maybe_proc*/ ctx[98].proc_name + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text$1(t_value);
    			option.__value = /*u_index*/ ctx[2];
    			option.value = option.__value;
    			set_style(option, "color", /*maybe_proc*/ ctx[98].running ? 'green' : 'red');
    			attr_dev(option, "class", "svelte-1kt20zm");
    			add_location(option, file, 1482, 5, 30929);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*known_procs*/ 1 && t_value !== (t_value = /*maybe_proc*/ ctx[98].proc_name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*known_procs*/ 1) {
    				set_style(option, "color", /*maybe_proc*/ ctx[98].running ? 'green' : 'red');
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(1482:4) {#each known_procs as maybe_proc, u_index }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div0;
    	let tabbar;
    	let updating_active;
    	let t0;
    	let br;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let div1;
    	let makeentrydialog0;
    	let updating_admin_pass;
    	let t3;
    	let div2;
    	let editconfdialog;
    	let updating_conf_dialog_data;
    	let updating_admin_pass_1;
    	let t4;
    	let div3;
    	let execdialog;
    	let updating_exec_dialog_data;
    	let updating_admin_pass_2;
    	let t5;
    	let div4;
    	let npmdialog;
    	let updating_npm_dialog_data;
    	let updating_admin_pass_3;
    	let t6;
    	let div5;
    	let makeentrydialog1;
    	let updating_admin_pass_4;
    	let current;

    	function tabbar_active_binding(value) {
    		/*tabbar_active_binding*/ ctx[54](value);
    	}

    	let tabbar_props = {
    		tabs: ['Overview', 'stdout', 'Ops'],
    		$$slots: {
    			default: [
    				create_default_slot,
    				({ tab }) => ({ 100: tab }),
    				({ tab }) => [0, 0, 0, tab ? 128 : 0]
    			]
    		},
    		$$scope: { ctx }
    	};

    	if (/*active*/ ctx[1] !== void 0) {
    		tabbar_props.active = /*active*/ ctx[1];
    	}

    	tabbar = new TabBar({ props: tabbar_props, $$inline: true });
    	binding_callbacks.push(() => bind(tabbar, 'active', tabbar_active_binding));

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_5,
    		create_if_block_6
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*active*/ ctx[1] === 'Overview') return 0;
    		if (/*active*/ ctx[1] === 'stdout') return 1;
    		if (/*active*/ ctx[1] === 'Ops') return 2;
    		if (/*active*/ ctx[1] === 'Source') return 3;
    		if (/*active*/ ctx[1] === 'Write Doc') return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const makeentrydialog0_spread_levels = [
    		/*dialog_data*/ ctx[3],
    		{ message: "Create a process entry" },
    		{ onCancel: /*onCancel*/ ctx[23] },
    		{ onOkay: /*onOkay*/ ctx[24] }
    	];

    	function makeentrydialog0_admin_pass_binding(value) {
    		/*makeentrydialog0_admin_pass_binding*/ ctx[61](value);
    	}

    	let makeentrydialog0_props = {};

    	for (let i = 0; i < makeentrydialog0_spread_levels.length; i += 1) {
    		makeentrydialog0_props = assign(makeentrydialog0_props, makeentrydialog0_spread_levels[i]);
    	}

    	if (/*admin_pass*/ ctx[13] !== void 0) {
    		makeentrydialog0_props.admin_pass = /*admin_pass*/ ctx[13];
    	}

    	makeentrydialog0 = new MakeEntryDialog({
    			props: makeentrydialog0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(makeentrydialog0, 'admin_pass', makeentrydialog0_admin_pass_binding));

    	function editconfdialog_conf_dialog_data_binding(value) {
    		/*editconfdialog_conf_dialog_data_binding*/ ctx[62](value);
    	}

    	function editconfdialog_admin_pass_binding(value) {
    		/*editconfdialog_admin_pass_binding*/ ctx[63](value);
    	}

    	let editconfdialog_props = {
    		message: "Edit process config file",
    		onCancel: /*onConfCancel*/ ctx[27],
    		onOkay: /*onConfOkay*/ ctx[28]
    	};

    	if (/*conf_dialog_data*/ ctx[4] !== void 0) {
    		editconfdialog_props.conf_dialog_data = /*conf_dialog_data*/ ctx[4];
    	}

    	if (/*admin_pass*/ ctx[13] !== void 0) {
    		editconfdialog_props.admin_pass = /*admin_pass*/ ctx[13];
    	}

    	editconfdialog = new EditConfDialog({
    			props: editconfdialog_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(editconfdialog, 'conf_dialog_data', editconfdialog_conf_dialog_data_binding));
    	binding_callbacks.push(() => bind(editconfdialog, 'admin_pass', editconfdialog_admin_pass_binding));

    	function execdialog_exec_dialog_data_binding(value) {
    		/*execdialog_exec_dialog_data_binding*/ ctx[64](value);
    	}

    	function execdialog_admin_pass_binding(value) {
    		/*execdialog_admin_pass_binding*/ ctx[65](value);
    	}

    	let execdialog_props = {
    		message: "Run a single command",
    		hasForm: "true",
    		onCancel: /*onExecCancel*/ ctx[29],
    		onOkay: /*onExecOkay*/ ctx[30]
    	};

    	if (/*exec_dialog_data*/ ctx[5] !== void 0) {
    		execdialog_props.exec_dialog_data = /*exec_dialog_data*/ ctx[5];
    	}

    	if (/*admin_pass*/ ctx[13] !== void 0) {
    		execdialog_props.admin_pass = /*admin_pass*/ ctx[13];
    	}

    	execdialog = new ExecDialog({ props: execdialog_props, $$inline: true });
    	binding_callbacks.push(() => bind(execdialog, 'exec_dialog_data', execdialog_exec_dialog_data_binding));
    	binding_callbacks.push(() => bind(execdialog, 'admin_pass', execdialog_admin_pass_binding));

    	function npmdialog_npm_dialog_data_binding(value) {
    		/*npmdialog_npm_dialog_data_binding*/ ctx[66](value);
    	}

    	function npmdialog_admin_pass_binding(value) {
    		/*npmdialog_admin_pass_binding*/ ctx[67](value);
    	}

    	let npmdialog_props = {
    		message: "Mnage Npm modules",
    		npm_action: /*npm_action*/ ctx[19],
    		hasForm: "true",
    		onCancel: /*onNpmCancel*/ ctx[31],
    		onOkay: /*onNpmOkay*/ ctx[32]
    	};

    	if (/*npm_dialog_data*/ ctx[6] !== void 0) {
    		npmdialog_props.npm_dialog_data = /*npm_dialog_data*/ ctx[6];
    	}

    	if (/*admin_pass*/ ctx[13] !== void 0) {
    		npmdialog_props.admin_pass = /*admin_pass*/ ctx[13];
    	}

    	npmdialog = new ExecNpm({ props: npmdialog_props, $$inline: true });
    	binding_callbacks.push(() => bind(npmdialog, 'npm_dialog_data', npmdialog_npm_dialog_data_binding));
    	binding_callbacks.push(() => bind(npmdialog, 'admin_pass', npmdialog_admin_pass_binding));

    	const makeentrydialog1_spread_levels = [
    		/*dialog_update_data*/ ctx[7],
    		{ message: "Update this process entry" },
    		{ onCancel: /*onUpdateCancel*/ ctx[25] },
    		{ onOkay: /*onUpdateOkay*/ ctx[26] }
    	];

    	function makeentrydialog1_admin_pass_binding(value) {
    		/*makeentrydialog1_admin_pass_binding*/ ctx[68](value);
    	}

    	let makeentrydialog1_props = {};

    	for (let i = 0; i < makeentrydialog1_spread_levels.length; i += 1) {
    		makeentrydialog1_props = assign(makeentrydialog1_props, makeentrydialog1_spread_levels[i]);
    	}

    	if (/*admin_pass*/ ctx[13] !== void 0) {
    		makeentrydialog1_props.admin_pass = /*admin_pass*/ ctx[13];
    	}

    	makeentrydialog1 = new MakeEntryDialog({
    			props: makeentrydialog1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(makeentrydialog1, 'admin_pass', makeentrydialog1_admin_pass_binding));

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(tabbar.$$.fragment);
    			t0 = space$1();
    			br = element("br");
    			t1 = space$1();
    			if (if_block) if_block.c();
    			t2 = space$1();
    			div1 = element("div");
    			create_component(makeentrydialog0.$$.fragment);
    			t3 = space$1();
    			div2 = element("div");
    			create_component(editconfdialog.$$.fragment);
    			t4 = space$1();
    			div3 = element("div");
    			create_component(execdialog.$$.fragment);
    			t5 = space$1();
    			div4 = element("div");
    			create_component(npmdialog.$$.fragment);
    			t6 = space$1();
    			div5 = element("div");
    			create_component(makeentrydialog1.$$.fragment);
    			attr_dev(br, "class", "svelte-1kt20zm");
    			add_location(br, file, 1447, 1, 29529);
    			attr_dev(div0, "class", "svelte-1kt20zm");
    			add_location(div0, file, 1437, 0, 29153);
    			attr_dev(div1, "class", "dialoger nice_message svelte-1kt20zm");
    			set_style(div1, "display", /*show_dialog*/ ctx[14]);
    			add_location(div1, file, 1540, 0, 32801);
    			attr_dev(div2, "class", "dialoger nice_message svelte-1kt20zm");
    			set_style(div2, "display", /*show_conf_dialog*/ ctx[16]);
    			add_location(div2, file, 1544, 0, 33011);
    			attr_dev(div3, "class", "dialoger nice_message svelte-1kt20zm");
    			set_style(div3, "display", /*show_exec_dialog*/ ctx[17]);
    			add_location(div3, file, 1549, 0, 33261);
    			attr_dev(div4, "class", "dialoger nice_message svelte-1kt20zm");
    			set_style(div4, "display", /*show_npm_dialog*/ ctx[18]);
    			add_location(div4, file, 1554, 0, 33516);
    			attr_dev(div5, "class", "dialoger nice_message svelte-1kt20zm");
    			set_style(div5, "display", /*show_update_dialog*/ ctx[15]);
    			add_location(div5, file, 1559, 0, 33786);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(tabbar, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, br);
    			append_dev(div0, t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(makeentrydialog0, div1, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(editconfdialog, div2, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(execdialog, div3, null);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div4, anchor);
    			mount_component(npmdialog, div4, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div5, anchor);
    			mount_component(makeentrydialog1, div5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabbar_changes = {};

    			if (dirty[0] & /*active*/ 2 | dirty[3] & /*$$scope, tab*/ 384) {
    				tabbar_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_active && dirty[0] & /*active*/ 2) {
    				updating_active = true;
    				tabbar_changes.active = /*active*/ ctx[1];
    				add_flush_callback(() => updating_active = false);
    			}

    			tabbar.$set(tabbar_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				} else {
    					if_block = null;
    				}
    			}

    			const makeentrydialog0_changes = (dirty[0] & /*dialog_data, onCancel, onOkay*/ 25165832)
    			? get_spread_update(makeentrydialog0_spread_levels, [
    					dirty[0] & /*dialog_data*/ 8 && get_spread_object(/*dialog_data*/ ctx[3]),
    					makeentrydialog0_spread_levels[1],
    					dirty[0] & /*onCancel*/ 8388608 && { onCancel: /*onCancel*/ ctx[23] },
    					dirty[0] & /*onOkay*/ 16777216 && { onOkay: /*onOkay*/ ctx[24] }
    				])
    			: {};

    			if (!updating_admin_pass && dirty[0] & /*admin_pass*/ 8192) {
    				updating_admin_pass = true;
    				makeentrydialog0_changes.admin_pass = /*admin_pass*/ ctx[13];
    				add_flush_callback(() => updating_admin_pass = false);
    			}

    			makeentrydialog0.$set(makeentrydialog0_changes);

    			if (!current || dirty[0] & /*show_dialog*/ 16384) {
    				set_style(div1, "display", /*show_dialog*/ ctx[14]);
    			}

    			const editconfdialog_changes = {};

    			if (!updating_conf_dialog_data && dirty[0] & /*conf_dialog_data*/ 16) {
    				updating_conf_dialog_data = true;
    				editconfdialog_changes.conf_dialog_data = /*conf_dialog_data*/ ctx[4];
    				add_flush_callback(() => updating_conf_dialog_data = false);
    			}

    			if (!updating_admin_pass_1 && dirty[0] & /*admin_pass*/ 8192) {
    				updating_admin_pass_1 = true;
    				editconfdialog_changes.admin_pass = /*admin_pass*/ ctx[13];
    				add_flush_callback(() => updating_admin_pass_1 = false);
    			}

    			editconfdialog.$set(editconfdialog_changes);

    			if (!current || dirty[0] & /*show_conf_dialog*/ 65536) {
    				set_style(div2, "display", /*show_conf_dialog*/ ctx[16]);
    			}

    			const execdialog_changes = {};

    			if (!updating_exec_dialog_data && dirty[0] & /*exec_dialog_data*/ 32) {
    				updating_exec_dialog_data = true;
    				execdialog_changes.exec_dialog_data = /*exec_dialog_data*/ ctx[5];
    				add_flush_callback(() => updating_exec_dialog_data = false);
    			}

    			if (!updating_admin_pass_2 && dirty[0] & /*admin_pass*/ 8192) {
    				updating_admin_pass_2 = true;
    				execdialog_changes.admin_pass = /*admin_pass*/ ctx[13];
    				add_flush_callback(() => updating_admin_pass_2 = false);
    			}

    			execdialog.$set(execdialog_changes);

    			if (!current || dirty[0] & /*show_exec_dialog*/ 131072) {
    				set_style(div3, "display", /*show_exec_dialog*/ ctx[17]);
    			}

    			const npmdialog_changes = {};
    			if (dirty[0] & /*npm_action*/ 524288) npmdialog_changes.npm_action = /*npm_action*/ ctx[19];

    			if (!updating_npm_dialog_data && dirty[0] & /*npm_dialog_data*/ 64) {
    				updating_npm_dialog_data = true;
    				npmdialog_changes.npm_dialog_data = /*npm_dialog_data*/ ctx[6];
    				add_flush_callback(() => updating_npm_dialog_data = false);
    			}

    			if (!updating_admin_pass_3 && dirty[0] & /*admin_pass*/ 8192) {
    				updating_admin_pass_3 = true;
    				npmdialog_changes.admin_pass = /*admin_pass*/ ctx[13];
    				add_flush_callback(() => updating_admin_pass_3 = false);
    			}

    			npmdialog.$set(npmdialog_changes);

    			if (!current || dirty[0] & /*show_npm_dialog*/ 262144) {
    				set_style(div4, "display", /*show_npm_dialog*/ ctx[18]);
    			}

    			const makeentrydialog1_changes = (dirty[0] & /*dialog_update_data, onUpdateCancel, onUpdateOkay*/ 100663424)
    			? get_spread_update(makeentrydialog1_spread_levels, [
    					dirty[0] & /*dialog_update_data*/ 128 && get_spread_object(/*dialog_update_data*/ ctx[7]),
    					makeentrydialog1_spread_levels[1],
    					dirty[0] & /*onUpdateCancel*/ 33554432 && { onCancel: /*onUpdateCancel*/ ctx[25] },
    					dirty[0] & /*onUpdateOkay*/ 67108864 && { onOkay: /*onUpdateOkay*/ ctx[26] }
    				])
    			: {};

    			if (!updating_admin_pass_4 && dirty[0] & /*admin_pass*/ 8192) {
    				updating_admin_pass_4 = true;
    				makeentrydialog1_changes.admin_pass = /*admin_pass*/ ctx[13];
    				add_flush_callback(() => updating_admin_pass_4 = false);
    			}

    			makeentrydialog1.$set(makeentrydialog1_changes);

    			if (!current || dirty[0] & /*show_update_dialog*/ 32768) {
    				set_style(div5, "display", /*show_update_dialog*/ ctx[15]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabbar.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(makeentrydialog0.$$.fragment, local);
    			transition_in(editconfdialog.$$.fragment, local);
    			transition_in(execdialog.$$.fragment, local);
    			transition_in(npmdialog.$$.fragment, local);
    			transition_in(makeentrydialog1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabbar.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(makeentrydialog0.$$.fragment, local);
    			transition_out(editconfdialog.$$.fragment, local);
    			transition_out(execdialog.$$.fragment, local);
    			transition_out(npmdialog.$$.fragment, local);
    			transition_out(makeentrydialog1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(tabbar);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(makeentrydialog0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			destroy_component(editconfdialog);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div3);
    			destroy_component(execdialog);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div4);
    			destroy_component(npmdialog);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div5);
    			destroy_component(makeentrydialog1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function reinitialize_user_context() {
    	
    } // 

    function navigate_to_proc() {
    	
    } // 

    function popup_size() {
    	let smallest_w = 200; // smallest and bigget willing to accomodate
    	let biggest_w = 3000;
    	let smallest_h = 600;
    	let biggest_h = 1000;

    	// bounded window width
    	let w = Math.max(smallest_w, window.innerWidth);

    	w = Math.min(biggest_w, w);

    	// bounded window height
    	let h = Math.max(smallest_h, window.innerHeight);

    	h = Math.min(biggest_h, h);
    	let p_range;
    	let P;

    	//	percentage h range 
    	let h_p_max = 0.96;

    	let h_p_min = 0.75;
    	p_range = h_p_max - h_p_min;
    	P = (biggest_h - h) / (biggest_h - smallest_h);

    	//console.log("P h: " + P)
    	let h_scale = P * p_range + h_p_min;

    	//	percentage w range 
    	let w_p_max = 0.96;

    	let w_p_min = 0.20;
    	p_range = w_p_max - w_p_min;
    	P = (biggest_w - w) / (biggest_w - smallest_w);

    	//console.log("P w: " + P)
    	let w_scale = P * p_range + w_p_min;

    	// Setting the current height & width 
    	// to the elements 
    	return { "w": w_scale, "h": h_scale };
    }

    // MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES
    // MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES MESSAGES
    function name_is_stem(pname, containing_str) {
    	let stem = containing_str.substring(containing_str.lastIndexOf("/") + 1);
    	return pname === stem;
    }

    function arg0_calculus(pname, proc_def) {
    	let args = proc_def.args;

    	if (!Array.isArray(args)) {
    		args = args.split(',');
    	}

    	if (args[0] !== pname && !name_is_stem(pname, args[0])) {
    		if (proc_def.runner === "node") {
    			if (args[0] !== "--inspect" && args[0] !== "--inspect-brk") {
    				args.unshift(pname); // put the name into the array
    			}
    		}

    		if (proc_def.runner.length === 0) delete proc_def.runner;
    	}

    	proc_def.args = args;
    }

    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    //
    function reset_inputs(individual) {
    	
    }

    function instance($$self, $$props, $$invalidate) {
    	let filteredIndviduals;
    	let filtered_manifest_contact_form_list;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let dialog_data = "";
    	let conf_dialog_data = "";
    	let exec_dialog_data = "";
    	let npm_dialog_data = "";
    	let dialog_update_data = "";
    	let password_view_type = true;

    	//
    	let console_output = "<b>console output</b><br>";

    	let active_cwid = "";
    	let prefix = '';
    	let man_prefix = '';
    	let i = 0;

    	//
    	let u_index = 0;

    	let active_procs = false;
    	let active_identity = false;
    	let known_procs = [false];
    	let all_proc_data = {};
    	let active_proc_name = "";
    	let running_color = "green";
    	let running_state = "running";
    	let admin_pass = "";
    	let manifest_selected_entry = false;
    	let manifest_selected_form = false;
    	let manifest_contact_form_list = [false];

    	//
    	let manifest_obj = {};

    	let manifest_index = 0;
    	let man_cwid = '';
    	let active = 'Identify';
    	let prev_active = active;
    	let todays_date = new Date().toLocaleString();

    	// This is just a default... It will be used until the user picks something else 
    	// when editing the manifest.
    	//
    	let individuals = [
    		{
    			"name": 'Hans Solo',
    			"DOB": "1000",
    			"place_of_origin": "alpha centauri",
    			"cool_public_info": "He is a Master Jedi",
    			"business": false,
    			"public_key": "testesttesttest",
    			"signer_public_key": "ha ha ha ha ha ha ha ",
    			"cwid": "4504385938",
    			"answer_message": "",
    			"biometric": "53535"
    		}
    	];

    	let selected = individuals[0];

    	/*
          "wrapped_key" : false,
          "encoding" : "uri",
      "when"  ... whereas"date" is a human readable string...
    */
    	//
    	class Contact {
    		//
    		constructor() {
    			this.empty_identity = {
    				"name": '',
    				"DOB": "",
    				"place_of_origin": "",
    				"cool_public_info": "",
    				"business": false,
    				"public_key": false,
    				"signer_public_key": false,
    				"biometric": false
    			};

    			this.data = this.empty_identity;
    		}

    		//
    		set(name, DOB, place_of_origin, cool_public_info, business, public_key, signer_public_key, biometric_blob) {
    			let user_data = {
    				name,
    				DOB,
    				place_of_origin,
    				cool_public_info,
    				"business": business === undefined ? false : business,
    				public_key,
    				signer_public_key,
    				"biometric": biometric_blob
    			};

    			this.data = user_data;
    		}

    		copy(contact_info) {
    			let data = {};

    			for (let ky in this.empty_identity) {
    				data[ky] = contact_info[ky];
    			}

    			this.data = data;
    		}

    		match(contact_info) {
    			let f_match = true;
    			f_match = f_match && this.data.name === contact_info.name;
    			f_match = f_match && this.data.DOB === contact_info.DOB;
    			f_match = f_match && this.data.place_of_origin === contact_info.place_of_origin;
    			f_match = f_match && this.data.cool_public_info === contact_info.cool_public_info;
    			f_match = f_match && this.data.business === contact_info.business;
    			return f_match;
    		}

    		extend_contact(field, value) {
    			this.data[field] = value;
    		}

    		get_field(field) {
    			return this.data[field];
    		}

    		identity() {
    			let id_obj = Object.assign(this.empty_identity, this.data);
    			return id_obj;
    		}

    		clear_identity() {
    			let id_obj = {
    				"name": this.data.name,
    				"DOB": this.data.DOB,
    				"place_of_origin": this.data.place_of_origin,
    				"cool_public_info": this.data.cool_public_info,
    				"business": this.data.business
    			};

    			return id_obj;
    		}
    	}

    	let empty_identity = new Contact();

    	//
    	/*
    "test3.js": {
          "name": "test3.js",
          "run_on_start": true,
          "attempt_reconnect": false,
          "runner": "node",
          "args": "test3"
        }
     */
    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	//
    	let show_dialog = "none";

    	let add_promise = false;

    	const onCancel = () => {
    		$$invalidate(14, show_dialog = "none");

    		if (add_promise && typeof add_promise.rejector === 'function') {
    			add_promise.rejector();
    		}
    	};

    	const onOkay = ddata => {
    		$$invalidate(3, dialog_data = ddata);
    		console.log(ddata);
    		$$invalidate(14, show_dialog = "none");

    		if (add_promise && typeof add_promise.resolver === 'function') {
    			add_promise.resolver();
    		}
    	};

    	//
    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	async function proc_def_from_user() {
    		$$invalidate(14, show_dialog = "block");

    		let p = new Promise((resolve, reject) => {
    				add_promise = {
    					resolver: () => {
    						resolve(true);
    						add_promise = false;
    					},
    					rejector: () => {
    						resolve(false);
    						add_promise = false;
    					}
    				};
    			});

    		let do_process = await p;

    		if (do_process) {
    			return dialog_data;
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	// 
    	let show_update_dialog = "none";

    	let add_update_promise = false;

    	const onUpdateCancel = () => {
    		$$invalidate(15, show_update_dialog = "none");

    		if (add_update_promise && typeof add_update_promise.rejector === 'function') {
    			add_update_promise.rejector();
    		}
    	};

    	const onUpdateOkay = ddata => {
    		$$invalidate(7, dialog_update_data = ddata);
    		console.log(ddata);
    		$$invalidate(15, show_update_dialog = "none");

    		if (add_update_promise && typeof add_update_promise.resolver === 'function') {
    			add_update_promise.resolver();
    		}
    	};

    	//
    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	async function update_def_from_user() {
    		$$invalidate(15, show_update_dialog = "block");

    		let p = new Promise((resolve, reject) => {
    				add_update_promise = {
    					resolver: () => {
    						resolve(true);
    						add_promise = false;
    					},
    					rejector: () => {
    						resolve(false);
    						add_promise = false;
    					}
    				};
    			});

    		let do_process = await p;

    		if (do_process) {
    			return dialog_update_data;
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	// 
    	let show_conf_dialog = "none";

    	let add_conf_promise = false;

    	const onConfCancel = () => {
    		$$invalidate(16, show_conf_dialog = "none");

    		if (add_conf_promise && typeof add_conf_promise.rejector === 'function') {
    			add_conf_promise.rejector();
    		}
    	};

    	const onConfOkay = text => {
    		console.log(text);
    		$$invalidate(16, show_conf_dialog = "none");

    		if (add_conf_promise && typeof add_conf_promise.resolver === 'function') {
    			add_conf_promise.resolver();
    		}
    	};

    	async function conf_def_from_user() {
    		$$invalidate(16, show_conf_dialog = "block");

    		let p = new Promise((resolve, reject) => {
    				add_conf_promise = {
    					resolver: () => {
    						resolve(true);
    						add_conf_promise = false;
    					},
    					rejector: () => {
    						resolve(false);
    						add_conf_promise = false;
    					}
    				};
    			});

    		let do_process = await p;

    		if (do_process) {
    			return conf_dialog_data;
    		}
    	}

    	//
    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	let show_exec_dialog = "none";

    	let add_exec_promise = false;

    	const onExecCancel = () => {
    		$$invalidate(17, show_exec_dialog = "none");

    		if (add_exec_promise && typeof add_exec_promise.rejector === 'function') {
    			add_exec_promise.rejector();
    		}
    	};

    	const onExecOkay = () => {
    		$$invalidate(17, show_exec_dialog = "none");

    		if (add_exec_promise && typeof add_exec_promise.resolver === 'function') {
    			add_exec_promise.resolver();
    		}
    	};

    	//
    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	async function exec_def_from_user() {
    		$$invalidate(17, show_exec_dialog = "block");

    		let p = new Promise((resolve, reject) => {
    				add_exec_promise = {
    					resolver: () => {
    						resolve(true);
    						add_exec_promise = false;
    					},
    					rejector: () => {
    						resolve(false);
    						add_exec_promise = false;
    					}
    				};
    			});

    		let do_process = await p;

    		if (do_process) {
    			return exec_dialog_data;
    		}
    	}

    	let show_npm_dialog = "none";
    	let add_npm_promise = false;

    	const onNpmCancel = () => {
    		$$invalidate(18, show_npm_dialog = "none");

    		if (add_npm_promise && typeof add_npm_promise.rejector === 'function') {
    			add_npm_promise.rejector();
    		}
    	};

    	const onNpmOkay = () => {
    		$$invalidate(18, show_npm_dialog = "none");

    		if (add_npm_promise && typeof add_npm_promise.resolver === 'function') {
    			add_npm_promise.resolver();
    		}
    	};

    	//
    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	let npm_action = "install";

    	async function npm_def_from_user(action_choice) {
    		$$invalidate(19, npm_action = action_choice ? "install" : "remove");
    		$$invalidate(18, show_npm_dialog = "block");

    		let p = new Promise((resolve, reject) => {
    				add_npm_promise = {
    					resolver: () => {
    						resolve(true);
    						add_npm_promise = false;
    					},
    					rejector: () => {
    						resolve(false);
    						add_npm_promise = false;
    					}
    				};
    			});

    		let do_process = await p;

    		if (do_process) {
    			return npm_dialog_data;
    		}
    	}

    	//
    	let active_proc_data = {};

    	let current_index = -1;

    	// ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    	let creation_to_do = false;

    	let window_scale = { "w": 0.4, "h": 0.8 };
    	let edit_popup_scale = { "w": 0.45, "h": 0.3 };
    	let all_window_scales = [];
    	all_window_scales.push(window_scale);
    	all_window_scales.push(window_scale);
    	all_window_scales.push(edit_popup_scale);

    	//
    	window_scale = popup_size();

    	all_window_scales[0] = window_scale;
    	all_window_scales[1] = window_scale;

    	//
    	onMount(async () => {
    		//
    		window.addEventListener("resize", e => {
    			//
    			let scale = popup_size();

    			//
    			window_scale.h = scale.h;

    			window_scale.w = scale.w;
    			all_window_scales[0] = window_scale;
    			all_window_scales[1] = window_scale;
    		}); //

    		window._expose_to_page = data => {
    			$$invalidate(0, known_procs = data[0]);
    			all_proc_data = data[1];
    		};

    		window._add_console_data = message => {
    			$$invalidate(9, console_output += message.data.join('<br>') + '<br>');

    			while (console_output.length > 10000) {
    				$$invalidate(9, console_output = console_output.substring(1000));
    			}
    		};

    		await startup();

    		// initialize
    		await get_active_procs(); // updates login page and initializes the view of this user.
    	});

    	// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 
    	// PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE  PROFILE 
    	async function get_active_procs() {
    		try {
    			let [f_procs, f_data] = await fetch_procs_from_server();
    			$$invalidate(0, known_procs = f_procs);
    			all_proc_data = f_data;
    		} catch(e) {
    			
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function restart_proc() {
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		let pname = active_proc_name;

    		let params = {
    			admin_pass,
    			"op": {
    				"name": "restart-proc",
    				"param": { "proc_name": pname }
    			}
    		};

    		try {
    			let result = await post_proc_command(params);
    			if (!result) alert("Error");
    		} catch(e) {
    			alert(e.message);
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function run_proc() {
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		//
    		let pname = active_proc_name;

    		let params = {
    			admin_pass,
    			"op": {
    				"name": "run-proc",
    				"param": { "proc_name": pname, "if_running": false }
    			}
    		};

    		try {
    			let result = await post_proc_command(params);
    			if (!result) alert("Error");
    		} catch(e) {
    			alert(e.message);
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function stop_proc() {
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		//
    		let pname = active_proc_name;

    		let params = {
    			admin_pass,
    			"op": {
    				"name": "stop-proc",
    				"param": { "proc_name": pname }
    			}
    		};

    		try {
    			let result = await post_proc_command(params);
    			if (!result) alert("Error");
    		} catch(e) {
    			alert(e.message);
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function stopall() {
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		//
    		let params = { admin_pass, "op": { "name": "stop-all" } };

    		try {
    			let result = await post_proc_command(params);
    			if (!result) alert("Error");
    		} catch(e) {
    			alert(e.message);
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function remove_entry() {
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		let doit = confirm("Are you sure you want to remove this entry?");
    		if (!doit) return;
    		let pname = active_proc_name;

    		let params = {
    			admin_pass,
    			"op": {
    				"name": "remove-proc",
    				"param": { "proc_name": pname }
    			}
    		};

    		try {
    			let result = await post_proc_command(params);
    			if (!result) alert("Error");
    		} catch(e) {
    			alert(e.message);
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function reload_all() {
    		//
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		//
    		let params = {
    			admin_pass,
    			"op": { "name": "reload", "param": {} }
    		};

    		try {
    			let result = await post_proc_command(params);
    			if (!result) alert("Error");
    			await get_active_procs();
    		} catch(e) {
    			alert(e.message);
    		}
    	} //

    	// ---- ---- ---- ---- ---- ---- ----
    	async function add_entry() {
    		//
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		//
    		let proc_def = await proc_def_from_user();

    		if (!proc_def) return;

    		//
    		let pname = proc_def.name;

    		arg0_calculus(pname, proc_def);

    		if (proc_def) {
    			let params = {
    				admin_pass,
    				"op": {
    					"name": "add-proc",
    					"param": { "proc_name": pname, proc_def }
    				}
    			};

    			try {
    				let result = await post_proc_command(params);
    				if (!result) alert("Error");
    			} catch(e) {
    				alert(e.message);
    			}
    		}
    	}

    	async function update_entry() {
    		//
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		//
    		$$invalidate(7, dialog_update_data = Object.assign({}, active_procs.conf));

    		//
    		let proc_def = await update_def_from_user();

    		if (!proc_def) return;

    		//
    		let pname = proc_def.name;

    		arg0_calculus(pname, proc_def);

    		if (proc_def) {
    			let params = {
    				admin_pass,
    				"op": {
    					"name": "update-proc",
    					"param": { "proc_name": pname, proc_def }
    				}
    			};

    			try {
    				let result = await post_proc_command(params);
    				if (!result) alert("Error");
    			} catch(e) {
    				alert(e.message);
    			}
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function edit_app_config() {
    		// active_proc_data
    		let entry_conf = active_proc_data.conf;

    		let config_file = false;

    		if (entry_conf) {
    			let plist = entry_conf.args;

    			for (let p of plist) {
    				if (p.indexOf('.conf') > 0) {
    					config_file = p;
    					break;
    				}
    			}
    		}

    		//
    		if (!config_file) {
    			alert("no config file found");
    			return;
    		} else {
    			let editable = confirm(`Is ${config_file} this apps config file?`);

    			if (!editable) {
    				alert("no config file found");
    				return;
    			}
    		}

    		let editable_config = await fetch_app_config(config_file);

    		if (editable_config) {
    			$$invalidate(4, conf_dialog_data = editable_config);
    		}

    		let conf_def = await conf_def_from_user();
    		if (!conf_def) return;

    		//
    		let pname = active_proc_name;

    		if (conf_def) {
    			let conf_def_str = JSON.stringify(conf_def);

    			let params = {
    				admin_pass,
    				"op": {
    					"name": "config",
    					"param": {
    						"proc_name": pname,
    						"config": conf_def_str,
    						"file": config_file
    					}
    				}
    			};

    			try {
    				let result = await post_proc_command(params);
    				if (!result) alert("Error");
    			} catch(e) {
    				alert(e.message);
    			}
    		}
    	}

    	// ---- ---- ---- ---- ---- ---- ----
    	async function run_command() {
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		let proc_def = await exec_def_from_user();
    		if (!proc_def) return;

    		//
    		if (proc_def) {
    			let params = {
    				admin_pass,
    				"op": { "name": "exec", "param": { proc_def } }
    			};

    			try {
    				let result = await post_proc_command(params);
    				if (!result) alert("Error");
    			} catch(e) {
    				alert(e.message);
    			}
    		}
    	}

    	async function run_npm_command(action_choice) {
    		if (admin_pass.length === 0) {
    			alert("no admin pass");
    			return;
    		}

    		let proc_def_in = await npm_def_from_user(action_choice);
    		if (!proc_def_in) return;

    		//
    		let proc_def = Object.assign({}, proc_def_in);

    		proc_def_in.action = "";
    		proc_def_in.args = "";
    		let action = proc_def.action;
    		proc_def.args = `${action} ${proc_def.args}`;

    		if (proc_def) {
    			let params = {
    				admin_pass,
    				"op": { "name": "exec", "param": { proc_def } }
    			};

    			try {
    				let result = await post_proc_command(params);
    				if (!result) alert("Error");
    			} catch(e) {
    				alert(e.message);
    			}
    		}
    	}

    	function npm_install() {
    		run_npm_command(true);
    	}

    	function npm_remove() {
    		run_npm_command(false);
    	}

    	//
    	function toggle_password_view() {
    		$$invalidate(8, password_view_type = !password_view_type);
    	}

    	// MARKDOWN ADD ON
    	let md = '# Hello world!';

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function tabbar_active_binding(value) {
    		active = value;
    		$$invalidate(1, active);
    	}

    	function input_input_handler() {
    		admin_pass = this.value;
    		$$invalidate(13, admin_pass);
    	}

    	function input_input_handler_1() {
    		admin_pass = this.value;
    		$$invalidate(13, admin_pass);
    	}

    	function select_change_handler() {
    		u_index = select_value(this);
    		$$invalidate(2, u_index);
    	}

    	function input_input_handler_2() {
    		admin_pass = this.value;
    		$$invalidate(13, admin_pass);
    	}

    	function input_input_handler_3() {
    		admin_pass = this.value;
    		$$invalidate(13, admin_pass);
    	}

    	function textarea_input_handler() {
    		md = this.value;
    		$$invalidate(21, md);
    	}

    	function makeentrydialog0_admin_pass_binding(value) {
    		admin_pass = value;
    		$$invalidate(13, admin_pass);
    	}

    	function editconfdialog_conf_dialog_data_binding(value) {
    		conf_dialog_data = value;
    		$$invalidate(4, conf_dialog_data);
    	}

    	function editconfdialog_admin_pass_binding(value) {
    		admin_pass = value;
    		$$invalidate(13, admin_pass);
    	}

    	function execdialog_exec_dialog_data_binding(value) {
    		exec_dialog_data = value;
    		$$invalidate(5, exec_dialog_data);
    	}

    	function execdialog_admin_pass_binding(value) {
    		admin_pass = value;
    		$$invalidate(13, admin_pass);
    	}

    	function npmdialog_npm_dialog_data_binding(value) {
    		npm_dialog_data = value;
    		$$invalidate(6, npm_dialog_data);
    	}

    	function npmdialog_admin_pass_binding(value) {
    		admin_pass = value;
    		$$invalidate(13, admin_pass);
    	}

    	function makeentrydialog1_admin_pass_binding(value) {
    		admin_pass = value;
    		$$invalidate(13, admin_pass);
    	}

    	$$self.$capture_state = () => ({
    		Tab,
    		Label: CommonLabel,
    		TabBar,
    		onMount,
    		MakeEntryDialog,
    		ExecDialog,
    		NpmDialog: ExecNpm,
    		EditConfDialog,
    		JsonView,
    		Markdown,
    		dialog_data,
    		conf_dialog_data,
    		exec_dialog_data,
    		npm_dialog_data,
    		dialog_update_data,
    		password_view_type,
    		console_output,
    		active_cwid,
    		prefix,
    		man_prefix,
    		i,
    		u_index,
    		active_procs,
    		active_identity,
    		known_procs,
    		all_proc_data,
    		active_proc_name,
    		running_color,
    		running_state,
    		admin_pass,
    		manifest_selected_entry,
    		manifest_selected_form,
    		manifest_contact_form_list,
    		manifest_obj,
    		manifest_index,
    		man_cwid,
    		active,
    		prev_active,
    		todays_date,
    		individuals,
    		selected,
    		reinitialize_user_context,
    		navigate_to_proc,
    		Contact,
    		empty_identity,
    		show_dialog,
    		add_promise,
    		onCancel,
    		onOkay,
    		proc_def_from_user,
    		show_update_dialog,
    		add_update_promise,
    		onUpdateCancel,
    		onUpdateOkay,
    		update_def_from_user,
    		show_conf_dialog,
    		add_conf_promise,
    		onConfCancel,
    		onConfOkay,
    		conf_def_from_user,
    		show_exec_dialog,
    		add_exec_promise,
    		onExecCancel,
    		onExecOkay,
    		exec_def_from_user,
    		show_npm_dialog,
    		add_npm_promise,
    		onNpmCancel,
    		onNpmOkay,
    		npm_action,
    		npm_def_from_user,
    		active_proc_data,
    		current_index,
    		creation_to_do,
    		window_scale,
    		edit_popup_scale,
    		all_window_scales,
    		popup_size,
    		get_active_procs,
    		name_is_stem,
    		arg0_calculus,
    		reset_inputs,
    		restart_proc,
    		run_proc,
    		stop_proc,
    		stopall,
    		remove_entry,
    		reload_all,
    		add_entry,
    		update_entry,
    		edit_app_config,
    		run_command,
    		run_npm_command,
    		npm_install,
    		npm_remove,
    		toggle_password_view,
    		md,
    		filtered_manifest_contact_form_list,
    		filteredIndviduals
    	});

    	$$self.$inject_state = $$props => {
    		if ('dialog_data' in $$props) $$invalidate(3, dialog_data = $$props.dialog_data);
    		if ('conf_dialog_data' in $$props) $$invalidate(4, conf_dialog_data = $$props.conf_dialog_data);
    		if ('exec_dialog_data' in $$props) $$invalidate(5, exec_dialog_data = $$props.exec_dialog_data);
    		if ('npm_dialog_data' in $$props) $$invalidate(6, npm_dialog_data = $$props.npm_dialog_data);
    		if ('dialog_update_data' in $$props) $$invalidate(7, dialog_update_data = $$props.dialog_update_data);
    		if ('password_view_type' in $$props) $$invalidate(8, password_view_type = $$props.password_view_type);
    		if ('console_output' in $$props) $$invalidate(9, console_output = $$props.console_output);
    		if ('active_cwid' in $$props) $$invalidate(79, active_cwid = $$props.active_cwid);
    		if ('prefix' in $$props) $$invalidate(80, prefix = $$props.prefix);
    		if ('man_prefix' in $$props) $$invalidate(81, man_prefix = $$props.man_prefix);
    		if ('i' in $$props) $$invalidate(82, i = $$props.i);
    		if ('u_index' in $$props) $$invalidate(2, u_index = $$props.u_index);
    		if ('active_procs' in $$props) $$invalidate(46, active_procs = $$props.active_procs);
    		if ('active_identity' in $$props) active_identity = $$props.active_identity;
    		if ('known_procs' in $$props) $$invalidate(0, known_procs = $$props.known_procs);
    		if ('all_proc_data' in $$props) all_proc_data = $$props.all_proc_data;
    		if ('active_proc_name' in $$props) $$invalidate(10, active_proc_name = $$props.active_proc_name);
    		if ('running_color' in $$props) $$invalidate(11, running_color = $$props.running_color);
    		if ('running_state' in $$props) $$invalidate(12, running_state = $$props.running_state);
    		if ('admin_pass' in $$props) $$invalidate(13, admin_pass = $$props.admin_pass);
    		if ('manifest_selected_entry' in $$props) $$invalidate(47, manifest_selected_entry = $$props.manifest_selected_entry);
    		if ('manifest_selected_form' in $$props) manifest_selected_form = $$props.manifest_selected_form;
    		if ('manifest_contact_form_list' in $$props) $$invalidate(84, manifest_contact_form_list = $$props.manifest_contact_form_list);
    		if ('manifest_obj' in $$props) $$invalidate(85, manifest_obj = $$props.manifest_obj);
    		if ('manifest_index' in $$props) $$invalidate(86, manifest_index = $$props.manifest_index);
    		if ('man_cwid' in $$props) $$invalidate(48, man_cwid = $$props.man_cwid);
    		if ('active' in $$props) $$invalidate(1, active = $$props.active);
    		if ('prev_active' in $$props) $$invalidate(49, prev_active = $$props.prev_active);
    		if ('todays_date' in $$props) $$invalidate(22, todays_date = $$props.todays_date);
    		if ('individuals' in $$props) $$invalidate(87, individuals = $$props.individuals);
    		if ('selected' in $$props) $$invalidate(50, selected = $$props.selected);
    		if ('empty_identity' in $$props) $$invalidate(89, empty_identity = $$props.empty_identity);
    		if ('show_dialog' in $$props) $$invalidate(14, show_dialog = $$props.show_dialog);
    		if ('add_promise' in $$props) add_promise = $$props.add_promise;
    		if ('show_update_dialog' in $$props) $$invalidate(15, show_update_dialog = $$props.show_update_dialog);
    		if ('add_update_promise' in $$props) add_update_promise = $$props.add_update_promise;
    		if ('show_conf_dialog' in $$props) $$invalidate(16, show_conf_dialog = $$props.show_conf_dialog);
    		if ('add_conf_promise' in $$props) add_conf_promise = $$props.add_conf_promise;
    		if ('show_exec_dialog' in $$props) $$invalidate(17, show_exec_dialog = $$props.show_exec_dialog);
    		if ('add_exec_promise' in $$props) add_exec_promise = $$props.add_exec_promise;
    		if ('show_npm_dialog' in $$props) $$invalidate(18, show_npm_dialog = $$props.show_npm_dialog);
    		if ('add_npm_promise' in $$props) add_npm_promise = $$props.add_npm_promise;
    		if ('npm_action' in $$props) $$invalidate(19, npm_action = $$props.npm_action);
    		if ('active_proc_data' in $$props) $$invalidate(20, active_proc_data = $$props.active_proc_data);
    		if ('current_index' in $$props) $$invalidate(51, current_index = $$props.current_index);
    		if ('creation_to_do' in $$props) creation_to_do = $$props.creation_to_do;
    		if ('window_scale' in $$props) window_scale = $$props.window_scale;
    		if ('edit_popup_scale' in $$props) edit_popup_scale = $$props.edit_popup_scale;
    		if ('all_window_scales' in $$props) all_window_scales = $$props.all_window_scales;
    		if ('md' in $$props) $$invalidate(21, md = $$props.md);
    		if ('filtered_manifest_contact_form_list' in $$props) $$invalidate(52, filtered_manifest_contact_form_list = $$props.filtered_manifest_contact_form_list);
    		if ('filteredIndviduals' in $$props) $$invalidate(53, filteredIndviduals = $$props.filteredIndviduals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*filteredIndviduals*/ 4194304) {
    			$$invalidate(50, selected = i >= 0
    			? filteredIndviduals[i]
    			: empty_identity.identity());
    		}

    		if ($$self.$$.dirty[1] & /*selected*/ 524288) ;

    		if ($$self.$$.dirty[0] & /*known_procs, u_index*/ 5) {
    			//
    			$$invalidate(46, active_procs = known_procs[u_index]);
    		}

    		if ($$self.$$.dirty[1] & /*active_procs*/ 32768) {
    			{
    				if (active_procs) {
    					$$invalidate(10, active_proc_name = active_procs.proc_name);
    					window.set_user_title(active_procs.proc_name);
    					$$invalidate(20, active_proc_data = Object.assign({}, active_procs));

    					if (!active_procs.running) {
    						$$invalidate(11, running_color = "darkred");
    						$$invalidate(12, running_state = "stopped");
    					} else {
    						$$invalidate(11, running_color = "green");
    						$$invalidate(12, running_state = "running");
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*active_procs*/ 32768) ;

    		if ($$self.$$.dirty[0] & /*u_index*/ 4 | $$self.$$.dirty[1] & /*current_index*/ 1048576) {
    			{
    				if (current_index !== u_index) {
    					$$invalidate(51, current_index = u_index);
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*filtered_manifest_contact_form_list, manifest_selected_entry, man_cwid*/ 2293760) {
    			{
    				$$invalidate(47, manifest_selected_entry = filtered_manifest_contact_form_list[manifest_index]);

    				if (manifest_selected_entry !== undefined && manifest_selected_entry) {
    					manifest_selected_form = manifest_selected_entry.html;
    					man_title = manifest_selected_entry.info;
    					man_max_preference = manifest_obj.max_preference;
    					man_preference = manifest_selected_entry.preference;
    					$$invalidate(48, man_cwid = manifest_selected_entry.cwid);
    					man_contact_is_default = man_cwid === manifest_obj.default_contact_form;
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*active*/ 2 | $$self.$$.dirty[1] & /*prev_active*/ 262144) {
    			{

    				$$invalidate(49, prev_active = active);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*u_index*/ 4 | $$self.$$.dirty[1] & /*active_procs*/ 32768) {
    			{
    				creation_to_do = u_index === false || active_procs && active_procs.biometric === undefined;

    				if (typeof active_cwid === "string" && active_cwid.length === 0) {
    					creation_to_do = true;
    				}
    			}
    		}
    	};

    	$$invalidate(53, filteredIndviduals = prefix
    	? individuals.filter(individual => {
    			const name = `${individual.name}`;
    			return name.toLowerCase().startsWith(prefix.toLowerCase());
    		})
    	: individuals);

    	$$invalidate(52, filtered_manifest_contact_form_list = man_prefix
    	? manifest_contact_form_list.filter(man_contact => {
    			const name = `${man_contact.name}`;
    			return name.toLowerCase().startsWith(man_prefix.toLowerCase());
    		})
    	: manifest_contact_form_list);

    	return [
    		known_procs,
    		active,
    		u_index,
    		dialog_data,
    		conf_dialog_data,
    		exec_dialog_data,
    		npm_dialog_data,
    		dialog_update_data,
    		password_view_type,
    		console_output,
    		active_proc_name,
    		running_color,
    		running_state,
    		admin_pass,
    		show_dialog,
    		show_update_dialog,
    		show_conf_dialog,
    		show_exec_dialog,
    		show_npm_dialog,
    		npm_action,
    		active_proc_data,
    		md,
    		todays_date,
    		onCancel,
    		onOkay,
    		onUpdateCancel,
    		onUpdateOkay,
    		onConfCancel,
    		onConfOkay,
    		onExecCancel,
    		onExecOkay,
    		onNpmCancel,
    		onNpmOkay,
    		restart_proc,
    		run_proc,
    		stop_proc,
    		stopall,
    		remove_entry,
    		reload_all,
    		add_entry,
    		update_entry,
    		edit_app_config,
    		run_command,
    		npm_install,
    		npm_remove,
    		toggle_password_view,
    		active_procs,
    		manifest_selected_entry,
    		man_cwid,
    		prev_active,
    		selected,
    		current_index,
    		filtered_manifest_contact_form_list,
    		filteredIndviduals,
    		tabbar_active_binding,
    		input_input_handler,
    		input_input_handler_1,
    		select_change_handler,
    		input_input_handler_2,
    		input_input_handler_3,
    		textarea_input_handler,
    		makeentrydialog0_admin_pass_binding,
    		editconfdialog_conf_dialog_data_binding,
    		editconfdialog_admin_pass_binding,
    		execdialog_exec_dialog_data_binding,
    		execdialog_admin_pass_binding,
    		npmdialog_npm_dialog_data_binding,
    		npmdialog_admin_pass_binding,
    		makeentrydialog1_admin_pass_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.getElementById('app-main'),
    	props: {
    		name: 'My Blog With Grid'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
