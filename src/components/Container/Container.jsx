import React from "react";

import * as styles from './Container.scss';

export function Container({ children }) {
  return (
    <div className={styles.Container}>
      {children}
    </div>
  );
}

export default Container;