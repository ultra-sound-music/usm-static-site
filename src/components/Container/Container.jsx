import React from "react";
import cn from 'classnames';

import * as styles from './Container.scss';

export function Container({ children, adjustForNavBar }) {
  const classNames = cn(styles.Container, {[styles.adjustForNavBar]: adjustForNavBar});

  return (
    <div className={classNames}>
      {children}
    </div>
  );
}

export default Container;