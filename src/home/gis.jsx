import {connect} from 'react-redux';
import {action} from './model';
import {Component} from 'react';
import * as L from "leaflet";
import {areaCenter,googleTileLayer,seaTileLayer} from "@/home/component/components/component";
import {geoArea,string2Array,getCenterPoint} from './component/utils/geoJSONUtil';
import gcoord from 'gcoord';
import {message} from 'antd';

export let leafletMap;
let landLayer;

class Gis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoJsonList: [],
            current: 1,
            allCount: 1,
            baseId: null,
            currentItem:-1
        };
        this.onEachFeature = (feature, layer) => {
            let popupContent = '';
            if (feature.properties && feature.properties.name) {
                popupContent = feature.properties.name;
            }
            layer.bindPopup(popupContent);
            layer.on('mouseover',function() {
                layer.openPopup();
            });
        };
    }

    async componentWillReceiveProps(nextProps) {
        this.loadLand(nextProps.landList);
        if (nextProps.pageF) {
            await this.setState({
                baseId: nextProps.baseId,
                current: 1
            });
            let vm = {
                startPage: 1,
                limit: 5
            };
            if(nextProps.baseId!==-1) {
                vm = {
                    startPage: 1,
                    limit: 5,
                    baseId:nextProps.baseId
                };
            }
            await this.props.pageSize(vm);
            await this.props.pageFlag({flag: false});
        }
        if(nextProps.dataList.length>0) {
            for(let i=0; i<nextProps.dataList.length; i++) {
                if(nextProps.dataList[i] && nextProps.dataList[i].gisData) {
                    this.fixedPosition(nextProps.dataList[i],i);
                    break;
                }
            }
        }
    }
    /*clearLand() {
        const {geoJsonList} = this.state;
        const layers = [];
        if (geoJsonList && geoJsonList.length > 0) {
            for (let i = 0; i < geoJsonList.length > 0; i++) {
                layers.push(geoJsonList[i].geometry.coordinates);
            }
            const myGroup = L.layerGroup(layers);
            leafletMap.addLayer(myGroup);
            myGroup.clearLayers();
        }
    }*/
    async loadLand (landList) {
        // 清除
        if(landLayer && leafletMap) {
            leafletMap.removeLayer(landLayer);
        }
        //加载所有地块
        const geoJsonList = [];
        landList.forEach((item) => {
            if(item.gisData) {
                //解析字符串
                const area = string2Array(item.gisData);
                //坐标转换WGS84->GCJ02
                const newPoints = [];
                area.forEach((item) => {
                    if(item && item.length === 2) {
                        const result  = gcoord.transform(item, gcoord.WGS84, gcoord.GCJ02);
                        newPoints.push(result);
                    }
                });
                //转成geojson
                if(newPoints.length > 0) {
                    const geoJsonData = geoArea({
                        'name': item.name || ''
                    },newPoints);
                    geoJsonList.push(geoJsonData);
                }
            }
        });
        //gcoord.transform( geoJSON, gcoord.WGS84, gcoord.GCJ02 );
        landLayer = L.geoJSON(geoJsonList,{
            style: {
                color: "#00CD00",
                fillColor: "#7CFC00",
                fillOpacity: 0.2,
                opacity: 1,
                weight: 2
            },
            onEachFeature: this.onEachFeature
        }).addTo(leafletMap);
    }
    async componentDidMount() {
        /**
         * 初始化地图
         *
         * @param {any} layers
         * @param {any} center
         */
        const initMap = (layers, center) => L.map('map', {
            //crs: crs,
            layers: [...layers],
            center: center,//初始化中心点
            closePopupOnClick: true,//为false的时候点击旁边区域不会关闭pop
            zoomSnap: 1,//默认为1，操作缩放比
            trackResize: true,//是否根据浏览器大小变化而刷新
            dragging: true,//为false时不可拖动
            zoomControl: false,
            scrollWheelZoom: false//禁用鼠标滚轮缩放地图
        });
        //获取地图对象(高德地图)
        //leafletMap = initMap([gaodeTileLayer,shipGroupLayer]);
        leafletMap = initMap([googleTileLayer]);
        leafletMap.on('load', function () {
            //控制图层
            L.control.layers({
                "地图": googleTileLayer,
                "卫星图": seaTileLayer
            },null,{
                position: "topleft"
            }).addTo(leafletMap);
            //control.setPosition("topleft");
            //比例尺
            L.control.scale({
                imperial: false
            }).addTo(leafletMap);
            //缩放按钮
            L.control.zoom({
                position: "bottomright"
            }).addTo(leafletMap);
        }).setView(areaCenter, 17);
        leafletMap.panTo([30.1297201490,120.0827980042]);
        if(this.props.baseId===-1) {
            this.props.getLandsByBaseId({':baseId': -1});
        } else {
            this.props.getLandsByBaseId({':baseId': this.props.baseId});
        }
        // 加载右边的信息
        let vm = {
            startPage: 1,
            limit: 5
        };
        if(this.props.baseId!==-1) {
            vm = {
                startPage: 1,
                limit: 5,
                baseId:this.props.baseId
            };
        }
        await this.props.pageSize(vm);
    }
    componentWillUnmount() {
        leafletMap && leafletMap.remove();
    }
    upPage() {
        const current = this.state.current;
        if (current > 1) {
            this.setState({
                current: current - 1,
                currentItem: -1
            });
            const vm = {
                startPage: current - 1,
                limit: 5,
                baseId: this.state.baseId
            };
            this.props.pageSize(vm);
        } else {
            message.warning('到顶了');
        }
    }
    downPage() {
        const {total} = this.props;
        let maxPage =  0;
        if (parseInt(total)%5 === 0) {
            maxPage = parseInt(total/5);
        } else {
            maxPage = parseInt(total/5) + 1;
        }
        const current = this.state.current;
        if (current < maxPage) {
            this.setState({
                current: current + 1,
                currentItem: -1
            });
            const vm = {
                startPage: current + 1,
                limit: 5,
                baseId: this.state.baseId
            };
            this.props.pageSize(vm);
        } else {
            message.warning('到底了');
        }
    }
    //定位坐标中心点
    fixedPosition(item,index) {
        this.setState({
            currentItem:index
        });
        if(item && item.gisData) {
            //获取坐标点
            const pointList = string2Array(item.gisData);
            //获取坐标中心点
            const centerPoint = getCenterPoint(pointList);
            //坐标系转换
            const result  = gcoord.transform(centerPoint, gcoord.WGS84, gcoord.GCJ02);
            //定位坐标
            //leafletMap.setZoom(19);
            leafletMap.panTo([result[1],result[0]]);
        }
    }
    render() {
        const {dataList,total} = this.props;
        return (<div id='map' className='map-div'>
            <div className='map-box'>
                {this.state.current > 1 ?
                <div className='top-one' onClick={() => {this.upPage();}}><i className='iconfont icon-xiangshangjiantou' style={{color:'green'}}></i></div>
                    : <div className='top-one' onClick={() => {this.upPage();}}><i className='iconfont icon-xiangshangjiantou'></i></div>
                }
                <ul className='map-box-con'>
                    {dataList.map((item,index) => {
                        return <li className={this.state.currentItem===index ? 'map-land-checked map-land':'map-land'} key={item.id} onClick={this.fixedPosition.bind(this,item,index)}>
                            <i className='iconfont icon-dingwei'></i>
                            <div className='map-box-c'>
                                <div className='map-box-t'>{item.typeName}：{item.name}</div>
                                <div className='map-box-d'><span>地址：</span>{item.address}</div>
                            </div>
                        </li>;
                    })}
                </ul>
                {this.state.current < (total/5.0) ?
                <div className='bottom-one' onClick={() => {this.downPage();}}><i className='iconfont icon-xiangxiajiantou' style={{color:'green'}}></i></div>:
                    <div className='bottom-one' onClick={() => {this.downPage();}}><i className='iconfont icon-xiangxiajiantou'></i></div>
                }
            </div>
        </div>);
    }
}

const mapstateprops = (state) => {
    const {TreeD, total, dataList, pageFlag, landList} = state.indexReducer;
    return {
        TreeD,
        total,
        dataList,
        pageFlag,
        landList
    };
};
export default connect(mapstateprops, action)(Gis);