// tailwindcss的配置文件
let config: any = {
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1366px",
      "3xl": "1600px",
    },
  },
};
typeof window.tailwind === "undefined"
  ? // 如果window.tailwind不存在，就将config赋值给window.tailwindconfig作为预处理
    (window.tailwindconfig = config)
  : // 如果window.tailwind存在，就直接修改它
    (window.tailwind.config = config);
