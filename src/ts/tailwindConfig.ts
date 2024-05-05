// tailwindcss的配置文件
let config: any = {};
typeof window.tailwind === "undefined"
  ? // 如果window.tailwind不存在，就将config赋值给window.tailwindconfig作为预处理
    (window.tailwindconfig = config)
  : // 如果window.tailwind存在，就直接修改它
    (window.tailwind.config = config);
