/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/js/components/form.js":
/*!**************************************!*\
  !*** ./client/js/components/form.js ***!
  \**************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DIForm)
/* harmony export */ });
/* harmony import */ var _fizzetch_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../fizzetch.js */ "./client/js/fizzetch.js");
/* harmony import */ var _loader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loader.js */ "./client/js/loader.js");


const HTML = html => `
<div class="inputs">${html}</div>
<div class="bottom">
  <button type="submit"></button>
  <div class="error-message hidden"></div>
</div>
`;
class DIForm extends HTMLFormElement {
  _inputs;
  _errorMessage;
  submitButton;
  constructor(options) {
    super();
    options = {
      async: false,
      action: '',
      submitText: 'Submit',
      success: () => {},
      customFetch: false,
      fullscreenLoading: false,
      extraData: {},
      html: '',
      ...options
    };
    this.options = options;
    this.classList.add('di-form');
    this.innerHTML = HTML(options.html);
    this._inputs = this.querySelector('.inputs');
    this.submitButton = this.querySelector('button');
    this.submitButton.textContent = options.submitText;
    this._errorMessage = this.querySelector('.error-message');
    if (options.action) {
      this.setAttribute('action', options.action);
    }
    if (options.async) {
      this.addEventListener('submit', async e => {
        e.preventDefault();
        this._loading();
        const result = options.action instanceof Function ? await options.action() : await (0,_fizzetch_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options.action, this.data());
        this._loadingFinished();
        if (result.error) {
          this.error(result.error);
        } else {
          options.success(result);
          this.dispatchEvent(new Event('success'));
        }
      });
    }
  }
  data() {
    const data = new FormData(this);
    const obj = {};
    Array.from(data.entries()).forEach(([key, val]) => obj[key] = val);
    let extra = this.options.extraData;
    extra = typeof extra === 'function' ? extra() : extra;
    extra = extra ? extra : {};
    return {
      ...obj,
      ...extra
    };
  }
  addInput(options, label = null) {
    const input = document.createElement('input');
    for (let key in options) {
      input.setAttribute(key, options[key]);
    }
    this._addInput(input, label);
  }
  _addInput(inputEl, label = null) {
    const labelEl = document.createElement('label');
    if (label) {
      const span = document.createElement('span');
      span.textContent = label;
      labelEl.appendChild(span);
    }
    labelEl.appendChild(inputEl);
    this._inputs.appendChild(labelEl);
  }
  addSelect(options) {
    options = {
      label: null,
      name: '',
      optionsList: [],
      ...options
    };
    const label = document.createElement('label');
    label.classList.add('flex-between');
    if (options.label) {
      const span = document.createElement('span');
      span.textContent = options.label;
      label.appendChild(span);
    }
    const select = document.createElement('select');
    select.setAttribute('name', options.name);
    options.optionsList.forEach(({
      value,
      name
    }) => {
      const options = document.createElement('option');
      options.value = value;
      options.textContent = name;
      select.appendChild(options);
    });
    label.appendChild(select);
    this._inputs.appendChild(label);
    return select;
  }
  error(message) {
    if (message?.message) {
      message = message.message;
    }
    this._errorMessage.textContent = message;
    this._errorMessage.classList.remove('hidden');
  }
  _loading() {
    if (this.options.fullscreenLoading) {
      return (0,_loader_js__WEBPACK_IMPORTED_MODULE_1__.showLoader)(this.options.fullscreenLoading.message ?? '');
    }
    this._errorMessage.classList.add('hidden');
    this.submitButton.disabled = true;
    this.submitButton.innerHTML = '<span class="spin-effect">DI</span>';
  }
  _loadingFinished() {
    if (this.options.fullscreenLoading) {
      return (0,_loader_js__WEBPACK_IMPORTED_MODULE_1__.hideLoader)();
    }
    this.submitButton.disabled = false;
    this.submitButton.textContent = this.options.submitText;
  }
}
customElements.define('di-form', DIForm, {
  extends: 'form'
});

/***/ }),

/***/ "./client/js/fizzetch.js":
/*!*******************************!*\
  !*** ./client/js/fizzetch.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__(url, data = null) {
  let resp;
  let text;
  try {
    const obj = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (data) {
      obj.body = JSON.stringify(data);
    }
    resp = await fetch(url, obj);
    text = await resp.text();
    return text ? JSON.parse(text) : {};
  } catch (ex) {
    if (!resp || resp.status >= 400) {
      if (text) {
        return {
          error: text
        };
      }
      return {
        error: ex || `An error occurred during fizzetch of ${url}`
      };
    }
    return {};
  }
}

/***/ }),

