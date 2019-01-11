import * as React from 'react';
import styles from './styles.less';

let div: HTMLDivElement = null;
let timeout: any = null;

export class MessageBox {
  static show(msg: string, container: HTMLDivElement) {
    if (div) {
      div.parentElement.removeChild(div);
      div.innerHTML = '';
      div = null;
      if (timeout) {
        clearTimeout(timeout);
      }
    }

    div = document.createElement('div');
    div.innerHTML = msg;
    div.className = styles.msg;

    container.appendChild(div);

    timeout = setTimeout(() => {
      if (div) {
        div.parentElement.removeChild(div);
        div.innerHTML = '';
        div = null;
      }
    }, 3000);
  }
}
