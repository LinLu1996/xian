import { Component } from 'react';
import { Transfer, LocaleProvider} from 'antd';
// import { IO} from '@/app/io';
import Com from "@/component/common/index";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {IOModel} from '../model';
class ChuanSuo extends Component {

  constructor (props) {
      super (props);
      this.state = {
        mockData: [],
        targetKeys: [],
        __data:[],
        havekey:[],
          selected:[]
      };
  }
  async componentDidMount() {
      await this.getHave ();
  }
   getHave () {
    const _this=this;
    IOModel.getCompany({':id':this.props.idss.id}).then((res) => {
     this.props.changekey(res.data);
     this.setState({selected:res.data},() => {
         _this.getMock();
     });
  }).catch(Com.errorCatch);
  }
  getMock () {
    IOModel.allData().then((res) => {
    const {selected} =this.state;
    const mockData = [];
    const __data = res.data;
    __data.map(function (item) {
      const data = {
        key : item.id,
        description :item.companyName,
          disabled:item.nodeId > 0
      };
      selected.map((i) => {
          if(i===item.id) {
              data.disabled=false;
          }
        });
      mockData.push(data);
    });
    this.setState({ mockData});
  }).catch(Com.errorCatch);
  }


  handleChange (targetKeys) {
    this.props.changekey(targetKeys);
  }
  render() {
    return (
        <LocaleProvider locale={zhCN}>
            <Transfer
                dataSource={this.state.mockData}
                showSearch
                operations={['添加公司', '移除公司']}
                targetKeys={this.props.targetKeys}
                onChange={this.handleChange.bind(this)}
                render={item => `${item.description}`}
            />
        </LocaleProvider>
    );
  }
}


export default ChuanSuo;