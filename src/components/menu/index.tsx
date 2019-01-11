import * as React from 'react';
import styles from './styles.less';
import { List } from 'antd';

export interface MenuDataItem {
  icon: any;
  text: string;
  url: string;
}

export interface MenuProps {
  list: MenuDataItem[];
  style?: any;
  current: string;
  onClick: (url: string) => void;
}

export class Menu extends React.PureComponent<MenuProps> {
  render() {
    const { list, style, current, onClick } = this.props;
    return (
      <div className={styles.menu} style={style}>
        <List
          bordered
          dataSource={list}
          renderItem={item => (
            <List.Item className={item.url === current ? styles.selected : ''}>
              <div className={styles.item} onClick={() => onClick(item.url)}>
                <div className={styles.icon}>{item.icon}</div>
                <div className={styles.text}>{item.text}</div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
