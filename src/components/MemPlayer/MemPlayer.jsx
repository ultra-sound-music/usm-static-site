import React from "react";
import cn from 'classnames';
import pThrottle from 'p-throttle';
import { ethers } from "ethers";
import * as Tone from 'tone'

import * as styles from './MemPlayer.scss';

const throttle = pThrottle({
  limit: 1,
  interval: 250
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

class MemPlayer extends React.Component {
  state = {
    transactions: [],
    soundKeys: Array.from({length: 5}, () => false),
    isStreaming: false
  }

  componentDidMount() {
    const url = `${process.env.GATSBY_WS_URL}`;

    this.processTransaction = throttle(this.onPendingTransaction);
    this.synths = [new Tone.Synth().toDestination(), new Tone.AMSynth().toDestination(), new Tone.FMSynth().toDestination(), new Tone.MembraneSynth().toDestination(), new Tone.PolySynth().toDestination()];
    this.provider = new ethers.providers.WebSocketProvider(url);
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

    // console.log(`note: ${note}${octave}`, `count: ${count}`);
    const availableSynths = this.synths.filter((synth, index) => this.state.soundKeys[index])

    if (availableSynths.length) {
      availableSynths[noteIndex % availableSynths.length].triggerAttackRelease(`${note}${octave}`, `${count}n`);
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

  toggleKey = (keyId) => {
    const soundKeys = this.state.soundKeys.map((isOn, id) => {
      if (keyId === id) {
        return !isOn;
      }

      return isOn;
    });

    this.setState({ soundKeys });
  }

  toggleStream = () => {
    const startStreaming = !this.state.isStreaming;
    if (startStreaming) {
      this.provider.on('pending', this.processTransaction);      
    } else {
      this.provider.off('pending', this.processTransaction);
    }

    this.setState({
      isStreaming: startStreaming
    });
  }

  renderKey = (isOn, keyId) => {
    const keyState = isOn ? 'on' : 'off';
    const className = cn(styles.soundKey, styles[`soundKey__${keyState}`]);

    return (
      <div key={keyId} className={className} onClick={() => this.toggleKey(keyId)}></div>
    );
  }

  renderTranscactionId = ({ txId, noteStart, noteEnd }, i) => {
    const arr = [];
    if (i === 0) {
      arr.push(<span> &gt; </span>);
    } else {
      arr.push(<span>&nbsp;&nbsp;&nbsp;</span>)
    }
    arr.push(<span key="1">{txId.slice(0, noteStart)}</span>);
    arr.push(<span key="2" className={styles.highlight}>{txId.slice(noteStart, noteEnd + 1)}</span>);
    arr.push(<span key="3">{txId.slice(noteEnd + 1)}</span>);
    return <li key={i} className={styles.txItem}>{arr}</li>;
  }

  render() {
    const {
      isStreaming
    } = this.state;

    const playButtonText = isStreaming ? 'Stop' : 'Play';

    return (
      <div className='MemPlayer'>
        <div className={styles.title}>Play the Mempool</div>
        <div className='controls'>
          <div className={styles.keyboard}>
            {this.state.soundKeys.map(this.renderKey)}      
          </div>
          <div className={styles.player}>
            <button className={styles.playButton} onClick={this.toggleStream}>{playButtonText}</button>
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