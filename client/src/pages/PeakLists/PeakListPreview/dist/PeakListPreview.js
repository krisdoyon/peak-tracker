"use strict";
exports.__esModule = true;
exports.PeakListPreview = void 0;
var PreviewListItem_module_scss_1 = require("components/PreviewList/PreviewListItem/PreviewListItem.module.scss");
var PreviewList_1 = require("components/PreviewList");
var Buttons_1 = require("components/Buttons");
var ProgressBar_1 = require("components/ProgressBar/ProgressBar");
var react_router_dom_1 = require("react-router-dom");
var useSavedListToggle_1 = require("hooks/useSavedListToggle");
var reduxHooks_1 = require("hooks/reduxHooks");
exports.PeakListPreview = function (_a) {
    var title = _a.title, numCompleted = _a.numCompleted, peakCount = _a.peakCount, listId = _a.listId;
    var navigate = react_router_dom_1.useNavigate();
    var _b = useSavedListToggle_1.useSavedListToggle(listId), isSaved = _b.isSaved, toggleSavedList = _b.toggleSavedList;
    var _c = reduxHooks_1.useAppSelector(function (state) { return state.auth; }), userId = _c.userId, isLoggedIn = _c.isLoggedIn, token = _c.token;
    var disabled = userId === null || !isLoggedIn || token === null;
    return (React.createElement(PreviewList_1.PreviewListItem, null,
        React.createElement(Buttons_1.IconButton, { icon: isSaved ? "remove" : "add", onClick: toggleSavedList, disabled: disabled }),
        React.createElement("div", { className: PreviewListItem_module_scss_1["default"].info },
            React.createElement("h2", { className: PreviewListItem_module_scss_1["default"].heading },
                React.createElement("strong", null, title)),
            React.createElement("span", null, numCompleted + " of " + peakCount + " peaks"),
            React.createElement(ProgressBar_1.ProgressBar, { numCompleted: numCompleted, peakCount: peakCount })),
        React.createElement(Buttons_1.ViewButton, { onClick: function () { return navigate("/peak-lists/" + listId); } })));
};
