import * as React from 'react';
import { connect } from 'dva';
import { Button, Carousel } from 'antd';
import { Header } from 'components/header';
import styles from './index.less';
import router from 'umi/router';
import { Footer, FooterSpace } from 'components/footer';
import { namespace } from '../models/index';

let divForm: HTMLDivElement;
const Component = ({ dispatch, data }) => {
  const { bannerList } = data;

  function toRecharge() {
    router.push('/recharge');
  }

  function toShortMessage() {
    router.push('/shortMessage/templateListForSend?clear=1');
  }

  function toCustomer() {
    router.push('/customer?clear=1');
  }

  function onBannerClick(h) {
    if (h.url) {
      document.location.href = h.url;
    }
  }
  function onLogout() {
    dispatch({
      type: `${namespace}/logout`,
      payload: {},
    });
  }

  return (
    <div className={styles.main}>
      <Header user={data.user} type="index" onLogout={onLogout} />
      <div className={styles.carousel}>
        <Carousel autoplay>
          {bannerList.map((h, index) => {
            const bannerStyle: React.CSSProperties = {
              backgroundImage: `url(${h.picUrl})`,
              backgroundColor: h.bgColor || undefined,
              cursor: h.url ? 'pointer' : 'default',
            };
            return (
              <div key={index}>
                <div
                  className={styles.banner}
                  style={bannerStyle}
                  onClick={() => onBannerClick(h)}
                />
              </div>
            );
          })}
        </Carousel>
      </div>

      <div className={styles.listContainer}>
        <div className={styles.list}>
          <div className={styles.item1}>
            <Button ghost type="primary" className={styles.btns} onClick={toShortMessage}>
              立即进入
            </Button>
          </div>
          <div className={styles.item3}>
            <Button ghost type="primary" className={styles.btns} onClick={toRecharge}>
              立即进入
            </Button>
          </div>
          <div className={styles.item4}>
            <Button ghost type="primary" className={styles.btns} onClick={toCustomer}>
              立即进入
            </Button>
          </div>
        </div>
      </div>

      <FooterSpace />
      <Footer />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    data: state[namespace],
  };
};

export default connect(mapStateToProps)(Component);
