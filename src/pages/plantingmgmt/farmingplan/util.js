import React from 'react';
import {Select} from 'antd';
const Option = Select.Option;

export default {

  // 日期格式化 返回年月日
  formateDate(time) {
    if (!time) return '';
    const date = new Date(time);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  // select options 配置
  getOptionList(data,method) {
    if (!data) {
      return [];
    }
    const options = [];
    data.map( item => {
      options.push(<Option value={item.id}  key={item.id} onChange={method? this.method:this.handleChange}>{item.name}</Option>);
    });
    return options;
  },
    updateSelectedItem(selectedRowKeys, selectedItem, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedItem,
                selectedIds
            });
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem
            });
        }
    }

 };