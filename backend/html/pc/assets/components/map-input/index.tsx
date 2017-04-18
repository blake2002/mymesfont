import * as React from 'react';
import {
    Input, Modal, Icon
} from '../antd/index';
import './index.css'

declare let AMap: any;

type Coordinate = {
    longitude: string
    latitude: string
};

interface IMapInputProps {
    value: Coordinate
    onChange?: (e) => void
    onOK?: (value: Coordinate) => void
};
interface IMapInputState { };
export default class MapInput extends React.Component<IMapInputProps, IMapInputState> {
    mapIsNew = false;
    state = {
        visible: false,
        longitude: this.props.value.longitude,
        latitude: this.props.value.latitude
    }

    handleOk() {
        this.show(false);
        this.props.onOK({
            longitude: this.state.longitude,
            latitude: this.state.latitude
        });
    }

    onCancel() {
        this.show(false);
    }

    show(bl = true) {
        this.state.visible = bl;
        this.setState(this.state);

        if (bl && !this.mapIsNew) {
            setTimeout(() => {
                this.mapInit();
            }, 0);
        }
    }

    mapInit() {
        this.mapIsNew = true;
        let url = `http://webapi.amap.com/maps?v=1.3&key=a081d5b0965110a5d1971e0128148ec4&&
plugin=AMap.Geocoder,AMap.Autocomplete,AMap.PlaceSearch`;
        require.async(url, () => {

            let self = this;
            let center: any = [121.527424, 31.090597];
            if (this.state.latitude) {
                center[0] = this.state.longitude;
                center[1] = this.state.latitude;
            }


            let map = new AMap.Map('modal-map', { resizeEnable: true, center: center, zoom: 14 });

            let marker = new AMap.Marker({  // 加点
                map: map,
                position: center
            });

            // 输入提示
            let autoOptions = {
                input: 'tipinput'
            };
            let auto = new AMap.Autocomplete(autoOptions);
            let placeSearch = new AMap.PlaceSearch({
                map: ''
            });  // 构造地点查询类
            AMap.event.addListener(auto, 'select', select);// 注册监听，当选中某条记录时会触发
            let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
            function select(e) {
                placeSearch.setCity(e.poi.adcode);
                if (e.poi && e.poi.location) {
                    map.setZoom(15);
                    map.setCenter(e.poi.location);
                }
                placeSearch.search(e.poi.name, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        let jy = result.poiList.pois[0]['location'];// 经纬度
                        self.state.longitude = jy.lng;
                        self.state.latitude = jy.lat;
                        self.setState(self.state)

                        for (let h = 0; h < result.poiList.pois.length; h++) {// 返回搜索列表循环绑定marker
                            let jy = result.poiList.pois[h]['location'];// 经纬度
                            let address = result.poiList.pois[h]['address'];// 地址

                            let marker = new AMap.Marker({  // 加点
                                map: map,
                                position: jy
                            });
                            marker.extData = {
                                'getLng': jy['lng'],
                                'getLat': jy['lat'], 'address': address
                            };// 自定义想传入的参数
                            marker.content = '123123123';
                            marker.on('click', function (e) {
                                let hs = e.target.extData;
                                infoWindow.setContent(hs['address']);// 点击以后窗口展示的内容
                                infoWindow.open(map, e.target.getPosition());

                                self.state.longitude = hs.getLng;
                                self.state.latitude = hs.getLat;
                                self.setState(self.state)
                            });
                        }

                    }
                });  // 关键字查询查询
            }

            AMap.event.addListener(map, 'click', (e) => {
                this.state.longitude = e.lnglat.getLng();
                this.state.latitude = e.lnglat.getLat();
                this.setState(this.state)
            });

        })
    }

    public render(): JSX.Element {
        let {state} = this;
        return (<section>
            <Input
                addonAfter={<Icon type='tags' onClick={() => this.show()} />}
                onClick={() => this.show()}
                value={this.props.value.longitude + ',' + this.props.value.latitude}
                onChange={(e) => this.props.onChange && this.props.onChange(e)}
            />
            <Modal title='请点击选择' width={882} className='modal-map'
                visible={this.state.visible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                okText='确定' cancelText='取消'
            >
                <div id='modal-map'></div>
                <div className='map-menu'>
                    <Input className='map-seach' id='tipinput' placeholder='请输入搜索内容' />
                    <div className='coordinate-box'><span>经度</span>{state.longitude}</div>
                    <div className='coordinate-box'><span>纬度</span>{state.latitude}</div>
                </div>
            </Modal>
        </section>);
    }
}
