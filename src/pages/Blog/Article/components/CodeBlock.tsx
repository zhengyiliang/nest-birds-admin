import { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 设置高亮样式
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // 主题风格
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 代码高亮主题风格
// materialLight
const CodeBlock = (props: any) => {
  const { node, inline, className, children, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '') || '';
  return (
    <SyntaxHighlighter
      {...rest}
      showLineNumbers
      style={{
        ...github,
        ...materialLight,
        // 'code[class*="language-"]': {
        //   fontSize: 14,
        // },
      }}
      language={match[1] || ''}
      PreTag="div"
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};
export default memo(CodeBlock);
