import * as React from 'react';
import styles from './styles.less';

export interface Props {
  title?: any;
  children: any;
  explain?: string; // 说明信息
  colspan?: boolean; // 是否将两列合并成一列
  splitHeight?: number; // 分隔行高度
  isRequire?: boolean; // 是否必填
  thWidth?: number; // title 宽度
  td2?: any;
  td2Style?: any;
  td1Style?: any;
}

export function FormItem(props: Props) {
  const {
    title,
    children,
    explain,
    colspan,
    splitHeight,
    isRequire,
    thWidth,
    td2,
    td2Style,
    td1Style,
  } = props;

  const splitStyle: any = {};

  if (splitHeight !== undefined) {
    splitStyle.height = splitHeight;
  } else {
    splitStyle.height = 20;
  }

  const thStyle: any = {};
  if (thWidth) {
    thStyle.width = thWidth;
  }

  return (
    <React.Fragment>
      <tr>
        {!colspan && (
          <th className={styles.th} style={{...thStyle, ...td1Style}}>
            {isRequire && <span className={styles.require}>*</span>}
            {title}
          </th>
        )}
        <td colSpan={colspan ? 2 : 1} className={styles.tdChildren}>
          {children}
        </td>
        {td2 && <td style={td2Style}>{td2}</td>}
      </tr>
      {explain && (
        <tr>
          {!colspan && <th style={thStyle} />}
          <td colSpan={colspan ? 2 : 1}>
            <span className={styles.explain}>{explain}</span>
          </td>
        </tr>
      )}
      <tr>
        {!colspan && <td className={styles.tdSplit} style={{ ...thStyle, ...splitStyle }} />}
        <td className={styles.tdSplit} colSpan={colspan ? 2 : 1} style={splitStyle} />
      </tr>
    </React.Fragment>
  );
}
