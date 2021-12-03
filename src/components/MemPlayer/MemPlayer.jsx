import React from "react";
import cn from 'classnames';
import pThrottle from 'p-throttle';
import { ethers } from "ethers";
import * as Tone from 'tone';

import TxList from '../TxList/TxList';

import * as styles from './MemPlayer.scss';

const WEBSOCKET_URL = process.env.GATSBY_WS_URL;
const availableSounds = [Tone.Synth, Tone.AMSynth, Tone.FMSynth, Tone.MembraneSynth, Tone.PolySynth, Tone.Synth, Tone.AMSynth, Tone.FMSynth, Tone.MembraneSynth, Tone.PolySynth, Tone.MembraneSynth, Tone.PolySynth];

const throttle = pThrottle({
  limit: 1,
  interval: 250
});

function getRandomInt(min, max, exclude) {
  if (min === max - 1) return min;

  min = Math.ceil(min);
  max = Math.floor(max);
  const int = Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  if (int === exclude) {
    return getRandomInt(min, max, exclude);
  }

  return int;
}

class MemPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.addSoundButtonRef = React.createRef();
    this.soundKeyRef = React.createRef();
  }

  state = {
    transactions: [],
    activeKeys: [],
    soundKeys: [],
    isStreaming: false,
    highlighAddButton: false,
    keyToHighlight: null
  }

  componentDidMount() {
    this.processTransaction = throttle(this.onPendingTransaction);
    this.provider = new ethers.providers.WebSocketProvider(WEBSOCKET_URL);
  }

  componentWillUnmount() {
    this.provider.off('pending', this.processTransaction);
  }

  onPendingTransaction = (txId, error) => {
    const {
      isStreaming,
      soundKeys,
      activeKeys,
      transactions
    } = this.state;

    if (error) {
      console.error(error);
      return;
    }

    const isDupe = transactions.includes(txId);
    if (!isStreaming || isDupe) {
      return;
    }

    let noteIndex;
    let octaveIndex;
    let keyToHighlight;
    const availableSynths = soundKeys.filter((synth, index) => activeKeys.includes(index));
    if (availableSynths.length) {
      noteIndex = txId.search(/[abcdef]/);
      const note = txId[noteIndex];
      const newStr = txId.slice(noteIndex + 1);
      octaveIndex = newStr.search(/[01234]/);
      const octave = newStr[octaveIndex];
  
      const counts = [4, 8, 16, 32, 64];
      const count = counts[getRandomInt(0, 4)];
      const availableSynthIndex = noteIndex % availableSynths.length;
      const synth = availableSynths[availableSynthIndex];
      keyToHighlight = soundKeys.indexOf(synth)
      
      console.debug(`note: ${note}${octave}`, `count: ${count}`);
      synth.triggerAttackRelease(`${note}${octave}`, `${count}n`);      
    }
  
    const txObj = {
      txId,
      noteStart: noteIndex,
      noteEnd: noteIndex + octaveIndex + 1
    }

    this.setState({
      keyToHighlight,
      transactions: [txObj].concat(transactions).slice(0, 10)
    });  
  }

  trackPlayEvent() {
    if (!window.gtag) {
      return;
    }

    window.gtag('event', 'play_memplayer', {
      num_keys: this.state.soundKeys?.length,
      num_keys_active: this.state.activeKeys?.length
    });
  }

  resetHighlightAnimation(el) {
    el.style.animation = 'none';
    /* eslint-disable no-unused-expressions */
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null;
  }

  highlightAddButton = () => {
    this.resetHighlightAnimation(this.addSoundButtonRef.current);
    if (this.state.highlighAddButton) return;

    this.setState({
      highlighAddButton: true
    });
  }

  highlightAndPlaySound = () => {
    const {
      soundKeys,
      keyToHighlight
    } = this.state;

    const keyId = getRandomInt(0, soundKeys.length, keyToHighlight);
    this.setState({
      keyToHighlight: keyId
    });

    soundKeys[keyId].triggerAttackRelease(`f${(keyId % 3) + 2}`, '32n');
  }

  startStream = () => {
    this.trackPlayEvent();
    this.setState({
      isStreaming: true
    });
    
    this.provider.on('pending', this.processTransaction);
    if (![WebSocket.OPEN, WebSocket.OPENING].includes(this.provider._websocket.readyState)) {
      this.provider.off('pending', this.processTransaction);
      this.setState({ isStreaming: false });
      alert('This session has ended please refresh and try again')
    }
  }

  stopStream = () => {
    this.setState({
      keyToHighlight: null,
      isStreaming: false      
    });

    this.provider.off('pending', this.processTransaction);
  }

  toggleStream = () => {
    const {
      soundKeys,
      activeKeys,
      isStreaming
    } = this.state;

    if (soundKeys.length <= 0) {
      this.highlightAddButton();
      return;
    }

    if (activeKeys.length <= 0 && !isStreaming) {
      this.highlightAndPlaySound();
      return;
    }

    if (!isStreaming) {
      this.startStream();
    } else {
      this.stopStream()
    }
  }  

  deActivateKey = (keyId) => {
    const activeKeys = this.state.activeKeys.filter((id) => id !== keyId);
    this.setState({ activeKeys });
  }

  activateKey = (keyId) => {
    const activeKeys = Array.from(this.state.activeKeys);
    activeKeys.push(keyId);;
    this.setState({ activeKeys });
  }

  toggleKey = (keyId) => {
    const isActivate = this.state.activeKeys.includes(keyId);
    isActivate ? this.deActivateKey(keyId) : this.activateKey(keyId);
  }

  getRandomSound = () => {
    const {
      soundKeys
    } = this.state;

    const unusedSounds = availableSounds.filter((sound) => {
      return !soundKeys.some((key) => key instanceof sound);
    });

    if (unusedSounds.length === 0) {
      return Tone.Synth;
    }

    return unusedSounds[getRandomInt(0, unusedSounds.length)];
  }

  addSound = () => {
    if (this.state.soundKeys.length >= 12) {
      return;
    }
        
    const soundKeys = Array.from(this.state.soundKeys);
    const sound = this.getRandomSound();
    soundKeys.push(new sound().toDestination());
    this.setState({ soundKeys });
  }

  removeSound = () => {
    const {
      soundKeys
    } = this.state;

    if (soundKeys.length <= 0) {
      return;
    }

    const keyIdToBeRemoved = soundKeys.length - 1;
    this.deActivateKey(keyIdToBeRemoved);

    const newSoundKeys = soundKeys.slice(0, soundKeys.length  - 1);
    if (newSoundKeys.length <= 0) {
      this.stopStream();
    }
    this.setState({ soundKeys: newSoundKeys });
  }

  renderKey = (sound, keyId) => {
    const {
      activeKeys
    } = this.state;

    const keyState = !!activeKeys.includes(keyId) ? 'on' : 'off';
    const className = cn(styles.soundKey, styles[`soundKey__${keyState}`], {[styles.soundKey__flash]: this.state.keyToHighlight === keyId});

    return (
      <div key={keyId} className={className} onClick={() => this.toggleKey(keyId)}><div className={styles.wrapper}></div></div>
    );
  }

  render() {
    const {
      isStreaming,
      transactions
    } = this.state;

    const addSoundButtonClass = cn(styles.editSoundsButton, {[styles.addSoundButton__highlight]: this.state.highlighAddButton})
    const playButtonIsDisabled = this.state.activeKeys.length === 0 && !this.state.isStreaming;
    const playButtonClass = cn(styles.playButton, {[styles.playButton__disabled]: playButtonIsDisabled})
    const playButtonText = isStreaming ? 'Stop' : 'Play';

    return (
      <div className='MemPlayer'>
        <div className={styles.title}>
          <span className={styles.editSoundsButton} onClick={this.removeSound}>-</span>
          <span>Play the Mempool</span>
          <span className={addSoundButtonClass} onClick={this.addSound} ref={this.addSoundButtonRef}>+</span>
        </div>
        <div className='controls'>
          <div className={styles.keyboard} ref={this.soundKeyRef}>
            {this.state.soundKeys.map(this.renderKey)}      
          </div>
          <div className={styles.player}>
            <button className={playButtonClass} onClick={this.toggleStream}>{playButtonText}</button>
          </div>
        </div>
        <pre>
          <code className={styles.feed}><TxList transactions={transactions} /></code>
        </pre>
      </div>
    );    
  }
}

export default MemPlayer;