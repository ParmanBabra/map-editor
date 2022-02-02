import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./reducers/counter";
import mapManagementReducer from "./reducers/map-management";
import selectionReducer from "./reducers/selection";

export default configureStore({
  reducer: {
    counter: counterReducer,
    mapManagement: mapManagementReducer,
    selection: selectionReducer,
  },
});
