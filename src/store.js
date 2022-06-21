import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./reducers/counter";
import mapManagementReducer from "./reducers/map-management";
import selectionReducer from "./reducers/selection";
import keyboardReducer from "./reducers/keyboard-management";
import shipToGroupsReducer from "./reducers/ship-to-group-management";

export default configureStore({
  reducer: {
    counter: counterReducer,
    mapManagement: mapManagementReducer,
    selection: selectionReducer,
    keyboard: keyboardReducer,
    shipToGroupsManagement: shipToGroupsReducer,
  },
});
