import * as React from 'react';

import * as styles from './Button.scss';

const Button = ({ href }) => {
  return <a className={styles.Button} href={href} target='_blank' rel='noreferrer'>@usmproject</a>;
}

export default Button;