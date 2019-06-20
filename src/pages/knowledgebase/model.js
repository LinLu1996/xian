// import reducers from '@/app/reducers';
// import {context, IO} from '@/app/io';
//
// //配置接口参数
// context.create('farmingAdmin', {
// GetAllWorkType: {
//     mockUrl: '/proxy/workOperation/getAllWorkType',
//     url: '/workOperation/getAllWorkType',
//     method: 'GET'
//   }
// });
//
// //封装页面reducer、action
// const farmingAdminModel = {
//   reducer: (defaultState = {
//     AllWorkType:[]
//   }, action) => {
//     switch (action.type) {
//         case 'RES_GET_ALL_WORK_TYPE': {
//           const queryAlls = action.data;
//           return Object.assign({}, defaultState, {
//             AllWorkType:queryAlls
//           });
//         }
//     }
//     return defaultState;
//   },
//   action: (dispatch) => {
//     return {
//       test: (data) => {
//         dispatch({
//           type: 'TEST',
//           value: data
//         });
//       },
//       getAllWorkType: async () => {  //筛选的列表数据
//           const res = await IO.farmingOperations.GetAllWorkType();
//             const data = res.data;
//             dispatch({
//               type: "RES_GET_ALL_WORK_TYPE",
//               data
//             });
//         }
//     };
//
//   }
// };
//
// reducers.assemble = {farmingAdminReducer: farmingAdminModel.reducer};
//
// const action = farmingAdminModel.action;
// const IOModel = {
//   GetAllWorkType:IO.farmingOperations.GetAllWorkType
// };
// export {
//   action,
//   IO,
//   IOModel
// };
