import * as React from 'react';
import styles from './styles.less';

export interface Props {
  children: any;
}

export function Form(props: Props) {
  return (
    <table className={styles.table}>
      <tbody>{props.children}</tbody>
    </table>
  );
}
