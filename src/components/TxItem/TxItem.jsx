import React from 'react';

import * as styles from './TxItem.scss';

export default ({ txId, noteStart, noteEnd, isFirstInList }) => {
  const anchorProps = {
    target: '_blank',
    rel: 'noreferrer'
  };

  if (process.env.GATSBY_ETH_EXPLORER) {
    anchorProps.href = `${process.env.GATSBY_ETH_EXPLORER}${txId}`;
  }

  const itemContent = (
    <>
      {isFirstInList ? <span> &gt; </span> : <span>&nbsp;&nbsp;&nbsp;</span>}
      <span>{txId.slice(0, noteStart)}</span>
      <span className={styles.highlight}>{txId.slice(noteStart, noteEnd + 1)}</span>
      <span>{txId.slice(noteEnd + 1)}</span>
    </>
  );

  return <li key={txId} className={styles.txItem}><a {...anchorProps}>{itemContent}</a></li>;
};
