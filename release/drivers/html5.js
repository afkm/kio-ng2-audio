"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rx = require("rxjs");
var states_enum_1 = require("../states.enum");
/**
 * Kio audio interface implementation with HTML5
 */
var AudioPlayer = (function () {
    function AudioPlayer(source) {
        var _this = this;
        /**
         * observable wrapped HTML5 event emitters
         */
        this.events = {
            progress: new core_1.EventEmitter(),
            metadata: new core_1.EventEmitter(),
            ready: new core_1.EventEmitter(),
            loadstart: new core_1.EventEmitter(),
            durationchange: new core_1.EventEmitter(),
            loadedmetadata: new core_1.EventEmitter(),
            loadeddata: new core_1.EventEmitter(),
            timeupdate: new core_1.EventEmitter(),
            canplay: new core_1.EventEmitter(),
            ended: new core_1.EventEmitter(),
            play: new core_1.EventEmitter(),
            pause: new core_1.EventEmitter(),
            canplaythrough: new core_1.EventEmitter()
        };
        /**
         * audio state observable
         */
        this.audioStates = Rx.Observable.merge(this.events.loadstart.mapTo(states_enum_1.AudioState.loading), this.events.metadata.mapTo(states_enum_1.AudioState.loading), this.events.loadedmetadata.mapTo(states_enum_1.AudioState.ready), this.events.loadeddata.mapTo(states_enum_1.AudioState.ready), this.events.ready.mapTo(states_enum_1.AudioState.ready), this.events.play.mapTo(states_enum_1.AudioState.playing), this.events.pause.mapTo(states_enum_1.AudioState.ready), this.events.ended.mapTo(states_enum_1.AudioState.finished)).scan(function (prev, next, idx) {
            if (next <= states_enum_1.AudioState.idle) {
                // resetting is always possible    
                return next;
            }
            if (prev === states_enum_1.AudioState.playing && next === states_enum_1.AudioState.ready) {
                // pausing
                return next;
            }
            return Math.max(prev, next);
        });
        /**
         * emits pairs of number values;
         *   first value: current time
         *   second value: total duration
         */
        this.progress = Rx.Observable.merge(this.events.timeupdate, this.events.loadedmetadata, this.events.pause, this.events.ended)
            .map(function (event) {
            return [_this._audioRef.currentTime, _this._audioRef.duration];
        });
        this._eventSubscriptions = {};
        this._isPlaying = false;
        this._isReady = false;
        this._isFinished = false;
        this._audioState = states_enum_1.AudioState.idle;
        this._stateSubscription = this.audioStates.subscribe(function (nextState) {
            _this._audioState = nextState;
            _this._isPlaying = (_this._audioState === states_enum_1.AudioState.playing);
            _this._isReady = (_this._audioState === states_enum_1.AudioState.loading || _this._audioState === states_enum_1.AudioState.finished);
            _this._isFinished = (_this._audioState === states_enum_1.AudioState.finished);
        });
        if (source) {
            this.setSource(source);
        }
    }
    Object.defineProperty(AudioPlayer.prototype, "paused", {
        /** getter */
        //get events() { return this._events }
        get: function () {
            return !this._isPlaying;
            //return this._audioRef && !this._audioRef.paused
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "isPlaying", {
        get: function () {
            return this._isPlaying;
            //return this._audioRef && !this._audioRef.paused
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "isReady", {
        get: function () {
            return this._audioRef && this._audioRef.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioPlayer.prototype, "isFinished", {
        get: function () {
            return this._audioRef && this._audioRef.currentTime >= this._audioRef.duration;
        },
        enumerable: true,
        configurable: true
    });
    AudioPlayer.prototype.play = function () {
        this._audioRef.play();
    };
    AudioPlayer.prototype.pause = function () {
        if (this._audioRef) {
            this._audioRef.pause();
        }
    };
    AudioPlayer.prototype.reset = function () {
        this.pause();
        this._audioRef.currentTime = 0;
    };
    AudioPlayer.prototype.setSource = function (audioSource) {
        if (this._source) {
            this.reset();
            this.unsubscribeEvents();
        }
        this._source = audioSource;
        if (!this._audioRef) {
            this.setupAudioElement(this._source);
        }
        else {
            this._audioRef.src = this._source.url;
        }
    };
    AudioPlayer.prototype.setupAudioElement = function (source) {
        this._audioRef = new Audio(source.url);
        this._bindEvents();
    };
    AudioPlayer.prototype.bindEvent = function (eventName) {
        var _this = this;
        //this.events[eventName] = new EventEmitter<Event>()
        this._eventSubscriptions[eventName] = Rx.Observable.fromEvent(this._audioRef, eventName).subscribe(function (event) {
            _this.events[eventName].emit(event);
        }, function (error) {
            console.error("Failed to forward event \"" + eventName + "\" with error: " + error);
        });
    };
    AudioPlayer.prototype.unsubscribeEvents = function () {
        for (var eventName in this._eventSubscriptions) {
            if (!this._eventSubscriptions[eventName])
                return;
            this._eventSubscriptions[eventName].unsubscribe();
            this._eventSubscriptions[eventName] = undefined;
        }
    };
    AudioPlayer.prototype._bindEvents = function () {
        var eventName;
        for (eventName in this.events) {
            this.bindEvent(eventName);
        }
    };
    return AudioPlayer;
}());
exports.AudioPlayer = AudioPlayer;
//# sourceMappingURL=html5.js.map