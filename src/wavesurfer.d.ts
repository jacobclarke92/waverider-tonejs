/**
 * WARNING: it should export default WaveSurfer;
 * buit it doesn't
 * use * as WaveSurfer from "wavesurfer";
 */
declare module 'wavesurfer.js' {
	export type Disposer = () => void

	export interface WaveSurferOptions {
		/**
		 * Use your own previously initialized AudioContext or leave blank
		 */
		audioContext?: any

		/**
		 * Speed at which to play audio. Lower number is slower.
		 * @type: {float}
		 */
		audioRate?: number

		/**
		 * WebAudio or MediaElement.
		 * In most cases you don't have to set this manually. MediaElement is a fallback for unsupported browsers.
		 */
		backend?: 'WebAudio' | 'MediaElement'

		/**
		 * Height of the waveform bars. Higher number than 1 will increase the waveform bar heights.
		 */
		barHeight?: number | 1

		/**
		 * default: none
		 * If specified, the waveform will be drawn like this: ▁ ▂ ▇ ▃ ▅ ▂
		 */
		barWidth?: number

		/**
		 * 	@default: #333
		 *  The fill color of the cursor indicating the playhead position.
		 */
		cursorColor?: string

		/**
		 * @type: {integer}
		 * @default: 1
		 * Measured in pixels
		 */
		cursorWidth?: number
		/**
		 * @default: {true}
		 * Whether to fill the entire container or draw only according to minPxPerSec.
		 */
		fillParent?: boolean

		/**
		 * @type: {integer}
		 * @default: {128}
		 * The height of the waveform. Measured in pixels.
		 */
		height?: number

		/**
		 * @default: {false}
		 * Whether to hide the horizontal scrollbar when one would normally be shown
		 */
		hideScrollbar?: boolean

		/**
		 * @default: true
		 * Whether the mouse interaction will be enabled at initialization.
		 * You can switch this parameter at any time later on.
		 */
		interact?: boolean

		/**
		 * @type: {integer}
		 * @default: {4000}
		 * Maximum width of a single canvas in pixels,
		 * excluding a small overlap (2 * pixelRatio,
		 * rounded up to the next even integer).
		 * If the waveform is longer than this value,
		 * additional canvases will be used to render the waveform,
		 * which is useful for very large waveforms that may be too wide for browsers to draw on a single canvas.
		 * This parameter is only applicable to the MultiCanvas renderer
		 */
		maxCanvasWidth?: number

		/**
		 * @default: {"audio"}
		 * 'audio' or 'video'.
		 *  Only used with backend: 'MediaElement'
		 */
		mediaType?: 'audio' | 'video'

		/**
		 * 	@type: {integer}
		 *  @default: {50}
		 *  Minimum number of pixels per second of audio.
		 */
		minPxPerSec?: number

		/**
		 * @default: {false}
		 * If true, normalize by the maximum peak instead of 1.0.
		 */
		normalize?: boolean

		/**
		 * 	@type: {integer}
		 *  window.devicePixelRatio	Can be set to 1 for faster rendering.
		 */
		pixelRatio?: number

		/**
		 * @default: {"#555"}
		 * The fill color of the part of the waveform behind the cursor
		 */
		progressColor?: string

		/**
		 * 	Canvas The renderer object used to draw the waveform.
		 *  The MultiCanvas renderer can be used to render waveforms
		 *  that cannot fit on a single canvas due to browser limitations
		 */
		renderer?: string
		/**
		 * @default: {false}
		 * Whether to scroll the container with a lengthy waveform.
		 * Otherwise the waveform is shrunk to the container width (see fillParent).
		 */
		scrollParent?: boolean

		/**
		 * @type: {float}
		 * @default: {2}
		 * Number of seconds to skip with the skipForward() and skipBackward()
		 */
		skipLength?: number

		/**
		 * @type: {boolean}
		 * @default: {true}
		 */
		splitChannels?: boolean

		/**
		 * 	@default {"#999"}
		 * The fill color of the waveform after the cursor.
		 */
		waveColor?: string

		/**
		 * @default: {true}
		 * If a scrollbar is present, center the waveform around the progress
		 */
		autoCenter?: boolean
	}

	export interface WavesurferConstructorOptions extends WaveSurferOptions {
		/**
		 * CSS-selector or HTML-element
		 * where the waveform should be drawn.
		 * This is the only required parameter
		 */
		container: string | Element
	}

