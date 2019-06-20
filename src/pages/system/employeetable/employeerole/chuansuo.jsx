import { Component } from 'react';
import { Transfer, LocaleProvider} from 'antd';
import { IO} from '@/app/io';
import Com from "@/component/common";
import zhCN from 'antd/lib/locale-provider/zh_CN';
class ChuanSuo extends Component {

  constructor (props) {
      super (props);
      this.state = {
        mockData: [],
        targetKeys: [],
        __data:[],
        havekey:[]
      };
  }
  async componentDidMount() {
    await this.getMock();
    await this.getHave ();
  }
  getHave () {
  IO.empl222.meData({':id':this.props.idss.id}).then((res) => {
    this.props.changekey(res.data);
  }).catch(Com.errorCatch);
  }
  getMock () {
    IO.empl222.onlyData({'empId': this.props.idss.id}).then((res) => {
    const {targetKeys} =this.state;
    const mockData = [];
    const __data = res.data;
    __data.map(function (item) {
      const data = {
        key : item.id,
        description :item.roleName
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
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
                operations={['添加角色', '移除角色']}
                targetKeys={this.props.targetKeys}
                onChange={this.handleChange.bind(this)}
                render={item => `${item.description}`}
            />
        </LocaleProvider>
    );
  }
}


export default ChuanSuo;