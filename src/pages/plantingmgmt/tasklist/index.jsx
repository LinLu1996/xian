import {Component} from 'react';

import {connect} from 'react-redux';
import {action} from './model';
import '../../index.less';
import './index.less';
import TaskList from './list.jsx';
import TaskCalendar from '../taskcalendar/index.jsx';
import Com from '@/component/common';

class Resources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'LIST',//操作名称
            listRole: false,
            calendarRole: false,
            nav:['列表','日历'],
            activeNav:0
        };
    }

    componentDidMount() {
        const {securityKeyWord} = this.props;
        const listRole = Com.hasRole(securityKeyWord, 'tasklist_listByPage');
        const calendarRole = Com.hasRole(securityKeyWord, 'taskcalendar_listByPage');
        this.setState({listRole, calendarRole});
        this.props.AllWorkTypeQuery();
        this.props.superiorName({name: '基地', parentLeftID: -1});
    }

    handleModeChange(e) {
        const tab = e.target.value;
        this.setState({tab});
    }
    handleChangeNav(index) {
        this.setState({
            activeNav: index
        });
    }
    render() {
        // const {listRole,calendarRole} = this.state;
        return (
            <div className='farming-tab-list'>
                <div className='farming-top'>
                    <div className='title'>
                        {
                            this.state.activeNav===0 ? '任务列表' : '任务日历'
                        }
                    </div>
                    <div className='title-navul nav-ul'>
                        <ul>
                            {this.state.nav.map((item, index) => {
                                return <li key={index}
                                           className={index === this.state.activeNav ? 'active-nav' : ''}
                                           onClick={this.handleChangeNav.bind(this, index)}><span>{item}</span></li>;
                            })}
                        </ul>
                    </div>
                </div>
                {this.state.activeNav===0 && <TaskList/>}
                {this.state.activeNav===1 && <TaskCalendar/>}
            </div>
        );
    }
}

const mapStateprops = (state) => {
    const {Alldate, slideName} = state.agriculturalTaskReducer;
    const { securityKeyWord } = state.initReducer;
    //const securityKeyWord = ['tasklist_listByPage','tasklist_update','tasklist_getById','taskcalendar_listByPage'];
    return {
        dataList: Alldate,//展示列表的数据
        slideName,securityKeyWord
    };
};
export default connect(mapStateprops, action)(Resources);
