
import {message} from 'antd';
import {IOModel} from "./model";

 export default {
     async changeStatus(record,type) {
         let flag=true;
         const deleteID = record.id;
         let stautsId = 0;
         if (record.stauts === 0) {
             stautsId = 1;
         } else {
             stautsId = 0;
         }
         if(type==='period_status') {
             await IOModel.Modifydata({id: deleteID, userId: 1, stauts: stautsId}).then((res) => {
                 if (res.success) {
                     if (stautsId === 1) {
                         message.success('禁用成功');
                     } else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='operation_status') {
             await IOModel.Modifydata_operation({id:deleteID,modifyUserId:1,stauts:stautsId}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='cropdata_status') {
             await IOModel.Modifydata_cropdata({id: deleteID, stauts: stautsId, companyId: 1}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='material_status') {
             await IOModel.Modifydata_material({id:deleteID,stauts:stautsId}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='crop_status') {
             await IOModel.Modifydata_crop({id: deleteID, userId: 1, stauts: stautsId}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='knowledgeManagement_status') {
             await IOModel.Modifydata_knowledgeManagement({id: deleteID, stauts: stautsId, companyId: 1}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='base_status') {
             await IOModel.ModifydataLand_base({id: deleteID, stauts: stautsId, baseId: record.baseId}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='solution_status') {
             await IOModel.Modifydata_solution({id: deleteID, userId: 1, stauts: stautsId}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         if(type==='chargeunit_status') {
             await IOModel.Modifydata_chargeunit({id: deleteID, stauts: stautsId}).then((res) => {
                 if(res.success) {
                     if(stautsId === 1) {
                         message.success('禁用成功');
                     }else {
                         message.success('启用成功');
                     }
                     flag=true;
                 }
             }).catch(() => {
                 message.error("操作失败");
                 flag=false;
             });
         }
         return flag;
     },
     async checkName(name,id,type) {
         let saveFlag=true;
         if(name) {
             if(type==='checkName_crop') {
                 await IOModel.CheckName_crop({companyId:1,name:name,id:id}).then((res) => {  //添加成功时的回
                     if (res.success) {
                         if  (res.data === 0) {
                             saveFlag=false;
                             message.warning('农事操作名已存在');
                         } else if (res.data === -1) {
                             message.error('验证失败');
                         } else if(res.data > 0) {
                             saveFlag=true;
                         }
                     } else {
                         message.error('验证失败');
                     }
                     return saveFlag;
                 }).catch(() => {
                     message.error('验证失败');
                 });
             }
             if(type==='checkName_period') {
                 await IOModel.CheckName_period({companyId: 1, name: name, id: id}).then((res) => {  //添加成功时的回
                     if (res.success) {
                         if (res.data === 0) {
                             saveFlag=false;
                             message.warning('生长周期名已存在');
                         } else if (res.data === -1) {
                             message.error('验证失败');
                         } else if(res.data > 0) {
                             saveFlag=true;
                         }
                     } else {
                         message.error('验证失败');
                     }
                 }).catch(() => {
                     message.error('验证失败');
                 });
             }
             if(type==='checkName_grade') {
                 await IOModel.CheckName_grade({companyId: 1, name: name, id: id}).then((res) => {  //添加成功时的回
                     if (res.success) {
                         if (res.data === 0) {
                             saveFlag=false;
                             message.warning('等级组名已存在');
                         } else if (res.data === -1) {
                             message.error('验证失败');
                         } else if(res.data > 0) {
                             saveFlag=true;
                         }
                     } else {
                         message.error('验证失败');
                     }
                 }).catch(() => {
                     message.error('验证失败');
                 });
             }
             if(type==='checkName_material') {
                 await IOModel.CheckName_material({companyId:1,name:name,id:id}).then((res) => {  //添加成功时的回
                     if (res.success) {
                         if  (res.data === 0) {
                             saveFlag=false;
                             message.warning('农资名已存在');
                         } else if (res.data === -1) {
                             message.error('验证失败');
                         } else if(res.data > 0) {
                             saveFlag=true;
                         }
                     } else {
                         message.error('验证失败');
                     }
                 }).catch(() => {
                     message.error('验证失败');
                 });
             }
             return saveFlag;
         }
     }
 };