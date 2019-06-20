import {Component} from 'react';
import {connect} from 'react-redux';
import './index.less';
class help extends Component {
    constructor(props) {
        super(props);
    }
    base() {
        location.href='/#/pages/masterdata/base';
    }
    render() {
        const {EditData} = this.props;
        let latitude;
        let longitude;
        let GIS;
        JSON.stringify(EditData)!=='{}' && EditData?latitude=EditData.latitude : latitude='';
        JSON.stringify(EditData)!=='{}' && EditData?longitude=EditData.longitude : longitude='';
        JSON.stringify(EditData)!=='{}'?  GIS = `http://geojson.io/#map=10/${latitude}/${longitude}`:GIS = 'http://geojson.io';
        return (
            <div className='gishelp'>
                <div className='help-box'>
                   <div className='help'>
                       <div className='title'><div>维护地块GIS信息</div>
                       <p onClick={this.base.bind(this)}>返回</p>
                       </div>
                   <div className='help-conent'>
                       <div className='list'>
                          <p>01</p>
                          <p>打开网址<a style={{fontSize:'12px',margin:0}}>{GIS}</a>,访问开源的地图工具</p>
                          <p><img src='https://gw.alicdn.com/tfs/TB1FTZ.rgTqK1RjSZPhXXXfOFXa-268-203.png'></img></p>
                       </div>
                       <div className='list'>
                          <p>02</p>
                          <p>在地图上找到地块所在区域，使用多边形工具，或者矩形工具在地图上圈出地块或大棚的形状</p>
                          <p><img src='https://gw.alicdn.com/tfs/TB1knA9rlLoK1RjSZFuXXXn0XXa-267-187.png'></img></p>
                       </div>
                       <div className='list'>
                          <p>03</p>
                          <p>圈好图形后，把右边自动生成的地块坐标经纬度进行复制</p>
                          <p><img src='https://gw.alicdn.com/tfs/TB1dLpArxjaK1RjSZKzXXXVwXXa-263-284.png'></img></p>
                          </div>
                       <div className='list'>
                          <p>04</p>
                          <p>把复制好的代码粘贴至编辑地块的GIS坐标字段中，并保存确认。</p>
                          <p><img src='https://gw.alicdn.com/tfs/TB1rOE7rmrqK1RjSZK9XXXyypXa-265-319.png'></img></p>
                       </div>
                       <div className='list'>
                          <p>05</p>
                          <p>在首页的GIS地图中，查看对应的地块，就可以看到该地块的形状信息了。</p>
                          <p><img src='https://gw.alicdn.com/tfs/TB1Gg8erAvoK1RjSZFwXXciCFXa-267-166.png'></img></p>
                       </div>
                   </div>
                </div>
              </div>
            </div>
        );
    }
}
const mapstateProps = (state) => {
    const {EditData} = state.baseReducer;
    return {
        EditData
    };
};
export default connect(mapstateProps, null)(help);