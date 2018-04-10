export default function reducer(state, action) {
  if (action.type === 'USER_TOKEN') {
    return state.merge({
      token: action.token,
    });
  }
  return state;
}
