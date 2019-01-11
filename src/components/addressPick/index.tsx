import * as React from 'react';
import { Modal, Button } from 'antd';
import styles from './styles.less';
import { ask, Res, Props as AskProps } from 'utils/ask';

declare const BMap: any;
declare const BMAP_STATUS_SUCCESS: any;

export interface Result {
  address: string;
  addressDetails: string;
  longitude: number;
  latitude: number;
  province: string;
  city: string;
  area: string;
}

export interface Props {
  onOk: (result: Result) => void;
  onClose: () => void;
  data: Result;
}

export class AddressPick extends React.PureComponent<Props> {
  private divMap: HTMLDivElement;
  private map: any;
  private marker: any;

  mapInit() {
    // 百度地图API功能
    this.map = new BMap.Map(this.divMap); // 创建Map实例
    this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  }

  addPoint(point: any) {
    if (this.marker) {
      this.map.removeOverlay(this.marker); // 将标注添加到地图中
    }
    this.marker = new BMap.Marker(point); // 创建标注
    this.marker.enableDragging();
    this.map.addOverlay(this.marker); // 将标注添加到地图中
  }

  getLocationByIp() {
    return new Promise((resolve, reject) => {
      const geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // 根据浏览器IP获取位置 成功
            resolve({
              city: r.address.city,
              point: r.point,
            });
          } else {
            // 根据浏览器IP获取位置 失败时定位到杭州市中心
            resolve({
              city: '杭州',
              point: new BMap.Point(120.175266, 30.274044),
            });
          }
        },
        { enableHighAccuracy: true }
      );
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.mapInit();

      const { data } = this.props;
      if (data && data.city) {
        let address = data.address;

        this.map.centerAndZoom(data.city, 11);
        if (data.latitude) {
          const point = new BMap.Point(data.longitude, data.latitude);
          this.addPoint(point);
        } else {
          this.getAddressLoc(address || data.city, data.city)
            .then(point => {
              this.addPoint(point);
            })
            .catch(() => {
              this.getAddressLoc(data.city, data.city).then(point => {
                this.addPoint(point);
              });
            });
        }
      } else {
        this.getLocationByIp().then((result: any) => {
          this.map.centerAndZoom(result.city, 11);
          this.addPoint(result.point);
        });
      }
    }, 100);
  }

  getAddressLoc(address: string, city: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // 创建地址解析器实例
      const myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(
        address,
        function(point) {
          if (point) {
            resolve(point);
          } else {
            reject();
          }
        },
        city
      );
    });
  }

  getAddressName(): Promise<Result> {
    return new Promise((resolve, reject) => {
      const point = this.marker.point;

      const pars: AskProps = {
        url: '/api/user/geocoder',
        body: {
          location: point.lat + ',' + point.lng,
        },
        method: 'GET',
      };
      ask(pars).then(response => {
        const res = response.data;
        resolve({
          longitude: res.Longitude,
          latitude: res.Latitude,
          address: res.Address,
          addressDetails: res.AddressDetails,
          province: res.Province,
          city: res.City,
          area: res.Area,
        });
      });
    });
  }

  onOk = () => {
    this.getAddressName().then(result => {
      this.props.onOk(result);
    });
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <div>
        <Modal
          title="请在地图上选点"
          visible={true}
          width={936}
          className={styles.modal}
          okText="确定"
          onOk={this.onOk}
          onCancel={this.onClose}
          centered={true}
          footer={
            <div className="divBtn">
              <Button type="primary" className={styles.btn} onClick={this.onOk}>
                确认
              </Button>
            </div>
          }
        >
          <div className={styles.divMap} ref={obj => (this.divMap = obj)} />
        </Modal>
      </div>
    );
  }
}
