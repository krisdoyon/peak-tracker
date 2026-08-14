"use strict";
exports.__esModule = true;
exports.LoginButton = exports.PlotCompletedButton = exports.ClearMapButton = exports.PlotAllButton = exports.LoadTestButton = void 0;
var ControlPanel_module_scss_1 = require("./ControlPanel.module.scss");
var Buttons_1 = require("components/Buttons");
var apiSlice_1 = require("features/apiSlice");
var mapSlice_1 = require("features/mapSlice");
var reduxHooks_1 = require("hooks/reduxHooks");
var react_router_dom_1 = require("react-router-dom");
var peakUtils_1 = require("utils/peakUtils");
var modalSlice_1 = require("features/modalSlice");
var authSlice_1 = require("features/authSlice");
exports.LoadTestButton = function () {
    var setTestLogEntries = apiSlice_1.useSetTestLogEntriesMutation()[0];
    var navigate = react_router_dom_1.useNavigate();
    var _a = reduxHooks_1.useAppSelector(function (state) { return state.auth; }), userId = _a.userId, token = _a.token, isLoggedIn = _a.isLoggedIn;
    var handleLoad = function () {
        if (confirm("This action will overwrite all existing log entries. Continue?")) {
            setTestLogEntries({ userId: userId, token: token });
            navigate("/log");
        }
    };
    return (React.createElement(Buttons_1.Button, { className: ControlPanel_module_scss_1["default"].btn, onClick: handleLoad, disabled: true }, "LOAD TEST ENTRIES"));
};
exports.PlotAllButton = function () {
    var _a = apiSlice_1.useGetListsQuery().data, allPeakLists = _a === void 0 ? [] : _a;
    var allPeaks = peakUtils_1.getAllUniquePeaks(allPeakLists);
    var dispatch = reduxHooks_1.useAppDispatch();
    return (React.createElement(Buttons_1.Button, { className: ControlPanel_module_scss_1["default"].btn, onClick: function () { return dispatch(mapSlice_1.plotLogEntry(allPeaks)); } }, "PLOT ALL PEAKS"));
};
exports.ClearMapButton = function () {
    var dispatch = reduxHooks_1.useAppDispatch();
    return (React.createElement(Buttons_1.Button, { className: ControlPanel_module_scss_1["default"].btn, onClick: function () { return dispatch(mapSlice_1.clearMap()); } }, "CLEAR MAP"));
};
exports.PlotCompletedButton = function () {
    var dispatch = reduxHooks_1.useAppDispatch();
    var _a = reduxHooks_1.useAppSelector(function (state) { return state.auth; }), isLoggedIn = _a.isLoggedIn, token = _a.token, userId = _a.userId;
    var _b = apiSlice_1.useGetListsQuery().data, allPeakLists = _b === void 0 ? [] : _b;
    var _c = apiSlice_1.useGetLogEntriesQuery({ userId: userId, token: token }, { skip: userId === null || !isLoggedIn || token === null }).data, logEntries = _c === void 0 ? [] : _c;
    var allPeaks = peakUtils_1.getAllUniquePeaks(allPeakLists);
    var completedPeaks = allPeaks.filter(function (peak) {
        return peakUtils_1.isPeakCompleted(peak.id, logEntries);
    });
    return (React.createElement(Buttons_1.Button, { className: ControlPanel_module_scss_1["default"].btn, onClick: function () { return dispatch(mapSlice_1.plotLogEntry(completedPeaks)); } }, "PLOT COMPLETED"));
};
exports.LoginButton = function () {
    var dispatch = reduxHooks_1.useAppDispatch();
    var isLoggedIn = reduxHooks_1.useAppSelector(function (state) { return state.auth; }).isLoggedIn;
    var handleClick = function () {
        if (isLoggedIn) {
            dispatch(authSlice_1.logout());
            return;
        }
        dispatch(modalSlice_1.openModal(modalSlice_1.ModalType.LOGIN));
    };
    return (React.createElement(Buttons_1.Button, { className: ControlPanel_module_scss_1["default"].btn, onClick: handleClick }, isLoggedIn ? "LOG OUT" : "LOG IN"));
};
