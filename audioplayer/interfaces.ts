import { EventEmitter } from '@angular/core'
import * as Rx from 'rxjs'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface AudioSource {
  mimeType:string
  url:string
}

export type AudioEvents = 'progress'|'metadata'|'ready'|'loadstart'|'durationchange'|'loadedmetadata'|'loadeddata'|'timeupdate'|'canplay'|'ended'|'play'|'pause'|'canplaythrough'

export type AudioEventMap<T> = {
  [K in AudioEvents]?: T
}

export type AudioEventEmitters = AudioEventMap<EventEmitter<Event>>
export type AudioEventSubscriptions = AudioEventMap<Rx.Subscription>
