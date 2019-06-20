import {Component} from 'react';
import {connect} from 'react-redux';
import {action, IOModel} from './model';
import './index.less';
import {Modal, Table, Input, Button} from 'antd';

class ModalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            personList: [],
            visible: false
        };
        this.columns = [{
            title: '负责人',
            dataIndex: 'realName',
            align: "center"
        }, {
            title: '操作',
            dataIndex: 'caozuo',
            align: "center",
            render: (text, record) => {
                return <div>
                    <Button className='form-btn' onClick={this.hideModal.bind(this, record)}>选择负责人</Button>
                </div>;
            }
        }];
    }

    componentDidMount() {}

    hideCancel() {   //点击关闭的回调函数
        this.props.modalTable({modalFlag: false});
    }

    hideModal(record) {   //点击确定的回调
        this.props.modalTable({modalFlag: false});
        this.props.setRecord(record);
    }

    setName(event) {
        this.setState({
            name: event.target.value
        });
    }

    query() {  //查询列表
        const {name} = this.state;
        const personList = [];
        IOModel.getEmpListByType({type: 2,realName: name}).then((res) => {
            const data = res.data;
           if (data && data.length > 0) {
               for (let i = 0; i < data.length; i++) {
                   const person = {};
                   person.id = data[i].id;
                   person.realName = data[i].realName;
                   personList.push(person);
               }
               this.setState({
                  personList: personList
               });
           } else {
               this.setState({
                   personList: []
               });
           }
        });
    }

    render() {
        const {modalTableflag} = this.props;
        return (
            <div>
                <Modal
                    title='选择负责人'
                    visible={modalTableflag}
                    onOk={this.hideModal.bind(this)}
                    onCancel={this.hideCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    wrapClassName='table-modal'
                    footer={null}
                >
                    <div className='farming-search'>
                        <div className='search-layout '>
                            <div className='search-row'>
                                <div className='search-col'>
                                    <span className='label-title'>负责人</span>
                                    <Input className='input-search' value={this.state.name} onChange={this.setName.bind(this)}/>
                                    <Button className='button-search' type="primary" onClick={this.query.bind(this)}>查询</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table rowKey={record => record.id} columns={this.columns} dataSource={this.state.personList}
                           pagination={false} setRecord={this.props.setRecord}/>
                    {/*<CustomizedForm {...fields} onChange={this.handleFormChange.bind(this)} parentName={parentName}
                                    />*/}
                </Modal>
            </div>
        );
    }
}

const mapstateProps = (state) => {
    const {modalTableflag} = state.baseReducer;
    return {
        modalTableflag
    };
};
export default connect(mapstateProps, action)(ModalTable);
