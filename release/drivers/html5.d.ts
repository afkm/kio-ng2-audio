import * as Rx from 'rxjs';
import { AudioSource, AudioEvents, AudioEventEmitters } from '../interfaces';
import { AudioState } from '../states.enum';
/**
 * Kio audio interface implementation with HTML5
 */
export declare class AudioPlayer {
    constructor(source?: AudioSource);
    /**
     * observable wrapped HTML5 event emitters
     */
    readonly events: AudioEventEmitters;
    /**
     * audio state observable
     */
    audioStates: Rx.Observable<AudioState>;
    /**
     * emits pairs of number values;
     *   first value: current time
     *   second value: total duration
     */
    progress: Rx.Observable<[number, number]>;
    private _eventSubscriptions;
    private _isPlaying;
    private _isReady;
    private _isFinished;
    private _audioState;
    private _source;
    private _audioRef;
    private _stateSubscription;
    /** getter */
    readonly paused: boolean;
    readonly isPlaying: boolean;
    readonly isReady: boolean;
    readonly isFinished: boolean;
    play(): void;
    pause(): void;
    reset(): void;
    setSource(audioSource: AudioSource): void;
    private setupAudioElement(source);
    protected bindEvent(eventName: AudioEvents): void;
    private unsubscribeEvents();
    private _bindEvents();
}
