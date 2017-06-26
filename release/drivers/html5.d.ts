import * as Rx from 'rxjs';
import { AudioSource, AudioEvents, AudioEventEmitters } from '../interfaces';
import { AudioState } from '../states.enum';
export declare class AudioPlayer {
    constructor(source?: AudioSource);
    readonly events: AudioEventEmitters;
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
    /** getter */
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
