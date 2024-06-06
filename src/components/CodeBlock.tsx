import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

type CodeBlockProps = {
    value:string;
}

const CodeBlock = ({value}:CodeBlockProps) =>{
    return(
        <SyntaxHighlighter style={okaidia}>
            {value}
        </SyntaxHighlighter>
    )
}

export default CodeBlock