/***/ "./client/js/loader.js":
/*!*****************************!*\
  !*** ./client/js/loader.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hideLoader": () => (/* binding */ hideLoader),
/* harmony export */   "showLoader": () => (/* binding */ showLoader)
/* harmony export */ });
const loader = document.querySelector('body > #loader');
function hideLoader() {
  loader.classList.remove('show');
}
function showLoader(message = '') {
  loader.querySelector('.message').textContent = message;
  loader.classList.add('show');
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************************!*\
  !*** ./client/js/entryPoints/newuser.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_form_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/form.js */ "./client/js/components/form.js");

const diform = new _components_form_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
  submitText: 'Save'
});
diform.addInput({
  type: 'text',
  name: 'displayname',
  minLength: 2,
  maxLength: 15,
  required: 'required',
  placeholder: 'Choose a username'
});
document.querySelector('.new-user-form').appendChild(diform);
if (window.ERROR) {
  diform.error(window.ERROR);
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsTUFBTSxDQUFDO0FBQzlCOzs7Ozs7VUNUQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjBDO0FBRTFDLE1BQU0yRCxNQUFNLEdBQUcsSUFBSTFFLDJEQUFNLENBQUM7RUFDeEJTLFVBQVUsRUFBRTtBQUNkLENBQUMsQ0FBQztBQUNGaUUsTUFBTSxDQUFDbEMsUUFBUSxDQUFDO0VBQ2RtQyxJQUFJLEVBQUUsTUFBTTtFQUNaeEIsSUFBSSxFQUFFLGFBQWE7RUFDbkJ5QixTQUFTLEVBQUUsQ0FBQztFQUNaQyxTQUFTLEVBQUUsRUFBRTtFQUNiQyxRQUFRLEVBQUUsVUFBVTtFQUNwQkMsV0FBVyxFQUFFO0FBQ2YsQ0FBQyxDQUFDO0FBQ0ZwQyxRQUFRLENBQUMxQixhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQ2dDLFdBQVcsQ0FBQ3lCLE1BQU0sQ0FBQztBQUU1RCxJQUFHTSxNQUFNLENBQUNDLEtBQUssRUFBQztFQUNkUCxNQUFNLENBQUM5QyxLQUFLLENBQUNvRCxNQUFNLENBQUNDLEtBQUssQ0FBQztBQUM1QixDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbXktd2VicGFjay1wcm9qZWN0Ly4vY2xpZW50L2pzL2NvbXBvbmVudHMvZm9ybS5qcyIsIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3QvLi9jbGllbnQvanMvZml6emV0Y2guanMiLCJ3ZWJwYWNrOi8vbXktd2VicGFjay1wcm9qZWN0Ly4vY2xpZW50L2pzL2xvYWRlci5qcyIsIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbXktd2VicGFjay1wcm9qZWN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3QvLi9jbGllbnQvanMvZW50cnlQb2ludHMvbmV3dXNlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZml6emV0Y2ggZnJvbSAnLi4vZml6emV0Y2guanMnXHJcbmltcG9ydCB7IGhpZGVMb2FkZXIsIHNob3dMb2FkZXIgfSBmcm9tICcuLi9sb2FkZXIuanMnXHJcblxyXG5jb25zdCBIVE1MID0gKGh0bWwpID0+IGBcclxuPGRpdiBjbGFzcz1cImlucHV0c1wiPiR7aHRtbH08L2Rpdj5cclxuPGRpdiBjbGFzcz1cImJvdHRvbVwiPlxyXG4gIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPjwvYnV0dG9uPlxyXG4gIDxkaXYgY2xhc3M9XCJlcnJvci1tZXNzYWdlIGhpZGRlblwiPjwvZGl2PlxyXG48L2Rpdj5cclxuYFxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRElGb3JtIGV4dGVuZHMgSFRNTEZvcm1FbGVtZW50e1xyXG5cclxuICBfaW5wdXRzXHJcbiAgX2Vycm9yTWVzc2FnZVxyXG4gIHN1Ym1pdEJ1dHRvblxyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcclxuICAgIHN1cGVyKClcclxuXHJcbiAgICBvcHRpb25zID0ge1xyXG4gICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgIGFjdGlvbjogJycsXHJcbiAgICAgIHN1Ym1pdFRleHQ6ICdTdWJtaXQnLFxyXG4gICAgICBzdWNjZXNzOiAoKSA9PiB7fSxcclxuICAgICAgY3VzdG9tRmV0Y2g6IGZhbHNlLFxyXG4gICAgICBmdWxsc2NyZWVuTG9hZGluZzogZmFsc2UsXHJcbiAgICAgIGV4dHJhRGF0YToge30sXHJcbiAgICAgIGh0bWw6ICcnLFxyXG4gICAgICAuLi5vcHRpb25zXHJcbiAgICB9XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcblxyXG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdkaS1mb3JtJylcclxuICAgIHRoaXMuaW5uZXJIVE1MID0gSFRNTChvcHRpb25zLmh0bWwpXHJcbiAgICB0aGlzLl9pbnB1dHMgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5pbnB1dHMnKVxyXG4gICAgdGhpcy5zdWJtaXRCdXR0b24gPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpXHJcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9IG9wdGlvbnMuc3VibWl0VGV4dFxyXG4gICAgdGhpcy5fZXJyb3JNZXNzYWdlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuZXJyb3ItbWVzc2FnZScpXHJcblxyXG4gICAgaWYob3B0aW9ucy5hY3Rpb24pe1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnYWN0aW9uJywgb3B0aW9ucy5hY3Rpb24pXHJcbiAgICB9XHJcblxyXG4gICAgaWYob3B0aW9ucy5hc3luYyl7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgZSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgdGhpcy5fbG9hZGluZygpXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gb3B0aW9ucy5hY3Rpb24gaW5zdGFuY2VvZiBGdW5jdGlvbiA/IGF3YWl0IG9wdGlvbnMuYWN0aW9uKCkgOiBhd2FpdCBmaXp6ZXRjaChvcHRpb25zLmFjdGlvbiwgdGhpcy5kYXRhKCkpXHJcbiAgICAgICAgdGhpcy5fbG9hZGluZ0ZpbmlzaGVkKClcclxuICAgICAgICBpZihyZXN1bHQuZXJyb3Ipe1xyXG4gICAgICAgICAgdGhpcy5lcnJvcihyZXN1bHQuZXJyb3IpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MocmVzdWx0KVxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnc3VjY2VzcycpKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRhdGEoKXtcclxuICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEodGhpcylcclxuICAgIGNvbnN0IG9iaiA9IHt9XHJcbiAgICBBcnJheS5mcm9tKGRhdGEuZW50cmllcygpKS5mb3JFYWNoKChba2V5LCB2YWxdKSA9PiBvYmpba2V5XSA9IHZhbClcclxuXHJcbiAgICBsZXQgZXh0cmEgPSB0aGlzLm9wdGlvbnMuZXh0cmFEYXRhXHJcbiAgICBleHRyYSA9IHR5cGVvZiBleHRyYSA9PT0gJ2Z1bmN0aW9uJyA/IGV4dHJhKCkgOiBleHRyYVxyXG4gICAgZXh0cmEgPSBleHRyYSA/IGV4dHJhIDoge31cclxuXHJcbiAgICByZXR1cm4geyAuLi5vYmosIC4uLmV4dHJhIH1cclxuICB9XHJcblxyXG4gIGFkZElucHV0KG9wdGlvbnMsIGxhYmVsID0gbnVsbCl7XHJcblxyXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpXHJcbiAgICBmb3IgKGxldCBrZXkgaW4gb3B0aW9ucyl7XHJcbiAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShrZXksIG9wdGlvbnNba2V5XSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9hZGRJbnB1dChpbnB1dCwgbGFiZWwpXHJcbiAgfVxyXG5cclxuICBfYWRkSW5wdXQoaW5wdXRFbCwgbGFiZWwgPSBudWxsKXtcclxuXHJcbiAgICBjb25zdCBsYWJlbEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKVxyXG4gICAgaWYobGFiZWwpe1xyXG4gICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBsYWJlbFxyXG4gICAgICBsYWJlbEVsLmFwcGVuZENoaWxkKHNwYW4pXHJcbiAgICB9XHJcblxyXG4gICAgbGFiZWxFbC5hcHBlbmRDaGlsZChpbnB1dEVsKVxyXG4gICAgdGhpcy5faW5wdXRzLmFwcGVuZENoaWxkKGxhYmVsRWwpXHJcbiAgfVxyXG5cclxuICBhZGRTZWxlY3Qob3B0aW9ucyl7XHJcblxyXG4gICAgb3B0aW9ucyA9IHtcclxuICAgICAgbGFiZWw6IG51bGwsXHJcbiAgICAgIG5hbWU6ICcnLFxyXG4gICAgICBvcHRpb25zTGlzdDogW10sXHJcbiAgICAgIC4uLm9wdGlvbnNcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJylcclxuICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZsZXgtYmV0d2VlbicpXHJcbiAgICBpZihvcHRpb25zLmxhYmVsKXtcclxuICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgICBzcGFuLnRleHRDb250ZW50ID0gb3B0aW9ucy5sYWJlbFxyXG4gICAgICBsYWJlbC5hcHBlbmRDaGlsZChzcGFuKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpXHJcbiAgICBzZWxlY3Quc2V0QXR0cmlidXRlKCduYW1lJywgb3B0aW9ucy5uYW1lKVxyXG4gICAgb3B0aW9ucy5vcHRpb25zTGlzdC5mb3JFYWNoKCh7IHZhbHVlLCBuYW1lIH0pID0+IHtcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpXHJcbiAgICAgIG9wdGlvbnMudmFsdWUgPSB2YWx1ZVxyXG4gICAgICBvcHRpb25zLnRleHRDb250ZW50ID0gbmFtZVxyXG4gICAgICBzZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9ucylcclxuICAgIH0pXHJcbiAgICBsYWJlbC5hcHBlbmRDaGlsZChzZWxlY3QpXHJcblxyXG4gICAgdGhpcy5faW5wdXRzLmFwcGVuZENoaWxkKGxhYmVsKVxyXG4gICAgcmV0dXJuIHNlbGVjdFxyXG4gIH1cclxuXHJcbiAgZXJyb3IobWVzc2FnZSl7XHJcbiAgICBpZihtZXNzYWdlPy5tZXNzYWdlKXtcclxuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2UubWVzc2FnZVxyXG4gICAgfVxyXG4gICAgdGhpcy5fZXJyb3JNZXNzYWdlLnRleHRDb250ZW50ID0gbWVzc2FnZVxyXG4gICAgdGhpcy5fZXJyb3JNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXHJcbiAgfVxyXG5cclxuICBfbG9hZGluZygpe1xyXG4gICAgaWYodGhpcy5vcHRpb25zLmZ1bGxzY3JlZW5Mb2FkaW5nKXtcclxuICAgICAgcmV0dXJuIHNob3dMb2FkZXIodGhpcy5vcHRpb25zLmZ1bGxzY3JlZW5Mb2FkaW5nLm1lc3NhZ2UgPz8gJycpXHJcbiAgICB9XHJcbiAgICB0aGlzLl9lcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcclxuICAgIHRoaXMuc3VibWl0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgdGhpcy5zdWJtaXRCdXR0b24uaW5uZXJIVE1MID0gJzxzcGFuIGNsYXNzPVwic3Bpbi1lZmZlY3RcIj5ESTwvc3Bhbj4nXHJcbiAgfVxyXG5cclxuICBfbG9hZGluZ0ZpbmlzaGVkKCl7XHJcbiAgICBpZih0aGlzLm9wdGlvbnMuZnVsbHNjcmVlbkxvYWRpbmcpe1xyXG4gICAgICByZXR1cm4gaGlkZUxvYWRlcigpXHJcbiAgICB9XHJcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlXHJcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5zdWJtaXRUZXh0XHJcbiAgfVxyXG59XHJcblxyXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2RpLWZvcm0nLCBESUZvcm0sIHsgZXh0ZW5kczogJ2Zvcm0nIH0pIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24odXJsLCBkYXRhID0gbnVsbCl7XHJcbiAgbGV0IHJlc3BcclxuICBsZXQgdGV4dFxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBvYmogPSB7XHJcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoZGF0YSl7XHJcbiAgICAgIG9iai5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuICAgIH1cclxuXHJcbiAgICByZXNwID0gYXdhaXQgZmV0Y2godXJsLCBvYmopXHJcbiAgICB0ZXh0ID0gYXdhaXQgcmVzcC50ZXh0KClcclxuICAgIHJldHVybiB0ZXh0ID8gSlNPTi5wYXJzZSh0ZXh0KSA6IHt9XHJcbiAgfWNhdGNoKGV4KXtcclxuICAgIGlmKCFyZXNwIHx8IHJlc3Auc3RhdHVzID49IDQwMCl7XHJcbiAgICAgIGlmKHRleHQpe1xyXG4gICAgICAgIHJldHVybiB7IGVycm9yOiB0ZXh0IH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4geyBlcnJvcjogZXggfHwgYEFuIGVycm9yIG9jY3VycmVkIGR1cmluZyBmaXp6ZXRjaCBvZiAke3VybH1gIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7fVxyXG4gIH1cclxufSIsImNvbnN0IGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkgPiAjbG9hZGVyJylcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoaWRlTG9hZGVyKCl7XHJcbiAgbG9hZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hvd0xvYWRlcihtZXNzYWdlID0gJycpe1xyXG4gIGxvYWRlci5xdWVyeVNlbGVjdG9yKCcubWVzc2FnZScpLnRleHRDb250ZW50ID0gbWVzc2FnZVxyXG4gIGxvYWRlci5jbGFzc0xpc3QuYWRkKCdzaG93JylcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IERJRm9ybSBmcm9tICcuLi9jb21wb25lbnRzL2Zvcm0uanMnXHJcblxyXG5jb25zdCBkaWZvcm0gPSBuZXcgRElGb3JtKHtcclxuICBzdWJtaXRUZXh0OiAnU2F2ZSdcclxufSlcclxuZGlmb3JtLmFkZElucHV0KHtcclxuICB0eXBlOiAndGV4dCcsXHJcbiAgbmFtZTogJ2Rpc3BsYXluYW1lJyxcclxuICBtaW5MZW5ndGg6IDIsXHJcbiAgbWF4TGVuZ3RoOiAxNSxcclxuICByZXF1aXJlZDogJ3JlcXVpcmVkJyxcclxuICBwbGFjZWhvbGRlcjogJ0Nob29zZSBhIHVzZXJuYW1lJ1xyXG59KVxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXVzZXItZm9ybScpLmFwcGVuZENoaWxkKGRpZm9ybSlcclxuXHJcbmlmKHdpbmRvdy5FUlJPUil7XHJcbiAgZGlmb3JtLmVycm9yKHdpbmRvdy5FUlJPUilcclxufVxyXG5cclxuIl0sIm5hbWVzIjpbImZpenpldGNoIiwiaGlkZUxvYWRlciIsInNob3dMb2FkZXIiLCJIVE1MIiwiaHRtbCIsIkRJRm9ybSIsIkhUTUxGb3JtRWxlbWVudCIsIl9pbnB1dHMiLCJfZXJyb3JNZXNzYWdlIiwic3VibWl0QnV0dG9uIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiYXN5bmMiLCJhY3Rpb24iLCJzdWJtaXRUZXh0Iiwic3VjY2VzcyIsImN1c3RvbUZldGNoIiwiZnVsbHNjcmVlbkxvYWRpbmciLCJleHRyYURhdGEiLCJjbGFzc0xpc3QiLCJhZGQiLCJpbm5lckhUTUwiLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwiX2xvYWRpbmciLCJyZXN1bHQiLCJGdW5jdGlvbiIsImRhdGEiLCJfbG9hZGluZ0ZpbmlzaGVkIiwiZXJyb3IiLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJGb3JtRGF0YSIsIm9iaiIsIkFycmF5IiwiZnJvbSIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwidmFsIiwiZXh0cmEiLCJhZGRJbnB1dCIsImxhYmVsIiwiaW5wdXQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJfYWRkSW5wdXQiLCJpbnB1dEVsIiwibGFiZWxFbCIsInNwYW4iLCJhcHBlbmRDaGlsZCIsImFkZFNlbGVjdCIsIm5hbWUiLCJvcHRpb25zTGlzdCIsInNlbGVjdCIsInZhbHVlIiwibWVzc2FnZSIsInJlbW92ZSIsImRpc2FibGVkIiwiY3VzdG9tRWxlbWVudHMiLCJkZWZpbmUiLCJleHRlbmRzIiwidXJsIiwicmVzcCIsInRleHQiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJmZXRjaCIsInBhcnNlIiwiZXgiLCJzdGF0dXMiLCJsb2FkZXIiLCJkaWZvcm0iLCJ0eXBlIiwibWluTGVuZ3RoIiwibWF4TGVuZ3RoIiwicmVxdWlyZWQiLCJwbGFjZWhvbGRlciIsIndpbmRvdyIsIkVSUk9SIl0sInNvdXJjZVJvb3QiOiIifQ==