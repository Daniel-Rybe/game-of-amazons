var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var MultiComponent=function(e){function t(e){_classCallCheck(this,t);var n=_possibleConstructorReturn(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={mode:"name-input",boardColor:"white"},n.elements={},mainComponent=n,n}return _inherits(t,React.Component),_createClass(t,[{key:"render",value:function(){switch(this.state.mode){case"users-list":return delete this.elements["game-board"],delete this.elements["name-input"],React.createElement(List,{width:this.props.listWidth,elemHeight:this.props.listElemHeight,elements:this.elements});case"game-board":return delete this.elements["users-list"],delete this.elements["name-input"],React.createElement(Board,{size:this.props.boardSize,myColor:this.state.boardColor,elements:this.elements});case"name-input":return delete this.elements["users-list"],delete this.elements["game-board"],React.createElement(NameInput,{elements:this.elements,width:"300"})}}}]),t}();