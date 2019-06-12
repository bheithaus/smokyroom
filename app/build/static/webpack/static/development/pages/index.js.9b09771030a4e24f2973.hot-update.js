webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/Navbar.js":
/*!******************************!*\
  !*** ./components/Navbar.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "../node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ "../node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "../node_modules/react-bootstrap/es/index.js");
/* harmony import */ var _components_Theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Theme */ "./components/Theme.js");
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-select */ "../node_modules/react-select/dist/react-select.browser.esm.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! axios */ "../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_6__);





function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






 // Hack to work with non-react implementation of Three.js scene

var removeCanvas = function removeCanvas() {
  var canvas = document.getElementsByTagName('canvas');
  document.body.removeChild(canvas[0]);
  document.body.removeChild(window.statsElement);
}; // TODO - put drop down select with test trials loaded


var Navbar = function Navbar(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      selectOptions = _useState2[0],
      setSelectOptions = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(),
      _useState4 = _slicedToArray(_useState3, 2),
      selected = _useState4[0],
      setSelected = _useState4[1];

  var selectHandleChange = function selectHandleChange(selectedOption) {
    setSelected(selectedOption);
    console.log("Option selected:", selectedOption);
  };

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    var AVAILABLE_TRIALS_URL = '/api/trials';

    var fetchAvailableTrials =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var response, options;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_6___default.a.get(AVAILABLE_TRIALS_URL);

              case 3:
                response = _context.sent;
                options = response.data.map(function (trial) {
                  return {
                    value: trial,
                    label: trial
                  };
                });
                setSelectOptions(options);
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      return function fetchAvailableTrials() {
        return _ref.apply(this, arguments);
      };
    }();

    fetchAvailableTrials();
  }, []);

  var selectWithData = function selectWithData() {
    if (!selectOptions.length) {
      return null;
    }

    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
      value: selected,
      onChange: selectHandleChange,
      options: selectOptions
    });
  };

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "navbar"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(next_link__WEBPACK_IMPORTED_MODULE_2___default.a, {
    href: "/upload"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "btn btn-primary"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    onClick: removeCanvas
  }, "Upload Trial Data"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    id: "select-trial"
  }, "Select Trial"), selectWithData());
};

/* harmony default export */ __webpack_exports__["default"] = (Navbar);

/***/ })

})
//# sourceMappingURL=index.js.9b09771030a4e24f2973.hot-update.js.map