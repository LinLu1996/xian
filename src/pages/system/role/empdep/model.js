
import {context} from '@/app/io';

//配置接口参数
context.create('roleres', {
    getdata: {
      url: '/empOrg/updateByEmpId',
      mockUrl: '/proxy/empOrg/updateByEmpId',
      header:{
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    },
    gethavedata:{
        url:'/roleResource/getResIdsByRoleId/:id',
        mockUrl:'/proxy/roleResource/getResIdsByRoleId/:id',
        rest: true
    }
  });