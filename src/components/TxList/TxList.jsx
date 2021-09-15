import React from 'react';

import TxItem from '../TxItem/TxItem';

export default ({ transactions }) => {
  return (
    <ul className='txList'>{transactions.map((transaction, i) => <TxItem key={transaction.txId} {...transaction} isFirstInList={i === 0} />)}</ul>
  )  
}