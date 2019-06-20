import {Table, Tooltip,LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import { Component } from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
class Tables extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys:[]
    };
    this.columns = [{
      title: '月份',
       dataIndex: 'type',
        align: "center",
        width: 160,
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '一月',
      dataIndex: 'Jan',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '二月',
      dataIndex: 'Feb',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '三月',
      dataIndex: 'Mar',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
     },{
         title: '四月',
         dataIndex: 'Apr',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
       title: '五月',
       dataIndex: 'May',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
         title: '六月',
         dataIndex: 'Jun',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
       title: '七月',
       dataIndex: 'Jul',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '八月',
      dataIndex: 'Aug',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '九月',
      dataIndex: 'Sep',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '十月',
      dataIndex: 'Oct',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '十一月',
        dataIndex: 'Nov',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '十二月',
        dataIndex: 'Dec',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    },{
      title: '总计',
      dataIndex: 'all',
        align: "right",
        render: (text) => {
            return <Tooltip title={text}><span style={{
                width: '100%',
                textOverflow: 'ellipsis',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>{text}</span></Tooltip>;
        }
    }];
  }
  onSizeChange(current, pageSize) {
    this.props.Alldatas({startPage:current,limit:pageSize});
    this.props.page({current:current, pageSize:pageSize});
  }
  onSizeChangequery(current, pageSize) {
    const { onSizeChangequery } = this.props;
    onSizeChangequery(current, pageSize);
  }
  onchooseChange(current, pageSize) {
    const { onchooseChange } = this.props;
    onchooseChange(current, pageSize);
    this.props.choosepage({current:current, pageSize:pageSize});
  }
  render() {
    const {data} = this.props;
    return (
      <div className='res-table'>
          <LocaleProvider locale={zhCN}>
                <Table bordered  rowKey={record => record.type} columns={this.columns}  dataSource={data} pagination={false}/>
          </LocaleProvider>
      </div>
    );
  }
}
const mapstateprops = (state) => {
  const { parentname, TreeD, slideID, chooseSIZE, chooseCUR  } = state.govAidAnalysisReducer;
  return {
    TreeD,
    parentName:parentname,
    slideID, chooseSIZE, chooseCUR
  };
};
export default connect(mapstateprops,action)(Tables);