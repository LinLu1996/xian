import reducers from '@/app/reducers';
import {context, IO} from '@/app/io';

//配置接口参数
context.create('masterdata', {
    GetAllWorkType: {
    mockUrl: '/proxy/workOperation/getAllWorkType',
    method: 'GET'
  },
    Modifydata: {
        mockUrl: '/proxy/workPeriod/update',
        url: '/workPeriod/update',
        method: 'POST'
    },
    Modifydata_operation: {
        mockUrl: '/proxy/workOperation/update',
        url: '/workOperation/update',
        method: 'POST'
    },
    CheckName_crop: {
        mockUrl: '/proxy/astCrop/checkName',
        url: '/astCrop/checkName',
        method: 'GET'
    },
    CheckName_period: {
        mockUrl: '/proxy/workPeriod/checkName',
        url: '/workPeriod/checkName',
        method: 'GET'
    },
    CheckName_grade: {
        mockUrl: '/proxy/astGradeGroup/checkName',
        url: '/astGradeGroup/checkName',
        method: 'GET'
    },
    CheckName_material: {
        mockUrl: '/proxy/astMaterials/checkNameUnique',
        url: '/astMaterials/checkNameUnique',
        method: 'POST'
    },
    Modifydata_cropdata: {
        mockUrl: '/proxy/cropCate/update',
        url: '/cropCate/update',
        method: 'POST'
    },
    Modifydata_material: {
        mockUrl: '/proxy/astMaterials/update',
        url: '/astMaterials/update',
        method: 'POST'
    },
    Modifydata_crop: {
        mockUrl: '/proxy/astCrop/update',
        url: '/astCrop/update',
        method: 'POST'
    },
    Modifydata_knowledgeManagement: {
        mockUrl: '/proxy/cropCate/update',
        url: '/cropCate/update',
        method: 'POST'
    },
    ModifydataLand_base: {
        mockUrl: '/proxy/astLand/update',
        url: '/astLand/update',
        method: 'POST'
    },
    Modifydata_solution: {
        mockUrl: '/proxy/workSolution/update',
        url: '/workSolution/update',
        method: 'POST'
    },
    Modifydata_chargeunit: {
        mockUrl: '/proxy/chargeUnit/update',
        url: '/chargeUnit/update',
        method: 'POST'
    }
});

//封装页面reducer、action
const farmingAdminModel = {
  reducer: (defaultState = {
    AllWorkType:[]
  }, action) => {
    switch (action.type) {
        case 'RES_GET_ALL_WORK_TYPE': {
          const queryAlls = action.data;
          return Object.assign({}, defaultState, {
            AllWorkType:queryAlls
          });
        }
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      test: (data) => {
        dispatch({
          type: 'TEST',
          value: data
        });
      },
      getAllWorkType: async () => {  //筛选的列表数据
          const res = await IO.farmingOperations.GetAllWorkType();
            const data = res.data;
            dispatch({
              type: "RES_GET_ALL_WORK_TYPE",
              data
            });
        }
    };

  }
};

reducers.assemble = {masterdataReducer: farmingAdminModel.reducer};

const action = farmingAdminModel.action;
const IOModel = {
  GetAllWorkType:IO.farmingOperations.GetAllWorkType,
  Modifydata:IO.masterdata.Modifydata,
  Modifydata_operation:IO.masterdata.Modifydata_operation,
    CheckName_crop:IO.masterdata.CheckName_crop,
    CheckName_period:IO.masterdata.CheckName_period,
    CheckName_grade:IO.masterdata.CheckName_grade,
    CheckName_material:IO.masterdata.CheckName_material,
    Modifydata_cropdata:IO.masterdata.Modifydata_cropdata,
    Modifydata_material:IO.masterdata.Modifydata_material,
    Modifydata_crop:IO.masterdata.Modifydata_crop,
    Modifydata_knowledgeManagement:IO.masterdata.Modifydata_knowledgeManagement,
    ModifydataLand_base:IO.masterdata.ModifydataLand_base,
    Modifydata_solution:IO.masterdata.Modifydata_solution,
    Modifydata_chargeunit:IO.masterdata.Modifydata_chargeunit
};
export {
  action,
  IO,
  IOModel
};
