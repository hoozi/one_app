import { 
  createStore, 
  applyMiddleware,
  Middleware,
} from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from './reducer';

const middlewares: Middleware[] = [
  reduxThunk
];

const store = createStore(
  reducer,
  {},
  applyMiddleware(...middlewares)
);

export default store;