	/**
	 *    audioprocess: Fires continuously as the audio plays. Also fires on seeking.
	 *    error: Occurs on error. Callback will receive (string) error message.
	 *    finish: When it finishes playing.
	 *    loading: Fires continuously when loading via XHR or drag'n'drop.
	 *        Callback will receive (integer) loading progress in percents [0..100] and (object) event target.
	 *    pause: When audio is paused.
	 *    play: When play starts.
	 *    ready: When audio is loaded, decoded and the waveform drawn.
	 *        This fires before the waveform is drawn when using MediaElement, see waveform-ready.
	 *    scroll: When the scrollbar is moved. Callback will receive a ScrollEvent object.
	 *    seek: On seeking. Callback will receive (float) progress [0..1].
	 *    waveform-ready: Fires after the waveform is drawn when using the MediaElement backend.
	 *      If your using the WebAudio backend you can use ready.
	 *   zoom: On zooming. Callback will receive (integer) minPxPerSec.
	 */
	export type WavesurferEvent =
		| 'audioprocess'
		| 'error'
		| 'finish'
		| 'loading'
		| 'pause'
		| 'play'
		| 'ready'
		| 'scroll'
		| 'seek'
		| 'waveform-ready'
		| 'zoom'

	class WaveSurfer {
		constructor(options: WavesurferConstructorOptions)

		/**
		 *  Removes events, elements and disconnects Web Audio nodes.
		 */
		destroy(): void

		/**
		 * Clears the waveform as if a zero-length audio is loaded.
		 */
		empty(): void

		/**
		 * Returns base64 image uri
		 */
		exportImage(): string

		/**
		 * Returns current progress in seconds.
		 */
		getCurrentTime(): number

		/**
		 *  Returns the duration of an audio clip in seconds.
		 */
		getDuration(): number

		/**
		 * Returns the playback speed of an audio clip.
		 */
		getPlaybackRate(): number

		/**
		 * Returns the volume of the current audio clip.
		 */
		getVolume(): number //
		/**
		 * Returns the current mute status.
		 */
		getMute(): any //

		/**
		 * Returns an array of the current set filters.
		 */
		getFilters(): any[]

		/**
		 * Returns true if currently playing, false otherwise.
		 */
		isPlaying(): boolean

		/**
		 * Loads audio from URL via XHR.
		 * Optional array of peaks.
		 * Optional preload parameter [none|metadata|auto],
		 * parsed to the Audio element if using backend MediaElement.
		 */
		load(url: string, peaks?: any[], preload?: ['none' | 'metadata' | 'auto']): void

		/**
		 * Loads audio from a Blob or File object.
		 */
		loadBlob(blob: Blob): void

		/**
		 * Subscribes to an event. See WaveSurfer Events for the list of all events.
		 */
		on(eventName: WavesurferEvent, callback: (x?: any) => void): Disposer

		/**
		 * Unsubscribes from an event.
		 */
		un(eventName: WavesurferEvent, callback: (x?: any) => void): void
		/**
		 * Unsubscribes from all events.
		 */
		unAll(): void

		/**
		 * Stops playback.
		 */
		pause(): void

		/**
		 * Starts playback from the current position. Optional start and end measured in seconds can be used to set the range of audio to play.
		 */
		play(start: number, end: number): void

		/**
		 * Plays if paused, pauses if playing.
		 */
		playPause(): void

		/**
		 * Seeks to a progress and centers view [0..1] (0 = beginning, 1 = end).
		 */
		seekAndCenter(progress: number): void

		/**
		 * Seeks to a progress [0..1] (0 = beginning, 1 = end)
		 */
		seekTo(progress: number): void

		/**
		 *  For inserting your own WebAudio nodes into the graph. See Connecting Filters below.
		 */
		setFilter(filters: any[]): void

		/**
		 * Sets the speed of playback (0.5 is half speed, 1 is normal speed, 2 is double speed and so on).
		 */
		setPlaybackRate(rate: number): void

		/**
		 *  Sets the playback volume to a new value [0..1] (0 = silent, 1 = maximum).
		 */
		setVolume(newVolume: number): void

		/**
		 * Mute the current sound. Can be a boolean value of true to mute sound or false to unmute
		 */
		setMute(mute: boolean): void

		/**
		 * Skip a number of seconds from the current position (use a negative value to go backwards).
		 */
		skip(offset: number): void

		/**
		 * Rewind skipLength seconds.
		 */
		skipBackward(): void

		/**
		 * Skip ahead skipLength seconds.
		 */
		skipForward(): void

		/**
		 * Stops and goes to the beginning.
		 */
		stop(): void

		/**
		 * Toggles the volume on and off.
		 */
		toggleMute(): void

		/**
		 * Toggle mouse interaction.
		 */
		toggleInteraction(): void

		/**
		 * Toggles scrollParent.
		 */
		toggleScroll(): void

		/**
		 * Horizontally zooms the waveform in and out. The parameter is a number of horizontal pixels per second of audio. It also changes the parameter minPxPerSec and enables the scrollParent option.
		 */
		zoom(pxPerSec: number): void

		/**
		 * Initialise the wave
		 *
		 * @example
		 * var wavesurfer = new WaveSurfer(params);
		 * wavesurfer.init();
		 * @return {this}
		 */
		init(): void

		/*
		 * Factory
		 */
		static create(options: WaveSurferOptions): WaveSurfer
	}

	namespace WaveSurfer {}

	export default WaveSurfer

	// It's a wish: It doesn't export 'default' , while it's built from webpack as 'umd' ?
	// export default WaveSurfer;
}
