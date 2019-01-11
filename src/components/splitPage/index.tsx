import * as React from 'react';
import styles from './styles.less';
import { Pagination } from 'antd';

function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a>上一页</a>;
  }
  if (type === 'next') {
    return <a>下一页</a>;
  }
  return originalElement;
}

export function SplitPage(props: any) {
  const { pageIndex, total, pageSize, onPageChanged } = props;

  const totalPages = Math.ceil(total / pageSize) || 0;
  const isLastPage = pageIndex === totalPages;

  const styleCannt = {
    color: 'rgba(0,0,0,0.25)',
    cursor: 'not-allowed',
  };
  if (totalPages < 2) {
    return null;
  }

  return (
    <div className={`splitPage ${styles.pag}`}>
      <div
        className={styles.btn}
        title="末页"
        onClick={() => onPageChanged(totalPages, pageSize)}
        style={isLastPage ? styleCannt : {}}
      >
        末页
      </div>
      <Pagination
        hideOnSinglePage={true}
        current={pageIndex}
        total={total}
        itemRender={itemRender}
        onChange={onPageChanged}
        pageSize={pageSize}
      />
      <div
        className={styles.btn}
        title="首页"
        onClick={() => onPageChanged(1, pageSize)}
        style={pageIndex === 1 ? styleCannt : {}}
      >
        首页
      </div>
      <div className={styles.total}>共{totalPages}页</div>
      <div className={styles.clear}></div>
    </div>
  );
}
