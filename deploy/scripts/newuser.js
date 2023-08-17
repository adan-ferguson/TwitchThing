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
    return { ...obj,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQXFCLFVBQXJCLEVBQWlDQyxXQUFqQyxHQUErQ3FDLE9BQS9DO0FBQ0FrQixFQUFBQSxNQUFNLENBQUMzRCxTQUFQLENBQWlCQyxHQUFqQixDQUFxQixNQUFyQjtBQUNEOzs7Ozs7VUNURDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTkE7QUFFQSxNQUFNMkQsTUFBTSxHQUFHLElBQUkxRSwyREFBSixDQUFXO0FBQ3hCUyxFQUFBQSxVQUFVLEVBQUU7QUFEWSxDQUFYLENBQWY7QUFHQWlFLE1BQU0sQ0FBQ2xDLFFBQVAsQ0FBZ0I7QUFDZG1DLEVBQUFBLElBQUksRUFBRSxNQURRO0FBRWR4QixFQUFBQSxJQUFJLEVBQUUsYUFGUTtBQUdkeUIsRUFBQUEsU0FBUyxFQUFFLENBSEc7QUFJZEMsRUFBQUEsU0FBUyxFQUFFLEVBSkc7QUFLZEMsRUFBQUEsUUFBUSxFQUFFLFVBTEk7QUFNZEMsRUFBQUEsV0FBVyxFQUFFO0FBTkMsQ0FBaEI7QUFRQXBDLFFBQVEsQ0FBQzFCLGFBQVQsQ0FBdUIsZ0JBQXZCLEVBQXlDZ0MsV0FBekMsQ0FBcUR5QixNQUFyRDs7QUFFQSxJQUFHTSxNQUFNLENBQUNDLEtBQVYsRUFBZ0I7QUFDZFAsRUFBQUEsTUFBTSxDQUFDOUMsS0FBUCxDQUFhb0QsTUFBTSxDQUFDQyxLQUFwQjtBQUNELEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3QvLi9jbGllbnQvanMvY29tcG9uZW50cy9mb3JtLmpzIiwid2VicGFjazovL215LXdlYnBhY2stcHJvamVjdC8uL2NsaWVudC9qcy9maXp6ZXRjaC5qcyIsIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3QvLi9jbGllbnQvanMvbG9hZGVyLmpzIiwid2VicGFjazovL215LXdlYnBhY2stcHJvamVjdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9teS13ZWJwYWNrLXByb2plY3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL215LXdlYnBhY2stcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL215LXdlYnBhY2stcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL215LXdlYnBhY2stcHJvamVjdC8uL2NsaWVudC9qcy9lbnRyeVBvaW50cy9uZXd1c2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmaXp6ZXRjaCBmcm9tICcuLi9maXp6ZXRjaC5qcydcclxuaW1wb3J0IHsgaGlkZUxvYWRlciwgc2hvd0xvYWRlciB9IGZyb20gJy4uL2xvYWRlci5qcydcclxuXHJcbmNvbnN0IEhUTUwgPSAoaHRtbCkgPT4gYFxyXG48ZGl2IGNsYXNzPVwiaW5wdXRzXCI+JHtodG1sfTwvZGl2PlxyXG48ZGl2IGNsYXNzPVwiYm90dG9tXCI+XHJcbiAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+PC9idXR0b24+XHJcbiAgPGRpdiBjbGFzcz1cImVycm9yLW1lc3NhZ2UgaGlkZGVuXCI+PC9kaXY+XHJcbjwvZGl2PlxyXG5gXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBESUZvcm0gZXh0ZW5kcyBIVE1MRm9ybUVsZW1lbnR7XHJcblxyXG4gIF9pbnB1dHNcclxuICBfZXJyb3JNZXNzYWdlXHJcbiAgc3VibWl0QnV0dG9uXHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xyXG4gICAgc3VwZXIoKVxyXG5cclxuICAgIG9wdGlvbnMgPSB7XHJcbiAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgYWN0aW9uOiAnJyxcclxuICAgICAgc3VibWl0VGV4dDogJ1N1Ym1pdCcsXHJcbiAgICAgIHN1Y2Nlc3M6ICgpID0+IHt9LFxyXG4gICAgICBjdXN0b21GZXRjaDogZmFsc2UsXHJcbiAgICAgIGZ1bGxzY3JlZW5Mb2FkaW5nOiBmYWxzZSxcclxuICAgICAgZXh0cmFEYXRhOiB7fSxcclxuICAgICAgaHRtbDogJycsXHJcbiAgICAgIC4uLm9wdGlvbnNcclxuICAgIH1cclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcclxuXHJcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2RpLWZvcm0nKVxyXG4gICAgdGhpcy5pbm5lckhUTUwgPSBIVE1MKG9wdGlvbnMuaHRtbClcclxuICAgIHRoaXMuX2lucHV0cyA9IHRoaXMucXVlcnlTZWxlY3RvcignLmlucHV0cycpXHJcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IHRoaXMucXVlcnlTZWxlY3RvcignYnV0dG9uJylcclxuICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gb3B0aW9ucy5zdWJtaXRUZXh0XHJcbiAgICB0aGlzLl9lcnJvck1lc3NhZ2UgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJylcclxuXHJcbiAgICBpZihvcHRpb25zLmFjdGlvbil7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhY3Rpb24nLCBvcHRpb25zLmFjdGlvbilcclxuICAgIH1cclxuXHJcbiAgICBpZihvcHRpb25zLmFzeW5jKXtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBhc3luYyBlID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICB0aGlzLl9sb2FkaW5nKClcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBvcHRpb25zLmFjdGlvbiBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXdhaXQgb3B0aW9ucy5hY3Rpb24oKSA6IGF3YWl0IGZpenpldGNoKG9wdGlvbnMuYWN0aW9uLCB0aGlzLmRhdGEoKSlcclxuICAgICAgICB0aGlzLl9sb2FkaW5nRmluaXNoZWQoKVxyXG4gICAgICAgIGlmKHJlc3VsdC5lcnJvcil7XHJcbiAgICAgICAgICB0aGlzLmVycm9yKHJlc3VsdC5lcnJvcilcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhyZXN1bHQpXHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdzdWNjZXNzJykpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGF0YSgpe1xyXG4gICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YSh0aGlzKVxyXG4gICAgY29uc3Qgb2JqID0ge31cclxuICAgIEFycmF5LmZyb20oZGF0YS5lbnRyaWVzKCkpLmZvckVhY2goKFtrZXksIHZhbF0pID0+IG9ialtrZXldID0gdmFsKVxyXG5cclxuICAgIGxldCBleHRyYSA9IHRoaXMub3B0aW9ucy5leHRyYURhdGFcclxuICAgIGV4dHJhID0gdHlwZW9mIGV4dHJhID09PSAnZnVuY3Rpb24nID8gZXh0cmEoKSA6IGV4dHJhXHJcbiAgICBleHRyYSA9IGV4dHJhID8gZXh0cmEgOiB7fVxyXG5cclxuICAgIHJldHVybiB7IC4uLm9iaiwgLi4uZXh0cmEgfVxyXG4gIH1cclxuXHJcbiAgYWRkSW5wdXQob3B0aW9ucywgbGFiZWwgPSBudWxsKXtcclxuXHJcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcclxuICAgIGZvciAobGV0IGtleSBpbiBvcHRpb25zKXtcclxuICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKGtleSwgb3B0aW9uc1trZXldKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2FkZElucHV0KGlucHV0LCBsYWJlbClcclxuICB9XHJcblxyXG4gIF9hZGRJbnB1dChpbnB1dEVsLCBsYWJlbCA9IG51bGwpe1xyXG5cclxuICAgIGNvbnN0IGxhYmVsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpXHJcbiAgICBpZihsYWJlbCl7XHJcbiAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgICAgc3Bhbi50ZXh0Q29udGVudCA9IGxhYmVsXHJcbiAgICAgIGxhYmVsRWwuYXBwZW5kQ2hpbGQoc3BhbilcclxuICAgIH1cclxuXHJcbiAgICBsYWJlbEVsLmFwcGVuZENoaWxkKGlucHV0RWwpXHJcbiAgICB0aGlzLl9pbnB1dHMuYXBwZW5kQ2hpbGQobGFiZWxFbClcclxuICB9XHJcblxyXG4gIGFkZFNlbGVjdChvcHRpb25zKXtcclxuXHJcbiAgICBvcHRpb25zID0ge1xyXG4gICAgICBsYWJlbDogbnVsbCxcclxuICAgICAgbmFtZTogJycsXHJcbiAgICAgIG9wdGlvbnNMaXN0OiBbXSxcclxuICAgICAgLi4ub3B0aW9uc1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKVxyXG4gICAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnZmxleC1iZXR3ZWVuJylcclxuICAgIGlmKG9wdGlvbnMubGFiZWwpe1xyXG4gICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICAgIHNwYW4udGV4dENvbnRlbnQgPSBvcHRpb25zLmxhYmVsXHJcbiAgICAgIGxhYmVsLmFwcGVuZENoaWxkKHNwYW4pXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0JylcclxuICAgIHNlbGVjdC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBvcHRpb25zLm5hbWUpXHJcbiAgICBvcHRpb25zLm9wdGlvbnNMaXN0LmZvckVhY2goKHsgdmFsdWUsIG5hbWUgfSkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJylcclxuICAgICAgb3B0aW9ucy52YWx1ZSA9IHZhbHVlXHJcbiAgICAgIG9wdGlvbnMudGV4dENvbnRlbnQgPSBuYW1lXHJcbiAgICAgIHNlbGVjdC5hcHBlbmRDaGlsZChvcHRpb25zKVxyXG4gICAgfSlcclxuICAgIGxhYmVsLmFwcGVuZENoaWxkKHNlbGVjdClcclxuXHJcbiAgICB0aGlzLl9pbnB1dHMuYXBwZW5kQ2hpbGQobGFiZWwpXHJcbiAgICByZXR1cm4gc2VsZWN0XHJcbiAgfVxyXG5cclxuICBlcnJvcihtZXNzYWdlKXtcclxuICAgIGlmKG1lc3NhZ2U/Lm1lc3NhZ2Upe1xyXG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS5tZXNzYWdlXHJcbiAgICB9XHJcbiAgICB0aGlzLl9lcnJvck1lc3NhZ2UudGV4dENvbnRlbnQgPSBtZXNzYWdlXHJcbiAgICB0aGlzLl9lcnJvck1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcclxuICB9XHJcblxyXG4gIF9sb2FkaW5nKCl7XHJcbiAgICBpZih0aGlzLm9wdGlvbnMuZnVsbHNjcmVlbkxvYWRpbmcpe1xyXG4gICAgICByZXR1cm4gc2hvd0xvYWRlcih0aGlzLm9wdGlvbnMuZnVsbHNjcmVlbkxvYWRpbmcubWVzc2FnZSA/PyAnJylcclxuICAgIH1cclxuICAgIHRoaXMuX2Vycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxyXG4gICAgdGhpcy5zdWJtaXRCdXR0b24uZGlzYWJsZWQgPSB0cnVlXHJcbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCJzcGluLWVmZmVjdFwiPkRJPC9zcGFuPidcclxuICB9XHJcblxyXG4gIF9sb2FkaW5nRmluaXNoZWQoKXtcclxuICAgIGlmKHRoaXMub3B0aW9ucy5mdWxsc2NyZWVuTG9hZGluZyl7XHJcbiAgICAgIHJldHVybiBoaWRlTG9hZGVyKClcclxuICAgIH1cclxuICAgIHRoaXMuc3VibWl0QnV0dG9uLmRpc2FibGVkID0gZmFsc2VcclxuICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLnN1Ym1pdFRleHRcclxuICB9XHJcbn1cclxuXHJcbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnZGktZm9ybScsIERJRm9ybSwgeyBleHRlbmRzOiAnZm9ybScgfSkiLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbih1cmwsIGRhdGEgPSBudWxsKXtcclxuICBsZXQgcmVzcFxyXG4gIGxldCB0ZXh0XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG9iaiA9IHtcclxuICAgICAgbWV0aG9kOiAncG9zdCcsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZihkYXRhKXtcclxuICAgICAgb2JqLmJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgfVxyXG5cclxuICAgIHJlc3AgPSBhd2FpdCBmZXRjaCh1cmwsIG9iailcclxuICAgIHRleHQgPSBhd2FpdCByZXNwLnRleHQoKVxyXG4gICAgcmV0dXJuIHRleHQgPyBKU09OLnBhcnNlKHRleHQpIDoge31cclxuICB9Y2F0Y2goZXgpe1xyXG4gICAgaWYoIXJlc3AgfHwgcmVzcC5zdGF0dXMgPj0gNDAwKXtcclxuICAgICAgaWYodGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6IHRleHQgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7IGVycm9yOiBleCB8fCBgQW4gZXJyb3Igb2NjdXJyZWQgZHVyaW5nIGZpenpldGNoIG9mICR7dXJsfWAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHt9XHJcbiAgfVxyXG59IiwiY29uc3QgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keSA+ICNsb2FkZXInKVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVMb2FkZXIoKXtcclxuICBsb2FkZXIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG93TG9hZGVyKG1lc3NhZ2UgPSAnJyl7XHJcbiAgbG9hZGVyLnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlJykudGV4dENvbnRlbnQgPSBtZXNzYWdlXHJcbiAgbG9hZGVyLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgRElGb3JtIGZyb20gJy4uL2NvbXBvbmVudHMvZm9ybS5qcydcclxuXHJcbmNvbnN0IGRpZm9ybSA9IG5ldyBESUZvcm0oe1xyXG4gIHN1Ym1pdFRleHQ6ICdTYXZlJ1xyXG59KVxyXG5kaWZvcm0uYWRkSW5wdXQoe1xyXG4gIHR5cGU6ICd0ZXh0JyxcclxuICBuYW1lOiAnZGlzcGxheW5hbWUnLFxyXG4gIG1pbkxlbmd0aDogMixcclxuICBtYXhMZW5ndGg6IDE1LFxyXG4gIHJlcXVpcmVkOiAncmVxdWlyZWQnLFxyXG4gIHBsYWNlaG9sZGVyOiAnQ2hvb3NlIGEgdXNlcm5hbWUnXHJcbn0pXHJcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdXNlci1mb3JtJykuYXBwZW5kQ2hpbGQoZGlmb3JtKVxyXG5cclxuaWYod2luZG93LkVSUk9SKXtcclxuICBkaWZvcm0uZXJyb3Iod2luZG93LkVSUk9SKVxyXG59XHJcblxyXG4iXSwibmFtZXMiOlsiZml6emV0Y2giLCJoaWRlTG9hZGVyIiwic2hvd0xvYWRlciIsIkhUTUwiLCJodG1sIiwiRElGb3JtIiwiSFRNTEZvcm1FbGVtZW50IiwiX2lucHV0cyIsIl9lcnJvck1lc3NhZ2UiLCJzdWJtaXRCdXR0b24iLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJhc3luYyIsImFjdGlvbiIsInN1Ym1pdFRleHQiLCJzdWNjZXNzIiwiY3VzdG9tRmV0Y2giLCJmdWxsc2NyZWVuTG9hZGluZyIsImV4dHJhRGF0YSIsImNsYXNzTGlzdCIsImFkZCIsImlubmVySFRNTCIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsInNldEF0dHJpYnV0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJfbG9hZGluZyIsInJlc3VsdCIsIkZ1bmN0aW9uIiwiZGF0YSIsIl9sb2FkaW5nRmluaXNoZWQiLCJlcnJvciIsImRpc3BhdGNoRXZlbnQiLCJFdmVudCIsIkZvcm1EYXRhIiwib2JqIiwiQXJyYXkiLCJmcm9tIiwiZW50cmllcyIsImZvckVhY2giLCJrZXkiLCJ2YWwiLCJleHRyYSIsImFkZElucHV0IiwibGFiZWwiLCJpbnB1dCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIl9hZGRJbnB1dCIsImlucHV0RWwiLCJsYWJlbEVsIiwic3BhbiIsImFwcGVuZENoaWxkIiwiYWRkU2VsZWN0IiwibmFtZSIsIm9wdGlvbnNMaXN0Iiwic2VsZWN0IiwidmFsdWUiLCJtZXNzYWdlIiwicmVtb3ZlIiwiZGlzYWJsZWQiLCJjdXN0b21FbGVtZW50cyIsImRlZmluZSIsImV4dGVuZHMiLCJ1cmwiLCJyZXNwIiwidGV4dCIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImZldGNoIiwicGFyc2UiLCJleCIsInN0YXR1cyIsImxvYWRlciIsImRpZm9ybSIsInR5cGUiLCJtaW5MZW5ndGgiLCJtYXhMZW5ndGgiLCJyZXF1aXJlZCIsInBsYWNlaG9sZGVyIiwid2luZG93IiwiRVJST1IiXSwic291cmNlUm9vdCI6IiJ9