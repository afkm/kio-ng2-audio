import { EventEmitter } from '@angular/core';
import * as Rx from 'rxjs';
export interface AudioSource {
    mimeType: string;
    url: string;
}
export declare type AudioEvents = 'progress' | 'metadata' | 'ready' | 'loadstart' | 'durationchange' | 'loadedmetadata' | 'loadeddata' | 'timeupdate' | 'canplay' | 'ended' | 'play' | 'pause' | 'canplaythrough';
export declare type AudioEventMap<T> = {
    [K in AudioEvents]?: T;
};
export declare type AudioEventEmitters = AudioEventMap<EventEmitter<Event>>;
export declare type AudioEventSubscriptions = AudioEventMap<Rx.Subscription>;
