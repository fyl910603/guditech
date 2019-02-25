export const namespace = 'callTelephone';

export default {
  namespace,
  state: {
    backgroundColor:'#e73c2c',
  },

  subscriptions: {
  },

  effects: {
  },

  reducers: {
    init(state, { payload }) {
      return {
        ...state,
        backgroundColor: '#e73c2c',
      };
    },
    fetchSuceess(state, { payload }) {
      return {
        ...state,
        backgroundColor: '#e73c2c'
      };
    },
    fetchError(state, { payload }) {
      return {
        ...state,
        backgroundColor: '#9D9D9D'
      };
    }
  },
};

