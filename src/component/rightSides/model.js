import reducers from '@/app/reducers';

//封装页面reducer、action
const rightSideModel = {
  reducer: (defaultState = {
    scrollnum:0
  }, action) => {
    switch(action.type) {
      case 'RIGHTSIDEMODEL_GETSCROLL':
        return Object.assign({}, defaultState, {
            scrollnum: action.scrollnum
        });
    }
    return defaultState;
  },
  action: (dispatch) => {
    return {
      getScroll: (data) => {
        dispatch({
          type: 'RIGHTSIDEMODEL_GETSCROLL',
          scrollnum: data
        });
      }
    };
  }
};

reducers.assemble = {rightSideModel: rightSideModel.reducer};

const action = rightSideModel.action;

export {
  action
};
