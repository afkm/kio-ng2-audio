import { EventEmitter } from '@angular/core'
import * as Rx from 'rxjs'
import { AudioSource, AudioEvents, AudioEventEmitters, AudioEventSubscriptions } from '../interfaces'
import { AudioState } from '../states.enum'

export class AudioPlayer {

  constructor(source? : AudioSource){
    if ( source )
    {
      this.setSource(source)
    }
  }

  readonly events : AudioEventEmitters = {
      progress: new EventEmitter<Event>(),
      metadata: new EventEmitter<Event>(),
      ready: new EventEmitter<Event>(),
      loadstart: new EventEmitter<Event>(),
      durationchange: new EventEmitter<Event>(),
      loadedmetadata: new EventEmitter<Event>(),
      loadeddata: new EventEmitter<Event>(),
      timeupdate: new EventEmitter<Event>(),
      canplay: new EventEmitter<Event>(),
      ended: new EventEmitter<Event>(),
      play: new EventEmitter<Event>(),
      pause: new EventEmitter<Event>(),
      canplaythrough: new EventEmitter<Event>()
    }
  
  public audioStates : Rx.Observable<AudioState> = Rx.Observable.merge (
    this.events.loadstart.mapTo(AudioState.loading),
    this.events.metadata.mapTo(AudioState.loading),
    this.events.loadedmetadata.mapTo(AudioState.ready),
    this.events.loadeddata.mapTo(AudioState.ready),
    this.events.ready.mapTo(AudioState.ready),
    this.events.play.mapTo(AudioState.playing),
    this.events.pause.mapTo(AudioState.ready),
    this.events.ended.mapTo(AudioState.finished)
  ).scan((prev, next, idx) => {

    if ( next <= AudioState.idle )
    {
      // resetting is always possible    
      return next
    }
    if ( prev === AudioState.playing && next === AudioState.ready )
    {
      // pausing
      return next
    }

    return Math.max(prev,next)
  })

  /**
   * emits pairs of number values; 
   *   first value: current time
   *   second value: total duration
   */
  public progress : Rx.Observable<[number,number]> = Rx.Observable.merge(
      this.events.timeupdate,
      this.events.loadedmetadata,
      this.events.pause,
      this.events.ended
    )
    .map ( event => {
      return [ this._audioRef.currentTime, this._audioRef.duration ]
    } 
  )

  private _eventSubscriptions : AudioEventSubscriptions = {}

  private _isPlaying : boolean=false
  private _isReady : boolean=false
  private _isFinished : boolean=false
  
  private _audioState : AudioState = AudioState.idle

  private _source : AudioSource
  private _audioRef : HTMLAudioElement


  /** getter */

  //get events() { return this._events }

  get isPlaying() : boolean {
    return this._isPlaying
    //return this._audioRef && !this._audioRef.paused
  }
  
  get isReady() : boolean {
    return this._audioRef && this._audioRef.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA
  }

  get isFinished() : boolean {
    return this._audioRef && this._audioRef.currentTime >= this._audioRef.duration
  }


  play() {
    this._audioRef.play()
  }
  
  pause() {
    if ( this._audioRef )
    {
      this._audioRef.pause()
    }
  }
  
  reset() {
    this.pause()
    this._audioRef.currentTime = 0
  }

  setSource ( audioSource : AudioSource ) {
    if ( !this._audioRef )
    {
      this.setupAudioElement (audioSource)
    }
    else 
    {
      this.reset()
      this._audioRef.src = audioSource.url
    }

  }

  private setupAudioElement (source : AudioSource) {
    this._audioRef = new Audio(source.url)
    this._bindEvents()
  }

  protected bindEvent ( eventName : AudioEvents ) {
    //this.events[eventName] = new EventEmitter<Event>()
    this._eventSubscriptions[eventName] = Rx.Observable.fromEvent<Event>(this._audioRef,eventName).subscribe ( 
      event => {
        this.events[eventName].emit(event)
      },
      error => {
        console.error ( `Failed to forward event "${eventName}" with error: ${error}` )
      }
    )
  }

  private unsubscribeEvents() {
    for ( var eventName in this._eventSubscriptions ) {
      this._eventSubscriptions[eventName].unsubscribe()
      this._eventSubscriptions[eventName] = undefined
    }
  }

  private _bindEvents () {
    let eventName : AudioEvents
    for ( eventName in this.events ) {
      this.bindEvent(eventName)
    }
  }

}