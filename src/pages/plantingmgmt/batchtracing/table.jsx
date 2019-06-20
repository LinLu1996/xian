import {Table, Pagination, Modal, Tooltip, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action} from './model';
import { Component } from 'react';
import moment from 'moment';
import QRCode from "./qrCode.jsx";
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './../index.less';
import './index.less';
class Tables extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedRowKeys:[]
        };
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            align: "center",
            width: 100,
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },{
          title: '二维码',
          dataIndex: 'qr-code',
          align: "center",
          render: (text, record) => {
            const href = `${window.location}`.split("/#/");
            if (record.batchNo) {
              const link = `${href[0]}/mobile/ding/homepage?url=scavetrace/${record.batchNo}`;
              return <div onClick={() => {this.forBigImg(link);}}><QRCode value={link} size={this.getSize(10)}/></div>;
            } else {
              return '';
            }
          }
        },{
            title: '批次码',
            dataIndex: 'batchNo',
            align:"center",
            render: text => <Tooltip title={text}><span style={{
              width: '50px',
              textOverflow: 'ellipsis',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}>{text}</span></Tooltip>
        },{
            title: '作物品种',
            dataIndex: 'cropName',
            align:"center"
        },{
            title: '等级',
            dataIndex: 'gradeName',
            align:"center"
        },  {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            align:"center",
            render:(gmtCreate) => {
                return moment(gmtCreate).format('YYYY-MM-DD');
            }
        }, {
            title: '创建人',
            dataIndex: 'createUserName',
            align:"center"
        }, {
            title: '打印次数',
            dataIndex: 'printTimes',
            align:"center"
        }, {
            title: '扫描次数',
            dataIndex: 'searchTimes',
            align:"center"
        }
        ];
    }
  forBigImg(link) {
    Modal.info({
      title: '二维码扫描',
      okText:"关闭",
      className:'batch-tracing-info',
      content: (
        <div><QRCode value={link} size={this.getSize(40)}/></div>
      )
    });
  }
  getSize(size) {
    const clienWidth = document.documentElement.clientWidth;
    return Math.floor(size * clienWidth / 320);
  }
    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage:current,limit:pageSize});
        this.props.innerpage({current:current, pageSize:pageSize});
    }
    onSizeChangequery(current, pageSize) {
        const { onSizeChangequery } = this.props;
        onSizeChangequery(current, pageSize);
        this.props.innerpage({current:current, pageSize:pageSize});
    }
    onchooseChange(current, pageSize) {
        const { onchooseChange } = this.props;
        onchooseChange(current, pageSize);
        this.props.choosepage({current:current, pageSize:pageSize});
        this.props.innerpage({current:current, pageSize:pageSize});
    }
    render() {
        const {total,data,Curs} = this.props;
        return (
                <div>
                    <div className='res-table'>
                        <LocaleProvider locale={zhCN}>
                            <Table bordered  rowKey={record => record.batchNo} columns={this.columns} dataSource={data} pagination={false}/>
                        </LocaleProvider>
                    </div>
                    <Pagination defaultCurrent={1} current={Curs} total={total} onChange={this.onSizeChangequery.bind(this)} className='res-pagination'/>
                </div>
        );
    }
}
const mapstateprops = (state) => {
    const { Cur,Curs,Psizes,Psize, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR  } = state.batchtracingReducer;
    return {
        Cur,
        Curs,
        Psizes,
        Psize,
        chooseFlag:chooseflag,
        TreeD,
        parentName:parentname,
        slideID, chooseSIZE, chooseCUR
    };
};
export default connect(mapstateprops,action)(Tables);