import _ from 'lodash';

//合并所有模块的reducers，用来创建store
const reducerAssemble = {
  reducers: {},
  set assemble(reducer) {
    const reducers = _.assign(this.reducers, reducer);
    this.reducers = reducers;
  },
  get assemble() {
    return this.reducers;
  }
};

export default reducerAssemble;