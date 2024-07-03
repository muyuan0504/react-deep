hash 路由的跳转方式

1. 使用 Link 组件

2. 使用 useNavigate 钩子

3. 使用 NavLink 组件

4. 直接在 JavaScript 代码中设置 window.location.hash

-   在使用 HashRouter 时，推荐使用 Link 组件和 useNavigate 钩子来进行页面跳转，因为它们更符合 React 的编程范式，并且不会导致页面刷新。

-   NavLink 组件可以用于需要添加活动链接样式的导航。虽然直接修改 window.location.hash 也能实现跳转，但不推荐这种方式
