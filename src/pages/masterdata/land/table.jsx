import {Table, Pagination, message, Switch, Tooltip, Modal, LocaleProvider} from 'antd';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import {Component} from 'react';
import QRCode from "./qrCode.jsx";
import './index.less';
import zhCN from "antd/lib/locale-provider/zh_CN";
class Tables extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        };
        this.query = this.query.bind(this);
        this.columns = [{
            title: '序号',
            dataIndex: 'key',
            width:100,
            key: 'key',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },{
          title: '二维码',
          dataIndex: 'qr-code',
          align: "center",
            render: (text, record) => {
            if (record.code) {
              const link = `${record.code}`;
              return <div onClick={() => {this.forBigImg(link);}}><QRCode value={link} size={this.getSize(10)}/></div>;
            } else {
              return '';
            }
          }
        },
          {
                title: '地块名称',
                dataIndex: 'name',
              align: "left"
            }, {
                title: '所属基地',
                dataIndex: 'baseName',
                align: "left"
            },{
                title:'所属企业',
                dataIndex:'companyName',
                align:"left"
            } ,{
                title: '地块类型',
                dataIndex: 'typeName',
                align: "left"
            }, {
                title: '地块面积（亩）',
                dataIndex: 'area',
                width: 140,
                align: "right"
            }, {
                title: '负责人',
                dataIndex: 'userName',
                align: "left"
            }, {
                title: '创建人',
                dataIndex: 'createUserName',
                align: "left"
            },
            {
                title: '状态',
                dataIndex: 'stauts',
                align:"center",
                render: (text, record) => {
                    if(this.props.editRole) {
                        let flag = false;
                        if(record.stauts === 1) {
                            flag = false;
                        }else{
                            flag = true;
                        }
                        return <Switch checked={flag} onChange={() => { this.changeStatus(record);}} />;
                    }else {
                        return record.stauts === 1 ? '禁用' : '正常';
                    }
                }
            }];
            if(this.props.editRole) {
                this.columns.push({
                    title: '操作',
                    dataIndex: 'caozuo',
                    align:"center",
                    render: (text, record) => {
                        return <div>
                            <Tooltip title="编辑">
                                <span className='cursor' onClick={this.query.bind(this,record)}><i className='iconfont icon-xiugai07'></i></span>
                            </Tooltip>
                        </div>;
                    }
                });
            }
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
    changeStatus(record) {
        const {Cur, Psize} = this.props;
        const deleteID = record.id;
        let stautsId = 0;
        if (record.stauts === 0) {
            stautsId = 1;
        } else {
            stautsId = 0;
        }
        IOModel.Modifydata({id: deleteID, stauts: stautsId, companyId: 1}).then((res) => {
            if (res.success) {
                if (stautsId === 1) {
                    message.success('禁用成功');
                } else {
                    message.success('启用成功');
                }
                this.props.Alldatas({startPage: Cur, limit: Psize,landName:this.props.name,userId:this.props.userId,baseName:this.props.address});
            }
        }).catch(() => {
            message.error("验证失败");
        });
    }

    async query(record) {
        await this.props.getOne({':id': record.id});
        const row = this.props.Rditdate;
        this.props.defaultFields({
            functionaryList: {
                value: this.props.personList
            },
            allBase: {
                value: this.props.allBase.data
            },
            allLandType: {
                value: this.props.allLandType.data
            },
            id: {
                value: row.id
            },
            landName: {
                value: row.name
            },
            code: {
                value: row.code
            },
            area: {
                value: row.area
            },
            typeName: {
                value: row.landtypeId
            },
            longitude: {
                value: row.longitude
            },
            latitude: {
                value: row.latitude
            },
            phone: {
                value: row.phone
            },
            baseName: {
                value: row.baseId
            },
            createName: {
                value: row.createUserName
            },
            createTime: {
                value: row.gmtCreate
            },
            user: {
                value: row.userId
            },
            stauts: {
                value: row.stauts
            },
            gisData: {
                value: row.gisData
            },
            orgId: {
                value: row.orgId
            },
            modeltype: {
                value: 'modify'
            }
        });
        this.props.modal({modalFlag: true, modeltype: 'modify'});
    }

    onSizeChange(current, pageSize) {
        this.props.Alldatas({startPage: current, limit: pageSize});
        this.props.page({current: current, pageSize: pageSize});
    }

    onSizeChangequery(current, pageSize) {
        const {onSizeChangequery} = this.props;
        onSizeChangequery(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
    }

    onchooseChange(current, pageSize) {
        const {onchooseChange} = this.props;
        onchooseChange(current, pageSize);
        this.props.page({current: current, pageSize: pageSize});
        this.props.choosepage({current: current, pageSize: pageSize});
    }

    render() {
        const {total, data, Cur} = this.props;
        return (
            <div>
            <div className='res-table'>
                <LocaleProvider locale={zhCN}>
                    <Table  bordered rowKey={record => record.id} columns={this.columns} dataSource={data} pagination={false}/>
                </LocaleProvider>
            </div>
                <Pagination className='res-pagination' defaultCurrent={1} current={Cur} total={total}
                                              onChange={this.onSizeChangequery.bind(this)}
                    />
            </div>
        );
    }
}

const mapstateprops = (state) => {
    const {Rditdate, allBase, allLandType, total, Cur, Psize, deleteOK, chooseflag, parentname, TreeD, slideID, chooseSIZE, chooseCUR} = state.farmingLandReducer;
    return {
        Rditdate: Rditdate,
        allBase: allBase,
        allLandType: allLandType,
        total: total,
        Cur,
        Psize,
        chooseFlag: chooseflag,
        deleteok: deleteOK,
        TreeD,
        parentName: parentname,
        slideID, chooseSIZE, chooseCUR
    };
};
export default connect(mapstateprops, action)(Tables);