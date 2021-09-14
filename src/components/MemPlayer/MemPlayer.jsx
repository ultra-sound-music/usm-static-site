import React from "react";
import cn from 'classnames';
import pThrottle from 'p-throttle';
import { ethers } from "ethers";
import * as Tone from 'tone'

import * as styles from './MemPlayer.scss';

const WEBSOCKET_URL = process.env.GATSBY_WS_URL;
const availableSounds = [Tone.Synth, Tone.AMSynth, Tone.FMSynth, Tone.MembraneSynth, Tone.PolySynth, Tone.Synth, Tone.AMSynth, Tone.FMSynth, Tone.MembraneSynth, Tone.PolySynth, Tone.MembraneSynth, Tone.PolySynth];

const throttle = pThrottle({
  limit: 1,
  interval: 250
});

function getRandomInt(min, max, exclude) {
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
    this.defaultSound = new Tone.PolySynth().toDestination();
    this.addSoundButtonRef = React.createRef();
    this.soundKeyRef = React.createRef();
  }

  state = {
    transactions: [],
    activeKeys: [],
    soundKeys: [],
    isStreaming: false,
    highlighAddButton: false
  }

  componentDidMount() {
    this.processTransaction = throttle(this.onPendingTransaction);
    this.provider = new ethers.providers.WebSocketProvider(WEBSOCKET_URL);
  }

  componentWillUnmount() {
    this.provider.off('pending', this.processTransaction);
  }

  onPendingTransaction = (txId, error) => {
    if (error) {
      return;
    }

    if (!this.state.isStreaming) {
      return;
    }

    const noteIndex = txId.search(/[abcdef]/);
    const note = txId[noteIndex];
    const newStr = txId.slice(noteIndex + 1);
    const octaveIndex = newStr.search(/[01234]/);
    const octave = newStr[octaveIndex];

    const counts = [4, 8, 16, 32, 64];
    const count = counts[getRandomInt(0, 4)];

    console.debug(`note: ${note}${octave}`, `count: ${count}`);
    const availableSynths = this.state.soundKeys.filter((synth, index) => this.state.activeKeys.includes(index));

    if (availableSynths.length) {
      const availableSynthIndex = noteIndex % availableSynths.length;
      const synth = availableSynths[availableSynthIndex];
      const keyId = this.state.soundKeys.indexOf(synth);
      
      this.flashSoundKeyById(keyId);
      synth.triggerAttackRelease(`${note}${octave}`, `${count}n`);
    }
  
    const txObj = {
      txId,
      noteStart: noteIndex,
      noteEnd: noteIndex + octaveIndex + 1
    }

    this.setState({
      transactions: [txObj].concat(this.state.transactions).slice(0, 15)
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

  flashSoundKeyById = (keyId) => {
    const children = this.soundKeyRef.current.children;

    const keyEls = Array.from(children);
    keyEls.forEach((el, i) => { 
        el.classList.remove(styles.soundKey__flash);
    })
    
    children[keyId].classList.add(styles.soundKey__flash);
  }

  highlightSoundKeyAndPlaySound = () => {
    const keyEls = Array.from(this.soundKeyRef.current.children);
    let excludeIndex;
    keyEls.forEach((el, i) => {
      if (el.classList.contains(styles.addSoundButton__highlight)) {
        excludeIndex = i;
        el.classList.remove(styles.addSoundButton__highlight);
      }
    })
    
    const keyId = getRandomInt(0, keyEls.length, excludeIndex);
    this.state.soundKeys[keyId].triggerAttackRelease(`f${(keyId % 3) + 2}`, '32n');
    this.soundKeyRef.current.children[keyId].classList.add(styles.addSoundButton__highlight);
  }  

  toggleStream = () => {
    if (this.state.soundKeys.length <= 0) {
      this.highlightAddButton();
      return;
    }

    if (this.state.activeKeys.length <= 0) {
      this.highlightSoundKeyAndPlaySound();
      return;
    }

    const startStreaming = !this.state.isStreaming;
    if (startStreaming) {
      if (this.state.soundKeys.length <= 0) {
        return;
      }

      this.provider.on('pending', this.processTransaction);
      if (![WebSocket.OPEN, WebSocket.OPENING].includes(this.provider._websocket.readyState)) {
        this.provider.off('pending', this.processTransaction);
        alert('This session has ended please refresh and try again')
        return;
      }
    } else {
      const keyEls = Array.from(this.soundKeyRef.current.children);
      keyEls.forEach((el, i) => {
        if (el.classList.contains(styles.soundKey__flash)) {
          el.classList.remove(styles.soundKey__flash);
        }
      })

      this.provider.off('pending', this.processTransaction);
    }

    this.setState({
      isStreaming: startStreaming
    });
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
    if (this.state.soundKeys.length <= 0) {
      return;
    }

    const keyIdToBeRemoved = this.state.soundKeys.length - 1;
    this.deActivateKey(keyIdToBeRemoved);

    const soundKeys = this.state.soundKeys.slice(0, this.state.soundKeys.length  - 1);
    this.setState({ soundKeys });
  }

  renderKey = (sound, keyId, soundKeys) => {
    const {
      activeKeys
    } = this.state;

    const keyState = !!activeKeys.includes(keyId) ? 'on' : 'off';
    const className = cn(styles.soundKey, styles[`soundKey__${keyState}`]);

    return (
      <div key={keyId} className={className} onClick={() => this.toggleKey(keyId)}></div>
    );
  }

  renderTranscactionId = ({ txId, noteStart, noteEnd }, i) => {
    const arr = [];
    if (i === 0) {
      arr.push(<span key="0"> &gt; </span>);
    } else {
      arr.push(<span key="0">&nbsp;&nbsp;&nbsp;</span>)
    }

    const anchorProps = {
      target: '_blank',
      rel: 'noreferrer'
    };

    if (process.env.GATSBY_ETH_EXPLORER) {
      anchorProps.href = `${process.env.GATSBY_ETH_EXPLORER}${txId}`;
    }

    arr.push(<span key="1">{txId.slice(0, noteStart)}</span>);
    arr.push(<span key="2" className={styles.highlight}>{txId.slice(noteStart, noteEnd + 1)}</span>);
    arr.push(<span key="3">{txId.slice(noteEnd + 1)}</span>);
    return <li key={i} className={styles.txItem}><a {...anchorProps}>{arr}</a></li>;
  }

  render() {
    const {
      isStreaming
    } = this.state;

    const addSoundButtonClass = cn(styles.editSoundsButton, {[styles.addSoundButton__highlight]: this.state.highlighAddButton})
    const playButtonIsDisabled = this.state.activeKeys.length === 0 && !this.state.isStreaming;
    const playButtonClass = cn(styles.playButton, {[styles.playButton__disabled]: playButtonIsDisabled})
    const playButtonText = isStreaming ? 'Stop' : 'Play';
    return (
      <div className='MemPlayer'>
        <div className={styles.title}><span className={styles.editSoundsButton} onClick={this.removeSound}>-</span> Play the Mempool <span className={addSoundButtonClass} onClick={this.addSound} ref={this.addSoundButtonRef}>+</span></div>
        <div className='controls'>
          <div className={styles.keyboard} ref={this.soundKeyRef}>
            {this.state.soundKeys.map(this.renderKey)}      
          </div>
          <div className={styles.player}>
            <button className={playButtonClass} onClick={this.toggleStream}>{playButtonText}</button>
          </div>
        </div>
        <pre>
          <code className={styles.feed}>
            <ul className='txList'>
              {this.state.transactions.map(this.renderTranscactionId)}
            </ul>
          </code>
        </pre>
      </div>
    );    
  }
}

export default MemPlayer;