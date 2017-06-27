import * as Rx from 'rxjs'
import { 
  Component, Input, 
  OnInit, OnChanges, OnDestroy,
  SimpleChanges, SimpleChange,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { AudioPlayer, AudioSource, AudioState } from 'kio-ng2-audio'


const getTime = (other:number=0) => (Date.now()-other)
const __TIME_START__ = getTime()
const formatTime = ( t:number|Date ) => {
  if ( t instanceof Date )
    return t.toJSON()
  const ms = t % 1000
  t = (t-ms)/1000
  return `${t}sec ${ms}ms`
}

const formatColor = ( color:string, weight:string='normal' ) => ( format:string, ...args:any[] ) => {
  return [ `%c${format}`, `color: ${color}; font-weight: ${weight};`, ...args ]
}

function logAction ( action:string ) {
  console.log ( '%s\t%c @%s', formatTime(getTime(__TIME_START__)), 'color: orange; font-weight: bold;' , action ) 
}

function logEvent ( eventName:string ) {
  console.log ( '%s\t%c %s event', formatTime(getTime(__TIME_START__)), 'color: green; font-weight: bold;' , eventName ) 
}

function logState ( state:string ) {
  console.log ( '%s\t%c state %s (%s)', formatTime(getTime(__TIME_START__)), 'color: red; font-weight: bold;' , state, AudioState[state] ) 
}


@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AudioPlayerComponent implements OnInit, OnDestroy, OnChanges {

  constructor(protected domSanitizer:DomSanitizer) { }

  @Input() audioSource:AudioSource

  audioState:AudioState=AudioState.idle
  audioStateLabel:string=AudioState[this.audioState]

  isPlaying:boolean=false
  progress:number=0
  currentTime:number=0
  duration:number=-1


  protected audioPlayer:AudioPlayer

  public onBtnPlay(event){
    logAction('play')
    this.audioPlayer.play()
  }

  public onBtnPause(event){
    logAction('pause')
    this.audioPlayer.pause()
  }

  public onBtnReset(event){
    logAction('reset')
    this.audioPlayer.reset()
  }

  private _updateState ( nextState ) {
    logState(nextState)
    this.audioState = nextState
    this.audioStateLabel = AudioState[this.audioState]
    this.isPlaying = nextState === AudioState.playing
  }

  private _playerSubscriptions:Rx.Subscription[]

  private _setupPlayer(){

    logAction('setupPlayer')

    const subscriptions:Rx.Subscription[] = []

    const audioPlayer = new AudioPlayer(this.audioSource)

    audioPlayer.events.loadstart.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.progress.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.metadata.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.ready.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.durationchange.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.loadedmetadata.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.loadeddata.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.timeupdate.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.canplay.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.ended.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.play.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.pause.subscribe ( event => this.logEvent(event) )
    audioPlayer.events.canplaythrough.subscribe ( event => this.logEvent(event) )


    const stateSubscription = audioPlayer.audioStates.subscribe ( nextState => {
      this.log(` AudioState.${AudioState[nextState]} (${nextState})`)
      this._updateState(nextState)
    }, console.error, () => {
      console.log('Audio states subscription finished.' )
    } )

    const progressSubscription = audioPlayer.progress.subscribe ( progress => {
      this.currentTime = progress[0]
      this.duration = progress[1]
      this.progress = (progress[0] / progress[1]) * 100
    } )

    this._playerSubscriptions = [ stateSubscription, progressSubscription ]
    this.audioPlayer = audioPlayer
  }
  
  private _releasePlayer(){
    logAction('releasePlayer')
    this._playerSubscriptions.forEach ( sub => sub.unsubscribe() )
    this._playerSubscriptions = undefined
    this.audioPlayer.reset()
  }

  private logEvent ( event:Event ) {
    logEvent(event.type)
    const target:HTMLAudioElement = <HTMLAudioElement>event.target
    /*console.groupCollapsed(`${event.type}`)
    console.log(event.target)
    console.groupEnd()*/
    this.log(`${event.timeStamp} @${event.type}`)
  }

  dev_logs:[string,string][]=[]

  private log ( text:string ) {
    const parts = text.split(' ')

    this.dev_logs.unshift ( [ parts.shift() , parts.join(' ') ] )
  }

  ngOnChanges ( changes:SimpleChanges ) {
    if ( 'audioSource' in changes )
    {
      const audioSourceChange:SimpleChange = changes.audioSource
      if ( audioSourceChange.previousValue )
      {
        this._releasePlayer()
      }
      if ( audioSourceChange.currentValue )
      {
        this._setupPlayer()
      }
    }
  }

  ngOnInit() {
    //this._setupPlayer()
  }

  ngOnDestroy() {
    this._releasePlayer()
  }

}
