import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Menu} from 'antd';
import './index.less';

const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'normal',
            openList: [],
            menuData: []
        };
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.data) {
            let currentMenu = {};
            const openList = [];
            await nextProps.data.map(item => {
                if (location.hash.indexOf(item.resUrl) > -1) {
                    currentMenu = item;
                    return;
                }
            });
            await this.setState({
                menuData: currentMenu
            });
            if (currentMenu && currentMenu.childrens) {
                await currentMenu.childrens.forEach((item) => {
                    openList.push(`sub${item.id}`);
                });
            }
            if (this.state.page !== currentMenu.keyword) {
                await this.setState({
                    page: currentMenu.keyword,
                    openList: openList
                });
            }
        }
    }

    MenuItem(item) {
        return item.childrens.map((text) => {
            const url = text.pageUrl ? `${text.pageUrl}` : '/';
            if (text.childrens) {
                return this.MenuItem(text);
            }
                return <Menu.Item key={text.pageUrl}><NavLink style={{paddingLeft: '5px'}} activeClassName='is-active'
                                                              to={url}>{text.resName}</NavLink></Menu.Item>;
        });
    }

    menuChange(openKeys) {
        this.setState({
            openList: openKeys
        });
    }

    render() {
        const {openList,menuData} = this.state;
        const iconClass = menuData.icon ? `iconfont ${menuData.icon}` : 'iconfont icon-xiangmuguanli';
        return (
            <div className='menubox'>
                <div className='menu-title'>
                    <div className='menu-cont'>
                        <div className='menu-icon'>
                            <div className='p1'><i className={iconClass}></i></div>
                            <div className='p2'>{menuData.resName}</div>
                        </div>
                    </div>
                </div>
                <Menu
                    mode="inline"
                    className='menu'
                    openKeys={openList}
                    onOpenChange={this.menuChange.bind(this)}
                >
                    {
                        (menuData.childrens || []).map((item) => {
                            const url = item.pageUrl ? `${item.pageUrl}` : '/';
                            const icon = `iconfont ${item.icon}`;
                            if (item.childrens && item.childrens.length > 0) {
                                        return <SubMenu key={`sub${item.id}`} title={<span><i className={icon}
                                                                                              style={{paddingRight: '5px'}}/>{item.resName}</span>}>
                                            {
                                                item.childrens ? this.MenuItem(item) : ''
                                            }
                                        </SubMenu>;
                            } else {
                                return <MenuItemGroup key={item.id} title={<span><NavLink style={{paddingLeft: '5px'}}
                                                                                          activeClassName='is-active'
                                                                                          to={url}><i className={icon}
                                                                                                      style={{paddingRight: '5px'}}/>{item.resName}</NavLink></span>}>
                                    {
                                        item.childrens ? this.MenuItem(item) : ''
                                    }
                                </MenuItemGroup>;
                            }
                        })
                    }
                </Menu>
            </div>);
    }
}

export default Sidebar;