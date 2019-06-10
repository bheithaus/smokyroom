webpackHotUpdate("static/development/pages/upload.js",{

/***/ "./pages/upload.js":
/*!*************************!*\
  !*** ./pages/upload.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/link */ "../node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ "../node_modules/next/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "../node_modules/react-bootstrap/es/index.js");
/* harmony import */ var _components_Theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Theme */ "./components/Theme.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../routes */ "../routes.js");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_routes__WEBPACK_IMPORTED_MODULE_5__);


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }








var Upload =
/*#__PURE__*/
function (_Component) {
  _inherits(Upload, _Component);

  function Upload(props) {
    var _this;

    _classCallCheck(this, Upload);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Upload).call(this, props));
    _this.state = {
      uploading: false
    };
    return _this;
  } // upload to S3


  _createClass(Upload, [{
    key: "handleFileChange",
    value: function handleFileChange(event) {
      var _this2 = this;

      var files = event.target.files;
      var file = files[0];

      if (file == null) {
        return alert('No file selected.');
      }

      this.setState({
        uploading: true
      });
      this.getSignedRequest(file).then(function (options) {
        return _this2.uploadFile(options);
      });
    }
  }, {
    key: "getSignedRequest",
    value: function getSignedRequest(file) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "".concat(_routes__WEBPACK_IMPORTED_MODULE_5___default.a.signS3, "?file-name=").concat(file.name, "&file-type=").concat(file.type));

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve({
                file: file,
                signedRequest: JSON.parse(xhr.responseText).signedRequest
              });
            } else {
              reject(xhr.status);
            }
          }
        };

        xhr.send();
      });
    }
  }, {
    key: "nameFromOptions",
    value: function nameFromOptions(options) {
      return options.file.name.replace('.zip', '');
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(options) {
      var _this3 = this;

      var xhr = new XMLHttpRequest();
      xhr.open('PUT', options.signedRequest);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('file', _this3.nameFromOptions(options));
            next_router__WEBPACK_IMPORTED_MODULE_2___default.a.push("/upload-processing?trial=".concat(_this3.nameFromOptions(options))); // TODO - send to waiting page ?
            // then when files processed, send to home page
          } else {
            alert('Could not upload file.');
          }
        }
      };

      xhr.send(options.file);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Theme__WEBPACK_IMPORTED_MODULE_4__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "heading"
      }, "Please Choose a .zip file containing all CSVs for a Trial"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "text"
      }, "The trial name will be the name of the .zip file"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "preloader",
        style: {
          display: this.state.uploading ? 'block' : 'none'
        }
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "spinner-sm spinner-sm-1",
        id: "status"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group file-upload"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "input-group-btn"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        className: "btn btn-primary"
      }, "Browse\u2026 ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "file",
        style: {
          display: 'none'
        },
        onChange: function onChange(e) {
          return _this4.handleFileChange(e);
        }
      }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        readOnly: true
      })));
    }
  }]);

  return Upload;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Upload);
    (function (Component, route) {
      if(!Component) return
      if (false) {}
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/upload")
  
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "../node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=upload.js.d4caf7fdbeeedb278cb0.hot-update.js.map